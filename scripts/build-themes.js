const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/design-system/ui-styles');
const themesDir = path.join(__dirname, '../src/content/design-system/themes');
const cardStylesDir = path.join(__dirname, '../src/content/design-system/card-styles');

const getDirs = source => {
    if (!fs.existsSync(source)) return [];
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
};

const getFiles = source => {
    if (!fs.existsSync(source)) return [];
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.css'))
        .map(dirent => dirent.name);
};

// --- Build Color Themes ---
const themeEntryPoints = [];

getDirs(themesDir).forEach(dir => {
    const indexPath = path.join(themesDir, dir, 'index.css');
    if (fs.existsSync(indexPath)) {
        themeEntryPoints.push({ in: indexPath, out: path.join(dir, 'bundle') });
    }
});

console.log(`Building ${themeEntryPoints.length} color themes...`);
if (themeEntryPoints.length > 0) {
    esbuild.build({
        entryPoints: themeEntryPoints,
        bundle: true,
        outdir: path.join(__dirname, '../dist/themes'),
        minify: true,
        sourcemap: false,
        external: ['chrome-extension://*'],
        target: ['chrome100', 'safari14']
    }).catch(() => process.exit(1));
}

// --- Build UI Styles ---
const uiStyleEntryPoints = [];
getDirs(uiStylesDir).forEach(dir => {
    const indexPath = path.join(uiStylesDir, dir, 'index.css');
    if (fs.existsSync(indexPath)) {
        uiStyleEntryPoints.push({ in: indexPath, out: path.join(dir, 'bundle') });
    }
});

console.log(`Building ${uiStyleEntryPoints.length} UI styles...`);
if (uiStyleEntryPoints.length > 0) {
    esbuild.build({
        entryPoints: uiStyleEntryPoints,
        bundle: true,
        outdir: path.join(__dirname, '../dist/ui-styles'),
        minify: true,
        sourcemap: false,
        external: ['chrome-extension://*'],
        target: ['chrome100', 'safari14']
    }).catch(() => process.exit(1));
}

// --- Build Card Styles ---
const cardStyleEntryPoints = [];
getFiles(cardStylesDir).forEach(file => {
    const cardPath = path.join(cardStylesDir, file);
    const name = file.replace('.css', '');
    cardStyleEntryPoints.push({ in: cardPath, out: name });
});

console.log(`Building ${cardStyleEntryPoints.length} standalone card styles...`);
if (cardStyleEntryPoints.length > 0) {
    esbuild.build({
        entryPoints: cardStyleEntryPoints,
        bundle: true,
        outdir: path.join(__dirname, '../dist/card-styles'),
        minify: true,
        sourcemap: false,
        external: ['chrome-extension://*'],
        target: ['chrome100', 'safari14']
    }).catch(() => process.exit(1));
}
