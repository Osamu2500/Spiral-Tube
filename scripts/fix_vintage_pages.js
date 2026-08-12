const fs = require('fs');
const path = require('path');

const playlistsPath = path.resolve('src/content/ui-styles/vintage/pages/playlists.css');
const channelsPath = path.resolve('src/content/ui-styles/vintage/pages/channels.css');
const indexPath = path.resolve('src/content/ui-styles/vintage/index.css');

const playlistsCSS = `/* src/content/themes/ui-styles/vintage/pages/playlists.css */
/* Feed pages and Watch History headers */
html[data-ypp-ui-style="vintage"] ytd-tabbed-page-header,
html[data-ypp-ui-style="vintage"] .ytd-tabbed-page-header,
html[data-ypp-ui-style="vintage"] ytd-page-header-renderer,
html[data-ypp-ui-style="vintage"] .yt-page-header-renderer {
    background: var(--sf) !important;
    background-color: var(--sf) !important;
}

html[data-ypp-ui-style="vintage"] ytd-tabbed-page-header *,
html[data-ypp-ui-style="vintage"] .ytd-tabbed-page-header *,
html[data-ypp-ui-style="vintage"] ytd-page-header-renderer *,
html[data-ypp-ui-style="vintage"] .yt-page-header-renderer * {
    color: var(--vintage-secondary) !important;
}

/* Individual Playlist Page Sidebar */
html[data-ypp-ui-style="vintage"] ytd-playlist-header-renderer,
html[data-ypp-ui-style="vintage"] ytd-playlist-panel-renderer {
    background: var(--sf) !important;
    background-color: var(--sf) !important;
}
html[data-ypp-ui-style="vintage"] ytd-playlist-header-renderer *,
html[data-ypp-ui-style="vintage"] ytd-playlist-panel-renderer * {
    color: var(--vintage-secondary) !important;
}

/* Playlist Video Items */
html[data-ypp-ui-style="vintage"] ytd-playlist-video-renderer {
    background: var(--sf) !important;
    border: 2px dashed var(--vintage-secondary) !important;
    margin-bottom: 8px !important;
    border-radius: 4px !important;
}
html[data-ypp-ui-style="vintage"] ytd-playlist-video-renderer * {
    color: var(--vintage-secondary) !important;
}
html[data-ypp-ui-style="vintage"] ytd-playlist-video-renderer:hover {
    background: var(--vintage-secondary) !important;
}
html[data-ypp-ui-style="vintage"] ytd-playlist-video-renderer:hover * {
    color: var(--sf) !important;
}

/* Playlist Sidebar action buttons */
html[data-ypp-ui-style="vintage"] ytd-playlist-header-renderer .yt-spec-button-shape-next,
html[data-ypp-ui-style="vintage"] ytd-playlist-header-renderer button {
    background: var(--sf) !important;
    border: 2px dashed var(--vintage-secondary) !important;
    color: var(--vintage-secondary) !important;
}
html[data-ypp-ui-style="vintage"] ytd-playlist-header-renderer .yt-spec-button-shape-next:hover,
html[data-ypp-ui-style="vintage"] ytd-playlist-header-renderer button:hover {
    background: var(--vintage-secondary) !important;
    color: var(--sf) !important;
    transform: translate(-2px, -2px) !important;
    box-shadow: 4px 4px rgba(0,0,0,0.3) !important;
}

/* Watch History Right Menu */
html[data-ypp-ui-style="vintage"] #secondary.ytd-browse {
    background: var(--sf) !important;
}
html[data-ypp-ui-style="vintage"] #secondary.ytd-browse * {
    color: var(--vintage-secondary) !important;
}
html[data-ypp-ui-style="vintage"] #secondary.ytd-browse button,
html[data-ypp-ui-style="vintage"] #secondary.ytd-browse .yt-spec-button-shape-next {
    background: var(--sf) !important;
    border: 2px dashed var(--vintage-secondary) !important;
    color: var(--vintage-secondary) !important;
    fill: var(--vintage-secondary) !important;
}
html[data-ypp-ui-style="vintage"] #secondary.ytd-browse button:hover,
html[data-ypp-ui-style="vintage"] #secondary.ytd-browse .yt-spec-button-shape-next:hover {
    background: var(--vintage-secondary) !important;
    color: var(--sf) !important;
    fill: var(--sf) !important;
}
`;
fs.writeFileSync(playlistsPath, playlistsCSS);

const channelsCSSAppend = `
/* Channel Header Overrides */
html[data-ypp-ui-style="vintage"] ytd-c4-tabbed-header-renderer,
html[data-ypp-ui-style="vintage"] tp-yt-app-header,
html[data-ypp-ui-style="vintage"] #page-header.ytd-tabbed-page-header,
html[data-ypp-ui-style="vintage"] #page-header-container,
html[data-ypp-ui-style="vintage"] .ytd-c4-tabbed-header-renderer {
    background: var(--sf) !important;
    background-color: var(--sf) !important;
}

/* Channel page text colors */
html[data-ypp-ui-style="vintage"] ytd-channel-featured-content-renderer *,
html[data-ypp-ui-style="vintage"] ytd-shelf-renderer *,
html[data-ypp-ui-style="vintage"] ytd-item-section-renderer *,
html[data-ypp-ui-style="vintage"] ytd-grid-channel-renderer *,
html[data-ypp-ui-style="vintage"] .ytd-channel-name,
html[data-ypp-ui-style="vintage"] .tp-yt-paper-tab {
    color: var(--vintage-secondary) !important;
}

/* Channel Subscribe/Join buttons */
html[data-ypp-ui-style="vintage"] ytd-c4-tabbed-header-renderer .yt-spec-button-shape-next,
html[data-ypp-ui-style="vintage"] ytd-c4-tabbed-header-renderer button,
html[data-ypp-ui-style="vintage"] ytd-channel-featured-content-renderer .yt-spec-button-shape-next,
html[data-ypp-ui-style="vintage"] ytd-channel-featured-content-renderer button,
html[data-ypp-ui-style="vintage"] ytd-grid-channel-renderer .yt-spec-button-shape-next,
html[data-ypp-ui-style="vintage"] ytd-grid-channel-renderer button {
    background: var(--sf) !important;
    border: 2px dashed var(--vintage-secondary) !important;
    color: var(--vintage-secondary) !important;
    fill: var(--vintage-secondary) !important;
}

html[data-ypp-ui-style="vintage"] ytd-c4-tabbed-header-renderer .yt-spec-button-shape-next:hover,
html[data-ypp-ui-style="vintage"] ytd-c4-tabbed-header-renderer button:hover,
html[data-ypp-ui-style="vintage"] ytd-channel-featured-content-renderer .yt-spec-button-shape-next:hover,
html[data-ypp-ui-style="vintage"] ytd-channel-featured-content-renderer button:hover,
html[data-ypp-ui-style="vintage"] ytd-grid-channel-renderer .yt-spec-button-shape-next:hover,
html[data-ypp-ui-style="vintage"] ytd-grid-channel-renderer button:hover {
    background: var(--vintage-secondary) !important;
    color: var(--sf) !important;
    fill: var(--sf) !important;
}
`;
fs.appendFileSync(channelsPath, channelsCSSAppend);

let indexCSS = fs.readFileSync(indexPath, 'utf8');
if (!indexCSS.includes('@import "./pages/playlists.css";')) {
    indexCSS = indexCSS.replace('@import "./pages/search.css";', '@import "./pages/search.css";\n@import "./pages/playlists.css";');
    fs.writeFileSync(indexPath, indexCSS);
}
console.log('CSS updated successfully');
