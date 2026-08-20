const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');

const getDirs = source => fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

getDirs(uiStylesDir).forEach(dirName => {
    const indexPath = path.join(uiStylesDir, dirName, 'index.css');
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        let changed = false;

        // Match both "./components/cards.css" and "components/cards.css"
        const regex1 = /@import\s+['"](?:\.\/)?components\/cards\.css['"];?/g;
        if (regex1.test(content)) {
            content = content.replace(regex1, `@import "../../card-styles/${dirName}.css";`);
            changed = true;
        }

        const regex2 = /@import\s+['"](?:\.\/)?card-style\.css['"];?/g;
        if (regex2.test(content)) {
            content = content.replace(regex2, `@import "../../card-styles/${dirName}.css";`);
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(indexPath, content);
            console.log(`Updated imports in ${dirName}/index.css`);
        }
    }
});

console.log('Fix complete!');
