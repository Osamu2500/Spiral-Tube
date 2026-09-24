import { ICONS, P } from '../../../ui/popup-icons.js';

export const getAdvancedTab = (t) => ({
    id: 'advanced',
    label: t('tab_pro'),
    icon: ICONS.advancedTab,
    sections: [
      {
        title: t('global_player_bar'),
        icon: ICONS.globalBar,
        color: '#ec4899',
        items: [
          {
            type: 'toggle',
            id: 'enableGlobalBar',
            label: t('global_player_bar'),
            desc: t('enable_on_external_sites'),
            icon: ICONS.globalBar,
            style: 'grid-column: 1 / -1;',
            bottomSlot: `
              <div id="globalBarOptions" style="display:none; padding-top: 16px; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div class="setting-item" style="padding: 12px 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; backdrop-filter: blur(10px);">
                  <div class="info" style="display: flex; flex-direction: column; flex: 1; margin-right: 10px; min-width: 0;">
                    <span class="name" data-i18n="player_bar_position" style="font-size: calc(12px * var(--ui-font-scale, 1)); font-weight: 700; color: #ffffff;">Player Bar Position</span>
                    <span class="desc" data-i18n="where_should_it_appear_on_external_sites" style="font-size: calc(11px * var(--ui-font-scale, 1)); font-weight: 500; color: rgba(255,255,255,0.6); margin-top: 4px;">Where should it appear on external sites?</span>
                  </div>
                  <select id="globalBarPosition" class="theme-select" aria-label="Global Bar Position" title="Global Bar Position" style="width: 110px; padding: 6px 10px; font-weight: 600; flex-shrink: 0; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; cursor: pointer;">
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="top">Top</option>
                  </select>
                </div>
                
                <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 12px; padding-left: 4px;">Visible Buttons</div>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                  <label class="gpb-btn-pill" title="Domain" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showDomain" aria-label="Gpb show Domain">
                    <span class="gpb-dot"></span><span>Domain</span>
                  </label>
                  <label class="gpb-btn-pill" title="Play / Pause" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showPlay" aria-label="Gpb show Play">
                    <span class="gpb-dot"></span><span>Play / Pause</span>
                  </label>
                  <label class="gpb-btn-pill" title="Time Display" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showTime" aria-label="Gpb show Time">
                    <span class="gpb-dot"></span><span>Time Display</span>
                  </label>
                  <label class="gpb-btn-pill" title="Volume" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showVolume" aria-label="Gpb show Volume">
                    <span class="gpb-dot"></span><span>Volume</span>
                  </label>
                  <label class="gpb-btn-pill" title="Vol Booster" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showVolumeBoost" aria-label="Gpb show Volume Boost">
                    <span class="gpb-dot"></span><span>Vol Booster</span>
                  </label>
                  <label class="gpb-btn-pill" title="Filters" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showFilters" aria-label="Gpb show Filters">
                    <span class="gpb-dot"></span><span>Filters</span>
                  </label>
                  <label class="gpb-btn-pill" title="Loop" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showLoop" aria-label="Gpb show Loop">
                    <span class="gpb-dot"></span><span>Loop</span>
                  </label>
                  <label class="gpb-btn-pill" title="PiP Mode" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showPip" aria-label="Gpb show Pip">
                    <span class="gpb-dot"></span><span>PiP Mode</span>
                  </label>
                  <label class="gpb-btn-pill" title="Speed" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                    <input type="checkbox" id="gpb_showSpeed" aria-label="Gpb show Speed">
                    <span class="gpb-dot"></span><span>Speed</span>
                  </label>
                  <label class="gpb-btn-pill" title="Fullscreen" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
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
        color: '#8b5cf6',
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
              '<div style="display:flex; align-items:center; gap:8px; margin-left:auto; flex:1; justify-content:flex-end; padding-left:16px;"><span style="font-size:12px; color:rgba(255,255,255,0.6); margin-right:4px; font-weight:600;">Pages:</span><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="home" style="font-size:11px; padding:6px 12px; border-radius:8px; cursor:pointer; transition:all 0.2s; font-weight:600; border: 1px solid rgba(255,255,255,0.1);">Home</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="channel" style="font-size:11px; padding:6px 12px; border-radius:8px; cursor:pointer; transition:all 0.2s; font-weight:600; border: 1px solid rgba(255,255,255,0.1);">Channel</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="subs" style="font-size:11px; padding:6px 12px; border-radius:8px; cursor:pointer; transition:all 0.2s; font-weight:600; border: 1px solid rgba(255,255,255,0.1);">Subs</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="search" style="font-size:11px; padding:6px 12px; border-radius:8px; cursor:pointer; transition:all 0.2s; font-weight:600; border: 1px solid rgba(255,255,255,0.1);">Search</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="related" style="font-size:11px; padding:6px 12px; border-radius:8px; cursor:pointer; transition:all 0.2s; font-weight:600; border: 1px solid rgba(255,255,255,0.1);">Related</button></div>',
          },
        ],
      },
      {
        title: 'Remembered Streaming Sites (Domain Memory)',
        icon: ICONS.secDomainMemory,
        color: '#10b981',
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
      {
        title: 'Layout & Modes',
        icon: ICONS.grid,
        color: '#f59e0b',
        items: [
          {
            type: 'toggle',
            id: 'fullVideoTitles',
            label: 'Full Video Titles',
            desc: 'Prevent video titles from being truncated with ...',
            badge: 'New',
            icon: ICONS.text,
          },
          {
            type: 'toggle',
            id: 'wideChannelLayout',
            label: 'Wide Channel Layout',
            desc: 'Expand channel pages to use full width on large monitors',
            badge: 'New',
            icon: ICONS.grid,
          },
          {
            type: 'toggle',
            id: 'siteGrayscaleMode',
            label: 'Grayscale Mode',
            desc: 'Turn the entire YouTube site black and white',
            badge: 'New',
            icon: ICONS.theme,
          },
          {
            type: 'toggle',
            id: 'searchEngineMode',
            label: 'Search Engine Mode',
            desc: 'Hide everything except the search bar to avoid distractions',
            badge: 'New',
            icon: ICONS.search,
          },
          {
            type: 'select',
            id: 'bypassHomepage',
            class: 'span-2',
            label: 'Bypass Homepage',
            desc: 'Automatically redirect away from the homepage',
            icon: ICONS.home,
            options: [
              { value: 'off', label: 'Off' },
              { value: 'subscriptions', label: 'Subscriptions' },
              { value: 'watch_later', label: 'Watch Later' },
              { value: 'library', label: 'Library' },
            ],
          },
        ]
      },
      {
        title: 'Advanced Content Filters',
        icon: ICONS.pinVideo,
        color: '#64748b',
        items: [
          {
            type: 'toggle',
            id: 'hideClickbaitEnabled',
            label: 'Hide Clickbait',
            desc: 'Hide overly sensational titles/thumbnails',
            icon: ICONS.hide,
          },
          {
            type: 'toggle',
            id: 'hideClickbaitEmojis',
            label: 'Block Excessive Emojis',
            desc: 'Hide videos with 4+ emojis in the title',
            icon: ICONS.hide,
          },
          {
            type: 'toggle',
            id: 'hideClickbaitPunctuation',
            label: 'Block Excessive Punctuation',
            desc: 'Hide videos with 3+ ! or ? in the title',
            icon: ICONS.hide,
          },
          {
            type: 'toggle',
            id: 'enableChannelWhitelist',
            label: 'Enable Channel Whitelist',
            desc: 'Allow specific channels to bypass all filters',
            icon: ICONS.shield,
          },
          {
            type: 'toggle',
            id: 'enableChannelBlacklist',
            label: 'Enable Channel Blacklist',
            desc: 'Permanently hide specific channels from all feeds',
            icon: ICONS.block,
          },
          {
            type: 'toggle',
            id: 'pauseChannelTrailers',
            label: 'Pause Channel Trailers',
            desc: 'Automatically pause auto-playing videos on channel pages',
            badge: 'New',
            icon: ICONS.pause,
          },
        ]
      },
    ],
  });
