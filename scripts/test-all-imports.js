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
                ...content.matchAll(/import\s+['"]([^'"]+)['"]/g),
                ...content.matchAll(/import\s*\(\s*['"]([^'"]+)['"]/g)
            ];
            for (const match of matches) {
                let importPath = match[1];
                if (!importPath.startsWith('.')) continue;
                
                let resolved = path.resolve(path.dirname(fullPath), importPath);
                
                if (!fs.existsSync(resolved)) {
                    if (fs.existsSync(resolved.replace(/\.js$/, '.ts'))) continue;
                    // For things like ?inline
                    if (importPath.includes('?')) {
                        let clean = importPath.split('?')[0];
                        if (fs.existsSync(path.resolve(path.dirname(fullPath), clean))) continue;
                    }
                    console.log('BROKEN IMPORT:', fullPath, '->', importPath, '(', resolved, ')');
                }
            }
        }
    }
}
checkImports('src');
