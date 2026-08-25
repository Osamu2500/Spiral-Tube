const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'content');


function getRelativePath(fromFile, toFile) {
    let rel = path.relative(path.dirname(fromFile), toFile);
    // Replace windows backslashes with forward slashes
    rel = rel.replace(/\\/g, '/');
    if (!rel.startsWith('.')) {
        rel = './' + rel;
    }
    return rel;
}

const baseFeaturePath = path.join(srcDir, 'core', 'system', 'base-feature.js');
const baseFilterFeaturePath = path.join(srcDir, 'global', 'filters', 'base-filter-feature.js');
const basePageManagerPath = path.join(srcDir, 'core', 'system', 'base-page-manager.js');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            if (content.includes('extends window.YPP.features.BaseFeature') || content.includes('extends (window.YPP.features.BaseFeature')) {
                if (!content.includes('base-feature.js')) {
                    const relPath = getRelativePath(fullPath, baseFeaturePath);
                    content = `import '${relPath}';\n` + content;
                    modified = true;
                }
            }
            if (content.includes('extends window.YPP.features.BaseFilterFeature')) {
                if (!content.includes('base-filter-feature.js')) {
                    const relPath = getRelativePath(fullPath, baseFilterFeaturePath);
                    content = `import '${relPath}';\n` + content;
                    modified = true;
                }
            }
            if (content.includes('extends window.YPP.BasePageManager')) {
                if (!content.includes('base-page-manager.js')) {
                    const relPath = getRelativePath(fullPath, basePageManagerPath);
                    content = `import '${relPath}';\n` + content;
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDir(srcDir);
