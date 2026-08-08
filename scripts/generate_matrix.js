const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join('f:/Youtube 2.0/src/content/ui-styles');
const dirs = fs.readdirSync(uiStylesDir, {withFileTypes: true}).filter(d => d.isDirectory()).map(d => d.name);

const elementsToCheck = {
    topbar: ['ytd-masthead', '#masthead-container', 'topbar'],
    navigation_button: ['yt-icon-button#guide-button', 'ypp-nav-btn', 'guide-icon'],
    search_bar: ['ytd-searchbox', '#search-input', '#search-form', 'search_box'],
    player_action_buttons: ['#actions', 'ytd-menu-renderer', 'yt-button-shape', 'like-button'],
    channel_bar: ['ytd-video-owner-renderer', '#owner-sub-count', 'channel-name'],
    description: ['ytd-text-inline-expander', '#description-inner', '#description'],
    comments: ['ytd-comments', 'ytd-comment-thread-renderer', 'ytd-comment-renderer'],
    chips: ['yt-chip-cloud-chip-renderer', 'ytd-feed-filter-chip-bar-renderer', 'chips'],
    player_bar: ['ytp-chrome-bottom', 'ytp-chrome-controls', 'player-control'],
    progress_bar: ['ytp-progress-bar', 'ytp-play-progress', 'progress-list']
};

let results = [];

dirs.forEach(dir => {
    const themeDir = path.join(uiStylesDir, dir);
    
    // We will do a simple check: if specific CSS files exist OR if the built bundle contains the selectors
    const bundlePath = path.join(themeDir, 'bundle.css');
    let bundleCSS = '';
    if (fs.existsSync(bundlePath)) {
        bundleCSS = fs.readFileSync(bundlePath, 'utf8');
    }
    
    let coverage = { theme: dir };
    
    Object.keys(elementsToCheck).forEach(element => {
        const selectors = elementsToCheck[element];
        let found = false;
        
        // Check if bundle CSS contains any of the target selectors/keywords
        if (bundleCSS) {
            found = selectors.some(selector => bundleCSS.includes(selector));
        }
        
        // Also check if they have dedicated files
        if (!found) {
            const possibleFiles = [
                path.join(themeDir, 'components', element + '.css'),
                path.join(themeDir, 'components', element.replace('_', '-') + '.css'),
                path.join(themeDir, 'components', element.split('_')[0] + '.css')
            ];
            found = possibleFiles.some(f => fs.existsSync(f));
        }
        
        coverage[element] = found ? '✅' : '❌';
    });
    
    results.push(coverage);
});

// Generate Markdown Table
let md = '| UI Design | Topbar | Nav Button | Search Bar | Action Buttons | Channel Bar | Description | Comments | Chips | Player Bar | Progress Bar |\n';
md += '|---|---|---|---|---|---|---|---|---|---|---|\n';

results.forEach(r => {
    md += `| ${r.theme} | ${r.topbar} | ${r.navigation_button} | ${r.search_bar} | ${r.player_action_buttons} | ${r.channel_bar} | ${r.description} | ${r.comments} | ${r.chips} | ${r.player_bar} | ${r.progress_bar} |\n`;
});

fs.writeFileSync(path.join('f:/Youtube 2.0', 'scripts', 'ui_coverage.md'), md);
console.log('Matrix generated at scripts/ui_coverage.md');
