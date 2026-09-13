import '../../core/system/base-feature.js';

/**
 * @fileoverview
 * Pause Channel Trailers
 * 
 * Target: /@channel paths.
 * Scope: Stops auto-playing channel trailers using YouTube's internal player API.
 * Safety: Checks for player API before attempting to pause.
 */
export class PauseTrailerFeature extends window.YPP.features.BaseFeature {
    constructor(utils, settings) {
        super(utils, settings);
        this.featureKey = 'pauseChannelTrailers';
        this.boundObserver = (elements) => this.handleTrailer(elements);
    }

    onActivate() {
        this.utils.log('Pause Channel Trailers Active', 'DECLUTTER', 'info');
        // Watch for video elements specifically inside channel browse contexts or the modern channel player renderer
        const selectors = [
            'ytd-browse[page-subtype="channels"] video.html5-main-video',
            'ytd-channel-video-player-renderer video.html5-main-video'
        ].join(', ');
        
        window.YPP.sharedObserver.register('pause-channel-trailer', selectors, this.boundObserver);
    }

    onDeactivate() {
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('pause-channel-trailer');
        }
    }

    handleTrailer(elements) {
        elements.forEach(video => {
            if (video && !video.paused) {
                // Try to use YouTube's internal player API first to keep UI in sync
                const playerContainer = video.closest('.html5-video-player') || document.getElementById('c4-player');
                if (playerContainer && typeof playerContainer.pauseVideo === 'function') {
                    playerContainer.pauseVideo();
                    this.utils.log('Channel trailer paused via YouTube API', 'DECLUTTER', 'debug');
                } else {
                    // Fallback to raw video API and mute
                    video.muted = true;
                    video.pause();
                    this.utils.log('Channel trailer paused via HTML5 API', 'DECLUTTER', 'debug');
                }
            }
        });
    }
}

window.YPP.features = window.YPP.features || {};
window.YPP.features.PauseTrailerFeature = PauseTrailerFeature;
