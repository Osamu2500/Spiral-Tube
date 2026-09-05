export const DEFAULT_SETTINGS = {

  // --- Wired Feature Defaults ---
  smartHistory: false,
  dateFilterEnabled: false,
  viewsFilterEnabled: false,
  channelBlacklistEnabled: false,
  channelWhitelistEnabled: false,
  customCursor: 'default',
  useSquareCorners: false,
  customThemes: {},
  customBackgroundImageBlur: 0,
  customBackgroundImageBrightness: 1.0,
  customBackgroundImageSaturation: 1.0,
  fontScale: 100,
  accentColor: '#ff4e45',
  reduceAnimations: false,
  netflixSubtitles: false,
  volumeBalance: 0,
  volumeEqBands: '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]',
  volumeMono: false,
  volumeActiveEffect: 'none',
  shortsVolumeNormalizer: true,
  vscSpeedStep: 0.25,
  vscControllerOpacity: 0.3,
  cinemaFilterSepia: 0,
  cinemaFilterGrayscale: 0,
  cinemaFilterInvert: 0,
  extraRoundedUI: false,
  ambientIntensity: 0.6,
  ambientBlur: 120,
  audioModeEnabled: false,
  videoResumer: true,
  glassPlayerUI: true,
  advancedShortcuts: [],
  autoLikeSubscribedOnly: false,
  autoLikeWaitAds: true,
  autoLikeDelayType: 'seconds',
  autoLikeDelaySeconds: 1,
  autoLikeDelayPercent: 50,
  autoLikeHumanize: false,
  cleanMixUrls: false,
  feedFilter_live_visible: true,
  feedFilter_live_default: false,
  feedFilter_streamed_visible: true,
  feedFilter_streamed_default: false,
  feedFilter_video_visible: true,
  feedFilter_video_default: false,
  feedFilter_shorts_visible: true,
  feedFilter_shorts_default: false,
  feedFilter_scheduled_visible: true,
  feedFilter_scheduled_default: false,
  feedFilter_notifon_visible: false,
  feedFilter_notifon_default: false,
  feedFilter_notifoff_visible: false,
  feedFilter_notifoff_default: false,
  feedFilter_posts_visible: false,
  feedFilter_posts_default: false,
  feedFilter_playlist_visible: false,
  feedFilter_playlist_default: false,
  feedFilter_unwatched_visible: true,
  feedFilter_unwatched_default: false,
  feedFilter_watched_visible: true,
  feedFilter_watched_default: false,
  feedFilter_search_visible: true,
  feedFilter_search_default: '',
  feedFilter_opt_multiselect: false,
  feedFilter_opt_responsive: true,
  feedFilter_page_subscriptions: true,
  feedFilter_page_home: true,
  feedFilter_page_shorts: true,
  feedFilter_page_history: true,
  feedFilter_page_playlists: true,
  feedFilter_page_allplaylists: true,
  feedFilter_page_hashtag: true,
  blockedChannels: '',
  blockedKeywords: '',
  playlistDuration: true,
  globalPlayerBarPosition: 'right',
  gpb_showFullscreen: true,
  splitScrolling: false,
  enableFilterBar: false,
  enableChannelHealth: false,
  popupUiTheme: 'liquid-glass',
  youtubePageTheme: 'default',
  hideAiLogo: false,

  schemaVersion: 2,
  premiumTheme: true,
  premiumLogo: true,
  // Theme

  // Image Background Theme

  // Advanced Theming

  // Layout

  // Visibility
  // (Removed hideShorts and hideSearchShorts - combined into aggressiveShortsBlock)

  extensionLanguage: 'en',
  // Theme
  enableThemeEffects: true,
  enableAccountMenu: true,
  activeTheme: 'default',
  cardStyle: 'glass',
  trueBlack: false,

  // Image Background Theme
  customBackgroundImage: null,
  customBackgroundImageIntensity: 0.6,
  customBackgroundImageExtractColors: true,

  // Advanced Theming

  // Layout
  autoScaleLayout: true,

  homeColumns: 0, // 0 = auto (driven by AutoScaleGrid), 1–10 = manual override
  searchColumns: 4,
  channelColumns: 4,
  subscriptionsColumns: 4,
  historyColumns: 4,
  cinematicMode: false,

  // Visibility
  // (Removed hideShorts and hideSearchShorts - combined into aggressiveShortsBlock)
  hideMixes: false,
  hideMixesHome: true,
  hideMixesChannel: true,
  hideMixesSubs: true,
  hideMixesSearch: true,
  hideMixesRelated: true,
  hideExploreTopics: false,
  hidePromoShelves: false,
  feedFilter: true,
  hideLiveStreams: false,
  hideUpcoming: false,
  hideMemberships: false,
  hideMembersOnly: false, // Hide members-only videos
  feedFilterKeywords: '',
  filterMode: 'dim',
  // Per-page toggles for FeedFilter (Advanced Mode)
  // Per-page toggles for MetadataFilters (Advanced Mode)
  metaFilterHome: true,
  metaFilterSubs: true,
  metaFilterSearch: true,
  metaFilterChannel: true,
  metaFilterRelated: true,
  shortsFilterHome: true,
  shortsFilterSubs: true,
  shortsFilterSearch: true,
  shortsFilterChannel: true,
  shortsFilterRelated: true,
  // On-page controls
  hideOnPageControls: false,
  hideWatched: false,
  hideWatchedMode: 'dim',
  dateFilterOlderThreshold: 0,
  enableHeaderButton: true,
  hideWatchedThreshold: 80,
  hideWatchedHome: true,
  hideWatchedChannel: true,
  hideWatchedSubs: true,
  hideWatchedSearch: true,
  hideWatchedRelated: true,
  hideMerch: false,
  hideComments: false,
  hideLiveChat: false,
  hideFundraiser: false,
  headerNavEnabled: true,
  hideEndScreens: false,
  hideSearchShelves: true,
  hideSearchMixes: false,
  hideSearchPlaylists: false,
  hideSearchPodcasts: false,
  hideSearchMusic: false,
  hideSearchTopics: false,
  hideChannelCards: false,
  hideCards: false, // Player video card pop-ups
  hideAnnotations: false, // Player on-screen annotations
  hideRelated: false, // Watch page related sidebar
  hideVoiceSearch: false, // Header microphone icon
  hideUploadButton: false, // Header upload button
  hideTrending: false, // Trending guide entries
  hideFeed: false, // Homepage feed
  aggressiveShortsBlock: false, // Nuke shorts everywhere
  autoVideoFilter: true,
  hidePlayerTopics: false,
  hideCountryCode: false,       // Hide country code next to logo
  hideThanksDonate: false,      // Hide Thanks / Donate / Patreon buttons
  hidePlayerBranding: false,    // Hide channel watermark in player
  hideUselessGuideLinks: false, // Hide Help, Feedback, Report history in sidebar
  hidePaidPromotion: false,     // Hide 'Includes paid promotion' banner

  // Player Page Declutter (OFF by default)
  hideTopBarOnPlayer: false,    // Hide top navigation bar on watch page, shows on hover
  hideVideoTitle: false,        // Hide video title below the player
  hideChannelBar: false,        // Hide channel name + subscribe button
  hideVideoDescription: false,  // Hide the description box
  hideActionButtons: false,     // Hide Like / Share / More buttons

  // Player
  autoCinema: false,

  autoQuality: 'highres',

  enableSnapshot: true,
  enableLoop: true,
  enableRemainingTime: true,
  enableVolumeBoost: true,
  volumeLevel: 1,

  // Search Redesign
  searchGrid: true,

  // Navigation
  navTrending: true,
  navShorts: true,
  navSubscriptions: true,
  navWatchLater: true,
  navPlaylists: true,
  navHistory: true,
  enableCustomSidebar: true,
  sidebarLayout: 'spacious',
  searchLayout: 'regular',

  // Playlist & History
  continueWatching: true,
  reversePlaylist: false,
  historyRedesign: true,
  playlistRedesign: true,

  // Shorts Tools
  shortsAutoScroll: false,
  redirectShorts: false,
  stopShortsLooping: false,
  
  hideClickbaitEnabled: false,
  hideClickbaitEmojis: true,
  hideClickbaitPunctuation: true,

  // Player Tools
  enableCustomSpeed: true,
  enableCinemaFilters: true,
  enableGlobalPlayerBar: true,
  cinemaFilterIndex: 0,
  cinemaFilterBrightness: 100,
  cinemaFilterContrast: 100,
  cinemaFilterSaturate: 100,
  cinemaFilterHue: 0,
  cinemaFilterBlur: 0,
  cinemaFilterOpacity: 100,

  // Custom Player Bar
  pb_snapshot: 'front',
  pb_loop: 'front',
  pb_speed: 'front',
  pb_bookmark: 'front',
  pb_pip: 'front',
  pb_volume: 'front',
  pb_cinema: 'front',
  pb_native_play: 'front',
  pb_native_next: 'front',
  pb_native_mute: 'front',
  pb_native_cast: 'front',
  pb_native_autoplay: 'front',
  pb_native_cc: 'front',
  pb_native_miniplayer: 'front',
  pb_native_theater: 'front',
  pb_native_fullscreen: 'front',

  // Global Player Bar toggles
  gpb_showPlay: true,
  gpb_showTime: true,
  gpb_showVolume: true,
  gpb_showVolumeBoost: true,
  gpb_showFilters: true,
  gpb_showLoop: true,
  gpb_showPip: true,
  zenMode: false,

  // Focus Mode
  dopamineDetox: false,
  enableFocusMode: false,
  cinemaMode: false,
  minimalMode: false,
  seamlessModeGridCols: 4,

  // Auto Actions
  autoPiP: false,

  // Player Automation
  autoPlayNext: false,

  // New Features
  autoLike: false,
  autoLikeThreshold: 50,
  copyLinkButton: true,
  copyLinkHome: true,
  copyLinkChannel: true,
  copyLinkSubs: true,
  copyLinkSearch: true,
  copyLinkRelated: true,
  hidePlaylists: false,
  hidePlaylistsHome: true,
  hidePlaylistsChannel: true,
  hidePlaylistsSubs: true,
  hidePlaylistsSearch: true,
  hidePlaylistsRelated: true,
  hidePodcasts: false,
  hidePodcastsHome: true,
  hidePodcastsChannel: true,
  hidePodcastsSubs: true,
  hidePodcastsSearch: true,
  hidePodcastsRelated: true,
  hidePosts: false,
  hidePostsHome: true,
  hidePostsChannel: true,
  hidePostsSubs: true,
  hidePostsSearch: true,
  hidePostsRelated: true,
  multiSelect: true,
  hideMetrics: false,
  hideThumbnails: false,
  intentionalDelay: false,
  intentionalDelayTime: 3,
  ambientMode: false,
  autoPause: false,
  commentFilter: false,
  commentFilterAction: 'dim', // 'dim' | 'hide'
  commentFilterCustomKeywords: '', // comma-separated user keywords
  enableBookmarks: true,

  // Study Mode
  studyMode: false,
  
  // Seamless Mode
  seamlessMode: false,

  // Stats Visualizer

  // Watch Time Alert
  watchTimeAlert: false,
  watchTimeAlertHours: 2,

  // Keyboard Shortcuts
  keyboardShortcuts: true,
  shortcut_studyMode: '',
  shortcut_focusMode: 'Shift+F',
  shortcut_cinemaMode: 'Shift+C',
  shortcut_minimalMode: 'Shift+M',
  shortcut_snapshot: 'Shift+S',
  shortcut_loop: 'Shift+L',
  shortcut_pip: 'Shift+P',
  shortcut_ambientMode: 'Shift+A',
  shortcut_seamlessMode: 'Shift+E',

  // Video Speed Controller (Advanced)
  vscAudioSupport: false,
  vscRememberSpeed: true,
  vscHideByDefault: false,
  vscForceSpeed: false,
  vscShortcuts: [
    { action: 'showHide', key: 'V', value: null },
    { action: 'decrease', key: 'Z', value: 0.25 },
    { action: 'increase', key: 'X', value: 0.25 },
    { action: 'rewind', key: 'W', value: 10 },
    { action: 'advance', key: 'E', value: 10 },
    { action: 'reset', key: 'A', value: 1.0 },
    { action: 'preferred', key: 'Q', value: 2.0 },
    { action: 'mute', key: '', value: null },
    { action: 'decreaseVolume', key: '', value: null },
    { action: 'increaseVolume', key: '', value: null },
    { action: 'pause', key: '', value: null },
    { action: 'setMarker', key: '', value: null },
    { action: 'jumpMarker', key: '', value: null },
  ],

  // Onboarding

  // --- YouTube Pro Plus Ported Settings ---

  resumeBadges: true,

  // --- New UserStyles & GreasyFork Features ---
  realCinemaMode: true,
  showLiveStreamTime: true,
  twoColumnSubscriptions: true,

  saveSupremeUI: true,


  // enableTabviewSidebar removed; merged into seamlessMode
};
