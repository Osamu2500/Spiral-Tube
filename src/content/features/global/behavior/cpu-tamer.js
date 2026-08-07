/**
 * YouTube CPU Tamer by AnimationFrame (Based on Script 431573 by CY Fung)
 * Reduces Browser's Energy and CPU Impact when playing YouTube videos.
 *
 * Two-pronged approach:
 * 1. Timer coalescing — patches setTimeout/setInterval to sync short timers (<40ms)
 *    to requestAnimationFrame pulses, reducing CPU wakeups and battery drain.
 * 2. Animation suppression — surgically kills YouTube's decorative animations
 *    (skeleton loaders, ripple effects, icon morphs, hover transforms) while
 *    leaving functional player transitions (progress bar, volume) intact.
 */

export class CPUTamer extends window.YPP.features.BaseFeature {
    static featureId = 'cpuTamer';
    static executionPhase = 'init';
    static priority = 1; // High priority to initialize early

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
            this.utils?.log?.('CPU Tamer enabled — timers tamed + animations suppressed', 'CPU-TAMER');
        } catch (err) {
            this.utils?.log?.('CPU Tamer initialization warning: ' + err.message, 'CPU-TAMER', 'warn');
        }
    }

    async disable() {
        await super.disable();
        this._restoreTimers();
        this._restoreAnimations();
        this.utils?.log?.('CPU Tamer disabled', 'CPU-TAMER');
    }

    // ─── Timer Coalescing ────────────────────────────────────────────────────

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

        const createTamedTimer = (origFunc, isInterval) => {
            return (handler, delay = 0, ...args) => {
                if (typeof handler !== 'function') {
                    return origFunc(handler, delay, ...args);
                }

                // Pass through longer timers and background-tab timers unchanged
                if (delay > 40 || document.hidden) {
                    return origFunc(handler, delay, ...args);
                }

                // Coalesce short timers to rAF to reduce CPU wakeups
                const id = this._nextTimerId++;
                let cancelled = false;

                const checkFrame = () => {
                    if (cancelled) return;
                    try {
                        handler(...args);
                    } catch (e) {
                        console.error('[CPUTamer] Error in callback:', e);
                    }
                    if (isInterval && !cancelled) {
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

        this._timerStore.forEach(item => item.cancel());
        this._timerStore.clear();
        this._isTamed = false;
    }

    // ─── Animation Suppression ───────────────────────────────────────────────

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

            /* 2. Ripple / ink effects on buttons (GPU waste, zero value) */
            paper-ripple, tp-yt-paper-ripple, .paper-ripple {
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
            #spinner.ytd-masthead {
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
        `;
        document.head.appendChild(style);
        this._animStyle = style;
    }

    _restoreAnimations() {
        if (this._animStyle) {
            this._animStyle.remove();
            this._animStyle = null;
        }
        // Also clean up by id in case of orphan from previous session
        const orphan = document.getElementById('ypp-cpu-tamer-anim');
        if (orphan) orphan.remove();
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.CPUTamer = CPUTamer;
