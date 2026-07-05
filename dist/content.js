var ci=Object.defineProperty;var pi=(ke,ye,Ie)=>ye in ke?ci(ke,ye,{enumerable:!0,configurable:!0,writable:!0,value:Ie}):ke[ye]=Ie;var G=(ke,ye,Ie)=>pi(ke,typeof ye!="symbol"?ye+"":ye,Ie);(function(){"use strict";var xe,K,ae,te,ve,Ae,ue,se,he,Le,Se,Me;const ke={schemaVersion:1,premiumTheme:!0,enableThemeEffects:!0,gridAnimator:!0,enableAccountMenu:!0,activeTheme:"default",cardStyle:"glass",trueBlack:!1,hideScrollbar:!1,customScrollbar:!1,grayscaleThumbnails:!1,layout:!0,grid4x4:!1,autoScaleLayout:!0,homeColumns:0,searchColumns:4,channelColumns:4,subscriptionsColumns:4,historyColumns:4,displayFullTitle:!1,hideShorts:!1,hideSearchShorts:!1,hideMixes:!1,hideExploreTopics:!1,hidePromoShelves:!1,feedFilter:!0,hideLiveStreams:!1,hideUpcoming:!1,hidePosts:!1,feedFilterKeywords:"",hideWatched:!1,hideWatchedMode:"dim",hideWatchedThreshold:80,enableMarkWatched:!0,hideMerch:!1,hideComments:!1,hideLiveChat:!1,hideFundraiser:!1,headerNavEnabled:!0,hideEndScreens:!1,hideSearchShelves:!0,hideChannelCards:!1,hideCards:!1,hideAnnotations:!1,hideRelated:!1,hideVoiceSearch:!1,hideTrending:!1,hideFeed:!1,hideShortsInteraction:!1,aggressiveShortsBlock:!1,autoVideoFilter:!0,hidePlayerTopics:!1,autoCinema:!1,autoQuality:"highres",enablePiP:!0,enableTranscript:!0,enableSnapshot:!0,enableLoop:!0,enableRemainingTime:!0,enableVolumeBoost:!0,volumeLevel:1,volumeWidener:!1,volumeWarmth:0,volumeBoostBass:0,volumeBoostTreble:0,searchGrid:!0,cleanSearch:!0,navTrending:!0,navShorts:!0,navSubscriptions:!0,navWatchLater:!0,navPlaylists:!0,navHistory:!0,enableCustomSidebar:!0,sidebarLayout:"spacious",continueWatching:!0,reversePlaylist:!1,historyRedesign:!0,playlistRedesign:!0,shortsAutoScroll:!1,redirectShorts:!1,stopShortsLooping:!1,hideShortVideos:!1,minVideoDuration:2,enableCustomSpeed:!0,enableCinemaFilters:!0,enableGlobalPlayerBar:!0,cinemaFilterIndex:0,cinemaFilterBrightness:100,cinemaFilterContrast:100,cinemaFilterSaturate:100,cinemaFilterHue:0,cinemaFilterBlur:0,cinemaFilterOpacity:100,pb_snapshot:"front",pb_loop:"front",pb_speed:"front",pb_bookmark:"front",pb_pip:"front",pb_volume:"front",pb_cinema:"front",pb_native_play:"front",pb_native_next:"front",pb_native_mute:"front",pb_native_cast:"front",pb_native_autoplay:"front",pb_native_cc:"front",pb_native_miniplayer:"front",pb_native_theater:"front",pb_native_fullscreen:"front",gpb_showPlay:!0,gpb_showTime:!0,gpb_showVolume:!0,gpb_showVolumeBoost:!0,gpb_showFilters:!0,gpb_showLoop:!0,gpb_showPip:!0,gpb_showFullscreen:!0,adSkipper:!0,sponsorBlock:!0,sb_sponsor:!0,sb_intro:!0,sb_selfpromo:!0,sb_interaction:!1,sb_music_offtopic:!1,sb_preview:!1,returnYouTubeDislike:!0,blueLight:0,dim:0,zenMode:!1,dopamineDetox:!1,enableFocusMode:!1,cinemaMode:!1,minimalMode:!1,autoPiP:!1,floatingPlayer:!1,autoSkipAds:!0,autoSkipPromos:!1,autoSkipSponsors:!1,autoPlayNext:!1,autoLike:!1,autoLikeThreshold:50,hidePlaylists:!1,hidePodcasts:!1,multiSelect:!0,hideMetrics:!1,hideThumbnails:!1,intentionalDelay:!1,intentionalDelayTime:3,ambientMode:!1,videoControlsEnabled:!0,wheelControls:!0,audioCompressor:!1,autoPause:!1,commentFilter:!1,commentFilterAction:"dim",commentFilterCustomKeywords:"",contextMenu:!0,enableBookmarks:!0,studyMode:!1,statsVisualizer:!1,watchTimeAlert:!1,watchTimeAlertHours:2,keyboardShortcuts:!0,shortcut_zenMode:"Shift+Z",shortcut_focusMode:"Shift+F",shortcut_cinemaMode:"Shift+C",shortcut_minimalMode:"Shift+M",shortcut_snapshot:"Shift+S",shortcut_loop:"Shift+L",shortcut_pip:"Shift+P",shortcut_ambientMode:"Shift+A",vscAudioSupport:!1,vscRememberSpeed:!0,vscHideByDefault:!1,vscForceSpeed:!1,vscShortcuts:[{action:"showHide",key:"V",value:null},{action:"decrease",key:"Z",value:.25},{action:"increase",key:"X",value:.25},{action:"rewind",key:"W",value:10},{action:"advance",key:"E",value:10},{action:"reset",key:"A",value:1},{action:"preferred",key:"Q",value:2},{action:"mute",key:"",value:null},{action:"decreaseVolume",key:"",value:null},{action:"increaseVolume",key:"",value:null},{action:"pause",key:"",value:null},{action:"setMarker",key:"",value:null},{action:"jumpMarker",key:"",value:null}],hasSeenOnboarding:!1,premiumLogo:!0,smartDownload:!0,resumeBadges:!0,speedBooster:!0,liquidGlassTheme:!1};window.YPP=window.YPP||{},window.YPP.CONSTANTS={DEFAULT_SETTINGS:ke,PREMIUM_COLORS:{"dark-aqua":"#00ffff","dark-blue-violet":"#8a2be2","dark-brown":"#a52a2a","dark-burly-wood":"#deb887","dark-chartreuse":"#7fff00","dark-chocolate":"#d2691e","dark-coral":"#ff7f50","dark-cornflower-blue":"#6495ed","dark-crimson":"#dc143c","dark-dark-orange":"#ff8c00","dark-dark-orchid":"#9932cc","dark-dark-violet":"#9400d3","dark-deep-pink":"#ff1493","dark-deep-sky-blue":"#00bfff","dark-dodger-blue":"#1e90ff","dark-fire-brick":"#b22222","dark-forest-green":"#228b22","dark-fuchsia":"#ff00ff","dark-gold":"#ffd700","dark-goldenrod":"#daa520","dark-green-yellow":"#adff2f","dark-green":"#008000","dark-hot-pink":"#ff69b4","dark-indian-red":"#cd5c5c","dark-khaki":"#f0e68c","dark-lawn-green":"#7cfc00","dark-lime-green":"#32cd32","dark-lime":"#00ff00","dark-olive":"#808000","dark-orange-red":"#ff4500","dark-orange":"#ffa500","dark-orchid":"#da70d6","dark-peru":"#cd853f","dark-purple":"#800080","dark-rebecca-purple":"#663399","dark-red":"#ff0000","dark-royal-blue":"#4169e1","dark-saddle-brown":"#8b4513","dark-salmon":"#fa8072","dark-sandy-brown":"#f4a460","dark-sea-green":"#2e8b57","dark-sienna":"#a0522d","dark-silver":"#c0c0c0","dark-sky-blue":"#87ceeb","dark-slate-blue":"#6a5acd","dark-slate-grey":"#708090","dark-spring-green":"#00ff7f","dark-steel-blue":"#4682b4","dark-tan":"#d2b48c","dark-teal":"#008080","dark-tomato":"#ff6347","dark-turquoise":"#40e0d0","dark-violet":"#ee82ee","dark-wheat":"#f5deb3","dark-yellow-green":"#9acd32","dark-yellow":"#ffff00"},SELECTORS:{GRID_RENDERER:"ytd-rich-grid-renderer, ytd-grid-renderer",GRID_CONTENTS:"#contents",GRID_ROW:"ytd-rich-grid-row",VIDEO_ITEM:"ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer",SEARCH_GRID_CONTENTS:"#contents.ytd-two-column-search-results-renderer",SEARCH_VIDEO_RENDERER:"ytd-video-renderer",MASTHEAD:["ytd-masthead","#masthead","#masthead-container"],CHIPS_BAR:["ytd-feed-filter-chip-bar-renderer","yt-chip-cloud-renderer"],CHIPS_WRAPPER:["#chips-wrapper",".yt-chip-cloud-renderer-container"],SHORTS_SECTION:"ytd-rich-section-renderer[is-shorts]",SHORTS_LINK:'a[title="Shorts"]',SHORTS_SHELF:"ytd-reel-shelf-renderer",SHORTS_TAB:'ytd-guide-entry-renderer a[title="Shorts"]',SHORTS_MINI_GUIDE:'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',SHORTS_CONTAINER:"ytd-shorts",SHORTS_CONTAINER_ALT:"#shorts-container",THEATER_BUTTON:".ytp-size-button",WATCH_FLEXY:"ytd-watch-flexy, #page-manager > ytd-watch",PLAYER:".html5-video-player, #movie_player",PLAYER_CONTAINER:"#player-container-outer",PLAYER_OUTER:["#ytd-player",'ytd-player[id="ytd-player"]'],VIDEO:["video.html5-main-video","video"],VIDEO_CONTROLS:[".ytp-right-controls",".html5-video-controls .ytp-right-controls"],SUBTITLES_BTN:[".ytp-subtitles-button",".ytp-captions-button"],CAPTIONS_WINDOW:[".ytp-caption-window-bottom",".ytp-caption-window-top"],COMMENTS_SECTION:["ytd-comments","#comments"],MERCH_SHELF:["ytd-merch-shelf-renderer","#ticket-shelf"],RELATED_ITEMS:["#related","ytd-watch-next-secondary-results-renderer"],SIDEBAR:["#secondary","#secondary-inner","ytd-watch-next-secondary-results-renderer"],END_SCREENS:[".ytp-ce-element",".html5-endscreen"],GUIDE_BUTTON:"#guide-button",GUIDE_ICON:"#guide-icon",APP:"ytd-app",MAIN_GUIDE:"ytd-guide-renderer",MINI_GUIDE:"ytd-mini-guide-renderer",SEARCH_CONTAINER:"ytd-search",SECTION_RENDERER:"ytd-item-section-renderer",SEARCH_CONTENTS:"#contents",VIDEO_RENDERER:"ytd-video-renderer",PLAYLIST_RENDERER:"ytd-playlist-renderer",RADIO_RENDERER:"ytd-radio-renderer",CHANNEL_RENDERER:"ytd-channel-renderer",SHELF_RENDERER:"ytd-shelf-renderer",RICH_SHELF_RENDERER:"ytd-rich-shelf-renderer",REEL_SHELF_RENDERER:"ytd-reel-shelf-renderer",RICH_ITEM_RENDERER:"ytd-rich-item-renderer",BACKGROUND_PROMO:"ytd-background-promo-renderer",HORIZONTAL_CAROUSEL:"ytd-horizontal-card-list-renderer",FILTER_HEADER:"ytd-search-sub-menu-renderer",WATCHED_OVERLAY:"ytd-thumbnail-overlay-resume-playback-renderer #progress",WATCHED_CONTAINER:"ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer",AD_PLAYER:".html5-video-player",AD_CONTAINER:[".ad-showing",".ad-interrupting"],AD_SKIP_BUTTON:[".ytp-ad-skip-button",".ytp-ad-skip-button-modern",".ytp-skip-ad-button",".videoAdUiSkipButton",'button[id^="skip-button"]',".ytp-ad-overlay-close-button"],AD_OVERLAY:".ytp-ad-module",AD_PLAYER_OVERLAY:".ytp-ad-player-overlay",METADATA_SELECTORS:{TITLE:["h1.ytd-watch-metadata","#title h1","ytd-shorts-player-overlay-renderer #title"],CHANNEL:["ytd-video-owner-renderer #channel-name a","#channel-name a","ytd-reel-player-header-renderer #channel-name a"]},THUMBNAIL_CONTAINER:"ytd-thumbnail",PLAYLIST:{HEADER:"ytd-playlist-header-renderer",VIDEO_LIST_RENDERER:"ytd-playlist-video-list-renderer",VIDEO_RENDERER:"ytd-playlist-video-renderer",BROWSE:'ytd-browse[page-subtype="playlist"]',TWO_COLUMN:'ytd-browse[page-subtype="playlist"] ytd-two-column-browse-results-renderer',SECTION_LIST:'ytd-browse[page-subtype="playlist"] #primary > ytd-section-list-renderer',ITEM_SECTION:'ytd-browse[page-subtype="playlist"] ytd-item-section-renderer'}},CSS_CLASSES:{THEME_ENABLED:"yt-spiral-tube-theme",HIDE_SHORTS:"ypp-hide-shorts",HIDE_MIXES:"ypp-hide-mixes",HIDE_EXPLORE_TOPICS:"ypp-hide-explore-topics",HIDE_WATCHED:"ypp-hide-watched",HIDE_MERCH:"ypp-hide-merch",HIDE_COMMENTS:"ypp-hide-comments",HIDE_ENDSCREENS:"ypp-hide-endscreens",HIDE_LIVE_CHAT:"ypp-hide-live-chat",HIDE_FUNDRAISER:"ypp-hide-fundraiser",DISPLAY_FULL_TITLE:"ypp-display-full-title",SQUARE_CORNERS:"ypp-square-corners",DOPAMINE_DETOX:"ypp-dopamine-detox",ZEN_MODE:"ypp-zen-mode",HOOK_FREE:"ypp-hook-free-home",SIDEBAR_COLLAPSED:"ypp-sidebar-collapsed",SIDEBAR_EXPANDED:"ypp-sidebar-expanded",CUSTOM_SCROLLBAR:"ypp-custom-scrollbar",GRAYSCALE_THUMBNAILS:"ypp-grayscale-thumbs",MANUALLY_WATCHED:"ypp-manually-watched",WATCHED_ICON:"ypp-watched-icon",WATCHED_MARKER:"data-ypp-watched",SEARCH_GRID_MODE:"ypp-search-grid-mode",SEARCH_LIST_MODE:"ypp-search-list-mode",GRID_CONTAINER:"ypp-search-grid-container",GRID_ITEM:"ypp-grid-item",FULL_WIDTH:"ypp-full-width-item",HIDDEN_SHORT:"ypp-hidden-short",VIEW_TOGGLE:"ypp-view-mode-toggle",TOGGLE_BTN:"ypp-toggle-btn",FOCUS_MODE:"ypp-focus-mode",CINEMA_MODE:"ypp-cinema-mode",MINIMAL_MODE:"ypp-minimal-mode",DOPAMINE_DETOX_STYLE:"ypp-detox-style",CINEMA_STYLE:"ypp-cinema-style",MINIMAL_STYLE:"ypp-minimal-style",ZEN_TOAST:"ypp-zen-toast",TOAST:"ypp-toast",WATCH_PAGE:"ypp-watch-page",SHORTS_PAGE:"ypp-shorts-page",HOME_PAGE:"ypp-home-page",PLAYER_TOOLS:"ypp-player-tools",FILTER_PANEL:"ypp-filter-panel"},DEFAULT_SETTINGS:ke,GRID:{DESKTOP_COLUMNS:4,ITEM_GAP:16,ROW_GAP:32,MIN_ITEM_WIDTH:280,RESPONSIVE_BREAKPOINTS:{LARGE:1600,MEDIUM:1200,SMALL:900,MOBILE:640}},TIMINGS:{ELEMENT_WAIT_DEFAULT:1e4,TOAST_DISPLAY:3e3,TOAST_FADE:300,AD_SKIPPER_INTERVAL:500,PLAYER_TOOLS_INTERVAL:1e3,SHORTS_CHECK_INTERVAL:500,STUDY_ENFORCE_INTERVAL:5e3,DEBOUNCE_DEFAULT:50,DEBOUNCE_SEARCH:500,DEBOUNCE_RESIZE:150,DEBOUNCE_NAVIGATION:200,TRANSITION_FAST:150,TRANSITION_MEDIUM:300,TRANSITION_SLOW:500,AD_PLAYBACK_SPEED:16},STUDY:{DEFAULT_SPEED:1.25,MIN_SPEED:.1,MAX_SPEED:5,SPEED_STEP:.1},PLAYER:{SPEED_MIN:.1,SPEED_MAX:5,SPEED_STEP:.1,FILTER_MIN:50,FILTER_MAX:200,FILTER_DEFAULT:100},AMBIENT:{FPS:10,SAMPLE_STEP:10,GLOW_SIZE:150,GLOW_BLUR:30,OPACITY:.5,CANVAS_SIZE:50},THUMBNAIL:{ASPECT_RATIO:"16/9",BORDER_RADIUS:"12px"},TYPOGRAPHY:{TITLE_FONT_SIZE:"1.6rem",TITLE_LINE_HEIGHT:"2.2rem",TITLE_MAX_LINES:2,METADATA_FONT_SIZE:"1.3rem"},THEMES:{SYSTEM:{key:"system",label:"System (Auto)",class:""},DEFAULT:{key:"default",label:"Default (Premium)",class:""},OCEAN:{key:"ocean",label:"Ocean Blue",class:"ypp-theme-ocean"},SUNSET:{key:"sunset",label:"Sunset Glow",class:"ypp-theme-sunset"},DRACULA:{key:"dracula",label:"Dracula",class:"ypp-theme-dracula"},FOREST:{key:"forest",label:"Forest",class:"ypp-theme-forest"},MIDNIGHT:{key:"midnight",label:"Midnight (OLED)",class:"ypp-theme-midnight"},CHERRY:{key:"cherry",label:"Cherry Blossom",class:"ypp-theme-cherry"},COFFEE:{key:"coffee",label:"Coffee",class:"ypp-theme-coffee"},CYBERPUNK:{key:"cyberpunk",label:"Cyberpunk",class:"ypp-theme-cyberpunk"},NORD:{key:"nord",label:"Nord Frost",class:"ypp-theme-nord"}},FEATURE_MAP:{theme:"Theme",subsOrganizer:"SubscriptionsOrganizer",accountMenu:"AccountMenu",headerNav:"HeaderNav",redirectShorts:"RedirectShorts",playerTools:"PlayerTools",autoLike:"AutoLike",gridAnimator:"GridAnimator",multiSelect:"MultiSelect",hideMetrics:"HideMetrics",intentionalDelay:"IntentionalDelay",playlistDuration:"PlaylistDuration",watchHistory:"WatchHistoryTracker",watchTimeAlert:"WatchTimeAlert",watchTimeLimit:"WatchTimeLimit",historyTracker:"HistoryTracker",historyRedesign:"HistoryRedesign",playlistRedesign:"PlaylistRedesign",ambientMode:"AmbientMode",audioMode:"AudioMode",videoControls:"VideoControls",videoSpeedController:"VideoSpeedController",returnYouTubeDislike:"ReturnDislike",sponsorBlock:"SponsorBlock",floatingPlayer:"FloatingPlayer",videoFilters:"VideoFilters",reversePlaylist:"ReversePlaylist",continueWatching:"ContinueWatching",contextMenu:"ContextMenu",hideWatched:"HideWatched",hideMixes:"HideMixes",keyboardShortcuts:"KeyboardShortcuts",wheelControls:"WheelControls",audioCompressor:"AudioCompressor",videoResumer:"VideoResumer",autoPause:"AutoPause",commentFilter:"CommentFilter",globalPlayerBar:"GlobalPlayerBar",volumeBoost:"VolumeBooster",autoQuality:"AutoQuality",timeDisplay:"TimeDisplay",watchRedesign:"WatchRedesign",bookmarksManager:"BookmarksManager",classicProgressBar:"ClassicProgressBar",snapshotButton:"SnapshotButton",loopButton:"LoopButton",splitScrolling:"SplitScrolling",customCSS:"CustomCSS",feedFilter:"FeedFilter",layout:"Layout",autoScaleLayout:"AutoScaleGrid",displayFullTitle:"FullVideoTitles",subscriptionFolders:"SubscriptionFolders",filterBar:"FilterBar",channelHealth:"ChannelHealth",groupSidebar:"GroupSidebar",deckMode:"DeckMode",premiumLogo:"PremiumLogo",smartDownload:"SmartDownload",resumeBadges:"ResumeBadges",speedBooster:"SpeedBooster",liquidGlassTheme:"LiquidGlassTheme"}};const ye=c=>(c===null||typeof c!="object"||Object.isFrozen(c)||(Object.freeze(c),Object.getOwnPropertyNames(c).forEach(e=>{const t=c[e];typeof t=="object"&&t!==null&&!Object.isFrozen(t)&&ye(t)})),c);window.YPP.CONSTANTS&&window.YPP.CONSTANTS.DEFAULT_SETTINGS&&ye(window.YPP.CONSTANTS.DEFAULT_SETTINGS),window.YPP=window.YPP||{},window.YPP.SettingsSchema={schema:Object.freeze({schemaVersion:{type:"number",default:1},premiumTheme:{type:"boolean",default:!0},activeTheme:{type:"string",default:"default",values:["default","ocean","sunset","dracula","forest","midnight","cherry","system","coffee","cyberpunk","nord","discord","hacker","outrun","bloodmoon","deepspace","nebula","abyss","ember","hologram"]},trueBlack:{type:"boolean",default:!1},hideScrollbar:{type:"boolean",default:!1},autoScaleLayout:{type:"boolean",default:!0},useSquareCorners:{type:"boolean",default:!1},grid4x4:{type:"boolean",default:!1},homeColumns:{type:"number",default:4,min:0,max:10},searchColumns:{type:"number",default:4,min:1,max:8},channelColumns:{type:"number",default:4,min:0,max:10},subscriptionsColumns:{type:"number",default:4,min:1,max:8},displayFullTitle:{type:"boolean",default:!1},hideShorts:{type:"boolean",default:!1},hideSearchShorts:{type:"boolean",default:!0},hideMixes:{type:"boolean",default:!1},hideExploreTopics:{type:"boolean",default:!1},hidePlayerTopics:{type:"boolean",default:!1},hideWatched:{type:"boolean",default:!1},hideWatchedMode:{type:"string",default:"dim",values:["dim","hide"]},hideWatchedThreshold:{type:"number",default:80,min:0,max:100},hideMerch:{type:"boolean",default:!1},hideComments:{type:"boolean",default:!1},hideLiveChat:{type:"boolean",default:!1},hideFundraiser:{type:"boolean",default:!1},hideEndScreens:{type:"boolean",default:!1},hideSearchShelves:{type:"boolean",default:!0},hideChannelCards:{type:"boolean",default:!1},autoVideoFilter:{type:"boolean",default:!0},hideAnnotations:{type:"boolean",default:!1},hideRelated:{type:"boolean",default:!1},hideFeed:{type:"boolean",default:!1},hideTrending:{type:"boolean",default:!1},aggressiveShortsBlock:{type:"boolean",default:!1},hideShortVideos:{type:"boolean",default:!1},minVideoDuration:{type:"number",default:5,min:0,max:60},customThemes:{type:"object",default:{}},enableCustomCSS:{type:"boolean",default:!1},customCSSCode:{type:"string",default:""},fontScale:{type:"number",default:100,min:80,max:130},accentColor:{type:"string",default:"#ff4e45"},enableAnimations:{type:"boolean",default:!0},enableThemeEffects:{type:"boolean",default:!0},reducedMotion:{type:"boolean",default:!1},cardStyle:{type:"string",default:"glass",values:["glass","flat","elevated","folder","bento","neon","compact","polaroid","neumorphic","cyberpunk","holographic","minimalist","retro","brutalism","skeuomorphic","frosted","summer","winter","spring","autumn"]},customScrollbar:{type:"boolean",default:!1},grayscaleThumbnails:{type:"boolean",default:!1},autoCinema:{type:"boolean",default:!1},enablePiP:{type:"boolean",default:!0},enableTranscript:{type:"boolean",default:!0},enableSnapshot:{type:"boolean",default:!0},enableLoop:{type:"boolean",default:!0},enableRemainingTime:{type:"boolean",default:!0},enableVolumeBoost:{type:"boolean",default:!0},volumeLevel:{type:"number",default:1,min:1,max:6},volumeBoostBass:{type:"number",default:0,min:-12,max:12},volumeBoostTreble:{type:"number",default:0,min:-12,max:12},volumeBalance:{type:"number",default:0,min:-1,max:1},volumeEqBands:{type:"string",default:"[0,0,0,0,0,0,0,0,0,0]"},volumeCompressor:{type:"boolean",default:!0},volumeMono:{type:"boolean",default:!1},searchGrid:{type:"boolean",default:!0},cleanSearch:{type:"boolean",default:!0},autoSkipAds:{type:"boolean",default:!0},autoSkipPromos:{type:"boolean",default:!1},autoSkipSponsors:{type:"boolean",default:!1},sponsorBlock:{type:"boolean",default:!0},autoPlayNext:{type:"boolean",default:!1},navHistory:{type:"boolean",default:!0},shortsAutoScroll:{type:"boolean",default:!1},shortsVolumeNormalizer:{type:"boolean",default:!0},hideShortsInteraction:{type:"boolean",default:!1},enableCustomSpeed:{type:"boolean",default:!0},enableCinemaFilters:{type:"boolean",default:!0},enableGlobalPlayerBar:{type:"boolean",default:!0},enableVideoSpeedController:{type:"boolean",default:!0},vscSpeedStep:{type:"number",default:.25,min:.05,max:1},vscPreferredSpeed:{type:"number",default:2,min:.1,max:16},vscRememberSpeed:{type:"boolean",default:!0},vscAudioSupport:{type:"boolean",default:!1},vscHideByDefault:{type:"boolean",default:!1},vscForceSpeed:{type:"boolean",default:!1},vscControllerOpacity:{type:"number",default:.3,min:.1,max:1},cinemaFilterIndex:{type:"number",default:0,min:0,max:42},cinemaFilterBrightness:{type:"number",default:100,min:0,max:200},cinemaFilterContrast:{type:"number",default:100,min:0,max:200},cinemaFilterSaturate:{type:"number",default:100,min:0,max:200},cinemaFilterHue:{type:"number",default:0,min:0,max:360},cinemaFilterSepia:{type:"number",default:0,min:0,max:100},cinemaFilterGrayscale:{type:"number",default:0,min:0,max:100},cinemaFilterInvert:{type:"number",default:0,min:0,max:100},cinemaFilterBlur:{type:"number",default:0,min:0,max:10},cinemaFilterOpacity:{type:"number",default:100,min:10,max:100},adSkipper:{type:"boolean",default:!0},blueLight:{type:"number",default:0,min:0,max:100},dim:{type:"number",default:0,min:0,max:100},zenMode:{type:"boolean",default:!1},dopamineDetox:{type:"boolean",default:!1},enableFocusMode:{type:"boolean",default:!1},cinemaMode:{type:"boolean",default:!1},minimalMode:{type:"boolean",default:!1},studyMode:{type:"boolean",default:!1},autoPiP:{type:"boolean",default:!1},floatingPlayer:{type:"boolean",default:!1},ambientMode:{type:"boolean",default:!1},ambientIntensity:{type:"number",default:.6,min:.1,max:1},ambientBlur:{type:"number",default:120,min:20,max:200},audioModeEnabled:{type:"boolean",default:!1},videoControlsEnabled:{type:"boolean",default:!0},subscriptionFolders:{type:"boolean",default:!0},returnYouTubeDislike:{type:"boolean",default:!1},wheelControls:{type:"boolean",default:!0},enableBookmarks:{type:"boolean",default:!0},audioCompressor:{type:"boolean",default:!1},videoResumer:{type:"boolean",default:!0},autoPause:{type:"boolean",default:!1},commentFilter:{type:"boolean",default:!0},commentFilterAction:{type:"string",default:"dim",values:["dim","hide"]},commentFilterCustomKeywords:{type:"string",default:""},contextMenu:{type:"boolean",default:!0},enableAccountMenu:{type:"boolean",default:!0},playlistRedesign:{type:"boolean",default:!0},glassPlayerUI:{type:"boolean",default:!0},sidebarComments:{type:"boolean",default:!1},miniPlayer:{type:"boolean",default:!1},redirectShorts:{type:"boolean",default:!1},watchTimeAlert:{type:"boolean",default:!1},watchTimeAlertHours:{type:"number",default:2,min:1,max:8},enableStatsForNerds:{type:"boolean",default:!1},enableSubsManager:{type:"boolean",default:!1},keyboardShortcuts:{type:"boolean",default:!0},shortcut_zenMode:{type:"string",default:"Shift+Z"},shortcut_focusMode:{type:"string",default:"Shift+F"},shortcut_cinemaMode:{type:"string",default:"Shift+C"},shortcut_snapshot:{type:"string",default:"Shift+S"},shortcut_loop:{type:"string",default:"Shift+L"},shortcut_pip:{type:"string",default:"Shift+P"},shortcut_speedDown:{type:"string",default:"Shift+,"},shortcut_speedUp:{type:"string",default:"Shift+."},shortcut_speedReset:{type:"string",default:"Shift+R"},shortcut_ambientMode:{type:"string",default:"Shift+M"},vscShortcutSlower:{type:"string",default:"s"},vscShortcutFaster:{type:"string",default:"d"},vscShortcutRewind:{type:"string",default:"z"},vscShortcutAdvance:{type:"string",default:"x"},vscShortcutReset:{type:"string",default:"r"},vscShortcutPreferred:{type:"string",default:"g"},vscShortcutToggleDisplay:{type:"string",default:"v"},feedFilter:{type:"boolean",default:!0},hideLiveStreams:{type:"boolean",default:!1},hideUpcoming:{type:"boolean",default:!1},hidePlaylists:{type:"boolean",default:!1},hidePodcasts:{type:"boolean",default:!1},hidePosts:{type:"boolean",default:!1},feedFilterKeywords:{type:"string",default:""},hideThumbnails:{type:"boolean",default:!1},hideCards:{type:"boolean",default:!1},hideMetrics:{type:"boolean",default:!1},multiSelect:{type:"boolean",default:!0},msOptQueue:{type:"boolean",default:!0},msOptPlaylist:{type:"boolean",default:!0},msOptWatchLater:{type:"boolean",default:!0},msOptNotInterested:{type:"boolean",default:!0},msOptMarkWatched:{type:"boolean",default:!0},autoLike:{type:"boolean",default:!1},autoQuality:{type:"boolean",default:!1},intentionalDelay:{type:"boolean",default:!1},markWatched:{type:"boolean",default:!0},hideVoiceSearch:{type:"boolean",default:!1},cleanMixUrls:{type:"boolean",default:!1},stopShortsLooping:{type:"boolean",default:!1},ff_live_visible:{type:"boolean",default:!0},ff_live_default:{type:"boolean",default:!1},ff_streamed_visible:{type:"boolean",default:!0},ff_streamed_default:{type:"boolean",default:!1},ff_video_visible:{type:"boolean",default:!0},ff_video_default:{type:"boolean",default:!1},ff_shorts_visible:{type:"boolean",default:!0},ff_shorts_default:{type:"boolean",default:!1},ff_scheduled_visible:{type:"boolean",default:!0},ff_scheduled_default:{type:"boolean",default:!1},ff_notifon_visible:{type:"boolean",default:!1},ff_notifon_default:{type:"boolean",default:!1},ff_notifoff_visible:{type:"boolean",default:!1},ff_notifoff_default:{type:"boolean",default:!1},ff_posts_visible:{type:"boolean",default:!1},ff_posts_default:{type:"boolean",default:!1},ff_playlist_visible:{type:"boolean",default:!1},ff_playlist_default:{type:"boolean",default:!1},ff_unwatched_visible:{type:"boolean",default:!0},ff_unwatched_default:{type:"boolean",default:!1},ff_watched_visible:{type:"boolean",default:!0},ff_watched_default:{type:"boolean",default:!1},ff_search_visible:{type:"boolean",default:!0},ff_search_default:{type:"string",default:""},ff_opt_multiselect:{type:"boolean",default:!1},ff_opt_responsive:{type:"boolean",default:!0},ff_page_subscriptions:{type:"boolean",default:!0},ff_page_home:{type:"boolean",default:!0},ff_page_shorts:{type:"boolean",default:!0},ff_page_history:{type:"boolean",default:!0},ff_page_playlists:{type:"boolean",default:!0},ff_page_allplaylists:{type:"boolean",default:!0},ff_page_hashtag:{type:"boolean",default:!0},blockedChannels:{type:"string",default:""},blockedKeywords:{type:"string",default:""},reversePlaylist:{type:"boolean",default:!1},playlistDuration:{type:"boolean",default:!0},continueWatching:{type:"boolean",default:!0},historyRedesign:{type:"boolean",default:!0},globalPlayerBarPosition:{type:"string",default:"right",values:["right","left","top"]},gpb_showPlay:{type:"boolean",default:!0},gpb_showTime:{type:"boolean",default:!0},gpb_showVolume:{type:"boolean",default:!0},gpb_showVolumeBoost:{type:"boolean",default:!0},gpb_showFilters:{type:"boolean",default:!0},gpb_showLoop:{type:"boolean",default:!0},gpb_showPip:{type:"boolean",default:!0},gpb_showFullscreen:{type:"boolean",default:!0},pb_snapshot:{type:"string",default:"front",values:["front","back","hidden"]},pb_bookmark:{type:"string",default:"front",values:["front","back","hidden"]},pb_loop:{type:"string",default:"front",values:["front","back","hidden"]},pb_speed:{type:"string",default:"front",values:["front","back","hidden"]},pb_pip:{type:"string",default:"front",values:["front","back","hidden"]},pb_volume:{type:"string",default:"front",values:["front","back","hidden"]},pb_cinema:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_play:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_next:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_mute:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_cast:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_autoplay:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_cc:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_miniplayer:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_theater:{type:"string",default:"front",values:["front","back","hidden"]},pb_native_fullscreen:{type:"string",default:"front",values:["front","back","hidden"]},sidebarLayout:{type:"string",default:"compact",values:["compact","spacious","expanded"]},splitScrolling:{type:"boolean",default:!1},navTrending:{type:"boolean",default:!0},navShorts:{type:"boolean",default:!0},navSubscriptions:{type:"boolean",default:!0},navWatchLater:{type:"boolean",default:!0},navPlaylists:{type:"boolean",default:!0},enableFilterBar:{type:"boolean",default:!1},enableChannelHealth:{type:"boolean",default:!1},enableDeckMode:{type:"boolean",default:!1}}),validateAndMerge(c){var r,i,n,s,o,a;if(!c||typeof c!="object")return(r=window.YPP.Utils)==null||r.log("Settings: no stored settings, using defaults.","SCHEMA","debug"),this._defaults();c=this.migrate(c);const e={};let t=0;for(const[l,d]of Object.entries(this.schema)){const p=c[l];if(p==null){e[l]=d.default;continue}if(typeof p!==d.type){(i=window.YPP.Utils)==null||i.log(`Settings: "${l}" expected ${d.type}, got ${typeof p}. Resetting to default.`,"SCHEMA","warn"),e[l]=d.default,t++;continue}if(d.type==="string"&&Array.isArray(d.values)&&d.values.length>0&&(typeof p!="string"||!d.values.includes(p)&&!p.startsWith("custom_"))){(n=window.YPP.Utils)==null||n.log(`Settings: "${l}" value "${p}" not in allowed list. Resetting.`,"SCHEMA","warn"),e[l]=d.default,t++;continue}if(d.type==="object"&&(p===null||Array.isArray(p))){e[l]=d.default;continue}if(d.type==="number"){const u=Math.min(Math.max(p,d.min??-1/0),d.max??1/0);u!==p&&((s=window.YPP.Utils)==null||s.log(`Settings: "${l}" value ${p} clamped to ${u}.`,"SCHEMA","debug")),e[l]=u;continue}e[l]=p}for(const l of Object.keys(c))this.schema[l]||(o=window.YPP.Utils)==null||o.log(`Settings: unknown key "${l}" ignored (stale/renamed?).`,"SCHEMA","debug");return t>0&&((a=window.YPP.Utils)==null||a.log(`Settings: ${t} key(s) reset to defaults due to type errors.`,"SCHEMA","warn")),e},migrate(c){var t;return(c.schemaVersion||0)<1&&(c.trueBlack===!0&&c.activeTheme==="default"&&(c.activeTheme="midnight",(t=window.YPP.Utils)==null||t.log("Migrated trueBlack -> activeTheme = midnight","SCHEMA","info")),c.schemaVersion=1),c},_defaults(){const c={};for(const[e,t]of Object.entries(this.schema))c[e]=t.default;return c}},window.YPP=window.YPP||{};class Ie{constructor(){this.errors=[]}logError(e){const t=e instanceof Error?e.message:String(e);this.errors.push(t),window.YPP.Utils&&typeof window.YPP.Utils.log=="function"?window.YPP.Utils.log(t,"ErrorHandler","error"):window.dispatchEvent(new CustomEvent("ypp-log",{detail:{msg:t,level:"error"}}))}getErrors(){return this.errors.slice()}clearErrors(){this.errors=[]}handleError(e,t=""){const r=t?`${t}: ${(e==null?void 0:e.message)??String(e)}`:(e==null?void 0:e.message)??String(e);this.logError(r)}}window.YPP.errorHandler=new Ie;class ur{constructor(){this._cache=new Map,this._observers=new Map}get(e,t,r=document){if(this._cache.has(e)){const n=this._cache.get(e),s=n?n.deref():null;if(s&&document.contains(s))return s;this.remove(e)}const i=r.querySelector(t);return i&&this.set(e,i),i}getAll(e,t,r=document){return r.querySelectorAll(t)}set(e,t){t&&t instanceof Element&&this._cache.set(e,typeof WeakRef<"u"?new WeakRef(t):t)}has(e){if(!this._cache.has(e))return!1;const t=this._cache.get(e),r=t instanceof WeakRef?t.deref():t;return r&&document.contains(r)?!0:(this.remove(e),!1)}remove(e){if(this._cache.delete(e),this._observers.has(e)){const t=this._observers.get(e);t&&t.disconnect(),this._observers.delete(e)}}clear(){this._observers.forEach(e=>e.disconnect()),this._observers.clear(),this._cache.clear()}getStats(){return{totalCachedItems:this._cache.size,activeObservers:this._observers.size}}watch(e,t){if(!t||!(t instanceof Element))return;const r=new MutationObserver(n=>{for(const s of n)s.removedNodes.length>0&&s.removedNodes.forEach(o=>{var a;try{(o===t||o.contains&&o.contains(t))&&(this.remove(e),r.disconnect(),this._observers.delete(e))}catch(l){(a=window.YPP)!=null&&a.errorHandler&&window.YPP.errorHandler.handleError(l,"ElementCache Watch")}})}),i=t.parentNode;i&&(r.observe(i,{childList:!0}),this._observers.set(e,r))}destroy(){this._observers.forEach(e=>e.disconnect()),this._observers.clear(),this._cache.clear()}}typeof window<"u"&&(window.ElementCache=ur),window.YPP=window.YPP||{};const de=window.YPP.CONSTANTS||{};window.YPP.Utils=Object.assign(window.YPP.Utils||{},{log:(c,e="MAIN",t="info",...r)=>{var a,l;const i=`%c[YPP:${e}]`,n={info:"color: #3ea6ff; font-weight: bold;",warn:"color: #ff9800; font-weight: bold;",error:"color: #f44336; font-weight: bold;",debug:"color: #9e9e9e; font-weight: bold;"},s=n[t]||n.info,o=console[t]||console.log;t==="debug"&&!((l=(a=window.YPP)==null?void 0:a.debug)!=null&&l.enabled)||o(i,s,c,...r)},startPerf:c=>{c&&performance.mark(`ypp-start-${c}`)},endPerf:(c,e="PERF")=>{if(!c)return;const t=`ypp-start-${c}`,r=`ypp-end-${c}`;try{performance.mark(r);const i=performance.measure(c,t,r);i.duration>10&&window.YPP.Utils.log(`${c} took ${i.duration.toFixed(2)}ms`,e,"debug"),performance.clearMarks(t),performance.clearMarks(r),performance.clearMeasures(c)}catch{}},isWatchPage:()=>window.location.pathname==="/watch",isSearchPage:()=>window.location.pathname==="/results",isHome:()=>{const c=window.location.pathname;return c==="/"||c==="/index"},isShortsPage:()=>window.location.pathname.startsWith("/shorts/"),isChannelPage:()=>{const c=window.location.pathname;return c.startsWith("/@")||c.startsWith("/channel/")||c.startsWith("/c/")||c.startsWith("/user/")},batch:(()=>{let c=[],e=[],t=!1;function r(){var s;const i=c,n=e;c=[],e=[],t=!1;try{for(let o=0;o<i.length;o++)i[o]();for(let o=0;o<n.length;o++)n[o]()}catch(o){(s=window.YPP.Utils)==null||s.log("Batch execution error: "+o.message,"UTILS","error")}}return{read(i){c.push(i),t||(t=!0,requestAnimationFrame(r))},write(i){e.push(i),t||(t=!0,requestAnimationFrame(r))}}})(),safeQuerySelector:(c,e=document)=>{var t;if(!c||typeof c!="string")return null;try{return e.querySelector(c)}catch{return(t=window.YPP.Utils)==null||t.log(`Invalid selector: ${c}`,"UTILS","warn"),null}},safeQuerySelectorAll:(c,e=document)=>{var t;if(!c||typeof c!="string")return[];try{return e.querySelectorAll(c)}catch{return(t=window.YPP.Utils)==null||t.log(`Invalid selector: ${c}`,"UTILS","warn"),[]}},waitForElement:(c,e=(r=>(r=de.TIMINGS)==null?void 0:r.ELEMENT_WAIT_DEFAULT)()||1e4,t=null)=>{var i,n,s;if(!c||typeof c!="string")return(i=window.YPP.Utils)==null||i.log("Invalid selector provided to waitForElement","UTILS","warn"),Promise.resolve(null);if((typeof e!="number"||e<=0||!isFinite(e))&&((n=window.YPP.Utils)==null||n.log(`Invalid timeout (${e}), using default 10000ms`,"UTILS","warn"),e=1e4),t!=null&&t.aborted)return Promise.resolve(null);try{const o=document.querySelector(c);if(o)return Promise.resolve(o)}catch{return(s=window.YPP.Utils)==null||s.log(`Invalid CSS selector: ${c}`,"UTILS","error"),Promise.resolve(null)}return new Promise(o=>{var v;let a=!1,l=null;const d=location.href,p="wait-"+Math.random().toString(36).substr(2,9);let u=null;const h=()=>{var b;(b=window.YPP)!=null&&b.sharedObserver&&window.YPP.sharedObserver.unregister(p),u&&(u.disconnect(),u=null),l&&(clearTimeout(l),l=null),t&&t.removeEventListener("abort",m)},m=()=>{a||(a=!0,h(),o(null))};t&&t.addEventListener("abort",m);const y=b=>{if(!a){if(location.href!==d){a=!0,h(),o(null);return}if(b&&b.length>0){a=!0,h(),o(b[0]);return}try{const f=document.querySelector(c);f&&(a=!0,h(),o(f))}catch{}}};if((v=window.YPP)!=null&&v.sharedObserver)window.YPP.sharedObserver.register(p,c,y,!0);else{let b=null;const f=()=>{b||(b=requestAnimationFrame(()=>{b=null,y()}))};u=new MutationObserver(f),u.observe(document.documentElement,{childList:!0,subtree:!0}),y()}e>0&&(l=setTimeout(()=>{a||(a=!0,h(),o(null))},e))})},waitForElements:(c,e=1e4)=>{const t=new Map;let r=c.length;return r===0?Promise.resolve(t):new Promise(i=>{var p;const n=location.href,s="waits-"+Math.random().toString(36).substr(2,9);let o=null,a=null;const l=()=>{var u;(u=window.YPP)!=null&&u.sharedObserver&&window.YPP.sharedObserver.unregister(s),o&&(o.disconnect(),o=null),a&&(cancelAnimationFrame(a),a=null)},d=()=>{if(location.href!==n){l(),i(t);return}c.forEach(u=>{if(!t.has(u))try{const h=document.querySelector(u);h&&(t.set(u,h),r--)}catch{}}),r===0&&(l(),i(t))};if((p=window.YPP)!=null&&p.sharedObserver)window.YPP.sharedObserver.register(s,c.join(","),d,!0);else{const u=()=>{a||(a=requestAnimationFrame(()=>{a=null,d()}))};o=new MutationObserver(u),o.observe(document.documentElement,{childList:!0,subtree:!0}),d()}setTimeout(()=>{l(),i(t)},e)})},pollFor:(c,e=1e4,t=250,r=null)=>new Promise(i=>{var u;if(r!=null&&r.aborted)return i(null);try{const h=c();if(h)return i(h)}catch{(u=window.YPP.Utils)==null||u.log("Initial pollFor missed (expected), proceeding to wait loop...","UTILS","debug")}const n=Date.now(),s=location.href;let o=null,a=!1;const l=()=>{o&&(clearInterval(o),o=null),r&&r.removeEventListener("abort",d)},d=()=>{a||(a=!0,l(),i(null))};r&&r.addEventListener("abort",d),o=setInterval(()=>{var m;if(a)return;if(Date.now()-n>=e)return a=!0,l(),i(null);try{if(location.href!==s)return a=!0,l(),i(null);const y=c();if(y)return a=!0,l(),i(y)}catch{(m=window.YPP.Utils)==null||m.log("Transient error in pollFor, retrying...","UTILS","debug")}},t)}),createElement:(c,e={},t=[])=>{if(!c||typeof c!="string")return console.error("[YPP:Utils] createElement: invalid tag name"),null;try{const r=document.createElement(c);return e&&typeof e=="object"&&Object.entries(e).forEach(([n,s])=>{n==="className"?r.className=s:n==="style"&&typeof s=="object"?Object.assign(r.style,s):n.startsWith("on")&&typeof s=="function"?r.addEventListener(n.substring(2).toLowerCase(),s):n==="dataset"&&typeof s=="object"?Object.entries(s).forEach(([o,a])=>{r.dataset[o]=a}):r.setAttribute(n,s)}),(Array.isArray(t)?t:[t]).forEach(n=>{n&&(typeof n=="string"?r.appendChild(document.createTextNode(n)):n instanceof Element&&r.appendChild(n))}),r}catch(r){return console.error("[YPP:Utils] createElement error:",r),null}},createSVG:(c,e,t="")=>{const r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("viewBox",c),t&&r.setAttribute("class",t);const i=document.createElementNS("http://www.w3.org/2000/svg","path");return i.setAttribute("d",e),i.setAttribute("fill","currentColor"),r.appendChild(i),r},debounce:(c,e=(t=>(t=de.TIMINGS)==null?void 0:t.DEBOUNCE_DEFAULT)()||50)=>{var i,n,s;if(typeof c!="function")return(i=window.YPP.Utils)==null||i.log("debounce requires a function as first argument","UTILS","error"),()=>{};(typeof e!="number"||e<0||!isFinite(e))&&((n=window.YPP.Utils)==null||n.log(`Invalid wait time for debounce (${e}), using default`,"UTILS","warn"),e=((s=de.TIMINGS)==null?void 0:s.DEBOUNCE_DEFAULT)||50);let r=null;return function(...o){r&&clearTimeout(r),r=setTimeout(()=>{c.apply(this,o)},e)}},throttle:(c,e=100)=>{var i,n;if(typeof c!="function")return(i=window.YPP.Utils)==null||i.log("throttle requires a function as first argument","UTILS","error"),()=>{};(typeof e!="number"||e<0||!isFinite(e))&&((n=window.YPP.Utils)==null||n.log(`Invalid limit for throttle (${e}), using default 100ms`,"UTILS","warn"),e=100);let t=null,r=0;return function(...s){const o=Date.now();!r||o-r>=e?(c.apply(this,s),r=o):(t&&clearTimeout(t),t=setTimeout(()=>{c.apply(this,s),r=Date.now()},e-(o-r)))}},createToast:(()=>{const t=[],r=[];function i(){r.forEach((s,o)=>{s.style.bottom=`${24+o*60}px`})}function n(s,o,a){var p,u;const l=a||((p=de.TIMINGS)==null?void 0:p.TOAST_DISPLAY)||3e3,d=((u=de.TIMINGS)==null?void 0:u.TOAST_FADE)||300;try{const h=document.createElement("div");h.className=`ypp-toast ypp-toast-${o}`,h.textContent=s,h.style.bottom="24px",document.body.appendChild(h),r.push(h),i(),h.offsetWidth,requestAnimationFrame(()=>h.classList.add("show")),setTimeout(()=>{h.classList.remove("show"),setTimeout(()=>{h.remove();const m=r.indexOf(h);if(m!==-1&&r.splice(m,1),i(),t.length>0){const y=t.shift();n(y.msg,y.type,y.duration)}},d)},l)}catch(h){console.error("[YPP:Utils] Error creating toast:",h)}}return(s,o="info",a)=>{!s||typeof s!="string"||(r.length<2?n(s,o,a):t.length<4&&t.push({msg:s,type:o,duration:a}))}})(),safeJsonParse:(c,e=null)=>{var t;if(!c||typeof c!="string")return e;try{return JSON.parse(c)}catch(r){return(t=window.YPP.Utils)==null||t.log("JSON parse error: "+r.message,"UTILS","warn"),e}},safeJsonStringify:(c,e="{}")=>{var t;try{return JSON.stringify(c)}catch(r){return(t=window.YPP.Utils)==null||t.log("JSON stringify error: "+r.message,"UTILS","warn"),e}},loadSettings:async()=>{var c,e,t;try{if(!(chrome!=null&&chrome.storage))return(c=window.YPP.Utils)==null||c.log("Chrome storage not available","UTILS","warn"),de.DEFAULT_SETTINGS||{};const r=l=>new Promise(d=>{try{l.get("settings",p=>d(chrome.runtime.lastError?{}:p||{}))}catch{d({})}}),[i,n]=await Promise.all([r(chrome.storage.sync),r(chrome.storage.local)]),s=i==null?void 0:i.settings,o=n==null?void 0:n.settings;let a={};if(s&&o){const l=s.lastUpdated||0,d=o.lastUpdated||0;a=l>=d?s:o}else a=s||o||{};return(e=window.YPP)!=null&&e.SettingsSchema?window.YPP.SettingsSchema.validateAndMerge(a):Object.assign({},de.DEFAULT_SETTINGS||{},a)}catch(r){return(t=window.YPP.Utils)==null||t.log("Error loading settings: "+r.message,"UTILS","error"),de.DEFAULT_SETTINGS||{}}},saveSettings:async c=>{var e,t,r,i;try{if(!(chrome!=null&&chrome.storage)){(e=window.YPP.Utils)==null||e.log("Chrome storage not available","UTILS","warn");return}const s={...await window.YPP.Utils.loadSettings(),...c,lastUpdated:Date.now()};try{await chrome.storage.sync.set({settings:s})}catch(o){(t=window.YPP.Utils)==null||t.log("Sync storage quota exceeded, falling back to local: "+o.message,"UTILS","warn")}await chrome.storage.local.set({settings:s}),(r=window.YPP.Utils)==null||r.log("Settings saved","UTILS","debug")}catch(n){(i=window.YPP.Utils)==null||i.log("Error saving settings: "+n.message,"UTILS","error")}},getSetting:async(c,e=null)=>{var t,r;if(!c||typeof c!="string")return e;try{if(!((t=chrome==null?void 0:chrome.storage)!=null&&t.local))return e;const i=await chrome.storage.local.get([c]);return i[c]!==void 0?i[c]:e}catch(i){return(r=window.YPP.Utils)==null||r.log(`Error reading storage key "${c}": ${i.message}`,"UTILS","warn"),e}},addStyle:(c,e)=>{if(!c||typeof c!="string")return;let t=e;if(!t){const r=c.length,i=c.charCodeAt(0)||0,n=c.charCodeAt(Math.floor(r/2))||0,s=c.charCodeAt(r-1)||0;t=`ypp-style-${r}-${i}-${n}-${s}`}if(!document.getElementById(t))try{const r=document.createElement("style");r.id=t,r.textContent=c,(document.head||document.documentElement).appendChild(r)}catch(r){console.error("[YPP:Utils] Error adding style:",r)}},removeStyle:c=>{if(!c)return;const e=document.getElementById(c);e&&e.remove()},injectCSS:(c,e)=>{if(!c)return;const t=chrome.runtime.getURL(c);if(document.querySelector(`link[href="${t}"]`))return;const r=document.createElement("link");r.rel="stylesheet",r.href=t,e&&(r.id=e),document.head.appendChild(r)},addCssVariable:(c,e)=>{!c||!e||document.documentElement.style.setProperty(`--${c}`,e)},removeCssVariable:c=>{c&&document.documentElement.style.removeProperty(`--${c}`)},addPlayerButton:(c,e,t,r)=>{const i=document.createElement("button");if(i.className=`ytp-button ${c||""}`,i.title=e||"",typeof t=="string")try{const s=new DOMParser().parseFromString(t,"image/svg+xml");if(s.querySelector("parsererror"))console.warn("[YPP] Invalid SVG in addPlayerButton"),i.textContent="?";else{const a=s.documentElement;i.appendChild(a)}}catch(n){console.error("[YPP] Error parsing SVG:",n),i.textContent="?"}else t instanceof Element&&i.appendChild(t);return typeof r=="function"&&(i.onclick=r),i},getVideo:()=>{var c;return document.querySelector(((c=de.SELECTORS)==null?void 0:c.VIDEO)||"video")},getPlayer:()=>{var c,e;return document.querySelector(((c=de.SELECTORS)==null?void 0:c.PLAYER)||".html5-video-player")||document.querySelector(((e=de.SELECTORS)==null?void 0:e.WATCH_FLEXY)||"ytd-watch-flexy")},isValidNumber:(c,e=null,t=null)=>{let r=Number(c);return!(isNaN(r)||e!==null&&r<e||t!==null&&r>t)},isValidColor:c=>!c||typeof c!="string"?!1:CSS.supports("color",c),sanitizeHtml:c=>{if(!c||typeof c!="string")return"";const e=document.createElement("div");return e.textContent=c,e.innerHTML},clamp:(c,e,t)=>{var r;return typeof c!="number"||typeof e!="number"||typeof t!="number"?((r=window.YPP.Utils)==null||r.log("Invalid inputs to clamp function","UTILS","warn"),typeof e=="number"&&!isNaN(e)&&isFinite(e)?e:0):((isNaN(e)||!isFinite(e))&&(e=0),(isNaN(t)||!isFinite(t))&&(t=100),isNaN(c)||!isFinite(c)?e:(e>t&&([e,t]=[t,e]),Math.min(Math.max(c,e),t)))}});const hr=window.YPP.Utils;window.YPP.debug={enabled:localStorage.getItem("ypp-debug")==="true",toggle(){this.enabled=!this.enabled,localStorage.setItem("ypp-debug",String(this.enabled));const c=this.enabled?"ON 🟢":"OFF 🔴";return console.log(`%c[YPP:DEBUG] Debug mode ${c} — reload to see full logs`,"color:#3ea6ff;font-weight:bold;"),this.enabled},status(){var e;const c=(e=window.YPP)==null?void 0:e.featureManager;if(!c){console.warn("[YPP:DEBUG] FeatureManager not initialized yet.");return}console.group("%c[YPP:DEBUG] Feature Status","color:#3ea6ff;font-weight:bold;");for(const[t,r]of Object.entries(c.features)){const i=c.errorCounts[t]??0,n=r.isActive??"?";console.log(`%c${t}%c  active=${n}  errors=${i}`,"font-weight:bold","color:#aaa")}console.groupEnd()}},window.YPP.safeExecute=async(c,e="UNKNOWN")=>{var t;try{return await c()}catch(r){return(t=window.YPP.Utils)==null||t.log(`safeExecute error in [${e}]: ${r.message}`,"UTILS","error"),console.error(`[YPP:${e}]`,r),null}},window.YPP.Utils.timeout=c=>new Promise(e=>setTimeout(e,c)),window.YPP.Utils.retry=async(c,e=3,t=1e3)=>{try{return await c()}catch(r){if(e<=0)throw r;return await hr.timeout(t),window.YPP.Utils.retry(c,e-1,t*2)}},window.YPP.Utils.parallel=async(c,e=5)=>{const t=[],r=new Set;for(const i of c){const n=Promise.resolve().then(()=>i());t.push(n),r.add(n),n.finally(()=>r.delete(n)),r.size>=e&&await Promise.race(r)}return Promise.all(t)},window.YPP.Utils.VideoSizeTracker={_observer:null,_videoEl:null,_playerNode:null,_isActive:!1,_rafId:null,init(){this._isActive||this.startTracking()},startTracking(){if(this._isActive=!0,this._videoEl=document.querySelector("video.video-stream.html5-main-video"),this._playerNode=document.getElementById("movie_player")||document.querySelector(".html5-video-player"),!this._videoEl||!this._playerNode){setTimeout(()=>{this._isActive&&this.startTracking()},500);return}this._updateVars(),window.ResizeObserver?(this._observer=new ResizeObserver(()=>this._scheduleUpdate()),this._observer.observe(this._videoEl),this._observer.observe(this._playerNode)):(this._observer=new MutationObserver(()=>this._scheduleUpdate()),this._observer.observe(this._videoEl,{attributes:!0,attributeFilter:["style","class"]})),window.addEventListener("resize",this._boundScheduleUpdate=this._scheduleUpdate.bind(this),{passive:!0})},_scheduleUpdate(){this._rafId||(this._rafId=requestAnimationFrame(()=>{this._updateVars(),this._rafId=null}))},_updateVars(){if(!this._videoEl||!this._playerNode)return;const c=this._videoEl.getBoundingClientRect(),e=this._playerNode.getBoundingClientRect(),t=Math.max(0,c.left-e.left),r=c.width;r<=0||(this._playerNode.style.setProperty("--ypp-video-width",`${r}px`),this._playerNode.style.setProperty("--ypp-video-left",`${t}px`))},stop(){this._isActive=!1,this._observer&&(this._observer.disconnect(),this._observer=null),this._boundScheduleUpdate&&(window.removeEventListener("resize",this._boundScheduleUpdate),this._boundScheduleUpdate=null),this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=null),this._videoEl=null,this._playerNode=null}},window.YPP.Utils.positionPopupBesideVideo=(c,e,t,r)=>{var g;(!c.style.position||c.style.position==="static")&&(c.style.position="absolute");const s=window.innerWidth,o=window.innerHeight,a=e.getBoundingClientRect(),l=Math.min(c.scrollHeight>40?c.scrollHeight:400,o-8*2),d=_=>Math.max(8,Math.min(_,o-l-8)),p=_=>Math.max(8,Math.min(_,s-r-8)),u=d(a.top+a.height/2-l/2),h=p(a.left);let m,y,v=!1;const b=((g=t==null?void 0:t.getBoundingClientRect)==null?void 0:g.call(t))||null;if(b&&b.width>20&&b.height>20){const _=s-b.right-10,P=b.left-10,w=o-b.bottom-10,C=b.top-10;_>=r+8?(m=b.right+10,y=u,v=!0):P>=r+8?(m=b.left-10-r,y=u,v=!0):w>=Math.min(l,200)?(m=h,y=b.bottom+10,v=!0):C>=Math.min(l,200)&&(m=h,y=b.top-10-l,v=!0),v||(m=a.right+10,y=u)}else m=a.right+10,y=u;m=p(m),y=d(y),c.style.left=m+"px",c.style.top=y+"px"},window.YPP.Utils.getPopupPortal=()=>{let c=document.getElementById("ypp-popup-portal");if(c)return c;if(c=document.createElement("div"),c.id="ypp-popup-portal",c.style.cssText="position:fixed;inset:0;width:100%;height:100%;max-width:100%;max-height:100%;border:0;outline:0;padding:0;margin:0;background:transparent;overflow:visible;pointer-events:none;z-index:2147483647;","popover"in c&&(c.popover="manual"),document.documentElement.appendChild(c),"popover"in c)try{c.showPopover()}catch{}return c},window.YPP.Utils.positionPopupBesideVideo=(c,e,t,r)=>{var g;(!c.style.position||c.style.position==="static")&&(c.style.position="absolute");const s=window.innerWidth,o=window.innerHeight,a=e.getBoundingClientRect(),l=Math.min(c.scrollHeight>40?c.scrollHeight:400,o-8*2),d=_=>Math.max(8,Math.min(_,o-l-8)),p=_=>Math.max(8,Math.min(_,s-r-8)),u=d(a.top+a.height/2-l/2),h=p(a.left);let m,y,v=!1;const b=((g=t==null?void 0:t.getBoundingClientRect)==null?void 0:g.call(t))||null;if(b&&b.width>20&&b.height>20){const _=s-b.right-10,P=b.left-10,w=o-b.bottom-10,C=b.top-10;_>=r+8?(m=b.right+10,y=u,v=!0):P>=r+8?(m=b.left-10-r,y=u,v=!0):w>=Math.min(l,200)?(m=h,y=b.bottom+10,v=!0):C>=Math.min(l,200)&&(m=h,y=b.top-10-l,v=!0),v||(m=a.right+10,y=u)}else m=a.right+10,y=u;m=p(m),y=d(y),c.style.left=m+"px",c.style.top=y+"px"},window.YPP=window.YPP||{},window.YPP.core=window.YPP.core||{},window.YPP.core.EventBus=(xe=class{constructor(){this.listeners={}}on(e,t){var r,i;return this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t),e===xe.EVENTS.DOM_MUTATED&&((i=(r=window.YPP)==null?void 0:r.sharedObserver)==null||i.setHasMutatedListeners(!0)),()=>{this.off(e,t)}}off(e,t){var r,i;if(this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter(n=>n!==t),e===xe.EVENTS.DOM_MUTATED)){const n=(this.listeners[e]||[]).length;(i=(r=window.YPP)==null?void 0:r.sharedObserver)==null||i.setHasMutatedListeners(n>0)}}once(e,t){const r=this.on(e,i=>{r(),t(i)})}emit(e,t){var i;const r=[...this.listeners[e]||[]];for(const n of r)try{n(t)}catch(s){(i=window.YPP)!=null&&i.errorHandler?window.YPP.errorHandler.handleError(s,`[YPP:EventBus] Error in handler for event '${e}'`):console.error(`[YPP:EventBus] Error in handler for event '${e}':`,s)}}clear(e){var t,r,i,n;e?(delete this.listeners[e],e===xe.EVENTS.DOM_MUTATED&&((r=(t=window.YPP)==null?void 0:t.sharedObserver)==null||r.setHasMutatedListeners(!1))):(this.listeners={},(n=(i=window.YPP)==null?void 0:i.sharedObserver)==null||n.setHasMutatedListeners(!1))}},G(xe,"EVENTS",{DOM_MUTATED:"dom:mutated"}),xe),window.YPP.events=new window.YPP.core.EventBus,window.YPP=window.YPP||{},window.YPP.core=window.YPP.core||{};const ee=c=>{var e,t;return((t=(e=window.YPP)==null?void 0:e.CONSTANTS)==null?void 0:t.SELECTORS[c])||""},re=(c,e=document)=>{try{if(Array.isArray(c)){for(const t of c){const r=e.querySelector(t);if(r)return r}return null}return e.querySelector(c)}catch{return null}},lt=(c,e=document)=>{try{if(Array.isArray(c)){for(const t of c){const r=Array.from(e.querySelectorAll(t));if(r.length>0)return r}return[]}return Array.from(e.querySelectorAll(c))}catch{return[]}};window.YPP.core.DomAPI={getGrid(){return re(ee("GRID_RENDERER")||"ytd-rich-grid-renderer")},getGridContents(){return re(ee("GRID_CONTENTS")||"#contents")},getVideoItems(c=document){return lt(ee("VIDEO_ITEM")||"ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer",c)},getPlayer(){return re(ee("PLAYER")||".html5-video-player")},getPlayerContainer(){return re(ee("PLAYER_CONTAINER")||"#player-container-outer")},getWatchFlexy(){return re(ee("WATCH_FLEXY")||"ytd-watch-flexy, #page-manager > ytd-watch")},getVideoElement(){return re("video")},getVideoControls(){return re(ee("VIDEO_CONTROLS")||".ytp-right-controls")},getMasthead(){return re(ee("MASTHEAD")||"ytd-masthead")},getChipsBar(){return re(ee("CHIPS_BAR")||"ytd-feed-filter-chip-bar-renderer")},getMainGuide(){return re(ee("MAIN_GUIDE")||"ytd-guide-renderer")},getMiniGuide(){return re(ee("MINI_GUIDE")||"ytd-mini-guide-renderer")},getGuideButton(){return re(ee("GUIDE_BUTTON")||"#guide-button")},getRelatedItems(){return re(ee("RELATED_ITEMS")||["#related","ytd-watch-next-secondary-results-renderer"])},getSecondary(){return re(ee("SIDEBAR")||["#secondary","ytd-watch-next-secondary-results-renderer"])},getComments(){return re(ee("COMMENTS_SECTION")||"ytd-comments")},getMerch(){return re(ee("MERCH_SHELF")||"ytd-merch-shelf-renderer")},getShortsSections(){return lt(ee("SHORTS_SECTION")||"ytd-rich-section-renderer[is-shorts]")}},window.YPP.DomAPI=window.YPP.core.DomAPI,window.YPP=window.YPP||{},window.YPP.core=window.YPP.core||{},window.YPP.core.DOMObserver=class{constructor(){this.registry=new Map,this.observer=new MutationObserver(this._onMutations.bind(this)),this.isRunning=!1,this.events=window.YPP.events,this._pendingNodes=[],this._maxPendingNodes=100,this._rafPending=!1,this._hasMutatedListeners=!1,this._cachedSelector=null,this._lazyObserver=new IntersectionObserver(this._onIntersect.bind(this),{rootMargin:"400px 0px",threshold:0}),this._lazyMap=new WeakMap}start(){this.isRunning||(this.observer.observe(document.documentElement,{childList:!0,subtree:!0}),this.isRunning=!0)}stop(){this.isRunning&&(this.observer.disconnect(),this._lazyObserver&&this._lazyObserver.disconnect(),this._pendingNodes=[],this._rafPending=!1,this.isRunning=!1)}register(e,t,r,i=!0,n=!1){if(!(!e||!t)&&(this.registry.set(e,{selector:t,callback:r,lazy:n}),this._cachedSelector=null,i)){let s=[];try{s=Array.from(document.querySelectorAll(t))}catch{console.error(`[YPP:DOMObserver] Invalid selector registered: ${t}`);return}if(s.length>0)if(n)this._observeLazy(s,e,r);else{if(r)try{r(s)}catch(o){console.error(`[YPP:DOMObserver] Error in immediate callback for '${e}':`,o)}this.events&&this.events.emit(`dom:found:${e}`,s)}}}_observeLazy(e,t,r){for(let i=0;i<e.length;i++){const n=e[i];this._lazyMap.has(n)||(this._lazyMap.set(n,[]),this._lazyObserver.observe(n));const s=this._lazyMap.get(n);s.some(o=>o.id===t)||s.push({id:t,callback:r})}}_onIntersect(e){const t=new Map;for(let r=0;r<e.length;r++){const i=e[r];if(i.isIntersecting){const n=i.target;this._lazyObserver.unobserve(n);const s=this._lazyMap.get(n);if(s){for(let o=0;o<s.length;o++){const a=s[o];this.registry.has(a.id)&&(t.has(a.id)||t.set(a.id,{callback:a.callback,nodes:[]}),t.get(a.id).nodes.push(n))}this._lazyMap.delete(n)}}}for(const[r,i]of t.entries()){if(i.callback)try{i.callback(i.nodes)}catch(n){console.error(`[YPP:DOMObserver] Lazy callback error for '${r}':`,n)}this.events&&this.events.emit(`dom:found:${r}`,i.nodes)}}unregister(e){this.registry.has(e)&&(this.registry.delete(e),this._cachedSelector=null)}_onMutations(e){if(this.events&&this._hasMutatedListeners&&this.events.emit("dom:mutated",e),this.registry.size!==0){for(let t=0;t<e.length;t++){const r=e[t].addedNodes;for(let i=0;i<r.length;i++){const n=r[i];n.nodeType===Node.ELEMENT_NODE&&(this._pendingNodes.length>=this._maxPendingNodes&&this._flush(),this._pendingNodes.push(n))}}!this._rafPending&&this._pendingNodes.length>0&&(this._rafPending=!0,requestAnimationFrame(()=>this._flush()))}}_flush(){this._rafPending=!1;const e=this._pendingNodes;if(this._pendingNodes=[],e.length===0||this.registry.size===0)return;let t=this._cachedSelector;if(!t){const n=Array.from(new Set(Array.from(this.registry.values()).map(a=>a.selector)));t=[];let s=[],o=0;for(const a of n)o+a.length+1>4e3?(t.push(s.join(",")),s=[a],o=a.length):(s.push(a),o+=a.length+1);s.length>0&&t.push(s.join(",")),this._cachedSelector=t}const r=new Set;for(let n=0;n<e.length;n++){const s=e[n];s.isConnected&&r.add(s)}const i=new Map;for(const[n,{selector:s}]of this.registry.entries()){const o=[];for(const a of r)if(a.matches&&a.matches(s)&&o.push(a),a.querySelectorAll)try{const l=a.querySelectorAll(s);for(let d=0;d<l.length;d++)o.push(l[d])}catch{}o.length>0&&i.set(n,o)}for(const[n,s]of i.entries()){const o=this.registry.get(n);if(o)if(o.lazy)this._observeLazy(s,n,o.callback);else{if(o.callback)try{o.callback(s)}catch(a){console.error(`[YPP:DOMObserver] Direct callback error for '${n}':`,a)}this.events&&this.events.emit(`dom:found:${n}`,s)}}}setHasMutatedListeners(e){this._hasMutatedListeners=e}},window.YPP.sharedObserver=new window.YPP.core.DOMObserver,window.YPP=window.YPP||{},window.YPP.StorageManager=(K=class{static _initCacheListener(){this._cacheInitialized||(this._cacheInitialized=!0,chrome.storage.onChanged.addListener((e,t)=>{if(t===K.CONFIG.STORAGE_AREA)for(const[r,{newValue:i}]of Object.entries(e)){let n=i;if(i===void 0)this._cache.delete(r),n=void 0;else try{const s=JSON.parse(i);this._cache.set(r,s),n=s.data}catch{this._cache.set(r,{data:i}),n=i}window.YPP.events&&(window.YPP.events.emit(`${K.CONFIG.EVENTS.CHANGED_KEY}${r}`,n),window.YPP.events.emit(K.CONFIG.EVENTS.CHANGED,{key:r,newValue:n}))}}))}static async set(e,t,r=null){var s,o;const i=this._writeQueue;let n;this._writeQueue=new Promise(a=>{n=a});try{await i}catch{}try{let a={data:t};r&&(a.expiresAt=Date.now()+r*24*60*60*1e3);const l=JSON.stringify(a,(u,h)=>h??void 0),d=new TextEncoder().encode(l).length;return await this.getBytesUsed()+d>this._MAX_BYTES*.9?(this._notifyQuotaWarning(),(s=window.YPP.Utils)==null||s.log(`[YPP Storage] Quota almost exceeded! Skipping write for ${e}.`,K.CONFIG.LOG_CATEGORY,"warn"),!1):(await chrome.storage.local.set({[e]:l}),this._cache.set(e,a),!0)}catch(a){throw(o=window.YPP.Utils)==null||o.log(`Set error: ${a.message}`,K.CONFIG.LOG_CATEGORY,"error"),a}finally{n()}}static async get(e){if(this._initCacheListener(),this._cache.has(e)){const r=this._cache.get(e);return r.expiresAt&&Date.now()>r.expiresAt?(this._cache.delete(e),await chrome.storage.local.remove(e),null):r.data}if(this._inflightRequests.has(e))return this._inflightRequests.get(e);const t=(async()=>{var i;let r;try{r=await chrome.storage.local.get(e)}catch(n){return(i=window.YPP.Utils)==null||i.log(`Get error: ${n.message}`,K.CONFIG.LOG_CATEGORY,"error"),null}if(!r[e])return null;try{const n=JSON.parse(r[e]);return this._cache.set(e,n),n.expiresAt&&Date.now()>n.expiresAt?(this._cache.delete(e),await chrome.storage.local.remove(e),null):n.data}catch{return this._cache.set(e,{data:r[e]}),r[e]}})();this._inflightRequests.set(e,t);try{return await t}finally{this._inflightRequests.delete(e)}}static async purgeExpired(){var i,n,s;let e;try{e=await chrome.storage.local.get(null)}catch(o){(i=window.YPP.Utils)==null||i.log(`Purge error: ${o.message}`,K.CONFIG.LOG_CATEGORY,"error");return}const t=[];let r=0;for(const[o,a]of Object.entries(e))try{const l=JSON.parse(a);l.expiresAt&&Date.now()>l.expiresAt&&(t.push(o),r+=new TextEncoder().encode(a).length)}catch{t.push(o)}if(t.length>0)try{await chrome.storage.local.remove(t),(n=window.YPP.Utils)==null||n.log(`[YPP Storage] Purged ${t.length} expired keys. Freed ~${(r/1024).toFixed(2)} KB.`,K.CONFIG.LOG_CATEGORY,"info")}catch(o){(s=window.YPP.Utils)==null||s.log(`Purge remove error: ${o.message}`,K.CONFIG.LOG_CATEGORY,"error")}}static async getBytesUsed(){var e;try{return await chrome.storage.local.getBytesInUse(null)}catch(t){return(e=window.YPP.Utils)==null||e.log(`GetBytesUsed error: ${t.message}`,K.CONFIG.LOG_CATEGORY,"error"),0}}static onQuotaWarning(e){this._quotaWarningCallbacks.add(e)}static _notifyQuotaWarning(){for(const e of this._quotaWarningCallbacks)e()}},G(K,"CONFIG",{STORAGE_AREA:"local",LOG_CATEGORY:"STORAGE",EVENTS:{CHANGED:"storage:changed",CHANGED_KEY:"storage:changed:"}}),G(K,"_writeQueue",Promise.resolve()),G(K,"_quotaWarningCallbacks",new Set),G(K,"_MAX_BYTES",5242880),G(K,"_cache",new Map),G(K,"_cacheInitialized",!1),G(K,"_inflightRequests",new Map),K),window.YPP=window.YPP||{},window.YPP.core=window.YPP.core||{},window.YPP.core.EventDelegator=class{constructor(){this.registry=new Map,this._handleClick=this._handleClick.bind(this),this.isRunning=!1}start(){this.isRunning||(document.body.addEventListener("click",this._handleClick,!0),this.isRunning=!0)}stop(){this.isRunning&&(document.body.removeEventListener("click",this._handleClick,!0),this.isRunning=!1)}register(e,t){!e||typeof t!="function"||this.registry.set(e,t)}unregister(e){this.registry.delete(e)}_handleClick(e){if(this.registry.size===0)return;const t=e.target.closest("[data-ypp-action]");if(!t)return;const r=t.getAttribute("data-ypp-action"),i=this.registry.get(r);if(i){e.stopPropagation(),e.preventDefault();const n=t.getAttribute("data-ypp-payload");try{i(e,t,n)}catch(s){console.error(`[YPP:EventDelegator] Error in action '${r}':`,s)}}}};class mr{constructor(){this.registries=new Map,this._boundHandler=this.handleKeyDown.bind(this),this.isActive=!1,this.shiftMap={"<":",",">":".",":":";",'"':"'","{":"[","}":"]","|":"\\","?":"/","~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"="}}init(){this.isActive||(document.addEventListener("keydown",this._boundHandler,!0),this.isActive=!0)}destroy(){this.isActive&&(document.removeEventListener("keydown",this._boundHandler,!0),this.isActive=!1,this.registries.clear())}register(e,t){this.registries.set(e,t.map(r=>({combo:this._normalizeCombo(r.combo),callback:r.callback})))}unregister(e){this.registries.delete(e)}handleKeyDown(e){const t=e.target;if(!t||t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable||t.closest("ytd-searchbox")||t.closest("paper-input")||t.closest("iron-input")||t.closest('[contenteditable="true"]')||t.getAttribute("role")==="textbox")return;const i=this._comboFromEvent(e);if(!i)return;let n=!1;for(const s of this.registries.values())for(const o of s)if(o.combo===i){n||(e.preventDefault(),e.stopImmediatePropagation(),n=!0);try{o.callback(e)}catch(a){console.error(`[YPP HotkeysManager] Error executing shortcut callback for ${i}:`,a)}}}_comboFromEvent(e){const t=[];e.ctrlKey&&t.push("Ctrl"),e.altKey&&t.push("Alt"),e.shiftKey&&t.push("Shift"),e.metaKey&&t.push("Meta");let r=e.key;return e.shiftKey&&this.shiftMap[r]&&(r=this.shiftMap[r]),r===" "&&(r="Space"),["Control","Shift","Alt","Meta"].includes(r)?"":(r=r.length===1?r.toUpperCase():r,t.push(r),t.join("+"))}_normalizeCombo(e){if(!e)return"";const t=e.split("+"),r=t.some(i=>i.toLowerCase()==="shift");return t.map((i,n,s)=>{if(n<s.length-1)return i.charAt(0).toUpperCase()+i.slice(1).toLowerCase();let o=i;return r&&this.shiftMap[o]&&(o=this.shiftMap[o]),o.length===1?o.toUpperCase():o}).join("+")}}window.YPP=window.YPP||{},window.YPP.hotkeysManager=new mr,window.YPP.hotkeysManager.init();class yr{constructor(e,t){var r,i;this.utils=e,this.settings={...((i=(r=window.YPP)==null?void 0:r.CONSTANTS)==null?void 0:i.DEFAULT_SETTINGS)||{},...t},this.isActive=!1,this.currentUrl="",this.matchPatterns=[]}matches(e){try{const t=new URL(e,window.location.origin);return this.matchPatterns.some(r=>r.test(t.pathname))}catch{return!1}}activate(e){this.isActive&&this.currentUrl===e||(this.isActive=!0,this.currentUrl=e,this.utils.log(`Activated ${this.constructor.name}`,"ROUTER","info"),this.onActivate(),this.applySettings(this.settings))}deactivate(){this.isActive&&(this.isActive=!1,this.utils.log(`Deactivated ${this.constructor.name}`,"ROUTER","info"),this.onDeactivate())}updateSettings(e){this.settings={...this.settings,...e},this.isActive&&this.applySettings(e)}onActivate(){}onDeactivate(){}applySettings(e){}}window.YPP=window.YPP||{},window.YPP.BasePageManager=yr;class fr extends window.YPP.BasePageManager{constructor(e,t){super(e,t),this.matchPatterns=[/.*/],this.TOGGLE_MAP={hideComments:"ypp-hide-comments",hideMetrics:"ypp-hide-metrics",hideThumbnails:"ypp-hide-thumbnails",hideWatched:"ypp-hide-watched",hideMixes:"ypp-hide-mixes",hidePlaylists:"ypp-hide-playlists",hidePodcasts:"ypp-hide-podcasts",hidePosts:"ypp-hide-posts",hidePromoShelves:"ypp-hide-promos",hideShorts:"ypp-hide-shorts",hideLiveChat:"ypp-hide-live-chat",hideEndScreens:"ypp-hide-endscreens",hideChannelCards:"ypp-hide-channel-cards",hideCards:"ypp-hide-video-cards",hideMerch:"ypp-hide-merch",hideFundraiser:"ypp-hide-fundraiser",hideSearchShelves:"ypp-hide-search-shelves",hideAnnotations:"ypp-hide-annotations",hideRelated:"ypp-hide-related",hideVoiceSearch:"ypp-hide-voice-search",hideShortsInteraction:"ypp-hide-shorts-interaction",hideTrending:"ypp-hide-trending",hideExploreTopics:"ypp-hide-explore-topics",hidePlayerTopics:"ypp-hide-player-topics",hideFeed:"ypp-hide-feed",aggressiveShortsBlock:"ypp-nuke-shorts",hideSearchShorts:"ypp-hide-search-shorts",cleanSearch:"ypp-clean-search",hideScrollbar:"ypp-hide-scrollbar",customScrollbar:"ypp-custom-scrollbar",grayscaleThumbnails:"ypp-grayscale-thumbs",useSquareCorners:"ypp-use-square-corners"}}onActivate(){this.utils.log("Global Layout Active","GLOBAL_MANAGER","info"),this._startMonitoring()}onDeactivate(){var t;(t=window.YPP)!=null&&t.sharedObserver&&(window.YPP.sharedObserver.unregister("global_mixes"),window.YPP.sharedObserver.unregister("global_shorts"),window.YPP.sharedObserver.unregister("global_playlists"));const e=Object.values(this.TOGGLE_MAP);document.body.classList.remove(...e),this._disableCleanMixUrls()}applySettings(e){if(this.settings={...this.settings,...e},!!this.isActive){for(const[t,r]of Object.entries(this.TOGGLE_MAP))this.settings[t]?document.body.classList.add(r):document.body.classList.remove(r);e.cleanMixUrls?this._enableCleanMixUrls():this._disableCleanMixUrls()}}_startMonitoring(){var e;(e=window.YPP)!=null&&e.sharedObserver}_enableCleanMixUrls(){this._mixClickHandler||(this._mixClickHandler=e=>{const t=e.target.closest("a[href]");if(t&&t.href.includes("list=RD"))try{const r=new URL(t.href,window.location.origin),i=r.searchParams.get("list");i&&i.startsWith("RD")&&(r.searchParams.delete("list"),r.searchParams.delete("start_radio"),t.href=r.pathname+r.search+r.hash)}catch{}},document.addEventListener("click",this._mixClickHandler,!0))}_disableCleanMixUrls(){this._mixClickHandler&&(document.removeEventListener("click",this._mixClickHandler,!0),this._mixClickHandler=null)}}window.YPP=window.YPP||{},window.YPP.managers=window.YPP.managers||{},window.YPP.managers.GlobalLayoutManager=fr;class gr extends window.YPP.BasePageManager{constructor(e,t){super(e,t),this.matchPatterns=[/^\/$/,/^\/\?.*/],this.features={homeOrganizer:new window.YPP.features.HomeOrganizer}}onActivate(){this.utils.log("Home Page Active","HOME_MANAGER","info")}onDeactivate(){this.utils.log("Home Page Deactivated","HOME_MANAGER","info"),Object.values(this.features).forEach(e=>{e.disable&&e.disable()})}applySettings(e){this.settings={...this.settings,...e},this.isActive&&this.features.homeOrganizer&&(this.settings.hideFeed?this.features.homeOrganizer.disable():this.features.homeOrganizer.run?this.features.homeOrganizer.run(this.settings):this.features.homeOrganizer.enable&&this.features.homeOrganizer.enable())}}window.YPP=window.YPP||{},window.YPP.managers=window.YPP.managers||{},window.YPP.managers.HomePageManager=gr;class br extends window.YPP.BasePageManager{constructor(e,t){super(e,t),this.matchPatterns=[/^\/feed\/subscriptions/],this.features={folderUi:window.YPP.features.FolderUI?new window.YPP.features.FolderUI:null,subscriptionsUi:window.YPP.features.SubscriptionsUI?new window.YPP.features.SubscriptionsUI:null}}onActivate(){this.utils.log("Subscriptions Page Active","SUBS_MANAGER","info")}onDeactivate(){this.utils.log("Subscriptions Page Deactivated","SUBS_MANAGER","info"),Object.values(this.features).forEach(e=>{e!=null&&e.disable&&e.disable()})}applySettings(e){var t,r;this.settings={...this.settings,...e},this.isActive&&(this.features.deckMode&&(this.settings.enableDeckMode?this.features.deckMode.enable():this.features.deckMode.disable()),this.features.folderUi&&(this.settings.subscriptionFolders?(this.features.folderUi.enable(),(t=this.features.subscriptionsUi)==null||t.enable()):(this.features.folderUi.disable(),(r=this.features.subscriptionsUi)==null||r.disable())))}}window.YPP=window.YPP||{},window.YPP.managers=window.YPP.managers||{},window.YPP.managers.SubscriptionsPageManager=br;class vr extends window.YPP.BasePageManager{constructor(e,t){super(e,t),this.matchPatterns=[/^\/results/],this.features={searchRedesign:window.YPP.features.SearchRedesign?new window.YPP.features.SearchRedesign:null,searchObserver:window.YPP.features.SearchObserver?new window.YPP.features.SearchObserver:null},this.features.searchRedesign&&this.features.searchRedesign.init(this.settings)}onActivate(){var e,t;this.utils.log("Search Page Active","SEARCH_MANAGER","info"),(e=this.features.searchRedesign)!=null&&e.enable&&this.features.searchRedesign.enable(),(t=this.features.searchObserver)!=null&&t.enable&&this.features.searchObserver.enable()}onDeactivate(){this.utils.log("Search Page Deactivated","SEARCH_MANAGER","info"),Object.values(this.features).forEach(e=>{e!=null&&e.disable&&e.disable()})}applySettings(e){this.settings={...this.settings,...e},this.features.searchRedesign&&this.features.searchRedesign.run(this.settings)}}window.YPP=window.YPP||{},window.YPP.managers=window.YPP.managers||{},window.YPP.managers.SearchPageManager=vr;class wr extends window.YPP.BasePageManager{constructor(e,t){super(e,t),this.matchPatterns=[/^\/watch/],this.state={sidebar:"default",viewMode:"default",playerActionStyle:"premium",enableCustomSidebar:!0},this.ROOT_SELECTORS=["ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer","ytd-watch-next-secondary-results-renderer yt-lockup-view-model","ytd-watch-next-secondary-results-renderer ytd-lockup-view-model","ytd-watch-next-secondary-results-renderer ytd-rich-item-renderer"],this.injectedButtons=!1,this._videoElement=null,this._featuresInitialized=!1,this.eventListeners=[],this.playerBarUI=new window.YPP.features.PlayerBarUI(this)}onActivate(){this.utils.log("Watch Page Active","WATCH_MANAGER","info"),this._cleanUpLegacyStamps(),this._initFeatures(),this._initPlayer(),window.YPP.ui.manager.mount("watchPageTop",this.filterBar,"prepend")}async _initFeatures(){var e,t;if(!(this._featuresInitialized||this._featuresInitializing)){this._featuresInitializing=!0;try{await this.utils.pollFor(()=>{var r,i;return(i=(r=window.YPP)==null?void 0:r.features)==null?void 0:i.PlayerControls},5e3,100),(t=(e=window.YPP)==null?void 0:e.features)!=null&&t.PlayerControls?(this.controlsHelper=new window.YPP.features.PlayerControls(this),this.settingsMenuHelper=new window.YPP.features.PlayerSettingsMenu(this)):this.utils.log("PlayerControls feature unavailable — core player features may not load","WATCH_MANAGER","error"),this.features={zenMode:window.YPP.features.ZenMode?new window.YPP.features.ZenMode:null,studyMode:window.YPP.features.StudyMode?new window.YPP.features.StudyMode:null,focusMode:window.YPP.features.FocusMode?new window.YPP.features.FocusMode:null},this._featuresInitialized=!0,this._featuresInitializing=!1,this.isActive&&this.applySettings(this.settings)}catch{this.utils.log("Feature init timed out","WATCH_MANAGER","warn"),this._featuresInitializing=!1}}}onDeactivate(){this._cleanupDOM(),this._cleanupPlayer(),this._domApplied=!1,this.features&&Object.values(this.features).forEach(e=>{e!=null&&e.disable&&e.disable()})}applySettings(e){var i,n,s,o,a,l;if(this.settings={...this.settings,...e},!this.isActive)return;let t="default",r="default";this.settings.sidebarLayout&&(t=this.settings.sidebarLayout),this.settings.studyMode?r="study":this.settings.enableFocusMode?r="focus":this.settings.zenMode?r="zen":this.settings.cinemaMode?r="cinema":this.settings.minimalMode&&(r="minimal"),this.setState({sidebar:t,viewMode:r,playerActionStyle:this.settings.playerActionStyle||"premium"}),this.features&&(r==="zen"?(i=this.features.zenMode)==null||i.enable():(n=this.features.zenMode)==null||n.disable(),r==="study"?(s=this.features.studyMode)==null||s.enable():(o=this.features.studyMode)==null||o.disable(),r==="focus"?(a=this.features.focusMode)==null||a.enable():(l=this.features.focusMode)==null||l.disable())}setState(e){let t=!1;for(const[r,i]of Object.entries(e))this.state[r]!==i&&(this.state[r]=i,t=!0);this.state.enableCustomSidebar!==this.settings.enableCustomSidebar&&(this.state.enableCustomSidebar=this.settings.enableCustomSidebar,t=!0),this.isActive&&(t||!this._domApplied)&&(this._domApplied=!0,this._applyDOM())}_applyDOM(){const e=document.body,t=["ypp-sidebar-compact","ypp-sidebar-spacious","ypp-sidebar-expanded","ypp-sidebar-grid","ypp-sidebar-hidden","ypp-cinema-mode","ypp-minimal-mode","ypp-zen-mode","ypp-focus-mode","ypp-study-mode","ypp-action-style-premium","ypp-action-style-minimal","ypp-action-style-default"];if(e.classList.remove(...t),this.settings.playerActionStyle?e.classList.add(`ypp-action-style-${this.settings.playerActionStyle}`):e.classList.add("ypp-action-style-premium"),this.settings.enableCustomSidebar&&(this.state.sidebar==="compact"||this.state.sidebar==="default"?e.classList.add("ypp-sidebar-compact"):this.state.sidebar==="spacious"?e.classList.add("ypp-sidebar-spacious"):this.state.sidebar==="expanded"?e.classList.add("ypp-sidebar-expanded"):this.state.sidebar==="grid"&&e.classList.add("ypp-sidebar-grid")),(this.state.sidebar==="hidden"||["zen","focus"].includes(this.state.viewMode))&&e.classList.add("ypp-sidebar-hidden"),this.state.viewMode!=="default"&&e.classList.add(`ypp-${this.state.viewMode}-mode`),window.dispatchEvent(new CustomEvent("ypp-watch-mode-changed",{detail:{mode:this.state.viewMode}})),this.state.viewMode==="cinema"){const r=document.querySelector("#player-container-outer")||document.querySelector("ytd-player");r&&setTimeout(()=>{r.scrollIntoView({behavior:"smooth",block:"center"})},300)}}_cleanupDOM(){const e=["ypp-sidebar-compact","ypp-sidebar-spacious","ypp-sidebar-expanded","ypp-sidebar-grid","ypp-sidebar-hidden","ypp-cinema-mode","ypp-minimal-mode","ypp-zen-mode","ypp-focus-mode","ypp-study-mode","ypp-theater-mode-override","ypp-action-style-premium","ypp-action-style-minimal","ypp-action-style-default"];document.body.classList.remove(...e)}async _initPlayer(){const e=this.utils;if(e)try{const t=await e.pollFor(()=>{const r=window.location.pathname.startsWith("/shorts");if(r){const i=document.querySelector("ytd-reel-video-renderer[is-active] video"),n=document.querySelector("ytd-reel-video-renderer[is-active] .overlay.ytd-reel-video-renderer");if(i&&n)return{video:i,controls:n,isShorts:r}}else{const i=document.querySelector("video.html5-main-video"),n=document.querySelector(".ytp-chrome-bottom");if(i&&n)return{video:i,controls:n,isShorts:r}}return null},1e4,100);if(t){const{video:r,controls:i,isShorts:n}=t;this._videoElement=r,await this._initFeatures(),this.playerBarUI.injectControls(r,i,n),this._startMonitoring()}}catch{e.log("Player initialization timed out or failed","WATCH_MANAGER","debug")}}_startMonitoring(){var e;(e=window.YPP)!=null&&e.sharedObserver&&(window.YPP.sharedObserver.register("player_shorts","ytd-reel-video-renderer[is-active]:not([data-ypp-processed])",t=>{if(!this.isActive)return;const r=t[0];document.querySelectorAll(".ypp-player-controls").forEach(s=>s.remove());const i=r.querySelector("video"),n=r.querySelector(".overlay.ytd-reel-video-renderer");i&&n&&(this.injectControls(i,n,!0),r.setAttribute("data-ypp-processed","true"))},!0),window.YPP.sharedObserver.register("player_watch",".ytp-chrome-bottom:not([data-ypp-processed])",t=>{if(!this.isActive||window.location.pathname.startsWith("/shorts"))return;const r=t[0],i=document.querySelector("video");i&&r&&(this.playerBarUI.injectControls(i,r,!1),r.setAttribute("data-ypp-processed","true"))},!0),this._hasNavListener||(window.addEventListener("yt-navigate-finish",()=>{document.querySelectorAll('[data-ypp-processed="true"]').forEach(t=>{(t.classList.contains("ytp-right-controls")||t.classList.contains("ytd-reel-video-renderer"))&&t.removeAttribute("data-ypp-processed")})}),this._hasNavListener=!0))}injectControls(e,t,r){this.playerBarUI.injectControls(e,t,r)}_cleanupPlayer(){var r;this.playerBarUI&&this.playerBarUI.cleanup(),this._cleanupEvents(),(r=window.YPP)!=null&&r.sharedObserver&&(window.YPP.sharedObserver.unregister("player_shorts"),window.YPP.sharedObserver.unregister("player_watch")),document.querySelectorAll(".ytp-right-controls[data-ypp-processed], .ytp-chrome-bottom[data-ypp-processed], ytd-reel-video-renderer[data-ypp-processed]").forEach(i=>i.removeAttribute("data-ypp-processed")),this._videoElement=null,this.settingsMenuHelper&&this.settingsMenuHelper.cleanupSettingsObserver();const e=document.getElementById("ypp-custom-player-bar-styles");e&&e.remove();const t=document.getElementById("ypp-custom-player-bar-style-vis");t&&t.remove()}addListener(e,t,r,i=!1){!e||!e.addEventListener||(e.addEventListener(t,r,i),this.eventListeners||(this.eventListeners=[]),this.eventListeners.push({target:e,event:t,handler:r,options:i}))}_cleanupEvents(){this.eventListeners&&(this.eventListeners.forEach(({target:e,event:t,handler:r,options:i})=>{try{e.removeEventListener&&e.removeEventListener(t,r,i)}catch{}}),this.eventListeners=[])}}window.YPP=window.YPP||{},window.YPP.managers=window.YPP.managers||{},window.YPP.managers.WatchPageManager=wr;class Pr{constructor(){this.cache=new Map,this.canvas=document.createElement("canvas"),this.canvas.width=10,this.canvas.height=10,this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0}),this.enabled=!1,this.activeStyle="",this.activeWaitObservers=new Set,this.observer=new IntersectionObserver(e=>{this.enabled&&e.forEach(t=>{t.isIntersecting&&this.processElement(t.target)})},{rootMargin:"300px"}),this.mutationObserver=new MutationObserver(e=>{if(this.enabled)for(let t of e)for(let r of t.addedNodes)r.nodeType===Node.ELEMENT_NODE&&this.observeNewNodes(r)})}updateSettings(e){if(!e)return;this.activeStyle=e.cardStyle||"default";const t=["holographic","polaroid","glass","neon","cyberpunk","frosted"].includes(this.activeStyle);t&&!this.enabled?this.start():!t&&this.enabled&&this.stop()}start(){this.enabled||(this.enabled=!0,this.observeNewNodes(document.body),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0}))}stop(){this.enabled=!1,this.observer.disconnect(),this.mutationObserver.disconnect(),this.activeWaitObservers.forEach(e=>e.disconnect()),this.activeWaitObservers.clear(),document.querySelectorAll("[data-ypp-thumb-color]").forEach(e=>{e.style.removeProperty("--ypp-thumb-color"),e.removeAttribute("data-ypp-thumb-color")})}observeNewNodes(e){e.matches&&e.matches("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer")&&this.observer.observe(e),e.querySelectorAll&&e.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer").forEach(r=>this.observer.observe(r))}getImage(e){let t=e.querySelector("yt-image img, ytd-thumbnail img, yt-lockup-view-model img, .yt-core-image");if(!t){const r=e.querySelector("yt-image");r&&r.shadowRoot&&(t=r.shadowRoot.querySelector("img"))}return t}processElement(e){if(e.hasAttribute("data-ypp-thumb-color"))return;const t=this.getImage(e),r=t?t.src:null;if(!(r&&!r.includes("data:image"))){if(!e.hasAttribute("data-ypp-color-wait")){e.setAttribute("data-ypp-color-wait","true");const s=new MutationObserver(()=>{const o=this.getImage(e),a=o?o.src:null;a&&!a.includes("data:image")&&(s.disconnect(),this.activeWaitObservers.delete(s),e.removeAttribute("data-ypp-color-wait"),this.processElement(e))});this.activeWaitObservers.add(s),s.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["src"]})}return}const n=r;if(this.cache.has(n)){const s=this.cache.get(n);typeof s=="string"?e.style.setProperty("--ypp-thumb-color",s):(e.style.setProperty("--ypp-thumb-color",s.colorStr),e.style.setProperty("--ypp-thumb-rgb",s.rgbStr)),e.setAttribute("data-ypp-thumb-color","true");return}chrome.runtime.sendMessage({action:"EXTRACT_COLOR",url:n},s=>{if(chrome.runtime.lastError||!s||!s.success){const d="rgb(40, 40, 40)",p="40, 40, 40";this.cache.set(n,{colorStr:d,rgbStr:p}),e.isConnected&&(e.style.setProperty("--ypp-thumb-color",d),e.style.setProperty("--ypp-thumb-rgb",p),e.setAttribute("data-ypp-thumb-color","true"));return}const o=this.enhanceColorForGlow(s.r,s.g,s.b),a=`rgb(${o.r}, ${o.g}, ${o.b})`,l=`${o.r}, ${o.g}, ${o.b}`;this.cache.set(n,{colorStr:a,rgbStr:l}),e.isConnected&&(e.style.setProperty("--ypp-thumb-color",a),e.style.setProperty("--ypp-thumb-rgb",l),e.setAttribute("data-ypp-thumb-color","true"))})}enhanceColorForGlow(e,t,r){let i=Math.max(e,t,r);if(i===0)return{r:50,g:50,b:50};let n=255/i;return n=Math.min(n,1.4),{r:Math.min(255,Math.floor(e*n)),g:Math.min(255,Math.floor(t*n)),b:Math.min(255,Math.floor(r*n))}}}window.YPP=window.YPP||{},window.YPP.managers=window.YPP.managers||{},window.YPP.managers.ThumbnailColorManager=Pr,window.YPP=window.YPP||{},window.YPP.ui=window.YPP.ui||{};class xr{constructor(){G(this,"mountPoints",{playerControls:()=>{var e;return(e=window.YPP.DomAPI)==null?void 0:e.getVideoControls()},customPlayerControls:()=>document.querySelector(".ypp-player-controls"),headerRight:()=>{var e,t;return(t=(e=window.YPP.DomAPI)==null?void 0:e.getMasthead())==null?void 0:t.querySelector("#end")},sidebar:()=>{var e;return(e=window.YPP.DomAPI)==null?void 0:e.getSecondary()},related:()=>{var e;return(e=window.YPP.DomAPI)==null?void 0:e.getRelatedItems()},watchPage:()=>{var e;return(e=window.YPP.DomAPI)==null?void 0:e.getWatchFlexy()},homePageTop:()=>document.querySelector('ytd-browse[page-subtype="home"] #contents'),searchPageTop:()=>document.querySelector("ytd-search #contents"),watchPageTop:()=>document.querySelector("#secondary-inner")||document.querySelector("#comments"),subsPageTop:()=>document.querySelector('ytd-browse[page-subtype="subscriptions"] #contents')});this.components=new Map,window.YPP.events&&window.YPP.events.on("app:pageChange",()=>this.heal())}mount(e,t,r="append"){var s,o;const i=t.id;if(this.components.has(i)&&document.contains(this.components.get(i).el))return;t.el.dataset.yppId=i,t.mountPoint=e,t.position=r,this.components.set(i,t);const n=(o=(s=this.mountPoints)[e])==null?void 0:o.call(s);n&&(n.querySelector(`[data-ypp-id="${i}"]`)||(r==="prepend"?n.prepend(t.el):n.appendChild(t.el)))}remove(e){const t=this.components.get(e);t&&(t.el.remove(),this.components.delete(e))}heal(){this._healPending||(this._healPending=!0,requestAnimationFrame(()=>{this._healPending=!1;const e=[];this.components.forEach(t=>{document.contains(t.el)||e.push(t)}),e.forEach(t=>{this.components.delete(t.id),this.mount(t.mountPoint,t,t.position)})}))}destroy(){this.components.forEach(e=>e.el.remove()),this.components.clear()}}window.YPP.ui.manager=new xr,window.YPP=window.YPP||{},window.YPP.ui=window.YPP.ui||{},window.YPP.ui.components=window.YPP.ui.components||{},window.YPP.ui.components.createButton=function({id:c,icon:e,label:t="",tooltip:r="",onClick:i,className:n=""}){const s=document.createElement("button");s.className=`ypp-btn ${n}`.trim();let o="";return e&&(o+=`<span class="ypp-btn-icon">${e}</span>`),t&&(o+=`<span class="ypp-btn-label">${t}</span>`),s.innerHTML=o,r&&(s.title=r),i&&typeof i=="function"&&s.addEventListener("click",i),{id:`btn-${c}`,el:s}},window.YPP=window.YPP||{},window.YPP.ui=window.YPP.ui||{},window.YPP.ui.components=window.YPP.ui.components||{},window.YPP.ui.components.createPanel=function({id:c,content:e="",style:t="",className:r=""}){const i=document.createElement("div");i.className=`ypp-panel-host ${r}`.trim();const n=i.attachShadow({mode:"open"}),s=`
        <style>
            :host {
                display: block;
                /* By default, components should inherit YPP CSS variables from :root */
            }
            .ypp-shadow-panel {
                background: var(--ypp-bg-surface, rgba(20, 20, 20, 0.8));
                backdrop-filter: var(--ypp-glass-blur, blur(12px));
                -webkit-backdrop-filter: var(--ypp-glass-blur, blur(12px));
                border: var(--ypp-glass-border, 1px solid rgba(255, 255, 255, 0.1));
                border-radius: var(--ypp-radius-xl, 16px);
                padding: 16px;
                color: var(--text-primary, #ffffff);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                font-family: "Roboto", "Arial", sans-serif;
            }
            ${t}
        </style>
    `;return n.innerHTML=`
        ${s}
        <div class="ypp-shadow-panel">
            <slot>${e}</slot>
        </div>
    `,{id:`panel-${c}`,el:i,shadow:n}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.BaseFeature=(ae=class{constructor(e){this.name=e||this.constructor.name,this.isEnabled=!1,this.settings={},this.utils=window.YPP.Utils,this.events=window.YPP.events,this.domApi=window.YPP.DomAPI,this.observer=window.YPP.sharedObserver,this.delegator=window.YPP.sharedEventDelegator,this.eventListeners=[],this.busListeners=[]}async update(e){var n,s;let t=!1;if(e){for(const o in e)if(e[o]!==this.settings[o]){t=!0;break}}if(this.settings={...this.settings,...e},typeof this.run=="function"&&this.run!==window.YPP.features.BaseFeature.prototype.run)return this.run(e);const r=this.getConfigKey();let i=!0;r&&this.settings.hasOwnProperty(r)&&(i=!!this.settings[r]),i&&!this.isEnabled?((n=this.utils)==null||n.log(`Enabling feature: ${this.name}`,ae.CONFIG.LOG_CATEGORY,ae.CONFIG.LOG_LEVEL),this._abortController=new AbortController,await this.enable(),this.isEnabled=!0):!i&&this.isEnabled?((s=this.utils)==null||s.log(`Disabling feature: ${this.name}`,ae.CONFIG.LOG_CATEGORY,ae.CONFIG.LOG_LEVEL),this._abortController&&(this._abortController.abort(),this._abortController=null),await this.disable(),this.isEnabled=!1):this.isEnabled&&typeof this.onUpdate=="function"&&t&&await this.onUpdate()}getConfigKey(){return this.name?this.name.charAt(0).toLowerCase()+this.name.slice(1):null}async enable(){}async disable(){this.cleanupEvents()}waitForElement(e,t){var r;return this.utils.waitForElement(e,t,(r=this._abortController)==null?void 0:r.signal)}pollFor(e,t,r){var i;return this.utils.pollFor(e,t,r,(i=this._abortController)==null?void 0:i.signal)}addListener(e,t,r,i=!1){!e||!e.addEventListener||(e.addEventListener(t,r,i),this.eventListeners.push({target:e,event:t,handler:r,options:i}))}removeListener(e,t,r,i=!1){!e||!e.removeEventListener||(e.removeEventListener(t,r,i),this.eventListeners=this.eventListeners.filter(n=>!(n.target===e&&n.event===t&&n.handler===r)))}cleanupEvents(){this.eventListeners.forEach(({target:e,event:t,handler:r,options:i})=>{var n;try{e.removeEventListener&&e.removeEventListener(t,r,i)}catch(s){(n=this.utils)==null||n.log(`Cleanup error: ${s.message}`,ae.CONFIG.LOG_CATEGORY,"error")}}),this.eventListeners=[],this.busListeners.forEach(e=>{var t;try{e()}catch(r){(t=this.utils)==null||t.log(`Bus cleanup error: ${r.message}`,ae.CONFIG.LOG_CATEGORY,"error")}}),this.busListeners=[]}onBusEvent(e,t){if(!this.events)return;const r=this.events.on(e,t.bind(this));this.busListeners.push(r)}onPageChange(e){}onVideoChange(e){}async run(e){return this.update(e)}isProcessed(e,t,r){if(!e||!t)return!1;const i=e.getAttribute(`data-ypp-processed-${this.name}`);return i===t?!0:(i&&typeof r=="function"&&r(e,i),e.setAttribute(`data-ypp-processed-${this.name}`,t),!1)}},G(ae,"CONFIG",{LOG_CATEGORY:"MAIN",LOG_LEVEL:"debug"}),ae),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.BaseFilterFeature=class extends window.YPP.features.BaseFeature{constructor(e){super(e),this._hiddenElements=new WeakSet,this._allowedPages=["/","/index"]}get allowedPages(){return this._allowedPages}_shouldRunOnCurrentPage(){const e=window.location.pathname;return this.allowedPages.some(t=>e===t)}_hideElement(e,t=""){!e||this._hiddenElements.has(e)||(e.classList.add("ypp-hidden",`ypp-hidden-by-${this.constructor.name.toLowerCase()}`),t&&(e.dataset.yppHiddenReason=t),e.dataset.yppHiddenBy=this.constructor.name,this._hiddenElements.add(e),this._emitHiddenEvent(e,t))}_unhideElement(e){!e||!this._hiddenElements.has(e)||(e.classList.remove("ypp-hidden",`ypp-hidden-by-${this.constructor.name.toLowerCase()}`),delete e.dataset.yppHiddenReason,delete e.dataset.yppHiddenBy,this._hiddenElements.delete(e))}_unhideAll(){document.querySelectorAll(`[data-ypp-hidden-by="${this.constructor.name}"]`).forEach(e=>{this._unhideElement(e)})}_emitHiddenEvent(e,t){var r,i;(i=window.YPP.events)==null||i.emit("filter:hidden",{feature:this.constructor.name,element:e,reason:t,url:(r=e.querySelector("a"))==null?void 0:r.href})}async disable(){await super.disable(),this._unhideAll()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{};const $e="ypp-split-scrolling-style",dt="ypp-split-scrolling-enabled";window.YPP.features.SplitScrolling=class extends window.YPP.features.BaseFeature{constructor(){super("SplitScrolling")}getConfigKey(){return"splitScrolling"}enable(){this._injectStyles(),document.body.classList.add(dt)}disable(){document.body.classList.remove(dt),super.disable()}onPageChange(e){this.isEnabled&&!document.getElementById($e)&&this._injectStyles()}_injectStyles(){if(document.getElementById($e))return;const e=document.createElement("style");e.id=$e,e.setAttribute("data-ypp-feature","splitScrolling");const t="html:not(.ypp-sidebar-comments-active) body.ypp-split-scrolling-enabled ytd-watch-flexy:not([hidden])";e.textContent=`
            /* ══ YPP: Independent Sidebar Scroll ══════════════════════════════ */

            /*
             * overflow:clip on ancestors — the critical fix.
             *
             * overflow:clip visually clips overflowing content, just like
             * overflow:hidden, but does NOT create a block formatting context
             * (BFC). A BFC is what causes position:sticky to silently stop
             * working. Using clip instead of hidden preserves sticky while
             * still preventing scroll-bar emergence on these containers.
             */
            body.ypp-split-scrolling-enabled #page-manager {
                overflow: clip !important;
            }

            ${t} {
                overflow: clip !important;
                /* Establish a height context so the child height:calc() resolves */
                min-height: 100vh !important;
            }

            /*
             * #columns is a flex container. overflow:visible lets the sticky
             * child escape, and align-items:flex-start stops it from
             * stretching to the container height (which would prevent scrolling).
             */
            ${t} #columns {
                overflow: visible !important;
                align-items: flex-start !important;
            }

            /* ── The sticky, independently-scrollable sidebar ─────────────── */

            ${t} #secondary {
                position: sticky !important;
                top: var(--ytd-masthead-height, 56px) !important;
                height: calc(100vh - var(--ytd-masthead-height, 56px)) !important;
                box-sizing: border-box !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                margin-top: 0 !important;
                padding-top: var(--ytd-margin-6x, 24px) !important;
                /* Firefox */
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
            }

            /* ── Webkit scrollbar (shown unless hide-scrollbar is active) ──── */

            body.ypp-split-scrolling-enabled:not(.ypp-hide-scrollbar) ${t} #secondary::-webkit-scrollbar {
                width: 6px !important;
                display: block !important;
            }
            body.ypp-split-scrolling-enabled:not(.ypp-hide-scrollbar) ${t} #secondary::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2) !important;
                border-radius: 4px !important;
            }
            body.ypp-split-scrolling-enabled:not(.ypp-hide-scrollbar) ${t} #secondary::-webkit-scrollbar-track {
                background: transparent !important;
            }

            /* ── Override: hide sidebar scrollbar when global hide-scrollbar is on */

            body.ypp-hide-scrollbar.ypp-split-scrolling-enabled ${t} #secondary {
                scrollbar-width: none !important;
            }
            body.ypp-hide-scrollbar.ypp-split-scrolling-enabled ${t} #secondary::-webkit-scrollbar {
                width: 0 !important;
                display: none !important;
            }

            /* ── Breathing room at the bottom of the sidebar list ─────────── */

            ${t} #secondary-inner {
                padding-bottom: 40px !important;
            }
        `,document.head.appendChild(e)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.Theme=class extends window.YPP.features.BaseFeature{constructor(){super("ThemeManager"),this._initConstants(),this._initState()}getConfigKey(){return"premiumTheme"}_initConstants(){this._CONSTANTS=window.YPP.CONSTANTS||{},this._SELECTORS=this._CONSTANTS.SELECTORS||{},this._CSS_CLASSES=this._CONSTANTS.CSS_CLASSES||{},this._GRID=this._CONSTANTS.GRID||{},this._TIMINGS=this._CONSTANTS.TIMINGS||{},this._Utils=window.YPP.Utils||{}}_initState(){this._isActive=!1,this._settings=null}enable(){this._run(this.settings)}disable(){var e,t;try{this._toggleTheme(!1),this._cleanupClasses(),this._cleanupCustomVariables(),this._isActive=!1}catch(r){(t=(e=this._Utils).log)==null||t.call(e,`Error disabling theme: ${r.message}`,"THEME","error")}}onUpdate(){this._run(this.settings)}_run(e){var t,r;this._settings=e||{},this._isActive=!0;try{this._toggleTheme(this._settings.premiumTheme),this._applyCustomizationSettings()}catch(i){(r=(t=this._Utils).log)==null||r.call(t,`Error running theme: ${i.message}`,"THEME","error")}}_toggleTheme(e){const t=document.documentElement,r=document.body;t.classList.toggle(this._CSS_CLASSES.THEME_ENABLED,e);const i=this._settings.enableThemeEffects!==!1;if(t.classList.toggle("ypp-theme-effects",i&&e),r&&r.classList.toggle(this._CSS_CLASSES.THEME_ENABLED,e),this._Utils.log(`Toggling theme: ${e?"ON":"OFF"}`,"THEME"),e){let n=this._settings.activeTheme||"default";if(this._settings.trueBlack===!0&&n==="default"&&(this._Utils.log("Legacy True Black enabled -> Forcing Midnight theme","THEME"),n="midnight"),n==="system"){this._handleSystemTheme();return}else this._stopSystemListener();this._applyTheme(n)}else this._stopSystemListener(),this._removeThemeFile(),this._currentThemeKey=null}_handleSystemTheme(){this._systemMediaQuery||(this._systemMediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),this._systemListener=t=>{t.matches,this._Utils.log(`System theme changed: ${t.matches?"Dark":"Light"}`,"THEME"),this._applyTheme(t.matches?"midnight":"default")},this.addListener(this._systemMediaQuery,"change",this._systemListener));const e=this._systemMediaQuery.matches;this._applyTheme(e?"midnight":"default")}_stopSystemListener(){this._systemMediaQuery&&this._systemListener&&(this._systemMediaQuery.removeEventListener("change",this._systemListener),this._systemMediaQuery=null,this._systemListener=null)}_applyTheme(e){e!==this._currentThemeKey||!document.getElementById("ypp-active-theme-css")?(this._Utils.log(`Theme changed (${this._currentThemeKey} -> ${e}), injecting...`,"THEME"),e.startsWith("custom_")?this._injectCustomTheme(e):this._injectThemeFile(e),this._currentThemeKey=e):this._Utils.log(`Theme '${e}' already active, skipping injection.`,"THEME","debug")}forceReload(){this._currentThemeKey?(this._Utils.log("Force reloading theme...","THEME"),this._currentThemeKey.startsWith("custom_")?this._injectCustomTheme(this._currentThemeKey):this._injectThemeFile(this._currentThemeKey,!0)):this._run(this._settings)}_injectCustomTheme(e){const r=(this._settings.customThemes||{})[e];if(!r){this._Utils.log(`Custom theme ${e} not found, falling back to default.`,"THEME","warn"),this._injectThemeFile("default");return}const i="ypp-active-theme-css";let n=document.getElementById(i);n&&n.tagName.toLowerCase()!=="style"&&(n.remove(),n=null),n||(n=document.createElement("style"),n.id=i,n.className="ypp-theme-style",document.head.appendChild(n));const s=Object.entries(r.variables||{}).map(([o,a])=>`${o}: ${a} !important;`).join(`
`);n.textContent=`:root.ypp-spiral-tube-theme, :root.yt-spiral-tube-theme, html[data-ypp-theme="${e}"] {
${s}
}`,this._Utils.log(`Injecting Custom Theme: ${e}`,"THEME")}_injectThemeFile(e,t=!1){const r="ypp-active-theme-css";let i=document.getElementById(r);i&&i.tagName.toLowerCase()!=="link"&&(i.remove(),i=null);const n=chrome.runtime.getURL(`src/content/themes/${e}.css`),s=t?`${n}?t=${Date.now()}`:n;i||(i=document.createElement("link"),i.id=r,i.rel="stylesheet",i.className="ypp-theme-link",document.head.appendChild(i)),i.href=s,this._Utils.log(`Injecting Theme: ${e} (Force: ${t})`,"THEME")}_removeThemeFile(){const t=document.getElementById("ypp-active-theme-css");t&&t.remove()}_applyCustomizationSettings(){if(!this._settings)return;const e=document.documentElement;if(this._settings.fontScale!==void 0&&e.style.setProperty("--ypp-font-scale",(this._settings.fontScale/100).toFixed(2)),this._settings.accentColor){let t=this._settings.accentColor;this._CONSTANTS.PREMIUM_COLORS&&this._CONSTANTS.PREMIUM_COLORS[t]&&(t=this._CONSTANTS.PREMIUM_COLORS[t]),e.style.setProperty("--ypp-accent-primary",t),e.style.setProperty("--ypp-accent-color",t),e.style.setProperty("--ypp-accent-glow",t+"66"),e.style.setProperty("--ypp-accent-hover",t+"cc"),e.style.setProperty("--ypp-accent-gradient",`linear-gradient(135deg, ${t} 0%, ${t}cc 100%)`)}this._settings.cardStyle&&e.setAttribute("data-ypp-card-style",this._settings.cardStyle)}_cleanupClasses(){const e=[this._CSS_CLASSES.THEME_ENABLED,"ypp-theme-effects"].filter(Boolean);document.documentElement.classList.remove(...e),document.body.classList.remove(...e)}_cleanupCustomVariables(){const e=document.documentElement;e.style.removeProperty("--ypp-font-scale"),e.style.removeProperty("--ypp-accent-primary"),e.style.removeProperty("--ypp-accent-color"),e.style.removeProperty("--ypp-accent-glow"),e.style.removeProperty("--ypp-accent-hover"),e.style.removeProperty("--ypp-accent-gradient"),e.removeAttribute("data-ypp-card-style")}isActive(){return this._isActive}getSettings(){return{...this._settings}}setSetting(e,t){this._settings&&(this._settings={...this._settings,[e]:t},this._run(this._settings))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AccountMenuData=class{static getAvatarUrl(e,{isActive:t=!1}={}){var a,l,d,p,u;const r=e.getAttribute("data-ypp-avatar");if(r&&!r.startsWith("data:")&&r!==window.location.href)return r;const i=e.querySelector("yt-img-shadow, yt-image"),n=i==null?void 0:i.getAttribute("src");if(n&&!n.startsWith("data:")&&n!==window.location.href)return n;const s=e.querySelector("img#img, yt-img-shadow img, yt-image img, img"),o=(s==null?void 0:s.getAttribute("src"))||(s==null?void 0:s.src)||"";if(o&&!o.startsWith("data:")&&o!==window.location.href)return o;try{const h=e.data||e.__data;if(h){const m=((a=h.accountPhoto)==null?void 0:a.thumbnails)||((l=h.thumbnail)==null?void 0:l.thumbnails)||((d=h.photo)==null?void 0:d.thumbnails)||h.thumbnails;if(Array.isArray(m)&&m.length){const y=m[m.length-1];if(y!=null&&y.url&&!y.url.startsWith("data:"))return y.url}if((p=h.accountPhoto)!=null&&p.url)return h.accountPhoto.url;if((u=h.thumbnail)!=null&&u.url)return h.thumbnail.url}}catch{}if(t){const h=document.querySelector("#masthead #avatar-btn img,#avatar-btn yt-img-shadow img,#masthead ytd-topbar-menu-button-renderer img,#masthead ytd-topbar-menu-button-renderer .yt-core-image"),m=(h==null?void 0:h.getAttribute("src"))||(h==null?void 0:h.src)||"";if(m&&!m.startsWith("data:")&&m!==window.location.href)return m}return""}static extractData(e){var s,o,a,l,d,p;try{const u=document.createElement("script");u.textContent=`
                (function() {
                    const items = document.querySelectorAll('ytd-active-account-header-renderer, ytd-account-item-renderer, ytd-account-item');
                    for (const el of items) {
                        try {
                            const d = el.data || el.__data;
                            if (d) {
                                const thumbs = d.accountPhoto?.thumbnails || d.thumbnail?.thumbnails || d.photo?.thumbnails || d.thumbnails;
                                if (Array.isArray(thumbs) && thumbs.length) {
                                    const best = thumbs[thumbs.length - 1];
                                    if (best?.url) el.setAttribute('data-ypp-avatar', best.url);
                                } else if (d.accountPhoto?.url) {
                                    el.setAttribute('data-ypp-avatar', d.accountPhoto.url);
                                } else if (d.thumbnail?.url) {
                                    el.setAttribute('data-ypp-avatar', d.thumbnail.url);
                                }
                            }
                        } catch(e) {}
                    }
                })();
            `,document.documentElement.appendChild(u),u.remove()}catch{}const t=[];let r="";const i=e.querySelector("ytd-active-account-header-renderer");if(i){r=((o=(s=i.querySelector("#account-name yt-formatted-string,#account-name span,#account-name"))==null?void 0:s.textContent)==null?void 0:o.trim())||"";const u=((l=(a=i.querySelector("#channel-handle, #account-email, #email"))==null?void 0:a.textContent)==null?void 0:l.trim())||"";t.push({name:r,handle:u,avatar:this.getAvatarUrl(i,{isActive:!0}),isActive:!0})}const n=((d=e.querySelector("#manage-account"))==null?void 0:d.href)||((p=e.querySelector('a[href*="/channel"]'))==null?void 0:p.href)||"/";return e.querySelectorAll("ytd-account-item-renderer, ytd-account-item").forEach((u,h)=>{var P,w,C;const m=u.querySelector("#account-name yt-formatted-string,#account-name span,#account-name,#channel-title yt-formatted-string,#channel-title,#name"),y=((P=m==null?void 0:m.textContent)==null?void 0:P.trim())||"";if(!y)return;const v=((C=(w=u.querySelector("#account-email, #channel-handle"))==null?void 0:w.textContent)==null?void 0:C.trim())||"",f=!!u.querySelector('yt-icon[icon="checked"], [aria-checked="true"]')||!!r&&y===r,g=this.getAvatarUrl(u,{isActive:f}),_=t.find(x=>x.name===y);_?(_.nativeIndex=h,g&&!_.avatar&&(_.avatar=g)):t.push({name:y,handle:v,avatar:g,isActive:f,nativeIndex:h})}),{accounts:t,channelHref:n}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AccountMenuUI=class{static esc(e){return(e||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}static letterAvatar(e,t,r=!1){var d;const i=(e||"A").trim(),n=((d=Array.from(i)[0])==null?void 0:d.toUpperCase())||"?",o=`hsl(${i.codePointAt(0)*47%360},50%,35%)`,a=Math.round(t*.38);return`<div class="ypp-letter-avatar" style="width:${t}px;height:${t}px;border-radius:50%;background:${o};display:flex;align-items:center;justify-content:center;font-size:${a}px;color:#fff;font-weight:600;font-family:Roboto,Arial,sans-serif;flex-shrink:0;user-select:none;position:relative;${r?"box-shadow:0 0 0 3px #ff4e45,0 0 0 5px rgba(255,78,69,0.25);":""}">${n}</div>`}static diskHTML(e,t,r=!1){const i=e==null?void 0:e.avatar,n=r?"box-shadow:0 0 0 3px #ff4e45,0 0 0 5px rgba(255,78,69,0.25);":"";return i?`<div class="ypp-disk-wrap"
                        data-fallback-name="${this.esc((e==null?void 0:e.name)||"")}"
                        data-size="${t}"
                        data-ring="${r?"1":"0"}"
                        style="width:${t}px;height:${t}px;border-radius:50%;
                               overflow:hidden;flex-shrink:0;position:relative;
                               ${n}">
                       <img class="ypp-disk-img"
                            src="${this.esc(i)}"
                            alt="${this.esc((e==null?void 0:e.name)||"")}"
                            loading="eager"
                            style="width:100%;height:100%;object-fit:cover;display:block;">
                   </div>`:this.letterAvatar(e==null?void 0:e.name,t,r)}static buildMenuHTML(e){const{accounts:t,channelHref:r}=e,i=t.find(y=>y.isActive)||t[0],n=t.filter(y=>!y.isActive),s=88,o=40,a=s*2+o+28,l=n.map((y,v)=>{const b=v/n.length*2*Math.PI-Math.PI/2,f=Math.round(Math.cos(b)*s),g=Math.round(Math.sin(b)*s),_=y.nativeIndex??v,P=(y.name||"").split(" ")[0].substring(0,9);return`<div class="ypp-satellite"
                         data-account-index="${_}"
                         title="${this.esc(y.name)}"
                         role="button"
                         tabindex="0"
                         aria-label="Switch to ${this.esc(y.name)}"
                         style="position:absolute;top:50%;left:50%;
                                transform:translate(calc(-50% + ${f}px),calc(-50% + ${g}px));
                                cursor:pointer;
                                display:flex;flex-direction:column;
                                align-items:center;gap:3px;">
                        ${this.diskHTML(y,o)}
                        <span style="font-size:10px;font-weight:500;
                                     color:rgba(255,255,255,0.7);
                                     max-width:${o+16}px;
                                     overflow:hidden;text-overflow:ellipsis;
                                     white-space:nowrap;line-height:1;
                                     text-align:center;
                                     font-family:Roboto,Arial,sans-serif;
                                     text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                            ${this.esc(P)}
                        </span>
                    </div>`}).join(""),d=`
            <div style="position:absolute;top:50%;left:50%;
                        transform:translate(-50%,-50%);z-index:2;pointer-events:none;">
                ${this.diskHTML(i,68,!0)}
            </div>`,p=`
            <div class="ypp-orbital-wrap"
                 style="position:relative;width:${a}px;height:${a}px;margin:0 auto;">
                ${l}
                ${d}
            </div>`,u=this.esc(r),h={appearance:'<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><circle cx="12" cy="12" r="4"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 4.6l.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H10a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V10a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',language:'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 7.64c-1.38-1.53-3.11-2.6-5.08-3.16.89 1.13 1.55 2.45 1.93 3.86h3.15zm-8.8 3.86h4.88c-.06 1.13-.25 2.22-.56 3.25H9.08c-.31-1.03-.5-2.12-.56-3.25zm.56-4.5h3.76c.21 1.05.34 2.15.34 3.25 0 1.1-.13 2.2-.34 3.25H9.64c-.21-1.05-.34-2.15-.34-3.25 0-1.1.13-2.2.34-3.25zm1.5-6.1c1.55.51 2.92 1.44 3.99 2.65h-3.99V2.9zm-4.66.26c1.07-1.21 2.44-2.14 3.99-2.65v3.41H6.96zM4.64 9.64h3.15c.38-1.41 1.04-2.73 1.93-3.86-1.97.56-3.7 1.63-5.08 3.16v.7z"/>',location:'<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',keyboard:'<path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>',restricted:'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>',help:'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>',feedback:'<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>',studio:'<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-3V8l5 3 5-3v6l-5 3z"/>',purchases:'<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>',data:'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',google:'<path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.545,6.477,2.545,12s4.476,10,10,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>'},m=(y,v,b,f=!1,g="")=>`
            <${f?'a href="'+g+'" target="_blank"':'button id="'+y+'"'} class="ypp-menu-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="${f?"currentColor":"none"}" stroke="currentColor" stroke-width="${f?"0":"1.5"}" aria-hidden="true" style="opacity:0.8; margin-right: 4px;">
                    ${v}
                </svg>
                ${b}
            </${f?"a":"button"}>
        `;return`
        <div class="ypp-menu-header"
             style="padding:24px 16px 16px;text-align:center;
                    background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
                    border-bottom:1px solid rgba(255,255,255,0.06);">
            ${p}
            <div style="margin-top:20px;">
                <div class="ypp-active-name" style="font-size:18px; font-weight:600; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${this.esc((i==null?void 0:i.name)||"Account")}</div>
                ${i!=null&&i.handle?`<div class="ypp-active-handle" style="font-size:13px; color: rgba(255,255,255,0.6); margin-top:4px;">${this.esc(i.handle)}</div>`:""}
                <a class="ypp-channel-link"
                   href="${u}"
                   id="ypp-view-channel"
                   style="display:inline-block; margin-top:12px; padding:6px 16px; background:rgba(255,255,255,0.1); border-radius:20px; text-decoration:none; color:#fff; font-size:13px; font-weight:500; transition:background 0.2s;">View channel</a>
            </div>
        </div>

        <div class="ypp-menu-scrollable" style="max-height: 400px; overflow-y: auto; padding: 12px 8px;">
            ${m("ypp-appearance",h.appearance,"Appearance")}
            ${m("ypp-settings",h.settings,"Settings")}
            ${m("ypp-language",h.language,"Language")}
            ${m("ypp-location",h.location,"Location")}
            ${m("ypp-keyboard",h.keyboard,"Keyboard shortcuts")}
            ${m("ypp-restricted",h.restricted,"Restricted Mode")}
            
            <div style="height: 1px; background: rgba(255,255,255,0.06); margin: 8px 12px;"></div>

            <button class="ypp-menu-item ypp-more-toggle" id="ypp-more-toggle"
                    aria-expanded="false" aria-controls="ypp-more-items"
                    style="padding: 10px 14px; border-radius: 10px; color: rgba(255,255,255,0.7);">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="margin-right: 4px;">
                    <circle cx="12" cy="5"  r="1" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    <circle cx="12" cy="19" r="1" fill="currentColor"/>
                </svg>
                More options
                <svg class="ypp-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            <div class="ypp-more-items" id="ypp-more-items" role="group" style="margin-left: 8px; border-left: 2px solid rgba(255,255,255,0.05); padding-left: 4px; margin-top: 4px;">
                ${m("",h.studio,"YouTube Studio",!0,"https://studio.youtube.com")}
                ${m("",h.purchases,"Purchases & memberships",!0,"/paid_memberships")}
                ${m("",h.data,"Your data in YouTube",!0,"/account")}
                ${m("",h.google,"Google Account",!0,"https://myaccount.google.com")}
                ${m("ypp-help",h.help,"Help")}
                ${m("ypp-feedback",h.feedback,"Send feedback")}
            </div>
        </div>

        <div class="ypp-menu-footer" style="padding: 12px; background: rgba(0,0,0,0.2);">
            <button class="ypp-menu-item ypp-signout" id="ypp-signout" style="padding: 10px 14px; border-radius: 10px; justify-content: center; background: rgba(255, 78, 69, 0.1); border: 1px solid rgba(255, 78, 69, 0.2); color: #ff4e45; font-weight: 500;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="margin-right: 4px;">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
            </button>
        </div>

        <div class="ypp-signout-confirm" id="ypp-signout-confirm" role="dialog"
             aria-modal="true" aria-labelledby="ypp-confirm-title">
            <div class="ypp-confirm-box">
                <p id="ypp-confirm-title">Sign out of YouTube?</p>
                <div class="ypp-confirm-actions">
                    <button id="ypp-confirm-cancel">Cancel</button>
                    <button id="ypp-confirm-ok" class="danger">Sign out</button>
                </div>
            </div>
        </div>`}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AccountMenu=class extends window.YPP.features.BaseFeature{constructor(){super("AccountMenu"),this._pollTimer=null,this._avatarPollTimer=null,this._dropdownObserver=null,this._injected=!1,this._currentMenu=null}getConfigKey(){return"enableAccountMenu"}async enable(){var e,t;await super.enable();try{this.addListener(document,"click",r=>{const i=r.target.closest("#avatar-btn, yt-notification-topbar-button-renderer, ytd-topbar-menu-button-renderer");i&&(window.YPP.lastMenuClick=i.id||i.tagName)},{capture:!0}),(e=window.YPP)!=null&&e.sharedObserver&&window.YPP.sharedObserver.register("account-menu-dropdown","tp-yt-iron-dropdown, ytd-multi-page-menu-renderer",()=>{this._injected||this._onMutation()})}catch(r){(t=this.utils)==null||t.log("Error enabling AccountMenu","ACCOUNT","error",r)}}async disable(){var e;await super.disable(),(e=window.YPP)!=null&&e.sharedObserver&&window.YPP.sharedObserver.unregister("account-menu-dropdown"),this._cleanup()}_onMutation(){if(this._injected||this._pollTimer)return;const e=this._findMenu();e&&(this._cloakNativeChildren(e),this._startPolling(e))}_findMenu(){const e=document.querySelectorAll("tp-yt-iron-dropdown");for(const i of e){if(i.hasAttribute("aria-hidden")&&i.getAttribute("aria-hidden")==="true")continue;const n=i.querySelector("ytd-multi-page-menu-renderer");if(n&&this._isAccountMenu(n))return n}const t=document.querySelector('ytd-multi-page-menu-renderer[slot="menu"]');if(t&&this._isAccountMenu(t))return t;const r=document.querySelectorAll("ytd-multi-page-menu-renderer");for(const i of r)if(this._isAccountMenu(i))return i;return null}_isAccountMenu(e){return window.YPP.lastMenuClick&&window.YPP.lastMenuClick.includes("NOTIFICATION")?!1:window.YPP.lastMenuClick&&window.YPP.lastMenuClick.includes("avatar-btn")?!0:!!(e.querySelector("ytd-active-account-header-renderer")||e.querySelector("ytd-account-item-renderer")||e.querySelector("ytd-account-item")||e.querySelector('a[href*="studio.youtube.com"]')||e.querySelector('a[href*="logout"]')||e.querySelector('a[href*="myaccount.google.com"]'))}_cloakNativeChildren(e){e.dataset.yppCloaked||(e.dataset.yppCloaked="1",Array.from(e.children).forEach(t=>{t.classList.contains("ypp-account-menu")||(t.style.setProperty("position","fixed","important"),t.style.setProperty("top","0","important"),t.style.setProperty("left","0","important"),t.style.setProperty("width","10px","important"),t.style.setProperty("height","10px","important"),t.style.setProperty("opacity","0.001","important"),t.style.setProperty("pointer-events","none","important"),t.style.setProperty("z-index","-1","important"),t.querySelectorAll("ytd-account-item-renderer, ytd-account-item, yt-img-shadow").forEach(r=>{r.style.setProperty("position","absolute","important"),r.style.setProperty("top","0","important"),r.style.setProperty("left","0","important"),r.style.setProperty("width","10px","important"),r.style.setProperty("height","10px","important")}))}))}_startPolling(e){this._pollTimer||(this._pollTimer=!0,this.pollFor(()=>{if(!e.isConnected)return!0;this._cloakNativeChildren(e);const t=window.YPP.features.AccountMenuData.extractData(e);if(t.accounts.length<=1){const i=Array.from(e.querySelectorAll("ytd-compact-link-renderer, ytd-menu-navigation-item-renderer")).find(n=>{var a;const s=(n.textContent||"").toLowerCase(),o=((a=n.querySelector("yt-icon"))==null?void 0:a.getAttribute("icon"))||"";return s.includes("switch")||s.includes("cambiar")||o.includes("switch_account")||o.includes("switch-account")});if(i)return(i.querySelector("a#endpoint, tp-yt-paper-item")||i).click(),!1}return t.accounts.some(i=>i.isActive&&i.name)?(this._pollTimer=null,this._doInject(e,t),!0):!1},4e3,40).catch(()=>{this._pollTimer=null}))}_clearPollTimer(){this._pollTimer===!0&&(this._pollTimer=null)}_clearAvatarPollTimer(){clearTimeout(this._avatarPollTimer),this._avatarPollTimer=null}_doInject(e,t){var i;if(this._injected)return;this._injected=!0,this._currentMenu=e,e.dataset.yppRedesigned="1",(i=e.querySelector(".ypp-account-menu"))==null||i.remove();const r=document.createElement("div");r.className="ypp-account-menu",r.style.cssText="opacity:0;transform:translateY(-8px);transition:opacity 0.25s ease,transform 0.25s cubic-bezier(0.34,1.56,0.64,1);",r.innerHTML=window.YPP.features.AccountMenuUI.buildMenuHTML(t),e.appendChild(r),this._wireEvents(r),requestAnimationFrame(()=>{requestAnimationFrame(()=>{r.style.opacity="1",r.style.transform="translateY(0)"})}),this._scheduleAvatarRefresh(r,e)}_scheduleAvatarRefresh(e,t){const r=[250,700,1400,2500];let i=0;const n=(o,a,l,d)=>{if(!o)return;const p=o.querySelector(".ypp-disk-wrap .ypp-disk-img");if(p&&p.getAttribute("src")===a.avatar)return;const u=o.querySelector(".ypp-letter-avatar");if(!u)return;const h=document.createElement("div");h.innerHTML=window.YPP.features.AccountMenuUI.diskHTML(a,l,d);const m=h.firstElementChild;if(!m)return;u.replaceWith(m);const y=m.querySelector(".ypp-disk-img");y&&this.addListener(y,"error",()=>{const v=document.createElement("div");v.innerHTML=window.YPP.features.AccountMenuUI.letterAvatar(a.name,l,d),m.replaceWith(v.firstElementChild)})},s=()=>{if(!e.isConnected)return;if(window.YPP.features.AccountMenuData.extractData(t).accounts.forEach(a=>{if(a.avatar)if(a.isActive){const l=e.querySelector(".ypp-orbital-wrap");if(l){const d=l.querySelector("div:not(.ypp-satellite)");d&&n(d,a,68,!0)}}else{const l=a.name,d=e.querySelector(`.ypp-satellite[title="${CSS.escape(l)}"]`);d&&n(d,a,40,!1)}}),i++,i<r.length){const a=i===0?r[0]:r[i]-r[i-1];this._avatarPollTimer=setTimeout(s,a)}};this._avatarPollTimer=window.setTimeout(s,r[0])}_wireEvents(e){const t=e.querySelector("#ypp-view-channel");t&&this.addListener(t,"click",()=>this._closeMenu());const r=e.querySelector("#ypp-appearance");r&&this.addListener(r,"click",()=>{this._closeMenu(),setTimeout(()=>{var g;(g=document.querySelector('ytd-toggle-theme-compact-link-renderer button,[aria-label*="Appearance"]'))==null||g.click()},150)});const i=e.querySelector("#ypp-settings");i&&this.addListener(i,"click",()=>{this._closeMenu(),window.location.href="/account"});const n=g=>{this._closeMenu(),setTimeout(()=>{const P=Array.from(document.querySelectorAll("ytd-compact-link-renderer, ytd-menu-navigation-item-renderer, ytd-toggle-theme-compact-link-renderer")).find(w=>{const C=(w.textContent||"").toLowerCase(),x=(w.getAttribute("aria-label")||"").toLowerCase();return g.some(S=>C.includes(S)||x.includes(S))});P&&P.click()},150)},s=e.querySelector("#ypp-language");s&&this.addListener(s,"click",()=>n(["language","idioma","langue","sprache","język"]));const o=e.querySelector("#ypp-location");o&&this.addListener(o,"click",()=>n(["location","ubicación","lieu","standort","lokalizacja"]));const a=e.querySelector("#ypp-restricted");a&&this.addListener(a,"click",()=>n(["restricted","restringido","restreint","eingeschränkt"]));const l=e.querySelector("#ypp-keyboard");l&&this.addListener(l,"click",()=>{this._closeMenu(),setTimeout(()=>{document.dispatchEvent(new KeyboardEvent("keydown",{key:"?",shiftKey:!0,bubbles:!0}))},150)});const d=e.querySelector("#ypp-help");d&&this.addListener(d,"click",()=>{this._closeMenu(),window.open("https://support.google.com/youtube/","_blank")});const p=e.querySelector("#ypp-feedback");p&&this.addListener(p,"click",()=>n(["feedback","comentarios","commentaires"]));const u=e.querySelector("#ypp-more-toggle"),h=e.querySelector("#ypp-more-items"),m=e.querySelector(".ypp-chevron");u&&h&&this.addListener(u,"click",()=>{const g=h.classList.toggle("open");u.setAttribute("aria-expanded",String(g)),m&&(m.style.transform=g?"rotate(180deg)":"")});const y=e.querySelector("#ypp-signout-confirm"),v=e.querySelector("#ypp-signout");v&&this.addListener(v,"click",()=>{y&&(y.style.display="flex")});const b=e.querySelector("#ypp-confirm-cancel");b&&this.addListener(b,"click",()=>{y&&(y.style.display="none")});const f=e.querySelector("#ypp-confirm-ok");f&&this.addListener(f,"click",()=>{const g=document.querySelector('a[href*="logout"]')||document.querySelector('a[href*="signout"]');g?g.click():window.location.href="https://www.youtube.com/logout"}),e.querySelectorAll(".ypp-disk-img").forEach(g=>{this.addListener(g,"error",()=>{const _=g.closest(".ypp-disk-wrap");if(!_)return;const P=_.dataset.fallbackName||"",w=parseInt(_.dataset.size,10)||40,C=_.dataset.ring==="1",x=document.createElement("div");x.innerHTML=window.YPP.features.AccountMenuUI.letterAvatar(P,w,C),_.replaceWith(x.firstElementChild)})}),e.querySelectorAll(".ypp-satellite").forEach(g=>{const _=()=>{const P=parseInt(g.dataset.accountIndex,10);if(!isNaN(P)){const w=document.querySelectorAll("ytd-account-item-renderer, ytd-account-item");w[P]&&w[P].click()}};this.addListener(g,"click",_),this.addListener(g,"keydown",P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),_())})})}_closeMenu(){const e=document.querySelector("tp-yt-iron-overlay-backdrop");if(e){e.click();return}document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:!0}))}onPageChange(e){this._cleanup()}_cleanup(){typeof this.cleanupEvents=="function"&&this.cleanupEvents(),this._clearPollTimer(),this._clearAvatarPollTimer(),this._injected=!1,this._currentMenu=null,document.querySelectorAll("[data-ypp-redesigned]").forEach(e=>{var t;Array.from(e.children).forEach(r=>{r.classList.contains("ypp-account-menu")||(r.style.removeProperty("position"),r.style.removeProperty("opacity"),r.style.removeProperty("pointer-events"),r.style.removeProperty("z-index"),r.style.removeProperty("top"),r.style.removeProperty("left"),r.style.removeProperty("width"),r.style.removeProperty("height"))}),e.querySelectorAll("ytd-account-item-renderer, ytd-account-item, yt-img-shadow").forEach(r=>{r.style.removeProperty("position"),r.style.removeProperty("opacity"),r.style.removeProperty("pointer-events"),r.style.removeProperty("z-index"),r.style.removeProperty("top"),r.style.removeProperty("left"),r.style.removeProperty("width"),r.style.removeProperty("height")}),delete e.dataset.yppRedesigned,delete e.dataset.yppCloaked,(t=e.querySelector(".ypp-account-menu"))==null||t.remove()}),document.querySelectorAll("[data-ypp-cloaked]").forEach(e=>{Array.from(e.children).forEach(t=>{t.style.removeProperty("position"),t.style.removeProperty("opacity"),t.style.removeProperty("pointer-events"),t.style.removeProperty("z-index"),t.style.removeProperty("top"),t.style.removeProperty("left"),t.style.removeProperty("width"),t.style.removeProperty("height")}),delete e.dataset.yppCloaked})}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.GridAnimator=class extends window.YPP.features.BaseFeature{constructor(){super(),this._batch=[],this._batchTimeout=null,this._hasAnime=typeof anime<"u"}enable(){if(!this._hasAnime){this.utils.log("Anime.js not found, skipping GridAnimator","GRID-ANIM","warn");return}this.observer.register("grid-animator","ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer",e=>{this._queueElementsForAnimation(e)},{runOnce:!1}),this.utils.log("GridAnimator enabled","GRID-ANIM","debug")}disable(){this.observer.unregister("grid-animator"),this._batchTimeout&&(cancelAnimationFrame(this._batchTimeout),this._batchTimeout=null),this._batch=[],document.querySelectorAll('[data-ypp-animated="true"]').forEach(e=>{e.style.opacity="",e.style.transform="",e.removeAttribute("data-ypp-animated")})}_queueElementsForAnimation(e){if(window.location.pathname==="/results")return;const t=e.filter(r=>!r.hasAttribute("data-ypp-animated"));t.length!==0&&(t.forEach(r=>{r.setAttribute("data-ypp-animated","true")}),this._batch.push(...t),this._batchTimeout&&cancelAnimationFrame(this._batchTimeout),this._batchTimeout=requestAnimationFrame(()=>{this._flushBatch()}))}_flushBatch(){const e=[...this._batch];this._batch=[],this._batchTimeout=null,e.length!==0&&anime({targets:e,opacity:[0,1],translateY:[12,0],delay:anime.stagger(20,{start:0}),duration:350,easing:"easeOutQuart"})}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ScreenFilters=class extends window.YPP.features.BaseFeature{constructor(){super("ScreenFilters"),this.filterOverlay=null}getConfigKey(){return null}async enable(){this._updateFilters()}async disable(){this.filterOverlay&&(this.filterOverlay.remove(),this.filterOverlay=null)}async onUpdate(){this._updateFilters()}_updateFilters(){const e=this.settings||{},t=e.blueLight||0,r=e.dim||0;if(t===0&&r===0){this.disable();return}this.filterOverlay||(this.filterOverlay=document.createElement("div"),this.filterOverlay.className="ypp-screen-filter",Object.assign(this.filterOverlay.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",pointerEvents:"none",zIndex:"9999999",mixBlendMode:"multiply",transition:"background 0.3s ease"}),document.documentElement.appendChild(this.filterOverlay));let i="";if(t>0&&r===0)i=`rgba(255, 150, 0, ${t/100*.4})`;else if(r>0&&t===0)i=`rgba(0, 0, 0, ${r/100*.8})`;else{const n=t/100*.4,s=r/100*.8;i=`linear-gradient(rgba(255, 150, 0, ${n}), rgba(255, 150, 0, ${n})), linear-gradient(rgba(0, 0, 0, ${s}), rgba(0, 0, 0, ${s}))`,this.filterOverlay.style.background=i;return}this.filterOverlay.style.background=i}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.CustomCSS=class extends window.YPP.features.BaseFeature{constructor(){super();G(this,"_onCSSChanged",t=>{this.isEnabled&&this.styleElement&&(this.styleElement.textContent=t||"")});this.styleElement=null}getConfigKey(){return"enableCustomCSS"}enable(){this.styleElement||(this.styleElement=document.createElement("style"),this.styleElement.id="ypp-custom-css",document.documentElement.appendChild(this.styleElement)),this._updateCSS(),window.YPP.EventBus.on("settings:changed:customCSSCode",this._onCSSChanged)}disable(){this.styleElement&&(this.styleElement.remove(),this.styleElement=null),window.YPP.EventBus.off("settings:changed:customCSSCode",this._onCSSChanged)}_updateCSS(){this.styleElement&&this._settings&&(this.styleElement.textContent=this._settings.customCSSCode||"")}},window.YPP=window.YPP||{},window.YPP.WatchedStore=(()=>{const c="ypp_watched_ids";let e=new Set,t=!1;const r=new Set;async function i(){if(!t)return new Promise(o=>{window.YPP.StorageManager.get(c).then(a=>{Array.isArray(a)&&(e=new Set(a)),t=!0,o()})})}function n(){window.YPP.StorageManager.set(c,[...e])}function s(o){r.forEach(a=>{try{a(o)}catch{}})}return{load:i,has(o){return e.has(o)},getAll(){return e},add(o){var a;!o||e.has(o)||(e.add(o),n(),s({type:"add",id:o}),(a=window.YPP.events)==null||a.emit("watched:updated",{videoId:o}))},remove(o){var a;!o||!e.has(o)||(e.delete(o),n(),s({type:"remove",id:o}),(a=window.YPP.events)==null||a.emit("watched:updated",{videoId:o}))},onChange(o){return r.add(o),()=>r.delete(o)},seed(o){o instanceof Set&&(e=new Set(o),t=!0)},get size(){return e.size}}})(),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{};const fe={CARD_ROOTS:["ytd-rich-item-renderer","ytd-video-renderer","ytd-compact-video-renderer","ytd-playlist-video-renderer","ytd-grid-video-renderer","ytd-reel-item-renderer","ytd-playlist-panel-video-renderer","yt-lockup-view-model","ytd-lockup-view-model"],CARD_PARENTS:"ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, yt-lockup-view-model",THUMBNAIL_ANCHOR:'a#thumbnail, a.ytd-thumbnail, a[href*="/watch?v="], a[href*="/shorts/"]',THUMBNAIL_CONTAINER:"ytd-thumbnail, #thumbnail, yt-image",VIDEO_TITLE:"#video-title, h3 a, .title, .yt-core-attributed-string",MENU_BTN:'ytd-menu-renderer button, button[aria-label*="More actions"], button[aria-label*="Action menu"]',MENU_ITEMS:'[role="menuitem"], yt-list-item-view-model-wiz, yt-list-item-view-model',MENU_LABEL:".yt-list-item-view-model-wiz__label",POPUP:"tp-yt-iron-dropdown, yt-sheet-view-model, ytd-popup-container",YT_APP:"ytd-app"},W={FEATURE_ENABLED:"ypp-ms-feature-enabled",SELECTION_ACTIVE:"ypp-ms-active",CARD_OVERLAY:"ypp-ms-card-overlay",CHECKBOX:"ypp-ms-checkbox",CHECKBOX_CHECKED:"ypp-ms-checked",CARD_SELECTED:"ypp-ms-selected",ACTION_BAR:"ypp-ms-bar"},ct={STAMP:"yppMultiSelect"},Re={OPEN:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',PLAYLIST:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>',WATCH_LATER:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',NOT_INTERESTED:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',WATCHED:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'};window.YPP.features.MultiSelect=class extends window.YPP.features.BaseFeature{constructor(){super("MultiSelect"),this._selected=new Map,this._selectionModeActive=!1,this._isActing=!1,this._actionBar=null,this._onPageChangeBound=null}getConfigKey(){return"multiSelect"}async enable(){var t,r,i,n;await super.enable(),document.body.classList.add(W.FEATURE_ENABLED);const e=()=>this.onPageChange();this._onPageChangeBound=(t=window.YPP.Utils)!=null&&t.debounce?window.YPP.Utils.debounce(e,200):e,(r=window.YPP.events)==null||r.on("app:pageChange",this._onPageChangeBound),(i=window.YPP.hotkeysManager)==null||i.register("multi-select",[{combo:"Ctrl+Q",callback:()=>this._toggleSelectionMode()}]),(n=window.YPP.sharedObserver)==null||n.register("multi-select",fe.CARD_ROOTS.slice(0,5).join(", "),()=>{var s;return(s=this._onPageChangeBound)==null?void 0:s.call(this)}),this._attachCheckboxes()}async disable(){var e,t,r;await super.disable(),this._removeAllCheckboxes(),this._selectionModeActive=!1,document.body.classList.remove(W.SELECTION_ACTIVE),this._selected.clear(),this._destroyActionBar(),document.body.classList.remove(W.FEATURE_ENABLED),(e=window.YPP.events)==null||e.off("app:pageChange",this._onPageChangeBound),this._onPageChangeBound=null,(t=window.YPP.hotkeysManager)==null||t.unregister("multi-select"),(r=window.YPP.sharedObserver)==null||r.unregister("multi-select")}onPageChange(){this._selected.size>0&&(this._selected.clear(),this._updateActionBar()),this._attachCheckboxes()}_toggleSelectionMode(){this._selectionModeActive?this._exitSelectionMode():this._enterSelectionMode()}_enterSelectionMode(){this._selectionModeActive=!0,document.body.classList.add(W.SELECTION_ACTIVE),this._attachCheckboxes(),this._showToast("Multi-select ON — click cards to select")}_exitSelectionMode(){this._selectionModeActive=!1,document.body.classList.remove(W.SELECTION_ACTIVE),this._clearAll(),this._showToast("Multi-select OFF")}_getVideoCards(){const e=fe.CARD_ROOTS.join(", ");return Array.from(document.querySelectorAll(e)).filter(t=>{var r;return!((r=t.parentElement)!=null&&r.closest(fe.CARD_PARENTS))})}_getVideoData(e){var o,a;const t=e.querySelector(fe.THUMBNAIL_ANCHOR),r=(t==null?void 0:t.href)||"",i=r.match(/[?&]v=([^&]+)|\/shorts\/([^/?]+)/),n=(i==null?void 0:i[1])||(i==null?void 0:i[2]),s=((a=(o=e.querySelector(fe.VIDEO_TITLE))==null?void 0:o.textContent)==null?void 0:a.trim())||"";return{videoId:n,href:r,title:s}}_attachCheckboxes(){this._getVideoCards().forEach(e=>{const t=e;if(t.dataset[ct.STAMP])return;t.dataset[ct.STAMP]="1";const{videoId:r,href:i,title:n}=this._getVideoData(t);r&&this._injectCheckboxAndOverlay(t,r,i,n)})}_injectCheckboxAndOverlay(e,t,r,i){const n=this._createCheckboxElement(t),s=this._createOverlayElement();e.appendChild(s);const o=e.querySelector(fe.THUMBNAIL_CONTAINER);o?(o.style.position="relative",o.appendChild(n)):e.appendChild(n),this._bindCardClickHandlers(e,n,s,t,r,i)}_createCheckboxElement(e){const t=document.createElement("div");return t.className=W.CHECKBOX,t.dataset.videoId=e,t.innerHTML=`
      <svg viewBox="0 0 24 24" width="14" height="14"
          fill="none" stroke="currentColor" stroke-width="3"
          class="ypp-ms-check-icon">
        <polyline points="20 6 9 17 4 12"/>
      </svg>`,t}_createOverlayElement(){const e=document.createElement("div");return e.className=W.CARD_OVERLAY,e}_bindCardClickHandlers(e,t,r,i,n,s){const o=a=>{a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),this._toggleSelect(e,i,n,s)};this.addListener(t,"click",o),this.addListener(r,"click",o),this.addListener(e,"click",a=>{if(!this._selectionModeActive||this._isActing||a.target.closest('ytd-menu-renderer, [aria-label*="More actions"], [aria-label*="Action menu"]'))return;const l=a.target.closest(`.${W.CHECKBOX}`),d=a.target.closest(`.${W.CARD_OVERLAY}`);!l&&!d&&(a.preventDefault(),a.stopPropagation(),a.stopImmediatePropagation(),this._toggleSelect(e,i,n,s))},{capture:!0})}_removeAllCheckboxes(){document.querySelectorAll("[data-ypp-multi-select]").forEach(t=>{t.querySelectorAll(`.${W.CHECKBOX}, .${W.CARD_OVERLAY}`).forEach(r=>r.remove()),t.classList.remove(W.CARD_SELECTED),delete t.dataset.yppMultiSelect})}_toggleSelect(e,t,r,i){this._selected.has(t)?this._deselect(e,t):this._select(e,t,r,i),this._updateActionBar()}_select(e,t,r,i){var n;this._selected.set(t,{title:i,href:r,element:e}),e.classList.add(W.CARD_SELECTED),(n=e.querySelector(`.${W.CHECKBOX}`))==null||n.classList.add(W.CHECKBOX_CHECKED)}_deselect(e,t){var r;this._selected.delete(t),e.classList.remove(W.CARD_SELECTED),(r=e.querySelector(`.${W.CHECKBOX}`))==null||r.classList.remove(W.CHECKBOX_CHECKED)}_clearAll(){this._selected.forEach(({element:e})=>{var r;const t=e;t.classList.remove(W.CARD_SELECTED),(r=t.querySelector(`.${W.CHECKBOX}`))==null||r.classList.remove(W.CHECKBOX_CHECKED)}),this._selected.clear(),this._selectionModeActive||document.body.classList.remove(W.SELECTION_ACTIVE),this._updateActionBar()}_updateActionBar(){const e=this._selected.size;if(e===0){this._destroyActionBar();return}this._actionBar||this._createActionBar(),this._refreshActionBarCounts(e)}_destroyActionBar(){var e;(e=this._actionBar)==null||e.remove(),this._actionBar=null}_createActionBar(){this._actionBar=document.createElement("div"),this._actionBar.className=W.ACTION_BAR,this._actionBar.innerHTML=this._buildActionBarHTML(),document.body.appendChild(this._actionBar),this._wireActionBarButtons()}_buildActionBarHTML(){return`
      <div class="ypp-ms-bar-info">
        <span class="ypp-ms-count" id="ypp-ms-count-val">0</span>
        <span class="ypp-ms-label" id="ypp-ms-count-label">videos selected</span>
      </div>
      <div class="ypp-ms-bar-actions">
        ${this.settings.msOptQueue!==!1?`<button class="ypp-ms-btn" id="ypp-ms-queue">${Re.OPEN} Queue Videos</button>`:""}
        ${this.settings.msOptPlaylist!==!1?`<button class="ypp-ms-btn" id="ypp-ms-playlist">${Re.PLAYLIST} Save to Playlist</button>`:""}
        ${this.settings.msOptWatchLater!==!1?`<button class="ypp-ms-btn" id="ypp-ms-wl">${Re.WATCH_LATER} Watch Later</button>`:""}
        ${this.settings.msOptNotInterested!==!1?`<button class="ypp-ms-btn" id="ypp-ms-not-interested">${Re.NOT_INTERESTED} Not Interested</button>`:""}
        ${this.settings.msOptMarkWatched!==!1?`<button class="ypp-ms-btn" id="ypp-ms-watched">${Re.WATCHED} Mark Watched</button>`:""}
        <button class="ypp-ms-btn ypp-ms-btn-clear" id="ypp-ms-clear">✕ Clear</button>
      </div>`}_wireActionBarButtons(){var t,r,i,n,s,o;const e=this._actionBar;(t=e.querySelector("#ypp-ms-queue"))==null||t.addEventListener("click",()=>this._addToQueue()),(r=e.querySelector("#ypp-ms-wl"))==null||r.addEventListener("click",()=>this._addToWatchLater()),(i=e.querySelector("#ypp-ms-playlist"))==null||i.addEventListener("click",()=>this._showPlaylistPicker()),(n=e.querySelector("#ypp-ms-not-interested"))==null||n.addEventListener("click",()=>this._markNotInterested()),(s=e.querySelector("#ypp-ms-watched"))==null||s.addEventListener("click",()=>this._markSelectedWatched()),(o=e.querySelector("#ypp-ms-clear"))==null||o.addEventListener("click",()=>this._clearAll())}_refreshActionBarCounts(e){const t=this._actionBar.querySelector("#ypp-ms-count-val"),r=this._actionBar.querySelector("#ypp-ms-count-label");t&&(t.textContent=String(e)),r&&(r.textContent=`video${e!==1?"s":""} selected`)}async _addToQueue(){const e=[...this._selected.values()];if(!e.length)return;this._showToast(`Adding ${e.length} video${e.length!==1?"s":""} to Queue…`);let t=0;for(const{element:r}of e)await this._invokeMenuAction(r,"add to queue")&&t++,await this._delay(350);this._showToast(`${t} video${t!==1?"s":""} added to Queue`),this._clearAll()}async _addToWatchLater(){const e=[...this._selected.values()];this._showToast(`Adding ${e.length} video${e.length!==1?"s":""} to Watch Later…`);let t=0;for(const{element:r}of e)await this._invokeMenuAction(r,"watch later")&&t++,await this._delay(350);this._showToast(`${t} video${t!==1?"s":""} added to Watch Later`),this._clearAll()}async _showPlaylistPicker(){const e=[...this._selected.values()];if(e.length===0)return;const t=[{text:"save to playlist"},{text:"save",exclude:"watch later"}];if(!await this._invokeMenuAction(e[0].element,t)){this._showToast("Could not open playlist picker — try clicking ⋮ manually");return}if(e.length===1){this._clearAll();return}const i=await this.waitForElement("ytd-add-to-playlist-renderer",3e3);if(!i){this._clearAll();return}const n=new Set,s=()=>{n.clear();const a=Array.from(i.querySelectorAll("ytd-playlist-add-to-option-renderer"));for(const l of a){const d=l.querySelector("tp-yt-paper-checkbox");if(d&&(d.hasAttribute("checked")||d.getAttribute("aria-checked")==="true"||d.checked)){const p=l.querySelector("#label");p&&n.add(p.textContent.trim())}}};if(await new Promise(a=>{const l=()=>{const u=i.closest("tp-yt-paper-dialog")||i.closest("ytd-popup-container");return!u||u.style.display==="none"||u.getAttribute("aria-hidden")==="true"||!document.body.contains(i)},d=new MutationObserver(()=>{l()||s(),l()&&(d.disconnect(),a())});d.observe(document.body,{childList:!0,subtree:!0,attributes:!0});const p=setInterval(()=>{l()||s(),l()&&(clearInterval(p),d.disconnect(),a())},200)}),n.size===0){this._clearAll();return}this._showToast(`Adding remaining ${e.length-1} video(s) to playlist(s)…`);let o=1;for(let a=1;a<e.length;a++){const l=e[a];if(!await this._invokeMenuAction(l.element,t))continue;await this._delay(300);const p=document.querySelector("ytd-add-to-playlist-renderer");if(!p)continue;const u=Array.from(p.querySelectorAll("ytd-playlist-add-to-option-renderer"));for(const m of u){const y=m.querySelector("#label");if(y&&n.has(y.textContent.trim())){const v=m.querySelector("tp-yt-paper-checkbox");v&&!(v.hasAttribute("checked")||v.getAttribute("aria-checked")==="true"||v.checked)&&(this._simulateMouseClick(v),await this._delay(100))}}const h=p.querySelector("#close-button");h?this._simulateMouseClick(h):document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:!0})),o++,await this._delay(300)}this._showToast(`Successfully saved ${o} videos to playlist(s)`),this._clearAll()}async _markNotInterested(){const e=[...this._selected.values()];this._showToast(`Marking ${e.length} video${e.length!==1?"s":""} as Not Interested…`);let t=0;for(const{element:r}of e)await this._invokeMenuAction(r,["not interested","don't recommend"],()=>{try{r.style.opacity="0.4",r.style.pointerEvents="none"}catch{}})&&t++,await this._delay(350);this._showToast(`${t} video${t!==1?"s":""} marked Not Interested`),this._clearAll()}async _markSelectedWatched(){var i;const e=[...this._selected.values()];this._showToast(`Syncing ${e.length} video${e.length!==1?"s":""} to Watch History... (this may take a moment)`);let t=0;const r=3;for(let n=0;n<e.length;n+=r){const s=e.slice(n,n+r),o=[];for(const{href:a,element:l}of s){const d=a.match(/[?&]v=([^&]+)|\/shorts\/([^/?]+)/),p=(d==null?void 0:d[1])||(d==null?void 0:d[2]);if(p){(i=window.YPP.WatchedStore)==null||i.add(p);try{l.style.opacity="0.45"}catch{}o.push(this._syncWatchHistory(p)),t++}}await Promise.all(o)}this._showToast(`Successfully added ${t} video${t!==1?"s":""} to Watch History!`),this._clearAll()}async _syncWatchHistory(e){return new Promise(t=>{const r=document.createElement("iframe");r.setAttribute("allow","autoplay; encrypted-media"),r.src=`https://www.youtube.com/embed/${e}?autoplay=1&mute=1&enablejsapi=1`,r.style.cssText="position:fixed; bottom:0; right:0; width:300px; height:200px; opacity:0.01; pointer-events:none; z-index:-9999;";let i=0,n=!1;const s=a=>{if(a.origin==="https://www.youtube.com"&&a.source===r.contentWindow)try{const l=JSON.parse(a.data);l.event==="infoDelivery"&&l.info?(l.info.duration&&(i=l.info.duration),l.info.playerState===1&&i>0&&!n&&(n=!0,setTimeout(()=>{try{r.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[Math.max(0,i-2),!0]}),"*")}catch{}},1500)),l.info.playerState===0&&o()):l.event==="initialDelivery"&&l.info&&l.info.duration&&(i=l.info.duration)}catch{}},o=()=>{window.removeEventListener("message",s),r.parentNode&&r.parentNode.removeChild(r),t(!0)};window.addEventListener("message",s),document.body.appendChild(r),setTimeout(o,1e4)})}async _invokeMenuAction(e,t,r){const i=e.querySelector(fe.MENU_BTN);if(!i)return!1;this._isActing=!0;try{this._simulateMouseClick(i);const n=await this._waitForNearestDropdown(i,3e3);if(!n)return!1;const s=this._findMenuItemByText(n,t);if(!s)return!1;const o=s.querySelector(fe.MENU_LABEL)||s;return this._simulateMouseClick(o),r==null||r(),!0}finally{this._isActing=!1}}_findMenuItemByText(e,t){const r=Array.isArray(t)?t:[t];return Array.from(e.querySelectorAll(fe.MENU_ITEMS)).find(n=>{const s=(n.innerText||n.textContent||"").trim().toLowerCase();return r.some(o=>typeof o=="string"?s.includes(o.toLowerCase()):o.exclude&&s.includes(o.exclude.toLowerCase())?!1:s.includes(o.text.toLowerCase()))})||null}_simulateMouseClick(e){e&&["pointerdown","mousedown","pointerup","mouseup","click"].forEach(t=>{e.dispatchEvent(new MouseEvent(t,{bubbles:!0,cancelable:!0,view:window}))})}_waitForNearestDropdown(e,t=2500){return new Promise(r=>{const i=Date.now(),n=setInterval(()=>{const s=this._findNearestOpenPopup(e);s?(clearInterval(n),r(s)):Date.now()-i>t&&(clearInterval(n),r(null))},60)})}_findNearestOpenPopup(e){const{left:t,top:r,width:i,height:n}=e.getBoundingClientRect(),s=t+i/2,o=r+n/2,a=Array.from(document.querySelectorAll(fe.POPUP)).filter(l=>{const d=l.getBoundingClientRect();return d.width>0&&d.height>0});return a.length?a.reduce((l,d)=>{const p=d.getBoundingClientRect(),u=Math.hypot(p.left+p.width/2-s,p.top+p.height/2-o),h=(()=>{const m=l.getBoundingClientRect();return Math.hypot(m.left+m.width/2-s,m.top+m.height/2-o)})();return u<h?d:l}):null}_showToast(e){var t,r,i;(t=window.YPP.Utils)!=null&&t.createToast?window.YPP.Utils.createToast(e):(i=(r=window.YPP.Utils)==null?void 0:r.log)==null||i.call(r,e,"MULTI-SELECT","info")}_delay(e){return new Promise(t=>setTimeout(t,e))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.HideWatched=(te=class extends window.YPP.features.BaseFilterFeature{constructor(){super("HideWatched"),this._debounceTimer=null,this._pollingInterval=null,this._boundSchedule=this._scheduleProcess.bind(this),this._boundProcessCards=this._processCards.bind(this),this._boundProcessProgress=this._processProgressBatch.bind(this)}getConfigKey(){return"hideWatched"}async enable(){var e,t;await super.enable(),this._updateBodyClass(),this._processCards(),this.onBusEvent("app:pageChange",()=>{this._processCards()}),this.onBusEvent("watched:updated",()=>{this._processCards()}),this._unsubscribeStore=(t=(e=window.YPP.WatchedStore)==null?void 0:e.onChange)==null?void 0:t.call(e,r=>{!this.isEnabled||!this._shouldRunOnCurrentPage()||(r.type==="add"?this._markCardWatched(r.id):r.type==="remove"&&this._unmarkCardWatched(r.id))}),window.YPP&&window.YPP.sharedObserver&&(this.onBusEvent("dom:mutated",r=>this._processMutatedNodes(r)),window.YPP.sharedObserver.register("hide-watched-cards",te.CARD_SELECTORS,r=>{var s;if(!this.isEnabled||!this._shouldRunOnCurrentPage())return;const i=this._getWatchedIds(),n=((s=this.settings)==null?void 0:s.hideWatchedThreshold)??80;r.forEach(o=>this._evaluateCard(o,i,n))},!0,!0),window.YPP.sharedObserver.register("hide-watched-progress","ytd-thumbnail-overlay-resume-playback-renderer, .thumbnail-overlay-resume-playback-progress, .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment",this._boundProcessProgress,!1,!0)),this.addListener(window,"yt-navigate-finish",()=>{document.querySelectorAll("[data-ypp-watched-processed]").forEach(r=>{delete r.dataset.yppWatchedProcessed}),this._scheduleProcess()})}async disable(){await super.disable(),this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null),this._unsubscribeStore&&(this._unsubscribeStore(),this._unsubscribeStore=null),window.YPP&&window.YPP.sharedObserver&&(window.YPP.sharedObserver.unregister("hide-watched-cards"),window.YPP.sharedObserver.unregister("hide-watched-progress")),document.body.classList.remove("ypp-watched-mode-hide","ypp-watched-mode-dim"),document.querySelectorAll("[data-ypp-watched]").forEach(e=>{e.removeAttribute("data-ypp-watched")}),document.querySelectorAll("[data-ypp-watched-processed]").forEach(e=>{delete e.dataset.yppWatchedProcessed}),document.querySelectorAll(".ypp-is-watched").forEach(e=>e.classList.remove("ypp-is-watched"))}async onUpdate(){this._updateBodyClass(),document.querySelectorAll("[data-ypp-watched]").forEach(e=>{e.removeAttribute("data-ypp-watched")}),document.querySelectorAll("[data-ypp-watched-processed]").forEach(e=>{delete e.dataset.yppWatchedProcessed}),this._processCards()}_updateBodyClass(){var t;(((t=this.settings)==null?void 0:t.hideWatchedMode)||"dim")==="hide"?(document.body.classList.add("ypp-watched-mode-hide"),document.body.classList.remove("ypp-watched-mode-dim")):(document.body.classList.add("ypp-watched-mode-dim"),document.body.classList.remove("ypp-watched-mode-hide"))}_scheduleProcess(){!this.isEnabled||!this._shouldRunOnCurrentPage()||(this._debounceTimer&&clearTimeout(this._debounceTimer),this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._processCards()},150))}_processMutatedNodes(e){var i,n;if(!this.isEnabled||!this._shouldRunOnCurrentPage()||!Array.isArray(e))return;const t=this._getWatchedIds(),r=((i=this.settings)==null?void 0:i.hideWatchedThreshold)??80;for(const s of e){const o=s.addedNodes;for(let a=0;a<o.length;a++){const l=o[a];l.nodeType!==Node.ELEMENT_NODE||!l.isConnected||((n=l.matches)!=null&&n.call(l,te.CARD_SELECTORS)&&this._evaluateCard(l,t,r),l.querySelectorAll&&l.querySelectorAll(te.CARD_SELECTORS).forEach(d=>{this._evaluateCard(d,t,r)}))}}}_getWatchedIds(){var e;return((e=window.YPP.WatchedStore)==null?void 0:e.getAll())??new Set}_getVideoId(e){const t=e.dataset.videoId||e.dataset.ytVideoId||e.getAttribute("video-id");if(t)return t;const r=e.querySelector("ytd-thumbnail[video-id]");if(r){const n=r.getAttribute("video-id");if(n)return n}const i=e.querySelector("a#thumbnail")||e.querySelector("a[href]");if(i){const n=i.getAttribute("href")||"",s=n.match(te.WATCH_URL_REGEX);if(s)return s[1];const o=n.match(te.SHORTS_URL_REGEX);if(o)return o[1]}return null}_getWatchProgress(e){const t=e.querySelector("ytd-thumbnail-overlay-resume-playback-renderer, .thumbnail-overlay-resume-playback-progress, .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment");if(!t||window.getComputedStyle(t).display==="none")return null;const i=(t.querySelector("#progress")||t.querySelector('div[style*="width"]')||t).style.width;if(!i)return 100;const n=parseFloat(i);return isNaN(n)?100:n}_hasWatchedBadge(e){const t=e.querySelectorAll("ytd-badge-supported-renderer, ytd-thumbnail-overlay-bottom-panel-renderer, ytd-thumbnail-overlay-playback-status-renderer");for(const r of t){if(window.getComputedStyle(r).display==="none")continue;const i=r.textContent.trim().toUpperCase();if(i==="WATCHED"||i==="VIEWED"||i==="PLAYED")return!0}return!1}_isWatched(e,t,r,i){if(t&&r.has(t))return!0;const n=this._getWatchProgress(e);return!!(n!==null&&n>=i||this._hasWatchedBadge(e))}_processProgressBatch(e){var i;if(!this.isEnabled||!this._shouldRunOnCurrentPage())return;const t=this._getWatchedIds(),r=((i=this.settings)==null?void 0:i.hideWatchedThreshold)??80;e.forEach(n=>{const s=n.closest(te.CARD_SELECTORS);s&&this._evaluateCard(s,t,r)})}_processCards(e=null){var n;if(!this.isEnabled||!this._shouldRunOnCurrentPage())return;const t=this._getWatchedIds(),r=((n=this.settings)==null?void 0:n.hideWatchedThreshold)??80;(e||document.querySelectorAll(te.CARD_SELECTORS)).forEach(s=>{this._evaluateCard(s,t,r)})}_getOutermostCard(e){if(!e)return null;if(e.tagName.toLowerCase().includes("lockup-view-model")){const t=e.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer");if(t)return t}return e}_evaluateCard(e,t,r){try{if(e.hasAttribute("hidden")||e.style.display==="none")return;const i=this._getVideoId(e),n=this._isWatched(e,i,t,r),s=this._getOutermostCard(e);if(!s)return;const o=s.getAttribute("data-ypp-watched")==="1"||s.classList.contains("ypp-is-watched");n&&!o?(s.setAttribute("data-ypp-watched","1"),s.classList.add("ypp-is-watched")):!n&&o&&(s.removeAttribute("data-ypp-watched"),s.classList.remove("ypp-is-watched"))}catch(i){this.utils.log(i.message,"HIDE_WATCHED","debug")}}_markCardWatched(e){e&&document.querySelectorAll(`[data-video-id="${e}"], [video-id="${e}"]`).forEach(t=>{let r=t.closest(te.CARD_SELECTORS);r=this._getOutermostCard(r),r&&(r.setAttribute("data-ypp-watched","1"),r.classList.add("ypp-is-watched"))})}_unmarkCardWatched(e){e&&document.querySelectorAll(`[data-video-id="${e}"], [video-id="${e}"]`).forEach(t=>{let r=t.closest(te.CARD_SELECTORS);r=this._getOutermostCard(r),r&&(r.removeAttribute("data-ypp-watched"),r.classList.remove("ypp-is-watched"))})}},G(te,"WATCH_URL_REGEX",/[?&]v=([^&]+)/),G(te,"SHORTS_URL_REGEX",/\/shorts\/([A-Za-z0-9_-]{11})/),G(te,"CARD_SELECTORS",["ytd-rich-item-renderer","ytd-video-renderer","ytd-compact-video-renderer","ytd-grid-video-renderer","ytd-reel-item-renderer","ytd-playlist-video-renderer","ytd-playlist-panel-video-renderer","yt-lockup-view-model","ytd-lockup-view-model"].join(",")),te),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.HideMixes=class extends window.YPP.features.BaseFilterFeature{constructor(){super("HideMixes"),this._boundProcess=this._processNodes.bind(this)}getConfigKey(){return"hideMixes"}async enable(){await super.enable(),document.documentElement.classList.add(window.YPP.CONSTANTS.CSS_CLASSES.HIDE_MIXES),window.YPP.sharedObserver&&window.YPP.sharedObserver.register("hide-mixes","ytd-rich-shelf-renderer, ytd-horizontal-card-list-renderer, ytd-radio-renderer",this._boundProcess);const e=document.querySelectorAll("ytd-rich-shelf-renderer, ytd-horizontal-card-list-renderer, ytd-radio-renderer");e.length>0&&this._processNodes(Array.from(e))}async disable(){await super.disable(),document.documentElement.classList.remove(window.YPP.CONSTANTS.CSS_CLASSES.HIDE_MIXES),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("hide-mixes"),document.querySelectorAll('[data-ypp-mix="true"]').forEach(t=>{t.removeAttribute("data-ypp-mix"),!t.classList.contains("ypp-is-watched")&&!t.classList.contains("ypp-hidden-duration")&&!t.hasAttribute("data-ypp-blocked")&&(t.style.display="")})}_processNodes(e){!this.isEnabled||!this._shouldRunOnCurrentPage()||e.forEach(t=>{if(t.hasAttribute("data-ypp-mix-processed"))return;if(t.setAttribute("data-ypp-mix-processed","true"),t.tagName.toLowerCase()==="ytd-radio-renderer"){this._hideElement(t);return}const r=t.querySelector("#title");if(r&&r.textContent){const i=r.textContent.trim().toLowerCase();(i==="mix"||i.startsWith("mix -")||i.includes("mix for you")||i.includes("your mix")||t.querySelector("ytd-radio-renderer")!==null)&&this._hideElement(t,"mix")}})}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.HideMetrics=class extends window.YPP.features.BaseFilterFeature{constructor(){super("HideMetrics"),this._bound=this._apply.bind(this)}getConfigKey(){return"hideMetrics"}async enable(){var e;await super.enable(),this._injectStyles(),this._apply(),(e=window.YPP.events)==null||e.on("page:changed",this._bound)}async disable(){var e;await super.disable(),(e=window.YPP.events)==null||e.off("page:changed",this._bound),document.body.classList.remove("ypp-hide-metrics")}_apply(){if(!this.isEnabled)return;const e=window.location.pathname,t=e==="/watch"||e.startsWith("/shorts/"),r=e.startsWith("/@")||e.startsWith("/channel/")||e.startsWith("/c/");if(t||r){document.body.classList.remove("ypp-hide-metrics");return}document.body.classList.add("ypp-hide-metrics")}_injectStyles(){if(document.getElementById("ypp-hide-metrics-css"))return;const e=document.createElement("style");e.id="ypp-hide-metrics-css",e.textContent=`
            body.ypp-hide-metrics ytd-video-meta-block #metadata-line span,
            body.ypp-hide-metrics ytd-video-meta-block #metadata-line .ytd-video-meta-block {
                display: none !important;
            }
            body.ypp-hide-metrics ytd-video-meta-block #metadata-line span:first-child {
                display: inline !important; /* Keep upload date, hide views */
            }
        `,document.head.appendChild(e)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{};class Z extends window.YPP.features.BaseFeature{constructor(){super("KeyboardShortcuts"),this.defaults=Z.DEFAULT_BINDINGS,this.actions={zenMode:{label:Z.ACTION_LABELS.zenMode,fn:()=>this._toggleSetting("zenMode")},focusMode:{label:Z.ACTION_LABELS.focusMode,fn:()=>this._toggleSetting("enableFocusMode")},cinemaMode:{label:Z.ACTION_LABELS.cinemaMode,fn:()=>this._toggleCinema()},snapshot:{label:Z.ACTION_LABELS.snapshot,fn:()=>this._triggerSnapshot()},loop:{label:Z.ACTION_LABELS.loop,fn:()=>this._toggleLoop()},pip:{label:Z.ACTION_LABELS.pip,fn:()=>this._togglePiP()},speedDown:{label:Z.ACTION_LABELS.speedDown,fn:()=>this._adjustSpeed(-.25)},speedUp:{label:Z.ACTION_LABELS.speedUp,fn:()=>this._adjustSpeed(.25)},speedReset:{label:Z.ACTION_LABELS.speedReset,fn:()=>this._adjustSpeed(0,!0)},ambientMode:{label:Z.ACTION_LABELS.ambientMode,fn:()=>this._toggleSetting("ambientMode")}}}getConfigKey(){return"keyboardShortcuts"}async enable(){var t,r,i;await super.enable();const e=[];for(const[n,s]of Object.entries(this.actions)){const o=((t=this.settings)==null?void 0:t[`shortcut_${n}`])??this.defaults[n];o&&e.push({combo:o,callback:()=>{s.fn(),this._showToast(s.label)}})}(r=window.YPP.hotkeysManager)==null||r.register("keyboard-shortcuts",e),(i=this.utils)==null||i.log("Keyboard Shortcuts enabled","SHORTCUTS","debug")}async disable(){var e,t;await super.disable(),(e=window.YPP.hotkeysManager)==null||e.unregister("keyboard-shortcuts"),(t=this.utils)==null||t.log("Keyboard Shortcuts disabled","SHORTCUTS","debug")}async _toggleSetting(e){var i;const t=((i=this.settings)==null?void 0:i[e])||!1,r={[e]:!t};chrome.runtime.sendMessage({action:"UPDATE_SETTINGS_DELTA",delta:r},()=>{var o,a;this.settings={...this.settings,...r};const s={zenMode:"zenMode",enableFocusMode:"focusMode",ambientMode:"ambientMode"}[e];s&&((a=(o=window.YPP.featureManager)==null?void 0:o.features)!=null&&a[s])&&window.YPP.featureManager.features[s].update(this.settings)})}_toggleCinema(){const e=[".ytp-size-button",'button[data-tooltip-target-id="ytp-size-button"]','.ytp-button[data-tooltip-target-id="ytp-size-button"]'];for(const r of e){const i=document.querySelector(r);if(i){i.click();return}}const t=document.querySelector("ytd-watch-flexy");t&&t.toggleAttribute("theater")}_triggerSnapshot(){const e=document.querySelector("video");if(!e)return;const t=document.createElement("canvas");t.width=e.videoWidth,t.height=e.videoHeight,t.getContext("2d").drawImage(e,0,0,t.width,t.height),t.toBlob(i=>{const n=URL.createObjectURL(i),s=document.createElement("a");s.href=n,s.download=`snapshot-${Date.now()}.png`,s.click(),URL.revokeObjectURL(n)})}_toggleLoop(){const e=document.querySelector("video");e&&(e.loop=!e.loop,document.querySelectorAll(".ypp-action-btn").forEach(t=>{t.title==="Loop Video"&&t.classList.toggle("active",e.loop)}))}async _togglePiP(){const e=document.querySelector("video");if(!(!e||!document.pictureInPictureEnabled))try{document.pictureInPictureElement?await document.exitPictureInPicture():await e.requestPictureInPicture()}catch{}}_adjustSpeed(e,t=!1){var o,a;const r=document.querySelector("video");if(!r)return;const i=window.YPP.CONSTANTS,n=((o=i==null?void 0:i.PLAYER)==null?void 0:o.SPEED_MIN)??.1,s=((a=i==null?void 0:i.PLAYER)==null?void 0:a.SPEED_MAX)??5;if(t)r.playbackRate=1;else{const l=Math.round((r.playbackRate+e)*100)/100;r.playbackRate=Math.min(Math.max(l,n),s)}}_showToast(e){var r;(r=document.querySelector(".ypp-shortcut-toast"))==null||r.remove();const t=document.createElement("div");t.className="ypp-shortcut-toast",t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add("show"),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>t.remove(),300)},1800)})}static getBindings(e={}){return Object.keys(Z.DEFAULT_BINDINGS).map(t=>({action:t,label:Z.ACTION_LABELS[t],binding:e[`shortcut_${t}`]??Z.DEFAULT_BINDINGS[t]}))}}Z.DEFAULT_BINDINGS={zenMode:"Shift+Z",focusMode:"Shift+F",cinemaMode:"Shift+C",snapshot:"Shift+S",loop:"Shift+L",pip:"Shift+P",speedDown:"Shift+,",speedUp:"Shift+.",speedReset:"Shift+R",ambientMode:"Shift+M"},Z.ACTION_LABELS={zenMode:"Toggle Zen Mode",focusMode:"Toggle Focus Mode",cinemaMode:"Toggle Cinema / Theater",snapshot:"Take Snapshot",loop:"Toggle Loop",pip:"Toggle Picture-in-Picture",speedDown:"Speed -0.25x",speedUp:"Speed +0.25x",speedReset:"Reset Speed to 1x",ambientMode:"Toggle Ambient Mode"},window.YPP.features.KeyboardShortcuts=Z,window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.DurationFilter=(ve=class extends window.YPP.features.BaseFilterFeature{constructor(){super("DurationFilter"),this._boundProcessVideos=this._processVideos.bind(this),this._startPump=this.utils.debounce(this._startPump.bind(this),500),this._pumpCount=0,this._maxPumps=5,this._pumpResetTimer=null}getConfigKey(){return"hideShortVideos"}async enable(){await super.enable(),this._applyFilter(),this.observer.register("duration-filter",ve.SELECTORS.CARDS,this._boundProcessVideos)}async disable(){await super.disable(),this.observer.unregister("duration-filter"),this._cleanupDOM()}async onUpdate(){this._applyFilter()}_cleanupDOM(){this._unhideAll(),document.querySelectorAll("[data-ypp-duration-filtered]").forEach(e=>{delete e.dataset.yppDurationFiltered})}_applyFilter(){var t,r;if(!((t=this.settings)!=null&&t.hideShortVideos)){this._cleanupDOM();return}const e=String(parseInt(((r=this.settings)==null?void 0:r.minVideoDuration)||5,10));document.querySelectorAll(`[data-ypp-duration-filtered]:not([data-ypp-duration-filtered="${e}"])`).forEach(i=>{delete i.dataset.yppDurationFiltered}),this._processVideos(document.querySelectorAll(ve.SELECTORS.CARDS))}_parseMinutes(e){if(!e)return 0;if(/\b(live|premiere|upcoming|scheduled)\b/i.test(e))return 1/0;const t=e.trim().split(":").reverse();if(t.length<2)return 0;let r=0;return t[1]&&(r+=parseInt(t[1],10)),t[2]&&(r+=parseInt(t[2],10)*60),r}_processVideos(e){var s,o;if(!this.isEnabled||!((s=this.settings)!=null&&s.hideShortVideos)||!this._shouldRunOnCurrentPage())return;const t=parseInt(((o=this.settings)==null?void 0:o.minVideoDuration)||5,10),r=String(t);let i=0;(Array.isArray(e)||e instanceof NodeList?e:[e]).forEach(a=>{try{if(!a||!a.querySelector||a.dataset.yppDurationFiltered===r||(a.dataset.yppDurationFiltered=r,a.querySelector(ve.SELECTORS.SHORTS_LINK)||a.tagName.toLowerCase()==="ytd-reel-item-renderer"||a.closest("ytd-reel-shelf-renderer")!==null||a.closest("ytd-shorts")!==null))return;const d=a.querySelector(ve.SELECTORS.DURATION_BADGE);if(!d)return;const p=d.textContent||d.innerText;if(!p||!p.includes(":"))return;this._parseMinutes(p)<t?a.classList.contains("ypp-hidden")||(this._hideElement(a,"duration"),i++):this._unhideElement(a)}catch(l){this.utils.log(l.message,"DURATION","error")}}),i>0&&this._startPump()}_startPump(){var e;if((e=this.settings)!=null&&e.hideShortVideos){if(this._pumpCount>=this._maxPumps){this.utils.log("Max scroll pumps reached. Stopping to prevent loop.","DURATION","warn");return}this._pumpCount++,window.dispatchEvent(new Event("scroll")),this.utils.log("Triggered scroll pump to load more videos.","DURATION","debug"),clearTimeout(this._pumpResetTimer),this._pumpResetTimer=setTimeout(()=>{this._pumpCount=0},5e3)}}},G(ve,"SELECTORS",{CARDS:"ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer, ytd-compact-video-renderer",SHORTS_LINK:'a[href*="/shorts/"]',DURATION_BADGE:"ytd-thumbnail-overlay-time-status-renderer span#text, ytd-badge-supported-renderer span"}),ve),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.BlocklistFilter=class extends window.YPP.features.BaseFilterFeature{constructor(){super("BlocklistFilter"),this.blockedChannels=[],this.blockedKeywords=[]}getConfigKey(){return"blockedChannels"}async enable(){var t;if(!this.settings||(this.blockedChannels=this._parseList(this.settings.blockedChannels),this.blockedKeywords=this._parseList(this.settings.blockedKeywords),this.blockedChannels.length===0&&this.blockedKeywords.length===0))return;(t=this.utils)==null||t.log(`Enabled with ${this.blockedChannels.length} channels, ${this.blockedKeywords.length} keywords blocked.`,"BLOCKLIST","debug"),window.YPP.sharedObserver&&(window.YPP.sharedObserver.register("blocklist-home","ytd-rich-item-renderer",r=>this._processItems(r)),window.YPP.sharedObserver.register("blocklist-search","ytd-video-renderer",r=>this._processItems(r)),window.YPP.sharedObserver.register("blocklist-related","ytd-compact-video-renderer",r=>this._processItems(r)));const e=document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer");e.length&&this._processItems(Array.from(e))}async disable(){await super.disable(),window.YPP.sharedObserver&&(window.YPP.sharedObserver.unregister("blocklist-home"),window.YPP.sharedObserver.unregister("blocklist-search"),window.YPP.sharedObserver.unregister("blocklist-related"))}_parseList(e){return!e||typeof e!="string"?[]:e.split(",").map(t=>t.trim().toLowerCase()).filter(t=>t.length>0)}_processItems(e){var r,i,n,s;if(!this.isEnabled||!this._shouldRunOnCurrentPage())return;let t=0;for(const o of e){if(o.hasAttribute("data-ypp-blocked")||o.classList.contains("ypp-hidden"))continue;const a=o.querySelector("#video-title"),l=o.querySelector("#channel-name .yt-simple-endpoint, #text-container.ytd-channel-name"),d=a?a.textContent.trim().toLowerCase():"",p=l?l.textContent.trim().toLowerCase():"";let u=!1;for(const h of this.blockedKeywords)if(new RegExp(`\\b${h.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\$&")}\\b`,"i").test(d)){u=!0;break}if(!u){for(const h of this.blockedChannels)if(p===h||p===`@${h}`){u=!0;break}}u&&(o.setAttribute("data-ypp-blocked","true"),this._hideElement(o,"blocklist"),t++,(r=this.utils)==null||r.log(`Blocked video: "${d}" by "${p}"`,"BLOCKLIST","debug"))}t>0&&((i=this.settings)==null?void 0:i.showBlocklistFeedback)!==!1&&((s=(n=this.utils)==null?void 0:n.createToast)==null||s.call(n,`${t} video(s) hidden by blocklist`))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.FeedFilter=(Ae=class extends window.YPP.features.BaseFilterFeature{constructor(){super("FeedFilter"),this._allowedPages=["/","/index","/feed/subscriptions","/results"],this._boundProcessMutations=this._processMutations.bind(this)}getConfigKey(){return"feedFilter"}async enable(){await super.enable(),this._processCards(),this.onBusEvent("app:pageChange",()=>{this._processCards()}),window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.register("feed-filter-cards",Ae.CARD_SELECTORS,this._boundProcessMutations,!0,!0)}async disable(){await super.disable(),window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("feed-filter-cards")}async onUpdate(){this._unhideAll(),this._processCards()}_processMutations(e){!this.isEnabled||!this._shouldRunOnCurrentPage()||e.forEach(t=>this._evaluateCard(t))}_processCards(){if(!this.isEnabled||!this._shouldRunOnCurrentPage())return;document.querySelectorAll(Ae.CARD_SELECTORS).forEach(t=>this._evaluateCard(t))}_evaluateCard(e){var a,l,d,p;if(!e||!e.isConnected)return;const t=(a=this.settings)==null?void 0:a.hideLiveStreams,r=(l=this.settings)==null?void 0:l.hideUpcoming,i=(d=this.settings)==null?void 0:d.hidePosts,s=(((p=this.settings)==null?void 0:p.feedFilterKeywords)||"").split(",").map(u=>u.trim().toLowerCase()).filter(u=>u.length>0),o=e.tagName.toLowerCase().includes("post-renderer")||e.tagName.toLowerCase().includes("post-thread");if(i&&o){this._hideElement(e,"post");return}if(!o){if(t&&(e.querySelector(".badge-style-type-live-now")||e.querySelector("ytd-badge-supported-renderer[is-live]"))){this._hideElement(e,"live stream");return}if(r&&(e.querySelector('[overlay-style="UPCOMING"]')||e.querySelector('.badge-style-type-simple[aria-label*="Premiere"]'))){this._hideElement(e,"upcoming");return}if(s.length>0){const u=e.querySelector("#video-title, #video-title-link");if(u){const h=u.textContent.trim().toLowerCase(),m=s.find(y=>h.includes(y));if(m){this._hideElement(e,`keyword: ${m}`);return}}}}}},G(Ae,"CARD_SELECTORS",["ytd-rich-item-renderer","ytd-video-renderer","ytd-grid-video-renderer","ytd-compact-video-renderer","ytd-post-renderer","ytd-backstage-post-thread-renderer","ytd-shared-post-renderer"].join(",")),Ae),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.FullVideoTitles=class extends window.YPP.features.BaseFeature{constructor(){var e;super("FullVideoTitles"),this.CONSTANTS=window.YPP.CONSTANTS||{},this.CSS_CLASS=((e=this.CONSTANTS.CSS_CLASSES)==null?void 0:e.DISPLAY_FULL_TITLE)||"ypp-full-title"}getConfigKey(){return"displayFullTitle"}async enable(){document.documentElement.classList.add(this.CSS_CLASS),document.body.classList.add(this.CSS_CLASS)}async disable(){document.documentElement.classList.remove(this.CSS_CLASS),document.body.classList.remove(this.CSS_CLASS)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AutoScaleGrid=class extends window.YPP.features.BaseFeature{constructor(){super("AutoScaleGrid"),this.CONSTANTS=window.YPP.CONSTANTS||{},this._boundApplyScale=this._applyScale.bind(this)}getConfigKey(){return"autoScaleLayout"}async enable(){this._applyScale(),this._resizeListener=this.utils.debounce(this._boundApplyScale,150),this.addListener(window,"resize",this._resizeListener),window.dispatchEvent(new Event("resize"))}async disable(){document.documentElement.style.setProperty("--ypp-auto-scale",1),document.documentElement.style.removeProperty("--ypp-dynamic-cols"),this.cleanupEvents(),this._resizeListener=null,window.dispatchEvent(new Event("resize"))}async onUpdate(){this.settings&&this.settings.autoScaleLayout?this._resizeListener?(this._applyScale(),window.dispatchEvent(new Event("resize"))):this.enable():this.disable()}_applyScale(){var n;if(!this.settings||!this.settings.autoScaleLayout)return;const e=window.location.pathname,t=e==="/"||e==="/index",r=window.innerWidth,i=Math.max(.7,Math.min(1.3,r/1280));if(document.documentElement.style.setProperty("--ypp-auto-scale",i),t){if(Number(((n=this.settings)==null?void 0:n.homeColumns)||0)>0){document.documentElement.style.removeProperty("--ypp-dynamic-cols");return}const o=document.querySelector("ytd-rich-grid-renderer");let a=window.innerWidth;o&&o.clientWidth>0&&(a=o.clientWidth);let l=4;a>=2100?l=6:a>=1800?l=5:a>=1400?l=4:a>=1e3?l=3:a>=600?l=2:l=1,document.documentElement.style.setProperty("--ypp-dynamic-cols",l)}else document.documentElement.style.removeProperty("--ypp-dynamic-cols")}onPageChange(){this._applyScale()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.HeaderNav=(ue=class extends window.YPP.features.BaseFeature{constructor(){super("HeaderNav"),this._currentUrl=window.location.pathname+window.location.search,this._boundHandleNavigate=this._handleNavigate.bind(this),this._domObserver=window.YPP.sharedObserver}getConfigKey(){return"headerNavEnabled"}async enable(){var r;const e=this.settings||{};if(e.navShorts||e.navSubscriptions||e.navWatchLater||e.navPlaylists||e.navHistory)try{this._applySidebarState(),this._observeHeader()}catch(i){(r=this.utils)==null||r.log("Error enabling HeaderNav","HEADERNAV","error",i)}}async disable(){var e;document.body.classList.remove("ypp-header-nav-active"),this._domObserver&&this._domObserver.unregister("header-nav-end"),(e=window.YPP.ui)!=null&&e.manager&&window.YPP.ui.manager.remove("header-nav-group"),this._domObserver&&this._domObserver.unregister("header-nav-masthead"),this._observeTimeout&&clearTimeout(this._observeTimeout),this._injectTimeout&&clearTimeout(this._injectTimeout),await super.disable()}async onUpdate(){var r;const e=this.settings||{},t=e.navShorts||e.navSubscriptions||e.navWatchLater||e.navPlaylists||e.navHistory||e.navTrending;(r=window.YPP.ui)!=null&&r.manager&&window.YPP.ui.manager.remove("header-nav-group"),this.navGroup=null,t&&this._scheduleInjection()}_applySidebarState(){document.body.classList.add("ypp-header-nav-active")}_observeHeader(){if(!this._domObserver)return;this._domObserver.start(),this._scheduleInjection(),this.addListener(window,"yt-navigate-finish",this._boundHandleNavigate);const e=this.utils.debounce(()=>{const t=document.querySelector('[data-ypp-id="header-nav-group"]');(!t||!t.isConnected)&&this._scheduleInjection()},300);this._domObserver.register("header-nav-masthead","ytd-masthead",e,!0)}_handleNavigate(){this._currentUrl=window.location.pathname+window.location.search,this._updateActiveStates(),this._scheduleInjection()}_scheduleInjection(e=0){requestAnimationFrame(()=>{!this._injectButtons()&&e<10&&(this._injectTimeout=setTimeout(()=>this._scheduleInjection(e+1),200))})}_injectButtons(){var i,n,s,o;const e=this.settings||{},r=[{setting:"navSubscriptions",label:"Subscriptions",url:"/feed/subscriptions",icon:ue.ICONS.Subscriptions},{setting:"navShorts",label:"Shorts",url:"/shorts",icon:ue.ICONS.Shorts},{setting:"navWatchLater",label:"Watch Later",url:"/playlist?list=WL",icon:ue.ICONS.WatchLater},{setting:"navPlaylists",label:"Playlists",url:"/feed/playlists",icon:ue.ICONS.Playlists},{setting:"navHistory",label:"History",url:"/feed/history",icon:ue.ICONS.History}].filter(a=>e[a.setting]);return r.length===0?!0:this.navGroup&&document.contains(this.navGroup)?(this._updateActiveStates(),!0):!((i=window.YPP.ui)!=null&&i.manager)||!((s=(n=window.YPP.ui)==null?void 0:n.components)!=null&&s.createButton)?((o=this.utils)==null||o.log("UIManager or button factory not ready yet","HEADERNAV","warn"),!1):(this.navGroup||(this.navGroup=document.createElement("div"),this.navGroup.className="ypp-nav-group",this.navGroup.dataset.yppId="header-nav-group",r.forEach(a=>{this._createButton(this.navGroup,a.label,a.url,a.icon,a.setting)})),window.YPP.ui.manager.mount("headerRight",{id:"header-nav-group",el:this.navGroup},"prepend"),document.contains(this.navGroup)?(this._updateActiveStates(),!0):!1)}_createButton(e,t,r,i,n){const s=a=>{a.preventDefault(),a.stopPropagation(),r.includes("?")?this._navigateTo(r):this._isCurrentPage(r)||this._navigateTo(r)},o=window.YPP.ui.components.createButton({id:`nav-${n}`,icon:`<svg viewBox="0 0 24 24" class="ypp-nav-icon" style="pointer-events:none;display:block;width:24px;height:24px;">${i}</svg>`,tooltip:t,onClick:s,className:"ypp-nav-btn"});o.el.dataset.url=r,o.el.setAttribute("tabindex","0"),o.el.setAttribute("role","button"),this.addListener(o.el,"keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),s(a))}),e.appendChild(o.el)}_isCurrentPage(e){const t=window.location.pathname,r=window.location.search;if(e==="/shorts")return t.startsWith("/shorts/");if(e.includes("?")){const[i,n]=e.split("?");return t===i&&r===`?${n}`}return t===e||t===e+"/"}_navigateTo(e){const t=document.createElement("a");t.href=e,t.style.display="none",document.body.appendChild(t),t.click(),t.remove()}_updateActiveStates(){document.querySelectorAll(".ypp-nav-btn").forEach(e=>{const t=e.dataset.url,r=this._isCurrentPage(t);e.classList.toggle("active",r),e.setAttribute("aria-pressed",String(r))})}},G(ue,"ICONS",{Subscriptions:'<rect x="2" y="6" width="20" height="12" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></rect><polygon points="10 9 15 12 10 15 10 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polygon>',Shorts:'<rect x="5" y="2" width="14" height="20" rx="3" ry="3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></rect><polygon points="10 9 14 12 10 15 10 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polygon>',WatchLater:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></circle><polyline points="12 7 12 12 15 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline>',Playlists:'<line x1="12" y1="12" x2="20" y2="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></line><line x1="16" y1="6" x2="20" y2="6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></line><line x1="12" y1="18" x2="20" y2="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></line><polygon points="4 6 8 8.5 4 11 4 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polygon>',History:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 3v5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 7v5l4 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>',Library:'<path d="M4 22H20C21.1 22 22 21.1 22 20V8C22 6.9 21.1 6 20 6H12L10 4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22ZM4 8H20V20H4V8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>'}),ue),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.Layout=(se=class extends window.YPP.features.BaseFeature{constructor(){super("GridLayoutManager"),this.CONSTANTS=window.YPP.CONSTANTS||{},this._initState()}_initState(){this._rafId=null,this._retryCount=0,this._processedContainers=new WeakSet,this._boundApplyLayout=this.applyGridLayout.bind(this)}getConfigKey(){return null}async enable(){var e,t,r,i;await super.enable();try{this.settings&&this.updateSettings(this.settings),this._retryCount=0,(t=(e=this.utils).log)==null||t.call(e,"Initializing grid layout...","LAYOUT"),await this.waitForElement(se.SELECTORS.GRID_RENDERER,1e4)&&this.applyGridLayout(),this.startObserver(),this.addResizeListener()}catch(n){(i=(r=this.utils).log)==null||i.call(r,"Error enabling grid layout","LAYOUT","error",n)}}async disable(){var e,t;await super.disable(),this._cleanup(),(t=(e=this.utils).log)==null||t.call(e,"Grid Layout Disabled","LAYOUT")}async onUpdate(){this.settings&&(this.updateSettings(this.settings),this._processedContainers=new WeakSet,this._debouncedApply())}updateSettings(e){if(!e)return;const t=document.documentElement,r=Number(e.homeColumns||0);r>0?(t.style.setProperty("--ypp-home-columns",r),t.style.setProperty("--ypp-active-columns",r)):(t.style.removeProperty("--ypp-home-columns"),t.style.removeProperty("--ypp-active-columns"));const i=Number(e.searchColumns||0);i>0?t.style.setProperty("--ypp-search-columns",i):t.style.removeProperty("--ypp-search-columns");const n=Number(e.subscriptionsColumns||0);n>0?t.style.setProperty("--ypp-subscriptions-columns",n):t.style.removeProperty("--ypp-subscriptions-columns");const s=Number(e.channelColumns||0);s>0?t.style.setProperty("--ypp-channel-columns",s):t.style.removeProperty("--ypp-channel-columns");const o=Number(e.historyColumns||0);o>0?t.style.setProperty("--ypp-history-columns",o):t.style.removeProperty("--ypp-history-columns")}startObserver(){var e,t;this.observer.register("layout-manager","ytd-rich-grid-renderer, ytd-rich-item-renderer, ytd-continuation-item-renderer",()=>this._debouncedApply(),!1),(t=(e=this.utils).log)==null||t.call(e,"Observer started via DOMObserver","LAYOUT","debug")}_debouncedApply(){this._rafId&&cancelAnimationFrame(this._rafId),this._rafId=requestAnimationFrame(()=>{this.applyGridLayout(),this._rafId=null})}addResizeListener(){const e=()=>this.applyGridLayout(),t=this.utils.debounce(e,se.CONFIG.DEBOUNCE_DELAY);this.addListener(window,"resize",t)}applyGridLayout(){var o,a,l,d,p,u,h,m,y;if(!this._isValidPage(window.location.pathname))return!1;if(document.body.classList.contains("cinematic-home")||document.body.classList.contains("cinematic"))return this._cleanup(),!1;const e=document.querySelector(se.SELECTORS.GRID_RENDERER);if(!e)return!1;const t=e.querySelector(se.SELECTORS.GRID_CONTENTS);if(!t)return!1;const r=window.location.pathname;let i;if(r.startsWith("/@")||r.startsWith("/channel")||r.startsWith("/c/"))i=Number(((o=this.settings)==null?void 0:o.channelColumns)||4);else if(r.startsWith("/results"))i=Number(((a=this.settings)==null?void 0:a.searchColumns)||4);else if(r==="/feed/subscriptions")i=Number(((l=this.settings)==null?void 0:l.subscriptionsColumns)||4);else if(r==="/feed/history")i=Number(((d=this.settings)==null?void 0:d.historyColumns)||4);else{const v=Number(((p=this.settings)==null?void 0:p.homeColumns)||0);if(v>0)i=v;else{const b=document.documentElement.style.getPropertyValue("--ypp-dynamic-cols");i=b?parseInt(b,10):4}}return(h=(u=this.utils).log)==null||h.call(u,"applyGridLayout cols="+i+" path="+r,"LAYOUT"),!i||i===0?(t.classList.remove("ypp-grid-container"),t.style.removeProperty("grid-template-columns"),t.style.removeProperty("grid-auto-flow"),t.removeAttribute("data-ypp-cols"),this._processedContainers.delete(t),!0):(t.querySelectorAll(se.SELECTORS.GRID_ITEMS).forEach(v=>{if(v.parentElement&&v.parentElement.closest(".ypp-grid-item")){v.classList.remove("ypp-grid-item");return}v.classList.contains("ypp-grid-item")||v.classList.add("ypp-grid-item")}),this._processedContainers.has(t)?((parseInt(t.getAttribute("data-ypp-cols"),10)!==i||!t.style.gridTemplateColumns)&&(t.setAttribute("data-ypp-cols",i),t.style.setProperty("grid-template-columns",`repeat(${i}, minmax(0, 1fr))`,"important"),t.style.setProperty("grid-auto-flow","dense","important"),Number(((m=this.settings)==null?void 0:m.homeColumns)||0)>0?(document.documentElement.style.setProperty("--ypp-active-columns",i),document.documentElement.style.removeProperty("--ypp-dynamic-cols")):document.documentElement.style.removeProperty("--ypp-active-columns"),document.documentElement.style.setProperty("--ypp-grid-column-min",`${Math.floor(100/i)}vw`)),!0):(t.classList.add("ypp-grid-container"),t.setAttribute("data-ypp-cols",i),t.style.setProperty("grid-template-columns",`repeat(${i}, minmax(0, 1fr))`,"important"),t.style.setProperty("grid-auto-flow","dense","important"),Number(((y=this.settings)==null?void 0:y.homeColumns)||0)>0?(document.documentElement.style.setProperty("--ypp-active-columns",i),document.documentElement.style.removeProperty("--ypp-dynamic-cols")):document.documentElement.style.removeProperty("--ypp-active-columns"),document.documentElement.style.setProperty("--ypp-grid-column-min",`${Math.floor(100/i)}vw`),this._processedContainers.add(t),!0))}_isValidPage(e){return e==="/"||e==="/index"||e.startsWith("/channel")||e.startsWith("/c/")||e.startsWith("/@")||e==="/feed/subscriptions"||e==="/feed/history"||e.startsWith("/results")}_cleanup(){var i,n;this.observer&&this.observer.unregister("layout-manager"),this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=null),this._processedContainers=new WeakSet,document.querySelectorAll(".ypp-grid-container, #contents[data-ypp-cols]").forEach(s=>{s.classList.remove("ypp-grid-container"),s.removeAttribute("data-ypp-cols"),s.style.removeProperty("grid-template-columns"),s.style.removeProperty("grid-auto-flow")}),document.querySelectorAll(".ypp-grid-item").forEach(s=>s.classList.remove("ypp-grid-item")),document.querySelectorAll(se.SELECTORS.GRID_ROWS).forEach(s=>{s.style.display=""}),(n=(i=this.utils).log)==null||n.call(i,"Cleanup complete","LAYOUT","debug")}},G(se,"CONFIG",{MAX_RETRIES:5,BASE_RETRY_DELAY:500,RETRY_BACKOFF_FACTOR:1.5,DEBOUNCE_DELAY:150,OBSERVER_THROTTLE:100}),G(se,"SELECTORS",{APP_CONTAINER:"ytd-app",GRID_RENDERER:"ytd-rich-grid-renderer, yt-rich-grid-renderer, yt-rich-grid-view-model",GRID_CONTENTS:"#contents",GRID_ITEMS:"ytd-rich-item-renderer, ytd-rich-grid-media, yt-lockup-view-model, yt-rich-item-view-model",GRID_ROWS:"ytd-rich-grid-row"}),se),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.HomeOrganizer=class extends window.YPP.features.BaseFeature{getConfigKey(){return"hideFeed"}constructor(){super("HomeOrganizer"),this.CONSTANTS=window.YPP.CONSTANTS,this.Utils=window.YPP.Utils,this.domObserver=this.observer||window.YPP.sharedObserver||new window.YPP.Utils.DOMObserver,this.channelTags={},this.folders={},this.isActive=!1}async run(e){this.settings={...this.settings,...e},e.hideFeed?this.disable():await this.enable()}async enable(){this.isActive||(this.isActive=!0,this.Utils.log("Home Organizer Enabled","HOME"),await this.loadTags(),this.domObserver.start(),this.domObserver.register("home-grid",this.CONSTANTS.SELECTORS.GRID_CONTENTS,()=>{this.organizeFeed()}),this.delegator&&this.delegator.register("home-organizer:tag-click",(e,t,r)=>{this.handleTagClick(e,r,t)}),this.organizeFeed(),this._boundClickListener=e=>{const t=e.target;t&&!t.closest(".ypp-tag-btn")&&!t.closest(".ypp-tag-popover")&&this.removePopover()},this.addListener(document,"click",this._boundClickListener))}async disable(){await super.disable(),this.isActive&&(this.isActive=!1,this.domObserver.unregister("home-grid"),this.delegator&&this.delegator.unregister("home-organizer:tag-click"),document.querySelectorAll(".ypp-tag-btn").forEach(e=>e.remove()),document.querySelectorAll(".ypp-feed-separator").forEach(e=>e.remove()),this.removePopover(),document.querySelectorAll(`[data-ypp-processed-${this.name}]`).forEach(e=>{e.removeAttribute(`data-ypp-processed-${this.name}`),e.classList.remove("ypp-priority-low")}),document.querySelectorAll("ytd-rich-shelf-renderer[data-ypp-processed], ytd-reel-shelf-renderer[data-ypp-processed]").forEach(e=>{e.removeAttribute("data-ypp-processed"),e.classList.remove("ypp-priority-low")}),this.Utils.log("Home Organizer Disabled","HOME"))}onPageChange(e){this.isActive&&(this.removePopover(),this.organizeFeed())}async loadTags(){try{const e=await window.YPP.StorageManager.get("ypp_subscription_folders");this.folders=e||{},this.channelTags={};for(const[t,r]of Object.entries(this.folders))for(const i of r)this.channelTags[i]||(this.channelTags[i]=[]),this.channelTags[i].includes(t)||this.channelTags[i].push(t)}catch(e){this.Utils.log(`Failed to load tags from Subscription Folders: ${e.message}`,"HOME","error")}}async toggleFolderForChannel(e,t){this.folders[t]||(this.folders[t]=[]);const r=this.folders[t].indexOf(e);let i=!1;r>-1?this.folders[t].splice(r,1):(this.folders[t].push(e),i=!0);try{await window.YPP.StorageManager.set("ypp_subscription_folders",this.folders),this.Utils.createToast(i?`Added to ${t}`:`Removed from ${t}`),await this.loadTags(),this.refreshAllTagButtons()}catch(n){this.Utils.log(`Failed to update folder assignment: ${n.message}`,"HOME","error"),this.Utils.createToast("Failed to update folder","error")}}refreshAllTagButtons(){document.querySelectorAll("ytd-rich-item-renderer").forEach(t=>{var n,s;const r=(s=(n=t.querySelector("#text.ytd-channel-name"))==null?void 0:n.textContent)==null?void 0:s.trim(),i=t.querySelector(".ypp-tag-btn");if(i&&r){const o=this.channelTags[r];o&&o.length>0?(i.classList.add("tagged"),i.innerHTML=o[0][0]):(i.classList.remove("tagged"),i.innerHTML="#")}})}organizeFeed(){if(!this.isActive)return;const e=document.querySelector(this.CONSTANTS.SELECTORS.GRID_CONTENTS);e&&this._processGridItems(e)}_processGridItems(e){["ytd-rich-shelf-renderer[is-shorts]","ytd-reel-shelf-renderer"].forEach(i=>{e.querySelectorAll(i).forEach(n=>{n.hasAttribute("data-ypp-processed")||(n.setAttribute("data-ypp-processed","true"),n.classList.add("ypp-priority-low"))})}),e.querySelectorAll("ytd-rich-item-renderer").forEach(i=>{var a,l;const n=i,s=n.querySelector("a#video-title"),o=s?s.getAttribute("href"):"unknown";if(!this.isProcessed(n,o,d=>{d.classList.remove("ypp-priority-low");const p=d.querySelector(".ypp-tag-btn");p&&p.remove()})&&(n.querySelector('a[href^="/shorts/"]')&&n.classList.add("ypp-priority-low"),n.style.display!=="none"&&!n.querySelector(".ypp-tag-btn"))){const d=n.querySelector("ytd-thumbnail");if(d){const p=document.createElement("button");p.className="ypp-tag-btn",p.innerHTML="#",p.title="Tag Channel";const u=((l=(a=n.querySelector("#text.ytd-channel-name"))==null?void 0:a.textContent)==null?void 0:l.trim())||"";if(u&&this.channelTags[u]){const h=this.channelTags[u];h&&h.length>0&&(p.classList.add("tagged"),p.innerHTML=h[0][0])}p.setAttribute("data-ypp-action","home-organizer:tag-click"),p.setAttribute("data-ypp-payload",u),d.appendChild(p)}}})}handleTagClick(e,t,r){if(this.removePopover(),!t)return;const i=document.createElement("div");i.className="ypp-tag-popover";const n=Object.keys(this.folders);if(n.length===0){const o=document.createElement("div");o.className="ypp-tag-option",o.textContent="No Subfolders created yet",o.style.fontStyle="italic",o.style.cursor="default",i.appendChild(o)}else n.forEach(o=>{const a=document.createElement("div");a.className="ypp-tag-option";const l=this.channelTags[t]&&this.channelTags[t].includes(o);a.innerHTML=l?`<strong style="color:var(--ypp-accent)">✓</strong> ${o}`:o,a.onclick=async()=>{await this.toggleFolderForChannel(t,o),this.removePopover()},i.appendChild(a)});const s=r.getBoundingClientRect();i.style.position="fixed",i.style.top=`${s.bottom+8}px`,i.style.left=`${s.left}px`,document.body.appendChild(i)}removePopover(){const e=document.querySelector(".ypp-tag-popover");e&&e.remove()}toggleSection(e){e.classList.toggle("collapsed");const t=e.classList.contains("collapsed");let r=e.nextElementSibling;for(;r&&!r.classList.contains("ypp-feed-separator");)t?r.classList.add("ypp-section-hidden"):r.classList.remove("ypp-section-hidden"),r=r.nextElementSibling}createSeparator(e,t=""){const r=document.createElement("div");return r.className=`ypp-feed-separator ${t}`,r.textContent=e,r}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.HideShorts=class extends window.YPP.features.BaseFeature{constructor(){super("HideShorts"),this.handleShortsAdded=this.handleShortsAdded.bind(this),this._isMonitoringShorts=!1,this._styleId="ypp-hide-shorts-style"}getConfigKey(){return null}async enable(){await super.enable(),this.applySettings()}async disable(){await super.disable(),this._cleanupDOM(),this.stopShortsMonitoring()}onUpdate(){this.applySettings()}applySettings(){document.body.classList.toggle("ypp-hide-shorts",!!this.settings.hideShorts),document.body.classList.toggle("ypp-hide-search-shorts",!!this.settings.hideSearchShorts),this._injectStyles(),this.settings.hideShorts||this.settings.hideSearchShorts?(this.removeShortsFromDOM(),this.startShortsMonitoring()):(this._cleanupDOM(),this.stopShortsMonitoring())}_injectStyles(){let e=document.getElementById(this._styleId);if(!this.settings.hideShorts&&!this.settings.hideSearchShorts){e&&e.remove();return}e||(e=document.createElement("style"),e.id=this._styleId,document.head.appendChild(e));let t="";this.settings.hideShorts&&(t+=`
                ytd-reel-shelf-renderer,
                ytd-rich-shelf-renderer[is-shorts],
                ytd-rich-section-renderer[is-shorts],
                ytd-shelf-renderer[is-shorts],
                ytm-reel-shelf-renderer,
                grid-shelf-view-model,
                ytd-reel-item-renderer,
                ytd-rich-item-renderer:has(a[href*="/shorts/"]),
                ytd-video-renderer:has(a[href*="/shorts/"]):not([is-search]),
                ytd-grid-video-renderer:has(a[href*="/shorts/"]),
                ytd-compact-video-renderer:has(a[href*="/shorts/"]),
                ytd-playlist-video-renderer:has(a[href*="/shorts/"]),
                ytd-guide-entry-renderer:has(a[title="Shorts"]),
                ytd-mini-guide-entry-renderer:has(a[title="Shorts"]),
                tp-yt-paper-tab[aria-label="Shorts"],
                yt-tab-shape[tab-title="Shorts"],
                #related ytd-reel-shelf-renderer,
                ytd-watch-next-secondary-results-renderer ytd-reel-shelf-renderer,
                [data-ypp-is-short="true"] {
                    display: none !important;
                }
            `),this.settings.hideSearchShorts&&(t+=`
                ytd-video-renderer[is-search]:has(a[href*="/shorts/"]),
                ytd-search ytd-reel-shelf-renderer {
                    display: none !important;
                }
            `),e.textContent=t}_cleanupDOM(){const e=document.getElementById(this._styleId);e&&e.remove(),document.body.classList.remove("ypp-hide-shorts","ypp-hide-search-shorts"),document.querySelectorAll("[data-ypp-is-short]").forEach(t=>t.removeAttribute("data-ypp-is-short"))}removeShortsFromDOM(){var r,i;const e=["ytd-reel-shelf-renderer","ytd-rich-shelf-renderer[is-shorts]","ytd-rich-section-renderer[is-shorts]","ytd-shelf-renderer[is-shorts]","ytm-reel-shelf-renderer","grid-shelf-view-model","ytd-reel-item-renderer",'ytd-rich-item-renderer:has(a[href*="/shorts/"])','ytd-grid-video-renderer:has(a[href*="/shorts/"])','ytd-compact-video-renderer:has(a[href*="/shorts/"])','ytd-playlist-video-renderer:has(a[href*="/shorts/"])','ytd-guide-entry-renderer:has(a[title="Shorts"])','ytd-mini-guide-entry-renderer:has(a[title="Shorts"])','tp-yt-paper-tab[aria-label="Shorts"]','yt-tab-shape[tab-title="Shorts"]',"#related ytd-reel-shelf-renderer","ytd-watch-next-secondary-results-renderer ytd-reel-shelf-renderer"];let t=0;try{const n=e.join(", ");document.querySelectorAll(n).forEach(o=>{this._isShortsElement(o)&&(o.hasAttribute("data-ypp-is-short")||(o.setAttribute("data-ypp-is-short","true"),t++))}),this.settings.hideSearchShorts&&window.location.pathname==="/results"&&document.querySelectorAll('ytd-video-renderer:has(a[href*="/shorts/"])').forEach(o=>{o.setAttribute("is-search","true")})}catch(n){(r=this.utils)==null||r.log(`Error removing shorts: ${n.message}`,"HideShorts","error")}this._removeShortsChips(),this._removeShortsByHeuristics(),t>0&&((i=this.utils)==null||i.log(`Removed ${t} Shorts elements from DOM`,"HideShorts"))}_isShortsElement(e){var n,s,o;if(!e)return!1;const t=(n=e.tagName)==null?void 0:n.toLowerCase();if(t==="ytd-reel-shelf-renderer"||t.includes("reel")||e.hasAttribute("is-shorts")||e.querySelector('a[href*="/shorts/"]'))return!0;const r=e.getAttribute("aria-label");if(r!=null&&r.toLowerCase().includes("shorts"))return!0;const i=e.querySelector("#title, [title]");return!!((s=i==null?void 0:i.textContent)!=null&&s.toLowerCase().includes("shorts")||(o=i==null?void 0:i.getAttribute("title"))!=null&&o.toLowerCase().includes("shorts"))}_removeShortsChips(){document.querySelectorAll("yt-chip-cloud-chip-renderer").forEach(t=>{const r=t.querySelector("#text");r&&r.innerText.trim()==="Shorts"&&(t.hasAttribute("data-ypp-is-short")||t.setAttribute("data-ypp-is-short","true"))})}_removeShortsByHeuristics(){if(window.location.pathname==="/results")return;document.querySelectorAll("ytd-shelf-renderer, ytd-rich-shelf-renderer").forEach(r=>{this._isShortsElement(r)&&(r.hasAttribute("data-ypp-is-short")||r.setAttribute("data-ypp-is-short","true"))}),document.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer").forEach(r=>{var n;const i=r.querySelector('span[aria-label="Shorts"], ytd-badge-supported-renderer');((i==null?void 0:i.getAttribute("aria-label"))==="Shorts"||((n=i==null?void 0:i.textContent)==null?void 0:n.trim())==="Shorts")&&(r.hasAttribute("data-ypp-is-short")||r.setAttribute("data-ypp-is-short","true"))})}startShortsMonitoring(){var r;if(this._isMonitoringShorts)return;(r=this.utils)==null||r.log("Starting continuous Shorts monitoring via DOMObserver","HideShorts");const t=window.location.pathname==="/results"?"ytd-rich-item-renderer, ytd-reel-shelf-renderer, ytd-rich-shelf-renderer, ytd-guide-entry-renderer, yt-chip-cloud-chip-renderer":"ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-reel-shelf-renderer, ytd-rich-shelf-renderer, ytd-guide-entry-renderer, yt-chip-cloud-chip-renderer";this.observer.register("shorts-monitor",t,this.handleShortsAdded,!1),this._isMonitoringShorts=!0}stopShortsMonitoring(){var e;this._isMonitoringShorts&&(this.observer.unregister("shorts-monitor"),this._isMonitoringShorts=!1,(e=this.utils)==null||e.log("Stopped Shorts monitoring","HideShorts"))}handleShortsAdded(e){var r;if(!e||!Array.isArray(e)||e.length===0){this.removeShortsFromDOM();return}let t=0;e.forEach(i=>{var n;if(i&&(this.settings.hideSearchShorts&&window.location.pathname==="/results"&&((n=i.tagName)==null?void 0:n.toLowerCase())==="ytd-video-renderer"&&i.querySelector('a[href*="/shorts/"]')&&i.setAttribute("is-search","true"),window.location.pathname!=="/results")){if(this._isShortsElement(i)){i.hasAttribute("data-ypp-is-short")||(i.setAttribute("data-ypp-is-short","true"),t++);return}if(i.tagName&&i.tagName.toLowerCase()==="yt-chip-cloud-chip-renderer"){const s=i.querySelector("#text");s&&s.innerText.trim()==="Shorts"&&(i.hasAttribute("data-ypp-is-short")||(i.setAttribute("data-ypp-is-short","true"),t++));return}try{i.querySelectorAll('ytd-reel-shelf-renderer, a[href*="/shorts/"]').length>0&&this._isShortsElement(i)&&(i.hasAttribute("data-ypp-is-short")||(i.setAttribute("data-ypp-is-short","true"),t++))}catch{}}}),t>0&&((r=this.utils)==null||r.log(`Dynamic removal: ${t} Shorts elements`,"HideShorts"))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.RedirectShorts=class extends window.YPP.features.BaseFeature{constructor(){super("RedirectShorts"),this.checkRedirect=this.checkRedirect.bind(this)}getConfigKey(){return"redirectShorts"}async enable(){await super.enable(),this.checkRedirect(),this.addListener(window,"yt-navigate-start",this.checkRedirect)}async disable(){await super.disable()}onPageChange(e){this.isEnabled&&this.checkRedirect()}checkRedirect(){var e,t,r,i;if((e=this.settings)!=null&&e.redirectShorts&&location.pathname.startsWith("/shorts/")){const n=(t=location.pathname.split("/shorts/")[1])==null?void 0:t.split("/")[0];if(n&&/^[a-zA-Z0-9_-]{11}$/.test(n)){(r=this.utils)==null||r.log("Redirecting Short to Watch:",n,"RedirectShorts");const s=`/watch?v=${n}`,o=document.querySelector("ytd-app");o&&typeof o.fire=="function"?o.fire("yt-navigate",{endpoint:{commandMetadata:{webCommandMetadata:{url:s}}}}):location.replace(s)}else n&&((i=this.utils)==null||i.log("Invalid video ID format:",n,"RedirectShorts","warn"))}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.StopShortsLooping=class extends window.YPP.features.BaseFeature{constructor(){super("StopShortsLooping"),this.handleVideoAdded=this.handleVideoAdded.bind(this),this.preventLoop=this.preventLoop.bind(this),this._isMonitoring=!1}getConfigKey(){return"stopShortsLooping"}async enable(){await super.enable(),location.pathname.startsWith("/shorts/")&&this.startMonitoring()}async disable(){await super.disable(),this.stopMonitoring()}onPageChange(e){this.isEnabled&&(e.includes("/shorts/")?this.startMonitoring():this.stopMonitoring())}startMonitoring(){if(this._isMonitoring)return;const e=document.querySelector("ytd-reel-video-renderer[is-active] video");e&&(this.attachToVideo(e),this.preventLoop({target:e})),this.observer.register("shorts-loop-monitor","ytd-reel-video-renderer video",this.handleVideoAdded,!0),this._isMonitoring=!0}stopMonitoring(){this._isMonitoring&&(this.observer.unregister("shorts-loop-monitor"),document.querySelectorAll("video[data-ypp-no-loop]").forEach(e=>{e.removeAttribute("data-ypp-no-loop")}),this._isMonitoring=!1)}handleVideoAdded(e){e&&e.forEach(t=>{this.attachToVideo(t),this.preventLoop({target:t})})}attachToVideo(e){!e||e.hasAttribute("data-ypp-no-loop")||(e.setAttribute("data-ypp-no-loop","true"),this.addListener(e,"play",this.preventLoop))}preventLoop(e){const t=e.target;!t||!t.closest("ytd-reel-video-renderer")||t.loop&&(t.loop=!1,t.removeAttribute("loop"))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ShortsAutoScroll=class extends window.YPP.features.BaseFeature{constructor(){super("ShortsAutoScroll"),this._autoScrollInterval=null,this._isMonitoring=!1,this._lastScrolledVideo=null}getConfigKey(){return"shortsAutoScroll"}async enable(){await super.enable(),location.pathname.startsWith("/shorts/")&&this.startMonitoring()}async disable(){await super.disable(),this.stopMonitoring()}onPageChange(e){this.isEnabled&&(e.includes("/shorts/")?this.startMonitoring():this.stopMonitoring())}startMonitoring(){var e;this._isMonitoring||((e=this.utils)==null||e.log("Starting Shorts Auto-Scroll interval monitoring","AutoScroll"),this._autoScrollInterval=setInterval(()=>{document.hidden||this._checkAndScroll()},200),this._isMonitoring=!0)}stopMonitoring(){var e;this._isMonitoring&&(this._autoScrollInterval&&(clearInterval(this._autoScrollInterval),this._autoScrollInterval=null),this._isMonitoring=!1,this._lastScrolledVideo=null,(e=this.utils)==null||e.log("Stopped Shorts Auto-Scroll monitoring","AutoScroll"))}_checkAndScroll(){var r;const e=document.querySelector("ytd-reel-video-renderer[is-active]");if(!e)return;const t=e.querySelector("video");if(!(!t||isNaN(t.duration)||t.duration===0))if(t.ended||t.currentTime>0&&t.duration>0&&t.duration-t.currentTime<=.1){if(this._lastScrolledVideo===t&&t.currentTime>.5)return;const i=document.querySelector("#navigation-button-down ytd-button-renderer button, .navigation-button.down button");i&&(this._lastScrolledVideo=t,(r=this.utils)==null||r.log("Short ended. Auto-scrolling to next.","AutoScroll","info"),i.click())}else this._lastScrolledVideo&&t!==this._lastScrolledVideo&&t.currentTime<1&&(this._lastScrolledVideo=null)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ShortsVolumeNormalizer=class extends window.YPP.features.BaseFeature{constructor(){super("ShortsVolumeNormalizer"),this.handleVideoAdded=this.handleVideoAdded.bind(this),this.enforceVolume=this.enforceVolume.bind(this),this._isMonitoring=!1,this._defaultVolume=1}getConfigKey(){return"shortsVolumeNormalizer"}async enable(){await super.enable(),this._updateDefaultVolume(),location.pathname.startsWith("/shorts/")&&this.startMonitoring()}async disable(){await super.disable(),this.stopMonitoring()}onPageChange(e){this.isEnabled&&(this._updateDefaultVolume(),e.includes("/shorts/")?this.startMonitoring():this.stopMonitoring())}_updateDefaultVolume(){var e;try{const t=localStorage.getItem("yt-player-volume");if(t){const r=JSON.parse(t),i=JSON.parse(r.data);i&&typeof i.volume=="number"&&(this._defaultVolume=i.volume/100)}}catch{(e=this.utils)==null||e.log("Error reading yt-player-volume from localStorage","VolumeNormalizer","warn")}}startMonitoring(){var t;if(this._isMonitoring)return;(t=this.utils)==null||t.log("Starting Shorts Volume monitoring","VolumeNormalizer");const e=document.querySelector("ytd-reel-video-renderer[is-active] video");e&&(this.attachToVideo(e),this.enforceVolume({target:e})),this.observer.register("shorts-volume-monitor","ytd-reel-video-renderer video",this.handleVideoAdded,!0),this._isMonitoring=!0}stopMonitoring(){var e;this._isMonitoring&&(this.observer.unregister("shorts-volume-monitor"),document.querySelectorAll("video[data-ypp-volume]").forEach(t=>{t.removeAttribute("data-ypp-volume")}),this._isMonitoring=!1,(e=this.utils)==null||e.log("Stopped Shorts Volume monitoring","VolumeNormalizer"))}handleVideoAdded(e){e&&e.forEach(t=>{this.attachToVideo(t),this.enforceVolume({target:t})})}attachToVideo(e){!e||e.hasAttribute("data-ypp-volume")||(e.setAttribute("data-ypp-volume","true"),this.addListener(e,"volumechange",this.enforceVolume),this.addListener(e,"play",this.enforceVolume))}enforceVolume(e){var i;const t=e.target;!t||!t.closest("ytd-reel-video-renderer")||(this._updateDefaultVolume(),Math.abs(t.volume-this._defaultVolume)>.01&&(t.volume=this._defaultVolume,(i=this.utils)==null||i.log(`Enforced Shorts Volume: ${this._defaultVolume}`,"VolumeNormalizer","debug")))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.FolderStorage=class{constructor(){this.STORAGE_KEY="ypp_subscription_folders",this.folders={Favorites:[],Tech:[],Gaming:[]},this.folderConfig={},this.keywordBlacklist=[]}async load(){var e;try{const[t,r,i]=await Promise.all([window.YPP.StorageManager.get(this.STORAGE_KEY),window.YPP.StorageManager.get("ypp_folder_config"),window.YPP.StorageManager.get("ypp_keyword_blacklist")]);t?this.folders=t:await this.save(),this.folderConfig=r||{},this.keywordBlacklist=i||[]}catch{(e=window.YPP.Utils)==null||e.log("Failed to load subscription folders","FolderStorage","error")}}async save(){var e;try{await Promise.all([window.YPP.StorageManager.set(this.STORAGE_KEY,this.folders),window.YPP.StorageManager.set("ypp_folder_config",this.folderConfig),window.YPP.StorageManager.set("ypp_keyword_blacklist",this.keywordBlacklist)])}catch{(e=window.YPP.Utils)==null||e.log("Failed to save subscription folders","FolderStorage","error")}}addFolder(e){return!e||this.folders[e]?!1:(this.folders[e]=[],this.save(),!0)}deleteFolder(e){return this.folders[e]?(delete this.folders[e],this.folderConfig[e]&&delete this.folderConfig[e],this.save(),!0):!1}reorderFolder(e,t){if(!this.folders[e])return!1;const r=Object.keys(this.folders),i=r.indexOf(e);if(i===-1||i===t)return!1;r.splice(i,1),r.splice(t,0,e);const n={};for(const s of r)n[s]=this.folders[s];return this.folders=n,this.save(),!0}addChannelToFolder(e,t){return!this.folders[t]||this.folders[t].includes(e)?!1:(this.folders[t].push(e),this.save(),!0)}removeChannelFromFolder(e,t){if(!this.folders[t])return!1;const r=this.folders[t].indexOf(e);return r===-1?!1:(this.folders[t].splice(r,1),this.save(),!0)}};var pt={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},Ge={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},Sr=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],qe={CSS:{},springs:{}};function ge(c,e,t){return Math.min(Math.max(c,e),t)}function Be(c,e){return c.indexOf(e)>-1}function je(c,e){return c.apply(null,e)}var B={arr:function(c){return Array.isArray(c)},obj:function(c){return Be(Object.prototype.toString.call(c),"Object")},pth:function(c){return B.obj(c)&&c.hasOwnProperty("totalLength")},svg:function(c){return c instanceof SVGElement},inp:function(c){return c instanceof HTMLInputElement},dom:function(c){return c.nodeType||B.svg(c)},str:function(c){return typeof c=="string"},fnc:function(c){return typeof c=="function"},und:function(c){return typeof c>"u"},nil:function(c){return B.und(c)||c===null},hex:function(c){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c)},rgb:function(c){return/^rgb/.test(c)},hsl:function(c){return/^hsl/.test(c)},col:function(c){return B.hex(c)||B.rgb(c)||B.hsl(c)},key:function(c){return!pt.hasOwnProperty(c)&&!Ge.hasOwnProperty(c)&&c!=="targets"&&c!=="keyframes"}};function ut(c){var e=/\(([^)]+)\)/.exec(c);return e?e[1].split(",").map(function(t){return parseFloat(t)}):[]}function ht(c,e){var t=ut(c),r=ge(B.und(t[0])?1:t[0],.1,100),i=ge(B.und(t[1])?100:t[1],.1,100),n=ge(B.und(t[2])?10:t[2],.1,100),s=ge(B.und(t[3])?0:t[3],.1,100),o=Math.sqrt(i/r),a=n/(2*Math.sqrt(i*r)),l=a<1?o*Math.sqrt(1-a*a):0,d=1,p=a<1?(a*o+-s)/l:-s+o;function u(m){var y=e?e*m/1e3:m;return a<1?y=Math.exp(-y*a*o)*(d*Math.cos(l*y)+p*Math.sin(l*y)):y=(d+p*y)*Math.exp(-y*o),m===0||m===1?m:1-y}function h(){var m=qe.springs[c];if(m)return m;for(var y=1/6,v=0,b=0;;)if(v+=y,u(v)===1){if(b++,b>=16)break}else b=0;var f=v*y*1e3;return qe.springs[c]=f,f}return e?u:h}function _r(c){return c===void 0&&(c=10),function(e){return Math.ceil(ge(e,1e-6,1)*c)*(1/c)}}var Cr=function(){var c=11,e=1/(c-1);function t(d,p){return 1-3*p+3*d}function r(d,p){return 3*p-6*d}function i(d){return 3*d}function n(d,p,u){return((t(p,u)*d+r(p,u))*d+i(p))*d}function s(d,p,u){return 3*t(p,u)*d*d+2*r(p,u)*d+i(p)}function o(d,p,u,h,m){var y,v,b=0;do v=p+(u-p)/2,y=n(v,h,m)-d,y>0?u=v:p=v;while(Math.abs(y)>1e-7&&++b<10);return v}function a(d,p,u,h){for(var m=0;m<4;++m){var y=s(p,u,h);if(y===0)return p;var v=n(p,u,h)-d;p-=v/y}return p}function l(d,p,u,h){if(!(0<=d&&d<=1&&0<=u&&u<=1))return;var m=new Float32Array(c);if(d!==p||u!==h)for(var y=0;y<c;++y)m[y]=n(y*e,d,u);function v(b){for(var f=0,g=1,_=c-1;g!==_&&m[g]<=b;++g)f+=e;--g;var P=(b-m[g])/(m[g+1]-m[g]),w=f+P*e,C=s(w,d,u);return C>=.001?a(b,w,d,u):C===0?w:o(b,f,f+e,d,u)}return function(b){return d===p&&u===h||b===0||b===1?b:n(v(b),p,h)}}return l}(),mt=function(){var c={linear:function(){return function(r){return r}}},e={Sine:function(){return function(r){return 1-Math.cos(r*Math.PI/2)}},Expo:function(){return function(r){return r?Math.pow(2,10*r-10):0}},Circ:function(){return function(r){return 1-Math.sqrt(1-r*r)}},Back:function(){return function(r){return r*r*(3*r-2)}},Bounce:function(){return function(r){for(var i,n=4;r<((i=Math.pow(2,--n))-1)/11;);return 1/Math.pow(4,3-n)-7.5625*Math.pow((i*3-2)/22-r,2)}},Elastic:function(r,i){r===void 0&&(r=1),i===void 0&&(i=.5);var n=ge(r,1,10),s=ge(i,.1,2);return function(o){return o===0||o===1?o:-n*Math.pow(2,10*(o-1))*Math.sin((o-1-s/(Math.PI*2)*Math.asin(1/n))*(Math.PI*2)/s)}}},t=["Quad","Cubic","Quart","Quint"];return t.forEach(function(r,i){e[r]=function(){return function(n){return Math.pow(n,i+2)}}}),Object.keys(e).forEach(function(r){var i=e[r];c["easeIn"+r]=i,c["easeOut"+r]=function(n,s){return function(o){return 1-i(n,s)(1-o)}},c["easeInOut"+r]=function(n,s){return function(o){return o<.5?i(n,s)(o*2)/2:1-i(n,s)(o*-2+2)/2}},c["easeOutIn"+r]=function(n,s){return function(o){return o<.5?(1-i(n,s)(1-o*2))/2:(i(n,s)(o*2-1)+1)/2}}}),c}();function We(c,e){if(B.fnc(c))return c;var t=c.split("(")[0],r=mt[t],i=ut(c);switch(t){case"spring":return ht(c,e);case"cubicBezier":return je(Cr,i);case"steps":return je(_r,i);default:return je(r,i)}}function yt(c){try{var e=document.querySelectorAll(c);return e}catch{return}}function Ue(c,e){for(var t=c.length,r=arguments.length>=2?arguments[1]:void 0,i=[],n=0;n<t;n++)if(n in c){var s=c[n];e.call(r,s,n,c)&&i.push(s)}return i}function ze(c){return c.reduce(function(e,t){return e.concat(B.arr(t)?ze(t):t)},[])}function ft(c){return B.arr(c)?c:(B.str(c)&&(c=yt(c)||c),c instanceof NodeList||c instanceof HTMLCollection?[].slice.call(c):[c])}function Ke(c,e){return c.some(function(t){return t===e})}function Qe(c){var e={};for(var t in c)e[t]=c[t];return e}function Xe(c,e){var t=Qe(c);for(var r in c)t[r]=e.hasOwnProperty(r)?e[r]:c[r];return t}function Ve(c,e){var t=Qe(c);for(var r in e)t[r]=B.und(c[r])?e[r]:c[r];return t}function Er(c){var e=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(c);return e?"rgba("+e[1]+",1)":c}function kr(c){var e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,t=c.replace(e,function(o,a,l,d){return a+a+l+l+d+d}),r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t),i=parseInt(r[1],16),n=parseInt(r[2],16),s=parseInt(r[3],16);return"rgba("+i+","+n+","+s+",1)"}function Ar(c){var e=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(c)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(c),t=parseInt(e[1],10)/360,r=parseInt(e[2],10)/100,i=parseInt(e[3],10)/100,n=e[4]||1;function s(u,h,m){return m<0&&(m+=1),m>1&&(m-=1),m<1/6?u+(h-u)*6*m:m<1/2?h:m<2/3?u+(h-u)*(2/3-m)*6:u}var o,a,l;if(r==0)o=a=l=i;else{var d=i<.5?i*(1+r):i+r-i*r,p=2*i-d;o=s(p,d,t+1/3),a=s(p,d,t),l=s(p,d,t-1/3)}return"rgba("+o*255+","+a*255+","+l*255+","+n+")"}function Tr(c){if(B.rgb(c))return Er(c);if(B.hex(c))return kr(c);if(B.hsl(c))return Ar(c)}function Pe(c){var e=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(c);if(e)return e[1]}function Lr(c){if(Be(c,"translate")||c==="perspective")return"px";if(Be(c,"rotate")||Be(c,"skew"))return"deg"}function Ze(c,e){return B.fnc(c)?c(e.target,e.id,e.total):c}function be(c,e){return c.getAttribute(e)}function Je(c,e,t){var r=Pe(e);if(Ke([t,"deg","rad","turn"],r))return e;var i=qe.CSS[e+t];if(!B.und(i))return i;var n=100,s=document.createElement(c.tagName),o=c.parentNode&&c.parentNode!==document?c.parentNode:document.body;o.appendChild(s),s.style.position="absolute",s.style.width=n+t;var a=n/s.offsetWidth;o.removeChild(s);var l=a*parseFloat(e);return qe.CSS[e+t]=l,l}function gt(c,e,t){if(e in c.style){var r=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),i=c.style[e]||getComputedStyle(c).getPropertyValue(r)||"0";return t?Je(c,i,t):i}}function et(c,e){if(B.dom(c)&&!B.inp(c)&&(!B.nil(be(c,e))||B.svg(c)&&c[e]))return"attribute";if(B.dom(c)&&Ke(Sr,e))return"transform";if(B.dom(c)&&e!=="transform"&&gt(c,e))return"css";if(c[e]!=null)return"object"}function bt(c){if(B.dom(c)){for(var e=c.style.transform||"",t=/(\w+)\(([^)]*)\)/g,r=new Map,i;i=t.exec(e);)r.set(i[1],i[2]);return r}}function Mr(c,e,t,r){var i=Be(e,"scale")?1:0+Lr(e),n=bt(c).get(e)||i;return t&&(t.transforms.list.set(e,n),t.transforms.last=e),r?Je(c,n,r):n}function tt(c,e,t,r){switch(et(c,e)){case"transform":return Mr(c,e,r,t);case"css":return gt(c,e,t);case"attribute":return be(c,e);default:return c[e]||0}}function rt(c,e){var t=/^(\*=|\+=|-=)/.exec(c);if(!t)return c;var r=Pe(c)||0,i=parseFloat(e),n=parseFloat(c.replace(t[0],""));switch(t[0][0]){case"+":return i+n+r;case"-":return i-n+r;case"*":return i*n+r}}function vt(c,e){if(B.col(c))return Tr(c);if(/\s/g.test(c))return c;var t=Pe(c),r=t?c.substr(0,c.length-t.length):c;return e?r+e:r}function it(c,e){return Math.sqrt(Math.pow(e.x-c.x,2)+Math.pow(e.y-c.y,2))}function Yr(c){return Math.PI*2*be(c,"r")}function Ir(c){return be(c,"width")*2+be(c,"height")*2}function Fr(c){return it({x:be(c,"x1"),y:be(c,"y1")},{x:be(c,"x2"),y:be(c,"y2")})}function wt(c){for(var e=c.points,t=0,r,i=0;i<e.numberOfItems;i++){var n=e.getItem(i);i>0&&(t+=it(r,n)),r=n}return t}function Or(c){var e=c.points;return wt(c)+it(e.getItem(e.numberOfItems-1),e.getItem(0))}function Pt(c){if(c.getTotalLength)return c.getTotalLength();switch(c.tagName.toLowerCase()){case"circle":return Yr(c);case"rect":return Ir(c);case"line":return Fr(c);case"polyline":return wt(c);case"polygon":return Or(c)}}function Nr(c){var e=Pt(c);return c.setAttribute("stroke-dasharray",e),e}function Rr(c){for(var e=c.parentNode;B.svg(e)&&B.svg(e.parentNode);)e=e.parentNode;return e}function xt(c,e){var t=e||{},r=t.el||Rr(c),i=r.getBoundingClientRect(),n=be(r,"viewBox"),s=i.width,o=i.height,a=t.viewBox||(n?n.split(" "):[0,0,s,o]);return{el:r,viewBox:a,x:a[0]/1,y:a[1]/1,w:s,h:o,vW:a[2],vH:a[3]}}function Br(c,e){var t=B.str(c)?yt(c)[0]:c,r=e||100;return function(i){return{property:i,el:t,svg:xt(t),totalLength:Pt(t)*(r/100)}}}function Dr(c,e,t){function r(d){d===void 0&&(d=0);var p=e+d>=1?e+d:0;return c.el.getPointAtLength(p)}var i=xt(c.el,c.svg),n=r(),s=r(-1),o=r(1),a=t?1:i.w/i.vW,l=t?1:i.h/i.vH;switch(c.property){case"x":return(n.x-i.x)*a;case"y":return(n.y-i.y)*l;case"angle":return Math.atan2(o.y-s.y,o.x-s.x)*180/Math.PI}}function St(c,e){var t=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,r=vt(B.pth(c)?c.totalLength:c,e)+"";return{original:r,numbers:r.match(t)?r.match(t).map(Number):[0],strings:B.str(c)||e?r.split(t):[]}}function nt(c){var e=c?ze(B.arr(c)?c.map(ft):ft(c)):[];return Ue(e,function(t,r,i){return i.indexOf(t)===r})}function _t(c){var e=nt(c);return e.map(function(t,r){return{target:t,id:r,total:e.length,transforms:{list:bt(t)}}})}function qr(c,e){var t=Qe(e);if(/^spring/.test(t.easing)&&(t.duration=ht(t.easing)),B.arr(c)){var r=c.length,i=r===2&&!B.obj(c[0]);i?c={value:c}:B.fnc(e.duration)||(t.duration=e.duration/r)}var n=B.arr(c)?c:[c];return n.map(function(s,o){var a=B.obj(s)&&!B.pth(s)?s:{value:s};return B.und(a.delay)&&(a.delay=o?0:e.delay),B.und(a.endDelay)&&(a.endDelay=o===n.length-1?e.endDelay:0),a}).map(function(s){return Ve(s,t)})}function Ur(c){for(var e=Ue(ze(c.map(function(n){return Object.keys(n)})),function(n){return B.key(n)}).reduce(function(n,s){return n.indexOf(s)<0&&n.push(s),n},[]),t={},r=function(n){var s=e[n];t[s]=c.map(function(o){var a={};for(var l in o)B.key(l)?l==s&&(a.value=o[l]):a[l]=o[l];return a})},i=0;i<e.length;i++)r(i);return t}function zr(c,e){var t=[],r=e.keyframes;r&&(e=Ve(Ur(r),e));for(var i in e)B.key(i)&&t.push({name:i,tweens:qr(e[i],c)});return t}function Vr(c,e){var t={};for(var r in c){var i=Ze(c[r],e);B.arr(i)&&(i=i.map(function(n){return Ze(n,e)}),i.length===1&&(i=i[0])),t[r]=i}return t.duration=parseFloat(t.duration),t.delay=parseFloat(t.delay),t}function Hr(c,e){var t;return c.tweens.map(function(r){var i=Vr(r,e),n=i.value,s=B.arr(n)?n[1]:n,o=Pe(s),a=tt(e.target,c.name,o,e),l=t?t.to.original:a,d=B.arr(n)?n[0]:l,p=Pe(d)||Pe(a),u=o||p;return B.und(s)&&(s=l),i.from=St(d,u),i.to=St(rt(s,d),u),i.start=t?t.end:0,i.end=i.start+i.delay+i.duration+i.endDelay,i.easing=We(i.easing,i.duration),i.isPath=B.pth(n),i.isPathTargetInsideSVG=i.isPath&&B.svg(e.target),i.isColor=B.col(i.from.original),i.isColor&&(i.round=1),t=i,i})}var Ct={css:function(c,e,t){return c.style[e]=t},attribute:function(c,e,t){return c.setAttribute(e,t)},object:function(c,e,t){return c[e]=t},transform:function(c,e,t,r,i){if(r.list.set(e,t),e===r.last||i){var n="";r.list.forEach(function(s,o){n+=o+"("+s+") "}),c.style.transform=n}}};function Et(c,e){var t=_t(c);t.forEach(function(r){for(var i in e){var n=Ze(e[i],r),s=r.target,o=Pe(n),a=tt(s,i,o,r),l=o||Pe(a),d=rt(vt(n,l),a),p=et(s,i);Ct[p](s,i,d,r.transforms,!0)}})}function $r(c,e){var t=et(c.target,e.name);if(t){var r=Hr(e,c),i=r[r.length-1];return{type:t,property:e.name,animatable:c,tweens:r,duration:i.end,delay:r[0].delay,endDelay:i.endDelay}}}function Gr(c,e){return Ue(ze(c.map(function(t){return e.map(function(r){return $r(t,r)})})),function(t){return!B.und(t)})}function kt(c,e){var t=c.length,r=function(n){return n.timelineOffset?n.timelineOffset:0},i={};return i.duration=t?Math.max.apply(Math,c.map(function(n){return r(n)+n.duration})):e.duration,i.delay=t?Math.min.apply(Math,c.map(function(n){return r(n)+n.delay})):e.delay,i.endDelay=t?i.duration-Math.max.apply(Math,c.map(function(n){return r(n)+n.duration-n.endDelay})):e.endDelay,i}var At=0;function jr(c){var e=Xe(pt,c),t=Xe(Ge,c),r=zr(t,c),i=_t(c.targets),n=Gr(i,r),s=kt(n,t),o=At;return At++,Ve(e,{id:o,children:[],animatables:i,animations:n,duration:s.duration,delay:s.delay,endDelay:s.endDelay})}var ce=[],Tt=function(){var c;function e(){!c&&(!Lt()||!H.suspendWhenDocumentHidden)&&ce.length>0&&(c=requestAnimationFrame(t))}function t(i){for(var n=ce.length,s=0;s<n;){var o=ce[s];o.paused?(ce.splice(s,1),n--):(o.tick(i),s++)}c=s>0?requestAnimationFrame(t):void 0}function r(){H.suspendWhenDocumentHidden&&(Lt()?c=cancelAnimationFrame(c):(ce.forEach(function(i){return i._onDocumentVisibility()}),Tt()))}return typeof document<"u"&&document.addEventListener("visibilitychange",r),e}();function Lt(){return!!document&&document.hidden}function H(c){c===void 0&&(c={});var e=0,t=0,r=0,i,n=0,s=null;function o(f){var g=window.Promise&&new Promise(function(_){return s=_});return f.finished=g,g}var a=jr(c);o(a);function l(){var f=a.direction;f!=="alternate"&&(a.direction=f!=="normal"?"normal":"reverse"),a.reversed=!a.reversed,i.forEach(function(g){return g.reversed=a.reversed})}function d(f){return a.reversed?a.duration-f:f}function p(){e=0,t=d(a.currentTime)*(1/H.speed)}function u(f,g){g&&g.seek(f-g.timelineOffset)}function h(f){if(a.reversePlayback)for(var _=n;_--;)u(f,i[_]);else for(var g=0;g<n;g++)u(f,i[g])}function m(f){for(var g=0,_=a.animations,P=_.length;g<P;){var w=_[g],C=w.animatable,x=w.tweens,S=x.length-1,E=x[S];S&&(E=Ue(x,function($){return f<$.end})[0]||E);for(var N=ge(f-E.start-E.delay,0,E.duration)/E.duration,A=isNaN(N)?1:E.easing(N),Y=E.to.strings,O=E.round,F=[],T=E.to.numbers.length,M=void 0,L=0;L<T;L++){var k=void 0,R=E.to.numbers[L],U=E.from.numbers[L]||0;E.isPath?k=Dr(E.value,A*R,E.isPathTargetInsideSVG):k=U+A*(R-U),O&&(E.isColor&&L>2||(k=Math.round(k*O)/O)),F.push(k)}var j=Y.length;if(!j)M=F[0];else{M=Y[0];for(var I=0;I<j;I++){Y[I];var D=Y[I+1],q=F[I];isNaN(q)||(D?M+=q+D:M+=q+" ")}}Ct[w.type](C.target,w.property,M,C.transforms),w.currentValue=M,g++}}function y(f){a[f]&&!a.passThrough&&a[f](a)}function v(){a.remaining&&a.remaining!==!0&&a.remaining--}function b(f){var g=a.duration,_=a.delay,P=g-a.endDelay,w=d(f);a.progress=ge(w/g*100,0,100),a.reversePlayback=w<a.currentTime,i&&h(w),!a.began&&a.currentTime>0&&(a.began=!0,y("begin")),!a.loopBegan&&a.currentTime>0&&(a.loopBegan=!0,y("loopBegin")),w<=_&&a.currentTime!==0&&m(0),(w>=P&&a.currentTime!==g||!g)&&m(g),w>_&&w<P?(a.changeBegan||(a.changeBegan=!0,a.changeCompleted=!1,y("changeBegin")),y("change"),m(w)):a.changeBegan&&(a.changeCompleted=!0,a.changeBegan=!1,y("changeComplete")),a.currentTime=ge(w,0,g),a.began&&y("update"),f>=g&&(t=0,v(),a.remaining?(e=r,y("loopComplete"),a.loopBegan=!1,a.direction==="alternate"&&l()):(a.paused=!0,a.completed||(a.completed=!0,y("loopComplete"),y("complete"),!a.passThrough&&"Promise"in window&&(s(),o(a)))))}return a.reset=function(){var f=a.direction;a.passThrough=!1,a.currentTime=0,a.progress=0,a.paused=!0,a.began=!1,a.loopBegan=!1,a.changeBegan=!1,a.completed=!1,a.changeCompleted=!1,a.reversePlayback=!1,a.reversed=f==="reverse",a.remaining=a.loop,i=a.children,n=i.length;for(var g=n;g--;)a.children[g].reset();(a.reversed&&a.loop!==!0||f==="alternate"&&a.loop===1)&&a.remaining++,m(a.reversed?a.duration:0)},a._onDocumentVisibility=p,a.set=function(f,g){return Et(f,g),a},a.tick=function(f){r=f,e||(e=r),b((r+(t-e))*H.speed)},a.seek=function(f){b(d(f))},a.pause=function(){a.paused=!0,p()},a.play=function(){a.paused&&(a.completed&&a.reset(),a.paused=!1,ce.push(a),p(),Tt())},a.reverse=function(){l(),a.completed=!a.reversed,p()},a.restart=function(){a.reset(),a.play()},a.remove=function(f){var g=nt(f);Yt(g,a)},a.reset(),a.autoplay&&a.play(),a}function Mt(c,e){for(var t=e.length;t--;)Ke(c,e[t].animatable.target)&&e.splice(t,1)}function Yt(c,e){var t=e.animations,r=e.children;Mt(c,t);for(var i=r.length;i--;){var n=r[i],s=n.animations;Mt(c,s),!s.length&&!n.children.length&&r.splice(i,1)}!t.length&&!r.length&&e.pause()}function Wr(c){for(var e=nt(c),t=ce.length;t--;){var r=ce[t];Yt(e,r)}}function Kr(c,e){e===void 0&&(e={});var t=e.direction||"normal",r=e.easing?We(e.easing):null,i=e.grid,n=e.axis,s=e.from||0,o=s==="first",a=s==="center",l=s==="last",d=B.arr(c),p=parseFloat(d?c[0]:c),u=d?parseFloat(c[1]):0,h=Pe(d?c[1]:c)||0,m=e.start||0+(d?p:0),y=[],v=0;return function(b,f,g){if(o&&(s=0),a&&(s=(g-1)/2),l&&(s=g-1),!y.length){for(var _=0;_<g;_++){if(!i)y.push(Math.abs(s-_));else{var P=a?(i[0]-1)/2:s%i[0],w=a?(i[1]-1)/2:Math.floor(s/i[0]),C=_%i[0],x=Math.floor(_/i[0]),S=P-C,E=w-x,N=Math.sqrt(S*S+E*E);n==="x"&&(N=-S),n==="y"&&(N=-E),y.push(N)}v=Math.max.apply(Math,y)}r&&(y=y.map(function(Y){return r(Y/v)*v})),t==="reverse"&&(y=y.map(function(Y){return n?Y<0?Y*-1:-Y:Math.abs(v-Y)}))}var A=d?(u-p)/v:p;return m+A*(Math.round(y[f]*100)/100)+h}}function Qr(c){c===void 0&&(c={});var e=H(c);return e.duration=0,e.add=function(t,r){var i=ce.indexOf(e),n=e.children;i>-1&&ce.splice(i,1);function s(u){u.passThrough=!0}for(var o=0;o<n.length;o++)s(n[o]);var a=Ve(t,Xe(Ge,c));a.targets=a.targets||c.targets;var l=e.duration;a.autoplay=!1,a.direction=e.direction,a.timelineOffset=B.und(r)?l:rt(r,l),s(e),e.seek(a.timelineOffset);var d=H(a);s(d),n.push(d);var p=kt(n,c);return e.delay=p.delay,e.endDelay=p.endDelay,e.duration=p.duration,e.seek(0),e.reset(),e.autoplay&&e.play(),e},e}H.version="3.2.1",H.speed=1,H.suspendWhenDocumentHidden=!0,H.running=ce,H.remove=Wr,H.get=tt,H.set=Et,H.convertPx=Je,H.path=Br,H.setDashoffset=Nr,H.stagger=Kr,H.timeline=Qr,H.easing=We,H.penner=mt,H.random=function(c,e){return Math.floor(Math.random()*(e-c+1))+c},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.CustomDialog=class{static _createOverlay(){const e=document.createElement("div");return e.style.cssText=["position:fixed;top:0;left:0;width:100%;height:100%","background:rgba(0,0,0,0.6);backdrop-filter:blur(8px)","z-index:999999;display:flex;align-items:center;justify-content:center","opacity:0;transition:opacity 0.2s"].join(";"),document.body.appendChild(e),e}static _buildCard(e,t){e.innerHTML=`
            <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;width:100%;max-width:360px;box-shadow:0 16px 48px rgba(0,0,0,0.5);transform:scale(0.95);transition:transform 0.2s;display:flex;flex-direction:column;gap:16px;">
                ${t}
            </div>
        `;const r=e.children[0];return requestAnimationFrame(()=>{e.style.opacity="1",r.style.transform="scale(1)"}),r}static _closeOverlay(e,t,r){e.style.opacity="0",e.children[0].style.transform="scale(0.95)",setTimeout(()=>e.remove(),200),t(r)}static alert(e,t){return new Promise(r=>{const i=this._createOverlay();this._buildCard(i,`
                <div style="font-size:18px;font-weight:600;color:#fff;">${pe(e)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;">${pe(t)}</div>
                <div style="display:flex;justify-content:flex-end;">
                    <button id="ypp-alert-ok" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">OK</button>
                </div>
            `),i.querySelector("#ypp-alert-ok").addEventListener("click",()=>this._closeOverlay(i,r,void 0))})}static confirm(e,t,r="Confirm",i=!1){return new Promise(n=>{const s=this._createOverlay(),o=i?"rgba(255,78,69,0.4)":"rgba(255,255,255,0.15)";this._buildCard(s,`
                <div style="font-size:18px;font-weight:600;color:#fff;">${pe(e)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;">${pe(t)}</div>
                <div style="display:flex;justify-content:flex-end;gap:12px;">
                    <button id="ypp-confirm-cancel" style="background:rgba(255,255,255,0.05);color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Cancel</button>
                    <button id="ypp-confirm-ok" style="background:${o};color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">${pe(r)}</button>
                </div>
            `),s.querySelector("#ypp-confirm-cancel").addEventListener("click",()=>this._closeOverlay(s,n,!1)),s.querySelector("#ypp-confirm-ok").addEventListener("click",()=>this._closeOverlay(s,n,!0))})}static prompt(e,t,r="",i=""){return new Promise(n=>{const s=this._createOverlay(),o=pe(r);this._buildCard(s,`
                <div style="font-size:18px;font-weight:600;color:#fff;">${pe(e)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;margin-bottom:-4px;">${pe(t)}</div>
                <input type="text" id="ypp-prompt-input" placeholder="${o}" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:12px;border-radius:8px;font-size:14px;outline:none;width:100%;box-sizing:border-box;">
                <div style="display:flex;justify-content:flex-end;gap:12px;">
                    <button id="ypp-prompt-cancel" style="background:rgba(255,255,255,0.05);color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Cancel</button>
                    <button id="ypp-prompt-ok" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Submit</button>
                </div>
            `);const a=s.querySelector("#ypp-prompt-input");a.value=i,a.focus(),a.select(),a.addEventListener("keydown",l=>{l.key==="Enter"&&this._closeOverlay(s,n,a.value),l.key==="Escape"&&this._closeOverlay(s,n,null)}),s.querySelector("#ypp-prompt-cancel").addEventListener("click",()=>this._closeOverlay(s,n,null)),s.querySelector("#ypp-prompt-ok").addEventListener("click",()=>this._closeOverlay(s,n,a.value))})}};function pe(c){return String(c).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}window.YPP.features.FolderUI=class{constructor(e,t){this.storage=e,this.orchestrator=t,this.observer=window.YPP.sharedObserver||new window.YPP.Utils.DOMObserver,this._popoverListenerAttached=!1,this._guideRenderKey=null}injectGuideFolders(){this.observer.register("guide-folders","#guide-inner-content #sections ytd-guide-section-renderer",e=>{const t=Array.from(document.querySelectorAll("#guide-inner-content ytd-guide-section-renderer"));let r=t.find(i=>{var s,o;const n=((o=(s=i.querySelector("#title"))==null?void 0:s.textContent)==null?void 0:o.toLowerCase())||"";return n.includes("subscriptions")||n.includes("abonnements")});!r&&t.length>1&&(r=t[1]),r&&this.renderGuideFolders(r)},{runOnce:!0})}renderGuideFolders(e=null){const t=Object.keys(this.storage.folders),r=this.orchestrator.getActiveFolder(),i=t.join(",")+"|"+(r||""),n=!!document.getElementById("ypp-sub-folders-container");if(i===this._guideRenderKey&&n)return;this._guideRenderKey=i;let s=document.getElementById("ypp-sub-folders-container");if(!s&&e){s=document.createElement("div"),s.id="ypp-sub-folders-container",s.className="ypp-sub-folders";const a=e.querySelector("#items");a&&a.parentNode.insertBefore(s,a.nextSibling),this.orchestrator.addListener(s,"click",async l=>{if(l.target.closest("#ypp-add-folder-btn")){const h=await window.YPP.features.CustomDialog.prompt("New Folder","Enter new folder name:");h&&h.trim()&&this.storage.addFolder(h.trim())&&(this._guideRenderKey=null,this.renderGuideFolders(),this.renderFilterChips());return}const p=l.target.closest(".ypp-play-all-btn");if(p){l.preventDefault(),l.stopPropagation();const h=p.closest(".ypp-folder-item");h&&this.orchestrator.playAll(h.dataset.folder);return}const u=l.target.closest(".ypp-folder-item");if(u){const h=u.dataset.folder;if(window.location.href.includes("/feed/subscriptions"))this.orchestrator.setActiveFolder(h,l.shiftKey||l.ctrlKey||l.metaKey);else{sessionStorage.setItem("ypp_pending_folder",h);const m=document.createElement("a");m.href="/feed/subscriptions",document.body.appendChild(m),m.click(),m.remove()}}}),this.orchestrator.addListener(s,"dragstart",l=>{const d=l.target.closest(".ypp-folder-item");d&&(l.dataTransfer.effectAllowed="move",l.dataTransfer.setData("text/plain",d.dataset.folder),d.classList.add("ypp-dragging"))}),this.orchestrator.addListener(s,"dragend",l=>{const d=l.target.closest(".ypp-folder-item");d&&(d.classList.remove("ypp-dragging"),s.querySelectorAll(".ypp-folder-item").forEach(p=>{p.classList.remove("ypp-drag-over-top","ypp-drag-over-bottom")}))}),this.orchestrator.addListener(s,"dragover",l=>{const d=l.target.closest(".ypp-folder-item");if(d){l.preventDefault();const p=d.getBoundingClientRect(),u=p.top+p.height/2;l.clientY<u?(d.classList.add("ypp-drag-over-top"),d.classList.remove("ypp-drag-over-bottom")):(d.classList.add("ypp-drag-over-bottom"),d.classList.remove("ypp-drag-over-top"))}}),this.orchestrator.addListener(s,"dragleave",l=>{const d=l.target.closest(".ypp-folder-item");d&&d.classList.remove("ypp-drag-over-top","ypp-drag-over-bottom")}),this.orchestrator.addListener(s,"drop",l=>{const d=l.target.closest(".ypp-folder-item");if(d){l.preventDefault(),d.classList.remove("ypp-drag-over-top","ypp-drag-over-bottom");const p=d.dataset.folder,u=l.dataTransfer.getData("text/plain");if(u&&u!==p){const h=Object.keys(this.storage.folders);let m=h.indexOf(p);const y=d.getBoundingClientRect(),v=y.top+y.height/2;l.clientY>=v&&(m+=1),h.indexOf(u)<m&&(m-=1),this.storage.reorderFolder(u,m)&&(this._guideRenderKey=null,this.renderGuideFolders(),this.renderFilterChips())}}})}if(!s)return;s.innerHTML=`
            <style>
                /* Handle hover state with pure CSS instead of JS mouseenter/mouseleave */
                .ypp-folder-item:hover .ypp-play-all-btn { opacity: 1 !important; }
            </style>
            <div class="ypp-folder-header">
                <h3>My Folders</h3>
                <button id="ypp-add-folder-btn" class="ypp-icon-btn">+</button>
            </div>
            <div id="ypp-folder-list"></div>
        `;const o=s.querySelector("#ypp-folder-list");t.forEach(a=>{const l=this.storage.folderConfig[a]||{},d=document.createElement("div");d.className="ypp-folder-item",d.draggable=!0,d.dataset.folder=a,r&&r.split(",").map(m=>m.trim()).includes(a)&&d.classList.add("active");const p=pe(l.icon||"📁"),u=pe(a),h=this.storage.folders[a].length;d.innerHTML=`
                <div class="ypp-folder-icon">${p}</div>
                <div class="ypp-folder-name" style="flex: 1;">${u}</div>
                <div class="ypp-folder-count">${h}</div>
                <button class="ypp-play-all-btn" title="Play All" style="margin-left: 8px; width: 24px; height: 24px; padding: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; border: none; cursor: pointer; background: rgba(255,255,255,0.1); color: white;">
                    <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
            `,o.appendChild(d)})}removeGuideFolders(){const e=document.getElementById("ypp-sub-folders-container");e&&e.remove()}renderFilterChips(){this.orchestrator.isFeedPage()&&this.observer.register("inject-filter-chips",'ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer',e=>{const t=e[0];let r=document.getElementById("ypp-folder-chips");if(!r){r=document.createElement("div"),r.id="ypp-folder-chips",r.className="ypp-folder-chips-bar";const i=t.querySelector("#contents");i?t.insertBefore(r,i):t.prepend(r)}this.rebuildChipsContent(r)})}rebuildChipsContent(e){var t;if(e||(e=document.getElementById("ypp-folder-chips")),!!e)if(((t=this.orchestrator.settings)==null?void 0:t.subscriptionFolders)!==!1){const r=e.querySelector(".ypp-folder-chips-left");r&&r.remove();const i=this.orchestrator.getActiveFolder(),n="background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; cursor: pointer; outline: none; font-size: 14px; font-weight: 500; min-width: 160px; transition: 0.2s;",s=document.createElement("div");s.className="ypp-sub-filter-group ypp-folder-dropdown-container",s.style.cssText="display: flex; align-items: center; gap: 8px;";const o=document.createElement("span");o.className="ypp-sub-filter-label",o.style.cssText="color: #aaa; font-size: 13px; font-weight: 500; text-transform: uppercase;",o.textContent="Folder";const a=document.createElement("select");a.className="ypp-filter-dropdown",a.id="ypp-folder-select",a.style.cssText=n;const l=document.createElement("option");l.value="",l.style.background="#222",l.textContent="All Subscriptions",i||(l.selected=!0),a.appendChild(l);const d=i&&i.includes(",");if(d){const x=document.createElement("option");x.value=i,x.style.background="#222",x.textContent="Multiple Folders",x.selected=!0,a.appendChild(x)}Object.keys(this.storage.folders).forEach(x=>{const S=document.createElement("option");S.value=x,S.style.background="#222",S.textContent=x,!d&&i===x&&(S.selected=!0),a.appendChild(S)});const p=document.createElement("option");p.value="__no_folder__",p.style.background="#222",p.textContent="Uncategorized (No Folder)",i==="__no_folder__"&&(p.selected=!0),a.appendChild(p);const u=document.createElement("option");if(u.value="__new__",u.style.background="#222",u.textContent="+ Create New Folder",a.appendChild(u),a.addEventListener("mouseover",()=>a.style.background="rgba(255,255,255,0.12)"),a.addEventListener("mouseout",()=>a.style.background="rgba(255,255,255,0.08)"),a.addEventListener("change",async x=>{const S=x.target.value;if(S==="__new__"){x.target.value=this.orchestrator.getActiveFolder()||"";const E=await window.YPP.features.CustomDialog.prompt("New Folder","Enter a name for the new folder:");E&&E.trim()&&this.storage.addFolder(E.trim())&&(this.renderGuideFolders(),this.rebuildChipsContent())}else this.orchestrator.setActiveFolderDirect(S||null)}),s.appendChild(o),s.appendChild(a),i&&i!=="__no_folder__"){const x=document.createElement("button");x.className="ypp-filter-chip ypp-play-action-chip",x.innerHTML=String.raw`<svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px; vertical-align: text-bottom;"><path d="M8 5v14l11-7z"/></svg> Play All`,x.style.cssText="background: rgba(255, 255, 255, 0.15); color: #fff; border: 1px solid rgba(255,255,255,0.2); cursor: pointer;",x.addEventListener("click",()=>this.orchestrator.playAll(i)),s.appendChild(x)}const h=document.createElement("div");h.className="ypp-folder-chips-left",h.appendChild(s);const m=this.orchestrator.settings||{},y=document.createElement("div");y.className="ypp-sub-filter-group ypp-feed-filter-chips",y.style.cssText="display: flex; align-items: center; gap: 4px;",this.orchestrator.ffActiveChips=this.orchestrator.ffActiveChips||{};const v=x=>x==="show"?"rgba(43, 166, 64, 0.2)":x==="hide"?"rgba(235, 64, 52, 0.2)":"rgba(255,255,255,0.1)",b=x=>x==="show"?"1px solid rgba(43, 166, 64, 0.5)":x==="hide"?"1px solid rgba(235, 64, 52, 0.5)":"1px solid transparent",f=x=>x==="show"?"#4ade80":x==="hide"?"#f87171":"#f1f1f1",g=(x,S,E="",N=!1)=>{if(m[`ff_${x}_visible`]===!1)return;this.orchestrator.ffInitialized||(m[`ff_${x}_default`]||N?this.orchestrator.ffActiveChips[x]="show":this.orchestrator.ffActiveChips[x]="neutral");const A=document.createElement("button");let Y=this.orchestrator.ffActiveChips[x]||"neutral";A.className=`ypp-filter-chip ypp-ff-chip ypp-ff-${Y}`,A.dataset.id=x,A.innerHTML=(E?`<span style="margin-right:4px;">${E}</span>`:"")+S,A.style.cssText=`
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 13px;
                    font-weight: 500;
                    background: ${v(Y)};
                    color: ${f(Y)};
                    border: ${b(Y)};
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: 0.2s;
                `,A.addEventListener("click",()=>{var F;const O=m.ff_opt_multiselect;if(x==="all")Object.keys(this.orchestrator.ffActiveChips).forEach(T=>{this.orchestrator.ffActiveChips[T]="neutral"}),this.orchestrator.ffActiveChips.all="show";else{if(!O){const L=this.orchestrator.ffActiveChips[x]||"neutral";Object.keys(this.orchestrator.ffActiveChips).forEach(k=>{this.orchestrator.ffActiveChips[k]="neutral"}),this.orchestrator.ffActiveChips[x]=L}this.orchestrator.ffActiveChips.all="neutral";const T=this.orchestrator.ffActiveChips[x]||"neutral";T==="neutral"?this.orchestrator.ffActiveChips[x]="show":T==="show"?this.orchestrator.ffActiveChips[x]="hide":this.orchestrator.ffActiveChips[x]="neutral",Object.values(this.orchestrator.ffActiveChips).some(L=>L!=="neutral")||(this.orchestrator.ffActiveChips.all="show")}y.querySelectorAll(".ypp-ff-chip").forEach(T=>{const M=this.orchestrator.ffActiveChips[T.dataset.id]||"neutral";T.className=`ypp-filter-chip ypp-ff-chip ypp-ff-${M}`,T.style.background=v(M),T.style.color=f(M),T.style.border=b(M)}),(F=window.YPP.events)==null||F.emit("feed-filter:update-chips",this.orchestrator.ffActiveChips),this.orchestrator.updateFilterState()}),y.appendChild(A)};g("all","All","",!0),g("live","Live",'<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5l6-4.5-6-4.5v9z"/></svg>'),g("streamed","Streamed",'<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>'),g("video","Video",'<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z"/></svg>'),g("shorts","Shorts",'<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l1.2-.63s-1.16-.49-1.19-.5c-1.38-.6-2.08-2.14-1.59-3.57.48-1.39 1.96-2.19 3.4-1.92L6 8.52l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72l-1.2.63s1.16.49 1.19.5c1.38.6 2.08 2.14 1.59 3.57-.48 1.39-1.96 2.19-3.4 1.92L18 15.48z"/></svg>'),g("scheduled","Scheduled",'<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'),g("notifon","Notification on",""),g("notifoff","Notification off",""),g("posts","Posts",""),g("playlist","Playlist","");const _="background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 6px 10px; border-radius: 16px; cursor: pointer; outline: none; font-size: 13px; font-weight: 500; transition: 0.2s; height: 30px;",P=document.createElement("select");if(P.style.cssText=_,["All","Unwatched","Watched"].forEach(x=>{const S=document.createElement("option");S.value=x.toLowerCase(),S.textContent=x,S.style.background="#222",P.appendChild(S)}),this.orchestrator.ffInitialized?P.value=this.orchestrator.ffActiveWatch||"all":m.ff_unwatched_default?(P.value="unwatched",this.orchestrator.ffActiveWatch="unwatched"):m.ff_watched_default?(P.value="watched",this.orchestrator.ffActiveWatch="watched"):this.orchestrator.ffActiveWatch="all",P.addEventListener("change",x=>{this.orchestrator.ffActiveWatch=x.target.value,this.orchestrator.updateFilterState()}),y.appendChild(P),m.ff_search_visible!==!1){const x=document.createElement("input");x.type="text",x.placeholder="Subscription Feed Filter...",x.style.cssText="background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 16px; font-size: 13px; outline: none; width: 160px; height: 30px; transition: width 0.2s;",this.orchestrator.ffInitialized||(this.orchestrator.ffActiveSearch=m.ff_search_default||""),x.value=this.orchestrator.ffActiveSearch||"",x.addEventListener("focus",()=>x.style.width="240px"),x.addEventListener("blur",()=>x.style.width="160px"),x.addEventListener("input",S=>{this.orchestrator.ffActiveSearch=S.target.value.toLowerCase(),this.orchestrator.updateFilterState()}),y.appendChild(x)}const w=document.createElement("button");w.innerHTML='<svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>',w.style.cssText="background: transparent; color: #aaa; border: none; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: 0.2s;",w.addEventListener("mouseover",()=>{w.style.background="rgba(255,255,255,0.1)",w.style.color="#fff"}),w.addEventListener("mouseout",()=>{w.style.background="transparent",w.style.color="#aaa"}),w.addEventListener("click",()=>{window.YPP.features.CustomDialog&&window.YPP.features.CustomDialog.alert("Subscription Feed Filter","Advanced filter options menu coming soon!")}),y.appendChild(w),this.orchestrator.ffInitialized=!0,h.appendChild(y);const C=e.querySelector(".ypp-filter-separator");C?e.insertBefore(h,C):e.appendChild(h),e.style.display="flex",e.querySelector(".ypp-folder-chips-right")||this._injectFilterBar(e)}else e.style.display="none",e.innerHTML=""}removeFilterChips(){const e=document.getElementById("ypp-folder-chips");e&&e.remove();const t=document.querySelector(".ypp-sub-filter-bar");t&&t.remove()}_injectFilterBar(e){var u,h,m;if(!e)return;const t=e.querySelector(".ypp-folder-chips-right");t&&t.remove();const r=e.querySelector(".ypp-filter-separator");r&&r.remove();const i=((u=this.orchestrator.settings)==null?void 0:u.enableFilterBar)!==!1,n=((h=this.orchestrator.settings)==null?void 0:h.enableChannelHealth)!==!1;if(!i&&!n)return;const s=document.createElement("div");s.className="ypp-filter-separator",e.appendChild(s);const o=document.createElement("div");o.className="ypp-folder-chips-right";const a="background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; cursor: pointer; outline: none; font-size: 14px; font-weight: 500; min-width: 120px; transition: 0.2s;";let l="";i&&(l+=`
                <div class="ypp-sub-filter-group" style="display: flex; align-items: center; gap: 8px;">
                    <span class="ypp-sub-filter-label" style="color: #aaa; font-size: 13px; font-weight: 500; text-transform: uppercase;">Duration</span>
                    <select class="ypp-filter-dropdown" id="ypp-duration-filter" style="${a}">
                        <option value="all" style="background:#222; color:#fff;">All</option>
                        <option value="short" style="background:#222; color:#fff;">Under 5 min</option>
                        <option value="medium" style="background:#222; color:#fff;">5 – 20 min</option>
                        <option value="long" style="background:#222; color:#fff;">Over 20 min</option>
                        <option value="custom" style="background:#222; color:#fff;">Custom...</option>
                    </select>
                </div>
                <div class="ypp-sub-filter-group" style="display: flex; align-items: center; gap: 8px;">
                    <span class="ypp-sub-filter-label" style="color: #aaa; font-size: 13px; font-weight: 500; text-transform: uppercase;">Uploaded</span>
                    <select class="ypp-filter-dropdown" id="ypp-date-filter" style="${a}">
                        <option value="all" style="background:#222; color:#fff;">All time</option>
                        <option value="today" style="background:#222; color:#fff;">Today</option>
                        <option value="week" style="background:#222; color:#fff;">This week</option>
                        <option value="month" style="background:#222; color:#fff;">This month</option>
                        <option value="custom" style="background:#222; color:#fff;">Custom...</option>
                    </select>
                </div>
                <div class="ypp-sub-filter-group" style="display: flex; align-items: center; gap: 8px;">
                    <span class="ypp-sub-filter-label" style="color: #aaa; font-size: 13px; font-weight: 500; text-transform: uppercase;">Sort by</span>
                    <select class="ypp-filter-dropdown" id="ypp-sort-filter" style="${a}">
                        <option value="latest" style="background:#222; color:#fff;">Latest</option>
                        <option value="oldest" style="background:#222; color:#fff;">Oldest</option>
                        <option value="longest" style="background:#222; color:#fff;">Longest</option>
                        <option value="shortest" style="background:#222; color:#fff;">Shortest</option>
                    </select>
                </div>
            `),n&&(l+=`
                <div class="ypp-sub-filter-group">
                    <button id="ypp-health-btn" class="ypp-btn-primary" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 14px; border-radius: 8px; transition: 0.2s;">
                        <svg height="18" width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z"/></svg>
                        Channel Health
                    </button>
                </div>
            `),o.innerHTML=l,e.appendChild(o);const d=o;d.querySelectorAll(".ypp-filter-dropdown").forEach(y=>{y.addEventListener("mouseover",()=>y.style.background="rgba(255,255,255,0.12)"),y.addEventListener("mouseout",()=>y.style.background="rgba(255,255,255,0.08)")});const p=async y=>{var P,w,C,x;const v=y.target;let b=v.value;if(b==="custom"){if(v.id==="ypp-duration-filter"){const S=await window.YPP.features.CustomDialog.prompt("Custom Duration","Enter maximum video duration in minutes (e.g., 15):");if(S&&!isNaN(S)){b=`custom:${S}`;const E=document.createElement("option");E.value=b,E.textContent=`Under ${S}m`,E.style.background="#222",v.appendChild(E),v.value=b}else v.value="all",b="all"}else if(v.id==="ypp-date-filter"){const S=await window.YPP.features.CustomDialog.prompt("Custom Date","Enter maximum days ago (e.g., 3):");if(S&&!isNaN(S)){b=`custom:${S}`;const E=document.createElement("option");E.value=b,E.textContent=`Past ${S} days`,E.style.background="#222",v.appendChild(E),v.value=b}else v.value="all",b="all"}}const f=((P=document.getElementById("ypp-duration-filter"))==null?void 0:P.value)||"all",g=((w=document.getElementById("ypp-date-filter"))==null?void 0:w.value)||"all",_=((C=document.getElementById("ypp-sort-filter"))==null?void 0:C.value)||"latest";(x=window.YPP.events)==null||x.emit("subscriptions:filter-changed",{duration:f,date:g,sort:_})};d.querySelectorAll(".ypp-filter-dropdown").forEach(y=>{y.addEventListener("change",p)}),(m=d.querySelector("#ypp-health-btn"))==null||m.addEventListener("click",()=>{window.YPP.features.ChannelHealthUI&&window.YPP.features.ChannelHealthUI.openModal(this)})}_createToggleChip(e,t,r,i){const n=document.createElement("button");n.className=`ypp-filter-chip ypp-toggle-chip ${r?"active":""}`,n.textContent=t,n.addEventListener("click",()=>{const s=!n.classList.contains("active");n.classList.toggle("active",s),i(s)}),e.appendChild(n)}updateChipStylesForFolder(e){document.querySelectorAll(".ypp-filter-chip").forEach(t=>{t.dataset.folder===e?t.classList.add("active"):t.dataset.folder!==void 0&&t.classList.remove("active")}),document.querySelectorAll(".ypp-folder-item").forEach(t=>{var r;((r=t.querySelector(".ypp-folder-name"))==null?void 0:r.textContent)===e?t.classList.add("active"):t.classList.remove("active")})}injectCardBadges(){this.observer.register("feed-card-badges","ytd-rich-item-renderer #channel-name, ytd-video-renderer #channel-name",e=>{e.forEach(t=>{if(t.querySelector(".ypp-card-folder-btn"))return;const r=t.querySelector("a");if(!r||!r.textContent.trim())return;const i=document.createElement("button");i.className="ypp-card-folder-btn ypp-folder-badge",i.innerHTML=String.raw`<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right:2px"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg> Save`,i.title="Save to Folder",i.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),this.renderChannelPopover(i,r.textContent.trim())}),t.style.display="flex",t.style.alignItems="center",t.appendChild(i)})},{runOnce:!1})}injectChannelBadge(){this.observer.register("channel-badge","ytd-subscribe-button-renderer",e=>{if(!e||e.length===0)return;const t=e[0].parentNode;if(document.getElementById("ypp-channel-folder-btn"))return;const r=document.createElement("button");r.id="ypp-channel-folder-btn",r.className="ypp-tactile-btn",r.innerHTML=String.raw`<span style="margin-right:4px;">📁</span> Folders`;const i=document.querySelector("ytd-channel-name#channel-name .yt-formatted-string");if(!i)return;const n=i.textContent.trim();r.addEventListener("click",s=>{s.stopPropagation(),this.renderChannelPopover(r,n)}),t.insertBefore(r,e[0])},{runOnce:!0})}renderChannelPopover(e,t){let r=document.getElementById("ypp-folder-popover");r||(r=document.createElement("div"),r.id="ypp-folder-popover",r.className="ypp-glass-popover",document.body.appendChild(r)),this._popoverListenerAttached||(this._popoverListenerAttached=!0,this._popoverClickOutsideHandler=o=>{const a=document.getElementById("ypp-folder-popover");if(!a)return;const l=a.contains(o.target),d=o.target.closest(".ypp-card-folder-btn")||o.target.closest("#ypp-channel-folder-btn");!l&&!d&&a.classList.remove("visible")},document.addEventListener("click",this._popoverClickOutsideHandler));const i=e.getBoundingClientRect();r.style.top=`${i.bottom+window.scrollY+8}px`,r.style.left=`${i.left+window.scrollX}px`,r.style.zIndex="999999",r.innerHTML=`
            <div style="background: rgba(28, 27, 31, 0.7); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; box-shadow: 0 16px 40px rgba(0,0,0,0.4); width: 260px; overflow: hidden; display: flex; flex-direction: column;">
                <div class="ypp-popover-header" style="padding: 20px 20px 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(208, 188, 255, 0.05);">
                    <div style="font-size: 11px; color: rgba(208, 188, 255, 0.8); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; font-weight: 600; font-family: 'Roboto', 'Google Sans', sans-serif;">Save to folder</div>
                    <div id="ypp-popover-channel-name" style="font-size: 16px; color: #E6E1E5; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Roboto', 'Google Sans', sans-serif;"></div>
                </div>
                <div class="ypp-popover-list" id="ypp-popover-list" style="padding: 12px; max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;"></div>
            </div>
        `,r.querySelector("#ypp-popover-channel-name").textContent=t;const n=r.querySelector("#ypp-popover-list"),s=Object.keys(this.storage.folders);if(s.length===0){const o=document.createElement("div");o.style.cssText="padding: 16px; text-align: center; color: rgba(255,255,255,0.5); font-size: 13px;",o.textContent="No folders exist.",n.appendChild(o)}else s.forEach(o=>{const a=this.storage.folders[o].includes(t),l=document.createElement("label");l.className="ypp-folder-checkbox",l.style.cssText="display: flex; align-items: center; padding: 12px 14px; border-radius: 12px; cursor: pointer; transition: background 0.2s;",l.addEventListener("mouseover",()=>{l.style.background="rgba(255,255,255,0.08)"}),l.addEventListener("mouseout",()=>{l.style.background="transparent"});const d=document.createElement("input");d.type="checkbox",d.dataset.folder=o,d.checked=a,d.style.cssText="margin-right: 14px; accent-color: #fff; width: 18px; height: 18px; cursor: pointer; border-radius: 4px;",d.addEventListener("change",()=>{var m,y,v,b;const u=this.orchestrator.getActiveFolder();d.checked?(this.storage.addChannelToFolder(t,o),(u===o||u==="__no_folder__")&&this.orchestrator.forceRefreshFeed()):(this.storage.removeChannelFromFolder(t,o),(u===o||u==="__no_folder__")&&this.orchestrator.forceRefreshFeed()),this.renderGuideFolders();const h=document.getElementById("ypp-health-folder-filter-dropdown");if(h&&h.value!=="all"){const f=document.querySelector(`.ypp-channel-health-row[data-name="${CSS.escape(t)}"]`);if(f){let g=f.dataset.folders?f.dataset.folders.split(","):[];d.checked?g.includes(o)||g.push(o):g=g.filter(w=>w!==o),f.dataset.folders=g.join(",");const _=h.value;if(!(_==="__no_folder__"?g.length===0:g.includes(_)))f.style.display="none";else{const w=((m=document.getElementById("ypp-health-filter-dropdown"))==null?void 0:m.value)||"all",C=((b=(v=(y=document.getElementById("ypp-health-search-input"))==null?void 0:y.value)==null?void 0:v.toLowerCase())==null?void 0:b.trim())||"";let x=w==="all"||f.dataset.status===w,S=C?f.dataset.name.toLowerCase().includes(C):!0;x&&S&&(f.style.display="flex")}}}});const p=document.createElement("span");p.style.cssText='color: #E6E1E5; font-size: 15px; font-weight: 500; font-family: "Roboto", "Google Sans", sans-serif;',p.textContent=o,l.appendChild(d),l.appendChild(p),n.appendChild(l)});r.classList.add("visible")}},window.YPP.features.ChannelHealthUI=class Oe{static openModal(e){if(document.getElementById("ypp-health-modal"))return;const t=document.createElement("div");t.className="ypp-modal-overlay open",t.id="ypp-health-modal",document.body.appendChild(t),t.innerHTML=String.raw`
            <div class="ypp-modal-content ypp-organizer-modal" style="font-family: 'Inter', 'Outfit', sans-serif; width: 100vw; height: 100vh; display: flex; flex-direction: column; background: rgba(10, 10, 15, 0.75); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); overflow: hidden; color: #f1f5f9;">
                <div class="ypp-modal-header" style="background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; z-index: 10; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2)); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <span class="ypp-modal-title" style="font-size: 24px; font-weight: 600; color: #fff; letter-spacing: -0.5px;">Channel Organizer</span>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <button id="ypp-health-create-folder-btn" class="ypp-btn-primary" style="background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 20px; border-radius: 20px; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.transform='translateY(0)';">Create Folder</button>
                        <button id="ypp-health-delete-folder-btn" class="ypp-btn-primary" style="background: transparent; color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 20px; border-radius: 20px; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.background='rgba(255, 78, 69, 0.1)'; this.style.color='#ff4e45'; this.style.borderColor='rgba(255, 78, 69, 0.3)';" onmouseout="this.style.background='transparent'; this.style.color='rgba(255, 255, 255, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.1)';">Delete Folder</button>
                        <button id="ypp-health-scan-btn" class="ypp-btn-primary" style="background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; border: none; padding: 8px 24px; border-radius: 20px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(99, 102, 241, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(99, 102, 241, 0.3)';">Start Scan</button>
                        <button id="ypp-health-unsub-btn" class="ypp-btn-primary" style="background: rgba(255,78,69,0.2); color: #ff6b6b; border: 1px solid rgba(255,78,69,0.3); padding: 8px 20px; border-radius: 20px; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: none;" onmouseover="this.style.background='rgba(255,78,69,0.3)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(255,78,69,0.2)'; this.style.transform='translateY(0)';">Unsubscribe Selected</button>
                        <button id="ypp-health-add-folder-btn" class="ypp-btn-primary" style="background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.15); padding: 8px 20px; border-radius: 20px; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: none;" onmouseover="this.style.background='rgba(255, 255, 255, 0.15)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)';">Add to Folder</button>
                        <button id="ypp-health-remove-folder-btn" class="ypp-btn-primary" style="background: rgba(255, 152, 0, 0.15); color: #ffb340; border: 1px solid rgba(255, 152, 0, 0.3); padding: 8px 20px; border-radius: 20px; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: none;" onmouseover="this.style.background='rgba(255, 152, 0, 0.25)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(255, 152, 0, 0.15)'; this.style.transform='translateY(0)';">Remove from Folder</button>
                        <div style="width: 1px; height: 24px; background: rgba(255,255,255,0.1); margin: 0 8px;"></div>
                        <button class="ypp-modal-close" style="background: transparent; border: none; color: #94a3b8; font-size: 28px; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; line-height: 1;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='#fff';" onmouseout="this.style.background='transparent'; this.style.color='#94a3b8';">&times;</button>
                    </div>
                </div>
                <div class="ypp-organizer-body" style="flex-direction: row; padding: 32px; overflow: hidden; display: flex; flex: 1; background: transparent; gap: 32px;">
                    <!-- LEFT PANE: Folders -->
                    <div style="width: 280px; display: flex; flex-direction: column; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 24px; flex-shrink: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
                        <h3 style="color: #f1f5f9; font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 16px 0; display: flex; justify-content: space-between; align-items: center;">
                            Your Folders
                            <span style="font-size:11px; color:rgba(255,255,255,0.3); font-weight:normal; letter-spacing: 0;">Drag to Add</span>
                        </h3>
                        <div id="ypp-organizer-folders-list" class="ypp-scroll-list" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;">
                            <!-- Populated dynamically -->
                        </div>
                        <div style="margin-top: 24px;">
                            <h3 style="color: #f1f5f9; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4e45" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                Filter Keywords
                            </h3>
                            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                                <input type="text" id="ypp-blacklist-input" placeholder="e.g. spoiler, react" style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 14px; color: #fff; font-size: 13px; outline: none; transition: all 0.2s;" onfocus="this.style.borderColor='rgba(99, 102, 241, 0.5)'; this.style.boxShadow='0 0 0 2px rgba(99, 102, 241, 0.2)';" onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.boxShadow='none';">
                                <button id="ypp-blacklist-add-btn" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 0 16px; color: #fff; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 500;" onmouseover="this.style.background='rgba(255,255,255,0.12)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)';">Add</button>
                            </div>
                            <div id="ypp-blacklist-tags" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
                        </div>
                    </div>
                    <!-- RIGHT PANE: Channels -->
                    <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                        <div style="display: flex; gap: 24px; margin-bottom: 24px;">
                            <div class="ypp-health-stat" data-filter="active" style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 20px; text-align: left; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(46, 213, 115, 0.15)'; this.style.borderColor='rgba(46, 213, 115, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='rgba(255,255,255,0.06)';">
                                <div style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;"><div style="width:6px; height:6px; border-radius:50%; background:#2ed573;"></div> Active (< 30 days)</div>
                                <div style="color: #f1f5f9; font-size: 42px; font-weight: 600; line-height: 1; letter-spacing: -1px;" id="ypp-health-active">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="warning" style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 20px; text-align: left; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(255, 179, 64, 0.15)'; this.style.borderColor='rgba(255, 179, 64, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='rgba(255,255,255,0.06)';">
                                <div style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;"><div style="width:6px; height:6px; border-radius:50%; background:#ffb340;"></div> Inactive (> 1 month)</div>
                                <div style="color: rgba(241, 245, 249, 0.8); font-size: 42px; font-weight: 600; line-height: 1; letter-spacing: -1px;" id="ypp-health-warning">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="dead" style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 20px; text-align: left; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(255, 78, 69, 0.15)'; this.style.borderColor='rgba(255, 78, 69, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='rgba(255,255,255,0.06)';">
                                <div style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;"><div style="width:6px; height:6px; border-radius:50%; background:#ff4e45;"></div> Dead (> 3 months)</div>
                                <div style="color: rgba(241, 245, 249, 0.5); font-size: 42px; font-weight: 600; line-height: 1; letter-spacing: -1px;" id="ypp-health-dead">0</div>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 16px; margin-bottom: 16px; align-items: center;">
                            <div style="display: flex; gap: 8px; margin-right: auto;">
                                <button id="ypp-health-select-all-btn" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)';">Select All Visible</button>
                                <button id="ypp-health-unselect-all-btn" style="background: rgba(255,255,255,0.02); color: #94a3b8; border: 1px solid rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.color='#f1f5f9';" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.color='#94a3b8';">Unselect All</button>
                            </div>
                            <div style="position: relative; flex: 1; max-width: 280px; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" style="position: absolute; left: 14px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" id="ypp-health-search-input" placeholder="Search channels..." style="width: 100%; background: rgba(255,255,255,0.03); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 10px 16px 10px 38px; border-radius: 12px; outline: none; font-size: 13px; transition: all 0.2s;" onfocus="this.style.borderColor='rgba(99, 102, 241, 0.5)'; this.style.boxShadow='0 0 0 2px rgba(99, 102, 241, 0.2)';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.boxShadow='none';"/>
                            </div>
                            <span style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Filters:</span>
                            <select id="ypp-health-folder-filter-dropdown" style="background: rgba(255,255,255,0.03); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; cursor: pointer; outline: none; font-size: 13px; font-weight: 500; transition: all 0.2s; appearance: none; padding-right: 32px; background-image: url('data:image/svg+xml;utf8,<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2394a3b8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>'); background-repeat: no-repeat; background-position: right 12px center;">
                                <option value="all" style="background:#0a0a0f">All Folders</option>
                                <option value="__no_folder__" style="background:#0a0a0f">Uncategorized</option>
                                ${e?Object.keys(e.storage.folders).map(w=>'<option value="'+w+'" style="background:#0a0a0f">'+w+"</option>").join(""):""}
                            </select>
                            <select id="ypp-health-filter-dropdown" style="background: rgba(255,255,255,0.03); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; cursor: pointer; outline: none; font-size: 13px; font-weight: 500; transition: all 0.2s; appearance: none; padding-right: 32px; background-image: url('data:image/svg+xml;utf8,<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2394a3b8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>'); background-repeat: no-repeat; background-position: right 12px center;">
                                <option value="all" style="background:#0a0a0f">All Statuses</option>
                                <option value="active" style="background:#0a0a0f">Active</option>
                                <option value="warning" style="background:#0a0a0f">Inactive</option>
                                <option value="dead" style="background:#0a0a0f">Dead</option>
                            </select>
                            <select id="ypp-health-sort-dropdown" style="background: rgba(255,255,255,0.03); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 10px; cursor: pointer; outline: none; font-size: 13px; font-weight: 500; transition: all 0.2s; appearance: none; padding-right: 32px; background-image: url('data:image/svg+xml;utf8,<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2394a3b8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>'); background-repeat: no-repeat; background-position: right 12px center;">
                                <option value="latest" style="background:#0a0a0f">Latest First</option>
                                <option value="oldest" style="background:#0a0a0f">Oldest First</option>
                                <option value="az" style="background:#0a0a0f">Alphabetical</option>
                            </select>
                        </div>
                        <div id="ypp-health-results" class="ypp-scroll-list" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 8px;">
                            <div style="text-align: center; color: #666; margin-top: 60px; font-size: 16px; font-weight: 500;">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; display:block; margin-left:auto; margin-right:auto;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                Click "Start Scan" to fetch channel data.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,H({targets:".ypp-organizer-modal",opacity:[0,1],scale:[.95,1],easing:"spring(1, 80, 10, 0)",duration:600}),t.querySelector(".ypp-modal-close").addEventListener("click",()=>{t.classList.remove("open"),setTimeout(()=>t.remove(),300)});const r=t.querySelector(".ypp-modal-close"),i=t.querySelector("#ypp-health-scan-btn"),n=t.querySelector("#ypp-health-unsub-btn"),s=t.querySelector("#ypp-health-add-folder-btn"),o=t.querySelector("#ypp-health-create-folder-btn"),a=t.querySelector("#ypp-health-delete-folder-btn"),l=t.querySelector("#ypp-health-folder-filter-dropdown"),d=t.querySelector("#ypp-health-filter-dropdown"),p=t.querySelector("#ypp-health-sort-dropdown");r.addEventListener("mouseover",()=>{r.style.background="rgba(255,255,255,0.1)"}),r.addEventListener("mouseout",()=>{r.style.background="rgba(255,255,255,0.05)"}),i.addEventListener("mouseover",()=>{i.style.filter="brightness(1.1)"}),i.addEventListener("mouseout",()=>{i.style.filter="brightness(1)"}),n.addEventListener("mouseover",()=>{n.style.background="rgba(255, 78, 69, 0.25)"}),n.addEventListener("mouseout",()=>{n.style.background="rgba(255, 78, 69, 0.15)"}),s.addEventListener("mouseover",()=>{s.style.background="rgba(255, 255, 255, 0.2)"}),s.addEventListener("mouseout",()=>{s.style.background="rgba(255, 255, 255, 0.1)"}),o.addEventListener("mouseover",()=>{o.style.background="rgba(255,255,255,0.1)"}),o.addEventListener("mouseout",()=>{o.style.background="rgba(255,255,255,0.05)"}),a.addEventListener("mouseover",()=>{a.style.background="rgba(255, 78, 69, 0.15)",a.style.color="#ff4e45",a.style.borderColor="rgba(255, 78, 69, 0.3)"}),a.addEventListener("mouseout",()=>{a.style.background="rgba(255,255,255,0.05)",a.style.color="#fff",a.style.borderColor="rgba(255,255,255,0.1)"}),l.addEventListener("mouseover",()=>{l.style.background="rgba(255,255,255,0.12)"}),l.addEventListener("mouseout",()=>{l.style.background="rgba(255,255,255,0.08)"}),d.addEventListener("mouseover",()=>{d.style.background="rgba(255,255,255,0.12)"}),d.addEventListener("mouseout",()=>{d.style.background="rgba(255,255,255,0.08)"}),p.addEventListener("mouseover",()=>{p.style.background="rgba(255,255,255,0.12)"}),p.addEventListener("mouseout",()=>{p.style.background="rgba(255,255,255,0.08)"});const u=t.querySelector("#ypp-health-select-all-btn"),h=t.querySelector("#ypp-health-unselect-all-btn");u.addEventListener("click",()=>{const w=f.querySelectorAll(".ypp-channel-health-row");let C=!1;w.forEach(x=>{if(x.style.display!=="none"){const S=x.querySelector(".ypp-unsub-checkbox");S&&!S.disabled&&!S.checked&&(S.checked=!0,C=!0)}}),C&&f.dispatchEvent(new Event("change",{bubbles:!0}))}),h.addEventListener("click",()=>{const w=f.querySelectorAll(".ypp-unsub-checkbox:checked");w.length>0&&(w.forEach(C=>{C.disabled||(C.checked=!1)}),f.dispatchEvent(new Event("change",{bubbles:!0})))}),o.addEventListener("click",async()=>{if(!e)return;const w=await window.YPP.features.CustomDialog.prompt("Create Folder","Enter a name for the new folder:");if(w&&w.trim()&&e.storage.addFolder(w.trim())){e.renderGuideFolders&&e.renderGuideFolders(),e.renderFilterChips&&e.renderFilterChips();const C=o.textContent;o.textContent="Created!",setTimeout(()=>o.textContent=C,2e3)}}),a.addEventListener("click",async()=>{if(!e)return;const w=Object.keys(e.storage.folders);if(w.length===0){await window.YPP.features.CustomDialog.alert("No Folders","You have no folders to delete.");return}const C=await window.YPP.features.CustomDialog.prompt("Delete Folder",`Enter the exact name of the folder to delete.nnAvailable folders:n${w.join(", ")}`);if(C&&w.includes(C.trim())){if(await window.YPP.features.CustomDialog.confirm("Delete Folder",`Are you sure you want to permanently delete "${C.trim()}"?`,"Delete",!0)){e.storage.deleteFolder(C.trim());const x=e.orchestrator.getActiveFolder();x&&x.split(",").map(E=>E.trim()).includes(C.trim())&&e.orchestrator.setActiveFolder(C.trim(),!0),e.renderGuideFolders&&e.renderGuideFolders(),e.renderFilterChips&&e.renderFilterChips();const S=a.textContent;a.textContent="Deleted!",setTimeout(()=>a.textContent=S,2e3)}}else C&&await window.YPP.features.CustomDialog.alert("Error","Folder not found. Make sure you typed the name exactly as shown.")});const m=()=>{var x;const w=t.querySelector("#ypp-blacklist-tags");if(!w)return;w.innerHTML="",(((x=e==null?void 0:e.storage)==null?void 0:x.keywordBlacklist)||[]).forEach(S=>{const E=document.createElement("div");E.style.cssText="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 4px 8px; font-size: 12px; color: #fff; display: flex; align-items: center; gap: 4px;",E.innerHTML=`<span>${pe(S)}</span><button class="ypp-blacklist-del-btn" style="background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; padding: 0; font-size: 14px; line-height: 1;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">&times;</button>`,E.querySelector("button").addEventListener("click",()=>{e.storage.keywordBlacklist=e.storage.keywordBlacklist.filter(N=>N!==S),e.storage.save(),m()}),w.appendChild(E)})},y=t.querySelector("#ypp-blacklist-input"),v=t.querySelector("#ypp-blacklist-add-btn");if(y&&v&&e){const w=()=>{const C=y.value.trim();if(C){const x=C.split(",").map(S=>S.trim()).filter(Boolean);e.storage.keywordBlacklist||(e.storage.keywordBlacklist=[]),x.forEach(S=>{e.storage.keywordBlacklist.some(E=>E.toLowerCase()===S.toLowerCase())||e.storage.keywordBlacklist.push(S)}),e.storage.save(),m(),y.value=""}};v.addEventListener("click",w),y.addEventListener("keydown",C=>{C.key==="Enter"&&w()}),m()}t.querySelector("#ypp-health-scan-btn").addEventListener("click",()=>{this.runScan(t,e)}),t.querySelector("#ypp-health-unsub-btn").addEventListener("click",()=>{this.bulkUnsubscribe(t)}),t.querySelector("#ypp-health-add-folder-btn").addEventListener("click",()=>{e&&this.bulkAddToFolder(t,e)}),t.querySelector("#ypp-health-remove-folder-btn").addEventListener("click",()=>{const w=t.querySelector("#ypp-health-folder-filter-dropdown").value;w==="all"||w==="__no_folder__"||e&&this.bulkRemoveFromFolder(t,e,w)});const b=t.querySelectorAll(".ypp-health-stat"),f=t.querySelector("#ypp-health-results"),g=()=>{const w=d.value,C=p.value,x=l.value,S=t.querySelector("#ypp-health-search-input"),E=S?S.value.toLowerCase().trim():"";b.forEach(F=>{F.style.background=F.dataset.filter===w?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.05)"});const N=t.querySelector("#ypp-organizer-folders-list");N&&N.querySelectorAll("div[data-folder]").forEach(F=>{F.dataset.folder===x?(F.style.background="rgba(208,188,255,0.15)",F.style.borderLeft="3px solid #d0bcff"):(F.style.background="rgba(255,255,255,0.03)",F.style.borderLeft="1px solid rgba(255,255,255,0.05)")});const A=f.querySelectorAll(".ypp-unsub-checkbox:checked").length,Y=t.querySelector("#ypp-health-remove-folder-btn");Y&&(Y.textContent=A>0?`Remove from Folder (${A})`:"Remove from Folder",Y.disabled=A===0,x!=="all"&&x!=="__no_folder__"?Y.style.display=A>0?"inline-block":"none":Y.style.display="none");const O=Array.from(f.querySelectorAll(".ypp-channel-health-row"));O.sort((F,T)=>{if(C==="az")return F.dataset.name.localeCompare(T.dataset.name);const M=parseFloat(F.dataset.uploadTime)||1/0,L=parseFloat(T.dataset.uploadTime)||1/0;return C==="latest"?M-L:C==="oldest"?L-M:0}),O.forEach(F=>{f.appendChild(F);let T=w==="all"||F.dataset.status===w,M=!0,L=!0;E&&(L=F.dataset.name.toLowerCase().includes(E)),x!=="all"&&(x==="__no_folder__"?M=F.dataset.folders==="":M=(F.dataset.folders?F.dataset.folders.split(","):[]).includes(x)),T&&M&&L?F.style.display="flex":F.style.display="none"})};b.forEach(w=>{w.addEventListener("click",()=>{d.value=d.value===w.dataset.filter?"all":w.dataset.filter,g()}),w.addEventListener("mouseover",()=>{d.value!==w.dataset.filter&&(w.style.background="rgba(255,255,255,0.1)")}),w.addEventListener("mouseout",()=>{d.value!==w.dataset.filter&&(w.style.background="rgba(255,255,255,0.05)")})}),l.addEventListener("change",g),d.addEventListener("change",g),p.addEventListener("change",g);const _=t.querySelector("#ypp-health-search-input");_&&_.addEventListener("input",g),p.addEventListener("change",g);const P=()=>{const w=t.querySelector("#ypp-organizer-folders-list");if(!w||!e)return;w.innerHTML="";const C=Object.keys(e.storage.folders);if(C.length===0){w.innerHTML='<div style="color:rgba(255,255,255,0.4); font-size:12px; text-align:center; margin-top:20px;">No folders yet.</div>';return}C.forEach(x=>{const S=document.createElement("div");S.dataset.folder=x,S.style.cssText="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:12px; cursor:pointer; transition:all 0.2s ease;",S.innerHTML=`
                    <div style="display:flex; align-items:center; gap:12px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <span style="color:#E6E1E5; font-size:14px; font-weight:500;">${x}</span>
                    </div>
                    <span class="ypp-folder-count-badge" style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:20px; font-size:11px; font-weight:600; color:#fff;">${e.storage.folders[x].length}</span>
                `,S.addEventListener("click",()=>{const E=t.querySelector("#ypp-health-folder-filter-dropdown");E&&(E.value=E.value===x?"all":x,E.dispatchEvent(new Event("change")))}),S.addEventListener("dragover",E=>{E.preventDefault(),S.style.background="rgba(99,102,241,0.2)",S.style.borderColor="rgba(99,102,241,0.5)"}),S.addEventListener("dragleave",E=>{E.preventDefault(),S.style.background="rgba(255,255,255,0.03)",S.style.borderColor="rgba(255,255,255,0.05)"}),S.addEventListener("drop",E=>{E.preventDefault(),S.style.background="rgba(255,255,255,0.03)",S.style.borderColor="rgba(255,255,255,0.05)";const N=E.dataTransfer.getData("text/plain");if(N&&!e.storage.folders[x].includes(N)){e.storage.folders[x].push(N),e.storage.save(),P();const A=Array.from(w.children).find(Y=>Y.dataset.folder===x);if(A){const Y=A.querySelector(".ypp-folder-count-badge");Y.style.background="#22c55e",H({targets:Y,scale:[1.5,1],duration:600,easing:"spring(1, 80, 10, 0)",complete:()=>{Y.style.background="rgba(255,255,255,0.1)"}})}this.runScan(t,e,!0)}}),w.appendChild(S)})};P()}static _extractYtInitialData(e){const t=["var ytInitialData = ",'window["ytInitialData"] = ',"window.ytInitialData = "];for(const r of t){const i=e.indexOf(r);if(i!==-1){const n=i+r.length,s=e.indexOf("<\/script>",n);if(s!==-1){let o=e.slice(n,s).trim();o.endsWith(";")&&(o=o.slice(0,-1));try{return JSON.parse(o)}catch(a){console.error("ChannelHealthUI: Failed to parse ytInitialData",a)}}}}return null}static async runScan(e,t,r=!1){var o,a;const i=e.querySelector("#ypp-health-scan-btn"),n=e.querySelector("#ypp-health-results");i.textContent="Scanning...",i.disabled=!0,i.style.opacity="0.5",n.innerHTML=`
            <div id="ypp-scan-status" style="text-align:center; color:#aaa; margin-top:40px; font-size:14px;">
                <div style="margin-bottom:12px;">Fetching subscriptions list...</div>
                <div id="ypp-scan-progress" style="font-size:12px; color:#777;"></div>
            </div>`,e.querySelector("#ypp-scan-progress");const s=e.querySelector("#ypp-scan-status div");try{let l=[];const d=r&&Oe._lastScanChannels;if(d)l=Oe._lastScanChannels,s&&s.remove(),i.textContent="Updating UI...";else{const P=await this._getYoutubeConfig(),w=new Set,C=A=>{let Y=null;const O=F=>{var T,M,L,k,R,U,j;if(!(!F||typeof F!="object")){if(Array.isArray(F)){F.forEach(O);return}if(F.channelRenderer){const I=F.channelRenderer;if(!w.has(I.channelId)){w.add(I.channelId);let D="";const q=$=>{var J;if(!(!$||typeof $!="object")){if((J=$.unsubscribeEndpoint)!=null&&J.params){D=$.unsubscribeEndpoint.params;return}Object.values($).forEach(q)}};q(I.subscribeButton||I),l.push({id:I.channelId,name:((T=I.title)==null?void 0:T.simpleText)||"Unknown",icon:((k=(L=(M=I.thumbnail)==null?void 0:M.thumbnails)==null?void 0:L.pop())==null?void 0:k.url)||"",unsubParams:D})}return}if((j=(U=(R=F.continuationItemRenderer)==null?void 0:R.continuationEndpoint)==null?void 0:U.continuationCommand)!=null&&j.token){Y=F.continuationItemRenderer.continuationEndpoint.continuationCommand.token;return}Object.values(F).forEach(O)}};return O(A),Y};let x=null;const E=await(await fetch("/feed/channels")).text(),N=this._extractYtInitialData(E);for(N&&(x=C(N));x&&P&&P.apiKey;){s.textContent=`Fetching subscriptions list... (${l.length} found so far)`;try{const A=await fetch(`/youtubei/v1/browse?key=${P.apiKey}`,{method:"POST",headers:await this._getApiHeaders(P),credentials:"include",body:JSON.stringify({context:P.context,continuation:x})});if(!A.ok)break;const Y=await A.json();x=C(Y)}catch(A){(o=window.YPP.utils)==null||o.log("Failed to fetch continuation","CHANNEL-HEALTH","warn",A);break}}}if(l.length===0){n.innerHTML='<div style="text-align:center;color:rgba(255, 78, 69, 0.8);margin-top:40px;">No subscriptions found.</div>',i.textContent="Scan Complete",i.disabled=!1,i.style.opacity="1";return}n.innerHTML="",s&&s.remove();const p=Date.now(),u=30*24*60*60*1e3;let h=0,m=0,y=0,v=0;const b=()=>{e.querySelector("#ypp-health-active").textContent=h,e.querySelector("#ypp-health-warning").textContent=m,e.querySelector("#ypp-health-dead").textContent=y,i.textContent=`Scanning… ${v}/${l.length}`,y>0&&(e.querySelector("#ypp-health-unsub-btn").style.display="inline-block",e.querySelector("#ypp-health-add-folder-btn").style.display="inline-block")},f=P=>{const w=[];if(t&&t.storage&&t.storage.folders)for(const[U,j]of Object.entries(t.storage.folders))j.includes(P.name)&&w.push(U);const x={active:"#2ed573",warning:"#ffb340",dead:"#ff4e45"}[P.status]||"#94a3b8",S=document.createElement("div");S.className="ypp-channel-health-row",S.dataset.status=P.status,S.dataset.name=P.name,S.dataset.uploadTime=P.lastUpload!=null?P.lastUpload:1/0,S.dataset.folders=w.join(","),S.setAttribute("draggable","true"),S.style.cssText="display:flex;align-items:center;padding:14px 20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;border-left:4px solid "+x+";transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);animation:ypp-fade-in 0.3s ease;cursor:grab;",S.addEventListener("mouseover",()=>{S.style.background="rgba(255,255,255,0.06)",S.style.transform="translateX(4px)",S.style.borderColor="rgba(255,255,255,0.1)"}),S.addEventListener("mouseout",()=>{S.style.background="rgba(255,255,255,0.03)",S.style.transform="translateX(0)",S.style.borderColor="rgba(255,255,255,0.06)"}),S.addEventListener("dragstart",U=>{U.dataTransfer.setData("text/plain",P.name),U.dataTransfer.effectAllowed="copyMove",S.style.opacity="0.5",S.style.transform="scale(0.98)"}),S.addEventListener("dragend",()=>{S.style.opacity="1",S.style.transform="scale(1)"});const E=document.createElement("img");E.src=P.icon||"",E.style.cssText="width:36px;height:36px;border-radius:50%;margin-right:14px;flex-shrink:0;",E.onerror=function(){this.style.display="none"},S.appendChild(E);const N=document.createElement("div");N.style.cssText="flex:1;min-width:0;";const A=document.createElement("div");A.style.cssText="color:#f1f5f9;font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.2px;",A.textContent=P.name,N.appendChild(A);const Y=document.createElement("div");Y.style.cssText="color:#94a3b8;font-size:12px;margin-top:2px;font-weight:500;",Y.textContent="Last upload: ";const O=document.createElement("span");if(O.style.color=x,O.textContent=P.lastUploadText||"Unknown",Y.appendChild(O),N.appendChild(Y),w.length>0){const U=document.createElement("div");U.style.marginTop="4px",w.forEach(j=>{const I=document.createElement("span");I.style.cssText="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.05);padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;margin-right:4px;color:#cbd5e1;display:inline-block;margin-bottom:2px;",I.textContent=j,U.appendChild(I)}),N.appendChild(U)}S.appendChild(N);const F=document.createElement("div");F.style.cssText="display:flex;align-items:center;gap:12px;flex-shrink:0;";const T=document.createElement("a");T.href="/channel/"+P.id,T.target="_blank",T.style.cssText="color:#f1f5f9;text-decoration:none;font-size:13px;font-weight:600;opacity:0.6;transition:all 0.2s;",T.textContent="Visit",T.addEventListener("mouseover",()=>{T.style.opacity="1"}),T.addEventListener("mouseout",()=>{T.style.opacity="0.6"}),F.appendChild(T);const M=document.createElement("label");M.style.cssText="display:flex;align-items:center;cursor:pointer;color:#94a3b8;font-size:13px;font-weight:500;user-select:none;gap:8px;margin-left:4px;margin-right:8px;";const L=document.createElement("input");L.type="checkbox",L.className="ypp-unsub-checkbox",L.value=P.id,L.dataset.params=P.unsubParams||"",L.style.cssText="width:16px;height:16px;cursor:pointer;accent-color:#6366f1;",M.appendChild(L),M.appendChild(document.createTextNode("Select")),F.appendChild(M);const k=document.createElement("button");k.className="ypp-indiv-folder-btn",k.style.cssText="background:rgba(255,255,255,0.05);color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:6px 16px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);",k.textContent="Folders",k.addEventListener("mouseover",()=>{k.style.background="linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))",k.style.borderColor="rgba(168, 85, 247, 0.4)",k.style.transform="translateY(-1px)"}),k.addEventListener("mouseout",()=>{k.style.background="rgba(255,255,255,0.05)",k.style.borderColor="rgba(255,255,255,0.1)",k.style.transform="translateY(0)"}),k.addEventListener("click",U=>{U.stopPropagation(),t&&t.renderChannelPopover(k,P.name)}),F.appendChild(k);const R=document.createElement("button");return R.className="ypp-indiv-unsub-btn",R.style.cssText="background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.8);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:6px 16px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);",R.textContent="Unsub",R.addEventListener("mouseover",()=>{R.style.background="rgba(255,78,69,0.2)",R.style.color="#ff6b6b",R.style.borderColor="rgba(255,78,69,0.3)",R.style.transform="translateY(-1px)"}),R.addEventListener("mouseout",()=>{R.style.background="rgba(255,255,255,0.05)",R.style.color="rgba(255,255,255,0.8)",R.style.borderColor="rgba(255,255,255,0.1)",R.style.transform="translateY(0)"}),R.addEventListener("click",()=>this.individualUnsubscribe(P.id,P.unsubParams,P.name,S,R)),F.appendChild(R),S.appendChild(F),S},g=P=>{v++;const w=f(P),C=e.querySelector("#ypp-health-filter-dropdown"),x=e.querySelector("#ypp-health-folder-dropdown"),S=e.querySelector("#ypp-health-search-input");let E=!0;C&&C.value!=="all"&&P.status!==C.value&&(E=!1),E&&x&&x.value!=="all"&&(x.value==="__no_folder__"?w.dataset.folders!==""&&(E=!1):(w.dataset.folders?w.dataset.folders.split(","):[]).includes(x.value)||(E=!1)),E&&S&&S.value&&(P.name.toLowerCase().includes(S.value.toLowerCase())||(E=!1)),w.style.display=E?"flex":"none",n.appendChild(w),b()};if(d)l.forEach(P=>{P.status==="active"?h++:P.status==="warning"?m++:y++,g(P)});else{let C=0;const x=await window.YPP.StorageManager.get("ypp_channel_health_cache_v2"),E=(x?{ypp_channel_health_cache_v2:x}:{}).ypp_channel_health_cache_v2||{},N=24*60*60*1e3;let A=!1;const Y=async T=>{const M=E[T.id];if(M&&p-M.timestamp<N){T.lastUpload=p-M.pubTime,T.lastUploadText=M.lastUploadText,T.lastUpload<u?(T.status="active",h++):T.lastUpload<3*u?(T.status="warning",m++):(T.status="dead",y++),g(T);return}try{const L=new AbortController,k=setTimeout(()=>L.abort(),5e3),R=await fetch(`/feeds/videos.xml?channel_id=${T.id}`,{signal:L.signal});clearTimeout(k);const U=await R.text(),j=U.indexOf("<entry>");if(j!==-1){const D=U.substring(j).match(/<published>([^<]+)<\/published>/);if(D&&D[1]){const q=new Date(D[1]).getTime(),$=p-q;T.lastUpload=$,T.lastUploadText=new Date(q).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),E[T.id]={pubTime:q,lastUploadText:T.lastUploadText,timestamp:p},A=!0,$<u?(T.status="active",h++):$<3*u?(T.status="warning",m++):(T.status="dead",y++)}else T.status="dead",T.lastUploadText="No date",T.lastUpload=1/0,y++}else T.status="dead",T.lastUploadText="No videos",T.lastUpload=1/0,y++}catch(L){T.status=L.name==="AbortError"?"warning":"dead",T.lastUploadText=L.name==="AbortError"?"Timeout":"Error",T.lastUpload=1/0,T.status==="warning"?m++:y++}g(T)},O=async()=>{for(;C<l.length;){const T=l[C++];await Y(T)}},F=Array.from({length:Math.min(25,l.length)},()=>O());await Promise.all(F),A&&await window.YPP.StorageManager.set("ypp_channel_health_cache_v2",E),Oe._lastScanChannels=l}i.textContent=`Scan Complete (${l.length})`,i.disabled=!1,i.style.opacity="1",e._checkboxListenerAttached||(e._checkboxListenerAttached=!0,n.addEventListener("change",P=>{if(!P.target.classList.contains("ypp-unsub-checkbox"))return;const w=n.querySelectorAll(".ypp-unsub-checkbox:checked").length,C=e.querySelector("#ypp-health-unsub-btn"),x=e.querySelector("#ypp-health-add-folder-btn"),S=e.querySelector("#ypp-health-remove-folder-btn"),E=e.querySelector("#ypp-health-folder-filter-dropdown").value;C.textContent=w>0?`Unsubscribe Selected (${w})`:"Unsubscribe Selected",x.textContent=w>0?`Add to Folder (${w})`:"Add to Folder",C.disabled=w===0,x.disabled=w===0,S&&(S.textContent=w>0?`Remove from Folder (${w})`:"Remove from Folder",S.disabled=w===0,E!=="all"&&E!=="__no_folder__"?S.style.display=w>0?"inline-block":"none":S.style.display="none")}));const _=e.querySelector("#ypp-health-filter-dropdown");_&&_.dispatchEvent(new Event("change"))}catch(l){(a=window.YPP.Utils)==null||a.log("Scan error","CHANNEL-HEALTH","error",l),n.innerHTML='<div style="text-align:center;color:rgba(255,255,255,0.8);margin-top:40px;font-size:14px;">Scan failed: '+(l.message||"Unknown error")+"</div>",i.textContent="Retry Scan",i.disabled=!1,i.style.opacity="1"}}static _getYoutubeConfig(){return new Promise(e=>{const t=Math.random().toString(36).slice(2);let r=!1;const i=n=>{n.data&&n.data.type==="YPP_YTCFG_RESPONSE"&&n.data.reqId===t&&(window.removeEventListener("message",i),r||(r=!0,e(n.data.config)))};if(window.addEventListener("message",i),setTimeout(()=>{var n;r||(r=!0,window.removeEventListener("message",i),(n=window.YPP.Utils)==null||n.log("_getYoutubeConfig timed out. Returning empty config.","CHANNEL-HEALTH","warn"),e({}))},1500),!document.getElementById("ypp-ytcfg-bridge")){const n=document.createElement("script");n.id="ypp-ytcfg-bridge",n.src=chrome.runtime.getURL("src/inject/ytcfg-bridge.js"),document.documentElement.appendChild(n)}setTimeout(()=>{window.postMessage({type:"YPP_YTCFG_REQUEST",reqId:t},"*")},50)})}static async _getApiHeaders(e){const t=window.location.origin,r=Math.floor(Date.now()/1e3),i=async p=>{const u=new TextEncoder().encode(p),h=await crypto.subtle.digest("SHA-1",u);return Array.from(new Uint8Array(h)).map(m=>m.toString(16).padStart(2,"0")).join("")},n=p=>{const u=document.cookie.match(new RegExp("(?:^|; )"+p.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"=([^;]*)"));return u?u[1]:null},s=n("SAPISID"),o=n("__Secure-1PAPISID"),a=n("__Secure-3PAPISID"),l=[];s&&l.push(`SAPISIDHASH ${r}_${await i(`${r} ${s} ${t}`)}`),o&&l.push(`SAPISID1PHASH ${r}_${await i(`${r} ${o} ${t}`)}`),a&&l.push(`SAPISID3PHASH ${r}_${await i(`${r} ${a} ${t}`)}`);const d={"Content-Type":"application/json","X-YouTube-Client-Name":"1","X-YouTube-Client-Version":e.clientVersion||"2.20240101.01.00","X-Origin":t,"X-Goog-Visitor-Id":e.visitorData||""};return e.sessionIndex!=null&&(d["X-Goog-AuthUser"]=String(e.sessionIndex)),e.pageId&&(d["X-Goog-PageId"]=String(e.pageId)),l.length&&(d.Authorization=l.join(" ")),d}static async _tryApiUnsubscribe(e,t){var n,s;const r=await this._getApiHeaders(t),i=async o=>{const a={context:t.context,channelIds:[e.id]};o&&e.params&&(a.params=e.params);const l=await fetch(`/youtubei/v1/subscription/unsubscribe?key=${t.apiKey}`,{method:"POST",headers:r,credentials:"include",body:JSON.stringify(a)}),d=await l.json().catch(()=>({}));return{ok:l.ok&&!d.error,status:l.status,data:d}};try{let o=await i(!0);if(o.ok||!o.ok&&e.params&&(o=await i(!1),o.ok))return!0;(n=window.YPP.Utils)==null||n.log(`API unsubscribe failed for ${e.id}: HTTP ${o.status}`,"CHANNEL-HEALTH","warn",o.data)}catch(o){(s=window.YPP.Utils)==null||s.log("API unsubscribe exception","CHANNEL-HEALTH","error",o)}return!1}static async _tryNativeDomUnsubscribe(e){var t,r;try{const i=document.querySelectorAll(`ytd-subscribe-button-renderer[channel-id="${e}"], [channel-id="${e}"] ytd-subscribe-button-renderer`),n=["yt-button-shape button",".yt-spec-button-shape-next","tp-yt-paper-button","button"];for(const s of i){let o=null;for(const p of n)if(o=s.querySelector(p),o)break;if(!o)continue;const a=(o.textContent||o.getAttribute("aria-label")||"").toLowerCase().trim(),l=o.querySelector(".yt-core-attributed-string"),d=l?l.textContent.toLowerCase().trim():"";if(a==="subscribed"||a==="unsubscribe"||a.includes("subscribed")||d==="subscribed"||d==="unsubscribe"||d.includes("subscribed")){o.click(),await new Promise(u=>setTimeout(u,800));const p=["yt-confirm-dialog-renderer #confirm-button button","yt-confirm-dialog-renderer yt-button-shape button","yt-confirm-dialog-renderer [dialog-confirm] button","yt-confirm-dialog-renderer button","tp-yt-paper-dialog .buttons tp-yt-paper-button:last-of-type",'[aria-label="Unsubscribe"]','yt-button-shape button[aria-label="Unsubscribe"]'];for(const u of p){const h=document.querySelector(u);if(h)return h.click(),(t=window.YPP.Utils)==null||t.log(`Native DOM unsubscribe succeeded for ${e}`,"CHANNEL-HEALTH","debug"),!0}}}}catch(i){(r=window.YPP.Utils)==null||r.log("Native DOM unsubscribe failed","CHANNEL-HEALTH","warn",i)}return!1}static async _tryFreshApiUnsubscribe(e,t){var i;const r=[`/channel/${e}`,`/@${e}`];for(const n of r)try{const s=await fetch(n);if(!s.ok)continue;const o=await s.text(),a=this._extractYtInitialData(o);if(a){let l=null;const d=p=>{var u;if(!l&&!(!p||typeof p!="object")){if((u=p.unsubscribeEndpoint)!=null&&u.params){l=p.unsubscribeEndpoint.params;return}Object.values(p).forEach(d)}};if(d(a),l)return await this._tryApiUnsubscribe({id:e,params:l},t)}}catch(s){(i=window.YPP.utils)==null||i.log(`Fresh API unsub error for ${n}`,"CHANNEL-HEALTH","warn",s)}return!1}static async _tryIframeUnsubscribe(e){return new Promise(t=>{const r=document.createElement("iframe");r.style.cssText="width:300px;height:300px;opacity:0.01;position:fixed;bottom:0;right:0;pointer-events:none;z-index:9999;border:0;",r.src=`/channel/${e}`;let i=!1,n=setTimeout(()=>{i||(i=!0,r.remove(),t(!1))},12e3);r.onload=async()=>{try{const s=r.contentDocument||r.contentWindow.document;let o=null;for(let a=0;a<30;a++){const l=s.querySelector("ytd-subscribe-button-renderer");if(l&&(o=l.querySelector("button"),o&&o.offsetParent!==null))break;await new Promise(d=>setTimeout(d,200))}if(o){const a=(o.textContent||o.getAttribute("aria-label")||"").toLowerCase();if(a.includes("subscribed")||a.includes("unsubscribe")){o.click(),await new Promise(l=>setTimeout(l,500));for(let l=0;l<15;l++){const d=s.querySelector('yt-confirm-dialog-renderer #confirm-button button, yt-button-shape[id="confirm-button"] button');if(d){d.click(),await new Promise(p=>setTimeout(p,500)),i||(i=!0,clearTimeout(n),r.remove(),t(!0));return}await new Promise(p=>setTimeout(p,200))}}}}catch{}i||(i=!0,clearTimeout(n),r.remove(),t(!1))},document.body.appendChild(r)})}static async _doUnsubscribe(e){var n,s,o;const t=await this._getYoutubeConfig();if(!t.apiKey||!t.context)return await window.YPP.features.CustomDialog.alert("Auth Error",`Could not retrieve YouTube session credentials.
Please refresh the page and try again.`),0;let r=0;const i=[];for(const a of e){let l=await this._tryApiUnsubscribe(a,t);l||((n=window.YPP.Utils)==null||n.log(`API failed for ${a.name||a.id}, trying Fresh API...`,"CHANNEL-HEALTH","warn"),l=await this._tryFreshApiUnsubscribe(a.id,t)),l||((s=window.YPP.Utils)==null||s.log(`Fresh API failed for ${a.name||a.id}, trying native DOM...`,"CHANNEL-HEALTH","warn"),l=await this._tryNativeDomUnsubscribe(a.id)),l||((o=window.YPP.Utils)==null||o.log(`Native DOM failed for ${a.name||a.id}, trying iframe simulator...`,"CHANNEL-HEALTH","warn"),l=await this._tryIframeUnsubscribe(a.id)),l?(r++,a.onSuccess&&a.onSuccess()):i.push(a.name||a.id)}if(i.length>0){const a=i.slice(0,5).join(", "),l=i.length>5?` and ${i.length-5} more`:"";await window.YPP.features.CustomDialog.alert(`${i.length} Unsubscribe(s) Failed`,`Could not unsubscribe from:
${a}${l}.

YouTube may have rate-limited the request. Try again in a moment or visit those channel pages directly.`)}return r}static async individualUnsubscribe(e,t,r,i,n){var l;if(!await window.YPP.features.CustomDialog.confirm("Unsubscribe",`Unsubscribe from ${r}?`,"Unsubscribe",!0))return;const o=n.textContent;n.textContent="Unsubscribing...",n.disabled=!0;const a=(d,p)=>{n.textContent=d,n.disabled=!1,p&&(n.style.color=p,n.style.borderColor=p)};try{const d=await this._getYoutubeConfig();if(!d.apiKey||!d.context){a(o,null),await window.YPP.features.CustomDialog.alert("Auth Error","Could not get YouTube credentials. Please refresh and try again.");return}let p=await this._tryApiUnsubscribe({id:e,params:t,name:r},d);if(p||(p=await this._tryFreshApiUnsubscribe(e,d)),p||(p=await this._tryNativeDomUnsubscribe(e)),p||(p=await this._tryIframeUnsubscribe(e)),p){i.style.transition="opacity 0.4s ease",i.style.opacity="0.35",n.textContent="✓ Unsubscribed",n.style.color="rgba(255, 255, 255, 0.8)",n.style.borderColor="rgba(255, 255, 255, 0.8)",n.disabled=!0;const u=i.querySelector(".ypp-unsub-checkbox");u&&(u.disabled=!0,u.checked=!1),setTimeout(()=>{i.style.maxHeight=i.offsetHeight+"px",i.style.overflow="hidden",i.style.transition="max-height 0.4s ease, opacity 0.4s ease, margin 0.4s ease",requestAnimationFrame(()=>{i.style.maxHeight="0",i.style.opacity="0",i.style.marginBottom="0"}),setTimeout(()=>i.remove(),450)},1200)}else a(o,"rgba(255, 255, 255, 0.8)"),setTimeout(()=>a(o,null),3e3),await window.YPP.features.CustomDialog.alert("Unsubscribe Failed",`Could not unsubscribe from ${r}.

YouTube may have blocked the request. Try visiting the channel page directly.`)}catch(d){(l=window.YPP.Utils)==null||l.log("individualUnsubscribe error","CHANNEL-HEALTH","error",d),a(o,null)}}static async bulkUnsubscribe(e){const t=e.querySelectorAll(".ypp-unsub-checkbox:checked");if(t.length===0||!await window.YPP.features.CustomDialog.confirm("Bulk Unsubscribe",`Are you sure you want to permanently unsubscribe from ${t.length} channels?`,"Unsubscribe",!0))return;const r=e.querySelector("#ypp-health-unsub-btn");r.textContent="Unsubscribing...",r.disabled=!0;const i=Array.from(t).map(s=>({id:s.value,params:s.dataset.params,onSuccess:()=>{const o=s.closest(".ypp-channel-health-row");o.style.opacity="0.3",s.disabled=!0,s.checked=!1;const a=o.querySelector(".ypp-indiv-unsub-btn");a&&(a.disabled=!0,a.textContent="Unsubscribed")}})),n=await this._doUnsubscribe(i);r.textContent=`Unsubscribed ${n}`,setTimeout(()=>{r.style.display="none"},2e3)}static async bulkRemoveFromFolder(e,t,r){const i=e.querySelectorAll(".ypp-unsub-checkbox:checked");if(i.length===0)return;const n=e.querySelector("#ypp-health-remove-folder-btn"),s=n.textContent;n.textContent="Removing...",n.disabled=!0;const o=Array.from(i).map(l=>({id:l.value,name:l.closest(".ypp-channel-health-row").dataset.name}));let a=0;o.forEach(l=>{t.storage.removeChannelFromFolder(l.name,r)&&a++}),a>0?(t.storage.save(),Oe.runScan(e,t,!0)):(n.textContent=s,n.disabled=!1)}static async bulkAddToFolder(e,t){const r=e.querySelectorAll(".ypp-unsub-checkbox:checked");if(r.length===0)return;const i=e.querySelector("#ypp-health-add-folder-btn"),n=document.getElementById("ypp-health-folder-popup");n&&n.remove();const s=Object.keys(t.storage.folders);if(s.length===0){await window.YPP.features.CustomDialog.alert("No Folders","You have not created any folders yet. Please create one from the subscriptions feed.");return}const o=document.createElement("div");o.id="ypp-health-folder-popup",o.style.cssText=`
            position: absolute;
            top: ${i.offsetTop+i.offsetHeight+8}px;
            left: ${i.offsetLeft}px;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 8px 0;
            min-width: 200px;
            box-shadow: 0 12px 32px rgba(0,0,0,0.5);
            z-index: 10000;
            animation: ypp-fade-in 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `,s.forEach(l=>{const d=document.createElement("div");d.style.cssText="padding: 10px 16px; color: #fff; cursor: pointer; transition: 0.2s; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px;",d.innerHTML=String.raw`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> ${l}`,d.addEventListener("mouseover",()=>d.style.background="rgba(255,255,255,0.1)"),d.addEventListener("mouseout",()=>d.style.background="transparent"),d.addEventListener("click",()=>{const p=Array.from(r).map(b=>({id:b.value,name:b.closest(".ypp-channel-health-row").dataset.name}));let u=0,h=!1;const m=t.orchestrator.getActiveFolder();p.forEach(b=>{if(t.storage.addChannelToFolder(b.name,l)){u++,(m===l||m==="__no_folder__")&&(h=!0);const f=document.querySelector(`.ypp-channel-health-row[data-name="${CSS.escape(b.name)}"]`);if(f){let g=f.dataset.folders?f.dataset.folders.split(",").filter(P=>P):[];g.includes(l)||(g.push(l),f.dataset.folders=g.join(","));const _=f.querySelector(".ypp-unsub-checkbox");_&&(_.checked=!1)}}}),h&&t.orchestrator.forceRefreshFeed();const y=document.getElementById("ypp-health-folder-filter-dropdown");y&&y.dispatchEvent(new Event("change")),t.renderGuideFolders&&t.renderGuideFolders(),t.renderFilterChips&&t.renderFilterChips(),Oe.runScan(e,t,!0),o.remove();const v=i.textContent;i.textContent=`Added ${u} to ${l}`,i.style.background="rgba(76, 175, 80, 0.15)",i.style.color="#4caf50",i.style.borderColor="rgba(76, 175, 80, 0.3)",setTimeout(()=>{i.textContent=v,i.style.background="rgba(255, 255, 255, 0.1)",i.style.color="#fff",i.style.borderColor="rgba(255, 255, 255, 0.2)"},3e3)}),o.appendChild(d)}),i.parentNode.appendChild(o);const a=l=>{!o.contains(l.target)&&l.target!==i&&(o.remove(),document.removeEventListener("click",a))};setTimeout(()=>document.addEventListener("click",a),0)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ContextMenu=class extends window.YPP.features.BaseFeature{getConfigKey(){return"contextMenu"}constructor(){super("contextMenu"),this.isActive=!1,this.observer=window.YPP.sharedObserver||new window.YPP.Utils.DOMObserver,this._messageListener=this._handleMessage.bind(this)}enable(){var e;try{this.init()}catch(t){(e=this.utils)==null||e.log("Error enabling ContextMenu","CONTEXTMENU","error",t)}}disable(){chrome.runtime.onMessage.removeListener(this._messageListener),this.observer.unregister("context-menu-cards"),this.observer.unregister("context-menu-header"),this.observer.stop(),document.querySelectorAll(".ypp-add-to-group-btn").forEach(e=>e.remove()),this.cleanupEvents()}onPageChange(){document.querySelectorAll("[data-ypp-processed]").forEach(e=>{e.matches("ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer")&&e.removeAttribute("data-ypp-processed")})}init(){this.observer.start(),chrome.runtime.onMessage.addListener(this._messageListener),this.observer.register("context-menu-cards","ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer",e=>{this.isActive&&e.forEach(t=>this.injectButton(t))}),this.observer.register("context-menu-header","#inner-header-container #buttons",()=>{this.isActive&&window.YPP.Utils.isChannelPage()&&this.injectChannelHeaderButton()})}_handleMessage(e,t,r){if(e.action==="SHOW_GROUP_SELECTOR"&&e.channelIdentifier&&this.isActive){const i=window.innerWidth/2-75,n=window.innerHeight/2-50;this.showGroupSelector(e.channelIdentifier,i,n),r({success:!0})}}injectButton(e){if(e.hasAttribute("data-ypp-processed")||(e.setAttribute("data-ypp-processed","true"),e.querySelector(".ypp-add-to-group-btn")))return;const t=e.querySelector("#metadata-line")||e.querySelector(".ytd-video-meta-block");if(!t)return;const r=document.createElement("button");r.className="ypp-add-to-group-btn",r.textContent="+",r.title="Add to Group",r.style.cssText=`
            margin-left: 8px;
            background: transparent;
            border: 1px solid currentColor;
            color: var(--yt-spec-text-secondary);
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 14px;
            line-height: 1;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        `,this.addListener(r,"mouseenter",()=>r.style.opacity="1"),this.addListener(r,"mouseleave",()=>r.style.opacity="0.6"),this.addListener(r,"click",i=>{i.stopPropagation(),i.preventDefault(),this.handleCardClick(e,i)}),t.appendChild(r)}injectChannelHeaderButton(){const e=document.querySelector("#inner-header-container #buttons");if(!e||document.getElementById("ypp-channel-add-btn"))return;const t=document.createElement("button");t.id="ypp-channel-add-btn",t.className="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m",t.textContent="Add to Group",t.style.marginRight="8px",this.addListener(t,"click",r=>{const i=document.querySelector("#inner-header-container #text"),n=i?i.textContent.trim():"Unknown";this.showGroupSelector(n,r.clientX,r.clientY)}),e.prepend(t)}handleCardClick(e,t){const r=e.querySelector("#text.ytd-channel-name")||e.querySelector(".ytd-channel-name"),i=r?r.textContent.trim():null;i&&this.showGroupSelector(i,t.clientX,t.clientY)}showGroupSelector(e,t,r){const i=document.querySelector(".ypp-group-selector-popup");i&&i.remove();const n=document.createElement("div");n.className="ypp-group-selector-popup",n.style.cssText=`
            position: fixed;
            top: ${r}px;
            left: ${t}px;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            border-radius: 12px;
            padding: 8px;
            z-index: 9999;
            box-shadow: 0 12px 32px rgba(0,0,0,0.5);
            min-width: 150px;
        `,n.innerHTML=`<div style="padding:4px 8px; font-weight:bold; font-size:12px; opacity:0.7">Add ${e} to...</div>`,window.YPP.StorageManager.get("ypp_subscription_folders").then(s=>{const a=Object.keys(s||{});a.length===0?n.innerHTML+='<div style="padding:8px; font-size:12px">No folders created. Go to Subscriptions to manage folders.</div>':a.forEach(l=>{const d=document.createElement("div");d.textContent=l,d.style.cssText=`
                        padding: 6px 8px;
                        cursor: pointer;
                        font-size: 13px;
                        border-radius: 4px;
                    `,d.onmouseenter=()=>d.style.backgroundColor="rgba(255,255,255,0.1)",d.onmouseleave=()=>d.style.backgroundColor="transparent",d.onclick=async()=>{const u=await window.YPP.StorageManager.get("ypp_subscription_folders")||{};u[l]||(u[l]=[]),u[l].includes(e)?window.YPP.Utils.createToast(`Already in ${l}`,"info"):(u[l].push(e),await window.YPP.StorageManager.set("ypp_subscription_folders",u),window.YPP.Utils.createToast(`Added to ${l}`,"success")),n.remove()},n.appendChild(d)}),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const l=d=>{n.contains(d.target)||(n.remove(),document.removeEventListener("click",l))};this.addListener(document,"click",l)})})}),document.body.appendChild(n)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SubscriptionFolders=(he=class extends window.YPP.features.BaseFeature{constructor(){var e,t;super("SubscriptionFolders"),this.enabled=!1,this.initialized=!1,this.activeFolder=null,this._isFeedPage=!1,this.hideShortsActive=!1,this.hideWatchedActive=!1,this._durationFilter="all",this._dateFilter="all",this._sortFilter="latest",this.activeChannelSet=new Set,this.storage=new window.YPP.features.FolderStorage,this.ui=new window.YPP.features.FolderUI(this.storage,this),this._boundHandleNav=()=>this.handleNavigation(),this._boundHandlePopstate=()=>{var r;return(r=window.YPP.events)==null?void 0:r.on("app:pageChange",this._boundHandleNav)},this._debouncedApplyFilters=window.YPP.Utils.debounce(()=>this._applyFeedFiltersNow(),50),this._filterChangedUnsub=(e=window.YPP.events)==null?void 0:e.on("subscriptions:filter-changed",r=>{this._durationFilter=r.duration||"all",this._dateFilter=r.date||"all",this._sortFilter=r.sort||"latest",this.updateFilterState()}),this._storageChangedUnsub=(t=window.YPP.events)==null?void 0:t.on("storage:changed:ypp_subscription_folders",async r=>{r&&(this.storage.folders=r,this.activeFolder&&this.forceRefreshFeed())})}getConfigKey(){return null}async enable(){if(this.enabled=this.settings.subscriptionFolders!==!1||this.settings.enableFilterBar!==!1||this.settings.enableChannelHealth!==!1,!this.enabled){this.disable();return}if(this.initialized){this.handleNavigation();return}await this.storage.load(),this._injectGridCSS(),this.setupNavigationListener(),this.handleNavigation(),this.initialized=!0}async onUpdate(){await this.enable()}_injectGridCSS(){if(document.getElementById("ypp-sub-grid-override"))return;const e=document.createElement("style");e.id="ypp-sub-grid-override",e.textContent=`
            /* Completely flatten YouTube's rigid row structure */
            ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer #contents > ytd-rich-grid-row {
                display: contents !important;
            }

            /* Take over the main contents container and make it a fluid CSS Grid */
            ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer > #contents {
                display: grid !important;
                grid-template-columns: repeat(var(--ypp-subscriptions-columns, 4), minmax(0, 1fr)) !important;
                grid-gap: 16px !important;
                width: 100% !important;
            }

            /* Ensure items stretch to fill the grid cells */
            ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer {
                margin: 0 !important;
                width: 100% !important;
                max-width: none !important;
            }
        `,document.head.appendChild(e)}shouldRunOnCurrentPage(){const e=window.location.pathname;return e.startsWith("/feed/subscriptions")||e.startsWith("/feed/channels")||e.startsWith("/@")||/^\/channel\//.test(e)}async init(e){e!=null&&e.aborted||(this._injectNetworkInterceptor(),await this.update(this.settings),e!=null&&e.aborted&&this._teardown())}_injectNetworkInterceptor(){if(document.getElementById("ypp-network-interceptor"))return;const e=document.createElement("script");e.id="ypp-network-interceptor",e.src=chrome.runtime.getURL("src/inject/networkInterceptor.js"),(document.head||document.documentElement).appendChild(e)}_teardown(){var e;(e=this._debouncedApplyFilters)!=null&&e.cancel&&this._debouncedApplyFilters.cancel(),this._filterChangedUnsub&&(this._filterChangedUnsub(),this._filterChangedUnsub=null),this._storageChangedUnsub&&(this._storageChangedUnsub(),this._storageChangedUnsub=null),this.disable()}async disable(){var i,n,s,o,a,l,d,p,u,h,m,y,v,b,f;await super.disable(),(i=this._debouncedApplyFilters)!=null&&i.cancel&&this._debouncedApplyFilters.cancel(),this._filterChangedUnsub&&(this._filterChangedUnsub(),this._filterChangedUnsub=null),this._storageChangedUnsub&&(this._storageChangedUnsub(),this._storageChangedUnsub=null),(n=this.ui)!=null&&n._popoverClickOutsideHandler&&(document.removeEventListener("click",this.ui._popoverClickOutsideHandler),this.ui._popoverClickOutsideHandler=null,this.ui._popoverListenerAttached=!1),(o=(s=this.ui)==null?void 0:s.removeGuideFolders)==null||o.call(s),(l=(a=this.ui)==null?void 0:a.removeFilterChips)==null||l.call(a);const e=document.getElementById("ypp-sub-grid-override");e&&e.remove();const t=document.getElementById("ypp-folder-popover");t&&t.remove();const r=document.getElementById("ypp-health-modal");r&&r.remove(),document.querySelectorAll(".ypp-card-folder-btn, .ypp-feed-folder-indicator").forEach(g=>g.remove()),(d=document.getElementById("ypp-channel-folder-btn"))==null||d.remove(),(u=(p=this.observer)==null?void 0:p.unregister)==null||u.call(p,"feed-card-badges"),(m=(h=this.observer)==null?void 0:h.unregister)==null||m.call(h,"channel-badge"),(v=(y=this.observer)==null?void 0:y.unregister)==null||v.call(y,"fallback-navigation"),(f=(b=this.observer)==null?void 0:b.unregister)==null||f.call(b,"feed-filter-loop"),document.querySelectorAll("ytd-rich-item-renderer.ypp-filtered-out").forEach(g=>{g.classList.remove("ypp-filtered-out"),g.style.display=""}),this.initialized=!1}setupNavigationListener(){this.handleNavigation(),this.addListener(window,"yt-navigate-finish",this._boundHandleNav),this.addListener(window,"popstate",this._boundHandlePopstate),this.observer.register("fallback-navigation","ytd-app",()=>{var e;((e=this.settings)==null?void 0:e.enableSubsManager)!==!1&&!document.getElementById("ypp-sub-folders-container")&&this.ui.injectGuideFolders(),this._isFeedPage&&!document.getElementById("ypp-folder-chips")&&this.setupFeedFilters()})}handleNavigation(){var t;if(!this.enabled)return;const e=window.location.href;((t=this.settings)==null?void 0:t.enableSubsManager)!==!1?this.ui.injectGuideFolders():this.ui.removeGuideFolders(),this.ui.injectCardBadges(),e.includes("/feed/subscriptions")?(this._isFeedPage=!0,this.setupFeedFilters()):(this._isFeedPage=!1,this.clearFeedFilters()),(e.includes("/channel/")||e.includes("/@"))&&this.ui.injectChannelBadge()}isFeedPage(){return this._isFeedPage}getActiveFolder(){return this.activeFolder}getHideShorts(){return this.hideShortsActive}getHideWatched(){return this.hideWatchedActive}setHideShorts(e){this.hideShortsActive=e}setHideWatched(e){this.hideWatchedActive=e}setActiveFolder(e,t=!1){if(!e)this.activeFolder=null;else if(t&&this.activeFolder&&this.activeFolder!=="__no_folder__"){let r=this.activeFolder.split(",").map(i=>i.trim());r.includes(e)?r=r.filter(i=>i!==e):r.push(e),this.activeFolder=r.length>0?r.join(","):null}else this.activeFolder===e?this.activeFolder=null:this.activeFolder=e;this._onFolderChanged()}setActiveFolderDirect(e){this.activeFolder=e||null,this._onFolderChanged()}_onFolderChanged(){const e=document.getElementById("ypp-folder-select");e&&(e.value=this.activeFolder||""),this.ui.rebuildChipsContent(),this.updateFilterState()}forceRefreshFeed(){if(this.activeFolder){let e=[];if(this.activeFolder!=="__no_folder__"){const t=this.activeFolder.split(",").map(r=>r.trim());for(const r of t)this.storage.folders[r]&&e.push(...this.storage.folders[r])}this.activeChannelSet=new Set(e),this.applyFeedFilters()}}_isAnyFilterActive(){var n;const e=Object.values(this.ffActiveChips||{}).some(s=>s!=="neutral"&&s!=="all"),t=((n=this.ffActiveChips)==null?void 0:n.all)==="show",r=!!(this.ffActiveSearch&&this.ffActiveSearch.trim()!==""),i=this.ffActiveWatch&&this.ffActiveWatch!=="all";return this.activeFolder||this._durationFilter!=="all"||this._dateFilter!=="all"||this._sortFilter!=="latest"||e||r||i||!t&&Object.keys(this.ffActiveChips||{}).length>0||this.storage.keywordBlacklist&&this.storage.keywordBlacklist.length>0}setupFeedFilters(){if(!document.getElementById("ypp-filter-styles")){const r=document.createElement("style");r.id="ypp-filter-styles",r.textContent=`
                ytd-rich-item-renderer[data-ypp-hidden="true"],
                ytd-video-renderer[data-ypp-hidden="true"],
                ytd-grid-video-renderer[data-ypp-hidden="true"] {
                    display: none !important;
                }

                /* CSS trick to make filtering "instant" without breaking thumbnail lazy-loading.
                   opacity: 0 keeps the bounding box intact so YouTube's IntersectionObserver can load images,
                   but prevents the user from seeing a flash of videos before JS evaluates them. */
                body.ypp-feed-filters-active ytd-rich-item-renderer:not([data-ypp-filter-checked="true"]) {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `,document.head.appendChild(r)}const e=sessionStorage.getItem("ypp_pending_play_all"),t=sessionStorage.getItem("ypp_pending_folder");e?(this.activeFolder=e,sessionStorage.removeItem("ypp_pending_play_all"),window.YPP.Utils.pollFor(()=>document.querySelector("ytd-rich-grid-renderer"),1e4,200).then(()=>this.playAll(e)).catch(()=>this.playAll(e))):t&&(this.activeFolder=t,sessionStorage.removeItem("ypp_pending_folder")),this.ui.renderFilterChips(),this.updateFilterState(),this.observer.register("feed-filter-loop",he.SELECTORS.FEED_CARDS,()=>{this._isAnyFilterActive()&&this._debouncedApplyFilters()})}clearFeedFilters(){this.activeFolder=null,document.body.classList.remove("ypp-sub-folders-active"),this.ui.removeFilterChips()}updateFilterState(){if(this._isFeedPage){if(localStorage.setItem("ypp_active_folder",this.activeFolder||""),localStorage.setItem("ypp_folder_data",JSON.stringify(this.storage.folders||{})),this._isAnyFilterActive()?(document.body.classList.add("ypp-feed-filters-active"),document.querySelectorAll('ytd-rich-item-renderer[data-ypp-filter-checked="true"]').forEach(e=>{e.removeAttribute("data-ypp-filter-checked")})):document.body.classList.remove("ypp-feed-filters-active"),this.activeFolder){document.body.classList.add("ypp-sub-folders-active");let e=[];if(this.activeFolder!=="__no_folder__"){const t=this.activeFolder.split(",").map(r=>r.trim());for(const r of t)this.storage.folders[r]&&e.push(...this.storage.folders[r])}this.activeChannelSet=new Set(e)}else document.body.classList.remove("ypp-sub-folders-active"),this.activeChannelSet=new Set;this._isAnyFilterActive()?this.applyFeedFilters():this.resetFeedVisibility()}}applyFeedFilters(){this._debouncedApplyFilters()}_parseDurationSeconds(e){const t=e.querySelector("ytd-thumbnail-overlay-time-status-renderer");if(!t)return null;const i=t.textContent.trim().replace(/\s+/g,"").split(":").map(Number);return i.length===2?i[0]*60+i[1]:i.length===3?i[0]*3600+i[1]*60+i[2]:null}_parseDateScore(e){const t=e.querySelector("#metadata-line, .inline-metadata-item, #metadata");if(!t)return 0;const r=t.textContent.toLowerCase().trim();if(r.includes("hour")||r.includes("minute")||r.includes("second")||r.includes("just now"))return 4;if(r.includes("day")&&!r.includes("week")){const i=r.match(/(\d+)\s*day/),n=i?parseInt(i[1]):1;return n<=7?3:n<=30?2:1}if(r.includes("week")){const i=r.match(/(\d+)\s*week/);return(i?parseInt(i[1]):1)<=4?2:1}return r.includes("month")?1:0}_parseDaysAgo(e){const t=e.querySelector("#metadata-line, .inline-metadata-item, #metadata");if(!t)return 9999;const r=t.textContent.toLowerCase().trim(),i=r.match(/(\d+)\s*(minute|hour|day|week|month|year)/);if(r.includes("just now")||r.includes("second"))return 0;if(i){const n=parseInt(i[1])||1,s=i[2];if(s==="minute"||s==="hour")return 0;if(s==="day")return n;if(s==="week")return n*7;if(s==="month")return n*30;if(s==="year")return n*365}return 9999}_matchesDurationFilter(e){if(this._durationFilter==="all")return!0;const t=this._parseDurationSeconds(e);if(t===null)return!0;if(this._durationFilter.startsWith("custom:")){const r=parseInt(this._durationFilter.split(":")[1],10);return t<=r*60}switch(this._durationFilter){case"short":return t<300;case"medium":return t>=300&&t<=1200;case"long":return t>1200;default:return!0}}_matchesDateFilter(e){if(this._dateFilter==="all")return!0;if(this._dateFilter.startsWith("custom:")){const r=parseInt(this._dateFilter.split(":")[1],10);return this._parseDaysAgo(e)<=r}const t=this._parseDateScore(e);switch(this._dateFilter){case"today":return t>=4;case"week":return t>=3;case"month":return t>=2;default:return!0}}_applySortOrder(e){if(this._sortFilter==="latest")return;const t=[...e.querySelectorAll('ytd-rich-item-renderer:not([style*="display: none"])')];t.sort((r,i)=>this._sortFilter==="oldest"?this._parseDateScore(r)-this._parseDateScore(i):this._sortFilter==="longest"?(this._parseDurationSeconds(i)||0)-(this._parseDurationSeconds(r)||0):this._sortFilter==="shortest"?(this._parseDurationSeconds(r)||0)-(this._parseDurationSeconds(i)||0):0),t.forEach(r=>e.appendChild(r))}applyFeedFilters(){this._filterTimeout&&cancelAnimationFrame(this._filterTimeout),this._filterTimeout=requestAnimationFrame(()=>{this._applyFeedFiltersNow()})}_applyFeedFiltersNow(){const e=document.querySelector('ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer #contents');if(!e)return;const t=e.querySelectorAll("ytd-rich-item-renderer");if(!t||t.length===0)return;const r=this.activeFolder&&this.activeFolder!=="__no_folder__"?new Set([...this.activeChannelSet].map(o=>this._normChannel(o))):null,i=this.ffActiveChips||{},n=this.ffActiveWatch||"all",s=(this.ffActiveSearch||"").toLowerCase();t.forEach(o=>{var Y;const a=o.querySelector("#channel-name a, ytd-channel-name a"),l=o.querySelector("#video-title, #video-title-link"),d=o.querySelector("ytd-thumbnail-overlay-time-status-renderer"),p=o.querySelector("#metadata-line, .inline-metadata-item, #metadata"),u=o.querySelector("ytd-badge-supported-renderer, .badge-shape-wiz__text"),h=((l==null?void 0:l.textContent)||"").toLowerCase(),m=((a==null?void 0:a.textContent)||"").trim(),y=((p==null?void 0:p.textContent)||"").toLowerCase(),v=((u==null?void 0:u.textContent)||"").toLowerCase(),b=(d==null?void 0:d.getAttribute("overlay-style"))==="SHORTS"||o.querySelector("ytd-shorts-lockup-view-model")!==null,f=v.includes("live")&&!y.includes("streamed"),g=y.includes("streamed"),_=v.includes("premiere")||y.includes("premieres")||y.includes("scheduled"),P=o.querySelector("ytd-post-renderer, ytd-shared-post-renderer")!==null,w=o.querySelector("ytd-playlist-renderer")!==null,C=!f&&!g&&!_&&!b&&!P&&!w,x=o.querySelector("ytd-subscription-notification-toggle-button-renderer button"),S=((Y=x==null?void 0:x.getAttribute("aria-label"))==null?void 0:Y.toLowerCase().includes("all"))||!1,N=o.querySelector("#progress, .ytd-thumbnail-overlay-resume-playback-renderer")!==null;let A=!0;if(r&&A){const O=this._normChannel(m);O&&!r.has(O)&&(A=!1)}if(A&&!this._matchesDurationFilter(o)&&(A=!1),A&&!this._matchesDateFilter(o)&&(A=!1),A){let O=0;for(const T of Object.values(i))T==="show"&&O++;O>0&&i.all!=="show"&&(A=!1,f&&i.live==="show"&&(A=!0),g&&i.streamed==="show"&&(A=!0),C&&i.video==="show"&&(A=!0),b&&i.shorts==="show"&&(A=!0),_&&i.scheduled==="show"&&(A=!0),P&&i.posts==="show"&&(A=!0),w&&i.playlist==="show"&&(A=!0),S&&i.notifon==="show"&&(A=!0),!S&&i.notifoff==="show"&&(A=!0)),f&&i.live==="hide"&&(A=!1),g&&i.streamed==="hide"&&(A=!1),C&&i.video==="hide"&&(A=!1),b&&i.shorts==="hide"&&(A=!1),_&&i.scheduled==="hide"&&(A=!1),P&&i.posts==="hide"&&(A=!1),w&&i.playlist==="hide"&&(A=!1),S&&i.notifon==="hide"&&(A=!1),!S&&i.notifoff==="hide"&&(A=!1)}A&&(n==="unwatched"&&N&&(A=!1),n==="watched"&&!N&&(A=!1)),A&&s&&!h.includes(s)&&!m.toLowerCase().includes(s)&&(A=!1),A?o.style.removeProperty("display"):o.style.setProperty("display","none","important")}),this._applySortOrder(e)}diagnose(){console.group("[YPP] Subscription Folder Diagnostic"),this.utils.log(`Active folder: ${this.activeFolder}`,"SubFolders","info"),this.utils.log(`Stored folders: ${JSON.stringify(this.storage.folders,null,2)}`,"SubFolders","info"),this.utils.log(`Active channel set (raw): ${[...this.activeChannelSet]}`,"SubFolders","info"),this.utils.log(`Active channel set (norm): ${[...this.activeChannelSet].map(i=>this._normChannel(i))}`,"SubFolders","info");const e=document.querySelectorAll('ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer'),t=new Set([...this.activeChannelSet].map(i=>this._normChannel(i))),r=Array.from(e).map(i=>{var p,u,h,m,y;const n=i.querySelector("a#avatar-link"),s=i.querySelector("#channel-name a, ytd-channel-name a"),o=i.querySelector("ytd-channel-name yt-formatted-string"),l=(((p=n==null?void 0:n.title)==null?void 0:p.trim())||((u=s==null?void 0:s.textContent)==null?void 0:u.trim())||((h=o==null?void 0:o.textContent)==null?void 0:h.trim())||"(empty)").replace(/[\u2713\u2714\u2705\u2022\u200B-\u200D\uFEFF]/g,"").trim(),d=this._normChannel(l);return{avatar_title:((m=n==null?void 0:n.title)==null?void 0:m.trim())||"(empty)",channellink_txt:((y=s==null?void 0:s.textContent)==null?void 0:y.trim())||"(empty)",cached:i.dataset.yppChannel||"(not set)",norm_used:d,in_folder:t.has(d)?"✅ yes":"❌ no",display:i.style.display==="none"?"🙈 hidden":"✅ shown"}});r.length?console.table(r):console.warn("No ytd-rich-item-renderer cards found on page."),console.groupEnd()}_normChannel(e){if(!e)return"";if(this._normCache||(this._normCache=new Map),this._normCache.has(e))return this._normCache.get(e);const t=e.replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/[\u2713\u2714\u2705\u2022]/g,"").replace(/\s+/g," ").trim().toLowerCase();return this._normCache.set(e,t),t}_applyFeedFiltersNow(){if(!this._isFeedPage)return;const e=document.querySelectorAll(he.SELECTORS.FEED_CARDS),t=new Set([...this.activeChannelSet].map(o=>this._normChannel(o))),r=!!window.__YPP_FILTER_DEBUG;r&&this.activeFolder&&(console.group(`[YPP Filter] folder="${this.activeFolder}"  stored=${this.activeChannelSet.size} channels`),this.utils.log(`Stored (raw): ${[...this.activeChannelSet]}`,"SubFolders","info"),this.utils.log(`Stored (norm): ${[...t]}`,"SubFolders","info"));const i=[];e.forEach(o=>{var d,p,u,h,m,y,v,b,f,g,_,P,w,C,x,S,E,N,A,Y,O,F,T,M,L,k,R,U,j,I,D,q,$,J,_e,Ye,X,we,Ce,ie,De,It,Ft,Ot,Nt,Rt,Bt,Dt,qt,Ut,zt,Vt,Ht,$t,Gt,jt,Wt,Kt,Qt,Xt,Zt,Jt,er,tr,rr,ir,nr,sr,or,ar,lr,dr;let a=!0;if(this.storage.keywordBlacklist&&this.storage.keywordBlacklist.length>0){let z=null;const V=o.data;if(V){const Q=(m=(h=(u=(p=(d=V.content)==null?void 0:d.lockupViewModel)==null?void 0:p.metadata)==null?void 0:u.lockupMetadataViewModel)==null?void 0:h.title)==null?void 0:m.content,oe=((f=(b=(v=(y=V.videoRenderer)==null?void 0:y.title)==null?void 0:v.runs)==null?void 0:b[0])==null?void 0:f.text)??((C=(w=(P=(_=(g=V.content)==null?void 0:g.videoRenderer)==null?void 0:_.title)==null?void 0:P.runs)==null?void 0:w[0])==null?void 0:C.text)??((Y=(A=(N=(E=(S=(x=V.richItemRenderer)==null?void 0:x.content)==null?void 0:S.videoRenderer)==null?void 0:E.title)==null?void 0:N.runs)==null?void 0:A[0])==null?void 0:Y.text);z=Q??oe??null}if(!z){const Q=o.querySelector("#video-title");Q&&(z=Q.textContent)}if(z){const Q=z.toLowerCase();this.storage.keywordBlacklist.some(oe=>Q.includes(oe.toLowerCase()))&&(a=!1)}}let l=o.dataset.yppChannel||null;if(!l){const z=o.data;if(z){const V=(D=(I=(j=(U=(R=(k=(L=(M=(T=(F=(O=z.content)==null?void 0:O.lockupViewModel)==null?void 0:F.metadata)==null?void 0:T.lockupMetadataViewModel)==null?void 0:M.metadata)==null?void 0:L.contentMetadataViewModel)==null?void 0:k.metadataRows)==null?void 0:R[0])==null?void 0:U.metadataParts)==null?void 0:j[0])==null?void 0:I.text)==null?void 0:D.content,Q=((_e=(J=($=(q=z.videoRenderer)==null?void 0:q.ownerText)==null?void 0:$.runs)==null?void 0:J[0])==null?void 0:_e.text)??((Ce=(we=(X=(Ye=z.videoRenderer)==null?void 0:Ye.shortBylineText)==null?void 0:X.runs)==null?void 0:we[0])==null?void 0:Ce.text)??((Ot=(Ft=(It=(De=(ie=z.content)==null?void 0:ie.videoRenderer)==null?void 0:De.ownerText)==null?void 0:It.runs)==null?void 0:Ft[0])==null?void 0:Ot.text)??((Ut=(qt=(Dt=(Bt=(Rt=(Nt=z.richItemRenderer)==null?void 0:Nt.content)==null?void 0:Rt.videoRenderer)==null?void 0:Bt.ownerText)==null?void 0:Dt.runs)==null?void 0:qt[0])==null?void 0:Ut.text);l=V??Q??null}if(!l){const V=o.querySelector("ytd-channel-name a, #channel-name a");V&&V.textContent&&(l=V.textContent.trim())}if(l||(l=((Vt=(zt=o.querySelector("a#avatar-link"))==null?void 0:zt.title)==null?void 0:Vt.trim())||null),!l){const V=o.querySelector("ytd-channel-name, #channel-name");V&&V.textContent&&(l=V.textContent.trim())}l&&(o.dataset.yppChannel=l)}if(this.activeFolder){if(!l){r&&i.push({source:"(unresolved)",norm:"",match:"⏳ observing",visible:"✅ kept"}),o.dataset.yppObserving||(o.dataset.yppObserving="true",window.YPP.Utils.pollFor(()=>{const z=o.querySelector("ytd-channel-name, #channel-name");return!!(z&&z.textContent.trim())},5e3,200).then(z=>{delete o.dataset.yppObserving,z&&this._debouncedApplyFilters()}).catch(()=>{delete o.dataset.yppObserving}));return}if(this.activeFolder==="__no_folder__"){const z=this._normChannel(l);Object.values(this.storage.folders).some(Q=>Q.some(oe=>this._normChannel(oe)===z))&&(a=!1)}else{const z=this._normChannel(l),V=z?t.has(z):!0;z&&!V&&(a=!1),r&&i.push({source:l,norm:z,match:V?"✅ yes":"❌ no",visible:a?"✅ show":"🙈 hide"})}}if(a&&this.hideShortsActive&&(o.querySelector("ytd-reel-item-renderer")||o.hasAttribute("is-shorts")||o.querySelector('a[href^="/shorts/"]'))&&(a=!1),a&&this.hideWatchedActive){const z=o.querySelector("#progress");if(z){const V=parseInt(z.style.width,10);!isNaN(V)&&V>=80&&(a=!1)}}if(a&&!this._matchesDurationFilter(o)&&(a=!1),a&&!this._matchesDateFilter(o)&&(a=!1),a&&this.ffActiveSearch&&this.ffActiveSearch.trim()!==""){const z=this.ffActiveSearch.toLowerCase();let V=null;const Q=o.data;if(Q){const oe=(Wt=(jt=(Gt=($t=(Ht=Q.content)==null?void 0:Ht.lockupViewModel)==null?void 0:$t.metadata)==null?void 0:Gt.lockupMetadataViewModel)==null?void 0:jt.title)==null?void 0:Wt.content,He=((Zt=(Xt=(Qt=(Kt=Q.videoRenderer)==null?void 0:Kt.title)==null?void 0:Qt.runs)==null?void 0:Xt[0])==null?void 0:Zt.text)??((ir=(rr=(tr=(er=(Jt=Q.content)==null?void 0:Jt.videoRenderer)==null?void 0:er.title)==null?void 0:tr.runs)==null?void 0:rr[0])==null?void 0:ir.text)??((dr=(lr=(ar=(or=(sr=(nr=Q.richItemRenderer)==null?void 0:nr.content)==null?void 0:sr.videoRenderer)==null?void 0:or.title)==null?void 0:ar.runs)==null?void 0:lr[0])==null?void 0:dr.text);V=oe??He??null}if(!V){const oe=o.querySelector("#video-title");oe&&(V=oe.textContent)}V&&(V.toLowerCase().includes(z)||(a=!1))}if(a&&this.ffActiveWatch&&this.ffActiveWatch!=="all"){const z=o.querySelector("#progress");let V=!1;if(z){const Q=parseInt(z.style.width,10);!isNaN(Q)&&Q>=80&&(V=!0)}this.ffActiveWatch==="unwatched"&&V&&(a=!1),this.ffActiveWatch==="watched"&&!V&&(a=!1)}if(a&&this.ffActiveChips){const z=this.ffActiveChips;let V=!1,Q=!1,oe=!1,He=!!(o.querySelector("ytd-reel-item-renderer")||o.hasAttribute("is-shorts")||o.querySelector('a[href^="/shorts/"]')),at=!1;if(!He){let le="";const Ee=o.querySelector('yt-content-metadata-view-model > div > span[role="text"]:last-child');if(Ee)le=Ee.textContent.trim();else{const Fe=o.querySelector("div#metadata-line");Fe&&(le=Fe.textContent.trim())}le?le.includes("LIVE")?V=!0:le.includes("Streamed")?Q=!0:le.includes("Premieres")||le.includes("Scheduled")?oe=!0:at=!0:at=!0}const cr={live:V,streamed:Q,video:at,shorts:He,scheduled:oe};let pr=!1;for(const[le,Ee]of Object.entries(z))if(Ee==="hide"&&cr[le]){pr=!0;break}if(pr)a=!1;else{const le=Object.entries(z).filter(([Ee,Fe])=>Fe==="show"&&Ee!=="all");if(le.length>0){let Ee=!1;for(const[Fe]of le)if(cr[Fe]){Ee=!0;break}Ee||(a=!1)}}}a?(o.style.removeProperty("display"),o.removeAttribute("data-ypp-hidden"),o.classList.add("ypp-filtered-in"),this._updateFolderIndicator(o,l)):(o.style.setProperty("display","none","important"),o.setAttribute("data-ypp-hidden","true"),o.classList.remove("ypp-filtered-in")),o.setAttribute("data-ypp-filter-checked","true")}),r&&this.activeFolder&&(i.length>0&&console.table(i),console.groupEnd());const n=document.querySelector(he.SELECTORS.FEED_CONTAINER);n&&this._applySortOrder(n);const s=document.querySelector(he.SELECTORS.CONTINUATION);s&&requestAnimationFrame(()=>{s.getBoundingClientRect().top<window.innerHeight*2&&(window.scrollBy(0,1),window.scrollBy(0,-1))})}resetFeedVisibility(){if(this._isAnyFilterActive()){this.applyFeedFilters();return}document.querySelectorAll(he.SELECTORS.FEED_CARDS).forEach(t=>{t.style.display="",t.removeAttribute("data-ypp-hidden"),t.removeAttribute("data-ypp-filter-checked"),t.classList.remove("ypp-filtered-in"),delete t.dataset.yppChannel})}_updateFolderIndicator(e,t){if(!t)return;const r=this._normChannel(t),i=[];for(const[l,d]of Object.entries(this.storage.folders))d.some(p=>this._normChannel(p)===r)&&i.push(l);let n=e.querySelector(".ypp-feed-folder-indicator");if(i.length===0){n==null||n.remove(),e.style.boxShadow="",e.style.border="";return}const s=i[0];let o=0;for(let l=0;l<s.length;l++)o=s.charCodeAt(l)+((o<<5)-o);const a=Math.abs(o)%360;n||(n=document.createElement("div"),n.className="ypp-feed-folder-indicator",e.style.position="relative",e.appendChild(n)),n.style.cssText=["position:absolute","top:8px","right:8px",`background:hsla(${a}, 70%, 50%, 0.15)`,"backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)",`color:hsla(${a}, 100%, 85%, 1)`,"font-size:11px","padding:4px 8px","border-radius:6px","font-weight:600","letter-spacing: 0.5px",'font-family:"Roboto","Google Sans",sans-serif',"z-index:10","pointer-events:none",`border:1px solid hsla(${a}, 70%, 50%, 0.4)`,`box-shadow:0 4px 12px hsla(${a}, 70%, 50%, 0.2)`].join(";"),n.textContent=i.join(", "),e.style.boxShadow=`0 4px 20px hsla(${a}, 70%, 50%, 0.08)`,e.style.border=`1px solid hsla(${a}, 70%, 50%, 0.15)`,e.style.borderRadius="12px"}async playAll(e){if(!this._isFeedPage||this.activeFolder!==e){sessionStorage.setItem("ypp_pending_play_all",e);const n=document.createElement("a");n.href="/feed/subscriptions",document.body.appendChild(n),n.click(),n.remove();return}window.YPP.Utils.log(`Generating playlist for: ${e}`,"SubFolders"),window.YPP.Utils.createToast&&window.YPP.Utils.createToast(`Generating Playlist for ${e}...`);const t=3;let r=0;const i=()=>{var a,l;const n=document.querySelectorAll("ytd-rich-grid-renderer ytd-rich-item-renderer.ypp-filtered-in"),s=new Set,o=[];for(const d of n){if(o.length>=50)break;const p=d.querySelector("a#video-title-link, a#video-title, #thumbnail.ytd-thumbnail");if(p!=null&&p.href)try{const u=new URL(p.href,window.location.origin).searchParams.get("v");u&&!s.has(u)&&(s.add(u),o.push(u))}catch{}}if(o.length>0)window.location.href=`/watch_videos?video_ids=${o.join(",")}`;else if(r<t){r++;const d=document.querySelectorAll("ytd-rich-grid-renderer ytd-rich-item-renderer").length;window.scrollBy(0,window.innerHeight*2),window.YPP.Utils.pollFor(()=>document.querySelectorAll("ytd-rich-grid-renderer ytd-rich-item-renderer").length>d?!0:null,2e3,200).then(()=>i()).catch(()=>i())}else(l=(a=window.YPP.Utils).createToast)==null||l.call(a,"No videos found in this folder.","error")};window.YPP.Utils.pollFor(()=>document.querySelectorAll("ytd-rich-grid-renderer ytd-rich-item-renderer.ypp-filtered-in").length>0?!0:null,5e3,500).then(()=>i()).catch(()=>i())}},G(he,"SELECTORS",{FEED_CARDS:'ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer, ytd-browse[page-subtype="subscriptions"] ytd-video-renderer',FEED_CONTAINER:'ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer #contents, ytd-browse[page-subtype="subscriptions"] ytd-item-section-renderer #contents',CONTINUATION:"ytd-continuation-item-renderer"}),he),window.YPP.features.SubscriptionManager=class{constructor(){this.logger=window.YPP.Utils||console,this.groups={},this.channels=[],this.isInitialized=!1,this.STORAGE_KEY="yt_subscription_groups"}async init(){this.isInitialized||(await this.loadGroups(),window.YPP.Utils.log("Initialized Subscription Manager","SubManager"),this.isInitialized=!0)}async loadGroups(){try{const e=await window.YPP.StorageManager.get(this.STORAGE_KEY);this.groups=e||{},window.YPP.Utils.log("Loaded groups","SubManager","debug")}catch(e){window.YPP.Utils.log(`Failed to load groups: ${e==null?void 0:e.message}`,"SubManager","error")}}async saveGroups(){try{await window.YPP.StorageManager.set(this.STORAGE_KEY,this.groups),window.YPP.Utils.log("Saved groups","SubManager","debug")}catch(e){window.YPP.Utils.log(`Failed to save groups: ${e==null?void 0:e.message}`,"SubManager","error")}}createGroup(e){return this.groups[e]?(window.YPP.Utils.log(`Group "${e}" already exists.`,"SubManager","warn"),!1):(this.groups[e]=[],this.saveGroups(),!0)}deleteGroup(e){return this.groups[e]?(delete this.groups[e],this.saveGroups(),!0):!1}addChannelToGroup(e,t){return this.groups[e]?this.groups[e].some(r=>r.id===t.id)?!1:(this.groups[e].push(t),this.saveGroups(),!0):!1}removeChannelFromGroup(e,t){if(!this.groups[e])return!1;const r=this.groups[e].length;return this.groups[e]=this.groups[e].filter(i=>i.id!==t),this.groups[e].length!==r?(this.saveGroups(),!0):!1}getGroups(){return this.groups}getChannelsInGroup(e){return this.groups[e]||[]}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SubsUIFilter=class{static injectFilterBar(e){if(document.getElementById("ypp-subs-filter-bar"))return;const t=window.location.pathname;let r;if(t==="/feed/subscriptions"?r=document.querySelector('ytd-browse[page-subtype="subscriptions"] #contents'):(t==="/"||t==="/index")&&(r=document.querySelector('ytd-browse[page-subtype="home"] #contents')),!r)return;const i=e.manager.getGroups(),n=[];n.push({id:"group_All",label:"All",isActive:!0,isToggle:!1,onClick:a=>{e.filterFeed(null)}}),Object.keys(i).forEach(a=>{n.push({id:`group_${a}`,label:a,isActive:!1,isToggle:!1,onClick:l=>{e.filterFeed(a)}})}),n.push({type:"separator"}),n.push({id:"hideShortsLocal",label:"Hide Shorts",isToggle:!0,isActive:!1,onClick:a=>{a.classList.toggle("active"),e.reapplyFilters()}}),n.push({id:"hideWatchedLocal",label:"Hide Watched",isToggle:!0,isActive:!1,onClick:a=>{a.classList.toggle("active"),e.reapplyFilters()}});const s=new window.YPP.ui.components.PageFilterBar("ypp-subs-filter-bar",n),o=r.querySelector("ytd-rich-grid-renderer");r.insertBefore(s.el,o??r.firstChild)}static reapplyFilters(e){const t=document.querySelector("#ypp-subs-filter-bar .ypp-filter-chip:not(.ypp-toggle-chip).active"),r=t&&t.textContent!=="All"?t.textContent:null;e.filterFeed(r)}static _filterFeedNow(e,t){var p,u,h,m,y;const r=document.getElementById("ypp-subs-filter-bar");if(!r)return;const i=r.querySelectorAll(".ypp-filter-chip:not(.ypp-toggle-chip)");i.forEach(v=>v.classList.remove("active"));const n=Array.from(i).find(v=>v.textContent===(t||"All"));n&&n.classList.add("active");const s=((p=r.querySelector('[data-id="hideShortsLocal"]'))==null?void 0:p.classList.contains("active"))??!1,o=((u=r.querySelector('[data-id="hideWatchedLocal"]'))==null?void 0:u.classList.contains("active"))??!1;let a=null;if(t){const v=e.manager.getChannelsInGroup(t).map(b=>b.name);a=new Set(v)}const l=((y=(m=(h=window.YPP)==null?void 0:h.CONSTANTS)==null?void 0:m.DEFAULT_SETTINGS)==null?void 0:y.hideWatchedThreshold)??80;document.querySelectorAll("ytd-rich-item-renderer, ytd-grid-video-renderer").forEach(v=>{let b=!0;if(a){if(!v.dataset.yppChannel){const g=v.querySelector("#text.ytd-channel-name")||v.querySelector(".ytd-channel-name")||v.querySelector("ytd-channel-name");g&&(v.dataset.yppChannel=g.textContent.trim())}const f=v.dataset.yppChannel;(!f||!a.has(f))&&(b=!1)}if(b&&s&&(v.querySelector('a[href*="/shorts/"]')&&(b=!1),v.tagName.toLowerCase().includes("reel")&&(b=!1)),b&&o){const f=v.querySelector("#progress");f&&parseFloat(f.style.width||"0")>l&&(b=!1)}v.style.display=b?"":"none"}),e.injectSidebarGroups()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{};function Xr(c){return String(c).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}window.YPP.features.SubsUISidebar=class{static injectSidebarGroups(e){const t=document.querySelector("ytd-guide-renderer #sections");if(!t)return;const r=e.manager.getGroups(),i=new URLSearchParams(window.location.search).get("ypp_group"),n=JSON.stringify({groups:Object.keys(r),activeGroup:i});if(n===e._lastSidebarKey&&document.getElementById("ypp-sidebar-group-section"))return;e._lastSidebarKey=n;let s=document.getElementById("ypp-sidebar-group-section");if(!s){s=document.createElement("ytd-guide-section-renderer"),s.id="ypp-sidebar-group-section",s.className="style-scope ytd-guide-renderer";const a=t.children.length>0?t.children[1]:null;t.insertBefore(s,a),e.addListener(s,"click",l=>{var p;const d=l.target.closest(".ypp-sidebar-entry");if(d){l.preventDefault();const u=(p=d.querySelector(".title"))==null?void 0:p.textContent;u&&(window.location.href=`/feed/subscriptions?ypp_group=${encodeURIComponent(u)}`)}})}const o='<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events:none;display:block;width:100%;height:100%"><path d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M20,18H4V6h5.17l2,2H20V18z"></path></svg>';s.innerHTML=`
            <div id="items" class="style-scope ytd-guide-section-renderer">
                <h3 class="ypp-sidebar-header">Groups</h3>
                ${Object.keys(r).map(a=>{const l=Xr(a);return`
                    <ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer ypp-sidebar-entry ${i===a?"active":""}" role="tab">
                        <a class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1">
                            <tp-yt-paper-item class="style-scope ytd-guide-entry-renderer" role="link">
                                <yt-icon class="guide-icon style-scope ytd-guide-entry-renderer">${o}</yt-icon>
                                <span class="title style-scope ytd-guide-entry-renderer">${l}</span>
                            </tp-yt-paper-item>
                        </a>
                    </ytd-guide-entry-renderer>`}).join("")}
            </div>
        `}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SubsUIModal=class{static openOrganizer(e){if(e.isModalOpen)return;const t=document.createElement("div");t.className="ypp-modal-overlay",document.body.appendChild(t),t.innerHTML=`
            <div class="ypp-modal-content ypp-organizer-modal">
                <div class="ypp-modal-header">
                    <span class="ypp-modal-title">Subscription Organizer</span>
                    <button class="ypp-modal-close">&times;</button>
                </div>
                <div class="ypp-modal-body ypp-organizer-body">
                    <div class="ypp-pane ypp-pane-left">
                        <div class="ypp-pane-header">
                            <span>Channels</span>
                            <span class="ypp-count" id="ypp-channel-count">0</span>
                        </div>
                        <input type="text" id="ypp-organizer-search" placeholder="Search channels..." class="ypp-search-input">
                        <div id="ypp-channels-list" class="ypp-scroll-list"></div>
                    </div>

                    <div class="ypp-pane ypp-pane-right">
                        <div class="ypp-pane-header">
                            <span>Categories</span>
                            <button id="ypp-add-cat-btn" class="ypp-icon-btn">+</button>
                        </div>
                        <div id="ypp-categories-list" class="ypp-scroll-list"></div>
                    </div>
                </div>
            </div>
        `;const r=async d=>{d.target===t&&this.closeModal(e),d.target.closest(".ypp-modal-close")&&this.closeModal(e),d.target.closest("#ypp-add-cat-btn")&&this.promptNewCategory(e);const p=d.target.closest(".ypp-del-cat-btn");if(p){d.stopPropagation();const u=p.closest(".ypp-category-item");if(u){const h=u.dataset.group;await window.YPP.features.CustomDialog.confirm("Delete Category",`Delete category "${h}"? This cannot be undone.`,"Delete",!0)&&(e.manager.deleteGroup(h),this.renderCategoriesList(e))}}},i=d=>{d.target.id==="ypp-organizer-search"&&this.filterChannelsList(d.target.value)},n=d=>{const p=d.target.closest(".ypp-channel-item");if(p){const u=p.dataset.id,h=p.querySelector("img");e.draggedChannel={name:u,id:u,icon:h?h.src:""},p.classList.add("dragging"),d.dataTransfer.setData("text/plain",JSON.stringify(e.draggedChannel)),d.dataTransfer.effectAllowed="copy"}},s=d=>{const p=d.target.closest(".ypp-channel-item");p&&(e.draggedChannel=null,p.classList.remove("dragging"))},o=d=>{const p=d.target.closest(".ypp-category-item");p&&(d.preventDefault(),p.classList.add("drag-over"))},a=d=>{const p=d.target.closest(".ypp-category-item");p&&p.classList.remove("drag-over")},l=d=>{const p=d.target.closest(".ypp-category-item");if(p){d.preventDefault(),p.classList.remove("drag-over");const u=p.dataset.group;e.draggedChannel&&this._addChannelToGroup(e,u,e.draggedChannel)}};e.addListener(t,"click",r),e.addListener(t,"input",i),e.addListener(t,"dragstart",n),e.addListener(t,"dragend",s),e.addListener(t,"dragover",o),e.addListener(t,"dragleave",a),e.addListener(t,"drop",l),e._modalOverlay=t,e._modalListeners=[{event:"click",handler:r},{event:"input",handler:i},{event:"dragstart",handler:n},{event:"dragend",handler:s},{event:"dragover",handler:o},{event:"dragleave",handler:a},{event:"drop",handler:l}],this.renderChannelsList(e),this.renderCategoriesList(e),requestAnimationFrame(()=>t.classList.add("open")),e.isModalOpen=!0}static closeModal(e){const t=document.querySelector(".ypp-modal-overlay");t&&(t.classList.remove("open"),setTimeout(()=>t.remove(),300)),e._modalOverlay&&e._modalListeners&&(e._modalListeners.forEach(i=>{e.removeListener(e._modalOverlay,i.event,i.handler)}),e._modalOverlay=null,e._modalListeners=null),e.isModalOpen=!1;const r=document.getElementById("ypp-subs-filter-bar");r&&window.YPP.features.SubsUIFilter.renderFilterBar(e,r)}static renderChannelsList(e){const t=document.getElementById("ypp-channels-list");if(!t)return;t.innerHTML="";const r=this._scrapeChannelsFromPage(),i=document.getElementById("ypp-channel-count");i&&(i.textContent=r.length),r.forEach(n=>{const s=document.createElement("div");s.className="ypp-channel-item",s.draggable=!0,s.dataset.id=n.name;const o=document.createElement("img");o.src=n.icon||"",o.className="ypp-channel-icon",o.addEventListener("error",()=>{o.style.display="none"});const a=document.createElement("span");a.className="ypp-channel-name",a.textContent=n.name,s.appendChild(o),s.appendChild(a),t.appendChild(s)}),H({targets:t.querySelectorAll(".ypp-channel-item"),translateX:[-12,0],opacity:[0,1],delay:H.stagger(30,{start:100}),easing:"spring(1, 80, 10, 0)",duration:600})}static _scrapeChannelsFromPage(){const e=document.querySelectorAll("ytd-channel-renderer, ytd-grid-channel-renderer");return e.length>0?Array.from(e).map(t=>{var r,i,n;return{name:(i=(r=t.querySelector("#text.ytd-channel-name"))==null?void 0:r.textContent)==null?void 0:i.trim(),icon:(n=t.querySelector("img"))==null?void 0:n.src}}).filter(t=>t.name):[{name:"Veritasium",icon:""},{name:"Kurzgesagt",icon:""},{name:"MKBHD",icon:""},{name:"Linus Tech Tips",icon:""},{name:"Vsauce",icon:""}]}static filterChannelsList(e){const t=e.toLowerCase();document.querySelectorAll(".ypp-channel-item").forEach(r=>{const i=r.querySelector(".ypp-channel-name");i&&(r.style.display=i.textContent.toLowerCase().includes(t)?"flex":"none")})}static renderCategoriesList(e){const t=document.getElementById("ypp-categories-list");if(!t)return;t.innerHTML="";const r=e.manager.getGroups();Object.keys(r).forEach(i=>{const n=document.createElement("div");n.className="ypp-category-item";const s=document.createElement("div");s.className="ypp-cat-header";const o=document.createElement("span");o.className="ypp-cat-name",o.textContent=`📁 ${i}`;const a=document.createElement("span");a.className="ypp-cat-count",a.textContent=r[i].length;const l=document.createElement("button");l.className="ypp-del-cat-btn",l.textContent="×",s.appendChild(o),s.appendChild(a),s.appendChild(l);const d=document.createElement("div");d.className="ypp-cat-channels",r[i].forEach(p=>{const u=document.createElement("div");u.className="ypp-mini-channel",u.textContent=p.name,d.appendChild(u)}),n.dataset.group=i,n.appendChild(s),n.appendChild(d),t.appendChild(n)}),H({targets:t.querySelectorAll(".ypp-category-item"),translateX:[12,0],opacity:[0,1],delay:H.stagger(40,{start:100}),easing:"spring(1, 80, 10, 0)",duration:600})}static _addChannelToGroup(e,t,r){var i,n,s,o;e.manager.addChannelToGroup(t,{id:r.name,...r})?(this.renderCategoriesList(e),(n=(i=window.YPP.Utils).createToast)==null||n.call(i,`Added ${r.name} to ${t}`)):(o=(s=window.YPP.Utils).createToast)==null||o.call(s,`${r.name} is already in ${t}`,"info")}static async promptNewCategory(e){var r,i,n,s;const t=await window.YPP.features.CustomDialog.prompt("New Category","Enter a name for the new category:");t!=null&&t.trim()&&(e.manager.createGroup(t.trim())?(this.renderCategoriesList(e),(i=(r=window.YPP.Utils).createToast)==null||i.call(r,`Category "${t.trim()}" created`)):(s=(n=window.YPP.Utils).createToast)==null||s.call(n,"Category already exists","error"))}},window.YPP.features.SubscriptionUI=class extends window.YPP.features.BaseFeature{constructor(e){super("SubscriptionUI"),this.manager=e,this.isModalOpen=!1,this.draggedChannel=null,this._lastSidebarKey=null,this._debouncedFilter=null}async enable(){var e,t;if(await super.enable(),!this.manager&&((e=window.YPP.Main)!=null&&e.featureManager)&&(this.manager=((t=window.YPP.Main.featureManager.getFeature("subscriptionsOrganizer"))==null?void 0:t.manager)||window.YPP.Main.featureManager.getFeature("subscriptionFolders")),!this.manager){window.YPP.Utils.log("Dependency missing: SubscriptionManager","SubUI","error");return}if(this._debouncedFilter||(this._debouncedFilter=window.YPP.Utils.debounce(r=>window.YPP.features.SubsUIFilter._filterFeedNow(this,r),50)),window.YPP.Utils.log("Started Subscription UI","SubUI"),this.observer=this.observer||window.YPP.sharedObserver,!this.observer){window.YPP.Utils.log("SharedObserver unavailable — SubscriptionUI cannot register DOM watchers","SubUI","warn");return}this.observePage()}disable(){var e;this.observer&&(this.observer.unregister("subs-ui-feed"),this.observer.unregister("subs-ui-channels"),this.observer.unregister("subs-ui-home")),document.querySelectorAll("#ypp-manage-subs-btn, #ypp-organize-btn, #ypp-subs-filter-bar, #ypp-sidebar-group-section, .ypp-modal-overlay").forEach(t=>t.remove()),(e=document.querySelector('ytd-browse[page-subtype="channels"] #contents'))==null||e.classList.remove("ypp-grid-layout"),this.isModalOpen=!1,this._lastSidebarKey=null,super.disable()}observePage(){this.observer.start(),this.observer.register("subs-ui-feed",'ytd-browse[page-subtype="subscriptions"] #contents, ytd-browse[page-subtype="subscriptions"] #title-container',()=>{this.injectManageButton(),this.injectFilterBar()}),this.observer.register("subs-ui-channels",'ytd-browse[page-subtype="channels"] #contents, ytd-browse[page-subtype="channels"] #title-container',()=>{this.injectOrganizerButton(),this.applyGridClass()}),this.observer.register("subs-ui-home",'ytd-browse[page-subtype="home"] #contents',()=>this.injectFilterBar()),this.checkRoute()}checkRoute(){const e=window.location.pathname,t=new URLSearchParams(window.location.search).get("ypp_group");e==="/feed/subscriptions"?(this.injectManageButton(),this.injectFilterBar(),t&&setTimeout(()=>this.filterFeed(t),500)):e==="/feed/channels"?(this.injectOrganizerButton(),this.applyGridClass()):(e==="/"||e==="/index")&&this.injectFilterBar(),this.injectSidebarGroups()}applyGridClass(){var e;(e=document.querySelector('ytd-browse[page-subtype="channels"] #contents'))==null||e.classList.add("ypp-grid-layout")}injectManageButton(){if(document.getElementById("ypp-manage-subs-btn"))return;const e=document.querySelector('ytd-browse[page-subtype="subscriptions"] #title-container');if(!e)return;const t=this._createButton("Manage Groups","ypp-manage-subs-btn");this.addListener(t,"click",()=>this.openOrganizer()),e.appendChild(t)}injectOrganizerButton(){if(document.getElementById("ypp-organize-btn"))return;const e=document.querySelector('ytd-browse[page-subtype="channels"] #title-container');if(!e)return;const t=this._createButton("Organize","ypp-organize-btn");this.addListener(t,"click",()=>this.openOrganizer()),e.appendChild(t)}_createButton(e,t){const r=document.createElement("button");return r.id=t,r.className="ypp-btn-primary",r.textContent=e,r}injectFilterBar(){window.YPP.features.SubsUIFilter.injectFilterBar(this)}reapplyFilters(){window.YPP.features.SubsUIFilter.reapplyFilters(this)}filterFeed(e){this._debouncedFilter?this._debouncedFilter(e):window.YPP.features.SubsUIFilter._filterFeedNow(this,e)}injectSidebarGroups(){window.YPP.features.SubsUISidebar.injectSidebarGroups(this)}openOrganizer(){window.YPP.features.SubsUIModal.openOrganizer(this)}addChannelToGroup(e,t){return window.YPP.features.SubsUIModal._addChannelToGroup(this,e,t)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.DeckMode=class extends window.YPP.features.BaseFeature{constructor(){super("deckMode"),this.isActive=!1,this.manager=null}getConfigKey(){return"enableDeckMode"}async enable(){var t,r;await super.enable(),(t=this.utils)==null||t.log("Starting Deck Mode","DeckMode"),(r=this.utils)==null||r.injectCSS("src/content/features/pages/subscriptions/deck-mode.css","ypp-deck-css");const e=this.featureManager.getFeature("subscriptionFolders");e&&e.manager&&(this.manager=e.manager),this.observer.register("deck-mode-btn",'ytd-browse[page-subtype="subscriptions"] #ypp-subs-filter-bar',()=>{this.injectDeckToggle()}),this.observer.register("deck-mode-items",'ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer',i=>{this.isActive&&this.distributeItems(i)}),this.observer.start()}async disable(){var e,t;await super.disable(),this.deactivateDeck(),this.observer.unregister("deck-mode-btn"),this.observer.unregister("deck-mode-items"),(e=this.utils)==null||e.removeStyle("ypp-deck-css"),(t=document.getElementById("ypp-deck-toggle-btn"))==null||t.remove()}injectDeckToggle(){if(document.getElementById("ypp-deck-toggle-btn"))return;const e=document.getElementById("ypp-subs-filter-bar");if(!e)return;const t=document.createElement("button");t.id="ypp-deck-toggle-btn",t.className="ypp-btn-primary",t.style.cssText="background: rgba(0, 200, 83, 0.1); border-color: rgba(0, 200, 83, 0.3); color: #00e676; margin-left: 12px; display: flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 13px;",t.innerHTML=`
            <svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h4v14H4V5zm6 0h4v14h-4V5zm6 0h4v14h-4V5z"/></svg>
            Deck Mode
        `,this.addListener(t,"click",()=>{this.isActive=!this.isActive,this.isActive?(this.activateDeck(),t.style.background="rgba(0, 200, 83, 0.3)"):(this.deactivateDeck(),t.style.background="rgba(0, 200, 83, 0.1)")});const r=e.querySelector('.ypp-sub-filter-group[style*="margin-left: auto"]');r?r.appendChild(t):e.appendChild(t)}activateDeck(){if(!this.manager)return;const e=document.querySelector('ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer');if(!e)return;e.style.opacity="0",e.style.pointerEvents="none",e.style.height="0px",e.style.overflow="hidden";let t=document.getElementById("ypp-deck-container");t||(t=document.createElement("div"),t.id="ypp-deck-container",e.parentElement.insertBefore(t,e)),t.innerHTML="",t.style.display="flex";const r=this.manager.getGroups();this.columns={},this.columns.All=this.createColumn(t,"All Subscriptions","#ffffff"),Object.keys(r).forEach(n=>{const s=this.manager.getFolderConfig(n);this.columns[n]=this.createColumn(t,n,s.color||"#ff4e45")});const i=e.querySelectorAll("ytd-rich-item-renderer");this.distributeItems(Array.from(i))}createColumn(e,t,r){const i=document.createElement("div");i.className="ypp-deck-column ypp-scroll-list",i.innerHTML=`
            <div class="ypp-deck-col-header" style="border-bottom: 2px solid ${r}">
                <h3>${t}</h3>
            </div>
            <div class="ypp-deck-col-content"></div>
        `,e.appendChild(i);const n=i.querySelector(".ypp-deck-col-content");let s=!1;return this.addListener(i,"scroll",()=>{s||(window.requestAnimationFrame(()=>{i.scrollTop+i.clientHeight>=i.scrollHeight-200&&window.scrollBy(0,100),s=!1}),s=!0)},{passive:!0}),n}deactivateDeck(){const e=document.getElementById("ypp-deck-container");e&&(e.style.display="none");const t=document.querySelector('ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer');t&&(t.style.opacity="1",t.style.pointerEvents="auto",t.style.height="auto",t.style.overflow="visible"),document.querySelectorAll("ytd-rich-item-renderer[data-ypp-processed]").forEach(i=>i.removeAttribute("data-ypp-processed"))}distributeItems(e){if(!this.isActive||!this.columns)return;const t=this.manager.getGroups();e.forEach(r=>{var d,p,u,h,m,y,v,b,f;const i=(p=(d=r.querySelector(".ytd-channel-name a"))==null?void 0:d.textContent)==null?void 0:p.trim(),n=(h=(u=r.querySelector("#video-title"))==null?void 0:u.textContent)==null?void 0:h.trim(),s=(m=r.querySelector("#video-title-link"))==null?void 0:m.href,o=((y=r.querySelector("yt-image img"))==null?void 0:y.src)||((v=r.querySelector("yt-img-shadow img"))==null?void 0:v.src),a=(f=(b=r.querySelector("ytd-thumbnail-overlay-time-status-renderer"))==null?void 0:b.textContent)==null?void 0:f.trim(),l=Array.from(r.querySelectorAll("#metadata-line span")).map(g=>g.textContent).join(" • ");!i||!n||!s||r.hasAttribute("data-ypp-processed")||(r.setAttribute("data-ypp-processed","true"),this.columns.All&&this.columns.All.appendChild(this.createCard(i,n,s,o,a,l)),Object.keys(t).forEach(g=>{t[g].some(_=>_.name===i)&&this.columns[g]&&this.columns[g].appendChild(this.createCard(i,n,s,o,a,l))}))})}createCard(e,t,r,i,n,s){const o=document.createElement("a");return o.href=r,o.className="ypp-deck-card",o.target="_blank",o.innerHTML=`
            <div class="ypp-deck-thumb">
                <img src="${i||"https://via.placeholder.com/250x140?text=No+Thumbnail"}">
                ${n?`<span class="ypp-deck-duration">${n}</span>`:""}
            </div>
            <div class="ypp-deck-info">
                <div class="ypp-deck-title" title="${t}">${t}</div>
                <div class="ypp-deck-channel">${e}</div>
                <div class="ypp-deck-meta">${s}</div>
            </div>
        `,o}},window.YPP.features.SubscriptionsOrganizer=class extends window.YPP.features.BaseFeature{constructor(){super("SubscriptionsOrganizer"),this.manager=new window.YPP.features.SubscriptionManager,this.ui=new window.YPP.features.SubscriptionUI(this.manager)}getConfigKey(){return"enableSubsManager"}async enable(){var e,t,r,i;if((e=this.settings)!=null&&e.subscriptionFolders){(t=this.utils)==null||t.log("Native Subscription Folders is active. Legacy SubscriptionsOrganizer is disabled.","SubscriptionsOrganizer","info");return}await super.enable(),(r=this.utils)==null||r.log("Starting Subscriptions Organizer","SubscriptionsOrganizer"),(i=this.utils)==null||i.injectCSS("src/content/features/pages/subscriptions/subscriptions.css","ypp-subs-css"),this.ui.observer=this.observer,await this.manager.init(),this.ui.enable()}async disable(){var e;await super.disable(),this.ui&&typeof this.ui.disable=="function"&&this.ui.disable(),(e=this.utils)==null||e.removeStyle("ypp-subs-css")}};class Zr extends window.YPP.features.BaseFeature{getConfigKey(){return"enableFilterBar"}constructor(){super("FilterBar")}}window.YPP.features.FilterBar=Zr;class Jr extends window.YPP.features.BaseFeature{getConfigKey(){return"enableChannelHealth"}constructor(){super("ChannelHealth")}}window.YPP.features.ChannelHealth=Jr;class ei extends window.YPP.features.BaseFeature{getConfigKey(){return"enableSubsManager"}constructor(){super("GroupSidebar")}}window.YPP.features.GroupSidebar=ei;class ti extends window.YPP.features.BaseFeature{getConfigKey(){return"channelColumns"}constructor(){super("ChannelColumns")}async enable(){this.settings.channelColumns&&document.documentElement.style.setProperty("--ypp-channel-columns",this.settings.channelColumns)}async disable(){document.documentElement.style.removeProperty("--ypp-channel-columns")}async onUpdate(){this.settings.channelColumns?document.documentElement.style.setProperty("--ypp-channel-columns",this.settings.channelColumns):document.documentElement.style.removeProperty("--ypp-channel-columns")}}window.YPP.features.ChannelColumns=ti;class ri extends window.YPP.features.BaseFeature{getConfigKey(){return"subscriptionsColumns"}constructor(){super("FeedGridColumns")}async enable(){this.settings.subscriptionsColumns&&document.documentElement.style.setProperty("--ypp-subscriptions-columns",this.settings.subscriptionsColumns)}async disable(){document.documentElement.style.removeProperty("--ypp-subscriptions-columns")}async onUpdate(){this.settings.subscriptionsColumns?document.documentElement.style.setProperty("--ypp-subscriptions-columns",this.settings.subscriptionsColumns):document.documentElement.style.removeProperty("--ypp-subscriptions-columns")}}window.YPP.features.FeedGridColumns=ri,window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SearchViewMode=(Le=class{constructor(){this._viewMode=Le.MODES.GRID,this._boundMessageListener=null,this._classes={},this._logFn=null}sync(e,t){this._classes=e||{},this._logFn=t||((r,i)=>{var n;return(n=console[i])==null?void 0:n.call(console,`[SearchViewMode] ${r}`)})}async init(){}run(){}enable(){this.applyViewMode()}disable(){document.body.classList.remove(this._classes.GRID_MODE,this._classes.LIST_MODE)}applyViewMode(){const e=document.body;if(!this._classes.GRID_MODE)return;if(!(window.location.pathname==="/results")){e.classList.remove(this._classes.GRID_MODE,this._classes.LIST_MODE);return}e.classList.add(this._classes.GRID_MODE),e.classList.remove(this._classes.LIST_MODE)}},G(Le,"MODES",{GRID:"grid",LIST:"list"}),Le),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SearchObserver=(Se=class{constructor(){this._processedNodes=new WeakSet,this._settings={},this._isEnabled=()=>!1,this._classes={}}sync(e,t,r){this._settings=e||{},this._isEnabled=t,this._classes=r||{}}resetProcessedNodes(){this._processedNodes=new WeakSet}start(e){var t,r;if(!this._isObserving&&(this._isObserving=!0,this._containerSelector=e,(t=window.YPP)!=null&&t.sharedObserver)){const i=(r=window.YPP.Utils)!=null&&r.debounce?window.YPP.Utils.debounce(n=>this._processMatches(n),30):n=>this._processMatches(n);window.YPP.sharedObserver.register("search-results-scanner","ytd-item-section-renderer, ytd-video-renderer, ytd-playlist-renderer, ytd-radio-renderer, ytd-channel-renderer",i),this.processAll()}}stop(){var e;this._isObserving=!1,(e=window.YPP)!=null&&e.sharedObserver&&window.YPP.sharedObserver.unregister("search-results-scanner")}_processMatches(e){if(!this._isEnabled())return;const t=new Set;for(let r=0;r<e.length;r++){const i=e[r];if(i.tagName==="YTD-ITEM-SECTION-RENDERER")t.add(i);else if(i.closest){const n=i.closest("ytd-item-section-renderer");n&&t.add(n)}}t.forEach(r=>{var i;try{document.body.contains(r)&&this._processSection(r)}catch(n){(i=this.utils)==null||i.log("_processSection error","SEARCH","warn",n)}})}processAll(){var e;if(this._isEnabled())try{const t=document.querySelectorAll("ytd-item-section-renderer");for(let r=0;r<t.length;r++)this._processSection(t[r])}catch(t){(e=this.utils)==null||e.log("processAll error","SEARCH","warn",t)}}_processSection(e){const t=e.querySelector("#contents");if(!t)return;const r=Array.from(t.children);r.length!==0&&window.YPP.Utils.batch.read(()=>{const i=this._analyzeSectionChildren(r),n=[],s=this._classes,o=t.classList.contains(s.GRID_CONTAINER);for(let a=0;a<r.length;a++){const l=r[a];if(l.nodeType!==Node.ELEMENT_NODE||this._processedNodes.has(l))continue;const d=l.tagName.toLowerCase(),p=this._isFlattenableShelf(l),u=this._isShorts(l);let h=null;if(p){const y=l.querySelector("ytd-vertical-list-renderer #items"),v=l.querySelector("ytd-horizontal-card-list-renderer #scroll-container")||l.querySelector("ytd-horizontal-card-list-renderer #items"),b=l.querySelector("#items")||l.querySelector("#scroll-container")||l.querySelector("#contents"),f=y||v||b;let g=[],_=[];f&&(g=Array.from(f.querySelectorAll("ytd-video-renderer, ytd-compact-video-renderer, ytd-playlist-renderer, ytd-radio-renderer, ytd-rich-item-renderer, ytd-channel-renderer")),_=g.map(P=>{const w=P.querySelector("ytd-thumbnail, ytd-playlist-thumbnail");return{dismissible:P.querySelector("#dismissible"),thumb:w,innerThumb:w?w.querySelector("a, yt-image"):null,textWrapper:P.querySelector(".text-wrapper"),actionMenu:P.querySelector("#action-menu, .action-menu")}})),h={shelfContainer:f,cards:g,cardsCleanData:_}}let m=null;if((i.hasVideos||o)&&(d==="ytd-video-renderer"||d==="ytd-compact-video-renderer"||d==="ytd-radio-renderer"||d==="ytd-playlist-renderer"||d==="ytd-channel-renderer"||d==="yt-lockup-view-model"||d==="ytd-lockup-view-model")){const y=l.querySelector("ytd-thumbnail, ytd-playlist-thumbnail");m={dismissible:l.querySelector("#dismissible"),thumb:y,innerThumb:y?y.querySelector("a, yt-image"):null,textWrapper:l.querySelector(".text-wrapper"),actionMenu:l.querySelector("#action-menu, .action-menu")}}n.push({node:l,tag:d,isFlattenable:p,isShorts:u,flattenData:h,cleanData:m})}window.YPP.Utils.batch.write(()=>{const{NOISE_TAGS:a}=Se;this._handleNoiseSection(e,i,r.length),i.hasVideos&&!o&&t.classList.add(s.GRID_CONTAINER);for(let l of n){if(this._processedNodes.add(l.node),a.has(l.tag)){if(this._settings.hideSearchShelves){l.node.style.setProperty("display","none","important"),l.node.classList.add("ypp-hidden-shelf");continue}if(l.isFlattenable&&l.flattenData){l.node.dataset.yppFlattened="true",l.node.classList.add("ypp-flattened-container"),l.flattenData.shelfContainer&&l.flattenData.shelfContainer.classList.add("ypp-flattened-grid");for(let d=0;d<l.flattenData.cards.length;d++){const p=l.flattenData.cards[d];p.classList.add(s.GRID_ITEM),this._cleanInlineStyles(p,l.flattenData.cardsCleanData[d])}continue}continue}if(l.isShorts){l.node.style.setProperty("display","none","important");continue}(i.hasVideos||o)&&(l.tag==="ytd-video-renderer"||l.tag==="ytd-compact-video-renderer"||l.tag==="ytd-radio-renderer"||l.tag==="ytd-playlist-renderer"||l.tag==="ytd-channel-renderer"||l.tag==="yt-lockup-view-model"||l.tag==="ytd-lockup-view-model"?(l.node.classList.add(s.GRID_ITEM),this._cleanInlineStyles(l.node,l.cleanData)):l.tag==="ytd-ad-slot-renderer"||l.tag==="ytd-promoted-sparkles-web-renderer"?l.node.style.setProperty("display","none","important"):l.node.classList.contains("ypp-flattened-container")||l.node.classList.add(s.FULL_WIDTH))}})})}_analyzeSectionChildren(e){let t=!1,r=!0,i=!1;const{NOISE_TAGS:n,VIDEO_TAGS:s}=Se;for(let o=0;o<e.length;o++){const a=e[o].tagName.toLowerCase();if(a==="ytd-continuation-item-renderer"){i=!0;continue}s.has(a)?(t=!0,r=!1):n.has(a)||(r=!1)}return{hasVideos:t,allNoise:r,hasTransients:i}}_handleNoiseSection(e,t,r){return t.allNoise&&!t.hasTransients&&r>0?(e.classList.add("ypp-noise-section"),!0):(e.classList.contains("ypp-noise-section")&&t.hasVideos&&e.classList.remove("ypp-noise-section"),!1)}_isShorts(e){var n,s;const t=e.tagName.toLowerCase();if(t==="ytd-reel-shelf-renderer"||t==="ytd-rich-shelf-renderer"&&e.hasAttribute("is-shorts")||e.querySelector('a[href*="/shorts/"]')||e.querySelector('[overlay-style="SHORTS"]')||(((s=(n=e.querySelector("#title-container #title"))==null?void 0:n.textContent)==null?void 0:s.trim())||"").includes("Shorts"))return!0;const i=e.querySelectorAll("ytd-badge-supported-renderer");for(let o=0;o<i.length;o++)if(i[o].textContent.trim()==="Shorts")return!0;return!1}_isShortsShelf(e){var r,i;const t=((i=(r=e.querySelector("#title-container #title"))==null?void 0:r.textContent)==null?void 0:i.trim())||"";return!!(/shorts/i.test(t)||e.querySelector('ytd-icon-button-renderer[aria-label="Shorts"]')||e.querySelector('a[href*="/shorts/"]'))}_isFlattenableShelf(e){const t=e.tagName.toLowerCase();return(t==="ytd-horizontal-card-list-renderer"||t==="ytd-vertical-list-renderer"||t==="ytd-shelf-renderer"||t==="ytd-rich-shelf-renderer")&&!this._isShortsShelf(e)?!!e.querySelector("ytd-video-renderer, ytd-compact-video-renderer, ytd-playlist-renderer, ytd-radio-renderer, ytd-rich-item-renderer"):!1}_cleanInlineStyles(e,t){e.style.width&&(e.style.width=""),e.style.maxWidth&&(e.style.maxWidth=""),e.style.minWidth&&(e.style.minWidth=""),e.style.height&&(e.style.height=""),e.style.margin&&(e.style.margin=""),t&&(t.dismissible&&(t.dismissible.style.display="",t.dismissible.style.flexDirection="",t.dismissible.style.width="",t.dismissible.style.height=""),t.thumb&&(t.thumb.style.width="",t.thumb.style.minWidth="",t.thumb.style.maxWidth="",t.thumb.style.height="",t.thumb.style.margin="",t.thumb.style.marginRight="",t.thumb.style.flexBasis="",t.thumb.style.flexShrink="",t.innerThumb&&(t.innerThumb.style.width="",t.innerThumb.style.height="",t.innerThumb.style.maxWidth="")),t.textWrapper&&(t.textWrapper.style.marginLeft="",t.textWrapper.style.marginRight="",t.textWrapper.style.marginTop="",t.textWrapper.style.width="",t.textWrapper.style.maxWidth=""),t.actionMenu&&(t.actionMenu.style.width="",t.actionMenu.style.height="",t.actionMenu.style.position=""))}},G(Se,"NOISE_TAGS",new Set(["ytd-shelf-renderer","ytd-horizontal-card-list-renderer","ytd-vertical-list-renderer","ytd-universal-watch-card-renderer","ytd-background-promo-renderer","ytd-search-refinement-card-renderer","ytd-reel-shelf-renderer","ytd-rich-shelf-renderer","ytd-rich-section-renderer","yt-horizontal-list-renderer","yt-collection-shelf-view-model"])),G(Se,"VIDEO_TAGS",new Set(["ytd-video-renderer","ytd-compact-video-renderer","ytd-playlist-renderer","ytd-radio-renderer","ytd-channel-renderer","yt-lockup-view-model","ytd-lockup-view-model"])),Se),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SearchFilter=class extends window.YPP.features.BaseFeature{constructor(){super("SearchFilter"),this._boundHandlePageChange=this._handlePageChange.bind(this)}getConfigKey(){return"autoVideoFilter"}async enable(){var e;await super.enable(),(e=window.YPP.events)==null||e.on("app:pageChange",this._boundHandlePageChange),this._handlePageChange()}async disable(){var e;await super.disable(),(e=window.YPP.events)==null||e.off("app:pageChange",this._boundHandlePageChange)}_handlePageChange(){if(!this.isEnabled||!window.location.pathname.startsWith("/results"))return;const e=new URLSearchParams(window.location.search);e.has("search_query")&&e.has("sp")}};const ne=class ne extends window.YPP.features.BaseFeature{getConfigKey(){return"searchGrid"}constructor(){super("searchGrid"),this._isEnabled=!1,this._settings={},this._batching=!1,this._lastQuery=null,this._searchObserver=new window.YPP.features.SearchObserver,this._searchFilter=new window.YPP.features.SearchFilter,this._searchViewMode=new window.YPP.features.SearchViewMode,this._handleNavigation=this._handleNavigation.bind(this)}async init(e){this._settings=e||{},this._searchViewMode.sync(ne.CLASSES,this._log.bind(this)),await this._searchViewMode.init(),this._settings.searchGrid||this._settings.autoVideoFilter?this.enable():this.disable()}run(e){this._settings=e||{},this._searchObserver.resetProcessedNodes(),this._searchFilter.update(this._settings),this._searchViewMode.run(),this._settings.searchGrid||this._settings.cleanSearch||this._settings.hideSearchShelves||this._settings.hideChannelCards||this._settings.autoVideoFilter?this.enable():this.disable()}enable(){if(this._isEnabled){this._handleNavigation();return}try{this._isEnabled=!0,this._searchViewMode.sync(ne.CLASSES,this._log.bind(this)),this.addListener(window,"yt-navigate-finish",this._handleNavigation),this._searchViewMode.enable(),this._handleNavigation(),this._log("SearchRedesign enabled","info")}catch(e){this._log("Error enabling SearchRedesign: "+e.message,"error")}}disable(){this._isEnabled&&(this._isEnabled=!1,this._searchObserver.stop(),this._searchViewMode.disable(),document.body.classList.remove(ne.CLASSES.GRID_MODE,ne.CLASSES.LIST_MODE),document.body.classList.remove("ypp-filter-pending"),this._purgeStaleClasses(),super.disable())}_handleNavigation(){if(!this._isEnabled)return;window.location.pathname==="/results"?(this._purgeStaleClasses(),this._searchObserver.resetProcessedNodes(),this._searchObserver.sync(this._settings,()=>this._isEnabled,ne.CLASSES),this._searchFilter.update(this._settings),(this._settings.searchGrid||this._settings.hideSearchShelves||this._settings.hideChannelCards||this._settings.cleanSearch)&&(this._settings.searchGrid&&this._searchViewMode.applyViewMode(),this._searchObserver.start(ne.SELECTORS.SEARCH_CONTAINER))):(this._searchObserver.stop(),this._removeClasses(),this._lastQuery=null)}_purgeStaleClasses(){const{GRID_CONTAINER:e,GRID_ITEM:t,FULL_WIDTH:r,HIDDEN_SHORT:i}=ne.CLASSES;[e,t,r,i,"ypp-noise-section","ypp-flattened-container","ypp-flattened-grid"].forEach(s=>{document.querySelectorAll(`.${s}`).forEach(o=>o.classList.remove(s))}),document.querySelectorAll("ytd-item-section-renderer, ytd-shelf-renderer").forEach(s=>{s.style.display==="none"&&(s.style.display="")}),document.body.classList.remove(ne.CLASSES.GRID_MODE,ne.CLASSES.LIST_MODE)}_log(e,t="info"){var r,i,n;(i=(r=window.YPP)==null?void 0:r.Utils)!=null&&i.log?window.YPP.Utils.log(e,"SEARCH",t):(n=console[t])==null||n.call(console,`[SearchRedesign] ${e}`)}_removeClasses(){document.body.classList.remove(ne.CLASSES.GRID_MODE,ne.CLASSES.LIST_MODE)}};G(ne,"CLASSES",{GRID_MODE:"ypp-search-grid-mode",LIST_MODE:"ypp-search-list-mode",GRID_CONTAINER:"ypp-search-grid-container",GRID_ITEM:"ypp-grid-item",FULL_WIDTH:"ypp-full-width-item",HIDDEN_SHORT:"ypp-hidden-short",TOGGLE_BTN:"ypp-toggle-btn",TOGGLE_CONTAINER:"ypp-view-mode-toggle",ACTIVE:"active"}),G(ne,"SELECTORS",{SEARCH_CONTAINER:"ytd-search",SECTION_LIST:"ytd-section-list-renderer",ITEM_SECTION:"ytd-item-section-renderer",CONTENTS:"#contents",FILTER_HEADER:"ytd-search-sub-menu-renderer",TOOLS_CONTAINER:"#filter-menu",VIDEO:"ytd-video-renderer",PLAYLIST:"ytd-playlist-renderer",CHANNEL:"ytd-channel-renderer",SHELF:"ytd-shelf-renderer",RADIO:"ytd-radio-renderer",REEL_SHELF:"ytd-reel-shelf-renderer",RICH_SHELF:"ytd-rich-shelf-renderer"});let st=ne;window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SearchRedesign=st,window.YPP.features.HistoryRedesign=class extends window.YPP.features.BaseFeature{constructor(){super("HistoryRedesign"),this.styleElement=null,this.currentCalDate=new Date,this.selectedCalDateString=null,this._boundHandleMutations=this.handleMutations.bind(this)}getConfigKey(){return"historyRedesign"}async enable(){var e;if(location.pathname==="/feed/history"){await super.enable();try{this.apply(),this.observer.start(),this.observer.register("history-redesign","ytd-app",this._boundHandleMutations,!1)}catch(t){(e=this.utils)==null||e.log("Error enabling HistoryRedesign","HISTORY","error",t)}}}async onPageChange(e){e.pathname==="/feed/history"?(await this.enable(),this.applySettings()):this.disable()}async onUpdate(){this.applySettings()}applySettings(){var t;const e=((t=this.settings)==null?void 0:t.historyColumns)||4;document.documentElement.style.setProperty("--ypp-history-columns",e)}async disable(){await super.disable(),this.observer&&(this.observer.unregister("history-redesign"),this.observer.stop()),this.styleElement&&(this.styleElement.remove(),this.styleElement=null),document.documentElement.style.removeProperty("--ypp-history-columns")}apply(){this.injectStyles(),typeof this.injectCalendarModal=="function"&&this.injectCalendarModal()}injectStyles(){if(document.getElementById("ypp-history-grid-styles"))return;const e=`
            /* ==========================================================================
               HISTORY GRID REDESIGN - STACK MATCH WITH SEARCH GRID
               ========================================================================== */

            /* 1. Main Grid Container setup */
            ytd-browse[page-subtype="history"] #contents.ytd-section-list-renderer {
                display: block !important;
                max-width: 1800px; /* Match Search Grid Max Width */
                margin: 0 auto;
                padding: 0 24px !important;
            }

            /* 2. Date Section Headers */
            ytd-browse[page-subtype="history"] ytd-item-section-renderer {
                margin-bottom: 40px !important;
                border-bottom: none !important;
                display: block !important;
            }

            ytd-browse[page-subtype="history"] #subheader {
                margin-bottom: 24px !important;
                font-family: 'Inter', 'Roboto', sans-serif;
                font-size: 2.2rem !important;
                line-height: 1.3 !important;
                color: #fff !important;
                font-weight: 700 !important;
                letter-spacing: -0.5px !important;
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            /* 2.5 Layout Constraints for Primary/Secondary */
            ytd-browse[page-subtype="history"] ytd-two-column-browse-results-renderer {
                max-width: 1800px !important;
                width: 100% !important;
                margin: 0 auto !important;
            }
            ytd-browse[page-subtype="history"] ytd-two-column-browse-results-renderer #primary {
                max-width: none !important;
                flex: 1 !important;
                padding-right: 24px !important;
            }
            ytd-browse[page-subtype="history"] ytd-two-column-browse-results-renderer #secondary {
                width: 380px !important;
                min-width: 380px !important;
                flex: none !important;
            }

            /* 3. Grid Layout Properties */
            ytd-browse[page-subtype="history"] ytd-item-section-renderer #contents {
                display: grid !important;
                /* Dynamic grid columns based on user settings */
                grid-template-columns: repeat(var(--ypp-history-columns, 4), minmax(0, 1fr)) !important;
                gap: 24px 16px !important;
                padding-top: 8px !important;
                grid-auto-flow: dense !important;
                align-items: start !important;
            }

            /* Optional responsive fallbacks if CSS var is not provided */
            @media (max-width: 1600px) {
                ytd-browse[page-subtype="history"] ytd-item-section-renderer #contents {
                    grid-template-columns: repeat(var(--ypp-history-columns, 4), minmax(0, 1fr)) !important;
                }
            }

            /* ==========================================================================
               VIDEO CARD STYLING (1:1 COPY FROM SEARCH GRID MODE)
               ========================================================================== */

            ytd-browse[page-subtype="history"] ytd-video-renderer {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                margin: 0 !important;
                padding: 16px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: stretch !important;
                
                /* Glassmorphism Surface */
                background: rgba(25, 25, 25, 0.6);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 20px; /* var(--ypp-radius-lg) */
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
                
                overflow: hidden;
                transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), 
                            box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                            border-color 0.3s ease;
                box-sizing: border-box !important;
                position: relative;
            }

            /* Card Hover Effect */
            ytd-browse[page-subtype="history"] ytd-video-renderer:hover {
                transform: translateY(-4px);
                border-color: rgba(62, 166, 255, 0.4);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(62, 166, 255, 0.3);
                z-index: 10;
                background: rgba(30,30,30,0.8);
            }

            /* Thumbnail Styling */
            ytd-browse[page-subtype="history"] ytd-video-renderer ytd-thumbnail {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 100% !important;
                height: auto !important;
                aspect-ratio: 16/9 !important;
                flex: none !important;
                border-radius: 12px; /* var(--ypp-radius-md) */
                margin: 0 0 12px 0 !important;
                box-shadow: none !important;
                overflow: hidden !important;
            }

            ytd-browse[page-subtype="history"] ytd-video-renderer ytd-thumbnail img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
            }

            /* Glass Time Status (Duration) */
            ytd-browse[page-subtype="history"] ytd-thumbnail-overlay-time-status-renderer {
                background: rgba(0, 0, 0, 0.6) !important;
                backdrop-filter: blur(4px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 6px !important;
                padding: 2px 4px !important;
                margin: 4px !important;
            }
            ytd-browse[page-subtype="history"] ytd-thumbnail-overlay-time-status-renderer span {
                font-family: 'Roboto', sans-serif !important;
                font-weight: 500 !important;
                font-size: 1.1rem !important;
            }

            /* Text Wrapper */
            ytd-browse[page-subtype="history"] ytd-video-renderer .text-wrapper {
                width: 100% !important;
                max-width: 100% !important;
                flex: 1 !important;
                min-width: 0 !important;
                padding: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                background: transparent !important;
            }

            /* Title Typography */
            ytd-browse[page-subtype="history"] #video-title {
                font-family: 'Roboto', sans-serif !important;
                font-size: 1.6rem !important;
                line-height: 2.2rem !important;
                font-weight: 500 !important;
                margin: 0 0 4px 0 !important;
                color: #fff !important;
                text-shadow: none !important;
                max-height: 4.4rem !important;
                display: -webkit-box !important;
                -webkit-line-clamp: 2 !important;
                -webkit-box-orient: vertical !important;
                overflow: hidden !important;
            }

            /* Metadata Area */
            ytd-browse[page-subtype="history"] .ytd-video-renderer #metadata-line {
                display: flex !important;
                flex-wrap: wrap !important;
                font-size: 1.2rem !important;
                font-weight: 400 !important;
                color: rgba(255, 255, 255, 0.5) !important;
                margin-top: 4px !important;
                line-height: 1.4 !important;
            }

            ytd-browse[page-subtype="history"] .ytd-video-renderer .ytd-channel-name {
                font-size: 1.3rem !important;
                font-weight: 500 !important;
                color: rgba(255, 255, 255, 0.75) !important;
                margin: 0 !important;
                padding: 0 !important;
                line-height: 1.5 !important;
            }

            /* Hide Clutter */
            ytd-browse[page-subtype="history"] .metadata-snippet-container {
                display: none !important;
            }
            ytd-browse[page-subtype="history"] .ytd-badge-supported-renderer {
                display: none !important;
            }
            ytd-browse[page-subtype="history"] #description-text {
                display: none !important;
            }

            /* Menu Buttons */
            ytd-browse[page-subtype="history"] ytd-video-renderer #dismissible .dropdown-trigger,
            ytd-browse[page-subtype="history"] ytd-video-renderer ytd-menu-renderer yt-icon-button {
                width: 32px !important;
                height: 32px !important;
                padding: 4px !important;
                background: rgba(0,0,0,0.4) !important;
                backdrop-filter: blur(4px);
                border-radius: 50% !important;
                opacity: 0;
                transition: opacity 0.2s ease;
                top: 8px; right: 8px; position: absolute; margin: 0 !important;
            }
            ytd-browse[page-subtype="history"] ytd-video-renderer:hover #dismissible .dropdown-trigger,
            ytd-browse[page-subtype="history"] ytd-video-renderer:hover ytd-menu-renderer {
                opacity: 1 !important;
            }

            /* Remove old history header positioning */
            ytd-browse[page-subtype="history"] #primary .ypp-history-header-widget {
                /* ensure new widget flows correctly */
            }

            /* ==========================================================================
               SHORTS HORIZONTAL SCROLL
               ========================================================================== */
            ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer {
                grid-column: 1 / -1 !important;
                width: 100% !important;
                margin: 0 0 40px 0 !important;
                border-top: none !important;
                border-bottom: none !important;
                padding: 0 !important;
                background: transparent !important;
            }
            
            ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer #items {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
                scroll-snap-type: x mandatory !important;
                scroll-behavior: smooth !important;
                gap: 16px !important;
                padding: 16px 8px 24px 8px !important;
                margin: 0 !important;
            }
            
            ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer #items::-webkit-scrollbar {
                height: 8px !important;
                background: transparent !important;
            }
            ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer #items::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2) !important;
                border-radius: 10px !important;
            }
            ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer #items::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.4) !important;
            }

            ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer ytd-reel-item-renderer {
                flex: 0 0 auto !important;
                width: 220px !important;
                margin: 0 !important;
                scroll-snap-align: start !important;
                background: rgba(25, 25, 25, 0.6) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 16px !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
                transition: transform 0.3s ease, border-color 0.3s ease !important;
                overflow: hidden !important;
            }

            ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer ytd-reel-item-renderer:hover {
                transform: translateY(-8px) !important;
                border-color: rgba(62, 166, 255, 0.4) !important;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(62, 166, 255, 0.2) !important;
            }
            
            /* Hide shorts layout wrapper styling since we handle it natively */
            ytd-browse[page-subtype="history"] ytd-reel-shelf-renderer ytd-reel-item-renderer > ytd-shorts-lockup-view-model {
                border: none !important;
                background: transparent !important;
            }

            /* ==========================================================================
               RIGHT SIDEBAR REDESIGN
               ========================================================================== */
            ytd-browse[page-subtype="history"] #secondary {
                background: rgba(25, 25, 25, 0.6) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 20px !important;
                padding: 24px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
                margin-top: 0 !important;
                position: sticky !important;
                top: 80px !important;
                transition: all 0.3s ease !important;
                overflow: hidden !important;
            }
            
            ytd-browse[page-subtype="history"] #secondary:hover {
                border-color: rgba(62, 166, 255, 0.3) !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(62, 166, 255, 0.1) !important;
            }

            /* Style inputs in sidebar */
            ytd-browse[page-subtype="history"] #secondary input {
                background: rgba(255, 255, 255, 0.05) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 8px !important;
                color: #fff !important;
                padding: 10px 14px !important;
            }

            /* Searchbox wrapper in history */
            ytd-browse[page-subtype="history"] #secondary tp-yt-paper-input {
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 12px !important;
                padding: 8px 16px !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                margin-bottom: 24px !important;
            }
            ytd-browse[page-subtype="history"] #secondary tp-yt-paper-input:focus-within {
                border-color: rgba(62, 166, 255, 0.5) !important;
                background: rgba(255, 255, 255, 0.1) !important;
            }

            /* Style inputs in sidebar */
            ytd-browse[page-subtype="history"] #secondary input {
                background: rgba(255, 255, 255, 0.05) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 8px !important;
                color: #fff !important;
                padding: 10px 14px !important;
            }

            /* Style buttons/links in sidebar */
            ytd-browse[page-subtype="history"] #secondary ytd-button-renderer,
            ytd-browse[page-subtype="history"] #secondary ytd-compact-link-renderer {
                background: transparent !important;
                border-radius: 8px !important;
                transition: all 0.2s ease !important;
                margin-bottom: 4px !important;
            }
            
            ytd-browse[page-subtype="history"] #secondary ytd-button-renderer:hover,
            ytd-browse[page-subtype="history"] #secondary ytd-compact-link-renderer:hover {
                background: rgba(255, 255, 255, 0.08) !important;
                transform: translateX(4px) !important;
            }
        `;this.styleElement=document.createElement("style"),this.styleElement.id="ypp-history-grid-styles",this.styleElement.textContent=e,document.head.appendChild(this.styleElement)}handleMutations(){location.pathname==="/feed/history"&&this.apply()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.PlaylistRedesign=class extends window.YPP.features.BaseFeature{constructor(){super("PlaylistRedesign"),this.isActive=!1,this.container=null,this.navHandler=null,this._buildTimer=null,this._retryTimer=null,this._retryCount=0,this._initId=0,this._currentCols="3",this._menuCloseFn=null,this.MAX_RETRIES=12,this.RETRY_DELAY=800,this.SELECTORS={TITLE:'h1, yt-formatted-string[id="title"], .title',OWNER:'ytd-channel-name a, #owner-text a, a.yt-simple-endpoint[href*="/@"]',STATS:'yt-formatted-string#stats, .metadata-stats, div[class*="metadata"], yt-formatted-string.ytd-playlist-byline-renderer',BANNER_IMG:"yt-image img, #thumbnail img, .yt-core-image, img.yt-img-shadow, yt-playlist-header-view-model img",VIDEO_TITLE:"a#video-title, yt-formatted-string#video-title, h3 a",VIDEO_URL:'a#video-title, a#thumbnail, a.yt-simple-endpoint[href*="/watch"]',VIDEO_CHANNEL:"ytd-channel-name a, #channel-name a, .ytd-channel-name a",THUMB_IMG:"ytd-thumbnail img, yt-image img, .yt-core-image, img#img",INDEX:"#index-container, .index-message-wrapper, yt-formatted-string#index",TIME_OVERLAY:"ytd-thumbnail-overlay-time-status-renderer, badge-shape, span.ytd-thumbnail-overlay-time-status-renderer",BADGE_SPAN:"#text, .badge-shape-wiz__text"}}getConfigKey(){return"playlistRedesign"}async enable(){try{window.YPP.StorageManager.get("playlistCols").then(e=>{e&&(this._currentCols=e)})}catch(e){this.utils.log("Failed to load column preference: "+e.message,"PLAYLIST_REDESIGN","warn")}this._isPlaylistPage()&&this._tryInit()}onPageChange(){this._reset(),this.isEnabled&&this._isPlaylistPage()&&this._tryInit()}disable(){this._reset()}_isPlaylistPage(){return location.pathname.startsWith("/playlist")}_getActiveBrowse(){let e=Array.from(document.querySelectorAll('ytd-browse[page-subtype="playlist"]'));return e.length||(e=Array.from(document.querySelectorAll("ytd-browse")).filter(t=>t.querySelector("ytd-playlist-header-renderer, yt-playlist-header-view-model, #header"))),e.find(t=>!t.hasAttribute("hidden"))||e[0]}_reset(){var e;this._initId++,clearTimeout(this._buildTimer),clearTimeout(this._retryTimer),this._retryCount=0,(e=window.YPP)!=null&&e.sharedObserver&&window.YPP.sharedObserver.unregister("playlist-redesign-scanner"),this._menuCloseFn&&(document.removeEventListener("click",this._menuCloseFn),this._menuCloseFn=null),this.container&&(this.container.remove(),this.container=null),document.querySelectorAll(".ypp-pl-hidden").forEach(t=>{t.classList.remove("ypp-pl-hidden")}),document.body.classList.remove("ypp-playlist-redesign")}async _tryInit(){if(!this._isPlaylistPage())return;const e=++this._initId;document.body.classList.add("ypp-playlist-redesign");const t="ytd-playlist-video-renderer, yt-lockup-view-model";if(!await window.YPP.Utils.pollFor(()=>{const o=this._getActiveBrowse();return o?!!o.querySelector("ytd-playlist-header-renderer, yt-playlist-header-view-model, #header"):!1},1e4)||this._initId!==e||!this._isPlaylistPage())return;const i=this._getActiveBrowse();if(!i)return;const n=i.querySelector("ytd-playlist-header-renderer, yt-playlist-header-view-model, #header"),s=i.querySelectorAll(t);this._build(i,n,s),this._watchForChanges(i)}_watchForChanges(e){var r;if(e.querySelector("#contents")&&(r=window.YPP)!=null&&r.sharedObserver){const i="ytd-playlist-video-renderer, yt-lockup-view-model",n=this.utils.debounce(()=>{const s=this._getActiveBrowse();if(!s)return;const o=s.querySelector("ytd-playlist-header-renderer, yt-playlist-header-view-model, #header"),a=s.querySelectorAll(i);o&&a.length>0&&this.isEnabled&&this._build(s,o,a)},600);window.YPP.sharedObserver.register("playlist-redesign-scanner",i,n,!1)}}_extractPlaylistData(e,t){var h,m,y;const r=((m=(h=e.querySelector(this.SELECTORS.TITLE))==null?void 0:h.textContent)==null?void 0:m.trim())||"Playlist",i=e.querySelector(this.SELECTORS.OWNER),n=((y=i==null?void 0:i.textContent)==null?void 0:y.trim())||"",s=(i==null?void 0:i.href)||"",o=e.querySelector("ytd-playlist-byline-renderer, .metadata-stats, .metadata-wrapper");let a="";if(o){const v=Array.from(o.querySelectorAll("yt-formatted-string, span")).map(b=>b.textContent.trim()).filter(b=>b&&b.length>0&&b!=="•"&&!b.includes("Save"));a=Array.from(new Set(v)).join(" • ")}if(!a){const v=Array.from(e.querySelectorAll(this.SELECTORS.STATS));for(const b of v){const f=b.textContent.trim().replace(/\n+/g," ").replace(/\s+/g," ");if(f.includes("video")||f.includes("view")||f.includes("Updated")){a=f;break}}}let l="";const d=e.querySelector(this.SELECTORS.BANNER_IMG);d!=null&&d.src&&!d.src.includes("data:")&&(l=d.src);const p=[];t.forEach((v,b)=>{var A,Y,O,F,T,M,L;const f=((Y=(A=v.querySelector(this.SELECTORS.VIDEO_TITLE))==null?void 0:A.textContent)==null?void 0:Y.trim())||`Video ${b+1}`,g=((O=v.querySelector(this.SELECTORS.VIDEO_URL))==null?void 0:O.href)||"",_=((T=(F=v.querySelector(this.SELECTORS.VIDEO_CHANNEL))==null?void 0:F.textContent)==null?void 0:T.trim())||"";let P="";const w=v.querySelector('ytd-thumbnail-overlay-time-status-renderer, badge-shape, span.ytd-thumbnail-overlay-time-status-renderer, .yt-lockup-view-model-wiz__badge, yt-formatted-string[class*="time"]');if(w){const R=(w.innerText||w.textContent||"").trim().match(/(\d{1,3}:\d{2}(?::\d{2})?)/);if(R)P=R[1];else{const j=(w.getAttribute("aria-label")||"").match(/(\d{1,3}:\d{2}(?::\d{2})?)/);j&&(P=j[1])}}let C="";const x=v.querySelector(this.SELECTORS.THUMB_IMG);if(x!=null&&x.src&&!x.src.includes("data:")&&(C=x.src),!C&&g){const k=g.match(/[?&]v=([^&]+)/);k&&(C=`https://i.ytimg.com/vi/${k[1]}/mqdefault.jpg`)}const S=((L=(M=v.querySelector(this.SELECTORS.INDEX))==null?void 0:M.textContent)==null?void 0:L.trim())||String(b+1);let E=0;const N=["ytd-thumbnail-overlay-resume-playback-renderer #progress","ytd-thumbnail-overlay-resume-playback-renderer",'[overlay-style="DEFAULT"] #progress','#progress[style*="width"]'];for(const k of N){const R=v.querySelector(k);if(R){const U=parseInt(R.style.width,10);if(!isNaN(U)&&U>0){E=U;break}if(R.tagName==="YTD-THUMBNAIL-OVERLAY-RESUME-PLAYBACK-RENDERER"){E=50;break}}}p.push({title:f,href:g,channel:_,duration:P,thumb:C,index:S,progress:E})});let u=0;return p.forEach(v=>{if(v.duration&&v.duration.includes(":")){const f=v.duration.replace(/[^0-9:]/g,"").split(":").map(Number);f.length===3?u+=f[0]*3600+f[1]*60+f[2]:f.length===2&&(u+=f[0]*60+f[1])}}),!l&&p.length>0&&p[0].thumb&&(l=p[0].thumb.replace(/hqdefault|mqdefault|default/,"maxresdefault")),{title:r,owner:n,ownerHref:s,stats:a,coverUrl:l,videos:p,totalSecs:u}}_formatDur(e){if(!e)return"0:00:00";const t=Math.floor(e/3600),r=Math.floor(e%3600/60),i=e%60;return`${String(t).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(i).padStart(2,"0")}`}_build(e,t,r){var n,s,o;const i=this._extractPlaylistData(t,r);if((s=(n=window.YPP.CONSTANTS)==null?void 0:n.SELECTORS)!=null&&s.PLAYLIST,t){t.classList.add("ypp-pl-hidden");const a=t.closest("ytd-playlist-header-renderer, #header");a&&a.classList.add("ypp-pl-hidden")}if(r&&r.length>0){const a=r[0].closest("ytd-playlist-video-list-renderer, ytd-item-section-renderer, ytd-section-list-renderer, ytd-rich-grid-renderer");a&&a.classList.add("ypp-pl-hidden");const l=r[0].closest("ytd-two-column-browse-results-renderer");l&&l.classList.add("ypp-pl-hidden")}this.cleanupEvents(),(o=document.getElementById("ypp-pl-root"))==null||o.remove(),this.container=document.createElement("div"),this.container.id="ypp-pl-root",this.container.innerHTML=this._renderHTML(i),e?e.insertBefore(this.container,e.firstChild):document.body.appendChild(this.container),this._wireEvents(e,i)}_renderHTML(e){const{coverUrl:t}=e;return`
        ${t?`<div class="ypp-pl-ambient-bg" style="background-image: url('${this._esc(t)}')"></div>
               <div class="ypp-pl-ambient-overlay"></div>`:""}
        <div class="ypp-pl-layout">
          ${this._renderSidebar(e)}
          ${this._renderMain(e)}
        </div>`}_renderSidebar(e){const{title:t,owner:r,ownerHref:i,stats:n,coverUrl:s,videos:o,totalSecs:a}=e,l=s?`<img src="${this._esc(s)}" alt="${this._esc(t)}" class="ypp-pl-cover-img" loading="lazy">`:`<div class="ypp-pl-cover-placeholder">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                   <path d="M9 18V5l12-2v13"/>
                   <circle cx="6" cy="18" r="3"/>
                   <circle cx="18" cy="16" r="3"/>
                 </svg>
               </div>`,d=r?`<a class="ypp-pl-owner" href="${this._esc(i)}">${this._esc(r)}</a>`:"",p=this._renderDurationCard(a,o.length);return`
          <!-- ── Sidebar ── -->
          <aside class="ypp-pl-sidebar">
            <div class="ypp-pl-cover-wrap">
              ${l}
              <div class="ypp-pl-cover-shimmer"></div>
            </div>

            <div class="ypp-pl-meta">
              <h1 class="ypp-pl-title">${this._esc(t)}</h1>
              ${d}
              <p class="ypp-pl-stats">${this._esc(n)}</p>
            </div>

            <div class="ypp-pl-actions-main">
              <button class="ypp-pl-btn-play" id="ypp-pl-play">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>
                Play all
              </button>
              <button class="ypp-pl-btn-shuffle" id="ypp-pl-shuffle">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18.15,13.65L21.5,17l-3.35,3.35l-0.7-0.71L19.58,17.5H16.4l-2.07-2.07l0.7-0.71l1.71,1.72h2.84l-2.14-2.14L18.15,13.65z M8.34,9.17L6.62,7.45H3.5v1h2.7l1.42,1.43L8.34,9.17z M19.58,6.5H16.4l-9.78,9.77H3.5v1h3.54l9.78-9.77h2.76l-2.14,2.14l0.71,0.71L21.5,7l-3.35-3.35l-0.71,0.71L19.58,6.5z"/>
                </svg>
                Shuffle
              </button>
            </div>

            <div class="ypp-pl-tools-grid">
              <button class="ypp-pl-btn-tool" id="ypp-pl-save" title="Save playlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                <span>Save</span>
              </button>
              <button class="ypp-pl-btn-tool" id="ypp-pl-share" title="Share">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                <span>Share</span>
              </button>
              <button class="ypp-pl-btn-tool ypp-pl-btn-danger" id="ypp-pl-remove-watched" title="Remove Watched Videos">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M9 6V4h6v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                <span>Clean</span>
              </button>
              <div id="ypp-pl-native-sort-container" class="ypp-pl-native-inject" style="grid-column: span 1;"></div>
              <button class="ypp-pl-btn-tool" id="ypp-pl-menu" title="More Actions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                <span>More</span>
              </button>
            </div>

            ${p}
          </aside>`}_renderMain(e){const{videos:t}=e,r=t.map((i,n)=>this._renderVideoCard(i,n)).join("");return`
          <!-- ── Video Grid ── -->
          <main class="ypp-pl-main">
            <!-- toolbar: count + column switcher + filter -->
            <div class="ypp-pl-toolbar">
              <span class="ypp-pl-count-label" id="ypp-pl-count">
                ${t.length} VIDEO${t.length!==1?"S":""}
              </span>
              
              <div id="ypp-pl-native-chips-container" class="ypp-pl-native-inject"></div>

              <div class="ypp-pl-col-switcher">
                <button class="ypp-col-btn ${this._currentCols===1?"active":""}" data-cols="1" title="List view">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
                <button class="ypp-col-btn ${this._currentCols===3?"active":""}" data-cols="3" title="3 Column grid">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="5" height="7"/>
                    <rect x="9.5" y="3" width="5" height="7"/>
                    <rect x="17" y="3" width="5" height="7"/>
                    <rect x="2" y="14" width="5" height="7"/>
                    <rect x="9.5" y="14" width="5" height="7"/>
                    <rect x="17" y="14" width="5" height="7"/>
                  </svg>
                </button>
                <button class="ypp-col-btn ${this._currentCols===4?"active":""}" data-cols="4" title="4 Column grid">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="3.5" height="7"/>
                    <rect x="7.5" y="3" width="3.5" height="7"/>
                    <rect x="13" y="3" width="3.5" height="7"/>
                    <rect x="18.5" y="3" width="3.5" height="7"/>
                    <rect x="2" y="14" width="3.5" height="7"/>
                    <rect x="7.5" y="14" width="3.5" height="7"/>
                    <rect x="13" y="14" width="3.5" height="7"/>
                    <rect x="18.5" y="14" width="3.5" height="7"/>
                  </svg>
                </button>
                <button class="ypp-col-btn ${this._currentCols===5?"active":""}" data-cols="5" title="5 Column grid">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="3" height="7"/>
                    <rect x="5.5" y="3" width="3" height="7"/>
                    <rect x="10" y="3" width="3" height="7"/>
                    <rect x="14.5" y="3" width="3" height="7"/>
                    <rect x="19" y="3" width="3" height="7"/>
                    <rect x="1" y="14" width="3" height="7"/>
                    <rect x="5.5" y="14" width="3" height="7"/>
                    <rect x="10" y="14" width="3" height="7"/>
                    <rect x="14.5" y="14" width="3" height="7"/>
                    <rect x="19" y="14" width="3" height="7"/>
                  </svg>
                </button>
              </div>

              <div class="ypp-pl-filter-wrap">
                <input class="ypp-pl-filter" placeholder="Filter videos…" id="ypp-pl-filter" autocomplete="off">
              </div>
            </div>

            <div class="ypp-pl-grid ypp-pl-cols-${this._currentCols}" id="ypp-pl-grid">
              ${r}
            </div>
          </main>`}_renderDurationCard(e,t){if(!e)return"";const r=n=>{const s=Math.floor(n/3600),o=Math.floor(n%3600/60),a=n%60;return s>0?`${s}:${String(o).padStart(2,"0")}:${String(a).padStart(2,"0")}`:`${o}:${String(a).padStart(2,"0")}`},i=[{label:"1.25×",s:Math.floor(e/1.25)},{label:"1.5×",s:Math.floor(e/1.5)},{label:"1.75×",s:Math.floor(e/1.75)},{label:"2×",s:Math.floor(e/2)}];return`
        <div class="ypp-pl-duration-card">
          <div class="ypp-pl-duration-label">TOTAL DURATION</div>
          <div class="ypp-pl-duration-time">${r(e)}</div>
          <div class="ypp-pl-duration-grid">
            ${i.map(n=>`
              <div class="ypp-pl-duration-row">
                <span class="ypp-pl-duration-speed">${n.label}</span>
                <span class="ypp-pl-duration-val">${r(n.s)}</span>
              </div>`).join("")}
            <div class="ypp-pl-duration-row">
              <span class="ypp-pl-duration-speed">Videos</span>
              <span class="ypp-pl-duration-val">${t}</span>
            </div>
          </div>
        </div>`}_renderVideoCard(e,t){const r=e.thumb?`<img src="${this._esc(e.thumb)}" alt="" loading="lazy">`:`<div class="ypp-pl-card-thumb-placeholder">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                   <polygon points="23 7 16 12 23 17 23 7"/>
                   <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                 </svg>
               </div>`,i=e.duration?`<div class="ypp-pl-card-duration">${this._esc(e.duration)}</div>`:"",n=e.progress>0?`<div class="ypp-pl-card-progress"><div style="width:${e.progress}%"></div></div>`:"";return`
        <a class="ypp-pl-card" href="${this._esc(e.href)}"
           data-title="${this._esc(e.title.toLowerCase())}" data-index="${t}" data-progress="${e.progress}">
          <div class="ypp-pl-card-reorder" title="Reorder (Coming soon)">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21,10H3V8h18V10z M21,14H3v2h18V14z"/></svg>
          </div>
          <div class="ypp-pl-card-thumb">
            <div class="ypp-pl-card-index">${this._esc(e.index)}</div>
            ${r}
            ${i}
            ${n}
          </div>
          <div class="ypp-pl-card-info">
            <div class="ypp-pl-card-title-row">
                <span class="ypp-pl-card-title" title="${this._esc(e.title)}">${this._esc(e.title)}</span>
                <button class="ypp-pl-card-menu" title="More options" data-href="${this._esc(e.href)}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5"/>
                        <circle cx="12" cy="12" r="1.5"/>
                        <circle cx="12" cy="19" r="1.5"/>
                    </svg>
                </button>
            </div>
            <span class="ypp-pl-card-chan">${this._esc(e.channel)}</span>
          </div>
        </a>`}_wireEvents(e,t){const r=this.container;this.addListener(r.querySelector("#ypp-pl-play"),"click",()=>{const u=t.videos[0];u!=null&&u.href&&(window.location.href=u.href)}),this.addListener(r.querySelector("#ypp-pl-shuffle"),"click",()=>{const u=t.videos.filter(m=>m.href);if(!u.length)return;const h=u[Math.floor(Math.random()*u.length)];window.location.href=h.href});const i=(u,h)=>{!h||!u||h.click()},n=r.querySelector("#ypp-pl-save");this.addListener(n,"click",()=>{const h=Array.from(document.querySelectorAll("ytd-playlist-header-renderer button, yt-playlist-header-view-model button")).find(m=>{const y=(m.getAttribute("aria-label")||m.title||m.textContent||"").toLowerCase();return y.includes("save")&&!y.includes("watch later")});i(n,h)});const s=r.querySelector("#ypp-pl-share");this.addListener(s,"click",()=>{const h=Array.from(document.querySelectorAll("ytd-playlist-header-renderer button, yt-playlist-header-view-model button")).find(m=>{const y=(m.getAttribute("aria-label")||m.title||m.textContent||"").toLowerCase();return y.includes("share")||y.includes("partager")||y.includes("compartir")})||document.querySelector('button[aria-label="Share"], button[aria-label="Partager"]');i(s,h)});const o=r.querySelector("#ypp-pl-menu");this.addListener(o,"click",()=>{const u=document.querySelector('ytd-playlist-header-renderer ytd-menu-renderer button, yt-playlist-header-view-model button[aria-label*="Action"], yt-playlist-header-view-model button[aria-label*="More"], yt-playlist-header-view-model button[aria-label*="Menu"]');i(o,u)}),this.addListener(r.querySelector("#ypp-pl-remove-watched"),"click",async u=>{var P;const h=u.currentTarget,y=e?Array.from(e.querySelectorAll("ytd-playlist-video-renderer, yt-lockup-view-model")):[],v=((P=this.settings)==null?void 0:P.hideWatchedThreshold)??10,b=new Set;y.forEach((w,C)=>{const x=["ytd-thumbnail-overlay-resume-playback-renderer #progress","ytd-thumbnail-overlay-resume-playback-renderer",'[overlay-style="DEFAULT"] #progress','#progress[style*="width"]'];for(const S of x){const E=w.querySelector(S);if(E){const N=parseInt(E.style.width,10);if(!isNaN(N)&&N>=v){b.add(C);break}if(E.tagName==="YTD-THUMBNAIL-OVERLAY-RESUME-PLAYBACK-RENDERER"){b.add(C);break}}}}),Array.from(r.querySelectorAll(".ypp-pl-card[data-progress]")).filter(w=>parseInt(w.dataset.progress,10)>=v).forEach(w=>b.add(parseInt(w.dataset.index,10)));const g=Array.from(b).sort((w,C)=>C-w);if(!g.length){h.innerHTML="<span>No watched videos found</span>",setTimeout(()=>{h.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4h6v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg><span>Clean</span>'},2e3);return}h.disabled=!0,h.textContent=`Removing 0 / ${g.length}…`;let _=0;for(const w of g){if(!this.isEnabled||!document.body.classList.contains("ypp-playlist-redesign"))break;if(await this._removeNativeVideo(w)){const x=r.querySelector(`.ypp-pl-card[data-index="${w}"]`);x&&(x.style.transition="opacity 0.3s, transform 0.3s",x.style.opacity="0",x.style.transform="scale(0.95)",setTimeout(()=>x.remove(),320)),_++,h.textContent=`Removing ${_} / ${g.length}…`}await new Promise(x=>setTimeout(x,900))}h.disabled=!1,h.textContent=_>0?`✓ Removed ${_} video${_!==1?"s":""}`:"None removed",_>0&&this._updateStatsAfterRemoval(),setTimeout(()=>{h.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4h6v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg><span>Clean</span>'},3e3)});const a=r.querySelector("#ypp-pl-grid"),l=u=>{a&&(this._currentCols=String(u),a.className=`ypp-pl-grid ypp-pl-cols-${this._currentCols}`,r.querySelectorAll(".ypp-col-btn").forEach(h=>{h.classList.toggle("active",h.dataset.cols===this._currentCols)}))};r.querySelectorAll(".ypp-col-btn").forEach(u=>{this.addListener(u,"click",()=>{const h=u.dataset.cols;l(h);try{window.YPP.StorageManager.set("playlistCols",h)}catch{}})}),l(this._currentCols),this.addListener(r.querySelector("#ypp-pl-filter"),"input",u=>{const h=u.target.value.toLowerCase().trim();r.querySelectorAll(".ypp-pl-card").forEach(m=>{const y=!h||(m.dataset.title||"").includes(h);m.style.display=y?"":"none"})}),this.addListener(a,"click",u=>{const h=u.target.closest(".ypp-pl-card-menu");if(!h)return;u.preventDefault(),u.stopPropagation();const m=h.closest(".ypp-pl-card"),y=parseInt(m.dataset.index,10),f=(e?Array.from(e.querySelectorAll("ytd-playlist-video-renderer, yt-lockup-view-model")):[])[y];if(f){const g=f.querySelector('yt-icon-button.dropdown-trigger button, ytd-menu-renderer button, button#button[aria-label*="Action"]');g&&i(h,g)}});const d=r.querySelector("#ypp-pl-native-sort-container");if(d&&e){const u=e.querySelector("yt-sort-filter-sub-menu-renderer, yt-sort-filter-sub-menu-view-model, yt-dropdown-menu");u&&d.appendChild(u)}const p=r.querySelector("#ypp-pl-native-chips-container");if(p&&e){const u=e.querySelector("ytd-feed-filter-chip-bar-renderer, yt-chip-cloud-renderer, yt-chip-cloud-chip-renderer");u&&p.appendChild(u)}}_esc(e){return(e||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}_removeNativeVideo(e){return new Promise(t=>{const n=document.querySelectorAll("ytd-playlist-video-renderer, yt-lockup-view-model")[e];if(!n)return t(!1);const s=["ytd-menu-renderer yt-button-shape button","ytd-menu-renderer button",'yt-button-shape button[aria-label="Action menu"]','button[aria-label="Action menu"]','[aria-label="More actions"]',"yt-icon-button button","yt-button-shape button"];let o=null;for(const a of s){const l=n.querySelector(`ytd-menu-renderer ${a}, .ytd-menu-renderer ${a}, ${a}`);if(l&&(l.getAttribute("aria-label")||"").toLowerCase().includes("action")){o=l;break}else l&&!o&&(o=l)}if(!o)return t(!1);document.body.click(),setTimeout(()=>{o.click(),this.utils.pollFor(()=>{const a=document.querySelector('ytd-menu-popup-renderer, tp-yt-iron-dropdown[aria-expanded="true"], .yt-core-popup');if(a){const l=a.querySelectorAll('ytd-menu-service-item-renderer, ytd-menu-navigation-item-renderer, [role="menuitem"], .yt-core-attributed-string');for(const d of l){const p=(d.textContent||"").toLowerCase();if(p.includes("remove from")||p.includes("delete from")||p.includes("remove from watch later"))return d}}return null},2500,80).then(a=>{a?((a.closest('[role="menuitem"]')||a.closest("ytd-menu-service-item-renderer")||a).click(),setTimeout(()=>document.body.click(),50),t(!0)):(document.body.click(),t(!1))}).catch(()=>{document.body.click(),t(!1)})},80)})}_updateStatsAfterRemoval(){const e=this.container;if(!e)return;const t=e.querySelectorAll(".ypp-pl-card"),r=e.querySelector(".ypp-pl-stats");r&&(r.textContent=r.textContent.replace(/\d+/,t.length));const i=e.querySelectorAll(".ypp-pl-duration-row");for(const o of i){const a=o.querySelector(".ypp-pl-duration-speed");if(a&&a.textContent==="Videos"){const l=o.querySelector(".ypp-pl-duration-val");l&&(l.textContent=t.length)}}let n=1,s=0;if(t.forEach(o=>{const a=o.querySelector(".ypp-pl-card-index");a&&(a.textContent=n),o.dataset.index=n-1;const l=o.querySelector(".ypp-pl-card-duration");if(l){const p=l.textContent.replace(/[^0-9:]/g,"").split(":").map(u=>parseInt(u,10));p.length===3?s+=p[0]*3600+p[1]*60+p[2]:p.length===2?s+=p[0]*60+p[1]:p.length===1&&!isNaN(p[0])&&(s+=p[0])}n++}),s>=0){const o=d=>{const p=Math.floor(d/3600),u=Math.floor(d%3600/60),h=d%60;return p>0?`${p}:${String(u).padStart(2,"0")}:${String(h).padStart(2,"0")}`:`${u}:${String(h).padStart(2,"0")}`},a=e.querySelector(".ypp-pl-duration-time");a&&(a.textContent=o(s));const l=[{label:"1.25×",s:Math.floor(s/1.25)},{label:"1.5×",s:Math.floor(s/1.5)},{label:"1.75×",s:Math.floor(s/1.75)},{label:"2×",s:Math.floor(s/2)}];for(const d of i){const p=d.querySelector(".ypp-pl-duration-speed");if(!p)continue;const u=p.textContent,h=l.find(m=>m.label===u);if(h){const m=d.querySelector(".ypp-pl-duration-val");m&&(m.textContent=o(h.s))}}}}},window.YPP.features=window.YPP.features||{},window.YPP.features.PlaylistDuration=class extends window.YPP.features.BaseFeature{constructor(){super("PlaylistDuration"),this.debounceTimer=null,this.card=null,this._boundCalculate=this.calculateDuration.bind(this)}getConfigKey(){return"playlistDuration"}async _getYoutubeConfig(){return new Promise(e=>{const t=Math.random().toString(36).slice(2);let r=!1;const i=n=>{n.data&&n.data.type==="YPP_YTCFG_RESPONSE"&&n.data.reqId===t&&(window.removeEventListener("message",i),r||(r=!0,e(n.data.config)))};if(window.addEventListener("message",i),setTimeout(()=>{r||(r=!0,window.removeEventListener("message",i),e({}))},1e3),!document.getElementById("ypp-ytcfg-bridge")){const n=document.createElement("script");n.id="ypp-ytcfg-bridge",n.src=chrome.runtime.getURL("src/inject/ytcfg-bridge.js"),document.documentElement.appendChild(n)}setTimeout(()=>{window.postMessage({type:"YPP_YTCFG_REQUEST",reqId:t},"*")},50)})}async enable(){await super.enable(),this._debouncedCalculate=this.utils.debounce(this._boundCalculate,200),this.onBusEvent("app:pageChange",()=>{location.pathname.includes("/playlist")?setTimeout(()=>this.calculateDuration(),100):this.card&&(this.card.remove(),this.card=null)}),this.observer.start(),this.observer.register("playlist-duration","ytd-playlist-video-renderer, yt-lockup-view-model, #ypp-pl-root",()=>{location.pathname.includes("/playlist")&&this._debouncedCalculate()},!1),location.pathname.includes("/playlist")&&this.calculateDuration()}async disable(){await super.disable(),this.observer&&(this.observer.unregister("playlist-duration"),this.observer.stop()),this.card&&(this.card.remove(),this.card=null)}async calculateDuration(){if(!this.isCalculating){this.isCalculating=!0;try{let e=0,t=0,r=0;const n=Array.from(document.querySelectorAll("script")).find(m=>m.textContent.includes("var ytInitialData =")||m.textContent.includes('window["ytInitialData"] =')||m.textContent.includes("window.ytInitialData ="));if(!n)return this.fallbackCalculate();let s;const o=n.textContent,a=["var ytInitialData = ",'window["ytInitialData"] = ',"window.ytInitialData = "];for(const m of a){const y=o.indexOf(m);if(y!==-1){const v=y+m.length;let b=o.slice(v);const f=b.lastIndexOf(";");f!==-1&&f>b.length-15&&(b=b.slice(0,f));try{s=JSON.parse(b.trim());break}catch{const _=b.lastIndexOf("}");if(_!==-1)try{s=JSON.parse(b.slice(0,_+1));break}catch{}}}}if(!s)return this.fallbackCalculate();let l=0;const d=[".metadata-stats","ytd-playlist-byline-renderer","yt-content-metadata-view-model-wiz__metadata-row span",'yt-formatted-string[id="stats"]'];for(const m of d){const y=document.querySelector(m);if(y){const v=y.textContent.match(/([\d,]+)\s+videos?/i);if(v){l=parseInt(v[1].replace(/,/g,""),10);break}}}let p=null;const u=m=>{var y,v,b,f,g,_;if(!(!m||typeof m!="object")){if(m.playlistVideoRenderer){const P=m.playlistVideoRenderer;P.lengthSeconds&&(e+=parseInt(P.lengthSeconds,10),t++)}if((b=(v=(y=m.numVideosText)==null?void 0:y.runs)==null?void 0:v[0])!=null&&b.text){const P=parseInt(m.numVideosText.runs[0].text.replace(/[^0-9]/g,""),10);P>r&&(r=P)}(_=(g=(f=m.continuationItemRenderer)==null?void 0:f.continuationEndpoint)==null?void 0:g.continuationCommand)!=null&&_.token&&(p=m.continuationItemRenderer.continuationEndpoint.continuationCommand.token),Object.values(m).forEach(u)}};u(s),l>r&&(r=l),r===0&&(r=t),this.renderCard(e,t,r-t,r);const h=await this._getYoutubeConfig();if(h&&h.apiKey&&p)for(;p&&t<r;)try{const m=await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${h.apiKey}`,{method:"POST",headers:{"Content-Type":"application/json","X-YouTube-Client-Name":"1","X-YouTube-Client-Version":h.clientVersion||"2.20240101.01.00"},body:JSON.stringify({context:h.context||{client:{clientName:"WEB",clientVersion:h.clientVersion||"2.20240101.01.00"}},continuation:p})});if(!m.ok)break;const y=await m.json();p=null;const v=b=>{var f,g,_;if(!(!b||typeof b!="object")){if(b.playlistVideoRenderer){const P=b.playlistVideoRenderer;P.lengthSeconds&&(e+=parseInt(P.lengthSeconds,10),t++)}(_=(g=(f=b.continuationItemRenderer)==null?void 0:f.continuationEndpoint)==null?void 0:g.continuationCommand)!=null&&_.token&&(p=b.continuationItemRenderer.continuationEndpoint.continuationCommand.token),Object.values(b).forEach(v)}};v(y),this.renderCard(e,t,r-t,r),await new Promise(b=>setTimeout(b,250))}catch{break}this.renderCard(e,t,r-t,r)}catch{this.fallbackCalculate()}finally{this.isCalculating=!1}}}fallbackCalculate(){const e="ytd-playlist-video-renderer, yt-lockup-view-model",t=["ytd-thumbnail-overlay-time-status-renderer",'badge-shape[class*="time-status"]',".yt-lockup-view-model-wiz__badge .badge-shape",'yt-formatted-string[class*="time"]'],r=document.querySelectorAll(e);let i=0,n=0;r.forEach(l=>{for(const d of t){const p=l.querySelector(d);if(!p)continue;const u=(p.getAttribute("aria-label")||p.textContent||"").trim();if(u&&u.includes(":")){const h=u.replace(/[^0-9:]/g,""),m=this.parseTime(h);if(m>0){i+=m,n++;break}}}});let s=r.length;const o=[".metadata-stats","ytd-playlist-byline-renderer","yt-content-metadata-view-model-wiz__metadata-row span",'yt-formatted-string[id="stats"]'];for(const l of o){const d=document.querySelector(l);if(d){const p=d.textContent.match(/([\d,]+)\s+videos?/i);if(p){s=parseInt(p[1].replace(/,/g,""),10);break}}}const a=r.length-n;r.length>0&&this.renderCard(i,n,a,s)}parseTime(e){const t=e.split(":").map(Number);return t.length===3?t[0]*3600+t[1]*60+t[2]:t.length===2?t[0]*60+t[1]:t.length===4?t[0]*86400+t[1]*3600+t[2]*60+t[3]:0}formatTimeText(e){if(e===0)return"0s";const t=Math.floor(e/86400),r=Math.floor(e%86400/3600),i=Math.floor(e%3600/60),n=e%60;let s=[];return t>0&&s.push(`<span class="ypp-time-val">${t}</span><span class="ypp-time-lbl">d</span>`),r>0&&s.push(`<span class="ypp-time-val">${r}</span><span class="ypp-time-lbl">h</span>`),(i>0||r>0)&&s.push(`<span class="ypp-time-val">${i}</span><span class="ypp-time-lbl">m</span>`),s.push(`<span class="ypp-time-val">${n}</span><span class="ypp-time-lbl">s</span>`),s.join(" ")}renderCard(e,t,r,i){const n=document.querySelector("#ypp-pl-root .ypp-pl-sidebar"),s=n||document.querySelector("ytd-playlist-header-renderer")||document.querySelector("yt-playlist-header-view-model")||document.querySelector('ytd-browse[page-subtype="playlist"] #header');if(!s)return;if(!this.card){this.card=document.createElement("div"),this.card.id="ypp-playlist-card";const u=document.createElement("div");u.style.cssText=`
                position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
                background: radial-gradient(circle at top right, rgba(62, 166, 255, 0.15), transparent 60%);
                pointer-events: none; z-index: 0;
            `,this.card.appendChild(u),this.contentDiv=document.createElement("div"),this.contentDiv.style.cssText="position: relative; z-index: 1;",this.card.appendChild(this.contentDiv);const h=document.createElement("style");h.textContent=`
                #ypp-playlist-card {
                  margin-top: 24px;
                  background: var(--sf, linear-gradient(145deg, rgba(20, 20, 24, 0.8), rgba(15, 15, 18, 0.9)));
                  border: none;
                  border-radius: 34px;
                  padding: 24px;
                  font-family: var(--ypp-font-family, 'Inter', 'Roboto', sans-serif);
                  color: var(--yt-spec-text-primary, #fff);
                  width: 100%;
                  box-sizing: border-box;
                  backdrop-filter: blur(var(--blur, 24px)) saturate(1.2);
                  -webkit-backdrop-filter: blur(var(--blur, 24px)) saturate(1.2);
                  box-shadow: var(--shadow-base, 0 16px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1));
                  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow var(--bounce, 0.3s ease);
                  position: relative;
                  overflow: hidden;
                }
                #ypp-playlist-card:hover {
                  box-shadow: var(--shadow-hover, 0 16px 40px rgba(0, 0, 0, 0.5));
                }
                .ypp-time-val { font-weight: 700; color: var(--yt-spec-text-primary, #fff); }
                .ypp-time-lbl { font-weight: 500; color: var(--yt-spec-text-secondary, #aaa); margin-left: 2px; margin-right: 6px; font-size: 0.85em; }
                .ypp-speed-box { background: rgba(255,255,255,0.06); padding: 10px 12px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; border: 1px solid rgba(255,255,255,0.03); transition: background 0.2s; }
                .ypp-speed-box:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.1); }
                .ypp-speed-lbl { font-size: 11px; color: var(--yt-spec-text-secondary, #aaa); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                .ypp-speed-val { font-size: 14px; }
            `,this.card.appendChild(h)}if(n){this.card.parentElement!==n&&n.appendChild(this.card);const u=n.querySelector(".ypp-pl-duration-card");u&&u!==this.card&&(u.style.display="none")}else{const u=s.querySelector("ytd-playlist-byline-renderer")||s.querySelector(".metadata-action-bar");if(u&&u.parentNode)this.card.parentElement!==u.parentNode&&u.parentNode.insertBefore(this.card,u.nextSibling);else{const h=s.querySelector(".metadata-wrapper")||s.querySelector(".immersive-header-content")||s;this.card.parentElement!==h&&h.appendChild(this.card)}}const o=this.formatTimeText(e),a=this.formatTimeText(Math.floor(e/1.25)),l=this.formatTimeText(Math.floor(e/1.5)),d=this.formatTimeText(Math.floor(e/2));let p="";t<i&&(p=`
                <div style="margin-top: 16px; padding: 10px 14px; background: rgba(255, 171, 0, 0.1); border: 1px solid rgba(255, 171, 0, 0.3); border-radius: 10px; font-size: 12px; color: #ffab00; display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <span><strong>Partial calculation:</strong> Scroll down to load all videos. Calculated ${t} of ${i} videos.</span>
                </div>
            `),this.contentDiv.innerHTML=`
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                <div>
                    <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--ypp-accent-color, #3ea6ff); text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 6px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Total Duration
                    </div>
                    <div style="font-size: 26px; line-height: 1.2;">${o}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 13px; font-weight: 600; color: #fff; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                        ${t} videos
                    </div>
                    ${r>0?`<div style="font-size: 11px; color: #ff4e45; margin-top: 6px; font-weight: 500;">${r} unplayable</div>`:""}
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                <div class="ypp-speed-box">
                    <span class="ypp-speed-lbl">At 1.25x Speed</span>
                    <span class="ypp-speed-val">${a}</span>
                </div>
                <div class="ypp-speed-box">
                    <span class="ypp-speed-lbl">At 1.50x Speed</span>
                    <span class="ypp-speed-val">${l}</span>
                </div>
                <div class="ypp-speed-box">
                    <span class="ypp-speed-lbl">At 2.00x Speed</span>
                    <span class="ypp-speed-val">${d}</span>
                </div>
            </div>
            
            ${p}
        `}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ReversePlaylist=class extends window.YPP.features.BaseFeature{constructor(){super("ReversePlaylist"),this.isReversed=!1,this.btn=null}getConfigKey(){return"reversePlaylist"}async enable(){var e;await super.enable();try{this.addListener(window,"yt-navigate-finish",()=>{this.isReversed=!1,this.isEnabled&&this.initUI()}),this.initUI()}catch(t){(e=this.utils)==null||e.log("Error enabling ReversePlaylist","PLAYLIST","error",t)}}async disable(){window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("reverse-playlist-header"),this.removeUI(),this.isReversed=!1,await super.disable()}initUI(){window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.register("reverse-playlist-header","ytd-playlist-panel-renderer #header-contents",e=>{if(!this.isEnabled)return;const t=e[0];t&&this.injectButton(t)},!1)}injectButton(e){if(document.getElementById("ypp-reverse-btn"))return;const t=document.createElement("button");t.id="ypp-reverse-btn",t.title="Reverse Playlist Order",t.innerHTML='<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 24px; height: 24px; fill: currentColor;"><g><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"></path></g></svg>',Object.assign(t.style,{background:"transparent",border:"none",color:"var(--yt-spec-text-secondary)",cursor:"pointer",padding:"8px",marginLeft:"8px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"background-color 0.2s"}),t.onmouseover=()=>t.style.backgroundColor="var(--yt-spec-badge-chip-background)",t.onmouseleave=()=>t.style.backgroundColor="transparent",this.addListener(t,"click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleReverse(t)}),e.appendChild(t),this.btn=t}toggleReverse(e){const t=document.querySelector("ytd-playlist-panel-renderer #items");if(!t)return;const r=Array.from(t.children);r.length<2||(r.reverse(),r.forEach(i=>t.appendChild(i)),this.isReversed=!this.isReversed,e.style.color=this.isReversed?"var(--yt-spec-text-primary)":"var(--yt-spec-text-secondary)",this.utils.createToast&&this.utils.createToast(this.isReversed?"Playlist reversed":"Playlist restored","info",2e3))}removeUI(){this.btn&&(this.btn.remove(),this.btn=null);const e=document.getElementById("ypp-reverse-btn");e&&e.remove()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.WatchHistoryTracker=class extends window.YPP.features.BaseFeature{constructor(){super("WatchHistoryTracker"),this.STORAGE_PREFIX="ypp_analytics_",this.FLUSH_INTERVAL=1e4,this.activeVideoId=null,this.videoTitle="Unknown Video",this.videoChannel="Unknown Channel",this.sessionSeconds=0,this.lastTickTime=0,this.isTracking=!1,this.videoElement=null,this.lastFlushTime=0,this.lastAlertTime=0,this.handleTimeUpdate=this.handleTimeUpdate.bind(this),this.handlePlay=this.handlePlay.bind(this),this.handlePause=this.handlePause.bind(this),this.saveData=this.saveData.bind(this)}getConfigKey(){return null}async enable(){await super.enable(),this.addListener(window,"beforeunload",this.saveData),this.addListener(document,"visibilitychange",()=>{document.hidden&&this.saveData()}),this._injectAlertStyles(),(this.utils.isWatchPage()||this._isOnShortsPage())&&this._handleStartTracking()}async disable(){var e;await super.disable(),this.saveData(),this.stopTracking(),(e=document.querySelector(".ypp-watch-alert"))==null||e.remove()}onVideoChange(e){this.isEnabled&&this._handleStartTracking(e)}onPageChange(e){this.isEnabled&&(this.utils.isWatchPage()||this._isOnShortsPage()?this._handleStartTracking():this.stopTracking())}_isOnShortsPage(){return location.pathname.startsWith("/shorts/")}_handleStartTracking(e){this.stopTracking();const t=this.utils.isWatchPage(),r=this._isOnShortsPage();if(!t&&!r)return;let i=e;i||(i=new URLSearchParams(window.location.search).get("v"),r&&(i=location.pathname.split("/shorts/")[1])),i&&(this.activeVideoId=i,this.sessionSeconds=0,this.videoTitle="Unknown Video",this.videoChannel="Unknown Channel",this.pollFor("watch-history-video","video.html5-main-video",n=>{this.attachListeners(n)}))}attachListeners(e){var t,r;this.isTracking||!this.isEnabled||(this.videoElement=e,this.isTracking=!0,this.lastTickTime=Date.now(),this.extractMetadata(),this.addListener(this.videoElement,"timeupdate",this.handleTimeUpdate),this.addListener(this.videoElement,"play",this.handlePlay),this.addListener(this.videoElement,"pause",this.handlePause),(r=(t=this.utils).log)==null||r.call(t,`Tracking started for ${this.activeVideoId}`,"TRACKER"))}stopTracking(){this.videoElement&&(this.removeListener(this.videoElement,"timeupdate",this.handleTimeUpdate),this.removeListener(this.videoElement,"play",this.handlePlay),this.removeListener(this.videoElement,"pause",this.handlePause)),this.saveData(),this.isTracking=!1,this.videoElement=null,this.activeVideoId=null,this.sessionSeconds=0}async extractMetadata(){var e,t;try{const r=((t=(e=window.YPP.CONSTANTS)==null?void 0:e.SELECTORS)==null?void 0:t.METADATA_SELECTORS)||{TITLE:["h1.ytd-watch-metadata"],CHANNEL:["ytd-video-owner-renderer #channel-name a"]},i=r.TITLE[0]||"h1.ytd-watch-metadata";await this.waitForElement(i,5e3);const n=r.TITLE.map(o=>document.querySelector(o)).find(o=>o)||document.querySelector("h1.ytd-watch-metadata"),s=r.CHANNEL.map(o=>document.querySelector(o)).find(o=>o)||document.querySelector("ytd-video-owner-renderer #channel-name a");this.videoTitle=n?n.textContent.trim():"Unknown Video",this.videoChannel=s?s.textContent.trim():"Unknown Channel"}catch{}}handlePlay(){this.lastTickTime=Date.now(),this.videoTitle==="Unknown Video"&&this.extractMetadata()}handlePause(){this.handleTimeUpdate()}handleTimeUpdate(){if(!this.isTracking||!this.videoElement||this.videoElement.paused)return;const e=Date.now(),t=e-this.lastTickTime;t>0&&t<5e3&&(this.sessionSeconds+=t/1e3),this.lastTickTime=e,this.lastFlushTime||(this.lastFlushTime=e),e-this.lastFlushTime>=this.FLUSH_INTERVAL&&(this.saveData(),this.lastFlushTime=e)}async saveData(){var s,o;if(!this.activeVideoId||this.sessionSeconds<5)return;const e=Math.floor(this.sessionSeconds),t=this.activeVideoId,r={title:this.videoTitle,channel:this.videoChannel,lastWatched:Date.now()};this.sessionSeconds-=e;const i=new Date().toISOString().split("T")[0],n=`${this.STORAGE_PREFIX}${i}`;try{let l=await window.YPP.StorageManager.get(n)||{videos:{},totalSeconds:0};l.videos||(l.videos={}),l.totalSeconds||(l.totalSeconds=0),l.totalSeconds+=e,l.videos[t]||(l.videos[t]={title:r.title,channel:r.channel,seconds:0,lastWatched:r.lastWatched});const d=l.videos[t];d.seconds+=e,d.lastWatched=r.lastWatched,d.title==="Unknown Video"&&r.title!=="Unknown Video"&&(d.title=r.title),d.channel==="Unknown Channel"&&r.channel!=="Unknown Channel"&&(d.channel=r.channel),await window.YPP.StorageManager.set(n,l),this._checkWatchTimeAlert(l.totalSeconds)}catch(a){if(a.message&&a.message.includes("Extension context invalidated"))return;(o=(s=this.utils).log)==null||o.call(s,"Save failed: "+a.message,"TRACKER","error")}}_checkWatchTimeAlert(e){window.YPP.events&&window.YPP.events.emit("watchTime:saved",e)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SmartHistory=class extends window.YPP.features.BaseFeature{constructor(){super("SmartHistory"),this.STORAGE_KEY="ytProVideos",this.SETTINGS_KEY="resumeSettings",this.defaultSettings={pauseResume:!1,minWatchTime:60,minVideoLength:120,markPlayedTime:10,deleteAfter:0},this.videoElement=null,this.isTracking=!1,this._onTimeUpdate=this.handleTimeUpdate.bind(this),this._onBeforeUnload=this.forceSave.bind(this),this.lastSaveTime=0,this.SAVE_INTERVAL=5e3,this.currentVideoData=null,this.resumeBlacklist=!1,this.initialResumeDone=!1}getConfigKey(){return"smartHistory"}async enable(){await super.enable(),await this.initStorage(),this.utils.isWatchPage()&&this.startVideoTracking(),this.addListener(window,"beforeunload",this._onBeforeUnload)}async disable(){await super.disable(),this.forceSave(),this.stopVideoTracking()}onVideoChange(e){this.isEnabled&&(this.forceSave(),this.startVideoTracking(e))}onPageChange(e){this.isEnabled&&(this.utils.isWatchPage()?this.startVideoTracking():this.stopVideoTracking())}async initStorage(){const e=await new Promise(r=>chrome.storage.local.getBytesInUse(this.STORAGE_KEY,r));(e===0||e===void 0)&&await new Promise(r=>chrome.storage.local.set({[this.STORAGE_KEY]:[]},r));const t=await new Promise(r=>chrome.storage.local.getBytesInUse(this.SETTINGS_KEY,r));(t===0||t===void 0)&&await new Promise(r=>chrome.storage.local.set({[this.SETTINGS_KEY]:this.defaultSettings},r))}extractWatchID(e){if(!e)return"";const t=e.match(/[?&]v=([^&#]+)/);return t?t[1]:""}startVideoTracking(e){this.stopVideoTracking();let t=e||new URLSearchParams(window.location.search).get("v");t&&(this.activeVideoId=t,this.initialResumeDone=!1,this.resumeBlacklist=!1,this.pollFor("smart-history-video","video.html5-main-video",async r=>{if(this.isTracking||!this.isEnabled)return;this.videoElement=r,this.isTracking=!0;const i=await new Promise(o=>chrome.storage.local.get([this.STORAGE_KEY,this.SETTINGS_KEY],o));this.settings=i[this.SETTINGS_KEY]||this.defaultSettings;const s=(i[this.STORAGE_KEY]||[]).find(o=>this.extractWatchID(o.videolink)===t);this.currentVideoData=s||null,s&&s.doNotResume&&(this.resumeBlacklist=!0),this.checkAutoResume(),this.addListener(this.videoElement,"timeupdate",this._onTimeUpdate)}))}stopVideoTracking(){this.videoElement&&(this.removeListener(this.videoElement,"timeupdate",this._onTimeUpdate),this.videoElement=null),this.isTracking=!1,this.activeVideoId=null,this.currentVideoData=null}checkAutoResume(){if(!this.isEnabled||!this.videoElement||this.initialResumeDone||this.settings.pauseResume||this.resumeBlacklist)return;const e=this.videoElement.duration;if(!e||isNaN(e)){const t=()=>{this.videoElement.removeEventListener("loadedmetadata",t),this.checkAutoResume()};this.videoElement.addEventListener("loadedmetadata",t);return}if(e<this.settings.minVideoLength){this.initialResumeDone=!0;return}if(this.currentVideoData){const t=this.currentVideoData.time;t>this.settings.minWatchTime&&!this.currentVideoData.complete&&!this.currentVideoData.doNotResume&&(this.videoElement.currentTime=t,console.log(`[SmartHistory] Auto-resumed video to ${t}s`))}this.initialResumeDone=!0}grabTitle(){const e=document.querySelector("h1.ytd-watch-metadata yt-formatted-string")||document.querySelector("ytd-watch-metadata h1 yt-formatted-string")||document.querySelector("h1.title.style-scope.ytd-video-primary-info-renderer")||document.querySelector("h1[class*='title']");return e?e.textContent.trim():""}grabChannel(){const e=document.querySelector("ytd-video-owner-renderer a.yt-simple-endpoint.yt-formatted-string");return e?e.textContent.trim():""}async handleTimeUpdate(){if(!this.activeVideoId||!this.videoElement||this.videoElement.paused)return;const e=this.videoElement.currentTime,t=this.videoElement.duration;if(!t||t<this.settings.minVideoLength||e<3)return;const r=Date.now();r-this.lastSaveTime<this.SAVE_INTERVAL||(this.lastSaveTime=r,this.saveCurrentState(e,t))}forceSave(){if(!this.activeVideoId||!this.videoElement)return;const e=this.videoElement.currentTime,t=this.videoElement.duration;t&&e>3&&t>=this.settings.minVideoLength&&this.saveCurrentState(e,t)}async saveCurrentState(e,t){if(!this.activeVideoId)return;const r=`https://www.youtube.com/watch?v=${this.activeVideoId}`,i=this.grabTitle()||(this.currentVideoData?this.currentVideoData.title:"Unknown Title"),n=this.grabChannel()||(this.currentVideoData?this.currentVideoData.channel:""),s=`https://i.ytimg.com/vi/${this.activeVideoId}/mqdefault.jpg`,o=t-e<=this.settings.markPlayedTime||e/t>.95;let l=(await new Promise(m=>chrome.storage.local.get(this.STORAGE_KEY,m)))[this.STORAGE_KEY]||[];const d=l.find(m=>this.extractWatchID(m.videolink)===this.activeVideoId),p=d&&d.watchCount||1,u=d?d.doNotResume:!1,h={videolink:r,title:i,time:e,duration:t,complete:o,timestamp:Date.now(),thumbnail:s,channel:n,watchCount:p,doNotResume:u};l=l.filter(m=>this.extractWatchID(m.videolink)!==this.activeVideoId),l.push(h),l.length>1e3&&(l.sort((m,y)=>m.timestamp-y.timestamp),l=l.slice(l.length-1e3)),this.currentVideoData=h,await new Promise(m=>chrome.storage.local.set({[this.STORAGE_KEY]:l},m))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.WatchTimeAlert=class extends window.YPP.features.BaseFeature{constructor(){super("WatchTimeAlert"),this.lastAlertTime=0,this.handleWatchTimeSaved=this.handleWatchTimeSaved.bind(this)}getConfigKey(){return"watchTimeAlert"}async enable(){await super.enable(),this._injectAlertStyles(),window.YPP.events&&window.YPP.events.on("watchTime:saved",this.handleWatchTimeSaved)}async disable(){var e;await super.disable(),window.YPP.events&&window.YPP.events.off("watchTime:saved",this.handleWatchTimeSaved),(e=document.querySelector(".ypp-watch-alert"))==null||e.remove()}handleWatchTimeSaved(e){var n;if(!this.isEnabled)return;const t=((n=this.settings)==null?void 0:n.watchTimeAlertHours)??2,r=t*3600;if(e<r)return;const i=Date.now();i-this.lastAlertTime<60*60*1e3||(this.lastAlertTime=i,this._showWatchTimeAlert(e,t))}_showWatchTimeAlert(e,t){var o;(o=document.querySelector(".ypp-watch-alert"))==null||o.remove();const r=Math.floor(e/3600),i=Math.floor(e%3600/60),n=r>0?`${r}h ${i}m`:`${i}m`,s=document.createElement("div");s.className="ypp-watch-alert",s.innerHTML=`
            <div class="ypp-watch-alert-icon">⏱️</div>
            <div class="ypp-watch-alert-body">
                <div class="ypp-watch-alert-title">Watch Time Reminder</div>
                <div class="ypp-watch-alert-msg">You've watched <strong>${n}</strong> today (limit: ${t}h). Time for a break?</div>
            </div>
            <button class="ypp-watch-alert-close" aria-label="Dismiss">✕</button>
        `,this.addListener(s.querySelector(".ypp-watch-alert-close"),"click",()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)}),document.body.appendChild(s),s.offsetWidth,s.classList.add("show"),setTimeout(()=>{s.isConnected&&(s.classList.remove("show"),setTimeout(()=>s.remove(),300))},2e4)}_injectAlertStyles(){if(document.getElementById("ypp-watch-alert-styles"))return;const e=document.createElement("style");e.id="ypp-watch-alert-styles",e.textContent=`
            .ypp-watch-alert {
                position: fixed;
                bottom: -100px;
                right: 24px;
                background: rgba(20, 20, 20, 0.95);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 16px;
                z-index: 999999;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                color: white;
                font-family: 'Inter', Roboto, sans-serif;
                transition: bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .ypp-watch-alert.show {
                bottom: 24px;
            }
            .ypp-watch-alert-icon {
                font-size: 24px;
                animation: ypp-pulse 2s infinite;
            }
            .ypp-watch-alert-title {
                font-weight: 700;
                font-size: 14px;
                margin-bottom: 4px;
                color: #ff4e45;
            }
            .ypp-watch-alert-msg {
                font-size: 13px;
                color: #ccc;
                max-width: 250px;
                line-height: 1.4;
            }
            .ypp-watch-alert-close {
                background: none;
                border: none;
                color: #888;
                cursor: pointer;
                font-size: 16px;
                padding: 4px;
                margin-left: 8px;
                transition: color 0.2s;
            }
            .ypp-watch-alert-close:hover {
                color: white;
            }
            @keyframes ypp-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `,document.head.appendChild(e)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.WatchTimeLimit=class extends window.YPP.features.BaseFeature{constructor(){super("WatchTimeLimit")}getConfigKey(){return"watchTimeAlertHours"}async enable(){await super.enable()}async disable(){await super.disable()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ContinueWatching=class extends window.YPP.features.BaseFeature{constructor(){super("ContinueWatching"),this.observer=null,this.notifiedVideos=new Set}getConfigKey(){return"continueWatching"}async enable(){var e;await super.enable();try{this.addListener(window,"yt-navigate-finish",()=>{this.notifiedVideos.clear(),this.isEnabled&&this.startObserver()}),this.startObserver()}catch(t){(e=this.utils)==null||e.log("Error enabling ContinueWatching","CONTINUE","error",t)}}async disable(){await super.disable(),this.observer&&(typeof this.observer.unregister=="function"?this.observer.unregister("related_videos_continue"):typeof this.observer.stop=="function"&&this.observer.stop()),document.querySelectorAll("ytd-rich-item-renderer[data-ypp-processed], ytd-compact-video-renderer[data-ypp-processed]").forEach(e=>{e.removeAttribute("data-ypp-processed"),e.classList.remove("previously-watched-video")})}startObserver(){if(this.observer)return;this.observer=window.YPP.sharedObserver||new this.utils.DOMObserver,this.observer.register("related_videos_continue","ytd-rich-item-renderer, ytd-compact-video-renderer",this.handleNewVideo.bind(this));const e=document.querySelector("ytd-watch-next-secondary-results-renderer, ytd-rich-grid-renderer")||document.body;this.observer.start(e)}handleNewVideo(e){if(!this.isEnabled)return;const t=Array.isArray(e)?e:[e];for(const r of t){if(r.hasAttribute("data-ypp-processed"))continue;r.setAttribute("data-ypp-processed","true");const i=r.querySelector("ytd-thumbnail-overlay-resume-playback-renderer #progress");if(i){const n=i.style.width;if(n&&n!=="100%"){r.classList.add("previously-watched-video");const s=r.querySelector("#video-title"),o=s?s.textContent.trim():"a video",a=r.querySelector("a#thumbnail"),l=a?a.href:null;if(l&&!this.notifiedVideos.has(l)&&window.location.pathname==="/"&&(this.notifiedVideos.add(l),this.utils.createToast)){const d=document.createElement("button");d.textContent="Resume",d.className="ypp-toast-action-btn",d.style.cssText="margin-left: 15px; background: var(--ypp-accent); border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-weight: bold; color: white;",this.addListener(d,"click",()=>{window.location.href=l}),this.utils.createToast(`Resume unfinished video? "${o.substring(0,30)}..."`,"info",1e4),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const p=document.querySelector(".ypp-toast:last-child");p&&p.appendChild(d)})})}}}}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ZenMode=class extends window.YPP.features.BaseFeature{getConfigKey(){return"zenMode"}constructor(){super("zenMode"),this.CONSTANTS=window.YPP.CONSTANTS||{},this.Utils=window.YPP.Utils||{},this.isEnabled=!1,this.zenToastShown=!1,this.ambientActive=!1,this.animationFrame=null,this.audioContext=null,this.delayNode=null,this.gainNode=null,this.canvas=null,this.ctx=null,this.videoElement=null,this.playerElement=null,this.FPS=30,this.FRAME_INTERVAL=1e3/this.FPS,this.CANVAS_SIZE=16,this._loop=this._loop.bind(this),this._handleNavigation=this._handleNavigation.bind(this)}enable(){this.toggleZen(!0)}disable(){this.toggleZen(!1),super.disable()}onPageChange(){this._clearCache(),location.pathname==="/watch"&&this.isEnabled?this.ambientActive&&this._applyAmbientMode():(this._disableAudioSpatialization(),this._removeAmbientMode())}_clearCache(){this.videoElement=null,this.playerElement=null}toggleZen(e){var r,i;const t=location.pathname==="/watch";this.isEnabled=e,e&&t?(this._applyAmbientMode(),this.zenToastShown||((i=(r=this.Utils).createToast)==null||i.call(r,"Zen Mode Enabled (V2)"),this.zenToastShown=!0),this._enableAudioSpatialization()):(this.zenToastShown=!1,this._disableAudioSpatialization(),this._removeAmbientMode())}async autoCinema(){var e,t;try{const r=await((t=(e=this.Utils).waitForElement)==null?void 0:t.call(e,'.ytp-size-button, [aria-label="Cinema mode"]',5e3));if(!r)return;const i=()=>{document.querySelector("ytd-watch-flexy[theater]")||r.click()};i(),window.YPP.sharedObserver&&window.YPP.sharedObserver.register("zen-cinema-check","ytd-watch-flexy",()=>{i(),window.YPP.sharedObserver.unregister("zen-cinema-check")})}catch{}}async _applyAmbientMode(){this.ambientActive||(this.ambientActive=!0,this._initCanvas(),this.lastUpdate=0,window.YPP.sharedObserver?window.YPP.sharedObserver.register("zen-mode-player","ytd-player, #player-container-outer, .html5-video-player",e=>{const t=e[0],r=document.querySelector("video");t&&r&&this.ambientActive&&(this.playerElement=t,this.videoElement=r,this.animationFrame||(this.animationFrame=requestAnimationFrame(this._loop)))},!0):(this.playerElement=document.querySelector("ytd-player")||document.querySelector(".html5-video-player"),this.videoElement=document.querySelector("video"),this.playerElement&&this.videoElement&&(this.animationFrame=requestAnimationFrame(this._loop))))}_initCanvas(){this.canvas||(this.canvas=document.createElement("canvas"),this.canvas.width=this.CANVAS_SIZE,this.canvas.height=this.CANVAS_SIZE,this.canvas.id="ypp-zen-glow-canvas",this.canvas.style.cssText=`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                filter: blur(100px);
                opacity: 0.6;
                z-index: -1;
                pointer-events: none;
                transform: scale(1.1);
                transition: opacity 0.5s ease;
            `,this.ctx=this.canvas.getContext("2d",{alpha:!1})),this.playerElement&&!document.getElementById("ypp-zen-glow-canvas")&&(this.playerElement.style.position="relative",this.playerElement.style.zIndex="0",this.playerElement.insertBefore(this.canvas,this.playerElement.firstChild))}_loop(e){if(this.ambientActive){if(!document.hidden&&e-this.lastUpdate>this.FRAME_INTERVAL){this.lastUpdate=e,this._initCanvas(),(!this.videoElement||!this.videoElement.isConnected)&&(this.videoElement=document.querySelector("video"));const t=this.videoElement;if(t&&!t.paused&&!t.ended&&t.readyState>=2&&this.ctx)try{this.ctx.drawImage(t,0,0,this.CANVAS_SIZE,this.CANVAS_SIZE)}catch{}}this.animationFrame=requestAnimationFrame(this._loop)}}_removeAmbientMode(){this.ambientActive=!1,this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("zen-mode-player"),this.canvas&&(this.canvas.style.opacity="0",setTimeout(()=>{this.canvas&&this.canvas.parentNode&&this.canvas.remove(),this.canvas=null,this.ctx=null},500)),this.videoElement=null,this.playerElement=null}_enableAudioSpatialization(){var t;const e=document.querySelector("video");if(!(!e||window.YPP.zenAudioInitialized))try{window.YPP.zenAudioInitialized=!0,window.YPP.audioContext=window.YPP.audioContext||new(window.AudioContext||window.webkitAudioContext),window.YPP.audioSource||(window.YPP.audioSource=window.YPP.audioContext.createMediaElementSource(e)),this.audioContext=window.YPP.audioContext,this.delayNode=this.audioContext.createDelay(),this.delayNode.delayTime.value=.04,this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=.25,window.YPP.audioSource.connect(this.delayNode),this.delayNode.connect(this.gainNode),this.gainNode.connect(this.audioContext.destination),window.YPP.audioSource.connect(this.audioContext.destination),this.audioContext.state==="suspended"&&this.audioContext.resume()}catch{(t=this.Utils)==null||t.log("Failed to init Zen Audio Spatialization","ZEN","warn")}}_disableAudioSpatialization(){if(this.delayNode&&this.gainNode){try{this.delayNode.disconnect(),this.gainNode.disconnect(),window.YPP.audioSource.disconnect(this.delayNode)}catch{}this.delayNode=null,this.gainNode=null,window.YPP.zenAudioInitialized=!1}if(this.audioContext&&this.audioContext.state!=="closed")try{this.audioContext.suspend()}catch{}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.FocusMode=class extends window.YPP.features.BaseFeature{constructor(){super("FocusMode"),this._initConstants()}_initConstants(){this._CONSTANTS=window.YPP.CONSTANTS||{},this._CSS_CLASSES=this._CONSTANTS.CSS_CLASSES||{}}getConfigKey(){return"enableFocusMode"}async enable(){this.observer.register("focus-mode","#contents, ytd-watch-flexy",()=>{this.isEnabled&&this.settings&&this._applyFocusState()},!1),await super.enable(),this._run()}async disable(){this.observer.unregister("focus-mode"),this._toggleDetox(!1),this._toggleFocus(!1),await super.disable()}async onPageChange(e){this.isEnabled&&(this.utils.isWatchPage()?this._run():(this._toggleDetox(!1),this._toggleFocus(!1)))}async onUpdate(){this._run()}_run(){var e,t;if(this.settings)try{this._toggleDetox(this.settings.dopamineDetox),this._toggleFocus(this.settings.enableFocusMode),this._applyFocusState()}catch(r){(t=(e=this.utils).log)==null||t.call(e,`Error running focus mode: ${r.message}`,"FOCUS","error")}}_applyFocusState(){this.settings}_toggleDetox(e){var t,r;document.body.classList.toggle(this._CSS_CLASSES.DOPAMINE_DETOX,e),e?this._applyDetoxStyle():this._removeDetoxStyle(),(r=(t=this.utils).log)==null||r.call(t,`Dopamine detox ${e?"enabled":"disabled"}`,"FOCUS")}_applyDetoxStyle(){}_removeDetoxStyle(){}_toggleFocus(e){var t,r,i,n,s,o;e?((t=this.settings)!=null&&t.hideChat&&document.body.classList.add("ypp-hide-chat"),(r=this.settings)!=null&&r.hideLiveChat&&document.body.classList.add("ypp-hide-live-chat"),this._ejectDistractions(),(n=(i=this.utils).log)==null||n.call(i,"Focus mode enabled","FOCUS")):(document.body.classList.remove("ypp-hide-chat"),document.body.classList.remove("ypp-hide-live-chat"),this._restoreDistractions(),(o=(s=this.utils).log)==null||o.call(s,"Focus mode disabled","FOCUS"))}_ejectDistractions(){this.ejectedNodes||(this.ejectedNodes=new Map);const e={comments:document.querySelector("#comments"),related:document.querySelector("#secondary #related")};for(const[t,r]of Object.entries(e))if(r&&r.children.length>0){const i=document.createDocumentFragment();for(;r.firstChild;)i.appendChild(r.firstChild);this.ejectedNodes.set(t,{container:r,fragment:i})}}_restoreDistractions(){if(this.ejectedNodes){for(const[e,t]of this.ejectedNodes.entries())t.container&&t.fragment&&t.container.appendChild(t.fragment);this.ejectedNodes.clear()}}toggleFeature(e,t){var r,i;if(this.settings)switch(this.settings[e]=t,e){case"dopamineDetox":this._toggleDetox(t);break;case"enableFocusMode":if(!t&&this._isStrictModeActive()){(i=(r=this.utils).createToast)==null||i.call(r,"Strict Mode Active! Solve math to disable.",5e3),this._promptStrictMathUnlock();return}this._toggleFocus(t);break}}_isStrictModeActive(){return this.strictModeEndTime?Date.now()<this.strictModeEndTime:!1}activateStrictMode(e=30){var t,r;this.strictModeEndTime=Date.now()+e*60*1e3,(r=(t=this.utils).createToast)==null||r.call(t,`Strict Mode Locked for ${e}m`),this.toggleFeature("enableFocusMode",!0),this.toggleFeature("dopamineDetox",!0)}_promptStrictMathUnlock(){const e=Math.floor(Math.random()*50)+15,t=Math.floor(Math.random()*50)+15,r=e*t;this._createMathModal(e,t,r)}_createMathModal(e,t,r){if(document.getElementById("ypp-strict-modal"))return;const i=document.createElement("div");i.id="ypp-strict-modal",i.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(15px);
            z-index: 999999; display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s ease;
        `;const n=document.createElement("div");n.style.cssText=`
            background: rgba(25, 25, 30, 0.7); backdrop-filter: blur(20px) saturate(150%);
            -webkit-backdrop-filter: blur(20px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px; padding: 40px; width: 380px; text-align: center;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            font-family: 'Inter', Roboto, sans-serif;
            color: #fff; transform: scale(0.9) translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `,n.innerHTML=`
            <div style="font-size: 40px; margin-bottom: 16px;">🔒</div>
            <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Strict Mode Active</div>
            <div style="font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 32px;">Solve the equation to unlock Focus Mode:</div>
            <div style="font-size: 36px; font-weight: 800; margin-bottom: 32px; color: #ff4e45; text-shadow: 0 4px 12px rgba(255, 78, 69, 0.3);">${e} × ${t}</div>
            <input type="number" id="ypp-strict-input" placeholder="Your Answer" style="
                width: 100%; padding: 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15);
                background: rgba(0, 0, 0, 0.3); color: #fff; font-size: 20px; text-align: center;
                box-sizing: border-box; outline: none; margin-bottom: 20px; transition: border-color 0.2s, box-shadow 0.2s;
            " autocomplete="off" onfocus="this.style.borderColor='#ff4e45'; this.style.boxShadow='0 0 0 3px rgba(255, 78, 69, 0.2)';" onblur="this.style.borderColor='rgba(255, 255, 255, 0.15)'; this.style.boxShadow='none';" />
            <div style="display: flex; gap: 16px;">
                <button id="ypp-strict-cancel" style="
                    flex: 1; padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
                    color: #fff; cursor: pointer; font-size: 15px; font-weight: 600; transition: background 0.2s;
                " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">Cancel</button>
                <button id="ypp-strict-submit" style="
                    flex: 1; padding: 14px; border-radius: 12px; border: none; background: #ff4e45;
                    color: #fff; cursor: pointer; font-size: 15px; font-weight: 600; transition: background 0.2s; box-shadow: 0 4px 12px rgba(255, 78, 69, 0.3);
                " onmouseover="this.style.background='#ff665e'" onmouseout="this.style.background='#ff4e45'">Unlock</button>
            </div>
            <div id="ypp-strict-error" style="color: #ff4e45; font-size: 13px; margin-top: 16px; min-height: 20px; font-weight: 500;"></div>
        `,i.appendChild(n),document.body.appendChild(i),requestAnimationFrame(()=>{i.style.opacity="1",n.style.transform="scale(1) translateY(0)"});const s=document.getElementById("ypp-strict-input"),o=document.getElementById("ypp-strict-submit"),a=document.getElementById("ypp-strict-cancel"),l=document.getElementById("ypp-strict-error");s.focus();const d=()=>{var p,u;if(parseInt(s.value.trim())===r){this.strictModeEndTime=null,this.toggleFeature("enableFocusMode",!1),this.toggleFeature("dopamineDetox",!1),(u=(p=this.utils).createToast)==null||u.call(p,"Strict Mode Unlocked!"),i.remove();const h=document.querySelector("#enableFocusMode");h&&(h.checked=!1)}else l.textContent="Incorrect. Try again.",s.value="",s.focus(),window.anime?window.anime({targets:n,translateX:[{value:-10,duration:50},{value:10,duration:50},{value:-10,duration:50},{value:10,duration:50},{value:0,duration:50}],easing:"easeInOutSine"}):(n.style.transition="transform 0.1s ease",n.style.transform="scale(1) translateX(-15px)",setTimeout(()=>n.style.transform="scale(1) translateX(15px)",50),setTimeout(()=>n.style.transform="scale(1) translateX(-15px)",100),setTimeout(()=>n.style.transform="scale(1) translateX(15px)",150),setTimeout(()=>n.style.transform="scale(1) translateX(0)",200),setTimeout(()=>n.style.transition="transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",300))};o.onclick=d,a.onclick=()=>i.remove(),s.onkeydown=p=>{p.key==="Enter"&&d(),p.key==="Escape"&&i.remove()}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.StudyMode=class extends window.YPP.features.BaseFeature{getConfigKey(){return"studyMode"}constructor(){var e,t;super("StudyMode"),this.speedPanel=null,this.controlBtn=null,this.config={speed:((e=this.settings)==null?void 0:e.studySpeed)||1,forceSubtitles:((t=this.settings)==null?void 0:t.studyCaptions)||!1},this.sessionStart=null,this.sessionTimer=null,this.elapsedSeconds=0,this.timerDisplay=null,this._visibilityHandler=this._onVisibilityChange.bind(this),this.captionObserver=null,this.originalSpeed=null,this.SPEED_PRESETS=[.5,.75,1,1.25,1.5,1.75,2],this.loadConfig()}enable(){var e,t;try{(e=this.utils)==null||e.createToast(`Study Mode: ${this.config.speed}x Speed ${this.config.enableCaptions?"+ Captions":""}`),this._boundEnforceState=()=>this._enforceState(),window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.register("study-mode-video","video",r=>{const i=r[0];i&&(i.removeEventListener("ratechange",this._boundEnforceState),this.addListener(i,"ratechange",this._boundEnforceState),this._enforceState())},!0),this.injectSpeedControl(),this._startSessionTimer(),this.addListener(document,"visibilitychange",this._visibilityHandler),this._injectNotePanel(),this._initSmartCaptions()}catch(r){(t=this.utils)==null||t.log(`Error enabling study mode: ${r.message}`,"STUDY","error")}}async disable(){var e,t;await super.disable();try{window.YPP&&window.YPP.sharedObserver&&(window.YPP.sharedObserver.unregister("study-mode-video"),window.YPP.sharedObserver.unregister("study-mode-controls"));const r=document.querySelector("video");r&&this._boundEnforceState&&r.removeEventListener("ratechange",this._boundEnforceState),this.removeUI(),(r==null?void 0:r.playbackRate)===this.config.speed&&(r.playbackRate=1,(e=this.utils)==null||e.createToast("Study Mode Disabled")),this._stopSessionTimer(),this._removeNotePanel(),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("study-mode-captions")}catch(r){(t=this.utils)==null||t.log(`Error disabling study mode: ${r.message}`,"STUDY","error")}}async injectSpeedControl(){window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.register("study-mode-controls",".ytp-right-controls",e=>{const t=e[0];this._createButtonInControls(t)},!0)}async onVideoChange(e){if(this.isEnabled)try{const t=await this.waitForElement(".ytp-right-controls",5e3);t&&this._createButtonInControls(t);const r=await this.waitForElement("video",5e3);r&&this._boundEnforceState&&(r.removeEventListener("ratechange",this._boundEnforceState),this.addListener(r,"ratechange",this._boundEnforceState),this._enforceState()),await this._injectNotePanel(),this.notesPanel&&this._loadNotes()}catch{}}_createButtonInControls(e){if(!e||document.getElementById("ypp-study-btn"))return;const t=document.createElement("button");t.id="ypp-study-btn",t.className="ytp-button",t.title="Study Mode Speed",t.innerHTML=`<span style="font-size: 13px; font-weight: 500; color: #3ea6ff;">${this.config.speed}x</span>`,t.onclick=r=>{r.stopPropagation(),this.toggleSpeedPanel()},e.insertBefore(t,e.firstChild),this.controlBtn=t}toggleSpeedPanel(){this.speedPanel?this.removeSpeedPanel():this.createSpeedPanel()}createSpeedPanel(){const e=document.createElement("div");e.id="ypp-study-panel",e.style.cssText=`
            position: absolute;
            bottom: 50px;
            right: 20px;
            background: rgba(25, 25, 30, 0.7);
            backdrop-filter: blur(20px) saturate(150%);
            -webkit-backdrop-filter: blur(20px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            padding: 16px;
            border-radius: 16px;
            z-index: 6000;
            width: 280px;
            color: #fff;
            font-family: 'Inter', Roboto, sans-serif;
        `;const t=document.createElement("div");t.style.cssText="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;";const r=document.createElement("div");r.textContent="📚 Study Mode",r.style.cssText="font-size: 15px; font-weight: 500;",this.timerDisplay=document.createElement("div"),this.timerDisplay.textContent=this._formatTime(this.elapsedSeconds),this.timerDisplay.style.cssText="font-size: 13px; font-weight: 500; color: #4ade80; background: rgba(74, 222, 128, 0.15); padding: 4px 8px; border-radius: 6px; font-variant-numeric: tabular-nums;",t.appendChild(r),t.appendChild(this.timerDisplay),e.appendChild(t);const i=document.createElement("div");i.style.cssText="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px;",this.SPEED_PRESETS.forEach(y=>{const v=document.createElement("button");v.textContent=`${y}x`,v.style.cssText=`
                background: ${this.config.speed===y?"rgba(62, 166, 255, 0.3)":"rgba(255,255,255,0.1)"};
                border: 1px solid ${this.config.speed===y?"#3ea6ff":"rgba(255,255,255,0.2)"};
                color: #fff;
                padding: 6px 4px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            `,v.onclick=()=>this.setSpeed(y),i.appendChild(v)}),e.appendChild(i);const n=document.createElement("div");n.textContent="🎚️ Custom Speed",n.style.cssText="font-size: 12px; color: #ddd; margin-bottom: 8px;",e.appendChild(n);const s=document.createElement("div");s.style.cssText="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;";const o=document.createElement("input");o.type="range",o.min="0.25",o.max="3.0",o.step="0.05",o.value=this.config.speed,o.style.cssText="flex: 1; cursor: pointer;";const a=document.createElement("span");a.textContent=`${this.config.speed}x`,a.style.cssText="font-size: 12px; color: #3ea6ff; font-weight: 500; min-width: 40px;",o.oninput=y=>{const v=parseFloat(y.target.value);a.textContent=`${v}x`,this.setSpeed(v)},s.appendChild(o),s.appendChild(a),e.appendChild(s);const l=document.createElement("div");l.style.cssText="height: 1px; background: rgba(255,255,255,0.1); margin: 12px 0;",e.appendChild(l);const d=document.createElement("div");d.style.cssText="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;";const p=document.createElement("span");p.textContent="📝 Auto Captions",p.style.cssText="font-size: 12px;";const u=document.createElement("input");u.type="checkbox",u.checked=this.config.enableCaptions,u.style.cursor="pointer",u.onchange=y=>{this.config.enableCaptions=y.target.checked,this.saveConfig(),this.config.enableCaptions&&this._enableCaptions()},d.appendChild(p),d.appendChild(u),e.appendChild(d);const h=document.createElement("button");h.innerHTML="×",h.style.cssText=`
            position: absolute;
            top: 8px;
            right: 8px;
            background: transparent;
            border: none;
            color: #aaa;
            font-size: 24px;
            cursor: pointer;
            width: 20px;
            height: 20px;
            line-height: 16px;
            padding: 0;
        `,h.onclick=()=>this.removeSpeedPanel(),e.appendChild(h),(document.getElementById("movie_player")||document.body).appendChild(e),this.speedPanel=e}removeSpeedPanel(){this.speedPanel&&(this.speedPanel.remove(),this.speedPanel=null)}removeUI(){this.controlBtn&&(this.controlBtn.remove(),this.controlBtn=null),this.removeSpeedPanel()}setSpeed(e){this.config.speed=e,this.saveConfig();const t=document.querySelector("video");t&&(t.playbackRate=e),this.controlBtn&&(this.controlBtn.innerHTML=`<span style="font-size: 13px; font-weight: 500; color: #3ea6ff;">${e}x</span>`),this.speedPanel&&(this.removeSpeedPanel(),this.createSpeedPanel())}_enforceState(){try{const e=document.querySelector("video");e&&(e.playbackRate!==this.config.speed&&(e.playbackRate=this.config.speed),this.config.enableCaptions&&this._enableCaptions())}catch{}}_enableCaptions(){try{const e=document.querySelector(".ytp-subtitles-button");(e==null?void 0:e.getAttribute("aria-pressed"))==="false"&&e.click()}catch{}}async loadConfig(){var e;try{const t=await window.YPP.StorageManager.get("ypp_study_mode");t&&(this.config={...this.config,...t})}catch(t){(e=this.utils)==null||e.log("Failed to load config: "+t.message,"STUDY","error")}}async saveConfig(){var e;try{await window.YPP.StorageManager.set("ypp_study_mode",this.config)}catch(t){(e=this.utils)==null||e.log("Failed to save config: "+t.message,"STUDY","error")}}_startSessionTimer(){this.sessionStart||(this.sessionStart=Date.now()-this.elapsedSeconds*1e3),this.sessionTimer&&clearInterval(this.sessionTimer),this.sessionTimer=setInterval(()=>{if(document.hidden)return;const e=document.querySelector("video");e&&!e.paused&&(this.elapsedSeconds++,this.timerDisplay&&(this.timerDisplay.textContent=this._formatTime(this.elapsedSeconds)),this.elapsedSeconds>0&&this.elapsedSeconds%1500===0&&(e.pause(),this._showBreakNotification()))},1e3)}_showBreakNotification(){if(document.getElementById("ypp-study-break-overlay"))return;const e=document.createElement("div");e.id="ypp-study-break-overlay",e.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px);
            z-index: 999999; display: flex; align-items: center; justify-content: center;
        `;const t=document.createElement("div");t.style.cssText=`
            background: rgba(30, 30, 30, 0.9); border: 1px solid rgba(74, 222, 128, 0.3);
            border-radius: 16px; padding: 32px; width: 340px; text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); font-family: 'Inter', sans-serif;
            color: #fff;
        `;const r=Math.floor(this.elapsedSeconds/1500);t.innerHTML=`
            <div style="font-size: 32px; margin-bottom: 12px;">🍅</div>
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #4ade80;">Pomodoro Completed!</div>
            <div style="font-size: 14px; color: #aaa; margin-bottom: 24px;">You've studied for ${r*25} minutes. Take a 5 minute break.</div>
            <button id="ypp-break-dismiss" style="
                width: 100%; padding: 12px; border-radius: 8px; border: none; background: rgba(74, 222, 128, 0.2);
                color: #4ade80; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s;
            " onmouseover="this.style.background='rgba(74, 222, 128, 0.3)'" onmouseout="this.style.background='rgba(74, 222, 128, 0.2)'">Resume Study Session</button>
        `,e.appendChild(t),document.body.appendChild(e),document.getElementById("ypp-break-dismiss").onclick=()=>{e.remove()}}_stopSessionTimer(){this.sessionTimer&&(clearInterval(this.sessionTimer),this.sessionTimer=null)}_formatTime(e){const t=Math.floor(e/3600),r=Math.floor(e%3600/60),i=e%60;return t>0?`${t}:${r.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}`:`${r.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}`}_onVisibilityChange(){var t,r;const e=document.querySelector("video");e&&(document.hidden?e.paused||(this._wasPlayingBeforeHide=!0,e.pause(),(t=this.utils)==null||t.log("Study Mode: Auto-paused video","STUDY")):this._wasPlayingBeforeHide&&(e.play(),this._wasPlayingBeforeHide=!1,(r=this.utils)==null||r.log("Study Mode: Auto-resumed video","STUDY")))}_initSmartCaptions(){this.lastSpeedChangeTime=0,window.YPP.sharedObserver&&window.YPP.sharedObserver.register("study-mode-captions",".ytp-caption-segment",()=>{if(!this.config.forceSubtitles)return;const e=document.querySelector(".ytp-caption-window-container");if(!e)return;const t=e.textContent.trim(),r=document.querySelector("video");if(!r)return;const i=Date.now();if(!(i-this.lastSpeedChangeTime<2e3))if(t.length>80){if(this.originalSpeed===null){this.originalSpeed=r.playbackRate;const n=Math.max(.25,this.originalSpeed-.15);r.playbackRate=n,this.lastSpeedChangeTime=i,window.dispatchEvent(new CustomEvent("ypp-vsc-force-speed",{detail:{enabled:!0,speed:n}}))}}else this.originalSpeed!==null&&(r.playbackRate=this.originalSpeed,this.lastSpeedChangeTime=i,window.dispatchEvent(new CustomEvent("ypp-vsc-force-speed",{detail:{enabled:!0,speed:this.originalSpeed}})),this.originalSpeed=null)},!1)}async _injectNotePanel(){const e=document.getElementById("ypp-study-notes");e&&e.remove(),this.notesPanel=document.createElement("div"),this.notesPanel.id="ypp-study-notes",this.notesPanel.style.cssText=`
            position: sticky;
            top: 80px;
            height: calc(100vh - 120px);
            min-height: 500px;
            background: rgba(25, 25, 30, 0.7);
            backdrop-filter: blur(20px) saturate(150%);
            -webkit-backdrop-filter: blur(20px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            z-index: 5000;
            display: flex;
            flex-direction: column;
            color: #fff;
            font-family: 'Inter', Roboto, sans-serif;
            transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s ease;
        `;const t=document.createElement("div");t.style.cssText="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); border-radius: 16px 16px 0 0;";const r=document.createElement("div");r.innerHTML="📝 <b>Study Notes</b>",r.style.fontSize="15px";const i=document.createElement("button");i.textContent="Export",i.style.cssText="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.2s;",i.onmouseover=()=>i.style.background="rgba(255,255,255,0.2)",i.onmouseout=()=>i.style.background="rgba(255,255,255,0.1)",i.onclick=()=>this._exportNotes(),t.appendChild(r),t.appendChild(i),this.notesPanel.appendChild(t),this.notesList=document.createElement("div"),this.notesList.style.cssText="flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; scroll-behavior: smooth;",this.notesPanel.appendChild(this.notesList);const n=document.createElement("div");n.style.cssText="padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.1); display: flex; gap: 8px;";const s=document.createElement("input");s.placeholder="Wikipedia Lookup...",s.style.cssText="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; padding: 8px 12px; font-size: 13px; outline: none; transition: border-color 0.2s;",s.onfocus=()=>s.style.borderColor="rgba(62,166,255,0.5)",s.onblur=()=>s.style.borderColor="rgba(255,255,255,0.1)";const o=document.createElement("div");o.style.cssText="display: none; padding: 12px 16px; font-size: 13px; color: #ccc; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); max-height: 150px; overflow-y: auto; line-height: 1.5;",s.onkeydown=async d=>{if(d.key==="Enter"){const p=s.value.trim();if(!p)return;o.style.display="block",o.innerHTML='<span style="color: #3ea6ff;">Searching...</span>';try{const h=await(await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p)}`)).json();h.extract?o.innerHTML=`<b>${h.title}</b><br/>${h.extract}`:o.innerHTML="<i>No exact match found.</i>"}catch{o.innerHTML="<i>Error fetching lookup.</i>"}}},n.appendChild(s),this.notesPanel.appendChild(n),this.notesPanel.appendChild(o);const a=document.createElement("div");a.style.cssText="padding: 16px; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); border-radius: 0 0 16px 16px;";const l=document.createElement("textarea");l.placeholder="Type a note and press Enter...",l.style.cssText="width: 100%; height: 60px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; padding: 10px; resize: none; font-family: inherit; font-size: 13px; outline: none; box-sizing: border-box; transition: border-color 0.2s;",l.onfocus=()=>l.style.borderColor="rgba(62,166,255,0.5)",l.onblur=()=>l.style.borderColor="rgba(255,255,255,0.1)",this.addListener(l,"keydown",d=>{if(d.key==="Enter"&&!d.shiftKey){d.preventDefault();const p=l.value.trim();p&&(this._addNote(p),l.value="")}}),a.appendChild(l),this.notesPanel.appendChild(a);try{const d=await this.waitForElement("#secondary",5e3);if(d&&d.parentNode)d.parentNode.insertBefore(this.notesPanel,d.nextSibling);else throw new Error("Sidebar container not found")}catch{this.notesPanel.style.position="fixed",this.notesPanel.style.top="80px",this.notesPanel.style.right="24px",this.notesPanel.style.width="340px",this.notesPanel.style.zIndex="5000",document.body.appendChild(this.notesPanel)}this._loadNotes()}_removeNotePanel(){this.notesPanel&&(this.notesPanel.remove(),this.notesPanel=null)}async _loadNotes(){var t;if(!this.notesList)return;const e=new URLSearchParams(window.location.search).get("v");if(e){this.notesList.innerHTML="";try{(await window.YPP.StorageManager.get(`notes_${e}`)||[]).forEach(n=>this._renderNote(n))}catch{(t=this.utils)==null||t.log("Failed to load notes","STUDY","error")}}}async _addNote(e){var s;const t=new URLSearchParams(window.location.search).get("v");if(!t)return;const r=document.querySelector("video"),i=r?Math.floor(r.currentTime):0,n={id:Date.now().toString(),text:e,timestamp:i,formattedTime:this._formatTime(i)};this._renderNote(n);try{const a=await window.YPP.StorageManager.get(`notes_${t}`)||[];a.push(n),await window.YPP.StorageManager.set(`notes_${t}`,a)}catch{(s=this.utils)==null||s.log("Failed to save note","STUDY","error")}}_renderNote(e){if(!this.notesList)return;const t=document.createElement("div");t.style.cssText="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; border-left: 3px solid #3ea6ff; font-size: 13px; word-break: break-word;";const r=document.createElement("div");r.style.cssText="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;";const i=document.createElement("button");i.textContent=`⏱️ ${e.formattedTime}`,i.style.cssText="background: none; border: none; color: #3ea6ff; cursor: pointer; padding: 0; font-size: 11px; font-weight: 600; font-family: inherit;",i.onclick=()=>{const o=document.querySelector("video");o&&(o.currentTime=e.timestamp)};const n=document.createElement("button");n.innerHTML="&times;",n.style.cssText="background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 14px; padding: 0; line-height: 1;",n.onclick=async()=>{t.remove();const o=new URLSearchParams(window.location.search).get("v");if(!o)return;const a=await window.YPP.StorageManager.get(`notes_${o}`);if(a){const l=a.filter(d=>d.id!==e.id);await window.YPP.StorageManager.set(`notes_${o}`,l)}},r.appendChild(i),r.appendChild(n);const s=document.createElement("div");s.textContent=e.text,s.style.cssText="color: #eee; line-height: 1.4;",t.appendChild(r),t.appendChild(s),this.notesList.appendChild(t),this.notesList.scrollTop=this.notesList.scrollHeight}async _exportNotes(){var a,l,d;const e=new URLSearchParams(window.location.search).get("v");if(!e)return;const t=await window.YPP.StorageManager.get(`notes_${e}`);if(!t||t.length===0)return(a=this.utils)==null?void 0:a.createToast("No notes to export");const r=((d=(l=document.querySelector("h1.ytd-video-primary-info-renderer"))==null?void 0:l.textContent)==null?void 0:d.trim())||"YouTube_Notes";let i=`# Study Notes: ${r}

`;t.forEach(p=>{i+=`[${p.formattedTime}] ${p.text}
`});const n=new Blob([i],{type:"text/markdown"}),s=URL.createObjectURL(n),o=document.createElement("a");o.href=s,o.download=`${r.replace(/[^a-z0-9]/gi,"_").toLowerCase()}.md`,o.click(),URL.revokeObjectURL(s)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.CommentFilter=(Me=class extends window.YPP.features.BaseFeature{constructor(){super("CommentFilter"),this.processedComments=new Set,this._activePatterns=[],this.handleComments=this.handleComments.bind(this)}getConfigKey(){return"commentFilter"}_buildPatterns(){var t;const e=(((t=this.settings)==null?void 0:t.commentFilterCustomKeywords)||"").split(",").map(r=>r.trim()).filter(Boolean).map(r=>new RegExp(r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i"));this._activePatterns=[...Me.BASE_PATTERNS,...e]}async enable(){var e;if(this.utils.isWatchPage()){await super.enable(),this._buildPatterns();try{this.observer.register("spam_comments","ytd-comment-thread-renderer:not([data-ypp-processed])",this.handleComments,!0);const t=await this.waitForElement("#comments",1e4);t&&this.isEnabled&&this.observer.start(t)}catch(t){(e=this.utils)==null||e.log("Error enabling CommentFilter","COMMENT","error",t)}}}async disable(){var t;await super.disable(),this.observer&&this.observer.unregister("spam_comments"),(((t=this.settings)==null?void 0:t.commentFilterAction)||"dim")==="dim"?document.querySelectorAll(".ypp-spam-comment").forEach(r=>{r.classList.remove("ypp-spam-comment"),r.style.opacity="",r.style.transition="",r.style.display=""}):document.querySelectorAll(".ypp-spam-comment").forEach(r=>{r.classList.remove("ypp-spam-comment"),r.style.display=""}),document.querySelectorAll(".ypp-spam-label").forEach(r=>r.remove()),document.querySelectorAll("ytd-comment-thread-renderer[data-ypp-processed]").forEach(r=>{r.removeAttribute("data-ypp-processed")}),this.processedComments.clear()}async onUpdate(){if(this._buildPatterns(),this.utils.isWatchPage()){const e=document.querySelector("#comments");e&&this.observer.start(e)}}handleComments(e){var r;if(!this.isEnabled)return;const t=((r=this.settings)==null?void 0:r.commentFilterAction)||"dim";e.forEach(i=>{var a,l;if(i.hasAttribute("data-ypp-processed"))return;i.setAttribute("data-ypp-processed","true"),this.processedComments.add(i);const n=i.querySelector("#content-text");if(!n)return;const s=n.textContent;if(this._activePatterns.some(d=>d.test(s))){i.classList.add("ypp-spam-comment"),t==="hide"?i.style.display="none":(i.style.opacity="0.35",i.style.transition="opacity 0.2s",this.addListener(i,"mouseenter",()=>i.style.opacity="1"),this.addListener(i,"mouseleave",()=>i.style.opacity="0.35"));const d=i.querySelector("#header-author, #author-thumbnail");if(d&&!i.querySelector(".ypp-spam-label")){const p=document.createElement("span");p.className="ypp-spam-label",p.textContent="[Likely Spam]",p.style.cssText="color:#ff5555;font-size:12px;margin-left:8px;font-weight:bold;",d.appendChild(p)}(l=(a=this.utils).log)==null||l.call(a,"Spam comment filtered","COMMENT")}})}},G(Me,"BASE_PATTERNS",[/whatsapp\s*\+?\d{9,}/i,/telegram[\s:]*@/i,/invest.*crypto/i,/financial\s+advisor/i,/my\s+mentor/i,/win.*prize/i,/trade.*bitcoin/i,/expert.*trader/i,/DM\s+me.*help/i,/click\s+my\s+profile/i]),Me),window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.WatchRedesign=class extends(window.YPP.features.BaseFeature||Object){constructor(){super("WatchRedesign"),this.configKey=null,this.isWatchPage=!1,this.glassPlayerEnabled=!1,this.glassPlayerEnabled=!1,this.sidebarCommentsEnabled=!1,this._mountInterval=null}getConfigKey(){return null}enable(){var e,t;if(this.settings)try{this._injectCSS(),this._checkRoute(),this.glassPlayerEnabled=!!this.settings.glassPlayerUI,this.sidebarCommentsEnabled=!!this.settings.sidebarComments,this._applyFeatures()}catch(r){(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,"Error enabling WatchRedesign: "+r.message,"WATCH_REDESIGN","error")}}onUpdate(){this.enable()}disable(){this.glassPlayerEnabled=!1,this.sidebarCommentsEnabled=!1,this._mountInterval&&(clearInterval(this._mountInterval),this._mountInterval=null),window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("watch-redesign-comments"),this._applyFeatures(),this._cleanup(),this.cleanupEvents()}_injectCSS(){if(document.getElementById("ypp-watch-redesign-style"))return;const e=document.createElement("style");e.id="ypp-watch-redesign-style",e.textContent=`
            /* ========================================================
               PHASE 1: GLASS PLAYER UI
               ======================================================== */
            html.ypp-glass-player-active ytd-watch-flexy .html5-video-player {
                border-radius: 16px !important;
                overflow: hidden !important;
                box-shadow: 0 12px 48px rgba(0,0,0,0.5) !important;
            }

            /* Glassmorphic Bottom Control Bar */
            html.ypp-glass-player-active .ytp-chrome-bottom {
                background: rgba(10, 10, 12, 0.6) !important;
                backdrop-filter: blur(12px) !important;
                -webkit-backdrop-filter: blur(12px) !important;
                border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 0 0 16px 16px !important;
                text-shadow: none !important;
                width: 100% !important;
                left: 0 !important;
                padding-left: 12px !important;
                padding-right: 12px !important;
                box-sizing: border-box !important;
            }

            /* Player Controls Hover Glow */
            html.ypp-glass-player-active .ytp-chrome-controls .ytp-button:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 8px !important;
                transform: scale(1.05) !important;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            html.ypp-glass-player-active .ytp-chrome-controls .ytp-button {
                transition: all 0.2s ease !important;
            }

            /* Progress Bar Re-styling */
            html.ypp-glass-player-active .ytp-swatch-background-color {
                background-color: var(--ypp-accent-color, #ff4e45) !important;
            }
            
            html.ypp-glass-player-active .ytp-play-progress {
                background: linear-gradient(90deg, var(--ypp-accent-color, #ff4e45), #ff8a84) !important;
            }

            /* Glassmorphic Menus (Settings, Tooltips) */
            html.ypp-glass-player-active .ytp-popup {
                background: rgba(20, 20, 24, 0.75) !important;
                backdrop-filter: blur(24px) !important;
                -webkit-backdrop-filter: blur(24px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 12px !important;
                box-shadow: 0 16px 40px rgba(0,0,0,0.5) !important;
            }
            html.ypp-glass-player-active .ytp-panel-menu {
                background: transparent !important;
            }

            /* Action Buttons under player (Like, Share, etc.) */
            html.ypp-glass-player-active ytd-watch-metadata #actions ytd-button-renderer button,
            html.ypp-glass-player-active ytd-watch-metadata #actions ytd-toggle-button-renderer button,
            html.ypp-glass-player-active ytd-watch-metadata #actions yt-button-shape button {
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(8px) !important;
                border-radius: 24px !important;
                transition: all 0.2s ease !important;
            }
            
            html.ypp-glass-player-active ytd-watch-metadata #actions yt-button-shape button:hover {
                background: rgba(255, 255, 255, 0.15) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            }

            /* ========================================================
               PHASE 2: SIDEBAR COMMENTS
               ======================================================== */
               
            /* ========================================================
               PHASE 3: LIVE CHAT GLASSMORPHISM
               ======================================================== */
            html.ypp-glass-player-active ytd-live-chat-frame {
                border-radius: 16px !important;
                overflow: hidden !important;
                box-shadow: 0 12px 48px rgba(0,0,0,0.5) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
            }
            
            /* Apply glass to iframe interior by targeting wrapper, but we only have CSS on host.
               YouTube's live chat is an iframe. We can style the container. */
            html.ypp-glass-player-active #chat {
                border-radius: 16px !important;
            }
            
            /* THEATER MODE OVERLAY FOR LIVE CHAT */
            html.ypp-glass-player-active ytd-watch-flexy[flexy][theater] #chat {
                position: absolute !important;
                top: 24px !important;
                right: 24px !important;
                bottom: 120px !important; /* space for controls */
                z-index: 1000 !important;
                background: rgba(10, 10, 12, 0.6) !important;
                backdrop-filter: blur(16px) !important;
                -webkit-backdrop-filter: blur(16px) !important;
                border-radius: 16px !important;
                min-height: 400px !important;
                max-height: calc(100vh - 150px) !important;
                box-shadow: 0 16px 64px rgba(0,0,0,0.6) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                opacity: 0.9 !important;
                transition: opacity 0.3s ease, transform 0.3s ease !important;
            }
            
            html.ypp-glass-player-active ytd-watch-flexy[flexy][theater] #chat:hover {
                opacity: 1 !important;
            }
            
            /* CSS-only Sidebar Comments via CSS Grid and display: contents */
            /* We use :not(:has(...)) so that if any distraction-free mode is active on the body, 
               this custom grid layout is instantly disabled without any JS delay/glitch. */
            
            /* Decrease gap between player/sidebar and topbar */
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy] {
                padding-top: 8px !important;
                margin-top: 0 !important;
            }
            
            /* Convert the main wrapper into a Grid layout */
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #columns {
                display: grid !important;
                grid-template-columns: minmax(0, 1fr) var(--ytd-watch-flexy-sidebar-width, 402px) !important;
                grid-template-rows: auto auto auto !important;
                column-gap: 24px !important;
                align-items: start !important;
            }

            /* Flatten the hierarchy so children can participate in the Grid */
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #primary,
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #primary-inner,
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #secondary,
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #secondary-inner {
                display: contents !important;
            }

            /* Place the elements into their grid cells */
            
            /* Left column: Video player and description */
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #player-container-outer,
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #player,
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #player-wide {
                grid-column: 1 !important;
                grid-row: 1 !important;
            }
            
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] ytd-watch-metadata {
                grid-column: 1 !important;
                grid-row: 2 !important;
            }
            
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #below {
                grid-column: 1 !important;
                grid-row: 3 !important;
            }

            /* Right column: Comments */
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #comments {
                grid-column: 2 !important;
                grid-row: 1 / span 3 !important;
                
                /* Glassmorphic styling for comments */
                background: var(--ypp-card-bg, rgba(20, 19, 24, 0.6)) !important;
                backdrop-filter: blur(12px) !important;
                -webkit-backdrop-filter: blur(12px) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 16px !important;
                padding: 16px !important;
                margin-top: 16px !important;
                margin-bottom: 24px !important;
                max-height: calc(100vh - 120px) !important;
                overflow-y: auto !important;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
            }

            /* Right column: Related Videos (moved below comments) */
            html.ypp-sidebar-comments-active:not(:has(body.ypp-zen-mode, body.ypp-cinema-mode, body.ypp-focus-mode, body.ypp-study-mode, body.ypp-minimal-mode)) ytd-watch-flexy[flexy][is-two-columns] #related {
                grid-column: 2 !important;
                grid-row: 4 !important;
                margin-top: 24px !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
            }
            
            /* Custom scrollbar for sidebar comments */
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns] #comments::-webkit-scrollbar {
                width: 6px;
            }
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns] #comments::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
                border-radius: 3px;
            }
            
            /* Chat integration (if active) */
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns] #chat {
                grid-column: 2 !important;
                grid-row: 1 / span 3 !important;
            }

            /* Theater mode override: revert grid layout so comments don't go off-screen.
               YouTube's theater mode takes the full width — sidebar comments don't fit. */
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns][theater] #columns {
                display: flex !important;
                flex-direction: column !important;
            }
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns][theater] #primary,
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns][theater] #primary-inner,
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns][theater] #secondary,
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns][theater] #secondary-inner {
                display: block !important;
            }
            html.ypp-sidebar-comments-active ytd-watch-flexy[flexy][is-two-columns][theater] #comments {
                grid-column: unset !important;
                grid-row: unset !important;
                max-height: unset !important;
                overflow-y: unset !important;
            }
        `,document.head.appendChild(e)}onPageChange(e){this._checkRoute()}_checkRoute(){this.isWatchPage=window.location.pathname==="/watch",this.isWatchPage?this._applyFeatures():this._cleanup()}_applyFeatures(){this.isWatchPage&&(this.glassPlayerEnabled?document.documentElement.classList.add("ypp-glass-player-active"):document.documentElement.classList.remove("ypp-glass-player-active"),this._startTrackingVideoRatio(),window.YPP.layoutManager?window.YPP.layoutManager.setState("sidebarComments",this.sidebarCommentsEnabled):this.sidebarCommentsEnabled?document.documentElement.classList.add("ypp-sidebar-comments-active"):document.documentElement.classList.remove("ypp-sidebar-comments-active"))}_cleanup(){document.documentElement.classList.remove("ypp-glass-player-active"),window.YPP.layoutManager?window.YPP.layoutManager.setState("sidebarComments",!1):document.documentElement.classList.remove("ypp-sidebar-comments-active"),this._stopTrackingVideoRatio()}_startTrackingVideoRatio(){}_stopTrackingVideoRatio(){}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.PlayerBarUI=class{constructor(e){this.manager=e,this.injectedButtons=!1,this.startInjectionPolling()}startInjectionPolling(){this._pollingInterval&&clearInterval(this._pollingInterval),this._pollingInterval=setInterval(()=>{if(!this.manager.isActive)return;const e=window.location.pathname.startsWith("/shorts"),t=e?document.querySelector("ytd-reel-video-renderer[is-active] video"):document.querySelector("video.html5-main-video"),r=e?document.querySelector("ytd-reel-video-renderer[is-active] .overlay.ytd-reel-video-renderer"):document.querySelector(".ytp-chrome-bottom");t&&r&&(r.querySelector(".ypp-player-controls")||(this.injectedButtons=!1,this.injectControls(t,r,e)))},1e3)}get settings(){return this.manager.settings}injectControls(e,t,r){var o,a;if(this.injectedButtons||!this.manager.isActive)return;if(r){const l=e.closest("ytd-reel-video-renderer");if(l){const d=l.querySelector(".ypp-player-controls");d&&d.remove()}}else{const l=document.querySelector(".ypp-player-controls");l&&l.remove()}this.applyNativeButtonStyles(),this.manager.settingsMenuHelper&&this.manager.settingsMenuHelper.setupSettingsObserver(e),this.applyNativeButtonVisibility();const i=document.createElement("div");i.className="ypp-player-controls"+(r?" ypp-shorts-controls":"");const n=l=>l==="front"||l===!0||typeof l>"u";!this.manager.controlsHelper&&((a=(o=window.YPP)==null?void 0:o.features)!=null&&a.PlayerControls)&&(this.manager.controlsHelper=new window.YPP.features.PlayerControls(this.manager)),this.manager.controlsHelper&&this.settings.enableCustomSpeed!==!1&&n(this.settings.pb_speed)&&i.appendChild(this.manager.controlsHelper.createSpeedControls(e));const s=(l,d,p)=>{if(this.settings[p]===!1||!n(this.settings[d]))return;const u=window.YPP.featureManager&&window.YPP.featureManager.getFeature(l);if(u&&u.createButton){const h=u.createButton(e);h&&i.appendChild(h)}};if(s("snapshotButton","pb_snapshot","enableSnapshot"),s("loopButton","pb_loop","enableLoop"),s("bookmarksManager","pb_bookmark","enableBookmarks"),s("volumeBoost","pb_volume","enableVolumeBoost"),s("videoFilters","pb_cinema","enableCinemaFilters"),this.manager.controlsHelper&&document.pictureInPictureEnabled&&this.settings.enablePiP!==!1&&(!this.settings.pb_pip||this.settings.pb_pip==="front")&&i.appendChild(this.manager.controlsHelper.createPiPButton(e)),r)t.appendChild(i);else{let l=t.querySelector(".ytp-right-controls")||t.querySelector(".ytp-right-controls-right");const d=t.querySelector(".ytp-fullscreen-button"),p=t.querySelector(".ytp-chrome-controls");l?l.insertBefore(i,l.firstChild):d&&d.parentNode?d.parentNode.insertBefore(i,d):p?p.appendChild(i):t.appendChild(i)}this.injectedButtons=!0}applyNativeButtonStyles(){let e=document.getElementById("ypp-custom-player-bar-styles");e||(e=document.createElement("style"),e.id="ypp-custom-player-bar-styles",document.head.appendChild(e));let t="";const r={pb_native_play:".ytp-play-button",pb_native_next:".ytp-next-button",pb_native_mute:".ytp-mute-button",pb_native_cast:".ytp-remote-button",pb_native_autoplay:".ytp-autonav-button, .ytp-autonav-toggle-button",pb_native_cc:".ytp-subtitles-button",pb_native_settings:".ytp-settings-button",pb_native_miniplayer:".ytp-miniplayer-button",pb_native_theater:".ytp-size-button",pb_native_fullscreen:".ytp-fullscreen-button"};for(const[i,n]of Object.entries(r))(this.settings[i]==="hidden"||this.settings[i]===!0)&&(t+=`${n} { display: none !important; }
`);e.textContent=t}applyNativeButtonVisibility(){let e=document.getElementById("ypp-custom-player-bar-style-vis");e||(e=document.createElement("style"),e.id="ypp-custom-player-bar-style-vis",document.head.appendChild(e));const t=[];this.settings.pb_native_play==="hidden"&&t.push(".ytp-play-button"),this.settings.pb_native_next==="hidden"&&t.push(".ytp-next-button"),this.settings.pb_native_mute==="hidden"&&t.push(".ytp-mute-button",".ytp-volume-area"),this.settings.pb_native_cast==="hidden"&&t.push('button[data-tooltip-target-id="ytp-remote-button"]',".ytp-remote-button"),this.settings.pb_native_autoplay==="hidden"&&t.push('button[data-tooltip-target-id="ytp-autonav-toggle-button"]','button.ytp-button[aria-label*="Autoplay"]',".ytp-autonav-toggle-button",".ytp-autonav-button"),this.settings.pb_native_cc==="hidden"&&t.push(".ytp-subtitles-button"),this.settings.pb_native_miniplayer==="hidden"&&t.push(".ytp-miniplayer-button"),this.settings.pb_native_theater==="hidden"&&t.push(".ytp-size-button"),this.settings.pb_native_fullscreen==="hidden"&&t.push(".ytp-fullscreen-button"),t.length>0?e.textContent=`${t.join(", ")} { display: none !important; }`:e.textContent=""}cleanup(){this._pollingInterval&&(clearInterval(this._pollingInterval),this._pollingInterval=null),document.querySelectorAll(".ypp-player-controls").forEach(r=>r.remove()),this.injectedButtons=!1,this.manager.settingsMenuHelper&&this.manager.settingsMenuHelper.cleanupSettingsObserver();const e=document.getElementById("ypp-custom-player-bar-styles");e&&e.remove();const t=document.getElementById("ypp-custom-player-bar-style-vis");t&&t.remove()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.PlayerControls=class{constructor(e){this.player=e,this.utils=window.YPP.Utils}createSpeedControls(e){const t=document.createElement("div");return t.className="ypp-speed-controls",["1","1.5","2","3"].forEach(r=>{const i=document.createElement("button");i.className="ypp-speed-btn",i.textContent=r+"x",i.dataset.speed=r,e.playbackRate===parseFloat(r)&&i.classList.add("active"),i.addEventListener("click",n=>{var a;n.preventDefault(),n.stopPropagation();const s=parseFloat(r),o=(a=window.YPP.featureManager)==null?void 0:a.getFeature("videoSpeedController");o?(o.controllers.has(e)||o.attachToVideo(e),o.setSpeed(e,s)):e.playbackRate=s,this.updateSpeedButtons(t,r)}),t.appendChild(i)}),t}createPiPButton(e){const r=this.createButton('<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>',"Picture-in-Picture",async()=>{var i,n;try{document.pictureInPictureElement?await document.exitPictureInPicture():await e.requestPictureInPicture()}catch(s){(n=(i=this.utils)==null?void 0:i.log)==null||n.call(i,"[YPP:PLAYER] PiP failed: "+s.message,"PLAYER","error")}});return e.addEventListener("enterpictureinpicture",()=>r.classList.add("active")),e.addEventListener("leavepictureinpicture",()=>r.classList.remove("active")),r}createButton(e,t,r){const i=document.createElement("button");return i.innerHTML=e,i.title=t,i.className="ypp-action-btn",i.addEventListener("click",n=>{n.stopPropagation(),r(n)}),i}createGenericToggleButton(e,t,r,i,n){const s=this.createButton(e,t,o=>{const a=!s.classList.contains("active");s.classList.toggle("active",a),window.YPP.Utils&&window.YPP.Utils.saveSettings&&window.YPP.Utils.saveSettings({[r]:a}),n&&n(a)});return i&&s.classList.add("active"),s}updateSpeedButtons(e,t){e.querySelectorAll(".ypp-speed-btn").forEach(r=>{r.classList.toggle("active",r.dataset.speed===t)})}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SnapshotButton=class extends window.YPP.features.BaseFeature{constructor(){super("SnapshotButton")}getConfigKey(){return"enableSnapshot"}createButton(e){const t='<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM9 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l.59-.65L9.88 4h4.24l1.24 1.35.59.65H20v12zM12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-8c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>',r=document.createElement("button");return r.innerHTML=t,r.title="Take Snapshot",r.className="ypp-action-btn",this.addListener(r,"click",i=>{i.stopPropagation(),this.takeSnapshot(e)}),r}takeSnapshot(e){if(!e)return;e.paused||e.pause();const t=1920,r=1080;let i=e.videoWidth,n=e.videoHeight;if(i>t||n>r){const b=Math.min(t/i,r/n);i=i*b,n=n*b}const s=document.createElement("canvas");s.width=i,s.height=n;const o=s.getContext("2d");try{o.drawImage(e,0,0,s.width,s.height),o.getImageData(0,0,1,1)}catch{this._showErrorToast("Cannot capture snapshot. Video is restricted by cross-origin (CORS) rules or DRM protection.");return}const a=document.createElement("div");a.className="ypp-snapshot-overlay ypp-glass-panel",a.style.cssText=`
            position: absolute; inset: 0; z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            padding: 24px; animation: yppFadeIn 0.2s ease-out;
        `;const l=document.createElement("div");l.style.cssText=`
            position: relative; max-width: 90%; max-height: 70%;
            border-radius: 12px; overflow: hidden; box-shadow: 0 12px 48px rgba(0,0,0,0.5);
            margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1);
        `,s.style.cssText="display: block; width: 100%; height: 100%; object-fit: contain;",l.appendChild(s);const d=document.createElement("div");d.style.cssText="display: flex; gap: 12px;";const p=`
            padding: 10px 16px; border: none; border-radius: 8px; cursor: pointer;
            font-family: 'Inter', Roboto, sans-serif; font-weight: 600; font-size: 13px;
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            color: #fff;
        `,u=document.createElement("button");u.textContent="Copy to Clipboard",u.style.cssText=p+"background: linear-gradient(135deg, #6366f1, #a855f7); box-shadow: 0 4px 12px rgba(99,102,241,0.3);",u.onmouseover=()=>u.style.transform="translateY(-2px)",u.onmouseout=()=>u.style.transform="translateY(0)",u.onclick=()=>{try{s.toBlob(b=>{if(b){const f=new window.ClipboardItem({"image/png":b});navigator.clipboard.write([f]).then(()=>{u.textContent="Copied!",setTimeout(()=>y(),1e3)}).catch(g=>this._showErrorToast("Failed to copy: "+g))}},"image/png")}catch{this._showErrorToast("Security error: Cannot copy restricted content.")}};const h=document.createElement("button");h.textContent="Download PNG",h.style.cssText=p+"background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);",h.onmouseover=()=>{h.style.transform="translateY(-2px)",h.style.background="rgba(255,255,255,0.15)"},h.onmouseout=()=>{h.style.transform="translateY(0)",h.style.background="rgba(255,255,255,0.1)"},h.onclick=()=>{try{let b=document.title.replace(/ - YouTube$/,"").trim();const f=new Date().toISOString().replace(/[:.]/g,"-").split("T"),g=`${f[0]}_${f[1].substring(0,6)}`,_=document.createElement("a");_.download=`YPP_Snapshot_${b}_${g}.png`,_.href=s.toDataURL("image/png"),_.click(),y()}catch{this._showErrorToast("Security error: Cannot download restricted content.")}};const m=document.createElement("button");m.textContent="Close",m.style.cssText=p+"background: transparent; color: rgba(255,255,255,0.6);",m.onmouseover=()=>m.style.color="#fff",m.onmouseout=()=>m.style.color="rgba(255,255,255,0.6)";const y=()=>{a.style.animation="yppFadeOut 0.2s ease-in forwards",setTimeout(()=>a.remove(),200)};m.onclick=y,d.appendChild(u),d.appendChild(h),d.appendChild(m),a.appendChild(l),a.appendChild(d);const v=e.closest(".html5-video-player");if(v){if(!document.getElementById("ypp-snapshot-styles")){const b=document.createElement("style");b.id="ypp-snapshot-styles",b.textContent=`
                    @keyframes yppFadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(12px); } }
                    @keyframes yppFadeOut { from { opacity: 1; backdrop-filter: blur(12px); } to { opacity: 0; backdrop-filter: blur(0px); } }
                `,document.head.appendChild(b)}v.appendChild(a)}}_showErrorToast(e){var t;if((t=window.YPP.utils)!=null&&t.showToast)window.YPP.utils.showToast(e);else{const r=document.createElement("div");r.className="ypp-toast show",r.textContent=e,r.style.cssText="position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: rgba(220, 38, 38, 0.9); color: white; padding: 12px 24px; border-radius: 8px; z-index: 999999; font-family: sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none; transition: opacity 0.5s;",document.body.appendChild(r),setTimeout(()=>{r.style.opacity="0",setTimeout(()=>r.remove(),500)},3e3)}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.LoopButton=class extends window.YPP.features.BaseFeature{constructor(){super("LoopButton")}getConfigKey(){return"enableLoop"}createButton(e){var i;const t='<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v6z"/></svg>',r=document.createElement("button");return r.innerHTML=t,r.title="Loop Video",r.className="ypp-action-btn",((i=this.settings)!=null&&i.loop||e.loop)&&(r.classList.add("active"),e.loop=!0),this.addListener(r,"click",n=>{n.stopPropagation(),this.toggleLoop(e,r)}),r}toggleLoop(e,t){var r,i;e&&(e.loop=!e.loop,e.loop?(t.classList.add("active"),(r=this.utils)!=null&&r.createToast&&this.utils.createToast("Loop enabled")):(t.classList.remove("active"),(i=this.utils)!=null&&i.createToast&&this.utils.createToast("Loop disabled")))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.PlayerSettingsMenu=class{constructor(e){this.player=e,this.controls=new window.YPP.features.PlayerControls(e),this.domObserver=window.YPP.sharedObserver}setupSettingsObserver(e){this.domObserver.register("player-settings-menu",".ytp-settings-menu .ytp-panel-menu",t=>{const r=document.querySelector(".ytp-settings-menu");r&&this.injectSettingsMenuItems(r,e)},!0)}cleanupSettingsObserver(){this.domObserver&&this.domObserver.unregister("player-settings-menu")}createSettingsMenuItem(e,t,r){const i=document.createElement("div");i.className="ytp-menuitem ypp-custom-menuitem",i.setAttribute("role","menuitem"),i.setAttribute("tabindex","0");const n=document.createElement("div");n.className="ytp-menuitem-icon",n.innerHTML=t||'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="4"/></svg>';const s=document.createElement("div");return s.className="ytp-menuitem-label",s.textContent=e,i.appendChild(n),i.appendChild(s),i.addEventListener("click",o=>{r(o);const a=document.querySelector(".ytp-settings-button");a&&a.click()}),i}createSettingsToggleItem(e,t,r,i,n){const s=document.createElement("div");s.className="ytp-menuitem ypp-custom-menuitem",s.setAttribute("role","menuitemcheckbox"),s.setAttribute("aria-checked",String(!!i)),s.setAttribute("tabindex","0");const o=document.createElement("div");o.className="ytp-menuitem-icon",o.innerHTML=t||'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="4"/></svg>';const a=document.createElement("div");a.className="ytp-menuitem-label",a.textContent=e;const l=document.createElement("div");l.className="ytp-menuitem-content";const d=document.createElement("div");return d.className="ytp-menuitem-toggle-checkbox",l.appendChild(d),s.appendChild(o),s.appendChild(a),s.appendChild(l),s.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation();const h=!(s.getAttribute("aria-checked")==="true");s.setAttribute("aria-checked",String(h)),window.YPP.Utils&&window.YPP.Utils.saveSettings&&window.YPP.Utils.saveSettings({[r]:h}),n&&n(h)}),s}injectSettingsMenuItems(e,t){var a;const r=e.querySelector('.ytp-panel:not([style*="display: none"]) .ytp-panel-menu');if(!r||r.querySelector(".ypp-custom-menuitem")||!!r.closest(".ytp-panel").querySelector(".ytp-panel-header"))return;let n=!1;const s=()=>{if(n)return;const l=document.createElement("div");l.className="ypp-custom-menuitem ypp-menuitem-separator",l.style.cssText="height: 1px; background-color: rgba(255,255,255,0.2); margin: 6px 0;",r.appendChild(l),n=!0},o=[{id:"pb_native_play",selector:".ytp-play-button",label:"Play/Pause"},{id:"pb_native_next",selector:".ytp-next-button",label:"Next Video"},{id:"pb_native_mute",selector:".ytp-mute-button",label:"Mute/Unmute"},{id:"pb_native_cast",selector:".ytp-remote-button",label:"Cast to TV"},{id:"pb_native_autoplay",selector:".ytp-autonav-button, .ytp-autonav-toggle-button",label:"Autoplay"},{id:"pb_native_cc",selector:".ytp-subtitles-button",label:"Subtitles/CC"},{id:"pb_native_miniplayer",selector:".ytp-miniplayer-button",label:"Miniplayer"},{id:"pb_native_theater",selector:".ytp-size-button",label:"Theater Mode"},{id:"pb_native_fullscreen",selector:".ytp-fullscreen-button",label:"Fullscreen"}];for(const l of o)if(this.player.settings[l.id]==="back"){const d=document.querySelector(l.selector);if(d){s();const p=((a=d.querySelector("svg"))==null?void 0:a.outerHTML)||"";r.appendChild(this.createSettingsMenuItem(l.label,p,()=>d.click()))}}if(this.player.settings.pb_speed==="back"&&(s(),r.appendChild(this.createSettingsMenuItem("Custom Speed",'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M5 4l15 8-15 8V4z"/></svg>',()=>{const d=[1,1.5,2,3],p=t.playbackRate;let u=d.indexOf(p)+1;u>=d.length&&(u=0),t.playbackRate=d[u]}))),this.player.settings.pb_snapshot==="back"&&(s(),r.appendChild(this.createSettingsMenuItem("Take Snapshot",'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM9 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l.59-.65L9.88 4h4.24l1.24 1.35.59.65H20v12zM12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-8c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>',()=>{var p;const d=(p=window.YPP.featureManager)==null?void 0:p.getFeature("snapshotButton");d&&d.takeSnapshot(t)}))),this.player.settings.pb_bookmark==="back"&&(s(),r.appendChild(this.createSettingsMenuItem("Bookmark Highlight",'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>',async()=>{var p;const d=(p=window.YPP.featureManager)==null?void 0:p.getFeature("BookmarksManager");d&&await d._captureHighlight()}))),this.player.settings.pb_loop==="back"&&(s(),r.appendChild(this.createSettingsMenuItem("Loop Video",'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v6z"/></svg>',()=>{t.loop=!t.loop}))),this.player.settings.pb_pip==="back"&&document.pictureInPictureEnabled&&(s(),r.appendChild(this.createSettingsMenuItem("Picture-in-Picture",'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>',async()=>{document.pictureInPictureElement?await document.exitPictureInPicture():await t.requestPictureInPicture()}))),this.player.settings.enableVolumeBoost&&this.player.settings.pb_volume==="back"){s();const l=window.YPP.featureManager&&window.YPP.featureManager.getFeature("volumeBoost");l&&r.appendChild(this.createSettingsMenuItem("Volume Booster",'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z"/></svg>',p=>{window.YPP.features.VolumeBoosterUI&&window.YPP.features.VolumeBoosterUI.toggleEQPanel(l,t,p.target)}))}if(this.player.settings.enableCinemaFilters&&this.player.settings.pb_cinema==="back"){s();const l=window.YPP.featureManager&&window.YPP.featureManager.getFeature("videoFilters");l&&r.appendChild(this.createSettingsMenuItem("Cinema Filters",'<svg height="24" width="24" viewBox="0 0 24 24" fill="#fff"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>',p=>{window.YPP.features.VideoFiltersUI&&window.YPP.features.VideoFiltersUI.togglePanel(l,t,p.target)}))}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.FilterPresets={PRESETS:[{category:"Classic",name:"Normal",css:"none",overlay:null},{category:"Classic",name:"Sepia",css:"sepia(100%)",overlay:null},{category:"Classic",name:"Grayscale",css:"grayscale(100%)",overlay:null},{category:"Classic",name:"High Contrast",css:"contrast(160%) saturate(90%)",overlay:null},{category:"Classic",name:"Vivid",css:"saturate(200%) contrast(110%)",overlay:null},{category:"Classic",name:"Warm",css:"sepia(40%) saturate(130%) contrast(100%) brightness(105%)",overlay:null},{category:"Classic",name:"Cool",css:"hue-rotate(200deg) saturate(130%) brightness(95%)",overlay:null},{category:"Classic",name:"Invert",css:"invert(100%)",overlay:null},{category:"Classic",name:"Washed Out",css:"contrast(80%) brightness(110%) saturate(70%)",overlay:null},{category:"Cinematic",name:"Cinematic",css:"contrast(115%) saturate(110%) brightness(95%) hue-rotate(350deg)",overlay:null},{category:"Cinematic",name:"Noir",css:"grayscale(100%) contrast(130%) brightness(85%)",overlay:null},{category:"Cinematic",name:"B&W Cinematic",css:"grayscale(100%) contrast(140%) brightness(90%)",overlay:null},{category:"Cinematic",name:"Teal & Orange",css:"hue-rotate(180deg) saturate(130%) contrast(115%) brightness(100%)",overlay:null},{category:"Cinematic",name:"Documentary",css:"contrast(120%) saturate(90%) brightness(100%)",overlay:null},{category:"Cinematic",name:"HDR",css:"contrast(140%) saturate(120%) brightness(110%)",overlay:null},{category:"Cinematic",name:"Dreamy",css:"contrast(90%) saturate(140%) brightness(110%) blur(0.5px)",overlay:null},{category:"Retro & Analog",name:"Retro",css:"sepia(60%) hue-rotate(330deg) saturate(150%) contrast(120%)",overlay:null},{category:"Retro & Analog",name:"90s TV",css:"contrast(85%) brightness(90%) saturate(75%) hue-rotate(5deg)",overlay:{type:"crt",scanlines:.1,noise:.15,vignette:.3}},{category:"Retro & Analog",name:"Polaroid",css:"sepia(20%) contrast(105%) brightness(108%) saturate(110%)",overlay:null},{category:"Retro & Analog",name:"VHS Tape",css:"contrast(90%) brightness(95%) saturate(80%) sepia(20%) hue-rotate(-5deg)",overlay:{type:"vhs",noise:.25,lines:!0,tracking:!0}},{category:"Retro & Analog",name:"Vintage",css:"sepia(50%) contrast(110%) brightness(90%) saturate(80%)",overlay:null},{category:"Artistic",name:"Cyberpunk",css:"hue-rotate(180deg) saturate(180%) contrast(120%) brightness(110%)",overlay:null},{category:"Artistic",name:"Vaporwave",css:"hue-rotate(280deg) saturate(160%) contrast(110%) brightness(105%)",overlay:null},{category:"Artistic",name:"Neon Lights",css:"saturate(250%) contrast(130%) brightness(95%)",overlay:null},{category:"Anime & Toon",name:"Anime Vivid",css:"saturate(180%) contrast(115%) brightness(110%)",overlay:null},{category:"Anime & Toon",name:"Studio Ghibli",css:"brightness(110%) contrast(90%) saturate(120%) sepia(10%) hue-rotate(5deg)",overlay:null},{category:"Anime & Toon",name:"Shinkai Sky",css:"hue-rotate(10deg) saturate(150%) contrast(115%) brightness(105%)",overlay:null},{category:"Anime & Toon",name:"Pastel Anime",css:"contrast(90%) saturate(130%) brightness(115%) sepia(15%)",overlay:null},{category:"Anime & Toon",name:"Dark Fantasy",css:"saturate(110%) contrast(130%) brightness(85%) hue-rotate(200deg)",overlay:null},{category:"Atmospheric",name:"Old Film",css:"sepia(80%) grayscale(40%) contrast(110%) brightness(90%)",overlay:{type:"film",grain:.3,scratches:!0,flicker:!0}},{category:"Atmospheric",name:"Golden Hour",css:"sepia(30%) hue-rotate(30deg) saturate(130%) brightness(110%) contrast(105%)",overlay:null},{category:"Atmospheric",name:"Blue Hour",css:"hue-rotate(210deg) saturate(120%) brightness(95%) contrast(110%)",overlay:null},{category:"Atmospheric",name:"Sunset",css:"sepia(30%) hue-rotate(330deg) saturate(150%) contrast(110%) brightness(105%)",overlay:null},{category:"Atmospheric",name:"Midnight",css:"hue-rotate(220deg) saturate(80%) contrast(120%) brightness(75%)",overlay:null}],PREVIEW_GRADIENTS:["linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)","linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)","linear-gradient(135deg, #11998e 0%, #38ef7d 100%)","linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)","linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)","linear-gradient(135deg, #ff0844 0%, #ffb199 100%)","linear-gradient(135deg, #0ba360 0%, #3cba92 100%)","linear-gradient(135deg, #df89b5 0%, #bfd9fe 100%)"]},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{};const Te={play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',mute:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',volumeHigh:'<svg viewBox="0 0 36 36" fill="currentColor"><path d="M 8.5 9 C 6.195898 11.304103 4.7695312 14.486564 4.7695312 18 C 4.7695312 21.513437 6.195898 24.695899 8.5 27 L 9.8496094 25.650391 C 7.8892134 23.689995 6.6796875 20.978784 6.6796875 18 C 6.6796875 15.021216 7.8892134 12.310004 9.8496094 10.349609 L 8.5 9 z M 27.5 9 L 26.150391 10.349609 C 28.110787 12.310004 29.320313 15.021216 29.320312 18 C 29.320312 20.978784 28.110787 23.689995 26.150391 25.650391 L 27.5 27 C 29.804102 24.695899 31.230469 21.513437 31.230469 18 C 31.230469 14.486564 29.804102 11.304103 27.5 9 z M 18.800781 10 L 14 19.599609 L 17.199219 19.599609 L 17.199219 26 L 22 16.400391 L 18.800781 16.400391 L 18.800781 10 z M 11.699219 11.699219 C 10.082529 13.31591 9.0898437 15.54314 9.0898438 18 C 9.0898438 20.45686 10.082529 22.684091 11.699219 24.300781 L 13.048828 22.951172 C 11.775844 21.678187 10.998047 19.934936 10.998047 18 C 10.998047 16.065064 11.788574 14.321814 13.048828 13.048828 L 11.699219 11.699219 z M 24.300781 11.699219 L 22.951172 13.048828 C 24.211427 14.321814 25.001953 16.065064 25.001953 18 C 25.001953 19.934936 24.211427 21.678187 22.951172 22.951172 L 24.300781 24.300781 C 25.917473 22.684091 26.910156 20.45686 26.910156 18 C 26.910156 15.54314 25.917473 13.31591 24.300781 11.699219 z M 18.384766 11.726562 L 18.384766 16.853516 L 21.298828 16.853516 L 17.615234 24.273438 L 17.615234 19.146484 L 14.755859 19.146484 L 18.384766 11.726562 z"/></svg>',loop:'<svg viewBox="0 0 36 36" fill="currentColor"><path d="m 13,13 h 10 v 3 l 4,-4 -4,-4 v 3 H 11 v 6 h 2 z M 23,23 H 13 v -3 l -4,4 4,4 v -3 h 12 v -6 h -2 z"/></svg>',pip:'<svg viewBox="0 0 36 36" fill="currentColor"><path d="m 21.554375,7.9999999 h 2.02 V 10.02 h -2.02 z m 4.04,0 h 2.02 V 10.02 h -2.02 z M 5.394375,16.08 h 2.02 v 2.02 h -2.02 z m 0,-4.04 h 2.02 v 2.02 h -2.02 z m 0,8.08 h 2.02 v 2.02 h -2.02 z m 12.12,-12.1200001 h 2.02 V 10.02 h -2.02 z M 30.605625,26.18 H 9.434375 V 12.04 h 21.17125 z m -2.02,-12.12 h -17.13125 v 10.1 h 17.13125 z M 13.474375,7.9999999 h 2.02 V 10.02 h -2.02 z m -4.04,0 h 2.02 V 10.02 h -2.02 z m -4.04,0 h 2.02 V 10.02 h -2.02 z"/></svg>',fullscreen:'<svg viewBox="0 0 36 36" fill="currentColor"><path d="M 5.390625,7.9999999 V 26.179687 h 25.21875 V 7.9999999 Z M 7.410156,10.009766 H 28.589844 V 24.169922 H 7.410156 Z m 4.040294,4.050342 h 3.029835 V 12.040219 H 9.430562 v 5.049722 h 2.019888 z m 15.118897,3.029833 h -2.019888 v 3.029834 h -3.029834 v 2.019889 h 5.049722 z"/></svg>',close:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'},ii=`
    <div class="ypp-gpb-controls">
        <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-play" title="Play / Pause All">
            ${Te.play}
        </button>
        <div id="ypp-gpb-time" class="ypp-gpb-time" title="Current Time">0:00</div>
        <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-mute" title="Mute / Unmute All">
            ${Te.volumeHigh}
        </button>
        <div id="ypp-gpb-vol-wrap" class="ypp-gpb-vol-wrap" title="Volume">
            <input type="range" id="ypp-gpb-vol" min="0" max="1" step="0.02" value="1" class="ypp-gpb-vol-slider">
        </div>
        <div id="ypp-gpb-features-container"></div>
        <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-loop" title="Toggle Loop All">
            ${Te.loop}
        </button>
        <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-pip" title="Picture-in-Picture">
            ${Te.pip}
        </button>
        <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-fullscreen" title="Fullscreen">
            ${Te.fullscreen}
        </button>
        <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-close" title="Hide Bar">
            ${Te.close}
        </button>
    </div>
`;window.YPP.features.GlobalBarUI=class{constructor(e){var t;this.trackedVideos=new Set,this.videoVisibility=new Map,this.filters=e||((t=window.YPP.features.FilterPresets)==null?void 0:t.PRESETS)||[],this.settings={},this.barElement=null,this._abortController=null,this._currentPrimaryVideo=null,this._boundUpdateUIState=this.updateUIState.bind(this),this._boundHandleIntersection=this._handleIntersection.bind(this),this._intersectionObserver=new IntersectionObserver(this._boundHandleIntersection,{threshold:[0,.25,.5,.75,1]})}updateSettings(e){this.settings={...this.settings,...e},this.updatePosition()}trackVideo(e){var t;this.trackedVideos.has(e)||((t=window.YPP.Utils)==null||t.log("Tracking new video for global bar","GlobalBarUI","debug"),this.trackedVideos.add(e),this.videoVisibility.set(e,0),this._intersectionObserver.observe(e),this.barElement?this.updateUIState():this.createBar())}_untrackVideo(e){this.trackedVideos.delete(e),this.videoVisibility.delete(e),this._intersectionObserver.unobserve(e),this._currentPrimaryVideo===e&&(this._currentPrimaryVideo=null),this.trackedVideos.size===0?this.removeBar():this.updateUIState()}hasVideo(e){return this.trackedVideos.has(e)}_handleIntersection(e){let t=!1;for(const r of e){const i=r.target;if(!i.isConnected){this._untrackVideo(i),t=!0;continue}this.videoVisibility.set(i,r.intersectionRatio),t=!0}t&&this.barElement&&this.updateUIState()}createBar(){var n;if(this.barElement||sessionStorage.getItem("ypp-gpb-dismissed")==="true")return;(n=window.YPP.Utils)==null||n.log("Creating singular global player bar","GlobalBarUI","debug");const e=document.createElement("div");e.className="ypp-global-player-bar ypp-glass-panel",e.innerHTML=ii;const t=this.settings;t.gpb_showPlay===!1&&(e.querySelector("#ypp-gpb-play").style.display="none"),t.gpb_showTime===!1&&(e.querySelector("#ypp-gpb-time").style.display="none"),t.gpb_showVolume===!1&&(e.querySelector("#ypp-gpb-mute").style.display="none",e.querySelector("#ypp-gpb-vol-wrap").style.display="none"),t.gpb_showLoop===!1&&(e.querySelector("#ypp-gpb-loop").style.display="none"),t.gpb_showPip===!1&&(e.querySelector("#ypp-gpb-pip").style.display="none"),t.gpb_showFullscreen===!1&&(e.querySelector("#ypp-gpb-fullscreen").style.display="none"),this.barElement=e,this.ICONS=Te,this.updatePosition();let r=document.body;if("popover"in e&&(e.popover="manual"),r.appendChild(e),"popover"in e)try{e.showPopover()}catch{}this._entranceAnim=H({targets:e.querySelectorAll(".ypp-gpb-btn, .ypp-gpb-time, .ypp-gpb-vol-wrap"),translateY:[-12,0],opacity:[0,1],delay:H.stagger(40,{start:100}),easing:"spring(1, 80, 10, 0)",duration:600}),this._abortController=new AbortController;const i=this._abortController.signal;document.addEventListener("play",this._boundUpdateUIState,{capture:!0,signal:i}),document.addEventListener("pause",this._boundUpdateUIState,{capture:!0,signal:i}),document.addEventListener("volumechange",this._boundUpdateUIState,{capture:!0,signal:i}),document.addEventListener("ratechange",this._boundUpdateUIState,{capture:!0,signal:i}),document.addEventListener("timeupdate",this._boundUpdateUIState,{capture:!0,signal:i}),document.addEventListener("fullscreenchange",this._boundUpdateUIState,{signal:i}),this._bindEvents(i),this.updateUIState()}removeAll(){Array.from(this.trackedVideos).forEach(t=>this._untrackVideo(t)),this.removeBar()}removeBar(){this._entranceAnim&&(this._entranceAnim.pause(),this._entranceAnim=null),this._abortController&&(this._abortController.abort(),this._abortController=null),this.barElement&&(this.barElement.remove(),this.barElement=null),this._currentPrimaryVideo=null}updatePosition(){if(!this.barElement)return;const e=this.settings.globalPlayerBarPosition||"right",t=this.barElement;t.classList.remove("ypp-bar-pos-right","ypp-bar-pos-left","ypp-bar-pos-top"),t.classList.add(`ypp-bar-pos-${e}`),e==="top"?Object.assign(t.style,{position:"fixed",top:"16px",bottom:"auto",left:"50%",right:"auto",zIndex:"2147483647",display:"flex",visibility:"visible",transform:"translateX(-50%)"}):e==="left"?Object.assign(t.style,{position:"fixed",left:"16px",right:"auto",top:"50%",bottom:"auto",zIndex:"2147483647",display:"flex",visibility:"visible",transform:""}):Object.assign(t.style,{position:"fixed",right:"16px",left:"auto",top:"50%",bottom:"auto",zIndex:"2147483647",display:"flex",visibility:"visible",transform:""})}_getPrimaryVideo(){if(this.trackedVideos.size===0)return null;let e=null,t=-1;for(const[r,i]of this.videoVisibility.entries())i>t&&(t=i,e=r);return e||this.trackedVideos.values().next().value}updateUIState(){if(!this.barElement)return;const e=this._getPrimaryVideo();if(!e)return;this._syncSubFeatureButtons(e);let t=!0;for(const l of this.trackedVideos)!l.muted&&l.volume>0&&(t=!1);const r=this.barElement.querySelector("#ypp-gpb-play");r&&(r.innerHTML=e.paused?this.ICONS.play:this.ICONS.pause);const i=this.barElement.querySelector("#ypp-gpb-mute"),n=this.barElement.querySelector("#ypp-gpb-vol");i&&n&&(i.innerHTML=t?this.ICONS.mute:this.ICONS.volumeHigh,i.classList.toggle("active",t),n.value=e.muted?0:e.volume);const s=this.barElement.querySelector("#ypp-gpb-time");if(s){const l=p=>{if(!p||isNaN(p)||p<0)return"0:00";const u=Math.floor(p/3600),h=Math.floor(p%3600/60),m=Math.floor(p%60).toString().padStart(2,"0");return u>0?`${u}:${h.toString().padStart(2,"0")}:${m}`:`${h}:${m}`};let d=e.duration&&!isNaN(e.duration)?`${l(e.currentTime)} / ${l(e.duration)}`:l(e.currentTime);if(this.settings.enableRemainingTime!==!1&&e.duration&&!isNaN(e.duration)){const p=e.playbackRate||1,u=Math.max(0,e.duration-e.currentTime),h=u/p;if(u>0)if(Math.abs(p-1)<=.01)d+=` ( -${l(u)} )`;else if(p>1){const m=e.duration-e.duration/p;d+=` ( -${l(h)} · ${l(m)} saved )`}else{const m=e.duration/p-e.duration;d+=` ( -${l(h)} · ${l(m)} extra )`}}s.textContent=d}const o=this.barElement.querySelector("#ypp-gpb-loop");o&&(o.classList.toggle("active",e.loop),o.style.opacity=e.loop?"1":"0.5");const a=this.barElement.querySelector("#ypp-gpb-fullscreen");if(a){let l=!1;for(const d of this.trackedVideos)if(document.fullscreenElement===d){l=!0;break}a.innerHTML=l?'<svg viewBox="0 0 36 36" fill="currentColor"><path d="m 5.390625,8 v 18.179687 h 25.21875 V 8 Z m 2.019531,2.009765 H 28.589844 V 24.169922 H 7.410156 Z M 19.45325,22.331983 h 1.762511 V 19.688214 H 23.85953 V 17.925702 H 19.45325 Z M 14.784019,14.491472 H 12.14025 v 1.762512 h 4.406281 v -4.40628 h -1.762512 z m 0,5.196743 H 12.14025 v -1.762512 h 4.406281 v 4.40628 h -1.762512 z m 4.669231,-7.840512 h 1.762511 v 2.643769 h 2.643769 v 1.762512 h -4.40628 z"/></svg>':this.ICONS.fullscreen}}_syncSubFeatureButtons(e){if(this._currentPrimaryVideo===e)return;this._currentPrimaryVideo=e;const t=this.barElement.querySelector("#ypp-gpb-features-container");if(!(!t||!window.YPP.featureManager)){if(t.innerHTML="",this.settings.gpb_showVolumeBoost!==!1){const r=window.YPP.featureManager.getFeature("volumeBoost");r!=null&&r.createButton&&t.appendChild(r.createButton(e))}if(this.settings.gpb_showFilters!==!1){const r=window.YPP.featureManager.getFeature("videoFilters");r!=null&&r.createButton&&t.appendChild(r.createButton(e))}t.children.length===0?t.style.display="none":t.style.display="flex"}}_bindEvents(e){this._bindPlaybackControls(),this._bindVolumeControls(),this._bindWindowControls()}_bindPlaybackControls(){const e=this.barElement,t=e.querySelector("#ypp-gpb-play");t.onclick=i=>{i.stopPropagation();const n=this._getPrimaryVideo();n&&(n.paused?n.play().catch(s=>{var o;return(o=window.YPP.Utils)==null?void 0:o.log("Play prevented: "+s.message,"GlobalBarUI","debug")}):n.pause(),this.updateUIState())};const r=e.querySelector("#ypp-gpb-loop");r.onclick=i=>{i.stopPropagation();const n=this._getPrimaryVideo();n&&(n.loop=!n.loop,this.updateUIState())}}_bindVolumeControls(){const e=this.barElement,t=e.querySelector("#ypp-gpb-mute");t.onclick=i=>{i.stopPropagation();let n=!0;for(const s of this.trackedVideos)!s.muted&&s.volume>0&&(n=!1);for(const s of this.trackedVideos)s.muted=!n;this.updateUIState()};const r=e.querySelector("#ypp-gpb-vol");r.oninput=i=>{i.stopPropagation();const n=parseFloat(i.target.value);for(const s of this.trackedVideos)s.volume=n,s.muted=n===0;this.updateUIState()}}_bindWindowControls(){const e=this.barElement,t=e.querySelector("#ypp-gpb-pip");t.onclick=async n=>{n.stopPropagation();try{if(document.pictureInPictureElement)await document.exitPictureInPicture();else{const s=this._getPrimaryVideo();s&&await s.requestPictureInPicture()}}catch{}};const r=e.querySelector("#ypp-gpb-fullscreen");r.onclick=n=>{n.stopPropagation();try{if(document.fullscreenElement)document.exitFullscreen();else{const s=this._getPrimaryVideo();s&&s.requestFullscreen()}}catch{}};const i=e.querySelector("#ypp-gpb-close");i.onclick=n=>{n.stopPropagation(),sessionStorage.setItem("ypp-gpb-dismissed","true"),this.removeAll()}}};const ni=".ypp-global-player-bar{display:flex;flex-direction:column;align-items:center;padding:12px 8px;border-radius:36px;color:#fff;font-family:Inter,Roboto,sans-serif;font-size:11px;width:auto;height:auto;pointer-events:auto;-webkit-user-select:none;user-select:none;transition:opacity .4s cubic-bezier(.16,1,.3,1),transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s ease;box-shadow:0 20px 50px #00000080,0 8px 24px #0006,inset 0 1px 3px #ffffff26,inset 0 -1px 3px #0000004d;opacity:1;background:linear-gradient(135deg,#ffffff0d,#ffffff03)!important;backdrop-filter:blur(48px) saturate(200%)!important;-webkit-backdrop-filter:blur(48px) saturate(200%)!important;border:1px solid rgba(255,255,255,.1)!important;border-top:1px solid rgba(255,255,255,.2)!important;border-bottom:1px solid rgba(0,0,0,.4)!important}.ypp-global-player-bar:hover{box-shadow:0 24px 60px #0009,0 12px 30px #00000080,inset 0 1px 4px #ffffff40;background:linear-gradient(135deg,#ffffff14,#ffffff08)!important;border-top:1px solid rgba(255,255,255,.3)!important}.ypp-bar-pos-right{animation:ypp-global-bar-pop-right .4s cubic-bezier(.2,.8,.2,1) forwards}@keyframes ypp-global-bar-pop-right{0%{opacity:0;transform:translate(20px) translateY(-50%) scale(calc(.95 * var(--ypp-auto-scale, 1)))}to{opacity:1;transform:translate(0) translateY(-50%) scale(var(--ypp-auto-scale, 1))}}.ypp-bar-pos-right:hover{transform:translate(-3px) translateY(-50%) scale(var(--ypp-auto-scale, 1))}.ypp-bar-pos-left{animation:ypp-global-bar-pop-left .4s cubic-bezier(.2,.8,.2,1) forwards}@keyframes ypp-global-bar-pop-left{0%{opacity:0;transform:translate(-20px) translateY(-50%) scale(calc(.95 * var(--ypp-auto-scale, 1)))}to{opacity:1;transform:translate(0) translateY(-50%) scale(var(--ypp-auto-scale, 1))}}.ypp-bar-pos-left:hover{transform:translate(3px) translateY(-50%) scale(var(--ypp-auto-scale, 1))}.ypp-bar-pos-top{flex-direction:row;padding:6px 12px;animation:ypp-global-bar-pop-top .4s cubic-bezier(.2,.8,.2,1) forwards}@keyframes ypp-global-bar-pop-top{0%{opacity:0;transform:translate(-50%) translateY(-20px) scale(calc(.95 * var(--ypp-auto-scale, 1)))}to{opacity:1;transform:translate(-50%) translateY(0) scale(var(--ypp-auto-scale, 1))}}.ypp-bar-pos-top:hover{transform:translate(-50%) translateY(3px) scale(var(--ypp-auto-scale, 1))}.ypp-bar-pos-top .ypp-gpb-controls{flex-direction:row;gap:12px}.ypp-bar-pos-top .ypp-gpb-divider{width:1.5px;height:28px;background:linear-gradient(180deg,#fff0,#fff3,#fff0)}.ypp-bar-pos-top .ypp-gpb-vol-wrap{width:60px;height:20px;margin:0 4px}.ypp-bar-pos-top .ypp-gpb-vol-slider{transform:rotate(0)}.ypp-bar-pos-top #ypp-gpb-speed-container .ypp-speed-controls,.ypp-bar-pos-top #ypp-gpb-features-container{flex-direction:row;gap:8px}.ypp-gpb-controls{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%}.ypp-gpb-btn,.ypp-action-btn{background:#ffffff0a;border:1px solid transparent;border-radius:8px;color:#ffffffb3;cursor:pointer;font-size:15px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;transition:all .3s cubic-bezier(.175,.885,.32,1.275);flex-shrink:0}.ypp-gpb-btn:hover,.ypp-action-btn:hover{background:#ffffff26;border:1px solid rgba(255,255,255,.3);color:#fff;transform:scale(1.15) translateY(-2px);box-shadow:0 4px 12px #0000004d,inset 0 1px 2px #fff3}.ypp-gpb-btn.active{background:#fff3;border:1px solid rgba(255,255,255,.4);color:#fff;box-shadow:0 0 16px #ffffff4d}.ypp-global-player-bar .ypp-action-btn svg{width:18px;height:18px;fill:currentColor;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));transition:transform .2s ease}.ypp-gpb-btn:active svg,.ypp-action-btn:active svg{transform:scale(.9)}.ypp-gpb-divider{width:28px;height:1.5px;background:linear-gradient(90deg,#fff0,#fff3,#fff0);flex-shrink:0}.ypp-gpb-time{font-size:9px;font-weight:700;color:#ffffff8c;letter-spacing:.3px;text-align:center;white-space:nowrap;line-height:1.2;padding:2px 4px;max-width:44px;overflow:hidden;word-break:break-all}.ypp-gpb-vol-wrap{display:flex;align-items:center;justify-content:center;height:60px;width:20px;background:#0003;border-radius:12px;box-shadow:inset 0 2px 6px #0006;margin:4px 0}.ypp-gpb-vol-slider{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:50px;height:4px;border-radius:4px;background:#fff3;outline:none;cursor:pointer;transform:rotate(-90deg);transform-origin:center}.ypp-gpb-vol-slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;cursor:pointer;box-shadow:0 2px 8px #00000080,inset 0 -2px 4px #0000001a;transition:transform .2s cubic-bezier(.175,.885,.32,1.275)}.ypp-gpb-vol-slider::-webkit-slider-thumb:hover{transform:scale(1.4)}#ypp-gpb-speed-container .ypp-speed-controls,#ypp-gpb-features-container{display:flex;flex-direction:column;gap:6px;align-items:center}.ypp-global-player-bar .ypp-speed-controls{padding:6px 4px!important;border-radius:24px!important}.ypp-global-player-bar .ypp-speed-btn{font-size:10px!important;padding:3px 2px!important;width:28px!important;min-width:0!important}#ypp-gpb-close{opacity:.5}#ypp-gpb-close:hover{opacity:1;background:#ff3c3c2e!important}#ypp-eq-panel.ypp-panel-transparent,#ypp-cinema-panel.ypp-panel-transparent{background:#0808129e!important;backdrop-filter:blur(24px) saturate(160%)!important;-webkit-backdrop-filter:blur(24px) saturate(160%)!important;box-shadow:0 12px 40px #0000008c,0 0 0 1px #ffffff14!important;border:1px solid rgba(255,255,255,.1)!important}#ypp-eq-panel.ypp-panel-transparent,#ypp-cinema-panel.ypp-panel-transparent{font-size:11px!important;border-radius:16px!important;overflow:visible!important;zoom:.65}#ypp-cinema-panel.ypp-panel-transparent>div:first-child{padding:8px 10px!important;font-size:12px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-cinema-tab-btn{padding:7px 6px!important;font-size:10px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-filter-cat-details summary{padding:7px 10px!important;font-size:10px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-filter-card-grid{grid-template-columns:repeat(3,1fr)!important;gap:5px!important;padding:8px 10px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-filter-card{padding:5px 8px!important;font-size:10px!important;gap:6px!important;border-radius:8px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-filter-lut-preview{width:20px!important;height:20px!important;border-radius:5px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-vcp-search-wrap{margin:8px 8px 4px!important;padding:0!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-vcp-search-input{font-size:10px!important;padding:5px 8px 5px 24px!important;border-radius:8px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-vcp-search-icon{left:10px!important;font-size:11px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-adjust-grid{grid-template-columns:1fr!important;gap:6px!important;padding:8px 10px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-adjust-card{padding:7px 8px!important;gap:5px!important;border-radius:8px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-adjust-card-title{font-size:10px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-adjust-card-val{font-size:10px!important;padding:1px 5px!important;border-radius:6px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-intensity-section{padding:8px 10px 10px!important;border-radius:10px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-intensity-header{font-size:10px!important;margin-bottom:6px!important}#ypp-cinema-panel.ypp-panel-transparent>div:last-child{padding:7px 10px!important;font-size:10px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-vcp-compare-toggle{font-size:9px!important;padding:4px 8px!important}#ypp-cinema-panel.ypp-panel-transparent .ypp-vcp-cat-header{font-size:9px!important;margin:8px 10px 4px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-header{padding:8px 12px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-icon{width:24px!important;height:24px!important;border-radius:7px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-title{font-size:11px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-subtitle{font-size:8px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-close-btn{width:22px!important;height:22px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-gain-row{padding:6px 12px!important;gap:6px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-row-label{font-size:9px!important;min-width:52px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-gain-value{font-size:9px!important;min-width:28px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-presets-row{padding:5px 12px!important;gap:4px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-preset-btn{font-size:9px!important;padding:2px 7px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-canvas{height:44px!important;margin:0 10px 2px!important;width:calc(100% - 20px)!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-bands{padding:3px 8px 8px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-band-col{padding:0 1px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-band-track{height:56px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-band-db{font-size:7px!important;min-height:10px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-band-freq{font-size:6px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-vslider{width:54px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-footer{padding:0 12px 8px!important;gap:4px!important;flex-wrap:wrap!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-comp-btn{font-size:9px!important;padding:3px 7px!important;gap:3px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-reset-btn{font-size:9px!important;padding:3px 9px!important}#ypp-eq-panel.ypp-panel-transparent .ypp-eq-hint{font-size:7px!important;width:100%!important;margin-left:0!important}";if(typeof document<"u"){const c=document.createElement("style");c.id="ypp-global-bar-css",c.textContent=ni,document.getElementById("ypp-global-bar-css")||document.head.appendChild(c)}window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.GlobalPlayerBar=class extends window.YPP.features.BaseFeature{constructor(){var e;super("GlobalPlayerBar"),this.isYouTube=window.location.hostname.includes("youtube.com"),this.observer=null,this.ui=new window.YPP.features.GlobalBarUI(((e=window.YPP.features.FilterPresets)==null?void 0:e.PRESETS)||[]),this._repositionListener=()=>this.ui.updatePosition()}onUpdate(){this.ui&&this.ui.updateSettings(this.settings)}getConfigKey(){return"enableGlobalPlayerBar"}async enable(){var e,t;if(!this.isYouTube)try{(e=this.utils)==null||e.log("Enabling Global Player Bar","GlobalPlayerBar"),this.scanForVideos(),this.startObserver()}catch(r){(t=this.utils)==null||t.log("Error enabling GlobalPlayerBar","GLOBAL","error",r)}}async disable(){var e;await super.disable(),this.stopObserver(),this.ui.removeAll(),(e=this.utils)==null||e.removeStyle("ypp-global-bar-css"),document.querySelectorAll("video[data-ypp-processed]").forEach(t=>{t.removeAttribute("data-ypp-processed")})}startObserver(){var e;this._isObserving||(this._isObserving=!0,(e=window.YPP)!=null&&e.sharedObserver?window.YPP.sharedObserver.register("global-bar-scanner","video",()=>{this.scanForVideos()}):(this._fallbackVideoScanner=t=>{t.target&&t.target.tagName==="VIDEO"&&this.scanForVideos()},this.addListener(document,"play",this._fallbackVideoScanner,!0),this.addListener(document,"loadeddata",this._fallbackVideoScanner,!0)))}stopObserver(){var e;this._isObserving&&(this._isObserving=!1,(e=window.YPP)!=null&&e.sharedObserver&&window.YPP.sharedObserver.unregister("global-bar-scanner"),this._fallbackVideoScanner&&(this._fallbackVideoScanner=null))}scanForVideos(){document.querySelectorAll("video").forEach(t=>{t.hasAttribute("data-ypp-processed")||this.ui.hasVideo(t)||(t.offsetWidth>0&&t.offsetHeight>0?(t.setAttribute("data-ypp-processed","true"),this.ui.trackVideo(t),this._notifyFeaturesOfNewVideo(t)):this.pollFor(()=>t.isConnected&&t.offsetWidth>0?t:null,5e3,500).then(r=>{r&&!r.hasAttribute("data-ypp-processed")&&!this.ui.hasVideo(r)&&(r.setAttribute("data-ypp-processed","true"),this.ui.trackVideo(r),this._notifyFeaturesOfNewVideo(r))}).catch(()=>{}))})}_notifyFeaturesOfNewVideo(e){this.isYouTube||window.YPP.featureManager&&["volumeBoost","videoFilters","videoSpeedController"].forEach(t=>{const r=window.YPP.featureManager.getFeature(t);r&&r.isEnabled&&typeof r.onVideoChange=="function"&&r.onVideoChange(e)})}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.PlayerTools=class extends window.YPP.features.BaseFeature{getConfigKey(){return"enableCustomSpeed"}constructor(){super("PlayerTools"),this._initConstants(),this._initState()}_initConstants(){this._CONSTANTS=window.YPP.CONSTANTS||{},this._SELECTORS=this._CONSTANTS.SELECTORS||{},this._PLAYER=this._CONSTANTS.PLAYER||{},this._CSS_CLASSES=this._CONSTANTS.CSS_CLASSES||{}}_initState(){this._isActive=!1,this._settings=null,this._controlsInjected=!1,this._speedInput=null,this._Utils=window.YPP.Utils||{},this._boundHandleRateChange=this._onRateChange.bind(this)}enable(){this.utils.log("Enabled Player Tools","PLAYER_TOOLS"),this._startMonitoring()}disable(){this._removeControls(),this._cleanupListeners()}async _startMonitoring(){var e,t;if(this.utils.pollFor)try{const r=await this.utils.pollFor(()=>document.querySelector(this._SELECTORS.VIDEO_CONTROLS),1e4,500);if(!this._isActive||!r)return;this._injectControls(r),this.addListener(window,"yt-navigate-finish",()=>this._checkForPlayer())}catch{(t=(e=this.utils).log)==null||t.call(e,"PlayerTools timeout waiting for controls","PLAYER_TOOLS","debug")}}_checkForPlayer(){var t;if(!this._isActive)return;((t=window.YPP.DomAPI)==null?void 0:t.getVideoControls())&&this._injectControls()}_injectControls(){}_setSpeed(e){const t=document.querySelector(this._SELECTORS.VIDEO||"video");if(t){const r=Math.max(this._PLAYER.SPEED_MIN||.1,Math.min(16,e));t.playbackRate=r}}_onRateChange(){const e=document.querySelector(this._SELECTORS.VIDEO||"video");e&&this._speedInput&&document.activeElement!==this._speedInput&&(this._speedInput.value=e.playbackRate.toFixed(1))}_removeControls(){window.YPP.ui&&window.YPP.ui.manager&&(window.YPP.ui.manager.remove("btn-custom-speed-input"),window.YPP.ui.manager.remove("custom-speed-input")),this._speedInput=null}_cleanupListeners(){const e=document.querySelector(this._SELECTORS.VIDEO||"video");e&&e.removeEventListener("ratechange",this._boundHandleRateChange)}isActive(){return this._isActive}getSpeed(){const e=document.querySelector(this._SELECTORS.VIDEO||"video");return(e==null?void 0:e.playbackRate)||1}setSpeed(e){this._setSpeed(e),this._speedInput&&(this._speedInput.value=e.toFixed(1))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AutoLike=class extends window.YPP.features.BaseFeature{constructor(){super("AutoLike"),this._bound=this._tryLike.bind(this),this._attempted=new Set}getConfigKey(){return"autoLike"}async enable(){var e;await super.enable(),this._tryLike(),(e=window.YPP.events)==null||e.on("page:changed",this._bound)}async disable(){var e;await super.disable(),(e=window.YPP.events)==null||e.off("page:changed",this._bound),this._attempted.clear()}_tryLike(){var r;if(!document.body.classList.contains("ypp-watch-page"))return;const t=(r=window.location.href.match(/[?&]v=([^&]+)/))==null?void 0:r[1];t&&(this._attempted.has(t)||localStorage.getItem(`ypp_liked_${t}`)||this._waitForPercentage(t))}async _waitForPercentage(e){try{const t=await this.waitForElement("video.html5-main-video",15e3);if(!t)return;const r=()=>{var a,l;if(((a=window.location.href.match(/[?&]v=([^&]+)/))==null?void 0:a[1])!==e){this.removeListener(t,"timeupdate",r);return}const s=((l=this.settings)==null?void 0:l.autoLikeThreshold)??50;(t.currentTime/t.duration*100>=s||t.ended)&&(this.removeListener(t,"timeupdate",r),this._waitAndLike(e))};this.addListener(t,"timeupdate",r)}catch{}}async _waitAndLike(e){var t,r,i;try{let n=this._getLikeButton();if(n||(n=await this.waitForElement('ytd-watch-metadata ytd-toggle-button-renderer:first-child button, segmented-like-dislike-button-view-model button:first-child, like-button-view-model button, [aria-label*="like this video"], [aria-label*="I like this"]',1e4)),n||(n=this._getLikeButton()),!n)return;if(this._isAlreadyLiked(n)){this._markAttempted(e);return}if(this._isDisliked()){(r=(t=this.utils)==null?void 0:t.log)==null||r.call(t,`User disliked video ${e}, skipping auto-like`,"AUTO-LIKE","info"),this._markAttempted(e);return}n.click(),this._markAttempted(e),(i=window.YPP.Utils)==null||i.log(`Auto-liked video: ${e}`,"AUTO-LIKE","info")}catch{}}_markAttempted(e){this._attempted.add(e);try{localStorage.setItem(`ypp_liked_${e}`,"true")}catch{}}_getLikeButton(){const e=["ytd-watch-metadata ytd-toggle-button-renderer:first-child button","segmented-like-dislike-button-view-model button:first-child","like-button-view-model button",'[aria-label*="like this video"]','[aria-label*="I like this"]'];for(const t of e){const r=document.querySelector(t);if(r)return r}return null}_isDisliked(){const e=["dislike-button-view-model button",'[aria-label*="dislike this video"]','[aria-label*="I dislike this"]'];for(const t of e){const r=document.querySelector(t);if(r){const i=r.getAttribute("aria-pressed")==="true",n=r.classList.contains("active")||r.classList.contains("style-default-active");if(i||n)return!0}}return!1}_isAlreadyLiked(e){const t=e.getAttribute("aria-pressed")==="true",r=e.classList.contains("active")||e.classList.contains("style-default-active"),i=e.closest('[class*="active"], [aria-pressed="true"]'),n=e.querySelector("path"),s=(n==null?void 0:n.getAttribute("fill-rule"))==="evenodd";return t||r||!!i||s}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.BookmarksManager=class extends window.YPP.features.BaseFeature{getConfigKey(){return"enableBookmarks"}constructor(){super("BookmarksManager"),this._initConstants(),this._isActive=!1,this._captureBtn=null}_initConstants(){this._CONSTANTS=window.YPP.CONSTANTS||{},this._SELECTORS=this._CONSTANTS.SELECTORS||{}}async disable(){this._removeControls(),super.disable()}_removeControls(){document.querySelectorAll(".ypp-capture-btn").forEach(e=>e.remove())}createButton(e){var i;if((((i=this.settings)==null?void 0:i.pb_bookmark)||"front")!=="front")return null;const r=document.createElement("button");return r.className="ypp-action-btn ypp-capture-btn",r.title="Capture Highlight (Bookmark)",r.setAttribute("aria-label","Capture Highlight"),r.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>',this.addListener(r,"click",n=>{n.stopPropagation(),this._captureHighlight(e)}),this._captureBtn=r,r}async _captureHighlight(e){if(!e)return;const t=e.currentTime,r=new URLSearchParams(window.location.search).get("v")||"",i=this._getVideoTitle();let n=this._extractCaptionText();n||(n="No transcript captured (CC was off or unavailable).");const s={id:"bm_"+Date.now(),videoId:r,videoTitle:i,timestamp:t,text:n,createdAt:Date.now()};await this._saveBookmark(s),this._showToast("Highlight captured!")}_getVideoTitle(){var r;let e=null;const t=((r=this._SELECTORS.METADATA_SELECTORS)==null?void 0:r.TITLE)||["h1.ytd-watch-metadata","#title h1"];for(const i of t)if(e=document.querySelector(i),e&&e.textContent)break;return e?e.textContent.trim():"Unknown Video"}_extractCaptionText(){const e=this._SELECTORS.CAPTIONS_WINDOW||[".ytp-caption-window-bottom",".ytp-caption-window-top"];let t=[];for(const r of e){const i=document.querySelector(r);i&&i.style.display!=="none"&&i.querySelectorAll(".ytp-caption-segment").forEach(s=>{const o=s.textContent.trim();o&&t.push(o)})}return t.join(" ")}async _saveBookmark(e){const r=await window.YPP.StorageManager.get("ypp_bookmarks")||[];r.unshift(e),await window.YPP.StorageManager.set("ypp_bookmarks",r)}_showToast(e){this.utils.createToast&&this.utils.createToast(e)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.IntentionalDelay=class extends window.YPP.features.BaseFeature{constructor(){super("IntentionalDelay"),this._boundCheck=this._onPageChange.bind(this),this._overlay=null,this._activeVideoId=null,this._countdownInterval=null}getConfigKey(){return"intentionalDelay"}async enable(){var e;await super.enable(),this._onPageChange(),(e=window.YPP.events)==null||e.on("page:changed",this._boundCheck)}async disable(){var e;await super.disable(),this._removeOverlay(),(e=window.YPP.events)==null||e.off("page:changed",this._boundCheck)}_onPageChange(){var t;if(!((t=this.settings)!=null&&t.intentionalDelay)||!location.pathname.startsWith("/watch")||document.hidden)return;const e=new URL(location.href).searchParams.get("v");!e||this._activeVideoId===e||(this._activeVideoId=e,this._showOverlay())}_showOverlay(){var s;this._removeOverlay();const e=document.createElement("script");e.textContent=`
            try {
                const player = document.getElementById('movie_player');
                if (player && player.pauseVideo) player.pauseVideo();
            } catch(e) {}
        `,document.body.appendChild(e),e.remove();const t=((s=this.settings)==null?void 0:s.intentionalDelayTime)??3;this._overlay=document.createElement("div"),this._overlay.className="ypp-intentional-delay-overlay",this._overlay.innerHTML=`
            <div class="ypp-id-content">
                <h2>Take a breath.</h2>
                <p>Is this video intentional, or are you just scrolling?</p>
                <div class="ypp-id-timer">${t}</div>
                <button class="ypp-id-skip" style="display:none;">Proceed to Video</button>
            </div>
        `,document.body.appendChild(this._overlay);let r=t;const i=this._overlay.querySelector(".ypp-id-timer"),n=this._overlay.querySelector(".ypp-id-skip");this._countdownInterval=setInterval(()=>{document.hidden||(r--,r<=0?(clearInterval(this._countdownInterval),this._countdownInterval=null,i.style.display="none",n.style.display="block"):i.textContent=r)},1e3),this.addListener(n,"click",()=>{this._removeOverlay();const o=document.createElement("script");o.textContent=`
                try {
                    const player = document.getElementById('movie_player');
                    if (player && player.playVideo) player.playVideo();
                } catch(e) {}
            `,document.body.appendChild(o),o.remove()})}_removeOverlay(){this._countdownInterval&&(clearInterval(this._countdownInterval),this._countdownInterval=null),this._overlay&&(this._overlay.remove(),this._overlay=null)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ReturnDislike=class extends window.YPP.features.BaseFeature{constructor(){super("ReturnDislike"),this.isActive=!1,this.videoId=null,this.abortController=null,this.cache=new Map,this._cacheMax=50,this.currentDislikesData=null,this.buttonsElement=null,this.handleNavigation=this.handleNavigation.bind(this)}getConfigKey(){return"returnYouTubeDislike"}run(e){e.returnYouTubeDislike&&this.enable()}enable(){this.isActive||(this.isActive=!0,this.addListener(window,"yt-navigate-finish",this.handleNavigation),window.YPP.sharedObserver&&window.YPP.sharedObserver.register("return-dislike-buttons","#top-level-buttons-computed",e=>{this.buttonsElement=e[0],this.renderDislikes()},!1),this.isWatchPage()&&this.handleNavigation())}disable(){this.isActive&&(this.isActive=!1,window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("return-dislike-buttons"),this.buttonsElement=null,this.currentDislikesData=null,super.disable())}isWatchPage(){return location.pathname.startsWith("/watch")}handleNavigation(){if(!this.isActive||!this.isWatchPage())return;const e=new URLSearchParams(window.location.search).get("v");e&&e!==this.videoId&&(this.videoId=e,this.currentDislikesData=null,this.fetchDislikes(e))}async fetchDislikes(e){var r,i;if(this.abortController&&this.abortController.abort(),this.abortController=new AbortController,this.cache.has(e)){this.currentDislikesData=this.cache.get(e),this.renderDislikes();return}const t=`https://returnyoutubedislikeapi.com/votes?videoId=${e}`;try{const n=await new Promise(s=>{chrome.runtime.sendMessage({action:"FETCH_API",url:t},s)});if(this.abortController.signal.aborted)return;if(n&&n.status===200&&n.data){const s=n.data;this.cache.size>=this._cacheMax&&this.cache.delete(this.cache.keys().next().value),this.cache.set(e,s),this.videoId===e&&(this.currentDislikesData=s,this.renderDislikes())}else throw new Error((n==null?void 0:n.error)||"API Error")}catch(n){n.name!=="AbortError"&&!((r=n.message)!=null&&r.includes("Extension context invalidated"))&&((i=this.utils)==null||i.log(`Fetch error: ${n.message}`,"ReturnDislike","debug"))}}renderDislikes(){if(!this.isActive||!this.currentDislikesData||!this.buttonsElement)return;const e=this.currentDislikesData,t=this.buttonsElement;let r=t.querySelector("dislike-button-view-model, #segmented-dislike-button-renderer, #segmented-dislike-button");if(r||(r=t.querySelector("ytd-toggle-button-renderer:nth-child(2)")),!r){const a=t.querySelectorAll("ytd-toggle-button-renderer, button");a.length>=2&&(r=a[1])}if(!r)return;if(r.hasAttribute("data-ypp-processed-dislikes"))if(!r.querySelector(".ypp-dislike-text"))r.removeAttribute("data-ypp-processed-dislikes");else{const a=r.querySelector(".ypp-dislike-text");a.textContent=this.formatNumber(e.dislikes),a.title=e.dislikes.toLocaleString();return}r.setAttribute("data-ypp-processed-dislikes","true");let i=document.createElement("span");i.className="ypp-dislike-text",this.addStyle(`
            .ypp-dislike-text {
                margin-left: 6px;
                font-size: 14px;
                font-weight: 500;
                line-height: normal;
                opacity: 0.9;
                display: inline-flex;
                align-items: center;
            }
        `);const n=r.querySelector("button")||r.querySelector("a")||r,s=n.querySelector("yt-icon")||n.querySelector(".yt-spec-button-shape-next__icon");s&&s.parentNode?s.parentNode.insertBefore(i,s.nextSibling):n.appendChild(i);const o=this.formatNumber(e.dislikes);i.textContent=o,i.title=e.dislikes.toLocaleString(),r.title=`${e.dislikes.toLocaleString()} dislikes`}formatNumber(e){return e==null?"0":e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":e.toString()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.PremiumLogo=class extends window.YPP.features.BaseFeature{constructor(){super("PremiumLogo")}getConfigKey(){return"premiumLogo"}async enable(){await super.enable(),document.body.classList.add("ypp-premium-logo")}async disable(){await super.disable(),document.body.classList.remove("ypp-premium-logo")}};const si=`/* Blur for video player Settings panel */\r
.ytp-panel,\r
.ytp-popup.ytp-settings-menu {\r
  backdrop-filter: blur(5px) !important;\r
  -webkit-backdrop-filter: blur(25px) !important;\r
  background: var(--sf, rgba(0, 0, 0, 0.35)) !important;\r
}\r
/* === Dark mode (YouTube sets [dark] on <html>) === */\r
html[dark] {\r
  --blur: 10px;\r
  --sf: #00000022;\r
  --shadow-base:\r
    0 8px 32px #00000040, 1px 1px 1px #ffffff20 inset,\r
    -1px -1px 1px #ffffff10 inset;\r
  --shadow-hover:\r
    0 10px 36px #00000050, 1px 1px 0.5px #ffffff40 inset,\r
    -1px -1px 0.5px #ffffff20 inset;\r
  --shadow-active:\r
    0 4px 24px #00000030, 2px 2px 1px #ffffff20 inset,\r
    -2px -2px 1px #ffffff10 inset;\r
  --bounce: 0.35s cubic-bezier(0.3, 2, 0.5, 1);\r
  --bounce-alt: 0.75s cubic-bezier(0.2, 1.25, 0.2, 1);\r
}\r
html[dark] body {\r
  background-color: #202020 !important;\r
}\r
/* === Light mode — use white-tinted glass, dark shadows === */\r
html:not([dark]) {\r
  --blur: 10px;\r
  --sf: #ffffff55;\r
  --shadow-base:\r
    0 8px 32px #00000018, 1px 1px 1px #ffffff90 inset,\r
    -1px -1px 1px #ffffff60 inset;\r
  --shadow-hover:\r
    0 10px 36px #00000025, 1px 1px 0.5px #ffffffa0 inset,\r
    -1px -1px 0.5px #ffffff70 inset;\r
  --shadow-active:\r
    0 4px 24px #00000015, 2px 2px 1px #ffffff90 inset,\r
    -2px -2px 1px #ffffff60 inset;\r
  --bounce: 0.35s cubic-bezier(0.3, 2, 0.5, 1);\r
  --bounce-alt: 0.75s cubic-bezier(0.2, 1.25, 0.2, 1);\r
}\r
ytd-app,\r
ytd-masthead,\r
#page-manager.ytd-app,\r
#content.ytd-app {\r
  background: transparent !important;\r
}\r
#frosted-glass.with-chipbar.ytd-app {\r
  background: none !important;\r
  backdrop-filter: none !important;\r
}\r
* {\r
  font-family:\r
    "SF Pro Text", "Inter", "Segoe UI Variable Text", "Segoe UI", sans-serif !important;\r
  -webkit-tap-highlight-color: transparent;\r
  touch-action: manipulation;\r
}\r
.yt-spec-button-shape-next--mono .yt-spec-touch-feedback-shape__fill,\r
.yt-spec-button-shape-next--mono .yt-spec-touch-feedback-shape__stroke {\r
  display: none !important;\r
}\r
#masthead-container {\r
  background: transparent !important;\r
  background-color: transparent !important;\r
}\r
ytd-masthead #container {\r
  border-radius: 3000px !important;\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) !important;\r
  margin: 1px !important;\r
  box-shadow: var(--shadow-active) !important;\r
  border: none !important;\r
}\r
#description.ytd-watch-metadata,\r
#secondary-inner,\r
ytd-browse[page-subtype="home"] #chips:not(ytd-guide-renderer #sections) {\r
  position: relative !important;\r
  overflow: hidden !important;\r
  padding: 0 10px !important;\r
  margin: 16px 16px 0 0 !important;\r
  border-radius: 34px !important;\r
  background: var(--sf) !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition: box-shadow var(--bounce) !important;\r
}\r
ytd-guide-renderer #sections {\r
  margin-left: 8px !important;\r
}\r
ytd-browse[page-subtype="home"] #chips:not(ytd-guide-renderer #sections),\r
ytd-browse[page-subtype="home"] #chips {\r
  margin: 16px 0 0 0 !important;\r
  border-radius: 2000px !important;\r
  box-shadow: var(--shadow-active) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) !important;\r
  position: relative !important;\r
  overflow: hidden !important;\r
  padding: 0 10px !important;\r
  background: var(--sf) !important;\r
  border: none !important;\r
  transition: box-shadow var(--bounce) !important;\r
}\r
.yt-chip-shape {\r
  background-color: transparent !important;\r
}\r
#contents.ytd-page-manager {\r
  margin-top: 0;\r
  margin-left: 16px;\r
}\r
#guide-content.ytd-app {\r
  background: transparent;\r
}\r
#guide-wrapper.ytd-app {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  border-radius: calc(20px * 1.15) / 20px !important;\r
  border: 1px solid rgba(255, 255, 255, 0.06) !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition:\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer {\r
  background: transparent !important;\r
  backdrop-filter: none !important;\r
  box-shadow: none !important;\r
  border-radius: 300px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce),\r
    border-radius var(--bounce) !important;\r
}\r
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,\r
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus {\r
  background: var(--sf) !important;\r
  border-radius: 2000px !important;\r
  padding: 0px !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.05);\r
}\r
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active {\r
  transform: scale(0.98);\r
  box-shadow: var(--shadow-active) !important;\r
}\r
html[dark],\r
[dark] {\r
  --yt-spec-base-background: none !important;\r
}\r
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls {\r
  background: none !important;\r
  border: none !important;\r
  border-radius: 2000px !important;\r
  overflow: hidden !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
  color: white !important;\r
}\r
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls:hover {\r
  background: var(--sf) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.02);\r
}\r
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls:active {\r
  transform: scale(0.98);\r
  box-shadow: var(--shadow-active) !important;\r
}\r
.ytp-delhi-modern\r
  .ytp-chrome-controls\r
  .ytp-button:not(.ytp-right-controls .ytp-button, .ytp-volume-icon.ytp-button),\r
.ytp-delhi-modern .ytp-time-wrapper:not(.ytp-miniplayer-ui *),\r
.ytp-delhi-modern.ytp-delhi-horizontal-volume-controls\r
  .ytp-chrome-bottom.ytp-volume-slider-active\r
  .ytp-volume-area {\r
  background: none !important;\r
  border: none !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
  border-radius: 2000px !important;\r
}\r
.ytp-delhi-modern\r
  .ytp-chrome-controls\r
  .ytp-button:not(\r
    .ytp-right-controls .ytp-button,\r
    .ytp-volume-icon.ytp-button\r
  ):hover,\r
.ytp-delhi-modern .ytp-time-wrapper:not(.ytp-miniplayer-ui *):hover,\r
.ytp-delhi-modern.ytp-delhi-horizontal-volume-controls\r
  .ytp-chrome-bottom.ytp-volume-slider-active\r
  .ytp-volume-area:hover {\r
  transform: scale(1.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  background: var(--sf) !important;\r
}\r
.ytp-delhi-modern\r
  .ytp-chrome-controls\r
  .ytp-button:not(\r
    .ytp-right-controls .ytp-button,\r
    .ytp-volume-icon.ytp-button\r
  ):active,\r
.ytp-delhi-modern .ytp-time-wrapper:not(.ytp-miniplayer-ui *):active,\r
.ytp-delhi-modern.ytp-delhi-horizontal-volume-controls\r
  .ytp-chrome-bottom.ytp-volume-slider-active\r
  .ytp-volume-area:active {\r
  transform: scale(0.95);\r
  box-shadow: var(--shadow-active) !important;\r
}\r
.ytp-delhi-modern.ytp-delhi-horizontal-volume-controls .ytp-volume-area {\r
  background: none !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
.ytp-delhi-modern.ytp-delhi-horizontal-volume-controls .ytp-volume-area:hover {\r
  background: var(--sf) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.1);\r
}\r
.ytSearchboxComponentInputBoxDark,\r
.ytSearchboxComponentInputBox {\r
  background: none !important;\r
  border: none !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
  border-radius: 2000px !important;\r
  box-shadow: var(--shadow-base) !important;\r
}\r
.ytSearchboxComponentSearchButton {\r
  margin-left: 10px !important;\r
  border-radius: 2000px !important;\r
  border: none !important;\r
  background-color: transparent !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
.ytSearchboxComponentSearchButton:hover {\r
  background: rgba(255, 255, 255, 0.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.1);\r
}\r
.ytSearchboxComponentSearchButton:active {\r
  transform: scale(0.95);\r
  box-shadow: var(--shadow-active) !important;\r
}\r
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text,\r
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal,\r
ytd-notification-topbar-button-renderer.ytd-masthead,\r
yt-icon-button.ytd-masthead,\r
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text,\r
ytd-comment-view-model[optimal-reading-width-comments]\r
  #action-menu.ytd-comment-view-model,\r
tp-yt-paper-menu-button.yt-dropdown-menu::not(\r
    #trigger.tp-yt-paper-menu-button\r
  ) {\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text:hover,\r
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal:hover,\r
ytd-notification-topbar-button-renderer.ytd-masthead:hover,\r
yt-icon-button.ytd-masthead:hover,\r
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text:hover,\r
ytd-comment-view-model[optimal-reading-width-comments]\r
  #action-menu.ytd-comment-view-model:hover,\r
tp-yt-paper-menu-button.yt-dropdown-menu::not(\r
    #trigger.tp-yt-paper-menu-button\r
  ):hover {\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.1);\r
}\r
#voice-search-button.ytd-masthead,\r
ytd-topbar-menu-button-renderer.ytd-masthead,\r
#trailing-button.ytd-playlist-panel-renderer,\r
ytd-menu-renderer .ytd-menu-renderer[style-target="button"],\r
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {\r
  border-radius: 2000px !important;\r
  background-color: transparent !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
#voice-search-button.ytd-masthead:hover,\r
ytd-topbar-menu-button-renderer.ytd-masthead:hover,\r
#trailing-button.ytd-playlist-panel-renderer:hover,\r
ytd-menu-renderer .ytd-menu-renderer[style-target="button"]:hover,\r
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover {\r
  background: rgba(255, 255, 255, 0.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.1);\r
}\r
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
  position: relative;\r
  overflow: hidden;\r
  cursor: pointer !important;\r
}\r
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled:hover {\r
  transform: scale(1.1);\r
  color: white !important;\r
  animation: youtubeRedPulse 5s ease-in-out infinite;\r
}\r
@keyframes youtubeRedPulse {\r
  0% {\r
    box-shadow:\r
      inset 0 0 25px red,\r
      inset 0 0 50px red,\r
      0 0 15px red,\r
      0 0 30px red;\r
  }\r
  50% {\r
    box-shadow:\r
      inset 0 0 25px #f06,\r
      inset 0 0 50px #f06,\r
      0 0 15px #f06,\r
      0 0 30px #f06;\r
  }\r
  100% {\r
    box-shadow:\r
      inset 0 0 25px red,\r
      inset 0 0 50px red,\r
      0 0 15px red,\r
      0 0 30px red;\r
  }\r
}\r
ytd-playlist-panel-video-renderer[selected][use-color-palette],\r
ytd-playlist-panel-video-renderer[selected][use-color-palette]:hover:not(\r
    .dragging\r
  ) {\r
  border-radius: 30px !important;\r
  padding: 10px !important;\r
  box-shadow: var(--shadow-active) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-playlist-panel-video-renderer.ytd-playlist-panel-renderer {\r
  border-radius: 30px !important;\r
  padding: 10px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
  margin: 5px 0 !important;\r
}\r
ytd-playlist-panel-video-renderer.ytd-playlist-panel-renderer:hover {\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start:hover::after {\r
  background: none !important;\r
}\r
.header.ytd-playlist-panel-renderer {\r
  background: none !important;\r
}\r
#container.ytd-playlist-panel-renderer {\r
  border: none !important;\r
}\r
.ytSearchboxComponentSuggestionsContainer,\r
ytd-multi-page-menu-renderer {\r
  top: 55px !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  border-radius: 20px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
#items.yt-multi-page-menu-section-renderer\r
  > *.yt-multi-page-menu-section-renderer:not(\r
    [compact-link-style="compact-link-style-type-disclaimer"]\r
  ):not(ytd-message-renderer) {\r
  margin: 10px;\r
  border: none !important;\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
#items.yt-multi-page-menu-section-renderer\r
  > *.yt-multi-page-menu-section-renderer:not(\r
    [compact-link-style="compact-link-style-type-disclaimer"]\r
  ):not(ytd-message-renderer):hover {\r
  transform: scale(1.02);\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
.ytSuggestionComponentRoundedSuggestion {\r
  margin: 5px 10px;\r
  border: none !important;\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.ytSuggestionComponentRoundedSuggestion:hover {\r
  transform: scale(1.01) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-simple-menu-header-renderer {\r
  background: none !important;\r
}\r
.ytp-panel {\r
  background: var(--sf) !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition: box-shadow var(--bounce) !important;\r
  border-radius: 20px !important;\r
  padding: 0 5px !important;\r
}\r
.ytp-menuitem:not([aria-disabled="true"]) {\r
  margin-left: 100px !important;\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.ytp-menuitem:not([aria-disabled="true"]):hover {\r
  border-radius: 2000px !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  background-color: rgba(0, 0, 0, 0) !important;\r
}\r
.ytp-delhi-modern .ytp-popup {\r
  background: none !important;\r
  border-radius: 20px !important;\r
}\r
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text:hover {\r
  border: none !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition: box-shadow var(--bounce) !important;\r
}\r
.ytp-popup.ytp-delhi-modern-contextmenu {\r
  background: none !important;\r
  padding: 0 5px !important;\r
  border-radius: 20px !important;\r
  box-shadow: none !important;\r
  backdrop-filter: none !important;\r
}\r
.ytp-delhi-modern .ytp-chapter-container {\r
  width: 100% !important;\r
  padding-left: 10px;\r
}\r
ytd-app[frosted-glass-exp] tp-yt-app-drawer.ytd-app[persistent] {\r
  top: 75px !important;\r
  left: 8px !important;\r
}\r
tp-yt-app-drawer.ytd-app #contentContainer.tp-yt-app-drawer {\r
  background: transparent !important;\r
}\r
#sections.ytd-guide-renderer > *.ytd-guide-renderer:first-child {\r
  padding: 10px 3px !important;\r
}\r
ytd-guide-entry-renderer {\r
  border-radius: 2000px !important;\r
}\r
.ytSearchboxComponentDesktop .ytSearchboxComponentClearButton {\r
  margin-right: 10px;\r
  width: 30px !important;\r
  height: 30px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.ytSearchboxComponentDesktop .ytSearchboxComponentClearButton:hover {\r
  transform: scale(1.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-mini-guide-entry-renderer {\r
  margin-top: 10px !important;\r
  border-radius: 20px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-mini-guide-entry-renderer:hover {\r
  transform: scale(1.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-mini-guide-renderer.ytd-app {\r
  top: 70px !important;\r
  left: 10px !important;\r
}\r
.ytChipShapeChip {\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.ytChipShapeChip:hover {\r
  transform: scale(1.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search {\r
  margin: 5px auto !important;\r
}\r
iron-selector.yt-chip-cloud-renderer {\r
  padding-left: 5px !important;\r
}\r
ytd-expandable-metadata-renderer:not([is-expanded]) {\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-expandable-metadata-renderer:not([is-expanded]):hover {\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-expandable-metadata-renderer {\r
  padding: 5px !important;\r
  border-radius: 20px !important;\r
}\r
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text {\r
  margin-right: 0 !important;\r
  border-radius: 2000px !important;\r
  z-index: 30000 !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text:hover {\r
  transform: scale(1.04) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-macro-markers-list-item-renderer[modern][layout="MACRO_MARKERS_LIST_ITEM_RENDERER_LAYOUT_VERTICAL"]:not(\r
    [carousel-type="MACRO_MARKERS_LIST_ITEM_RENDERER_CAROUSEL_TYPE_TEXT_ONLY"]\r
  ) {\r
  border-radius: 10px !important;\r
  border: none !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-macro-markers-list-item-renderer[modern][layout="MACRO_MARKERS_LIST_ITEM_RENDERER_LAYOUT_VERTICAL"]:not(\r
    [carousel-type="MACRO_MARKERS_LIST_ITEM_RENDERER_CAROUSEL_TYPE_TEXT_ONLY"]\r
  ):hover {\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-expandable-metadata-renderer:not([is-expanded])\r
  #header.ytd-expandable-metadata-renderer:hover {\r
  background: none !important;\r
}\r
tp-yt-paper-dialog {\r
  background: var(--sf) !important;\r
  border-radius: 20px !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition: box-shadow var(--bounce) !important;\r
}\r
.ytLikeButtonViewModelHost {\r
  margin-right: 5px;\r
}\r
ytd-menu-popup-renderer,\r
ytd-video-preview,\r
#contentWrapper.tp-yt-iron-dropdown > *,\r
tp-yt-paper-dialog {\r
  background: var(--sf) !important;\r
  border-radius: 30px !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1)\r
    translate(\r
      var(--ytd-video-preview-translate-left),\r
      var(--ytd-video-preview-translate-top)\r
    );\r
  transition:\r
    opacity 0.2s ease-in,\r
    transform 0.16s ease-out 0.2s;\r
  max-height: 80vh !important;\r
  overflow-y: auto !important;\r
  max-width: none !important;\r
}\r
video.video-stream.html5-main-video,\r
.html5-video-player {\r
  border-radius: 20px !important;\r
}\r
#player-container.ytd-video-preview {\r
  background: none !important;\r
}\r
.ytPlayerProgressBarDragContainer {\r
  margin-left: 15px !important;\r
  margin-right: 15px !important;\r
  margin-bottom: 5px !important;\r
}\r
.ytProgressBarLineProgressBarLine,\r
.ytProgressBarLineProgressBarBackground,\r
.ytProgressBarLineProgressBarLoaded,\r
.ytProgressBarLineProgressBarHovered,\r
.ytProgressBarLineProgressBarPlayed,\r
.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment {\r
  border-radius: 20px !important;\r
}\r
.ytInlinePlayerControlsTopRightControlsCircleButton {\r
  background: var(--sf) !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
  cursor: pointer !important;\r
}\r
.ytInlinePlayerControlsTopRightControlsCircleButton:hover {\r
  transform: scale(1.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
.yt-badge-shape--thumbnail-default {\r
  background: var(--sf) !important;\r
  border-radius: 20px !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.anchored-panel.ytd-shorts {\r
  background: var(--sf) !important;\r
  padding: 5px;\r
  border: none !important;\r
  border-radius: 30px !important;\r
  box-shadow: var(--shadow-active) !important;\r
  margin-top: 15px !important;\r
}\r
ytd-engagement-panel-title-header-renderer[shorts-panel][enable-anchored-panel]\r
  #header.ytd-engagement-panel-title-header-renderer {\r
  border-bottom: none;\r
}\r
ytd-engagement-panel-section-list-renderer[match-content-theme]\r
  #content.ytd-engagement-panel-section-list-renderer {\r
  background: none !important;\r
}\r
ytd-comments-header-renderer[engagement-panel] {\r
  border-radius: 20px !important;\r
  margin: 10px !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-base) !important;\r
}\r
ytd-item-section-renderer[static-comments-header][enable-anchored-panel]\r
  #header.ytd-item-section-renderer {\r
  background: none !important;\r
}\r
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--filled,\r
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled {\r
  border: none;\r
  box-shadow: var(--shadow-active) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--filled:hover,\r
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled:hover {\r
  transform: scale(1.1) !important;\r
}\r
.tp-yt-paper-tooltip[style-target="tooltip"] {\r
  border: none !important;\r
  box-shadow: var(--shadow-active) !important;\r
  color: white !important;\r
}\r
tp-yt-paper-listbox {\r
  padding: 10px !important;\r
}\r
ytd-menu-service-item-renderer,\r
.yt-list-item-view-model__container--tappable,\r
tp-yt-paper-item.ytd-menu-service-item-download-renderer {\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-menu-service-item-renderer:hover,\r
.yt-list-item-view-model__container--tappable:hover,\r
tp-yt-paper-item.ytd-menu-service-item-download-renderer:hover {\r
  transform: scale(1.04) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-menu-service-item-renderer[use-list-item-styles]\r
  tp-yt-paper-item.ytd-menu-service-item-renderer,\r
.ytContextualSheetLayoutHost {\r
  background: none !important;\r
  padding: 13px !important;\r
}\r
.ytContextualSheetLayoutContentContainer,\r
.ytChipBarViewModelHost,\r
.immersive-header-content.ytd-playlist-header-renderer {\r
  overflow: visible !important;\r
}\r
.immersive-header-container.ytd-playlist-header-renderer {\r
  border: none !important;\r
  box-shadow: var(--shadow-active) !important;\r
}\r
ytd-alert-with-button-renderer[type="INFO"] {\r
  box-shadow: var(--shadow-base) !important;\r
  border-radius: 20px;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-playlist-video-renderer:not(.dragging) {\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
  margin: 5px;\r
  border-radius: 15px !important;\r
}\r
ytd-playlist-video-renderer:not(.dragging):hover {\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-thumbnail-overlay-toggle-button-renderer {\r
  background: var(--sf) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
  border-radius: 2000px !important;\r
}\r
ytd-thumbnail-overlay-toggle-button-renderer:hover {\r
  transform: scale(1.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-thumbnail-overlay-toggle-button-renderer[use-expandable-tooltip][hovered]\r
  #label.ytd-thumbnail-overlay-toggle-button-renderer {\r
  background-color: black !important;\r
  margin-right: 10px;\r
  border-radius: 10px !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-engagement-panel-section-list-renderer:not([live-chat-engagement-panel]) {\r
  border: none !important;\r
}\r
#subheader.ytd-engagement-panel-title-header-renderer:not(:empty) {\r
  border-radius: 200px !important;\r
  border: none !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
ytd-macro-markers-list-item-renderer {\r
  border-radius: 10px !important;\r
  margin: 5px;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-macro-markers-list-item-renderer:hover {\r
  transform: scale(1.02) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
#trigger.tp-yt-paper-menu-button {\r
  padding: 10px !important;\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
#trigger.tp-yt-paper-menu-button:hover {\r
  transform: scale(1.1) !important;\r
  background: var(--sf) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
html\r
  body[rounded-container]\r
  tp-yt-paper-tooltip\r
  .tp-yt-paper-tooltip[style-target="tooltip"] {\r
  border-radius: 20px !important;\r
  padding: 7px 10px;\r
}\r
ytd-topbar-logo-renderer {\r
  border-radius: 200px !important;\r
  padding: 0px !important;\r
  max-height: 45px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-topbar-logo-renderer:hover {\r
  transform: scale(1.02) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
/* mix-blend-mode: difference inverts on light backgrounds — scope to dark mode only */\r
html[dark] .ytSearchboxComponentInput {\r
  mix-blend-mode: difference;\r
}\r
html:not([dark]) .ytSearchboxComponentInput {\r
  mix-blend-mode: normal;\r
}\r
.ytp-delhi-modern .ytp-chrome-controls .ytp-right-controls .ytp-button::before {\r
  transition: background var(--bounce) !important;\r
}\r
.ytp-fullscreen-grid-expand-button {\r
  background: none !important;\r
  border: none !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
.ytp-fullscreen-grid-expand-button:hover {\r
  background: var(--sf) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
.ytPlayerQuickActionButtonsHost:not(:empty) {\r
  background-color: var(--sf) !important;\r
}\r
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text:hover {\r
  background: var(--sf) !important;\r
}\r
tp-yt-paper-listbox.yt-dropdown-menu {\r
  background: var(--sf) !important;\r
}\r
tp-yt-paper-listbox.yt-dropdown-menu tp-yt-paper-item.yt-dropdown-menu:hover {\r
  background: none !important;\r
}\r
tp-yt-paper-listbox.yt-dropdown-menu .iron-selected.yt-dropdown-menu {\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
a.yt-simple-endpoint.yt-dropdown-menu {\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
a.yt-simple-endpoint.yt-dropdown-menu:hover {\r
  transform: scale(1.05) !important;\r
  backdrop-filter: brightness(100%) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
.yt-spec-touch-feedback-shape--thumbnail-size-large\r
  .yt-spec-touch-feedback-shape__stroke,\r
.yt-spec-touch-feedback-shape--thumbnail-size-large\r
  .yt-spec-touch-feedback-shape__fill,\r
.yt-spec-touch-feedback-shape--thumbnail-size-large\r
  .yt-spec-touch-feedback-shape__hover-effect {\r
  padding: 100px !important;\r
  border-radius: 30px !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
#contents.ytd-rich-grid-renderer {\r
  margin-left: 30px !important;\r
  margin-right: 20px !important;\r
}\r
\r
/* SHORTS CAPSULE LOGIC */\r
ytd-rich-grid-slim-media {\r
  z-index: 1 !important;\r
}\r
ytd-rich-grid-slim-media:hover {\r
  z-index: 2000 !important;\r
}\r
ytd-rich-grid-slim-media #dismissible,\r
ytd-reel-item-renderer #dismissible {\r
  transition: all var(--bounce) !important;\r
  border-radius: 15px !important;\r
  border: 2px solid transparent !important;\r
}\r
ytd-rich-grid-slim-media:hover #dismissible,\r
ytd-reel-item-renderer:hover #dismissible {\r
  border-radius: 30px !important;\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(10px) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.05) !important;\r
  padding-bottom: 12px !important;\r
  margin-bottom: -12px !important;\r
}\r
\r
/* --- AMBIENT TOGGLE LOGIC --- */\r
body.yt-pro-ambient #cinematics.ytd-watch-flexy {\r
  filter: saturate(250%) blur(10px) contrast(1.1) brightness(1.3);\r
  transform: scale(3);\r
  opacity: 1;\r
  mix-blend-mode: lighten;\r
}\r
body.yt-pro-ambient {\r
  overflow-x: hidden !important;\r
}\r
body.yt-pro-ambient .style-scope.ytd-watch-flexy#player-container-inner {\r
  overflow: hidden;\r
  border-radius: 20px;\r
  box-shadow:\r
    0px 16px 32px #00000054,\r
    0px 0px 4px #00000038;\r
}\r
@media (width: 1920px) {\r
  body.yt-pro-ambient #cinematics.ytd-watch-flexy {\r
    transform: scaleX(1.8) scaleY(1.7) translateX(130px) translateY(100px);\r
  }\r
}\r
@media (width: 1280px) {\r
  body.yt-pro-ambient #cinematics.ytd-watch-flexy {\r
    transform: scaleX(2) scaleY(2.1) translateX(190px) translateY(100px) !important;\r
  }\r
}\r
\r
/* --- PREMIUM LOGO LOGIC --- */\r
body.yt-pro-premium ytd-topbar-logo-renderer {\r
  margin-left: 16px !important;\r
  display: flex !important;\r
  align-items: center !important;\r
}\r
body.yt-pro-premium ytd-topbar-logo-renderer a#logo {\r
  display: flex !important;\r
  align-items: center !important;\r
  text-decoration: none !important;\r
}\r
body.yt-pro-premium ytd-topbar-logo-renderer a#logo > * {\r
  display: none !important;\r
}\r
body.yt-pro-premium ytd-topbar-logo-renderer a#logo::before {\r
  content: "";\r
  display: block !important;\r
  width: 34px !important;\r
  height: 24px !important;\r
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNzAiPjxwYXRoIGZpbGw9IiNGRjAwMDAiIGQ9Ik05Ny43LDExQzk2LjUsNi42LDkzLDMuMSw4OC42LDJDODAuOCwwLDUwLDAsNTAsMFMxOS4yLDAsMTEuNCwyQzcsMy4xLDMuNSw2LjYsMi4zLDExQzAsMTguOCwwLDM1LDAsMzVzMCwxNi4yLDIuMywyNGMxLjIsNC40LDQuNyw3LjksOS4xLDlDMTkuMiw3MCw1MCw3MCw1MCw3MHMzMC44LDAsMzguNi0yYzQuNC0xLjIsNy45LTQuNyw5LjEtOUMxMDAsNTEuMiwxMDAsMzUsMTAwLDM1UzEwMCwxOC44LDk3LjcsMTF6Ii8+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTQwLDUwbDI2LTE1TDQwLDIwVjUweiIvPjwvc3ZnPg==") !important;\r
  background-size: contain !important;\r
  background-repeat: no-repeat !important;\r
  background-position: center !important;\r
  margin-right: 2px !important;\r
}\r
body.yt-pro-premium ytd-topbar-logo-renderer a#logo::after {\r
  content: "Premium";\r
  display: block !important;\r
  font-family:\r
    "YouTube Sans", "Roboto", "Segoe UI", Arial, sans-serif !important;\r
  font-size: 22px !important;\r
  font-weight: 500 !important;\r
  color: #ffffff !important;\r
  margin-left: 2px !important;\r
  letter-spacing: -0.5px !important;\r
  line-height: 22px !important;\r
}\r
body.yt-pro-premium ytd-topbar-logo-renderer #country-code {\r
  position: relative !important;\r
  display: block !important;\r
  margin-left: 2px !important;\r
  top: -8px !important;\r
  color: #aaaaaa !important;\r
  font-size: 11px !important;\r
  font-family: "Roboto", sans-serif !important;\r
  font-weight: 500 !important;\r
}\r
/* ============================================================\r
   YOUTUBE CLASSNAME RENAME FIX (kebab-case → camelCase 2025+)\r
   YouTube renamed all yt-spec-button-shape-next--* classes.\r
   These rules mirror every button rule above for the new names.\r
   ============================================================ */\r
\r
/* --- HAMBURGER / GUIDE BUTTON --- */\r
yt-icon-button#guide-button {\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
yt-icon-button#guide-button:hover {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.1);\r
}\r
yt-icon-button#guide-button:active {\r
  transform: scale(0.95) !important;\r
  box-shadow: var(--shadow-active) !important;\r
}\r
\r
/* --- CREATE BUTTON (masthead) --- */\r
#buttons.ytd-masthead ytd-button-renderer yt-button-shape button {\r
  border-radius: 2000px !important;\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
#buttons.ytd-masthead ytd-button-renderer yt-button-shape button:hover {\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.06);\r
}\r
#buttons.ytd-masthead ytd-button-renderer yt-button-shape button:active {\r
  transform: scale(0.97) !important;\r
  box-shadow: var(--shadow-active) !important;\r
}\r
\r
/* --- NOTIFICATION BELL --- */\r
ytd-notification-topbar-button-renderer.ytd-masthead yt-icon-button#icon {\r
  border-radius: 2000px !important;\r
  padding: 4px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
ytd-notification-topbar-button-renderer.ytd-masthead yt-icon-button#icon:hover {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.1);\r
}\r
\r
/* --- SUBSCRIBE BUTTON — red glow on hover (camelCase) --- */\r
ytd-subscribe-button-renderer button.ytSpecButtonShapeNextTonal {\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
  position: relative;\r
  overflow: hidden;\r
  cursor: pointer !important;\r
}\r
ytd-subscribe-button-renderer button.ytSpecButtonShapeNextTonal:hover {\r
  transform: scale(1.08) !important;\r
  color: white !important;\r
  box-shadow:\r
    inset 0 0 25px red,\r
    inset 0 0 50px red,\r
    0 0 15px red,\r
    0 0 30px red !important;\r
  animation: youtubeRedPulse 5s ease-in-out infinite !important;\r
}\r
\r
/* --- ALL TONAL BUTTONS: Share / Ask / Save / Download / Subscribe\r
       Exclude segmented start/end — those are handled below.  --- */\r
button.ytSpecButtonShapeNextTonal:not(.ytSpecButtonShapeNextSegmentedStart):not(\r
    .ytSpecButtonShapeNextSegmentedEnd\r
  ) {\r
  border-radius: 2000px !important;\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
button.ytSpecButtonShapeNextTonal:not(.ytSpecButtonShapeNextSegmentedStart):not(\r
    .ytSpecButtonShapeNextSegmentedEnd\r
  ):hover {\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.06);\r
}\r
button.ytSpecButtonShapeNextTonal:not(.ytSpecButtonShapeNextSegmentedStart):not(\r
    .ytSpecButtonShapeNextSegmentedEnd\r
  ):active {\r
  transform: scale(0.97) !important;\r
  box-shadow: var(--shadow-active) !important;\r
}\r
\r
/* --- LIKE / DISLIKE — two separate glass capsules, not joined --- */\r
.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper {\r
  display: flex !important;\r
  gap: 6px !important;\r
  background: none !important;\r
  backdrop-filter: none !important;\r
  -webkit-backdrop-filter: none !important;\r
  box-shadow: none !important;\r
  overflow: visible !important;\r
}\r
.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper\r
  button.ytSpecButtonShapeNextSegmentedStart,\r
.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper\r
  button.ytSpecButtonShapeNextSegmentedEnd {\r
  border-radius: 2000px !important;\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) !important;\r
  box-shadow: var(--shadow-base) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper\r
  button.ytSpecButtonShapeNextSegmentedStart:hover,\r
.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper\r
  button.ytSpecButtonShapeNextSegmentedEnd:hover {\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.06);\r
}\r
.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper\r
  button.ytSpecButtonShapeNextSegmentedStart:active,\r
.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper\r
  button.ytSpecButtonShapeNextSegmentedEnd:active {\r
  transform: scale(0.97) !important;\r
  box-shadow: var(--shadow-active) !important;\r
}\r
\r
/* --- TEXT / MONO BUTTONS (camelCase) --- */\r
button.ytSpecButtonShapeNextText {\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
button.ytSpecButtonShapeNextText:hover {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.05);\r
}\r
button.ytSpecButtonShapeNextText:active {\r
  transform: scale(0.97) !important;\r
  box-shadow: var(--shadow-active) !important;\r
}\r
\r
/* --- MIX PLAYLIST SIDEBAR — glass background, not black --- */\r
ytd-playlist-panel-renderer {\r
  background: rgba(14, 14, 18, 0.55) !important;\r
  backdrop-filter: blur(20px) saturate(160%) !important;\r
  -webkit-backdrop-filter: blur(20px) saturate(160%) !important;\r
}\r
#secondary-inner ytd-playlist-panel-renderer {\r
  border-radius: 20px !important;\r
}\r
\r
/* --- NOTIFICATION PANEL / YOU+SUBSCRIPTIONS POPUP — glass --- */\r
html[dark] .ytSearchboxComponentSuggestionsContainer,\r
html[dark] ytd-multi-page-menu-renderer {\r
  background: rgba(14, 14, 18, 0.6) !important;\r
  backdrop-filter: blur(28px) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(28px) saturate(180%) !important;\r
  border: 1px solid rgba(255, 255, 255, 0.07) !important;\r
}\r
html:not([dark]) ytd-multi-page-menu-renderer {\r
  background: rgba(255, 255, 255, 0.88) !important;\r
  backdrop-filter: blur(28px) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(28px) saturate(180%) !important;\r
  border: 1px solid rgba(0, 0, 0, 0.08) !important;\r
}\r
\r
/* --- SEARCH SUGGESTIONS — frosted glass, mode-aware --- */\r
/* Dark mode: deep dark glass */\r
html[dark] .ytSearchboxComponentSuggestionsContainer {\r
  background: rgba(10, 10, 14, 0.92) !important;\r
  backdrop-filter: blur(32px) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(32px) saturate(180%) !important;\r
  border-radius: 20px !important;\r
  border: 1px solid rgba(255, 255, 255, 0.09) !important;\r
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.7) !important;\r
}\r
/* Light mode: bright frosted glass so dark suggestion text stays readable */\r
html:not([dark]) .ytSearchboxComponentSuggestionsContainer {\r
  background: rgba(255, 255, 255, 0.94) !important;\r
  backdrop-filter: blur(32px) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(32px) saturate(180%) !important;\r
  border-radius: 20px !important;\r
  border: 1px solid rgba(0, 0, 0, 0.08) !important;\r
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18) !important;\r
}\r
\r
/* Suggestion text — force correct colour per mode */\r
html[dark] .ytSearchboxComponentSuggestionsContainer,\r
html[dark] .ytSearchboxComponentSuggestionsContainer * {\r
  color: #ffffff !important;\r
}\r
html:not([dark]) .ytSearchboxComponentSuggestionsContainer,\r
html:not([dark]) .ytSearchboxComponentSuggestionsContainer * {\r
  color: #0f0f0f !important;\r
}\r
\r
/* Suggestion row hover — mode-aware tint */\r
html[dark] .ytSuggestionComponentRoundedSuggestion:hover {\r
  background: rgba(255, 255, 255, 0.08) !important;\r
}\r
html:not([dark]) .ytSuggestionComponentRoundedSuggestion:hover {\r
  background: rgba(0, 0, 0, 0.06) !important;\r
  box-shadow: none !important;\r
}\r
\r
/* --- VIDEO CARD 3-DOT — always visible, no scale (avoids clip) --- */\r
.ytLockupMetadataViewModelMenuButton {\r
  overflow: visible !important;\r
}\r
.ytLockupMetadataViewModelMenuButton button-view-model,\r
.ytLockupMetadataViewModelMenuButton button {\r
  opacity: 1 !important;\r
  visibility: visible !important;\r
  border-radius: 2000px !important;\r
  transition:\r
    background var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
.ytLockupMetadataViewModelMenuButton button:hover {\r
  background: rgba(255, 255, 255, 0.14) !important;\r
  box-shadow:\r
    0 2px 12px rgba(0, 0, 0, 0.5),\r
    0 0 0 1px rgba(255, 255, 255, 0.12) !important;\r
  transform: none !important;\r
  backdrop-filter: none !important;\r
}\r
/* Suppress yt-interaction fill which causes flash */\r
.ytLockupMetadataViewModelMenuButton yt-interaction .fill,\r
.ytLockupMetadataViewModelMenuButton .ytSpecTouchFeedbackShapeFill {\r
  background: transparent !important;\r
  opacity: 0 !important;\r
}\r
\r
/* --- COMMENT BUTTONS — no scale/backdrop (flash fix) --- */\r
ytd-comment-view-model button,\r
ytd-comment-renderer button {\r
  border-radius: 2000px !important;\r
  transition:\r
    background 0.15s ease,\r
    box-shadow 0.15s ease !important;\r
  transform: none !important;\r
  backdrop-filter: none !important;\r
  -webkit-backdrop-filter: none !important;\r
}\r
ytd-comment-view-model button:hover,\r
ytd-comment-renderer button:hover {\r
  background: rgba(255, 255, 255, 0.12) !important;\r
  box-shadow:\r
    0 2px 10px rgba(0, 0, 0, 0.4),\r
    0 0 0 1px rgba(255, 255, 255, 0.08) !important;\r
  transform: none !important;\r
}\r
ytd-comment-view-model yt-interaction .fill,\r
ytd-comment-renderer yt-interaction .fill {\r
  background: transparent !important;\r
  opacity: 0 !important;\r
}\r
\r
/* ============================================================\r
   YOUTUBE PRO PLUS - EXTENSION UI GLASSMORPHISM OVERRIDES\r
   ============================================================ */\r
\r
/* --- Global Player Bar --- */\r
#ypp-global-player-bar,\r
.ypp-global-bar {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;\r
  box-shadow: var(--shadow-base) !important;\r
}\r
\r
.ypp-gpb-btn,\r
.ypp-action-btn,\r
.ypp-icon-btn {\r
  border-radius: 2000px !important;\r
  background: transparent !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
\r
.ypp-gpb-btn:hover,\r
.ypp-action-btn:hover,\r
.ypp-icon-btn:hover {\r
  background: var(--sf) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.1) !important;\r
}\r
\r
.ypp-gpb-btn:active,\r
.ypp-action-btn:active,\r
.ypp-icon-btn:active {\r
  transform: scale(0.95) !important;\r
  box-shadow: var(--shadow-active) !important;\r
}\r
\r
/* --- Video Controls Panel --- */\r
.ypp-video-controls,\r
.ypp-shadow-panel {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  border: 1px solid rgba(255, 255, 255, 0.08) !important;\r
  box-shadow: var(--shadow-base) !important;\r
  border-radius: 24px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
\r
.ypp-vcp-header,\r
.ypp-folder-header {\r
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;\r
  background: transparent !important;\r
}\r
\r
.ypp-slider,\r
.ypp-gpb-vol-slider {\r
  accent-color: #ff4e45 !important;\r
  background: rgba(255, 255, 255, 0.1) !important;\r
  border-radius: 2000px !important;\r
}\r
\r
.ypp-badge,\r
.ypp-value-display {\r
  background: rgba(255, 255, 255, 0.1) !important;\r
  backdrop-filter: blur(10px) !important;\r
  border-radius: 20px !important;\r
  border: 1px solid rgba(255, 255, 255, 0.05) !important;\r
}\r
\r
/* --- Subscriptions Sidebar / Modals --- */\r
.ypp-organizer-modal,\r
.ypp-modal-content {\r
  background: rgba(10, 10, 15, 0.65) !important;\r
  backdrop-filter: blur(32px) saturate(200%) !important;\r
  -webkit-backdrop-filter: blur(32px) saturate(200%) !important;\r
  border: 1px solid rgba(255, 255, 255, 0.1) !important;\r
  border-radius: 32px !important;\r
  box-shadow:\r
    0 20px 60px rgba(0, 0, 0, 0.5),\r
    inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;\r
}\r
\r
.ypp-modal-header {\r
  background: rgba(255, 255, 255, 0.03) !important;\r
  border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;\r
  box-shadow: none !important;\r
}\r
\r
.ypp-btn-primary,\r
.ypp-play-all-btn,\r
.ypp-health-btn {\r
  border-radius: 2000px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
\r
.ypp-btn-primary:hover,\r
.ypp-play-all-btn:hover,\r
.ypp-health-btn:hover {\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.05) !important;\r
}\r
\r
.ypp-btn-primary:active,\r
.ypp-play-all-btn:active,\r
.ypp-health-btn:active {\r
  transform: scale(0.95) !important;\r
  box-shadow: var(--shadow-active) !important;\r
}\r
\r
/* --- Account Menu / Topbar --- */\r
.ypp-account-menu,\r
#ypp-top-bar {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  border: 1px solid rgba(255, 255, 255, 0.08) !important;\r
  box-shadow: var(--shadow-base) !important;\r
}\r
\r
.ypp-pill-toggle {\r
  border-radius: 2000px !important;\r
  background: rgba(255, 255, 255, 0.1) !important;\r
  backdrop-filter: blur(10px) !important;\r
  border: 1px solid rgba(255, 255, 255, 0.05) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
\r
.ypp-pill-toggle:hover {\r
  background: rgba(255, 255, 255, 0.2) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  transform: scale(1.05) !important;\r
}\r
\r
.ypp-filter-dropdown {\r
  background: rgba(255, 255, 255, 0.05) !important;\r
  border-radius: 20px !important;\r
  border: 1px solid rgba(255, 255, 255, 0.1) !important;\r
  backdrop-filter: blur(10px) !important;\r
  color: white !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
\r
.ypp-filter-dropdown:hover {\r
  background: rgba(255, 255, 255, 0.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
\r
/* ============================================================\r
   ADVANCED GLASSMORPHISM - ALL PAGES & ELEMENTS EXPANSION\r
   ============================================================ */\r
\r
/* --- CHANNEL PAGES --- */\r
ytd-c4-tabbed-header-renderer {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  border-radius: 0 0 34px 34px !important;\r
  box-shadow: var(--shadow-base) !important;\r
  margin-bottom: 20px !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
  border-top: none !important;\r
}\r
#wrapper.ytd-channel-avatar-editor {\r
  border-radius: 2000px !important;\r
  box-shadow: var(--shadow-hover) !important;\r
}\r
tp-yt-app-header {\r
  background: transparent !important;\r
}\r
#tabs-inner-container.ytd-c4-tabbed-header-renderer {\r
  background: transparent !important;\r
}\r
.tab-content.tp-yt-paper-tab {\r
  transition:\r
    transform var(--bounce),\r
    background var(--bounce) !important;\r
  border-radius: 20px !important;\r
}\r
.tab-content.tp-yt-paper-tab:hover {\r
  background: rgba(128, 128, 128, 0.1) !important;\r
  transform: scale(1.05) !important;\r
}\r
\r
/* --- COMMENTS SECTION --- */\r
ytd-comment-thread-renderer,\r
ytd-comment-view-model {\r
  background: rgba(128, 128, 128, 0.05) !important;\r
  backdrop-filter: blur(10px) !important;\r
  -webkit-backdrop-filter: blur(10px) !important;\r
  border-radius: 24px !important;\r
  padding: 15px !important;\r
  margin-bottom: 15px !important;\r
  box-shadow: var(--shadow-base) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.08) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
ytd-comment-thread-renderer:hover,\r
ytd-comment-view-model:hover {\r
  box-shadow: var(--shadow-hover) !important;\r
  background: rgba(128, 128, 128, 0.09) !important;\r
}\r
ytd-comment-simplebox-renderer {\r
  background: rgba(128, 128, 128, 0.08) !important;\r
  backdrop-filter: blur(15px) !important;\r
  border-radius: 24px !important;\r
  padding: 15px !important;\r
  box-shadow: var(--shadow-active) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
}\r
#placeholder-area.ytd-comment-simplebox-renderer {\r
  border: none !important;\r
}\r
\r
/* --- SEARCH RESULTS & FILTERS --- */\r
ytd-search-filter-group-renderer {\r
  background: rgba(128, 128, 128, 0.05) !important;\r
  backdrop-filter: blur(var(--blur)) !important;\r
  border-radius: 24px !important;\r
  padding: 15px !important;\r
  box-shadow: var(--shadow-base) !important;\r
  margin-bottom: 10px !important;\r
}\r
ytd-video-renderer,\r
ytd-channel-renderer,\r
ytd-playlist-renderer,\r
ytd-radio-renderer {\r
  background: rgba(128, 128, 128, 0.05) !important;\r
  backdrop-filter: blur(8px) !important;\r
  -webkit-backdrop-filter: blur(8px) !important;\r
  border-radius: 24px !important;\r
  padding: 15px !important;\r
  margin-bottom: 15px !important;\r
  box-shadow: var(--shadow-base) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.05) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce) !important;\r
}\r
ytd-video-renderer:hover,\r
ytd-channel-renderer:hover,\r
ytd-playlist-renderer:hover,\r
ytd-radio-renderer:hover {\r
  transform: scale(1.02) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  background: rgba(128, 128, 128, 0.09) !important;\r
}\r
\r
/* --- YOUTUBE SETTINGS PAGE --- */\r
ytd-settings-sidebar-renderer {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  border-radius: 24px !important;\r
  box-shadow: var(--shadow-base) !important;\r
  padding: 15px !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
}\r
ytd-settings-options-renderer,\r
ytd-account-settings-renderer {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  border-radius: 24px !important;\r
  box-shadow: var(--shadow-base) !important;\r
  padding: 25px !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
}\r
\r
/* --- LIVE CHAT --- */\r
yt-live-chat-app,\r
yt-live-chat-renderer {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(var(--blur)) saturate(180%) !important;\r
  border-radius: 24px !important;\r
  box-shadow: var(--shadow-base) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
  overflow: hidden !important;\r
}\r
yt-live-chat-text-message-renderer,\r
yt-live-chat-paid-message-renderer,\r
yt-live-chat-membership-item-renderer {\r
  background: rgba(128, 128, 128, 0.05) !important;\r
  border-radius: 12px !important;\r
  margin: 4px 8px !important;\r
  padding: 8px !important;\r
  transition:\r
    transform 0.2s,\r
    background 0.2s !important;\r
}\r
yt-live-chat-text-message-renderer:hover {\r
  background: rgba(128, 128, 128, 0.12) !important;\r
  transform: scale(1.02) !important;\r
}\r
#ticker.yt-live-chat-renderer {\r
  background: rgba(128, 128, 128, 0.1) !important;\r
  backdrop-filter: blur(10px) !important;\r
}\r
#message-input.yt-live-chat-text-input-field-renderer {\r
  background: rgba(128, 128, 128, 0.1) !important;\r
  border-radius: 2000px !important;\r
  padding: 5px 15px !important;\r
}\r
\r
/* --- SHORTS PLAYER ENHANCEMENTS --- */\r
ytd-reel-video-renderer {\r
  background: rgba(128, 128, 128, 0.05) !important;\r
  backdrop-filter: blur(15px) saturate(180%) !important;\r
  border-radius: 34px !important;\r
  box-shadow: var(--shadow-base) !important;\r
  overflow: hidden !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
}\r
.overlay-dir.ytd-reel-video-renderer {\r
  background: linear-gradient(\r
    to top,\r
    rgba(0, 0, 0, 0.6) 0%,\r
    transparent 40%\r
  ) !important;\r
}\r
ytd-reel-player-overlay-renderer {\r
  border-radius: 34px !important;\r
}\r
\r
/* --- SHARE PANEL & MODALS --- */\r
ytd-unified-share-panel-renderer,\r
ytd-add-to-playlist-renderer {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(30px) saturate(200%) !important;\r
  -webkit-backdrop-filter: blur(30px) saturate(200%) !important;\r
  border-radius: 34px !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
}\r
\r
/* --- TOAST NOTIFICATIONS --- */\r
tp-yt-paper-toast {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(25px) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(25px) saturate(180%) !important;\r
  border-radius: 2000px !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
}\r
\r
/* ============================================================\r
   EXTENSION CUSTOM POPUPS (EQ, FILTERS, PLAYER BAR)\r
   ============================================================ */\r
\r
/* Volume Booster EQ Panel & Cinema Filters Panel */\r
#ypp-eq-panel,\r
#ypp-cinema-panel {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(45px) saturate(200%) !important;\r
  -webkit-backdrop-filter: blur(45px) saturate(200%) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.15) !important;\r
  border-top: 1px solid rgba(128, 128, 128, 0.25) !important;\r
  box-shadow:\r
    var(--shadow-hover),\r
    0 24px 64px rgba(0, 0, 0, 0.6) !important;\r
  border-radius: 24px !important;\r
}\r
\r
/* EQ & Filter Header/Footer Bars */\r
.ypp-eq-header,\r
.ypp-eq-footer,\r
.ypp-intensity-section,\r
.ypp-adjust-card-header,\r
#ypp-cinema-panel > div:first-child, /* Header */\r
#ypp-cinema-panel > div:last-child  /* Footer */ {\r
  background: transparent !important;\r
  border-bottom-color: rgba(128, 128, 128, 0.1) !important;\r
  border-top-color: rgba(128, 128, 128, 0.1) !important;\r
}\r
\r
/* Global Player Bar - Extreme Glass */\r
.ypp-global-player-bar,\r
#ypp-global-player-bar {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(35px) saturate(200%) !important;\r
  -webkit-backdrop-filter: blur(35px) saturate(200%) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
  box-shadow:\r
    var(--shadow-hover),\r
    0 10px 40px rgba(0, 0, 0, 0.4) !important;\r
}\r
\r
/* Sub-Cards / Adjustment Cards in Popups */\r
.ypp-adjust-card,\r
.ypp-filter-card {\r
  background: rgba(128, 128, 128, 0.06) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
  border-radius: 12px !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
\r
.ypp-adjust-card:hover,\r
.ypp-filter-card:hover {\r
  background: rgba(128, 128, 128, 0.1) !important;\r
  box-shadow: var(--shadow-base) !important;\r
  border-color: rgba(128, 128, 128, 0.2) !important;\r
}\r
\r
/* Sliders */\r
.ypp-eq-hslider,\r
.ypp-vcp-slider,\r
.ypp-eq-vslider {\r
  background: rgba(128, 128, 128, 0.15) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.05) !important;\r
}\r
\r
/* Preset Buttons */\r
.ypp-eq-preset-btn,\r
.ypp-cinema-tab-btn,\r
.ypp-vcp-compare-toggle {\r
  background: rgba(128, 128, 128, 0.05) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
  backdrop-filter: blur(10px) !important;\r
  transition:\r
    transform var(--bounce),\r
    background var(--bounce) !important;\r
}\r
\r
.ypp-eq-preset-btn:hover,\r
.ypp-cinema-tab-btn:hover,\r
.ypp-vcp-compare-toggle:hover {\r
  background: rgba(128, 128, 128, 0.15) !important;\r
  transform: scale(1.05) !important;\r
}\r
\r
/* EQ Canvas (Visualizer) */\r
.ypp-eq-canvas {\r
  background: rgba(128, 128, 128, 0.03) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.08) !important;\r
  border-radius: 12px !important;\r
}\r
\r
/* ============================================================\r
   PLAYLIST REDESIGN (Liquid Glass Overrides)\r
   ============================================================ */\r
\r
/* Playlist Sidebar / Ambient Container */\r
#ypp-pl-root .ypp-pl-sidebar {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(35px) saturate(200%) !important;\r
  -webkit-backdrop-filter: blur(35px) saturate(200%) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
  border-top: 1px solid rgba(128, 128, 128, 0.2) !important;\r
  box-shadow: var(--shadow-base) !important;\r
}\r
\r
/* Playlist Toolbar (Filter, Columns) */\r
#ypp-pl-root .ypp-pl-toolbar {\r
  background: var(--sf) !important;\r
  backdrop-filter: blur(25px) saturate(180%) !important;\r
  -webkit-backdrop-filter: blur(25px) saturate(180%) !important;\r
  border-bottom: 1px solid rgba(128, 128, 128, 0.1) !important;\r
}\r
\r
/* Playlist Video Cards */\r
#ypp-pl-root .ypp-pl-card {\r
  background: rgba(128, 128, 128, 0.05) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.08) !important;\r
  transition:\r
    transform var(--bounce),\r
    box-shadow var(--bounce),\r
    background var(--bounce) !important;\r
}\r
\r
#ypp-pl-root .ypp-pl-card:hover {\r
  background: rgba(128, 128, 128, 0.1) !important;\r
  box-shadow: var(--shadow-hover) !important;\r
  border-color: rgba(128, 128, 128, 0.15) !important;\r
}\r
\r
/* 1-Column List View (Remove borders & backgrounds for cards) */\r
#ypp-pl-root .ypp-pl-cols-1 .ypp-pl-card {\r
  background: transparent !important;\r
  border: none !important;\r
  box-shadow: none !important;\r
}\r
\r
#ypp-pl-root .ypp-pl-cols-1 .ypp-pl-card:hover {\r
  background: rgba(128, 128, 128, 0.08) !important;\r
  transform: none !important;\r
}\r
\r
/* Playlist Buttons & Controls */\r
#ypp-pl-root .ypp-pl-btn-play,\r
#ypp-pl-root .ypp-pl-btn-shuffle,\r
#ypp-pl-root .ypp-pl-btn-tool,\r
#ypp-pl-root .ypp-pl-filter,\r
#ypp-pl-root .ypp-pl-col-switcher {\r
  background: rgba(128, 128, 128, 0.08) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
  backdrop-filter: blur(10px) !important;\r
  transition:\r
    transform var(--bounce),\r
    background var(--bounce) !important;\r
}\r
\r
#ypp-pl-root .ypp-pl-btn-play:hover,\r
#ypp-pl-root .ypp-pl-btn-shuffle:hover,\r
#ypp-pl-root .ypp-pl-btn-tool:hover {\r
  background: rgba(128, 128, 128, 0.15) !important;\r
  transform: scale(1.02) !important;\r
}\r
\r
/* Duration Info Card */\r
#ypp-pl-root .ypp-pl-duration-card {\r
  background: rgba(128, 128, 128, 0.05) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.1) !important;\r
  box-shadow: inset 0 2px 15px rgba(0, 0, 0, 0.2) !important;\r
}\r
\r
#ypp-pl-root .ypp-pl-duration-grid {\r
  background: rgba(0, 0, 0, 0.3) !important;\r
  border: 1px solid rgba(128, 128, 128, 0.05) !important;\r
}\r
`;window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.LiquidGlassTheme=class extends window.YPP.features.BaseFeature{constructor(){super("LiquidGlassTheme"),this._styleId="ypp-liquid-glass-style"}getConfigKey(){return"liquidGlassTheme"}enable(){this._injectStyles()}disable(){this._removeStyles()}onUpdate(){this.settings[this.getConfigKey()]?this.enable():this.disable()}_injectStyles(){if(document.getElementById(this._styleId))return;const e=document.createElement("style");e.id=this._styleId,e.textContent=si,document.head.appendChild(e)}_removeStyles(){const e=document.getElementById(this._styleId);e&&e.remove()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SmartDownload=class extends window.YPP.features.BaseFeature{constructor(){super("SmartDownload"),this.DL_BTN_SELECTORS=["ytd-download-button-renderer button",'button[aria-label="Download video"]','button[aria-label*="Download"]',".ytp-download-button","yt-button-shape button"].join(", "),this.downloadInterceptActive=!1,this.downloadButtonObserver=null,this._handleClick=this.handleDownloadClick.bind(this)}getConfigKey(){return"smartDownload"}async enable(){await super.enable(),!this.downloadInterceptActive&&(this.downloadInterceptActive=!0,document.addEventListener("click",this._handleClick,!0),this.startDownloadButtonWatcher())}async disable(){await super.disable(),this.downloadInterceptActive=!1,document.removeEventListener("click",this._handleClick,!0),this.stopDownloadButtonWatcher()}forceEnableDownloadButton(e){if(e.dataset.yppForced==="1")return;e.dataset.yppForced="1",e.removeAttribute("disabled"),e.removeAttribute("aria-disabled"),e.style.opacity="1",e.style.pointerEvents="auto",e.style.cursor="pointer";const t=e.closest("ytd-download-button-renderer, yt-button-shape, .yt-button-shape-with-explainer");t&&(t.removeAttribute("disabled"),t.removeAttribute("aria-disabled"),t.style.pointerEvents="auto",t.style.opacity="1")}startDownloadButtonWatcher(){this.downloadButtonObserver||(document.querySelectorAll(this.DL_BTN_SELECTORS).forEach(e=>this.forceEnableDownloadButton(e)),this.downloadButtonObserver=new MutationObserver(()=>{document.querySelectorAll(this.DL_BTN_SELECTORS).forEach(e=>{(e.hasAttribute("disabled")||e.getAttribute("aria-disabled")==="true"||e.style.pointerEvents==="none"||e.dataset.yppForced!=="1")&&(e.dataset.yppForced="0",this.forceEnableDownloadButton(e))})}),this.downloadButtonObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["disabled","aria-disabled","style"]}))}stopDownloadButtonWatcher(){this.downloadButtonObserver&&(this.downloadButtonObserver.disconnect(),this.downloadButtonObserver=null)}handleDownloadClick(e){const t=e.target.closest(this.DL_BTN_SELECTORS);if(!t||!(t.getAttribute("aria-label")||t.innerText||"").toLowerCase().includes("download"))return;e.preventDefault(),e.stopImmediatePropagation();const i=this.getCleanVideoUrl();try{navigator.clipboard.writeText(i).catch(()=>{})}catch{}window.open("https://ssvid.net/en/youtube-video-downloader-4","_blank","noopener,noreferrer")}getCleanVideoUrl(){const e=new URL(window.location.href),t=e.searchParams.get("v");return t?`https://www.youtube.com/watch?v=${t}`:`https://www.youtube.com${e.pathname}`}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ResumeBadges=class extends window.YPP.features.BaseFeature{constructor(){super("ResumeBadges"),this.STORAGE_KEY="ytProVideos",this.videoData={},this.videoElement=null,this.isTracking=!1,this._onTimeUpdate=this.handleTimeUpdate.bind(this),this._saveData=this.saveData.bind(this),this.lastSaveTime=0,this.SAVE_INTERVAL=5e3}getConfigKey(){return"resumeBadges"}async enable(){await super.enable();const e=await new Promise(t=>chrome.storage.local.get(this.STORAGE_KEY,t));e&&e[this.STORAGE_KEY]&&(this.videoData={},e[this.STORAGE_KEY].forEach(t=>{var i;const r=(i=t.videolink.match(/[?&]v=([^&#]+)/))==null?void 0:i[1];r&&(this.videoData[r]=t)})),this.addListener(window,"beforeunload",this._saveData),this.startThumbnailObserver(),this.utils.isWatchPage()&&this.startVideoTracking()}async disable(){await super.disable(),this._saveData(),this.stopVideoTracking(),this.thumbnailObserver&&(this.thumbnailObserver.disconnect(),this.thumbnailObserver=null),document.querySelectorAll(".yt-pro-pbar-wrap, .yt-pro-resume-badge").forEach(e=>e.remove())}onVideoChange(e){this.isEnabled&&(this._saveData(),this.startVideoTracking(e))}onPageChange(e){this.isEnabled&&(this.utils.isWatchPage()?this.startVideoTracking():this.stopVideoTracking())}startVideoTracking(e){this.stopVideoTracking();let t=e||new URLSearchParams(window.location.search).get("v");t&&(this.activeVideoId=t,this.pollFor("resume-badges-video","video.html5-main-video",r=>{this.isTracking||!this.isEnabled||(this.videoElement=r,this.isTracking=!0,this.addListener(this.videoElement,"timeupdate",this._onTimeUpdate))}))}stopVideoTracking(){this.videoElement&&(this.removeListener(this.videoElement,"timeupdate",this._onTimeUpdate),this.videoElement=null),this.isTracking=!1,this.activeVideoId=null}handleTimeUpdate(){if(!this.activeVideoId||!this.videoElement||this.videoElement.paused)return;const e=this.videoElement.currentTime,t=this.videoElement.duration;if(!t||t<60||e<10)return;this.videoData[this.activeVideoId]||(this.videoData[this.activeVideoId]={}),this.videoData[this.activeVideoId].time=e,this.videoData[this.activeVideoId].duration=t,this.videoData[this.activeVideoId].updatedAt=Date.now(),e/t>.95&&(this.videoData[this.activeVideoId].complete=!0);const r=Date.now();r-this.lastSaveTime>this.SAVE_INTERVAL&&(this._saveData(),this.lastSaveTime=r)}async saveData(){}startThumbnailObserver(){this.thumbnailObserver=new MutationObserver(e=>{let t=!1;for(let r of e)if(r.addedNodes.length){t=!0;break}t&&this.processThumbnails()}),this.thumbnailObserver.observe(document.body,{childList:!0,subtree:!0}),this.processThumbnails()}processThumbnails(){document.querySelectorAll('ytd-thumbnail:not([data-ypp-resume-processed="true"])').forEach(t=>{const r=t.querySelector("a#thumbnail");if(!r)return;const i=r.getAttribute("href");if(!i)return;const n=i.match(/[?&]v=([^&#]+)/);if(!n)return;const s=n[1];t.setAttribute("data-ypp-resume-processed","true");const o=this.videoData[s];if(!o||!o.time||!o.duration||o.complete)return;const a=o.time/o.duration*100,l=document.createElement("div");l.className="yt-pro-pbar-wrap",l.innerHTML=`<div class="yt-pro-pbar" style="width: ${a}%;"></div>`;const d=document.createElement("div");d.className="yt-pro-resume-badge",d.innerHTML=`<span>&#9654;</span> ${this.formatTime(o.time)}`;const p=t.querySelector("#overlays");p&&(p.appendChild(l),p.appendChild(d))})}formatTime(e){if(!e||isNaN(e))return"0:00";const t=Math.floor(e),r=Math.floor(t/3600),i=Math.floor(t%3600/60),n=t%60,s=o=>o<10?"0"+o:""+o;return r>0?`${r}:${s(i)}:${s(n)}`:`${i}:${s(n)}`}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SpeedBooster=class extends window.YPP.features.BaseFeature{constructor(){super("SpeedBooster")}getConfigKey(){return"speedBooster"}async enable(){await super.enable(),this.injectSpeedScript()}async disable(){await super.disable();const e=document.getElementById("ypp-speed-booster-script");e&&e.remove()}injectSpeedScript(){if(document.getElementById("ypp-speed-booster-script"))return;const e=document.createElement("script");e.id="ypp-speed-booster-script",e.textContent=`
            (function() {
                var that = this;
                var thatArguments = arguments;
                
                function updateAvailablePlaybackRates() {
                    var path = '';
                    if(typeof _yt_player === "undefined"){ return; }
                    
                    function findAvailablePlaybackRates(objectToSave,prep) {
                        var count=0;
                        for(var i in objectToSave){
                            if(Object.keys(objectToSave)[count] && objectToSave[Object.keys(objectToSave)[count]]){
                                if(Object.keys(objectToSave)[count] == "getAvailablePlaybackRates"){
                                    path = (prep===""?"":prep+".")+Object.keys(objectToSave)[count];
                                } else if(objectToSave[Object.keys(objectToSave)[count]]?.prototype?.getAvailablePlaybackRates !== undefined){
                                    path = (prep===""?"":prep+".")+Object.keys(objectToSave)[count]+".prototype.getAvailablePlaybackRates";
                                }
                                if(path !== '') return;
                                var objOfObj = objectToSave[Object.keys(objectToSave)[count]];
                                if( typeof objOfObj !== "undefined" && objectToSave[i].constructor.name == "Function" && Object.keys(objOfObj).length !== 0 ){
                                    var incount = 0;
                                    for(var j in objOfObj){
                                        if(typeof objOfObj !== "undefined"){
                                            findAvailablePlaybackRates(objOfObj[j],(prep===""?"":prep+".")+Object.keys(objectToSave)[count]+"."+Object.keys(objOfObj)[incount]);
                                        }
                                        if(path !== '') return;
                                        incount++;
                                    }
                                }
                            }
                            count++;
                        }
                    }

                    findAvailablePlaybackRates(_yt_player,"");

                    function setAvailablePlaybackRates(path,index,splitted) {
                        if(splitted.length - 1 == index){
                            path[splitted[index]] = function(){return [0.25,0.5,.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.25,3.5,3.75,4,5,6,7,8,9,10]};
                        }else setAvailablePlaybackRates(path[splitted[index]],index+1,splitted);
                    }

                    if(path !== "") setAvailablePlaybackRates(_yt_player,0,path.split('.'));
                }

                function runUpdateAvailablePlaybackRates() {
                    if(typeof _yt_player === "undefined"){
                        var interval = setInterval(function(){
                            if(typeof _yt_player !== "undefined"){
                                clearInterval(interval);
                                updateAvailablePlaybackRates();
                            }
                        },50);
                    }else{
                        updateAvailablePlaybackRates();
                    }
                }

                window.addEventListener('yt-navigate-finish', runUpdateAvailablePlaybackRates);
                runUpdateAvailablePlaybackRates();
            })();
        `,document.documentElement.appendChild(e)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.VideoSpeedController=class extends window.YPP.features.BaseFeature{constructor(){super("VideoSpeedController"),this.controllers=new WeakMap,this.markers=new WeakMap,this._mutationObserver=null,this._lastActiveVideo=null,this._lastActiveVideo=null}getConfigKey(){return"enableCustomSpeed"}async enable(){var t,r,i,n;if(!this.settings||this.settings.enableCustomSpeed===!1)return;if((t=this.utils)==null||t.log("Enabling Global Video Speed Controller","VSC"),((r=this.settings)==null?void 0:r.vscForceSpeed)!==!1){const s="ypp-vsc-page-script";if(!document.getElementById(s)){const o=document.createElement("script");o.id=s,o.src=chrome.runtime.getURL("src/content/features/player/enhancements/vsc-page-script.js"),(document.head||document.documentElement).appendChild(o)}}const e=(i=this.settings)!=null&&i.vscAudioSupport?"video, audio":"video";window.YPP.sharedObserver&&window.YPP.sharedObserver.register("video-speed-controller",e,s=>{s.forEach(o=>{var a;(o.tagName==="VIDEO"||(a=this.settings)!=null&&a.vscAudioSupport&&o.tagName==="AUDIO")&&this.attachToVideo(o)})},!0),this.registerShortcuts(),((n=this.settings)==null?void 0:n.vscRememberSpeed)!==!1&&(this._storageListener=(s,o)=>{var a;if(o==="local"&&s.ypp_settings&&s.ypp_settings.newValue){const l=s.ypp_settings.newValue.vscLastSpeed;if(l&&Math.abs(l-this.settings.vscLastSpeed)>.01){this.settings.vscLastSpeed=l;const d=(a=this.settings)!=null&&a.vscAudioSupport?"video, audio":"video";document.querySelectorAll(d).forEach(p=>{if(Math.abs(p.playbackRate-l)>.01){p.playbackRate=l;const u=this.controllers.get(p);u&&(u.display.textContent=l.toFixed(2))}})}}},chrome.storage.onChanged.addListener(this._storageListener))}async disable(){var t;await super.disable(),this._saveSpeedTimeout&&clearTimeout(this._saveSpeedTimeout),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("video-speed-controller"),this._storageListener&&(chrome.storage.onChanged.removeListener(this._storageListener),this._storageListener=null),window.YPP.hotkeysManager&&window.YPP.hotkeysManager.unregister("vsc");const e=(t=this.settings)!=null&&t.vscAudioSupport?"video, audio":"video";document.querySelectorAll(e).forEach(r=>{const i=this.controllers.get(r);i&&i.cleanup&&i.cleanup()}),document.querySelectorAll("ypp-vsc-controller").forEach(r=>r.remove()),this.controllers=new WeakMap}onUpdate(){}onVideoChange(e){var r,i,n;if(!this.isEnabled)return;const t=((r=this.settings)==null?void 0:r.vscRememberSpeed)!==!1&&((i=this.settings)!=null&&i.vscLastSpeed)?this.settings.vscLastSpeed:1;if(t!==1){const s=(n=this.settings)!=null&&n.vscAudioSupport?"video, audio":"video";document.querySelectorAll(s).forEach(o=>{if(o.readyState>=1)this.setSpeed(o,t);else{const a=()=>{this.setSpeed(o,t),o.removeEventListener("loadedmetadata",a)};o.addEventListener("loadedmetadata",a)}})}}attachToVideo(e){var F,T,M,L;if(this.controllers.has(e)||!e.isConnected||e.hasAttribute("data-ypp-vsc-attached"))return;e.setAttribute("data-ypp-vsc-attached","true"),(F=this.utils)==null||F.log("Attaching VSC to video","VSC");const t=document.createElement("ypp-vsc-controller"),r="ypp-vsc-style";if(!document.getElementById(r)){const k=document.createElement("link");k.id=r,k.rel="stylesheet",k.href=chrome.runtime.getURL("src/content/features/player/enhancements/video-speed-controller.css"),document.head.appendChild(k)}const i=document.createElement("div");i.className="ypp-vsc-panel";const n=document.createElement("span");n.className="ypp-vsc-speed-display",n.textContent="1.00";const s={rewind:'<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',slower:'<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 13H5v-2h14v2z"/></svg>',faster:'<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',advance:'<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',close:'<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>'},o=k=>k?k.replace("Shift+","⇧"):"",a=((T=this.settings)==null?void 0:T.vscSpeedStep)??.25,l=k=>{const R=this.getShortcuts().find(U=>U.action===k);return R?R.key:""},d=this.createButton(s.rewind,`Rewind 10s (${o(l("rewind"))})`,()=>{e.currentTime-=10}),p=this.createButton(s.slower,`Slower -${a}x (${o(l("decrease"))})`,()=>this.adjustSpeed(e,-a)),u=this.createButton(s.faster,`Faster +${a}x (${o(l("increase"))})`,()=>this.adjustSpeed(e,a)),h=this.createButton(s.advance,`Advance 10s (${o(l("advance"))})`,()=>{e.currentTime+=10}),m=this.createButton(s.close,`Hide Controller (${o(l("showHide"))})`,()=>{t.style.display="none"});m.classList.add("ypp-vsc-close"),i.appendChild(n),i.appendChild(d),i.appendChild(p),i.appendChild(u),i.appendChild(h),i.appendChild(m);const y=((M=this.settings)==null?void 0:M.vscControllerOpacity)??.3;i.style.opacity=y,this.addListener(i,"mouseenter",()=>i.style.opacity="1"),this.addListener(i,"mouseleave",()=>i.style.opacity=y),t.appendChild(i);const v=`ypp-vsc-${Math.random().toString(36).substr(2,9)}`;t.classList.add(v),t.style.position="absolute",t.style.zIndex="9999999",(e.parentElement||document.body).insertBefore(t,e.nextSibling||e);let f=12,g=12,_=!1;const P=()=>{var I;if(!e.isConnected||!t.isConnected||_)return;const k=e.getBoundingClientRect();if(k.width===0&&k.height===0){_=!0,requestAnimationFrame(()=>{t.style.position="fixed",t.style.top=`${Math.max(g,12)}px`,t.style.left=`${Math.max(f,12)}px`,t.style.right="auto",t.style.bottom="auto",_=!1});return}const R=(I=t.offsetParent)==null?void 0:I.getBoundingClientRect(),U=Math.max(k.top-((R==null?void 0:R.top)||0),0)+g,j=Math.max(k.left-((R==null?void 0:R.left)||0),0)+f;_=!0,requestAnimationFrame(()=>{t.style.position="absolute",t.style.top=`${U}px`,t.style.left=`${j}px`,t.style.right="auto",t.style.bottom="auto",_=!1})};P();const w=new ResizeObserver(()=>P());w.observe(e),t.offsetParent&&w.observe(t.offsetParent),this.addListener(window,"resize",P,{passive:!0});let C=!1,x,S;this.addListener(n,"mousedown",k=>{C=!0,x=k.clientX,S=k.clientY,k.preventDefault()});const E=k=>{if(!C)return;const R=k.clientX-x,U=k.clientY-S;f+=R,g+=U,x=k.clientX,S=k.clientY,P()},N=()=>{C=!1};this.addListener(window,"mousemove",E),this.addListener(window,"mouseup",N),this.controllers.set(e,{element:t,display:n,manualHide:!1,hideTimeout:null,fightbackCount:0,fightbackTimer:null,lastInteraction:0,cleanup:()=>{window.removeEventListener("mousemove",E),window.removeEventListener("mouseup",N)}});const A=this.settings.vscRememberSpeed!==!1&&this.settings.vscLastSpeed?this.settings.vscLastSpeed:1;A!==1&&this.setSpeed(e,A),this.addListener(e,"ratechange",k=>this.handleRateChange(e,k));const Y=()=>{var k;(k=this.settings)!=null&&k.vscHideController||(this.showController(e),this.hideControllerDelay(e))};this.addListener(e,"play",()=>{this._lastActiveVideo=e,Y()}),this.addListener(e,"pause",Y);const O=e.ownerDocument;O&&(this.addListener(O,"mousemove",Y),this.addListener(O,"click",()=>{this._lastActiveVideo=e,Y()})),this.addListener(t,"mouseenter",()=>{if(this.showController(e),this.controllers.has(e)){const k=this.controllers.get(e);k.hideTimeout&&(clearTimeout(k.hideTimeout),k.hideTimeout=null)}}),this.addListener(t,"mouseleave",()=>this.hideControllerDelay(e)),(L=this.settings)!=null&&L.vscHideController?(t.style.display="none",t.classList.add("ypp-vsc-hidden")):this.hideControllerDelay(e)}createButton(e,t,r){const i=document.createElement("button");return i.className="ypp-vsc-btn",i.innerHTML=e,i.title=t,this.addListener(i,"pointerdown",n=>{n.preventDefault(),n.stopPropagation(),r()}),i.onclick=n=>{n.preventDefault(),n.stopPropagation()},i.onmousedown=n=>n.stopPropagation(),i}handleRateChange(e,t){var o;const r=this.controllers.get(e);if(!r)return;const i=e.playbackRate,n=this.settings.vscLastSpeed||1;if(Math.abs(i-n)<.01){r.display.textContent=i.toFixed(2);return}if(t.detail&&t.detail.origin==="videoSpeed")return;if(r.blockNativeUpdatesUntil&&Date.now()<r.blockNativeUpdatesUntil){e.playbackRate=n,t.stopImmediatePropagation();return}if(Date.now()-r.lastInteraction<300){this._debouncedSaveSpeed(i),this.settings.vscLastSpeed=i,r.display.textContent=i.toFixed(2);return}((o=this.settings)==null?void 0:o.vscForceSpeed)!==!1?(this.setSpeed(e,n),t.stopImmediatePropagation()):r.display.textContent=i.toFixed(2)}showController(e){const t=this.controllers.get(e);t&&(t.hideTimeout&&(clearTimeout(t.hideTimeout),t.hideTimeout=null),t.element.classList.remove("ypp-vsc-hidden"),t.element.style.display="")}hideControllerDelay(e){if(e.closest(".html5-video-player"))return;const t=this.controllers.get(e);t&&(t.hideTimeout&&clearTimeout(t.hideTimeout),t.hideTimeout=setTimeout(()=>{t.element.classList.add("ypp-vsc-hidden")},2500))}setSpeed(e,t){var i;const r=this.controllers.get(e);r&&(t=Math.max(.1,Math.min(t,16)),e.playbackRate=t,this.settings.vscLastSpeed=t,this._debouncedSaveSpeed(t),((i=this.settings)==null?void 0:i.vscForceSpeed)!==!1&&window.dispatchEvent(new CustomEvent("ypp-vsc-force-speed",{detail:{enabled:!0,speed:t}})),r.display.textContent=t.toFixed(2),this.showController(e),this.hideControllerDelay(e),r.blockNativeUpdatesUntil=Date.now()+500,e.dispatchEvent(new CustomEvent("ratechange",{bubbles:!0,composed:!0,detail:{origin:"videoSpeed",speed:t}})))}adjustSpeed(e,t){let r=e.playbackRate,i=Math.round((r+t)*100)/100;this.setSpeed(e,i)}_debouncedSaveSpeed(e){this._saveSpeedTimeout&&clearTimeout(this._saveSpeedTimeout),this._saveSpeedTimeout=setTimeout(()=>{var t;((t=this.settings)==null?void 0:t.vscRememberSpeed)!==!1&&window.YPP.StorageManager&&chrome.runtime.sendMessage({action:"UPDATE_SETTINGS_DELTA",delta:{vscLastSpeed:e}},()=>{})},500)}getShortcuts(){return this.settings?this.settings.vscShortcuts===void 0?[{action:"decrease",key:"Z",value:.25},{action:"increase",key:"X",value:.25},{action:"rewind",key:"S",value:10},{action:"advance",key:"D",value:10},{action:"reset",key:"R",value:1},{action:"showHide",key:"V",value:0}]:this.settings.vscShortcuts||[]:[]}registerShortcuts(){var r;const e=this.getShortcuts();if(!e||e.length===0)return;const t=[];for(const i of e)i.key&&t.push({combo:i.key,callback:n=>{var d,p,u;const s=n.composedPath?n.composedPath():n.path||[n.target];for(const h of s)if(h&&h.tagName){const m=h.tagName.toUpperCase();if(m==="INPUT"||m==="TEXTAREA"||h.isContentEditable)return}if((p=(d=window.YPP.utils)==null?void 0:d.isInputFocused)!=null&&p.call(d))return;let o=this._lastActiveVideo;if((!o||!o.isConnected)&&(o=this.findLargestVideo()),!o)return;this.controllers.has(o)||this.attachToVideo(o);const a=this.controllers.get(o);a&&(a.lastInteraction=Date.now());const l=parseFloat(i.value)||0;switch(i.action){case"showHide":const h=(u=o.parentElement)==null?void 0:u.querySelector("ypp-vsc-controller");h&&(h.style.display=h.style.display==="none"?"block":"none");break;case"decrease":this.adjustSpeed(o,-l);break;case"increase":this.adjustSpeed(o,l);break;case"rewind":o.currentTime-=l;break;case"advance":o.currentTime+=l;break;case"reset":case"preferred":this.setSpeed(o,l);break;case"mute":o.muted=!o.muted;break;case"decreaseVolume":o.volume=Math.max(0,o.volume-.1);break;case"increaseVolume":o.volume=Math.min(1,o.volume+.1);break;case"pause":o.paused?o.play():o.pause();break;case"setMarker":this.markers.set(o,o.currentTime);break;case"jumpMarker":this.markers.has(o)&&(o.currentTime=this.markers.get(o));break}this.showController(o),this.hideControllerDelay(o)}});(r=window.YPP.hotkeysManager)==null||r.register("vsc",t)}findLargestVideo(){var i;let e=null,t=0;const r=(i=this.settings)!=null&&i.vscAudioSupport?"video, audio":"video";return document.querySelectorAll(r).forEach(n=>{const s=n.getBoundingClientRect(),o=s.width*s.height;o>t&&(t=o,e=n)}),e}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AudioEQ=class extends window.YPP.features.BaseFeature{constructor(){super("AudioEQ"),this.audioContext=null,this.sourceNode=null,this.bassFilter=null,this.trebleFilter=null,this.gainNode=null,this._boundHandleRateChange=this._handleRateChange.bind(this)}getConfigKey(){return"audioModeEnabled"}async enable(){await super.enable();const e=document.querySelector("video");e&&this._initAudioContext(e),window.YPP.sharedObserver&&window.YPP.sharedObserver.register("audio-eq","video",t=>{this._initAudioContext(t[0])})}async disable(){await super.disable(),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("audio-eq"),this.audioContext&&(this.bassFilter.gain.value=0,this.trebleFilter.gain.value=0)}onUpdate(){this._applyEQ()}_initAudioContext(e){var t,r;if(!(!e||this.audioContext))try{const i=window.AudioContext||window.webkitAudioContext;this.audioContext=new i,this.sourceNode=this.audioContext.createMediaElementSource(e),this.bassFilter=this.audioContext.createBiquadFilter(),this.bassFilter.type="lowshelf",this.bassFilter.frequency.value=250,this.trebleFilter=this.audioContext.createBiquadFilter(),this.trebleFilter.type="highshelf",this.trebleFilter.frequency.value=4e3,this.sourceNode.connect(this.bassFilter),this.bassFilter.connect(this.trebleFilter),this.trebleFilter.connect(this.audioContext.destination),this.addListener(e,"ratechange",this._boundHandleRateChange),this._applyEQ(),(t=this.utils)==null||t.log("Audio EQ graph initialized successfully","AUDIO","debug")}catch(i){(r=this.utils)==null||r.log(`Failed to init AudioContext: ${i.message}`,"AUDIO","error")}}_applyEQ(){if(!this.audioContext||!this.settings)return;this.audioContext.state==="suspended"&&this.audioContext.resume();const e=this.settings.volumeBoostBass||0,t=this.settings.volumeBoostTreble||0;this.bassFilter&&(this.bassFilter.gain.value=e),this.trebleFilter&&(this.trebleFilter.gain.value=t)}_handleRateChange(e){this.audioContext&&this.audioContext.state==="suspended"&&this.audioContext.resume()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AutoTranscript=class extends window.YPP.features.BaseFeature{constructor(){super("AutoTranscript")}getConfigKey(){return"enableTranscript"}async enable(){await super.enable(),window.YPP.sharedObserver&&window.YPP.sharedObserver.register("auto-transcript","ytd-video-secondary-info-renderer, ytd-watch-metadata",e=>{this._openTranscript()},!0),this._openTranscript()}async disable(){await super.disable(),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("auto-transcript")}_openTranscript(){var r;if(!this.isEnabled||document.querySelector("ytd-transcript-renderer")||document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'))return;const t=Array.from(document.querySelectorAll("button, tp-yt-paper-button")).find(i=>i.textContent&&i.textContent.toLowerCase().includes("show transcript"));t&&t.offsetParent!==null&&(t.click(),(r=this.utils)==null||r.log("Auto-opened transcript","TRANSCRIPT","debug"),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("auto-transcript"))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.StatsForNerds=class extends window.YPP.features.BaseFeature{constructor(){super("StatsForNerds")}getConfigKey(){return"enableStatsForNerds"}async enable(){await super.enable(),window.YPP.sharedObserver&&window.YPP.sharedObserver.register("stats-nerds","video",e=>{this._openStats()},!0),this._openStats()}async disable(){await super.disable(),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("stats-nerds");const e=document.querySelector(".html5-video-info-panel-close");e&&e.click()}_openStats(){var r;if(!this.isEnabled||!document.querySelector("video")||document.querySelector('.html5-video-info-panel[style*="display: block"]'))return;const t=document.querySelector(".html5-video-player");t&&typeof t.toggleStats=="function"&&(t.toggleStats(),(r=this.utils)==null||r.log("Auto-opened Stats for Nerds via API","STATS","debug"),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("stats-nerds"))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.MiniPlayerScroll=class extends window.YPP.features.BaseFeature{constructor(){super("MiniPlayerScroll"),this._boundHandleScroll=this._handleScroll.bind(this),this.isMini=!1}getConfigKey(){return"enableMiniPlayer"}async enable(){await super.enable(),this.addListener(window,"scroll",this._boundHandleScroll,{passive:!0}),this._handleScroll()}async disable(){if(await super.disable(),this.isMini){const e=document.querySelector(".ytp-miniplayer-button");e&&e.click(),this.isMini=!1}}_handleScroll(){var o,a;if(!this.isEnabled)return;const e=document.querySelector("video"),t=document.querySelector("#player-container-outer")||document.querySelector("#player");if(!e||!t)return;const i=t.getBoundingClientRect().bottom<0,n=document.querySelector(".ytp-miniplayer-button");if(!n)return;const s=document.body.hasAttribute("miniplayer-active");i&&!this.isMini&&!s?(n.click(),this.isMini=!0,(o=this.utils)==null||o.log("Auto-enabled miniplayer on scroll","MINIPLAYER","debug")):!i&&this.isMini&&(n.click(),this.isMini=!1,(a=this.utils)==null||a.log("Restored player from miniplayer on scroll","MINIPLAYER","debug"))}};class oi extends window.YPP.features.BaseFeature{getConfigKey(){return"vscAudioSupport"}constructor(){super("VSCAudioSupport")}}window.YPP.features.VSCAudioSupport=oi;class ai extends window.YPP.features.BaseFeature{getConfigKey(){return"vscHideByDefault"}constructor(){super("VSCHideByDefault")}}window.YPP.features.VSCHideByDefault=ai;class li extends window.YPP.features.BaseFeature{getConfigKey(){return"vscForceSpeed"}constructor(){super("VSCForceSpeed"),this._injected=!1}async enable(){await super.enable(),!(!this.settings||this.settings.vscForceSpeed===!1)&&(this.injectPageScript(),this.syncSpeedToPage())}async disable(){await super.disable(),this.disablePageScript()}injectPageScript(){if(this._injected||document.getElementById("ypp-vsc-page-script"))return;const e=`
            (function() {
                if (window.__ypp_vsc_injected) return;
                window.__ypp_vsc_injected = true;
            
                let forcedSpeed = null;
                let isForcing = false;
            
                window.addEventListener('ypp-vsc-force-speed', (e) => {
                    forcedSpeed = e.detail.speed;
                    isForcing = !!e.detail.enabled;
                    
                    if (isForcing && forcedSpeed) {
                        const medias = document.querySelectorAll('video, audio');
                        medias.forEach(media => {
                            if (Math.abs(media.playbackRate - forcedSpeed) > 0.01) {
                                try {
                                    const originalSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate').set;
                                    originalSetter.call(media, forcedSpeed);
                                } catch (err) {}
                            }
                        });
                    }
                });
            
                const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
                if (!originalDescriptor) return;
            
                const originalSet = originalDescriptor.set;
                
                Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
                    get: originalDescriptor.get,
                    set: function(val) {
                        if (isForcing && forcedSpeed !== null) {
                            if (Math.abs(val - forcedSpeed) > 0.01) {
                                return; // Blocked
                            }
                        }
                        return originalSet.call(this, val);
                    },
                    configurable: true,
                    enumerable: true
                });
            })();
        `,t=document.createElement("script");t.id="ypp-vsc-page-script",t.textContent=e,(document.head||document.documentElement).appendChild(t),this._injected=!0}syncSpeedToPage(){var t;if(!((t=this.settings)!=null&&t.vscForceSpeed))return;const e=this.settings.vscLastSpeed||1;window.dispatchEvent(new CustomEvent("ypp-vsc-force-speed",{detail:{enabled:!0,speed:e}}))}disablePageScript(){window.dispatchEvent(new CustomEvent("ypp-vsc-force-speed",{detail:{enabled:!1,speed:null}}))}}window.YPP.features.VSCForceSpeed=li;class di extends window.YPP.features.BaseFeature{getConfigKey(){return"vscRememberSpeed"}constructor(){super("VSCRememberSpeed")}}window.YPP.features.VSCRememberSpeed=di,window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.FloatingPlayer=class extends window.YPP.features.BaseFeature{constructor(){super("FloatingPlayer"),this.observer=null,this.isActive=!1,this.checkVisibility=this.checkVisibility.bind(this)}getConfigKey(){return"floatingPlayer"}async enable(){var e;await super.enable();try{this.addListener(window,"yt-navigate-finish",()=>this.initObserver()),this.initObserver()}catch(t){(e=this.utils)==null||e.log("Error enabling Floating Player","FLOATING_PLAYER","error",t)}}async disable(){await super.disable(),this.cleanup()}cleanup(){this.observer&&(this.observer.disconnect(),this.observer=null),this.deactivateFloatingPlayer()}initObserver(){this.cleanup(),this.isEnabled&&window.location.pathname.startsWith("/watch")&&this.utils.pollFor(()=>document.querySelector("#player-container-outer, #player-container"),1e4,500).then(e=>{!e||!this.isEnabled||(this.observer=new IntersectionObserver(t=>{t.forEach(r=>this.checkVisibility(r))},{root:null,threshold:.1}),this.observer.observe(e))}).catch(()=>{var e;(e=this.utils)==null||e.log("Player container not found for Floating Player","FLOATING_PLAYER","warn")})}checkVisibility(e){this.isEnabled&&(e.intersectionRatio<.1&&e.boundingClientRect.bottom<window.innerHeight/2?this.activateFloatingPlayer():this.deactivateFloatingPlayer())}activateFloatingPlayer(){this.isActive||(this.isActive=!0,requestAnimationFrame(()=>{var e;document.body.classList.add("ypp-floating-player-active"),this._injectCloseButton(),this._enableDrag(),(e=this.utils)==null||e.log("Floating Player Activated","FLOATING_PLAYER","debug")}))}deactivateFloatingPlayer(){this.isActive&&(this.isActive=!1,requestAnimationFrame(()=>{var t,r;document.body.classList.remove("ypp-floating-player-active"),(t=document.querySelector(".ypp-float-close-btn"))==null||t.remove();const e=document.querySelector('#ytd-player, ytd-player[id="ytd-player"]');e&&(e.style.removeProperty("bottom"),e.style.removeProperty("right"),e.style.removeProperty("top"),e.style.removeProperty("left")),(r=this.utils)==null||r.log("Floating Player Deactivated","FLOATING_PLAYER","debug")}))}_injectCloseButton(){if(document.querySelector(".ypp-float-close-btn"))return;const e=document.querySelector('#ytd-player, ytd-player[id="ytd-player"]');if(!e)return;const t=document.createElement("button");t.className="ypp-float-close-btn",t.title="Dismiss floating player",t.innerHTML="✕",this.addListener(t,"click",r=>{r.stopPropagation(),this.deactivateFloatingPlayer()}),e.appendChild(t)}_enableDrag(){const e=document.querySelector('#ytd-player, ytd-player[id="ytd-player"]');if(!e||e._yppDragEnabled)return;e._yppDragEnabled=!0;let t,r,i,n;const s=o=>{if(o.target.closest(".ypp-float-close-btn, .ytp-chrome-bottom"))return;o.preventDefault();const a=e.getBoundingClientRect();t=o.clientX,r=o.clientY,i=window.innerWidth-a.right,n=window.innerHeight-a.bottom;const l=p=>{const u=t-p.clientX,h=r-p.clientY,m=Math.max(8,Math.min(window.innerWidth-100,i+u)),y=Math.max(8,Math.min(window.innerHeight-60,n+h));e.style.setProperty("right",`${m}px`,"important"),e.style.setProperty("bottom",`${y}px`,"important"),e.style.removeProperty("top"),e.style.removeProperty("left")},d=()=>{document.removeEventListener("mousemove",l),document.removeEventListener("mouseup",d)};document.addEventListener("mousemove",l),document.addEventListener("mouseup",d)};this.addListener(e,"mousedown",s)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.VideoFiltersPresets={FILTERS:[{category:"Classic",name:"Normal",css:"none",overlay:null},{category:"Classic",name:"Sepia",css:"sepia(100%)",overlay:null},{category:"Classic",name:"Grayscale",css:"grayscale(100%)",overlay:null},{category:"Classic",name:"High Contrast",css:"contrast(160%) saturate(90%)",overlay:null},{category:"Classic",name:"Vivid",css:"saturate(200%) contrast(110%)",overlay:null},{category:"Classic",name:"Warm",css:"sepia(40%) saturate(130%) contrast(100%) brightness(105%)",overlay:null},{category:"Classic",name:"Cool",css:"hue-rotate(200deg) saturate(130%) brightness(95%)",overlay:null},{category:"Classic",name:"Invert",css:"invert(100%)",overlay:null},{category:"Cinematic",name:"Cinematic",css:"contrast(115%) saturate(110%) brightness(95%) hue-rotate(350deg)",overlay:null},{category:"Cinematic",name:"Noir",css:"grayscale(100%) contrast(130%) brightness(85%)",overlay:null},{category:"Cinematic",name:"B&W Cinematic",css:"grayscale(100%) contrast(140%) brightness(90%)",overlay:null},{category:"Cinematic",name:"Teal & Orange",css:"hue-rotate(180deg) saturate(130%) contrast(115%) brightness(100%)",overlay:null},{category:"Cinematic",name:"Documentary",css:"contrast(120%) saturate(90%) brightness(100%)",overlay:null},{category:"Cinematic",name:"HDR",css:"contrast(140%) saturate(120%) brightness(110%)",overlay:null},{category:"Retro & Analog",name:"Retro",css:"sepia(60%) hue-rotate(330deg) saturate(150%) contrast(120%)",overlay:null},{category:"Retro & Analog",name:"📺 CRT Display",css:"url(#ypp-crt-rgb) contrast(135%) brightness(110%) saturate(85%)",overlay:"crt"},{category:"Retro & Analog",name:"📼 VHS Tape",css:"contrast(90%) brightness(85%) saturate(60%) hue-rotate(5deg)",overlay:"vhs"},{category:"Retro & Analog",name:"🎞 Old Film",css:"sepia(70%) contrast(90%) brightness(85%) blur(0.3px)",overlay:"oldfilm"},{category:"Retro & Analog",name:"Film Grain",css:"contrast(110%) brightness(100%) saturate(100%)",overlay:"oldfilm"},{category:"Retro & Analog",name:"90s TV",css:"contrast(85%) brightness(90%) saturate(75%) hue-rotate(5deg)",overlay:"crt"},{category:"Retro & Analog",name:"Polaroid",css:"sepia(20%) contrast(105%) brightness(108%) saturate(110%)",overlay:null},{category:"Artistic",name:"Cyberpunk",css:"hue-rotate(180deg) saturate(180%) contrast(120%) brightness(110%)",overlay:null},{category:"Artistic",name:"Vaporwave",css:"hue-rotate(280deg) saturate(160%) contrast(110%) brightness(105%)",overlay:null},{category:"Artistic",name:"80s Synthwave",css:"hue-rotate(300deg) saturate(180%) contrast(130%) brightness(100%)",overlay:null},{category:"Artistic",name:"Neon Noir",css:"hue-rotate(280deg) saturate(200%) contrast(140%) brightness(85%)",overlay:null},{category:"Artistic",name:"Sci-Fi",css:"hue-rotate(220deg) saturate(140%) contrast(125%) brightness(90%)",overlay:null},{category:"Artistic",name:"Comic Book",css:"contrast(200%) saturate(150%) brightness(110%)",overlay:null},{category:"Artistic",name:"Lomo",css:"saturate(150%) contrast(110%) brightness(95%) vignette(0.5)",overlay:null},{category:"Atmospheric",name:"Golden Hour",css:"sepia(30%) hue-rotate(30deg) saturate(130%) brightness(110%) contrast(105%)",overlay:null},{category:"Atmospheric",name:"Blue Hour",css:"hue-rotate(210deg) saturate(120%) brightness(95%) contrast(110%)",overlay:null},{category:"Atmospheric",name:"Summer",css:"sepia(15%) hue-rotate(40deg) saturate(140%) brightness(110%)",overlay:null},{category:"Atmospheric",name:"Winter",css:"hue-rotate(200deg) saturate(80%) brightness(105%) contrast(110%)",overlay:null},{category:"Atmospheric",name:"Autumn",css:"sepia(40%) hue-rotate(30deg) saturate(130%) brightness(100%)",overlay:null},{category:"Atmospheric",name:"Spring",css:"hue-rotate(100deg) saturate(150%) brightness(108%) contrast(105%)",overlay:null},{category:"Atmospheric",name:"Sunset",css:"sepia(30%) hue-rotate(330deg) saturate(150%) contrast(110%) brightness(105%)",overlay:null},{category:"Mood",name:"Dreamy",css:"brightness(110%) contrast(90%) saturate(120%) blur(0.5px)",overlay:null},{category:"Mood",name:"Muted",css:"saturate(70%) contrast(90%) brightness(105%)",overlay:null},{category:"Mood",name:"Pastel",css:"saturate(60%) brightness(115%) contrast(85%)",overlay:null},{category:"Mood",name:"Soft Focus",css:"brightness(105%) contrast(95%) saturate(90%) blur(0.8px)",overlay:null},{category:"Mood",name:"Horror",css:"contrast(130%) brightness(80%) saturate(70%) hue-rotate(10deg)",overlay:null},{category:"Mood",name:"Fantasy",css:"saturate(140%) brightness(105%) contrast(110%) hue-rotate(300deg)",overlay:null},{category:"Mood",name:"Gothic",css:"contrast(125%) brightness(85%) saturate(60%) hue-rotate(340deg)",overlay:null},{category:"Special Effects",name:"Night Vision",css:"saturate(0%) sepia(100%) hue-rotate(60deg) brightness(140%) contrast(160%)",overlay:"nightvision"},{category:"Special Effects",name:"Thermal",css:"invert(100%) hue-rotate(180deg) saturate(400%) contrast(200%)",overlay:null},{category:"Special Effects",name:"X-Ray",css:"invert(100%) grayscale(100%) contrast(150%)",overlay:null},{category:"Special Effects",name:"Psychedelic",css:"hue-rotate(90deg) saturate(300%) contrast(150%) invert(20%)",overlay:null},{category:"Special Effects",name:"RGB Glitch",css:"url(#ypp-fx-glitch) contrast(120%) brightness(110%) saturate(120%)",overlay:null},{category:"Special Effects",name:"The Matrix",css:"url(#ypp-fx-matrix) contrast(150%) brightness(130%)",overlay:null},{category:"Special Effects",name:"Posterize",css:"url(#ypp-fx-posterize) saturate(150%) contrast(120%)",overlay:null},{category:"Special Effects",name:"Emboss",css:"url(#ypp-fx-emboss) grayscale(100%) contrast(150%) brightness(120%)",overlay:null},{category:"Special Effects",name:"Neon Edge",css:"url(#ypp-fx-edge) saturate(200%) brightness(120%)",overlay:null},{category:"Special Effects",name:"Deep Fried",css:"saturate(400%) contrast(300%) brightness(120%) hue-rotate(-10deg)",overlay:null},{category:"Special Effects",name:"Duotone Red",css:"grayscale(100%) sepia(100%) hue-rotate(320deg) saturate(400%) contrast(140%)",overlay:null},{category:"Special Effects",name:"Colorize B&W",css:"url(#ypp-fx-colorize) saturate(120%) contrast(110%)",overlay:null},{category:"Special Effects",name:"Vintage Colorize",css:"url(#ypp-fx-technicolor) saturate(110%) contrast(115%)",overlay:null},{category:"Special Effects",name:"Dream Colorize",css:"url(#ypp-fx-dreamcolor) saturate(130%) contrast(110%)",overlay:null},{category:"Social Media",name:"1977",css:"sepia(50%) hue-rotate(-30deg) saturate(140%)",overlay:null},{category:"Social Media",name:"Aden",css:"sepia(20%) brightness(115%) saturate(140%)",overlay:null},{category:"Social Media",name:"Amaro",css:"sepia(35%) contrast(110%) brightness(120%) saturate(130%)",overlay:null},{category:"Social Media",name:"Ashby",css:"sepia(50%) contrast(120%) saturate(180%)",overlay:null},{category:"Social Media",name:"Brannan",css:"sepia(40%) contrast(125%) brightness(110%) saturate(90%) hue-rotate(-2deg)",overlay:null},{category:"Social Media",name:"Brooklyn",css:"sepia(25%) contrast(125%) brightness(125%) hue-rotate(5deg)",overlay:null},{category:"Social Media",name:"Charmes",css:"sepia(25%) contrast(125%) brightness(125%) saturate(135%) hue-rotate(-5deg)",overlay:null},{category:"Social Media",name:"Clarendon",css:"contrast(120%) saturate(135%) brightness(110%) hue-rotate(5deg)",overlay:null},{category:"Social Media",name:"Crema",css:"sepia(50%) contrast(125%) brightness(115%) saturate(90%) hue-rotate(-2deg)",overlay:null},{category:"Social Media",name:"Dogpatch",css:"sepia(35%) saturate(110%) contrast(150%) brightness(110%)",overlay:null},{category:"Social Media",name:"Earlybird",css:"sepia(25%) contrast(125%) brightness(115%) saturate(90%) hue-rotate(-5deg)",overlay:null},{category:"Social Media",name:"Gingham",css:"brightness(105%) hue-rotate(350deg) contrast(110%) saturate(120%)",overlay:null},{category:"Social Media",name:"Ginza",css:"sepia(25%) contrast(115%) brightness(120%) saturate(135%) hue-rotate(-5deg)",overlay:null},{category:"Social Media",name:"Hefe",css:"sepia(40%) contrast(150%) brightness(120%) saturate(140%) hue-rotate(-10deg)",overlay:null},{category:"Social Media",name:"Helena",css:"sepia(50%) contrast(105%) brightness(105%) saturate(135%)",overlay:null},{category:"Social Media",name:"Hudson",css:"sepia(25%) contrast(120%) brightness(120%) saturate(105%) hue-rotate(-15deg)",overlay:null},{category:"Social Media",name:"Inkwell",css:"grayscale(100%) sepia(15%) contrast(110%) brightness(110%)",overlay:null},{category:"Social Media",name:"Juno",css:"saturate(140%) contrast(110%) brightness(115%) hue-rotate(15deg)",overlay:null},{category:"Social Media",name:"Kelvin",css:"sepia(15%) contrast(150%) brightness(110%) saturate(120%) hue-rotate(-10deg)",overlay:null},{category:"Social Media",name:"Lark",css:"contrast(120%) saturate(120%) brightness(110%) hue-rotate(5deg)",overlay:null},{category:"Social Media",name:"Lo-Fi",css:"saturate(110%) contrast(150%)",overlay:null},{category:"Social Media",name:"Ludwig",css:"sepia(25%) contrast(105%) brightness(105%) saturate(200%) hue-rotate(-5deg)",overlay:null},{category:"Social Media",name:"Maven",css:"sepia(25%) contrast(105%) brightness(105%) saturate(150%) hue-rotate(-5deg)",overlay:null},{category:"Social Media",name:"Mayfair",css:"contrast(110%) brightness(115%) saturate(110%)",overlay:null},{category:"Social Media",name:"Moon",css:"grayscale(100%) contrast(110%) brightness(110%)",overlay:null},{category:"Social Media",name:"Nashville",css:"sepia(25%) contrast(150%) brightness(105%) saturate(120%) hue-rotate(-15deg)",overlay:null},{category:"Social Media",name:"Perpetua",css:"contrast(110%) brightness(125%) saturate(110%)",overlay:null},{category:"Social Media",name:"Reyes",css:"sepia(75%) contrast(75%) brightness(125%) saturate(140%)",overlay:null},{category:"Social Media",name:"Rise",css:"sepia(25%) contrast(125%) brightness(120%) saturate(90%) hue-rotate(5deg)",overlay:null},{category:"Social Media",name:"Sierra",css:"sepia(25%) contrast(150%) brightness(90%) saturate(120%) hue-rotate(-15deg)",overlay:null},{category:"Social Media",name:"Slumber",css:"sepia(35%) contrast(125%) brightness(105%) saturate(130%)",overlay:null},{category:"Social Media",name:"Stinson",css:"sepia(35%) contrast(125%) brightness(115%) saturate(110%)",overlay:null},{category:"Social Media",name:"Sutro",css:"sepia(40%) contrast(120%) brightness(90%) saturate(140%) hue-rotate(-10deg)",overlay:null},{category:"Social Media",name:"Toaster",css:"sepia(25%) contrast(150%) brightness(95%) saturate(110%) hue-rotate(-15deg)",overlay:null},{category:"Social Media",name:"Valencia",css:"sepia(25%) contrast(125%) brightness(110%) saturate(110%)",overlay:null},{category:"Social Media",name:"Walden",css:"sepia(35%) contrast(80%) brightness(125%) saturate(140%) hue-rotate(-10deg)",overlay:null},{category:"Social Media",name:"Willow",css:"grayscale(100%) sepia(20%) contrast(110%) brightness(120%)",overlay:null},{category:"Social Media",name:"X-Pro II",css:"sepia(45%) contrast(125%) brightness(175%) saturate(130%) hue-rotate(-5deg)",overlay:null},{category:"Anime Worlds",name:"Studio Ghibli",css:"sepia(15%) saturate(160%) contrast(110%) brightness(110%) hue-rotate(5deg)",overlay:null},{category:"Anime Worlds",name:"Makoto Shinkai",css:"saturate(200%) contrast(125%) brightness(115%) hue-rotate(350deg)",overlay:null},{category:"Anime Worlds",name:"KyoAni Soft",css:"saturate(140%) contrast(95%) brightness(115%)",overlay:null},{category:"Anime Worlds",name:"Ufotable Night",css:"saturate(170%) contrast(135%) brightness(105%) hue-rotate(210deg)",overlay:null},{category:"Anime Worlds",name:"MAPPA Dark",css:"saturate(80%) contrast(130%) brightness(90%) hue-rotate(200deg)",overlay:null},{category:"Anime Worlds",name:"90s Retro Anime",css:"sepia(30%) contrast(95%) saturate(120%) brightness(105%) hue-rotate(345deg)",overlay:null},{category:"Anime Worlds",name:"Pastel Shojo",css:"sepia(20%) saturate(130%) contrast(90%) brightness(120%) hue-rotate(330deg)",overlay:null},{category:"Anime Worlds",name:"Isekai Fantasy",css:"saturate(170%) contrast(115%) brightness(110%) hue-rotate(10deg)",overlay:null},{category:"Anime Worlds",name:"Cyberpunk Edgerunner",css:"saturate(180%) contrast(140%) brightness(95%) hue-rotate(290deg)",overlay:null},{category:"Anime Worlds",name:"Shonen Pop",css:"saturate(160%) contrast(120%) brightness(110%)",overlay:null},{category:"Cinematic Worlds",name:"Dune",css:"sepia(45%) hue-rotate(10deg) saturate(130%) contrast(130%) brightness(105%)",overlay:null},{category:"Cinematic Worlds",name:"Twilight",css:"hue-rotate(175deg) saturate(70%) contrast(110%) brightness(90%) sepia(15%)",overlay:null},{category:"Cinematic Worlds",name:"Disney Magic",css:"saturate(220%) contrast(105%) brightness(112%) hue-rotate(350deg)",overlay:null},{category:"Cinematic Worlds",name:"Pixar Glow",css:"brightness(118%) contrast(95%) saturate(170%) hue-rotate(355deg)",overlay:null},{category:"Cinematic Worlds",name:"Avatar: Pandora",css:"hue-rotate(155deg) saturate(210%) contrast(125%) brightness(95%)",overlay:null},{category:"Cinematic Worlds",name:"Interstellar",css:"hue-rotate(195deg) saturate(75%) contrast(125%) brightness(98%) sepia(10%)",overlay:null},{category:"Cinematic Worlds",name:"Mad Max: Fury Road",css:"sepia(60%) hue-rotate(345deg) saturate(200%) contrast(145%) brightness(105%)",overlay:null},{category:"Cinematic Worlds",name:"Lord of the Rings",css:"hue-rotate(20deg) saturate(145%) contrast(118%) brightness(102%) sepia(25%)",overlay:null},{category:"Cinematic Worlds",name:"Blade Runner 2049",css:"sepia(50%) hue-rotate(15deg) saturate(160%) contrast(140%) brightness(88%)",overlay:null},{category:"Cinematic Worlds",name:"Marvel Studios",css:"saturate(175%) contrast(120%) brightness(108%) hue-rotate(185deg)",overlay:null},{category:"Nature & Documentary",name:"National Geographic",css:"sepia(15%) saturate(140%) contrast(115%) brightness(105%) hue-rotate(5deg)",overlay:null},{category:"Nature & Documentary",name:"Planet Earth",css:"saturate(180%) contrast(120%) brightness(108%) hue-rotate(350deg)",overlay:null},{category:"Nature & Documentary",name:"Deep Ocean",css:"hue-rotate(190deg) saturate(160%) contrast(115%) brightness(95%)",overlay:null},{category:"Nature & Documentary",name:"Safari",css:"sepia(40%) saturate(150%) contrast(125%) hue-rotate(345deg)",overlay:null},{category:"Nature & Documentary",name:"Rainforest",css:"hue-rotate(120deg) saturate(150%) contrast(120%) brightness(90%)",overlay:null},{category:"Nature & Documentary",name:"Arctic Frost",css:"hue-rotate(210deg) saturate(70%) contrast(110%) brightness(115%)",overlay:null}]},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.VideoFiltersUI=class Ne{static saveFilterSettings(e){var t,r;if(!this._debouncedFilterSave){const i=((r=(t=window.YPP)==null?void 0:t.Utils)==null?void 0:r.debounce)||((n,s)=>{let o;return(...a)=>{clearTimeout(o),o=setTimeout(()=>n(...a),s)}});this._debouncedFilterSave=i(n=>{var a,l,d;const s=n.filterAdjustments,o={cinemaFilterIndex:n.currentFilterIndex,cinemaFilterIntensity:n.filterIntensity,cinemaFilterBrightness:s.brightness,cinemaFilterContrast:s.contrast,cinemaFilterSaturate:s.saturate,cinemaFilterHue:s.hueRotate,cinemaFilterSepia:s.sepia,cinemaFilterGrayscale:s.grayscale,cinemaFilterInvert:s.invert,cinemaFilterBlur:s.blur,cinemaFilterOpacity:s.opacity,cinemaFilterDehaze:s.dehaze,cinemaFilterClarity:s.clarity,cinemaFilterGrain:s.grain,cinemaFilterSharpness:s.sharpness,cinemaFilterTemperature:s.temperature,cinemaFilterVibrance:s.vibrance,cinemaFilterHighlights:s.highlights,cinemaFilterShadows:s.shadows,cinemaFilterVignette:s.vignette};(l=(a=window.YPP)==null?void 0:a.MainApp)!=null&&l.saveSettings?window.YPP.MainApp.saveSettings(o):(d=chrome==null?void 0:chrome.storage)!=null&&d.local&&chrome.storage.local.get("settings").then(p=>{const u={...p.settings||{},...o};chrome.storage.local.set({settings:u})}).catch(()=>{})},300)}this._debouncedFilterSave(e)}static createFilterPanel(e,t,r){var x,S,E,N,A,Y;const i=document.createElement("div");i.id="ypp-cinema-panel",Object.assign(i.style,{position:"fixed",bottom:"80px",right:"16px",backgroundColor:"rgba(18, 18, 20, 0.65)",backgroundImage:"radial-gradient(ellipse 80% 60% at 0% 0%, color-mix(in srgb, var(--accent-primary, #3ea6ff) 25%, transparent) 0%, transparent 70%), radial-gradient(ellipse 70% 60% at 100% 100%, color-mix(in srgb, var(--accent-secondary, #ff416c) 20%, transparent) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 50% 50%, color-mix(in srgb, var(--accent-secondary, #ff416c) 5%, transparent) 0%, transparent 100%)",border:"1px solid rgba(255, 255, 255, 0.15)",borderTop:"1px solid rgba(255, 255, 255, 0.25)",borderRadius:"20px",zIndex:"2147483646",width:"440px",color:"#fff",fontFamily:"Inter, -apple-system, BlinkMacSystemFont, sans-serif",boxShadow:"0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",backdropFilter:"blur(64px) saturate(180%)",WebkitBackdropFilter:"blur(64px) saturate(180%)",overflow:"hidden",userSelect:"none",display:"flex",flexDirection:"column",animation:"ypp-panel-glass-in 0.3s cubic-bezier(0.2, 0, 0, 1) forwards"});const n=!!((x=r==null?void 0:r.closest)!=null&&x.call(r,".ypp-global-player-bar"));if(n){Object.assign(i.style,{boxShadow:"0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",maxHeight:Math.min(window.innerHeight*.85,560)+"px",overflowY:"auto",overflowX:"hidden",bottom:"auto"});const O=r.closest(".ypp-global-player-bar"),T=Math.max(16,(window.innerHeight-500)/2);O.classList.contains("ypp-bar-pos-right")?(i.style.right="76px",i.style.left="auto",i.style.top=T+"px"):O.classList.contains("ypp-bar-pos-left")?(i.style.left="76px",i.style.right="auto",i.style.top=T+"px"):O.classList.contains("ypp-bar-pos-top")&&(i.style.top="76px",i.style.left="calc(50% - 220px)",i.style.right="auto")}this._injectStyle("ypp-glass-anim",`
            @keyframes ypp-panel-glass-in {
                from { opacity: 0; transform: translateY(12px) scale(calc(0.96 * var(--ypp-auto-scale, 1))); }
                to   { opacity: 1; transform: translateY(0) scale(var(--ypp-auto-scale, 1)); }
            }
            .ypp-cinema-tab-btn {
                flex: 1; padding: 10px; background: transparent; border: none; color: rgba(255,255,255,0.5);
                font-size: 13px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent;
                transition: all 0.2s;
            }
            .ypp-cinema-tab-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .ypp-cinema-tab-btn.active { color: #fff; border-bottom: 2px solid #fff; }
            .ypp-filter-cat-details summary {
                list-style: none; padding: 10px 16px; cursor: pointer; font-size: 13px; font-weight: 600;
                background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.9);
                border-bottom: 1px solid rgba(255,255,255,0.05);
                display: flex; align-items: center; justify-content: space-between;
            }
            .ypp-filter-cat-details summary::-webkit-details-marker { display: none; }
            .ypp-filter-cat-details summary:hover { background: rgba(255,255,255,0.08); color: #fff; }
            .ypp-filter-cat-details summary::after { content: '▼'; font-size: 10px; opacity: 0.5; transition: transform 0.2s; }
            .ypp-filter-cat-details[open] summary::after { transform: rotate(180deg); }
            
            .ypp-filter-card-grid { 
                display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 10px 14px; 
            }
            .ypp-filter-card {
                background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
                border-radius: 8px; padding: 6px 4px; display: flex; flex-direction: column;
                align-items: center; cursor: pointer; transition: all 0.2s cubic-bezier(0.2,0,0,1);
                text-align: center; position: relative; gap: 2px; overflow: hidden;
            }
            .ypp-filter-card:hover {
                background: rgba(255,255,255,0.08); transform: translateY(-2px);
                border-color: rgba(255,255,255,0.2);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }
            .ypp-filter-card.active {
                background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.5);
                box-shadow: 0 6px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.35);
            }
            .ypp-filter-card.active::after {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: inherit;
                box-shadow: 0 0 18px rgba(255,255,255,0.2);
                animation: ypp-card-glow-fade 2.5s ease-in-out infinite;
                pointer-events: none;
            }
            @keyframes ypp-card-glow-fade {
                0%, 100% { opacity: 0.5; }
                50%       { opacity: 1; }
            }
            .ypp-filter-lut-preview {
                width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
                background: linear-gradient(135deg, #ff4b4b, #4b6fff, #4bff8b);
                border: 1px solid rgba(255,255,255,0.2);
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: all 0.3s;
            }
            .ypp-filter-card:hover .ypp-filter-lut-preview {
                transform: scale(1.05); border-color: rgba(255,255,255,0.4);
            }
            
            .ypp-adjust-grid {
                display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 10px;
            }
            .ypp-adjust-card {
                background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
                border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 6px;
            }
            .ypp-adjust-card-header {
                display: flex; justify-content: space-between; align-items: center;
            }
            .ypp-adjust-card-title {
                display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.9);
            }
            .ypp-adjust-card-val {
                font-size: 10px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.3); padding: 2px 5px; border-radius: 8px;
            }
            
            .ypp-vcp-slider {
                -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px;
                background: rgba(255,255,255,0.1); outline: none; margin: 8px 0;
            }
            .ypp-vcp-slider::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none; width: 14px; height: 14px;
                border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                transition: transform 0.1s;
            }
            .ypp-vcp-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        `);const s=document.createElement("div");Object.assign(s.style,{display:"flex",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid rgba(255, 255, 255, 0.1)",fontSize:"15px",fontWeight:"600"}),s.innerHTML=`
            <div style="display: flex; align-items: center; gap: 10px; margin-right: auto;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                </svg>
                Cinematic Filters
            </div>
            <div id="ypp-header-actions" style="display: flex; align-items: center; gap: 10px;"></div>
        `;const o=document.createElement("div");o.className=`ypp-vcp-compare-toggle ${e.isComparing?"active":""}`,o.innerHTML="A/B",o.onclick=O=>{O.stopPropagation(),e.isComparing=!e.isComparing,o.className=`ypp-vcp-compare-toggle ${e.isComparing?"active":""}`,e._applyComputedFilter(t)},s.querySelector("#ypp-header-actions").appendChild(o);const a=document.createElement("button");a.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',Object.assign(a.style,{background:"transparent",border:"none",color:"#f1f1f1",cursor:"pointer",padding:"0",display:"flex",alignItems:"center"}),a.onclick=()=>e._removeFilterPanel(),s.querySelector("#ypp-header-actions").appendChild(a),i.appendChild(s);const l=document.createElement("div");l.style.display="flex",l.style.borderBottom="1px solid rgba(255,255,255,0.1)";const d=document.createElement("button");d.className="ypp-cinema-tab-btn active",d.textContent="Presets";const p=document.createElement("button");p.className="ypp-cinema-tab-btn",p.textContent="Adjustments",l.appendChild(d),l.appendChild(p),i.appendChild(l);const u=document.createElement("div");Object.assign(u.style,{padding:"0",maxHeight:"520px",overflowY:"auto",overflowX:"hidden",background:"transparent",scrollbarWidth:"none",position:"relative"});const h=this.buildPresetsTab(e,t,r),m=this.buildAdjustTab(e,t),y=O=>(O.style.cssText+=";transition:opacity 0.18s ease;",O);y(h),y(m),m.style.display="none",m.style.opacity="0",h.style.opacity="1";let v;const b=(O,F,T,M)=>{T.classList.contains("active")||(M.classList.remove("active"),T.classList.add("active"),F.style.opacity="0",clearTimeout(v),v=setTimeout(()=>{F.style.display="none",O.style.display="block",requestAnimationFrame(()=>{requestAnimationFrame(()=>{O.style.opacity="1"})})},180))};d.onclick=()=>b(h,m,d,p),p.onclick=()=>b(m,h,p,d),u.appendChild(h),u.appendChild(m),i.appendChild(u);const f=document.createElement("div");Object.assign(f.style,{padding:"10px 16px",borderTop:"1px solid rgba(255, 255, 255, 0.1)",display:"flex",justifyContent:"space-between",alignItems:"center"});const g=((Y=(A=(N=(E=(S=window.YPP)==null?void 0:S.features)==null?void 0:E.VideoFiltersPresets)==null?void 0:N.FILTERS)==null?void 0:A[e.currentFilterIndex])==null?void 0:Y.name)||"Normal",_=document.createElement("div");_.id="ypp-active-filter-name",Object.assign(_.style,{fontSize:"12px",color:"#aaaaaa"}),_.textContent=g,f.appendChild(_);const P=document.createElement("button");if(P.innerHTML="<span>Reset All</span>",Object.assign(P.style,{background:"rgba(255,255,255,0.1)",border:"none",color:"#ffffff",borderRadius:"14px",cursor:"pointer",fontSize:"11px",fontWeight:"500",padding:"5px 10px"}),P.onmouseenter=()=>{P.style.background="rgba(255,255,255,0.2)"},P.onmouseleave=()=>{P.style.background="rgba(255,255,255,0.1)"},P.onclick=()=>{e.currentFilterIndex=0,e.filterIntensity=100,e.filterAdjustments={brightness:100,contrast:100,saturate:100,hueRotate:0,sepia:0,grayscale:0,invert:0,blur:0,opacity:100,dehaze:0,clarity:0,grain:0,sharpness:0,temperature:0,vibrance:100,highlights:0,shadows:0,vignette:0},e._applyComputedFilter(t),Ne.saveFilterSettings(e),r&&(r.classList.remove("active"),r.title="Cinema Filters"),e._removeFilterPanel(),this.createFilterPanel(e,t,r)},f.appendChild(P),i.appendChild(f),n){const O=window.YPP.Utils.getPopupPortal();i.style.pointerEvents="auto",i.style.position="absolute",i.style.overflow="hidden",i.style.clipPath="none",i.style.animation="ypp-panel-scale-in 0.22s cubic-bezier(0.2, 0, 0, 1) forwards",O.appendChild(i),this._injectStyle("ypp-scale-anim","@keyframes ypp-panel-scale-in{from{opacity:0;transform:scale(calc(0.92 * var(--ypp-auto-scale, 1)))}to{opacity:1;transform:scale(var(--ypp-auto-scale, 1))}}")}else document.body.appendChild(i);e._filterPanel=i;const w=O=>{e._filterPanel&&!e._filterPanel.contains(O.target)&&!(r!=null&&r.contains(O.target))&&e._removeFilterPanel()};e._filterPanelOutsideHandler=w,setTimeout(()=>e.addListener?e.addListener(document,"click",w):document.addEventListener("click",w),0);const C=O=>{O.key==="Escape"&&e._filterPanel&&e._removeFilterPanel()};e._filterPanelKeydownHandler=C,e.addListener?e.addListener(document,"keydown",C):document.addEventListener("keydown",C)}static buildPresetsTab(e,t,r){const i=document.createElement("div"),n="ypp-fav-filters";let o=(()=>{try{return JSON.parse(localStorage.getItem(n)||"[]")}catch{return[]}})();const a=f=>{try{localStorage.setItem(n,JSON.stringify(f))}catch(g){window.YPP.Utils.log("Failed to save favorite filters","VIDEO-FILTERS","warn",g)}},l=f=>{const g=o.indexOf(f);g===-1?o.push(f):o.splice(g,1),a(o)},d=document.createElement("div");d.className="ypp-vcp-search-wrap",Object.assign(d.style,{margin:"12px 14px",marginBottom:"6px"}),d.innerHTML=`
            <span class="ypp-vcp-search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></span>
            <input type="text" class="ypp-vcp-search-input" placeholder="Search presets (e.g. Night Vision)...">
        `;const p=d.querySelector("input");i.appendChild(d);const u=document.createElement("div");i.appendChild(u);const h='<svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',m='<svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zm-10 6.93l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.81 4.38.38-3.32 2.88 1 4.28L12 16.17z"/></svg>',y=(f,g)=>{const _=document.createElement("div"),P=e.currentFilterIndex===g,w=o.includes(g);_.className=`ypp-filter-card ${P?"active":""}`;const C=f.css==="none"?"grayscale(0%)":f.css;_.innerHTML=`
                <div class="ypp-filter-lut-preview" style="filter:${C}"></div>
                <span style="font-size:10px;font-weight:600;color:${P?"#fff":"rgba(255,255,255,0.8)"};flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">${f.name}</span>
                ${P?'<div class="ypp-card-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div>':""}
                <button class="ypp-star-btn" title="${w?"Remove from Favorites":"Add to Favorites"}" data-fav="${w}">${w?h:m}</button>
            `;const x=_.querySelector(".ypp-star-btn");return x.onclick=S=>{S.stopPropagation(),l(g),b(p.value)},_.onclick=S=>{var A;if(S.target.closest(".ypp-star-btn"))return;S.stopPropagation(),e._previewFilterIndex=void 0,e.currentFilterIndex=g,e._applyComputedFilter(t),Ne.saveFilterSettings(e),r&&(g>0?r.classList.add("active"):r.classList.remove("active")),e._showToast(t,`✨ ${f.name}`);const E=(A=e._filterPanel)==null?void 0:A.querySelector("#ypp-active-filter-name");E&&(E.textContent=f.name),u.querySelectorAll(".ypp-filter-card").forEach(Y=>{Y.classList.remove("active");const O=Y.querySelector("span");O&&(O.style.color="rgba(255,255,255,0.8)");const F=Y.querySelector(".ypp-card-check");F&&F.remove()}),_.classList.add("active");const N=_.querySelector("span");N&&(N.style.color="#fff"),_.querySelector(".ypp-card-check")||x.insertAdjacentHTML("beforebegin",'<div class="ypp-card-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div>')},_.onmouseenter=()=>{e.currentFilterIndex!==g&&(e._previewFilterIndex=e.currentFilterIndex,e.currentFilterIndex=g,e._applyComputedFilter(t))},_.onmouseleave=()=>{e._previewFilterIndex!==void 0&&(e.currentFilterIndex=e._previewFilterIndex,e._previewFilterIndex=void 0,e._applyComputedFilter(t))},_},v=(f,g,_=!1)=>{const P=document.createElement("details");P.className="ypp-filter-cat-details",_&&(P.open=!0);const w=document.createElement("summary");w.innerHTML=f==="⭐ Favorites"?`<span style="display:flex;align-items:center;gap:8px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>${f}</span>`:f,P.appendChild(w);const C=document.createElement("div");return C.className="ypp-filter-card-grid",g.forEach(({filter:x,index:S})=>C.appendChild(y(x,S))),P.appendChild(C),P},b=(f="")=>{var w,C,x;u.innerHTML="";const g=f.toLowerCase(),_=((x=(C=(w=window.YPP)==null?void 0:w.features)==null?void 0:C.VideoFiltersPresets)==null?void 0:x.FILTERS)||[];if(!f&&o.length>0){const S=o.filter(E=>_[E]).map(E=>({filter:_[E],index:E}));S.length&&u.appendChild(v("⭐ Favorites",S,!0))}const P={};if(_.forEach((S,E)=>{if(g&&!S.name.toLowerCase().includes(g)&&!S.category.toLowerCase().includes(g))return;const N=S.category||"Other";P[N]||(P[N]=[]),P[N].push({filter:S,index:E})}),Object.keys(P).forEach(S=>{u.appendChild(v(S,P[S],!!f))}),f&&Object.keys(P).length===0){const S=document.createElement("div");S.style.cssText="padding:40px 20px;text-align:center;color:rgba(255,255,255,0.3);font-size:13px;font-style:italic;",S.textContent="No filters matching your search...",u.appendChild(S)}};return p.oninput=f=>b(f.target.value),b(),this._injectStyle("ypp-star-btn-style",`
            .ypp-star-btn{background:transparent;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:50%;width:20px;height:20px;opacity:0;transition:opacity 0.15s,transform 0.15s;transform:scale(0.85);}
            .ypp-filter-card:hover .ypp-star-btn,.ypp-star-btn[data-fav="true"]{opacity:1;transform:scale(1);}
            .ypp-star-btn:hover{background:rgba(255,215,0,0.12);transform:scale(1.15)!important;}
            .ypp-card-check{background:#fff;color:#000;border-radius:50%;width:14px;height:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        `),i}static buildAdjustTab(e,t){const r=document.createElement("div");Object.assign(r.style,{padding:"8px 0"});const i=document.createElement("div");i.className="ypp-intensity-section",Object.assign(i.style,{padding:"10px 16px 12px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.03)"});const n=document.createElement("div");Object.assign(n.style,{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}),n.innerHTML=`
            <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);display:flex;align-items:center;gap:6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Global Intensity
            </span>
            <span id="ypp-int-val" style="color:#ffffff;font-weight:800;font-size:11px;background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:20px;">${e.filterIntensity}%</span>
        `,i.appendChild(n);const s=document.createElement("input");s.type="range",s.className="ypp-vcp-slider",s.min="0",s.max="100",s.value=e.filterIntensity!==void 0?e.filterIntensity:100,s.style.cssText="width:100%;-webkit-appearance:none;height:4px;border-radius:4px;background:rgba(255,255,255,0.15);outline:none;cursor:pointer;",s.oninput=d=>{e.filterIntensity=Number(d.target.value),i.querySelector("#ypp-int-val").textContent=e.filterIntensity+"%",e._applyComputedFilter(t),Ne.saveFilterSettings(e)},i.appendChild(s),r.appendChild(i);const o={brightness:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>',contrast:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/></svg>',saturate:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>',hueRotate:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',dehaze:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>',clarity:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',sharpness:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>',grain:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM11 7h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm-4-8h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm8-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"/></svg>',sepia:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5S15.01 22 17.5 22s4.5-2.01 4.5-4.5S19.99 13 17.5 13zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>',grayscale:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/></svg>',invert:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 1L1 11l10 10L21 11 11 1zm0 17.17L3.83 11 11 3.83V18.17z"/></svg>',blur:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 5.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-7c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3-6c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>',opacity:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',temperature:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-3 7c-1.65 0-3-1.35-3-3 0-1.3.84-2.4 2-2.82V5c0-.55.45-1 1-1s1 .45 1 1v9.18c1.16.42 2 1.52 2 2.82 0 1.65-1.35 3-3 3z"/></svg>',vibrance:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>',highlights:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>',shadows:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 21h20L12 3zm0 3.99L19.53 19H4.47L12 6.99z"/></svg>',vignette:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>'},a=[{id:"brightness",label:"Brightness",svgKey:"brightness",min:0,max:200,def:100,unit:"%"},{id:"contrast",label:"Contrast",svgKey:"contrast",min:0,max:200,def:100,unit:"%"},{id:"saturate",label:"Saturation",svgKey:"saturate",min:0,max:300,def:100,unit:"%"},{id:"temperature",label:"Temperature",svgKey:"temperature",min:-100,max:100,def:0,unit:"K"},{id:"vibrance",label:"Vibrance",svgKey:"vibrance",min:0,max:200,def:100,unit:"%"},{id:"highlights",label:"Highlights",svgKey:"highlights",min:-100,max:100,def:0,unit:"%"},{id:"shadows",label:"Shadows",svgKey:"shadows",min:-100,max:100,def:0,unit:"%"},{id:"hueRotate",label:"Hue Rotate",svgKey:"hueRotate",min:0,max:360,def:0,unit:"°"},{id:"dehaze",label:"Dehaze",svgKey:"dehaze",min:0,max:100,def:0,unit:"%"},{id:"clarity",label:"Clarity",svgKey:"clarity",min:0,max:100,def:0,unit:"%"},{id:"sharpness",label:"Sharpness",svgKey:"sharpness",min:0,max:100,def:0,unit:"%"},{id:"vignette",label:"Vignette",svgKey:"vignette",min:0,max:100,def:0,unit:"%"},{id:"grain",label:"Film Grain",svgKey:"grain",min:0,max:100,def:0,unit:"%"},{id:"sepia",label:"Sepia",svgKey:"sepia",min:0,max:100,def:0,unit:"%"},{id:"grayscale",label:"Grayscale",svgKey:"grayscale",min:0,max:100,def:0,unit:"%"},{id:"invert",label:"Invert",svgKey:"invert",min:0,max:100,def:0,unit:"%"},{id:"blur",label:"Blur",svgKey:"blur",min:0,max:20,def:0,unit:"px"},{id:"opacity",label:"Opacity",svgKey:"opacity",min:0,max:100,def:100,unit:"%"}];["temperature","vibrance","highlights","shadows","vignette"].forEach(d=>{e.filterAdjustments[d]===void 0&&(e.filterAdjustments[d]=d==="vibrance"?100:0)});const l=document.createElement("div");return l.className="ypp-adjust-grid",a.forEach(d=>{const p=document.createElement("div");p.className="ypp-adjust-card";const u=document.createElement("div");u.className="ypp-adjust-card-header";const h=document.createElement("div");h.className="ypp-adjust-card-title",h.innerHTML=`<span style="opacity:0.7;display:flex;">${o[d.svgKey]||""}</span><span>${d.label}</span>`;const m=document.createElement("div");m.style.display="flex",m.style.alignItems="center",m.style.gap="6px";const y=e.filterAdjustments[d.id]!==void 0?e.filterAdjustments[d.id]:d.def,v=document.createElement("div");v.className="ypp-adjust-card-val",v.textContent=y+d.unit;const b=document.createElement("button");b.innerHTML="↺",Object.assign(b.style,{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:"14px",padding:"0 4px"}),b.title=`Reset ${d.label}`,b.onclick=g=>{g.stopPropagation(),e.filterAdjustments[d.id]=d.def,f.value=d.def,v.textContent=d.def+d.unit,e._applyComputedFilter(t),Ne.saveFilterSettings(e)},b.onmouseenter=()=>b.style.color="#fff",b.onmouseleave=()=>b.style.color="rgba(255,255,255,0.5)",m.appendChild(v),m.appendChild(b),u.appendChild(h),u.appendChild(m);const f=document.createElement("input");f.type="range",f.className="ypp-vcp-slider",f.min=d.min,f.max=d.max,f.value=y,f.oninput=g=>{const _=Number(g.target.value);e.filterAdjustments[d.id]=_,v.textContent=_+d.unit,e._applyComputedFilter(t),Ne.saveFilterSettings(e)},p.appendChild(u),p.appendChild(f),l.appendChild(p)}),r.appendChild(l),r}static _injectStyle(e,t){if(!document.getElementById(e)){const r=document.createElement("style");r.id=e,r.textContent=t,(document.head||document.documentElement).appendChild(r)}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.VideoFiltersOverlay=class{static applyOverlay(e,t,r=0){var l;const i=document.getElementById("movie_player")||document.querySelector(".html5-video-player")||document.body;if(!i)return;const n=i===document.body,s=document.createElement("div");s.id="ypp-filter-overlay",Object.assign(s.style,{position:n?"fixed":"absolute",top:"0",left:"0",width:n?"100vw":"100%",height:n?"100vh":"100%",pointerEvents:"none",zIndex:n?"2147483640":"5"}),this.injectSpecialEffectsSVG();const o=((l=e.filterAdjustments)==null?void 0:l.vignette)||0;let a="";if(o>0){const d=o*2.5,p=o/100;a=`inset 0 0 ${d}px rgba(0,0,0,${p})`}if((r>0||t==="grain_custom")&&(s.style.backgroundImage=`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,s.style.opacity=(r||20)/100,s.style.mixBlendMode="overlay",s.style.pointerEvents="none"),a&&(s.style.boxShadow=a),t==="nightvision")s.style.backgroundImage=`
                radial-gradient(circle, transparent 40%, rgba(0, 30, 0, 0.8) 100%),
                repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)
            `,s.style.boxShadow="inset 0 0 100px rgba(0, 255, 0, 0.1)",s.style.mixBlendMode="multiply";else if(t==="crt")this.injectCRTSVGFilter(),s.style.backgroundImage=`
                radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%),
                repeating-linear-gradient(
                    0deg,
                    rgba(0,0,0,0.15) 0px,
                    rgba(0,0,0,0.15) 1px,
                    transparent 1px,
                    transparent 3px
                ),
                repeating-linear-gradient(
                    90deg,
                    rgba(255, 40,  40,  0.1) 0px,
                    rgba(255, 40,  40,  0.1) 1px,
                    rgba(40,  255, 40,  0.1) 1px,
                    rgba(40,  255, 40,  0.1) 2px,
                    rgba(40,  40,  255, 0.1) 2px,
                    rgba(40,  40,  255, 0.1) 3px,
                    transparent 3px,
                    transparent 3px
                )
            `,s.style.backgroundSize="100% 100%, 100% 3px, 3px 100%",s.style.boxShadow="inset 0 0 80px rgba(0,0,0,0.6)",s.style.borderRadius="6px",s.style.animation="ypp-crt-flicker 3s ease-in-out infinite";else if(t==="vhs"){s.style.backgroundImage=`
                repeating-linear-gradient(
                    0deg,
                    rgba(0,0,0,0.22) 0px,
                    rgba(0,0,0,0.22) 2px,
                    transparent 2px,
                    transparent 5px
                )
            `,s.style.mixBlendMode="multiply";const d=document.createElement("div");Object.assign(d.style,{position:"absolute",left:"0",width:"100%",height:"6px",background:"rgba(255,255,255,0.06)",backdropFilter:"blur(1px)",animation:"ypp-vhs-band 4s linear infinite",pointerEvents:"none"}),s.appendChild(d)}else t==="oldfilm"&&(s.style.backgroundImage=`
                radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)
            `,s.style.animation="ypp-grain 0.1s steps(1) infinite");i.appendChild(s),e._filterOverlay=s,this.injectOverlayCSS()}static injectSVGSharpness(e){if(e<=0)return;const t=e/100*2,r=1+4*t,i=-t,n=`0 ${i} 0 ${i} ${r} ${i} 0 ${i} 0`;let s=document.getElementById("ypp-svg-sharpness-defs");if(s){const o=document.getElementById("ypp-sharpness-kernel")||s.querySelector("feConvolveMatrix");o&&o.setAttribute("kernelMatrix",n)}else{s=document.createElementNS("http://www.w3.org/2000/svg","svg"),s.id="ypp-svg-sharpness-defs",s.style.cssText="position:absolute;width:0;height:0;overflow:hidden;";const o=document.createElementNS("http://www.w3.org/2000/svg","defs"),a=document.createElementNS("http://www.w3.org/2000/svg","filter");a.id="ypp-svg-sharpness";const l=document.createElementNS("http://www.w3.org/2000/svg","feConvolveMatrix");l.setAttribute("order","3 3"),l.setAttribute("preserveAlpha","true"),l.setAttribute("kernelMatrix",n),l.id="ypp-sharpness-kernel",a.appendChild(l),o.appendChild(a),s.appendChild(o),document.body.appendChild(s)}}static injectCRTSVGFilter(){if(document.getElementById("ypp-crt-svg-defs"))return;const e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"svg");t.id="ypp-crt-svg-defs",t.setAttribute("xmlns",e),t.style.cssText="position:absolute;width:0;height:0;overflow:hidden;";const r=document.createElementNS(e,"defs"),i=document.createElementNS(e,"filter");i.id="ypp-crt-rgb",i.setAttribute("x","0%"),i.setAttribute("y","0%"),i.setAttribute("width","100%"),i.setAttribute("height","100%"),i.setAttribute("color-interpolation-filters","sRGB");const n=(s,o)=>{const a=document.createElementNS(e,s);return Object.entries(o).forEach(([l,d])=>a.setAttribute(l,d)),a};i.append(n("feOffset",{in:"SourceGraphic",dx:"1.5",dy:"0",result:"rShifted"}),n("feColorMatrix",{in:"rShifted",type:"matrix",values:"1 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0",result:"rOnly"}),n("feColorMatrix",{in:"SourceGraphic",type:"matrix",values:"0 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 1 0",result:"gOnly"}),n("feOffset",{in:"SourceGraphic",dx:"-1.5",dy:"0",result:"bShifted"}),n("feColorMatrix",{in:"bShifted",type:"matrix",values:"0 0 0 0 0   0 0 0 0 0   0 0 1 0 0   0 0 0 1 0",result:"bOnly"}),n("feBlend",{in:"rOnly",in2:"gOnly",mode:"screen",result:"rg"}),n("feBlend",{in:"rg",in2:"bOnly",mode:"screen"})),r.appendChild(i),t.appendChild(r),document.body.appendChild(t)}static injectSpecialEffectsSVG(){if(document.getElementById("ypp-special-fx-defs"))return;const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.id="ypp-special-fx-defs",t.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",t.innerHTML=`
            <defs>
                <filter id="ypp-fx-matrix" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="
                        0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"/>
                </filter>
                <filter id="ypp-fx-edge" color-interpolation-filters="sRGB">
                    <feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="
                        -1 -1 -1
                        -1  8 -1
                        -1 -1 -1"/>
                </filter>
                <filter id="ypp-fx-emboss" color-interpolation-filters="sRGB">
                    <feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="
                        -2 -1  0
                        -1  1  1
                         0  1  2"/>
                </filter>
                <filter id="ypp-fx-posterize" color-interpolation-filters="sRGB">
                    <feComponentTransfer>
                        <feFuncR type="discrete" tableValues="0 0.1 0.25 0.5 0.75 0.9 1"/>
                        <feFuncG type="discrete" tableValues="0 0.1 0.25 0.5 0.75 0.9 1"/>
                        <feFuncB type="discrete" tableValues="0 0.1 0.25 0.5 0.75 0.9 1"/>
                    </feComponentTransfer>
                </filter>
                <filter id="ypp-fx-colorize" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
                    <feComponentTransfer in="gray">
                        <feFuncR type="table" tableValues="0.05 0.3 0.8 1.0 1.0"/>
                        <feFuncG type="table" tableValues="0.00 0.0 0.1 0.7 1.0"/>
                        <feFuncB type="table" tableValues="0.10 0.4 0.3 0.1 1.0"/>
                    </feComponentTransfer>
                </filter>
                <filter id="ypp-fx-technicolor" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
                    <feComponentTransfer in="gray">
                        <feFuncR type="table" tableValues="0.0 0.3 0.7 0.9 1.0"/>
                        <feFuncG type="table" tableValues="0.1 0.2 0.5 0.8 0.95"/>
                        <feFuncB type="table" tableValues="0.2 0.4 0.2 0.4 0.9"/>
                    </feComponentTransfer>
                </filter>
                <filter id="ypp-fx-dreamcolor" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
                    <feComponentTransfer in="gray">
                        <feFuncR type="table" tableValues="0.1 0.4 0.8 0.5 0.9"/>
                        <feFuncG type="table" tableValues="0.0 0.2 0.5 0.8 1.0"/>
                        <feFuncB type="table" tableValues="0.3 0.5 0.7 0.9 0.9"/>
                    </feComponentTransfer>
                </filter>
                <filter id="ypp-fx-glitch" color-interpolation-filters="sRGB">
                    <feOffset in="SourceGraphic" dx="6" dy="0" result="red-shift"/>
                    <feOffset in="SourceGraphic" dx="-6" dy="0" result="blue-shift"/>
                    <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-only"/>
                    <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green-only"/>
                    <feColorMatrix in="blue-shift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-only"/>
                    <feBlend mode="screen" in="red-only" in2="green-only" result="red-green"/>
                    <feBlend mode="screen" in="red-green" in2="blue-only"/>
                </filter>
            </defs>
        `,document.body.appendChild(t)}static injectOverlayCSS(){if(document.getElementById("ypp-overlay-css"))return;const e=document.createElement("style");e.id="ypp-overlay-css",e.textContent=`
            @keyframes ypp-crt-flicker {
                0%   { opacity: 1; }
                48%  { opacity: 1; }
                50%  { opacity: 0.94; }
                52%  { opacity: 1; }
                88%  { opacity: 1; }
                90%  { opacity: 0.97; }
                92%  { opacity: 1; }
            }
            @keyframes ypp-vhs-band {
                0%   { top: -8px; }
                100% { top: 102%; }
            }
            @keyframes ypp-grain {
                0%  { background-position: 0% 0%; }
                10% { background-position: -5% -5%; }
                20% { background-position: -10% 5%; }
                30% { background-position: 5% -10%; }
                40% { background-position: -5% 15%; }
                50% { background-position: -10% 5%; }
                60% { background-position: 15% 0%; }
                70% { background-position: 0% 10%; }
                80% { background-position: -15% 0%; }
                90% { background-position: 10% 5%; }
                100%{ background-position: 5% 0%; }
            }
        `,document.head.appendChild(e)}static removeOverlay(e){e._filterOverlay&&(e._filterOverlay.remove(),e._filterOverlay=null);const t=document.getElementById("ypp-crt-svg-defs");t&&t.remove()}static setupDynamicSVGFilter(){if(document.getElementById("ypp-dynamic-svg-grade"))return;const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.id="ypp-dynamic-svg-grade",t.style.cssText="position:absolute;width:0;height:0;overflow:hidden;",t.innerHTML=`
            <defs>
                <filter id="ypp-dynamic-filter" color-interpolation-filters="sRGB">
                    <feComponentTransfer id="ypp-svg-curves">
                        <feFuncR type="table" tableValues="0 1"/>
                        <feFuncG type="table" tableValues="0 1"/>
                        <feFuncB type="table" tableValues="0 1"/>
                    </feComponentTransfer>
                </filter>
            </defs>
        `,document.body.appendChild(t)}static updateDynamicSVGFilter(e){this.setupDynamicSVGFilter();const t=document.getElementById("ypp-svg-curves");if(!t)return;const r=20,i=[],n=[],s=[];for(let o=0;o<=r;o++){let a=o/r;if(e.shadows!==0){const u=Math.max(0,1-a*2);a+=e.shadows/100*.4*u}if(e.highlights!==0){const u=Math.max(0,(a-.5)*2);a+=e.highlights/100*.4*u}if(e.contrast!==100){const u=e.contrast/100;a=(a-.5)*u+.5}e.brightness!==100&&(a=a*(e.brightness/100)),a=Math.max(0,Math.min(1,a));let l=a,d=a,p=a;if(e.temperature!==0){const u=e.temperature/100;u>0?(l=Math.min(1,l*(1+u*.2)),p=Math.max(0,p*(1-u*.15))):(l=Math.max(0,l*(1+u*.15)),p=Math.min(1,p*(1-u*.2)))}i.push(l),n.push(d),s.push(p)}t.querySelector("feFuncR").setAttribute("tableValues",i.map(o=>o.toFixed(3)).join(" ")),t.querySelector("feFuncG").setAttribute("tableValues",n.map(o=>o.toFixed(3)).join(" ")),t.querySelector("feFuncB").setAttribute("tableValues",s.map(o=>o.toFixed(3)).join(" "))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.VideoFilters=class extends window.YPP.features.BaseFeature{constructor(){super("VideoFilters"),this.name="VideoFilters",this.currentFilterIndex=0,this.filterIntensity=100,this.isComparing=!1,this.filterAdjustments={brightness:100,contrast:100,saturate:100,hueRotate:0,sepia:0,grayscale:0,invert:0,blur:0,opacity:100,dehaze:0,clarity:0,grain:0,sharpness:0,temperature:0,vibrance:100,highlights:0,shadows:0,vignette:0},this._filterOverlay=null,this._filterPanel=null,this._filterBtn=null,this._filterPanelOutsideHandler=null,this._previewFilterIndex=void 0}getConfigKey(){return"enableCinemaFilters"}async enable(){if(await super.enable(),!this.settings||!this.settings.enableCinemaFilters)return;const e=document.querySelector("video");e&&this._restoreFilterState(e)}async disable(){var e,t;await super.disable();try{window.YPP.features.VideoFiltersOverlay.removeOverlay(this),this._removeFilterPanel(),this._filterBtn&&(this._filterBtn.remove(),this._filterBtn=null)}catch(r){(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,"[YPP] VideoFilters disable error: "+r.message,"VideoFilters","error")}}onUpdate(){this.enable()}onPageChange(){if(!this.settings||!this.settings.enableCinemaFilters)return;const e=document.querySelector("video");e&&this._restoreFilterState(e)}onVideoChange(e){if(!this.settings||!this.settings.enableCinemaFilters)return;const t=e||document.querySelector(".html5-main-video")||document.querySelector("video");t&&this._restoreFilterState(t)}createButton(e){const t='<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"/></svg>',r=document.createElement("button");return r.innerHTML=t,r.title="Cinema Filters",r.className="ypp-action-btn",r.onclick=i=>{i.stopPropagation();const n=document.querySelector(".html5-main-video")||document.querySelector("video");this.toggleFilterPanel(n,r)},this._filterBtn=r,r}toggleFilterPanel(e,t){if(this._filterPanel){this._removeFilterPanel();return}window.YPP.features.VideoFiltersUI.createFilterPanel(this,e,t)}_removeFilterPanel(){this._filterPanel&&(this._filterPanel.remove(),this._filterPanel=null),this._filterPanelOutsideHandler&&(this.removeListener?this.removeListener(document,"click",this._filterPanelOutsideHandler):document.removeEventListener("click",this._filterPanelOutsideHandler),this._filterPanelOutsideHandler=null),this._filterPanelKeydownHandler&&(this.removeListener?this.removeListener(document,"keydown",this._filterPanelKeydownHandler):document.removeEventListener("keydown",this._filterPanelKeydownHandler),this._filterPanelKeydownHandler=null),this._filterPanelResizeHandler&&(this.removeListener?this.removeListener(window,"resize",this._filterPanelResizeHandler):window.removeEventListener("resize",this._filterPanelResizeHandler),this._filterPanelResizeHandler=null),this._previewFilterIndex=void 0}_applyComputedFilter(e){if(e=e||document.querySelector(".html5-main-video")||document.querySelector("video"),!e)return;if(this.isComparing){e.style.setProperty("filter","none","important"),e.style.setProperty("opacity","1","important"),window.YPP.features.VideoFiltersOverlay.removeOverlay(this);return}const t=window.YPP.features.VideoFiltersPresets.FILTERS[this.currentFilterIndex],r=this.filterAdjustments,i=this.filterIntensity/100,n=(v,b=100)=>b+(v-b)*i;let s=r.contrast,o=r.brightness;r.dehaze>0&&(s+=r.dehaze*.5,o-=r.dehaze*.1),r.clarity>0&&(s+=r.clarity*.3);let a=!1;(s!==100||o!==100||r.shadows!==0||r.highlights!==0||r.temperature!==0)&&(window.YPP.features.VideoFiltersOverlay.updateDynamicSVGFilter({brightness:o,contrast:s,shadows:r.shadows||0,highlights:r.highlights||0,temperature:r.temperature||0}),a=!0);let d=r.saturate;r.vibrance!==void 0&&r.vibrance!==100&&(d=d*(r.vibrance/100));const p=[a?"url(#ypp-dynamic-filter)":"",d!==100?`saturate(${n(d)}%)`:"",r.hueRotate!==0?`hue-rotate(${r.hueRotate*i}deg)`:"",r.sepia>0?`sepia(${r.sepia*i}%)`:"",r.grayscale>0?`grayscale(${r.grayscale*i}%)`:"",r.invert>0?`invert(${r.invert*i}%)`:"",r.blur>0?`blur(${r.blur*i}px)`:"",r.opacity!==100?`opacity(${n(r.opacity)}%)`:""].filter(Boolean).join(" ");let u="none";t.css!=="none"&&p?u=`${t.css} ${p}`:t.css!=="none"?u=t.css:p&&(u=p),r.sharpness>0&&(window.YPP.features.VideoFiltersOverlay.injectSVGSharpness(r.sharpness),u+=" url(#ypp-svg-sharpness)"),e.style.setProperty("filter",u,"important");const h=`${this.currentFilterIndex}:${r.grain}:${r.vignette}`,m=t.overlay||r.grain>0||r.vignette>0||t.name==="Night Vision",y=this._lastOverlayKey!==h;m?y&&(window.YPP.features.VideoFiltersOverlay.removeOverlay(this),window.YPP.features.VideoFiltersOverlay.applyOverlay(this,t.overlay,r.grain),this._lastOverlayKey=h):(window.YPP.features.VideoFiltersOverlay.removeOverlay(this),this._lastOverlayKey=null)}_restoreFilterState(e){const t=this.settings||{};t.cinemaFilterBrightness!==void 0&&(this.filterAdjustments.brightness=t.cinemaFilterBrightness),t.cinemaFilterContrast!==void 0&&(this.filterAdjustments.contrast=t.cinemaFilterContrast),t.cinemaFilterSaturate!==void 0&&(this.filterAdjustments.saturate=t.cinemaFilterSaturate),t.cinemaFilterHue!==void 0&&(this.filterAdjustments.hueRotate=t.cinemaFilterHue),t.cinemaFilterSepia!==void 0&&(this.filterAdjustments.sepia=t.cinemaFilterSepia),t.cinemaFilterGrayscale!==void 0&&(this.filterAdjustments.grayscale=t.cinemaFilterGrayscale),t.cinemaFilterInvert!==void 0&&(this.filterAdjustments.invert=t.cinemaFilterInvert),t.cinemaFilterBlur!==void 0&&(this.filterAdjustments.blur=t.cinemaFilterBlur),t.cinemaFilterOpacity!==void 0&&(this.filterAdjustments.opacity=t.cinemaFilterOpacity),t.cinemaFilterDehaze!==void 0&&(this.filterAdjustments.dehaze=t.cinemaFilterDehaze),t.cinemaFilterClarity!==void 0&&(this.filterAdjustments.clarity=t.cinemaFilterClarity),t.cinemaFilterGrain!==void 0&&(this.filterAdjustments.grain=t.cinemaFilterGrain),t.cinemaFilterSharpness!==void 0&&(this.filterAdjustments.sharpness=t.cinemaFilterSharpness),t.cinemaFilterIndex!==void 0&&(this.currentFilterIndex=t.cinemaFilterIndex),t.cinemaFilterIntensity!==void 0&&(this.filterIntensity=t.cinemaFilterIntensity),t.cinemaFilterTemperature!==void 0&&(this.filterAdjustments.temperature=t.cinemaFilterTemperature),t.cinemaFilterVibrance!==void 0&&(this.filterAdjustments.vibrance=t.cinemaFilterVibrance),t.cinemaFilterHighlights!==void 0&&(this.filterAdjustments.highlights=t.cinemaFilterHighlights),t.cinemaFilterShadows!==void 0&&(this.filterAdjustments.shadows=t.cinemaFilterShadows),t.cinemaFilterVignette!==void 0&&(this.filterAdjustments.vignette=t.cinemaFilterVignette),(this.currentFilterIndex>0||this.filterAdjustments.brightness!==100||this.filterAdjustments.contrast!==100||this.filterAdjustments.saturate!==100||this.filterAdjustments.hueRotate!==0||this.filterAdjustments.sepia!==0||this.filterAdjustments.grayscale!==0||this.filterAdjustments.invert!==0||this.filterAdjustments.blur!==0||this.filterAdjustments.opacity!==100||this.filterAdjustments.dehaze!==0||this.filterAdjustments.clarity!==0||this.filterAdjustments.grain!==0||this.filterAdjustments.sharpness!==0)&&e&&this._applyComputedFilter(e)}_showToast(e,t){if(this.utils&&this.utils.createToast)this.utils.createToast(t);else{const r=document.createElement("div");r.className="ypp-toast-mini",r.textContent=t;const i=document.getElementById("movie_player")||(e==null?void 0:e.parentElement)||document.body;i&&(i.appendChild(r),this.pollFor(()=>!1,2e3,2e3).catch(()=>r.remove()))}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.VolumeBoosterUI=class me{static saveVolumeSettings(e){var t,r;if(!this.debouncedSave){const i=((r=(t=window.YPP)==null?void 0:t.Utils)==null?void 0:r.debounce)||((n,s)=>{let o;return(...a)=>{clearTimeout(o),o=setTimeout(()=>n(...a),s)}});this.debouncedSave=i(n=>{var s,o;(o=(s=window.YPP)==null?void 0:s.MainApp)!=null&&o.saveSettings&&window.YPP.MainApp.saveSettings({volumeLevel:n._volumeGain,volumeBalance:n._balance,volumeCompressor:n._compressorEnabled,volumeMono:n._monoEnabled,volumeEqBands:JSON.stringify(n._eqGains)})},300)}this.debouncedSave(e)}static toggleEQPanel(e,t,r){if(t=document.querySelector(".html5-main-video")||document.querySelector("video"),e._volumePopup){e._volumePopup.remove(),e._volumePopup=null,r.classList.remove("active"),e._volumePopupOutsideHandler&&(e.removeListener?e.removeListener(document,"click",e._volumePopupOutsideHandler):document.removeEventListener("click",e._volumePopupOutsideHandler),e._volumePopupOutsideHandler=null),e._volumePopupEscapeHandler&&(e.removeListener?e.removeListener(document,"keydown",e._volumePopupEscapeHandler):document.removeEventListener("keydown",e._volumePopupEscapeHandler),e._volumePopupEscapeHandler=null);return}this.injectEQStyles(),r.classList.add("active");const i=document.createElement("div");i.id="ypp-eq-panel";const n=!!r.closest(".ypp-global-player-bar");if(n){i.style.boxShadow="0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)";const I=r.closest(".ypp-global-player-bar");i.style.bottom="auto";const q=Math.max(16,(window.innerHeight-400)/2);I.classList.contains("ypp-bar-pos-right")?(i.style.right="76px",i.style.left="auto",i.style.top=q+"px"):I.classList.contains("ypp-bar-pos-left")?(i.style.left="76px",i.style.right="auto",i.style.top=q+"px"):I.classList.contains("ypp-bar-pos-top")&&(i.style.top="76px",i.style.left="calc(50% - 215px)",i.style.right="auto")}const s=document.createElement("div");s.className="ypp-eq-header",s.innerHTML=`
            <div class="ypp-eq-title-group">
                <div class="ypp-eq-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                        <path d="M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z"/>
                    </svg>
                </div>
                <div>
                    <div class="ypp-eq-title">Equalizer</div>
                    <div class="ypp-eq-subtitle">10-Band · Pro Audio Engine</div>
                </div>
            </div>
            <button class="ypp-eq-close-btn" id="ypp-eq-close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `,i.appendChild(s),s.querySelector("#ypp-eq-close").onclick=()=>this.toggleEQPanel(e,t,r);const o=document.createElement("div");o.className="ypp-eq-gain-row";const a=document.createElement("span");a.className="ypp-eq-gain-value",a.textContent=Math.round(e._volumeGain*100)+"%";const l=document.createElement("input");l.type="range",l.min=1,l.max=6,l.step=.05,l.value=e._volumeGain,l.className="ypp-eq-hslider",l.oninput=I=>{e.ctx&&e.ctx.state==="suspended"&&e.ctx.resume();const D=parseFloat(I.target.value);e.setVolume(D),a.textContent=Math.round(D*100)+"%",r.classList.toggle("active",D>1.01||e._eqGains.some(q=>q!==0)||e._balance!==0),me.saveVolumeSettings(e),this.updateGainTrack(l)},o.innerHTML='<span class="ypp-eq-row-label">Volume Boost</span>',o.appendChild(l),o.appendChild(a),i.appendChild(o),this.updateGainTrack(l);const d=document.createElement("div");d.className="ypp-eq-gain-row";const p=document.createElement("span");p.className="ypp-eq-gain-value",p.textContent=e._balance===0?"C":e._balance<0?"L"+Math.abs(Math.round(e._balance*100)):"R"+Math.round(e._balance*100);const u=document.createElement("input");u.type="range",u.min=-1,u.max=1,u.step=.05,u.value=e._balance,u.className="ypp-eq-hslider ypp-eq-balance-slider",u.oninput=I=>{e.ctx&&e.ctx.state==="suspended"&&e.ctx.resume();const D=parseFloat(I.target.value);e.setBalance(D),p.textContent=D===0?"C":D<0?"L"+Math.abs(Math.round(D*100)):"R"+Math.round(D*100),r.classList.toggle("active",e._volumeGain>1.01||e._eqGains.some(q=>q!==0)||D!==0),this.updateBalanceTrack(u),me.saveVolumeSettings(e)},u.ondblclick=()=>{e.ctx&&e.ctx.state==="suspended"&&e.ctx.resume(),e.setBalance(0),u.value=0,p.textContent="C",this.updateBalanceTrack(u),me.saveVolumeSettings(e)},d.innerHTML='<span class="ypp-eq-row-label">Balance</span>',d.appendChild(u),d.appendChild(p),i.appendChild(d),this.updateBalanceTrack(u);const h=document.createElement("div");h.style.cssText="display:flex;border-bottom:1px solid rgba(255,255,255,0.08);";const m=(I,D)=>{const q=document.createElement("button");q.textContent=I;const $=n?"6px":"10px",J=n?"10px":"12px";return q.style.cssText=`flex:1;padding:${$};background:transparent;border:none;color:${D?"#fff":"rgba(255,255,255,0.45)"};font-size:${J};font-weight:600;cursor:pointer;border-bottom:2px solid ${D?"rgba(255,255,255,0.7)":"transparent"};transition:all 0.2s;font-family:inherit;`,q.onmouseenter=()=>{q.classList.contains("active")||(q.style.color="rgba(255,255,255,0.75)")},q.onmouseleave=()=>{q.classList.contains("active")||(q.style.color="rgba(255,255,255,0.45)")},D&&q.classList.add("active"),q},y=m("Equalizer",!0),v=m("Dynamics",!1),b=m("Spatial",!1);h.append(y,v,b),i.appendChild(h);const f=document.createElement("div");f.className="ypp-eq-presets-row";let g=null;Object.keys(e._presets).forEach(I=>{const D=document.createElement("button");D.className="ypp-eq-preset-btn",D.textContent=I,I==="Flat"&&(D.classList.add("active"),g=D),D.onclick=()=>{e._applyPreset(I),this.syncBandUI(e,i,_),g&&g.classList.remove("active"),D.classList.add("active"),g=D,me.saveVolumeSettings(e)},f.appendChild(D)}),i.appendChild(f);const _=document.createElement("canvas");_.width=n?268:340,_.height=n?52:72,_.className="ypp-eq-canvas";const P=document.createElement("div");P.className="ypp-eq-bands",e._bands.forEach((I,D)=>{const q=document.createElement("div");q.className="ypp-eq-band-col";const $=document.createElement("div");$.className="ypp-eq-band-db",$.style.color=I.color;const J=e._eqGains[D];$.textContent=(J>=0?"+":"")+J;const _e=document.createElement("div");_e.className="ypp-eq-band-track";const Ye=document.createElement("div");Ye.className="ypp-eq-band-center";const X=document.createElement("input");X.type="range",X.min=-12,X.max=12,X.step=.5,X.value=e._eqGains[D],X.className="ypp-eq-vslider",X.style.setProperty("--band-color",I.color),X.dataset.band=D,X.oninput=Ce=>{e.ctx&&e.ctx.state==="suspended"&&e.ctx.resume();const ie=parseFloat(Ce.target.value);e._setEQBand(D,ie),$.textContent=(ie>=0?"+":"")+ie,this.drawCurve(e,_),g&&(g.classList.remove("active"),g=null),me.saveVolumeSettings(e)},X.ondblclick=()=>{e.ctx&&e.ctx.state==="suspended"&&e.ctx.resume(),e._setEQBand(D,0),X.value=0,$.textContent="0",this.drawCurve(e,_),me.saveVolumeSettings(e)};const we=document.createElement("div");we.className="ypp-eq-band-freq",we.textContent=I.label,_e.append(Ye,X),q.append($,_e,we),P.appendChild(q)});const w=document.createElement("div");w.id="ypp-eq-tab-eq",w.appendChild(_),w.appendChild(P),i.appendChild(w);const C=document.createElement("div");C.id="ypp-eq-tab-dyn",C.style.display="none",C.style.cssText="padding:16px 18px;display:none;";const x=(I,D,q,$,J,_e,Ye)=>{const X=document.createElement("div");X.style.cssText="display:flex;align-items:center;gap:12px;margin-bottom:14px;";const we=document.createElement("span");we.style.cssText="font-size:10px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.5px;min-width:80px;",we.textContent=I;const Ce=document.createElement("span");Ce.style.cssText="font-size:11px;font-weight:800;color:#fff;min-width:36px;text-align:right;",Ce.textContent=J+_e;const ie=document.createElement("input");return ie.type="range",ie.min=D,ie.max=q,ie.step=$,ie.value=J,ie.className="ypp-eq-hslider",ie.style.flex="1",ie.oninput=De=>{Ce.textContent=De.target.value+_e,Ye(parseFloat(De.target.value))},X.append(we,ie,Ce),X};e.compressorNode?(C.appendChild(x("Threshold",-60,0,1,-24,"dB",I=>{e.compressorNode.threshold.value=I})),C.appendChild(x("Ratio",1,20,.5,4,":1",I=>{e.compressorNode.ratio.value=I})),C.appendChild(x("Attack",0,1,.01,.003,"s",I=>{e.compressorNode.attack.value=I})),C.appendChild(x("Release",0,1,.01,.25,"s",I=>{e.compressorNode.release.value=I})),C.appendChild(x("Knee",0,40,1,30,"dB",I=>{e.compressorNode.knee.value=I}))):C.innerHTML='<div style="padding:20px;text-align:center;color:rgba(255,255,255,0.3);font-size:12px;">Compressor unavailable — audio not initialised yet.</div>',i.appendChild(C);const S=document.createElement("div");S.id="ypp-eq-tab-spa",S.style.cssText="padding:16px 18px;display:none;";const E=x("Stereo Width",0,200,1,100,"%",I=>{e.setWidth&&e.setWidth(I/100)});S.appendChild(E);const N=x("Mono Mix",0,100,1,0,"%",I=>{e.setMono&&(e.setMono(I>50),me.saveVolumeSettings(e))});S.appendChild(N),i.appendChild(S);const A=[w,C,S],Y=[y,v,b];Y.forEach((I,D)=>{I.onclick=()=>{Y.forEach((q,$)=>{const J=D===$;q.classList.toggle("active",J),q.style.color=J?"#fff":"rgba(255,255,255,0.45)",q.style.borderBottom=`2px solid ${J?"rgba(255,255,255,0.7)":"transparent"}`,A[$].style.display=J?"":"none"})}});const O=document.createElement("div");O.className="ypp-eq-footer";const F=document.createElement("button");F.className="ypp-eq-comp-btn"+(e._compressorEnabled?" active":""),F.innerHTML=`
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            Compressor
        `,F.onclick=()=>{e.ctx&&e.ctx.state==="suspended"&&e.ctx.resume(),e._compressorEnabled=!e._compressorEnabled,F.classList.toggle("active",e._compressorEnabled),e.compressorNode&&(e.compressorNode.ratio.value=e._compressorEnabled?4:1,e.compressorNode.threshold.value=e._compressorEnabled?-24:0),me.saveVolumeSettings(e)};const T=document.createElement("button");T.className="ypp-eq-comp-btn"+(e._monoEnabled?" active":""),T.innerHTML=`
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-2-10h4v6h-4z"/>
            </svg>
            Mono
        `,T.onclick=()=>{e.ctx&&e.ctx.state==="suspended"&&e.ctx.resume(),e.setMono(!e._monoEnabled),T.classList.toggle("active",e._monoEnabled),me.saveVolumeSettings(e)};const M=document.createElement("button");M.className="ypp-eq-reset-btn",M.textContent="Reset All",M.onclick=()=>{e.ctx&&e.ctx.state==="suspended"&&e.ctx.resume();for(let D=0;D<10;D++)e._setEQBand(D,0);this.syncBandUI(e,i,_),g&&g.classList.remove("active");const I=f.querySelector(".ypp-eq-preset-btn");I&&I.classList.add("active"),g=I,me.saveVolumeSettings(e)};const L=document.createElement("div");if(L.className="ypp-eq-hint",L.textContent="Dbl-click to center/zero",O.append(F,T,M,L),i.appendChild(O),n){const I=window.YPP.Utils.getPopupPortal();i.style.pointerEvents="auto",i.style.position="absolute",i.style.overflow="hidden",i.style.clipPath="none",I.appendChild(i)}else document.body.appendChild(i);e._volumePopup=i,H({targets:i.querySelectorAll(".ypp-eq-band-col"),translateY:[20,0],opacity:[0,1],delay:H.stagger(30,{start:150}),easing:"spring(1, 80, 10, 0)",duration:600});let k=null;const R=()=>{e._volumePopup&&(e.analyserNode&&this.drawCurve(e,_,!0),k=requestAnimationFrame(R))};R(),e.analyserNode||this.drawCurve(e,_);const U=I=>{e._volumePopup&&!e._volumePopup.contains(I.target)&&!r.contains(I.target)&&(k&&cancelAnimationFrame(k),this.toggleEQPanel(e,t,r))};e._volumePopupOutsideHandler=U,setTimeout(()=>e.addListener?e.addListener(document,"click",U):document.addEventListener("click",U),0);const j=I=>{I.key==="Escape"&&e._volumePopup&&(k&&cancelAnimationFrame(k),this.toggleEQPanel(e,t,r))};e._volumePopupEscapeHandler=j,e.addListener?e.addListener(document,"keydown",j):document.addEventListener("keydown",j)}static syncBandUI(e,t,r){const i=t.querySelectorAll(".ypp-eq-vslider"),n=t.querySelectorAll(".ypp-eq-band-db");i.forEach((s,o)=>{s.value=e._eqGains[o]}),n.forEach((s,o)=>{const a=e._eqGains[o];s.textContent=(a>=0?"+":"")+a}),e.analyserNode||this.drawCurve(e,r)}static updateGainTrack(e){const t=(parseFloat(e.value)-1)/5*100;e.style.background=`linear-gradient(90deg, rgba(255,255,255,0.85) ${t}%, rgba(255,255,255,0.1) ${t}%)`}static updateBalanceTrack(e){const t=parseFloat(e.value),r=(t+1)/2*100;t<0?e.style.background=`linear-gradient(90deg, rgba(255,255,255,0.1) ${r}%, rgba(255,255,255,0.85) ${r}%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.1) 50%)`:e.style.background=`linear-gradient(90deg, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.85) ${r}%, rgba(255,255,255,0.1) ${r}%)`}static drawCurve(e,t,r=!1){const i=t.getContext("2d"),n=t.width,s=t.height;i.clearRect(0,0,n,s);const o=Math.log10(20),a=Math.log10(2e4),l=13;if(r&&e.analyserNode){const h=e.analyserNode.frequencyBinCount,m=new Uint8Array(h);e.analyserNode.getByteFrequencyData(m),i.fillStyle="rgba(255, 255, 255, 0.15)";const y=n/h*2.5;let v,b=0;for(let f=0;f<h;f++)v=m[f]/255*s,i.fillRect(b,s-v,y-1,v),b+=y}i.strokeStyle="rgba(255,255,255,0.07)",i.lineWidth=1,i.beginPath(),i.moveTo(0,s/2),i.lineTo(n,s/2),i.stroke(),e._bands.forEach(h=>{const m=(Math.log10(h.freq)-o)/(a-o)*n;i.strokeStyle="rgba(255,255,255,0.06)",i.lineWidth=1,i.setLineDash([2,5]),i.beginPath(),i.moveTo(m,0),i.lineTo(m,s),i.stroke(),i.setLineDash([])});const d=h=>{let m=0;return e._bands.forEach((y,v)=>{const b=e._eqGains[v];if(b===0)return;const f=y.type==="peaking"?.85:1.6,g=Math.log2(h/y.freq)/f;m+=b*Math.exp(-g*g*2.2)}),Math.max(-l,Math.min(l,m))},p=[];for(let h=0;h<=n;h++){const m=o+h/n*(a-o),y=d(Math.pow(10,m));p.push([h,s/2-y/l*(s/2-5)])}const u=i.createLinearGradient(0,0,0,s);u.addColorStop(0,"rgba(255, 255, 255, 0.20)"),u.addColorStop(.5,"rgba(255, 255, 255, 0.05)"),u.addColorStop(1,"rgba(255, 255, 255, 0.01)"),i.beginPath(),i.moveTo(0,s/2),p.forEach(([h,m])=>i.lineTo(h,m)),i.lineTo(n,s/2),i.closePath(),i.fillStyle=u,i.fill(),i.beginPath(),i.moveTo(p[0][0],p[0][1]),p.forEach(([h,m])=>i.lineTo(h,m)),i.strokeStyle="rgba(255, 255, 255, 0.85)",i.lineWidth=2.5,i.lineJoin="round",i.stroke()}static injectEQStyles(){if(document.getElementById("ypp-eq-styles"))return;const e=document.createElement("style");e.id="ypp-eq-styles",e.textContent=`
/* ── EQ Panel ── */
#ypp-eq-panel {
    position: fixed;
    bottom: 80px;
    right: 16px;
    width: 430px;
    background-color: rgba(18, 18, 20, 0.65);
    background-image: radial-gradient(ellipse 80% 60% at 0% 0%, color-mix(in srgb, var(--accent-primary, #3ea6ff) 25%, transparent) 0%, transparent 70%), radial-gradient(ellipse 70% 60% at 100% 100%, color-mix(in srgb, var(--accent-secondary, #ff416c) 20%, transparent) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 50% 50%, color-mix(in srgb, var(--accent-secondary, #ff416c) 5%, transparent) 0%, transparent 100%);
    border: 1px solid rgba(255,255,255,0.15);
    border-top: 1px solid rgba(255,255,255,0.25);
    border-radius: 20px;
    z-index: 2147483646;
    color: #fff;
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4),
                inset 0 1px 0 rgba(255,255,255,0.1);
    backdrop-filter: blur(64px) saturate(180%);
    -webkit-backdrop-filter: blur(64px) saturate(180%);
    user-select: none;
    overflow: hidden;
    animation: ypp-eq-in 0.28s cubic-bezier(0.2, 0, 0, 1) forwards;
}
@keyframes ypp-eq-in {
    from { opacity:0; transform:translateY(12px) scale(calc(0.96 * var(--ypp-auto-scale, 1))); }
    to   { opacity:1; transform:translateY(0)   scale(var(--ypp-auto-scale, 1));    }
}

/* Header */
.ypp-eq-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px 13px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
}
.ypp-eq-title-group { display:flex; align-items:center; gap:10px; }
.ypp-eq-icon {
    width: 32px; height: 32px; border-radius: 10px;
    background: rgba(255, 255, 255, 0.15);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
}
.ypp-eq-title { font-size:14px; font-weight:700; letter-spacing:-0.3px; }
.ypp-eq-subtitle { font-size:10px; color:rgba(255,255,255,0.38); font-weight:500; margin-top:1px; }
.ypp-eq-close-btn {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.7); border-radius: 50%; width:28px; height:28px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition: background 0.2s, color 0.2s;
}
.ypp-eq-close-btn:hover { background: rgba(255,255,255,0.14); color:#fff; }

/* Gain Row */
.ypp-eq-gain-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
}
.ypp-eq-row-label {
    font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.45);
    text-transform: uppercase; letter-spacing: 0.6px; min-width: 72px;
}
.ypp-eq-gain-value {
    font-size: 12px; font-weight: 800; color: #ffffff;
    min-width: 40px; text-align: right;
}

/* Horizontal slider */
.ypp-eq-hslider {
    -webkit-appearance: none; appearance: none; flex: 1;
    height: 4px; border-radius: 4px; outline: none; cursor: pointer;
    border: none; transition: height 0.15s ease;
}
.ypp-eq-hslider:hover { height: 6px; }
.ypp-eq-hslider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%;
    background: #fff; border: 2.5px solid #fff; cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,255,255,0.2);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
}
.ypp-eq-hslider::-webkit-slider-thumb:hover {
    transform: scale(1.35);
    box-shadow: 0 2px 12px rgba(0,0,0,0.6), 0 0 0 5px rgba(255,255,255,0.3), 0 0 16px rgba(255,255,255,0.4);
}

/* Presets */
.ypp-eq-presets-row {
    display: flex; gap: 6px; padding: 9px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
}
.ypp-eq-presets-row::-webkit-scrollbar { display: none; }
.ypp-eq-preset-btn {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.6); border-radius: 20px; cursor: pointer;
    font-size: 11px; font-weight: 600; padding: 4px 13px;
    font-family: inherit; transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
}
.ypp-eq-preset-btn:hover {
    background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.3); color: #fff;
}
.ypp-eq-preset-btn.active {
    background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.5);
    color: #ffffff; box-shadow: 0 0 12px rgba(255,255,255,0.15);
}

/* Canvas */
.ypp-eq-canvas {
    display: block; width: calc(100% - 36px); height: 72px;
    margin: 0 18px 2px; border-radius: 10px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
}

/* Band columns */
.ypp-eq-bands {
    display: flex; gap: 0; padding: 6px 14px 12px;
    justify-content: space-between;
}
.ypp-eq-band-col {
    display: flex; flex-direction: column; align-items: center;
    gap: 3px; flex: 1; padding: 0 2px;
}
.ypp-eq-band-db {
    font-size: 9px; font-weight: 800; min-height: 13px; line-height: 1;
}
.ypp-eq-band-track {
    position: relative; height: 80px; width: 100%;
    display: flex; align-items: center; justify-content: center;
}
.ypp-eq-band-center {
    position: absolute; width: 100%; height: 1px;
    background: rgba(255,255,255,0.1); top: 50%; left: 0;
    pointer-events: none;
}
.ypp-eq-band-freq {
    font-size: 9px; color: rgba(255,255,255,0.38); font-weight:600;
}

/* Vertical slider (rotated horizontal) */
.ypp-eq-vslider {
    -webkit-appearance: none; appearance: none;
    width: 80px;
    height: 3px; border-radius: 3px; outline: none; cursor: pointer;
    background: rgba(255,255,255,0.1); border: none;
    transform: rotate(-90deg);
    transform-origin: center;
    position: absolute;
    transition: height 0.1s ease;
}
.ypp-eq-vslider:hover { height: 5px; }
.ypp-eq-vslider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 13px; height: 13px; border-radius: 50%;
    background: var(--band-color, #ffffff);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255,255,255,0.3);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.ypp-eq-vslider::-webkit-slider-thumb:hover { transform: scale(1.45); }

/* Footer */
.ypp-eq-footer {
    display: flex; align-items: center; gap: 8px;
    padding: 0 18px 14px;
}
.ypp-eq-comp-btn {
    display: flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.55); border-radius: 20px; cursor: pointer;
    font-size: 11px; font-weight: 600; padding: 5px 13px;
    font-family: inherit; transition: all 0.2s ease;
}
.ypp-eq-comp-btn.active {
    background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4);
    color: #ffffff; box-shadow: 0 0 10px rgba(255,255,255,0.15);
}
.ypp-eq-comp-btn:hover { background: rgba(255,255,255,0.1); }
.ypp-eq-reset-btn {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.22);
    color: #ffffff; border-radius: 20px; cursor: pointer;
    font-size: 11px; font-weight: 600; padding: 5px 14px;
    font-family: inherit; transition: all 0.2s ease;
}
.ypp-eq-reset-btn:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); }
.ypp-eq-hint {
    font-size: 9px; color: rgba(255,255,255,0.22); margin-left: auto;
}
        `,document.head.appendChild(e)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.VolumeBooster=class extends window.YPP.features.BaseFeature{constructor(){super("VolumeBooster"),this.name="VolumeBooster",this.settings=null,this._audioConnected=!1,this.ctx=null,this.source=null,this.gainNode=null,this.compressorNode=null,this.pannerNode=null,this.analyserNode=null,this._eqNodes=[],this._compressorEnabled=!0,this._monoEnabled=!1,this._eqGains=new Array(10).fill(0),this._volumeGain=1,this._balance=0,this._volumePopup=null,this._volumePopupOutsideHandler=null,this._boundVideo=null,this._initHandler=null,this._bands=[{label:"60",freq:60,type:"lowshelf",color:"#ffffff"},{label:"170",freq:170,type:"peaking",color:"#ffffff"},{label:"310",freq:310,type:"peaking",color:"#ffffff"},{label:"600",freq:600,type:"peaking",color:"#ffffff"},{label:"1k",freq:1e3,type:"peaking",color:"#ffffff"},{label:"3k",freq:3e3,type:"peaking",color:"#ffffff"},{label:"6k",freq:6e3,type:"peaking",color:"#ffffff"},{label:"10k",freq:1e4,type:"peaking",color:"#ffffff"},{label:"14k",freq:14e3,type:"peaking",color:"#ffffff"},{label:"16k",freq:16e3,type:"highshelf",color:"#ffffff"}],this._presets={Flat:[0,0,0,0,0,0,0,0,0,0],"Bass Boost":[8,6,4,2,0,-1,0,0,0,0],Acoustic:[4,4,3,1,1,1,3,4,3,2],Classical:[4,3,2,1,-1,-1,0,2,3,4],Dance:[8,6,3,0,0,-1,-2,-2,0,1],Electronic:[6,5,2,0,-2,1,0,1,4,5],"Lo-Fi":[3,2,0,-2,-4,-4,-3,-2,-1,0],Pop:[-2,-1,1,3,4,4,2,1,0,-1],Rock:[6,4,2,-1,-2,-1,1,3,4,5],Vocal:[-2,-1,0,2,4,4,3,2,1,0],Cinematic:[5,3,1,-1,-2,1,3,4,4,3]}}getConfigKey(){return"enableVolumeBoost"}_loadSettings(e){var t,r;if(e&&(e.volumeLevel!==void 0&&(this._volumeGain=e.volumeLevel),e.volumeBalance!==void 0&&(this._balance=e.volumeBalance),e.volumeCompressor!==void 0&&(this._compressorEnabled=e.volumeCompressor),e.volumeMono!==void 0&&(this._monoEnabled=e.volumeMono),e.volumeEqBands))try{const i=JSON.parse(e.volumeEqBands);Array.isArray(i)&&i.length===10&&(this._eqGains=i.map(n=>typeof n=="number"?n:0))}catch(i){(r=(t=this.utils)==null?void 0:t.log)==null||r.call(t,"[YPP:VolumeBooster] Failed to parse EQ bands: "+i.message,"VolumeBooster","warn")}}async enable(){await super.enable(),this._loadSettings(this.settings);const e=document.querySelector(".html5-main-video")||document.querySelector("video");e&&this._needsAudioGraph()&&this.initAudioContext(e)}async disable(){if(this._volumePopup&&(this._volumePopup.remove(),this._volumePopup=null),this._volumePopupOutsideHandler=null,this._volumePopupEscapeHandler=null,await super.disable(),!this.settings||!this.settings.enableVolumeBoost){const e=document.querySelector('#ypp-volume-boost-btn[data-vb-id="'+this._id+'"]');e&&e.remove()}this._boundVideo&&this._initHandler&&(this._initHandler=null),this._audioConnected&&(this.gainNode&&this.gainNode.gain.setTargetAtTime(1,this.ctx.currentTime,.05),this._eqNodes.forEach(e=>{e&&e.gain.setTargetAtTime(0,this.ctx.currentTime,.05)}),this.compressorNode&&(this.compressorNode.ratio.value=1,this.compressorNode.threshold.value=0),this.pannerNode&&this.pannerNode.pan.setTargetAtTime(0,this.ctx.currentTime,.05),this.source&&(this.source.channelCount=2,this.source.channelCountMode="max"))}onUpdate(){this._loadSettings(this.settings),this._audioConnected&&this._restoreAudioState(),this.enable()}onPageChange(){if(!this.settings||!this.settings.enableVolumeBoost)return;this._loadSettings(this.settings);const e=document.querySelector(".html5-main-video")||document.querySelector("video");e&&(this._audioConnected&&this._boundVideo===e?this._restoreAudioState():this._needsAudioGraph()&&this.initAudioContext(e))}onVideoChange(){if(!this.settings||!this.settings.enableVolumeBoost)return;this._loadSettings(this.settings);const e=document.querySelector(".html5-main-video")||document.querySelector("video");e&&(this._audioConnected&&this._boundVideo===e?this._restoreAudioState():this._needsAudioGraph()&&this.initAudioContext(e))}_needsAudioGraph(){return!!(this._volumeGain!==1||this._balance!==0||this._monoEnabled||this._eqGains&&this._eqGains.some(e=>e!==0))}_isSafeToBoost(e){if(!e)return!1;if(e.srcObject)return!0;const t=e.currentSrc||e.src;if(!t)return!1;if(t.startsWith("blob:")||t.startsWith("data:"))return!0;try{if(new URL(t).origin===window.location.origin)return!0}catch{}return e.crossOrigin==="anonymous"||e.crossOrigin==="use-credentials"}initAudioContext(e){var t,r;if(!this._isSafeToBoost(e)){(r=(t=this.utils)==null?void 0:t.log)==null||r.call(t,"Volume Booster disabled: Cross-Origin Video detected without CORS.","VolumeBooster","warn");return}this._audioConnected&&this._boundVideo===e||(this._audioConnected&&this._boundVideo&&this._boundVideo!==e&&(this.disable(),this._audioConnected=!1),this._boundVideo=e,this._initHandler=()=>{var i,n;if(!this._audioConnected)try{if(e.__ypp_ctx&&e.__ypp_source)this.ctx=e.__ypp_ctx,this.source=e.__ypp_source,this.source.disconnect();else{const s=window.AudioContext||window.webkitAudioContext;this.ctx=new s,this.source=this.ctx.createMediaElementSource(e),e.__ypp_ctx=this.ctx,e.__ypp_source=this.source}if(this._buildAudioGraph(),this._audioConnected=!0,this._restoreAudioState(),this.ctx&&this.ctx.state==="suspended"){this.ctx.resume().catch(()=>{});const s=()=>{this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),["click","touchstart","keydown"].forEach(o=>document.removeEventListener(o,s,!0))};["click","touchstart","keydown"].forEach(o=>document.addEventListener(o,s,!0))}}catch(s){(n=(i=this.utils)==null?void 0:i.log)==null||n.call(i,"[YPP:VolumeBooster] Audio engine init failed: "+s.message,"VolumeBooster","warn"),this._audioConnected=!1}},this.addListener(e,"play",this._initHandler,{once:!0}),this.addListener(e,"volumechange",this._initHandler,{once:!0}),e.paused||this._initHandler())}_buildAudioGraph(){this._eqNodes=this._bands.map((r,i)=>{const n=this.ctx.createBiquadFilter();return n.type=r.type,n.frequency.value=r.freq,n.gain.value=this._eqGains[i],r.type==="peaking"&&(n.Q.value=1.4),n}),this.pannerNode=this.ctx.createStereoPanner(),this.pannerNode.pan.value=this._balance,this.compressorNode=this.ctx.createDynamicsCompressor(),this._applyCompressorState(),this.gainNode=this.ctx.createGain(),this.gainNode.gain.value=this._volumeGain,this.analyserNode=this.ctx.createAnalyser(),this.analyserNode.fftSize=128,this.analyserNode.smoothingTimeConstant=.85;let e=this.source;this._eqNodes.forEach(r=>{e.connect(r),e=r}),e.connect(this.pannerNode),this.pannerNode.connect(this.compressorNode),this.compressorNode.connect(this.gainNode),this.gainNode.connect(this.analyserNode);const t=this._boundVideo||document.querySelector(".html5-main-video")||document.querySelector("video");t&&t.__ypp_ext_compressor?(this.analyserNode.connect(t.__ypp_ext_compressor.input),t.__ypp_ext_compressor.output.connect(this.ctx.destination)):this.analyserNode.connect(this.ctx.destination)}_restoreAudioState(){this.setVolume(this._volumeGain),this.setBalance(this._balance),this.setMono(this._monoEnabled),this._applyCompressorState(),this._eqNodes.forEach((e,t)=>{e&&e.gain.setTargetAtTime(this._eqGains[t],this.ctx.currentTime,.05)})}_applyCompressorState(){this.compressorNode&&(this._compressorEnabled?(this.compressorNode.threshold.value=-24,this.compressorNode.knee.value=10,this.compressorNode.ratio.value=4,this.compressorNode.attack.value=.003,this.compressorNode.release.value=.25):(this.compressorNode.threshold.value=0,this.compressorNode.ratio.value=1))}setVolume(e){if(this._volumeGain=e,!this._audioConnected&&this._needsAudioGraph()){const t=this._boundVideo||document.querySelector(".html5-main-video")||document.querySelector("video");t&&this.initAudioContext(t)}this.gainNode&&this.ctx&&(this.ctx.state==="suspended"&&this.ctx.resume(),this.gainNode.gain.setTargetAtTime(e,this.ctx.currentTime,.05))}setBalance(e){if(this._balance=e,!this._audioConnected&&this._needsAudioGraph()){const t=this._boundVideo||document.querySelector(".html5-main-video")||document.querySelector("video");t&&this.initAudioContext(t)}this.pannerNode&&this.ctx&&(this.ctx.state==="suspended"&&this.ctx.resume(),this.pannerNode.pan.setTargetAtTime(e,this.ctx.currentTime,.05))}setMono(e){if(this._monoEnabled=e,!this._audioConnected&&this._needsAudioGraph()){const t=this._boundVideo||document.querySelector(".html5-main-video")||document.querySelector("video");t&&this.initAudioContext(t)}if(this.ctx&&this.source)try{this.source.channelCount=e?1:2,this.source.channelCountMode=e?"explicit":"max"}catch{this.source.channelCountMode=e?"explicit":"max"}}_setEQBand(e,t){if(this._eqGains[e]=t,!this._audioConnected&&this._needsAudioGraph()){const r=this._boundVideo||document.querySelector(".html5-main-video")||document.querySelector("video");r&&this.initAudioContext(r)}this._eqNodes[e]&&this.ctx&&(this.ctx.state==="suspended"&&this.ctx.resume(),this._eqNodes[e].gain.setTargetAtTime(t,this.ctx.currentTime,.05))}_applyPreset(e){const t=this._presets[e];t&&(this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume(),t.forEach((r,i)=>this._setEQBand(i,r)))}createButton(e){const t=`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff">
            <path d="M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z"/>
        </svg>`,r=document.createElement("button");return r.innerHTML=t,r.title="Equalizer",r.className="ypp-action-btn",r.id="ypp-volume-boost-btn",r.dataset.vbId=this._id,this.addListener(r,"click",i=>{if(i.stopPropagation(),window.YPP.features.VolumeBoosterUI){const n=document.querySelector(".html5-main-video")||document.querySelector("video");n&&!this._audioConnected&&this.initAudioContext(n),window.YPP.features.VolumeBoosterUI.toggleEQPanel(this,n,r)}}),r}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AutoQuality=class extends window.YPP.features.BaseFeature{constructor(){super("AutoQuality"),this.enforcerInterval=null}getConfigKey(){return"autoQuality"}enable(){var e;try{this.forceInitialQuality(),this.startEnforcer()}catch(t){(e=this.utils)==null||e.log("Error enabling AutoQuality","QUALITY","error",t)}}onUpdate(){this.forceInitialQuality(),this.startEnforcer()}disable(){super.disable(),this.stopEnforcer()}onPageChange(){this.forceInitialQuality()}forceInitialQuality(){var t,r,i;if(!((t=this.settings)!=null&&t.autoQuality)||this.settings.autoQuality==="off")return;try{const n=JSON.stringify({data:this.settings.autoQuality,expiration:Date.now()+31536e6,creation:Date.now()});window.localStorage.setItem("yt-player-quality",n),(r=this.utils)==null||r.log(`Injected yt-player-quality (${this.settings.autoQuality}) into localStorage`,this.name,"debug")}catch(n){(i=this.utils)==null||i.log("Failed to write localStorage",this.name,"warn",n)}const e=document.getElementById("movie_player");if(e&&typeof e.getAvailableQualityLevels=="function"){const n=e.getAvailableQualityLevels();n&&n.length>0&&n[0]!=="auto"&&this.applyAutoQuality(e)}}startEnforcer(){this._enforcerBound||(this._enforcerBound=e=>{var r;if(document.hidden||!((r=this.settings)!=null&&r.autoQuality)||this.settings.autoQuality==="off"||e&&e.type==="loadstart"&&e.target.tagName!=="VIDEO")return;const t=document.getElementById("movie_player");t&&typeof t.getPlaybackQuality=="function"&&this.applyAutoQuality(t)},this.addListener(document,"yt-navigate-finish",this._enforcerBound),this.addListener(document,"yt-player-updated",this._enforcerBound),this.addListener(window,"loadstart",this._enforcerBound,!0),navigator.connection&&this.addListener(navigator.connection,"change",this._enforcerBound))}stopEnforcer(){this._enforcerBound=null}applyAutoQuality(e){var a,l;if(typeof e.getAvailableQualityLevels!="function"||window.location.pathname.startsWith("/shorts/"))return;try{if(e.getVideoData&&e.getVideoData().isLive)return}catch{}const t=e.getAvailableQualityLevels();if(!t||t.length===0)return;const r=["highres","hd2160","hd1440","hd1080","hd720","large","medium","small","tiny"];let i=this.settings.autoQuality;if(navigator.connection&&navigator.connection.downlink){const d=navigator.connection.downlink;d<1.5&&["highres","hd2160","hd1440","hd1080","hd720"].includes(i)?(i="large",(a=this.utils)==null||a.log("Connection is slow (<1.5Mbps), downgrading to 480p",this.name,"debug")):d<3&&["highres","hd2160","hd1440","hd1080"].includes(i)&&(i="hd720",(l=this.utils)==null||l.log("Connection is slow (<3.0Mbps), downgrading to 720p",this.name,"debug"))}let n=r.indexOf(i);n===-1&&(n=0);const o=r.slice(n).find(d=>t.includes(d));o&&(typeof e.setPlaybackQualityRange=="function"&&e.setPlaybackQualityRange(o,o),typeof e.setPlaybackQuality=="function"&&e.setPlaybackQuality(o))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.TimeDisplay=class extends window.YPP.features.BaseFeature{constructor(){super("TimeDisplay"),this.name="TimeDisplay",this.settings=null,this._boundTimeUpdate=null,this._videoElement=null,this._pollInterval=null,this._timeRemainingNode=null}getConfigKey(){return"enableRemainingTime"}enable(){!this.settings||!this.settings.enableRemainingTime||!window.YPP.Utils||window.YPP.sharedObserver&&(window.YPP.sharedObserver.register("time-display-container",".ytp-time-display .ytp-time-duration",t=>{const r=document.querySelector("video"),i=t[0].closest(".ytp-time-display");r&&i&&this.showRemainingTime(r,i)},!0),this._hasNavListener||(window.addEventListener("yt-navigate-finish",()=>{setTimeout(()=>{const t=document.querySelector("video"),r=document.querySelector(".ytp-time-display");t&&r&&this.showRemainingTime(t,r)},1e3)}),this._hasNavListener=!0))}async disable(){var e;await super.disable();try{if(this._pollInterval&&(clearInterval(this._pollInterval),this._pollInterval=null),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("time-display-video"),this._videoElement&&this._boundTimeUpdate&&(this._videoElement.removeEventListener("timeupdate",this._boundTimeUpdate.throttled??this._boundTimeUpdate),this._videoElement.removeEventListener("ratechange",this._boundTimeUpdate.raw??this._boundTimeUpdate),this._boundTimeUpdate=null),this._timeRemainingNode)this._timeRemainingNode.remove(),this._timeRemainingNode=null;else{const r=document.querySelector(".ypp-time-remaining");r&&r.remove()}const t=document.querySelector(".ypp-time-separator-appended");t&&t.remove(),this._videoElement=null}catch(t){(e=this.utils)==null||e.log("TimeDisplay disable error","TIME-DISPLAY","error",t)}}onUpdate(){this.enable()}showRemainingTime(e,t){var h,m;if(!t)return;this._videoElement=e;const r=document.getElementById("ypp-time-dashboard");r&&r.remove();const i=document.getElementById("ypp-native-time-metrics");i&&i.remove();const n=document.getElementById("ypp-dedicated-time-metrics");n&&n.remove();const s=t.classList.contains("ytp-time-display")?t:t.querySelector(".ytp-time-display"),o=s?s.querySelector(".ytp-time-duration"):null;if(!s||!o)return;let a=document.querySelector(".ypp-time-remaining");const l=document.querySelector(".ypp-time-separator-appended");if(l&&l.remove(),!a)if(a=document.createElement("span"),a.className="ypp-time-remaining ytp-time-duration",a.style.cssText=`
                margin-left: 4px;
                opacity: 0.85;
            `,o&&o.parentNode)o.parentNode.insertBefore(a,o.nextSibling);else if(s)s.appendChild(a);else return;this._timeRemainingNode=a;const d=y=>{if(y==null||isNaN(y)||y<0)return"0:00";const v=Math.floor(y/3600),b=Math.floor(y%3600/60),f=Math.floor(y%60);return v>0?`${v}:${b.toString().padStart(2,"0")}:${f.toString().padStart(2,"0")}`:`${b}:${f.toString().padStart(2,"0")}`},p=()=>{if(!e||!e.duration||!isFinite(e.duration)||isNaN(e.currentTime))return;if(!document.contains(a))if(s)s.appendChild(a);else return;const y=e.playbackRate||1,v=e.duration,b=e.currentTime,f=Math.max(0,v-b),g=f/y;if(f<=0){a.style.display="none";return}if(a.style.display="inline",Math.abs(y-1)<=.01)a.textContent=` ( -${d(f)} )`;else if(y>1){const _=v-v/y;a.textContent=` ( -${d(g)} · ${d(_)} saved )`}else{const _=v/y-v;a.textContent=` ( -${d(g)} · ${d(_)} extra )`}};this._boundTimeUpdate&&(e.removeEventListener("timeupdate",this._boundTimeUpdate.throttled??this._boundTimeUpdate),e.removeEventListener("ratechange",this._boundTimeUpdate.raw??this._boundTimeUpdate));const u=((m=(h=window.YPP.Utils)==null?void 0:h.throttle)==null?void 0:m.call(h,p,1e3))??p;this._boundTimeUpdate={throttled:u,raw:p},this.addListener(e,"timeupdate",u),this.addListener(e,"ratechange",p),p()}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.SponsorBlock=class extends window.YPP.features.BaseFeature{constructor(){super("SponsorBlock"),this.videoId=null,this.segments=[],this.segmentElements=[],this.videoElement=null,this.abortController=null,this._retryTimeout=null,this.segmentCache=new Map,this.CACHE_DURATION=30*60*1e3,this._defaultCategories=["sponsor","selfpromo","intro","music_offtopic","preview"],this.COLORS={sponsor:"#00d400",selfpromo:"#ffff00",interaction:"#cc00ff",intro:"#00ffff",outro:"#0202ed",preview:"#008fd6",music_offtopic:"#ff9900",filler:"#7300FF"},this.handleTimeUpdate=this.handleTimeUpdate.bind(this),this.handleNavigation=this.handleNavigation.bind(this),this.handleVideoLoaded=this.handleVideoLoaded.bind(this)}getConfigKey(){return"sponsorBlock"}async enable(){this.utils.isWatchPage()&&(await super.enable(),this.init(),this.addListener(window,"yt-navigate-finish",this.handleNavigation))}async disable(){var e;await super.disable(),(e=window.YPP)!=null&&e.sharedObserver&&(window.YPP.sharedObserver.unregister("sponsor-video"),window.YPP.sharedObserver.unregister("sponsor-progress")),this.stop(),this.clearSegments()}async onUpdate(){this.utils.isWatchPage()&&!this.videoElement&&this.init()}handleNavigation(){if(!this.isEnabled)return;this.stop();const e=Date.now();for(const[t,r]of this.segmentCache)e-r.timestamp>this.CACHE_DURATION&&this.segmentCache.delete(t);this.utils.isWatchPage()&&this.init()}async init(){this.videoId=this.getVideoId(),this.videoId&&(window.YPP.sharedObserver&&window.YPP.sharedObserver.register("sponsor-video","video",e=>{const t=e[0];t&&!this.videoElement&&(this.videoElement=t,this.addListener(this.videoElement,"timeupdate",this.handleTimeUpdate),this.addListener(this.videoElement,"loadedmetadata",this.handleVideoLoaded),this.addListener(this.videoElement,"durationchange",this.handleVideoLoaded),this.videoElement.duration&&this.handleVideoLoaded(),this.fetchSegments())},!0),this.observer.register("sponsor-progress",".ytp-progress-list",e=>{var r;if(!e||e.length===0)return;const t=e[0];this.segmentElements.length===0&&this.segments.length>0&&((r=this.videoElement)!=null&&r.duration)?this.renderSegments():this.segmentElements.length>0&&(this.segmentElements.some(n=>t.contains(n))||this.renderSegments())},!1))}stop(){this.abortController&&(this.abortController.abort(),this.abortController=null),this._retryTimeout&&(clearTimeout(this._retryTimeout),this._retryTimeout=null),this.retryAttempted=!1,this.segments=[],this.clearSegments(),this.videoElement=null}handleVideoLoaded(){this.segments.length>0&&this.videoElement&&this.videoElement.duration&&this.renderSegments()}getVideoId(){return new URLSearchParams(window.location.search).get("v")}_getActiveCategories(){const e=this.settings;if(!e)return this._defaultCategories.slice();const r=Object.entries({sponsor:"sb_sponsor",intro:"sb_intro",selfpromo:"sb_selfpromo",interaction:"sb_interaction",music_offtopic:"sb_music_offtopic",preview:"sb_preview"}).filter(([,i])=>e[i]!==!1).map(([i])=>i);return r.length>0?r:this._defaultCategories.slice()}async fetchSegments(){var t,r,i,n,s,o,a,l,d;this.abortController&&this.abortController.abort(),this.abortController=new AbortController;const e=this.segmentCache.get(this.videoId);if(e&&Date.now()-e.timestamp<this.CACHE_DURATION){this.segments=e.segments,(r=(t=this.utils).log)==null||r.call(t,`SponsorBlock: Loaded ${this.segments.length} segments from cache`,"SPONSOR"),this.renderSegments();return}try{const p=new TextEncoder().encode(this.videoId),u=await crypto.subtle.digest("SHA-256",p),y=Array.from(new Uint8Array(u)).map(g=>g.toString(16).padStart(2,"0")).join("").substring(0,4),v=encodeURIComponent(JSON.stringify(this._getActiveCategories())),b=`https://sponsor.ajay.app/api/skipSegments/${y}?categories=${v}`,f=await new Promise(g=>{chrome.runtime.sendMessage({action:"FETCH_API",url:b,options:{headers:{Accept:"application/json"}}},g)});if(this.abortController.signal.aborted)return;if(f&&f.status===200&&f.data){const _=f.data.find(P=>P.videoID===this.videoId);_&&_.segments?(this.segments=_.segments,this.segmentCache.set(this.videoId,{segments:this.segments,timestamp:Date.now()}),(n=(i=this.utils).log)==null||n.call(i,`SponsorBlock: Loaded ${this.segments.length} segments`,"SPONSOR"),this.renderSegments()):(this.segments=[],(o=(s=this.utils).log)==null||o.call(s,"SponsorBlock: No segments found for this video","SPONSOR"),this.clearSegments())}else if(f&&f.status===404)this.segments=[],this.segmentCache.set(this.videoId,{segments:[],timestamp:Date.now()}),this.clearSegments();else throw new Error(`HTTP ${(f==null?void 0:f.status)||"Unknown"}`)}catch(p){if(p.name==="AbortError"||(a=p.message)!=null&&a.includes("Extension context invalidated"))return;(d=(l=this.utils).log)==null||d.call(l,`SponsorBlock API error: ${p.message}`,"SPONSOR","debug"),this.retryAttempted||(this.retryAttempted=!0,this._retryTimeout=setTimeout(()=>{this._retryTimeout=null,this.fetchSegments()},2e3))}}renderSegments(){if(this.clearSegments(),!this.videoElement||!this.videoElement.duration||this.segments.length===0)return;const e=document.querySelector(".html5-video-player");if(e&&e.classList.contains("ad-showing"))return;const t=document.querySelector(".ytp-progress-list");if(!t)return;const r=this.videoElement.duration;this.segments.forEach(i=>{const n=i.segment[0]/r*100,o=i.segment[1]/r*100-n,a=document.createElement("div");a.className="ypp-sponsor-segment",a.style.position="absolute",a.style.left=`${n}%`,a.style.width=`${o}%`,a.style.height="100%",a.style.backgroundColor=this.COLORS[i.category]||this.COLORS.sponsor,a.style.opacity="0.7",a.style.zIndex="35",a.style.pointerEvents="none",t.appendChild(a),this.segmentElements.push(a)})}clearSegments(){this.segmentElements.forEach(e=>e.remove()),this.segmentElements=[]}handleTimeUpdate(){var t,r;if(!this.isEnabled||!this.videoElement||this.segments.length===0||this.videoElement.seeking)return;const e=this.videoElement.currentTime;for(const i of this.segments)if(e>=i.segment[0]&&e<i.segment[1]){this.videoElement.currentTime=i.segment[1],(r=(t=this.utils)==null?void 0:t.createToast)==null||r.call(t,`Skipped ${i.category}`,"info");return}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AdSkipper=class extends window.YPP.features.BaseFeature{constructor(){super("AdSkipper"),this.selectors=[".ytp-ad-skip-button-modern",".ytp-ad-skip-button",".ytp-skip-ad-button",".videoAdUiSkipButton"],this._boundHandleMutations=this._handleMutations.bind(this),this._interval=null}getConfigKey(){return"adSkipper"}async enable(){await super.enable(),window.YPP.sharedObserver&&(window.YPP.sharedObserver.register("ad-skipper","ytd-player, #player-container",e=>{const t=e[0];t&&(this._checkForAds(t),this._checkPromosAndNext())},!0),this._promoObserver=new MutationObserver(()=>{this._checkPromosAndNext()}),this._promoObserver.observe(document.body,{childList:!0,subtree:!0})),this._checkForAds(),this._checkPromosAndNext()}async disable(){await super.disable(),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("ad-skipper"),this._promoObserver&&(this._promoObserver.disconnect(),this._promoObserver=null)}_handleMutations(e){this.isEnabled&&e.target&&e.target.className&&typeof e.target.className=="string"&&e.target.className.includes("ad")&&this._checkForAds()}_checkForAds(e=document){var r,i,n,s,o,a;if(((r=this.settings)==null?void 0:r.autoSkipAds)===!1&&((i=this.settings)==null?void 0:i.adSkipper)===!1)return;for(const l of this.selectors){const d=e.querySelector(l);if(d&&d.offsetParent!==null){d.click(),(s=(n=this.utils)==null?void 0:n.log)==null||s.call(n,"Skipped Ad via Button Click","AD_SKIPPER","debug");return}}const t=document.querySelector(".html5-video-player");if(t&&t.classList.contains("ad-showing")){const l=t.querySelector("video");l&&!l.paused&&l.duration&&l.duration>0&&l.currentTime<l.duration-1&&(l.muted||(l.muted=!0),l.currentTime=l.duration-.1,(a=(o=this.utils)==null?void 0:o.log)==null||a.call(o,"Instantly skipped unskippable ad","AD_SKIPPER","debug"))}}_checkPromosAndNext(){var e,t;if(this.settings){if((this.settings.autoSkipPromos||this.settings.adSkipper)&&(document.querySelectorAll(".ytp-ad-overlay-close-button").forEach(n=>n.click()),document.querySelectorAll("#dismiss-button.ytd-button-renderer").forEach(n=>{var s,o;(n.closest("ytd-mealbar-promo-renderer")||n.closest("ytd-popup-container"))&&(n.click(),(o=(s=this.utils)==null?void 0:s.log)==null||o.call(s,"Dismissed promo","AD_SKIPPER","debug"))})),this.settings.autoSkipSponsors){const r=document.querySelector(".ytp-paid-content-overlay");r&&r.style.display!=="none"&&(r.style.display="none")}if(this.settings.autoPlayNext){const r=document.querySelector("video");if(r&&r.ended){const i=document.querySelector(".ytp-next-button"),n=document.querySelector(".ytp-autonav-cancel-button");i&&!n&&(i.click(),(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,"Triggered auto play next","AD_SKIPPER","debug"))}}}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{};const ot={PLAYER_CONTAINER:"ytd-player, #player-container-outer, ytd-watch-flexy",VIDEO:"ytd-player video"};window.YPP.features.AmbientMode=class extends window.YPP.features.BaseFeature{constructor(){super("AmbientMode"),this.canvas=null,this.gl=null,this.program=null,this.texture=null,this.animationFrame=null,this.video=null,this.container=null,this._playerVisible=!0,this._intersectionObserver=null,this._visibilityHandler=this._onVisibilityChange.bind(this),this.audioContext=null,this.analyser=null,this.dataArray=null,this.motionCanvas=document.createElement("canvas"),this.motionCtx=this.motionCanvas.getContext("2d",{willReadFrequently:!0}),this.motionCanvas.width=16,this.motionCanvas.height=16,this.lastMotionData=null,this.currentBlur=120,this.targetBlur=120}getConfigKey(){return"ambientMode"}async enable(){!this.utils.isWatchPage()||(await super.enable(),document.body.classList.add("ypp-ambient-mode-active"),!await this.waitForElement(ot.VIDEO,5e3))||(this.initDOM(),this.startLoop())}async disable(){if(await super.disable(),document.body.classList.remove("ypp-ambient-mode-active"),this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null),this._intersectionObserver&&(this._intersectionObserver.disconnect(),this._intersectionObserver=null),window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("ambient-mode-btn"),this.gl){this.program&&this.gl.deleteProgram(this.program),this.texture&&this.gl.deleteTexture(this.texture);const e=this.gl.getExtension("WEBGL_lose_context");e&&e.loseContext(),this.gl=null}this.canvas&&(this.canvas.remove(),this.canvas=null),this.container&&(this.container.remove(),this.container=null)}async onUpdate(){var e;if(this.isEnabled&&this.canvas&&this.container){const t=((e=this.settings)==null?void 0:e.ambientIntensity)??.6;this.container.style.opacity=t}}async onPageChange(e){this.isEnabled&&(this.utils.isWatchPage()?(await this.disable(),this.isEnabled=!0,await this.enable()):(await this.disable(),this.isEnabled=!0))}async onVideoChange(e){!this.isEnabled||!this.utils.isWatchPage()||(await this.disable(),this.isEnabled=!0,await this.enable())}initDOM(){var t,r;this.video=document.querySelector(ot.VIDEO),!(!this.video||document.getElementById("ypp-massive-ambient-container")||!document.querySelector(ot.PLAYER_CONTAINER))&&(this.container=document.createElement("div"),this.container.id="ypp-massive-ambient-container",this.container.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1; /* Behind everything */
            pointer-events: none;
            overflow: hidden;
            transform: translateZ(0); /* Hardware acceleration */
            opacity: ${((t=this.settings)==null?void 0:t.ambientIntensity)||.6};
            transition: opacity 0.5s ease;
        `,this.canvas=document.createElement("canvas"),this.canvas.id="ypp-massive-ambient-canvas",(r=this.settings)!=null&&r.ambientBlur,this.canvas.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1.3);
            width: 100%;
            height: 100%;
            image-rendering: auto;
            mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
        `,this.container.appendChild(this.canvas),document.body.insertBefore(this.container,document.body.firstChild),this.initWebGL())}initWebGL(){var u,h,m,y;this.canvas.width=32,this.canvas.height=32;const e=this.canvas.getContext("webgl2",{alpha:!1,depth:!1,antialias:!1,powerPreference:"low-power"})||this.canvas.getContext("webgl",{alpha:!1,depth:!1,antialias:!1,powerPreference:"low-power"});if(!e){(h=(u=this.utils)==null?void 0:u.log)==null||h.call(u,"WebGL not supported, ambient mode disabled","AMBIENT","error");return}this.gl=e;const t=`
            attribute vec2 aPosition;
            varying vec2 vTexCoord;
            void main() {
                vTexCoord = aPosition * 0.5 + 0.5;
                vTexCoord.y = 1.0 - vTexCoord.y; // Flip Y
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `,r=`
            precision mediump float;
            varying vec2 vTexCoord;
            uniform sampler2D uSampler;
            uniform float uSaturationBoost;
            uniform float uBrightnessBoost;
            uniform float uBlurIntensity;

            void main() {
                vec4 color = vec4(0.0);
                float total = 0.0;
                
                // 9-tap simple blur
                for(float x = -1.0; x <= 1.0; x++) {
                    for(float y = -1.0; y <= 1.0; y++) {
                        vec2 offset = vec2(x, y) * uBlurIntensity;
                        color += texture2D(uSampler, vTexCoord + offset);
                        total += 1.0;
                    }
                }
                color /= total;
                
                // Boost saturation and brightness
                float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                vec3 boosted = mix(vec3(luminance), color.rgb, uSaturationBoost);
                boosted = boosted * uBrightnessBoost;
                
                gl_FragColor = vec4(boosted, 1.0);
            }
        `,i=(v,b)=>{const f=e.createShader(v);return e.shaderSource(f,b),e.compileShader(f),e.getShaderParameter(f,e.COMPILE_STATUS)?f:(console.error(e.getShaderInfoLog(f)),e.deleteShader(f),null)},n=i(e.VERTEX_SHADER,t),s=i(e.FRAGMENT_SHADER,r);this.program=e.createProgram(),e.attachShader(this.program,n),e.attachShader(this.program,s),e.linkProgram(this.program),e.useProgram(this.program),this.uSaturationBoost=e.getUniformLocation(this.program,"uSaturationBoost"),this.uBrightnessBoost=e.getUniformLocation(this.program,"uBrightnessBoost"),this.uBlurIntensity=e.getUniformLocation(this.program,"uBlurIntensity");const o=((m=this.settings)==null?void 0:m.ambientSaturation)||2,a=((y=this.settings)==null?void 0:y.ambientBrightness)||.85;e.uniform1f(this.uSaturationBoost,o),e.uniform1f(this.uBrightnessBoost,a);const l=new Float32Array([-1,-1,1,-1,-1,1,1,1]),d=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,d),e.bufferData(e.ARRAY_BUFFER,l,e.STATIC_DRAW);const p=e.getAttribLocation(this.program,"aPosition");e.enableVertexAttribArray(p),e.vertexAttribPointer(p,2,e.FLOAT,!1,0,0),this.texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR)}startLoop(){let e=0;const t=1e3/30;this.video&&(this._intersectionObserver=new IntersectionObserver(([i])=>{this._playerVisible=i.isIntersecting},{threshold:.05}),this._intersectionObserver.observe(this.video)),this.addListener(document,"visibilitychange",this._visibilityHandler);const r=i=>{var s,o,a;if(!this.isEnabled)return;const n=i-e;if(n>t&&(e=i-n%t,this.video&&!this.video.paused&&!this.video.ended&&this.video.readyState>=2&&!document.hidden&&this._playerVisible&&this.gl)){this._initAudioContextSafe();let d=0;if(this.analyser&&this.dataArray){this.analyser.getByteFrequencyData(this.dataArray);let f=0;for(let g=0;g<10;g++)f+=this.dataArray[g];d=f/10/255}this.motionCtx.drawImage(this.video,0,0,16,16);const p=this.motionCtx.getImageData(0,0,16,16).data;let u=0;if(this.lastMotionData)for(let f=0;f<p.length;f+=4)u+=Math.abs(p[f]-this.lastMotionData[f])+Math.abs(p[f+1]-this.lastMotionData[f+1])+Math.abs(p[f+2]-this.lastMotionData[f+2]);this.lastMotionData=p;const h=Math.min(1,u/(16*16*3*255)),m=((s=this.settings)==null?void 0:s.ambientBlur)||120;this.targetBlur=m-h*80,this.currentBlur+=(this.targetBlur-this.currentBlur)*.1;const y=this.gl;y.useProgram(this.program),y.uniform1f(this.uBlurIntensity,this.currentBlur/1500);const v=((o=this.settings)==null?void 0:o.ambientSaturation)||2,b=((a=this.settings)==null?void 0:a.ambientBrightness)||.85;y.uniform1f(this.uSaturationBoost,v+d*1.5),y.uniform1f(this.uBrightnessBoost,b+d*.4),y.bindTexture(y.TEXTURE_2D,this.texture),y.texImage2D(y.TEXTURE_2D,0,y.RGBA,y.RGBA,y.UNSIGNED_BYTE,this.video),y.drawArrays(y.TRIANGLE_STRIP,0,4)}this.animationFrame=requestAnimationFrame(r)};this.animationFrame=requestAnimationFrame(r)}_initAudioContextSafe(){var e;if(this.video)try{if(window.YPP.audioContext=window.YPP.audioContext||new(window.AudioContext||window.webkitAudioContext),window.YPP.audioSources=window.YPP.audioSources||new WeakMap,!window.YPP.audioSources.has(this.video)){const t=window.YPP.audioContext.createMediaElementSource(this.video);window.YPP.globalAudioAnalyser||(window.YPP.globalAudioAnalyser=window.YPP.audioContext.createAnalyser(),window.YPP.globalAudioAnalyser.fftSize=64,window.YPP.globalAudioAnalyser.connect(window.YPP.audioContext.destination)),t.connect(window.YPP.globalAudioAnalyser),window.YPP.audioSources.set(this.video,t)}this.audioContext=window.YPP.audioContext,this.analyser=window.YPP.globalAudioAnalyser,this.dataArray=new Uint8Array(this.analyser.frequencyBinCount),this.audioContext.state==="suspended"&&this.audioContext.resume()}catch{(e=this.utils)==null||e.log("Failed to init Audio Context (likely DRM/CORS)","AMBIENT","warn")}}_onVisibilityChange(){var e,t;(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,`Tab visibility: ${document.hidden?"hidden (paused)":"visible (resumed)"}`,"AMBIENT","debug")}},window.YPP.features.AudioMode=class extends window.YPP.features.BaseFeature{getConfigKey(){return"audioModeEnabled"}constructor(){var e;super("audioMode"),this.Utils=((e=window.YPP)==null?void 0:e.Utils)||{},this.isActive=!1,this.styleId="ypp-audio-mode-style",this.overlay=null}enable(){var e,t,r,i;(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,"YPP Audio Mode: Enabling","AUDIO_MODE","debug"),this.injectStyles(),this.showThumbnailOverlay(),(i=(r=this.Utils).createToast)==null||i.call(r,"Audio Mode Enabled 🎵")}disable(){var t,r,i,n;(r=(t=this.utils)==null?void 0:t.log)==null||r.call(t,"YPP Audio Mode: Disabling","AUDIO_MODE","debug");const e=document.getElementById(this.styleId);e&&e.remove(),this.overlay&&(this.overlay.remove(),this.overlay=null),(n=(i=this.Utils).createToast)==null||n.call(i,"Audio Mode Disabled"),this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null),window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("audio-mode-player"),super.disable()}injectStyles(){const e=`
            /* Hide the video element but keep it playing */
            .html5-video-player video {
                opacity: 0 !important;
            }
            
            /* Hide ad visuals if possible */
            .ytp-ad-image-overlay {
                display: none !important;
            }

            /* Ensure controls are still visible on hover */
            .html5-video-player:hover .ytp-chrome-bottom {
                opacity: 1 !important;
            }
            
            /* Prevent video from being clickable */
            #ypp-audio-overlay {
                cursor: default;
            }
        `;if(!document.getElementById(this.styleId)){const t=document.createElement("style");t.id=this.styleId,t.textContent=e,document.head.appendChild(t)}}async showThumbnailOverlay(){window.YPP&&window.YPP.sharedObserver&&window.YPP.sharedObserver.register("audio-mode-player",".html5-video-player",async e=>{const t=e[0];if(!t||this.overlay)return;const r=new URLSearchParams(window.location.search).get("v");r&&await this._createOverlayForPlayer(t,r)},!0)}async onVideoChange(e){if(this.isEnabled){this.overlay&&(this.overlay.remove(),this.overlay=null);try{const t=await this.waitForElement(".html5-video-player",5e3);t&&e&&await this._createOverlayForPlayer(t,e)}catch{}}}async _createOverlayForPlayer(e,t){if(this.overlay)return;const r=await this.getThumbnailUrl(t),i=document.createElement("div");i.id="ypp-audio-overlay",i.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            overflow: hidden;
        `;let n=this.getVideoTitle();if(n==="Listening to Audio"){try{await this.pollFor(()=>this.getVideoTitle()!=="Listening to Audio",2e3,200)}catch{}n=this.getVideoTitle()}i.innerHTML=`
            <div style="text-align: center; position: relative; z-index: 2;">
                <div style="position: relative; display: inline-block;">
                    <img id="ypp-audio-thumb" src="${r}" 
                         style="max-height: 50vh; max-width: 80vw; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.7); transition: transform 0.3s;"
                         onerror="this.src='https://via.placeholder.com/640x360/1a1a2e/3ea6ff?text=Audio+Mode'">
                    <div style="position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); background: rgba(62,166,255,0.2); padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(10px);">
                        <span style="font-size: 14px; color: #3ea6ff; font-weight: 500;">🎵 Audio Only</span>
                    </div>
                </div>
                <div style="margin-top: 35px; font-family: 'YouTube Sans', 'Roboto', sans-serif; font-size: 18px; color: rgba(255,255,255,0.9); font-weight: 400; max-width: 600px; padding: 0 20px;">
                    ${n}
                </div>
                <!-- Animated visualizer -->
                <div class="ypp-audio-waves" style="display: flex; gap: 5px; justify-content: center; margin-top: 25px; height: 40px; align-items: flex-end;">
                    ${[...Array(7)].map((s,o)=>`
                        <div style="
                            width: 4px; 
                            background: linear-gradient(to top, #3ea6ff, #00d4ff); 
                            border-radius: 4px 4px 0 0;
                            animation: wave ${.8+Math.random()*.6}s infinite ease-in-out ${o*.1}s;
                        "></div>
                    `).join("")}
                </div>
                <style>
                    @keyframes wave {
                        0%, 100% { height: 15px; opacity: 0.5; }
                        50% { height: 40px; opacity: 1; }
                    }
                    #ypp-audio-thumb {
                        transition: transform 0.1s linear, border-radius 0.1s linear;
                    }
                </style>
            </div>
            <!-- Background blur effect -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('${r}');
                background-size: cover;
                background-position: center;
                filter: blur(60px) brightness(0.3);
                opacity: 0.5;
                z-index: 1;
            "></div>
        `,i.onclick=s=>{if(s.target.id!=="ypp-audio-thumb"){const o=document.querySelector("video");o&&(o.paused?o.play():o.pause())}},e.prepend(i),this.overlay=i,this.startLoop()}startLoop(){let e=0;const t=1e3/30,r=i=>{if(!this.isEnabled||!this.overlay)return;const n=i-e;if(n>t){e=i-n%t;const s=document.querySelector("video");if(s&&!s.paused&&!document.hidden&&(this._initAudioContextSafe(),this.analyser&&this.dataArray)){this.analyser.getByteFrequencyData(this.dataArray);let o=0;for(let u=0;u<5;u++)o+=this.dataArray[u];const a=o/5/255;let l=0;for(let u=25;u<30;u++)l+=this.dataArray[u];const d=l/5/255,p=document.getElementById("ypp-audio-thumb");if(p){const u=1+a*.08,h=16+d*20;p.style.transform=`scale(${u})`,p.style.borderRadius=`${h}px`}}}this.animationFrame=requestAnimationFrame(r)};this.animationFrame=requestAnimationFrame(r)}_initAudioContextSafe(){var t;const e=document.querySelector("video");if(e)try{if(window.YPP.audioContext=window.YPP.audioContext||new(window.AudioContext||window.webkitAudioContext),window.YPP.audioSources=window.YPP.audioSources||new WeakMap,!window.YPP.audioSources.has(e)){const r=window.YPP.audioContext.createMediaElementSource(e);window.YPP.globalAudioAnalyser||(window.YPP.globalAudioAnalyser=window.YPP.audioContext.createAnalyser(),window.YPP.globalAudioAnalyser.fftSize=64,window.YPP.globalAudioAnalyser.connect(window.YPP.audioContext.destination)),r.connect(window.YPP.globalAudioAnalyser),window.YPP.audioSources.set(e,r)}this.audioContext=window.YPP.audioContext,this.analyser=window.YPP.globalAudioAnalyser,this.dataArray=new Uint8Array(this.analyser.frequencyBinCount),this.audioContext.state==="suspended"&&this.audioContext.resume()}catch{(t=this.utils)==null||t.log("Failed to init Audio Context (likely DRM/CORS)","AUDIO","warn")}}async getThumbnailUrl(e){const t=[`https://i.ytimg.com/vi/${e}/maxresdefault.jpg`,`https://i.ytimg.com/vi/${e}/sddefault.jpg`,`https://i.ytimg.com/vi/${e}/hqdefault.jpg`];for(const r of t)try{if((await fetch(r,{method:"HEAD"})).ok)return r}catch{}return t[t.length-1]}getVideoTitle(){try{const e=document.querySelector("h1.ytd-watch-metadata yt-formatted-string");if(e)return e.textContent}catch{}return"Listening to Audio"}},window.YPP.features.VideoControls=class extends window.YPP.features.BaseFeature{constructor(){super("VideoControls"),this.panel=null,this.isPanelVisible=!1,this._audioCtx=null,this._gainNode=null,this._compressor=null,this._bassFilter=null,this._midFilter=null,this._trebleFilter=null,this._pannerNode=null,this._sourceNode=null,this._audioConnected=!1}getConfigKey(){return"videoControlsEnabled"}async enable(){var e,t;await super.enable(),(e=this.utils)==null||e.log("Running Video Controls","VideoControls"),(t=this.utils)==null||t.injectCSS("src/content/features/player/video-controls/video-controls.css","ypp-video-controls-css"),this.injectToggle()}async disable(){var r;await super.disable();const e=document.getElementById("ypp-vcp-toggle");e&&e.remove(),this.panel&&(this.panel.remove(),this.panel=null),document.querySelectorAll("[data-ypp-vcp-processed]").forEach(i=>i.removeAttribute("data-ypp-vcp-processed")),window.YPP.sharedObserver&&window.YPP.sharedObserver.unregister("video-controls-btn"),this._teardownAudio();const t=document.querySelector(".html5-main-video")||document.querySelector("video");t&&(t.style.filter="",t.style.transform=""),(r=this.utils)==null||r.removeStyle("ypp-video-controls-css")}_setupAudio(e){var t,r;if(!this._audioConnected)try{e.__ypp_ctx&&e.__ypp_source?(this._audioCtx=e.__ypp_ctx,this._sourceNode=e.__ypp_source):(this._audioCtx=new(window.AudioContext||window.webkitAudioContext),this._sourceNode=this._audioCtx.createMediaElementSource(e),e.__ypp_ctx=this._audioCtx,e.__ypp_source=this._sourceNode),this._gainNode=this._audioCtx.createGain(),this._gainNode.gain.value=1,this._compressor=this._audioCtx.createDynamicsCompressor(),this._compressor.threshold.value=-24,this._compressor.knee.value=10,this._compressor.ratio.value=4,this._compressor.attack.value=.003,this._compressor.release.value=.25,this._bassFilter=this._audioCtx.createBiquadFilter(),this._bassFilter.type="lowshelf",this._bassFilter.frequency.value=250,this._bassFilter.gain.value=0,this._midFilter=this._audioCtx.createBiquadFilter(),this._midFilter.type="peaking",this._midFilter.frequency.value=1e3,this._midFilter.Q.value=1,this._midFilter.gain.value=0,this._trebleFilter=this._audioCtx.createBiquadFilter(),this._trebleFilter.type="highshelf",this._trebleFilter.frequency.value=4e3,this._trebleFilter.gain.value=0,this._pannerNode=this._audioCtx.createStereoPanner(),this._pannerNode.pan.value=0,this._sourceNode.connect(this._bassFilter).connect(this._midFilter).connect(this._trebleFilter).connect(this._pannerNode).connect(this._compressor).connect(this._gainNode),e.__ypp_ext_compressor?(this._gainNode.connect(e.__ypp_ext_compressor.input),e.__ypp_ext_compressor.output.connect(this._audioCtx.destination)):this._gainNode.connect(this._audioCtx.destination),this._audioConnected=!0,(t=this.utils)==null||t.log("Audio engine started","VideoControls")}catch(i){(r=this.utils)==null||r.log("Failed to set up audio engine: "+i.message,"VideoControls","warn")}}_teardownAudio(){try{this._sourceNode&&this._sourceNode.disconnect(),this._bassFilter&&this._bassFilter.disconnect(),this._midFilter&&this._midFilter.disconnect(),this._trebleFilter&&this._trebleFilter.disconnect(),this._pannerNode&&this._pannerNode.disconnect(),this._compressor&&this._compressor.disconnect(),this._gainNode&&this._gainNode.disconnect(),this._audioCtx&&this._audioCtx.close()}catch{}this._audioCtx=null,this._gainNode=null,this._compressor=null,this._pannerNode=null,this._bassFilter=null,this._midFilter=null,this._trebleFilter=null,this._sourceNode=null,this._audioConnected=!1}async injectToggle(){if(!this.utils)return;const e=t=>{if(!this.isEnabled)return;const r=t[0];if(r&&!r.hasAttribute("data-ypp-vcp-processed")){if(r.setAttribute("data-ypp-vcp-processed","true"),r.querySelector("#ypp-vcp-toggle"))return;const i=document.createElement("button");i.id="ypp-vcp-toggle",i.className="ytp-button",i.title="Video Controls",i.innerHTML='<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>',this.addListener(i,"click",()=>this.togglePanel());const n=r.querySelector(".ytp-settings-button");n?r.insertBefore(i,n):r.appendChild(i)}};if(window.YPP.sharedObserver)window.YPP.sharedObserver.register("video-controls-btn",".ytp-right-controls",e,!0);else{const t=document.querySelector(".ytp-right-controls");t&&e([t])}}togglePanel(){this.panel||this.createPanel(),this.isPanelVisible=!this.isPanelVisible,this.panel.classList.toggle("visible",this.isPanelVisible)}createPanel(){this.panel=document.createElement("div"),this.panel.id="ypp-video-control-panel",this.panel.innerHTML=`
            <div class="ypp-vcp-header" id="ypp-vcp-drag">
                <div class="ypp-vcp-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
                    Control Center
                </div>
                <button class="ypp-vcp-close">&times;</button>
            </div>
            
            <div class="ypp-vcp-tabs">
                <button class="ypp-vcp-tab active" data-tab="video">🎬 Video</button>
                <button class="ypp-vcp-tab" data-tab="audio">🎧 Audio</button>
            </div>
            
            <!-- 🎬 VIDEO TAB -->
            <div class="ypp-vcp-tab-content active" id="ypp-tab-video">
                <div class="ypp-vcp-section">
                    <div class="ypp-vcp-label">Playback Speed</div>
                    <div class="ypp-slider-container">
                        <input type="range" min="0.25" max="4" step="0.05" value="1" class="ypp-slider" id="ypp-speed-slider">
                        <span class="ypp-value-display" id="ypp-speed-val">1.0x</span>
                    </div>
                </div>

                <div class="ypp-vcp-divider"></div>
                <div class="ypp-vcp-section-title">Cinematic Filters</div>

                <div class="ypp-vcp-section">
                    <div class="ypp-vcp-label">Brightness</div>
                    <div class="ypp-slider-container">
                        <input type="range" min="0" max="200" step="5" value="100" class="ypp-slider" id="ypp-bright-slider">
                        <span class="ypp-value-display" id="ypp-bright-val">100%</span>
                    </div>
                </div>
                <div class="ypp-vcp-section">
                    <div class="ypp-vcp-label">Contrast</div>
                    <div class="ypp-slider-container">
                        <input type="range" min="0" max="200" step="5" value="100" class="ypp-slider" id="ypp-contrast-slider">
                        <span class="ypp-value-display" id="ypp-contrast-val">100%</span>
                    </div>
                </div>
                <div class="ypp-vcp-section">
                    <div class="ypp-vcp-label">Saturation</div>
                    <div class="ypp-slider-container">
                        <input type="range" min="0" max="300" step="5" value="100" class="ypp-slider ypp-slider-accent" id="ypp-sat-slider">
                        <span class="ypp-value-display" id="ypp-sat-val">100%</span>
                    </div>
                </div>
                <div class="ypp-vcp-section">
                    <div class="ypp-vcp-label">Hue Shift</div>
                    <div class="ypp-slider-container">
                        <input type="range" min="-180" max="180" step="5" value="0" class="ypp-slider ypp-slider-accent" id="ypp-hue-slider">
                        <span class="ypp-value-display" id="ypp-hue-val">0°</span>
                    </div>
                </div>

                <div class="ypp-vcp-actions" style="margin-top: 12px;">
                    <button class="ypp-action-btn" id="ypp-sepia-btn">Sepia</button>
                    <button class="ypp-action-btn" id="ypp-gray-btn">Grayscale</button>
                    <button class="ypp-action-btn" id="ypp-flip-btn">Flip</button>
                    <button class="ypp-action-btn" id="ypp-loop-btn">Loop</button>
                </div>
            </div>

            <!-- 🎧 AUDIO TAB -->
            <div class="ypp-vcp-tab-content" id="ypp-tab-audio">
                <div class="ypp-vcp-section">
                    <div class="ypp-vcp-label-row">
                        <span class="ypp-vcp-label ypp-label-accent">Volume Booster</span>
                        <span class="ypp-badge" id="ypp-boost-badge">OFF</span>
                    </div>
                    <div class="ypp-slider-container">
                        <input type="range" min="1" max="5" step="0.05" value="1" class="ypp-slider ypp-slider-accent" id="ypp-volume-slider">
                        <span class="ypp-value-display" id="ypp-volume-val">100%</span>
                    </div>
                </div>
                
                <div class="ypp-vcp-section">
                    <div class="ypp-vcp-label">Stereo Pan</div>
                    <div class="ypp-slider-container">
                        <input type="range" min="-1" max="1" step="0.1" value="0" class="ypp-slider" id="ypp-pan-slider">
                        <span class="ypp-value-display" id="ypp-pan-val">C</span>
                    </div>
                </div>

                <div class="ypp-vcp-divider"></div>
                
                <div class="ypp-vcp-section">
                    <div class="ypp-vcp-label-row">
                        <span class="ypp-vcp-section-title" style="margin:0;">Pro Equalizer</span>
                        <button class="ypp-pill-toggle" id="ypp-enhancer-toggle" aria-pressed="false">OFF</button>
                    </div>
                    <div class="ypp-enhancer-body" id="ypp-enhancer-body">
                        <div class="ypp-vcp-sub-label">Bass</div>
                        <div class="ypp-slider-container">
                            <input type="range" min="-12" max="12" step="1" value="0" class="ypp-slider" id="ypp-bass-slider">
                            <span class="ypp-value-display" id="ypp-bass-val">0 dB</span>
                        </div>
                        <div class="ypp-vcp-sub-label">Mid (Vocals)</div>
                        <div class="ypp-slider-container">
                            <input type="range" min="-12" max="12" step="1" value="0" class="ypp-slider" id="ypp-mid-slider">
                            <span class="ypp-value-display" id="ypp-mid-val">0 dB</span>
                        </div>
                        <div class="ypp-vcp-sub-label">Treble</div>
                        <div class="ypp-slider-container">
                            <input type="range" min="-12" max="12" step="1" value="0" class="ypp-slider" id="ypp-treble-slider">
                            <span class="ypp-value-display" id="ypp-treble-val">0 dB</span>
                        </div>
                        <div class="ypp-vcp-hint" style="margin-top:8px;">Studio compressor active. Prevents peaking at high volumes.</div>
                    </div>
                </div>
            </div>
            </div>
            
            <div style="text-align: center; margin-top: 8px;">
                 <button class="ypp-action-btn" id="ypp-reset-btn" style="width: 100%;">Reset All</button>
            </div>
        `,document.body.appendChild(this.panel),this.restorePosition(),this.setupListeners(),this.makeDraggable()}setupListeners(){const e=document.querySelector(".html5-main-video")||document.querySelector("video");if(!e)return;const t=this.panel.querySelectorAll(".ypp-vcp-tab"),r=this.panel.querySelectorAll(".ypp-vcp-tab-content");t.forEach(M=>{this.addListener(M,"click",L=>{t.forEach(R=>R.classList.remove("active")),r.forEach(R=>R.classList.remove("active")),M.classList.add("active");const k=`ypp-tab-${M.dataset.tab}`;this.panel.querySelector("#"+k).classList.add("active")})});const i=this.panel.querySelector("#ypp-speed-slider"),n=this.panel.querySelector("#ypp-speed-val");this.addListener(i,"input",M=>{const L=parseFloat(M.target.value);e.playbackRate=L,n.textContent=L+"x"});const s=this.panel.querySelector("#ypp-bright-slider"),o=this.panel.querySelector("#ypp-contrast-slider"),a=this.panel.querySelector("#ypp-sat-slider"),l=this.panel.querySelector("#ypp-hue-slider"),d=this.panel.querySelector("#ypp-sepia-btn"),p=this.panel.querySelector("#ypp-gray-btn"),u=this.panel.querySelector("#ypp-flip-btn"),h=this.panel.querySelector("#ypp-loop-btn"),m=()=>{const M=s.value,L=o.value,k=a.value,R=l.value,U=d.classList.contains("active")?"sepia(100%)":"",j=p.classList.contains("active")?"grayscale(100%)":"",I=u.classList.contains("active");let D=[`brightness(${M}%)`,`contrast(${L}%)`,`saturate(${k}%)`,`hue-rotate(${R}deg)`,U,j];I&&D.push("scaleX(-1)"),e.style.filter=D.filter(Boolean).join(" ").trim(),e.style.transform="",this.panel.querySelector("#ypp-bright-val").textContent=M+"%",this.panel.querySelector("#ypp-contrast-val").textContent=L+"%",this.panel.querySelector("#ypp-sat-val").textContent=k+"%",this.panel.querySelector("#ypp-hue-val").textContent=R+"°",y(s,M,200),y(o,L,200),y(a,k,300),y(l,parseInt(R)+180,360)},y=(M,L,k)=>{M.style.setProperty("--pct",L/k*100+"%")};[s,o,a,l].forEach(M=>{this.addListener(M,"input",m)}),[d,p,u].forEach(M=>{this.addListener(M,"click",L=>{L.currentTarget.classList.toggle("active"),m()})}),this.addListener(h,"click",M=>{M.currentTarget.classList.toggle("active"),e.loop=M.currentTarget.classList.contains("active")}),this.addListener(i,"dblclick",()=>{i.value=1,e.playbackRate=1,n.textContent="1.0x"}),this.addListener(s,"dblclick",()=>{s.value=100,m()}),this.addListener(o,"dblclick",()=>{o.value=100,m()}),this.addListener(a,"dblclick",()=>{a.value=100,m()}),this.addListener(l,"dblclick",()=>{l.value=0,m()});const v=this.panel.querySelector("#ypp-volume-slider"),b=this.panel.querySelector("#ypp-volume-val"),f=this.panel.querySelector("#ypp-boost-badge"),g=this.panel.querySelector("#ypp-pan-slider"),_=this.panel.querySelector("#ypp-pan-val"),P=this.panel.querySelector("#ypp-enhancer-toggle"),w=this.panel.querySelector("#ypp-enhancer-body"),C=this.panel.querySelector("#ypp-bass-slider"),x=this.panel.querySelector("#ypp-bass-val"),S=this.panel.querySelector("#ypp-mid-slider"),E=this.panel.querySelector("#ypp-mid-val"),N=this.panel.querySelector("#ypp-treble-slider"),A=this.panel.querySelector("#ypp-treble-val");let Y=!1;w.style.display="none";const O=()=>{this._audioConnected||this._setupAudio(e),this._audioCtx&&this._audioCtx.state==="suspended"&&this._audioCtx.resume()};this.addListener(v,"input",M=>{const L=parseFloat(M.target.value);O(),this._gainNode&&(this._gainNode.gain.value=L),b.textContent=Math.round(L*100)+"%",v.style.setProperty("--pct",(L-1)/4*100+"%");const k=L>1.01;f.textContent=k?Math.round(L*100)+"%":"OFF",f.classList.toggle("active",k)}),this.addListener(v,"dblclick",()=>{v.value=1,this._gainNode&&(this._gainNode.gain.value=1),b.textContent="100%",f.textContent="OFF",f.classList.remove("active"),v.style.setProperty("--pct","0%")}),this.addListener(g,"input",M=>{const L=parseFloat(M.target.value);O(),this._pannerNode&&(this._pannerNode.pan.value=L);let k="C";L<0&&(k=`L ${Math.abs(Math.round(L*100))}%`),L>0&&(k=`R ${Math.round(L*100)}%`),_.textContent=k,g.style.setProperty("--pct",(L+1)/2*100+"%")}),this.addListener(g,"dblclick",()=>{g.value=0,this._pannerNode&&(this._pannerNode.pan.value=0),_.textContent="C",g.style.setProperty("--pct","50%")}),this.addListener(P,"click",()=>{Y=!Y,P.textContent=Y?"ON":"OFF",P.setAttribute("aria-pressed",String(Y)),P.classList.toggle("on",Y),w.style.display=Y?"flex":"none",Y?(O(),this._bassFilter&&(this._bassFilter.gain.value=parseFloat(C.value)),this._midFilter&&(this._midFilter.gain.value=parseFloat(S.value)),this._trebleFilter&&(this._trebleFilter.gain.value=parseFloat(N.value)),this._compressor&&(this._compressor.ratio.value=4)):(this._bassFilter&&(this._bassFilter.gain.value=0),this._midFilter&&(this._midFilter.gain.value=0),this._trebleFilter&&(this._trebleFilter.gain.value=0),this._compressor&&(this._compressor.ratio.value=1))}),this.addListener(C,"input",M=>{O();const L=parseInt(M.target.value);this._bassFilter&&Y&&(this._bassFilter.gain.value=L),x.textContent=(L>0?"+":"")+L+" dB",C.style.setProperty("--pct",(L+12)/24*100+"%")}),this.addListener(C,"dblclick",()=>{C.value=0,C.dispatchEvent(new Event("input"))}),this.addListener(S,"input",M=>{O();const L=parseInt(M.target.value);this._midFilter&&Y&&(this._midFilter.gain.value=L),E.textContent=(L>0?"+":"")+L+" dB",S.style.setProperty("--pct",(L+12)/24*100+"%")}),this.addListener(S,"dblclick",()=>{S.value=0,S.dispatchEvent(new Event("input"))}),this.addListener(N,"input",M=>{O();const L=parseInt(M.target.value);this._trebleFilter&&Y&&(this._trebleFilter.gain.value=L),A.textContent=(L>0?"+":"")+L+" dB",N.style.setProperty("--pct",(L+12)/24*100+"%")}),this.addListener(N,"dblclick",()=>{N.value=0,N.dispatchEvent(new Event("input"))});const F=this.panel.querySelector("#ypp-reset-btn");this.addListener(F,"click",()=>{e.playbackRate=1,e.style.filter="",e.style.transform="",e.loop=!1,i.value=1,n.textContent="1.0x",s.value=100,this.panel.querySelector("#ypp-bright-val").textContent="100%",s.style.setProperty("--pct","50%"),o.value=100,this.panel.querySelector("#ypp-contrast-val").textContent="100%",o.style.setProperty("--pct","50%"),a.value=100,this.panel.querySelector("#ypp-sat-val").textContent="100%",a.style.setProperty("--pct","33%"),l.value=0,this.panel.querySelector("#ypp-hue-val").textContent="0°",l.style.setProperty("--pct","50%"),d.classList.remove("active"),p.classList.remove("active"),h.classList.remove("active"),u.classList.remove("active"),v.value=1,b.textContent="100%",v.style.setProperty("--pct","0%"),f.textContent="OFF",f.classList.remove("active"),this._gainNode&&(this._gainNode.gain.value=1),g.value=0,_.textContent="C",g.style.setProperty("--pct","50%"),this._pannerNode&&(this._pannerNode.pan.value=0),Y=!1,P.textContent="OFF",P.setAttribute("aria-pressed","false"),P.classList.remove("on"),w.style.display="none",C.value=0,x.textContent="0 dB",C.style.setProperty("--pct","50%"),S.value=0,E.textContent="0 dB",S.style.setProperty("--pct","50%"),N.value=0,A.textContent="0 dB",N.style.setProperty("--pct","50%"),this._bassFilter&&(this._bassFilter.gain.value=0),this._midFilter&&(this._midFilter.gain.value=0),this._trebleFilter&&(this._trebleFilter.gain.value=0),this._compressor&&(this._compressor.ratio.value=1)});const T=this.panel.querySelector(".ypp-vcp-close");this.addListener(T,"click",()=>this.togglePanel())}makeDraggable(){const e=this.panel.querySelector("#ypp-vcp-drag");let t=!1,r,i,n,s;const o=d=>{t=!0,this.panel.classList.add("dragging"),r=d.clientX,i=d.clientY;const p=this.panel.getBoundingClientRect();n=p.left,s=p.top,this.panel.style.right="auto",this.panel.style.bottom="auto",this.panel.style.left=n+"px",this.panel.style.top=s+"px"},a=d=>{if(!t)return;const p=d.clientX-r,u=d.clientY-i;this.panel.style.left=n+p+"px",this.panel.style.top=s+u+"px"},l=()=>{if(t){t=!1,this.panel.classList.remove("dragging");const d=this.panel.style.left,p=this.panel.style.top;localStorage.setItem("ypp-vcp-pos",JSON.stringify({left:d,top:p}))}};this.addListener(e,"mousedown",o),this.addListener(document,"mousemove",a),this.addListener(document,"mouseup",l)}restorePosition(){const e=localStorage.getItem("ypp-vcp-pos");if(e)try{const t=JSON.parse(e);t.left&&t.top&&(this.panel.style.left=t.left,this.panel.style.top=t.top,this.panel.style.right="auto")}catch{}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.ClassicProgressBar=class extends window.YPP.features.BaseFeature{constructor(){super("ClassicProgressBar"),this.styleId="ypp-classic-progress-bar-style"}getConfigKey(){return"revertProgressBar"}async enable(){await super.enable(),this.injectCSS()}async disable(){await super.disable(),this.removeCSS()}injectCSS(){var t;if(document.getElementById(this.styleId))return;const e=document.createElement("style");e.id=this.styleId,e.textContent=`
            /* Remove modern gradient from progress bar */
            .ytp-swatch-background-color {
                background: #f00 !important;
                background-color: #f00 !important;
            }
            
            /* Remove the gradient that appears on hover/drag */
            .ytp-progress-list {
                background: rgba(255, 255, 255, 0.2) !important;
            }
            
            .ytp-play-progress {
                background: #f00 !important;
                background-color: #f00 !important;
            }
            
            /* Ensure chapters still have separators */
            .ytp-chapter-hover-container {
                background-color: transparent !important;
            }
            
            /* Keep scrubber button red */
            .ytp-scrubber-button {
                background: #f00 !important;
                background-color: #f00 !important;
                box-shadow: none !important;
            }
        `,document.head.appendChild(e),(t=this.utils)!=null&&t.log&&this.utils.log("Classic Progress Bar CSS injected","UI")}removeCSS(){var t;const e=document.getElementById(this.styleId);e&&(e.remove(),(t=this.utils)!=null&&t.log&&this.utils.log("Classic Progress Bar CSS removed","UI"))}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.WheelControls=class extends window.YPP.features.BaseFeature{constructor(){super("WheelControls"),this.playerContainer=null,this.videoElement=null,this.handleWheel=this.handleWheel.bind(this)}getConfigKey(){return"wheelControls"}async enable(){var e;this.isActive=!0,await super.enable();try{if(this.playerContainer=await this.waitForElement("#movie_player",1e4),!this.isActive)return;this.addListener(window,"wheel",this.handleWheel,{passive:!1})}catch(t){(e=this.utils)==null||e.log("Error enabling WheelControls","WHEEL","error",t)}}async disable(){this.isActive=!1,await super.disable(),this.playerContainer=null}getVideoElement(){return this.videoElement=document.querySelector("video.video-stream.html5-main-video"),this.videoElement}handleWheel(e){var a;const t=e.shiftKey&&!e.altKey&&!e.ctrlKey&&!e.metaKey,r=e.altKey&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey;if(!t&&!r)return;const i=this.getVideoElement();if(!i||!this.playerContainer)return;const n=this.playerContainer.getBoundingClientRect();if(!(e.clientX>=n.left&&e.clientX<=n.right&&e.clientY>=n.top&&e.clientY<=n.bottom))return;e.preventDefault(),e.stopPropagation();const o=e.deltaY<0;if(t){let l=i.playbackRate,d=o?l+.25:l-.25;d=Math.max(.25,Math.min(d,10)),d=Math.round(d*4)/4;const p=(a=window.YPP.featureManager)==null?void 0:a.getFeature("videoSpeedController");p?(p.controllers.has(i)||p.attachToVideo(i),p.setSpeed(i,d)):i.playbackRate=d,this.utils.createToast&&this.utils.createToast(`Speed: ${d}x`,"info")}else if(r){let l=i.volume,d=o?l+.05:l-.05;d=Math.max(0,Math.min(d,1));const p=document.querySelector("#movie_player");p&&p.setVolume?(p.setVolume(Math.round(d*100)),d>0&&p.isMuted()&&p.unMute()):(i.volume=d,i.muted=d===0),this.utils.createToast&&this.utils.createToast(`Volume: ${Math.round(d*100)}%`,"info")}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AudioCompressor=class extends window.YPP.features.BaseFeature{constructor(){super("AudioCompressor"),this.audioContext=null,this.sourceNode=null,this.compressorNode=null,this.gainNode=null,this.videoElement=null,this.isProcessing=!1,this.handleVideoLoaded=this.handleVideoLoaded.bind(this)}getConfigKey(){return"audioCompressor"}async enable(){this.utils.isWatchPage()&&(await super.enable(),this.init(),this.addListener(window,"yt-navigate-finish",()=>{this.utils.isWatchPage()&&this.isEnabled&&this.init()}))}async disable(){await super.disable(),this.disconnectAudio()}async onUpdate(){this.utils.isWatchPage()&&!this.isProcessing&&this.init()}disconnectAudio(){var e,t;if(this.isProcessing){try{this.sourceNode&&this.audioContext&&(this.sourceNode.disconnect(),this.sourceNode.connect(this.audioContext.destination))}catch{(t=(e=this.utils).log)==null||t.call(e,"Failed to disconnect audio compressor","AUDIO","warn")}this.isProcessing=!1,this.utils.createToast&&this.utils.createToast("Audio normalization disabled")}}async init(){var e,t;if(!this.isProcessing)try{const r=await this.waitForElement("video.video-stream.html5-main-video",1e4);if(r){this.videoElement=r;const i=()=>{this.setupAudioNodes()};this.videoElement.paused?this.addListener(this.videoElement,"play",i):i()}}catch{(t=(e=this.utils).log)==null||t.call(e,"AudioCompressor initialization timed out","AUDIO","warn")}}handleVideoLoaded(){this.setupAudioNodes()}setupAudioNodes(){var e,t,r,i;if(!(!this.videoElement||this.isProcessing||!this.isEnabled))try{this.videoElement.__ypp_ctx?this.audioContext=this.videoElement.__ypp_ctx:(this.audioContext=window.YPP.audioContext||new(window.AudioContext||window.webkitAudioContext),window.YPP.audioContext=this.audioContext,this.videoElement.__ypp_ctx=this.audioContext),this.videoElement.__ypp_source||(this.videoElement.__ypp_source=this.audioContext.createMediaElementSource(this.videoElement)),this.sourceNode=this.videoElement.__ypp_source;const n=(t=(e=window.YPP.featureManager)==null?void 0:e.getFeature("volumeBoost"))==null?void 0:t._audioConnected;if(n||this.sourceNode.disconnect(),this.compressorNode||(this.compressorNode=this.audioContext.createDynamicsCompressor(),this.compressorNode.threshold.value=-35,this.compressorNode.knee.value=30,this.compressorNode.ratio.value=10,this.compressorNode.attack.value=.005,this.compressorNode.release.value=.05),this.gainNode||(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=2.5),!this.limiterNode){this.limiterNode=this.audioContext.createWaveShaper();const s=8192,o=new Float32Array(s);for(let a=0;a<s;++a){const l=a*2/s-1;o[a]=Math.tanh(l)}this.limiterNode.curve=o}if(this.compressorNode.connect(this.gainNode),this.gainNode.connect(this.limiterNode),this.videoElement.__ypp_ext_compressor={input:this.compressorNode,output:this.limiterNode},n){const s=window.YPP.featureManager.getFeature("volumeBoost");s._buildAudioGraph&&(s.source.disconnect(),s._buildAudioGraph())}else this.sourceNode.connect(this.compressorNode),this.limiterNode.connect(this.audioContext.destination);this.audioContext.state==="suspended"&&this.audioContext.resume(),this.audioContext.onstatechange=()=>{var s,o;this.audioContext.state==="suspended"&&this.isEnabled&&this.isProcessing?((o=(s=this.utils).log)==null||o.call(s,"AudioContext suspended unexpectedly. Resuming...","AUDIO","warn"),this.audioContext.resume()):this.audioContext.state==="closed"&&(this.isProcessing=!1,this.audioContext=null)},navigator.mediaDevices&&!this._deviceChangeListenerBound&&(this._deviceChangeListenerBound=!0,this.addListener(navigator.mediaDevices,"devicechange",()=>{var s,o;(o=(s=this.utils).log)==null||o.call(s,"Audio output device changed. Re-initializing compressor graph...","AUDIO","warn"),this.isEnabled&&this.isProcessing&&(this.disconnectAudio(),this.pollFor(()=>!0,500,500).then(()=>this.setupAudioNodes()))})),this.isProcessing=!0,this.utils.createToast&&this.utils.createToast("Audio normalization enabled")}catch(n){(i=(r=this.utils).log)==null||i.call(r,`Failed to setup AudioContext: ${n.message}`,"AUDIO","error");const s=()=>{this.isEnabled&&!this.isProcessing&&this.setupAudioNodes()};this.addListener(this.videoElement,"play",s,{once:!0})}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.VideoResumer=class extends window.YPP.features.BaseFeature{constructor(){super("VideoResumer"),this.videoElement=null,this.videoId=null,this.saveInterval=null,this.handleTimeUpdate=this.handleTimeUpdate.bind(this),this.handleNavigation=this.handleNavigation.bind(this),this.STORAGE_KEY_PREFIX="ypp_resume_"}getConfigKey(){return"videoResumer"}async enable(){await super.enable(),this.addListener(window,"yt-navigate-finish",this.handleNavigation),this.utils.isWatchPage()&&this.init()}async disable(){await super.disable(),this.cleanup()}async onUpdate(){this.utils.isWatchPage()&&!this.videoElement&&this.init()}handleNavigation(){this.cleanup(),this.utils.isWatchPage()&&this.isEnabled&&this.init()}cleanup(){this.saveInterval&&(clearInterval(this.saveInterval),this.saveInterval=null),this.videoElement&&this.videoElement.removeEventListener("timeupdate",this.handleTimeUpdate),this.videoElement=null,this.videoId=null}getVideoId(){return new URLSearchParams(window.location.search).get("v")}async init(){var e,t;if(this.videoId=this.getVideoId(),!!this.videoId)try{const r=await this.utils.pollFor(()=>{const i=document.querySelector("video.video-stream.html5-main-video");return i&&i.readyState>=1?i:null},1e4,500);r&&this.isEnabled&&(this.videoElement=r,await this.restoreTime(),this.addListener(this.videoElement,"timeupdate",this.handleTimeUpdate),this.addListener(window,"pagehide",()=>this.forceSave()),this.addListener(document,"visibilitychange",()=>{document.hidden&&this.forceSave()}))}catch{(t=(e=this.utils).log)==null||t.call(e,"Smart Video Resumer timed out","RESUMER","warn")}}async restoreTime(){var e,t,r,i;if(!(!this.videoId||!this.videoElement))try{const s=await window.YPP.StorageManager.get(this.STORAGE_KEY_PREFIX+this.videoId);if(!s)return;const o=parseFloat(s);if(isNaN(o))return;if(this.videoElement.currentTime<o&&o>5){const a=this.videoElement.duration;if(a&&o/a>.95){window.YPP.StorageManager.remove(this.STORAGE_KEY_PREFIX+this.videoId);return}this.videoElement.currentTime=o,(t=(e=this.utils).log)==null||t.call(e,`Resumed at ${o}s`,"RESUMER"),this.utils.createToast&&this.utils.createToast("Playback Resumed","info")}}catch(n){(i=(r=this.utils).log)==null||i.call(r,"Failed to restore time from storage","RESUMER","warn",n)}}forceSave(){if(!this.videoElement||!this.videoId)return;const e=this.videoElement.currentTime,t=this.videoElement.duration;try{t&&e/t>.95?window.YPP.StorageManager.remove(this.STORAGE_KEY_PREFIX+this.videoId):e>5&&window.YPP.StorageManager.set(this.STORAGE_KEY_PREFIX+this.videoId,e.toString())}catch{}}handleTimeUpdate(){if(!this.videoElement||!this.videoId)return;const e=Date.now();(!this.lastSave||e-this.lastSave>1e4)&&(this.forceSave(),this.lastSave=e)}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AutoPause=class extends window.YPP.features.BaseFeature{constructor(){super("AutoPause"),this.handleVisibilityChange=this.handleVisibilityChange.bind(this),this.wasPausedByUs=!1,this.video=null}getConfigKey(){return"autoPause"}async enable(){await super.enable(),this.addListener(document,"visibilitychange",this.handleVisibilityChange),this.utils.isWatchPage()&&this._cacheVideoElement()}async disable(){await super.disable(),this.video=null,this.wasPausedByUs=!1}onVideoChange(e){this.isEnabled&&(this.wasPausedByUs=!1,this._cacheVideoElement())}async _cacheVideoElement(){var t,r,i,n;const e=((r=(t=window.YPP.CONSTANTS)==null?void 0:t.SELECTORS)==null?void 0:r.VIDEO)||"video.html5-main-video";try{this.video=await this.waitForElement(e,5e3)}catch{(n=(i=this.utils).log)==null||n.call(i,"Failed to find video element for AutoPause","AutoPause","warn"),this.video=null}}handleVisibilityChange(){var e,t,r,i,n,s;if(!(!this.isEnabled||!this.utils.isWatchPage())){if(!this.video){const o=((t=(e=window.YPP.CONSTANTS)==null?void 0:e.SELECTORS)==null?void 0:t.VIDEO)||"video.html5-main-video";this.video=document.querySelector(o)}if(this.video){if(document.pictureInPictureElement){this.wasPausedByUs=!1;return}document.hidden?!this.video.paused&&!this.video.ended?(this.wasPausedByUs=!0,this.video.pause(),(i=(r=this.utils).log)==null||i.call(r,"Auto paused video (tab hidden)","AutoPause")):this.wasPausedByUs=!1:(this.wasPausedByUs&&(this.video.play().catch(o=>{var a,l;(l=(a=this.utils).log)==null||l.call(a,"Failed to auto-resume video: "+o.message,"AutoPause","warn")}),(s=(n=this.utils).log)==null||s.call(n,"Auto resumed video (tab visible)","AutoPause")),this.wasPausedByUs=!1)}}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AutoCinema=class extends window.YPP.features.BaseFeature{getConfigKey(){return"autoCinema"}constructor(){super("AutoCinema"),this._navHandler=this._onNavigation.bind(this),this._resizeHandler=this._onResize.bind(this),this._resizeTimeout=null}enable(){var e,t;this._userOverridden=!1,this._buttonClickListener=r=>{r.target.closest(".ytp-size-button")&&r.isTrusted&&(this._userOverridden=!0)},document.addEventListener("click",this._buttonClickListener,!0),location.pathname==="/watch"&&this._clickTheaterButton(),this.addListener(window,"yt-navigate-finish",this._navHandler),this.addListener(window,"resize",this._resizeHandler),(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,"Auto Cinema enabled","AUTO_CINEMA")}disable(){var e,t;this._buttonClickListener&&document.removeEventListener("click",this._buttonClickListener,!0),window.removeEventListener("yt-navigate-finish",this._navHandler),window.removeEventListener("resize",this._resizeHandler),this._resizeTimeout&&clearTimeout(this._resizeTimeout),this._clickTimeout&&clearTimeout(this._clickTimeout),(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,"Auto Cinema disabled","AUTO_CINEMA")}_onNavigation(){location.pathname==="/watch"&&this._clickTheaterButton()}_onResize(){location.pathname==="/watch"&&(this._resizeTimeout&&clearTimeout(this._resizeTimeout),this._resizeTimeout=setTimeout(()=>{this._clickTheaterButton()},500))}async _clickTheaterButton(){var e,t,r;if(!this._userOverridden&&!((e=this.settings)!=null&&e.zenMode))try{const i=await((r=(t=this.utils)==null?void 0:t.pollFor)==null?void 0:r.call(t,()=>document.querySelector(".ytp-size-button"),6e3,400));if(!i)return;this._clickTimeout&&clearTimeout(this._clickTimeout),this._clickTimeout=setTimeout(()=>{const n=document.querySelector("ytd-watch-flexy");!(n&&n.hasAttribute("theater"))&&!this._userOverridden&&i.click()},300)}catch{}}},window.YPP=window.YPP||{},window.YPP.features=window.YPP.features||{},window.YPP.features.AutoPiP=class extends window.YPP.features.BaseFeature{getConfigKey(){return"autoPiP"}constructor(){super("AutoPiP"),this._boundAutoPiP=null}async enable(){var e,t;await super.enable(),!this._boundAutoPiP&&(this._boundAutoPiP=async()=>{if(window.location.pathname.startsWith("/shorts/"))return;const r=document.querySelector("video");if(r){if(document.hidden&&!r.paused&&!r.ended){if(document.pictureInPictureEnabled&&!document.pictureInPictureElement)try{await r.requestPictureInPicture();const i=async()=>{if(document.pictureInPictureElement)try{await document.exitPictureInPicture()}catch{}this.removeListener(r,"ended",i)};this.addListener(r,"ended",i)}catch{}}else if(!document.hidden&&document.pictureInPictureElement)try{await document.exitPictureInPicture()}catch{}}},this.addListener(document,"visibilitychange",this._boundAutoPiP),(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,"Auto PiP enabled","AUTO_PIP"))}async disable(){var e,t;await super.disable(),this._boundAutoPiP=null,document.pictureInPictureElement&&document.exitPictureInPicture().catch(()=>{}),(t=(e=this.utils)==null?void 0:e.log)==null||t.call(e,"Auto PiP disabled","AUTO_PIP")}},window.YPP=window.YPP||{},window.YPP.FeatureManager=class{constructor(){this.features={},this.instantiated=!1,this.settings=null,this.errorCounts={},this.MAX_ERRORS=3,this._currentApplyId=0,this._applyQueue=[],this._processingQueue=!1,this._errorLogTimestamps={},this._errorLogRateLimit=5e3}init(e){var r,i;this.settings={...this.settings,...e||((i=(r=window.YPP)==null?void 0:r.CONSTANTS)==null?void 0:i.DEFAULT_SETTINGS)||{}};const t=Date.now();(!this.lastReset||t-this.lastReset>5e3)&&(this.resetErrors(),this.lastReset=t),this.instantiated||(this.instantiateFeatures(),this.instantiated=!0,this.setupLifecycleBindings()),this.applyFeatures()}setupLifecycleBindings(){window.YPP.events&&(window.YPP.events.on("app:pageChange",e=>{Object.entries(this.features).forEach(([t,r])=>{this.errorCounts[t]>=this.MAX_ERRORS||r.isEnabled&&typeof r.onPageChange=="function"&&this.safeRun(t,()=>r.onPageChange(e))})}),window.YPP.events.on("app:videoChange",e=>{Object.entries(this.features).forEach(([t,r])=>{this.errorCounts[t]>=this.MAX_ERRORS||r.isEnabled&&typeof r.onVideoChange=="function"&&this.safeRun(t,()=>r.onVideoChange(e))})}))}resetErrors(){this.errorCounts={}}instantiateFeatures(){var o,a,l;const e=(a=(o=window.YPP)==null?void 0:o.CONSTANTS)==null?void 0:a.FEATURE_MAP;if(!e){window.YPP.Utils.log("FEATURE_MAP not found in Constants. Features will not load.","MANAGER","error");return}if(!((l=window.YPP)!=null&&l.features)){window.YPP.Utils.log("window.YPP.features namespace not found","MANAGER","error");return}let t=0,r=0;const i=Object.keys(e).length,n=new Set(Object.keys(e));for(const d of Object.keys(this.features))if(!n.has(d)){try{typeof this.features[d].disable=="function"&&this.features[d].disable()}catch{}delete this.features[d]}const s=[];for(const[d,p]of Object.entries(e))try{if(this.features[d]){t++;continue}typeof window.YPP.features[p]=="function"?(this.features[d]=new window.YPP.features[p],this.errorCounts[d]=0,t++):(r++,s.push(`${d} → ${p}`))}catch(u){r++,window.YPP.Utils.log(`Failed to instantiate '${p}': ${(u==null?void 0:u.message)||"Unknown error"}`,"MANAGER","error")}r>0&&s.length>0&&window.YPP.Utils.log(`Missing features: ${s.join(", ")}`,"MANAGER","warn"),window.YPP.Utils.log(`Feature instantiation complete: ${t}/${i} loaded`+(r>0?`, ${r} failed/unavailable`:""),"MANAGER","info")}getFeature(e){return this.features[e]||null}async applyFeatures(){if(this._applyQueue.push(++this._currentApplyId),!this._processingQueue){this._processingQueue=!0;try{for(;this._applyQueue.length>0;){const e=this._applyQueue.shift();await this._executeApply(e)}}finally{this._processingQueue=!1}}}async _executeApply(e){if(this._currentApplyId!==e)return;const t=["theme","headerNav","sidebarLayout","layout","autoScaleLayout","keyboardShortcuts","videoSpeedController","volumeBoost","videoFilters","hideWatched","multiSelect","playlistRedesign","gridAnimator","ambientMode"],r=Object.entries(this.features).sort((d,p)=>{const u=t.indexOf(d[0]),h=t.indexOf(p[0]);return(u===-1?999:u)-(h===-1?999:h)}),i=["theme","headerNav","sidebarLayout","layout","playlistRedesign","volumeBoost","videoFilters","historyRedesign","watchRedesign","globalPlayerBar","deckMode","subscriptionFolders"],n=["autoScaleLayout"],s=r.filter(([d])=>i.includes(d)),o=r.filter(([d])=>n.includes(d));await Promise.all(s.map(([d,p])=>this._runFeatureUpdate(d,p,e))),await Promise.all(o.map(([d,p])=>this._runFeatureUpdate(d,p,e)));const a=new Set([...i,...n]),l=r.filter(([d])=>!a.has(d));window.requestIdleCallback?window.requestIdleCallback(()=>{this._currentApplyId===e&&(l.forEach(([d,p])=>{this._runFeatureUpdate(d,p,e)}),window.YPP.events&&window.YPP.events.emit("features:updated",this.settings))},{timeout:300}):setTimeout(()=>{this._currentApplyId===e&&(l.forEach(([d,p])=>{this._runFeatureUpdate(d,p,e)}),window.YPP.events&&window.YPP.events.emit("features:updated",this.settings))},0)}async _runFeatureUpdate(e,t,r){if(this._currentApplyId===r&&!(this.errorCounts[e]>=this.MAX_ERRORS))return this.safeRun(e,async()=>{typeof t.enable=="function"&&typeof t.disable=="function"?typeof t.update=="function"?await t.update(this.settings):typeof t.run=="function"&&await t.run(this.settings):typeof t.run=="function"&&await t.run(this.settings)})}async safeRun(e,t){if(!(this.errorCounts[e]>=this.MAX_ERRORS))try{await t()}catch(r){if(r.message&&r.message.includes("Extension context invalidated"))return;this.errorCounts[e]=(this.errorCounts[e]||0)+1,window.YPP.Utils.log(`Error in feature '${e}' (${this.errorCounts[e]}/${this.MAX_ERRORS}): ${r.message}`,"MANAGER","error");const i=Date.now();if(i-(this._errorLogTimestamps[e]||0)>this._errorLogRateLimit&&(console.error(`[YPP:${e}]`,r.message),this._errorLogTimestamps[e]=i),this.errorCounts[e]>=this.MAX_ERRORS){window.YPP.Utils.log(`Feature '${e}' disabled due to excessive errors. Attempting cleanup...`,"MANAGER","warn");let n=!1;try{const s=this.getFeature(e);s&&typeof s.disable=="function"&&(s.disable(),n=!0)}catch(s){window.YPP.Utils.log(`Failed to cleanly disable broken feature '${e}': ${s.message}`,"MANAGER","debug")}n||this._domSweep(e),window.YPP.events&&window.YPP.events.emit("feature:disabled",{name:e,error:r.message})}}}_domSweep(e){try{const t=CSS.escape(e),r=document.querySelectorAll(`[data-ypp-feature="${t}"]`);if(r.length===0)return;r.forEach(i=>{try{i.remove()}catch{}}),window.YPP.Utils.log(`DOM sweep removed ${r.length} orphaned element(s) for broken feature '${e}'`,"MANAGER","warn")}catch(t){window.YPP.Utils.log(`DOM sweep failed for '${e}': ${t.message}`,"MANAGER","error")}}disableAll(){if(!this.features)return;Object.entries(this.features).forEach(([t,r])=>{var i;if(r&&typeof r.disable=="function")try{r.disable()}catch(n){(i=window.YPP.Utils)==null||i.log(`Error disabling feature '${t}': ${n.message}`,"MANAGER","error")}});const e=["ypp-watch-page","ypp-shorts-page","ypp-home-page","ypp-search-page","ypp-channel-page","ypp-playlist-page","ypp-library-page","ypp-history-page","ypp-subscriptions-page","ypp-feed-page"];["body","documentElement"].forEach(t=>{const r=document[t];if(!r)return;e.forEach(s=>r.classList.remove(s)),["--ypp-active-columns","--ypp-dynamic-cols","--ypp-auto-scale","--ypp-home-columns","--ypp-search-columns","--ypp-grid-column-min","--ypp-subscriptions-columns","--ypp-channel-columns","--ypp-history-columns"].forEach(s=>r.style.removeProperty(s)),Array.from(r.attributes).forEach(s=>{(s.name.startsWith("data-ypp-page")||s.name==="data-ypp-cols")&&r.removeAttribute(s.name)})})}},function(){var t,r,i;if(window.location.hostname!=="www.youtube.com")return;window.YPP=window.YPP||{},window.YPP.getDefaultSettings=window.YPP.getDefaultSettings||function(){var n,s;return((s=(n=window.YPP)==null?void 0:n.CONSTANTS)==null?void 0:s.DEFAULT_SETTINGS)||{}};const c=(n,s="warn")=>{var o;(o=console[s])==null||o.call(console,`[YPP:MAIN] ${n}`)},e={get Utils(){return window.YPP.Utils},featureManager:null,settings:{},context:{},isInitialized:!1,bootstrapLock:!1,eventListeners:[],MAX_RETRY_ATTEMPTS:3,RETRY_DELAY:500,INIT_TIMEOUT:3e4,async start(){var n,s,o,a,l;if(this.bootstrapLock){(n=this.Utils)==null||n.log("Bootstrap already in progress","MAIN","warn");return}if(this.isInitialized){(s=this.Utils)==null||s.log("App already initialized","MAIN","warn");return}this.bootstrapLock=!0;try{const d=performance.now();(o=this.Utils)==null||o.log("Starting App...","MAIN"),await this.waitForDependencies();try{window.YPP.WatchedStore&&typeof window.YPP.WatchedStore.load=="function"&&await window.YPP.WatchedStore.load()}catch{(a=this.Utils)==null||a.log("Failed to load WatchedStore","MAIN","warn")}await this.loadSettings(),this.initFeatureManager(),this.featureManager&&this.featureManager.init(this.settings),window.YPP.managers?(this.globalLayoutManager=new window.YPP.managers.GlobalLayoutManager(this.Utils,this.settings),this.globalLayoutManager.activate(window.location.href),this.pageManagers=[new window.YPP.managers.HomePageManager(this.Utils,this.settings),new window.YPP.managers.SubscriptionsPageManager(this.Utils,this.settings),new window.YPP.managers.SearchPageManager(this.Utils,this.settings),new window.YPP.managers.WatchPageManager(this.Utils,this.settings)],window.YPP.managers.ThumbnailColorManager&&(this.thumbnailColorManager=new window.YPP.managers.ThumbnailColorManager,this.thumbnailColorManager.updateSettings(this.settings))):this.pageManagers=[],this.updateContext(),this.setupEvents(),this.isInitialized=!0,this.bootstrapLock=!1;const p=(performance.now()-d).toFixed(2);console.log("%c[YPP] Spiral Tube Global Initialized!","color: #a78bfa; font-weight: bold; font-size: 12px;"),(l=this.Utils)==null||l.log(`Extension Initialized Successfully in ${p}ms`,"MAIN"),this.showReadyToast(),document.documentElement.classList.add("ypp-loaded")}catch(d){this.bootstrapLock=!1,this.handleCriticalError(d)}},async waitForDependencies(){var s,o,a,l;const n=this.INIT_TIMEOUT;if((s=window.YPP)!=null&&s.Utils||(c("Waiting for Utils...","debug"),await this.waitFor(()=>{var d;return((d=window.YPP)==null?void 0:d.Utils)!==void 0},n)),(o=window.YPP)!=null&&o.CONSTANTS||(c("Waiting for CONSTANTS...","debug"),await this.waitFor(()=>{var d;return((d=window.YPP)==null?void 0:d.CONSTANTS)!==void 0},n)),!((a=window.YPP)!=null&&a.Utils)||!((l=window.YPP)!=null&&l.CONSTANTS))throw new Error("Core utilities or CONSTANTS not loaded after timeout")},waitFor(n,s=1e4){return new Promise(o=>{if(n()){o(!0);return}let a=performance.now(),l=16;const d=()=>{if(n()){o(!0);return}if(performance.now()-a>s){o(!1);return}l=Math.min(l*1.5,500),setTimeout(d,l)};setTimeout(d,l)})},initFeatureManager(){var n,s;if(!((n=window.YPP)!=null&&n.FeatureManager))throw(s=this.Utils)==null||s.log("FeatureManager class not found on window.YPP","MAIN","error"),new Error("FeatureManager class not found");if(window.YPP.sharedObserver=window.YPP.sharedObserver||new window.YPP.core.DOMObserver,window.YPP.sharedObserver.start(),window.YPP.sharedEventDelegator=window.YPP.sharedEventDelegator||new window.YPP.core.EventDelegator,window.YPP.sharedEventDelegator.start(),this.featureManager=new window.YPP.FeatureManager,window.YPP.featureManager=this.featureManager,!this.featureManager||typeof this.featureManager.init!="function")throw new Error("FeatureManager initialization failed")},async loadSettings(n=1){var s,o,a,l;try{if(!((s=chrome.runtime)!=null&&s.id))throw new Error("Extension context invalidated");this.settings={...this.settings,...await this.Utils.loadSettings()},(o=this.Utils)==null||o.log(`Settings Loaded (attempt ${n})`,"MAIN","debug")}catch(d){if((a=this.Utils)==null||a.log(`Error loading settings (attempt ${n}): ${d.message}`,"MAIN","error"),d.message.includes("context invalidated"))return;if(n<this.MAX_RETRY_ATTEMPTS)return await new Promise(p=>setTimeout(p,this.RETRY_DELAY)),this.loadSettings(n+1);(l=this.Utils)==null||l.log("Using default settings after retry failure","MAIN","warn"),this.settings={...this.settings,...window.YPP.getDefaultSettings()}}},async saveSettings(n){var s,o,a;this.settings={...this.settings,...n};try{if((s=chrome.runtime)!=null&&s.id)await chrome.runtime.sendMessage({action:"UPDATE_SETTINGS_DELTA",delta:n}),(o=this.Utils)==null||o.log("Settings delta sent to Service Worker","MAIN","debug");else throw new Error("No chrome runtime context")}catch(l){(a=this.Utils)==null||a.log(`Error communicating with Service Worker: ${l.message}. Falling back to local storage.`,"MAIN","warn"),await chrome.storage.local.set({settings:this.settings})}},setupEvents(){var s,o,a;this.removeEventListeners(),this._chromeListeners=[];const n=()=>{var l,d;if((l=this.Utils)==null||l.log("Navigation detected","MAIN","debug"),this.updateContext(),window.YPP.events){const p=window.location.href;if(window.YPP.events.emit("app:pageChange",p),window.location.pathname.startsWith("/watch")){const h=new URLSearchParams(window.location.search).get("v");h&&(window.YPP.events.emit("app:videoChange",h),window.YPP.Utils&&window.YPP.Utils.VideoSizeTracker&&window.YPP.Utils.VideoSizeTracker.init())}else window.YPP.Utils&&window.YPP.Utils.VideoSizeTracker&&window.YPP.Utils.VideoSizeTracker.stop()}if(this.featureManager)try{this.featureManager.init(this.settings)}catch(p){(d=this.Utils)==null||d.log(`Error initializing features on navigation: ${p.message}`,"MAIN","error")}};if(window.addEventListener("yt-navigate-finish",n),this.eventListeners.push({target:window,event:"yt-navigate-finish",handler:n}),(s=chrome==null?void 0:chrome.storage)!=null&&s.onChanged){const l=(d,p)=>{var u,h;try{if(p==="local"&&d.settings){const m=d.settings.newValue;m&&(this.settings={...this.settings,...m},(u=this.Utils)==null||u.log("Settings updated from storage event","MAIN","debug"),this._queueSettingsUpdate(),this.globalLayoutManager&&this.globalLayoutManager.updateSettings(this.settings),this.pageManagers&&this.pageManagers.forEach(y=>y.updateSettings(this.settings)),this.thumbnailColorManager&&this.thumbnailColorManager.updateSettings(this.settings))}}catch(m){(h=this.Utils)==null||h.log(`Error handling settings change: ${m.message}`,"MAIN","error")}};chrome.storage.onChanged.addListener(l),this._chromeListeners.push({api:chrome.storage.onChanged,handler:l})}else(o=this.Utils)==null||o.log("chrome.storage.onChanged API not available","MAIN","warn");if((a=chrome==null?void 0:chrome.runtime)!=null&&a.onMessage){const l=(d,p,u)=>{var h,m,y;if(d.action==="UPDATE_SETTINGS"&&d.settings&&(this.settings={...this.settings,...d.settings},(h=this.Utils)==null||h.log("Instant settings update received","MAIN","debug"),this._queueSettingsUpdate(),this.globalLayoutManager&&this.globalLayoutManager.updateSettings(this.settings),this.pageManagers&&this.pageManagers.forEach(v=>v.updateSettings(this.settings)),this.thumbnailColorManager&&this.thumbnailColorManager.updateSettings(this.settings),u({success:!0})),d.action==="FORCE_THEME_UPDATE"){(m=this.Utils)==null||m.log("Force theme update received","MAIN","info");const v=(y=this.featureManager)==null?void 0:y.getFeature("theme");v&&typeof v.forceReload=="function"&&v.forceReload(),u({success:!0})}};chrome.runtime.onMessage.addListener(l),this._chromeListeners.push({api:chrome.runtime.onMessage,handler:l})}if(window.YPP.events){const l=async({id:d,active:p})=>{var h;const u={[d]:p};(h=this.Utils)==null||h.log(`Filter toggled: ${d} = ${p}`,"MAIN","info"),await this.saveSettings(u),this._queueSettingsUpdate()};window.YPP.events.on("filter:toggle",l)}},_queueSettingsUpdate(){this._settingsUpdateTimeout&&clearTimeout(this._settingsUpdateTimeout),this._settingsUpdateTimeout=setTimeout(()=>{var n;if(this._settingsUpdateTimeout=null,this.featureManager)try{this.featureManager.init(this.settings)}catch(s){(n=this.Utils)==null||n.log(`Error re-initializing features: ${s.message}`,"MAIN","error")}},100)},removeEventListeners(){this.eventListeners.forEach(({target:n,event:s,handler:o})=>{try{n&&typeof n.removeEventListener=="function"&&n.removeEventListener(s,o)}catch{}}),this.eventListeners=[],this._chromeListeners&&(this._chromeListeners.forEach(({api:n,handler:s})=>{try{n&&typeof n.removeListener=="function"&&n.removeListener(s)}catch{}}),this._chromeListeners=[])},updateContext(){var n,s,o,a,l,d,p,u,h,m;(n=this.Utils)==null||n.startPerf("updateContext");try{const y=window.location.pathname;if(!document.body)return;const b={isHome:y==="/"||y==="/index",isWatch:y.startsWith("/watch"),isSearch:y.startsWith("/results"),isChannel:y.startsWith("/@")||y.startsWith("/channel")||y.startsWith("/c/"),isShorts:y.startsWith("/shorts/")||y==="/shorts",isShortsPage:y.startsWith("/shorts/"),isPlaylist:y.startsWith("/playlist"),isTrending:y==="/feed/trending",isSubscriptions:y==="/feed/subscriptions",isLibrary:y==="/feed/library",isHistory:y==="/feed/history",isFeedPlaylists:y==="/feed/playlists"},f={theme:(s=this.settings)==null?void 0:s.premiumTheme,zen:(o=this.settings)==null?void 0:o.zenMode,focus:(a=this.settings)==null?void 0:a.enableFocusMode,cinema:(l=this.settings)==null?void 0:l.cinemaMode,minimal:(d=this.settings)==null?void 0:d.minimalMode,detox:(p=this.settings)==null?void 0:p.dopamineDetox},g=`${y}-${JSON.stringify(f)}`;if(this._lastContextId===g)return;this._lastContextId=g,this.context=b,requestAnimationFrame(()=>{var C;if(!document.body)return;const P=new Set(document.body.classList),w=["ypp-watch-page","ypp-shorts-page","ypp-home-page","ypp-search-page","ypp-channel-page","ypp-playlist-page","ypp-library-page","ypp-history-page","ypp-subscriptions-page","ypp-feed-page","ypp-feed-playlists-page"];for(const x of P)w.includes(x)&&P.delete(x);this.context.isWatch&&P.add("ypp-watch-page"),this.context.isShortsPage&&P.add("ypp-shorts-page"),this.context.isHome&&P.add("ypp-home-page"),this.context.isSearch&&P.add("ypp-search-page"),this.context.isChannel&&P.add("ypp-channel-page"),this.context.isPlaylist&&P.add("ypp-playlist-page"),this.context.isLibrary&&P.add("ypp-library-page"),this.context.isHistory&&P.add("ypp-history-page"),this.context.isSubscriptions&&P.add("ypp-subscriptions-page"),this.context.isFeedPlaylists&&P.add("ypp-feed-playlists-page"),(C=this.settings)!=null&&C.premiumTheme?P.add("yt-spiral-tube-theme"):P.delete("yt-spiral-tube-theme"),document.body.className=Array.from(P).join(" ")});const _=window.location.href;if(this.globalLayoutManager&&this.globalLayoutManager.activate(_),this.pageManagers){const P=this.pageManagers.find(w=>w.matches(_));P!==this._activeManager?(this._activeManager&&this._activeManager.deactivate(),P&&P.activate(_),this._activeManager=P):P&&P.activate(_)}(u=this.Utils)==null||u.log("Context updated","MAIN","debug",this.context)}catch(y){(h=this.Utils)==null||h.log(`Error updating context: ${y.message}`,"MAIN","error"),this.context&&typeof this.context=="object"?Object.keys(this.context).forEach(v=>{this.context[v]=!1}):this.context={}}finally{(m=this.Utils)==null||m.endPerf("updateContext")}},showReadyToast(n="Spiral Tube Ready"){var s,o;try{(s=this.Utils)==null||s.createToast(n)}catch(a){(o=this.Utils)==null||o.log(`Error showing ready toast: ${a.message}`,"MAIN","error")}},handleCriticalError(n){var s,o,a,l;(s=this.Utils)==null||s.log(`Critical Bootstrap Error: ${n.message}`,"MAIN","error"),console.error("[YPP:MAIN] Initialization failed:",n);try{(a=(o=this.Utils)==null?void 0:o.createToast)==null||a.call(o,"Spiral Tube failed to load!","error")}catch(d){console.error("[YPP] Fatal error showing toast:",d)}(l=this.Utils)==null||l.log("Check console for details. Extension features may be unavailable.","MAIN","error")},handleError(n,s){var o;(o=this.Utils)==null||o.log(`Error in ${n}: ${s.message}`,"MAIN","error"),console.error(`[YPP:${n}] Error:`,s)},getSettings(){return{...this.settings}},getContext(){return{...this.context}},isReady(){return this.isInitialized},reinit(){var n,s;if(!this.isInitialized){(n=this.Utils)==null||n.log("Cannot reinit: not initialized","MAIN","warn");return}(s=this.Utils)==null||s.log("Reinitializing features...","MAIN"),this.updateContext(),this.featureManager&&this.featureManager.init(this.settings)},cleanup(){var n,s,o;(n=this.Utils)==null||n.log("Cleaning up...","MAIN"),this._navTimeout&&clearTimeout(this._navTimeout),this._settingsUpdateTimeout&&clearTimeout(this._settingsUpdateTimeout),this.removeEventListeners(),this.featureManager&&((o=(s=this.featureManager).disableAll)==null||o.call(s)),window.YPP.sharedEventDelegator&&window.YPP.sharedEventDelegator.stop(),this.isInitialized=!1,document.documentElement.classList.remove("ypp-loaded")}};try{document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>e.start()):e.start()}catch(n){console.error("[YPP] Fatal Bootstrap Error:",n);try{(i=(r=(t=window.YPP)==null?void 0:t.Utils)==null?void 0:r.createToast)==null||i.call(r,"Spiral Tube encountered a fatal error!","error")}catch(s){console.error("[YPP] Could not show fatal error toast:",s)}}window.YPP.MainApp=e}()})();
