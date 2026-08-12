const fs = require('fs');
const path = require('path');

const navbarPath = path.resolve('src/content/ui-styles/vintage/components/navbar.css');
let navbarCSS = fs.readFileSync(navbarPath, 'utf8');

const newStyles = `
/* Vintage Topbar Buttons (Voice Search, 3 Dots, Notifications) */
html[data-ypp-ui-style="vintage"] #voice-search-button.ytd-masthead,
html[data-ypp-ui-style="vintage"] ytd-topbar-menu-button-renderer.ytd-masthead,
html[data-ypp-ui-style="vintage"] ytd-notification-topbar-button-renderer.ytd-masthead yt-icon-button#icon {
    background: var(--sf) !important;
    border: 2px dashed var(--vintage-secondary) !important;
    border-radius: 0 !important;
    box-shadow: 2px 2px #0000001a !important;
}

html[data-ypp-ui-style="vintage"] #voice-search-button.ytd-masthead:hover,
html[data-ypp-ui-style="vintage"] ytd-topbar-menu-button-renderer.ytd-masthead:hover,
html[data-ypp-ui-style="vintage"] ytd-notification-topbar-button-renderer.ytd-masthead yt-icon-button#icon:hover {
    background: var(--vintage-secondary) !important;
    color: var(--sf) !important;
    box-shadow: 4px 4px rgba(0,0,0,0.3) !important;
}

html[data-ypp-ui-style="vintage"] #voice-search-button.ytd-masthead yt-icon,
html[data-ypp-ui-style="vintage"] ytd-topbar-menu-button-renderer.ytd-masthead yt-icon,
html[data-ypp-ui-style="vintage"] ytd-notification-topbar-button-renderer.ytd-masthead yt-icon,
html[data-ypp-ui-style="vintage"] #voice-search-button.ytd-masthead svg,
html[data-ypp-ui-style="vintage"] ytd-topbar-menu-button-renderer.ytd-masthead svg,
html[data-ypp-ui-style="vintage"] ytd-notification-topbar-button-renderer.ytd-masthead svg {
    color: var(--vintage-secondary) !important;
    fill: var(--vintage-secondary) !important;
}

html[data-ypp-ui-style="vintage"] #voice-search-button.ytd-masthead:hover yt-icon,
html[data-ypp-ui-style="vintage"] ytd-topbar-menu-button-renderer.ytd-masthead:hover yt-icon,
html[data-ypp-ui-style="vintage"] ytd-notification-topbar-button-renderer.ytd-masthead:hover yt-icon,
html[data-ypp-ui-style="vintage"] #voice-search-button.ytd-masthead:hover svg,
html[data-ypp-ui-style="vintage"] ytd-topbar-menu-button-renderer.ytd-masthead:hover svg,
html[data-ypp-ui-style="vintage"] ytd-notification-topbar-button-renderer.ytd-masthead:hover svg {
    color: var(--sf) !important;
    fill: var(--sf) !important;
}

/* Fix popup menus specific backgrounds and borders to be dashed as well for consistency */
html[data-ypp-ui-style="vintage"] ytd-menu-popup-renderer,
html[data-ypp-ui-style="vintage"] tp-yt-paper-listbox,
html[data-ypp-ui-style="vintage"] tp-yt-paper-dialog {
    border: 2px dashed var(--vintage-secondary) !important;
    border-radius: 0 !important;
}
`;

if (!navbarCSS.includes('Vintage Topbar Buttons (Voice Search')) {
    fs.appendFileSync(navbarPath, newStyles);
}

const buttonsPath = path.resolve('src/content/ui-styles/vintage/components/buttons.css');
let buttonsCSS = fs.readFileSync(buttonsPath, 'utf8');
const buttonFixes = \`
/* Additional fix for player page 3 dots menu button */
html[data-ypp-ui-style="vintage"] #menu.ytd-watch-metadata yt-button-shape button {
    background: var(--sf) !important;
    border: 2px dashed var(--vintage-secondary) !important;
    color: var(--vintage-secondary) !important;
    border-radius: 0 !important;
    box-shadow: 2px 2px #0000001a !important;
    margin-right: 8px !important;
}
html[data-ypp-ui-style="vintage"] #menu.ytd-watch-metadata yt-button-shape button:hover {
    background: var(--vintage-secondary) !important;
    color: var(--sf) !important;
}
html[data-ypp-ui-style="vintage"] #menu.ytd-watch-metadata yt-button-shape button svg {
    fill: var(--vintage-secondary) !important;
}
html[data-ypp-ui-style="vintage"] #menu.ytd-watch-metadata yt-button-shape button:hover svg {
    fill: var(--sf) !important;
}
\`;

if (!buttonsCSS.includes('Additional fix for player page 3 dots menu button')) {
    fs.appendFileSync(buttonsPath, buttonFixes);
}
