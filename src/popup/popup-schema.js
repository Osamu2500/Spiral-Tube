// @ts-check
import { ICONS } from './popup-icons.js';
/**
 * popup-schema.js  — v3.1 Architecture
 * ─────────────────────────────────────────────────────────────────────
 * Declarative definition of every popup tab, section, and setting.
 * The popup-renderer.js consumes this and generates live DOM from it.
 *
 * Structure:
 *   POPUP_SCHEMA = Tab[]
 *   Tab          = { id, label, icon, sections: Section[] }
 *   Section      = { title, subtitle?, items: Item[] }
 *   Item         = { type, id, label, desc?, icon?, ...typeProps }
 *
 * Item types:
 *   'toggle'   → checkbox toggle card
 *   'range'    → range slider  (needs: min, max, step, unit)
 *   'select'   → <select>      (needs: options: [{value, label}])
 *   'pill'     → segmented pill (needs: options, storageKey)
 *   'custom'   → slot rendered by renderer via customRenderers map
 *   'heading'  → non-interactive label/divider row
 *
 * Sections support `hidden: true` for legacy/unused items kept for
 * settings-compatibility but not displayed.
 * ─────────────────────────────────────────────────────────────────────
 */

// Tiny SVG path helper — returns just the <path d="…"> inner string
// Full <svg> wrapper is added by the renderer
/** @param {string} d */
const P = (d) => d;

/** @param {(key: string) => string} t */
export const getPopupSchema = (t) => [

    // ──────────────────────────────────────────────────────────────────
    // HOME FEED
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'home', label: t('tab_home'),
        icon: ICONS.home,
        sections: [
            {
                title: t('section_feed_layout'),
                icon: ICONS.grid,
                items: [
                    { type:'toggle', id:'displayFullTitle', label: t('displayFullTitle'), desc: t('displayFullTitle_desc'),        icon:ICONS.title },
                    { type:'toggle', id:'autoScaleLayout',  label: t('auto_scale_grid'),  desc: t('adapt_to_zoom_window_size'), icon:ICONS.autoScale },
                    { type:'range', id:'homeColumns', class:'span-2', icon:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z', label: t('grid_columns'), desc: t('0_auto_scale'), unit:'', min:0, max:10, step:1 },
                ]
            },
            {
                title: t('video_management'),
                icon: ICONS.player,
                items: [
                    { type:'toggle', id:'multiSelect', label: t('multi_select_videos'), desc: t('hold_shift_click_to_select_multiple_videos'), icon:ICONS.multiSelect, slot:'multiSelectOptions' },
                    { type:'toggle', id:'cleanMixUrls',      label: t('clean_mix_urls'),    desc: t('prevent_mix_auto_play'),    icon:ICONS.cleanMixUrls },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // SHORTS
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'shorts', label: t('tab_shorts'),
        icon: ICONS.shorts,
        sections: [
            {
                title: t('visibility_routing'),
                icon: ICONS.eyeSlash,
                items: [
                    { type:'toggle', id:'redirectShorts', class:'span-4', label: t('redirect_shorts'),    desc: t('play_in_normal_ui'),        icon:ICONS.home },
                ]
            },
            {
                title: t('global_filters_shorts'),
                icon: P('M22 3L2 22 M22 22L2 3'),
                items: [
                    { type:'toggle', id:'stopShortsLooping', class:'span-2', label: t('stop_looping'), desc: t('no_auto_replay_on_shorts'), icon:ICONS.loopOff },
                    { type:'range', id:'minVideoDuration', class:'span-2', label: t('duration_filter'), desc: t('hide_short_videos'), icon:ICONS.clock, min: 0, max: 60, step: 1, unit:'m' },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // PLAYER
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'player', label: t('tab_player'),
        icon: ICONS.player,
        sections: [

            // Section 1: Playback Automation & Behaviors
            {
                title: t('playback_automation'),
                icon: ICONS.magicWand,
                items: [
                    { type:'toggle', id:'netflixSubtitles', label: t('player_netflix_subtitles'), icon:ICONS.subtitles },
                    { type:'toggle', id:'autoCinema',       label: t('auto_cinema'),        desc: t('expand_player_on_load'),      icon:ICONS.autoCinema },
                    { type:'toggle', id:'autoPiP',          label: t('auto_pip'),           desc: t('auto_pip_desc'),              icon:P('M3 3h18v14H3zM12 14h7v5h-7z') },
                    { type:'toggle', id:'enableMiniPlayer', label: t('enable_miniplayer'),  desc: t('enable_miniplayer_desc'),     icon:P('M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z') },
                    { type:'toggle', id:'enableTranscript', label: t('enable_transcript'),  desc: t('enable_transcript_desc'),     icon:P('M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z') },
                    { type:'toggle', id:'enableCpuTamer',   label: t('cpu_tamer'),          badge:'NEW', desc: t('cpu_tamer_desc'),             icon:ICONS.compressor },
                    { type:'toggle', id:'enableVideoEnhancerTools', label: t('video_enhancer_tools'), badge:'NEW', desc: t('video_enhancer_tools_desc'), icon:ICONS.speed },
                    { type:'toggle', id:'videoResumer',     label: t('video_resumer'),      desc: t('save_playback_position'),     icon:ICONS.resume },
                    { type:'toggle', id:'autoPause',        label: t('auto_pause'),         desc: t('pause_when_backgrounded'),    icon:ICONS.pause },
                    { type:'select', id:'autoQuality',      label: t('auto_quality'),       desc: t('force_specific_resolution'), icon:ICONS.settingsSync, options:[{value:'highres',label: t('max_4k')},{value:'hd1440',label: t('1440p')},{value:'hd1080',label: t('1080p')},{value:'hd720',label: t('720p')},{value:'off',label: t('off')}] },
                    { type:'custom', id:'intentionalDelaySlot' },
                    { type:'custom', id:'autoLikeSlot' }
                ]
            },

            // Section 2: Audio & Equalizer Enhancements
            {
                title: t('audio_enhancements'),
                icon: ICONS.volumeBoost,
                items: [
                    { type:'toggle', id:'audioCompressor',    label: t('audio_compressor'),  desc: t('compress_loud_sounds'),       icon:ICONS.compressor },
                ]
            },

            // Section 3: Player UI Components
            {
                title: t('player_ui_components'),
                icon: ICONS.uiComponents,
                items: [
                    { type:'toggle', id:'compactPlayerUI',  label: t('compactPlayerUI'),    badge:'NEW', desc: t('compactPlayerUI_desc'),       icon:ICONS.uiComponents },
                    { type:'toggle', id:'flexWidthPlayer', label: t('flexWidthPlayer'), badge:'NEW', desc: t('flexWidthPlayer_desc'), icon:ICONS.player },
                    { type:'toggle', id:'reduceAnimations', label: t('reduce_animations'), desc: t('reduce_animations_desc'), icon:ICONS.reduceAnimations },
                    { type:'toggle', id:'pinVideoOnScroll', label: t('pin_video_on_scroll'), desc: t('pin_video_on_scroll_desc'), icon:ICONS.pinVideo },
                    { type:'toggle', id:'revertProgressBar',   label: t('classic_progress_bar'), desc: t('solid_red_no_pink_gradient'), icon:ICONS.progressBar },
                ]
            },

            // Section 4: Sidebar Features
            {
                title: t('sidebar_features') || 'Sidebar Features',
                icon: ICONS.sidebar,
                items: [
                    { type:'toggle', id:'enableCustomSidebar',  label: t('custom_sidebar'),   desc: t('master_toggle_for_sidebar_layout'), icon:ICONS.sidebar, default: true },
                    { type:'layoutToggle', id:'sidebarLayout',        label: t('sidebar_layout'),   desc: t('video_cards_size') },
                    { type:'toggle', id:'splitScrolling',       label: t('split_scrolling'),  desc: t('scroll_sidebar_independently'), icon:ICONS.splitScroll },
                    { type:'toggle', id:'enableTabviewSidebar', label: t('tabview_sidebar'), badge:'NEW', desc: t('tabview_sidebar_desc'), icon:ICONS.sidebar },
                ]
            },

            // Section 5: Player Bar Tools
            {
                title: 'Player Bar Tools',
                icon: ICONS.uiComponents,
                items: [
                    { type:'toggle', id:'enableLoop',           label: 'Loop',                desc: t('add_loop_toggle'),            icon:ICONS.loopButton },
                    { type:'toggle', id:'enableSnapshot',       label: 'Snapshot',            desc: t('save_frame_as_image'),        icon:ICONS.snapshot },
                    { type:'toggle', id:'enableBookmarks',      label: t('bookmarks'),        desc: t('capture_clips_text'),       icon:ICONS.saveSupreme },
                    { type:'toggle', id:'enableCinemaFilters',  label: t('video_filters'),    desc: t('visual_effects_panel'),       icon:ICONS.cinemaFilters },
                    { type:'toggle', id:'enableVolumeBoost',    label: t('volume_booster'),   desc: t('increase_past_100'),         icon:ICONS.volumeUp },
                    { type:'toggle', id:'enableRemainingTime',  label: t('time_remaining'),   desc: t('next_to_duration'),           icon:ICONS.wheel },
                    { type:'toggle', id:'showLiveStreamTime',   label: t('show_live_stream_time'), badge:'NEW', desc: t('show_live_stream_time_desc'), icon:ICONS.clock },
                ]
            },

            // Section 6: Custom Player Bar Placements
            {
                title: t('custom_player_bar_placements'),
                icon: ICONS.placement,
                items: [
                    { type:'button-group', id:'pb_snapshot', label: t('snapshot_button'), desc: t('extension_feature'), icon:ICONS.snapshot, options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_loop', label: t('loop_button'), desc: t('extension_feature'), icon:ICONS.loopButton, options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_speed', label: t('speed_controls'), desc: t('extension_feature'), icon:P('M5 4l15 8-15 8V4z M19 5v14'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_bookmark', label: t('bookmark_button'), desc: t('extension_feature'), icon:ICONS.saveSupreme, options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_pip', label: t('pip_button'), desc: t('extension_feature'), icon:P('M3 3h18v14H3zM12 14h7v5h-7z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_volume', label: t('volume_booster'), desc: t('extension_feature'), icon:ICONS.volumeUp, options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_cinema', label: t('cinema_filters'), desc: t('extension_feature'), icon:ICONS.cinemaFilters, options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_play', label: t('native_play_pause'), desc: t('youtube_feature'), icon:ICONS.player, options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_next', label: t('native_next'), desc: t('youtube_feature'), icon:P('M5 4l10 8-10 8V4zM15 4h4v16h-4z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_mute', label: t('native_mute_volume'), desc: t('youtube_feature'), icon:P('M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_cast', label: t('native_cast_tv'), desc: t('youtube_feature'), icon:P('M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z M1 18v3h3c0-1.66-1.34-3-3-3zM1 14v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_autoplay', label: t('native_autoplay'), desc: t('youtube_feature'), icon:ICONS.smartHistory, options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_cc', label: t('native_cc_subtitles'), desc: t('youtube_feature'), icon:P('M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_settings', label: t('native_settings'), desc: t('youtube_feature'), icon:P('M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06-.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_miniplayer', label: t('native_miniplayer'), desc: t('youtube_feature'), icon:P('M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_theater', label: t('native_theater_mode'), desc: t('youtube_feature'), icon:P('M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_fullscreen', label: t('native_fullscreen'), desc: t('youtube_feature'), icon:P('M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                ]
            },

        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // VIDEO SPEED CONTROLLER
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'speed', label: t('speed'),
        icon: ICONS.speed,
        sections: [
            {
                title: t('speed_controls'),
                icon: ICONS.speed,
                items: [
                    { type:'toggle', id:'enableCustomSpeed', class:'span-2', label: t('enable_controller'), desc: t('master_toggle'), icon:ICONS.speed },
                    { type:'toggle', id:'speedBooster', label: t('10x_speed_booster'), badge:'NEW', desc: t('unlock_native_speed_up_to_10x'), icon:ICONS.speedBooster },
                    { type:'toggle', id:'vscForceSpeed',    label: t('force_saved_speed'), desc: t('prevent_players_from_overriding'), icon:ICONS.forceSpeed },
                ]
            },
            {
                title: t('controller_behavior'),
                icon: ICONS.resume,
                items: [
                    { type:'toggle', id:'vscAudioSupport',  label: t('audio_support'), desc: t('control_audio_tags'), icon:ICONS.audioTag },
                    { type:'toggle', id:'vscRememberSpeed', label: t('remember_speed'), desc: t('restore_speed_across_videos'), icon:ICONS.remember },
                    { type:'toggle', id:'vscHideByDefault', class:'span-2', label: t('hide_by_default'), desc: t('only_show_when_changing_speed'), icon:ICONS.hide },
                ]
            },
            {
                title: t('shortcuts'),
                icon: ICONS.keyboard,
                items: [
                    { type:'custom', id:'vsc_shortcuts_manager' }
                ]
            }

        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // MODES
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'modes', label: t('modes'),
        icon: ICONS.wheel,
        sections: [
            {
                title: t('home_page'),
                subtitle: 'Immersive experiences for the home feed',
                icon: ICONS.home,
                items: [
                    { type:'toggle', id:'cinematicMode', class:'span-4',  label: t('cinematic_home'),  desc: t('cinematic_styling_for_homepage'),    icon:ICONS.cinematic }
                ]
            },
            {
                title: t('player_page'),
                subtitle: 'Immersive experiences for the video player',
                icon: ICONS.autoCinema,
                items: [
                    { type:'toggle', id:'zenMode',         label: t('zen_mode'),        desc: t('dim_everything_but_video'),          icon:ICONS.zen },
                    { type:'toggle', id:'cinemaMode',      label: t('cinema_mode'),     desc: t('theater_like_fullscreen_viewing'),   icon:ICONS.cinema },
                    { type:'toggle', id:'realCinemaMode',  label: t('real_cinema_mode'), badge:'NEW', desc: t('real_cinema_mode_desc'),             icon:ICONS.cinema },
                    { type:'toggle', id:'enableStarTubeLayout', label: t('startube_layout'), badge:'NEW', desc: t('startube_layout_desc'),         icon:ICONS.autoCinema },
                    { type:'toggle', id:'ambientMode',     label: t('ambient_theater'), desc: t('giant_canvas_ambilight_effect'),     icon:ICONS.ambient, slot:'ambientModeOptions' },
                    { type:'toggle', id:'studyMode',       label: t('study_mode'),      desc: t('focus_mode_1_25_playback_speed'), icon:ICONS.study },
                    { type:'toggle', id:'enableFocusMode', label: t('focus_mode'),      desc: t('hide_all_distractions_on_page'),     icon:ICONS.focus },
                    { type:'toggle', id:'minimalMode',     label: t('minimalist_chrome'), desc: t('strip_non_essential_page_chrome'), icon:ICONS.minimal },
                    { type:'toggle', id:'seamlessMode',    label: t('seamless_mode'),   desc: t('sidebar_comments'), icon:ICONS.sidebar, inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="seamlessModeGridColsUI" min="1" max="10" step="1" style="width:100%;"><span id="seamlessModeGridColsValue" style="font-size:10px; min-width:20px; opacity:0.7;">4</span></div><input type="hidden" id="seamlessModeGridCols" value="4" />` },
                    { type:'toggle', id:'audioModeEnabled', class:'span-2', label: t('audio_only_mode'), desc: t('listen_only_hide_the_video'),     icon:ICONS.audioOnly }
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // SEARCH
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'search', label: t('tab_search'),
        icon: ICONS.search,
        sections: [
            {
                title: t('layout_filters'),
                icon: P('M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z'),
                items: [
                    { type:'toggle', id:'cleanSearch',       label: t('clean_search'),         desc: t('remove_junk_ads'),          icon:ICONS.cleanSearch },
                    { type:'toggle', id:'autoVideoFilter',   label: t('auto_video_filter'),    desc: t('default_to_videos_tab'),    icon:P('M5 4l15 8-15 8V4z'), style:'display:none' },
                    { type:'layoutToggle', id:'searchLayout',        label: t('list_view_size'),      desc: t('linear_search_thumbnail_size') },
                    { type:'toggle', id:'searchGrid',        class:'span-2', label: t('grid_view'),           desc: t('card_layout_for_search'),   icon:P('M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'), inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="searchColumnsUI" min="1" max="8" step="1" style="width:100%;"><span id="searchColumnsValue" style="font-size:10px; min-width:20px; opacity:0.7;">5</span></div><input type="hidden" id="searchColumns" value="4" />` },
                    { type:'toggle', id:'copyLinkButton',    label: t('copy_link_button'), desc: t('copy_link_button_desc'), icon:ICONS.promos },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // FILTERS (Hide Features)
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'declutter', label: t('tab_filters'),
        icon: ICONS.filter,
        sections: [
            {
                title: t('home_page'),
                icon: ICONS.home,
                items: [
                    { type:'toggle', id:'hideMemberships',   label: t('hide_memberships'),  desc: t('hide_memberships_desc'), icon:ICONS.memberships },
                    { type:'toggle', id:'hideMembersOnly',   label: t('hide_members_only'), desc: t('hide_members_only_desc'), icon:ICONS.memberships },
                    { type:'toggle', id:'hideFeed',       label: t('hide_homepage_feed'),  desc: t('blank_homepage'), icon:ICONS.home },
                    { type:'toggle', id:'hideExploreTopics', label: t('hide_topics_bar'),   desc: t('remove_category_chips'),    icon:ICONS.cinematic },
                    { type:'toggle', id:'hideTrending',   label: t('hide_trending_explore'),icon:ICONS.explore },
                    { type:'toggle', id:'hideMetrics',    label: t('hide_views_subs'),   desc: t('hide_views_likes_sub_counts'), icon:ICONS.metrics },
                    { type:'toggle', id:'hideThumbnails',    label: t('hide_thumbnails'),   desc: t('blur_on_hover_to_reveal'),  icon:ICONS.thumbnails },
                    { type:'toggle', id:'hideWatched',       class:'span-2', label: t('hide_watched'), inlineSlot:`<div style="display:inline-flex; background:rgba(255,255,255,0.06); border-radius:6px; overflow:hidden; margin-left:8px; vertical-align:middle; z-index:10; position:relative;"><button type="button" id="hwMode-dim" class="view-mode-btn hw-mode-btn active" data-mode="dim" style="font-size:10px; padding:2px 8px; border:none; cursor:pointer; color:inherit; background:none;">Dim</button><button type="button" id="hwMode-hide" class="view-mode-btn hw-mode-btn" data-mode="hide" style="font-size:10px; padding:2px 8px; border:none; cursor:pointer; color:inherit; background:none;">Hide</button></div><div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:180px;"><input type="range" id="hideWatchedThreshold" min="10" max="100" step="5" style="width:100%;"><span id="hideWatchedThresholdValue" style="font-size:10px; min-width:26px; opacity:0.7;">80%</span></div><input type="hidden" id="hideWatchedMode" value="dim" />`, desc: t('auto_hide_watched_videos'),  icon:ICONS.watched, slot:'' },
                    { type:'toggle', id:'hideMixes',         label: t('hide_mixes'),        desc: t('remove_infinite_mixes'),    icon:ICONS.mixes },
                    { type:'toggle', id:'hidePlaylists',     label: t('hide_playlists'),    desc: t('remove_playlist_cards'),    icon:ICONS.playlists },
                    { type:'toggle', id:'hidePodcasts',      label: t('hide_podcasts'),     desc: t('remove_podcast_cards'),     icon:ICONS.podcasts },
                    { type:'toggle', id:'hidePosts',         label: t('hide_posts'),        desc: t('remove_community_posts'),   icon:ICONS.uiComponents },
                    { type:'toggle', id:'hidePromoShelves', class:'span-4', label: t('hide_promos'),       desc: t('remove_shelves_games'),   icon:ICONS.promos },
                ]
            },
            {
                title: t('advanced_filters'),
                icon: ICONS.pinVideo,
                items: [
                    { type:'select', id:'filterMode', class:'span-2', label: t('filter_mode'), desc: t('how_to_treat_filtered_content_globally'), icon:ICONS.filterMode, options: [{value:'hide',label: t('hide_completely')},{value:'dim',label: t('dim_hover_to_reveal')}] },
                    { type:'toggle', id:'channelWhitelistEnabled', label: t('enable_channel_whitelist'), desc: t('exempt_channels_from_being_hidden'), icon:ICONS.whitelist },
                    { type:'toggle', id:'channelBlacklistEnabled', label: t('enable_channel_blacklist'), desc: t('always_hide_specific_channels'), icon:ICONS.blacklist },
                    { type:'toggle', id:'viewsFilterEnabled', class:'span-2', label: t('hide_low_view_videos'), desc: t('filter_out_unpopular_content'), icon:P('M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'), inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:200px;"><span style="font-size:10px; opacity:0.5;">Min:</span><input type="range" id="viewsHideThresholdUI" min="0" max="11" step="1" style="width:100%;"><span id="viewsHideThresholdValue" style="font-size:10px; min-width:30px; opacity:0.7;">Off</span></div><input type="hidden" id="viewsHideThreshold" value="0" />` },
                    { type:'toggle', id:'dateFilterEnabled', class:'span-2', label: t('filter_by_upload_date'), desc: t('hide_videos_older_newer_than_n_days'), icon:ICONS.calendar, inlineSlot: `<div style="display:inline-flex; align-items:center; gap:16px; margin-left:auto;"><div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; gap:6px; max-width:180px;"><span style="font-size:10px; opacity:0.5; width:22px;">Max:</span><input type="range" id="dateFilterOlderThresholdUI" min="0" max="13" step="1" style="width:100px;"><span id="dateFilterOlderThresholdValue" style="font-size:10px; min-width:40px; opacity:0.7;">Off</span></div><div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; gap:6px; max-width:180px;"><span style="font-size:10px; opacity:0.5; width:22px;">Min:</span><input type="range" id="dateFilterNewerThresholdUI" min="0" max="13" step="1" style="width:100px;"><span id="dateFilterNewerThresholdValue" style="font-size:10px; min-width:40px; opacity:0.7;">Off</span></div></div><input type="hidden" id="dateFilterOlderThreshold" value="0" /><input type="hidden" id="dateFilterNewerThreshold" value="0" />` },
                ]
            },
            {
                title: t('player_page'),
                icon: ICONS.autoCinema,
                items: [
                    { type:'toggle', id:'hidePlayerTopics', label: t('hide_topics_bar'),   desc: t('remove_category_chips'),    icon:ICONS.cinematic },
                    { type:'toggle', id:'hideVideoTitle',   label: t('hide_video_title'),   desc: t('hide_video_title_desc'),    icon:ICONS.titleHidden },
                    { type:'toggle', id:'hideChannelBar',   label: t('hide_channel_bar'),   desc: t('hide_channel_bar_desc'),    icon:ICONS.channelBar },
                    { type:'toggle', id:'hideVideoDescription', label: t('hide_video_description'), desc: t('hide_video_description_desc'), icon:ICONS.descHidden },
                    { type:'toggle', id:'hideActionButtons', label: t('hide_action_buttons'), desc: t('hide_action_buttons_desc'), icon:ICONS.like },
                    { type:'toggle', id:'hideComments',   label: t('hide_comments'),       icon:ICONS.uiComponents },
                    { type:'toggle', id:'hideRelated',    label: t('hide_related_feed'),   desc: t('hide_sidebar_videos'), icon:P('M3 3h18v18H3zM14 8h6M14 12h6M14 16h6') },
                    { type:'toggle', id:'hideLiveChat',   label: t('hide_live_chat'),      icon:ICONS.uiComponents },
                    { type:'toggle', id:'hideEndScreens', label: t('hide_end_screens'),    icon:P('M3 3h18v18H3zM3 9h18M9 21V9') },
                    { type:'toggle', id:'hideCards',      label: t('hide_video_cards'),    icon:ICONS.cards },
                    { type:'toggle', id:'hideAnnotations',label: t('hide_annotations'),    icon:ICONS.uiComponents },
                    { type:'toggle', id:'hideMerch',      label: t('hide_merch_offers'),   icon:ICONS.merch },
                    { type:'toggle', id:'hideFundraiser', label: t('hide_donations'),      icon:ICONS.fundraiser },
                    { type:'toggle', id:'commentFilter',  label: t('comment_spam_filter'), desc: t('hide_suspected_bots'),        icon:P('M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z') },
                    { type:'select', id:'commentFilterAction', class:'span-2', label: t('spam_action'), desc: t('what_to_do_with_spam'), icon:ICONS.filterMode, options: [{value:'dim',label: t('dim_hover_to_reveal')},{value:'hide',label: t('hide_completely')}] },
                ]
            },
            {
                title: t('search_page'),
                icon: P('M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35'),
                items: [
                    { type:'toggle', id:'hideSearchShelves', label: t('hide_shelf_sections'),  desc: t('remove_for_you'),         icon:ICONS.shelves },
                    { type:'toggle', id:'hideChannelCards',  label: t('hide_channel_cards'),   desc: t('show_videos_only'),         icon:ICONS.channelBar },
                    { type:'toggle', id:'hideVoiceSearch',   label: t('hide_voice_search'), desc: t('remove_microphone_icon'),    icon:ICONS.voiceSearch },
                    { type:'toggle', id:'hideUploadButton',   label: t('hide_upload_button'), desc: t('remove_upload_icon'),    icon:ICONS.uploadBtn },
                    { type:'toggle', id:'hideSearchMixes', label: t('hide_mixes'), desc: t('remove_infinite_mixes'), icon:ICONS.mixes },
                    { type:'toggle', id:'hideSearchPlaylists', label: t('hide_playlists'), desc: t('remove_playlist_cards'), icon:ICONS.playlists },
                    { type:'toggle', id:'hideSearchPodcasts', label: t('hide_podcasts'), desc: t('remove_podcast_cards'), icon:ICONS.podcasts },
                    { type:'toggle', id:'hideSearchMusic', label: t('hide_music'), desc: t('remove_music_videos'), icon:ICONS.audioOnly }
                ]
            },
            {
                title: t('shorts'),
                icon: ICONS.shorts,
                items: [
                    { type:'toggle', id:'hideShorts',       label: t('hide_shorts'),        desc: t('remove_from_home_feed'),    icon:ICONS.shorts },
                    { type:'toggle', id:'hideSearchShorts', label: t('hide_search_shorts'), desc: t('remove_from_search_results'), icon:ICONS.search },
                    { type:'toggle', id:'aggressiveShortsBlock', class:'span-2', label: t('nuke_shorts'), desc: t('remove_everywhere'), icon:P('M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10S2 17.52 2 12z') },
                ]
            },
            {
                title: t('custom_css_userstyles'),
                icon: ICONS.magicWand,
                items: [
                    { type:'toggle', id:'hideCountryCode', label: t('hide_country_code'), badge:'NEW', desc: t('hide_country_code_desc'), icon:ICONS.channelBar },
                    { type:'toggle', id:'hideThanksDonate', label: t('hide_thanks_donate'), badge:'NEW', desc: t('hide_thanks_donate_desc'), icon:ICONS.fundraiser },
                    { type:'toggle', id:'hidePlayerBranding', label: t('hide_player_branding'), badge:'NEW', desc: t('hide_player_branding_desc'), icon:ICONS.channelBar },
                    { type:'toggle', id:'hideUselessGuideLinks', label: t('hide_useless_guide_links'), badge:'NEW', desc: t('hide_useless_guide_links_desc'), icon:ICONS.home },
                    { type:'toggle', id:'hidePaidPromotion', label: t('hide_paid_promotion'), badge:'NEW', desc: t('hide_paid_promotion_desc'), icon:ICONS.promos },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // SUBSCRIPTIONS
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'subscriptions', label: t('tab_subs'),
        icon: ICONS.subs,
        sections: [

            {
                title: t('filter_bar_layout'),
                items: [
                    { type:'toggle', id:'enableFilterBar', class:'span-2',     label: t('enable_filter_bar'), desc: t('show_duration_date_filters'), icon:P('M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z') },
                    { type:'toggle', id:'ff_opt_multiselect', label: t('multi_select_chips'), desc: t('select_multiple_filters_at_once'), icon:P('M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z') },
                    { type:'toggle', id:'ff_search_visible', label: t('show_search_bar'), desc: t('search_feed_by_title'), icon:ICONS.searchBar }
                ]
            },
            {
                title: t('filter_chips_content'),
                items: [
                    { type:'toggle', id:'ff_video_visible', label: t('video') },
                    { type:'toggle', id:'ff_shorts_visible', label: t('shorts') },
                    { type:'toggle', id:'ff_live_visible', label: t('live') },
                    { type:'toggle', id:'ff_streamed_visible', label: t('streamed') },
                    { type:'toggle', id:'ff_scheduled_visible', label: t('scheduled') },
                    { type:'toggle', id:'ff_posts_visible', label: t('posts') },
                    { type:'toggle', id:'ff_playlist_visible', class:'span-2', label: t('playlist') }
                ]
            },
            {
                title: t('filter_chips_status'),
                items: [
                    { type:'toggle', id:'ff_unwatched_visible', label: t('unwatched') },
                    { type:'toggle', id:'ff_watched_visible', label: t('watched') },
                    { type:'toggle', id:'ff_notifon_visible', label: t('notification_on') },
                    { type:'toggle', id:'ff_notifoff_visible', label: t('notification_off') },
                ]
            },
            {
                title: t('layout_tools'),
                items: [
                    { type:'toggle', id:'twoColumnSubscriptions', class:'span-2', label: t('twoColumnSubscriptions'), badge:'NEW', desc: t('twoColumnSubscriptions_desc'), icon:ICONS.grid },
                    { type:'toggle', id:'enableChannelHealth', class:'span-2', label: t('channel_health'),  desc: t('scan_for_dead_channels'),        icon:ICONS.compressor, inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="channelColumnsUI" min="2" max="10" step="1" style="width:100%;"><span id="channelColumnsValue" style="font-size:10px; min-width:20px; opacity:0.7;">5</span></div><input type="hidden" id="channelColumns" value="5" />` },
                    { type:'range', id:'subscriptionsColumns', class:'span-2', label: t('feed_grid_columns'), desc: t('grid_layout_size_for_subs'), icon:P('M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'), min: 1, max: 8, step: 1, unit: '' }
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // HISTORY
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'history', label: t('tab_history'),
        icon: ICONS.wheel,
        sections: [
            {
                title: t('watch_time'),
                items: [
                    { type:'custom', id:'historyWidget', slot:'history-widget' },
                    { type:'toggle', id:'watchTimeAlert', class:'span-2', label: t('watch_time_alert'), desc: t('notify_when_limit_reached'), icon:ICONS.wheel },
                    { type:'range',  id:'watchTimeAlertHours', label: t('daily_limit'), unit:'h', min:1, max:12, step:1, parent: 'watchTimeAlert' },
                    { type:'toggle', id:'intentionalDelay', class:'span-2', label: t('intentional_delay'), desc: t('add_a_pause_before_videos_start'), icon:ICONS.wheel },
                    { type:'range',  id:'intentionalDelayTime', label: t('delay_duration'), unit:'s', min:1, max:10, step:1, parent: 'intentionalDelay' }
                ]
            },
            {
                title: t('tracking_resume'),
                items: [
                    { type:'toggle', id:'smartHistory', label: t('smart_history_tracker'), badge:'NEW', desc: t('track_individual_video_progress_watch_time'), icon:ICONS.smartHistory },
                    { type:'toggle', id:'autoResume', label: t('auto_resume_videos'), badge:'NEW', desc: t('automatically_resume_from_last_watched_timestamp'), icon:ICONS.wheel },
                    { type:'toggle', id:'resumeBadges', label: t('resume_badges'), badge:'NEW', desc: t('show_resume_progress_on_thumbnails'), icon:ICONS.wheel },
                    { type:'toggle', id:'continueWatching', label: t('continue_watching'), desc: t('resume_from_history'), icon:ICONS.continueWatch },
                    { type:'custom', id:'recap_buttons', slot:'recapButtons' }
                ]
            },
            {
                title: t('history_interface'),
                items: [
                    { type:'toggle', id:'playlistDuration', label: t('duration_calc'), desc: t('show_total_length'), icon:ICONS.wheel },
                    { type:'toggle', id:'reversePlaylist', label: t('reverse_playlist'), desc: t('toggle_direction'), icon:ICONS.reversePlay },
                    { type:'toggle', id:'historyRedesign', class:'span-2', label: t('history_redesign'), desc: t('new_history_layout'), icon:ICONS.sidebar, inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="historyColumnsUI" min="1" max="8" step="1" style="width:100%;"><span id="historyColumnsValue" style="font-size:10px; min-width:20px; opacity:0.7;">5</span></div><input type="hidden" id="historyColumns" value="5" />` }
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // BOOKMARKS (custom — list rendered by popup-extras)
    // ──────────────────────────────────────────────────────────────────
    { id: 'bookmarks', label: t('tab_marks'), icon: ICONS.saveSupreme, custom: true, sections: [] },


    // ──────────────────────────────────────────────────────────────────
    // DESIGN (custom — UI layout, cards, theming, effects)
    // ──────────────────────────────────────────────────────────────────
    { id: 'appearance', label: t('tab_design'), icon: ICONS.promos, custom: true, sections: [] },

    // ──────────────────────────────────────────────────────────────────
    // ADVANCED
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'advanced', label: t('tab_pro'),
        icon: ICONS.advancedTab,
        sections: [
            {
                title: t('global_player_bar'),
                items: [
                    { type:'toggle', id:'enableGlobalPlayerBar', label: t('global_player_bar'), desc: t('enable_on_external_sites'), icon:ICONS.globalBar, slot:'globalPlayerBarOptions', style: 'grid-column: 1 / -1;' },
                ]
            },
            {
                title: 'Remembered Streaming Sites (Domain Memory)',
                icon: ICONS.globalBar,
                items: [
                    { type:'custom', id:'domain_memory_manager', slot:'domain_memory_manager', class: 'span-4', style: 'grid-column: 1 / -1; width: 100%;' },
                ]
            },
            {
                title: t('custom_css_userstyles'),
                items: [
                    { type:'toggle', id:'enableCustomCSS', class:'span-4', label: t('enable_custom_css'), desc: t('import_or_write_your_own_styles'), icon:ICONS.promos, slot:'customCSSOptions' },
                ]
            },
            {
                title: t('stats_overlays'),
                items: [
                    { type:'toggle', id:'enableStatsForNerds', class:'span-4', label: t('stats_overlay'), desc: t('view_tech_details'), icon:P('M4 17l6-6 4 4 6-8') },
                ]
            },
            {
                title: t('api_integrations'),
                subtitle: 'Third-party service connections',
                items: [
                    { type:'toggle', id:'returnYouTubeDislike', label: t('return_youtube_dislike'), desc: t('restore_dislike_count_via_ryd_api'), icon:P('M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17') },
                    { type:'toggle', id:'adSkipper',            label: t('ad_skipper'),             desc: t('skip_video_ads_automatically'),   icon:P('M5 4l10 8-10 8V4z M19 5v14') },
                    { type:'toggle', id:'sponsorBlock', class:'span-2',         label: t('sponsorblock'),           desc: t('skip_sponsored_segments'),        icon:ICONS.explore, slot:'sponsorBlockCategories' }
                ]
            },

        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // HOTKEYS
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'hotkey', label: t('tab_hotkeys'),
        icon: P('M2 4h20v16H2z M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10'),
        sections: [
            {
                title: t('watch_page_hotkeys'),
                items: [
                    { type:'toggle', id:'keyboardShortcuts', class:'span-4', label: t('enable_hotkeys'), icon:P('M2 4h20v16H2z M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10') },
                    { type:'custom', id:'advanced_shortcuts_manager', slot:'advanced_shortcuts_manager' },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // GLOBAL
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'global', label: t('tab_global'),
        icon: P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'),
        custom: false, sections: [
            {
                title: t('lang_support_title'),
                items: [
                    { 
                        type:'select', 
                        id:'extensionLanguage',
                        class:'span-4',
                        label: t('lang_select_label'), 
                        desc: t('lang_support_desc'), 
                        icon: P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'), 
                        options: [
                            {value: 'en', label: t('english')},
                            {value: 'es', label: t('espa_ol')},
                            {value: 'fr', label: t('fran_ais')},
                            {value: 'de', label: t('deutsch')},
                            {value: 'ja', label: t('str_1')}
                        ] 
                    },
                ]
            }
        ]
    },
];

/**
 * Map of custom slot IDs → render functions.
 * Registered by popup-renderer.js at init-time.
 * Each fn(container: HTMLElement, state: object) → void
 */
export const CUSTOM_SLOT_RENDERERS = new Map();
