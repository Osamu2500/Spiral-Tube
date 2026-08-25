const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../src/content/design-system/features/declutter.css');
const css = fs.readFileSync(cssPath, 'utf8');

const outputDir = path.resolve(__dirname, '../src/content/design-system/features/declutter');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Simple logic to group classes into files
const sections = css.split(/\/\* --- (.*?) --- \*\//);

const fileContents = {
    'global.css': '/* \n * ==========================================================================\n * GLOBAL DECLUTTER\n * ========================================================================== \n */\n\n',
    'home.css': '/* \n * ==========================================================================\n * HOME DECLUTTER\n * ========================================================================== \n */\n\n',
    'search.css': '/* \n * ==========================================================================\n * SEARCH DECLUTTER\n * ========================================================================== \n */\n\n',
    'watch.css': '/* \n * ==========================================================================\n * WATCH DECLUTTER\n * ========================================================================== \n */\n\n',
    'shorts.css': '/* \n * ==========================================================================\n * SHORTS DECLUTTER\n * ========================================================================== \n */\n\n'
};

let currentFile = 'global.css';

// Initial chunk before any header goes to global
if (sections[0].trim()) {
    fileContents['global.css'] += sections[0].trim() + '\n\n';
}

for (let i = 1; i < sections.length; i += 2) {
    const header = sections[i].trim();
    const content = (sections[i+1] || '').trim();
    
    if (header === 'home-declutter.css') {
        currentFile = 'home.css';
    } else if (header === 'search-declutter.css') {
        currentFile = 'search.css';
    } else if (header === 'watch-declutter.css') {
        currentFile = 'watch.css';
    } else if (header === 'global-declutter.css') {
        currentFile = 'global.css';
    } else if (header.includes('Shorts') || header.includes('Badge') || header.includes('Navigation') || header.includes('Channel Page Tabs') || header.includes('Shelf Title') || header.includes('Secondary Results') || header.includes('Subscription Feed') || header.includes('Stamped Heuristic Shorts') || header.includes('Search & Chip Filters') || header.includes('New Renderer Types')) {
        currentFile = 'shorts.css'; // all these were under shorts logic
    }
    
    if (content) {
        fileContents[currentFile] += `/* --- ${header} --- */\n${content}\n\n`;
    }
}

for (const [file, content] of Object.entries(fileContents)) {
    fs.writeFileSync(path.join(outputDir, file), content);
    console.log(`Wrote ${file}`);
}
