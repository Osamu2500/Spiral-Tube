const fs = require('fs');
const path = require('path');

const checked = new Set();
function checkImports(file) {
    if (checked.has(file)) return;
    checked.add(file);
    if (!fs.existsSync(file)) {
        console.error('MISSING FILE:', file);
        return;
    }
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /import\s+.*?(?:from\s+)?['"](.*?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const resolved = path.resolve(path.dirname(file), importPath);
            checkImports(resolved);
        }
    }
}
checkImports(path.resolve('src/popup/scripts/core/popup-main.js'));
console.log('Done checking imports.');
