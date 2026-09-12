/**
 * @file search-redesign.js
 * @description Orchestrates the layout of the YouTube search page grid.
 * Safely maps search results into a clean grid view.
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
                             this._settings.hideSearchShelves || 
                             this._settings.hideChannelCards || 
                             this._settings.autoVideoFilter ||
                             (this._settings.searchLayout && this._settings.searchLayout !== 'regular');
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
            
            // Apply the selected search layout size via data attribute (used by search list mode)
            const layoutSize = this._settings.searchLayout || 'regular';
            document.body.setAttribute('data-ypp-search-layout', layoutSize);

            if (this._settings.searchGrid) {
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
                }
            }

        } else {
            this._searchObserver?.stop();
            this._removeClasses();
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
