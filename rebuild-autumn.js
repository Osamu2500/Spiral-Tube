const fs = require('fs');
const path = require('path');

const srcDir = 'src/content/ui-styles/vintage';
const destDir = 'src/content/ui-styles/autumn';

// 1. Delete existing autumn
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
            c = c.replace(/vintage/g, 'autumn');
            c = c.replace(/Vintage/g, 'Autumn');
            c = c.replace(/VINTAGE/g, 'AUTUMN');

            // Fix background hardcoded vintage colors -> Autumn colors
            c = c.replace(/#e8d5b5/g, 'var(--au-bg-base)')
                 .replace(/#f4ecd8/g, 'var(--au-bg-card)')
                 .replace(/#1a1410/g, 'var(--au-bg-base)')
                 .replace(/#2c1f14/g, 'var(--au-bg-surface)')
                 .replace(/#3e352f/g, 'var(--au-bg-elevated)')
                 .replace(/#5c3d2e/g, 'var(--au-bark)')
                 .replace(/#7a5c45/g, 'var(--au-text-secondary)')
                 .replace(/#d1c0a5/g, 'var(--au-text-muted)')
                 .replace(/#d4c098/g, 'var(--au-bg-card)')
                 .replace(/rgba\(62,\s*40,\s*20,\s*0\.5\)/g, 'rgba(15, 10, 6, 0.8)'); // Vignette background

            // Fix accent colors -> Autumn Warm accents
            c = c.replace(/#c13a3a/g, 'var(--au-amber)')
                 .replace(/#4a2a3e/g, 'var(--au-sienna)')
                 .replace(/#8b0000/g, 'var(--au-crimson)')
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.28\)/g, 'var(--au-shadow-glow)') 
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.4\)/g, 'var(--au-shadow-glow-warm)') 
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.15\)/g, 'var(--au-shadow-glow)') 
                 .replace(/rgba\(193,\s*58,\s*58,\s*0\.12\)/g, 'var(--au-fog)') 
                 .replace(/rgba\(232,\s*213,\s*181,\s*0\.3\)/g, 'var(--au-fog-heavy)'); 

            // Fix Borders (dashed -> solid organic borders)
            c = c.replace(/2px dashed/g, '1px solid var(--au-border-accent)')
                 .replace(/1px dashed/g, '1px solid var(--au-border-subtle)');
                 
            // Fix Border Radius (Vintage 4px -> Autumn Fallen Leaf shape)
            c = c.replace(/border-radius:\s*4px/g, 'border-radius: var(--au-shape-card)')
                 .replace(/border-radius:\s*2px/g, 'border-radius: var(--au-shape-chip)');

            // Fix Fonts
            c = c.replace(/Georgia,\s*\"Times New Roman\",\s*serif/g, '\"Outfit\", \"Lora\", sans-serif')
                 .replace(/\"Georgia\"/g, '\"Outfit\"');

            fs.writeFileSync(full, c);
        }
    }
}
processDir(destDir);

// 4. Overwrite base/tokens.css with the actual Autumn tokens
const tokensContent = 
/* =========================================================
   AUTUMN — TOKENS
   Unique Shape: "Fallen Leaf" — asymmetric left-accent cards,
   organic corners (tall curve top-left, sharp bottom-right)
   ========================================================= */

html.yt-spiral-tube-theme {
  /* === Core Palette === */
  --au-amber:        #e87d0d;
  --au-copper:       #b5551a;
  --au-crimson:      #8b1a1a;
  --au-sienna:       #c4623c;
  --au-gold:         #d4a017;
  --au-bark:         #5c3a1e;
  --au-fog:          rgba(180, 100, 30, 0.12);
  --au-fog-heavy:    rgba(140, 60, 20, 0.22);

  /* === Backgrounds === */
  --au-bg-base:      #0f0a06;
  --au-bg-surface:   #1a1008;
  --au-bg-elevated:  #261810;
  --au-bg-card:      #1e1308;

  /* === Text === */
  --au-text-primary:   #f5ddb8;
  --au-text-secondary: #c9a47a;
  --au-text-muted:     #8a6545;

  /* === Borders === */
  --au-border-subtle: 1px solid rgba(200, 120, 50, 0.18);
  --au-border-accent: 1px solid rgba(220, 130, 40, 0.55);
  --au-border-glow:   1px solid rgba(255, 160, 60, 0.8);
  --au-border-left:   4px solid #e87d0d;

  /* === Shadows === */
  --au-shadow-card:   4px 4px 18px rgba(0,0,0,0.55);
  --au-shadow-hover:  6px 10px 24px rgba(0,0,0,0.6), 0 0 20px rgba(200,100,40,0.18);
  --au-shadow-glow:   0 0 14px rgba(232, 125, 13, 0.4);
  --au-shadow-glow-warm: 0 0 20px rgba(180, 80, 20, 0.5);

  /* === Unique Shape: "Fallen Leaf" ===
     Top-left: heavy organic curve (32px)
     Top-right: slight curve (8px)
     Bottom-right: sharp (4px) — like a torn leaf tip
     Bottom-left: medium curve (16px)
  */
  --au-shape-card:   32px 8px 4px 16px;
  --au-shape-btn:    18px 4px 4px 8px;
  --au-shape-chip:   14px 4px 4px 6px;
  --au-shape-modal:  24px 8px 4px 12px;

  /* === Animations === */
  --au-transition:    all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  --au-transition-fast: all 0.15s ease-out;

  /* YPP overrides */
  --ypp-bg-base: var(--au-bg-base);
  --ypp-bg-surface: var(--au-bg-surface);
  --ypp-bg-glass: var(--au-bg-card);
  --ypp-glass-border: rgba(220, 130, 40, 0.15);
  --ypp-glass-highlight: rgba(220, 130, 40, 0.2);
  --ypp-glass-shine: linear-gradient(135deg, rgba(220, 130, 40, 0.1) 0%, transparent 100%);
  --ypp-text-primary: var(--au-text-primary);
  --ypp-text-secondary: var(--au-text-secondary);
  --ypp-accent: var(--au-amber);
  --ypp-accent-hover: var(--au-sienna);
  --ypp-accent-glow: var(--au-shadow-glow);
  
  --ypp-shadow-card: var(--au-shadow-card);
  --ypp-shadow-float: var(--au-shadow-hover);
  --ypp-shadow-glow: var(--au-shadow-glow);
  --ypp-shadow-accent-glow: var(--au-shadow-glow-warm);
}

@keyframes ypp-autumn-flicker {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

@keyframes ypp-autumn-vignette {
  0% { opacity: 0.4; }
  50% { opacity: 0.6; }
  100% { opacity: 0.4; }
}
;
fs.writeFileSync(path.join(destDir, 'base/tokens.css'), tokensContent);

// 5. Special fix for player progress bar which needs gradients or solid autumn color
const playerCssPath = path.join(destDir, 'pages/player.css');
let pCss = fs.readFileSync(playerCssPath, 'utf8');
pCss += \
/* Progress Bar Colors (Autumn) */
html[data-ypp-ui-style="autumn"] .ytp-play-progress,
html[data-ypp-ui-style="autumn"] .ytp-volume-slider-handle {
    background: linear-gradient(90deg, var(--au-crimson), var(--au-amber)) !important;
}
html[data-ypp-ui-style="autumn"] .ytp-swatch-background-color {
    background: var(--au-amber) !important;
}
html[data-ypp-ui-style="autumn"] .ytp-swatch-color {
    color: var(--au-amber) !important;
}
html[data-ypp-ui-style="autumn"] .ytp-load-progress {
    background: var(--au-fog-heavy) !important;
}
html[data-ypp-ui-style="autumn"] .ytp-scrubber-button {
    background: var(--au-amber) !important;
    border: 2px solid var(--au-crimson) !important;
    border-radius: var(--au-shape-chip) !important;
    box-shadow: var(--au-shadow-glow) !important;
    transform: scale(0.9) !important;
    transition: transform 0.1s ease !important;
}
html[data-ypp-ui-style="autumn"] .ytp-scrubber-button:hover {
    transform: scale(1.1) !important;
    background: var(--au-gold) !important;
    border-color: var(--au-amber) !important;
}
\;
fs.writeFileSync(playerCssPath, pCss);

console.log('Rebuilt Autumn from Vintage completely!');
