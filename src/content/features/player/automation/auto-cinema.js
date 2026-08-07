/**
 * Auto Cinema — Spiral Tube
 * Automatically clicks the theater button whenever a watch page loads
 * to ensure the video expands.
 */



export class AutoCinema extends window.YPP.features.BaseFeature {
    static featureId = 'autoCinema';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'autoCinema'; }

    constructor() {
        super('AutoCinema');
        this._navHandler = this._onNavigation.bind(this);
        this._resizeHandler = this._onResize.bind(this);
        this._mouseMoveHandler = this._onMouseMove.bind(this);
        this._resizeTimeout = null;
        this._mouseTimeout = null;
        this._distractionStyle = null;
        this._ambilightCanvas = null;
        this._ambilightCtx = null;
        this._ambilightReq = null;
        this._drawAmbilight = this._drawAmbilight.bind(this);
    }

    async enable() {
        await super.enable();
        this._userOverridden = false;
        
        // Listen to manual button clicks to respect user override
        // Use raw addEventListener (not this.addListener) because capture-phase listeners
        // on document need special handling and this is cleaned up explicitly in disable().
        this._buttonClickListener = (e) => {
            const btn = e.target.closest('.ytp-size-button');
            if (btn && e.isTrusted) {
                this._userOverridden = true;
            }
        };
        document.addEventListener('click', this._buttonClickListener, true);

        // Run immediately if we're on a watch page
        if (location.pathname === '/watch') {
            this._clickTheaterButton();
            this._setupDistractionFree();
            this._initAmbilight();
            this._applyContentAwareLayout();
        }
        // And on every subsequent navigation
        this.addListener(window, 'yt-navigate-finish', this._navHandler);
        // And window resizes (YouTube sometimes breaks theater on resize)
        this.addListener(window, 'resize', this._resizeHandler);
        // For distraction-free mode
        this.addListener(document, 'mousemove', this._mouseMoveHandler);
        
        this.utils?.log?.('Auto Cinema enabled', 'AUTO_CINEMA');
    }

    async disable() {
        // Clean up the capture-phase listener explicitly (not tracked by addListener)
        if (this._buttonClickListener) {
            document.removeEventListener('click', this._buttonClickListener, true);
            this._buttonClickListener = null;
        }
        if (this._resizeTimeout) { clearTimeout(this._resizeTimeout); this._resizeTimeout = null; }
        if (this._clickTimeout) { clearTimeout(this._clickTimeout); this._clickTimeout = null; }
        if (this._mouseTimeout) { clearTimeout(this._mouseTimeout); this._mouseTimeout = null; }
        this._stopAmbilight();
        
        if (this._distractionStyle) {
            this._distractionStyle.remove();
            this._distractionStyle = null;
        }
        
        document.body.classList.remove('ypp-audio-focus');
        document.body.classList.remove('ypp-idle');
        
        // super.disable() calls cleanupEvents() which removes all this.addListener() registrations
        await super.disable();
        this.utils?.log?.('Auto Cinema disabled', 'AUTO_CINEMA');
    }

    _onNavigation() {
        this._userOverridden = false; // Reset override on new video loads
        if (location.pathname === '/watch') {
            this._clickTheaterButton();
            this._setupDistractionFree();
            this._initAmbilight();
            this._applyContentAwareLayout();
        } else {
            if (this._distractionStyle) this._distractionStyle.disabled = true;
            this._stopAmbilight();
        }
    }

    onUpdate(settings, oldSettings) {
        if (settings.ambilight !== oldSettings?.ambilight) {
            if (settings.ambilight === false) {
                this._stopAmbilight();
            } else {
                this._initAmbilight();
            }
        }
        if (settings.dynamicHDR !== oldSettings?.dynamicHDR) {
            if (settings.dynamicHDR === false) {
                const video = document.querySelector('video.html5-main-video');
                if (video) video.style.filter = '';
            }
        }
    }

    _onResize() {
        if (location.pathname !== '/watch') return;
        
        // Debounce resize
        if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(() => {
            this._clickTheaterButton();
        }, 500);
    }

    async _clickTheaterButton() {
        if (this._userOverridden) return;
        if (this.settings?.zenMode) return; // Prevent conflict with Zen Mode
        
        try {
            const btn = await this.utils?.pollFor?.(
                () => document.querySelector('.ytp-size-button'),
                6000, 400
            );
            if (!btn) return;
            
            // Smart Trigger: Only expand if video is 16:9 or wider (ignore vertical/4:3)
            const video = document.querySelector('video.html5-main-video');
            if (video && video.videoWidth && video.videoHeight) {
                const ratio = video.videoWidth / video.videoHeight;
                if (ratio < 1.7) {
                    this.utils?.log?.('Skipping Auto Cinema for non-widescreen video', 'AUTO_CINEMA', 'debug');
                    return;
                }
            }
            
            // Debounce the click to prevent UI flickering
            if (this._clickTimeout) clearTimeout(this._clickTimeout);
            this._clickTimeout = setTimeout(() => {
                const flexy = document.querySelector('ytd-watch-flexy');
                // Check if theater mode is already active
                const isTheater = flexy && flexy.hasAttribute('theater');
                if (!isTheater && !this._userOverridden) {
                    btn.click();
                }
            }, 300); // Wait 300ms for YouTube's own layout calculation to settle
        } catch (_) { /* silent fail */ }
    }

    _setupDistractionFree() {
        if (!this._distractionStyle) {
            this._distractionStyle = document.createElement('style');
            this._distractionStyle.id = 'ypp-distraction-free';
            this._distractionStyle.textContent = `
                ytd-watch-flexy[theater] #secondary,
                ytd-watch-flexy[theater] #comments,
                ytd-watch-flexy[theater] #related {
                    transition: opacity 0.8s ease-in-out;
                }
                body.ypp-idle ytd-watch-flexy[theater] #secondary,
                body.ypp-idle ytd-watch-flexy[theater] #comments,
                body.ypp-idle ytd-watch-flexy[theater] #related {
                    opacity: 0.1 !important;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(this._distractionStyle);
        }
        this._distractionStyle.disabled = false;
    }

    _onMouseMove() {
        if (location.pathname !== '/watch') return;
        
        document.body.classList.remove('ypp-idle');
        
        if (this._mouseTimeout) clearTimeout(this._mouseTimeout);
        this._mouseTimeout = setTimeout(() => {
            const flexy = document.querySelector('ytd-watch-flexy');
            const isTheater = flexy && flexy.hasAttribute('theater');
            if (isTheater && !document.querySelector('video')?.paused) {
                document.body.classList.add('ypp-idle');
            }
        }, 3000);
    }
    
    // --- V2 Features ---
    
    _initAmbilight() {
        if (this.settings?.ambilight === false) return; // Opt-out
        
        this._stopAmbilight();
        const player = document.getElementById('ytd-player');
        const video = document.querySelector('video.html5-main-video');
        if (!player || !video) return;
        
        if (!this._ambilightCanvas) {
            this._ambilightCanvas = document.createElement('canvas');
            this._ambilightCanvas.id = 'ypp-ambilight';
            this._ambilightCanvas.style.cssText = `
                position: absolute;
                top: -5%; left: -5%;
                width: 110%; height: 110%;
                z-index: -1;
                filter: blur(60px) saturate(200%) opacity(0.8);
                pointer-events: none;
                transition: opacity 0.5s ease;
            `;
            player.style.position = 'relative'; // Ensure stacking context
            player.insertBefore(this._ambilightCanvas, player.firstChild);
            this._ambilightCtx = this._ambilightCanvas.getContext('2d', { alpha: false });
        }
        
        this._ambilightCanvas.style.opacity = '1';
        this._drawAmbilight(video);
    }
    
    _drawAmbilight(video) {
        if (!this._ambilightCanvas || !this._ambilightCtx) return;
        
        if (!video.paused && !video.ended) {
            try {
                this._ambilightCanvas.width = 128;
                this._ambilightCanvas.height = 72;
                this._ambilightCtx.drawImage(video, 0, 0, 128, 72);
                
                // V4: Dynamic HDR Simulation
                if (this.settings?.dynamicHDR !== false) {
                    const imageData = this._ambilightCtx.getImageData(0, 0, 128, 72);
                    const data = imageData.data;
                    let r = 0, g = 0, b = 0;
                    // Subsample for performance (every 4th pixel)
                    for (let i = 0; i < data.length; i += 16) {
                        r += data[i];
                        g += data[i+1];
                        b += data[i+2];
                    }
                    const pixelCount = data.length / 16;
                    const avgBrightness = (0.299 * (r / pixelCount) + 0.587 * (g / pixelCount) + 0.114 * (b / pixelCount));
                    
                    // Apply dynamic HDR filters
                    let filterStr = 'none';
                    if (avgBrightness < 60) {
                        filterStr = 'contrast(1.2) brightness(1.15) saturate(1.2)';
                    } else if (avgBrightness > 180) {
                        filterStr = 'contrast(1.05) saturate(1.15)';
                    } else {
                        filterStr = 'contrast(1.05) saturate(1.05)';
                    }
                    
                    if (video.style.filter !== filterStr) {
                        video.style.transition = 'filter 0.8s ease';
                        video.style.filter = filterStr;
                    }
                }
            } catch(e) {
                // Canvas tainting could occur on external videos, ignore
            }
        }
        
        // Loop at ~15fps to save CPU (66ms)
        this._ambilightReq = setTimeout(() => {
            requestAnimationFrame(() => this._drawAmbilight(video));
        }, 66);
    }
    
    _stopAmbilight() {
        if (this._ambilightReq) {
            clearTimeout(this._ambilightReq);
            this._ambilightReq = null;
        }
        if (this._ambilightCanvas) {
            this._ambilightCanvas.style.opacity = '0';
        }
        
        // V4: Reset HDR
        const video = document.querySelector('video.html5-main-video');
        if (video) video.style.filter = '';
    }
    
    _applyContentAwareLayout() {
        // Detect Podcast or Music
        setTimeout(() => {
            let isMusic = false;
            let isPodcast = false;
            
            // Look for YouTube Music badge or specific meta tags
            const isMusicApp = document.querySelector('ytd-badge-supported-renderer [aria-label*="Music" i]');
            const category = document.querySelector('ytd-metadata-row-renderer #content')?.textContent?.trim()?.toLowerCase() || '';
            
            if (isMusicApp || category.includes('music')) isMusic = true;
            if (category.includes('podcast')) isPodcast = true;
            
            if (isMusic || isPodcast) {
                document.body.classList.add('ypp-audio-focus');
                this.utils?.log?.('Content-Aware Layout applied (Audio Focus)', 'AUTO_CINEMA', 'info');
                
                // Add specific styles if not present
                if (!document.getElementById('ypp-content-aware-style')) {
                    const style = document.createElement('style');
                    style.id = 'ypp-content-aware-style';
                    style.textContent = `
                        body.ypp-audio-focus ytd-watch-flexy[theater] #player-container-outer {
                            max-height: 50vh !important; /* Smaller video footprint for audio */
                        }
                    `;
                    document.head.appendChild(style);
                }
            } else {
                document.body.classList.remove('ypp-audio-focus');
            }
        }, 2000); // Wait for metadata to load
    }
};

window.YPP.features.AutoCinema = AutoCinema;
