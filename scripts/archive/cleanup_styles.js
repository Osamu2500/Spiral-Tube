const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');

const validUIStyles = ['default', 'abyss', 'anime', 'aurora', 'autumn', 'bento', 'bloodmoon', 'blue-sky', 'brutalism', 'cairo-red', 'cherry', 'christmas', 'claymorphism', 'colorize', 'crystal-glass', 'cyberpunk', 'deepspace', 'fluent', 'frutiger-aero', 'galaxy', 'glassmorphism', 'gothic', 'grunge', 'harry-potter', 'hologram', 'ice-blue', 'kawaii', 'liquid-glass', 'material', 'matrix', 'maximalism', 'minimalism', 'nature', 'nebula', 'neo-brutalism', 'neumorphic', 'ocean', 'origami', 'outrun', 'pink', 'retro', 'retro-wave', 'retrowave-green', 'steampunk', 'technozen', 'terminalism', 'vaporwave', 'vintage', 'sakura', 'woodblock', 'y2k'];

const whitelist = ['shared', 'player-retouch', 'blood-moon']; // Wait, blood-moon is in whitelist? Let's check. Wait, bloodmoon is in validUIStyles. I'll just whitelist `shared` and `player-retouch`.
whitelist.push(...validUIStyles);

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
    if (!whitelist.includes(dirName)) {
        console.log(`Deleting leftover folder: ${dirName}`);
        removeDirectoryRecursiveSync(path.join(uiStylesDir, dirName));
    }
});

console.log("Cleanup complete!");
