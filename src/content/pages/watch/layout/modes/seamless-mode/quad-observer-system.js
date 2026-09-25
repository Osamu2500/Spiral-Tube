/**
 * @fileoverview
 * Quad-Observer Redundancy System
 * Constantly guards the layout against any interference.
 */
export class QuadObserverSystem {
    constructor(utils, callback) {
        this.utils = utils;
        this.callback = callback;
        this.resizeObserver = null;
        this.enabled = false;
        this._debounceTimer = null;
    }
    
    /**
     * Debounces the layout enforcement to prevent thrashing
     */
    _debouncedCallback() {
        if (!this.enabled) return;
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this.callback();
        }, 150);
    }
    
    start(target) {
        if (this.enabled) this.stop(); // Clean up previous instances to prevent memory leaks
        
        if (!target) {
            this.utils.log('QuadObserverSystem: No target provided for ResizeObserver.', 'seamlessMode', 'warn');
            return;
        }

        this.enabled = true;
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.register('seamless-quad-observer', 'ytd-watch-flexy ytd-compact-video-renderer, ytd-watch-flexy ytd-rich-item-renderer, ytd-watch-flexy', () => {
                this._debouncedCallback();
            }, true);
        }
        
        // Resize Observer is still needed because sharedObserver does not track layout resizes
        this.resizeObserver = new ResizeObserver(() => {
            this._debouncedCallback();
        });
        
        try {
            this.resizeObserver.observe(target);
            this.utils.log('Quad-Observer System Armed and Guarding.', 'seamlessMode', 'info');
        } catch (error) {
            this.utils.log(`QuadObserverSystem: Failed to observe target - ${error.message}`, 'seamlessMode', 'error');
        }
    }
    
    stop() {
        this.enabled = false;
        
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
            this._debounceTimer = null;
        }
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('seamless-quad-observer');
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        
        this.utils.log('Quad-Observer System Disarmed.', 'seamlessMode', 'info');
    }
}
