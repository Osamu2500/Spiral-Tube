import '../../../core/system/base-feature.js';
/**
 * Filter Bar
 * Displays the duration/date filters on the Subscriptions page.
 * Managed passively as a sub-setting, isolated here per architectural rules.
 */
export class FilterBar extends window.YPP.features.BaseFeature {
    static featureId = 'filterBar';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'enableFilterBar'; }
    constructor() { super('FilterBar'); }
}
