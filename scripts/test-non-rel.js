const fs = require('fs');
const path = require('path');
function checkImports(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            checkImports(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = [
                ...content.matchAll(/import\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+)?\s*from\s+['"]([^'"]+)['"]/g),
                ...content.matchAll(/import\s+['"]([^'"]+)['"]/g)
            ];
            for (const match of matches) {
                let importPath = match[1];
                if (!importPath.startsWith('.')) {
                    console.log('NON-RELATIVE IMPORT:', fullPath, '->', importPath);
                }
            }
        }
    }
}
checkImports('src');
