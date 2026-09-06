const fs = require('fs');
const path = require('path');

const filesToFix = [
    "src/content/pages/shared-feed/features/channel-filters/channel-blacklist.js",
    "src/content/features/declutter/js/filters/state/blocklist-filter.js",
    "src/content/features/declutter/js/filters/state/live-filter.js",
    "src/content/features/declutter/js/filters/content/shorts-filter.js",
    "src/content/features/declutter/js/filters/content/playlists-filter.js",
    "src/content/features/declutter/js/filters/metadata/views-filter.js",
    "src/content/features/declutter/js/filters/content/mixes-filter.js",
    "src/content/features/declutter/js/filters/metadata/upload-date-filter.js",
    "src/content/features/declutter/js/filters/metadata/hide-watched.js",
    "src/content/features/declutter/js/filters/content/clickbait-filter.js",
    "src/content/components/feed-filter-bar/feature.js",
    "src/content/features/declutter/js/filters/content/feed-filter.js"
];

for (const rel of filesToFix) {
    const full = path.join(__dirname, rel);
    if (fs.existsSync(full)) {
        let content = fs.readFileSync(full, 'utf8');
        content = content.replace(/window\.YPP\.FeatureManager\.getFeature/g, "window.YPP.featureManager?.getFeature");
        fs.writeFileSync(full, content, 'utf8');
        console.log("Fixed " + rel);
    } else {
        console.log("Not found: " + rel);
    }
}
