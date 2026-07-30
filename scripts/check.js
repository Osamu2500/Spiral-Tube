const fs = require('fs');
const path = require('path');
const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');
const dirs = fs.readdirSync(uiStylesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'shared' && dirent.name !== 'search-card-compat')
    .map(dirent => dirent.name);

const migrated = [];
const unmigrated = [];

for (const dir of dirs) {
    const hasBase = fs.existsSync(path.join(uiStylesDir, dir, 'base'));
    if (hasBase) {
        migrated.push(dir);
    } else {
        unmigrated.push(dir);
    }
}

console.log('Migrated:', migrated.join(', '));
console.log('Unmigrated:', unmigrated.join(', '));
