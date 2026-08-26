import { ICONS, P } from '../ui/popup-icons.js';

export const getPlayerTab = (t) => ({
    id: 'player',
    label: t('tab_player'),
    icon: ICONS.player,
    sections: [

      // Section 1: Playback Automation & Behaviors
      {
        title: t('playback_automation'),
        icon: ICONS.magicWand,
        items: [
          {
            type: 'toggle',
            id: 'autoPlayNext',
            label: 'Auto Play Next',
            desc: 'Toggle YouTube autoplay next behavior',
            icon: ICONS.play,
          },
          {
            type: 'toggle',
            id: 'netflixSubtitles',
            label: t('player_netflix_subtitles'),
            icon: ICONS.subtitles,
          },
          {
            type: 'toggle',
            id: 'autoCinema',
            label: t('auto_cinema'),
            desc: t('expand_player_on_load'),
            icon: ICONS.autoCinema,
          },
          {
            type: 'toggle',
            id: 'autoPiP',
            label: 'Auto PiP',
            desc: t('auto_pip_desc'),
            icon: P('M3 3h18v14H3zM12 14h7v5h-7z'),
          },
          {
            type: 'toggle',
            id: 'enableMiniPlayer',
            label: t('enable_miniplayer'),
            desc: t('enable_miniplayer_desc'),
            icon: P(
              'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z'
            ),
          },

          {
            type: 'toggle',
            id: 'enableCpuTamer',
            label: t('cpu_tamer'),
            desc: t('cpu_tamer_desc'),
            icon: ICONS.compressor,
          },
          {
            type: 'toggle',
            id: 'videoResumer',
            label: t('video_resumer'),
            desc: t('save_playback_position'),
            icon: ICONS.resume,
          },
          {
            type: 'toggle',
            id: 'autoLike',
            label: 'Auto Like',
            desc: 'Automatically like watched videos',
            icon: ICONS.thumbsUp,
          },
          {
            type: 'toggle',
            id: 'autoPause',
            label: t('auto_pause'),
            desc: t('pause_when_backgrounded'),
            icon: ICONS.pause,
          },
          {
            type: 'select',
            id: 'autoQuality',
            label: t('auto_quality'),
            desc: t('force_specific_resolution'),
            icon: ICONS.settingsSync,
            options: [
              { value: 'highres', label: t('max_4k') },
              { value: 'hd1440', label: t('1440p') },
              { value: 'hd1080', label: t('1080p') },
              { value: 'hd720', label: t('720p') },
              { value: 'off', label: t('off') },
            ],
          },
          { type: 'custom', id: 'intentionalDelaySlot' },
          { type: 'custom', id: 'autoLikeSlot' },
        ],
      },

      // Section 3: Player UI Components
      {
        title: t('player_ui_components'),
        icon: ICONS.uiComponents,
        items: [

          {
            type: 'toggle',
            id: 'saveSupremeUI',
            label: 'Save Supreme UI',
            desc: 'Better styling for save buttons',
            icon: ICONS.saveSupreme,
          },
          {
            type: 'toggle',
            id: 'reduceAnimations',
            class: 'span-2',
            label: t('reduce_animations'),
            desc: t('reduce_animations_desc'),
            icon: ICONS.reduceAnimations,
            inlineSlot: `
    <div style="display:flex; align-items:center; gap:6px; margin-left:auto; flex:1; justify-content:flex-end; padding-left:16px;">
        <select id="reduceAnimationsLevel" class="theme-select card-style-select" style="min-width:100px; padding:4px 8px; font-size:11px; border-radius:6px; cursor:pointer; background:var(--bg-lighter); color:var(--text-primary); border:1px solid rgba(255,255,255,0.1);">
            <option value="balanced">${t('reduce_animations_balanced')}</option>
            <option value="minimal">${t('reduce_animations_minimal')}</option>
        </select>
    </div>`,
          },
          {
            type: 'toggle',
            id: 'revertProgressBar',
            label: t('classic_progress_bar'),
            desc: t('solid_red_no_pink_gradient'),
            icon: ICONS.progressBar,
          },

          {
            type: 'toggle',
            id: 'markWatched',
            label: 'Mark as Watched Button',
            desc: 'Add a button to manually mark videos as watched',
            icon: ICONS.eyeSlash,
          },
        ],
      },

      // Section 4: Sidebar Features
      {
        title: t('sidebar_features'),
        icon: ICONS.sidebar,
        items: [
          {
            type: 'toggle',
            id: 'enableCustomSidebar',
            label: t('custom_sidebar'),
            desc: t('master_toggle_for_sidebar_layout'),
            icon: ICONS.sidebar,
            default: true,
          },
          {
            type: 'layoutToggle',
            id: 'sidebarLayout',
            class: 'span-3',
            label: t('sidebar_layout'),
            desc: t('video_cards_size'),
          },
          {
            type: 'toggle',
            id: 'splitScrolling',
            label: t('split_scrolling'),
            desc: t('scroll_sidebar_independently'),
            icon: ICONS.splitScroll,
          },
        ],
      },

      // Section 5: Player Bar Tools
      {
        title: 'Player Bar Tools',
        icon: ICONS.secPlayerTools,
        items: [
          {
            type: 'toggle',
            id: 'enableLoop',
            label: 'Loop',
            desc: t('add_loop_toggle'),
            icon: ICONS.loopButton,
          },
          {
            type: 'toggle',
            id: 'enableSnapshot',
            label: 'Snapshot',
            desc: t('save_frame_as_image'),
            icon: ICONS.snapshot,
          },
          {
            type: 'toggle',
            id: 'enableBookmarks',
            label: t('bookmarks'),
            desc: t('capture_clips_text'),
            icon: ICONS.saveSupreme,
          },
          {
            type: 'toggle',
            id: 'enableCinemaFilters',
            label: t('video_filters'),
            desc: t('visual_effects_panel'),
            icon: ICONS.cinemaFilters,
          },
          {
            type: 'toggle',
            id: 'enableVolumeBoost',
            label: t('volume_booster'),
            desc: t('increase_past_100'),
            icon: ICONS.volumeUp,
          },
          {
            type: 'toggle',
            id: 'enableRemainingTime',
            label: t('time_remaining'),
            desc: t('next_to_duration'),
            icon: ICONS.wheel,
          },
          {
            type: 'toggle',
            id: 'showLiveStreamTime',
            label: t('show_live_stream_time'),
            desc: t('show_live_stream_time_desc'),
            icon: ICONS.clock,
          },
        ],
      },

      // Section 6: Custom Player Bar Placements
      {
        title: t('custom_player_bar_placements'),
        icon: ICONS.placement,
        items: [
          {
            type: 'button-group',
            id: 'pb_snapshot',
            label: t('snapshot_button'),
            desc: t('extension_feature'),
            icon: ICONS.snapshot,
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_loop',
            label: t('loop_button'),
            desc: t('extension_feature'),
            icon: ICONS.loopButton,
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_speed',
            label: t('speed_controls'),
            desc: t('extension_feature'),
            icon: P('M5 4l15 8-15 8V4z M19 5v14'),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_bookmark',
            label: t('bookmark_button'),
            desc: t('extension_feature'),
            icon: ICONS.saveSupreme,
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_pip',
            label: 'Auto PiP',
            desc: t('extension_feature'),
            icon: P('M3 3h18v14H3zM12 14h7v5h-7z'),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_volume',
            label: t('volume_booster'),
            desc: t('extension_feature'),
            icon: ICONS.volumeUp,
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_cinema',
            label: t('cinema_filters'),
            desc: t('extension_feature'),
            icon: ICONS.cinemaFilters,
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_play',
            label: t('native_play_pause'),
            desc: t('youtube_feature'),
            icon: ICONS.player,
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_next',
            label: t('native_next'),
            desc: t('youtube_feature'),
            icon: P('M5 4l10 8-10 8V4zM15 4h4v16h-4z'),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_mute',
            label: t('native_mute_volume'),
            desc: t('youtube_feature'),
            icon: P('M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07'),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_cast',
            label: t('native_cast_tv'),
            desc: t('youtube_feature'),
            icon: P(
              'M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z M1 18v3h3c0-1.66-1.34-3-3-3zM1 14v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z'
            ),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_autoplay',
            label: t('native_autoplay'),
            desc: t('youtube_feature'),
            icon: ICONS.smartHistory,
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_cc',
            label: t('native_cc_subtitles'),
            desc: t('youtube_feature'),
            icon: P(
              'M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z'
            ),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_settings',
            label: t('native_settings'),
            desc: t('youtube_feature'),
            icon: P(
              'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06-.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'
            ),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_miniplayer',
            label: t('native_miniplayer'),
            desc: t('youtube_feature'),
            icon: P(
              'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z'
            ),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_theater',
            label: t('native_theater_mode'),
            desc: t('youtube_feature'),
            icon: P(
              'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z'
            ),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
          {
            type: 'button-group',
            id: 'pb_native_fullscreen',
            label: t('native_fullscreen'),
            desc: t('youtube_feature'),
            icon: P(
              'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'
            ),
            options: [
              { value: 'front', label: t('front') },
              { value: 'back', label: t('back') },
              { value: 'hidden', label: t('hidden') },
            ],
          },
        ],
      },
    ],
  });
