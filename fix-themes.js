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
            if(file.endsWith('.css')) results.push(file);
        }
    });
    return results;
}

const themesDir = "f:\\Youtube 2.0\\src\\content\\themes";
const files = walk(themesDir);

let changed = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    const parts = file.split(path.sep);
    const themesIndex = parts.indexOf('themes');
    const themeName = parts[themesIndex + 1];

    if (themeName && themeName !== 'shared') {
        let newContent = content;
        
        // Remove [data-ypp-theme="..."] if it's already there to prevent duplicates
        newContent = newContent.replace(new RegExp(`\\[data-ypp-theme="${themeName}"\\]`, 'g'), '');
        
        // Replace html.yt-spiral-tube-theme with html[data-ypp-theme="..."]
        newContent = newContent.replace(/html\.yt-spiral-tube-theme/g, `html[data-ypp-theme="${themeName}"]`);
        
        if (newContent !== content) {
            fs.writeFileSync(file, newContent, 'utf8');
            changed++;
            console.log(`Updated ${file}`);
        }
    }
}
console.log(`Changed ${changed} files.`);
