const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const TARGET_DIRS = [
    { dir: 'src/content/design-system/themes', prefix: 'html[data-ypp-theme="NAME"]' },
    { dir: 'src/content/design-system/ui-styles', prefix: 'html[data-ypp-ui-design="NAME"]' },
    { dir: 'src/content/design-system/card-styles', prefix: 'html[data-ypp-card-style="NAME"]' }
];

const plugin = postcss.plugin('prefixer', (options) => {
    return (root) => {
        root.walkRules(rule => {
            // Ignore keyframes
            if (rule.parent && rule.parent.type === 'atrule' && rule.parent.name === 'keyframes') return;

            // Split selectors and check each
            const selectors = rule.selectors.map(sel => {
                let trimmed = sel.trim();
                // If it already has a scoped prefix, keep it
                if (trimmed.includes('[data-ypp-')) {
                    // But check if it's deeply nested e.g. "html[...] html[...] body"
                    if ((trimmed.match(/\[data-ypp-/g) || []).length > 1) {
                        // Let's strip the extra prefix
                        const parts = trimmed.split(' ');
                        const uniqueParts = [];
                        parts.forEach(p => {
                            if (!uniqueParts.includes(p)) uniqueParts.push(p);
                        });
                        trimmed = uniqueParts.join(' ');
                    }
                    return trimmed;
                }
                // If it's the root variables block
                if (trimmed === ':root') return options.prefix;
                // Otherwise prefix it!
                // Be careful not to prefix body if it already has body
                if (trimmed.startsWith('body')) {
                    return `${options.prefix} ${trimmed}`;
                }
                return `${options.prefix} ${trimmed}`;
            });
            rule.selectors = selectors;
        });
    };
});

async function processFile(filePath, prefixTemplate) {
    const fileName = path.basename(filePath, '.css');
    const folderName = path.basename(path.dirname(filePath));
    const name = filePath.includes('card-styles') ? fileName : folderName;
    
    let topName = name;
    if (filePath.includes('themes') || filePath.includes('ui-styles')) {
        const parts = filePath.replace(/\\/g, '/').split('/');
        const categoryIndex = parts.findIndex(p => p === 'themes' || p === 'ui-styles');
        if (categoryIndex !== -1 && parts.length > categoryIndex + 1) {
            topName = parts[categoryIndex + 1];
        }
    }

    const prefix = prefixTemplate.replace('NAME', topName);
    const content = fs.readFileSync(filePath, 'utf8');

    // Remove any outer html[...] { ... } block entirely!
    // Since we will prefix every rule anyway, we don't need the outer block.
    // Let's first parse it without removing the block, because removing the block might be hard.
    // Actually, if we just remove the outer block:
    let cleanContent = content;
    const outerBlockRegex = new RegExp(`^\\s*${prefix.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}\\s*\\{\\s*`, 'm');
    const match = cleanContent.match(outerBlockRegex);
    if (match) {
        // Find the index of the matching brace
        let openBraces = 0;
        let startIndex = match.index + match[0].length;
        let endIndex = -1;
        for (let i = startIndex; i < cleanContent.length; i++) {
            if (cleanContent[i] === '{') openBraces++;
            else if (cleanContent[i] === '}') {
                if (openBraces === 0) {
                    endIndex = i;
                    break;
                }
                openBraces--;
            }
        }
        if (endIndex !== -1) {
            cleanContent = cleanContent.substring(0, match.index) + 
                           cleanContent.substring(startIndex, endIndex) + 
                           cleanContent.substring(endIndex + 1);
        }
    }

    // Now process with postcss
    const result = await postcss([plugin({ prefix })]).process(cleanContent, { from: filePath, to: filePath });
    if (result.css !== content) {
        fs.writeFileSync(filePath, result.css);
        return true;
    }
    return false;
}

async function run() {
    let changed = 0;
    
    for (const target of TARGET_DIRS) {
        const fullDir = path.join(process.cwd(), target.dir);
        if (!fs.existsSync(fullDir)) continue;
        
        const files = [];
        const walk = (dir) => {
            fs.readdirSync(dir).forEach(file => {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
                else if (fullPath.endsWith('.css')) files.push(fullPath);
            });
        };
        walk(fullDir);

        for (const file of files) {
            try {
                if (await processFile(file, target.prefix)) {
                    console.log(`Fixed: ${file}`);
                    changed++;
                }
            } catch (e) {
                console.error(`Error processing ${file}: ${e.message}`);
            }
        }
    }
    console.log(`Total files fixed: ${changed}`);
}

run();
