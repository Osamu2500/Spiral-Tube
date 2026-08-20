const fs = require('fs');
const file = 'src/content/ui-styles/harry-potter/overrides.css';
let content = fs.readFileSync(file, 'utf8');

// Remove empty @keyframes
content = content.replace(/@keyframes\s*\n/g, '');

// Fix multi-line string in url()
content = content.replace(/url\("data:image\/svg\+xml;\s*\n\s*utf8,/g, 'url("data:image/svg+xml;utf8,');

fs.writeFileSync(file, content);
console.log('Fixed harry potter');
