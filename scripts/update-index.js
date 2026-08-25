const fs = require('fs');
const path = require('path');
const p = 'f:\\Youtube 2.0\\src\\content\\design-system\\index.css';
let content = fs.readFileSync(p, 'utf8');

const regex = /@import "\.\/features\/([^\/]+)\.css";/g;
const uiFiles = [
  'premium-logo', 'retro-logo', 'square-corners',
  'extra-rounded-ui', 'grayscale-thumbnails', 
  'custom-scrollbar', 'compact-settings-menu', 'save-supreme-ui'
];

const playerFiles = [
  'netflix-subtitles', 'video-speed-controller', 
  'flex-width-player', 'compact-player', 'live-stream-time'
];

const feedFiles = [
  'two-column-subs', 'watched-indicator', 
  'resume-badges', 'full-video-titles', 'smooth-title-scroll'
];

content = content.replace(regex, (match, featureName) => {
    if (uiFiles.includes(featureName)) {
        return `@import "./features/toggles/ui/${featureName}.css";`;
    }
    if (playerFiles.includes(featureName)) {
        return `@import "./features/toggles/player/${featureName}.css";`;
    }
    if (feedFiles.includes(featureName)) {
        return `@import "./features/toggles/feed/${featureName}.css";`;
    }
    // Handle modes
    if (['cinematic-mode', 'player-modes', 'deck-mode', 'real-cinema-mode'].includes(featureName)) {
        return `@import "./features/modes/${featureName}.css";`;
    }
    if (featureName === 'sidebar-layout') {
        return `@import "./features/modes/sidebar-mode.css";`;
    }
    
    return match; // keep original if not matched
});

fs.writeFileSync(p, content);
console.log('Updated index.css');
