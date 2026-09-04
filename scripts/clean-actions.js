const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/styles/ui-styles');

function findCssFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findCssFiles(filePath, fileList);
        } else if (filePath.endsWith('.css')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const cssFiles = findCssFiles(uiStylesDir);
let filesModified = 0;

cssFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // We want to remove any CSS rules that contain #actions in the selector.
    // CSS rules look like: selector { ... }
    // We'll use a regex to match blocks. Since blocks can contain nested things or newlines,
    // we'll split by '}' and process each block.
    // However, splitting by '}' is safer if we handle '{' correctly.
    
    // A more robust way: use regex to find selectors containing #actions and their { } blocks.
    // We can match anything that has #actions up to the '{', then capture everything up to '}'
    
    // Replace rules containing #actions
    // Match pattern: [^}]*#actions[^}]*\{[^}]*\}
    // This matches: 
    // 1. Any characters except '}' (start of selector)
    // 2. #actions
    // 3. Any characters except '{' or '}' (rest of selector)
    // 4. '{'
    // 5. Any characters except '}' (body of rule)
    // 6. '}'
    const regex = /[^{}]*#actions[^{}]*\{[^{}]*\}/g;
    
    if (regex.test(content)) {
        const newContent = content.replace(regex, '');
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Cleaned ${path.basename(path.dirname(file))}/${path.basename(file)}`);
        filesModified++;
    }
});

console.log(`Finished cleaning. Modified ${filesModified} files.`);
