const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'popup', 'popup.css');
let css = fs.readFileSync(cssPath, 'utf8');

let count = 0;
// We look for any property that uses color-mix and doesn't already have a fallback on the previous line.
// But it's easier to just blindly replace it if we ensure we don't double-fallback.

let lines = css.split('\n');
let newLines = [];

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('color-mix(') && !line.includes('var(--bg') && !line.includes('var(--red')) {
        // Skip root variables, they are fine, IDE mostly complains about actual rules.
        // Wait, the IDE complained about line 249, 331, 620, etc.
        // Let's check if it's a CSS property rule (not a CSS variable declaration, though it might complain there too).
        
        let match = line.match(/^(\s*)([a-zA-Z\-]+):\s*(color-mix\(in srgb, (var\([^)]+\)).*?\));/);
        if (match) {
            let indent = match[1];
            let prop = match[2];
            let colorMix = match[3];
            let varName = match[4];
            
            // Check if previous line is already a fallback
            if (newLines.length > 0 && newLines[newLines.length - 1].includes(`${prop}: ${varName};`)) {
                newLines.push(line);
                continue;
            }
            
            newLines.push(`${indent}${prop}: ${varName}; /* Fallback for Chrome < 111 */`);
            newLines.push(line);
            count++;
            continue;
        }
        
        // Also handle shorthand border: 1px solid color-mix(...)
        let borderMatch = line.match(/^(\s*)(border):\s*([^c]+)(color-mix\(in srgb, (var\([^)]+\)).*?\));/);
        if (borderMatch) {
            let indent = borderMatch[1];
            let prop = borderMatch[2];
            let prefix = borderMatch[3];
            let colorMix = borderMatch[4];
            let varName = borderMatch[5];
            
            if (newLines.length > 0 && newLines[newLines.length - 1].includes(`${prop}: ${prefix}${varName};`)) {
                newLines.push(line);
                continue;
            }
            
            newLines.push(`${indent}${prop}: ${prefix}${varName}; /* Fallback for Chrome < 111 */`);
            newLines.push(line);
            count++;
            continue;
        }
    }
    newLines.push(line);
}

fs.writeFileSync(cssPath, newLines.join('\n'), 'utf8');
console.log(`Added fallbacks for ${count} color-mix usages.`);
