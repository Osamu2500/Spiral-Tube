const fs = require('fs');
const files = fs.readdirSync('src/popup/scripts/schema');
files.forEach(file => {
    if (file.startsWith('tab-') && file.endsWith('.js')) {
        const p = 'src/popup/scripts/schema/' + file;
        let code = fs.readFileSync(p, 'utf8');
        code = code.replace(/import \{ ICONS \} from '\.\.\/ui\/popup-icons\.js';/, "import { ICONS, P } from '../ui/popup-icons.js';");
        fs.writeFileSync(p, code);
    }
});
console.log('Added P to imports');
