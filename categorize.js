const fs = require('fs');
const path = require('path');

const stylesDir = 'src/content/ui-styles';
const folders = fs.readdirSync(stylesDir).filter(f => fs.statSync(path.join(stylesDir, f)).isDirectory() && f !== 'shared');

const uiDesigns = [];
const colorThemes = [];
const cardStyles = [];

for (const folder of folders) {
    const hasBundle = fs.existsSync(path.join(stylesDir, folder, 'bundle.css'));
    const hasThemeBundle = fs.existsSync(path.join(stylesDir, folder, 'theme', 'bundle.css'));
    const hasCardStyle = fs.existsSync(path.join(stylesDir, folder, 'card-style.css'));
    
    // Explicit overrides based on user input
    if (folder === 'ice-blue' || folder === 'holographic' || folder === 'pink' || folder === 'polaroid' || folder === 'cairo-red') {
        cardStyles.push(folder);
        continue;
    }
    if (folder === 'coffee') {
        uiDesigns.push(folder);
        // Also it has a color theme in coffee/theme/bundle.css if we built it. Let's check below.
    }
    
    let isUiDesign = false;
    let isCardStyle = false;
    let isColorTheme = false;

    if (hasThemeBundle) {
        isColorTheme = true;
    }
    
    if (hasCardStyle) {
        isCardStyle = true;
    }

    if (hasBundle) {
        // If it only has a bundle, determine by size or content
        const content = fs.readFileSync(path.join(stylesDir, folder, 'bundle.css'), 'utf8');
        const size = Buffer.byteLength(content, 'utf8');
        
        // Let's check if it primarily styles cards or entire UI
        if (size < 25000 && (folder.includes('glass') || content.includes('data-ypp-card-style'))) {
            // It's likely a card style if it explicitly targets data-ypp-card-style a lot, or is small.
            // But some might be both. Let's just say >30KB is a UI design, else card style.
            if (size > 25000) {
                isUiDesign = true;
            } else {
                isCardStyle = true; // Wait, wait. 
            }
        } else {
            isUiDesign = true;
        }
    }
    
    // Fallbacks
    if (isUiDesign && !uiDesigns.includes(folder)) uiDesigns.push(folder);
    if (isColorTheme && !colorThemes.includes(folder)) colorThemes.push(folder);
    if (isCardStyle && !cardStyles.includes(folder)) cardStyles.push(folder);
}

// Ensure Coffee is also a color theme if it has theme bundle
if (fs.existsSync(path.join(stylesDir, 'coffee', 'theme', 'bundle.css')) && !colorThemes.includes('coffee')) {
    colorThemes.push('coffee');
}
if (fs.existsSync(path.join(stylesDir, 'polaroid', 'card-style.css')) && !cardStyles.includes('polaroid')) {
    cardStyles.push('polaroid');
}

console.log(JSON.stringify({ uiDesigns, colorThemes, cardStyles }, null, 2));
