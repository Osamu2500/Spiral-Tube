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
        if (context.isShort || context.isMix) return null;

        if (this.settings?.viewsFilterEnabled) {
            const minViews = parseInt(this.settings.viewsHideThreshold, 10) || 0;
            if (context.views !== undefined) {
                if (context.views < minViews && !context.isLive) {
                    return { action: 'hide', reason: 'Views too low' };
                }
            } else if (!context.isLive && !context.isUpcoming) {
                context.fullyParsed = false;
            }
        }
        return null;
    }
}

window.YPP.features.ViewsFilter = ViewsFilter;
