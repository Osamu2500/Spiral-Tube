const fs = require('fs');
const css = fs.readFileSync('src/content/card-styles/immersive-glass.css', 'utf8');
const replaced = css.replace(/html\[data-ypp-card-style='immersive-glass'\] ytd-rich-item-renderer/g, "html[data-ypp-card-style='immersive-glass'] :is(ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer)");
fs.writeFileSync('src/content/card-styles/immersive-glass.css', replaced);
console.log('Replaced successfully');
