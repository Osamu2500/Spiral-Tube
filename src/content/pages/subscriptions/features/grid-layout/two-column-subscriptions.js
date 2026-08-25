import '../../../../core/system/base-feature.js';
/**
 * Two Column Subscriptions Feature (Style 4889)
 * Forces the YouTube subscriptions grid into a clean 2-column/row layout
 * with expanded cards and clear thumbnails.
 */

export class TwoColumnSubscriptions extends window.YPP.features.BaseFeature {
    static featureId = 'twoColumnSubscriptions';
    static executionPhase = 'idle';
    static priority = 20;

    constructor() {
        super('TwoColumnSubscriptions');
        this.name = 'TwoColumnSubscriptions';
    }

    getConfigKey() {
        return 'twoColumnSubscriptions';
    }

    async enable() {
        await super.enable();
        this.applyTwoColumnLayout(true);
        this.utils?.log?.('Two Column Subscriptions enabled (Style 4889)', 'TWO-COLUMN-SUBS');
    }

    async disable() {
        await super.disable();
        this.applyTwoColumnLayout(false);
        this.utils?.log?.('Two Column Subscriptions disabled', 'TWO-COLUMN-SUBS');
    }

    async onUpdate() {
        this.applyTwoColumnLayout(this.isEnabled);
    }

    applyTwoColumnLayout(active) {
        const body = document.body;
        const html = document.documentElement;
        if (active) {
            if (body) body.classList.add('ypp-two-column-subs');
            if (html) html.style.setProperty('--ypp-subscriptions-columns', '2');
        } else {
            if (body) body.classList.remove('ypp-two-column-subs');
            // If user has a custom subscriptionsColumns setting, let FeedGridColumns restore it
            if (!this.settings?.subscriptionsColumns) {
                if (html) html.style.removeProperty('--ypp-subscriptions-columns');
            } else {
                if (html) html.style.setProperty('--ypp-subscriptions-columns', String(this.settings.subscriptionsColumns));
            }
        }
    }
}


