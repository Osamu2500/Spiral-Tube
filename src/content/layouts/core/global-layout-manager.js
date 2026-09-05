import '../../core/system/base-page-manager.js';
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
            hidePromoShelves:      'ypp-hide-promos',

            hideLiveChat:          'ypp-hide-live-chat',   // Fixed: was ypp-hide-livechat
            hideEndScreens:        'ypp-hide-endscreens',
            hideChannelCards:      'ypp-hide-channel-cards',
            hideCards:             'ypp-hide-video-cards', // Split: player cards only
            hideMerch:             'ypp-hide-merch',
            hideFundraiser:        'ypp-hide-fundraiser',
            hideSearchShelves:     'ypp-hide-search-shelves',
            hideSearchPodcasts:    'ypp-hide-search-podcasts',
            hideSearchMusic:       'ypp-hide-search-music',
            hideSearchTopics:      'ypp-hide-search-topics',
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

            showLiveStreamTime:    'ypp-live-stream-time', // Live stream time counter
            twoColumnSubscriptions:'ypp-two-column-subs',  // Two rows in subs feed


            hideCountryCode:       'ypp-hide-country-code',
            hideThanksDonate:      'ypp-hide-thanks-donate',
            hidePlayerBranding:    'ypp-hide-player-branding',
            hideUselessGuideLinks: 'ypp-hide-useless-guide-links',
            hidePaidPromotion:     'ypp-hide-paid-promotion',
            hideAiLogo:            'ypp-hide-ai-logo',
            hideUploadButton:      'ypp-hide-upload-button',
            hideScrollbar:         'ypp-hide-scrollbar',
            // New Custom feature toggles
            hideMemberships:       'ypp-hide-memberships',

            // Aesthetic toggles
            customScrollbar:       'ypp-custom-scrollbar',
            grayscaleThumbnails:   'ypp-grayscale-thumbs',
            useSquareCorners:      'ypp-square-ui', /* Fixed from ypp-use-square-corners */
            extraRoundedUI:        'ypp-ui-extra-rounded',
            retroLogo:             'ypp-retro-logo',
            netflixSubtitles:      'ypp-netflix-subtitles',
            saveSupremeUI:         'ypp-save-supreme-ui',
            smallSettingsMenu:     'ypp-small-settings-menu',

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
        document.documentElement.classList.remove('ypp-hide-scrollbar');

        // Remove event listeners
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
                if (key === 'hideScrollbar') document.documentElement.classList.add(cssClass);
            } else {
                document.body.classList.remove(cssClass);
                if (key === 'hideScrollbar') document.documentElement.classList.remove(cssClass);
            }
        }
        
        // Handle real-cinema-mode explicitly to prevent toggle mapping collisions
        if (this.settings.cinematicMode || this.settings.realCinemaMode) {
            document.body.classList.add('ypp-real-cinema-mode');
        } else {
            document.body.classList.remove('ypp-real-cinema-mode');
        }
        
        this._updateDynamicToggles();
    }

    _updateDynamicToggles() {
        if (!this.isActive) return;
        
        const path = window.location.pathname;
        let pageType = '';
        
        // Clear all previous page contexts
        document.body.classList.remove(
            'ypp-home-page',
            'ypp-subs-page',
            'ypp-search-page',
            'ypp-watch-page',
            'ypp-shorts-page',
            'ypp-channel-page'
        );
        
        if (path === '/' || path === '/index') {
            pageType = 'Home';
            document.body.classList.add('ypp-home-page');
        }
        else if (path.startsWith('/feed/subscriptions')) {
            pageType = 'Subs';
            document.body.classList.add('ypp-subs-page');
        }
        else if (path.startsWith('/results')) {
            pageType = 'Search';
            document.body.classList.add('ypp-search-page');
        }
        else if (path.startsWith('/watch')) {
            pageType = 'Related';
            document.body.classList.add('ypp-watch-page');
        }
        else if (path.startsWith('/shorts')) {
            pageType = 'Related';
            document.body.classList.add('ypp-shorts-page');
        }
        else if (path.startsWith('/@') || path.startsWith('/channel/') || path.startsWith('/user/') || path.startsWith('/c/')) {
            pageType = 'Channel';
            document.body.classList.add('ypp-channel-page');
        }

        const isFeatureActive = (baseKey) => {
            if (!this.settings[baseKey]) return false;
            if (pageType && this.settings[`${baseKey}${pageType}`] === false) return false;
            return true;
        };

        const toggleClass = (active, className) => {
            if (active) document.body.classList.add(className);
            else document.body.classList.remove(className);
        };

        toggleClass(isFeatureActive('hidePodcasts'), 'ypp-hide-podcasts');
        toggleClass(isFeatureActive('hidePosts'), 'ypp-hide-posts');

        let nukeShortsActive = this.settings.aggressiveShortsBlock;
        if (nukeShortsActive) {
            if (pageType) nukeShortsActive = this.settings[`shortsFilter${pageType}`] !== false;
            else nukeShortsActive = false;
        }
        
        if (nukeShortsActive) {
            document.body.classList.add('ypp-nuke-shorts', 'ypp-hide-shorts');
        } else {
            document.body.classList.remove('ypp-nuke-shorts', 'ypp-hide-shorts');
        }
    }

    _startMonitoring() {
        if (!window.YPP?.sharedObserver) return;
        
        // Observers for Mixes, Shorts, and Playlists were removed because they were setting 
        // useless data attributes that were never used by CSS or JS. 
        // HideShorts and HideMixes have their own dedicated JS files now, and HidePlaylists 
        // uses safe CSS rules.
    }
}

window.YPP = window.YPP || {};
window.YPP.managers = window.YPP.managers || {};
window.YPP.managers.GlobalLayoutManager = GlobalLayoutManager;
