const fs = require('fs');
const path = require('path');

const srcDir = 'src/content/ui-styles/vintage';
const destDir = 'src/content/ui-styles/bento';

// 1. Delete existing bento
if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
}

// 2. Recursive copy
function copyFolderSync(from, to) {
    fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}
copyFolderSync(srcDir, destDir);

// 3. Process files
function processDir(dir) {
    let entries = fs.readdirSync(dir, {withFileTypes: true});
    for (let entry of entries) {
        let full = path.join(dir, entry.name);
        if (entry.isDirectory()) processDir(full);
        else if (full.endsWith('.css')) {
            let c = fs.readFileSync(full, 'utf8');
            
            // Fix selectors
            c = c.replace(/vintage/g, 'bento');
            c = c.replace(/Vintage/g, 'Bento');
            c = c.replace(/VINTAGE/g, 'BENTO');

            // Fix background hardcoded vintage colors -> Bento colors
            c = c.replace(/#e8d5b5/g, 'var(--ben-bg)')
                 .replace(/#f4ecd8/g, 'var(--ben-surface)')
                 .replace(/#1a1410/g, 'var(--ben-text-primary)')
                 .replace(/#2c1f14/g, 'var(--ben-surface)')
                 .replace(/#3e352f/g, 'var(--ben-surface-hover)')
                 .replace(/#5c3d2e/g, 'var(--ben-text-secondary)')
                 .replace(/#7a5c45/g, 'var(--ben-text-secondary)')
                 .replace(/#d1c0a5/g, 'var(--ben-bg)')
                 .replace(/#d4c098/g, 'var(--ben-border-color)')
                 .replace(/rgba\(62,\s*40,\s*20,\s*0\.5\)/g, 'rgba(0,0,0,0.6)'); // Vignette background

            // Fix accent colors
            c = c.replace(/#c13a3a/g, 'var(--ben-accent)')
                 .replace(/#4a2a3e/g, 'var(--ben-accent-hover)')
                 .replace(/#8b0000/g, 'var(--ben-accent)')
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.28\)/g, 'var(--ben-shadow)') 
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.4\)/g, 'var(--ypp-shadow-float)') 
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.15\)/g, 'var(--ben-shadow)') 
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.12\)/g, 'transparent') 
                 .replace(/rgba\(232,\s*213,\s*181,\s*0\.3\)/g, 'var(--ben-border-color)'); 

            // Fix Borders (dashed -> solid bento borders)
            c = c.replace(/2px dashed[^;!]*!important/g, '1px solid var(--ben-border-color) !important')
                 .replace(/2px dashed[^;!]*/g, '1px solid var(--ben-border-color)')
                 .replace(/1px dashed[^;]*!important/g, '1px solid var(--ben-border-color) !important')
                 .replace(/1px dashed[^;]*/g, '1px solid var(--ben-border-color)');
                 
            // Fix Border Radius (Vintage 4px -> Bento 24px)
            c = c.replace(/border-radius:\s*4px/g, 'border-radius: var(--ben-radius)')
                 .replace(/border-radius:\s*2px/g, 'border-radius: 12px');

            // Fix Fonts
            c = c.replace(/Georgia,\s*\"Times New Roman\",\s*serif/g, '\"Inter\", \"Roboto\", \"Segoe UI\", sans-serif')
                 .replace(/\"Georgia\"/g, '\"Inter\"');
                 
            // Increase padding for Bento specifically in card-style
            if (full.includes('card-style.css')) {
                c = c.replace(/padding:\s*12px/g, 'padding: 20px');
            }

            fs.writeFileSync(full, c);
        }
    }
}
processDir(destDir);

// 4. Overwrite base/tokens.css with the actual Bento tokens
const tokensContent = 
/* =========================================================
   BENTO — TOKENS
   Minimalist flat design with high border-radius (24px)
   ========================================================= */

html.yt-spiral-tube-theme {
  --ben-bg: #f3f4f6;
  --ben-surface: #ffffff;
  --ben-surface-hover: #f8f9fa;
  --ben-border-color: #e5e7eb;
  --ben-radius: 24px;
  --ben-shadow: 0 4px 15px rgba(0,0,0,0.04);
  --ben-text-primary: #111827;
  --ben-text-secondary: #4b5563;
  --ben-accent: #3b82f6;
  --ben-accent-hover: #2563eb;
  
  --ypp-bg-base: var(--ben-bg);
  --ypp-bg-surface: var(--ben-surface);
  --ypp-bg-glass: var(--ben-surface);
  --ypp-glass-border: 1px solid var(--ben-border-color);
  --ypp-glass-highlight: transparent;
  --ypp-glass-shine: transparent;
  --ypp-text-primary: var(--ben-text-primary);
  --ypp-text-secondary: var(--ben-text-secondary);
  --ypp-accent: var(--ben-accent);
  --ypp-accent-hover: var(--ben-accent-hover);
  --ypp-shadow-card: var(--ben-shadow);
  --ypp-shadow-float: 0 10px 25px rgba(0,0,0,0.08);
}

@media (prefers-color-scheme: dark) {
  html.yt-spiral-tube-theme {
    --ben-bg: #0f172a;
    --ben-surface: #1e293b;
    --ben-surface-hover: #334155;
    --ben-border-color: #334155;
    --ben-shadow: 0 4px 15px rgba(0,0,0,0.25);
    
    --ben-text-primary: #f8fafc;
    --ben-text-secondary: #94a3b8;
    --ben-accent: #60a5fa;
    --ben-accent-hover: #3b82f6;
  }
}

@keyframes ypp-bento-flicker {
  0% { opacity: 1; }
  100% { opacity: 1; }
}

@keyframes ypp-bento-vignette {
  0% { opacity: 0; }
  100% { opacity: 0; }
}
;
fs.writeFileSync(path.join(destDir, 'base/tokens.css'), tokensContent);

// 5. Special fix for player progress bar which needs bento accent color
const playerCssPath = path.join(destDir, 'pages/player.css');
let pCss = fs.readFileSync(playerCssPath, 'utf8');
pCss += \
/* Progress Bar Colors (Bento) */
html[data-ypp-ui-style="bento"] .ytp-play-progress,
html[data-ypp-ui-style="bento"] .ytp-volume-slider-handle {
    background: var(--ben-accent) !important;
}
html[data-ypp-ui-style="bento"] .ytp-swatch-background-color {
    background: var(--ben-accent) !important;
}
html[data-ypp-ui-style="bento"] .ytp-swatch-color {
    color: var(--ben-accent) !important;
}
html[data-ypp-ui-style="bento"] .ytp-load-progress {
    background: var(--ben-border-color) !important;
}
html[data-ypp-ui-style="bento"] .ytp-scrubber-button {
    background: var(--ben-surface) !important;
    border: 2px solid var(--ben-accent) !important;
    border-radius: 50% !important;
    box-shadow: var(--ben-shadow) !important;
    transform: scale(0.9) !important;
    transition: transform 0.1s ease !important;
}
html[data-ypp-ui-style="bento"] .ytp-scrubber-button:hover {
    transform: scale(1.1) !important;
    background: var(--ben-surface-hover) !important;
}
\;
fs.writeFileSync(playerCssPath, pCss);

console.log('Rebuilt Bento from Vintage completely!');
