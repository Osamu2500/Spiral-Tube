const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    for (const [from, to] of Object.entries(replacements)) {
        if (content.includes(from)) {
            content = content.replaceAll(from, to);
            modified = true;
        }
    }
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
    }
}

// 1. core/popup-main.js
replaceInFile('src/popup/scripts/core/popup-main.js', {
    "from './popup-ui.js'": "from '../ui/popup-ui.js'",
    "from './popup-components.js'": "from '../ui/popup-components.js'",
    "from './popup-extras.js'": "from '../ui/popup-extras.js'",
    "from './popup-renderer.js'": "from '../ui/popup-renderer.js'"
});

// 2. core/popup-schema.js
replaceInFile('src/popup/scripts/core/popup-schema.js', {
    "from './popup-icons.js'": "from '../ui/popup-icons.js'"
});

// 3. ui/popup-renderer.js
replaceInFile('src/popup/scripts/ui/popup-renderer.js', {
    "from './popup-schema.js'": "from '../core/popup-schema.js'"
});

