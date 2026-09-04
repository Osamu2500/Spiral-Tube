import '../core/base-filter-feature.js';
export class UploadDateFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'uploadDateFilter';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('UploadDateFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'dateFilterEnabled'; }

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
        if (!this.settings?.dateFilterEnabled) return false;
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
