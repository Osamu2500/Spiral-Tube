import '../../../../core/system/base-feature.js';

/**
 * @fileoverview
 * Shorts Auto Scroll
 * 
 * Target: /shorts/* paths.
 * Scope: Automatically scrolls to the next Shorts video when the current one finishes naturally.
 * Safety: Uses a localized timeupdate listener on the active reel's video element. Does not affect global YouTube navigation.
 */
export class ShortsAutoScroll extends window.YPP.features.BaseFeature {
    static featureId = 'shortsAutoScroll';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('ShortsAutoScroll');
        this._timeupdateHandler = null;
        this._isMonitoring = false;
        this._lastScrolledVideo = null;
        this._currentVideoStartTime = null;
    }

    // --- Core Lifecycle ---

    getConfigKey() { 
        return 'shortsAutoScroll'; 
    }

    async enable() {
        await super.enable();
        if (location.pathname.startsWith('/shorts/')) {
            this.startMonitoring();
        }
    }

    async disable() {
        await super.disable();
        this.stopMonitoring();
    }

    onPageChange(url) {
        if (!this.isEnabled) return;
        if (url.includes('/shorts/')) {
            this.startMonitoring();
        } else {
            this.stopMonitoring();
        }
    }

    // --- Feature Logic ---

    startMonitoring() {
        if (this._isMonitoring) return;
        this.utils?.log('Starting Shorts Auto-Scroll monitoring', 'AutoScroll');
        
        this._timeupdateHandler = (e) => {
            if (document.hidden) return;
            const target = e.target;
            
            // Only process video timeupdates within the active reel
            if (target && target.tagName === 'VIDEO' && target.closest('ytd-reel-video-renderer[is-active]')) {
                this._checkAndScroll(target);
            }
        };
        
        document.addEventListener('timeupdate', this._timeupdateHandler, true);
        this._isMonitoring = true;
    }

    stopMonitoring() {
        if (!this._isMonitoring) return;
        
        if (this._timeupdateHandler) {
            document.removeEventListener('timeupdate', this._timeupdateHandler, true);
            this._timeupdateHandler = null;
        }
        
        this._isMonitoring = false;
        this._lastScrolledVideo = null;
        this.utils?.log('Stopped Shorts Auto-Scroll monitoring', 'AutoScroll');
    }

    _checkAndScroll(video) {
        if (!video || isNaN(video.duration) || video.duration === 0) return;
        
        // Setup state for new video
        if (this._lastScrolledVideo !== video) {
            this._currentVideoStartTime = Date.now();
            this._lastScrolledVideo = video;
        }
        
        // Check if video has ended naturally OR is within a very tiny threshold of ending (catches before loop)
        const isEnded = video.ended || (video.currentTime > 0 && video.duration > 0 && (video.duration - video.currentTime <= 0.1));
        
        if (isEnded) {
            // Prevent scrolling multiple times for the same video instance during the transition (debounce)
            if (video.currentTime > 0.5 && (Date.now() - this._currentVideoStartTime) < 1000) {
                return; 
            }
            
            const nextButton = document.querySelector('#navigation-button-down :is(ytd-button-renderer, yt-button-view-model) button, .navigation-button.down button');
            if (nextButton) {
                this.utils?.log('Short ended. Auto-scrolling to next.', 'AutoScroll', 'info');
                nextButton.click();
            }
        }
    }
}
