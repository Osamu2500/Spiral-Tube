import '../../../../core/system/base-feature.js';

/**
 * @fileoverview
 * Stop Shorts Looping
 * 
 * Target: /shorts/* paths.
 * Scope: Strictly enforces the removal of the 'loop' attribute on active Shorts videos.
 * Safety: Uses a localized MutationObserver confined to the active video element.
 */
export class StopShortsLooping extends window.YPP.features.BaseFeature {
    static featureId = 'stopShortsLooping';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('StopShortsLooping');
        this._isMonitoring = false;
        
        // Use a dedicated mutation observer to violently enforce no-loop 
        // if YouTube tries to re-add the attribute dynamically.
        this._videoMutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'loop') {
                    const video = mutation.target;
                    if (video.hasAttribute('loop')) {
                        video.loop = false;
                        video.removeAttribute('loop');
                    }
                }
            }
        });
    }

    // --- Core Lifecycle ---

    getConfigKey() { 
        return 'stopShortsLooping'; 
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
        
        const activeVideo = document.querySelector('ytd-reel-video-renderer[is-active] video');
        if (activeVideo) {
            this.attachToVideo(activeVideo);
            this.preventLoop({ target: activeVideo });
        }

        this.observer.register(
            'shorts-loop-monitor',
            'ytd-reel-video-renderer video',
            this.handleVideoAdded,
            true 
        );
        this._isMonitoring = true;
    }

    stopMonitoring() {
        if (!this._isMonitoring) return;
        this.observer.unregister('shorts-loop-monitor');
        this._videoMutationObserver.disconnect();
        
        document.querySelectorAll('video[data-ypp-no-loop]').forEach(video => {
            video.removeAttribute('data-ypp-no-loop');
            // Restore original state gracefully if they want to let it loop again
            video.loop = true;
            video.setAttribute('loop', '');
        });
        this._isMonitoring = false;
    }

    handleVideoAdded = (elements) => {
        if (!elements) return;
        elements.forEach(video => {
            this.attachToVideo(video);
            this.preventLoop({ target: video });
        });
    };

    attachToVideo(video) {
        if (!video || video.hasAttribute('data-ypp-no-loop')) return;
        
        video.setAttribute('data-ypp-no-loop', 'true');
        this.addListener(video, 'play', this.preventLoop);
        
        // Strict attribute enforcement
        this._videoMutationObserver.observe(video, { attributes: true, attributeFilter: ['loop'] });
    }

    preventLoop = (e) => {
        const video = e.target;
        if (!video) return;

        const reel = video.closest('ytd-reel-video-renderer');
        if (!reel) return;

        if (video.loop || video.hasAttribute('loop')) {
            video.loop = false;
            video.removeAttribute('loop');
        }
    };
}
