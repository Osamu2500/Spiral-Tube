import { ICONS, P } from '../ui/popup-icons.js';

export const getSearchTab = (t) => ({
    id: 'search',
    label: t('tab_search'),
    icon: ICONS.search,
    sections: [
      {
        title: t('layout_filters'),
        icon: P('M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z'),
        items: [

          {
            type: 'toggle',
            id: 'autoVideoFilter',
            label: t('auto_video_filter'),
            desc: t('default_to_videos_tab'),
            icon: P('M5 4l15 8-15 8V4z'),
            style: 'display:none',
          },
          {
            type: 'layoutToggle',
            id: 'searchLayout',
            class: 'span-2',
            label: t('list_view_size'),
            desc: t('linear_search_thumbnail_size'),
          },
          {
            type: 'toggle',
            id: 'searchGrid',
            class: 'span-2',
            label: t('grid_view'),
            desc: t('card_layout_for_search'),
            icon: P('M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'),
            inlineSlot: `<div class="inline-slider-wrapper" style="display:inline-flex; align-items:center; margin-left:auto; gap:6px; padding-left: 20px; flex-grow:1; max-width:160px;"><span style="font-size:10px; opacity:0.5;">Cols:</span><input type="range" id="searchColumnsUI" min="1" max="8" step="1" style="width:100%;"><span id="searchColumnsValue" style="font-size:10px; min-width:20px; opacity:0.7;">5</span></div><input type="hidden" id="searchColumns" value="4" />`,
          },
        ],
      },
    ],
  });
