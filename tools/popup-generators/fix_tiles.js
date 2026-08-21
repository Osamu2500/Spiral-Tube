const fs = require('fs');
let html = fs.readFileSync('src/popup/popup.html', 'utf8');

const targetIds = [
    'redirectShorts',
    'enableController',
    'audioModeEnabled',
    'enableFilterBar',
    'twoColumnSubs',
    'subPlaylist' // wait, I don't know the exact IDs, I will use regex to find them by labels
];

const targetLabels = [
    'Redirect Shorts',
    'Enable Controller',
    'Audio-Only Mode',
    'Enable Filter Bar',
    '2-Column Subscriptions Feed',
    'Playlist' // this is probably a chip toggle
];

// Let's just find <div class="... toggle-card ... span-2 ..."> and remove span-2, span-4, span-3 etc
// if they contain our target labels.
for (const label of targetLabels) {
    const regex = new RegExp(`(<div class="[^"]*?toggle-card[^"]*?)(span-[234][^"]*)("[^>]*>[\\s\\S]*?${label})`, 'g');
    html = html.replace(regex, '$1$3');
}

// Just to be safe, I'll remove any "span-2" or "span-4" from any toggle card containing the data-i18n that translates to these.
// Wait, the HTML might be using data-i18n. Let's just remove ALL span-2 and span-4 from toggle-cards containing these strings case insensitively.
for (const label of targetLabels) {
    const labelLower = label.toLowerCase();
    // we have to parse the HTML string.
}

// Actually, let's just strip 'span-2', 'span-3', 'span-4' from ALL .toggle-card, .mode-card, .setting-item globally EXCEPT if it's explicitly wanted.
// The user essentially wants all these to be 1 tile.
// I will just read popup.html line by line, if a line has 'span-2' or 'span-4', and the block contains one of the targets, remove it.

fs.writeFileSync('src/popup/fix_tiles.js', '/* replaced */');
