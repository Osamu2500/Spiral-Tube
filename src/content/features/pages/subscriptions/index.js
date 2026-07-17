import { SubscriptionManager } from './subscription-manager.js';
import { SubscriptionUI } from './subscriptions-ui/subscriptions-ui.js';

// Main entry point for Subscriptions Feature
export class SubscriptionsOrganizer extends window.YPP.features.BaseFeature {
    static featureId = 'subsOrganizer';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('SubscriptionsOrganizer');
        this.manager = new SubscriptionManager();
        this.ui = new SubscriptionUI(this.manager);
    }

    getConfigKey() {
        // Let BaseFeature toggle this feature via settings.enableSubsManager.
        // Previously returned null and guarded internally \u2014 now consistent with the
        // rest of the feature architecture.
        return 'enableSubsManager';
    }

    async enable() {
        // Prevent collision with the newer Native Subscription Folders feature
        if (this.settings?.subscriptionFolders) {
             this.utils?.log('Native Subscription Folders is active. Legacy SubscriptionsOrganizer is disabled.', 'SubscriptionsOrganizer', 'info');
             return;
        }
        
        await super.enable();
        this.utils?.log('Starting Subscriptions Organizer', 'SubscriptionsOrganizer');
        
        // Inject styles
        this.utils?.injectCSS('src/content/features/pages/subscriptions/subscriptions.css', 'ypp-subs-css');

        // Share the BaseFeature observer with the UI module
        this.ui.observer = this.observer;
        
        await this.manager.init();
        this.ui.enable();
    }
    
    async disable() {
        await super.disable();
        if (this.ui && typeof this.ui.disable === 'function') {
             this.ui.disable();
        }
        this.utils?.removeStyle('ypp-subs-css');
    }
};

window.YPP.features.SubscriptionsOrganizer = SubscriptionsOrganizer;
