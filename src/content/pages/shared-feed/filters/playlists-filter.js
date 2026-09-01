import './base-filter-feature.js';

export class PlaylistsFilter extends window.YPP.features.BaseFilterFeature {
    static featureId = 'hidePlaylists';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('PlaylistsFilter');
        this._allowedPages = ['/', '/index', '/feed/subscriptions', '/results', '/@', '/channel/', '/c/', '/user/', '/watch', '/shorts'];
    }

    getConfigKey() { return 'hidePlaylists'; }

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
        if (!this.settings?.hidePlaylists) return false;
        const pageType = this._getCurrentPageType();
        if (!pageType) return false;
        return this.settings[`hidePlaylists${pageType}`] !== false;
    }

    async run(settings, oldSettings) {
        if (this._isEnabled && window.YPP.FeatureManager) {
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
            if (pipeline) {
                if (typeof pipeline.unregisterFilter === 'function') pipeline.unregisterFilter(this);
                pipeline.triggerGlobalReevaluation();
            }
        }
    }

    evaluate(context) {
        if (!this._shouldRunOnCurrentPage()) return null;
        const mode = this.settings?.filterMode || 'dim';

        if (context.isPlaylist && !context.isMix) {
            return { action: mode, reason: 'Playlist' };
        }
        return null;
    }
}

window.YPP.features.PlaylistsFilter = PlaylistsFilter;
