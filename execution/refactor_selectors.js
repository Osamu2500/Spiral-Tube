const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src/content');
let matchCount = {};

// We will also do the replacements
// 1. Selector replacements
const SELECTOR_MAP = {
    '.html5-main-video': 'window.YPP.CONSTANTS.SELECTORS.VIDEO[0]',
    'video.html5-main-video': 'window.YPP.CONSTANTS.SELECTORS.VIDEO[0]',
    '.ytp-chrome-bottom': 'window.YPP.CONSTANTS.SELECTORS.PLAYER_BAR', // need to ensure this is in CONSTANTS
    '.ytp-right-controls': 'window.YPP.CONSTANTS.SELECTORS.VIDEO_CONTROLS[0]',
    '#secondary': 'window.YPP.CONSTANTS.SELECTORS.SIDEBAR[0]',
    '#secondary-inner': 'window.YPP.CONSTANTS.SELECTORS.SIDEBAR[1]',
    '#comments': 'window.YPP.CONSTANTS.SELECTORS.COMMENTS_SECTION[1]',
    'ytd-comments': 'window.YPP.CONSTANTS.SELECTORS.COMMENTS_SECTION[0]',
    '#title h1': 'window.YPP.CONSTANTS.SELECTORS.METADATA_SELECTORS.TITLE[1]',
    'h1.ytd-watch-metadata': 'window.YPP.CONSTANTS.SELECTORS.METADATA_SELECTORS.TITLE[0]'
};

let filesChanged = 0;

for(const file of files) {
    if (file.includes('config\\constants.js')) continue;

    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Phase 1: Selectors
    for (const [magic, replacement] of Object.entries(SELECTOR_MAP)) {
        // e.g. document.querySelector('.html5-main-video') -> document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0])
        const regex1 = new RegExp(`querySelector\\(['"\`]${magic}['"\`]\\)`, 'g');
        const regex2 = new RegExp(`querySelectorAll\\(['"\`]${magic}['"\`]\\)`, 'g');
        content = content.replace(regex1, `querySelector(${replacement})`);
        content = content.replace(regex2, `querySelectorAll(${replacement})`);
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        filesChanged++;
    }
}

console.log(`Replaced selectors in ${filesChanged} files.`);
