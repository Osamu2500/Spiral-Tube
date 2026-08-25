const fs = require('fs');

const path = 'src/popup/scripts/popup-schema.js';
let content = fs.readFileSync(path, 'utf8');

// Insert Auto Like into Player tab -> Playback Automation
content = content.replace(
    /(id:\s*'videoResumer',[\s\S]*?},)/,
    `$1
          {
            type: 'toggle',
            id: 'autoLike',
            label: 'Auto Like',
            desc: 'Automatically like watched videos',
            icon: ICONS.thumbsUp,
          },`
);

// Insert Smart Thumbnails into Home tab -> Feed Layout
content = content.replace(
    /(id:\s*'autoScaleLayout',[\s\S]*?},)/,
    `$1
          {
            type: 'toggle',
            id: 'enableSmartThumbnails',
            label: 'Smart Thumbnails',
            desc: 'AI powered thumbnail un-clickbaiting',
            icon: ICONS.cleanSearch,
          },`
);

// Insert Playlist Redesign into Modes
content = content.replace(
    /(id:\s*'enableStarTubeLayout',[\s\S]*?},)/,
    `$1
          {
            type: 'toggle',
            id: 'playlistRedesign',
            label: 'Playlist Redesign',
            desc: 'Immersive playlist UI',
            icon: ICONS.cinema,
          },`
);

// Insert Premium Theme into Modes
content = content.replace(
    /(id:\s*'cinematicMode',[\s\S]*?},)/,
    `$1
          {
            type: 'toggle',
            id: 'premiumTheme',
            label: 'Premium Theme',
            desc: 'Custom colors and styling',
            icon: ICONS.cinema,
          },`
);

// Insert Save Supreme UI into Player UI
content = content.replace(
    /(id:\s*'enableSmoothTitleScroll',[\s\S]*?},)/,
    `$1
          {
            type: 'toggle',
            id: 'saveSupremeUI',
            label: 'Save Supreme UI',
            desc: 'Better styling for save buttons',
            icon: ICONS.saveSupreme,
          },`
);

// Remove speedBooster
content = content.replace(
    /\s*\{\s*type:\s*'toggle',\s*id:\s*'speedBooster'[\s\S]*?\},/,
    ''
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched popup-schema.js with missing toggles and removed speedBooster');
