const fs = require('fs');
const path = require('path');

const schemaPath = 'src/popup/scripts/core/popup-schema.js';
const code = fs.readFileSync(schemaPath, 'utf8');

// Find the start of the return array in getPopupSchema
const startIndex = code.indexOf('export const getPopupSchema = (t) => [');
if (startIndex === -1) {
    console.error("Could not find 'export const getPopupSchema = (t) => ['");
    process.exit(1);
}

const headerCode = code.substring(0, startIndex);
// Remove the 'export const getPopupSchema = (t) => [' part from headerCode to know where it starts
const arrayStart = startIndex + 'export const getPopupSchema = (t) => ['.length;

// We need to parse the array elements.
// Simple balanced brace parser to extract each tab object.
let braceCount = 0;
let inString = false;
let escape = false;
let currentTabStart = -1;
const tabs = [];

for (let i = arrayStart; i < code.length; i++) {
    const char = code[i];
    if (escape) {
        escape = false;
        continue;
    }
    if (char === '\\') {
        escape = true;
        continue;
    }
    if (char === "'" || char === '"' || char === '`') {
        if (inString === char) {
            inString = false;
        } else if (!inString) {
            inString = char;
        }
    }
    
    if (!inString) {
        if (char === '{') {
            if (braceCount === 0) {
                currentTabStart = i;
            }
            braceCount++;
        } else if (char === '}') {
            braceCount--;
            if (braceCount === 0 && currentTabStart !== -1) {
                const tabCode = code.substring(currentTabStart, i + 1);
                tabs.push(tabCode);
                currentTabStart = -1;
            }
        }
    }
}

console.log(`Found ${tabs.length} tabs.`);

const outDir = 'src/popup/scripts/schema';
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const importsList = [];
const tabNames = [];

tabs.forEach((tabStr, index) => {
    // find id: 'something'
    const match = tabStr.match(/id:\s*['"]([^'"]+)['"]/);
    if (!match) {
        console.warn(`Could not find id in tab ${index}`);
        return;
    }
    const tabId = match[1];
    
    let isCustom = false;
    if (tabStr.includes('custom: true')) {
        isCustom = true;
    }

    const camelId = tabId.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const funcName = `get${camelId.charAt(0).toUpperCase() + camelId.slice(1)}Tab`;
    
    let fileCode = `import { ICONS } from '../ui/popup-icons.js';\n\n`;
    fileCode += `export const ${funcName} = (t) => (${tabStr});\n`;
    
    const fileName = `tab-${tabId}.js`;
    fs.writeFileSync(path.join(outDir, fileName), fileCode);
    console.log(`Wrote ${fileName}`);
    
    importsList.push(`import { ${funcName} } from '../schema/${fileName}';`);
    tabNames.push(`${funcName}(t)`);
});

// Now rewrite popup-schema.js
let newSchemaCode = `import { ICONS } from '../ui/popup-icons.js';\n`;
newSchemaCode += importsList.join('\n') + '\n\n';

// Extract CUSTOM_SLOT_RENDERERS and other stuff from the original file
// It's at the top.
const customSlotsMatch = code.match(/export const CUSTOM_SLOT_RENDERERS = new Map\(\);/);
if (customSlotsMatch) {
    newSchemaCode += `export const CUSTOM_SLOT_RENDERERS = new Map();\n\n`;
}

newSchemaCode += `export function getPopupSchema(t) {\n`;
newSchemaCode += `    return [\n        ${tabNames.join(',\n        ')}\n    ];\n`;
newSchemaCode += `}\n`;

fs.writeFileSync(schemaPath, newSchemaCode);
console.log('Rewrote popup-schema.js');
