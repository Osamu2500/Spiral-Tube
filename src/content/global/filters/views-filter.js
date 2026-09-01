import './base-filter-feature.js';
export class ViewsFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'viewsFilter';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('ViewsFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'viewsFilterEnabled'; }

    _getCurrentPageType() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index') return 'Home';
        if (path.startsWith('/feed/subscriptions')) return 'Subs';
        if (path.startsWith('/results')) return 'Search';
        if (path.startsWith('/watch') || path.startsWith('/shorts')) return 'Related';
        if (path.startsWith('/@') || path.startsWith('/channel/') ||
            path.startsWith('/user/') || path.startsWith('/c/')) return 'Channel';
        return '';
    }

    _shouldRunOnCurrentPage() {
        if (!this.settings?.viewsFilterEnabled) return false;
        const pageType = this._getCurrentPageType();
        if (!pageType) return false;
        return this.settings[`metaFilter${pageType}`] !== false;
    }

    async run(settings, oldSettings) {
        if (this._isEnabled && window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    async enable() {
        await super.enable();
        if (this._isEnabled) return;
        this._isEnabled = true;
        
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) {
                pipeline.registerFilter(this);
                pipeline.triggerGlobalReevaluation();
            }
        }
    }

    async disable() {
        await super.disable();
        this._isEnabled = false;
        
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
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
        if (context.views !== undefined) {
            if (context.views < minViews && !context.isLive) {
                return { action: 'hide', reason: 'Views too low' };
            }
        } else if (!context.isLive && !context.isUpcoming) {
            context.fullyParsed = false;
        }
        return null;
    }
}

window.YPP.features.ViewsFilter = ViewsFilter;
