const fs = require('fs');
const path = require('path');

const files = [
    { path: 'src/content/pages/home/declutter.css', ns: 'ypp-home-page' },
    { path: 'src/content/pages/watch/declutter.css', ns: 'ypp-watch-page' },
    { path: 'src/content/pages/search/declutter.css', ns: 'ypp-search-page' },
    { path: 'src/content/pages/shorts/declutter.css', ns: 'ypp-shorts-page' }
];

files.forEach(({path: relPath, ns}) => {
    const fullPath = path.join(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) return;
    let css = fs.readFileSync(fullPath, 'utf8');
    css = css.replace(/body\./g, 'body.' + ns + '.');
    css = css.replace(/body:/g, 'body.' + ns + ':');
    const doubleNs = ns + '.' + ns;
    css = css.replace(new RegExp(doubleNs, 'g'), ns);
    fs.writeFileSync(fullPath, css);
    console.log('Updated ' + relPath);
});
