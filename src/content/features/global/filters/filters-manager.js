/**
 * Filters Manager
 * Coordinates infinite loader loops caused by hiding too many videos.
 * V3: Global subtree MutationObserver removed. Now utilizes sharedObserver.
 */
export class FiltersManager extends window.YPP.features.BaseFeature {
    static featureId = 'filtersManager';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('FiltersManager');
        this._infiniteLoopCounter = 0;
        this._lastLoaderTime = 0;
        this._boundProcessLoader = this._processLoader.bind(this);
    }

    getConfigKey() { return 'filtersManager'; } // Dummy key, always runs if enabled

    async init(settings) {
        this._settings = settings;
        this.enable();
    }

    async enable() {
        await super.enable();
        if (this._isEnabled) return;
        this._isEnabled = true;
        
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register(
                'infinite-loader-detector',
                'tp-yt-paper-spinner',
                this._boundProcessLoader,
                false,
                false
            );
        }

        // Trigger a fallback clean sweep on page navigation finish
        this.onBusEvent('app:pageChange', () => {
            this._triggerFiltersFallback();
        });
        
        this._triggerFiltersFallback();
    }

    async disable() {
        await super.disable();
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('infinite-loader-detector');
        }
        this._isEnabled = false;
    }

    _triggerFiltersFallback() {
        // Fallback for features that still need a manual kick on soft navigations
        const featureManager = window.YPP.featureManager;
        if (!featureManager) return;
        
        const watched = featureManager.getFeature('hideWatched');
        if (watched && watched.isEnabled && typeof watched._processCards === 'function') watched._processCards();

        const mixes = featureManager.getFeature('hideMixes');
        if (mixes && mixes.isEnabled && typeof mixes._scheduleProcess === 'function') mixes._scheduleProcess();

        const promos = featureManager.getFeature('hidePromoShelves');
        if (promos && promos.isEnabled && typeof promos._scheduleProcess === 'function') promos._scheduleProcess();

        const explore = featureManager.getFeature('hideExploreTopics');
        if (explore && explore.isEnabled && typeof explore._scheduleProcess === 'function') explore._scheduleProcess();

        const playlists = featureManager.getFeature('hidePlaylists');
        if (playlists && playlists.isEnabled && typeof playlists._scheduleProcess === 'function') playlists._scheduleProcess();

        const podcasts = featureManager.getFeature('hidePodcasts');
        if (podcasts && podcasts.isEnabled && typeof podcasts._scheduleProcess === 'function') podcasts._scheduleProcess();

        const posts = featureManager.getFeature('hidePosts');
        if (posts && posts.isEnabled && typeof posts._scheduleProcess === 'function') posts._scheduleProcess();

        const channels = featureManager.getFeature('hideChannelCards');
        if (channels && channels.isEnabled && typeof channels._scheduleProcess === 'function') channels._scheduleProcess();

        const music = featureManager.getFeature('hideSearchMusic');
        if (music && music.isEnabled && typeof music._scheduleProcess === 'function') music._scheduleProcess();
        
        const metaFilters = featureManager.getFeature('metadataFilters');
        if (metaFilters && metaFilters.isEnabled && typeof metaFilters._processCards === 'function') metaFilters._processCards();
        
        const blacklist = featureManager.getFeature('channelBlacklist');
        if (blacklist && blacklist.isEnabled && typeof blacklist._processCards === 'function') blacklist._processCards();
        
        const whitelist = featureManager.getFeature('channelWhitelist');
        if (whitelist && whitelist.isEnabled && typeof whitelist._processCards === 'function') whitelist._processCards();
    }

    _processLoader(nodes) {
        if (!this._isEnabled || nodes.length === 0) return;
        
        const now = Date.now();
        if (now - this._lastLoaderTime < 1000) {
            this._infiniteLoopCounter++;
        } else {
            this._infiniteLoopCounter = 1;
        }
        this._lastLoaderTime = now;

        if (this._infiniteLoopCounter > 15) {
            this._infiniteLoopCounter = 0;
            this._lastLoaderTime = now + 10000; // sleep 10s
            window.YPP.Utils.log('Infinite loader loop detected due to excessive hiding.', 'FILTERS', 'warn');
            try {
                window.YPP.Utils.createToast('Too many videos hidden! YouTube is stuck loading. Scroll down or disable some filters.', 'warn', 5000);
            } catch (e) {}
        }
    }
}
window.YPP.features.FiltersManager = FiltersManager;

