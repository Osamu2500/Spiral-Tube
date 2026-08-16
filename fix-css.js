const fs = require('fs');
let css = fs.readFileSync('src/popup/popup-themes.css', 'utf8');

// 1. Remove all existing -webkit-backdrop-filter completely.
css = css.replace(/[ \t\n\r]*-webkit-backdrop-filter:[^;]+;/g, '');

// 2. Find every backdrop-filter and replace it with -webkit... then backdrop...
css = css.replace(/(backdrop-filter:[ \t\n\r]*([^;]+);)/g, '-webkit-backdrop-filter: $2; $1');

// 3. Fix color-mix for border: 1px dashed...
css = css.replace(/border:[ \t\n\r]*1px[ \t\n\r]+dashed[ \t\n\r]+color-mix\([^;]+\);/g, (match) => {
    return 'border: 1px dashed rgba(255, 255, 255, 0.3); ' + match;
});

// 4. Fix color-mix for border-color: ...
css = css.replace(/border-color:[ \t\n\r]*color-mix\([^;]+\);/g, (match) => {
    return 'border-color: rgba(255, 255, 255, 0.3); ' + match;
});

// 5. Fix color-mix for border: 2px solid...
css = css.replace(/border:[ \t\n\r]*2px[ \t\n\r]+solid[ \t\n\r]+color-mix\([^;]+\);/g, (match) => {
    return 'border: 2px solid rgba(255, 255, 255, 0.3); ' + match;
});

fs.writeFileSync('src/popup/popup-themes.css', css);
console.log('Fixed popup-themes.css safely');
