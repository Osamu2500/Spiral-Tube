const fs = require('fs');
const path = require('path');
const cssImportRegex = /@import\s+['"]?([^'"\)]+)['"]?/g;

function checkCss(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            checkCss(fullPath);
        } else if (fullPath.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let match;
            while ((match = cssImportRegex.exec(content)) !== null) {
                const importPath = match[1];
                if (!importPath || importPath.startsWith('http')) continue;
                let res = path.resolve(path.dirname(fullPath), importPath);
                if (!fs.existsSync(res)) {
                    console.log('BROKEN CSS IMPORT:', fullPath, '->', importPath, '==', res);
                }
            }
        }
    }
}
checkCss('src');
