/**
 * Search Redesign — Orchestrator
 * Owns: enable/disable lifecycle, SPA navigation handling, and view-mode toggle.
 * Delegates observation/processing to SearchObserver and filter logic to SearchFilter.
 *
 * Architecture:
 * - Uses a distinct "Grid Mode" (ypp-search-grid-mode) on body.
 * - Hides Shorts via CSS for performance/stability.
 * - Implements a responsive CSS Grid for results.
 * - Features a persistent View Toggle (Grid/List).
 */

export class SearchRedesign extends window.YPP.features.BaseFeature {
    static featureId = 'searchRedesign';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'searchGrid'; }

    // =========================================================================
    // CONSTANTS & CONFIG
    // =========================================================================

    /** CSS classes used for styling and state management */
    static CLASSES = {
        GRID_MODE:       'ypp-search-grid-mode',
        LIST_MODE:       'ypp-search-list-mode',
        GRID_CONTAINER:  'ypp-search-grid-container',
        GRID_ITEM:       'ypp-grid-item',
        FULL_WIDTH:      'ypp-full-width-item',
        HIDDEN_SHORT:    'ypp-hidden-short',
        TOGGLE_BTN:      'ypp-toggle-btn',
        TOGGLE_CONTAINER:'ypp-view-mode-toggle',
        ACTIVE:          'active',
    };

    /** DOM selectors for targeting YouTube elements */
    static SELECTORS = {
        SEARCH_CONTAINER: 'ytd-search',
        SECTION_LIST:     'ytd-section-list-renderer',
        ITEM_SECTION:     'ytd-item-section-renderer',
        CONTENTS:         '#contents',
        FILTER_HEADER:    'ytd-search-sub-menu-renderer',
        TOOLS_CONTAINER:  '#filter-menu',
        VIDEO:            'ytd-video-renderer',
        PLAYLIST:         'ytd-playlist-renderer',
        CHANNEL:          'ytd-channel-renderer',
        SHELF:            'ytd-shelf-renderer',
        RADIO:            'ytd-radio-renderer',
        REEL_SHELF:       'ytd-reel-shelf-renderer',
        RICH_SHELF:       'ytd-rich-shelf-renderer',
    };

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    constructor() {
        super('searchGrid');
        /** @type {boolean} Feature enabled state */
        this._isEnabled  = false;

        /** @type {Object} Current user settings */
        this._settings   = {};

        /** @type {boolean} Batching guard (legacy compat) */
        this._batching   = false;

        /** @type {string|null} Last seen query (nav-away reset) */
        this._lastQuery  = null;

        // ── Sub-modules ────────────────────────────────────────────────────
        this._searchObserver = new window.YPP.features.SearchObserver();
        this._searchFilter   = new window.YPP.features.SearchFilter();
        this._searchViewMode = new window.YPP.features.SearchViewMode();

        // Bind navigation handler once
        this._handleNavigation = this._handleNavigation.bind(this);
        
        // Bind dynamic CSS adapter
        this._adaptCardStylesToGrid = this._adaptCardStylesToGrid.bind(this);
        this._cardStyleObserver = null;
    }

    /**
     * Called by FeatureManager on first load with persisted settings.
     * @param {Object} settings
     */
    async init(settings) {
        this._settings = settings || {};

        this._searchViewMode.sync(SearchRedesign.CLASSES, this._log.bind(this));
        await this._searchViewMode.init();

        if (this._settings.searchGrid || this._settings.autoVideoFilter) {
            this.enable();
        } else {
            this.disable();
        }
    }

    /**
     * FeatureManager entry point — called on every settings update / navigation.
     * @param {Object} settings
     */
    run(settings) {
        this._settings = settings || {};

        // Reset processed-node cache so a fresh page starts clean
        this._searchObserver.resetProcessedNodes();
        this._searchFilter.update(this._settings);
        
        this._searchViewMode.run();

        const shouldEnable = this._settings.searchGrid || 
                             this._settings.cleanSearch || 
                             this._settings.hideSearchShelves || 
                             this._settings.hideChannelCards || 
                             this._settings.autoVideoFilter;
        if (shouldEnable) {
            this.enable();
        } else {
            this.disable();
        }
    }

    // =========================================================================
    // LIFECYCLE
    // =========================================================================

    /** Enable the feature, wire navigation listener, process current page. */
    enable() {
        if (this._isEnabled) {
            // Already enabled — re-process in case settings changed
            this._handleNavigation();
            return;
        }
        
        try {
            this._isEnabled = true;
            
            // Fix: Sync classes for search view mode, since init() is bypassed by BaseFeature update()
            this._searchViewMode.sync(SearchRedesign.CLASSES, this._log.bind(this));

            this.addListener(window, 'yt-navigate-finish', this._handleNavigation);

            this._searchViewMode.enable();

            this._handleNavigation();
            this._startCardStyleObserver();
            this._log('SearchRedesign enabled', 'info');
        } catch (e) {
            this._log('Error enabling SearchRedesign: ' + e.message, 'error');
        }
    }

    /** Disable the feature and clean up. */
    disable() {
        if (!this._isEnabled) return;
        this._isEnabled = false;

        this._searchObserver.stop();
        this._searchViewMode.disable();

        document.body.classList.remove(
            SearchRedesign.CLASSES.GRID_MODE,
            SearchRedesign.CLASSES.LIST_MODE,
            'ypp-search-layout-dense',
            'ypp-search-layout-compact',
            'ypp-search-layout-regular',
            'ypp-search-layout-spacious',
            'ypp-search-layout-expanded'
        );
        document.body.classList.remove('ypp-filter-pending');
        
        this._purgeStaleClasses();
        this._stopCardStyleObserver();

        super.disable();
    }

    // =========================================================================
    // NAVIGATION
    // =========================================================================

    /**
     * Handle SPA navigation — delegate work to sub-modules.
     * @private
     */
    _handleNavigation() {
        if (!this._isEnabled) return;

        const isSearch = window.location.pathname === '/results';

        if (isSearch) {
            // ── STALE CARD FIX: Wipe all our old CSS classes from DOM before
            //    re-processing. YouTube reuses the same ytd-item-section-renderer
            //    nodes across SPA navigations, so without this, old cards from the
            //    previous query stay "processed" and new cards never get classified.
            this._purgeStaleClasses();

            // Reset processed-node WeakSet so every node is treated as new
            this._searchObserver.resetProcessedNodes();

            // Push fresh state into sub-modules before they act
            this._searchObserver.sync(
                this._settings,
                () => this._isEnabled,
                SearchRedesign.CLASSES
            );
            this._searchFilter.update(this._settings);

            if (this._settings.searchGrid || this._settings.hideSearchShelves || this._settings.hideChannelCards || this._settings.cleanSearch || this._settings.searchLayout) {
                if (this._settings.searchGrid) {
                    this._searchViewMode.applyViewMode();
                } else {
                    document.body.classList.add(SearchRedesign.CLASSES.LIST_MODE);
                }

                // Apply the selected search layout size class
                const layoutSize = this._settings.searchLayout || 'regular';
                document.body.classList.add('ypp-search-layout-' + layoutSize);

                this._searchObserver.start(SearchRedesign.SELECTORS.SEARCH_CONTAINER);
            } else {
                // ── CARD STYLE FALLBACK:
                // Some card styles (e.g. immersive-glass) need a body class on
                // search pages to activate their CSS, even when Search Grid is OFF.
                // Check if the active card style requires search-page context and
                // activate a minimal list-mode + observer without the full grid layout.
                const activeCardStyle = document.documentElement.getAttribute('data-ypp-card-style');
                const LAYOUT_AWARE_CARD_STYLES = new Set(['immersive-glass']);

                if (activeCardStyle && LAYOUT_AWARE_CARD_STYLES.has(activeCardStyle)) {
                    document.body.classList.add(SearchRedesign.CLASSES.LIST_MODE);
                    this._searchObserver.start(SearchRedesign.SELECTORS.SEARCH_CONTAINER);
                    this._log(`Card style "${activeCardStyle}" activated search list-mode fallback`, 'info');
                }
            }

        } else {
            this._searchObserver.stop();
            this._removeClasses();
            this._stopCardStyleObserver();
            this._lastQuery = null;
        }
    }

    /**
     * Start observing for card style changes to instantly update grid styling.
     * @private
     */
    _startCardStyleObserver() {
        if (!this._isEnabled || this._cardStyleObserver) return;
        
        this._cardStyleObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-ypp-card-style') {
                    this._adaptCardStylesToGrid();
                    break;
                }
            }
        });

        this._cardStyleObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-ypp-card-style']
        });
        
        // Initial run
        this._adaptCardStylesToGrid();
    }

    /**
     * Stop observing card style changes.
     * @private
     */
    _stopCardStyleObserver() {
        if (this._cardStyleObserver) {
            this._cardStyleObserver.disconnect();
            this._cardStyleObserver = null;
        }
        
        const styleTag = document.getElementById('ypp-search-grid-dynamic-compat');
        if (styleTag) styleTag.remove();
    }

    /**
     * Dynamically generates CSS to adapt any active card style to the search grid.
     * Fetches the current card style CSS, duplicates rules for `#details` and `#meta`,
     * and remaps them to `.text-wrapper` so they perfectly map to `ytd-video-renderer`.
     * @private
     */
    async _adaptCardStylesToGrid() {
        const styleId = document.documentElement.getAttribute('data-ypp-card-style');
        if (!styleId || styleId === 'default' || styleId === 'none') {
            const styleTag = document.getElementById('ypp-search-grid-dynamic-compat');
            if (styleTag) styleTag.remove();
            return;
        }

        let styleTag = document.getElementById('ypp-search-grid-dynamic-compat');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'ypp-search-grid-dynamic-compat';
            document.head.appendChild(styleTag);
        }

        try {
            const url = chrome.runtime.getURL(`src/content/ui-styles/${styleId}/card-style.css`);
            const response = await fetch(url);
            const cssText = await response.text();

            let adaptedCss = `/* DYNAMIC SEARCH GRID ADAPTER FOR: ${styleId} */\n`;
            const rules = cssText.match(/[^}]+}/g) || [];
            
            for (let rule of rules) {
                if (rule.trim().length === 0) continue;
                
                // We only need to remap internal structural rules. The outer card
                // is already styled via :is(..., .ypp-grid-item, ...) in the themes!
                if (rule.includes('#details') || rule.includes('#meta')) {
                    // Remap #details to .text-wrapper, and #meta to .text-wrapper.
                    let newRule = rule.replace(/#details/g, '.text-wrapper').replace(/#meta/g, '.text-wrapper');
                    
                    // Scope it to search grid to avoid accidentally leaking to other pages
                    // (even though ytd-video-renderer mostly exists on search).
                    adaptedCss += `body.ypp-search-grid-mode ${newRule}\n`;
                }
            }

            styleTag.textContent = adaptedCss;
            this._log(`Generated dynamic grid compat for ${styleId}`, 'info');
        } catch (e) {
            this._log('Failed to adapt card style: ' + e.message, 'error');
        }
    }

    /**
     * Remove all our injected classes from the live DOM so that when YouTube
     * reuses the same elements for a new query they start completely clean.
     * @private
     */
    _purgeStaleClasses() {
        const { GRID_CONTAINER, GRID_ITEM, FULL_WIDTH, HIDDEN_SHORT } = SearchRedesign.CLASSES;
        const staleClasses = [GRID_CONTAINER, GRID_ITEM, FULL_WIDTH, HIDDEN_SHORT,
                              'ypp-noise-section', 'ypp-flattened-container', 'ypp-flattened-grid'];

        staleClasses.forEach(cls => {
            document.querySelectorAll(`.${cls}`).forEach(el => el.classList.remove(cls));
        });

        // Also remove any inline display:none we set directly on nodes
        document.querySelectorAll('ytd-item-section-renderer, ytd-shelf-renderer').forEach(el => {
            if (el.style.display === 'none') el.style.display = '';
        });

        // Ensure body classes do not leak to non-search pages
        document.body.classList.remove(
            SearchRedesign.CLASSES.GRID_MODE,
            SearchRedesign.CLASSES.LIST_MODE,
            'ypp-search-layout-dense',
            'ypp-search-layout-compact',
            'ypp-search-layout-regular',
            'ypp-search-layout-spacious',
            'ypp-search-layout-expanded'
        );
    }

    // =========================================================================
    // UTILITIES
    // =========================================================================

    _log(msg, level = 'info') {
        if (window.YPP?.Utils?.log) {
            window.YPP.Utils.log(msg, 'SEARCH', level);
        } else {
            console[level]?.(`[SearchRedesign] ${msg}`);
        }
    }

    _removeClasses() {
        document.body.classList.remove(
            SearchRedesign.CLASSES.GRID_MODE,
            SearchRedesign.CLASSES.LIST_MODE,
            'ypp-search-layout-dense',
            'ypp-search-layout-compact',
            'ypp-search-layout-regular',
            'ypp-search-layout-spacious',
            'ypp-search-layout-expanded'
        );
    }
}

// Expose to global namespace for FeatureManager

window.YPP.features.SearchRedesign = SearchRedesign;
