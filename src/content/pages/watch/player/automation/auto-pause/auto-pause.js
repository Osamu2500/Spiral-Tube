import '../../../../../core/system/base-feature.js';
/**
 * @fileoverview
 * Auto Pause Feature
 * 
 * Target: /watch route.
 * Purpose: Automatically pauses the video when the tab loses visibility and resumes it when focused.
 * Intelligent enough to ignore Picture-in-Picture mode and wait for the SPA player to initialize.
 */
export class AutoPause extends window.YPP.features.BaseFeature {
    static featureId = 'autoPause';
    static executionPhase = 'idle';
    static priority = 999;


    constructor() {
        super('AutoPause');
        
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        this.wasPausedByUs = false;
        this.wasMutedByUs = false;
        this.video = null;
        this.originalVolume = null;
        this.fadeInterval = null;
        
        this.idleTimeout = null;
        this.idleHandler = this._handleMouseMove.bind(this);
        this.mediaSessionActive = false;
        this._observerReady = false;
        this._resumeDelayTimer = null;      // PAUSE-UP-1: smart re-engage delay
        this._originalPlaybackRate = null;  // PAUSE-UP-2: slow-down mode
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
            await this._cacheVideoElement();
            this.handleVisibilityChange(); // INSTANT APPLY
        }
        
        // V4 Optimization: Use IntersectionObserver instead of scroll listener
        if (this.utils.isWatchPage()) {
            this._setupIntersectionObserver();
        }
        
        // V2: Attention Tracking
        this.addListener(document, 'mousemove', this.idleHandler);
        this.addListener(document, 'keydown', this.idleHandler);
    }

    /**
     * Lifecycle method: Called when the feature is disabled
     */
    async disable() {
        await super.disable();
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        if (this._resumeDelayTimer) { clearTimeout(this._resumeDelayTimer); this._resumeDelayTimer = null; }
        this._teardownIntersectionObserver();
        
        if (this.video && this.originalVolume !== null) {
            this.video.volume = this.originalVolume;
        }
        if (this.video && this.wasMutedByUs) {
            this.video.muted = false;
        }
        // PAUSE-UP-2: Restore playback rate if slow-down mode was active
        if (this.video && this._originalPlaybackRate !== null) {
            this.video.playbackRate = this._originalPlaybackRate;
            this._originalPlaybackRate = null;
        }
        if (this.video && this.wasPausedByUs && this.video.paused) {
            this.video.play().catch(()=>{});
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
    // PAUSE-BUG-3: Made async to properly await video element before setting up observer
    // PAUSE-BUG-4: Clear idle timeout to prevent stale pause across video changes
    async onVideoChange(videoId) {
        if (!this.isEnabled) return;
        
        // PAUSE-BUG-4: Clear idle timer from previous video
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
        
        // Reset state for the new video
        this.wasPausedByUs = false;
        this.wasMutedByUs = false;
        // PAUSE-BUG-3: Await so video is cached before observer fires
        await this._cacheVideoElement();
        this._setupIntersectionObserver();
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
        if (!this.isEnabled || !this.utils.isWatchPage()) return;
        
        if (!this.video) {
            const videoSelectors = window.YPP.CONSTANTS?.SELECTORS?.VIDEO || 'video.html5-main-video';
            this.video = document.querySelector(videoSelectors);
        }
        if (!this.video) return;

        if (document.pictureInPictureElement) {
            this.wasPausedByUs = false;
            return;
        }

        if (document.hidden) {
            // Cancel any pending resume when tab hides again
            if (this._resumeDelayTimer) { clearTimeout(this._resumeDelayTimer); this._resumeDelayTimer = null; }

            if (this.settings?.tabAwayAction === 'mute') {
                this.wasMutedByUs = true;
                if (!this.video.muted) this.video.muted = true;
                this.utils.log?.('Auto muted video (reason: hidden)', 'AutoPause');
            } else if (this.settings?.tabAwayAction === 'slowdown') {
                // PAUSE-UP-2: Slow down instead of pausing
                if (this._originalPlaybackRate === null) {
                    this._originalPlaybackRate = this.video.playbackRate;
                }
                this.video.playbackRate = 0.25;
                this.wasPausedByUs = true;
                this.utils.log?.('Auto slowed video (reason: hidden)', 'AutoPause');
            } else {
                this._triggerPause('hidden');
            }
        } else {
            if (this.wasMutedByUs) {
                this.video.muted = false;
                this.wasMutedByUs = false;
                this.utils.log?.('Auto unmuted video', 'AutoPause');
            } else if (this._originalPlaybackRate !== null) {
                // PAUSE-UP-2: Restore playback speed
                this.video.playbackRate = this._originalPlaybackRate;
                this._originalPlaybackRate = null;
                this.wasPausedByUs = false;
                this.utils.log?.('Restored playback speed', 'AutoPause');
            } else {
                this._triggerResume();
            }
        }
    }
    
    _setupIntersectionObserver() {
        this._teardownIntersectionObserver();
        // PAUSE-BUG-2: Reset the ready flag each time we set up the observer
        this._observerReady = false;
        this._observer = new IntersectionObserver((entries) => {
            // PAUSE-BUG-2: Ignore the initial synchronous fire that happens on observe()
            if (!this._observerReady) return;
            entries.forEach(entry => {
                if (document.hidden || !this.isEnabled || !this.utils.isWatchPage()) return;
                if (this.settings?.autoPiP) return;
                if (!this.video || document.pictureInPictureElement) return;

                // Only pause if the top of the player has scrolled past the top of the viewport
                if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
                    this._triggerPause('scroll');
                } else if (entry.isIntersecting && this.wasPausedByUs) {
                    this._triggerResume();
                }
            });
        }, { threshold: 0.1 });
        
        const player = document.getElementById('movie_player');
        if (player) {
            this._observer.observe(player);
        } else {
            this.utils.pollFor(() => document.getElementById('movie_player'), 5000, 500)
                .then(p => { if (p && this._observer) this._observer.observe(p); })
                .catch(() => {});
        }
        // PAUSE-BUG-2: Allow a short delay before the observer can trigger actions
        setTimeout(() => { this._observerReady = true; }, 250);
    }
    
    _teardownIntersectionObserver() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
    }

    _triggerPause(reason) {
        if (!this.video.paused && !this.video.ended) {
            this.wasPausedByUs = true;
            this._fadeVolumeAndPause();
            // PAUSE-UP-3: Toast notification
            this.utils.createToast?.('⏸ Auto-paused', 'info', 2000);
            this.utils.log?.(`Auto paused video (reason: ${reason})`, 'AutoPause');
        } else if (!this.wasPausedByUs) {
            this.wasPausedByUs = false;
        }
    }

    _triggerResume() {
        if (!this.wasPausedByUs) return;
        // PAUSE-UP-1: Apply smart re-engage delay before resuming
        const delayMs = (this.settings?.resumeDelaySeconds ?? 0) * 1000;
        if (delayMs > 0) {
            this._resumeDelayTimer = setTimeout(() => {
                this._resumeDelayTimer = null;
                if (this.wasPausedByUs) this._doResume();
            }, delayMs);
        } else {
            this._doResume();
        }
    }

    _doResume() {
        if (this.originalVolume !== null) {
            this.video.volume = 0;
        }
        this.video.play().then(() => {
            this._fadeVolumeIn();
            // PAUSE-UP-3: Toast notification
            this.utils.createToast?.('▶ Auto-resumed', 'success', 1500);
        }).catch(e => {
            this.utils.log?.('Failed to auto-resume video: ' + e.message, 'AutoPause', 'warn');
        });
        this.utils.log?.('Auto resumed video', 'AutoPause');
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
    
    // PAUSE-BUG-5: Removed dead _setupMediaSession code
};

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.AutoPause = AutoPause;
