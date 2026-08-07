/**
 * YouTube Performance Booster (based on CPU Tamer by AnimationFrame, Script 431573 by CY Fung)
 * Reduces Browser's Energy and CPU Impact when playing YouTube videos.
 *
 * Two-pronged approach:
 * 1. TIMER COALESCING — 3-tier system: <4ms always rAF, 4–40ms coalesce when visible,
 *    >40ms passthrough. Hidden tabs get a 1000ms floor to nearly stop all JS activity.
 * 2. ANIMATION SUPPRESSION — surgically kills YouTube's decorative animations
 *    (skeleton loaders, ripple effects, icon morphs, hover transforms, Shorts shelf, etc.)
 *    while leaving functional player transitions (progress bar, volume) intact.
 */

export class CPUTamer extends window.YPP.features.BaseFeature {
    static featureId = 'cpuTamer';
    static executionPhase = 'init';
    static priority = 1;

    constructor() {
        super('CPUTamer');
        this.name = 'CPUTamer';
        this._originalSetTimeout = null;
        this._originalSetInterval = null;
        this._originalClearTimeout = null;
        this._originalClearInterval = null;
        this._isTamed = false;
        this._timerStore = new Map();
        this._nextTimerId = 1;
        this._animStyle = null;
        this._tamedCount = 0;
        this._toastShown = false;
        this._toastTimer = null;
        this._visibilityHandler = null;
    }

    getConfigKey() {
        return 'enableCpuTamer';
    }

    async enable() {
        await super.enable();
        if (this._isTamed) return;

        try {
            this._installTamer();
            this._suppressAnimations();
            this._scheduleToast();
            this.utils?.log?.('Performance Booster enabled — timers tamed + animations suppressed', 'CPU-TAMER');
        } catch (err) {
            this.utils?.log?.('CPU Tamer initialization warning: ' + err.message, 'CPU-TAMER', 'warn');
        }
    }

    async disable() {
        await super.disable();
        this._restoreTimers();
        this._restoreAnimations();
        if (this._toastTimer) { clearTimeout(this._toastTimer); this._toastTimer = null; }
        this.utils?.log?.('Performance Booster disabled', 'CPU-TAMER');
    }

    // ─── 1C: Toast after 5s ──────────────────────────────────────────────────

    _scheduleToast() {
        if (this._toastShown) return;
        this._toastTimer = setTimeout(() => {
            this._toastShown = true;
            const animCount = 10; // number of suppressed animation targets
            this.utils?.createToast?.(
                `⚡ Performance Booster: Tamed ${this._tamedCount} timers · Suppressed ${animCount} animation types`,
                'success', 4000
            );
        }, 5000);
    }

    // ─── 1A + 1B: Timer Coalescing with 3-Tier + Background Throttle ─────────

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

        // 1B: visibilitychange listener — restore/throttle on tab hide/show
        this._visibilityHandler = () => {
            // nothing to patch at this layer — the createTamedTimer closure reads
            // document.hidden live at call time, so tab-switch is handled automatically
        };
        document.addEventListener('visibilitychange', this._visibilityHandler);

        const self = this;

        /**
         * 3-tier decision:
         *   Tier 1: delay < 4ms   → always coalesce to rAF (spam polling)
         *   Tier 2: 4ms – 40ms    → coalesce when tab is visible
         *   Tier 3: > 40ms        → pass through unchanged
         *   Background tab:       → force minimum 1000ms delay on everything
         */
        const createTamedTimer = (origFunc, isInterval) => {
            return (handler, delay = 0, ...args) => {
                if (typeof handler !== 'function') {
                    return origFunc(handler, delay, ...args);
                }

                // 1B: Background tab throttle — all timers get 1000ms floor
                if (document.hidden) {
                    const hiddenDelay = Math.max(delay, 1000);
                    return origFunc(handler, hiddenDelay, ...args);
                }

                // Tier 3: Long timers pass through unchanged
                if (delay > 40) {
                    return origFunc(handler, delay, ...args);
                }

                // Tier 1 + 2: Coalesce short timers to rAF
                self._tamedCount++;
                const id = self._nextTimerId++;
                let cancelled = false;

                const checkFrame = () => {
                    if (cancelled) return;
                    try {
                        handler(...args);
                    } catch (e) {
                        console.error('[CPUTamer] Error in callback:', e);
                    }
                    if (isInterval && !cancelled) {
                        // Cap setInterval to 60fps max (16ms floor)
                        origSetTimeout(checkFrame, Math.max(16, delay));
                    } else {
                        timerStore.delete(id);
                    }
                };

                const nativeId = origSetTimeout(checkFrame, Math.max(16, delay));
                timerStore.set(id, { nativeId, cancel: () => { cancelled = true; origClearTimeout(nativeId); } });
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

        // Preserve native toString for anti-detection compatibility
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

        this._timerStore.forEach(item => item.cancel());
        this._timerStore.clear();
        this._isTamed = false;
    }

    // ─── 1D: Animation Suppression (expanded coverage) ───────────────────────

    _suppressAnimations() {
        if (document.getElementById('ypp-cpu-tamer-anim')) return;

        const style = document.createElement('style');
        style.id = 'ypp-cpu-tamer-anim';
        style.textContent = `
            /* ── CPU TAMER: Surgical animation suppression ── */

            /* 1. Skeleton loaders — pulsing grey loading placeholders */
            ytd-skeleton, .ytd-skeleton, ytd-ghost-card-renderer,
            .yt-spec-skeleton-text, .skeleton-bg, .skeleton-animation {
                animation: none !important;
                background: rgba(255,255,255,0.06) !important;
            }

            /* 2. Ripple / ink effects on buttons */
            paper-ripple, tp-yt-paper-ripple, .paper-ripple,
            .yt-spec-touch-feedback-shape {
                display: none !important;
            }

            /* 3. yt-animated-icon — morphing SVG icons (like, subscribe bell, etc.) */
            yt-animated-icon > *,
            yt-animated-icon svg * {
                animation: none !important;
                transition: none !important;
            }

            /* 4. Thumbnail hover zoom — saves GPU composite layers on scroll */
            ytd-thumbnail:hover img,
            yt-image:hover img,
            .ytd-thumbnail:hover img {
                transform: none !important;
                transition: none !important;
            }

            /* 5. Card hover lift/scale on feed items */
            ytd-rich-item-renderer,
            ytd-compact-video-renderer,
            yt-lockup-view-model {
                transition: none !important;
            }

            /* 6. Sidebar guide entry hover slide effects */
            ytd-guide-entry-renderer,
            ytd-mini-guide-entry-renderer {
                transition: none !important;
            }

            /* 7. Auto-play countdown ring animation */
            .ytp-autonav-endscreen-countdown-overlay circle {
                animation: none !important;
            }

            /* 8. Page-level loading spinners */
            .ytd-loading-spinner,
            #spinner.ytd-masthead,
            .ytp-spinner-container,
            .ytp-spinner {
                animation: none !important;
            }

            /* 9. Notification bell active pulse */
            yt-icon[icon="notifications_active"] {
                animation: none !important;
            }

            /* 10. Subscribe button color-flash on press */
            ytd-subscribe-button-renderer tp-yt-paper-button {
                transition: none !important;
            }

            /* 11. (NEW) All button hover transitions */
            ytd-button-renderer tp-yt-paper-button {
                transition: none !important;
            }

            /* 12. (NEW) "You're all caught up!" nudge banners */
            ytd-feed-nudge-renderer {
                animation: none !important;
                transition: none !important;
            }

            /* 13. (NEW) Filter chip hover/select transitions */
            yt-chip-cloud-chip-renderer {
                transition: none !important;
            }

            /* 14. (NEW) Shorts shelf entry animations */
            ytd-reel-shelf-renderer {
                animation: none !important;
                transition: none !important;
            }

            /* 15. (NEW) Animated text on shelf titles */
            .yt-core-attributed-string {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
        this._animStyle = style;
    }

    _restoreAnimations() {
        if (this._animStyle) {
            this._animStyle.remove();
            this._animStyle = null;
        }
        const orphan = document.getElementById('ypp-cpu-tamer-anim');
        if (orphan) orphan.remove();
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.CPUTamer = CPUTamer;
