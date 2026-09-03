import { ICONS, P } from '../../ui/popup-icons.js';

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
            style: 'grid-column: 1 / -1;',
            bottomSlot: `
              <div id="globalPlayerBarOptions" style="display:none; padding-top: 12px; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.06);">
                <div class="setting-item" style="padding: 0; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                  <div class="info" style="display: flex; flex-direction: column; flex: 1; margin-right: 10px; min-width: 0;">
                    <span class="name" data-i18n="player_bar_position" style="font-size: calc(11px * var(--ui-font-scale, 1)); font-weight: 600; color: #ffffff;">Player Bar Position</span>
                    <span class="desc" data-i18n="where_should_it_appear_on_external_sites" style="font-size: calc(10px * var(--ui-font-scale, 1)); color: rgba(255,255,255,0.6); margin-top: 2px;">Where should it appear on external sites?</span>
                  </div>
                  <select id="globalPlayerBarPosition" class="theme-select" aria-label="Global Player Bar Position" title="Global Player Bar Position" style="width: 110px; padding: 4px 8px; flex-shrink: 0;">
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="top">Top</option>
                  </select>
                </div>
                
                <div style="font-size: 11px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">Visible Buttons</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  <label class="gpb-btn-pill" title="Domain">
                    <input type="checkbox" id="gpb_showDomain" aria-label="Gpb show Domain">
                    <span class="gpb-dot"></span><span>Domain</span>
                  </label>
                  <label class="gpb-btn-pill" title="Play / Pause">
                    <input type="checkbox" id="gpb_showPlay" aria-label="Gpb show Play">
                    <span class="gpb-dot"></span><span>Play / Pause</span>
                  </label>
                  <label class="gpb-btn-pill" title="Time Display">
                    <input type="checkbox" id="gpb_showTime" aria-label="Gpb show Time">
                    <span class="gpb-dot"></span><span>Time Display</span>
                  </label>
                  <label class="gpb-btn-pill" title="Volume">
                    <input type="checkbox" id="gpb_showVolume" aria-label="Gpb show Volume">
                    <span class="gpb-dot"></span><span>Volume</span>
                  </label>
                  <label class="gpb-btn-pill" title="Vol Booster">
                    <input type="checkbox" id="gpb_showVolumeBoost" aria-label="Gpb show Volume Boost">
                    <span class="gpb-dot"></span><span>Vol Booster</span>
                  </label>
                  <label class="gpb-btn-pill" title="Filters">
                    <input type="checkbox" id="gpb_showFilters" aria-label="Gpb show Filters">
                    <span class="gpb-dot"></span><span>Filters</span>
                  </label>
                  <label class="gpb-btn-pill" title="Loop">
                    <input type="checkbox" id="gpb_showLoop" aria-label="Gpb show Loop">
                    <span class="gpb-dot"></span><span>Loop</span>
                  </label>
                  <label class="gpb-btn-pill" title="PiP Mode">
                    <input type="checkbox" id="gpb_showPip" aria-label="Gpb show Pip">
                    <span class="gpb-dot"></span><span>PiP Mode</span>
                  </label>
                  <label class="gpb-btn-pill" title="Speed">
                    <input type="checkbox" id="gpb_showSpeed" aria-label="Gpb show Speed">
                    <span class="gpb-dot"></span><span>Speed</span>
                  </label>
                  <label class="gpb-btn-pill" title="Fullscreen">
                    <input type="checkbox" id="gpb_showFullscreen" aria-label="Gpb show Fullscreen">
                    <span class="gpb-dot"></span><span>Fullscreen</span>
                  </label>
                </div>
              </div>
            `
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
