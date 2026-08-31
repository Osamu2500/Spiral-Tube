/**
 * Search Page Manager
 * Orchestrates the search page features, handling activation,
 * deactivation, and settings distribution.
 * Affects ONLY the search page.
 */
import '../../core/system/base-page-manager.js';
import './layout/search-redesign.js';
import './layout/search-view-mode.js';
import './features/search-observer.js';

export class SearchPageManager extends window.YPP.BasePageManager {
    constructor(utils, settings) {
        super(utils, settings);
        this.matchPatterns = [/^\/results/];
        
        // Initialize features managed by this page
        this.features = {
            searchViewMode: window.YPP.features.SearchViewMode ? new window.YPP.features.SearchViewMode() : null,
            searchRedesign: window.YPP.features.SearchRedesign ? new window.YPP.features.SearchRedesign() : null
        };

        if (this.features.searchRedesign) {
            this.features.searchRedesign.init(this.settings);
        }
        if (this.features.searchViewMode) {
            this.features.searchViewMode.init(this.settings);
        }
    }

    onActivate() {
        this.utils.log('Search Page Active', 'SEARCH_MANAGER', 'info');

        // Mark body so search-specific CSS selectors activate (20+ rules depend on this class)
        document.body.classList.add('ypp-search-page');

        // Must call enable() — NOT run() — here.
        // SearchViewMode._isEnabled starts false; run() guards on it and silently no-ops,
        // meaning ypp-search-grid-mode would never be added to body and the CSS grid never fires.
        // enable() sets _isEnabled = true then calls applyViewMode() which reads settings internally.
        if (this.features.searchViewMode?.enable) {
            this.features.searchViewMode.enable();
        }
        if (this.features.searchRedesign?.enable) {
            this.features.searchRedesign.enable();
        }
    }

    onDeactivate() {
        this.utils.log('Search Page Deactivated', 'SEARCH_MANAGER', 'info');

        // Remove the search-page marker so its CSS selectors stop applying
        document.body.classList.remove('ypp-search-page');

        Object.values(this.features).forEach(feature => {
            if (feature?.disable) feature.disable();
        });
    }

    applySettings(settings) {
        this.settings = { ...this.settings, ...settings };
        
        // run() is correct here — features are already enabled, run() just updates settings
        if (this.features.searchViewMode) {
            this.features.searchViewMode.run(this.settings);
        }
        if (this.features.searchRedesign) {
            this.features.searchRedesign.run(this.settings);
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.managers = window.YPP.managers || {};
window.YPP.managers.SearchPageManager = SearchPageManager;
