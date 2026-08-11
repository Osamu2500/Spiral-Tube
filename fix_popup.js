const fs = require('fs');
const path = require('path');

const categorizeLogic = () => {
    const stylesDir = 'src/content/ui-styles';
    const folders = fs.readdirSync(stylesDir).filter(f => fs.statSync(path.join(stylesDir, f)).isDirectory() && f !== 'shared');

    const uiDesigns = [];
    const colorThemes = [];
    const cardStyles = [];

    for (const folder of folders) {
        const hasBundle = fs.existsSync(path.join(stylesDir, folder, 'bundle.css'));
        const hasThemeBundle = fs.existsSync(path.join(stylesDir, folder, 'theme', 'bundle.css'));
        const hasCardStyle = fs.existsSync(path.join(stylesDir, folder, 'card-style.css'));
        
        if (folder === 'ice-blue' || folder === 'holographic' || folder === 'pink' || folder === 'polaroid' || folder === 'cairo-red' || folder === 'immersive-glass') {
            cardStyles.push(folder);
            continue;
        }
        if (folder === 'coffee') {
            uiDesigns.push(folder);
        }
        
        let isUiDesign = false;
        let isCardStyle = false;
        let isColorTheme = false;

        if (hasThemeBundle) isColorTheme = true;
        if (hasCardStyle) isCardStyle = true;

        if (hasBundle) {
            const content = fs.readFileSync(path.join(stylesDir, folder, 'bundle.css'), 'utf8');
            const size = Buffer.byteLength(content, 'utf8');
            if (size < 25000 && (folder.includes('glass') || content.includes('data-ypp-card-style'))) {
                if (size > 25000) {
                    isUiDesign = true;
                } else {
                    isCardStyle = true;
                }
            } else {
                isUiDesign = true;
            }
        }
        
        if (isUiDesign && !uiDesigns.includes(folder)) uiDesigns.push(folder);
        if (isColorTheme && !colorThemes.includes(folder)) colorThemes.push(folder);
        if (isCardStyle && !cardStyles.includes(folder)) cardStyles.push(folder);
    }
    
    if (fs.existsSync(path.join(stylesDir, 'coffee', 'theme', 'bundle.css')) && !colorThemes.includes('coffee')) {
        colorThemes.push('coffee');
    }
    if (fs.existsSync(path.join(stylesDir, 'polaroid', 'card-style.css')) && !cardStyles.includes('polaroid')) {
        cardStyles.push('polaroid');
    }

    return { uiDesigns: uiDesigns.sort(), colorThemes: colorThemes.sort(), cardStyles: cardStyles.sort() };
};

function capitalize(s) {
    return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function updatePopupHtml(uiDesigns, cardStyles) {
    const popupPath = path.join(__dirname, 'src/popup/popup.html');
    let content = fs.readFileSync(popupPath, 'utf8');

    // Replace UI Designs
    const uiDesignRegex = /(<div class="ypp-inline-66 theme-grid">)[\s\S]*?(<\/div>)/;
    const uiButtons = uiDesigns.map(name => `                <button type="button" class="theme-btn youtube-style-btn" data-style="${name}">${capitalize(name)}</button>`).join('\n');
    content = content.replace(uiDesignRegex, `$1\n${uiButtons}\n              $2`);

    // Replace Card Styles
    const cardStyleRegex = /(<div class="ypp-inline-131 theme-grid">)[\s\S]*?(<\/div>)/;
    const cardButtons = cardStyles.map(name => `                <button type="button" class="theme-btn card-style-btn" data-style="${name}">${capitalize(name)}</button>`).join('\n');
    content = content.replace(cardStyleRegex, `$1\n${cardButtons}\n              $2`);

    fs.writeFileSync(popupPath, content);
}

function updatePopupComponents(colorThemes) {
    const jsPath = path.join(__dirname, 'src/popup/popup-components.js');
    let content = fs.readFileSync(jsPath, 'utf8');

    // We need to remove things from UserStyles and New Additions that are NOT in colorThemes!
    // We can do this with some regex, but it might be easier to just remove them manually.
    // The problem items are: crystal-glass, ice-blue, cairo-red, pink, retrowave-green, fluent.
    // Actually, I can just replace the whole UserStyles block.
    
    content = content.replace(/{ key: 'crystal-glass'[^}]+},\s*/g, '');
    content = content.replace(/{ key: 'ice-blue'[^}]+},\s*/g, '');
    content = content.replace(/{ key: 'cairo-red'[^}]+},\s*/g, '');
    content = content.replace(/{ key: 'pink'[^}]+},\s*/g, '');
    content = content.replace(/{ key: 'retrowave-green'[^}]+},\s*/g, '');
    content = content.replace(/{ key: 'fluent'[^}]+},\s*/g, '');
    
    // Also remove from New Additions if not colorThemes
    const newAdditions = ['autumn', 'bento', 'christmas', 'liquid-glass', 'nature', 'neumorphic', 'startube'];
    for (const name of newAdditions) {
        if (!colorThemes.includes(name)) {
            const reg = new RegExp(`{ key: '${name}'[^}]+},\\s*`, 'g');
            content = content.replace(reg, '');
        }
    }

    fs.writeFileSync(jsPath, content);
}

const { uiDesigns, colorThemes, cardStyles } = categorizeLogic();
updatePopupHtml(uiDesigns, cardStyles);
updatePopupComponents(colorThemes);
console.log('Fixed popup.html and popup-components.js');
