class GlobalLayoutManager extends window.YPP.BasePageManager {
    constructor(utils, settings) {
        super(utils, settings);
        this.matchPatterns = [/.*/]; // Matches everywhere
        
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
            aggressiveShortsBlock: 'ypp-nuke-shorts',
            hideSearchShorts:      'ypp-hide-search-shorts',
            cleanSearch:           'ypp-clean-search',
            flexWidthPlayer:       'ypp-flex-width-player',
            compactPlayerUI:       'ypp-compact-player-ui',
            cinematicMode:         'ypp-real-cinema-mode', // Style 11811: Improve cinematic mode on watch page
            realCinemaMode:        'ypp-real-cinema-mode', // Style 11811: Explicit theater real cinema mode
            showLiveStreamTime:    'ypp-live-stream-time', // Style 8167: Live stream time counter
            twoColumnSubscriptions:'ypp-two-column-subs',  // Style 4889: Two rows in subs feed
            hideCountryCode:       'ypp-hide-country-code',
            hideThanksDonate:      'ypp-hide-thanks-donate',
            hidePlayerBranding:    'ypp-hide-player-branding',
            hideUselessGuideLinks: 'ypp-hide-useless-guide-links',
            hidePaidPromotion:     'ypp-hide-paid-promotion',
            hideUploadButton:      'ypp-hide-upload-button',
            hideScrollbar:         'ypp-hide-scrollbar',
            // New Custom feature toggles
            hideMemberships:       'ypp-hide-memberships',
            reduceAnimations:      'ypp-reduce-animations',
            pinVideoOnScroll:      'ypp-pin-video-scroll',
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
        this._injectToggleStyles();
        this._startMonitoring();
    }

    _injectToggleStyles() {
        const STYLE_ID = 'ypp-player-toggle-styles';
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            /* Hide Video Title */
            body.ypp-hide-video-title ytd-watch-metadata #title,
            body.ypp-hide-video-title ytd-watch-metadata h1.ytd-watch-metadata,
            body.ypp-hide-video-title ytd-video-primary-info-renderer #title,
            body.ypp-hide-video-title ytd-video-primary-info-renderer h1 { display:none!important; }

            /* Hide Channel Bar */
            body.ypp-hide-channel-bar ytd-watch-metadata #owner,
            body.ypp-hide-channel-bar ytd-video-secondary-info-renderer #owner,
            body.ypp-hide-channel-bar ytd-watch-metadata ytd-video-owner-renderer,
            body.ypp-hide-channel-bar ytd-video-secondary-info-renderer ytd-video-owner-renderer { display:none!important; }

            /* Hide Description */
            body.ypp-hide-video-description ytd-watch-metadata #description,
            body.ypp-hide-video-description ytd-watch-metadata ytd-text-inline-expander,
            body.ypp-hide-video-description ytd-video-secondary-info-renderer #description,
            body.ypp-hide-video-description ytd-video-secondary-info-renderer ytd-text-inline-expander,
            body.ypp-hide-video-description ytd-video-secondary-info-renderer ytd-expander { display:none!important; }

            /* Hide Action Buttons */
            body.ypp-hide-action-buttons ytd-watch-metadata #actions,
            body.ypp-hide-action-buttons ytd-watch-metadata #top-level-buttons-computed,
            body.ypp-hide-action-buttons ytd-watch-metadata ytd-segmented-like-dislike-button-renderer,
            body.ypp-hide-action-buttons ytd-video-primary-info-renderer #actions,
            body.ypp-hide-action-buttons ytd-video-primary-info-renderer #top-level-buttons-computed,
            body.ypp-hide-action-buttons ytd-video-primary-info-renderer ytd-menu-renderer { display:none!important; }

            /* Zen Mode — hide everything except the video */
            body.ypp-zen-mode ytd-watch-metadata #title,
            body.ypp-zen-mode ytd-watch-metadata h1.ytd-watch-metadata,
            body.ypp-zen-mode ytd-watch-metadata #owner,
            body.ypp-zen-mode ytd-watch-metadata ytd-video-owner-renderer,
            body.ypp-zen-mode ytd-watch-metadata #actions,
            body.ypp-zen-mode ytd-watch-metadata #top-level-buttons-computed,
            body.ypp-zen-mode ytd-watch-metadata ytd-segmented-like-dislike-button-renderer,
            body.ypp-zen-mode ytd-watch-metadata #description,
            body.ypp-zen-mode ytd-watch-metadata ytd-text-inline-expander,
            body.ypp-zen-mode #below { display:none!important; }
        `;
        document.head.appendChild(style);
    }

    onDeactivate() {
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unregister('global_mixes');
            window.YPP.sharedObserver.unregister('global_shorts');
            window.YPP.sharedObserver.unregister('global_playlists');
        }
        
        // Remove all dynamically added body classes from TOGGLE_MAP
        const classesToRemove = Object.values(this.TOGGLE_MAP);
        document.body.classList.remove(...classesToRemove);

        // Remove event listeners
        this._disableCleanMixUrls();
    }

    applySettings(settings) {
        this.settings = { ...this.settings, ...settings };
        if (!this.isActive) return;
        
        // Apply pure CSS toggles
        for (const [key, cssClass] of Object.entries(this.TOGGLE_MAP)) {
            if (this.settings[key]) {
                document.body.classList.add(cssClass);
            } else {
                document.body.classList.remove(cssClass);
            }
        }
        
        // Handle JS-heavy toggles
        if (settings.cleanMixUrls) {
            this._enableCleanMixUrls();
        } else {
            this._disableCleanMixUrls();
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
