import '../../core/base-filter-feature.js';

/**
 * ShortsFilter
 * ------------
 * A dedicated Pipeline filter that enforces the Shorts Remover across all pages.
 * Works alongside CSS tags to guarantee that stray shorts (e.g., those disguised
 * as standard videos on the search page) are securely hidden.
 */
export class ShortsFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'shortsFilter';
    static executionPhase = 'idle';
    static priority = 15; // Higher priority to strip out shorts early

    constructor() {
        super('ShortsFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/', '/watch', '/shorts'];
    }

    getConfigKey() { return null; }

    _shouldRunOnCurrentPage() {
        // If aggressive block is true, run everywhere
        if (this.settings?.aggressiveShortsBlock) return true;
        
        const path = window.location.pathname;
        if (path === '/' || path === '/index') return this.settings?.shortsFilterHome !== false;
        if (path.startsWith('/feed/subscriptions')) return this.settings?.shortsFilterSubs !== false;
        if (path.startsWith('/results')) return this.settings?.shortsFilterSearch !== false;
        if (path.startsWith('/watch') || path.startsWith('/shorts')) return this.settings?.shortsFilterRelated !== false;
        if (path.startsWith('/@') || path.startsWith('/channel/') || path.startsWith('/user/') || path.startsWith('/c/')) {
            return this.settings?.shortsFilterChannel !== false;
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
        
        if (context.isShort) {
            return { action: 'hide', reason: 'Shorts blocked' };
        }
        
        return null;
    }
}

window.YPP.features.ShortsFilter = ShortsFilter;
