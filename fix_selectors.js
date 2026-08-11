const fs = require('fs');
const path = require('path');

const stylesDir = 'src/content/ui-styles';
const folders = fs.readdirSync(stylesDir).filter(f => fs.statSync(path.join(stylesDir, f)).isDirectory() && f !== 'shared');

let changedCount = 0;

function processFile(filePath) {
    if (!filePath.endsWith('.css')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to match: html[data-ypp-theme="name"] {
    // and replace it with:
    // html[data-ypp-theme="name"], html[data-ypp-theme="name"] body, html[data-ypp-theme="name"] [dark] {
    
    const regex = /html\[(data-ypp-(?:theme|card-style|ui-style)="[^"]+")\]\s*\{/g;
    
    let newContent = content.replace(regex, (match, attr) => {
        return `html[${attr}],\nhtml[${attr}] body,\nhtml[${attr}] [dark] {`;
    });
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        changedCount++;
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

for (const folder of folders) {
    walkDir(path.join(stylesDir, folder));
}

console.log(`Updated ${changedCount} CSS files with heavy override selectors.`);
