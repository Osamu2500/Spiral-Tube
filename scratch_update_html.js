const fs = require('fs');
let html = fs.readFileSync('src/popup/popup.html', 'utf8');

// Update CSS links
html = html.replace('href="styles/fonts.css"', 'href="styles/core/fonts.css"');
html = html.replace('href="styles/popup.css"', 'href="styles/core/popup.css"');
html = html.replace('href="styles/popup-themes.css"', 'href="styles/components/popup-themes.css"');
html = html.replace('href="styles/history.css"', 'href="styles/components/history.css"');
html = html.replace('href="styles/bookmarks.css"', 'href="styles/components/bookmarks.css"');
html = html.replace('href="styles/theme-vars.css"', 'href="styles/core/theme-vars.css"');
html = html.replace('href="styles/popup-extracted.css"', 'href="styles/core/popup-extracted.css"');
html = html.replace('href="styles/popup-chips.css"', 'href="styles/components/popup-chips.css"');

// Update JS links
html = html.replace('src="scripts/anime.min.js"', 'src="scripts/animations/anime.min.js"');
html = html.replace('src="scripts/popup-animations.js"', 'src="scripts/animations/popup-animations.js"');
html = html.replace('src="scripts/popup-glow.js"', 'src="scripts/ui/popup-glow.js"');
html = html.replace('src="scripts/popup-main.js"', 'src="scripts/core/popup-main.js"');

fs.writeFileSync('src/popup/popup.html', html);
console.log('Updated popup.html');
