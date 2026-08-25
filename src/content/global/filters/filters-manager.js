import '../../core/system/base-feature.js';
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

// ─── High-Filtering Warning System ────────────────────────────────────────────
// Tracks hidden vs visible card ratio across all filters.
// Shows a non-intrusive banner when 85%+ of cards are filtered.

window.YPP.FilterWarning = (() => {
    const HIGH_RATIO = 0.85;
    const MIN_CARDS  = 10;
    const BANNER_ID  = 'ypp-filter-warning-banner';
    const DISMISS_MS = 10000;

    let _hiddenCount = 0;
    let _totalCount  = 0;
    let _lastWarned  = 0;
    let _dismissTimer = null;

    function _getOrCreateBanner() {
        let banner = document.getElementById(BANNER_ID);
        if (!banner) {
            banner = document.createElement('div');
            banner.id = BANNER_ID;
            banner.style.cssText = [
                'position:fixed',
                'bottom:24px',
                'left:50%',
                'transform:translateX(-50%)',
                'z-index:99999',
                'background:rgba(30,20,0,0.92)',
                'color:#fde68a',
                'border:1px solid rgba(245,158,11,0.55)',
                'border-radius:10px',
                'padding:10px 18px',
                'font:500 13px/1.4 Roboto,Arial,sans-serif',
                'display:flex',
                'align-items:center',
                'gap:10px',
                'box-shadow:0 4px 24px rgba(0,0,0,0.5)',
                'backdrop-filter:blur(8px)',
                'max-width:500px',
                'animation:ypp-badge-in 200ms ease-out',
            ].join(';');

            const msg = document.createElement('span');
            banner.appendChild(msg);

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = 'background:none;border:none;color:inherit;cursor:pointer;font-size:16px;opacity:0.7;padding:0;line-height:1;flex-shrink:0;';
            closeBtn.addEventListener('click', dismiss);
            banner.appendChild(closeBtn);

            document.body?.appendChild(banner);
        }
        return banner;
    }

    function showWarning(hiddenCount, totalCount) {
        const banner = _getOrCreateBanner();
        const msg = banner.querySelector('span');
        const pct = Math.round((hiddenCount / totalCount) * 100);
        if (msg) {
            msg.textContent = `⚠️ ${pct}% of videos are being filtered (${hiddenCount}/${totalCount}). Your filters may be too aggressive.`;
        }
        banner.style.display = 'flex';

        clearTimeout(_dismissTimer);
        _dismissTimer = setTimeout(dismiss, DISMISS_MS);
    }

    function dismiss() {
        const banner = document.getElementById(BANNER_ID);
        if (banner) {
            banner.classList.add('ypp-badge-leaving');
            setTimeout(() => banner.remove(), 200);
        }
        clearTimeout(_dismissTimer);
    }

    function record(hiddenCount, totalCount) {
        _hiddenCount += hiddenCount;
        _totalCount  += totalCount;

        // Debounce: only evaluate once per second to avoid spam
        const now = Date.now();
        if (now - _lastWarned < 1000) return;
        _lastWarned = now;

        const h = _hiddenCount;
        const t = _totalCount;
        _hiddenCount = 0;
        _totalCount  = 0;

        if (t >= MIN_CARDS && h / t >= HIGH_RATIO) {
            showWarning(h, t);
        }
    }

    return { record, dismiss };
})();

