const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.css')) { 
            results.push(file);
        }
    });
    return results;
}

let files = walk('src/content/ui-styles/vintage');
for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    let lines = content.split(/\r?\n/);
    let newLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes(' path') && line.trim().startsWith('html[')) {
            if (line.trim().endsWith(',')) {
                // skip line entirely
                continue;
            } else if (line.trim().endsWith('{')) {
                // It's the last selector, e.g. html[...] path {
                if (newLines.length > 0) {
                    let prev = newLines[newLines.length - 1];
                    if (prev.trim().endsWith(',')) {
                        newLines[newLines.length - 1] = prev.substring(0, prev.lastIndexOf(',')) + ' {';
                    } else {
                        newLines.push('{');
                    }
                }
                continue;
            }
        }
        newLines.push(line);
    }
    
    content = newLines.join('\n');
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed paths in: ' + file);
    }
}
