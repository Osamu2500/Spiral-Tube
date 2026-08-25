import '../../../../core/system/base-feature.js';
/**
 * @fileoverview
 * Watch Time Limit Config
 * 
 * Target: Configuration sync.
 * Purpose: Dummy config sync feature for the Watch Time Limit slider.
 * The actual limit enforcement is handled by WatchTimeAlert.
 */
export class WatchTimeLimit extends window.YPP.features.BaseFeature {
    static featureId = 'watchTimeLimit';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('WatchTimeLimit');
    }

    getConfigKey() {
        return 'watchTimeAlertHours';
    }

    async enable() {
        await super.enable();
        // Configuration sync handled natively by BaseFeature
    }

    async disable() {
        await super.disable();
    }
};
