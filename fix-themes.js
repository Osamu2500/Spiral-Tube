const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');
const cardStylesDir = path.join(__dirname, 'src', 'content', 'card-styles');

function removeCssBlocksContaining(content, patternStr) {
    // This regex looks for:
    // 1. Any non-brace characters (the selector)
    // 2. The specific pattern we want to remove
    // 3. More non-brace characters up to the opening brace
    // 4. The opening brace
    // 5. Any characters except closing brace
    // 6. The closing brace
    
    // Using a simple loop is safer for CSS minified strings than complex regex
    let result = '';
    let i = 0;
    while (i < content.length) {
        let openBrace = content.indexOf('{', i);
        if (openBrace === -1) {
            result += content.substring(i);
            break;
        }
        
        let closeBrace = content.indexOf('}', openBrace);
        if (closeBrace === -1) {
            result += content.substring(i);
            break;
        }
        
        let selector = content.substring(i, openBrace);
        let block = content.substring(openBrace, closeBrace + 1);
        
        let shouldRemove = false;
        if (typeof patternStr === 'string' && selector.includes(patternStr)) {
            shouldRemove = true;
        } else if (patternStr instanceof RegExp && patternStr.test(selector)) {
            shouldRemove = true;
        }
        
        // Exceptions
        if (shouldRemove && (selector.includes('#subscribe-button') || selector.includes('ytd-subscribe-button-renderer'))) {
            shouldRemove = false;
        }
        
        if (!shouldRemove) {
            result += selector + block;
        }
        
        i = closeBrace + 1;
    }
    return result;
}

function traverseAndFix(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseAndFix(fullPath);
        } else if (fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // 1. Remove font-size overrides for video titles (2.4rem and 2.2rem)
            content = content.replace(/font-size:\s*2\.[24]rem\s*!important;/g, '');

            // 2. Remove generic yt-button-shape button block overrides
            content = removeCssBlocksContaining(content, 'yt-button-shape button');

            // 3. Remove #top-row and #actions styling
            content = removeCssBlocksContaining(content, '#top-row.ytd-watch-metadata');
            content = removeCssBlocksContaining(content, '#actions.ytd-watch-metadata');
            content = removeCssBlocksContaining(content, '#actions-inner');

            // 4. Remove all custom styling for the download button
            content = removeCssBlocksContaining(content, 'yt-download-button-view-model');
            content = removeCssBlocksContaining(content, 'ytd-download-button-renderer');
            content = removeCssBlocksContaining(content, '#download-button');

            // 5. Remove any other broad action button overrides
            content = removeCssBlocksContaining(content, '#ask-button');
            content = removeCssBlocksContaining(content, '.ytp-chrome-controls button');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Patched: ${fullPath}`);
            }
        }
    }
}

console.log('Starting CSS cleanup...');
traverseAndFix(uiStylesDir);
traverseAndFix(cardStylesDir);
console.log('Cleanup complete!');
