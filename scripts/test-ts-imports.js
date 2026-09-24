const fs = require('fs');
const path = require('path');

function findTsImports(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            findTsImports(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = [
                ...content.matchAll(/import\s+.*?\s*from\s+['"]([^'"]+)['"]/g),
                ...content.matchAll(/import\s+['"]([^'"]+)['"]/g)
            ];
            for (const match of matches) {
                let importPath = match[1];
                if (!importPath.startsWith('.')) continue;
                let resolved = path.resolve(path.dirname(fullPath), importPath);
                
                if (!fs.existsSync(resolved) && fs.existsSync(resolved.replace(/\.js$/, '.ts'))) {
                    console.log('TS IMPORT:', fullPath, '->', importPath);
                }
            }
        }
    }
}
findTsImports('src/popup');
findTsImports('src/shared');
