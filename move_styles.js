const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, 'src/content/ui-styles');
const themesDir = path.join(__dirname, 'src/content/themes');
const cardStylesDir = path.join(__dirname, 'src/content/card-styles');

const getDirs = source => fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const uiStyles = getDirs(uiStylesDir);

uiStyles.forEach(style => {
    // Move Theme
    const themePath = path.join(themesDir, style);
    if (fs.existsSync(themePath)) {
        const destThemePath = path.join(uiStylesDir, style, 'theme');
        console.log(`Moving theme ${style} to ${destThemePath}`);
        fs.renameSync(themePath, destThemePath);
    }

    // Move Card Style
    const cardStylePath = path.join(cardStylesDir, `${style}.css`);
    if (fs.existsSync(cardStylePath)) {
        const destCardStylePath = path.join(uiStylesDir, style, 'card-style.css');
        console.log(`Moving card style ${style}.css to ${destCardStylePath}`);
        fs.renameSync(cardStylePath, destCardStylePath);
    }
});
console.log('Done!');
