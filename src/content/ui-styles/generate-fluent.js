const fs = require('fs');
const path = 'f:/Youtube 2.0/src/content/ui-styles/fluent';
if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

let md = fs.readFileSync('C:/Users/2005g/.gemini/antigravity-ide/brain/5f9de040-1016-4ec0-a559-a3a5a46a3d0d/.system_generated/steps/285/content.md', 'utf8');
let css = md.substring(md.indexOf('/* ==UserStyle=='));

// Strip @-moz-document
css = css.replace(/@-moz-document[^{]+\{([\s\S]+)\}/, '$1');

// Basic prefixing
let prefixed = css.replace(/(^|\n|\})\s*([a-zA-Z\.#*\[][^{}]*?)\s*\{/g, (match, prefix, selector) => {
    if (selector.trim().startsWith('@')) return match;
    const parts = selector.split(',').map(s => 'html.yt-spiral-tube-theme[theme="fluent"] ' + s.trim());
    return prefix + '\n' + parts.join(',\n') + ' {';
});

fs.writeFileSync(path + '/bundle.css', prefixed);
fs.writeFileSync(path + '/manifest.json', JSON.stringify({
    id: 'fluent',
    name: 'Fluent UI',
    version: '1.3',
    description: 'Reverts YouTube Watch Page changes (Fluent UI)',
    type: 'youtube-page',
    primaryColor: '#333333',
    author: 'lightbeam'
}, null, 4));
console.log('Fluent theme generated.');
