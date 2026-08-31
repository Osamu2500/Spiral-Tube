/**
 * Search Redesign — Orchestrator
 * Owns: enable/disable lifecycle, SPA navigation handling, and view-mode toggle.
 * Delegates observation/processing to SearchObserver and filter logic to SearchFilter.
 * Does not affect unrelated files/functionality outside its scope.
 *
 * Architecture:
 * - Uses a distinct "Grid Mode" (ypp-search-grid-mode) on body.
 * - Hides Shorts via CSS for performance/stability.
 * - Implements a responsive CSS Grid for results.
 * - Features a persistent View Toggle (Grid/List).
 */

import '../../../core/system/base-feature.js';

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
        GRID_CONTAINER:  'ypp-grid-container',
        GRID_ITEM:       'ypp-grid-item',
        FULL_WIDTH:      'ypp-full-width-item',
    };

    /** Layout sizes for grid configuration */
    static LAYOUT_CLASSES = []; // Deprecated: Now uses data-ypp-search-layout attribute

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    constructor() {
        super('searchGrid');
        /** @type {boolean} Feature enabled state */
        this._isEnabled  = false;

        /** @type {Object} Current user settings */
        this._settings   = {};

        /** @type {Object} The dedicated mutation observer for search */
        this._searchObserver = window.YPP.features.SearchObserver ? new window.YPP.features.SearchObserver() : null;

        // Bind dynamic CSS adapter
        this._adaptCardStylesToGrid = this._adaptCardStylesToGrid.bind(this);
        this._cardStyleObserver = null;

        // Bind navigation handler once
        this._handleNavigation = this._handleNavigation.bind(this);
    }

    /**
     * Called by FeatureManager on first load with persisted settings.
     * @param {Object} settings
     */
    async init(settings) {
        this._settings = settings || {};

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
        this._searchObserver?.resetProcessedNodes();

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
            this.addListener(window, 'yt-navigate-finish', this._handleNavigation);

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

        this._searchObserver?.stop();

        document.body.removeAttribute('data-ypp-search-layout');
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
            this._searchObserver?.resetProcessedNodes();

            // Push fresh state into sub-modules before they act
            this._searchObserver?.sync(
                this._settings,
                () => this._isEnabled,
                SearchRedesign.CLASSES
            );
            if (this._settings.searchGrid || this._settings.hideSearchShelves || this._settings.hideChannelCards || this._settings.cleanSearch || this._settings.searchLayout) {
                // Apply the selected search layout size via data attribute
                const layoutSize = this._settings.searchLayout || 'regular';
                document.body.setAttribute('data-ypp-search-layout', layoutSize);

                this._searchObserver?.start('ytd-search');
            } else {
                // ── CARD STYLE FALLBACK:
                // Some card styles (e.g. immersive) need a body class on
                // search pages to activate their CSS, even when Search Grid is OFF.
                // Check if the active card style requires search-page context and
                // activate a minimal list-mode + observer without the full grid layout.
                const activeCardStyle = document.documentElement.getAttribute('data-ypp-card-style');
                const LAYOUT_AWARE_CARD_STYLES = new Set(['immersive']);

                if (activeCardStyle && LAYOUT_AWARE_CARD_STYLES.has(activeCardStyle)) {
                    this._searchObserver?.start('ytd-search');
                    this._log(`Card style "${activeCardStyle}" activated search list-mode fallback`, 'info');
                }
            }

        } else {
            this._searchObserver?.stop();
            this._removeClasses();
            this._stopCardStyleObserver();
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

        // Only skip when there is truly no style to adapt
        if (!styleId || styleId === 'none') {
            const styleTag = document.getElementById('ypp-search-grid-dynamic-compat');
            if (styleTag) styleTag.remove();
            return;
        }

        // 'default' is bundled in the main CSS and has its own search compat file.
        // No dynamic CSS fetching needed — just ensure the dynamic tag is cleared.
        if (styleId === 'default') {
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
            const url = chrome.runtime.getURL(`dist/card-styles/${styleId}.css`);
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
        const staleClasses = ['ypp-noise-section', 'ypp-flattened-container', 'ypp-flattened-grid'];

        staleClasses.forEach(cls => {
            document.querySelectorAll(`.${cls}`).forEach(el => el.classList.remove(cls));
        });

        // Also remove any inline display:none we set directly on nodes
        document.querySelectorAll('ytd-item-section-renderer, ytd-shelf-renderer').forEach(el => {
            if (el.style.display === 'none') el.style.display = '';
        });

        // Ensure body classes do not leak to non-search pages
        this._removeClasses();
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
        // Remove layout attribute
        document.body.removeAttribute('data-ypp-search-layout');
    }
}

// Expose to global namespace for FeatureManager
window.YPP.features.SearchRedesign = SearchRedesign;
