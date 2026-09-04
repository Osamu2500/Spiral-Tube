import '../../../../core/system/base-feature.js';

/**
 * @fileoverview
 * Shorts Volume Normalizer
 * 
 * Target: /shorts/* paths.
 * Scope: Syncs the volume of Shorts players with the user's global YouTube volume setting.
 * Safety: Safely reads from localStorage with fallback to 1.0 (100%) volume on error. Uses epsilon checking to avoid volumechange feedback loops.
 */
export class ShortsVolumeNormalizer extends window.YPP.features.BaseFeature {
    static featureId = 'shortsVolumeNormalizer';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('ShortsVolumeNormalizer');
        this._isMonitoring = false;
        this._defaultVolume = 1.0;
    }

    // --- Core Lifecycle ---

    getConfigKey() { 
        return 'shortsVolumeNormalizer'; 
    }

    async enable() {
        await super.enable();
        this._updateDefaultVolume();
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
        this._updateDefaultVolume();
        if (url.includes('/shorts/')) {
            this.startMonitoring();
        } else {
            this.stopMonitoring();
        }
    }

    // --- Feature Logic ---

    _updateDefaultVolume() {
        try {
            const ytVolumeData = localStorage.getItem('yt-player-volume');
            if (ytVolumeData) {
                const parsed = JSON.parse(ytVolumeData);
                const dataObj = JSON.parse(parsed.data);
                if (dataObj && typeof dataObj.volume === 'number') {
                    this._defaultVolume = dataObj.volume / 100;
                }
            }
        } catch(e) {
            this.utils?.log('Error reading yt-player-volume from localStorage, falling back to 100%', 'VolumeNormalizer', 'warn');
            this._defaultVolume = 1.0;
        }
    }

    startMonitoring() {
        if (this._isMonitoring) return;
        this.utils?.log('Starting Shorts Volume monitoring', 'VolumeNormalizer');
        
        const activeVideo = document.querySelector('ytd-reel-video-renderer[is-active] video');
        if (activeVideo) {
            this.attachToVideo(activeVideo);
            this.enforceVolume({ target: activeVideo });
        }

        this.observer.register(
            'shorts-volume-monitor',
            'ytd-reel-video-renderer video',
            this.handleVideoAdded,
            true 
        );
        this._isMonitoring = true;
    }

    stopMonitoring() {
        if (!this._isMonitoring) return;
        this.observer.unregister('shorts-volume-monitor');
        
        document.querySelectorAll('video[data-ypp-volume]').forEach(video => {
            video.removeAttribute('data-ypp-volume');
        });
        
        this._isMonitoring = false;
        this.utils?.log('Stopped Shorts Volume monitoring', 'VolumeNormalizer');
    }

    handleVideoAdded = (elements) => {
        if (!elements) return;
        elements.forEach(video => {
            this.attachToVideo(video);
            this.enforceVolume({ target: video });
        });
    };

    attachToVideo(video) {
        if (!video || video.hasAttribute('data-ypp-volume')) return;
        
        video.setAttribute('data-ypp-volume', 'true');
        this.addListener(video, 'volumechange', this.enforceVolume);
        this.addListener(video, 'play', this.enforceVolume);
    }

    enforceVolume = (e) => {
        const video = e.target;
        if (!video) return;

        const reel = video.closest('ytd-reel-video-renderer');
        if (!reel) return;

        this._updateDefaultVolume();

        // Avoid infinite loops by only updating if volume is actually different
        // Allow a small epsilon for floating point precision issues
        if (Math.abs(video.volume - this._defaultVolume) > 0.01) {
            video.volume = this._defaultVolume;
            this.utils?.log(`Enforced Shorts Volume: ${this._defaultVolume}`, 'VolumeNormalizer', 'debug');
        }
    };
}
