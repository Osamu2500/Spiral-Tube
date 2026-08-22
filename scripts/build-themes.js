const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/design-system/ui-styles');
const themesDir = path.join(__dirname, '../src/content/design-system/themes');
const cardStylesDir = path.join(__dirname, '../src/content/design-system/card-styles');
const tempEntryPath = path.join(__dirname, '.temp-design-system-entry.css');

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

let themeImports = [];
let uiStyleImports = [];
let cardStyleImports = [];

// 1. Color Themes
getDirs(themesDir).forEach(dir => {
    const indexPath = path.join(themesDir, dir, 'index.css');
    if (fs.existsSync(indexPath)) {
        themeImports.push(`@import "../src/content/design-system/themes/${dir}/index.css";`);
    }
});

// 2. UI Styles
getDirs(uiStylesDir).forEach(dir => {
    const indexPath = path.join(uiStylesDir, dir, 'index.css');
    if (fs.existsSync(indexPath)) {
        uiStyleImports.push(`@import "../src/content/design-system/ui-styles/${dir}/index.css";`);
    }
});

// 3. Card Styles
getFiles(cardStylesDir).forEach(file => {
    cardStyleImports.push(`@import "../src/content/design-system/card-styles/${file}";`);
});

const buildBundle = (importsArray, tempFileName, outputFileName, typeName) => {
    if (importsArray.length === 0) return Promise.resolve();
    
    const tempPath = path.join(__dirname, tempFileName);
    fs.writeFileSync(tempPath, importsArray.join('\n'));
    console.log(`Building ${typeName} bundle from ${importsArray.length} files...`);

    return esbuild.build({
        entryPoints: [tempPath],
        bundle: true,
        outfile: path.join(__dirname, `../dist/${outputFileName}`),
        minify: true,
        sourcemap: false,
        external: ['chrome-extension://*'],
        target: ['chrome100', 'safari14']
    }).then(() => {
        console.log(`Successfully built dist/${outputFileName}`);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }).catch((err) => {
        console.error(`${typeName} Build failed:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        process.exit(1);
    });
};

Promise.all([
    buildBundle(themeImports, '.temp-themes-entry.css', 'themes-bundle.css', 'Color Themes'),
    buildBundle(uiStyleImports, '.temp-uistyles-entry.css', 'ui-styles-bundle.css', 'UI Styles'),
    buildBundle(cardStyleImports, '.temp-cardstyles-entry.css', 'card-styles-bundle.css', 'Card Styles')
]).then(() => {
    console.log('All 3 design system bundles built successfully.');
});
