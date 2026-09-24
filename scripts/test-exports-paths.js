const fs = require('fs');
const path = require('path');
function checkExports(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            checkExports(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.matchAll(/export\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+|\*)?\s*from\s+['"]([^'"]+)['"]/g);
            for (const match of matches) {
                let importPath = match[1];
                if (!importPath.startsWith('.')) continue;
                let resolved = path.resolve(path.dirname(fullPath), importPath);
                if (!fs.existsSync(resolved)) {
                    if (fs.existsSync(resolved.replace(/\.js$/, '.ts'))) continue;
                    console.log('BROKEN EXPORT FROM:', fullPath, '->', importPath);
                }
            }
        }
    }
}
checkExports('src');
