/**
 * UploadDateFilter
 * -----------------------------------------
 * Hides videos that are either too old or too new based on user settings.
 */
import '../../core/base-filter-feature.js';

export class UploadDateFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'uploadDateFilter';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('UploadDateFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'dateFilterEnabled'; }

    _shouldRunOnCurrentPage() {
        if (!this.settings?.dateFilterEnabled) return false;
        const path = window.location.pathname;
        if (path === '/' || path === '/index') return this.settings.dateFilterHome !== false;
        if (path.startsWith('/feed/subscriptions')) return this.settings.dateFilterSubs !== false;
        if (path.startsWith('/results')) return this.settings.dateFilterSearch !== false;
        if (path.startsWith('/watch') || path.startsWith('/shorts')) return this.settings.dateFilterRelated !== false;
        if (path.startsWith('/@') || path.startsWith('/channel/') || path.startsWith('/user/') || path.startsWith('/c/')) {
            return this.settings.dateFilterChannel !== false;
        }
        return false;
    }

    onUpdate(newSettings, oldSettings) {
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.featureManager?.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    async enable() {
        await super.enable();
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.featureManager?.getFeature('CardPipeline');
            if (pipeline) pipeline.registerFilter(this);
        }
    }

    async disable() {
        await super.disable();
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.featureManager?.getFeature('CardPipeline');
            if (pipeline) {
                if (typeof pipeline.unregisterFilter === 'function') pipeline.unregisterFilter(this);
                pipeline.triggerGlobalReevaluation();
            }
        }
    }

    evaluate(context) {
        if (!this._shouldRunOnCurrentPage()) return null;
        if (context.isShort || context.isMix) return null;

        const maxDaysOlder = parseInt(this.settings.dateFilterOlderThreshold, 10) || 0;
        const maxDaysNewer = parseInt(this.settings.dateFilterNewerThreshold, 10) || 0;
        
        // 0 means "disabled" for both thresholds; treat it as no restriction
        const filterMode = this.settings?.filterMode || 'hide';
        const action = filterMode === 'dim' ? 'dim' : 'hide';

        if (context.ageDays !== undefined) {
            if (maxDaysNewer > 0 && context.ageDays < maxDaysNewer) {
                return { action, reason: 'Video too new' };
            }
            if (maxDaysOlder > 0 && context.ageDays > maxDaysOlder) {
                return { action, reason: 'Video too old' };
            }
        } else if (!context.isLive && !context.isUpcoming) {
            // Neither threshold is set — don't flag as incomplete
            if (maxDaysNewer === 0 && maxDaysOlder === 0) return null;
            context.fullyParsed = false;
        }
        return null;
    }
}

window.YPP.features.UploadDateFilter = UploadDateFilter;
