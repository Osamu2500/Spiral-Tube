export class HideExplore extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hideExploreTopics';
    static executionPhase = 'idle';
    static priority = 101;

    constructor() {
        super('HideExplore');
        this._boundProcess = this._processNodes.bind(this);
        this._debounceTimer = null;
        this._boundSchedule = this._scheduleProcess.bind(this);
    }

    getConfigKey() {
        return 'hideExploreTopics';
    }

    async enable() {
        await super.enable();
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'hide-explore',
                'ytd-feed-filter-chip-bar-renderer, yt-chip-cloud-renderer, #chips-wrapper, ytd-rich-grid-renderer > #header, ytd-rich-section-renderer:has(yt-chip-cloud-renderer), ytd-rich-section-renderer:has(ytd-feed-filter-chip-bar-renderer), ytd-rich-section-renderer:has(yt-related-chip-cloud-renderer), ytd-rich-section-renderer:has(ytd-search-query-renderer)',
                this._boundProcess
            );
        }
        this.addListener(window, 'yt-page-data-updated', this._boundSchedule);
        this._scheduleProcess();
    }

    async disable() {
        await super.disable();
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
            this._debounceTimer = null;
        }
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('hide-explore');
        }
        const hiddenExplore = document.querySelectorAll('[data-ypp-explore="true"]');
        hiddenExplore.forEach(el => this._unhideElement(el));
        document.querySelectorAll('[data-ypp-explore-processed]').forEach(el => {
            el.removeAttribute('data-ypp-explore-processed');
        });
    }

    _scheduleProcess() {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this._debounceTimer = null;
            const nodes = document.querySelectorAll('ytd-feed-filter-chip-bar-renderer, yt-chip-cloud-renderer, #chips-wrapper, ytd-rich-grid-renderer > #header, ytd-rich-section-renderer');
            if (nodes.length > 0) this._processNodes(Array.from(nodes));
        }, 150);
    }

    _processNodes(nodes) {
        if (!this.isEnabled || !this._shouldRunOnCurrentPage()) return;
        
        nodes.forEach(node => {
            if (node.hasAttribute('data-ypp-explore-processed')) return;
            
            // Check if it's a section renderer that actually contains chips/explore topics
            if (node.tagName.toLowerCase() === 'ytd-rich-section-renderer') {
                const hasChips = node.querySelector('yt-chip-cloud-renderer, ytd-feed-filter-chip-bar-renderer, yt-related-chip-cloud-renderer, ytd-search-query-renderer');
                if (!hasChips) return;
            }

            node.setAttribute('data-ypp-explore-processed', 'true');
            this._hideElement(node);
        });
    }

    _hideElement(node) {
        if (!node) return;
        node.setAttribute('data-ypp-explore', 'true');
        node.classList.add('ypp-is-explore');
        node.style.setProperty('display', 'none', 'important');
    }

    _unhideElement(node) {
        if (!node) return;
        node.removeAttribute('data-ypp-explore');
        node.classList.remove('ypp-is-explore');
        node.style.removeProperty('display');
    }
};

window.YPP.features.HideExplore = HideExplore;
