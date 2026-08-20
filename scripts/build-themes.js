const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');

const getDirs = source => fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// --- Build Color Themes ---
const themeEntryPoints = [];

getDirs(uiStylesDir).forEach(dir => {
    const embeddedThemePath = path.join(uiStylesDir, dir, 'theme', 'index.css');
    if (fs.existsSync(embeddedThemePath)) {
        themeEntryPoints.push({ in: embeddedThemePath, out: path.join(dir, 'theme', 'bundle') });
    }
});

console.log(`Building ${themeEntryPoints.length} color themes...`);
esbuild.build({
    entryPoints: themeEntryPoints,
    bundle: true,
    outdir: path.join(__dirname, '../dist/ui-styles'),
    minify: true,
    sourcemap: false,
    external: ['chrome-extension://*'],
    target: ['chrome100', 'safari14']
}).catch(() => process.exit(1));

// --- Build UI Styles ---
const uiStyleEntryPoints = [];
getDirs(uiStylesDir).forEach(dir => {
    const indexPath = path.join(uiStylesDir, dir, 'index.css');
    if (fs.existsSync(indexPath)) {
        uiStyleEntryPoints.push({ in: indexPath, out: path.join(dir, 'bundle') });
    }
});

console.log(`Building ${uiStyleEntryPoints.length} UI styles...`);
esbuild.build({
    entryPoints: uiStyleEntryPoints,
    bundle: true,
    outdir: path.join(__dirname, '../dist/ui-styles'),
    minify: true,
    sourcemap: false,
    external: ['chrome-extension://*'],
    target: ['chrome100', 'safari14']
}).catch(() => process.exit(1));

// --- Build Card Styles ---
const cardStyleEntryPoints = [];
getDirs(uiStylesDir).forEach(dir => {
    let cardPath = path.join(uiStylesDir, dir, 'card-style.css');
    if (!fs.existsSync(cardPath)) {
        cardPath = path.join(uiStylesDir, dir, 'components', 'cards.css');
    }
    if (fs.existsSync(cardPath)) {
        cardStyleEntryPoints.push({ in: cardPath, out: dir });
    }
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
