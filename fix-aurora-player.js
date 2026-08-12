const fs = require('fs');

const playerCssPath = 'src/content/ui-styles/aurora/pages/player.css';
let c = fs.readFileSync(playerCssPath, 'utf8');

const progressStyles = 
/* Progress Bar Colors (Aurora Gradients) */
html[data-ypp-theme="aurora"] .ytp-play-progress,
html[data-ypp-theme="aurora"] .ytp-volume-slider-handle {
    background: var(--aurora-gradient-primary) !important;
}
html[data-ypp-theme="aurora"] .ytp-swatch-background-color {
    background: var(--aurora-color-1) !important;
}
html[data-ypp-theme="aurora"] .ytp-swatch-color {
    color: var(--aurora-color-1) !important;
}
html[data-ypp-theme="aurora"] .ytp-load-progress {
    background: var(--aurora-glass-light) !important;
}
html[data-ypp-theme="aurora"] .ytp-scrubber-button {
    background: var(--aurora-color-3) !important;
    border: 2px solid var(--aurora-color-1) !important;
    border-radius: 50% !important;
    box-shadow: 0 0 10px var(--aurora-color-1) !important;
    transform: scale(0.8) !important;
    transition: transform 0.1s ease !important;
}
html[data-ypp-theme="aurora"] .ytp-scrubber-button:hover {
    transform: scale(1.1) !important;
    background: var(--aurora-color-1) !important;
    border-color: var(--aurora-color-3) !important;
}
;

if (!c.includes('.ytp-play-progress')) {
    c += '\n' + progressStyles;
    fs.writeFileSync(playerCssPath, c);
    console.log('Added Aurora progress bar styles.');
} else {
    console.log('Progress bar styles already exist.');
}
