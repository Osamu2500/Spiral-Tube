const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, 'src', 'content', 'entry', 'main.js');
let content = fs.readFileSync(mainJsPath, 'utf8');

const injectionCode = `
            // V6 Hard Fix: Force the Download button to pretend it's a standard tonal button
            // so that all custom CSS themes will automatically style it correctly!
            if (window.YPP.sharedObserver) {
                window.YPP.sharedObserver.register('fix-download-btn-theme', 'ytd-watch-metadata yt-button-shape button[aria-label*="Download" i], ytd-watch-metadata yt-button-shape button[title*="Download" i]', (elements) => {
                    elements.forEach(el => {
                        if (el && el.classList && el.classList.contains('yt-spec-button-shape-next--call-to-action')) {
                            el.classList.remove('yt-spec-button-shape-next--call-to-action');
                            el.classList.add('yt-spec-button-shape-next--tonal');
                        }
                    });
                });
            }
`;

if (!content.includes('fix-download-btn-theme')) {
    // Inject it into initFeatureManager after sharedObserver starts
    content = content.replace(/(if \(\!window\.YPP\.sharedObserver\.isRunning\) \{\s*window\.YPP\.sharedObserver\.start\(\);\s*\})/, `$1\n${injectionCode}`);
    fs.writeFileSync(mainJsPath, content, 'utf8');
    console.log('Successfully added fix-download-btn-theme to main.js');
} else {
    console.log('Already exists in main.js');
}
