const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, 'src', 'content', 'features', 'global', 'ui-tweaks', 'theme.js');
let content = fs.readFileSync(jsPath, 'utf8');

const injectionCode = `
        // V6 Hard Fix: Force the Download button to pretend it's a standard tonal button
        // so that all 80+ custom CSS themes will automatically style it correctly!
        if (window.YPP && window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('fix-download-btn-theme', 'ytd-watch-metadata yt-button-shape button[aria-label*="Download" i], ytd-watch-metadata yt-button-shape button[title*="Download" i]', (el) => {
                if (el.classList.contains('yt-spec-button-shape-next--call-to-action')) {
                    el.classList.remove('yt-spec-button-shape-next--call-to-action');
                    el.classList.add('yt-spec-button-shape-next--tonal');
                }
            });
        }
`;

if (!content.includes('fix-download-btn-theme')) {
    // Inject it into enable()
    content = content.replace(/(async enable\(\) \{[\s\S]*?this\._run\(this\.settings\);)/, `$1\n${injectionCode}`);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Successfully added fix-download-btn-theme to theme.js');
} else {
    console.log('fix-download-btn-theme already present.');
}
