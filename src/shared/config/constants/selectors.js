export const SELECTORS = {
        // Grid & Layout
        GRID_RENDERER: 'ytd-rich-grid-renderer, ytd-grid-renderer',
        GRID_CONTENTS: '#contents',
        GRID_ROW: 'ytd-rich-grid-row',
        VIDEO_ITEM: 'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer',

        // Search Grid
        SEARCH_GRID_CONTENTS: '#contents.ytd-two-column-search-results-renderer',
        SEARCH_VIDEO_RENDERER: 'ytd-video-renderer',

        // Header & Navigation
        MASTHEAD: ['ytd-masthead', '#masthead', '#masthead-container'],
        CHIPS_BAR: ['ytd-feed-filter-chip-bar-renderer', 'yt-chip-cloud-renderer'],
        CHIPS_WRAPPER: ['#chips-wrapper', '.yt-chip-cloud-renderer-container'],

        // Shorts
        SHORTS_SECTION: 'ytd-rich-section-renderer[is-shorts]',
        SHORTS_LINK: 'a[title="Shorts"]',
        SHORTS_SHELF: 'ytd-reel-shelf-renderer',
        SHORTS_TAB: 'ytd-guide-entry-renderer a[title="Shorts"]',
        SHORTS_MINI_GUIDE: 'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
        SHORTS_CONTAINER: 'ytd-shorts',
        SHORTS_CONTAINER_ALT: '#shorts-container',

        // Player
        THEATER_BUTTON: '.ytp-size-button',
        WATCH_FLEXY: 'ytd-watch-flexy, #page-manager > ytd-watch',
        PLAYER: '.html5-video-player, #movie_player',
        PLAYER_CONTAINER: '#player-container-outer',
        PLAYER_OUTER: ['#ytd-player', 'ytd-player[id="ytd-player"]'],
        VIDEO: ['video.html5-main-video', 'video'],
        PLAYER_BAR: '.ytp-chrome-bottom',
        VIDEO_CONTROLS: ['.ytp-right-controls', '.html5-video-controls .ytp-right-controls'],
        SUBTITLES_BTN: ['.ytp-subtitles-button', '.ytp-captions-button'],
        CAPTIONS_WINDOW: ['.ytp-caption-window-bottom', '.ytp-caption-window-top'],

        // Content
        COMMENTS_SECTION: ['ytd-comments', '#comments'],
        MERCH_SHELF: ['ytd-merch-shelf-renderer', '#ticket-shelf'],
        RELATED_ITEMS: ['#related', 'ytd-watch-next-secondary-results-renderer'],
        SIDEBAR: ['#secondary', '#secondary-inner', 'ytd-watch-next-secondary-results-renderer'],
        END_SCREENS: ['.ytp-ce-element', '.html5-endscreen'],

        // Sidebar
        GUIDE_BUTTON: '#guide-button',
        GUIDE_ICON: '#guide-icon',
        APP: 'ytd-app',
        MAIN_GUIDE: 'ytd-guide-renderer',
        MINI_GUIDE: 'ytd-mini-guide-renderer',

        // Search
        SEARCH_CONTAINER: 'ytd-search',
        SECTION_RENDERER: 'ytd-item-section-renderer',
        SEARCH_CONTENTS: '#contents',
        VIDEO_RENDERER: 'ytd-video-renderer',
        PLAYLIST_RENDERER: 'ytd-playlist-renderer',
        RADIO_RENDERER: 'ytd-radio-renderer',
        CHANNEL_RENDERER: 'ytd-channel-renderer',
        SHELF_RENDERER: 'ytd-shelf-renderer',
        RICH_SHELF_RENDERER: 'ytd-rich-shelf-renderer',
        REEL_SHELF_RENDERER: 'ytd-reel-shelf-renderer',
        RICH_ITEM_RENDERER: 'ytd-rich-item-renderer',
        BACKGROUND_PROMO: 'ytd-background-promo-renderer',
        HORIZONTAL_CAROUSEL: 'ytd-horizontal-card-list-renderer',
        FILTER_HEADER: 'ytd-search-sub-menu-renderer',

        // Watched
        WATCHED_OVERLAY: 'ytd-thumbnail-overlay-resume-playback-renderer #progress',
        WATCHED_CONTAINER: 'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer',

        // Ad Skipper
        AD_PLAYER: '.html5-video-player',
        AD_CONTAINER: ['.ad-showing', '.ad-interrupting'],
        AD_SKIP_BUTTON: [
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '.ytp-skip-ad-button',
            '.videoAdUiSkipButton',
            'button[id^="skip-button"]',
            '.ytp-ad-overlay-close-button'
        ],
        AD_OVERLAY: '.ytp-ad-module',
        AD_PLAYER_OVERLAY: '.ytp-ad-player-overlay',

        // Metadata Selectors (Centralized)
        METADATA_SELECTORS: {
            TITLE: [
                'h1.ytd-watch-metadata',
                '#title h1',
                'ytd-shorts-player-overlay-renderer #title'
            ],
            CHANNEL: [
                'ytd-video-owner-renderer #channel-name a',
                '#channel-name a',
                'ytd-reel-player-header-renderer #channel-name a'
            ]
        },
        
        // Mark as Watched
        THUMBNAIL_CONTAINER: 'ytd-thumbnail',

        // Playlist Redesign
        PLAYLIST: {
            HEADER: 'ytd-playlist-header-renderer',
            VIDEO_LIST_RENDERER: 'ytd-playlist-video-list-renderer',
            VIDEO_RENDERER: 'ytd-playlist-video-renderer',
            BROWSE: 'ytd-browse[page-subtype="playlist"]',
            TWO_COLUMN: 'ytd-browse[page-subtype="playlist"] ytd-two-column-browse-results-renderer',
            SECTION_LIST: 'ytd-browse[page-subtype="playlist"] #primary > ytd-section-list-renderer',
            ITEM_SECTION: 'ytd-browse[page-subtype="playlist"] ytd-item-section-renderer'
        },

        // Pages
        PAGES: {
            HOME: 'ytd-browse[page-subtype="home"]',
            HOME_CONTENTS: 'ytd-browse[page-subtype="home"] #contents',
            SUBSCRIPTIONS: 'ytd-browse[page-subtype="subscriptions"]',
            SUBSCRIPTIONS_CONTENTS: 'ytd-browse[page-subtype="subscriptions"] #contents',
            SEARCH_CONTENTS: 'ytd-search #contents'
        }
    };

export const CSS_CLASSES = {
        THEME_ENABLED: 'yt-spiral-tube-theme',
        HIDE_SHORTS: 'ypp-hide-shorts',
        HIDE_MIXES: 'ypp-hide-mixes',
        HIDE_EXPLORE_TOPICS: 'ypp-hide-explore-topics',
        HIDE_WATCHED: 'ypp-hide-watched',
        HIDE_MERCH: 'ypp-hide-merch',
        HIDE_COMMENTS: 'ypp-hide-comments',
        HIDE_ENDSCREENS: 'ypp-hide-endscreens',
        HIDE_LIVE_CHAT: 'ypp-hide-live-chat',
        HIDE_FUNDRAISER: 'ypp-hide-fundraiser',
        DISPLAY_FULL_TITLE: 'ypp-display-full-title',
        SQUARE_CORNERS: 'ypp-square-corners',
        DOPAMINE_DETOX: 'ypp-dopamine-detox',
        ZEN_MODE: 'ypp-zen-mode',
        HOOK_FREE: 'ypp-hook-free-home',
        SIDEBAR_COLLAPSED: 'ypp-sidebar-collapsed',
        SIDEBAR_EXPANDED: 'ypp-sidebar-expanded',
        CUSTOM_SCROLLBAR: 'ypp-custom-scrollbar',
        GRAYSCALE_THUMBNAILS: 'ypp-grayscale-thumbs',

        // Mark as Watched
        MANUALLY_WATCHED: 'ypp-manually-watched',
        WATCHED_ICON: 'ypp-watched-icon',
        WATCHED_MARKER: 'data-ypp-watched', // Attribute set by HideWatched on detected containers

        // Search Redesign
        SEARCH_GRID_MODE: 'ypp-search-grid-mode',
        SEARCH_LIST_MODE: 'ypp-search-list-mode',
        GRID_CONTAINER: 'ypp-search-grid-container',
        GRID_ITEM: 'ypp-grid-item',
        FULL_WIDTH: 'ypp-full-width-item',
        HIDDEN_SHORT: 'ypp-hidden-short',

        // View Toggle
        VIEW_TOGGLE: 'ypp-view-mode-toggle',
        TOGGLE_BTN: 'ypp-toggle-btn',

        // Focus / View Modes
        FOCUS_MODE: 'ypp-focus-mode',
        CINEMA_MODE: 'ypp-cinema-mode',
        MINIMAL_MODE: 'ypp-minimal-mode',
        DOPAMINE_DETOX_STYLE: 'ypp-detox-style',
        CINEMA_STYLE: 'ypp-cinema-style',
        MINIMAL_STYLE: 'ypp-minimal-style',

        // Zen Mode
        ZEN_TOAST: 'ypp-zen-toast',

        // Toast
        TOAST: 'ypp-toast',

        // Page Context
        WATCH_PAGE: 'ypp-watch-page',
        SHORTS_PAGE: 'ypp-shorts-page',
        HOME_PAGE: 'ypp-home-page',

        // Filters
        FILTER_PANEL: 'ypp-filter-panel'
    };
