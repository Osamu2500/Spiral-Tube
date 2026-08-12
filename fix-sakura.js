const fs = require('fs');
const path = require('path');
const sakuraDir = 'src/content/ui-styles/sakura';

function processDir(dir) {
  let entries = fs.readdirSync(dir, {withFileTypes: true});
  for (let entry of entries) {
    let full = path.join(dir, entry.name);
    if (entry.isDirectory()) processDir(full);
    else if (full.endsWith('.css')) {
      let c = fs.readFileSync(full, 'utf8');
      
      // Fix Card Style selector
      c = c.replace(/data-ypp-card-style=[\"']vintage[\"']/g, 'data-ypp-card-style=\"sakura\"');
      
      // Fix background hardcoded vintage colors
      c = c.replace(/#e8d5b5/g, 'var(--sakura-bg)')
           .replace(/#f4ecd8/g, 'var(--sakura-card)')
           .replace(/#1a1410/g, 'var(--sakura-bg)')
           .replace(/#2c1f14/g, 'var(--sakura-secondary)')
           .replace(/#3e352f/g, 'var(--sakura-primary)')
           .replace(/#5c3d2e/g, 'var(--sakura-secondary)')
           .replace(/#d1c0a5/g, 'var(--sakura-bg)')
           .replace(/#c13a3a/g, 'var(--sakura-primary)')
           .replace(/#4a2a3e/g, 'var(--sakura-primary)')
           .replace(/#d4c098/g, 'var(--sakura-card)');

      // Fix dashed borders
      c = c.replace(/2px dashed/g, '1px solid')
           .replace(/1px dashed/g, '1px solid');
           
      // Fix border radius for sakura petals (asymmetric like 0 24px 24px 0 or something similar, let's use 24px 0 24px 0 for petals!)
      c = c.replace(/border-radius:\s*4px/g, 'border-radius: 24px 0 24px 0')
           .replace(/border-radius:\s*2px/g, 'border-radius: 12px 0 12px 0');

      // Fix fonts in tokens.css
      if (full.includes('tokens.css')) {
          c = c.replace(/\"Georgia\"[\s\S]*?serif\s*!important;/g, '\"Outfit\", \"Quicksand\", sans-serif !important;')
               .replace(/Georgia,\s*\"Times New Roman\",\s*serif\s*!important;/g, '\"Outfit\", \"Quicksand\", sans-serif !important;');
               
          // Also set the correct Sakura colors if they are still vintage
          c = c.replace(/--sakura-primary:\s*#c13a3a;/g, '--sakura-primary: #ff69b4;')
               .replace(/--sakura-secondary:\s*#5c3d2e;/g, '--sakura-secondary: #ff1493;')
               .replace(/--sakura-bg:\s*#e8d5b5;/g, '--sakura-bg: #ffe4e1;')
               .replace(/--sakura-card:\s*#f4ecd8;/g, '--sakura-card: #fff0f5;');
      }
      
      fs.writeFileSync(full, c);
    }
  }
}
processDir(sakuraDir);
console.log('Fixed Sakura theme colors, shapes, and fonts!');
