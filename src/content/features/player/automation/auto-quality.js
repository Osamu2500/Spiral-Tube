/**
 * Auto Quality feature
 * Automatically forces high playback quality and prevents YouTube from dynamically downgrading.
 */

export class AutoQuality extends window.YPP.features.BaseFeature {
    static featureId = 'autoQuality';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('AutoQuality');
        this.enforcerInterval = null;
        this._isBackground = false;
        this._isPaused = false;
        this._bufferStallCount = 0;
        this._lastStallTime = 0;
        this._battery = null;
    }

    getConfigKey() { return 'autoQuality'; }

    async enable() {
        await super.enable();
        try {
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    this._battery = battery;
                    this._batteryListener = () => {
                        this.utils?.log(`Battery state changed (charging: ${battery.charging})`, this.name);
                        const player = document.getElementById('movie_player');
                        if (player) this.applyAutoQuality(player);
                    };
                    battery.addEventListener('chargingchange', this._batteryListener);
                }).catch(() => {});
            }
            
            this.forceInitialQuality();
            this.startEnforcer();
        } catch (e) {
            this.utils?.log('Error enabling AutoQuality', 'QUALITY', 'error', e);
        }
    }

    onUpdate() {
        this.forceInitialQuality();
        this.startEnforcer();
    }

    async disable() {
        this.stopEnforcer();
        if (this._battery && this._batteryListener) {
            this._battery.removeEventListener('chargingchange', this._batteryListener);
            this._batteryListener = null;
        }
        await super.disable();
    }

    onPageChange() {
        this.forceInitialQuality();
    }

    forceInitialQuality() {
        if (!this.settings?.autoQuality || this.settings.autoQuality === 'off') return;

        try {
            const qualityPayload = JSON.stringify({
                data: this.settings.autoQuality, 
                expiration: Date.now() + 31536000000, 
                creation: Date.now()
            });
            window.localStorage.setItem('yt-player-quality', qualityPayload);
            this.utils?.log(`Injected yt-player-quality (${this.settings.autoQuality}) into localStorage`, this.name, 'debug');
        } catch (e) {
            this.utils?.log('Failed to write localStorage', this.name, 'warn', e);
        }

        const player = document.getElementById('movie_player');
        if (player && typeof player.getAvailableQualityLevels === 'function') {
            const available = player.getAvailableQualityLevels();
            if (available && available.length > 0 && available[0] !== 'auto') {
                this.applyAutoQuality(player);
            }
        }
    }

    startEnforcer() {
        if (this._enforcerBound) return;
        this._enforcerBound = (e) => {
            if (!this.settings?.autoQuality || this.settings.autoQuality === 'off') return;
            
            // Background Saver
            if (e && e.type === 'visibilitychange') {
                this._isBackground = document.hidden;
            }
            
            // Pre-buffering & V3 reset
            if (e && (e.type === 'pause' || e.type === 'play')) {
                this._isPaused = (e.type === 'pause');
                if (this._isPaused) this._bufferStallCount = 0; // V3 Fix: reset on manual pause
            }
            
            // V2: Predictive Buffering
            if (e && e.type === 'waiting') {
                const now = Date.now();
                if (now - this._lastStallTime < 10000) { // Multiple stalls in 10s
                    this._bufferStallCount++;
                } else {
                    this._bufferStallCount = 1;
                }
                this._lastStallTime = now;
            }
            if (e && e.type === 'playing') {
                // Decay stall count over time if playing smoothly
                setTimeout(() => { if (!this._isPaused) this._bufferStallCount = Math.max(0, this._bufferStallCount - 1); }, 15000);
            }
            
            if (e && e.type === 'loadstart') {
                if (e.target.tagName !== 'VIDEO') return;
                this._bufferStallCount = 0; // V3 Fix: reset on new video load
            }

            const player = document.getElementById('movie_player');
            if (player && typeof player.getPlaybackQuality === 'function') {
                this.applyAutoQuality(player);
            }
        };
        
        this.addListener(document, 'yt-navigate-finish', this._enforcerBound);
        this.addListener(document, 'yt-player-updated', this._enforcerBound);
        this.addListener(document, 'visibilitychange', this._enforcerBound);
        
        this.addListener(window, 'loadstart', this._enforcerBound, true);
        this.addListener(window, 'pause', this._enforcerBound, true);
        this.addListener(window, 'play', this._enforcerBound, true);
        this.addListener(window, 'waiting', this._enforcerBound, true); // V2
        this.addListener(window, 'playing', this._enforcerBound, true); // V2
        
        if (navigator.connection) {
            this.addListener(navigator.connection, 'change', this._enforcerBound);
        }
    }

    stopEnforcer() {
        this._enforcerBound = null;
    }

    applyAutoQuality(player) {
        if (typeof player.getAvailableQualityLevels !== 'function') return;

        if (window.location.pathname.startsWith('/shorts/')) return;
        try {
            if (player.getVideoData && player.getVideoData().isLive) return;
        } catch (e) {}

        const available = player.getAvailableQualityLevels();
        if (!available || available.length === 0) return;
        
        const hierarchy = ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
        
        let targetQuality = this.settings.autoQuality;
        
        // Background Saver: Drop to lowest quality if tab is hidden to save bandwidth
        if (this._isBackground && this.settings?.backgroundSaver !== false) {
            targetQuality = 'tiny';
            this.utils?.log('Background Saver active, downgrading to 144p', this.name, 'debug');
        } 
        // Pre-buffering: Spike quality when paused to pre-load high-res segments
        else if (this._isPaused && this.settings?.preBuffering !== false && targetQuality !== 'highres') {
            targetQuality = 'highres'; // Will fallback to best available automatically below
            this.utils?.log('Pre-buffering active, spiking quality target', this.name, 'debug');
        }
        // V2: Predictive Buffering (downgrade if stalling)
        else if (this._bufferStallCount >= 2) {
            targetQuality = 'hd720'; // Drop to 720p to recover buffer
            this.utils?.log('Predictive buffering: multiple stalls detected, downgrading to 720p', this.name, 'warn');
        }
        // V4: Battery-Aware Scaling
        else if (this._battery && !this._battery.charging) {
            if (['highres', 'hd2160', 'hd1440'].includes(targetQuality)) {
                targetQuality = 'hd1080';
                this.utils?.log('Battery-Aware Scaling: Capping quality to 1080p to save power', this.name, 'info');
            }
        }
        else if (navigator.connection && navigator.connection.downlink) {
            const downlink = navigator.connection.downlink; // in Mbps
            if (downlink < 1.5 && ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720'].includes(targetQuality)) {
                targetQuality = 'large';
                this.utils?.log('Connection is slow (<1.5Mbps), downgrading to 480p', this.name, 'debug');
            } else if (downlink < 3.0 && ['highres', 'hd2160', 'hd1440', 'hd1080'].includes(targetQuality)) {
                targetQuality = 'hd720';
                this.utils?.log('Connection is slow (<3.0Mbps), downgrading to 720p', this.name, 'debug');
            }
        }
        
        // V2: Category-Based Quality Override
        targetQuality = this._getCategoryQualityOverride(targetQuality);

        let targetIndex = hierarchy.indexOf(targetQuality);
        if (targetIndex === -1) targetIndex = 0;
        
        const preferred = hierarchy.slice(targetIndex);
        const best = preferred.find(q => available.includes(q));
        
        if (best) {
            if (typeof player.setPlaybackQualityRange === 'function') {
                player.setPlaybackQualityRange(best, best);
            }
            if (typeof player.setPlaybackQuality === 'function') {
                player.setPlaybackQuality(best);
            }
        }
    }
    
    // --- V2 Features ---
    
    _getCategoryQualityOverride(currentQuality) {
        if (this._isBackground || this._bufferStallCount >= 2) return currentQuality; // Don't override if saving bandwidth
        
        const categoryEl = document.querySelector('ytd-metadata-row-renderer #content');
        const titleEl = document.querySelector('h1.ytd-watch-metadata');
        
        const text = ((categoryEl?.textContent || '') + ' ' + (titleEl?.textContent || '')).toLowerCase();
        
        // Visual content: Force 4K if available
        if (text.includes('gaming') || text.includes('nature') || text.includes('4k') || text.includes('cinematic')) {
            this.utils?.log('Category: Visual -> Forcing 4K/highres', this.name, 'info');
            return 'highres'; // Will fallback to best available automatically
        }
        
        // Talking heads: Limit to 1080p
        if (text.includes('podcast') || text.includes('news') || text.includes('interview')) {
            // Only downgrade if currently requesting > 1080p
            if (['highres', 'hd2160', 'hd1440'].includes(currentQuality)) {
                this.utils?.log('Category: Talking Head -> Limiting to 1080p', this.name, 'info');
                return 'hd1080';
            }
        }
        
        return currentQuality;
    }
};

window.YPP.features.AutoQuality = AutoQuality;
