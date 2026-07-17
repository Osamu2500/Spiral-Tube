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
const P = (d) => d;

export const getPopupSchema = (t) => [

    // ──────────────────────────────────────────────────────────────────
    // HOME FEED
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'home', label: t('tab_home'),
        icon: P('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'),
        sections: [
            {
                title: t('section_feed_layout'),
                icon: P('M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z'),
                items: [
                    { type:'toggle', id:'displayFullTitle', label: t('displayFullTitle'), desc: t('displayFullTitle_desc'),        icon:P('M4 6h16M4 12h16M4 18h16') },
                    { type:'toggle', id:'useSquareCorners',    label: t('useSquareCorners'),     desc: t('useSquareCorners_desc'),   icon:P('M3 3h18v18H3z') },
                    { type:'toggle', id:'extraRoundedUI', label: t('extraRoundedUI'), desc: t('extraRoundedUI_desc'), icon:P('M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z') },
                    { type:'toggle', id:'saveSupremeUI', label: t('saveSupremeUI'), desc: t('saveSupremeUI_desc'), icon:P('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z') },
                    { type:'toggle', id:'autoScaleLayout',  label: t('auto_scale_grid'),  desc: t('adapt_to_zoom_window_size'), icon:P('M15 3l6 6M15 3h6v6M9 21l-6-6M9 21H3v-6') },
                    { type:'range', id:'homeColumns', class:'span-2', icon:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z', label: t('grid_columns'), desc: t('0_auto_scale'), unit:'', min:0, max:10, step:1 },
                ]
            },
            {
                title: t('video_management'),
                icon: P('M5 3l14 9-14 9V3z'),
                items: [
                    { type:'toggle', id:'multiSelect', label: t('multi_select_videos'), desc: t('hold_shift_click_to_select_multiple_videos'), icon:P('M9 12l2 2 4-4 M3 3h18v18H3z'), slot:'multiSelectOptions' },
                    { type:'toggle', id:'cleanMixUrls',      label: t('clean_mix_urls'),    desc: t('prevent_mix_auto_play'),    icon:P('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z') },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // SHORTS
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'shorts', label: t('tab_shorts'),
        icon: P('M12 20V10M18 20V4M6 20v-4'),
        sections: [
            {
                title: t('visibility_routing'),
                icon: P('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'),
                items: [
                    { type:'toggle', id:'redirectShorts',   label: t('redirect_shorts'),    desc: t('play_in_normal_ui'),        icon:P('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z') },
                ]
            },
            {
                title: t('global_filters_shorts'),
                icon: P('M22 3L2 22 M22 22L2 3'),
                items: [
                    { type:'toggle', id:'stopShortsLooping',     label: t('stop_looping'), desc: t('no_auto_replay_on_shorts'), icon:P('M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z') },
                    { type:'range', id:'minVideoDuration', class:'span-2', label: t('duration_filter'), desc: t('hide_short_videos'), icon:P('M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'), min: 0, max: 60, step: 1, unit:'m' },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // PLAYER
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'player', label: t('tab_player'),
        icon: P('M5 3l14 9-14 9V3z'),
        sections: [

            {
                title: t('playback_automation'),
                icon: P('M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83'),
                items: [
                    { type:'toggle', id:'netflixSubtitles', label: t('player_netflix_subtitles'), icon:P('M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z') },
                    { type:'toggle', id:'autoCinema',       label: t('auto_cinema'),        desc: t('expand_player_on_load'),      icon:P('M2 3h20v14H2zM8 21h8M12 17v4') },
                    { type:'toggle', id:'videoResumer',     label: t('video_resumer'),      desc: t('save_playback_position'),     icon:P('M12 20V4M20 12H4') },
                    { type:'toggle', id:'autoPause',        label: t('auto_pause'),         desc: t('pause_when_backgrounded'),    icon:P('M6 4h4v16H6zM14 4h4v16h-4z') },
                    { type:'toggle', id:'autoLike',         class:'span-2', label: t('auto_like'), desc: t('automatically_like_video'), icon:P('M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z'), inlineSlot: `<div style="display:inline-flex; gap:6px; margin-left:8px; vertical-align:middle; z-index:10; position:relative;"><button type="button" class="view-mode-btn gpb-btn" data-target="autoLikeSubscribedOnly" style="font-size:10px; padding:3px 10px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; cursor:pointer; color:inherit; background:rgba(255,255,255,0.04); position:relative; overflow:hidden;" title="Subscribed Only">Subs</button><button type="button" class="view-mode-btn gpb-btn" data-target="autoLikeChannelLists" style="font-size:10px; padding:3px 10px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; cursor:pointer; color:inherit; background:rgba(255,255,255,0.04); position:relative; overflow:hidden;" title="Use Channel Lists">Lists</button><button type="button" class="view-mode-btn gpb-btn" data-target="autoLikeWaitAds" style="font-size:10px; padding:3px 10px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; cursor:pointer; color:inherit; background:rgba(255,255,255,0.04); position:relative; overflow:hidden;" title="Wait for Ads">Ads</button><button type="button" class="view-mode-btn gpb-btn" data-target="autoLikeHumanize" style="font-size:10px; padding:3px 10px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; cursor:pointer; color:inherit; background:rgba(255,255,255,0.04); position:relative; overflow:hidden;" title="Humanize Delay">Human</button><button type="button" id="autoLikeDelayTypeBtn" class="view-mode-btn" style="font-size:10px; padding:3px 10px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; cursor:pointer; color:inherit; background:rgba(255,255,255,0.04); position:relative; overflow:hidden;" title="Switch between Seconds / Percent">% / s</button></div><div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 10px; flex-grow:1; max-width:180px;"><input type="range" id="autoLikeThreshold" min="0" max="100" step="1" style="width:100%;"><span id="autoLikeThresholdValue" style="font-size:10px; min-width:32px; opacity:0.7; text-align:right;">0s</span></div><input type="hidden" id="autoLikeSubscribedOnly" /><input type="hidden" id="autoLikeChannelLists" /><input type="hidden" id="autoLikeWaitAds" /><input type="hidden" id="autoLikeHumanize" /><input type="hidden" id="autoLikeDelayType" value="seconds" />` },
                    { type:'range',  id:'intentionalDelayTime',label: t('delay_duration'),  unit:'s', min:1, max:10, step:1, parent: 'intentionalDelay' },
                    { type:'toggle', id:'smartDownload', label: t('smart_download'), badge:'NEW', desc: t('redirect_download_button_to_ssvid'), icon:P('M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z') },
                    { type:'select', id:'autoQuality',      label: t('auto_quality'),       desc: t('force_specific_resolution'), icon:P('M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10 8l6 4-6 4V8z'), options:[{value:'highres',label: t('max_4k')},{value:'hd1440',label: t('1440p')},{value:'hd1080',label: t('1080p')},{value:'hd720',label: t('720p')},{value:'off',label: t('off')}] },
                ]
            },
            {
                title: t('audio_interactions'),
                icon: P('M11 5L6 9H2v6h4l5 4V5z'),
                items: [
                    { type:'toggle', id:'enableVolumeBoost',  label: t('volume_booster'),    desc: t('increase_past_100'),         icon:P('M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07') },
                    { type:'toggle', id:'audioCompressor',    label: t('audio_compressor'),  desc: t('compress_loud_sounds'),       icon:P('M22 12h-4l-3 9L9 3l-3 9H2') },
                    { type:'toggle', id:'wheelControls',      label: t('wheel_controls'),    desc: t('shift_alt_scroll_to_control'), icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2') },
                ]
            },

            {
                title: t('player_ui_components'),
                icon: P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'),
                items: [
                    { type:'toggle', id:'reduceAnimations', label: t('reduce_animations'), desc: t('reduce_animations_desc'), icon:P('M19 8l-4 4h3c0 3.31-2.69 6-6 6') },
                    { type:'toggle', id:'pinVideoOnScroll', label: t('pin_video_on_scroll'), desc: t('pin_video_on_scroll_desc'), icon:P('M12 2L2 22h20L12 2z') },
                    { type:'toggle', id:'revertProgressBar',   label: t('classic_progress_bar'), desc: t('solid_red_no_pink_gradient'), icon:P('M3 3h18v18H3zM3 9h18') },
                    { type:'toggle', id:'videoControlsEnabled', label: t('video_controls_ui'), desc: t('custom_floating_panel'),     icon:P('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z') },
                    { type:'toggle', id:'enableCinemaFilters',  label: t('filters'),          desc: t('visual_effects_panel'),       icon:P('M22 3H2l8 9.46V19l4 2v-8.54L22 3z') },
                    { type:'toggle', id:'enableLoop',           label: t('loop_button'),      desc: t('add_loop_toggle'),            icon:P('M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z') },
                    { type:'toggle', id:'enableSnapshot',       label: t('snapshot_button'),  desc: t('save_frame_as_image'),        icon:P('M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z') },
                    { type:'toggle', id:'enableRemainingTime',  label: t('time_remaining'),   desc: t('next_to_duration'),           icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2') },
                    { type:'toggle', id:'enableBookmarks',      label: t('bookmarks'),        desc: t('capture_clips_text'),       icon:P('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z') },
                    { type:'toggle', id:'enableCustomSidebar',  label: t('custom_sidebar'),   desc: t('master_toggle_for_sidebar_layout'), icon:P('M3 3h18v18H3z M14 8h6M14 12h6M14 16h6') },
                    { type:'layoutToggle', id:'sidebarLayout',        label: t('sidebar_layout'),   desc: t('video_cards_size') },
                    { type:'toggle', id:'splitScrolling',       label: t('split_scrolling'),  desc: t('scroll_sidebar_independently'), icon:P('M12 5l0 14M19 12l-7 7-7-7') },
                    { type:'select', id:'playerActionStyle', label: t('action_button_style'), desc: t('redesign_for_like_share_buttons'), icon:P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'), options:[{value:'premium',label: t('premium_pill')},{value:'minimal',label: t('minimal_icons')},{value:'default',label: t('default_youtube')}] },
                ]
            },
            {
                title: t('custom_player_bar_placements'),
                icon: P('M3 3h18v18H3z M8 12l8-5v10z'),
                items: [
                    { type:'button-group', id:'pb_snapshot', label: t('snapshot_button'), desc: t('extension_feature'), icon:P('M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_loop', label: t('loop_button'), desc: t('extension_feature'), icon:P('M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_speed', label: t('speed_controls'), desc: t('extension_feature'), icon:P('M5 4l15 8-15 8V4z M19 5v14'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_bookmark', label: t('bookmark_button'), desc: t('extension_feature'), icon:P('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_pip', label: t('pip_button'), desc: t('extension_feature'), icon:P('M3 3h18v14H3zM12 14h7v5h-7z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_volume', label: t('volume_booster'), desc: t('extension_feature'), icon:P('M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_cinema', label: t('cinema_filters'), desc: t('extension_feature'), icon:P('M22 3H2l8 9.46V19l4 2v-8.54L22 3z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_play', label: t('native_play_pause'), desc: t('youtube_feature'), icon:P('M5 3l14 9-14 9V3z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_next', label: t('native_next'), desc: t('youtube_feature'), icon:P('M5 4l10 8-10 8V4zM15 4h4v16h-4z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_mute', label: t('native_mute_volume'), desc: t('youtube_feature'), icon:P('M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_cast', label: t('native_cast_tv'), desc: t('youtube_feature'), icon:P('M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z M1 18v3h3c0-1.66-1.34-3-3-3zM1 14v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_autoplay', label: t('native_autoplay'), desc: t('youtube_feature'), icon:P('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_cc', label: t('native_cc_subtitles'), desc: t('youtube_feature'), icon:P('M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
                    { type:'button-group', id:'pb_native_settings', label: t('native_settings'), desc: t('youtube_feature'), icon:P('M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'), options: [{value:'front',label: t('front')},{value:'back',label: t('back')},{value:'hidden',label: t('hidden')}] },
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
        icon: P('M4 6v12l8.5-6L4 6zm9 0v12l8.5-6L13 6z'),
        sections: [
            {
                title: t('speed_controls'),
                icon: P('M4 6v12l8.5-6L4 6zm9 0v12l8.5-6L13 6z'),
                items: [
                    { type:'toggle', id:'enableCustomSpeed',  label: t('enable_controller'), desc: t('master_toggle'), icon:P('M4 6v12l8.5-6L4 6zm9 0v12l8.5-6L13 6z') },
                    { type:'toggle', id:'speedBooster', label: t('10x_speed_booster'), badge:'NEW', desc: t('unlock_native_speed_up_to_10x'), icon:P('M13 10V3L4 14h7v7l9-11h-7z') },
                    { type:'toggle', id:'vscForceSpeed',    label: t('force_saved_speed'), desc: t('prevent_players_from_overriding'), icon:P('M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM12 11.25V9c0-1.1-.9-2-2-2H8v8h2v-2.5h2v2.5h2V11.25zM10 9v1.25H8V9h2zm4 0v8h2V9h-2z') },
                ]
            },
            {
                title: t('controller_behavior'),
                icon: P('M12 20V4M20 12H4'),
                items: [
                    { type:'toggle', id:'vscAudioSupport',  label: t('audio_support'), desc: t('control_audio_tags'), icon:P('M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z') },
                    { type:'toggle', id:'vscRememberSpeed', label: t('remember_speed'), desc: t('restore_speed_across_videos'), icon:P('M19 8l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 0 1-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z') },
                    { type:'toggle', id:'vscHideByDefault', label: t('hide_by_default'), desc: t('only_show_when_changing_speed'), icon:P('M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.28 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z') },
                ]
            },
            {
                title: t('shortcuts'),
                icon: P('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'),
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
        icon: P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2'),
        sections: [
            {
                title: t('home_page'),
                subtitle: 'Immersive experiences for the home feed',
                icon: P('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'),
                items: [
                    { type:'toggle', id:'cinematicMode',   label: t('cinematic_home'),  desc: t('cinematic_styling_for_homepage'),    icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M3.6 9h16.8 M3.6 15h16.8') }
                ]
            },
            {
                title: t('player_page'),
                subtitle: 'Immersive experiences for the video player',
                icon: P('M2 3h20v14H2zM8 21h8M12 17v4'),
                items: [
                    { type:'toggle', id:'zenMode',         label: t('zen_mode'),        desc: t('dim_everything_but_video'),          icon:P('M12 8v4l3 3 M8 12a4 4 0 0 1 4-4 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z') },
                    { type:'toggle', id:'cinemaMode',      label: t('cinema_mode'),     desc: t('theater_like_fullscreen_viewing'),   icon:P('M17 2l5 5M7 2L2 7 M2 7h20v15H2z') },
                    { type:'toggle', id:'ambientMode',     label: t('ambient_theater'), desc: t('giant_canvas_ambilight_effect'),     icon:P('M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41'), slot:'ambientModeOptions' },
                    { type:'toggle', id:'studyMode',       label: t('study_mode'),      desc: t('focus_mode_1_25_playback_speed'), icon:P('M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z') },
                    { type:'toggle', id:'enableFocusMode', label: t('focus_mode'),      desc: t('hide_all_distractions_on_page'),     icon:P('M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7') },
                    { type:'toggle', id:'minimalMode',     label: t('minimalist_chrome'), desc: t('strip_non_essential_page_chrome'), icon:P('M9 3v18M3 9h6 M3 3h18v18H3z') },
                    { type:'toggle', id:'audioModeEnabled',label: t('audio_only_mode'), desc: t('listen_only_hide_the_video'),     icon:P('M9 18V5l12-2v13 M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z') }
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // SEARCH
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'search', label: t('tab_search'),
        icon: P('M21 21l-4.35-4.35M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z'),
        sections: [
            {
                title: t('layout_filters'),
                icon: P('M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z'),
                items: [
                    { type:'toggle', id:'cleanSearch',       label: t('clean_search'),         desc: t('remove_junk_ads'),          icon:P('M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z') },
                    { type:'toggle', id:'autoVideoFilter',   label: t('auto_video_filter'),    desc: t('default_to_videos_tab'),    icon:P('M5 4l15 8-15 8V4z'), style:'display:none' },
                    { type:'layoutToggle', id:'searchLayout',        label: t('list_view_size'),      desc: t('linear_search_thumbnail_size') },
                    { type:'toggle', id:'searchGrid',        class:'span-2', label: t('grid_view'),           desc: t('card_layout_for_search'),   icon:P('M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'), inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="searchColumnsUI" min="1" max="8" step="1" style="width:100%;"><span id="searchColumnsValue" style="font-size:10px; min-width:20px; opacity:0.7;">5</span></div><input type="hidden" id="searchColumns" value="4" />` },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // FILTERS (Hide Features)
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'declutter', label: t('tab_filters'),
        icon: P('M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'),
        sections: [
            {
                title: t('home_page'),
                icon: P('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'),
                items: [
                    { type:'toggle', id:'hideMemberships',   label: t('hide_memberships'),  desc: t('hide_memberships_desc'), icon:P('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z') },
                    { type:'toggle', id:'hideFeed',       label: t('hide_homepage_feed'),  desc: t('blank_homepage'), icon:P('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z') },
                    { type:'toggle', id:'hideExploreTopics', label: t('hide_topics_bar'),   desc: t('remove_category_chips'),    icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M3.6 9h16.8 M3.6 15h16.8') },
                    { type:'toggle', id:'hideTrending',   label: t('hide_trending_explore'),icon:P('M13 2L3 14h9l-1 8 10-12h-9l1-8z') },
                    { type:'toggle', id:'hideMetrics',    label: t('hide_views_subs'),   desc: t('hide_views_likes_sub_counts'), icon:P('M 1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M3 3l18 18') },
                    { type:'toggle', id:'hideThumbnails',    label: t('hide_thumbnails'),   desc: t('blur_on_hover_to_reveal'),  icon:P('M3 3h18v18H3z M8.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21') },
                    { type:'toggle', id:'hideWatched',       class:'span-2', label: t('hide_watched'), inlineSlot:`<div style="display:inline-flex; background:rgba(255,255,255,0.06); border-radius:6px; overflow:hidden; margin-left:8px; vertical-align:middle; z-index:10; position:relative;"><button type="button" id="hwMode-dim" class="view-mode-btn hw-mode-btn active" data-mode="dim" style="font-size:10px; padding:2px 8px; border:none; cursor:pointer; color:inherit; background:none;">Dim</button><button type="button" id="hwMode-hide" class="view-mode-btn hw-mode-btn" data-mode="hide" style="font-size:10px; padding:2px 8px; border:none; cursor:pointer; color:inherit; background:none;">Hide</button></div><div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:180px;"><input type="range" id="hideWatchedThreshold" min="10" max="100" step="5" style="width:100%;"><span id="hideWatchedThresholdValue" style="font-size:10px; min-width:26px; opacity:0.7;">80%</span></div><input type="hidden" id="hideWatchedMode" value="dim" />`, desc: t('auto_hide_watched_videos'),  icon:P('M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'), slot:'' },
                    { type:'toggle', id:'hideMixes',         label: t('hide_mixes'),        desc: t('remove_infinite_mixes'),    icon:P('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71') },
                    { type:'toggle', id:'hidePlaylists',     label: t('hide_playlists'),    desc: t('remove_playlist_cards'),    icon:P('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01') },
                    { type:'toggle', id:'hidePodcasts',      label: t('hide_podcasts'),     desc: t('remove_podcast_cards'),     icon:P('M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1v-6h3v4z M3 19a2 2 0 0 0 2 2h1v-6H3v4z') },
                    { type:'toggle', id:'hidePosts',         label: t('hide_posts'),        desc: t('remove_community_posts'),   icon:P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z') },
                    { type:'toggle', id:'hidePromoShelves',  label: t('hide_promos'),       desc: t('remove_shelves_games'),   icon:P('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z') },
                ]
            },
            {
                title: t('advanced_filters'),
                icon: P('M12 2L2 22h20L12 2z'),
                items: [
                    { type:'select', id:'filterMode', label: t('filter_mode'), desc: t('how_to_treat_filtered_content_globally'), icon:P('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'), options: [{value:'hide',label: t('hide_completely')},{value:'dim',label: t('dim_hover_to_reveal')}] },
                    { type:'toggle', id:'channelWhitelistEnabled', label: t('enable_channel_whitelist'), desc: t('exempt_channels_from_being_hidden'), icon:P('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') },
                    { type:'toggle', id:'channelBlacklistEnabled', label: t('enable_channel_blacklist'), desc: t('always_hide_specific_channels'), icon:P('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z') },
                    { type:'toggle', id:'viewsFilterEnabled', class:'span-2', label: t('hide_low_view_videos'), desc: t('filter_out_unpopular_content'), icon:P('M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'), inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:200px;"><span style="font-size:10px; opacity:0.5;">Min:</span><input type="range" id="viewsHideThresholdUI" min="0" max="11" step="1" style="width:100%;"><span id="viewsHideThresholdValue" style="font-size:10px; min-width:30px; opacity:0.7;">Off</span></div><input type="hidden" id="viewsHideThreshold" value="0" />` },
                    { type:'toggle', id:'dateFilterEnabled', class:'span-2', label: t('filter_by_upload_date'), desc: t('hide_videos_older_newer_than_n_days'), icon:P('M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z'), inlineSlot: `<div style="display:inline-flex; align-items:center; gap:16px; margin-left:auto;"><div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; gap:6px; max-width:180px;"><span style="font-size:10px; opacity:0.5; width:22px;">Max:</span><input type="range" id="dateFilterOlderThresholdUI" min="0" max="13" step="1" style="width:100px;"><span id="dateFilterOlderThresholdValue" style="font-size:10px; min-width:40px; opacity:0.7;">Off</span></div><div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; gap:6px; max-width:180px;"><span style="font-size:10px; opacity:0.5; width:22px;">Min:</span><input type="range" id="dateFilterNewerThresholdUI" min="0" max="13" step="1" style="width:100px;"><span id="dateFilterNewerThresholdValue" style="font-size:10px; min-width:40px; opacity:0.7;">Off</span></div></div><input type="hidden" id="dateFilterOlderThreshold" value="0" /><input type="hidden" id="dateFilterNewerThreshold" value="0" />` },
                ]
            },
            {
                title: t('player_page'),
                icon: P('M2 3h20v14H2zM8 21h8M12 17v4'),
                items: [
                    { type:'toggle', id:'hidePlayerTopics', label: t('hide_topics_bar'),   desc: t('remove_category_chips'),    icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M3.6 9h16.8 M3.6 15h16.8') },
                    { type:'toggle', id:'hideComments',   label: t('hide_comments'),       icon:P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z') },
                    { type:'toggle', id:'hideRelated',    label: t('hide_related_feed'),   desc: t('hide_sidebar_videos'), icon:P('M3 3h18v18H3zM14 8h6M14 12h6M14 16h6') },
                    { type:'toggle', id:'hideLiveChat',   label: t('hide_live_chat'),      icon:P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z') },
                    { type:'toggle', id:'hideEndScreens', label: t('hide_end_screens'),    icon:P('M3 3h18v18H3zM3 9h18M9 21V9') },
                    { type:'toggle', id:'hideCards',      label: t('hide_video_cards'),    icon:P('M3 3h18v18H3zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0') },
                    { type:'toggle', id:'hideAnnotations',label: t('hide_annotations'),    icon:P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z') },
                    { type:'toggle', id:'hideMerch',      label: t('hide_merch_offers'),   icon:P('M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0') },
                    { type:'toggle', id:'hideFundraiser', label: t('hide_donations'),      icon:P('M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z') },
                    { type:'toggle', id:'commentFilter',  label: t('comment_spam_filter'), desc: t('hide_suspected_bots'),        icon:P('M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z') },
                    { type:'select', id:'commentFilterAction', label: t('spam_action'), desc: t('what_to_do_with_spam'), icon:P('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'), options: [{value:'dim',label: t('dim_hover_to_reveal')},{value:'hide',label: t('hide_completely')}] },
                ]
            },
            {
                title: t('search_page'),
                icon: P('M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35'),
                items: [
                    { type:'toggle', id:'hideSearchShelves', label: t('hide_shelf_sections'),  desc: t('remove_for_you'),         icon:P('M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z') },
                    { type:'toggle', id:'hideChannelCards',  label: t('hide_channel_cards'),   desc: t('show_videos_only'),         icon:P('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z') },
                    { type:'toggle', id:'hideVoiceSearch',   label: t('hide_voice_search'), desc: t('remove_microphone_icon'),    icon:P('M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V22h2v-4.08A7 7 0 0 0 19 11h-2z') },
                    { type:'toggle', id:'hideUploadButton',   label: t('hide_upload_button'), desc: t('remove_upload_icon'),    icon:P('M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z') },
                    { type:'toggle', id:'hideSearchMixes', label: t('hide_mixes'), desc: t('remove_infinite_mixes'), icon:P('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71') },
                    { type:'toggle', id:'hideSearchPlaylists', label: t('hide_playlists'), desc: t('remove_playlist_cards'), icon:P('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01') },
                    { type:'toggle', id:'hideSearchPodcasts', label: t('hide_podcasts'), desc: t('remove_podcast_cards'), icon:P('M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1v-6h3v4z M3 19a2 2 0 0 0 2 2h1v-6H3v4z') },
                    { type:'toggle', id:'hideSearchMusic', label: t('hide_music'), desc: t('remove_music_videos'), icon:P('M9 18V5l12-2v13 M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z') }
                ]
            },
            {
                title: t('shorts'),
                icon: P('M12 20V10M18 20V4M6 20v-4'),
                items: [
                    { type:'toggle', id:'hideShorts',       label: t('hide_shorts'),        desc: t('remove_from_home_feed'),    icon:P('M12 20V10M18 20V4M6 20v-4') },
                    { type:'toggle', id:'hideSearchShorts', label: t('hide_search_shorts'), desc: t('remove_from_search_results'), icon:P('M21 21l-4.35-4.35M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z') },
                    { type:'toggle', id:'aggressiveShortsBlock', label: t('nuke_shorts'), desc: t('remove_everywhere'), icon:P('M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10S2 17.52 2 12z') },
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // SUBSCRIPTIONS
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'subscriptions', label: t('tab_subs'),
        icon: P('M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'),
        sections: [

            {
                title: t('filter_bar_layout'),
                items: [
                    { type:'toggle', id:'enableFilterBar',     label: t('enable_filter_bar'), desc: t('show_duration_date_filters'), icon:P('M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z') },
                    { type:'toggle', id:'ff_opt_multiselect', label: t('multi_select_chips'), desc: t('select_multiple_filters_at_once'), icon:P('M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z') },
                    { type:'toggle', id:'ff_search_visible', label: t('show_search_bar'), desc: t('search_feed_by_title'), icon:P('M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z') }
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
                    { type:'toggle', id:'ff_playlist_visible', label: t('playlist') }
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
                    { type:'toggle', id:'enableChannelHealth', class:'span-2', label: t('channel_health'),  desc: t('scan_for_dead_channels'),        icon:P('M22 12h-4l-3 9L9 3l-3 9H2'), inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="channelColumnsUI" min="2" max="10" step="1" style="width:100%;"><span id="channelColumnsValue" style="font-size:10px; min-width:20px; opacity:0.7;">5</span></div><input type="hidden" id="channelColumns" value="5" />` },
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
        icon: P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2'),
        sections: [
            {
                title: t('watch_time'),
                items: [
                    { type:'custom', id:'historyWidget', slot:'history-widget' },
                    { type:'toggle', id:'watchTimeAlert', label: t('watch_time_alert'), desc: t('notify_when_limit_reached'), icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2') },
                    { type:'range',  id:'watchTimeAlertHours', label: t('daily_limit'), unit:'h', min:1, max:12, step:1, parent: 'watchTimeAlert' },
                    { type:'toggle', id:'intentionalDelay', label: t('intentional_delay'), desc: t('add_a_pause_before_videos_start'), icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2') },
                    { type:'range',  id:'intentionalDelayTime', label: t('delay_duration'), unit:'s', min:1, max:10, step:1, parent: 'intentionalDelay' }
                ]
            },
            {
                title: t('tracking_resume'),
                items: [
                    { type:'toggle', id:'smartHistory', label: t('smart_history_tracker'), badge:'NEW', desc: t('track_individual_video_progress_watch_time'), icon:P('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z') },
                    { type:'toggle', id:'autoResume', label: t('auto_resume_videos'), badge:'NEW', desc: t('automatically_resume_from_last_watched_timestamp'), icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2') },
                    { type:'toggle', id:'resumeBadges', label: t('resume_badges'), badge:'NEW', desc: t('show_resume_progress_on_thumbnails'), icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2') },
                    { type:'toggle', id:'continueWatching', label: t('continue_watching'), desc: t('resume_from_history'), icon:P('M5 12h14 M12 5l7 7-7 7') },
                    { type:'custom', id:'recap_buttons', slot:'recapButtons' }
                ]
            },
            {
                title: t('history_interface'),
                items: [
                    { type:'toggle', id:'playlistDuration', label: t('duration_calc'), desc: t('show_total_length'), icon:P('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2') },
                    { type:'toggle', id:'reversePlaylist', label: t('reverse_playlist'), desc: t('toggle_direction'), icon:P('M15 14l5-5-5-5 M4 20v-7a4 4 0 0 1 4-4h12') },
                    { type:'toggle', id:'historyRedesign', class:'span-2', label: t('history_redesign'), desc: t('new_history_layout'), icon:P('M3 3h18v18H3z M14 8h6M14 12h6M14 16h6'), inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="historyColumnsUI" min="1" max="8" step="1" style="width:100%;"><span id="historyColumnsValue" style="font-size:10px; min-width:20px; opacity:0.7;">5</span></div><input type="hidden" id="historyColumns" value="5" />` }
                ]
            }
        ]
    },

    // ──────────────────────────────────────────────────────────────────
    // BOOKMARKS (custom — list rendered by popup-extras)
    // ──────────────────────────────────────────────────────────────────
    { id: 'bookmarks', label: t('tab_marks'), icon: P('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'), custom: true, sections: [] },


    // ──────────────────────────────────────────────────────────────────
    // DESIGN (custom — UI layout, cards, theming, effects)
    // ──────────────────────────────────────────────────────────────────
    { id: 'appearance', label: t('tab_design'), icon: P('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'), custom: true, sections: [] },

    // ──────────────────────────────────────────────────────────────────
    // ADVANCED
    // ──────────────────────────────────────────────────────────────────
    {
        id: 'advanced', label: t('tab_pro'),
        icon: P('M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'),
        sections: [
            {
                title: t('global_player_bar'),
                items: [
                    { type:'toggle', id:'enableGlobalPlayerBar', label: t('global_player_bar'), desc: t('enable_on_external_sites'), icon:P('M3 3h18v14H3zM3 15h18'), slot:'globalPlayerBarOptions', style: 'grid-column: 1 / -1;' },
                ]
            },
            {
                title: t('custom_css_userstyles'),
                items: [
                    { type:'toggle', id:'enableCustomCSS', label: t('enable_custom_css'), desc: t('import_or_write_your_own_styles'), icon:P('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'), slot:'customCSSOptions' },
                ]
            },
            {
                title: t('stats_overlays'),
                items: [
                    { type:'toggle', id:'enableStatsForNerds', label: t('stats_overlay'), desc: t('view_tech_details'), icon:P('M4 17l6-6 4 4 6-8') },
                ]
            },
            {
                title: t('api_integrations'),
                subtitle: 'Third-party service connections',
                items: [
                    { type:'toggle', id:'returnYouTubeDislike', label: t('return_youtube_dislike'), desc: t('restore_dislike_count_via_ryd_api'), icon:P('M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17') },
                    { type:'toggle', id:'adSkipper',            label: t('ad_skipper'),             desc: t('skip_video_ads_automatically'),   icon:P('M5 4l10 8-10 8V4z M19 5v14') },
                    { type:'toggle', id:'sponsorBlock',         label: t('sponsorblock'),           desc: t('skip_sponsored_segments'),        icon:P('M13 2L3 14h9l-1 8 10-12h-9l1-8z'), slot:'sponsorBlockCategories' }
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
                    { type:'toggle', id:'keyboardShortcuts', label: t('enable_hotkeys'), icon:P('M2 4h20v16H2z M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10') },
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
