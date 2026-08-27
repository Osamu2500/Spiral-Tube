const fs = require('fs');
const file = 'src/content/pages/watch/layout/modes/sidebar-mode.css';
let content = fs.readFileSync(file, 'utf8');
content = "@layer ypp-overrides {\n" + content + "\n}";
fs.writeFileSync(file, content);
console.log('Wrapped sidebar-mode');
