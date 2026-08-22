const fs = require('fs');
const path = require('path');

const coreDir = path.join(__dirname, '../src/content/core-framework');

const replacements = [
    { regex: /background:\s*#a3e635\s*!important;/g, replace: 'background: var(--ypp-primary-accent, #a3e635) !important;' },
    { regex: /color:\s*#a3e635\s*!important;/g, replace: 'color: var(--ypp-primary-accent, #a3e635) !important;' },
    { regex: /color:\s*#166534\s*!important;/g, replace: 'color: var(--ypp-text-primary, #ffffff) !important;' },
    { regex: /fill:\s*#166534\s*!important;/g, replace: 'fill: var(--ypp-text-primary, #ffffff) !important;' },
    { regex: /color:\s*#14532d\s*!important;/g, replace: 'color: var(--ypp-text-primary, #ffffff) !important;' },
    { regex: /fill:\s*#14532d\s*!important;/g, replace: 'fill: var(--ypp-text-primary, #ffffff) !important;' },
    { regex: /color:\s*#0f0f0f\s*!important;/g, replace: 'color: var(--ypp-text-primary, #ffffff) !important;' },
    { regex: /color:\s*#ecfdf5\s*!important;/g, replace: 'color: var(--ypp-text-primary, #ffffff) !important;' },
    
    // Transparent Nature greens -> generic neutral surface bg
    { regex: /background:\s*rgba\(\s*163\s*,\s*230\s*,\s*53\s*,\s*0\.\d+\s*\)\s*!important;/g, replace: 'background: var(--ypp-surface-bg-hover) !important;' },
    { regex: /background:\s*rgba\(\s*34\s*,\s*197\s*,\s*94\s*,\s*0\.\d+\s*\)\s*!important;/g, replace: 'background: var(--ypp-surface-bg-active) !important;' },
    { regex: /background:\s*rgba\(\s*18\s*,\s*28\s*,\s*18\s*,\s*0\.\d+\s*\)\s*!important;/g, replace: 'background: var(--ypp-surface-bg) !important;' },
    { regex: /background:\s*rgba\(\s*143\s*,\s*188\s*,\s*143\s*,\s*0\.\d+\s*\)\s*!important;/g, replace: 'background: var(--ypp-surface-bg) !important;' },
    
    // Solid nature greens
    { regex: /background:\s*#064e3b\s*!important;/g, replace: 'background: var(--ypp-surface-bg) !important;' },
    { regex: /background:\s*#e8f5e9\s*!important;/g, replace: 'background: var(--ypp-surface-bg) !important;' },
    { regex: /background:\s*linear-gradient\([^)]+\)\s*!important;/g, replace: 'background: var(--ypp-surface-bg) !important;' },
    
    // Border nature greens
    { regex: /border:\s*1px\s*solid\s*rgba\(\s*163\s*,\s*230\s*,\s*53\s*,\s*0\.\d+\s*\)\s*!important;/g, replace: 'border: var(--ypp-surface-border) !important;' },
    { regex: /border:\s*1px\s*solid\s*#c8e6c9\s*!important;/g, replace: 'border: var(--ypp-surface-border) !important;' },
    { regex: /border-left:\s*1px\s*solid\s*#c8e6c9\s*!important;/g, replace: 'border-left: var(--ypp-surface-border) !important;' },
    { regex: /border:\s*3px\s*solid\s*#e8f5e9\s*!important;/g, replace: 'border: var(--ypp-surface-border) !important;' },

    // Chip variables
    { regex: /--chip-bg:\s*rgba\(\s*18\s*,\s*28\s*,\s*18\s*,\s*0\.\d+\s*\);/g, replace: '--chip-bg: var(--ypp-surface-bg);' },
    { regex: /--chip-bg-selected:\s*rgba\(\s*163\s*,\s*230\s*,\s*53\s*,\s*0\.\d+\s*\);/g, replace: '--chip-bg-selected: var(--ypp-primary-accent);' },
    { regex: /--chip-border:\s*1px\s*solid\s*rgba\(\s*163\s*,\s*230\s*,\s*53\s*,\s*0\.\d+\s*\);/g, replace: '--chip-border: var(--ypp-surface-border);' },
    { regex: /--chip-border-selected:\s*1px\s*solid\s*#65a30d;/g, replace: '--chip-border-selected: 1px solid var(--ypp-primary-accent);' },
];

function processDir(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            replacements.forEach(r => {
                if (r.regex.test(content)) {
                    content = content.replace(r.regex, r.replace);
                    modified = true;
                }
            });
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Cleaned ${fullPath}`);
            }
        }
    });
}

processDir(coreDir);
console.log('Cleanup complete.');
