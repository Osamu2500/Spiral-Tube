const fs = require('fs');
let code = fs.readFileSync('src/popup/scripts/ui/popup-icons.js', 'utf8');
code += '\n\nexport const P = (path) => path;\n';
fs.writeFileSync('src/popup/scripts/ui/popup-icons.js', code);
