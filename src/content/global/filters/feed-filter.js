import './base-filter-feature.js';
/**
 * FeedFilter
 * ----------
 * Removes unwanted content from the feed based on user preferences.
 * Extends BaseFilterFeature for unified hiding mechanics.
 * Scaffolded based on logic from jpdngflnlekafjhdlcnijphhcmeibdoa
 */
export class FeedFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'feedFilter';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('FeedFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/'];
    }

    getConfigKey() { return 'feedFilter'; }

    _shouldRunOnCurrentPage() {
        const path = window.location.pathname;
        const s = this.settings || {};

        if (path === '/' || path === '/index') return s.feedFilterHome !== false;
        if (path.startsWith('/feed/subscriptions')) return s.feedFilterSubs !== false;
        if (path.startsWith('/results')) return s.feedFilterSearch !== false;
        if (path.startsWith('/@') || path.startsWith('/channel/') ||
            path.startsWith('/user/') || path.startsWith('/c/')) return s.feedFilterChannel !== false;
        return false;
    }

    async run(settings, oldSettings) {
        if (this.isEnabled && window.YPP.FeatureManager) {
            const pipeline = window.YPP.FeatureManager.getFeature('CardPipeline');
            if (pipeline) pipeline.triggerGlobalReevaluation();
        }
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

    evaluate(context) {
        if (!context.card || !context.card.isConnected) return null;
        
        // Settings flags
        const hideLive = this.settings?.hideLiveStreams;
        const hideUpcoming = this.settings?.hideUpcoming;
        const hidePosts = this.settings?.hidePosts;
        const hideMembersOnly = this.settings?.hideMembersOnly;
        const keywordsRaw = this.settings?.feedFilterKeywords || '';
        
        const keywords = keywordsRaw.split(',').map(k => k.trim()).filter(k => k.length > 0);
        
        if (hidePosts && context.isPost) {
            return { action: 'hide', reason: 'Post' };
        }
        if (context.isPost) return null;

        if (hideLive && context.isLive) {
            return { action: 'hide', reason: 'Live stream' };
        }

        if (hideUpcoming && context.isUpcoming) {
            return { action: 'hide', reason: 'Upcoming' };
        }

        if (hideMembersOnly && context.isMembersOnly) {
            return { action: 'hide', reason: 'Members only' };
        }

        if (this.settings?.hidePlaylists && context.isPlaylist) {
            return { action: 'hide', reason: 'Playlist' };
        }

        if (this.settings?.hideMixes && context.isMix) {
            return { action: 'hide', reason: 'Mix playlist' };
        }

        if (keywords.length > 0 && context.title) {
            const titleText = context.title;
            const titleLower = titleText.toLowerCase();
            
            for (const kw of keywords) {
                // Regex check if kw starts and ends with /
                if (kw.startsWith('/') && kw.endsWith('/') && kw.length > 2) {
                    try {
                        const regex = new RegExp(kw.slice(1, -1), 'i');
                        if (regex.test(titleText)) {
                            return { action: 'hide', reason: `Regex match: ${kw}` };
                        }
                    } catch (e) {
                        // Invalid regex, ignore
                    }
                } else {
                    // Regular match
                    if (titleLower.includes(kw.toLowerCase())) {
                        return { action: 'hide', reason: `Keyword: ${kw}` };
                    }
                }
            }
        }
        
        return null;
    }
}

window.YPP.features.FeedFilter = FeedFilter;
