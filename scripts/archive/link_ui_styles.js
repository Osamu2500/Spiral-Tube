const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');
const styles = fs.readdirSync(uiStylesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let originalContent = content;

            let lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];

                // Backgrounds (don't match background-image)
                line = line.replace(/(background(?:-color)?)\s*:\s*(#[a-fA-F0-9]{3,8}|rgba?\([^)]+\))\s*!important/gi, '$1: var(--ypp-bg-surface, $2) !important');
                
                // Text Colors (use negative lookbehind to avoid matching border-color, background-color)
                line = line.replace(/(?<!-)(color)\s*:\s*(#[a-fA-F0-9]{3,8}|rgba?\([^)]+\))\s*!important/gi, '$1: var(--ypp-text-primary, $2) !important');
                
                // Borders
                line = line.replace(/(border(?:-[a-z]+)?)\s*:\s*([^;!]*?)(#[a-fA-F0-9]{3,8}|rgba?\([^)]+\))\s*!important/gi, '$1: $2 var(--ypp-surface-border, $3) !important');
                
                // Border Radius
                line = line.replace(/border-radius\s*:\s*([^;!]+?)\s*!important/gi, 'border-radius: var(--ypp-shape-primary, $1) !important');
                
                // Font Family
                line = line.replace(/font-family\s*:\s*(?!var\()([^;!]+?)\s*(?:!important)?\s*;/gi, 'font-family: var(--ypp-font-primary, $1) !important;');

                lines[i] = line;
            }
            content = lines.join('\n');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
            }
        }
    });
}

styles.forEach(styleName => {
    const dirPath = path.join(uiStylesDir, styleName);
    processDirectory(dirPath);
});

console.log(`Successfully linked all UI styles line-by-line!`);
