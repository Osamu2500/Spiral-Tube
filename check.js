const fs = require('fs');
const dirs = fs.readdirSync('src/content/ui-styles', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'shared' && dirent.name !== 'search-card-compat')
    .map(dirent => dirent.name);

const migrated = [];
const unmigrated = [];

for (const dir of dirs) {
    const hasBase = fs.existsSync(`src/content/ui-styles/${dir}/base`);
    if (hasBase) {
        migrated.push(dir);
    } else {
        unmigrated.push(dir);
    }
}

console.log('Migrated:', migrated.join(', '));
console.log('Unmigrated:', unmigrated.join(', '));
