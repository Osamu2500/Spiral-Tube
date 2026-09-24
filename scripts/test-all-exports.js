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
            const matches = content.matchAll(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g);
            for (const match of matches) {
                const symbols = match[1].split(',').map(s => s.trim());
                const importPath = match[2];
                if (!importPath.startsWith('.')) continue;
                const resolved = path.resolve(path.dirname(fullPath), importPath);
                
                if (!fs.existsSync(resolved)) continue;
                const targetContent = fs.readFileSync(resolved, 'utf8');
                for (const sym of symbols) {
                    if (!sym) continue;
                    const aliasParts = sym.split(/\s+as\s+/);
                    const actualSym = aliasParts[0].trim();
                    const regex = new RegExp('(?:export\\s+(?:async\\s+)?(?:const|let|var|function|class)\\s+' + actualSym + '\\b)|(?:export\\s+{.*\\b' + actualSym + '\\b.*})', 's');
                    if (!regex.test(targetContent)) {
                        console.log('MISSING EXPORT:', actualSym, 'in', importPath, 'imported by', fullPath);
                    }
                }
            }
        }
    }
}
checkExports('src');
