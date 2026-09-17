const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('.');

// 1. String replacements inside files
const replacements = [
    [/global-bar/g, 'global-bar'],
    [/globalBar/g, 'globalBar'],
    [/GlobalBar/g, 'GlobalBar'],
    [/equaliser/g, 'equaliser'],
    [/equaliser/g, 'equaliser'],
    [/Equaliser/g, 'Equaliser']
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated content:', f);
    }
});

// 2. Rename files
const allFiles = walk('.');
let toRename = [];
allFiles.forEach(f => {
    const base = path.basename(f);
    if (base.includes('equaliser') || base.includes('global-bar')) {
        toRename.push(f);
    }
});

toRename.forEach(f => {
    const dir = path.dirname(f);
    const base = path.basename(f);
    const newBase = base.replace(/global-bar/g, 'global-bar').replace(/equaliser/g, 'equaliser');
    const newPath = path.join(dir, newBase);
    fs.renameSync(f, newPath);
    console.log('Renamed file:', f, '->', newPath);
});

// 3. Rename directories
function walkDirs(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
                results.push(file);
                results = results.concat(walkDirs(file));
            }
        }
    });
    return results;
}

let allDirs = walkDirs('.');
// Sort by length descending to rename deepest first
allDirs.sort((a, b) => b.length - a.length);

allDirs.forEach(d => {
    const base = path.basename(d);
    if (base.includes('equaliser') || base.includes('global-bar')) {
        const parent = path.dirname(d);
        const newBase = base.replace(/global-bar/g, 'global-bar').replace(/equaliser/g, 'equaliser');
        const newPath = path.join(parent, newBase);
        fs.renameSync(d, newPath);
        console.log('Renamed dir:', d, '->', newPath);
    }
});
