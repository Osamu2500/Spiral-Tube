const fs = require('fs');
const path = require('path');

let modifiedFiles = 0;
function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            walk(p);
        } else if (p.endsWith('.css')) {
            let content = fs.readFileSync(p, 'utf8');
            let originalContent = content;

            const regex = /((?:html\[data-ypp-ui-style[^\{]*?)?\.yt-spec-button-shape-next[^\{]*?)\{/g;
            
            content = content.replace(regex, (match, selectorList) => {
                if (selectorList.includes('aria-label*="Download"')) return match;
                
                const selectors = selectorList.split(',').map(s => s.trim());
                let additions = [];
                
                for (const sel of selectors) {
                    if (sel.includes('.yt-spec-button-shape-next')) {
                        // Match one OR MORE .yt-spec-button-shape-next classes attached to the same element
                        const newSel1 = sel.replace(/(?:\.yt-spec-button-shape-next(?:--[\w-]+)*)+/g, 'yt-button-shape button[aria-label*="Download" i]');
                        const newSel2 = sel.replace(/(?:\.yt-spec-button-shape-next(?:--[\w-]+)*)+/g, 'yt-button-shape button[title*="Download" i]');
                        additions.push(newSel1);
                        additions.push(newSel2);
                    }
                }
                
                if (additions.length > 0) {
                    return `${selectorList},\n${additions.join(',\n')} {`;
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
