import '../../core/system/base-feature.js';

export class FeedFilterBarLayout extends window.YPP.features.BaseFeature {
    static featureId = 'feedFilterBarLayout';
    static executionPhase = 'idle';
    static priority = 1; // High priority so it loads early

    getConfigKey() {
        return null; // Always enabled (feature logic is controlled by settings)
    }

    constructor() {
        super('FeedFilterBarLayout');
        this.pageSubtypes = ['home', 'subscriptions', 'history', 'channels'];
    }

    async enable() {
        await super.enable();
        
        // Wait for the grid renderer on any supported feed page
        const selectors = this.pageSubtypes.map(type => `ytd-browse[page-subtype="${type}"] ytd-rich-grid-renderer`).join(', ');
        
        this.observer.register('feedFilterBarLayoutObs', selectors, (node) => {
            this.injectBar(node);
        });
        this.observer.start();
        
        // Trigger initial check
        this.injectBar();
    }

    async disable() {
        await super.disable();
        this.observer.unregister('feedFilterBarLayoutObs');
        this.removeBar();
    }

    injectBar(targetNode = null) {
        if (document.getElementById('ypp-subscriptions-bar')) return;
        
        const selectors = this.pageSubtypes.map(type => `ytd-browse[page-subtype="${type}"]`).join(', ');
        const browse = document.querySelector(selectors);
        
        if (!browse) return;

        const bar = document.createElement('div');
        bar.id = 'ypp-subscriptions-bar'; // Keep the ID the same to avoid breaking other CSS
        
        // Append to the browse element so position: sticky works perfectly
        browse.insertBefore(bar, browse.firstChild);
    }

    removeBar() {
        document.getElementById('ypp-subscriptions-bar')?.remove();
    }
}
