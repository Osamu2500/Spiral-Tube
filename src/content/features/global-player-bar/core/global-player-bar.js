import '../../../core/system/base-feature.js';
/**
 * Global Player Bar — Orchestrator
 * Detects external <video> tags (non-YouTube) and injects a custom floating
 * player bar for speed/filters/PiP. Relies on GlobalBarUI and FilterPresets.
 */
import css from '../styles/global-bar.css?inline';

export class GlobalPlayerBar extends window.YPP.features.BaseFeature {
    static featureId = 'globalPlayerBar';
    static executionPhase = 'sequential-ui';
    static priority = 999;

    constructor() {
        super('GlobalPlayerBar');
        
        this.isYouTube = window.location.hostname.includes('youtube.com');
        this.isDismissed = false;
        
        // ── Sub-modules ────────────────────────────────────────────────────
        this.ui = new window.YPP.features.GlobalBarUI(
            window.YPP.features.FilterPresets?.PRESETS || []
        );

        this.ui.onDismiss = () => {
            this.isDismissed = true;
        };

        this._repositionListener = () => this.ui.updatePosition();
    }

    onUpdate() {
        if (this.ui) {
            this.ui.updateSettings(this.settings);
        }
    }

    getConfigKey() {
        return 'enableGlobalPlayerBar';
    }

    // =========================================================================
    // LIFECYCLE
    // =========================================================================

    _injectCSS() {
        if (document.getElementById('ypp-global-bar-css')) return;
        const style = document.createElement('style');
        style.id = 'ypp-global-bar-css';
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    async enable() {
        if (this.isYouTube) return; // Skip YouTube (handled by native integration)

        try {
            this.utils?.log('Enabling Global Player Bar', 'GlobalPlayerBar');
            if (this.ui) this.ui.updateSettings(this.settings || {});
            this._injectCSS();
            this.scanForVideos();
            this.startObserver();
            
            // Reset dismissal on native navigation
            this.addListener(window, 'popstate', () => {
                this.isDismissed = false;
                this.scanForVideos();
            });
            
            // Simple URL polling for SPAs that use pushState without triggering popstate
            let lastUrl = location.href;
            this._urlPoll = this.setInterval(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    this.isDismissed = false;
                    this.scanForVideos();
                }
            }, 1000);
        } catch (e) {
            this.utils?.log('Error enabling GlobalPlayerBar', 'GLOBAL', 'error', e);
        }
    }

    async disable() {
        await super.disable();
        this.stopObserver();
        this.clearInterval(this._urlPoll);
        this.ui.removeAll();
        this.utils?.removeStyle('ypp-global-bar-css');
        
        // Clean up DOM stamps so the feature can cleanly restart if re-enabled
        document.querySelectorAll('video[data-ypp-processed]').forEach(v => {
            v.removeAttribute('data-ypp-processed');
        });
    }

    // =========================================================================
    // OBSERVATION & SCANNING
    // =========================================================================

    startObserver() {
        if (this._isObserving) return;
        this._isObserving = true;
        
        if (window.YPP && window.YPP.events) {
            this._unsubPlayerConstructed = window.YPP.events.on('dom:playerConstructed', () => {
                this.scanForVideos();
            });
        } else {
            // Fallback for isolated external sites
            this._fallbackVideoScanner = (e) => {
                if (e.target && e.target.tagName === 'VIDEO') {
                    this.scanForVideos();
                }
            };
            this.addListener(document, 'play', this._fallbackVideoScanner, true);
            this.addListener(document, 'loadeddata', this._fallbackVideoScanner, true);
        }
    }

    stopObserver() {
        if (this._isObserving) {
            this._isObserving = false;
            if (this._unsubPlayerConstructed) {
                this._unsubPlayerConstructed();
                this._unsubPlayerConstructed = null;
            }
            if (this._fallbackVideoScanner) {
                this._fallbackVideoScanner = null;
            }
        }
    }

    scanForVideos() {
        // Respect user's explicit close action for this view
        if (this.isDismissed) return;

        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (this.ui.hasVideo(video)) return;
            
            video.setAttribute('data-ypp-processed', 'true');
            this.ui.trackVideo(video);
            this._notifyFeaturesOfNewVideo(video);
        });
    }

    _notifyFeaturesOfNewVideo(video) {
        if (this.isYouTube) return; // YouTube handles this natively via app:videoChange
        if (!window.YPP.featureManager) return;
        
        ['volumeBoost', 'videoFilters', 'videoSpeedController'].forEach(name => {
            const feature = window.YPP.featureManager.getFeature(name);
            if (feature && feature.isEnabled && typeof feature.onVideoChange === 'function') {
                feature.onVideoChange(video);
            }
        });
    }
};

window.YPP.features.GlobalPlayerBar = GlobalPlayerBar;
