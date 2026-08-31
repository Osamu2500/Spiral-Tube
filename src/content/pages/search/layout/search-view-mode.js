/**
 * Search View Mode
 * Owns the state and logic for toggling between "Grid" and "List"
 * layout views on the search results page.
 * Does not affect unrelated files/functionality outside its scope.
 */

export class SearchViewMode {
    static featureId = 'searchViewMode';
    static executionPhase = 'idle';
    static priority = 999;

    static MODES = {
        GRID: 'grid',
        LIST: 'list'
    };

    static CLASSES = {
        GRID_MODE: 'ypp-search-grid-mode',
        LIST_MODE: 'ypp-search-list-mode'
    };

    constructor() {
        this._settings = {};
        this._isEnabled = false;
    }

    async init(settings) {
        this._settings = settings || {};
    }

    run(settings) {
        this._settings = settings || {};
        if (this._isEnabled) {
            this.applyViewMode();
        }
    }

    enable() { 
        this._isEnabled = true;
        this.applyViewMode(); 
    }
    
    disable() {
        this._isEnabled = false;
        this._resetClasses(document.body);
    }

    applyViewMode() {
        const body = document.body;

        const isSearch = window.location.pathname === '/results';
        if (!isSearch) {
            this._resetClasses(body);
            return;
        }

        // Use searchGrid setting as base, override with searchViewMode if explicitly set
        const baseGridEnabled = !!this._settings.searchGrid;
        const mode = this._settings.searchViewMode || (baseGridEnabled ? SearchViewMode.MODES.GRID : SearchViewMode.MODES.LIST);

        if (mode === SearchViewMode.MODES.GRID) {
            body.classList.add(SearchViewMode.CLASSES.GRID_MODE);
            body.classList.remove(SearchViewMode.CLASSES.LIST_MODE);
        } else {
            body.classList.add(SearchViewMode.CLASSES.LIST_MODE);
            body.classList.remove(SearchViewMode.CLASSES.GRID_MODE);
        }
    }

    _resetClasses(body) {
        body.classList.remove(SearchViewMode.CLASSES.GRID_MODE, SearchViewMode.CLASSES.LIST_MODE);
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.SearchViewMode = SearchViewMode;
