const fs = require('fs');
const path = require('path');

const shortsPath = path.resolve(__dirname, '../src/content/design-system/features/declutter/shorts.css');
const blockerPath = path.resolve(__dirname, '../src/content/design-system/features/shorts-blocker.css');

// We'll regenerate shorts.css from split-declutter to avoid the UTF-16 mess
require('./split-declutter.js');

let shortsContent = fs.readFileSync(shortsPath, 'utf8');

// The split-declutter.js might have left a trailing comma in shorts.css at the very beginning because of how it split global.css
// Wait, no, split-declutter.js takes from declutter.css which doesn't have the missing bracket problem!
// Ah, declutter.css had a missing bracket? Let's check shortsContent

// Append blocker
const blockerContent = fs.readFileSync(blockerPath, 'utf8').replace(/\0/g, ''); // just in case it's UTF-16, but Node might handle it or we can do it safely
// Actually, fs.readFileSync with utf8 will read utf-16 as garbage if there's no BOM. 
// If it is UTF-16 LE:
let rawBlocker = fs.readFileSync(blockerPath);
let actualBlockerContent = '';
if (rawBlocker[0] === 0xFF && rawBlocker[1] === 0xFE) {
    actualBlockerContent = rawBlocker.toString('utf16le');
} else {
    actualBlockerContent = rawBlocker.toString('utf8');
}

// Remove null bytes just in case
actualBlockerContent = actualBlockerContent.replace(/\0/g, '');

fs.writeFileSync(shortsPath, shortsContent + '\n\n/* --- Nuke Shorts (From shorts-blocker.css) --- */\n' + actualBlockerContent);
console.log('Fixed shorts.css');

// Now remove the original blocker file
fs.unlinkSync(blockerPath);
