import '../../../core/system/base-feature.js';
/**
 * @fileoverview
 * Search View Mode
 * 
 * Target: /results route.
 * Purpose: Owns the state and logic for toggling between "Grid" and "List"
 * layout views on the search results page.
 */
export class SearchViewMode extends window.YPP.features.BaseFeature {
    static featureId = 'searchViewMode';
    static executionPhase = 'idle';
    static priority = 999;


    static MODES = {
        GRID: 'grid',
        LIST: 'list',
    };

    static CLASSES = {
        GRID_MODE: 'ypp-search-grid-mode',
        LIST_MODE: 'ypp-search-list-mode'
    };

    constructor() {
        super('searchViewMode');
        this._settings = {};
        this._isEnabled = false;
        this._logFn = ((msg, level) => console[level]?.(`[SearchViewMode] ${msg}`));
    }

    async init(settings) {
        this._settings = settings || {};
    }

    run(settings) {
        this._settings = settings || {};
        if (this._isEnabled) this.applyViewMode();
    }
    enable() { 
        this._isEnabled = true;
        this.applyViewMode(); 
    }
    
    disable() {
        this._isEnabled = false;
        document.body.classList.remove(SearchViewMode.CLASSES.GRID_MODE, SearchViewMode.CLASSES.LIST_MODE);
    }

    applyViewMode() {
        const body = document.body;

        const isSearch = window.location.pathname === '/results';
        if (!isSearch) {
            body.classList.remove(SearchViewMode.CLASSES.GRID_MODE, SearchViewMode.CLASSES.LIST_MODE);
            return;
        }

        // Use searchGrid setting as base, override with searchViewMode if explicitly set
        const baseGridEnabled = !!(this._settings.searchGrid || this._settings.cleanSearch || this._settings.hideSearchShelves || this._settings.hideChannelCards || this._settings.autoVideoFilter);
        const mode = this._settings.searchViewMode || (baseGridEnabled ? SearchViewMode.MODES.GRID : SearchViewMode.MODES.LIST);


        if (mode === SearchViewMode.MODES.GRID) {
            body.classList.add(SearchViewMode.CLASSES.GRID_MODE);
            body.classList.remove(SearchViewMode.CLASSES.LIST_MODE);
        } else {
            body.classList.add(SearchViewMode.CLASSES.LIST_MODE);
            body.classList.remove(SearchViewMode.CLASSES.GRID_MODE);
        }
    }
};

