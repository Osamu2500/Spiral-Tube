import './base-filter-feature.js';

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

    getConfigKey() { return 'aggressiveShortsBlock'; }

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
        if (!this.settings?.aggressiveShortsBlock) return false;
        const pageType = this._getCurrentPageType();
        if (!pageType) return false;
        
        // If there's no generic shortsFilter setting for this page, default to true 
        return this.settings[`shortsFilter${pageType}`] !== false;
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
        
        if (context.isShort) {
            return { action: 'hide', reason: 'Shorts blocked' };
        }
        
        return null;
    }
}

window.YPP.features.ShortsFilter = ShortsFilter;
