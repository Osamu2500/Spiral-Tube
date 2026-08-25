/**
 * Video Speed Controller: Audio Support
 * Allows the custom speed controller to attach to HTML5 <audio> elements.
 * Managed passively as a sub-setting, isolated here per architectural rules.
 */
export class VSCAudioSupport extends window.YPP.features.BaseFeature {
    static featureId = 'vSCAudioSupport';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'vscAudioSupport'; }
    constructor() { super('VSCAudioSupport'); }
}

