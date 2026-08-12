const fs = require('fs');
const path = require('path');

function processTheme(theme, primaryVar, loadRgba, fonts) {
    const dir = 'src/content/ui-styles/' + theme;
    function processDir(d) {
        if (!fs.existsSync(d)) return;
        let entries = fs.readdirSync(d, {withFileTypes: true});
        for (let entry of entries) {
            let full = path.join(d, entry.name);
            if (entry.isDirectory()) processDir(full);
            else if (full.endsWith('.css')) {
                let c = fs.readFileSync(full, 'utf8');
                
                c = c.replace(/#8b0000/g, primaryVar)
                     .replace(/rgba\(232,\s*213,\s*181,\s*0.3\)/g, loadRgba)
                     .replace(/Georgia,\s*\"Times New Roman\",\s*serif\s*!important;/g, fonts)
                     .replace(/border-radius:\s*0\s*!important;/g, 'border-radius: 50% !important;');

                fs.writeFileSync(full, c);
            }
        }
    }
    processDir(dir);
}

processTheme('abyss', 'var(--abyss-primary)', 'rgba(0, 229, 255, 0.3)', '\"Orbitron\", \"Inter\", sans-serif !important;');
processTheme('sakura', 'var(--sakura-primary)', 'rgba(255, 105, 180, 0.3)', '\"Outfit\", \"Quicksand\", sans-serif !important;');

console.log('Fixed player progress bars and leftover red colors!');
