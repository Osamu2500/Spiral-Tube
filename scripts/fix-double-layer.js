const fs = require('fs');
const path = require('path');

// The 13 new UI design themes that have massive_ui.css using both selectors
// causing double-layering. We need to strip out the data-ypp-ui-style selectors
// from their massive_ui.css so card styles don't apply when in UI style mode.
// These themes DO NOT have a matching card style so the massive_ui.css should only
// apply when the card style is explicitly set to that name.
const newUiDesigns = [
    'anime', 'galaxy', 'gothic', 'grunge', 'hologram',
    'matrix', 'neo-brutalism', 'origami', 'retro-wave',
    'steampunk', 'vaporwave', 'woodblock', 'y2k'
];

const uiStylesDir = path.join(__dirname, '..', 'src', 'content', 'ui-styles');

// Fix double-layering: strip data-ypp-ui-style from massive_ui.css files
for (const theme of newUiDesigns) {
    const massivePath = path.join(uiStylesDir, theme, 'components', 'massive_ui.css');
    if (!fs.existsSync(massivePath)) {
        console.log(`Skipping ${theme} - no massive_ui.css`);
        continue;
    }
    
    let content = fs.readFileSync(massivePath, 'utf8');
    
    // Check if it's a minified single-line file with escaped newlines
    // The pattern to remove: ", html[data-ypp-ui-style=\"theme\"]" from selector groups
    // and standalone "html[data-ypp-ui-style=\"theme\"]" selectors
    
    const uiStylePattern1 = new RegExp(`,\\s*html\\[data-ypp-ui-style="${theme.replace(/-/g, '\\\\-')}"\\]`, 'g');
    const uiStylePattern2 = new RegExp(`html\\[data-ypp-ui-style="${theme.replace(/-/g, '\\\\-')}"\\]\\s*`, 'g');
    
    // Try both escaped and unescaped dash versions
    const themeSafe = theme.replace(/-/g, '-');
    
    // For minified files (single line with \n literals)
    const minifiedPattern1 = new RegExp(`,\\\\n?\\s*html\\[data-ypp-ui-style="${themeSafe}"\\]`, 'g');
    const minifiedPattern2 = new RegExp(`, html\\[data-ypp-ui-style="${themeSafe}"\\]`, 'g');
    const minifiedPattern3 = new RegExp(`html\\[data-ypp-ui-style="${themeSafe}"\\]`, 'g');
    
    const before = content;
    content = content
        .replace(minifiedPattern2, '')
        .replace(minifiedPattern1, '')
        .replace(minifiedPattern3, '');
    
    if (content !== before) {
        fs.writeFileSync(massivePath, content, 'utf8');
        console.log(`Fixed double-layering in ${theme}/massive_ui.css`);
    } else {
        console.log(`No ui-style selectors found in ${theme}/massive_ui.css (may already be clean)`);
    }
}

console.log('\nDouble-layering fix complete!\n');
