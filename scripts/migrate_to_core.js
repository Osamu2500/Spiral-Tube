const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/content/ui-styles/nature');
const destDir = path.join(__dirname, '../src/content/core-framework');

function copyAndTransform(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(file => {
            // Ignore index.css in root (we'll manually create the main index later)
            // and ignore base/tokens.css since we created our own.
            if (src === srcDir && file === 'index.css') return;
            if (src === path.join(srcDir, 'base') && file === 'tokens.css') return;

            copyAndTransform(path.join(src, file), path.join(dest, file));
        });
    } else {
        if (src.endsWith('.css')) {
            let content = fs.readFileSync(src, 'utf8');

            // Token Replacements
            content = content.replace(/var\(--sf\)/g, 'var(--ypp-surface-bg)');
            content = content.replace(/var\(--nature-border\)/g, 'var(--ypp-surface-border)');
            content = content.replace(/var\(--nature-primary\)/g, 'var(--ypp-primary-accent)');
            
            content = content.replace(/var\(--shadow-base\)/g, 'var(--ypp-shadow-base)');
            content = content.replace(/var\(--shadow-hover\)/g, 'var(--ypp-shadow-hover)');
            content = content.replace(/var\(--shadow-active\)/g, 'var(--ypp-shadow-active)');
            
            content = content.replace(/var\(--bounce\)/g, 'var(--ypp-transition-bounce)');
            
            // Shapes (Nature uses 24px 4px 24px 4px a lot, replace with a generic shape token)
            content = content.replace(/24px 4px 24px 4px/g, 'var(--ypp-shape-primary, 12px)');
            content = content.replace(/24px/g, 'var(--ypp-shape-secondary, 12px)');
            
            // Fonts
            // Usually nature doesn't enforce fonts per element, it relies on base/tokens, but just in case
            
            fs.writeFileSync(dest, content);
            console.log(`Transformed: ${path.relative(srcDir, src)}`);
        }
    }
}

copyAndTransform(srcDir, destDir);
console.log('Migration to core-framework complete.');
