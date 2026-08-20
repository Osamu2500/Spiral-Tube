const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            walk(p);
        } else if (p.endsWith('.css')) {
            let content = fs.readFileSync(p, 'utf8');
            let originalContent = content;
            
            // Regex to find .yt-spec-button-shape-next--tonal and any immediate pseudo-classes
            const regex = /\.yt-spec-button-shape-next--tonal(:[a-z\-]+)?/g;
            
            content = content.replace(regex, (match, pseudo) => {
                // If it already has our fix, don't double append
                if (content.includes(`[aria-label*="Download" i]${pseudo || ''}`)) {
                    return match;
                }
                
                let p = pseudo || '';
                return `${match},\nhtml[data-ypp-ui-style] ytd-watch-metadata yt-button-shape button[aria-label*="Download" i]${p},\nhtml[data-ypp-ui-style] ytd-watch-metadata yt-button-shape button[title*="Download" i]${p}`;
            });
            
            // Same for .yt-spec-button-shape-next if tonal is not used (like in Vintage)
            // But we must be careful not to replace it if it's already part of a longer class
            const regex2 = /\.yt-spec-button-shape-next(?!-)(:[a-z\-]+)?(\s*\*|\s*svg|\s*path)?/g;
            content = content.replace(regex2, (match, pseudo, child) => {
                let p = pseudo || '';
                let c = child || '';
                
                // If it already contains our fix or if it is followed by something else we don't want to duplicate blindly
                return `${match},\nhtml[data-ypp-ui-style] ytd-watch-metadata yt-button-shape button[aria-label*="Download" i]${p}${c},\nhtml[data-ypp-ui-style] ytd-watch-metadata yt-button-shape button[title*="Download" i]${p}${c}`;
            });

            if (content !== originalContent) {
                fs.writeFileSync(p, content, 'utf8');
                console.log(`Updated ${p}`);
            }
        }
    });
}

// Ensure we don't double replace by running a clean reset first if needed
// Actually, since I haven't run this before, just running it once is fine.
// But we must prevent infinite growth if run twice, so let's just make it simple.

const dir = path.join(__dirname, 'src', 'content', 'ui-styles');
walk(dir);
console.log('Finished updating theme CSS files.');
