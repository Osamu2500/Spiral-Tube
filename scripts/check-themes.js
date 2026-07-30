const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync(path.join(__dirname, '../src/content/ui-styles'), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'shared' && dirent.name !== 'search-card-compat')
    .map(dirent => dirent.name);

const html = fs.readFileSync(path.join(__dirname, '../src/popup/popup.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../src/popup/popup-components.js'), 'utf8');

const missingInHtml = [];
const missingInJs = [];

for (const dir of dirs) {
    if (!html.includes(`data-style="${dir}"`) && !html.includes(`data-theme="${dir}"`)) {
        missingInHtml.push(dir);
    }
    if (!js.includes(`key: '${dir}'`) && !js.includes(`key:"${dir}"`) && !js.includes(`key:\`${dir}\``)) {
        missingInJs.push(dir);
    }
}

console.log('Missing in HTML:', missingInHtml.join(', '));
console.log('Missing in JS:', missingInJs.join(', '));
