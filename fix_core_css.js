const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'content', 'features', 'global', 'core-styles.css');
let content = fs.readFileSync(cssPath, 'utf8');

// Replace aggressive html body rules with html:not([data-ypp-ui-style]) body
content = content.replace(/html body #actions-inner yt-button-shape button\[aria-label\*="Download" i\]/g, 'html:not([data-ypp-ui-style]) body #actions-inner yt-button-shape button[aria-label*="Download" i]');
content = content.replace(/html body #top-level-buttons-computed yt-button-shape button\[aria-label\*="Download" i\]/g, 'html:not([data-ypp-ui-style]) body #top-level-buttons-computed yt-button-shape button[aria-label*="Download" i]');
content = content.replace(/html body #flexible-item-buttons yt-button-shape button\[aria-label\*="Download" i\]/g, 'html:not([data-ypp-ui-style]) body #flexible-item-buttons yt-button-shape button[aria-label*="Download" i]');
content = content.replace(/html body ytd-watch-metadata yt-button-shape button\[aria-label\*="Download" i\]/g, 'html:not([data-ypp-ui-style]) body ytd-watch-metadata yt-button-shape button[aria-label*="Download" i]');
content = content.replace(/html body #actions-inner yt-button-shape button\[title\*="Download" i\]/g, 'html:not([data-ypp-ui-style]) body #actions-inner yt-button-shape button[title*="Download" i]');
content = content.replace(/html body #top-level-buttons-computed yt-button-shape button\[title\*="Download" i\]/g, 'html:not([data-ypp-ui-style]) body #top-level-buttons-computed yt-button-shape button[title*="Download" i]');
content = content.replace(/html body #flexible-item-buttons yt-button-shape button\[title\*="Download" i\]/g, 'html:not([data-ypp-ui-style]) body #flexible-item-buttons yt-button-shape button[title*="Download" i]');
content = content.replace(/html body ytd-watch-metadata yt-button-shape button\[title\*="Download" i\]/g, 'html:not([data-ypp-ui-style]) body ytd-watch-metadata yt-button-shape button[title*="Download" i]');

// Fix placement gaps
const placementFix = `
/* Fix huge gaps in Action Bar */
html body ytd-watch-metadata #actions-inner {
    justify-content: flex-end !important;
}
html body ytd-watch-metadata #top-level-buttons-computed {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 0 !important;
}
html body ytd-watch-metadata #flexible-item-buttons {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 0 !important;
}
`;

if (!content.includes('Fix huge gaps in Action Bar')) {
    content += '\n' + placementFix + '\n';
}

fs.writeFileSync(cssPath, content, 'utf8');
console.log('Fixed core-styles.css global rules.');
