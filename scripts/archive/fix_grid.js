const fs = require('fs');
const path = require('path');

const cardsPath = path.resolve('src/content/ui-styles/vintage/components/cards.css');
let cardsCSS = fs.readFileSync(cardsPath, 'utf8');

cardsCSS = cardsCSS.replace(/ytd-rich-grid-media,/g, 'ytd-rich-grid-media { box-sizing: border-box !important; }\nytd-rich-grid-media,');

if (!cardsCSS.includes('/* Vintage card text color */')) {
    cardsCSS += `

/* Vintage card text color */
html[data-ypp-ui-style="vintage"] ytd-rich-grid-media *,
html[data-ypp-ui-style="vintage"] ytd-compact-video-renderer *,
html[data-ypp-ui-style="vintage"] ytd-video-renderer *,
html[data-ypp-ui-style="vintage"] ytd-grid-video-renderer *,
html[data-ypp-ui-style="vintage"] ytd-playlist-video-renderer * {
    color: var(--vintage-secondary) !important;
}
html[data-ypp-ui-style="vintage"] ytd-rich-grid-media #metadata-line span,
html[data-ypp-ui-style="vintage"] ytd-compact-video-renderer #metadata-line span,
html[data-ypp-ui-style="vintage"] ytd-video-renderer #metadata-line span {
    color: var(--vintage-secondary) !important;
}
`;
}

fs.writeFileSync(cardsPath, cardsCSS);

const channelsPath = path.resolve('src/content/ui-styles/vintage/pages/channels.css');
let channelsCSS = fs.readFileSync(channelsPath, 'utf8');
channelsCSS = channelsCSS.replace(/ytd-video-renderer,/g, 'ytd-video-renderer { box-sizing: border-box !important; }\nytd-video-renderer,');
fs.writeFileSync(channelsPath, channelsCSS);
