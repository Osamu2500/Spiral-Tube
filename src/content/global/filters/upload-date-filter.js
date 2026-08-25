import './base-filter-feature.js';
export class UploadDateFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'uploadDateFilter';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('UploadDateFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'dateFilterEnabled'; }

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

        if (this.settings?.dateFilterEnabled) {
            const maxDaysOlder = parseInt(this.settings.dateFilterOlderThreshold, 10) || 0;
            const maxDaysNewer = parseInt(this.settings.dateFilterNewerThreshold, 10) || 0;
            
            if (context.ageDays !== undefined) {
                if (maxDaysNewer > 0 && context.ageDays < maxDaysNewer) {
                    return { action: 'hide', reason: 'Video too new' };
                } else if (maxDaysOlder > 0 && context.ageDays > maxDaysOlder) {
                    return { action: 'hide', reason: 'Video too old' };
                }
            } else if (!context.isLive && !context.isUpcoming) {
                context.fullyParsed = false;
            }
        }
        return null;
    }
}

window.YPP.features.UploadDateFilter = UploadDateFilter;
