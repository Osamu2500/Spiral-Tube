/**
 * Channel Health
 * Displays the health scanner on the Subscriptions page.
 * Managed passively as a sub-setting, isolated here per architectural rules.
 */
export class ChannelHealth extends window.YPP.features.BaseFeature {
    static featureId = 'channelHealth';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'enableChannelHealth'; }
    constructor() { super('ChannelHealth'); }
}

window.YPP.features.ChannelHealth = ChannelHealth;
