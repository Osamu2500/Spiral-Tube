import { ICONS, P } from '../ui/popup-icons.js';

export const getSubscriptionsTab = (t) => ({
    id: 'subscriptions',
    label: t('tab_subs'),
    icon: ICONS.subs,
    sections: [

      {
        title: t('filter_bar_layout'),
        icon: ICONS.filterMode,
        items: [
          {
            type: 'toggle',
            id: 'enableFilterBar',
            label: t('enable_filter_bar'),
            desc: t('show_duration_date_filters'),
            icon: P('M22 3L2 3l8 9.46V19l4 2v-8.54L22 3z'),
          },
          {
            type: 'toggle',
            id: 'feedFilter_opt_multiselect',
            label: t('multi_select_chips'),
            desc: t('select_multiple_filters_at_once'),
            icon: P('M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'),
          },
          {
            type: 'toggle',
            id: 'feedFilter_search_visible',
            label: t('show_search_bar'),
            desc: t('search_feed_by_title'),
            icon: ICONS.searchBar,
          },
        ],
      },
      {
        title: t('filter_chips_content'),
        icon: ICONS.secSubsChipsContent,
        items: [
          { type: 'toggle', id: 'feedFilter_video_visible', label: t('video') },
          { type: 'toggle', id: 'feedFilter_shorts_visible', label: t('shorts') },
          { type: 'toggle', id: 'feedFilter_live_visible', label: t('live') },
          { type: 'toggle', id: 'feedFilter_streamed_visible', label: t('streamed') },
          { type: 'toggle', id: 'feedFilter_scheduled_visible', label: t('scheduled') },
          { type: 'toggle', id: 'feedFilter_posts_visible', label: t('posts') },
          { type: 'toggle', id: 'feedFilter_playlist_visible', label: t('playlist') },
        ],
      },
      {
        title: t('filter_chips_status'),
        icon: ICONS.watched,
        items: [
          { type: 'toggle', id: 'feedFilter_notifon_visible', label: t('notification_on') },
          { type: 'toggle', id: 'feedFilter_notifoff_visible', label: t('notification_off') },
        ],
      },
      {
        title: t('layout_tools'),
        icon: ICONS.secSubsLayout,
        items: [
          {
            type: 'toggle',
            id: 'enableChannelHealth',
            label: t('channel_health'),
            desc: t('scan_for_dead_channels'),
            icon: ICONS.compressor,
          },
          {
            type: 'range',
            id: 'subscriptionsColumns',
            class: 'span-2',
            label: t('feed_grid_columns'),
            desc: t('grid_layout_size_for_subs'),
            icon: P('M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'),
            min: 1,
            max: 8,
            step: 1,
            unit: '',
          },
          {
            type: 'toggle',
            id: 'twoColumnSubscriptions',
            label: t('twoColumnSubscriptions'),
            desc: t('twoColumnSubscriptions_desc'),
            icon: ICONS.grid,
          },
        ],
      },
    ],
  });
