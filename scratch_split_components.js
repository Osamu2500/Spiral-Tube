const fs = require('fs');
const path = require('path');

const filePath = 'src/popup/scripts/ui/popup-components.js';
const code = fs.readFileSync(filePath, 'utf8');

const componentsDir = 'src/popup/scripts/components';
if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

// The file has `export function initComponents(...) {`
// Inside there are many `function xxx() { ... }`
// And at the end `return { ... };`

const initMatch = code.match(/export function initComponents\([\s\S]*?\)\s*\{/);
if (!initMatch) {
    console.error('Could not find initComponents');
    process.exit(1);
}
const header = code.substring(0, initMatch.index);
const signature = initMatch[0];
const bodyStart = initMatch.index + signature.length;

let bodyEnd = code.lastIndexOf('return {');
if (bodyEnd === -1) {
    console.error('Could not find return {');
    process.exit(1);
}

const bodyCode = code.substring(bodyStart, bodyEnd);

// Now we extract functions from bodyCode using brace matching
let braceCount = 0;
let inString = false;
let escape = false;
let currentStart = -1;
const functions = [];

for (let i = 0; i < bodyCode.length; i++) {
    const char = bodyCode[i];
    if (escape) { escape = false; continue; }
    if (char === '\\') { escape = true; continue; }
    if (char === "'" || char === '"' || char === '`') {
        if (inString === char) inString = false;
        else if (!inString) inString = char;
    }
    if (!inString) {
        if (char === '{') {
            if (braceCount === 0) {
                // Find start of function definition before {
                // backtrack to find 'function'
                const pre = bodyCode.substring(0, i);
                const lastFunc = pre.lastIndexOf('function ');
                if (lastFunc !== -1 && i - lastFunc < 200) {
                    currentStart = lastFunc;
                } else {
                    // might be something else
                }
            }
            braceCount++;
        } else if (char === '}') {
            braceCount--;
            if (braceCount === 0 && currentStart !== -1) {
                functions.push(bodyCode.substring(currentStart, i + 1));
                currentStart = -1;
            }
        }
    }
}

// Group functions into logical files
const groups = {
    'theme-selector': ['initThemeSelector', 'applyThemeToPopup', 'initAccentColorSwatches', 'initCustomThemeBuilder', 'initImageBackgroundTheme', 'initPremiumAccentDropdown'],
    'page-buttons': ['initHideWatchedModePill', 'initHideWatchedPageButtons', 'initMetaFilterPageButtons', 'initShortsFilterPageButtons'],
    'visual-grids': ['initGlobalPlayerBarGrid', 'initCardStyleGrid', 'initYoutubeStyleGrid', 'initPopupStyleGrid', 'initCursorStyleGrid'],
    'inline-sliders': ['initAutoLikeInlineControls', 'initViewsFilterInlineSlider', 'initBasicInlineSlider', 'initDateFilterInlineSliders', 'initSearchViewMode']
};

const extractedNames = new Set();
for (const f of functions) {
    const m = f.match(/function\s+([A-Za-z0-9_]+)/);
    if (m) extractedNames.add(m[1]);
}

const groupImports = [];
const groupCalls = [];

for (const [groupName, funcNames] of Object.entries(groups)) {
    const matchedFuncs = functions.filter(f => {
        const m = f.match(/function\s+([A-Za-z0-9_]+)/);
        return m && funcNames.includes(m[1]);
    });
    
    if (matchedFuncs.length > 0) {
        let fileCode = `${header}\n`;
        fileCode += `export function init${groupName.replace(/-/g, '')}(document, state, ui, updateSetting, notifyThemeChange, saveSettings) {\n`;
        
        matchedFuncs.forEach(f => {
            fileCode += '  ' + f.replace(/\n/g, '\n  ') + '\n\n';
        });
        
        const returnObj = matchedFuncs.map(f => f.match(/function\s+([A-Za-z0-9_]+)/)[1]).join(',\n    ');
        fileCode += `  return {\n    ${returnObj}\n  };\n}\n`;
        
        fs.writeFileSync(path.join(componentsDir, `${groupName}.js`), fileCode);
        console.log(`Wrote ${groupName}.js`);
        
        const funcName = `init${groupName.replace(/-/g, '')}`;
        groupImports.push(`import { ${funcName} } from '../components/${groupName}.js';`);
        groupCalls.push(`    const ${groupName.replace(/-/g, '_')} = ${funcName}(document, state, ui, updateSetting, notifyThemeChange, saveSettings);`);
    }
}

// Now rewrite popup-components.js
let newCompCode = `${header}\n`;
newCompCode += groupImports.join('\n') + '\n\n';
newCompCode += signature + '\n';
newCompCode += groupCalls.join('\n') + '\n\n';

// The return block
const allNames = Array.from(extractedNames);
newCompCode += `  return Object.assign({}, \n    `;
newCompCode += Object.keys(groups).map(g => g.replace(/-/g, '_')).join(',\n    ');
newCompCode += `\n  );\n}\n`;

fs.writeFileSync(filePath, newCompCode);
console.log('Updated popup-components.js');
