const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../src/content/design-system/features/declutter.css');
const css = fs.readFileSync(cssPath, 'utf8');

// A very naive CSS parser for this specific flat file
const blocks = [];
const regex = /([^{]+)\{([^}]+)\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
    const selectors = match[1].split(',').map(s => s.trim()).filter(s => s);
    const rules = match[2].split(';').map(r => r.trim()).filter(r => r);
    blocks.push({ selectors, rules });
}

// Aggregate by the main `.ypp-` class
const groups = {};

// We also have global utilities like .ypp-hidden, .ypp-hidden-duration, .ypp-hidden-short
const utilities = new Set();

for (const block of blocks) {
    for (const selector of block.selectors) {
        // Find the main ypp- class
        const classMatch = selector.match(/\.(ypp-[a-zA-Z0-9-]+)/);
        if (classMatch) {
            const className = classMatch[1];
            if (['ypp-hidden', 'ypp-hidden-duration', 'ypp-hidden-short', 'ypp-hidden-by-pipeline'].includes(className)) {
                utilities.add(block.rules.join('; ') + ';');
            } else {
                if (!groups[className]) groups[className] = new Set();
                groups[className].add(selector);
            }
        }
    }
}

let output = `/* 
 * ==========================================================================
 * DECLUTTER (FEATURE HIDING)
 * Centralizes all CSS for hiding specific elements across YouTube.
 * NO unrelated layout logic should be in this file.
 * ========================================================================== 
 */\n\n`;

output += `/* --- Utilities --- */\n`;
output += `.ypp-hidden, .ypp-hidden-short, .ypp-hidden-duration, .ypp-hidden-by-pipeline {\n  display: none !important;\n}\n\n`;

for (const [className, selectorsSet] of Object.entries(groups)) {
    // Sort selectors for consistency
    const selectors = Array.from(selectorsSet).sort();
    
    // Group into chunks of ~5 selectors per line for readability
    const formattedSelectors = selectors.join(',\n');
    
    // Most declutter rules are just display: none !important;
    // Except a few like watched-mode-dim, hide-scrollbar, hide-thumbnails
    // But wait, let's keep the rules the same as before if we can, but since 99% are display: none, we can check.
    
    // To be safe, we'll extract the rules for each selector from the original blocks
    const rulesMap = new Map();
    for (const block of blocks) {
        for (const selector of block.selectors) {
            if (selectorsSet.has(selector)) {
                rulesMap.set(selector, block.rules.join('; ') + ';');
            }
        }
    }
    
    // Group selectors by their rules
    const ruleGroups = {};
    for (const [selector, rule] of rulesMap.entries()) {
        if (!ruleGroups[rule]) ruleGroups[rule] = [];
        ruleGroups[rule].push(selector);
    }
    
    output += `/* --- ${className} --- */\n`;
    for (const [rule, ruleSelectors] of Object.entries(ruleGroups)) {
        output += `${ruleSelectors.join(',\n')} {\n  ${rule.split('; ').join(';\n  ')}\n}\n\n`;
    }
}

fs.writeFileSync(path.resolve(__dirname, 'declutter-clean.css'), output);
console.log('Cleaned up declutter.css into declutter-clean.css');
