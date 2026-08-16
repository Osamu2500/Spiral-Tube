const fs = require('fs');

const schemaPath = 'src/popup/popup-schema.js';
let content = fs.readFileSync(schemaPath, 'utf8');

const replacements = [
    { search: /title: 'Player Bar Tools',\s+items:/g, replace: "title: 'Player Bar Tools',\n                icon: ICONS.uiComponents,\n                items:" },
    { search: /title: 'Global',\s+items:/g, replace: "title: 'Global',\n                icon: ICONS.explore,\n                items:" },
    { search: /title: t\('home_page'\),\s+items:/g, replace: "title: t('home_page'),\n                icon: ICONS.home,\n                items:" },
    { search: /title: t\('advanced_filters'\),\s+items:/g, replace: "title: t('advanced_filters'),\n                icon: ICONS.filter,\n                items:" },
    { search: /title: t\('player_page'\),\s+items:/g, replace: "title: t('player_page'),\n                icon: ICONS.player,\n                items:" },
    { search: /title: t\('search_page'\),\s+items:/g, replace: "title: t('search_page'),\n                icon: ICONS.search,\n                items:" },
    { search: /title: t\('filter_bar_layout'\),\s+items:/g, replace: "title: t('filter_bar_layout'),\n                icon: ICONS.filterMode,\n                items:" },
    { search: /title: t\('filter_chips_content'\),\s+items:/g, replace: "title: t('filter_chips_content'),\n                icon: ICONS.title,\n                items:" },
    { search: /title: t\('filter_chips_status'\),\s+items:/g, replace: "title: t('filter_chips_status'),\n                icon: ICONS.watched,\n                items:" },
    { search: /title: t\('layout_tools'\),\s+items:/g, replace: "title: t('layout_tools'),\n                icon: ICONS.grid,\n                items:" },
    { search: /title: t\('watch_time'\),\s+items:/g, replace: "title: t('watch_time'),\n                icon: ICONS.clock,\n                items:" },
    { search: /title: t\('tracking_resume'\),\s+items:/g, replace: "title: t('tracking_resume'),\n                icon: ICONS.resume,\n                items:" },
    { search: /title: t\('history_interface'\),\s+items:/g, replace: "title: t('history_interface'),\n                icon: ICONS.smartHistory,\n                items:" },
    { search: /title: t\('global_player_bar'\),\s+items:/g, replace: "title: t('global_player_bar'),\n                icon: ICONS.globalBar,\n                items:" },
    { search: /title: 'Remembered Streaming Sites \(Domain Memory\)',\s+icon: ICONS.globalBar,/g, replace: "title: 'Remembered Streaming Sites (Domain Memory)',\n                icon: ICONS.globalBar," },
    { search: /title: t\('watch_page_hotkeys'\),\s+items:/g, replace: "title: t('watch_page_hotkeys'),\n                icon: ICONS.keyboard,\n                items:" },
    { search: /title: t\('lang_support_title'\),\s+items:/g, replace: "title: t('lang_support_title'),\n                icon: ICONS.title,\n                items:" },
    { search: /title: t\('api_integrations'\),\s+subtitle: 'Third-party service connections',\s+items:/g, replace: "title: t('api_integrations'),\n                subtitle: 'Third-party service connections',\n                icon: ICONS.settingsSync,\n                items:" }
];

replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
});

fs.writeFileSync(schemaPath, content);
console.log('Icons injected into schema.');
