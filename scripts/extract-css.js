const fs = require('fs');
const path = require('path');

const targetFiles = [
    'src/content/pages/watch/player/media-effects/video-filters/video-filters-ui.js',
    'src/content/pages/watch/player/media-effects/video-filters/video-filters-overlay.js',
    'src/content/pages/watch/player/media-effects/volume-booster/volume-booster-ui.js',
    'src/content/pages/watch/player/media-effects/ambient-mode/ambient-mode.js',
    'src/content/pages/watch/player/media-effects/ambient-mode/audio-mode.js',
    'src/content/pages/watch/player/enhancements/time-display.js',
    'src/content/pages/watch/player/enhancements/split-scrolling.js',
    'src/content/pages/watch/player/enhancements/intentional-delay.js',
    'src/content/pages/watch/player/domain-memory-ui.js',
    'src/content/pages/watch/player/automation/auto-subtitles.js',
    'src/content/pages/watch/player/automation/auto-transcript.js',
    'src/content/pages/watch/player/controls/snapshot-button.js',
    'src/content/pages/watch/player/controls/loop-button.js',
    'src/content/pages/watch/player/controls/classic-progress-bar.js',
    'src/content/pages/watch/player/player-bar-ui.js',
    // auto-pip is special, it injects into pipWindow.document
    // auto-cinema has dynamic selectors, maybe we can extract static parts?
];

const regex = /const\s+(\w+)\s*=\s*(?:document|[^.]+\.document)\.createElement\('style'\);\s*(?:\1\.id\s*=\s*'[^']+';\s*)?\1\.textContent\s*=\s*`([\s\S]*?)`;\s*(?:document\.head\.appendChild\(\1\);|target\.appendChild\(\1\);|document\.documentElement\.appendChild\(\1\);)?/g;

// Also match the pattern in VideoFiltersUI._injectStyle
const injectStyleRegex = /this\._injectStyle\('[^']+',\s*`([\s\S]*?)`\);/g;

for (const file of targetFiles) {
    const fullPath = path.resolve(__dirname, '../../' + file);
    if (!fs.existsSync(fullPath)) continue;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let cssExtracted = '';
    
    let match;
    // Extract manual style creations
    const styleRegex = /([ \t]*)const\s+(\w+)\s*=\s*(?:document|[^.]+\.document)\.createElement\('style'\);[\s\S]*?\2\.textContent\s*=\s*`([\s\S]*?)`;[\s\S]*?(?:(?:document\.head|document\.documentElement|target)\.appendChild\(\2\);)/g;
    
    let offset = 0;
    const replacements = [];
    
    while ((match = styleRegex.exec(content)) !== null) {
        // Skip pipWindow
        if (match[0].includes('pipWindow.document')) continue;
        
        cssExtracted += match[3] + '\n';
        replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            replacement: `${match[1]}// CSS extracted to .css file`
        });
    }
    
    // Extract _injectStyle usage
    const injectRegex = /([ \t]*)this\._injectStyle\('[^']+',\s*`([\s\S]*?)`\);/g;
    while ((match = injectRegex.exec(content)) !== null) {
        cssExtracted += match[2] + '\n';
        replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            replacement: `${match[1]}// CSS extracted to .css file`
        });
    }

    if (cssExtracted.trim() !== '') {
        const basename = path.basename(file, '.js');
        const cssPath = path.join(path.dirname(fullPath), `${basename}.css`);
        
        fs.writeFileSync(cssPath, cssExtracted.trim() + '\n', 'utf8');
        console.log(`Extracted CSS to ${cssPath}`);
        
        // Apply replacements from back to front
        replacements.sort((a, b) => b.start - a.start);
        for (const r of replacements) {
            content = content.slice(0, r.start) + r.replacement + content.slice(r.end);
        }
        
        // Add import at the top
        const importStmt = `import './${basename}.css';\n`;
        content = importStmt + content;
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
