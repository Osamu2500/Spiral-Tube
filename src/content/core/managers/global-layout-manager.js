class GlobalLayoutManager extends window.YPP.BasePageManager {
    constructor(utils, settings) {
        super(utils, settings);
        this.matchPatterns = [/.*/]; // Matches everywhere
        this._boundNavHandler = () => this._updateDynamicToggles();
        
        // Map settings keys to body CSS classes
        this.TOGGLE_MAP = {
            // Global visibility toggles
            hideComments:          'ypp-hide-comments',
            hideMetrics:           'ypp-hide-metrics',
            hideThumbnails:        'ypp-hide-thumbnails',
            hideWatched:           'ypp-hide-watched',
            hideMixes:             'ypp-hide-mixes',
            hidePlaylists:         'ypp-hide-playlists',
            hidePodcasts:          'ypp-hide-podcasts',
            hidePosts:             'ypp-hide-posts',
            hidePromoShelves:      'ypp-hide-promos',
            hideShorts:            'ypp-hide-shorts',
            hideLiveChat:          'ypp-hide-live-chat',   // Fixed: was ypp-hide-livechat
            hideEndScreens:        'ypp-hide-endscreens',
            hideChannelCards:      'ypp-hide-channel-cards',
            hideCards:             'ypp-hide-video-cards', // Split: player cards only
            hideMerch:             'ypp-hide-merch',
            hideFundraiser:        'ypp-hide-fundraiser',
            hideSearchShelves:     'ypp-hide-search-shelves',
            hideSearchMixes:       'ypp-hide-search-mixes',
            hideSearchPlaylists:   'ypp-hide-search-playlists',
            hideSearchPodcasts:    'ypp-hide-search-podcasts',
            hideSearchMusic:       'ypp-hide-search-music',
            // Previously unhandled — now wired up:
            hideAnnotations:       'ypp-hide-annotations',
            hideRelated:           'ypp-hide-related',
            hideVoiceSearch:       'ypp-hide-voice-search',
            hideShortsInteraction: 'ypp-hide-shorts-interaction',
            hideTrending:          'ypp-hide-trending',          // Moved from HomePageManager
            hideExploreTopics:     'ypp-hide-explore-topics',    // Moved from HomePageManager
            hidePlayerTopics:      'ypp-hide-player-topics',
            hideVideoTitle:        'ypp-hide-video-title',
            hideChannelBar:        'ypp-hide-channel-bar',
            hideVideoDescription:  'ypp-hide-video-description',
            hideActionButtons:     'ypp-hide-action-buttons',
            hideFeed:              'ypp-hide-feed',              // Moved from HomePageManager
            hideSearchShorts:      'ypp-hide-search-shorts',
            cleanSearch:           'ypp-clean-search',


            cinematicMode:         'ypp-real-cinema-mode', // Improve cinematic mode on watch page
            realCinemaMode:        'ypp-real-cinema-mode', // Explicit theater real cinema mode
            showLiveStreamTime:    'ypp-live-stream-time', // Live stream time counter
            twoColumnSubscriptions:'ypp-two-column-subs',  // Two rows in subs feed
            hideCountryCode:       'ypp-hide-country-code',
            hideThanksDonate:      'ypp-hide-thanks-donate',
            hidePlayerBranding:    'ypp-hide-player-branding',
            hideUselessGuideLinks: 'ypp-hide-useless-guide-links',
            hidePaidPromotion:     'ypp-hide-paid-promotion',
            hideUploadButton:      'ypp-hide-upload-button',
            hideScrollbar:         'ypp-hide-scrollbar',
            // New Custom feature toggles
            hideMemberships:       'ypp-hide-memberships',

            // Aesthetic toggles
            customScrollbar:       'ypp-custom-scrollbar',
            grayscaleThumbnails:   'ypp-grayscale-thumbs',
            useSquareCorners:      'ypp-square-ui', /* Fixed from ypp-use-square-corners */
            extraRoundedUI:        'ypp-extra-rounded-ui',
            retroLogo:             'ypp-retro-logo',
            netflixSubtitles:      'ypp-netflix-subtitles',
            saveSupremeUI:         'ypp-save-supreme-ui',
            smallSettingsMenu:     'ypp-small-settings-menu',
            useLightsaberProgress: 'ypp-lightsaber-progress',
        };
    }

    onActivate() {
        this.utils.log('Global Layout Active', 'GLOBAL_MANAGER', 'info');
        this._startMonitoring();
        document.addEventListener('yt-navigate-finish', this._boundNavHandler);
    }



    onDeactivate() {
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('global_mixes');
            window.YPP.sharedObserver.unregister('global_shorts');
            window.YPP.sharedObserver.unregister('global_playlists');
        }
        
        // Remove all dynamically added body classes from TOGGLE_MAP
        const classesToRemove = Object.values(this.TOGGLE_MAP);
        document.body.classList.remove(...classesToRemove, 'ypp-nuke-shorts');

        // Remove event listeners
        this._disableCleanMixUrls();
        document.removeEventListener('yt-navigate-finish', this._boundNavHandler);
    }

    applySettings(settings) {
        this.settings = { ...this.settings, ...settings };
        if (!this.isActive) return;
        
        // Apply UI Density
        if (this.settings.popupDensity) {
            document.documentElement.style.setProperty('--ui-density', this.settings.popupDensity);
        } else {
            document.documentElement.style.removeProperty('--ui-density');
        }
        
        // Apply pure CSS toggles
        for (const [key, cssClass] of Object.entries(this.TOGGLE_MAP)) {
            if (this.settings[key]) {
                document.body.classList.add(cssClass);
            } else {
                document.body.classList.remove(cssClass);
            }
        }
        
        this._updateDynamicToggles();
        
        // Handle JS-heavy toggles
        if (settings.cleanMixUrls) {
            this._enableCleanMixUrls();
        } else {
            this._disableCleanMixUrls();
        }
    }

    _updateDynamicToggles() {
        if (!this.isActive) return;
        
        let nukeShortsActive = this.settings.aggressiveShortsBlock;
        if (nukeShortsActive) {
            const path = window.location.pathname;
            if (path === '/' || path === '/index') nukeShortsActive = this.settings.shortsFilterHome !== false;
            else if (path.startsWith('/feed/subscriptions')) nukeShortsActive = this.settings.shortsFilterSubs !== false;
            else if (path.startsWith('/results')) nukeShortsActive = this.settings.shortsFilterSearch !== false;
            else if (path.startsWith('/@') || path.startsWith('/channel/') || path.startsWith('/user/') || path.startsWith('/c/')) nukeShortsActive = this.settings.shortsFilterChannel !== false;
            else if (path.startsWith('/watch')) nukeShortsActive = this.settings.shortsFilterRelated !== false;
            else nukeShortsActive = false;
        }
        
        if (nukeShortsActive) {
            document.body.classList.add('ypp-nuke-shorts');
        } else {
            document.body.classList.remove('ypp-nuke-shorts');
        }
    }

    _startMonitoring() {
        if (!window.YPP?.sharedObserver) return;
        
        // Observers for Mixes, Shorts, and Playlists were removed because they were setting 
        // useless data attributes that were never used by CSS or JS. 
        // HideShorts and HideMixes have their own dedicated JS files now, and HidePlaylists 
        // uses safe CSS rules.
    }

    // --- Clean Mix URLs ---
    _enableCleanMixUrls() {
        if (!this._mixClickHandler) {
            this._mixClickHandler = (e) => {
                const a = e.target.closest('a[href]');
                if (a && a.href.includes('list=RD')) {
                    try {
                        const url = new URL(a.href, window.location.origin);
                        const list = url.searchParams.get('list');
                        if (list && list.startsWith('RD')) {
                            url.searchParams.delete('list');
                            url.searchParams.delete('start_radio');
                            a.href = url.pathname + url.search + url.hash;
                        }
                    } catch (err) {}
                }
            };
            document.addEventListener('click', this._mixClickHandler, true);
        }
    }

    _disableCleanMixUrls() {
        if (this._mixClickHandler) {
            document.removeEventListener('click', this._mixClickHandler, true);
            this._mixClickHandler = null;
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.managers = window.YPP.managers || {};
window.YPP.managers.GlobalLayoutManager = GlobalLayoutManager;
