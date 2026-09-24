const fs = require('fs');
const path = require('path');
const importRegex = /(?:import|export)\s+(?:.*?from\s+)?['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const importPath = match[1] || match[2];
                if (!importPath || importPath.startsWith('http')) continue;
                if (importPath.startsWith('.')) {
                    // strip query params
                    let cleanImport = importPath;
                    if (cleanImport.includes('?')) cleanImport = cleanImport.split('?')[0];

                    let res = path.resolve(path.dirname(fullPath), cleanImport);
                    
                    let exists = false;
                    if (fs.existsSync(res)) exists = true;
                    else if (fs.existsSync(res + '.js')) exists = true;
                    else if (fs.existsSync(res + '.ts')) exists = true;
                    else if (fs.existsSync(res + '/index.js')) exists = true;
                    else if (res.endsWith('.js') && fs.existsSync(res.slice(0, -3) + '.ts')) exists = true;

                    if (!exists) {
                        console.log('BROKEN IMPORT:', fullPath, '->', importPath, '==', res);
                    }
                }
            }
        }
    }
}
checkDir('src');
