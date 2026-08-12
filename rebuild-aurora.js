const fs = require('fs');
const path = require('path');

const srcDir = 'src/content/ui-styles/vintage';
const destDir = 'src/content/ui-styles/aurora';

// 1. Delete existing aurora
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
            c = c.replace(/vintage/g, 'aurora');
            c = c.replace(/Vintage/g, 'Aurora');
            c = c.replace(/VINTAGE/g, 'AURORA');

            // Fix background hardcoded vintage colors -> Aurora void/glass
            c = c.replace(/#e8d5b5/g, 'var(--aurora-bg-void)')
                 .replace(/#f4ecd8/g, 'var(--aurora-glass-heavy)')
                 .replace(/#1a1410/g, 'var(--aurora-bg-void)')
                 .replace(/#2c1f14/g, 'var(--aurora-glass-heavy)')
                 .replace(/#3e352f/g, 'var(--aurora-glass-light)')
                 .replace(/#5c3d2e/g, 'var(--aurora-glass-light)')
                 .replace(/#7a5c45/g, 'var(--aurora-text-secondary)')
                 .replace(/#d1c0a5/g, 'var(--aurora-bg-void)')
                 .replace(/#d4c098/g, 'var(--aurora-glass-heavy)')
                 .replace(/rgba\(62,\s*40,\s*20,\s*0\.5\)/g, 'rgba(0,0,0,0.5)'); // Vignette background

            // Fix accent colors -> Aurora Cyan/Magenta
            c = c.replace(/#c13a3a/g, 'var(--aurora-color-1)')
                 .replace(/#4a2a3e/g, 'var(--aurora-color-3)')
                 .replace(/#8b0000/g, 'var(--aurora-color-1)')
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.28\)/g, 'var(--aurora-glow-cyan)') // Vintage glow
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.4\)/g, 'var(--aurora-glow-cyan)') // Vintage shadow float
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.15\)/g, 'var(--aurora-glow-cyan)') // Vintage shadow glow
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.12\)/g, 'rgba(0, 242, 254, 0.12)') // Vintage search button
                 .replace(/rgba\(232,\s*213,\s*181,\s*0\.3\)/g, 'rgba(0, 242, 254, 0.3)'); // Vintage load progress

            // Fix Borders (dashed -> solid glass)
            c = c.replace(/2px dashed/g, '1px solid')
                 .replace(/1px dashed/g, '1px solid');
                 
            // Fix Border Radius (Vintage 4px -> Aurora 16px)
            c = c.replace(/border-radius:\s*4px/g, 'border-radius: 16px')
                 .replace(/border-radius:\s*2px/g, 'border-radius: 8px');

            // Fix Fonts
            c = c.replace(/Georgia,\s*\"Times New Roman\",\s*serif/g, '\"Inter\", \"Roboto\", sans-serif')
                 .replace(/\"Georgia\"/g, '\"Inter\"');

            // Set specific card styles in card-style.css
            if (full.includes('card-style.css')) {
                c = c.replace(/background: var\(--aurora-glass-heavy\)/g, 'background: var(--aurora-glass-heavy)');
                // Ensure padding is slightly higher for Aurora
                c = c.replace(/padding: 12px/g, 'padding: 16px');
            }

            fs.writeFileSync(full, c);
        }
    }
}
processDir(destDir);

// 4. Overwrite base/tokens.css with the actual Aurora tokens
const tokensContent = 
/* =========================================================
   AURORA — TOKENS & VARIABLES
   ========================================================= */

html.yt-spiral-tube-theme {
  /* Animation Timing */
  --aurora-snap: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --aurora-bounce: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Radii */
  --aurora-radius-sm: 8px;
  --aurora-radius-md: 16px;
  --aurora-radius-lg: 24px;
  --aurora-radius-pill: 9999px;
  
  /* Core Gradients (Cyan to Magenta) */
  --aurora-color-1: #00f2fe; /* Cyan */
  --aurora-color-2: #4facfe; /* Deep Cyan */
  --aurora-color-3: #f093fb; /* Magenta */
  --aurora-color-4: #f5576c; /* Deep Pink */
  
  --aurora-gradient-primary: linear-gradient(135deg, var(--aurora-color-1), var(--aurora-color-3));
  --aurora-gradient-secondary: linear-gradient(135deg, var(--aurora-color-2), var(--aurora-color-4));
  
  /* Glass Surfaces */
  --aurora-bg-void: #050505; /* Deep dark page background */
  --aurora-glass-light: rgba(255, 255, 255, 0.05);
  --aurora-glass-heavy: rgba(20, 20, 20, 0.7);
  --aurora-glass-solid: rgba(10, 10, 10, 0.9);
  
  /* Blur amounts */
  --aurora-blur-md: blur(15px);
  --aurora-blur-lg: blur(30px);
  
  /* Borders */
  --aurora-border-glass: 1px solid rgba(255, 255, 255, 0.1);
  --aurora-border-glow: 1px solid rgba(0, 242, 254, 0.5);
  
  /* Shadows & Glows */
  --aurora-glow-cyan: 0 4px 15px rgba(0, 242, 254, 0.3);
  --aurora-glow-magenta: 0 4px 15px rgba(240, 147, 251, 0.3);
  --aurora-glow-mixed: 0 8px 25px rgba(240, 147, 251, 0.15), 0 8px 25px rgba(0, 242, 254, 0.15);
  --aurora-shadow-glass: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  /* Text */
  --aurora-text-primary: #ffffff;
  --aurora-text-secondary: rgba(255, 255, 255, 0.6);

  /* YPP overrides */
  --ypp-bg-base: var(--aurora-bg-void);
  --ypp-bg-surface: var(--aurora-glass-heavy);
  --ypp-bg-glass: var(--aurora-glass-heavy);
  --ypp-glass-border: rgba(255,255,255,0.1);
  --ypp-glass-highlight: rgba(255,255,255,0.2);
  --ypp-glass-shine: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  --ypp-text-primary: var(--aurora-text-primary);
  --ypp-text-secondary: var(--aurora-text-secondary);
  --ypp-accent: var(--aurora-color-1);
  --ypp-accent-hover: var(--aurora-color-3);
  --ypp-accent-glow: rgba(0, 242, 254, 0.3);
  
  --ypp-shadow-card: var(--aurora-shadow-glass);
  --ypp-shadow-float: 0 12px 40px rgba(0,0,0,0.6);
  --ypp-shadow-glow: var(--aurora-glow-mixed);
  --ypp-shadow-accent-glow: var(--aurora-glow-cyan);
}

@keyframes ypp-aurora-flicker {
  0% { opacity: 0.1; }
  50% { opacity: 0.15; }
  100% { opacity: 0.1; }
}

@keyframes ypp-aurora-vignette {
  0% { opacity: 0.5; }
  50% { opacity: 0.7; }
  100% { opacity: 0.5; }
}
;
fs.writeFileSync(path.join(destDir, 'base/tokens.css'), tokensContent);

// 5. Special fix for player progress bar which needs gradients
const playerCssPath = path.join(destDir, 'pages/player.css');
let pCss = fs.readFileSync(playerCssPath, 'utf8');
pCss = pCss.replace(/background:\s*var\(--aurora-color-1\)\s*!important;/g, 'background: var(--aurora-gradient-primary) !important;');
// but we only want gradient on progress bar and volume slider, so we just append it
pCss += \
/* Progress Bar Colors (Aurora Gradients) */
html[data-ypp-ui-style="aurora"] .ytp-play-progress,
html[data-ypp-ui-style="aurora"] .ytp-volume-slider-handle {
    background: var(--aurora-gradient-primary) !important;
}
html[data-ypp-ui-style="aurora"] .ytp-swatch-background-color {
    background: var(--aurora-color-1) !important;
}
html[data-ypp-ui-style="aurora"] .ytp-swatch-color {
    color: var(--aurora-color-1) !important;
}
html[data-ypp-ui-style="aurora"] .ytp-load-progress {
    background: var(--aurora-glass-light) !important;
}
html[data-ypp-ui-style="aurora"] .ytp-scrubber-button {
    background: var(--aurora-color-3) !important;
    border: 2px solid var(--aurora-color-1) !important;
    border-radius: 50% !important;
    box-shadow: var(--aurora-glow-cyan) !important;
    transform: scale(0.8) !important;
    transition: transform 0.1s ease !important;
}
html[data-ypp-ui-style="aurora"] .ytp-scrubber-button:hover {
    transform: scale(1.1) !important;
    background: var(--aurora-color-1) !important;
    border-color: var(--aurora-color-3) !important;
}
\;
fs.writeFileSync(playerCssPath, pCss);

console.log('Rebuilt Aurora from Vintage completely!');
