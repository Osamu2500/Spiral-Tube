const fs = require('fs');
const path = require('path');

const togglesPath = path.join(__dirname, 'src', 'content', 'design-system', 'features', 'toggles.css');
const content = fs.readFileSync(togglesPath, 'utf8');

// A simplistic deduplication approach:
// We parse the file into blocks and comments.
// If a CSS block has already been seen exactly (selector + properties), we skip it.
// If a comment is seen, we keep it but avoid consecutive identical comments.

const lines = content.split('\n');
let newLines = [];
let seenBlocks = new Set();
let currentBlock = [];
let inBlock = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Ignore empty lines unless we want to preserve some spacing
    if (line.trim() === '' && !inBlock) {
        continue;
    }

    if (line.trim().startsWith('/*') && line.trim().endsWith('*/')) {
        // Single line comment
        if (!seenBlocks.has(line.trim())) {
            seenBlocks.add(line.trim());
            newLines.push(''); // Add spacing before comments
            newLines.push(line);
        }
        continue;
    }

    if (line.includes('{')) {
        inBlock = true;
        currentBlock = [line];
    } else if (inBlock) {
        currentBlock.push(line);
        if (line.includes('}')) {
            inBlock = false;
            const blockStr = currentBlock.map(l => l.trim()).join('\n');
            if (!seenBlocks.has(blockStr)) {
                seenBlocks.add(blockStr);
                newLines.push(...currentBlock);
            }
            currentBlock = [];
        }
    } else {
        // Multi-line comments or random text outside blocks
        newLines.push(line);
    }
}

fs.writeFileSync(togglesPath, newLines.join('\n'), 'utf8');
console.log('Deduplicated toggles.css. New line count:', newLines.length);
