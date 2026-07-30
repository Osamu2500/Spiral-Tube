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
let issues = [];

for(const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Count new MutationObserver
    const numObservers = (content.match(/new\s+MutationObserver/g) || []).length;
    if (numObservers > 0) {
        const numDisconnects = (content.match(/\.disconnect\(\)/g) || []).length;
        if (numDisconnects < numObservers) {
            issues.push({file, numObservers, numDisconnects});
        }
    }
}

for(const issue of issues) {
    console.log(`${issue.file}: ${issue.numObservers} observers, ${issue.numDisconnects} disconnects`);
}
