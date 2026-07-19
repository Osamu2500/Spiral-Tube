const fs = require('fs');
const path = require('path');

const schemaPath = path.resolve(__dirname, '../src/popup/popup-schema.js');
let content = fs.readFileSync(schemaPath, 'utf8');

const icons = {
    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z": "ICONS.home",
    "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z": "ICONS.grid",
    "M4 6h16M4 12h16M4 18h16": "ICONS.title",
    "M3 3h18v18H3z": "ICONS.squareCorners",
    "M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z": "ICONS.roundedUI",
    "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z": "ICONS.saveSupreme",
    "M15 3l6 6M15 3h6v6M9 21l-6-6M9 21H3v-6": "ICONS.autoScale",
    "M9 12l2 2 4-4 M3 3h18v18H3z": "ICONS.multiSelect",
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z": "ICONS.cleanMixUrls",
    "M12 20V10M18 20V4M6 20v-4": "ICONS.shorts",
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z": "ICONS.eyeSlash",
    "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z": "ICONS.loopOff",
    "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6": "ICONS.clock",
    "M5 3l14 9-14 9V3z": "ICONS.player",
    "M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83": "ICONS.magicWand",
    "M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z": "ICONS.subtitles",
    "M2 3h20v14H2zM8 21h8M12 17v4": "ICONS.autoCinema",
    "M12 20V4M20 12H4": "ICONS.resume",
    "M6 4h4v16H6zM14 4h4v16h-4z": "ICONS.pause",
    "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z": "ICONS.like",
    "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z": "ICONS.download",
    "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10 8l6 4-6 4V8z": "ICONS.settingsSync",
    "M11 5L6 9H2v6h4l5 4V5z": "ICONS.volumeBoost",
    "M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07": "ICONS.volumeUp",
    "M22 12h-4l-3 9L9 3l-3 9H2": "ICONS.compressor",
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2": "ICONS.wheel",
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z": "ICONS.uiComponents",
    "M19 8l-4 4h3c0 3.31-2.69 6-6 6": "ICONS.reduceAnimations",
    "M12 2L2 22h20L12 2z": "ICONS.pinVideo",
    "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z": "ICONS.floatingPlayer",
    "M3 3h18v18H3zM3 9h18": "ICONS.progressBar",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z": "ICONS.controlsUI",
    "M22 3H2l8 9.46V19l4 2v-8.54L22 3z": "ICONS.cinemaFilters",
    "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z": "ICONS.loopButton",
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z": "ICONS.snapshot",
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2": "ICONS.wheel",
    "M3 3h18v18H3z M14 8h6M14 12h6M14 16h6": "ICONS.sidebar",
    "M12 5l0 14M19 12l-7 7-7-7": "ICONS.splitScroll",
    "M3 3h18v18H3z M8 12l8-5v10z": "ICONS.placement",
    "M4 6v12l8.5-6L4 6zm9 0v12l8.5-6L13 6z": "ICONS.speed",
    "M13 10V3L4 14h7v7l9-11h-7z": "ICONS.speedBooster",
    "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM12 11.25V9c0-1.1-.9-2-2-2H8v8h2v-2.5h2v2.5h2V11.25zM10 9v1.25H8V9h2zm4 0v8h2V9h-2z": "ICONS.forceSpeed",
    "M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z": "ICONS.audioTag",
    "M19 8l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 0 1-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z": "ICONS.remember",
    "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.28 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z": "ICONS.hide",
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z": "ICONS.keyboard",
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M3.6 9h16.8 M3.6 15h16.8": "ICONS.cinematic",
    "M12 8v4l3 3 M8 12a4 4 0 0 1 4-4 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z": "ICONS.zen",
    "M17 2l5 5M7 2L2 7 M2 7h20v15H2z": "ICONS.cinema",
    "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41": "ICONS.ambient",
    "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z": "ICONS.study",
    "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7": "ICONS.focus",
    "M9 3v18M3 9h6 M3 3h18v18H3z": "ICONS.minimal",
    "M9 18V5l12-2v13 M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z": "ICONS.audioOnly",
    "M21 21l-4.35-4.35M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z": "ICONS.search",
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z": "ICONS.cleanSearch",
    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z": "ICONS.filter",
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z": "ICONS.memberships",
    "M13 2L3 14h9l-1 8 10-12h-9l1-8z": "ICONS.explore",
    "M 1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M3 3l18 18": "ICONS.metrics",
    "M3 3h18v18H3z M8.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21": "ICONS.thumbnails",
    "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z": "ICONS.watched",
    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71": "ICONS.mixes",
    "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01": "ICONS.playlists",
    "M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1v-6h3v4z M3 19a2 2 0 0 0 2 2h1v-6H3v4z": "ICONS.podcasts",
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z": "ICONS.promos",
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z": "ICONS.filterMode",
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z": "ICONS.whitelist",
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z": "ICONS.blacklist",
    "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z": "ICONS.calendar",
    "M4 6h16M4 12h10": "ICONS.titleHidden",
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z": "ICONS.channelBar",
    "M4 6h16M4 10h16M4 14h10": "ICONS.descHidden",
    "M3 3h18v18H3zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0": "ICONS.cards",
    "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0": "ICONS.merch",
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z": "ICONS.fundraiser",
    "M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z": "ICONS.shelves",
    "M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V22h2v-4.08A7 7 0 0 0 19 11h-2z": "ICONS.voiceSearch",
    "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z": "ICONS.uploadBtn",
    "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z": "ICONS.subs",
    "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z": "ICONS.searchBar",
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z": "ICONS.smartHistory",
    "M5 12h14 M12 5l7 7-7 7": "ICONS.continueWatch",
    "M15 14l5-5-5-5 M4 20v-7a4 4 0 0 1 4-4h12": "ICONS.reversePlay",
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z": "ICONS.advancedTab",
    "M3 3h18v14H3zM3 15h18": "ICONS.globalBar"
};

// Also inject the import at the top
if (!content.includes('import { ICONS } from')) {
    content = "// @ts-check\nimport { ICONS } from './popup-icons.js';\n" + content;
}

// Replace P('...') and P("...") with ICONS.key or leave alone if not found
content = content.replace(/P\((['"])(.*?)\1\)/g, (match, quote, pathData) => {
    if (icons[pathData]) {
        return icons[pathData];
    }
    return match; // If not in our dictionary, leave it
});

// Also replace icon: '...' with icon: ICONS.key
content = content.replace(/icon:\s*(['"])(.*?)\1/g, (match, quote, pathData) => {
    if (icons[pathData]) {
        return `icon: ${icons[pathData]}`;
    }
    return match;
});

fs.writeFileSync(schemaPath, content, 'utf8');
console.log('Replaced SVGs successfully');
