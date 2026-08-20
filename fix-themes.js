const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');

function traverseAndFix(dir) {
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
            // This regex matches blocks like:
            // html[data-ypp-ui-style="nord"] yt-button-shape button, html[...] .yt-spec-button-shape-next { ... }
            // or just yt-button-shape button { ... }
            // It uses a negative lookbehind (or careful matching) to NOT match #subscribe-button
            
            // We'll remove blocks that define the bad 12px or 30px borders on all buttons
            // Since regex for CSS blocks can be tricky, we'll specifically target the bad properties
            // inside yt-button-shape button blocks if they are too broad.
            
            // Actually, we can remove the whole block if it targets yt-button-shape button generically.
            // A generic target usually starts a line or is after a comma.
            
            // Let's use a simpler approach: replace the specific bad properties inside yt-button-shape button blocks.
            // But wait, the blocks also have borders, backgrounds, etc that mess up download buttons.
            
            // Match any CSS block where the selector contains 'yt-button-shape button' 
            // AND the selector starts with 'html[data-ypp'
            // We'll use a regex that looks for html[data-ypp... followed by any number of characters up to the {
            // But we must make sure we don't accidentally match #subscribe-button
            const badBlockRegex1 = /html\[data-ypp-(?:ui|card)-style=[^\{]*yt-button-shape button[^\{]*\{[^}]*\}/g;
            content = content.replace(badBlockRegex1, (match) => {
                // If it specifically targets the subscribe button, keep it
                if (match.includes('#subscribe-button') || match.includes('ytd-subscribe-button-renderer')) {
                    return match;
                }
                return '';
            });
            
            // "yt-button-shape button { ... }"
            const badBlockRegex2 = /(^|\n)yt-button-shape button\s*\{[^}]*\}/g;
            content = content.replace(badBlockRegex2, '');
            
            // "yt-button-shape button:hover { ... }"
            const badBlockRegex3 = /(^|\n)yt-button-shape button:hover\s*\{[^}]*\}/g;
            content = content.replace(badBlockRegex3, '');

            // 3. Remove #top-row and #actions styling to preserve exact native YouTube dimensions
            const badBlockRegex5 = /(^|\n)#top-row\.ytd-watch-metadata\s*\{[^}]*\}/g;
            content = content.replace(badBlockRegex5, '');

            const badBlockRegex6 = /(^|\n)#actions\.ytd-watch-metadata\s*\{[^}]*\}/g;
            content = content.replace(badBlockRegex6, '');

            // 4. Remove all custom styling for the download button so it matches native YouTube buttons
            const downloadBtnRegex1 = /(^|\n)[^{]*yt-download-button-view-model[^{]*\{[^}]*\}/g;
            content = content.replace(downloadBtnRegex1, '');
            
            const downloadBtnRegex2 = /(^|\n)[^{]*ytd-download-button-renderer[^{]*\{[^}]*\}/g;
            content = content.replace(downloadBtnRegex2, '');
            
            // 5. Remove any other broad action button overrides (like #ask-button)
            const askBtnRegex = /(^|\n)[^{]*#ask-button[^{]*\{[^}]*\}/g;
            content = content.replace(askBtnRegex, '');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Patched: ${fullPath}`);
            }
        }
    }
}

console.log('Starting CSS cleanup...');
traverseAndFix(uiStylesDir);
console.log('Cleanup complete!');
