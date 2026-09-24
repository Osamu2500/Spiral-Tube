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
            const matches = content.matchAll(/import.*?from\s+['"]([^'"]+)['"]/g);
            for (const match of matches) {
                let importPath = match[1];
                if (!importPath.startsWith('.')) continue;
                let resolved = path.resolve(path.dirname(fullPath), importPath);
                
                try {
                    const dirName = path.dirname(resolved);
                    const baseName = path.basename(resolved);
                    const dirFiles = fs.readdirSync(dirName);
                    if (!dirFiles.includes(baseName)) {
                        // Check if it's .ts instead
                        if (dirFiles.includes(baseName.replace(/\.js$/, '.ts'))) continue;
                        console.log('CASE MISMATCH:', fullPath, '->', importPath, 'Expected:', baseName);
                    }
                } catch(e) {}
            }
        }
    }
}
checkImports('src');
