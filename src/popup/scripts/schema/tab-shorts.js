import { ICONS, P } from '../ui/popup-icons.js';

export const getShortsTab = (t) => ({
    id: 'shorts',
    label: t('tab_shorts'),
    icon: ICONS.shorts,
    sections: [
      {
        title: t('visibility_routing'),
        icon: ICONS.eyeSlash,
        items: [
          {
            type: 'toggle',
            id: 'redirectShorts',
            label: t('redirect_shorts'),
            desc: t('play_in_normal_ui'),
            icon: ICONS.home,
          },
        ],
      },
      {
        title: t('global_filters_shorts'),
        icon: P('M22 3L2 22 M22 22L2 3'),
        items: [
          {
            type: 'toggle',
            id: 'stopShortsLooping',
            label: t('stop_looping'),
            desc: t('no_auto_replay_on_shorts'),
            icon: ICONS.loopOff,
          },
          {
            type: 'toggle',
            id: 'shortsAutoScroll',
            label: 'Auto Scroll Shorts',
            desc: 'Automatically scroll to next short when finished',
            icon: ICONS.play,
          },
          {
            type: 'toggle',
            id: 'shortsVolumeNormalizer',
            label: 'Volume Normalizer',
            desc: 'Prevent loud jumps in volume',
            icon: ICONS.volumeUp,
          },
          {
            type: 'toggle',
            id: 'hideShortVideos',
            label: t('duration_filter'),
            desc: t('hide_short_videos'),
            icon: ICONS.clock,
          },
          {
            type: 'range',
            id: 'minVideoDuration',
            class: 'span-2',
            label: 'Minimum Duration',
            desc: 'Minutes',
            icon: ICONS.clock,
            min: 0,
            max: 60,
            step: 1,
            unit: 'm',
          },
        ],
      },
    ],
  });
