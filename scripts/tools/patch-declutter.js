const fs = require('fs');

const path = 'src/popup/scripts/popup-schema.js';
let content = fs.readFileSync(path, 'utf8');

// Insert Header Nav and Clickbait filter into Declutter -> Home Page
content = content.replace(
    /(id:\s*'hideMemberships',[\s\S]*?},)/,
    `$1
          {
            type: 'toggle',
            id: 'headerNavEnabled',
            label: 'Header Navigation',
            desc: 'Pin and customize top nav bar',
            icon: ICONS.sidebar,
          },
          {
            type: 'toggle',
            id: 'hideClickbaitEnabled',
            label: 'Hide Clickbait',
            desc: 'Hide overly sensational titles/thumbnails',
            icon: ICONS.hide,
          },
          {
            type: 'toggle',
            id: 'feedFilter',
            label: 'Keyword Feed Filter',
            desc: 'Hide videos matching blocked keywords',
            icon: ICONS.cleanSearch,
          },`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched declutter section');
