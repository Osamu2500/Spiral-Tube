const fs = require('fs');
const path = require('path');

const srcRoot = path.resolve(__dirname, 'src/content');
const dsRoot = path.join(srcRoot, 'design-system');

// 1. Centralize Declutter Files
const declutterFiles = [
  path.join(srcRoot, 'global/declutter/global-declutter.css'),
  path.join(srcRoot, 'pages/home/declutter/home-declutter.css'),
  path.join(srcRoot, 'pages/search/declutter/search-declutter.css'),
  path.join(srcRoot, 'pages/watch/declutter/watch-declutter.css')
];

let combinedDeclutter = '/* \n   ==========================================================================\n   DECLUTTER (FEATURE HIDING)\n   ========================================================================== \n*/\n\n';

for (const f of declutterFiles) {
  if (fs.existsSync(f)) {
    combinedDeclutter += '/* --- ' + path.basename(f) + ' --- */\n';
    combinedDeclutter += fs.readFileSync(f, 'utf8') + '\n\n';
  }
}

const outDeclutter = path.join(dsRoot, 'features/declutter.css');
fs.writeFileSync(outDeclutter, combinedDeclutter, 'utf8');
console.log('Created: ' + outDeclutter);

// 2. Add to DS index.css
const dsIndexFile = path.join(dsRoot, 'index.css');
let dsIndex = fs.readFileSync(dsIndexFile, 'utf8');
if (!dsIndex.includes('./features/declutter.css')) {
  dsIndex = dsIndex.replace('/* 3. FEATURE TOGGLE CLASSES */', '/* 3. FEATURE TOGGLE CLASSES */\n@import "./features/declutter.css";');
  fs.writeFileSync(dsIndexFile, dsIndex, 'utf8');
  console.log('Updated index.css with declutter import');
}

// 3. Remove old imports
const importRegexes = [
  { file: path.join(srcRoot, 'global/styles/core-styles.css'), regex: /^@import\s+.*declutter\.css['"];?\r?\n?/gm },
  { file: path.join(dsRoot, 'pages/home.css'), regex: /^@import\s+.*declutter\.css['"];?\r?\n?/gm },
  { file: path.join(dsRoot, 'pages/watch.css'), regex: /^@import\s+.*declutter\.css['"];?\r?\n?/gm },
  { file: path.join(srcRoot, 'pages/search/styles/search-grid.css'), regex: /^@import\s+.*declutter\.css['"];?\r?\n?/gm }
];

for (const item of importRegexes) {
  if (fs.existsSync(item.file)) {
    let content = fs.readFileSync(item.file, 'utf8');
    content = content.replace(item.regex, '');
    fs.writeFileSync(item.file, content, 'utf8');
    console.log('Removed old imports from: ' + path.basename(item.file));
  }
}

// 4. Delete the original declutter files and empty ghost files
const ghostFiles = [
  ...declutterFiles,
  path.join(srcRoot, 'global/styles/account-menu.css'),
  path.join(srcRoot, 'global/styles/badges-toasts.css'),
  path.join(srcRoot, 'global/styles/filters.css'),
  path.join(srcRoot, 'global/styles/header-ast.css'),
  path.join(srcRoot, 'global/styles/header-nav.css'),
  path.join(srcRoot, 'global/styles/integrations.css'),
  path.join(srcRoot, 'global/styles/multi-select.css'),
  path.join(srcRoot, 'global/styles/player-modes.css'),
  path.join(srcRoot, 'global/styles/sidebar-ast.css'),
  path.join(srcRoot, 'global/styles/tabview-sidebar.css'),
  
  path.join(srcRoot, 'pages/history/styles/history-ast.css'),
  path.join(srcRoot, 'pages/history/styles/pages-history.css'),
  path.join(srcRoot, 'pages/home/styles/cards.css'),
  path.join(srcRoot, 'pages/home/styles/cinematic-theme.css'),
  path.join(srcRoot, 'pages/home/styles/home-ast.css'),
  path.join(srcRoot, 'pages/home/styles/pages-home.css'),
  path.join(srcRoot, 'pages/playlist/styles/pages-playlists.css'),
  path.join(srcRoot, 'pages/playlist/styles/playlist-ast.css'),
  path.join(srcRoot, 'pages/shorts/styles/pages-shorts.css'),
  path.join(srcRoot, 'pages/shorts/styles/shorts-ast.css'),
  path.join(srcRoot, 'pages/subscriptions/styles/deck-mode.css'),
  path.join(srcRoot, 'pages/subscriptions/styles/pages-subscriptions.css'),
  path.join(srcRoot, 'pages/subscriptions/styles/subscriptions-ast.css'),
  path.join(srcRoot, 'pages/subscriptions/styles/subscriptions.css'),
  path.join(srcRoot, 'pages/watch/player/player.css'),
  path.join(srcRoot, 'pages/watch/player/controls/sidebar-layout.css'),
  path.join(srcRoot, 'pages/watch/player/enhancements/video-speed-controller.css'),
  path.join(srcRoot, 'pages/watch/styles/comments.css'),
  path.join(srcRoot, 'pages/watch/styles/pages-watch.css')
];

for (const f of ghostFiles) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('Deleted: ' + path.basename(f));
  }
}
