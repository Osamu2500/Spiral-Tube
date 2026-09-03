import { ICONS, P } from '../../ui/popup-icons.js';

export const getHistoryTab = (t) => ({
    id: 'history',
    label: t('tab_history'),
    icon: ICONS.wheel,
    sections: [
      {
        title: t('watch_time'),
        icon: ICONS.clock,
        items: [
          { type: 'custom', id: 'historyWidget', slot: 'history-widget' },
          {
            type: 'toggle',
            id: 'watchTimeAlert',
            label: t('watch_time_alert'),
            desc: t('notify_when_limit_reached'),
            icon: ICONS.clock,
          },
          {
            type: 'range',
            id: 'watchTimeAlertHours',
            label: t('daily_limit'),
            unit: 'h',
            min: 1,
            max: 12,
            step: 1,
            parent: 'watchTimeAlert',
          },
          {
            type: 'toggle',
            id: 'intentionalDelay',
            label: t('intentional_delay'),
            desc: t('add_a_pause_before_videos_start'),
            icon: ICONS.pause,
          },
          {
            type: 'range',
            id: 'intentionalDelayTime',
            label: t('delay_duration'),
            unit: 's',
            min: 1,
            max: 10,
            step: 1,
            parent: 'intentionalDelay',
          },
        ],
      },
      {
        title: t('tracking_resume'),
        icon: ICONS.secHistoryTracking,
        items: [
          {
            type: 'toggle',
            id: 'smartHistory',
            label: t('smart_history_tracker'),
            desc: t('track_individual_video_progress_watch_time'),
            icon: ICONS.smartHistory,
          },
          {
            type: 'toggle',
            id: 'autoResume',
            label: t('auto_resume_videos'),
            desc: t('automatically_resume_from_last_watched_timestamp'),
            icon: ICONS.wheel,
          },
          {
            type: 'toggle',
            id: 'resumeBadges',
            label: t('resume_badges'),
            desc: t('show_resume_progress_on_thumbnails'),
            icon: ICONS.wheel,
          },
          {
            type: 'toggle',
            id: 'continueWatching',
            label: t('continue_watching'),
            desc: t('resume_from_history'),
            icon: ICONS.continueWatch,
          },
          { type: 'custom', id: 'recap_buttons', slot: 'recapButtons' },
        ],
      },
      {
        title: t('history_interface'),
        icon: ICONS.smartHistory,
        items: [
          {
            type: 'toggle',
            id: 'playlistDuration',
            label: t('duration_calc'),
            desc: t('show_total_length'),
            icon: ICONS.wheel,
          },
          {
            type: 'toggle',
            id: 'reversePlaylist',
            label: t('reverse_playlist'),
            desc: t('toggle_direction'),
            icon: ICONS.reversePlay,
          },
          {
            type: 'toggle',
            id: 'historyRedesign',
            label: t('history_redesign'),
            desc: t('new_history_layout'),
            icon: ICONS.sidebar,
            inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="historyColumnsUI" min="1" max="8" step="1" style="width:100%;"><span id="historyColumnsValue" style="font-size:10px; min-width:20px; opacity:0.7;">5</span></div><input type="hidden" id="historyColumns" value="5" />`,
          },
        ],
      },
    ],
  });
