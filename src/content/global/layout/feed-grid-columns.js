import '../../core/system/base-feature.js';
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
        this._injectGridCSS();
        const cols = this.settings.twoColumnSubscriptions ? 2 : this.settings.subscriptionsColumns;
        if (cols) {
            document.documentElement.style.setProperty('--ypp-subscriptions-columns', cols);
        }
    }

    _injectGridCSS() {
        if (document.getElementById('ypp-sub-grid-override')) return;
        const style = document.createElement('style');
        style.id = 'ypp-sub-grid-override';
        style.textContent = `
            ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer #contents > ytd-rich-grid-row {
                display: contents !important;
            }
            ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer > #contents {
                display: grid !important;
                grid-template-columns: repeat(var(--ypp-subscriptions-columns, 4), minmax(0, 1fr)) !important;
                grid-gap: 16px !important;
                width: 100% !important;
            }
            ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer {
                margin: 0 !important;
                width: 100% !important;
            }
        `;
        document.head.appendChild(style);
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
