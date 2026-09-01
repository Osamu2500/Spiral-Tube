import '../../../../core/system/base-feature.js';
/**
 * Channel Columns
 * Manages the CSS custom property for the number of columns on Channel pages.
 */
export class ChannelColumns extends window.YPP.features.BaseFeature {
    static featureId = 'channelColumns';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'channelColumns'; }
    constructor() { super('ChannelColumns'); }

    async enable() {
        if (this.settings.channelColumns) {
            document.documentElement.style.setProperty('--ypp-channel-columns', this.settings.channelColumns);
        }
    }

    async disable() {
        document.documentElement.style.removeProperty('--ypp-channel-columns');
    }

    async onUpdate() {
        if (this.settings.channelColumns) {
            document.documentElement.style.setProperty('--ypp-channel-columns', this.settings.channelColumns);
        } else {
            document.documentElement.style.removeProperty('--ypp-channel-columns');
        }
    }
}

window.YPP.features.ChannelColumns = ChannelColumns;
