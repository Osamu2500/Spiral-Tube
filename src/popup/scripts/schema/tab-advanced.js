import { ICONS, P } from '../ui/popup-icons.js';

export const getAdvancedTab = (t) => ({
    id: 'advanced',
    label: t('tab_pro'),
    icon: ICONS.advancedTab,
    sections: [
      {
        title: t('global_player_bar'),
        icon: ICONS.globalBar,
        items: [
          {
            type: 'toggle',
            id: 'enableGlobalPlayerBar',
            label: t('global_player_bar'),
            desc: t('enable_on_external_sites'),
            icon: ICONS.globalBar,
            slot: 'globalPlayerBarOptions',
            style: 'grid-column: 1 / -1;',
          },
          {
            type: 'custom',
            id: 'global_player_bar_blocklist',
            slot: 'global_player_bar_blocklist',
            class: 'span-4',
            style: 'grid-column: 1 / -1; width: 100%;',
          },
        ],
      },
      {
        title: 'Video Management',
        icon: ICONS.player,
        items: [
          {
            type: 'toggle',
            id: 'multiSelect',
            label: t('multi_select_videos'),
            desc: t('hold_shift_click_to_select_multiple_videos'),
            icon: ICONS.multiSelect,
            slot: 'multiSelectOptions',
          },
          {
            type: 'toggle',
            id: 'copyLinkButton',
            class: 'span-3',
            label: t('copy_link_button'),
            desc: t('copy_link_button_desc'),
            icon: ICONS.promos,
            inlineSlot:
              '<div style="display:flex; align-items:center; gap:6px; margin-left:auto; flex:1; justify-content:flex-end; padding-left:16px;"><span style="font-size:11px; opacity:0.6; margin-right:2px; font-weight:500;">Pages:</span><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="home" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Home</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="channel" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Channel</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="subs" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Subs</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="search" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Search</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="related" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Related</button></div>',
          },
        ],
      },
      {
        title: 'Remembered Streaming Sites (Domain Memory)',
        icon: ICONS.secDomainMemory,
        items: [
          {
            type: 'custom',
            id: 'domain_memory_manager',
            slot: 'domain_memory_manager',
            class: 'span-4',
            style: 'grid-column: 1 / -1; width: 100%;',
          },
        ],
      },
    ],
  });
