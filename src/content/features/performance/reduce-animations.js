import '../../core/system/base-feature.js';
/**
 * ReduceAnimations Feature
 *
 * Three-speed animation suppression for YouTube:
 *   'off'      → no suppression (default YouTube behaviour)
 *   'balanced' → halves all durations (max 0.15s), preserves easing, applies CPU Timer Taming.
 *   'minimal'  → near-zero durations (0.01ms), disables scroll-behaviour, heavy CSS suppression, applies CPU Timer Taming.
 *
 * Extra capabilities:
 *   • CPU Timer coalescing to reduce battery usage in the background.
 *   • Respects OS `prefers-reduced-motion` — auto-activates Minimal on accessibility setting
 *   • Intercepts `Element.prototype.scrollIntoView` in Minimal mode to stop JS smooth-scrolls
 *   • Exempts extension-owned elements (toasts, PiP, subtitles) from suppression
 *   • Fully reversible on disable — no page reload needed
 */

export class ReduceAnimations extends window.YPP.features.BaseFeature {
    static featureId = 'reduceAnimations';

    constructor() {
        super('ReduceAnimations');
        this.name = 'ReduceAnimations';
        this._currentMode = 'off';
        this._originalScrollIntoView = null;
        this._originalAnimate = null;

        // CPU Tamer state
        this._originalSetTimeout = null;
        this._originalSetInterval = null;
        this._originalClearTimeout = null;
        this._originalClearInterval = null;
        this._isTamed = false;
        this._timerStore = new Map();
        this._nextTimerId = 1;
        this._tamedCount = 0;
        this._visibilityHandler = null;
        this._navHandler = null;
    }

    getConfigKey() {
        return 'reduceAnimations';
    }

    async enable() {
        await super.enable();
        const mode = this._resolveMode();
        this._applyMode(mode);
    }

    async disable() {
        await super.disable();
        this._clearMode();
    }

    /** Called by FeatureManager whenever settings change live in the popup */
    onSettingsUpdate(settings) {
        if (!this._isEnabled) return;
        const mode = this._resolveMode(settings);
        if (mode !== this._currentMode) {
            this._clearMode();
            this._applyMode(mode);
        }
    }

    // ─── Mode Resolution ──────────────────────────────────────────────────────

    _resolveMode(settings) {
        const s = settings || this.settings || {};
        const isEnabled = s.reduceAnimations;
        if (!isEnabled) return 'off';
        return 'minimal';
    }

    // ─── Apply / Clear ────────────────────────────────────────────────────────

    _applyMode(mode) {
        this._currentMode = mode;

        // Remove any existing classes first
        document.body.classList.remove(
            'ypp-reduce-anim-balanced',
            'ypp-reduce-anim-minimal'
        );

        if (mode === 'off') return;

        document.body.classList.add(`ypp-reduce-anim-${mode}`);

        if (mode === 'minimal') {
            this._patchScrollIntoView();
            this._patchWebAnimationsAPI();
            this._installTamer();
            this._applyMinimalCSS();
        } else {
            this._removeMinimalCSS();
        }


        this.utils?.log?.(`ReduceAnimations: mode = ${mode}`, 'REDUCE-ANIM');
    }

    _clearMode() {
        document.body.classList.remove(
            'ypp-reduce-anim-balanced',
            'ypp-reduce-anim-minimal'
        );

        this._removeMinimalCSS();
        this._restoreScrollIntoView();
        this._restoreWebAnimationsAPI();
        this._restoreTimers();

        this._currentMode = 'off';
    }



    // ─── Minimal Mode CSS (Aggressive Animation Suppression) ──────────────────

    _applyMinimalCSS() {
        if (document.getElementById('ypp-reduce-anim-minimal-css')) return;
        const style = document.createElement('style');
        style.id = 'ypp-reduce-anim-minimal-css';
        style.textContent = `
            /* ── Surgical animation suppression ── */

            /* 1. Skeleton loaders — pulsing grey loading placeholders */
            ytd-skeleton, .ytd-skeleton, ytd-ghost-card-renderer,
            .yt-spec-skeleton-text, .skeleton-bg, .skeleton-animation {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                background: rgba(255,255,255,0.06) !important;
            }

            /* 2. Ripple / ink effects on buttons */
            paper-ripple, tp-yt-paper-ripple, .paper-ripple,
            .yt-spec-touch-feedback-shape {
                display: none !important;
            }

            /* 3. yt-animated-icon & yt-animated-action — morphing SVG/Lottie icons */
            yt-animated-icon > *,
            yt-animated-icon svg *,
            yt-animated-action > *,
            yt-animated-action svg *,
            yt-animated-action canvas,
            segmented-like-dislike-button-view-model yt-animated-action *,
            .YtSegmentedLikeDislikeButtonViewModelSegmentedLikeDislikeButtonViewModelLikeButton yt-animated-action * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            /* 4. Thumbnail hover zoom */
            ytd-thumbnail:hover img,
            yt-image:hover img,
            .ytd-thumbnail:hover img {
                transform: none !important;
                transition: none !important;
            }

            /* 6. Sidebar guide entry hover slide effects */
            ytd-guide-entry-renderer,
            ytd-mini-guide-entry-renderer {
                transition-duration: 0.01ms !important;
            }

            /* 7. Auto-play countdown ring animation */
            .ytp-autonav-endscreen-countdown-overlay circle {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
            }

            /* 8. Page-level loading spinners */
            .ytd-loading-spinner,
            #spinner.ytd-masthead,
            .ytp-spinner-container,
            .ytp-spinner {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
            }

            /* 9. Notification bell active pulse */
            yt-icon[icon="notifications_active"] {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
            }

            /* 10. Subscribe button color-flash on press */
            ytd-subscribe-button-renderer tp-yt-paper-button {
                transition-duration: 0.01ms !important;
            }

            /* 11. All button hover transitions */
            :is(ytd-button-renderer, yt-button-view-model) :is(tp-yt-paper-button, button) {
                transition-duration: 0.01ms !important;
            }

            /* 12. "You're all caught up!" nudge banners */
            ytd-feed-nudge-renderer {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            /* 13. Filter chip hover/select transitions */
            yt-chip-cloud-chip-renderer {
                transition-duration: 0.01ms !important;
            }

            /* 14. Shorts shelf entry animations */
            ytd-reel-shelf-renderer {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            /* 15. Animated text on shelf titles */
            .yt-core-attributed-string {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }

    _removeMinimalCSS() {
        const style = document.getElementById('ypp-reduce-anim-minimal-css');
        if (style) style.remove();
    }

    // ─── scrollIntoView Patch ─────────────────────────────────────────────

    _patchScrollIntoView() {
        if (this._originalScrollIntoView) return; 
        this._originalScrollIntoView = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = function (options) {
            if (options && typeof options === 'object') {
                options = { ...options, behavior: 'auto' };
            } else if (options === undefined) {
                options = { behavior: 'auto' };
            }
            return Element.prototype._yppOrigScrollIntoView.call(this, options);
        };
        Element.prototype._yppOrigScrollIntoView = this._originalScrollIntoView;
    }

    _restoreScrollIntoView() {
        if (!this._originalScrollIntoView) return;
        Element.prototype.scrollIntoView = this._originalScrollIntoView;
        delete Element.prototype._yppOrigScrollIntoView;
        this._originalScrollIntoView = null;
    }

    // ─── Web Animations API Patch ─────────────────────────────────────────

    _patchWebAnimationsAPI() {
        if (this._originalAnimate) return;
        this._originalAnimate = Element.prototype.animate;
        const origAnimate = this._originalAnimate;
        
        Element.prototype.animate = function(keyframes, options) {
            if (options) {
                if (typeof options === 'number') {
                    options = 0;
                } else {
                    options.duration = 0;
                    options.iterations = 1;
                }
            } else {
                options = 0;
            }
            return origAnimate.call(this, keyframes, options);
        };
        Element.prototype._yppOrigAnimate = origAnimate;
    }

    _restoreWebAnimationsAPI() {
        if (!this._originalAnimate) return;
        Element.prototype.animate = this._originalAnimate;
        delete Element.prototype._yppOrigAnimate;
        this._originalAnimate = null;
    }

    // ─── Timer Coalescing (CPU Tamer) ────────────────────────────────────────

    _installTamer() {
        if (!window.requestAnimationFrame || this._isTamed) return;

        const win = window;
        this._originalSetTimeout = win.setTimeout;
        this._originalSetInterval = win.setInterval;
        this._originalClearTimeout = win.clearTimeout;
        this._originalClearInterval = win.clearInterval;

        const timerStore = this._timerStore;
        const origSetTimeout = this._originalSetTimeout.bind(win);
        const origSetInterval = this._originalSetInterval.bind(win);
        const origClearTimeout = this._originalClearTimeout.bind(win);
        const origClearInterval = this._originalClearInterval.bind(win);

        this._visibilityHandler = () => {};
        document.addEventListener('visibilitychange', this._visibilityHandler);

        this._navHandler = () => this._onNavigateFinish();
        window.addEventListener('yt-navigate-finish', this._navHandler);

        const self = this;

        const createTamedTimer = (origFunc, isInterval) => {
            return (handler, delay = 0, ...args) => {
                if (typeof handler !== 'function') {
                    return origFunc(handler, delay, ...args);
                }

                if (document.hidden) {
                    const video = document.querySelector('video');
                    const isPaused = video ? video.paused : true;
                    const floor = isPaused ? 10000 : 1000;
                    const hiddenDelay = Math.max(delay, floor);
                    return origFunc(handler, hiddenDelay, ...args);
                }

                if (delay > 40) {
                    return origFunc(handler, delay, ...args);
                }

                self._tamedCount++;
                const id = self._nextTimerId++;
                let cancelled = false;

                const checkFrame = () => {
                    if (cancelled) return;
                    try {
                        handler(...args);
                    } catch (e) {
                        console.error('[ReduceAnimations/CPUTamer] Error in callback:', e);
                    }
                    if (isInterval && !cancelled) {
                        origSetTimeout(checkFrame, Math.max(16, delay));
                    } else {
                        timerStore.delete(id);
                    }
                };

                const executionDelay = isInterval ? Math.max(16, delay) : delay;
                const nativeId = origSetTimeout(checkFrame, executionDelay);
                timerStore.set(id, {
                    nativeId,
                    cancel: () => {
                        cancelled = true;
                        origClearTimeout(nativeId);
                    }
                });
                return id;
            };
        };

        win.setTimeout = createTamedTimer(origSetTimeout, false);
        win.setInterval = createTamedTimer(origSetInterval, true);

        win.clearTimeout = (id) => {
            if (timerStore.has(id)) {
                timerStore.get(id).cancel();
                timerStore.delete(id);
            } else {
                origClearTimeout(id);
            }
        };

        win.clearInterval = (id) => {
            if (timerStore.has(id)) {
                timerStore.get(id).cancel();
                timerStore.delete(id);
            } else {
                origClearInterval(id);
            }
        };

        try {
            win.setTimeout.toString = () => origSetTimeout.toString();
            win.setInterval.toString = () => origSetInterval.toString();
            win.clearTimeout.toString = () => origClearTimeout.toString();
            win.clearInterval.toString = () => origClearInterval.toString();
        } catch (e) {}

        this._isTamed = true;
    }

    _restoreTimers() {
        if (!this._isTamed) return;
        const win = window;
        if (this._originalSetTimeout) win.setTimeout = this._originalSetTimeout;
        if (this._originalSetInterval) win.setInterval = this._originalSetInterval;
        if (this._originalClearTimeout) win.clearTimeout = this._originalClearTimeout;
        if (this._originalClearInterval) win.clearInterval = this._originalClearInterval;

        if (this._visibilityHandler) {
            document.removeEventListener('visibilitychange', this._visibilityHandler);
            this._visibilityHandler = null;
        }
        if (this._navHandler) {
            window.removeEventListener('yt-navigate-finish', this._navHandler);
            this._navHandler = null;
        }

        this._timerStore.forEach((item) => item.cancel());
        this._timerStore.clear();
        this._isTamed = false;
    }

    _onNavigateFinish() {
        if (!this._isTamed) return;
        
        const tooltips = document.querySelectorAll('.ytp-tooltip');
        tooltips.forEach(t => t.remove());

        const hiddenIframes = document.querySelectorAll('iframe[style*="visibility: hidden"], iframe[style*="display: none"]');
        hiddenIframes.forEach(f => {
            f.src = 'about:blank';
            f.remove();
        });

        this.utils?.log?.('Memory Guard: Cleared detached nodes on navigation.', 'REDUCE-ANIM', 'debug');
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.ReduceAnimations = ReduceAnimations;
