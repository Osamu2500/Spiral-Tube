const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../src/content/design-system/features/toggles.css');
const css = fs.readFileSync(cssPath, 'utf8');

const outputDir = path.resolve(__dirname, '../src/content/design-system/features/toggles');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Split by major comment blocks matching /* === ... or /* --- ...
const sections = css.split(/\/\*\s*[=-]{3,}\s*(.*?)\s*[=-]{0,}\s*\*\//g);
// sections[0] is everything before first header
// sections[1] is header name, sections[2] is content, etc.

let currentFile = 'misc.css';
const fileContents = {
    'layout.css': '/* Layout Toggles */\n\n',
    'player.css': '/* Player Toggles */\n\n',
    'components.css': '/* Component Overrides */\n\n',
    'search.css': '/* Search Toggles */\n\n',
    'misc.css': '/* Misc Toggles */\n\n'
};

if (sections[0].trim()) {
    fileContents['misc.css'] += sections[0].trim() + '\n\n';
}

for (let i = 1; i < sections.length; i += 2) {
    let header = sections[i].trim().toLowerCase();
    let content = (sections[i+1] || '').trim();
    if (!content) continue;

    // Route based on keywords
    if (header.includes('search')) {
        currentFile = 'search.css';
    } else if (header.includes('player') || header.includes('cinema') || header.includes('video')) {
        currentFile = 'player.css';
    } else if (header.includes('grid') || header.includes('layout') || header.includes('feed') || header.includes('home')) {
        currentFile = 'layout.css';
    } else if (header.includes('component') || header.includes('badge') || header.includes('button') || header.includes('logo') || header.includes('ui') || header.includes('panel')) {
        currentFile = 'components.css';
    } else {
        currentFile = 'misc.css';
    }

    fileContents[currentFile] += `/* --- ${sections[i].trim()} --- */\n${content}\n\n`;
}

for (const [file, content] of Object.entries(fileContents)) {
    fs.writeFileSync(path.join(outputDir, file), content);
    console.log(`Wrote ${file} (${content.length} bytes)`);
}
