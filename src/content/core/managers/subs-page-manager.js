class SubscriptionsPageManager extends window.YPP.BasePageManager {
    constructor(utils, settings) {
        super(utils, settings);
        this.matchPatterns = [/^\/feed\/subscriptions/];
        
        // Features managed by this page. Instances are grabbed from FeatureManager dynamically.
        this.features = {};
    }

    onActivate() {
        this.utils.log('Subscriptions Page Active', 'SUBS_MANAGER', 'info');
    }

    onDeactivate() {
        this.utils.log('Subscriptions Page Deactivated', 'SUBS_MANAGER', 'info');
        // Disable features that shouldn't persist outside the subs page
        Object.values(this.features).forEach(feature => {
            if (feature?.disable) feature.disable();
        });
    }

    applySettings(settings) {
        this.settings = { ...this.settings, ...settings };
        if (!this.isActive) return;

        // Ensure we have references to the features
        const featureManager = window.YPP.Main?.featureManager;
        const subFolders = featureManager?.getFeature('subscriptionFolders');
        const subUi = featureManager?.getFeature('subscriptionUI');
        const deckMode = featureManager?.getFeature('deckMode');
        
        this.features.deckMode = deckMode;
        this.features.subscriptionFolders = subFolders;
        this.features.subscriptionUi = subUi;

        // Apply Deck Mode if enabled
        if (deckMode) {
            if (this.settings.enableDeckMode) {
                deckMode.enable();
            } else {
                deckMode.disable();
            }
        }

        // Apply Folders if enabled
        if (subFolders) {
            if (this.settings.subscriptionFolders) {
                subFolders.enable();
                subUi?.enable();
            } else {
                subFolders.disable();
                subUi?.disable();
            }
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.managers = window.YPP.managers || {};
window.YPP.managers.SubscriptionsPageManager = SubscriptionsPageManager;
