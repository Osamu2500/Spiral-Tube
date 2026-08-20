const fs = require('fs');
const path = require('path');

// 1. Force the layout in core-styles.css
const cssPath = path.join(__dirname, 'src', 'content', 'features', 'global', 'core-styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const universalLayoutFix = `
/* Universal Action Bar Layout Fix */
html[data-ypp-ui-style] body ytd-watch-metadata #actions-inner {
    justify-content: flex-end !important;
    gap: 8px !important;
    width: 100% !important;
    flex-wrap: nowrap !important;
}
html[data-ypp-ui-style] body ytd-watch-metadata #actions-inner > * {
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
}
/* Hide YouTube's native spacer that separates buttons */
html[data-ypp-ui-style] body ytd-watch-metadata #actions-inner .spacer,
html[data-ypp-ui-style] body ytd-watch-metadata #actions-inner > div:empty {
    display: none !important;
    width: 0 !important;
    flex: 0 !important;
}
`;

if (!css.includes('Universal Action Bar Layout Fix')) {
    css += '\n' + universalLayoutFix + '\n';
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Applied universal layout fix to core-styles.css');
}

// 2. Patch all 80 themes
let modifiedFiles = 0;
function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            walk(p);
        } else if (p.endsWith('.css')) {
            let content = fs.readFileSync(p, 'utf8');
            let originalContent = content;

            // Regex explanation:
            // Match CSS blocks starting with html[data-ypp-ui-style
            // Match up to .yt-spec-button-shape-next
            // Capture the whole selector list up to the {
            const regex = /((?:html\[data-ypp-ui-style[^\{]*?)?\.yt-spec-button-shape-next[^\{]*?)\{/g;
            
            content = content.replace(regex, (match, selectorList) => {
                if (selectorList.includes('aria-label*="Download"')) return match;
                
                // We split by comma to handle multiple selectors in a block
                const selectors = selectorList.split(',').map(s => s.trim());
                let additions = [];
                
                for (const sel of selectors) {
                    if (sel.includes('.yt-spec-button-shape-next')) {
                        // Replace the class with the Download button attribute selector
                        // We must remove the suffixes like --tonal, --filled, --call-to-action
                        const newSel1 = sel.replace(/\.yt-spec-button-shape-next(?:--[\w-]+)*/g, 'yt-button-shape button[aria-label*="Download" i]');
                        const newSel2 = sel.replace(/\.yt-spec-button-shape-next(?:--[\w-]+)*/g, 'yt-button-shape button[title*="Download" i]');
                        additions.push(newSel1);
                        additions.push(newSel2);
                    }
                }
                
                if (additions.length > 0) {
                    return `${selectorList}, ${additions.join(', ')} {`;
                }
                
                return match;
            });

            if (content !== originalContent) {
                fs.writeFileSync(p, content, 'utf8');
                modifiedFiles++;
            }
        }
    });
}

const stylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');
walk(stylesDir);
console.log(`Patched Download button CSS into ${modifiedFiles} theme files.`);
