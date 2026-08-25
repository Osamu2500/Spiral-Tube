const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../src/content/design-system/features/toggles.css');
const css = fs.readFileSync(cssPath, 'utf8');

const outputDir = path.resolve(__dirname, '../src/content/design-system/features');

const extractFeature = (pattern, filename, headerName) => {
    // Look for any selector that contains the pattern, then { ... }
    const regex = new RegExp(`[^}]*${pattern}[^{]*\\{[^}]*\\}`, 'g');
    const matches = css.match(regex);
    
    if (matches && matches.length > 0) {
        let content = `/* \n * ==========================================================================\n * ${headerName.toUpperCase()}\n * ========================================================================== \n */\n\n`;
        // Trim each match and join
        content += matches.map(m => m.trim()).join('\n\n');
        fs.writeFileSync(path.join(outputDir, filename), content);
        console.log(`Extracted ${filename} (${matches.length} blocks)`);
        return true;
    }
    return false;
};

// Features to extract
const features = [
    { pattern: 'ypp-premium-logo', filename: 'premium-logo.css', header: 'Premium Logo' },
    { pattern: 'ypp-retro-logo', filename: 'retro-logo.css', header: 'Retro Logo' },
    { pattern: 'ypp-save-supreme-ui', filename: 'save-supreme-ui.css', header: 'Save Supreme UI' },
    { pattern: 'ypp-small-settings-menu', filename: 'compact-settings-menu.css', header: 'Compact Settings Menu' },
    { pattern: 'ypp-netflix-subtitles', filename: 'netflix-subtitles.css', header: 'Netflix Subtitles' },
    { pattern: 'ypp-flex-width-player', filename: 'flex-width-player.css', header: 'Flex Width Player' },
    { pattern: 'ypp-compact-player-ui', filename: 'compact-player.css', header: 'Compact Player UI' },
    { pattern: 'ypp-real-cinema-mode', filename: 'real-cinema-mode.css', header: 'Real Cinema Mode' },
    { pattern: 'ypp-live-stream-time', filename: 'live-stream-time.css', header: 'Live Stream Time' },
    { pattern: 'ypp-two-column-subs', filename: 'two-column-subs.css', header: 'Two Column Subs' },
    { pattern: 'ypp-ui-square-corners', filename: 'square-corners.css', header: 'Square Corners' },
    { pattern: 'ypp-ui-extra-rounded', filename: 'extra-rounded-ui.css', header: 'Extra Rounded UI' },
    { pattern: 'ypp-grayscale-thumbnails', filename: 'grayscale-thumbnails.css', header: 'Grayscale Thumbnails' }
];

for (const feature of features) {
    extractFeature(feature.pattern, feature.filename, feature.header);
}

// Special case for resume badges
const resumeRegex = /[^}]*\.yt-pro-pbar[^{]*\{[^}]*\}/g;
const resumeMatches = css.match(resumeRegex);
if (resumeMatches) {
    let content = `/* \n * ==========================================================================\n * RESUME BADGES\n * ========================================================================== \n */\n\n`;
    content += resumeMatches.map(m => m.trim()).join('\n\n');
    fs.writeFileSync(path.join(outputDir, 'resume-badges.css'), content);
    console.log(`Extracted resume-badges.css (${resumeMatches.length} blocks)`);
}

// Special case for scrollbars (since they are pseudo elements)
const scrollbarRegex = /[^}]*body\.ypp-custom-scrollbar[^{]*\{[^}]*\}/g;
const scrollbarMatches = css.match(scrollbarRegex);
if (scrollbarMatches) {
    let content = `/* \n * ==========================================================================\n * CUSTOM SCROLLBAR\n * ========================================================================== \n */\n\n`;
    content += scrollbarMatches.map(m => m.trim()).join('\n\n');
    fs.writeFileSync(path.join(outputDir, 'custom-scrollbar.css'), content);
    console.log(`Extracted custom-scrollbar.css (${scrollbarMatches.length} blocks)`);
}
