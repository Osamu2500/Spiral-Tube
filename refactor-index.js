const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'src/content/index.ts');
let content = fs.readFileSync(indexFile, 'utf8');

// 1. Move feature-manager.js import to the top
if (content.includes("import './core/feature-manager.js';")) {
    content = content.replace("import './core/feature-manager.js';\n", "");
    content = content.replace(
        "import './core/event-delegator.js';",
        "import './core/event-delegator.js';\nimport './core/feature-manager.js';"
    );
}

// 2. Process all feature imports
const regex = /import\s+['"](\.\/features\/.*\.js)['"];/g;
let output = '';
let lastIndex = 0;
let match;

while ((match = regex.exec(content)) !== null) {
    output += content.substring(lastIndex, match.index);
    lastIndex = regex.lastIndex;

    const importPath = match[1];
    const absPath = path.join(__dirname, 'src/content', importPath);
    
    if (fs.existsSync(absPath)) {
        const fileContent = fs.readFileSync(absPath, 'utf8');
        // Find exported class that extends something (BaseFeature or another feature)
        // We know refactored features have `static featureId`
        const classMatch = fileContent.match(/export class ([A-Za-z0-9_]+)(?:\s+extends\s+[A-Za-z0-9_.]+)?\s*\{[\s\S]*?static featureId =/);
        
        if (classMatch) {
            const className = classMatch[1];
            output += `import { ${className} } from '${importPath}';\nwindow.YPP.FeatureManager.register(${className});`;
        } else {
            // Leave unchanged if not a standard feature (e.g., base-feature.js)
            output += match[0];
        }
    } else {
        output += match[0];
    }
}

output += content.substring(lastIndex);

fs.writeFileSync(indexFile, output, 'utf8');
console.log('index.ts refactored!');
