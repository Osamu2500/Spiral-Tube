/**
 * Feed Grid Columns (Subscriptions Columns)
 * Manages the CSS custom property for the number of columns on the Subscriptions feed.
 */
export class FeedGridColumns extends window.YPP.features.BaseFeature {
    static featureId = 'feedGridColumns';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'subscriptionsColumns'; }
    constructor() { super('FeedGridColumns'); }

    async enable() {
        const cols = this.settings.twoColumnSubscriptions ? 2 : this.settings.subscriptionsColumns;
        if (cols) {
            document.documentElement.style.setProperty('--ypp-subscriptions-columns', cols);
        }
    }

    async disable() {
        document.documentElement.style.removeProperty('--ypp-subscriptions-columns');
    }

    async onUpdate() {
        const cols = this.settings.twoColumnSubscriptions ? 2 : this.settings.subscriptionsColumns;
        if (cols) {
            document.documentElement.style.setProperty('--ypp-subscriptions-columns', cols);
        } else {
            document.documentElement.style.removeProperty('--ypp-subscriptions-columns');
        }
    }
}

window.YPP.features.FeedGridColumns = FeedGridColumns;
