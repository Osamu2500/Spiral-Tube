import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src/content');

const HOME_FEATURES = [
    'hide-explore-topics', 'hide-trending', 'hide-promos', 'hide-feed', 'hide-posts'
];

const WATCH_FEATURES = [
    'hide-video-title', 'hide-channel-bar', 'hide-video-description',
    'hide-action-buttons', 'hide-comments', 'hide-related',
    'hide-live-chat', 'hide-endscreens', 'hide-merch', 'hide-fundraiser',
    'hide-thanks-donate', 'hide-memberships', 'hide-ai-logo',
    'hide-player-branding', 'hide-player-topics', 'hide-annotations',
    'hide-video-cards', 'hide-paid-promotion', 'zen-mode'
];

const SEARCH_FEATURES = [
    'hide-search-shelves', 'hide-channel-cards', 'hide-voice-search',
    'hide-search-mixes', 'hide-search-playlists', 'hide-search-podcasts',
    'hide-search-music', 'hide-search-shorts'
];

const GLOBAL_FEATURES = [
    'hide-upload-button', 'hide-thumbnails', 'hide-metrics',
    'hide-country-code', 'hide-useless-guide-links', 'hide-sidebar',
    'hide-scrollbar', 'hide-mixes', 'hide-playlists', 'hide-podcasts',
    'hide-shorts', 'hide-shorts-interaction', 'watched-mode', 'ypp-hidden'
];

function determineCategory(selector) {
    if (!selector) return null;
    
    // Check if it's a hide class
    if (selector.includes('.ypp-hide-') || selector.includes('.ypp-zen-mode') || selector.includes('.ypp-watched-mode') || selector.includes('.ypp-hidden')) {
        for (const f of WATCH_FEATURES) {
            if (selector.includes(f)) return 'watch';
        }
        for (const f of SEARCH_FEATURES) {
            if (selector.includes(f)) return 'search';
        }
        for (const f of HOME_FEATURES) {
            if (selector.includes(f)) return 'home';
        }
        for (const f of GLOBAL_FEATURES) {
            if (selector.includes(f)) return 'global';
        }
        return 'global'; // fallback
    }
    return null;
}

const collected = {
    home: postcss.root(),
    watch: postcss.root(),
    search: postcss.root(),
    global: postcss.root()
};

function processCssFile(filePath) {
    const css = fs.readFileSync(filePath, 'utf8');
    try {
        const root = postcss.parse(css);
        let modified = false;

        root.walkRules(rule => {
            const cat = determineCategory(rule.selector);
            if (cat) {
                collected[cat].append(rule.clone());
                rule.remove();
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, root.toString(), 'utf8');
            console.log(`Extracted rules from ${filePath}`);
        }
    } catch (err) {
        console.error(`PostCSS Parse Error in ${filePath}:`, err.message);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.css') && !fullPath.includes('declutter.css')) { 
            // Don't extract from declutter.css, we will just parse it and delete it.
            processCssFile(fullPath);
        }
    }
}

// 1. Process declutter.css specifically, then delete it.
const declutterPath = path.join(SRC_DIR, 'global/styles/declutter.css');
if (fs.existsSync(declutterPath)) {
    const css = fs.readFileSync(declutterPath, 'utf8');
    try {
        const root = postcss.parse(css);
        root.walkRules(rule => {
            const cat = determineCategory(rule.selector) || 'global';
            collected[cat].append(rule.clone());
        });
        fs.unlinkSync(declutterPath);
        console.log("Processed and removed declutter.css");
    } catch (err) {
        console.error(`PostCSS Parse Error in ${declutterPath}:`, err.message);
    }
}

// 2. Process all other CSS files to extract remaining rules
walkDir(SRC_DIR);

// 3. Write out the new files
const outDirs = {
    home: path.join(SRC_DIR, 'pages/home/declutter'),
    watch: path.join(SRC_DIR, 'pages/watch/declutter'),
    search: path.join(SRC_DIR, 'pages/search/declutter'),
    global: path.join(SRC_DIR, 'global/declutter')
};

for (const [key, dir] of Object.entries(outDirs)) {
    fs.mkdirSync(dir, { recursive: true });
    const outFile = path.join(dir, `${key}-declutter.css`);
    fs.writeFileSync(outFile, collected[key].toString(), 'utf8');
    console.log(`Created ${outFile}`);
}
