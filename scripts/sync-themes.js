const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');
const popupHtmlPath = path.join(__dirname, '../src/popup/popup.html');

const dirs = fs.readdirSync(uiStylesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'shared' && dirent.name !== 'search-card-compat')
    .map(dirent => dirent.name);

// Function to format display name
function formatName(str) {
    if (str === 'default') return 'Default';
    if (str === 'frutiger-aero') return 'Frutiger Aero';
    if (str === 'retrowave-green') return 'Retrowave Green';
    if (str === 'harry-potter') return 'Harry Potter';
    if (str === 'ice-blue') return 'Ice Blue';
    if (str === 'blue-sky') return 'Blue Sky';
    if (str === 'cairo-red') return 'Cairo Red';
    if (str === 'crystal-glass') return 'Crystal Glass';
    if (str === 'liquid-glass') return 'Liquid Glass';
    if (str === 'immersive-glass') return 'Immersive Glass';
    if (str === 'player-retouch') return 'Player Retouch';
    if (str === 'minimal-flat') return 'Minimal Flat';
    if (str === 'startube') return 'StarTube';
    if (str === 'bloodmoon') return 'Blood Moon';
    if (str === 'deepspace') return 'Deep Space';
    return str
        .replace(/[_-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Categorize all themes cleanly
const uiPageThemes = ['default'];
const popupUiThemes = ['default'];
const cardStyles = [];
const colorThemes = [];

dirs.forEach(dir => {
    const dirPath = path.join(uiStylesDir, dir);
    const hasIndexCss = fs.existsSync(path.join(dirPath, 'index.css'));
    const hasCardStyleCss = fs.existsSync(path.join(dirPath, 'card-style.css'));
    const hasCardsComponent = fs.existsSync(path.join(dirPath, 'components', 'cards.css'));
    const hasThemeDirOnly = fs.existsSync(path.join(dirPath, 'theme')) && !hasIndexCss && !hasCardStyleCss;
    const isModular = fs.existsSync(path.join(dirPath, 'components')) && fs.existsSync(path.join(dirPath, 'pages'));

    // 1) Color-only themes
    if (hasThemeDirOnly) {
        colorThemes.push(dir);
        return;
    }

    // 2) Card-only styles (no index.css)
    if (!hasIndexCss && hasCardStyleCss) {
        cardStyles.push(dir);
        return;
    }

    // 3) UI Page Themes
    if (hasIndexCss) {
        uiPageThemes.push(dir);
        if (isModular) {
            popupUiThemes.push(dir);
        }
        if (hasCardStyleCss) {
            cardStyles.push(dir);
        }
    }
});

function sortWithDefaultFirst(arr) {
    const withoutDefault = arr.filter(x => x !== 'default').sort((a, b) => a.localeCompare(b));
    return ['default', ...withoutDefault];
}

const sortedUiPageThemes = sortWithDefaultFirst(uiPageThemes);
const sortedPopupUiThemes = sortWithDefaultFirst(popupUiThemes);
const sortedCardStyles = cardStyles.sort((a, b) => a.localeCompare(b));

console.log(`UI Page Themes (${sortedUiPageThemes.length}):`, sortedUiPageThemes.join(', '));
console.log(`Popup UI Themes (${sortedPopupUiThemes.length}):`, sortedPopupUiThemes.join(', '));
console.log(`Card Styles (${sortedCardStyles.length}):`, sortedCardStyles.join(', '));

// Update popup.html
let html = fs.readFileSync(popupHtmlPath, 'utf8');

const sections = [
    { id: 'youtubePageTheme', btnClass: 'youtube-style-btn', list: sortedUiPageThemes },
    { id: 'popupUiTheme', btnClass: 'popup-style-btn', list: sortedPopupUiThemes },
    { id: 'cardStyle', btnClass: 'card-style-btn', list: sortedCardStyles }
];

sections.forEach(sec => {
    const regex = new RegExp(`(<input type="hidden" id="${sec.id}"[^>]*>\\s*<div class="[^"]*theme-grid">)([\\s\\S]*?)(</div>\\s*</div>)`, 'i');
    html = html.replace(regex, (match, prefix, content, suffix) => {
        const buttons = sec.list.map(dir => {
            const i18nAttr = (dir === 'default') ? ' data-i18n="default"' : '';
            return `                <button type="button" class="theme-btn ${sec.btnClass}" data-style="${dir}"${i18nAttr}>${formatName(dir)}</button>`;
        }).join('\n');
        return prefix + '\n' + buttons + '\n              ' + suffix;
    });
});

fs.writeFileSync(popupHtmlPath, html, 'utf8');
console.log('Successfully synced popup.html!');
