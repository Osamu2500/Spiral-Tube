
const fs = require('fs');
const defaultTokens = fs.readFileSync('src/content/themes/default/base/tokens.css', 'utf8');
const coreTokens = fs.readFileSync('src/content/core-framework/base/tokens.css', 'utf8');

if (!coreTokens.includes('data-ypp-theme')) {
    fs.appendFileSync('src/content/core-framework/base/tokens.css', '\n/* === DEFAULT THEME TOKENS === */\n' + defaultTokens);
}

const sharedOverrides = fs.readFileSync('src/content/ui-styles/shared/overrides.css', 'utf8');
fs.appendFileSync('src/content/core-framework/pages/player.css', '\n' + sharedOverrides);
console.log('Done');

