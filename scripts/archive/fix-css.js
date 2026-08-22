const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function fixBackdropFilter(filePath) {
    if (!filePath.endsWith('.css')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has backdrop-filter
    if (!content.includes('backdrop-filter')) return;

    let lines = content.split('\n');
    let newLines = [];
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Skip existing -webkit-backdrop-filter lines to prevent duplicates
        if (line.includes('-webkit-backdrop-filter')) {
            modified = true; // We'll reconstruct it properly below
            continue; 
        }

        if (line.includes('backdrop-filter') && !line.includes('-webkit-')) {
            // Find the indentation
            let indent = line.match(/^\s*/)[0];
            // Find the value
            let match = line.match(/backdrop-filter:\s*(.*?);/);
            
            if (match) {
                let value = match[1];
                let isImportant = value.includes('!important');
                
                // Construct new lines
                newLines.push(`${indent}-webkit-backdrop-filter: ${value};`);
                newLines.push(line);
                modified = true;
                continue;
            }
        }
        
        newLines.push(line);
    }

    if (modified) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        console.log(`Fixed backdrop-filter in: ${filePath}`);
    }
}

const targetDirs = [
    path.join(__dirname, 'src/content/ui-styles'),
    path.join(__dirname, 'src/popup')
];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        walkDir(dir, fixBackdropFilter);
    }
});

console.log('Done!');
