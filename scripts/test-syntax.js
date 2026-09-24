const fs = require('fs');
const path = require('path');
const vm = require('vm');

function checkSyntax(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            checkSyntax(fullPath);
        } else if (fullPath.endsWith('.js')) {
            try {
                new vm.Script(fs.readFileSync(fullPath, 'utf8'));
            } catch (e) {
                console.log('SYNTAX ERROR:', fullPath, e.message);
            }
        }
    }
}
checkSyntax('src');
