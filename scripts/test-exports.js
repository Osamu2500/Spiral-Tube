const fs = require('fs');
const path = require('path');
const content = fs.readFileSync('src/popup/scripts/core/popup-main.js', 'utf8');
const matches = content.matchAll(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g);
for (const match of matches) {
    const symbols = match[1].split(',').map(s => s.trim());
    const importPath = match[2];
    const resolved = path.resolve('src/popup/scripts/core', importPath);
    if (!fs.existsSync(resolved)) continue;
    const targetContent = fs.readFileSync(resolved, 'utf8');
    for (const sym of symbols) {
        if (!sym) continue;
        const aliasParts = sym.split(/\s+as\s+/);
        const actualSym = aliasParts[0].trim();
        const regex = new RegExp('(?:export\\s+(?:const|let|var|function|class)\\s+' + actualSym + '\\b)|(?:export\\s+{.*\\b' + actualSym + '\\b.*})', 's');
        if (!regex.test(targetContent)) {
            console.log('MISSING EXPORT:', actualSym, 'in', importPath);
        }
    }
}
