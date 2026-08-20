const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../src/content');
const uiStylesDir = path.join(contentDir, 'ui-styles');
const themesDir = path.join(contentDir, 'themes');
const cardStylesDir = path.join(contentDir, 'card-styles');

if (!fs.existsSync(themesDir)) fs.mkdirSync(themesDir, { recursive: true });
if (!fs.existsSync(cardStylesDir)) fs.mkdirSync(cardStylesDir, { recursive: true });

function copyDirectoryRecursiveSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }
    const files = fs.readdirSync(source);
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectoryRecursiveSync(sourcePath, targetPath);
        } else {
            let content = fs.readFileSync(sourcePath, 'utf8');
            // Fix imports in theme files if they referenced ../../shared/
            if (file.endsWith('.css')) {
                // from ui-styles/<name>/theme/index.css to themes/<name>/index.css
                // ../../shared -> ../../ui-styles/shared
                content = content.replace(/@import\s+['"]\.\.\/\.\.\/shared\//g, `@import "../../ui-styles/shared/`);
                // if it referenced anything else up two levels, we might need to adjust, but mostly it's shared
            }
            fs.writeFileSync(targetPath, content);
        }
    });
}

function removeDirectoryRecursiveSync(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(file => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                removeDirectoryRecursiveSync(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}

const getDirs = source => fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

getDirs(uiStylesDir).forEach(dirName => {
    const uiStylePath = path.join(uiStylesDir, dirName);
    
    // 1. Move theme folder
    const themeFolderPath = path.join(uiStylePath, 'theme');
    if (fs.existsSync(themeFolderPath)) {
        const destThemePath = path.join(themesDir, dirName);
        copyDirectoryRecursiveSync(themeFolderPath, destThemePath);
        removeDirectoryRecursiveSync(themeFolderPath);
    }

    // 2. Move card style
    const cardStylePath = path.join(uiStylePath, 'card-style.css');
    const componentsCardStylePath = path.join(uiStylePath, 'components', 'cards.css');
    let movedCardStyle = false;
    
    if (fs.existsSync(cardStylePath)) {
        fs.renameSync(cardStylePath, path.join(cardStylesDir, `${dirName}.css`));
        movedCardStyle = true;
    } else if (fs.existsSync(componentsCardStylePath)) {
        fs.renameSync(componentsCardStylePath, path.join(cardStylesDir, `${dirName}.css`));
        movedCardStyle = true;
    }

    // 3. Update index.css
    const indexPath = path.join(uiStylePath, 'index.css');
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        let changed = false;
        if (indexContent.includes('./components/cards.css')) {
            indexContent = indexContent.replace(/@import\s+['"]\.\/components\/cards\.css['"];?/g, `@import "../../card-styles/${dirName}.css";`);
            changed = true;
        }
        if (indexContent.includes('./card-style.css')) {
            indexContent = indexContent.replace(/@import\s+['"]\.\/card-style\.css['"];?/g, `@import "../../card-styles/${dirName}.css";`);
            changed = true;
        }
        if (changed) {
            fs.writeFileSync(indexPath, indexContent);
        }
    }

    // 4. Check if directory is empty after moves
    function isDirEmpty(d) {
        const files = fs.readdirSync(d);
        if (files.length === 0) return true;
        for (const file of files) {
            const curPath = path.join(d, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                if (!isDirEmpty(curPath)) return false;
            } else {
                return false;
            }
        }
        return true;
    }
    
    if (isDirEmpty(uiStylePath)) {
        removeDirectoryRecursiveSync(uiStylePath);
        console.log(`Removed empty UI style folder: ${dirName}`);
    }
});

console.log("Migration complete!");
