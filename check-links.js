const fs = require('fs');
const path = require('path');

// 1. Get all setting keys from default-settings.js
const defaultSettingsContent = fs.readFileSync('src/shared/config/default-settings.js', 'utf8');
const settingsKeys = [...defaultSettingsContent.matchAll(/([\w\d_]+):\s+[^,]+/g)].map(m => m[1]);

// 2. Get all keys from popup-schema.js, safely (only items, not tabs/sections)
const popupSchemaContent = fs.readFileSync('src/popup/scripts/popup-schema.js', 'utf8');
let popupKeys = [];
const itemMatches = [...popupSchemaContent.matchAll(/items:\s*\[([\s\S]*?)\]/g)];
itemMatches.forEach(m => {
    const itemIds = [...m[1].matchAll(/id:\s*'([^']+)'/g)].map(mm => mm[1]);
    popupKeys = popupKeys.concat(itemIds);
});

// 3. Get all keys from GlobalLayoutManager
const glmContent = fs.readFileSync('src/content/global/layout/global-layout-manager.js', 'utf8');
const glmKeys = [...glmContent.matchAll(/([\w\d_]+):\s*'ypp-[^']+'/g)].map(m => m[1]);

// 4. Get all getConfigKey() from features
let featureKeys = [];
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/content').filter(f => f.endsWith('.js') || f.endsWith('.ts'));
files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const match = content.match(/getConfigKey\(\)\s*\{\s*return\s*'([^']+)'/);
    if (match) {
        featureKeys.push({key: match[1], file: f});
    }
});

// 5. Hardcoded items / special items
const specialHandling = ['homeColumns', 'searchColumns', 'searchLayout', 'sidebarLayout', 'autoVideoFilter', 'cleanSearch'];

console.log('=== POPUP KEYS WITHOUT BACKING ===');
const implementedKeys = new Set([...glmKeys, ...featureKeys.map(k => k.key), ...specialHandling]);
const popupKeysSet = new Set(popupKeys);

popupKeys.forEach(k => {
    if (!implementedKeys.has(k) && !k.endsWith('Slot') && k !== 'vsc_shortcuts_manager') {
        console.log(`Popup toggle '${k}' is NOT handled in GlobalLayoutManager nor any Feature.`);
    }
});

console.log('\n=== FEATURE KEYS NOT IN POPUP ===');
featureKeys.forEach(fk => {
    if (!popupKeysSet.has(fk.key)) {
        console.log(`Feature ${fk.file} listens to '${fk.key}', but it is NOT in popup-schema.`);
    }
});
