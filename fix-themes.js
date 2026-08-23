const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'content', 'design-system', 'themes');

function fixTheme(themeName) {
    const themePath = path.join(themesDir, themeName, 'index.css');
    if (!fs.existsSync(themePath)) return;
    
    let content = fs.readFileSync(themePath, 'utf8');
    
    // We only want to wrap floating variables.
    // Let's find the first variable assignment.
    
    const lines = content.split('\n');
    let insideWrapper = false;
    let newLines = [];
    let wrappedVars = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        if (line.trim().startsWith('@import')) {
            newLines.push(line);
            continue;
        }
        
        if (line.trim().startsWith('--ypp-')) {
            if (!insideWrapper) {
                newLines.push(`[data-ypp-theme="${themeName}"] {`);
                insideWrapper = true;
                wrappedVars = true;
            }
            
            // Clean up missing semicolons or unexpected !important spacing
            if (!line.trim().endsWith(';') && line.trim().length > 0) {
                line = line + ';';
            }
            newLines.push('    ' + line.trim());
        } else if (line.trim().startsWith('/*') && !insideWrapper) {
            // Keep comments but if we hit variables soon, we should probably wrap
            newLines.push(line);
        } else if (line.trim() === '' && insideWrapper) {
            newLines.push('');
        } else if (insideWrapper && !line.trim().startsWith('--ypp-') && !line.trim().startsWith('/*') && line.trim().length > 0) {
            // Reached the end of the variables block
            newLines.push('}');
            insideWrapper = false;
            newLines.push(line);
        } else {
            newLines.push(line);
        }
    }
    
    if (insideWrapper) {
        newLines.push('}');
    }
    
    // Write back if we made a change
    if (wrappedVars) {
        fs.writeFileSync(themePath, newLines.join('\n'), 'utf8');
        console.log(`Fixed ${themeName}`);
    }
}

const items = fs.readdirSync(themesDir, { withFileTypes: true });
for (const item of items) {
    if (item.isDirectory()) {
        fixTheme(item.name);
    }
}
