import { DynamicCSSMatrixEngine } from './dynamic-css-matrix-engine.js';
import { ShadowDOMPiercingEngine } from './shadow-dom-piercing-engine.js';
import { PolymerDataOverrider } from './polymer-data-overrider.js';
import { QuadObserverSystem } from './quad-observer-system.js';

/**
 * @fileoverview
 * Related Grid Controller
 * Analyzes the DOM in real-time to discover asynchronous video cards,
 * traces their origin, and mathematically computes a grid structure.
 */
export class RelatedGridController {
    constructor(logger) {
        this.logger = logger;
        this.enabled = false;
        this.enforcementInterval = null;
        this.knownGridContainers = new Set();
        this.virtualDOMRegistry = new WeakMap();
        this.metrics = {
            totalEnforcementCycles: 0,
            videosRestructured: 0,
            lastCycleTime: 0
        };
        
        // Initialize the engines
        this.cssEngine = new DynamicCSSMatrixEngine(logger);
        this.shadowPiercer = new ShadowDOMPiercingEngine(logger);
        this.polymerOverrider = new PolymerDataOverrider(logger);
        this.quadObserver = new QuadObserverSystem(logger, () => this.enforceGrid());
    }

    enable() {
        if (this.enabled) return;
        this.enabled = true;
        
        const cols = this.getColumnsSetting();
        this.cssEngine.inject(cols);
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('seamless-grid-container', 'ytd-watch-flexy', (elements) => {
                const watchFlexy = elements[0];
                if (watchFlexy) {
                    this.quadObserver.start(watchFlexy);
                }
            }, true);
        }
        
        this.logger.info('RelatedGridController Enabled');
    }

    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('seamless-grid-container');
        }
        
        this.quadObserver.stop();
        this.cssEngine.remove();
        this.cleanup();
        this.logger.info('RelatedGridController Disabled');
    }

    getColumnsSetting() {
        try {
            if (window.YPP && window.YPP.settings && window.YPP.settings.seamlessModeGridCols) {
                return window.YPP.settings.seamlessModeGridCols;
            }
        } catch (e) {
            this.logger.warn('Failed to read seamlessModeGridCols setting, defaulting to 4');
        }
        return 4; // default
    }

    processVideoCard(item, cols) {
        try {
            const state = this.virtualDOMRegistry.get(item);
            if (state && state.restructured === true && state.lastCheck > Date.now() - 1000) {
                return; // Skip if recently processed
            }

            this.polymerOverrider.hackNode(item);
            this.shadowPiercer.pierceAndDestroy(item);

            item.style.setProperty('width', `calc((100% / ${cols}) - 16px)`, 'important');
            item.style.setProperty('margin', '8px', 'important');
            item.style.setProperty('padding', '0', 'important');
            item.style.setProperty('display', 'inline-block', 'important');
            item.style.setProperty('vertical-align', 'top', 'important');
            item.style.setProperty('font-size', '14px', 'important');
            item.style.setProperty('float', 'none', 'important');
            
            const innerDiv = item.querySelector('#dismissible') || item.querySelector('.details')?.parentElement;
            if (innerDiv) {
                innerDiv.style.setProperty('display', 'block', 'important');
                innerDiv.style.setProperty('width', '100%', 'important');
                innerDiv.style.setProperty('height', 'auto', 'important');
            }

            const thumbnail = item.querySelector('ytd-thumbnail');
            if (thumbnail) {
                thumbnail.style.setProperty('position', 'relative', 'important');
                thumbnail.style.setProperty('width', '100%', 'important');
                thumbnail.style.setProperty('min-width', '100%', 'important');
                thumbnail.style.setProperty('max-width', '100%', 'important');
                thumbnail.style.setProperty('height', 'auto', 'important');
                thumbnail.style.setProperty('aspect-ratio', '16/9', 'important');
                thumbnail.style.setProperty('margin-right', '0', 'important');
                thumbnail.style.setProperty('margin-bottom', '8px', 'important');
                thumbnail.style.setProperty('display', 'block', 'important');
                thumbnail.style.setProperty('flex', 'none', 'important');
            }

            const details = item.querySelector('.details') || item.querySelector('.metadata');
            if (details) {
                details.style.setProperty('position', 'relative', 'important');
                details.style.setProperty('padding-top', '4px', 'important');
                details.style.setProperty('padding-right', '0', 'important');
                details.style.setProperty('padding-left', '0', 'important');
                details.style.setProperty('width', '100%', 'important');
                details.style.setProperty('min-width', '100%', 'important');
                details.style.setProperty('display', 'block', 'important');
                details.style.setProperty('flex', 'none', 'important');
            }

            const meta = item.querySelector('.secondary-metadata') || item.querySelector('#metadata');
            if (meta) {
                meta.style.setProperty('display', 'block', 'important');
                meta.style.setProperty('width', '100%', 'important');
                meta.style.setProperty('white-space', 'normal', 'important');
            }
            
            const title = item.querySelector('#video-title') || item.querySelector('.video-title');
            if (title) {
                title.style.setProperty('white-space', 'normal', 'important');
                title.style.setProperty('display', '-webkit-box', 'important');
                title.style.setProperty('-webkit-line-clamp', '2', 'important');
                title.style.setProperty('-webkit-box-orient', 'vertical', 'important');
                title.style.setProperty('overflow', 'hidden', 'important');
                title.style.setProperty('width', '100%', 'important');
                title.style.setProperty('margin-right', '0', 'important');
            }
            
            if (innerDiv && thumbnail && details) {
                const innerChildren = Array.from(innerDiv.children);
                if (innerChildren.indexOf(details) < innerChildren.indexOf(thumbnail)) {
                    innerDiv.insertBefore(thumbnail, details);
                }
            }
            this.virtualDOMRegistry.set(item, { restructured: true, lastCheck: Date.now() });
            this.metrics.videosRestructured++;
            
        } catch (error) {
            this.logger.error('Failed to deeply process video card', error);
        }
    }

    enforceGrid() {
        const startTime = performance.now();
        this.metrics.totalEnforcementCycles++;
        
        try {
            const watchFlexy = document.querySelector('ytd-watch-flexy');
            if (!watchFlexy) return;

            const compactItems = Array.from(watchFlexy.querySelectorAll(
                'ytd-compact-video-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer, ytd-rich-item-renderer'
            ));

            if (compactItems.length === 0) return;

            const parentContainers = new Set();
            compactItems.forEach(item => {
                if (item.parentElement && item.parentElement.tagName !== 'YTD-COMPACT-VIDEO-RENDERER') {
                    parentContainers.add(item.parentElement);
                }
            });

            const cols = this.getColumnsSetting();
            this.cssEngine.inject(cols); // Make sure CSS matches setting

            parentContainers.forEach(container => {
                this.knownGridContainers.add(container);
                container.style.setProperty('display', 'block', 'important');
                container.style.setProperty('width', '100%', 'important');
                container.style.setProperty('padding', '0', 'important');
                container.style.setProperty('margin', '0', 'important');
                container.style.setProperty('font-size', '0', 'important');
                container.style.setProperty('text-align', 'left', 'important');
            });

            for (let i = 0; i < compactItems.length; i++) {
                this.processVideoCard(compactItems[i], cols);
            }
        } catch (error) {
            this.logger.error('Fatal error during Related Grid style enforcement', error);
        } finally {
            this.metrics.lastCycleTime = performance.now() - startTime;
        }
    }

    cleanup() {
        try {
            this.cssEngine.remove();
            this.quadObserver.stop();
            
            this.knownGridContainers.forEach(container => {
                if (container) container.removeAttribute('style');
            });
            this.knownGridContainers.clear();

            const watchFlexy = document.querySelector('ytd-watch-flexy');
            if (watchFlexy) {
                const compactItems = watchFlexy.querySelectorAll(
                    'ytd-compact-video-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer, ytd-rich-item-renderer'
                );
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
            }
        } catch (error) {
            this.logger.error('Failed to cleanup RelatedGridController styles', error);
        }
    }
}
