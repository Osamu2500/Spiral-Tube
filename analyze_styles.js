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
    
    if (hasBundle) uiDesigns.push(folder);
    if (hasThemeBundle) colorThemes.push(folder);
    if (hasCardStyle) cardStyles.push(folder);
}

console.log('UI DESIGNS:', JSON.stringify(uiDesigns));
console.log('COLOR THEMES:', JSON.stringify(colorThemes));
console.log('CARD STYLES:', JSON.stringify(cardStyles));
