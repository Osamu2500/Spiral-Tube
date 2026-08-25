const fs = require('fs');

// Simple regex to extract keys from popup-schema.js
const popupSchemaCode = fs.readFileSync('src/popup/scripts/popup-schema.js', 'utf8');
const idRegex = /id:\s*'([^']+)'/g;
const popupKeys = new Set();
let match;
while ((match = idRegex.exec(popupSchemaCode)) !== null) {
    popupKeys.add(match[1]);
}

// Simple regex to extract keys from settings-schema.js
const settingsSchemaCode = fs.readFileSync('src/shared/config/settings-schema.js', 'utf8');
// look for keys in schema: { ... } block
const schemaLines = settingsSchemaCode.split('\n');
const settingsKeys = new Set();
let inSchema = false;
for (const line of schemaLines) {
    if (line.includes('schema: Object.freeze({')) {
        inSchema = true;
        continue;
    }
    if (inSchema && line.trim() === '}),') {
        break;
    }
    if (inSchema) {
        // match "keyName: { type: ..."
        const match = line.match(/^\s*([a-zA-Z0-9_]+)\s*:/);
        if (match) {
            settingsKeys.add(match[1]);
        }
    }
}

// Output missing ones
const orphans = [];
for (const key of settingsKeys) {
    if (!popupKeys.has(key)) {
        orphans.push(key);
    }
}

console.log("Found " + orphans.length + " orphan features.");
console.log(orphans.join(', '));
