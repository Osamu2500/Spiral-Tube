/**
 * Filters Manager
 * Orchestrates filtering across the page by responding to all DOM mutations,
 * fixing the "reappearing videos" bug caused by YouTube's virtual DOM recycling.
 * Also detects infinite loader loops caused by hiding too many videos.
 */
export class FiltersManager extends window.YPP.features.BaseFeature {
    static featureId = 'filtersManager';
    static executionPhase = 'idle';
    static priority = 10;

    constructor() {
        super('FiltersManager');
        this._debounceTimer = null;
        this._infiniteLoopCounter = 0;
        this._lastLoaderTime = 0;
        this._boundOnMutations = this._onMutations.bind(this);
        this._observer = new MutationObserver(this._boundOnMutations);
    }

    getConfigKey() { return 'filtersManager'; } // Dummy key, always runs if enabled

    async init(settings) {
        // Always enable if any of the filters are on.
        this._settings = settings;
        this.enable();
    }

    async enable() {
        await super.enable();
        if (this._isEnabled) return;
        this._isEnabled = true;
        
        this._observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-yt-hider-channel-cache', 'data-yt-hider-channelid-cache']
        });
        
        this._observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        this.onBusEvent('app:pageChange', () => {
            this._triggerFilters();
        });
        
        this._triggerFilters();
    }

    async disable() {
        await super.disable();
        this._observer.disconnect();
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._isEnabled = false;
    }

    _onMutations(mutations) {
        if (!this._isEnabled) return;
        
        this._detectInfiniteLoaderLoop(mutations);

        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
            this._debounceTimer = null;
            this._triggerFilters();
        }, 150);
    }

    _triggerFilters() {
        // Find and trigger specific features that rely on robust checking
        const featureManager = window.YPP.featureManager;
        if (!featureManager) return;
        
        const watched = featureManager.getFeature('hideWatched');
        if (watched && watched.isEnabled) watched._processCards();

        const mixes = featureManager.getFeature('hideMixes');
        if (mixes && mixes.isEnabled) {
            if (typeof mixes._processCards === 'function') mixes._processCards();
            if (typeof mixes._scheduleProcess === 'function') mixes._scheduleProcess();
        }

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
        if (metaFilters && metaFilters.isEnabled) metaFilters._processCards();
        
        const blacklist = featureManager.getFeature('channelBlacklist');
        if (blacklist && blacklist.isEnabled) blacklist._processCards();
        
        const whitelist = featureManager.getFeature('channelWhitelist');
        if (whitelist && whitelist.isEnabled) whitelist._processCards();
    }

    _detectInfiniteLoaderLoop(mutations) {
        const hasLoader = mutations.some(m => {
            if (m.type !== 'childList') return false;
            for (let i = 0; i < m.addedNodes.length; i++) {
                const node = m.addedNodes[i];
                if (node.nodeType === 1) {
                    if (node.tagName.toLowerCase() === 'tp-yt-paper-spinner' || node.querySelector('tp-yt-paper-spinner')) {
                        return true;
                    }
                }
            }
            return false;
        });

        if (hasLoader) {
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
}
window.YPP.features.FiltersManager = FiltersManager;
