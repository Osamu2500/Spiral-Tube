import '../../../core/system/base-feature.js';

export class SubscriptionsBar extends window.YPP.features.BaseFeature {
    static featureId = 'subscriptionsBar';
    static executionPhase = 'idle';
    static priority = 1; // High priority so it loads early

    getConfigKey() {
        return null; // Always enabled
    }

    constructor() {
        super('SubscriptionsBar');
    }

    async enable() {
        await super.enable();
        
        this.observer.register('subBarPageObs', 'ytd-browse[page-subtype="subscriptions"]', () => {
            this.injectBar();
        });
        this.observer.start();
        
        if (window.location.pathname === '/feed/subscriptions') {
            this.injectBar();
        }
    }

    async disable() {
        await super.disable();
        this.observer.unregister('subBarPageObs');
        this.removeBar();
    }

    injectBar() {
        if (document.getElementById('ypp-subscriptions-bar')) return;
        
        const container = document.querySelector('ytd-browse[page-subtype="subscriptions"]');
        if (!container) return;

        const bar = document.createElement('div');
        bar.id = 'ypp-subscriptions-bar';
        
        container.appendChild(bar);
    }

    removeBar() {
        document.getElementById('ypp-subscriptions-bar')?.remove();
    }
}
