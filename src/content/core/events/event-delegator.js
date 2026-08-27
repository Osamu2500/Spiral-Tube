window.YPP = window.YPP || {};
window.YPP.core = window.YPP.core || {};

/**
 * Global Event Delegator
 * Reduces memory footprint by replacing hundreds of individual .onclick 
 * listeners with a single document-level listener.
 */
window.YPP.core.EventDelegator = class EventDelegator {
    constructor() {
        this.registry = new Map();
        this._handleClick = this._handleClick.bind(this);
        this.isRunning = false;
        
        // Caches for throttling/debouncing
        this._timers = new Map();
        this._lastRun = new Map();
    }

    start() {
        if (this.isRunning) return;
        document.body.addEventListener('click', this._handleClick, true); // Use capture phase for reliability
        this.isRunning = true;
    }

    stop() {
        if (!this.isRunning) return;
        document.body.removeEventListener('click', this._handleClick, true);
        this.isRunning = false;
    }

    register(action, callback) {
        if (!action || typeof callback !== 'function') return;
        this.registry.set(action, callback);
    }

    unregister(action) {
        this.registry.delete(action);
    }

    _handleClick(e) {
        if (this.registry.size === 0) return;
        
        // Find the closest ancestor with data-ypp-action
        const target = e.target.closest('[data-ypp-action]');
        if (!target) return;

        const action = target.getAttribute('data-ypp-action');
        const callback = this.registry.get(action);

        if (callback) {
            e.stopPropagation(); // Stop YouTube from hijacking our clicks
            e.preventDefault();
            const payload = target.getAttribute('data-ypp-payload');
            try {
                callback(e, target, payload);
            } catch (err) {
                console.error(`[YPP:EventDelegator] Error in action '${action}':`, err);
            }
        }
    }

    // =========================================================================
    // HIGH-FREQUENCY OPTIMIZATION UTILITIES
    // =========================================================================

    /**
     * Attaches a passive event listener for high-frequency events (scroll, wheel, touchmove).
     * Automatically applies { passive: true } to prevent blocking the main thread.
     * @param {EventTarget} target 
     * @param {string} event 
     * @param {Function} handler 
     */
    addPassiveListener(target, event, handler) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(event, handler, { passive: true, capture: false });
    }

    /**
     * Throttle function to limit execution rate of a callback.
     * Uses the EventDelegator's internal timer map for cleanup tracking.
     * @param {string} id - Unique identifier for this throttle
     * @param {Function} func - Function to execute
     * @param {number} limit - Milliseconds limit
     */
    throttle(id, func, limit) {
        const lastRun = this._lastRun.get(id) || 0;
        const now = Date.now();
        if (now - lastRun >= limit) {
            func();
            this._lastRun.set(id, now);
        } else if (!this._timers.has(id)) {
            // Schedule one last run after the limit expires
            const timer = setTimeout(() => {
                func();
                this._lastRun.set(id, Date.now());
                this._timers.delete(id);
            }, limit - (now - lastRun));
            this._timers.set(id, timer);
        }
    }

    /**
     * Debounce function to delay execution until activity stops.
     * @param {string} id - Unique identifier for this debounce
     * @param {Function} func - Function to execute
     * @param {number} delay - Milliseconds delay
     */
    debounce(id, func, delay) {
        if (this._timers.has(id)) {
            clearTimeout(this._timers.get(id));
        }
        this._timers.set(id, setTimeout(() => {
            func();
            this._timers.delete(id);
        }, delay));
    }
};
