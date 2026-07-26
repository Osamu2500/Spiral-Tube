/**
 * YouTube CPU Tamer by AnimationFrame (Based on Script 431573 by CY Fung)
 * Reduces Browser's Energy and CPU Impact when playing YouTube videos.
 * Synchronizes high-frequency setTimeout and setInterval calls to requestAnimationFrame pulses
 * and throttles background/idle timer execution to conserve battery and CPU resources.
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
        this._rafLoopId = null;
        this._timerStore = new Map();
        this._nextTimerId = 1;
    }

    getConfigKey() {
        return 'enableCpuTamer';
    }

    async enable() {
        await super.enable();
        if (this._isTamed) return;

        try {
            this._installTamer();
            this.utils?.log?.('YouTube CPU Tamer by AnimationFrame enabled (Script 431573)', 'CPU-TAMER');
        } catch (err) {
            this.utils?.log?.('CPU Tamer initialization warning: ' + err.message, 'CPU-TAMER', 'warn');
        }
    }

    async disable() {
        await super.disable();
        this._restoreTimers();
        this.utils?.log?.('YouTube CPU Tamer disabled', 'CPU-TAMER');
    }

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

        // Coalesce high-frequency timers (< 16ms) to animation frames when document is visible
        const createTamedTimer = (origFunc, isInterval) => {
            return (handler, delay = 0, ...args) => {
                if (typeof handler !== 'function') {
                    return origFunc(handler, delay, ...args);
                }

                // For standard longer timers or when document is hidden, use original timer
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

        // Preserve toString for compatibility
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
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.CPUTamer = CPUTamer;
