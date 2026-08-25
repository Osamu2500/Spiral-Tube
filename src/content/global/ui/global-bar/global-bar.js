import '../../../core/system/base-feature.js';
/**
 * Global Player Bar — Orchestrator
 * Detects external <video> tags (non-YouTube) and injects a custom floating
 * player bar for speed/filters/PiP. Relies on GlobalBarUI and FilterPresets.
 */
import css from './global-bar.css?inline';



export class GlobalPlayerBar extends window.YPP.features.BaseFeature {
    static featureId = 'globalPlayerBar';
    static executionPhase = 'sequential-ui';
    static priority = 999;


    constructor() {
        super('GlobalPlayerBar');
        
        this.isYouTube = window.location.hostname.includes('youtube.com');
        this.observer = null;
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
            this._urlPoll = setInterval(() => {
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
        if (this._urlPoll) clearInterval(this._urlPoll);
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
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.register('global-bar-scanner', 'video', () => {
                this.scanForVideos();
            });
        } else {
            // Fallback for external sites where sharedObserver is not loaded
            this._fallbackVideoScanner = (e) => {
                if (e.target && e.target.tagName === 'VIDEO') {
                    this.scanForVideos();
                }
            };
            this.addListener(document, 'play', this._fallbackVideoScanner, true);
            this.addListener(document, 'loadeddata', this._fallbackVideoScanner, true);

            // MutationObserver: catch <video> elements injected dynamically after boot
            // Only trigger when a node is *added* to the DOM that is or contains a <video>
            if (!this._domVideoObserver) {
                this._domVideoObserver = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                        for (const node of m.addedNodes) {
                            if (!node || node.nodeType !== 1) continue;
                            if (node.tagName === 'VIDEO' || node.querySelector?.('video')) {
                                this.scanForVideos();
                                return; // one scan per batch is enough
                            }
                        }
                    }
                });
                this._domVideoObserver.observe(document.documentElement, { childList: true, subtree: true });
            }
        }
    }

    stopObserver() {
        if (this._isObserving) {
            this._isObserving = false;
            if (window.YPP?.sharedObserver) {
                window.YPP.sharedObserver.unregister('global-bar-scanner');
            }
            if (this._fallbackVideoScanner) {
                // this.addListener will be cleaned up automatically by BaseFeature
                this._fallbackVideoScanner = null;
            }
            if (this._domVideoObserver) {
                this._domVideoObserver.disconnect();
                this._domVideoObserver = null;
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
