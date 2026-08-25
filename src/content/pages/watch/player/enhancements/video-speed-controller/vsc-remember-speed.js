import '../../../../../core/system/base-feature.js';
/**
 * Video Speed Controller: Remember Speed
 * Saves the last used playback speed and restores it automatically for new videos.
 * Managed passively as a sub-setting, isolated here per architectural rules.
 */
export class VSCRememberSpeed extends window.YPP.features.BaseFeature {
    static featureId = 'vSCRememberSpeed';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'vscRememberSpeed'; }
    constructor() { super('VSCRememberSpeed'); }
}

