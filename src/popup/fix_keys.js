const fs = require('fs');

const path = 'src/shared/i18n.js';
let content = fs.readFileSync(path, 'utf8');

// We need to replace keys like `        1440p: '...',` or `        myKey: '...',`
// with `        '1440p': '...',` and `        'myKey': '...',`
// But we should only do this inside the `dictionaries` object block.

const dictionariesStart = content.indexOf('const dictionaries = {');
if (dictionariesStart !== -1) {
    let before = content.substring(0, dictionariesStart);
    let dictBlock = content.substring(dictionariesStart);

    // Regex to match keys: spaces, then key, then colon, then quote
    // e.g. `        1440p: '1440p',`
    // Match `^(\s+)([a-zA-Z0-9_]+):\s*'` globally inside dictBlock
    dictBlock = dictBlock.replace(/^(\s+)([a-zA-Z0-9_]+):\s*'/gm, "$1'$2': '");

    fs.writeFileSync(path, before + dictBlock);
    console.log('Successfully quoted dictionary keys.');
} else {
    console.log('Dictionaries block not found.');
}
