const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../src/content/themes');
const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');

const getDirs = source => fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// --- Build Color Themes ---
const themeEntryPoints = [];
getDirs(themesDir).forEach(dir => {
    themeEntryPoints.push({ in: path.join(themesDir, dir, 'index.css'), out: path.join(dir, 'bundle') });
});

console.log(`Building ${themeEntryPoints.length} color themes...`);
esbuild.build({
    entryPoints: themeEntryPoints,
    bundle: true,
    outdir: themesDir,
    minify: true,
    sourcemap: false
}).catch(() => process.exit(1));

// --- Build UI Styles ---
const uiStyleEntryPoints = [];
getDirs(uiStylesDir).forEach(dir => {
    uiStyleEntryPoints.push({ in: path.join(uiStylesDir, dir, 'index.css'), out: path.join(dir, 'bundle') });
});

console.log(`Building ${uiStyleEntryPoints.length} UI styles...`);
esbuild.build({
    entryPoints: uiStyleEntryPoints,
    bundle: true,
    outdir: uiStylesDir,
    minify: true,
    sourcemap: false
}).catch(() => process.exit(1));
