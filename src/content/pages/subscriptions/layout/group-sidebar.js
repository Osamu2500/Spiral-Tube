/**
 * Group Sidebar (enableSubsManager)
 * Displays the UI sidebar for subscription groups.
 * Managed passively as a sub-setting, isolated here per architectural rules.
 */
export class GroupSidebar extends window.YPP.features.BaseFeature {
    static featureId = 'groupSidebar';
    static executionPhase = 'idle';
    static priority = 999;

    getConfigKey() { return 'enableSubsManager'; }
    constructor() { super('GroupSidebar'); }
}

window.YPP.features.GroupSidebar = GroupSidebar;
