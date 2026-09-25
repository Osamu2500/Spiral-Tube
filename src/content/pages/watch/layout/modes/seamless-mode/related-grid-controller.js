import { 
    DynamicCSSMatrixEngine, 
    ShadowDOMPiercingEngine, 
    PolymerDataOverrider, 
    QuadObserverSystem 
} from './engines/index.js';

/**
 * @fileoverview
 * Related Grid Controller
 * Analyzes the DOM in real-time to discover asynchronous video cards,
 * traces their origin, and mathematically computes a grid structure.
 * Refactored to eliminate layout thrashing by batching DOM writes.
 */
export class RelatedGridController {
    static TARGET_SELECTORS = 'ytd-compact-video-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer, ytd-rich-item-renderer';

    /**
     * @param {Object} parentFeature - The parent seamless mode feature instance
     */
    constructor(parentFeature) {
        this.utils = parentFeature.utils;
        this.parentFeature = parentFeature;
        this.isEnabled = false;
        this.enforcementInterval = null;
        this.knownGridContainers = new Set();
        this.virtualDOMRegistry = new WeakMap();
        this.metrics = {
            totalEnforcementCycles: 0,
            videosRestructured: 0,
            lastCycleTime: 0
        };
        
        // Initialize the engines
        this.cssEngine = new DynamicCSSMatrixEngine(this.utils);
        this.shadowPiercer = new ShadowDOMPiercingEngine(this.utils);
        this.polymerOverrider = new PolymerDataOverrider(this.utils);
        this.quadObserver = new QuadObserverSystem(this.utils, () => this.enforceGrid());
    }

    enable() {
        if (this.isEnabled) return;
        this.isEnabled = true;
        
        const cols = this.getColumnsSetting();
        this.cssEngine.inject(cols);
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.register('seamless-grid-container', 'ytd-watch-flexy', (elements) => {
                const watchFlexy = elements[0];
                if (watchFlexy) {
                    this.quadObserver.start(watchFlexy);
                }
            }, true);
        }
        
        this.utils.log('RelatedGridController Enabled', 'seamlessMode', 'info');
    }

    disable() {
        if (!this.isEnabled) return;
        this.isEnabled = false;
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('seamless-grid-container');
        }
        
        this.quadObserver.stop();
        this.cssEngine.remove();
        this.cleanup();
        this.utils.log('RelatedGridController Disabled', 'seamlessMode', 'info');
    }

    getColumnsSetting() {
        try {
            if (this.parentFeature?.settings?.seamlessModeGridCols) {
                return parseInt(this.parentFeature.settings.seamlessModeGridCols, 10) || 4;
            }
        } catch (error) {
            this.utils.log('Failed to read seamlessModeGridCols setting', 'seamlessMode', 'warn');
        }
        return 4; // default
    }

    /**
     * Reads all necessary DOM elements for a video card before any writes occur.
     */
    readVideoCardState(item) {
        return {
            innerDiv: item.querySelector('#dismissible') || item.querySelector('.details')?.parentElement,
            thumbnail: item.querySelector('ytd-thumbnail'),
            details: item.querySelector('.details') || item.querySelector('.metadata'),
            meta: item.querySelector('.secondary-metadata') || item.querySelector('#metadata'),
            title: item.querySelector('#video-title') || item.querySelector('.video-title')
        };
    }

    /**
     * Applies DOM modifications in a batched manner to prevent layout thrashing.
     */
    writeVideoCardState(item, nodes, cols) {
        try {
            this.polymerOverrider.hackNode(item);
            this.shadowPiercer.pierceAndDestroy(item);

            item.style.setProperty('width', `calc((100% / ${cols}) - 16px)`, 'important');
            item.style.setProperty('margin', '8px', 'important');
            item.style.setProperty('padding', '0', 'important');
            item.style.setProperty('display', 'inline-block', 'important');
            item.style.setProperty('vertical-align', 'top', 'important');
            item.style.setProperty('font-size', '14px', 'important');
            item.style.setProperty('float', 'none', 'important');
            
            if (nodes.innerDiv) {
                nodes.innerDiv.style.setProperty('display', 'block', 'important');
                nodes.innerDiv.style.setProperty('width', '100%', 'important');
                nodes.innerDiv.style.setProperty('height', 'auto', 'important');
            }

            if (nodes.thumbnail) {
                nodes.thumbnail.style.setProperty('position', 'relative', 'important');
                nodes.thumbnail.style.setProperty('width', '100%', 'important');
                nodes.thumbnail.style.setProperty('min-width', '100%', 'important');
                nodes.thumbnail.style.setProperty('max-width', '100%', 'important');
                nodes.thumbnail.style.setProperty('height', 'auto', 'important');
                nodes.thumbnail.style.setProperty('aspect-ratio', '16/9', 'important');
                nodes.thumbnail.style.setProperty('margin-right', '0', 'important');
                nodes.thumbnail.style.setProperty('margin-bottom', '8px', 'important');
                nodes.thumbnail.style.setProperty('display', 'block', 'important');
                nodes.thumbnail.style.setProperty('flex', 'none', 'important');
            }

            if (nodes.details) {
                nodes.details.style.setProperty('position', 'relative', 'important');
                nodes.details.style.setProperty('padding-top', '4px', 'important');
                nodes.details.style.setProperty('padding-right', '0', 'important');
                nodes.details.style.setProperty('padding-left', '0', 'important');
                nodes.details.style.setProperty('width', '100%', 'important');
                nodes.details.style.setProperty('min-width', '100%', 'important');
                nodes.details.style.setProperty('display', 'block', 'important');
                nodes.details.style.setProperty('flex', 'none', 'important');
            }

            if (nodes.meta) {
                nodes.meta.style.setProperty('display', 'block', 'important');
                nodes.meta.style.setProperty('width', '100%', 'important');
                nodes.meta.style.setProperty('white-space', 'normal', 'important');
            }
            
            if (nodes.title) {
                nodes.title.style.setProperty('white-space', 'normal', 'important');
                nodes.title.style.setProperty('display', '-webkit-box', 'important');
                nodes.title.style.setProperty('-webkit-line-clamp', '2', 'important');
                nodes.title.style.setProperty('-webkit-box-orient', 'vertical', 'important');
                nodes.title.style.setProperty('overflow', 'hidden', 'important');
                nodes.title.style.setProperty('width', '100%', 'important');
                nodes.title.style.setProperty('margin-right', '0', 'important');
            }
            
            // Re-order DOM nodes if necessary (moving thumbnail above details)
            if (nodes.innerDiv && nodes.thumbnail && nodes.details) {
                const innerChildren = Array.from(nodes.innerDiv.children);
                if (innerChildren.indexOf(nodes.details) < innerChildren.indexOf(nodes.thumbnail)) {
                    nodes.innerDiv.insertBefore(nodes.thumbnail, nodes.details);
                }
            }
            
            this.virtualDOMRegistry.set(item, { restructured: true, lastCheck: Date.now() });
            this.metrics.videosRestructured++;
            
        } catch (error) {
            this.utils.log(`Failed to deeply process video card: ${error.message}`, 'seamlessMode', 'error');
        }
    }

    enforceGrid() {
        const startTime = performance.now();
        this.metrics.totalEnforcementCycles++;
        
        try {
            const watchFlexy = document.querySelector('ytd-watch-flexy');
            if (!watchFlexy) return;

            const compactItems = Array.from(watchFlexy.querySelectorAll(RelatedGridController.TARGET_SELECTORS));

            if (compactItems.length === 0) return;

            // PRE-CALCULATE (READ PHASE)
            const parentContainers = new Set();
            const itemsToProcess = [];
            
            compactItems.forEach(item => {
                if (item.parentElement && item.parentElement.tagName !== 'YTD-COMPACT-VIDEO-RENDERER') {
                    parentContainers.add(item.parentElement);
                }
                
                const state = this.virtualDOMRegistry.get(item);
                if (state && state.restructured === true && state.lastCheck > Date.now() - 1000) {
                    return; // Skip if recently processed
                }
                
                // Read all DOM state before modifying any styles
                const nodes = this.readVideoCardState(item);
                itemsToProcess.push({ item, nodes });
            });

            if (itemsToProcess.length === 0 && parentContainers.size === 0) return;

            const cols = this.getColumnsSetting();
            this.cssEngine.inject(cols); // Make sure CSS matches setting

            // BATCH MUTATIONS (WRITE PHASE)
            window.requestAnimationFrame(() => {
                parentContainers.forEach(container => {
                    // Check if node is still attached to DOM
                    if (!container.isConnected) return;
                    this.knownGridContainers.add(container);
                    container.style.setProperty('display', 'block', 'important');
                    container.style.setProperty('width', '100%', 'important');
                    container.style.setProperty('padding', '0', 'important');
                    container.style.setProperty('margin', '0', 'important');
                    container.style.setProperty('font-size', '0', 'important');
                    container.style.setProperty('text-align', 'left', 'important');
                });

                itemsToProcess.forEach(({ item, nodes }) => {
                    if (!item.isConnected) return; // Prevent memory leaks for detached items
                    this.writeVideoCardState(item, nodes, cols);
                });
            });
            
            // Periodically clean up Set to avoid memory leaks
            if (this.metrics.totalEnforcementCycles % 50 === 0) {
                this.knownGridContainers.forEach(container => {
                    if (!container.isConnected) this.knownGridContainers.delete(container);
                });
            }

        } catch (error) {
            this.utils.log(`Fatal error during Related Grid style enforcement: ${error.message}`, 'seamlessMode', 'error');
        } finally {
            this.metrics.lastCycleTime = performance.now() - startTime;
        }
    }

    cleanup() {
        try {
            this.cssEngine.remove();
            this.quadObserver.stop();
            
            this.knownGridContainers.forEach(container => {
                if (container && container.isConnected) container.removeAttribute('style');
            });
            this.knownGridContainers.clear();

            const watchFlexy = document.querySelector('ytd-watch-flexy');
            if (watchFlexy) {
                const compactItems = watchFlexy.querySelectorAll(RelatedGridController.TARGET_SELECTORS);
                
                window.requestAnimationFrame(() => {
                    compactItems.forEach(item => {
                        item.removeAttribute('style');
                        const innerDiv = item.querySelector('#dismissible');
                        if (innerDiv) innerDiv.removeAttribute('style');
                        const thumbnail = item.querySelector('ytd-thumbnail');
                        if (thumbnail) thumbnail.removeAttribute('style');
                        const details = item.querySelector('.details');
                        if (details) details.removeAttribute('style');
                        const title = item.querySelector('#video-title');
                        if (title) title.removeAttribute('style');
                        const meta = item.querySelector('.secondary-metadata');
                        if (meta) meta.removeAttribute('style');
                    });
                });
            }
        } catch (error) {
            this.utils.log(`Failed to cleanup RelatedGridController styles: ${error.message}`, 'seamlessMode', 'error');
        }
    }
}
