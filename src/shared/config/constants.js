import { DEFAULT_SETTINGS } from './default-settings.js';

/**
 * Constants for Spiral Tube
 * Centralized configuration, selectors, and settings
 */
window.YPP = window.YPP || {};

window.YPP.CONSTANTS = {
    DEFAULT_SETTINGS,
    // =========================================================================
    // PREMIUM COLORS (56 Themes from Tempo)
    // =========================================================================
    PREMIUM_COLORS: {
        'dark-aqua': '#00ffff',
        'dark-blue-violet': '#8a2be2',
        'dark-brown': '#a52a2a',
        'dark-burly-wood': '#deb887',
        'dark-chartreuse': '#7fff00',
        'dark-chocolate': '#d2691e',
        'dark-coral': '#ff7f50',
        'dark-cornflower-blue': '#6495ed',
        'dark-crimson': '#dc143c',
        'dark-dark-orange': '#ff8c00',
        'dark-dark-orchid': '#9932cc',
        'dark-dark-violet': '#9400d3',
        'dark-deep-pink': '#ff1493',
        'dark-deep-sky-blue': '#00bfff',
        'dark-dodger-blue': '#1e90ff',
        'dark-fire-brick': '#b22222',
        'dark-forest-green': '#228b22',
        'dark-fuchsia': '#ff00ff',
        'dark-gold': '#ffd700',
        'dark-goldenrod': '#daa520',
        'dark-green-yellow': '#adff2f',
        'dark-green': '#008000',
        'dark-hot-pink': '#ff69b4',
        'dark-indian-red': '#cd5c5c',
        'dark-khaki': '#f0e68c',
        'dark-lawn-green': '#7cfc00',
        'dark-lime-green': '#32cd32',
        'dark-lime': '#00ff00',
        'dark-olive': '#808000',
        'dark-orange-red': '#ff4500',
        'dark-orange': '#ffa500',
        'dark-orchid': '#da70d6',
        'dark-peru': '#cd853f',
        'dark-purple': '#800080',
        'dark-rebecca-purple': '#663399',
        'dark-red': '#ff0000',
        'dark-royal-blue': '#4169e1',
        'dark-saddle-brown': '#8b4513',
        'dark-salmon': '#fa8072',
        'dark-sandy-brown': '#f4a460',
        'dark-sea-green': '#2e8b57',
        'dark-sienna': '#a0522d',
        'dark-silver': '#c0c0c0',
        'dark-sky-blue': '#87ceeb',
        'dark-slate-blue': '#6a5acd',
        'dark-slate-grey': '#708090',
        'dark-spring-green': '#00ff7f',
        'dark-steel-blue': '#4682b4',
        'dark-tan': '#d2b48c',
        'dark-teal': '#008080',
        'dark-tomato': '#ff6347',
        'dark-turquoise': '#40e0d0',
        'dark-violet': '#ee82ee',
        'dark-wheat': '#f5deb3',
        'dark-yellow-green': '#9acd32',
        'dark-yellow': '#ffff00'
    },
    // =========================================================================
    // DOM SELECTORS
    // =========================================================================
    SELECTORS: {
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
        }
    },

    // =========================================================================
    // CSS CLASSES
    // =========================================================================
    CSS_CLASSES: {
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

        // Player Tools
        PLAYER_TOOLS: 'ypp-player-tools',
        FILTER_PANEL: 'ypp-filter-panel'
    },

    // =========================================================================
    // DEFAULT SETTINGS
    // =========================================================================
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,



    // =========================================================================
    // GRID CONFIGURATION
    // =========================================================================
    GRID: {
        DESKTOP_COLUMNS: 4,
        ITEM_GAP: 16,
        ROW_GAP: 32,
        MIN_ITEM_WIDTH: 280,
        RESPONSIVE_BREAKPOINTS: {
            LARGE: 1600,
            MEDIUM: 1200,
            SMALL: 900,
            MOBILE: 640
        }
    },

    // =========================================================================
    // TIMING CONSTANTS (milliseconds)
    // =========================================================================
    TIMINGS: {
        // Waits and Timeouts
        ELEMENT_WAIT_DEFAULT: 10000,
        TOAST_DISPLAY: 3000,
        TOAST_FADE: 300,

        // Polling and Intervals
        AD_SKIPPER_INTERVAL: 500,
        PLAYER_TOOLS_INTERVAL: 1000,
        SHORTS_CHECK_INTERVAL: 500,
        STUDY_ENFORCE_INTERVAL: 5000,

        // Debounce Delays
        DEBOUNCE_DEFAULT: 50,
        DEBOUNCE_SEARCH: 500,
        DEBOUNCE_RESIZE: 150,
        DEBOUNCE_NAVIGATION: 200,

        // Animation
        TRANSITION_FAST: 150,
        TRANSITION_MEDIUM: 300,
        TRANSITION_SLOW: 500,

        // Ad Skipper
        AD_PLAYBACK_SPEED: 16
    },

    // =========================================================================
    // STUDY MODE
    // =========================================================================
    STUDY: {
        DEFAULT_SPEED: 1.25,
        MIN_SPEED: 0.1,
        MAX_SPEED: 5.0,
        SPEED_STEP: 0.1
    },

    // =========================================================================
    // PLAYER TOOLS
    // =========================================================================
    PLAYER: {
        SPEED_MIN: 0.1,
        SPEED_MAX: 5.0,
        SPEED_STEP: 0.1,
        FILTER_MIN: 50,
        FILTER_MAX: 200,
        FILTER_DEFAULT: 100
    },

    // =========================================================================
    // AMBIENT MODE
    // =========================================================================
    AMBIENT: {
        FPS: 10,
        SAMPLE_STEP: 10,
        GLOW_SIZE: 150,
        GLOW_BLUR: 30,
        OPACITY: 0.5,
        CANVAS_SIZE: 50
    },

    // =========================================================================
    // VIDEO THUMBNAIL
    // =========================================================================
    THUMBNAIL: {
        ASPECT_RATIO: '16/9',
        BORDER_RADIUS: '12px'
    },

    // =========================================================================
    // TYPOGRAPHY
    // =========================================================================
    TYPOGRAPHY: {
        TITLE_FONT_SIZE: '1.6rem',
        TITLE_LINE_HEIGHT: '2.2rem',
        TITLE_MAX_LINES: 2,
        METADATA_FONT_SIZE: '1.3rem'
    },

    // =========================================================================
    // THEME DEFINITIONS
    // =========================================================================
    THEMES: {
        SYSTEM: { key: 'system', label: 'System (Auto)', class: '' },
        DEFAULT: { key: 'default', label: 'Default (Premium)', class: '' },
        OCEAN: { key: 'ocean', label: 'Ocean Blue', class: 'ypp-theme-ocean' },
        SUNSET: { key: 'sunset', label: 'Sunset Glow', class: 'ypp-theme-sunset' },
        DRACULA: { key: 'dracula', label: 'Dracula', class: 'ypp-theme-dracula' },
        MIDNIGHT: { key: 'midnight', label: 'Midnight (OLED)', class: 'ypp-theme-midnight' },
        CHERRY: { key: 'cherry', label: 'Cherry Blossom', class: 'ypp-theme-cherry' },
        COFFEE: { key: 'coffee', label: 'Coffee', class: 'ypp-theme-coffee' },
        NORD: { key: 'nord', label: 'Nord Frost', class: 'ypp-theme-nord' },
        NATURE: { key: 'nature', label: 'Nature', class: 'ypp-theme-nature' },
        VINTAGE: { key: 'vintage', label: 'Vintage', class: 'ypp-theme-vintage' },
        CYBERPUNK: { key: 'cyberpunk', label: 'Cyberpunk', class: 'ypp-theme-cyberpunk' },
        HOLOGRAPHIC: { key: 'holographic', label: 'Hologram', class: 'ypp-theme-hologram' },
        DEEP_SPACE: { key: 'deepspace', label: 'Deep Space', class: 'ypp-theme-deepspace' },
        NEBULA: { key: 'nebula', label: 'Nebula', class: 'ypp-theme-nebula' },
        DISCORD: { key: 'discord', label: 'Discord Dark', class: 'ypp-theme-discord' },
        HACKER: { key: 'hacker', label: 'Hacker Green', class: 'ypp-theme-hacker' },
        BLOODMOON: { key: 'bloodmoon', label: 'Blood Moon', class: 'ypp-theme-bloodmoon' },
        ABYSS: { key: 'abyss', label: 'Abyss', class: 'ypp-theme-abyss' },
        EMBER: { key: 'ember', label: 'Ember', class: 'ypp-theme-ember' },
        OUTRUN: { key: 'outrun', label: 'Outrun Synth', class: 'ypp-theme-outrun' },
        RETRO: { key: 'retro', label: 'Retro OS', class: 'ypp-theme-retro' },
        CHRISTMAS: { key: 'christmas', label: 'Christmas (Festive)', class: 'ypp-theme-christmas' },
        HARRY_POTTER: { key: 'harry-potter', label: 'Hogwarts Magic (Harry Potter)', class: 'ypp-theme-harry-potter' },
        AURORA: { key: 'aurora', label: 'Aurora', class: 'ypp-theme-aurora' },
        AUTUMN: { key: 'autumn', label: 'Autumn', class: 'ypp-theme-autumn' }
    },

    // FEATURE_MAP removed. Features self-register via FeatureManager.register()
};

export const CARD_STYLES = [
  {
    id: 'abyss',
    label: 'Abyss'
  },
  {
    id: 'aurora',
    label: 'Aurora'
  },
  {
    id: 'autumn',
    label: 'Autumn'
  },
  {
    id: 'bloodmoon',
    label: 'Bloodmoon'
  },
  {
    id: 'blue-sky',
    label: 'Blue Sky'
  },
  {
    id: 'brutalism',
    label: 'Brutalism'
  },
  {
    id: 'cairo-red',
    label: 'Cairo Red'
  },
  {
    id: 'cherry',
    label: 'Cherry'
  },
  {
    id: 'christmas',
    label: 'Christmas'
  },
  {
    id: 'claymorphism',
    label: 'Claymorphism'
  },
  {
    id: 'coffee',
    label: 'Coffee'
  },
  {
    id: 'colorize',
    label: 'Colorize'
  },
  {
    id: 'compact',
    label: 'Compact'
  },
  {
    id: 'crystal-glass',
    label: 'Crystal Glass'
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk'
  },
  {
    id: 'deepspace',
    label: 'Deepspace'
  },
  {
    id: 'default',
    label: 'Default'
  },
  {
    id: 'discord',
    label: 'Discord'
  },
  {
    id: 'dracula',
    label: 'Dracula'
  },
  {
    id: 'elevated',
    label: 'Elevated'
  },
  {
    id: 'ember',
    label: 'Ember'
  },
  {
    id: 'flat',
    label: 'Flat'
  },
  {
    id: 'fluent',
    label: 'Fluent'
  },
  {
    id: 'folder',
    label: 'Folder'
  },
  {
    id: 'frosted',
    label: 'Frosted'
  },
  {
    id: 'frutiger-aero',
    label: 'Frutiger Aero'
  },
  {
    id: 'galaxy',
    label: 'Galaxy'
  },
  {
    id: 'glass',
    label: 'Glass'
  },
  {
    id: 'glassmorphism',
    label: 'Glassmorphism'
  },
  {
    id: 'gothic',
    label: 'Gothic'
  },
  {
    id: 'grunge',
    label: 'Grunge'
  },
  {
    id: 'hacker',
    label: 'Hacker'
  },
  {
    id: 'harry-potter',
    label: 'Hogwarts Magic (Harry Potter) Video'
  },
  {
    id: 'hologram',
    label: 'Hologram'
  },
  {
    id: 'holographic',
    label: 'Holographic'
  },
  {
    id: 'ice-blue',
    label: 'Ice Blue'
  },
  {
    id: 'immersive',
    label: 'Immersive Glass'
  },
  {
    id: 'kawaii',
    label: 'Kawaii'
  },
  {
    id: 'liquid-glass',
    label: 'Liquid Glass'
  },
  {
    id: 'material',
    label: 'Material'
  },
  {
    id: 'matrix',
    label: 'Matrix'
  },
  {
    id: 'maximalism',
    label: 'Maximalism'
  },
  {
    id: 'midnight',
    label: 'Midnight'
  },
  {
    id: 'minimalism',
    label: 'Minimalism'
  },
  {
    id: 'minimalist',
    label: 'Minimalist'
  },
  {
    id: 'nature',
    label: 'Nature'
  },
  {
    id: 'nebula',
    label: 'Nebula'
  },
  {
    id: 'neo-brutalism',
    label: 'Neo Brutalism'
  },
  {
    id: 'neon',
    label: 'Neon'
  },
  {
    id: 'neumorphic',
    label: 'Neumorphic'
  },
  {
    id: 'nord',
    label: 'Nord'
  },
  {
    id: 'ocean',
    label: 'Ocean'
  },
  {
    id: 'origami',
    label: 'Origami'
  },
  {
    id: 'outrun',
    label: 'Outrun'
  },
  {
    id: 'pink',
    label: 'Pink'
  },
  {
    id: 'polaroid',
    label: 'Polaroid'
  },
  {
    id: 'retro-wave',
    label: 'Retro Wave'
  },
  {
    id: 'retro',
    label: 'Retro'
  },
  {
    id: 'retrowave-green',
    label: 'Retrowave Green'
  },
  {
    id: 'sakura',
    label: 'Sakura'
  },
  {
    id: 'search-card-compat',
    label: 'Search Card Compat'
  },
  {
    id: 'skeuomorphic',
    label: 'Skeuomorphic'
  },
  {
    id: 'spring',
    label: 'Spring'
  },
  {
    id: 'steampunk',
    label: 'Steampunk'
  },
  {
    id: 'summer',
    label: 'Summer'
  },
  {
    id: 'sunset',
    label: 'Sunset'
  },
  {
    id: 'technozen',
    label: 'Technozen'
  },
  {
    id: 'terminalism',
    label: 'Terminalism'
  },
  {
    id: 'vaporwave',
    label: 'Vaporwave'
  },
  {
    id: 'vintage',
    label: 'Vintage'
  },
  {
    id: 'winter',
    label: 'Winter'
  },
  {
    id: 'woodblock',
    label: 'Woodblock'
  },
  {
    id: 'y2k',
    label: 'Y2k'
  }
];

export const YOUTUBE_PAGE_THEMES = [
  {
    id: 'abyss',
    label: 'Abyss'
  },
  {
    id: 'aurora',
    label: 'Aurora'
  },
  {
    id: 'autumn',
    label: 'Autumn'
  },
  {
    id: 'bloodmoon',
    label: 'Bloodmoon'
  },
  {
    id: 'blue-sky',
    label: 'Blue Sky'
  },
  {
    id: 'brutalism',
    label: 'Brutalism'
  },
  {
    id: 'cairo-red',
    label: 'Cairo Red'
  },
  {
    id: 'cherry',
    label: 'Cherry'
  },
  {
    id: 'christmas',
    label: 'Christmas'
  },
  {
    id: 'claymorphism',
    label: 'Claymorphism'
  },
  {
    id: 'coffee',
    label: 'Coffee'
  },
  {
    id: 'colorize',
    label: 'Colorize'
  },
  {
    id: 'compact',
    label: 'Compact'
  },
  {
    id: 'crystal-glass',
    label: 'Crystal Glass'
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk'
  },
  {
    id: 'deepspace',
    label: 'Deepspace'
  },
  {
    id: 'default',
    label: 'Default'
  },
  {
    id: 'discord',
    label: 'Discord'
  },
  {
    id: 'dracula',
    label: 'Dracula'
  },
  {
    id: 'elevated',
    label: 'Elevated'
  },
  {
    id: 'ember',
    label: 'Ember'
  },
  {
    id: 'flat',
    label: 'Flat'
  },
  {
    id: 'fluent',
    label: 'Fluent'
  },
  {
    id: 'folder',
    label: 'Folder'
  },
  {
    id: 'frosted',
    label: 'Frosted'
  },
  {
    id: 'frutiger-aero',
    label: 'Frutiger Aero'
  },
  {
    id: 'galaxy',
    label: 'Galaxy'
  },
  {
    id: 'glass',
    label: 'Glass'
  },
  {
    id: 'glassmorphism',
    label: 'Glassmorphism'
  },
  {
    id: 'gothic',
    label: 'Gothic'
  },
  {
    id: 'grunge',
    label: 'Grunge'
  },
  {
    id: 'hacker',
    label: 'Hacker'
  },
  {
    id: 'harry-potter',
    label: 'Hogwarts Magic (Harry Potter) Video'
  },
  {
    id: 'hologram',
    label: 'Hologram'
  },
  {
    id: 'holographic',
    label: 'Holographic'
  },
  {
    id: 'ice-blue',
    label: 'Ice Blue'
  },
  {
    id: 'immersive',
    label: 'Immersive Glass'
  },
  {
    id: 'kawaii',
    label: 'Kawaii'
  },
  {
    id: 'liquid-glass',
    label: 'Liquid Glass'
  },
  {
    id: 'material',
    label: 'Material'
  },
  {
    id: 'matrix',
    label: 'Matrix'
  },
  {
    id: 'maximalism',
    label: 'Maximalism'
  },
  {
    id: 'midnight',
    label: 'Midnight'
  },
  {
    id: 'minimalism',
    label: 'Minimalism'
  },
  {
    id: 'minimalist',
    label: 'Minimalist'
  },
  {
    id: 'nature',
    label: 'Nature'
  },
  {
    id: 'nebula',
    label: 'Nebula'
  },
  {
    id: 'neo-brutalism',
    label: 'Neo Brutalism'
  },
  {
    id: 'neon',
    label: 'Neon'
  },
  {
    id: 'neumorphic',
    label: 'Neumorphic'
  },
  {
    id: 'nord',
    label: 'Nord'
  },
  {
    id: 'ocean',
    label: 'Ocean'
  },
  {
    id: 'origami',
    label: 'Origami'
  },
  {
    id: 'outrun',
    label: 'Outrun'
  },
  {
    id: 'pink',
    label: 'Pink'
  },
  {
    id: 'polaroid',
    label: 'Polaroid'
  },
  {
    id: 'retro-wave',
    label: 'Retro Wave'
  },
  {
    id: 'retro',
    label: 'Retro'
  },
  {
    id: 'retrowave-green',
    label: 'Retrowave Green'
  },
  {
    id: 'sakura',
    label: 'Sakura'
  },
  {
    id: 'search-card-compat',
    label: 'Search Card Compat'
  },
  {
    id: 'skeuomorphic',
    label: 'Skeuomorphic'
  },
  {
    id: 'spring',
    label: 'Spring'
  },
  {
    id: 'steampunk',
    label: 'Steampunk'
  },
  {
    id: 'summer',
    label: 'Summer'
  },
  {
    id: 'sunset',
    label: 'Sunset'
  },
  {
    id: 'technozen',
    label: 'Technozen'
  },
  {
    id: 'terminalism',
    label: 'Terminalism'
  },
  {
    id: 'vaporwave',
    label: 'Vaporwave'
  },
  {
    id: 'vintage',
    label: 'Vintage'
  },
  {
    id: 'winter',
    label: 'Winter'
  },
  {
    id: 'woodblock',
    label: 'Woodblock'
  },
  {
    id: 'y2k',
    label: 'Y2k'
  }
];

// Deep freeze CONSTANTS.DEFAULT_SETTINGS to prevent accidental state mutation
const deepFreeze = obj => {
    if (obj === null || typeof obj !== 'object' || Object.isFrozen(obj)) {
        return obj;
    }
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(prop => {
        const val = obj[prop];
        if (typeof val === 'object' && val !== null && !Object.isFrozen(val)) {
            deepFreeze(val);
        }
    });
    return obj;
};

if (window.YPP.CONSTANTS && window.YPP.CONSTANTS.DEFAULT_SETTINGS) {
    deepFreeze(window.YPP.CONSTANTS.DEFAULT_SETTINGS);
}

