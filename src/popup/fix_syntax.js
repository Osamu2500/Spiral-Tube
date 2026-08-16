const fs = require('fs');
const path = 'src/shared/i18n.js';
let data = fs.readFileSync(path, 'utf8');

// The file currently has:
// const dictionaries = {
//     'it': { ... },
// ...
//     'sv': { ... },
// 
// // MASTER DICTIONARY
// // ...
// const dictionaries = {
// 
//     // ENGLISH

// I want to remove the first `const dictionaries = {` and insert the languages directly inside the SECOND `const dictionaries = {`.

const regex = /const dictionaries = \{\s*'it': \{[\s\S]*?'sv': \{[^\n]*\n/;
const match = data.match(regex);

if (match) {
    let extracted = match[0];
    
    // Remove the `const dictionaries = {` part from the extracted block
    extracted = extracted.replace('const dictionaries = {\n', '');
    
    // Remove the bad block from the top
    data = data.replace(regex, '');
    
    // Insert inside the REAL `const dictionaries = {`
    data = data.replace('const dictionaries = {', 'const dictionaries = {\n' + extracted);
    
    fs.writeFileSync(path, data);
    console.log('Fixed double const dictionaries syntax error.');
} else {
    console.log('Failed to match the broken block.');
}
