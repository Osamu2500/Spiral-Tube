const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src/content');
let matchCount = {};

for(const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // findall querySelector/querySelectorAll
    const regex = /querySelector(?:All)?\(['"`](.*?)['"`]\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const sel = match[1];
        matchCount[sel] = (matchCount[sel] || 0) + 1;
    }
}

const sorted = Object.entries(matchCount).sort((a, b) => b[1] - a[1]);
for(let i = 0; i < 30; i++) {
    console.log(`${sorted[i][1]}: ${sorted[i][0]}`);
}
