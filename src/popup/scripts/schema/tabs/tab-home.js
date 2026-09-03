import { ICONS, P } from '../../ui/popup-icons.js';

export const getHomeTab = (t) => ({
    id: 'home',
    label: t('tab_home'),
    icon: ICONS.home,
    sections: [
      {
        title: t('section_feed_layout'),
        icon: ICONS.grid,
        items: [
          {
            type: 'toggle',
            id: 'enableDeckMode',
            label: 'Deck Mode',
            desc: 'Multi-column grid for Subscriptions',
            icon: ICONS.grid,
          },
          {
            type: 'toggle',
            id: 'autoScaleLayout',
            label: t('auto_scale_grid'),
            desc: t('adapt_to_zoom_window_size'),
            icon: ICONS.autoScale,
          },
          {
            type: 'toggle',
            id: 'enableSmartThumbnails',
            label: 'Smart Thumbnails',
            desc: 'AI powered thumbnail un-clickbaiting',
            icon: ICONS.cleanSearch,
          },
          {
            type: 'range',
            id: 'homeColumns',
            class: 'span-2',
            icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
            label: t('grid_columns'),
            desc: t('0_auto_scale'),
            unit: '',
            min: 0,
            max: 10,
            step: 1,
          },
        ],
      },
    ],
  });
