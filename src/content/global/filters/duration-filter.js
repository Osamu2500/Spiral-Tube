import './base-filter-feature.js';
/**
 * Duration Filter Module (V3 Architecture)
 * Hides videos that are shorter than a specified minimum duration.
 */

export class DurationFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'durationFilter';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('DurationFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'hideShortVideos'; }

    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        const s = this.settings || {};

        if (path === '/' || path === '/index') return s.hideShortVideosHome !== false;
        if (path.startsWith('/feed/subscriptions')) return s.hideShortVideosSubs !== false;
        if (path.startsWith('/results')) return s.hideShortVideosSearch !== false;
        if (path.startsWith('/@') || path.startsWith('/channel/') ||
            path.startsWith('/user/') || path.startsWith('/c/')) return s.hideShortVideosChannel !== false;
        return false;
    }

    async enable() {
        await super.enable();
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.registerFilter(this);
        }
    }

    async disable() {
        await super.disable();
        if (window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    async run(settings, oldSettings) {
        if (this.isEnabled && window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
    }

    evaluate(context) {
        if (!this.settings?.hideShortVideos) return null;
        if (!this._shouldRunOnCurrentPage()) return null;
        if (context.isShort || context.isMix) return null;
        if (context.isLive || context.isUpcoming) return null;

        const minDuration = parseInt(this.settings?.minVideoDuration || 5, 10);
        const maxDuration = parseInt(this.settings?.maxVideoDuration || 0, 10);
        const filterMode = this.settings?.filterMode || 'hide';
        const action = filterMode === 'dim' ? 'dim' : 'hide';
        
        if (context.durationSeconds !== undefined) {
            const minutes = context.durationSeconds / 60;
            if (minDuration > 0 && minutes < minDuration) {
                return { action, reason: `Too short (<${minDuration}m)` };
            }
            if (maxDuration > 0 && minutes > maxDuration) {
                return { action, reason: `Too long (>${maxDuration}m)` };
            }
        } else if (!context.isLive && !context.isUpcoming) {
            if (minDuration === 0 && maxDuration === 0) return null;
            context.fullyParsed = false;
        }

        return null;
    }
}

window.YPP.features.DurationFilter = DurationFilter;
