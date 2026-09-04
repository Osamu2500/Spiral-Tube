import '../../core/system/base-feature.js';
/**
 * @file layout-manager.js
 * @description Layout Manager (Grid) Feature.
 * Enforces a configurable grid layout on the YouTube Home, Search, Channel,
 * and Subscriptions pages. optimized for performance using requestAnimationFrame and CSS classes.
 * 
 * Does not affect unrelated pages or player rendering.
 */
import '../../styles/base-ui-design/global/layouts/grid-layout.css';

export class GridLayoutManager extends window.YPP.features.BaseFeature {
    static featureId = 'gridLayoutManager';
    static executionPhase = 'idle';
    static priority = 999;

    /**
     * Configuration constants
     * @readonly
     */
    static CONFIG = {
        MAX_RETRIES: 5,
        BASE_RETRY_DELAY: 500,
        RETRY_BACKOFF_FACTOR: 1.5,
        DEBOUNCE_DELAY: 150,
        OBSERVER_THROTTLE: 100
    };

    /**
     * CSS selectors used by the layout manager
     * @readonly
     */
    static SELECTORS = {
        APP_CONTAINER: 'ytd-app',
        GRID_RENDERER: 'ytd-rich-grid-renderer, yt-rich-grid-renderer, yt-rich-grid-view-model',
        GRID_CONTENTS: '#contents',
        GRID_ITEMS: 'ytd-rich-item-renderer, ytd-rich-grid-media, yt-lockup-view-model, yt-rich-item-view-model'
    };

    constructor() {
        super('GridLayoutManager');
        this.CONSTANTS = window.YPP.CONSTANTS || {};
        this._initState();
    }

    /**
     * Initialize internal state
     * @private
     */
    _initState() {
        /** @type {number|null} RequestAnimationFrame ID */
        this._rafId = null;
        
        /** @type {number} Current retry attempt count */
        this._retryCount = 0;

        /** @type {WeakSet<Element>} Track processed containers to avoid reprocessing */
        this._processedContainers = new WeakSet();

        // Bind methods for performance
        this._boundApplyLayout = this.applyGridLayout.bind(this);
        this._debouncedApply = this._debouncedApply.bind(this);
    }

    /**
     * Feature configuration key — layout is always active (no toggle)
     */
    getConfigKey() {
        return null;
    }

    /**
     * Run the feature with given settings
     */
    async enable() {
        await super.enable();
        
        try {
            if (this.settings) {
                this.updateSettings(this.settings);
            }
            
            this._retryCount = 0;
            this.utils.log?.('Initializing grid layout...', 'LAYOUT');

            // Wait for grid to exist before applying
            const grid = await this.waitForElement(GridLayoutManager.SELECTORS.GRID_RENDERER, 10000);
            if (grid) {
                this.applyGridLayout();
            }

            this.startObserver();
            this.addResizeListener();
        } catch (e) {
            this.utils.log?.('Error enabling grid layout', 'LAYOUT', 'error', e);
        }
    }

    /**
     * Disable grid layout and cleanup resources
     */
    async disable() {
        await super.disable();
        this._cleanup();
        this.utils.log?.('Grid Layout Disabled', 'LAYOUT');
    }

    /**
     * Handle settings updates — debounced via RAF for smooth instant feedback
     */
    async onUpdate() {
        if (this.settings) {
            this.updateSettings(this.settings);
            // Force re-apply of grid structural styles when settings change
            this._processedContainers = new WeakSet();
            this._debouncedApply();
        }
    }

    /**
     * Update CSS custom properties based on settings.
     * These vars drive the CSS rules — they survive YouTube's Polymer property resets.
     * @param {Object} settings - User settings
     */
    updateSettings(settings) {
        if (!settings) return;
        
        const root = document.documentElement;
        
        // Consolidate updating CSS variables based on settings keys
        const columnSettingsMap = {
            homeColumns: ['--ypp-home-columns', '--ypp-active-columns'],
            searchColumns: ['--ypp-search-columns'],
            subscriptionsColumns: ['--ypp-subscriptions-columns'],
            channelColumns: ['--ypp-channel-columns'],
            historyColumns: ['--ypp-history-columns']
        };

        for (const [settingKey, cssVars] of Object.entries(columnSettingsMap)) {
            const cols = Number(settings[settingKey] || 0);
            cssVars.forEach(cssVar => {
                if (cols > 0) {
                    root.style.setProperty(cssVar, cols);
                } else {
                    root.style.removeProperty(cssVar);
                }
            });
        }
    }

    /**
     * Start central DOMObserver to watch for grid changes
     */
    startObserver() {
        this.observer.register(
            'layout-manager',
            'ytd-rich-grid-renderer, ytd-rich-item-renderer, ytd-continuation-item-renderer',
            this._debouncedApply,
            false
        );

        this.utils.log?.('Observer started via DOMObserver', 'LAYOUT', 'debug');
    }

    /**
     * Add window resize listener with debouncing
     */
    addResizeListener() {
        const resizeListener = this.utils.debounce(this._boundApplyLayout, GridLayoutManager.CONFIG.DEBOUNCE_DELAY);
        this.addListener(window, 'resize', resizeListener);
    }

    /**
     * Apply grid layout to the current page's grid renderer.
     * @returns {boolean} True if layout was successfully applied
     */
    applyGridLayout() {
        if (!this._isValidPage(window.location.pathname)) return false;

        // Skip if cinematic mode is active
        if (document.body.classList.contains('cinematic-home') || document.body.classList.contains('cinematic')) {
            this._cleanup();
            return false;
        }

        const gridRenderer = document.querySelector(GridLayoutManager.SELECTORS.GRID_RENDERER);
        if (!gridRenderer) return false;

        const contents = gridRenderer.querySelector(GridLayoutManager.SELECTORS.GRID_CONTENTS);
        if (!contents) return false;

        const path = window.location.pathname;
        const cols = this._determineColumnCount(path);

        this.utils.log?.('applyGridLayout cols=' + cols + ' path=' + path, 'LAYOUT');

        // guard clause
        if (!cols || cols === 0) {
            this._resetContainerStyles(contents);
            return true;
        }

        this._applyItemClasses(contents);

        // Performance: skip if already processed at the same column count
        if (this._processedContainers.has(contents)) {
            const lastCols = parseInt(contents.getAttribute('data-ypp-cols'), 10);
            if (lastCols !== cols || !contents.style.gridTemplateColumns) {
                this._setContainerStyles(contents, cols);
            }
            return true;
        }

        // First-time apply
        contents.classList.add('ypp-grid-container');
        this._setContainerStyles(contents, cols);
        this._processedContainers.add(contents);

        return true;
    }

    // ─── PRIVATE HELPERS ───────────────────────────────────────────────────

    /**
     * Apply layout changes using RAF for smooth updates
     * @private
     */
    _debouncedApply() {
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
        }
        
        this._rafId = requestAnimationFrame(() => {
            this.applyGridLayout();
            this._rafId = null;
        });
    }

    /**
     * Check if current page should have grid layout
     * @private
     */
    _isValidPage(path) {
        return path === '/' || 
               path === '/index' || 
               path.startsWith('/channel') || 
               path.startsWith('/c/') || 
               path.startsWith('/@') ||
               path === '/feed/subscriptions' ||
               path === '/feed/history' ||
               path.startsWith('/results');
    }

    /**
     * Determine the number of columns to use based on the current page path
     * @private
     * @param {string} path - current window pathname
     * @returns {number} column count
     */
    _determineColumnCount(path) {
        if (path.startsWith('/@') || path.startsWith('/channel') || path.startsWith('/c/')) {
            return Number(this.settings?.channelColumns || 4);
        }
        if (path.startsWith('/results')) {
            return Number(this.settings?.searchColumns || 4);
        }
        if (path === '/feed/subscriptions') {
            return Number(this.settings?.subscriptionsColumns || 4);
        }
        if (path === '/feed/history') {
            return Number(this.settings?.historyColumns || 4);
        }
        
        // Home page logic
        const manualCols = Number(this.settings?.homeColumns || 0);
        if (manualCols > 0) {
            // Manual override wins — ignore AutoScaleGrid entirely
            return manualCols;
        }
        
        // Auto mode: read --ypp-dynamic-cols published by AutoScaleGrid
        const dynamicCols = document.documentElement.style.getPropertyValue('--ypp-dynamic-cols');
        return dynamicCols ? parseInt(dynamicCols, 10) : 4;
    }

    /**
     * Resets the container styles to default
     * @private
     */
    _resetContainerStyles(contents) {
        contents.classList.remove('ypp-grid-container');
        contents.style.removeProperty('grid-template-columns');
        contents.style.removeProperty('grid-auto-flow');
        contents.removeAttribute('data-ypp-cols');
        this._processedContainers.delete(contents);
    }

    /**
     * Applies correct CSS styles and data attributes to the container
     * @private
     */
    _setContainerStyles(contents, cols) {
        contents.setAttribute('data-ypp-cols', cols);
        contents.style.setProperty('grid-template-columns', `repeat(${cols}, minmax(0, 1fr))`, 'important');
        contents.style.setProperty('grid-auto-flow', 'dense', 'important');
        
        const manualCols = Number(this.settings?.homeColumns || 0);
        if (manualCols > 0) {
            document.documentElement.style.setProperty('--ypp-active-columns', cols);
            document.documentElement.style.removeProperty('--ypp-dynamic-cols');
        } else {
            document.documentElement.style.removeProperty('--ypp-active-columns');
        }
        
        document.documentElement.style.setProperty('--ypp-grid-column-min', `${Math.floor(100 / cols)}vw`);
    }

    /**
     * Applies standard classes to the grid items
     * @private
     */
    _applyItemClasses(contents) {
        const items = contents.querySelectorAll(GridLayoutManager.SELECTORS.GRID_ITEMS);
        items.forEach(item => {
            // Skip nested renderers or items inside a shelf
            if (item.closest('ytd-rich-shelf-renderer, ytd-rich-section-renderer, ytd-reel-shelf-renderer')) {
                item.classList.remove('ypp-grid-item');
                return;
            }
            if (item.parentElement && item.parentElement.closest('.ypp-grid-item')) {
                item.classList.remove('ypp-grid-item');
                return;
            }
            if (!item.classList.contains('ypp-grid-item')) {
                item.classList.add('ypp-grid-item');
            }
        });
    }

    /**
     * Cleanup all resources and event listeners
     * @private
     */
    _cleanup() {
        if (this.observer) {
            this.observer.unregister('layout-manager');
        }

        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }

        this._processedContainers = new WeakSet();

        const containers = document.querySelectorAll('.ypp-grid-container, #contents[data-ypp-cols]');
        containers.forEach(el => this._resetContainerStyles(el));
        
        const items = document.querySelectorAll('.ypp-grid-item');
        items.forEach(el => el.classList.remove('ypp-grid-item'));

        this.utils.log?.('Cleanup complete', 'LAYOUT', 'debug');
    }
};

window.YPP.features.GridLayoutManager = GridLayoutManager;
