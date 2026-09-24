const fs = require('fs');

const css = fs.readFileSync('src/content/features/popup-player/popup-player.css', 'utf8');
const bundlePath = 'src/content/features/popup-player/vendor/popup-player-bundle.js';
let bundle = fs.readFileSync(bundlePath, 'utf8');

if (!bundle.includes('ytpop-custom-injected-styles')) {
  const injectorCode = "\n;(() => {\n" +
    "  const s = document.createElement('style');\n" +
    "  s.id = 'ytpop-custom-injected-styles';\n" +
    "  s.textContent = `" + css.replace(/`/g, '\\`').replace(/\$/g, '\\$') + "` + '\\n' + `\n" +
    "  .ytpop-window-btn,\n" +
    "  .ytpop-grab-image-btn,\n" +
    "  .ytpop-copy-btn,\n" +
    "  .ytpop-settings-btn,\n" +
    "  .ytpop-info-trial-btn,\n" +
    "  .ytpop-pro-modal { display: none !important; width: 0 !important; height: 0 !important; overflow: hidden !important; pointer-events: none !important; opacity: 0 !important; margin: 0 !important; padding: 0 !important; }\n" +
    "  `;\n" +
    "  if (document.head) document.head.appendChild(s);\n" +
    "  else document.addEventListener('DOMContentLoaded', () => document.head.appendChild(s));\n" +
    "})();\n";
  
  bundle += injectorCode;
  fs.writeFileSync(bundlePath, bundle, 'utf8');
  console.log('Injected custom CSS directly into bundle JS');
} else {
  console.log('Already injected.');
}
