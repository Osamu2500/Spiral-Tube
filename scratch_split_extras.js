const fs = require('fs');
const path = require('path');

const filePath = 'src/popup/scripts/ui/popup-extras.js';
const code = fs.readFileSync(filePath, 'utf8');

const featuresDir = 'src/popup/scripts/features';
if (!fs.existsSync(featuresDir)) {
    fs.mkdirSync(featuresDir, { recursive: true });
}

// Simple regex to split by top-level "export function"
const parts = code.split(/^(?=export function )/m);

const imports = parts[0]; // the top of the file

const extractName = (funcCode) => {
    const match = funcCode.match(/export function ([A-Za-z0-9_]+)/);
    return match ? match[1] : null;
};

const fileMap = {
    'initHistoryWidget': 'history-widget.js',
    'initBackupTools': 'backup-tools.js',
    'initBookmarksManager': 'bookmarks-manager.js',
    'renderPlayerBarOrganizer': 'player-bar-organizer.js',
    'renderDomainMemoryManager': 'domain-memory.js',
    'renderGlobalPlayerBarBlocklist': 'global-blocklist.js'
};

const newExtrasExports = [];
const newExtrasImports = [];

parts.slice(1).forEach(funcCode => {
    const name = extractName(funcCode);
    if (name && fileMap[name]) {
        let fileContent = imports + '\n' + funcCode;
        // Clean up double imports later if needed, but it's safe
        const fileName = fileMap[name];
        fs.writeFileSync(path.join(featuresDir, fileName), fileContent);
        console.log('Wrote', fileName);
        
        newExtrasImports.push(`import { ${name} } from '../features/${fileName}';`);
        newExtrasExports.push(`    ${name}`);
    }
});

let newExtrasCode = `// popup-extras.js - Orchestrator for features\n\n`;
newExtrasCode += newExtrasImports.join('\n') + '\n\n';
newExtrasCode += `export {\n${newExtrasExports.join(',\n')}\n};\n`;

fs.writeFileSync(filePath, newExtrasCode);
console.log('Updated popup-extras.js');
