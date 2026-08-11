const fs = require('fs');
const path = require('path');

const stylesDir = 'src/content/ui-styles';
const targets = [
    "abyss", "autumn", "brutalism", "cherry", "deepspace", 
    "material", "maximalism", "minimalism", "nebula", "outrun", 
    "player-retouch", "startube"
];

function generateComponents(themeName) {
    // Generate massive components CSS file that modifies shapes, text, fonts, buttons, shadows
    
    // Determine a base font for the theme
    let font = 'Inter, Roboto, sans-serif';
    if (themeName === 'brutalism') font = '"Space Mono", monospace';
    if (themeName === 'cherry') font = '"Comic Sans MS", "Quicksand", sans-serif';
    if (themeName === 'maximalism') font = '"Impact", sans-serif';
    if (themeName === 'outrun') font = '"Press Start 2P", "Courier New", monospace';
    if (themeName === 'material' || themeName === 'minimalism') font = '"Product Sans", "Google Sans", sans-serif';
    
    let radius = '8px';
    if (themeName === 'material') radius = '24px';
    if (themeName === 'minimalism') radius = '12px';
    if (themeName === 'brutalism' || themeName === 'maximalism') radius = '0px';
    if (themeName === 'cherry') radius = '30px';

    return `
/* Massive UI Component Expansion for ${themeName} */

html, body, [dark] {
  --ypp-${themeName}-font: ${font} !important;
  --ypp-${themeName}-radius: ${radius} !important;
  font-family: var(--ypp-${themeName}-font) !important;
}

* {
  font-family: var(--ypp-${themeName}-font) !important;
}

/* Typography Enhancements */
h1, h2, h3, h4, h5, h6, 
yt-formatted-string, 
.title, 
#video-title {
  font-family: var(--ypp-${themeName}-font) !important;
  letter-spacing: 0.5px !important;
}

#video-title {
  font-weight: 700 !important;
  line-height: 1.4 !important;
}

/* Card Shapes and Layouts */
ytd-rich-item-renderer, 
ytd-video-renderer, 
ytd-playlist-renderer {
  border-radius: var(--ypp-${themeName}-radius) !important;
  overflow: hidden !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  padding: 8px !important;
}

ytd-rich-item-renderer:hover, 
ytd-video-renderer:hover {
  transform: translateY(-4px) !important;
}

/* Thumbnails */
ytd-thumbnail, yt-image {
  border-radius: calc(var(--ypp-${themeName}-radius) - 4px) !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
}

ytd-thumbnail:hover yt-image {
  transform: scale(1.05) !important;
}

/* Masthead (Top Nav) */
ytd-masthead {
  padding: 0 16px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
  border-radius: 0 0 var(--ypp-${themeName}-radius) var(--ypp-${themeName}-radius) !important;
}

/* Search Box */
ytd-searchbox #container.ytd-searchbox {
  border-radius: var(--ypp-${themeName}-radius) 0 0 var(--ypp-${themeName}-radius) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05) !important;
}

ytd-searchbox #search-icon-legacy {
  border-radius: 0 var(--ypp-${themeName}-radius) var(--ypp-${themeName}-radius) 0 !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-left: none !important;
}

/* Sidebar and Chips */
#guide-inner-content {
  padding: 12px !important;
}

ytd-guide-entry-renderer {
  border-radius: calc(var(--ypp-${themeName}-radius) / 2) !important;
  margin-bottom: 2px !important;
}

yt-chip-cloud-chip-renderer {
  border-radius: var(--ypp-${themeName}-radius) !important;
  font-weight: 600 !important;
  transition: transform 0.2s ease !important;
}

yt-chip-cloud-chip-renderer:hover {
  transform: scale(1.05) !important;
}

/* Player Controls */
.ytp-chrome-bottom {
  border-radius: var(--ypp-${themeName}-radius) !important;
  margin: 12px !important;
  width: calc(100% - 24px) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
  padding-bottom: 8px !important;
}

.ytp-scrubber-button {
  border-radius: 50% !important;
  transform: scale(1.2) !important;
  box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
}

/* Comments and Dialogs */
ytd-comment-thread-renderer {
  background: rgba(128,128,128,0.05) !important;
  border-radius: var(--ypp-${themeName}-radius) !important;
  padding: 16px !important;
  margin-bottom: 16px !important;
}

tp-yt-paper-dialog, ytd-menu-popup-renderer {
  border-radius: var(--ypp-${themeName}-radius) !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
}

/* Buttons */
yt-button-shape button, .yt-spec-button-shape-next {
  border-radius: var(--ypp-${themeName}-radius) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  font-weight: 700 !important;
  transition: all 0.2s ease !important;
}

yt-button-shape button:hover {
  filter: brightness(1.2) !important;
  transform: translateY(-1px) !important;
}

/* Subscribe Button */
ytd-subscribe-button-renderer yt-button-shape button {
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3) !important;
}

/* Progress Bars */
.ytp-play-progress {
  border-radius: var(--ypp-${themeName}-radius) !important;
}

.ytp-load-progress {
  border-radius: var(--ypp-${themeName}-radius) !important;
}
`;
}

let count = 0;
for (const theme of targets) {
    const themeDir = path.join(stylesDir, theme);
    if (!fs.existsSync(themeDir)) continue;

    const componentsDir = path.join(themeDir, 'components');
    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
    }

    const compFile = path.join(componentsDir, 'expanded_ui.css');
    fs.writeFileSync(compFile, generateComponents(theme));

    // Also update index.css to import it!
    const indexFile = path.join(themeDir, 'index.css');
    if (fs.existsSync(indexFile)) {
        let indexContent = fs.readFileSync(indexFile, 'utf8');
        if (!indexContent.includes('expanded_ui.css')) {
            indexContent += `\n@import './components/expanded_ui.css';\n`;
            fs.writeFileSync(indexFile, indexContent);
        }
    } else {
        fs.writeFileSync(indexFile, `@import './components/expanded_ui.css';\n`);
    }
    
    count++;
    console.log(`Expanded ${theme}`);
}

console.log(`Successfully expanded ${count} themes.`);
