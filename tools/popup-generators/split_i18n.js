const fs = require('fs');
const path = require('path');

const i18nPath = path.join('F:', 'Youtube 2.0', 'src', 'shared', 'i18n.js');
const localesDir = path.join('F:', 'Youtube 2.0', 'src', 'shared', 'locales');

if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
}

const content = fs.readFileSync(i18nPath, 'utf8');

// Find the start of dictionaries object
const dictStart = content.indexOf('const dictionaries = {');
// Find the end of dictionaries object (before export const initI18n)
const dictEnd = content.indexOf('export const initI18n');

if (dictStart === -1 || dictEnd === -1) {
    console.error('Could not find dictionaries object');
    process.exit(1);
}

// Extract the object string
// We need to carefully find where the dictionaries object ends.
// Since it's followed by export const initI18n, the object ends somewhere before it.
// Let's just grab the whole block and evaluate it.
let dictBlock = content.substring(dictStart, dictEnd);

// Replace const dictionaries = with module.exports =
dictBlock = dictBlock.replace('const dictionaries = ', 'module.exports = ');
// Remove any trailing semicolons or comments before initI18n
dictBlock = dictBlock.substring(0, dictBlock.lastIndexOf(';'));

const tempPath = path.join(__dirname, 'temp_dict.js');
fs.writeFileSync(tempPath, dictBlock);

try {
    const dictionaries = require(tempPath);
    for (const [lang, translations] of Object.entries(dictionaries)) {
        const fileContent = 'export default ' + JSON.stringify(translations, null, 4) + ';\n';
        fs.writeFileSync(path.join(localesDir, lang + '.js'), fileContent);
        console.log('Created ' + lang + '.js');
    }
} catch (e) {
    console.error('Error evaluating dictionaries:', e);
} finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
}

