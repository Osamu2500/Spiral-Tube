const fs = require('fs');
const path = require('path');

const dirs = [
    path.join(__dirname, '../src/content/design-system/ui-styles'),
    path.join(__dirname, '../src/content/design-system/themes')
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // 1. Extract and remove all @import statements
    const imports = [];
    content = content.replace(/@import\s+[^;]+;/g, match => {
        imports.push(match);
        return '';
    });
    
    // 2. Remove the invalid outer wrapper
    // The wrapper looks like: html[data-ypp-ui-design="..."] { ... } or html[data-ypp-theme="..."] { ... }
    // It's usually near the top.
    
    const lines = content.split('\n');
    let newLines = [];
    let wrapperOpenFound = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!wrapperOpenFound && /^html\[data-ypp-(ui-design|theme)="[^"]+"\]\s*\{\s*$/.test(line.trim())) {
            wrapperOpenFound = true;
            // Skip this line
            continue;
        }
        newLines.push(line);
    }
    
    // If we removed an open brace, we must remove the last closing brace in the file
    if (wrapperOpenFound) {
        let closed = false;
        for (let i = newLines.length - 1; i >= 0; i--) {
            if (newLines[i].trim() === '}') {
                newLines[i] = newLines[i].replace('}', '');
                closed = true;
                break;
            }
        }
    }
    
    // Reconstruct the file content
    let finalContent = imports.join('\n') + (imports.length > 0 ? '\n\n' : '') + newLines.join('\n');
    
    fs.writeFileSync(filePath, finalContent);
    console.log(`Processed: ${filePath}`);
}

dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
            if (dirent.isDirectory()) {
                const indexFile = path.join(dir, dirent.name, 'index.css');
                if (fs.existsSync(indexFile)) {
                    processFile(indexFile);
                }
            }
        });
    }
});
