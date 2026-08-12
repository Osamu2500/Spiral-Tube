const fs = require('fs');
const path = require('path');

const uiDesigns = [
    'anime', 'galaxy', 'gothic', 'grunge', 'hologram',
    'matrix', 'neo-brutalism', 'origami', 'retro-wave',
    'steampunk', 'vaporwave', 'woodblock', 'y2k'
];

const uiStylesDir = path.join(__dirname, '..', 'src', 'content', 'ui-styles');

for (const theme of uiDesigns) {
    const themeDir = path.join(uiStylesDir, theme);
    const componentsDir = path.join(themeDir, 'components');
    const cardsPath = path.join(componentsDir, 'cards.css');
    const navbarPath = path.join(componentsDir, 'navbar.css');
    
    // 1. Delete components/cards.css
    if (fs.existsSync(cardsPath)) {
        fs.unlinkSync(cardsPath);
        console.log(`Deleted cards.css from ${theme}`);
    }
    
    // 2. Remove the logo:before rule from navbar.css
    if (fs.existsSync(navbarPath)) {
        let navbarContent = fs.readFileSync(navbarPath, 'utf8');
        
        // Remove block matching: html[data-ypp-ui-style="theme"] ytd-topbar-logo-renderer a#logo:before { ... }
        // The regex looks for that exact selector, and grabs everything up to the closing brace.
        // It might be formatted with newlines or single-line.
        const regex = new RegExp(`html\\[data-ypp-ui-style=["']?${theme}["']?\\]\\s*ytd-topbar-logo-renderer\\s*a#logo:before\\s*\\{[^}]+\\}`, 'g');
        const before = navbarContent;
        navbarContent = navbarContent.replace(regex, '');
        
        if (before !== navbarContent) {
            fs.writeFileSync(navbarPath, navbarContent, 'utf8');
            console.log(`Removed weird youtube logo from ${theme} navbar.css`);
        }
    }
}
