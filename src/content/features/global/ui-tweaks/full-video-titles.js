/**
 * Full Video Titles
 * Prevents YouTube from truncating video titles with an ellipsis.
 */
export class FullVideoTitles extends window.YPP.features.BaseFeature {
    static featureId = 'displayFullTitle';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('FullVideoTitles');
        this.CONSTANTS = window.YPP.CONSTANTS || {};
        this.CSS_CLASS = this.CONSTANTS.CSS_CLASSES?.DISPLAY_FULL_TITLE || 'ypp-full-title';
    }

    getConfigKey() {
        return 'displayFullTitle';
    }

    async enable() {
        document.documentElement.classList.add(this.CSS_CLASS);
        document.body.classList.add(this.CSS_CLASS);
    }

    async disable() {
        document.documentElement.classList.remove(this.CSS_CLASS);
        document.body.classList.remove(this.CSS_CLASS);
    }
};

window.YPP.features.FullVideoTitles = FullVideoTitles;
