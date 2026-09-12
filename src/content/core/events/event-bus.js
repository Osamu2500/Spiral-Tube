/**
 * EventBus - Central Event Emitter
 * Decouples features from each other and from direct DOM observers.
 */
window.YPP = window.YPP || {};
window.YPP.core = window.YPP.core || {};

window.YPP.core.EventBus = class EventBus {
    static EVENTS = {
        DOM_MUTATED: 'dom:mutated'
    };

    constructor() {
        this.listeners = {};
        /** @type {Object<string,number>} Active dispatch depth per event */
        this._emitDepth = {};
    }

    /**
     * Subscribe to an event
     * @listens EventBus#event
     * @param {string} event - The event name to listen for
     * @param {Function} handler - The callback function
     * @returns {Function} An unsubscribe function
     */
    on(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(handler);

        // Notify the DOMObserver when 'dom:mutated' gets its first subscriber
        // so it can enable the raw mutation emit path (which is otherwise suppressed
        // for performance when nothing is listening).
        if (event === EventBus.EVENTS.DOM_MUTATED) {
            window.YPP?.sharedObserver?.setHasMutatedListeners(true);
        }

        // Return unsubscribe mechanism
        return () => {
            this.off(event, handler);
        };
    }

    /**
     * Unsubscribe from an event.
     * If called mid-dispatch, filter() produces a new array so the active
     * iteration in emit() is unaffected (it holds the old reference).
     * @param {string} event - The event name
     * @param {Function} handler - The callback function
     */
    off(event, handler) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(h => h !== handler);
        
        // Update listener flag when the last 'dom:mutated' subscriber unsubscribes
        if (event === EventBus.EVENTS.DOM_MUTATED) {
            const remaining = (this.listeners[event] || []).length;
            window.YPP?.sharedObserver?.setHasMutatedListeners(remaining > 0);
        }
    }

    /**
     * Subscribe to an event, but only trigger once
     * @param {string} event 
     * @param {Function} handler 
     */
    once(event, handler) {
        const unsub = this.on(event, (data) => {
            unsub();
            handler(data);
        });
    }

    /**
     * Emit an event to all subscribers.
     *
     * Performance: iterates the live array directly instead of copying it.
     * Safety: off() always produces a new array via filter(), so if a handler
     * unsubscribes during dispatch the current iteration's reference is untouched.
     * If a handler adds a NEW listener during dispatch, it gets appended to the
     * live array and will run in the same emit() call — acceptable and consistent
     * with standard EventEmitter semantics.
     *
     * @fires EventBus#event
     * @param {string} event - The event name
     * @param {any} data - Data to pass to handlers
     */
    emit(event, data) {
        const handlers = this.listeners[event];
        if (!handlers || handlers.length === 0) return;

        this._emitDepth[event] = (this._emitDepth[event] || 0) + 1;

        // Snapshot length once — new listeners added mid-dispatch won't extend
        // the loop, keeping behaviour predictable.
        const len = handlers.length;
        for (let i = 0; i < len; i++) {
            try {
                handlers[i](data);
            } catch (error) {
                if (window.YPP?.errorHandler) {
                    window.YPP.errorHandler.handleError(error, `[YPP:EventBus] Error in handler for event '${event}'`);
                } else {
                    console.error(`[YPP:EventBus] Error in handler for event '${event}':`, error);
                }
            }
        }

        this._emitDepth[event]--;
    }

    /**
     * Remove all listeners for a specific event
     * @param {string} event 
     */
    clear(event) {
        if (event) {
            delete this.listeners[event];
            if (event === EventBus.EVENTS.DOM_MUTATED) {
                window.YPP?.sharedObserver?.setHasMutatedListeners(false);
            }
        } else {
            this.listeners = {};
            window.YPP?.sharedObserver?.setHasMutatedListeners(false);
        }
    }
};

// Instantiate a global singleton for immediate use by features
window.YPP.events = new window.YPP.core.EventBus();
