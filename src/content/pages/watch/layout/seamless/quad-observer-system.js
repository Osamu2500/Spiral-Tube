/**
 * @fileoverview
 * Quad-Observer Redundancy System
 * Constantly guards the layout against any interference.
 */
export class QuadObserverSystem {
    constructor(logger, callback) {
        this.logger = logger;
        this.callback = callback;
        this.resizeObserver = null;
        this.enabled = false;
        this._debounceTimer = null;
    }
    
    _debouncedCallback() {
        if (!this.enabled) return;
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this.callback();
        }, 150);
    }
    
    start(target) {
        this.stop(); // Clean up previous instances to prevent memory leaks
        this.enabled = true;
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('seamless-quad-observer', 'ytd-watch-flexy ytd-compact-video-renderer, ytd-watch-flexy ytd-rich-item-renderer, ytd-watch-flexy', () => {
                this._debouncedCallback();
            }, true);
        }
        
        // Resize Observer is still needed because sharedObserver does not track layout resizes
        this.resizeObserver = new ResizeObserver(() => {
            this._debouncedCallback();
        });
        this.resizeObserver.observe(target);
        
        this.logger.info('Quad-Observer System Armed and Guarding via sharedObserver.');
    }
    
    stop() {
        this.enabled = false;
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('seamless-quad-observer');
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }
}
