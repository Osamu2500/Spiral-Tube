/**
 * ViewsFilter
 * -----------------------------------------
 * Hides videos that have fewer views than the user's defined threshold.
 */
import '../../core/base-filter-feature.js';

export class ViewsFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'viewsFilter';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('ViewsFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'viewsFilterEnabled'; }

    _shouldRunOnCurrentPage() {
        if (!this.settings?.viewsFilterEnabled) return false;
        const path = window.location.pathname;
        if (path === '/' || path === '/index') return this.settings.viewsFilterHome !== false;
        if (path.startsWith('/feed/subscriptions')) return this.settings.viewsFilterSubs !== false;
        if (path.startsWith('/results')) return this.settings.viewsFilterSearch !== false;
        if (path.startsWith('/watch') || path.startsWith('/shorts')) return this.settings.viewsFilterRelated !== false;
        if (path.startsWith('/@') || path.startsWith('/channel/') || path.startsWith('/user/') || path.startsWith('/c/')) {
            return this.settings.viewsFilterChannel !== false;
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

        const minViews = parseInt(this.settings.viewsHideThreshold, 10) || 0;
        const filterMode = this.settings?.filterMode || 'hide';
        const action = filterMode === 'dim' ? 'dim' : 'hide';

        if (context.views !== undefined) {
            if (minViews > 0 && context.views < minViews && !context.isLive) {
                return { action, reason: 'Views too low' };
            }
        } else if (!context.isLive && !context.isUpcoming) {
            if (minViews === 0) return null;
            context.fullyParsed = false;
        }
        return null;
    }
}

window.YPP.features.ViewsFilter = ViewsFilter;
