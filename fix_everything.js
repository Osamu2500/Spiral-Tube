const fs = require('fs');
const path = require('path');

// 1. Fix the JavaScript error in theme.js
const themeJsPath = path.join(__dirname, 'src', 'content', 'features', 'global', 'ui-tweaks', 'theme.js');
let themeJs = fs.readFileSync(themeJsPath, 'utf8');

// Replace the buggy single-element callback with an array-based one
const badCallback = `(el) => {
                if (el.classList.contains('yt-spec-button-shape-next--call-to-action')) {
                    el.classList.remove('yt-spec-button-shape-next--call-to-action');
                    el.classList.add('yt-spec-button-shape-next--tonal');
                }
            }`;
            
const goodCallback = `(elements) => {
                elements.forEach(el => {
                    if (el && el.classList && el.classList.contains('yt-spec-button-shape-next--call-to-action')) {
                        el.classList.remove('yt-spec-button-shape-next--call-to-action');
                        el.classList.add('yt-spec-button-shape-next--tonal');
                    }
                });
            }`;

if (themeJs.includes(badCallback)) {
    themeJs = themeJs.replace(badCallback, goodCallback);
    fs.writeFileSync(themeJsPath, themeJs, 'utf8');
    console.log('Fixed JS array callback bug in theme.js');
}

// 2. Fix the CSS placement for ALL themes
const cssPath = path.join(__dirname, 'src', 'content', 'features', 'global', 'core-styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace the previous placement fix with a much stronger one
const oldPlacementFix = `/* Fix huge gaps in Action Bar */
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
}`;

const newPlacementFix = `/* Fix huge gaps in Action Bar */
html[data-ypp-ui-style] body ytd-watch-metadata #actions.ytd-watch-metadata,
html[data-ypp-ui-style] body ytd-watch-metadata #actions-inner {
    justify-content: flex-end !important;
    flex-grow: 1 !important;
    width: auto !important;
}
html[data-ypp-ui-style] body ytd-watch-metadata #top-level-buttons-computed,
html[data-ypp-ui-style] body ytd-watch-metadata #flexible-item-buttons {
    flex: 0 0 auto !important;
    margin: 0 !important;
    padding: 0 !important;
    justify-content: flex-end !important;
}`;

if (css.includes('/* Fix huge gaps in Action Bar */')) {
    // If we already have a block, replace it entirely
    const blockStart = css.indexOf('/* Fix huge gaps in Action Bar */');
    css = css.substring(0, blockStart) + newPlacementFix + '\n';
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Updated core-styles.css with stronger placement rules');
}

