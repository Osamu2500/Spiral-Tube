const fs = require('fs');
const file = 'f:/Youtube 2.0/src/shared/i18n.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/(off:\s*['"].*?['"],)/g, '$1\n        on_hover: \'On Hover\',\n        always: \'Always\',');
fs.writeFileSync(file, content);
