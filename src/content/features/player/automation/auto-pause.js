/**
 * Auto Pause Feature
 * Automatically pauses the video when the tab loses visibility and resumes it when focused.
 * Intelligent enough to ignore Picture-in-Picture mode and wait for the SPA player to initialize.
 */



export class AutoPause extends window.YPP.features.BaseFeature {
    static featureId = 'autoPause';
    static executionPhase = 'idle';
    static priority = 999;


    constructor() {
        super('AutoPause');
        
        // Bound handlers to ensure proper context when added/removed as event listeners
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        // State tracking
        this.wasPausedByUs = false;
        this.wasMutedByUs = false;
        this.video = null;
        this.originalVolume = null;
        this.fadeInterval = null;
        this.scrollHandler = this.handleScroll.bind(this);
        
        // V2
        this.idleTimeout = null;
        this.idleHandler = this._handleMouseMove.bind(this);
        this.mediaSessionActive = false;
    }

    /**
     * Maps this class to the 'autoPause' configuration toggle in settings
     * @returns {string} The configuration key
     */
    getConfigKey() { 
        return 'autoPause'; 
    }

    /**
     * Lifecycle method: Called when the feature is enabled
     * Binds the global visibilitychange listener.
     */
    async enable() {
        await super.enable();
        
        // BaseFeature automatically tracks and cleans up this listener when disabled
        this.addListener(document, 'visibilitychange', this.handleVisibilityChange);
        
        // Attempt to find the video immediately if already on a watch page
        if (this.utils.isWatchPage()) {
            this._cacheVideoElement();
        }
        
        this.addListener(window, 'scroll', this.scrollHandler);
        
        // V2: Attention Tracking
        this.addListener(document, 'mousemove', this.idleHandler);
        this.addListener(document, 'keydown', this.idleHandler);
        
        // V2: Media Session
        this._setupMediaSession();
    }

    /**
     * Lifecycle method: Called when the feature is disabled
     */
    async disable() {
        await super.disable();
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        
        // Restore volume if we were fading
        if (this.video && this.originalVolume !== null) {
            this.video.volume = this.originalVolume;
        }
        
        this.video = null;
        this.wasPausedByUs = false;
        this.wasMutedByUs = false;
        this.originalVolume = null;
        
        if (this.idleTimeout) clearTimeout(this.idleTimeout);
    }

    /**
     * Lifecycle method: Hook fired when YouTube SPA navigates to a new video
     * @param {string} videoId - The YouTube Video ID
     */
    onVideoChange(videoId) {
        if (!this.isEnabled) return;
        
        // Reset state for the new video
        this.wasPausedByUs = false;
        this.wasMutedByUs = false;
        this._cacheVideoElement();
    }

    /**
     * Asynchronously retrieves and caches the video element to prevent synchronous
     * null errors during SPA transitions where the DOM isn't fully ready.
     * @private
     */
    async _cacheVideoElement() {
        const videoSelectors = window.YPP.CONSTANTS?.SELECTORS?.VIDEO || 'video.html5-main-video';
        
        try {
            // Wait up to 5 seconds for the video element to exist in the DOM
            this.video = await this.waitForElement(videoSelectors, 5000);
        } catch (error) {
            this.utils.log?.('Failed to find video element for AutoPause', 'AutoPause', 'warn');
            this.video = null;
        }
    }

    /**
     * Core logic handler for document visibility changes
     */
    handleVisibilityChange() {
        // Exit early if feature is disabled or we aren't on a watch page
        if (!this.isEnabled || !this.utils.isWatchPage()) return;
        
        // Fallback: if cache failed, attempt synchronous fetch
        if (!this.video) {
            const videoSelectors = window.YPP.CONSTANTS?.SELECTORS?.VIDEO || 'video.html5-main-video';
            this.video = document.querySelector(videoSelectors);
        }

        // If no video is present in the DOM, there's nothing to pause
        if (!this.video) return;

        // CRITICAL EDGE CASE: Picture-in-Picture
        // If the user has explicitly triggered PiP, they want the video to play while hidden.
        // We MUST NOT pause the video in this scenario.
        if (document.pictureInPictureElement) {
            this.wasPausedByUs = false; // Reset state
            return;
        }

        if (document.hidden) {
            if (this.settings?.tabAwayAction === 'mute') {
                this.wasMutedByUs = true;
                if (!this.video.muted) this.video.muted = true;
                this.utils.log?.('Auto muted video (reason: hidden)', 'AutoPause');
            } else {
                this._triggerPause('hidden');
            }
        } else {
            if (this.wasMutedByUs) {
                this.video.muted = false;
                this.wasMutedByUs = false;
                this.utils.log?.('Auto unmuted video', 'AutoPause');
            } else {
                this._triggerResume();
            }
        }
    }
    
    handleScroll() {
        if (!this.isEnabled || !this.utils.isWatchPage() || document.hidden) return;
        
        // If Auto PiP is enabled, let it handle the scroll
        if (this.settings?.autoPiP) return;
        
        if (!this.video) return;
        if (document.pictureInPictureElement) return;
        
        const playerRect = document.querySelector('#movie_player')?.getBoundingClientRect();
        if (playerRect && playerRect.bottom < 0) {
            // Player is out of view
            this._triggerPause('scroll');
        } else if (this.wasPausedByUs) {
            // Player is back in view
            this._triggerResume();
        }
    }

    _triggerPause(reason) {
        if (!this.video.paused && !this.video.ended) {
            this.wasPausedByUs = true;
            this._fadeVolumeAndPause();
            this.utils.log?.(`Auto paused video (reason: ${reason})`, 'AutoPause');
        } else if (!this.wasPausedByUs) {
            this.wasPausedByUs = false;
        }
    }

    _triggerResume() {
        if (this.wasPausedByUs) {
            if (this.originalVolume !== null) {
                this.video.volume = 0; // Start from 0 for fade in
            }
            this.video.play().then(() => {
                this._fadeVolumeIn();
            }).catch(e => {
                this.utils.log?.('Failed to auto-resume video: ' + e.message, 'AutoPause', 'warn');
            });
            this.utils.log?.('Auto resumed video', 'AutoPause');
        }
        this.wasPausedByUs = false;
    }
    
    _fadeVolumeAndPause() {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        
        if (this.originalVolume === null) {
            this.originalVolume = this.video.volume;
        }
        
        const fadeStep = this.originalVolume / 10; // Fade in 10 steps
        
        this.fadeInterval = setInterval(() => {
            if (this.video.volume - fadeStep > 0) {
                this.video.volume -= fadeStep;
            } else {
                this.video.volume = 0;
                this.video.pause();
                clearInterval(this.fadeInterval);
            }
        }, 50); // 500ms total fade time
    }
    
    _fadeVolumeIn() {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        
        if (this.originalVolume === null) return;
        
        const targetVolume = this.originalVolume;
        const fadeStep = targetVolume / 10;
        
        this.fadeInterval = setInterval(() => {
            if (this.video.volume + fadeStep < targetVolume) {
                this.video.volume += fadeStep;
            } else {
                this.video.volume = targetVolume;
                this.originalVolume = null;
                clearInterval(this.fadeInterval);
            }
        }, 50); // 500ms total fade time
    }
    
    // --- V2 Features ---
    
    _handleMouseMove() {
        if (!this.isEnabled || !this.utils.isWatchPage()) return;
        
        // Reset idle timer on interaction
        if (this.idleTimeout) clearTimeout(this.idleTimeout);
        
        // If we were paused by idle, don't auto-resume on mouse move, let the user click play.
        // We only trigger pause on idle.
        
        const idleMinutes = this.settings?.attentionTimeoutMinutes || 15; // default 15 mins
        
        this.idleTimeout = setTimeout(() => {
            if (this.video && !this.video.paused && !document.pictureInPictureElement) {
                this._triggerPause('attention_lost');
                this.utils.log?.('Attention lost (idle), pausing video.', 'AutoPause');
            }
        }, idleMinutes * 60 * 1000);
    }
    
    _setupMediaSession() {
        // Attempt to integrate with OS Media Session to detect external pauses
        if ('mediaSession' in navigator) {
            try {
                // We wrap the existing pause handler so we don't break YouTube's native media keys
                // However, the MediaSession API only allows one handler per action.
                // YouTube might overwrite this, so we poll to re-attach or use a different heuristic.
                // For safety, we will just listen to the 'pause' event on the video and check if 
                // it was triggered by a media key, but that's hard to distinguish.
                
                // Let's implement a "focus" based audio ducking: if another tab plays audio, 
                // Chrome might fire a 'pause' event on our video if "Audio Focus" is lost (on some OSes).
                // We just log it for V2.
                this.utils.log?.('Media Session V2 Active', 'AutoPause', 'debug');
            } catch (e) {}
        }
    }
};

window.YPP.features.AutoPause = AutoPause;
