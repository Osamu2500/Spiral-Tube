const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');
const sharedDir = path.join(uiStylesDir, 'shared');
const sharedCssPath = path.join(sharedDir, 'timeline-visibility.css');

if (!fs.existsSync(sharedDir)) {
    fs.mkdirSync(sharedDir, { recursive: true });
}

const cssContent = `/* ==========================================================================
   YouTube: Better timeline and text visibility (UserStyle #4708)
   ========================================================================== */

.ytp-time-current,
.ytp-time-separator,
.ytp-time-duration,
.ytp-chapter-title-content,
.ytp-tooltip-title > span {
  text-shadow: 1px 1px 2px black, 0 0 5px black !important;
}

.ytp-svg-shadow {
  stroke-opacity: 0.55 !important;
}

.ytp-chapter-hover-container {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.45), transparent) !important;
  box-sizing: border-box !important;
}

.ytp-chapter-hover-container::before, 
.ytp-chapter-hover-container::after {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  bottom: 0 !important;
  width: 2px !important;
  background: #fff !important;
  height: 140% !important;
  margin-top: -1px !important;
}

.ytp-chapter-hover-container::before {
  left: 0 !important;
}

.ytp-chapter-hover-container::after {
  right: 0 !important;
}

.ytp-chapter-hover-container:hover {
  border-right: solid #f1f1f1 5px !important;
  border-left: solid #fff 5px !important;
}

.caption-window.ytp-caption-window-bottom {
  background: transparent !important;
}
`;

fs.writeFileSync(sharedCssPath, cssContent, 'utf8');
console.log('Created shared CSS:', sharedCssPath);

const getDirs = source => fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'shared')
    .map(dirent => dirent.name);

const dirs = getDirs(uiStylesDir);
let modifiedCount = 0;

function cleanAndPrepend(filePath, importStmt) {
    if (!fs.existsSync(filePath)) return false;
    let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    // Remove any existing import of timeline-visibility.css
    lines = lines.filter(l => !l.includes('timeline-visibility.css'));
    // Prepend to top
    lines.unshift(importStmt);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    return true;
}

dirs.forEach(dir => {
    const dirPath = path.join(uiStylesDir, dir);
    let updated = false;

    // 1. Clean up pages/player.css if we previously touched it
    const playerCssPath = path.join(dirPath, 'pages', 'player.css');
    if (fs.existsSync(playerCssPath)) {
        let lines = fs.readFileSync(playerCssPath, 'utf8').split(/\r?\n/);
        const originalLen = lines.length;
        lines = lines.filter(l => !l.includes('timeline-visibility.css'));
        if (lines.length !== originalLen) {
            fs.writeFileSync(playerCssPath, lines.join('\n'), 'utf8');
        }
    }

    // 2. Update theme/index.css (e.g. for default color theme and others)
    const themeIndexPath = path.join(dirPath, 'theme', 'index.css');
    if (fs.existsSync(themeIndexPath)) {
        if (cleanAndPrepend(themeIndexPath, '@import "../../shared/timeline-visibility.css";')) {
            updated = true;
        }
    }

    // 3. Update main index.css of the UI style (e.g. glassmorphism, nature, etc.)
    const indexPath = path.join(dirPath, 'index.css');
    if (fs.existsSync(indexPath)) {
        if (cleanAndPrepend(indexPath, '@import "../shared/timeline-visibility.css";')) {
            updated = true;
        }
    }

    if (updated) {
        modifiedCount++;
    }
});

// Also update global player.css at the very top
const globalPlayerCssPath = path.join(__dirname, '../src/content/features/player/player.css');
if (fs.existsSync(globalPlayerCssPath)) {
    cleanAndPrepend(globalPlayerCssPath, '@import "../../ui-styles/shared/timeline-visibility.css";');
    console.log('Updated global player.css at the top.');
}

console.log(`Updated ${modifiedCount} UI styles/themes with timeline-visibility import at top.`);
