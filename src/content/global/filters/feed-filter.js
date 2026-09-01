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
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/', '/watch', '/shorts'];
    }

    getConfigKey() { return 'feedFilter'; }

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
        const pageType = this._getCurrentPageType();
        if (!pageType) return false;
        const s = this.settings || {};
        // If there's no generic feedFilter setting for this page, default to true 
        // to allow sub-features (like hideMixes) to evaluate themselves.
        return s[`feedFilter${pageType}`] !== false;
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
        
        const pageType = this._getCurrentPageType();
        const isFeatureActive = (baseKey) => {
            if (!this.settings?.[baseKey]) return false; // Global toggle off
            if (pageType && this.settings?.[`${baseKey}${pageType}`] === false) return false; // Page toggle off
            return true;
        };

        // Settings flags
        const keywordsRaw = this.settings?.feedFilterKeywords || '';
        
        const keywords = keywordsRaw.split(',').map(k => k.trim()).filter(k => k.length > 0);
        
        const mode = this.settings?.filterMode || 'dim';
        const getAction = (reason) => ({ action: mode, reason });

        if (isFeatureActive('hidePosts') && context.isPost) {
            return getAction('Post');
        }
        if (context.isPost) return null;

        if (isFeatureActive('hideUpcoming') && context.isUpcoming) {
            return getAction('Upcoming');
        }

        if (isFeatureActive('hideMembersOnly') && context.isMembersOnly) {
            return getAction('Members only');
        }

        if (isFeatureActive('hidePodcasts') && context.isPodcast) {
            return getAction('Podcast');
        }

        // --- Wired Up Legacy Feed Filters ---
        // Check if we are on a page where feed filters apply (e.g. Subs, Home)
        // using the specific page toggles: feedFilter_page_subscriptions, etc.
        let pageKey = null;
        if (pageType === 'Subs') pageKey = 'feedFilter_page_subscriptions';
        else if (pageType === 'Home') pageKey = 'feedFilter_page_home';
        
        if (pageKey && this.settings?.[pageKey]) {
            // Video
            if (this.settings?.feedFilter_video_visible === false && !context.isShort && !context.isLive && !context.isUpcoming && !context.isPlaylist && !context.isMix && !context.isPost) {
                return getAction('Video filtered');
            }
            // Shorts
            if (this.settings?.feedFilter_shorts_visible === false && context.isShort) {
                return getAction('Shorts filtered');
            }
            // Live
            if (this.settings?.feedFilter_live_visible === false && context.isLive) {
                return getAction('Live filtered');
            }
            // Upcoming (Scheduled)
            if (this.settings?.feedFilter_scheduled_visible === false && context.isUpcoming) {
                return getAction('Scheduled filtered');
            }
            // Playlists
            if (this.settings?.feedFilter_playlist_visible === false && (context.isPlaylist || context.isMix)) {
                return getAction('Playlist filtered');
            }
            // Posts
            if (this.settings?.feedFilter_posts_visible === false && context.isPost) {
                return getAction('Post filtered');
            }
            // Watched / Unwatched
            const isWatched = context.progressPercent !== null && context.progressPercent > 0;
            if (this.settings?.feedFilter_watched_visible === false && isWatched) {
                return getAction('Watched filtered');
            }
            if (this.settings?.feedFilter_unwatched_visible === false && !isWatched) {
                return getAction('Unwatched filtered');
            }
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
                            return getAction(`Regex match: ${kw}`);
                        }
                    } catch (e) {
                        // Invalid regex, ignore
                    }
                } else {
                    // Regular match (word boundary)
                    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
                    if (regex.test(titleText)) {
                        return getAction(`Keyword: ${kw}`);
                    }
                }
            }
        }
        
        return null;
    }
}

window.YPP.features.FeedFilter = FeedFilter;
