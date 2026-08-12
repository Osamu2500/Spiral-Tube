const fs = require('fs');
const path = require('path');

const themes = ["anime","galaxy","gothic","grunge","hologram","matrix","neo-brutalism","origami","retro-wave","steampunk","vaporwave","woodblock","y2k"];
const baseDir = path.join(__dirname, 'src', 'content', 'ui-styles');

// Full theme config — mirrors what vintage has in tokens.css
const T = {
  anime:         { bg:'#fff0f5', sf:'#ffe4ef', primary:'#ff69b4', secondary:'#d63384', accent:'#ff1493', text:'#3a1a2a', textSub:'#7a4a5a', border:'2px solid #ffb6c1', borderHover:'2px solid #ff69b4', radius:'20px', shadow:'0 8px 30px rgba(255,105,180,0.3)', shadowHover:'0 16px 45px rgba(255,105,180,0.5)', shadowActive:'0 2px 8px rgba(255,105,180,0.2)', bounce:'cubic-bezier(0.34,1.56,0.64,1) 0.3s', font:'"Nunito","Segoe UI",sans-serif', fontAlt:'"Nunito","Comic Neue",cursive', chipBg:'rgba(255,182,193,0.3)', chipBgHover:'rgba(255,105,180,0.4)', chipBgSelected:'#ff69b4', chipColor:'#3a1a2a', chipBorderSelected:'2px solid #ff1493', name:'anime' },
  galaxy:        { bg:'#0b0c10', sf:'#101318', primary:'#450256', secondary:'#03045e', accent:'#00f0ff', text:'#e0e0e0', textSub:'#a0a0c0', border:'1px solid rgba(0,240,255,0.3)', borderHover:'1px solid rgba(0,240,255,0.8)', radius:'16px', shadow:'0 0 20px rgba(0,240,255,0.2)', shadowHover:'0 0 35px rgba(0,240,255,0.5)', shadowActive:'0 0 8px rgba(0,240,255,0.1)', bounce:'cubic-bezier(0.25,0.8,0.25,1) 0.3s', font:'"Space Grotesk","Segoe UI",sans-serif', fontAlt:'"Orbitron","Space Grotesk",sans-serif', chipBg:'rgba(0,240,255,0.05)', chipBgHover:'rgba(0,240,255,0.15)', chipBgSelected:'#00f0ff', chipColor:'#0b0c10', chipBorderSelected:'1px solid #00f0ff', name:'galaxy' },
  gothic:        { bg:'#121212', sf:'#1c1c1c', primary:'#2a0800', secondary:'#8b0000', accent:'#cc0000', text:'#d3d3d3', textSub:'#888888', border:'2px solid #8b0000', borderHover:'2px solid #cc0000', radius:'0px', shadow:'0 4px 25px rgba(139,0,0,0.5)', shadowHover:'0 8px 40px rgba(204,0,0,0.7)', shadowActive:'0 2px 8px rgba(139,0,0,0.3)', bounce:'ease-in-out 0.5s', font:'"Cinzel","Palatino Linotype",serif', fontAlt:'"UnifrakturMaguntia","Cinzel",serif', chipBg:'rgba(139,0,0,0.2)', chipBgHover:'rgba(139,0,0,0.4)', chipBgSelected:'#8b0000', chipColor:'#d3d3d3', chipBorderSelected:'2px solid #cc0000', name:'gothic' },
  grunge:        { bg:'#2b2b2b', sf:'#333333', primary:'#3d3d3d', secondary:'#8a9a5b', accent:'#a8b870', text:'#cccccc', textSub:'#999999', border:'1px dashed #8a9a5b', borderHover:'1px solid #a8b870', radius:'2px', shadow:'inset 0 0 6px rgba(0,0,0,0.7)', shadowHover:'2px 2px 0 #111', shadowActive:'inset 0 2px 4px rgba(0,0,0,0.9)', bounce:'linear 0.1s', font:'"Courier New",Courier,monospace', fontAlt:'"Special Elite","Courier New",monospace', chipBg:'rgba(138,154,91,0.15)', chipBgHover:'rgba(138,154,91,0.3)', chipBgSelected:'#8a9a5b', chipColor:'#2b2b2b', chipBorderSelected:'1px solid #a8b870', name:'grunge' },
  hologram:      { bg:'#e0f8ff', sf:'#f0fdff', primary:'#cff4fc', secondary:'#00ffff', accent:'#00e5e5', text:'#003344', textSub:'#005566', border:'1px solid rgba(0,255,255,0.5)', borderHover:'1px solid #00ffff', radius:'10px', shadow:'0 0 15px rgba(0,255,255,0.4),inset 0 0 8px rgba(0,255,255,0.15)', shadowHover:'0 0 30px rgba(0,255,255,0.7)', shadowActive:'0 0 5px rgba(0,255,255,0.2)', bounce:'ease-out 0.3s', font:'"Orbitron","Space Mono",monospace', fontAlt:'"Exo 2","Orbitron",sans-serif', chipBg:'rgba(0,255,255,0.1)', chipBgHover:'rgba(0,255,255,0.25)', chipBgSelected:'#00ffff', chipColor:'#003344', chipBorderSelected:'1px solid #00e5e5', name:'hologram' },
  matrix:        { bg:'#000000', sf:'#001100', primary:'#002200', secondary:'#003300', accent:'#00ff00', text:'#00ff00', textSub:'#009900', border:'1px dotted #00ff00', borderHover:'1px solid #00ff00', radius:'0px', shadow:'0 0 10px #00ff00', shadowHover:'0 0 20px #00ff00,0 0 40px #00ff00', shadowActive:'0 0 5px #00ff00', bounce:'linear 0s', font:'"Courier New",Courier,monospace', fontAlt:'"Share Tech Mono","Courier New",monospace', chipBg:'rgba(0,255,0,0.07)', chipBgHover:'rgba(0,255,0,0.2)', chipBgSelected:'#00ff00', chipColor:'#000000', chipBorderSelected:'1px solid #00ff00', name:'matrix' },
  'neo-brutalism':{ bg:'#ffffff', sf:'#fffbf0', primary:'#ffcc00', secondary:'#ff6699', accent:'#000000', text:'#000000', textSub:'#333333', border:'4px solid #000000', borderHover:'4px solid #ff6699', radius:'0px', shadow:'6px 6px 0px #000000', shadowHover:'10px 10px 0px #000000', shadowActive:'2px 2px 0px #000000', bounce:'ease 0.1s', font:'"Space Mono","Courier New",monospace', fontAlt:'"Space Mono",monospace', chipBg:'#ffcc00', chipBgHover:'#ff6699', chipBgSelected:'#000000', chipColor:'#ffffff', chipBorderSelected:'4px solid #000000', name:'neo-brutalism' },
  origami:       { bg:'#fdfdfd', sf:'#f8f8f5', primary:'#f4f4f0', secondary:'#eaeae0', accent:'#ff7f50', text:'#444444', textSub:'#888888', border:'1px solid #d0d0c0', borderHover:'1px solid #ff7f50', radius:'0px', shadow:'2px 2px 10px rgba(0,0,0,0.1)', shadowHover:'4px 4px 18px rgba(0,0,0,0.18)', shadowActive:'1px 1px 5px rgba(0,0,0,0.08)', bounce:'ease 0.3s', font:'"Quicksand","Nunito",sans-serif', fontAlt:'"Quicksand",sans-serif', chipBg:'rgba(255,127,80,0.08)', chipBgHover:'rgba(255,127,80,0.2)', chipBgSelected:'#ff7f50', chipColor:'#ffffff', chipBorderSelected:'1px solid #e86a3a', name:'origami' },
  'retro-wave':  { bg:'#1a0b2e', sf:'#22103c', primary:'#4a0e4e', secondary:'#2b0940', accent:'#ff007f', text:'#00ffff', textSub:'#cc66ff', border:'2px solid #ff007f', borderHover:'2px solid #00ffff', radius:'8px', shadow:'0 0 15px rgba(255,0,127,0.5)', shadowHover:'0 0 30px rgba(255,0,127,0.8),0 0 60px rgba(0,255,255,0.3)', shadowActive:'0 0 6px rgba(255,0,127,0.3)', bounce:'ease 0.2s', font:'"VT323","Share Tech Mono",monospace', fontAlt:'"Audiowide","VT323",monospace', chipBg:'rgba(255,0,127,0.1)', chipBgHover:'rgba(255,0,127,0.3)', chipBgSelected:'#ff007f', chipColor:'#ffffff', chipBorderSelected:'2px solid #00ffff', name:'retro-wave' },
  steampunk:     { bg:'#3b2f2f', sf:'#4a3a30', primary:'#5c4033', secondary:'#8b5a2b', accent:'#d2b48c', text:'#f5deb3', textSub:'#c8a882', border:'3px double #d2b48c', borderHover:'3px solid #d2b48c', radius:'6px', shadow:'inset 0 0 10px rgba(0,0,0,0.5),0 4px 12px rgba(0,0,0,0.5)', shadowHover:'0 8px 20px rgba(0,0,0,0.7),inset 0 0 15px rgba(0,0,0,0.3)', shadowActive:'inset 0 4px 8px rgba(0,0,0,0.8)', bounce:'ease 0.5s', font:'"Playfair Display","Palatino Linotype",serif', fontAlt:'"IM Fell English","Playfair Display",serif', chipBg:'rgba(210,180,140,0.15)', chipBgHover:'rgba(210,180,140,0.3)', chipBgSelected:'#d2b48c', chipColor:'#3b2f2f', chipBorderSelected:'3px solid #b8964e', name:'steampunk' },
  vaporwave:     { bg:'#1a0a2e', sf:'#200e38', primary:'#6b2fa0', secondary:'#1a8fa0', accent:'#ff71ce', text:'#f0e6ff', textSub:'#c8a0e0', border:'2px solid #ff71ce', borderHover:'2px solid #01cdfe', radius:'12px', shadow:'0 0 20px rgba(255,113,206,0.4)', shadowHover:'0 0 35px rgba(255,113,206,0.7),0 0 70px rgba(1,205,254,0.3)', shadowActive:'0 0 8px rgba(255,113,206,0.2)', bounce:'cubic-bezier(0.25,0.8,0.25,1) 0.4s', font:'"Syncopate","Audiowide",sans-serif', fontAlt:'"Syncopate",sans-serif', chipBg:'rgba(255,113,206,0.1)', chipBgHover:'rgba(255,113,206,0.25)', chipBgSelected:'#ff71ce', chipColor:'#1a0a2e', chipBorderSelected:'2px solid #01cdfe', name:'vaporwave' },
  woodblock:     { bg:'#f5f5dc', sf:'#faf8f0', primary:'#deb887', secondary:'#d2b48c', accent:'#8b4513', text:'#5c3d1e', textSub:'#8b6914', border:'2px solid #8b4513', borderHover:'2px solid #a0522d', radius:'4px', shadow:'3px 3px 8px rgba(139,69,19,0.25)', shadowHover:'5px 5px 15px rgba(139,69,19,0.4)', shadowActive:'1px 1px 4px rgba(139,69,19,0.2)', bounce:'ease 0.3s', font:'"Noto Serif","Palatino Linotype",serif', fontAlt:'"Lora","Noto Serif",serif', chipBg:'rgba(139,69,19,0.1)', chipBgHover:'rgba(139,69,19,0.2)', chipBgSelected:'#8b4513', chipColor:'#f5f5dc', chipBorderSelected:'2px solid #5c3d1e', name:'woodblock' },
  y2k:           { bg:'#e6e6fa', sf:'#f0f0ff', primary:'#ff69b4', secondary:'#00ccff', accent:'#9370db', text:'#191970', textSub:'#4040aa', border:'3px solid #00ccff', borderHover:'3px solid #ff69b4', radius:'30px', shadow:'0 0 15px rgba(255,105,180,0.4)', shadowHover:'0 0 25px rgba(255,105,180,0.6),0 0 50px rgba(147,112,219,0.3)', shadowActive:'0 0 6px rgba(147,112,219,0.2)', bounce:'cubic-bezier(0.175,0.885,0.32,1.275) 0.3s', font:'"Comic Sans MS","Trebuchet MS",cursive', fontAlt:'"Comic Sans MS",cursive', chipBg:'rgba(0,204,255,0.15)', chipBgHover:'rgba(0,204,255,0.3)', chipBgSelected:'#9370db', chipColor:'#ffffff', chipBorderSelected:'3px solid #ff69b4', name:'y2k' }
};

function mkdirs(theme) {
  ['base','components','pages','theme','theme/base'].forEach(sub => {
    const p = path.join(baseDir, theme, sub);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });
}

// ─── FILE GENERATORS ────────────────────────────────────────────────────────

function gen_tokens(t) {
  return `/* src/content/ui-styles/${t.name}/base/tokens.css */
html[data-ypp-ui-style="${t.name}"],
html[data-ypp-ui-style="${t.name}"] body,
html[data-ypp-ui-style="${t.name}"] [dark] {
  /* Core Palette */
  --${t.name}-bg:           ${t.bg};
  --${t.name}-sf:           ${t.sf};
  --${t.name}-primary:      ${t.primary};
  --${t.name}-secondary:    ${t.secondary};
  --${t.name}-accent:       ${t.accent};
  --${t.name}-text:         ${t.text};
  --${t.name}-text-sub:     ${t.textSub};
  --${t.name}-border:       ${t.border};
  --${t.name}-border-hover: ${t.borderHover};
  --${t.name}-radius:       ${t.radius};
  --${t.name}-shadow:       ${t.shadow};
  --${t.name}-shadow-hover: ${t.shadowHover};
  --${t.name}-shadow-active:${t.shadowActive};
  --${t.name}-bounce:       ${t.bounce};
  --${t.name}-font:         ${t.font};
  --${t.name}-font-alt:     ${t.fontAlt};

  /* Convenience shorthands (like vintage's --sf, --bounce etc.) */
  --sf:           var(--${t.name}-sf);
  --bounce:       var(--${t.name}-bounce);
  --shadow-base:  var(--${t.name}-shadow);
  --shadow-hover: var(--${t.name}-shadow-hover);
  --shadow-active:var(--${t.name}-shadow-active);

  /* Chip tokens */
  --chip-bg:             ${t.chipBg};
  --chip-bg-hover:       ${t.chipBgHover};
  --chip-bg-selected:    ${t.chipBgSelected};
  --chip-color-selected: ${t.chipColor};
  --chip-border:         ${t.border};
  --chip-border-selected:${t.chipBorderSelected};
  --chip-radius:         ${t.radius};
  --chip-shadow:         ${t.shadow};

  /* YouTube spec variable overrides */
  --yt-spec-text-primary:          ${t.text} !important;
  --yt-spec-text-secondary:        ${t.textSub} !important;
  --yt-spec-text-disabled:         ${t.textSub} !important;
  --yt-spec-icon-active-other:     ${t.accent} !important;
  --yt-spec-icon-inactive:         ${t.textSub} !important;
  --yt-spec-menu-background:       ${t.sf} !important;
  --yt-spec-raised-background:     ${t.sf} !important;
  --yt-spec-base-background:       ${t.bg} !important;
  --yt-spec-badge-chip-background: transparent !important;
  --yt-spec-additive-background:   transparent !important;
  --ytd-user-comment-font-family:  ${t.font} !important;
  --yt-font-family:                ${t.font} !important;
}

/* Hard-enforce typography on every text node */
html[data-ypp-ui-style="${t.name}"] body,
html[data-ypp-ui-style="${t.name}"] yt-formatted-string,
html[data-ypp-ui-style="${t.name}"] .yt-core-attributed-string,
html[data-ypp-ui-style="${t.name}"] input,
html[data-ypp-ui-style="${t.name}"] textarea,
html[data-ypp-ui-style="${t.name}"] button,
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-item,
html[data-ypp-ui-style="${t.name}"] .ytp-menuitem-label,
html[data-ypp-ui-style="${t.name}"] .ytp-menuitem-content {
  font-family: ${t.font} !important;
}
`;
}

function gen_background(t) {
  const matrixScanline = t.name === 'matrix' ? `
html[data-ypp-ui-style="matrix"] body::before {
  content: "";
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(0,255,0,0.03) 0px, transparent 2px, transparent 4px);
  z-index: 0;
}` : '';
  const retrowaveGrid = t.name === 'retro-wave' ? `
html[data-ypp-ui-style="retro-wave"] body::after {
  content: "";
  position: fixed;
  bottom: 0; left: 0;
  width: 100%; height: 40%;
  pointer-events: none;
  background: linear-gradient(to top, rgba(255,0,127,0.08) 0%, transparent 100%),
    repeating-linear-gradient(90deg, rgba(255,0,127,0.05) 0px, transparent 1px, transparent 40px),
    repeating-linear-gradient(0deg, rgba(0,255,255,0.05) 0px, transparent 1px, transparent 40px);
  z-index: 0;
}` : '';
  return `/* src/content/ui-styles/${t.name}/base/background.css */
html[data-ypp-ui-style="${t.name}"] html,
html[data-ypp-ui-style="${t.name}"] body,
html[data-ypp-ui-style="${t.name}"] ytd-app,
html[data-ypp-ui-style="${t.name}"] #page-manager {
  background-color: ${t.bg} !important;
  color: ${t.text} !important;
}
${matrixScanline}${retrowaveGrid}
html[data-ypp-ui-style="${t.name}"] tp-yt-app-header {
  background: transparent !important;
}
html[data-ypp-ui-style="${t.name}"] ::-webkit-scrollbar {
  width: 12px !important;
  background-color: ${t.bg} !important;
}
html[data-ypp-ui-style="${t.name}"] ::-webkit-scrollbar-track {
  background: ${t.bg} !important;
  border-left: 1px solid ${t.accent};
}
html[data-ypp-ui-style="${t.name}"] ::-webkit-scrollbar-thumb {
  background: ${t.primary} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] ::-webkit-scrollbar-thumb:hover {
  background: ${t.accent} !important;
}
html[data-ypp-ui-style="${t.name}"] .ypp-organizer-modal,
html[data-ypp-ui-style="${t.name}"] .ypp-modal-content {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] #simplebox-placeholder {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  border: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] .ypp-slider,
html[data-ypp-ui-style="${t.name}"] .ypp-gpb-vol-slider {
  accent-color: ${t.accent} !important;
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] .tab-content.tp-yt-paper-tab {
  transition: transform var(--bounce), background var(--bounce) !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] .tab-content.tp-yt-paper-tab:hover {
  background: ${t.chipBgHover} !important;
  transform: scale(1.05) !important;
}
`;
}

function gen_layout(t) {
  const neoBrutPush = t.name === 'neo-brutalism' ? `
html[data-ypp-ui-style="neo-brutalism"] *:hover {
  /* slight push on all interactive elements */
  transition: transform 0.1s ease, box-shadow 0.1s ease !important;
}` : '';
  return `/* src/content/ui-styles/${t.name}/base/layout.css */
html[data-ypp-ui-style="${t.name}"] * {
  font-family: ${t.font} !important;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
html[data-ypp-ui-style="${t.name}"] body.yt-pro-ambient {
  overflow-x: hidden !important;
}
html[data-ypp-ui-style="${t.name}"] body.yt-pro-ambient #cinematics.ytd-watch-flexy {
  filter: saturate(200%) blur(12px) contrast(1.1) brightness(1.2);
  transform: scale(3);
  opacity: 1;
  mix-blend-mode: lighten;
}
html[data-ypp-ui-style="${t.name}"] body.yt-pro-ambient .style-scope.ytd-watch-flexy#player-container-inner {
  overflow: hidden;
  border-radius: ${t.radius};
  box-shadow: ${t.shadowHover};
}
html[data-ypp-ui-style="${t.name}"] #video-title {
  color: ${t.text} !important;
  font-weight: bold !important;
  letter-spacing: 0.5px !important;
}
html[data-ypp-ui-style="${t.name}"] #description-text,
html[data-ypp-ui-style="${t.name}"] yt-formatted-string#description-text {
  color: ${t.textSub} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytSuggestionComponentRoundedSuggestion {
  margin: 5px 10px;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] .ytSuggestionComponentRoundedSuggestion:hover {
  transform: scale(1.01) !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] yt-img-shadow#avatar {
  border: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
  border-radius: ${t.radius === '0px' ? '0px' : '50%'} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytPlayerProgressBarDragContainer {
  margin-left: 15px !important;
  margin-right: 15px !important;
  margin-bottom: 5px !important;
}
html[data-ypp-ui-style="${t.name}"] .ytProgressBarLineProgressBarLine,
html[data-ypp-ui-style="${t.name}"] .ytProgressBarLineProgressBarPlayed {
  border-radius: ${t.radius} !important;
}
${neoBrutPush}
`;
}

function gen_animations(t) {
  const pulse = `@keyframes ${t.name}-pulse {
  0%   { box-shadow: ${t.shadow}; }
  50%  { box-shadow: ${t.shadowHover}; }
  100% { box-shadow: ${t.shadow}; }
}`;
  const glitch = t.name === 'matrix' ? `
@keyframes matrix-glitch {
  0%   { transform: translate(0); }
  20%  { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
  40%  { transform: translate(-2px, -2px); }
  60%  { transform: translate(2px, 2px); }
  80%  { transform: translate(2px, -2px); filter: hue-rotate(0deg); }
  100% { transform: translate(0); }
}` : '';
  const float = (t.name === 'anime' || t.name === 'y2k') ? `
@keyframes ${t.name}-float {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}` : '';

  return `/* src/content/ui-styles/${t.name}/base/animations.css */
${pulse}
${glitch}
${float}

/* Subscribe button pulse */
html[data-ypp-ui-style="${t.name}"] #subscribe-button .yt-spec-button-shape-next--filled {
  transition: all 0.3s ease !important;
  ${(t.name==='galaxy'||t.name==='hologram'||t.name==='vaporwave') ? `animation: ${t.name}-pulse 2.5s ease-in-out infinite !important;` : ''}
  ${t.name==='matrix' ? 'animation: matrix-glitch 4s linear infinite !important;' : ''}
}

/* Card hover lift */
html[data-ypp-ui-style="${t.name}"] ytd-rich-grid-media:hover,
html[data-ypp-ui-style="${t.name}"] ytd-compact-video-renderer:hover,
html[data-ypp-ui-style="${t.name}"] ytd-video-renderer:hover,
html[data-ypp-ui-style="${t.name}"] ytd-playlist-video-renderer:hover,
html[data-ypp-ui-style="${t.name}"] ytd-grid-video-renderer:hover {
  ${t.name==='neo-brutalism' ? 'transform: translate(-4px,-4px) !important;' : ''}
  ${t.name==='anime' ? 'transform: translateY(-8px) scale(1.02) !important;' : ''}
  ${t.name==='y2k' ? 'transform: scale(1.05) rotate(1deg) !important;' : ''}
  ${(t.name!=='neo-brutalism'&&t.name!=='anime'&&t.name!=='y2k') ? 'transform: translateY(-3px) scale(1.01) !important;' : ''}
  box-shadow: ${t.shadowHover} !important;
  border: ${t.borderHover} !important;
}

/* Guide sidebar hover slide */
html[data-ypp-ui-style="${t.name}"] ytd-guide-entry-renderer:hover {
  background-color: ${t.sf} !important;
  ${t.name==='neo-brutalism' ? 'transform: translate(-4px,-4px) !important; box-shadow: 4px 4px 0px #000 !important;' : 'transform: translateX(8px) !important;'}
  border-left: 4px solid ${t.accent} !important;
  transition: all var(--bounce) !important;
}

/* Mini guide hover */
html[data-ypp-ui-style="${t.name}"] ytd-mini-guide-entry-renderer:hover {
  transform: scale(1.15) !important;
  box-shadow: ${t.shadowHover} !important;
}

/* Button scale */
html[data-ypp-ui-style="${t.name}"] .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled:hover {
  transform: scale(1.08);
  animation: ${t.name}-pulse 5s ease-in-out infinite;
}
`;
}

function gen_badges(t) {
  return `/* src/content/ui-styles/${t.name}/components/badges.css */
html[data-ypp-ui-style="${t.name}"] .yt-badge-shape--thumbnail-default,
html[data-ypp-ui-style="${t.name}"] .ypp-badge,
html[data-ypp-ui-style="${t.name}"] .ypp-value-display {
  background: ${t.sf} !important;
  color: ${t.text} !important;
  border-radius: ${t.radius} !important;
  border: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
  font-family: ${t.font} !important;
  font-weight: bold !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-badge-supported-renderer {
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytProgressBarLineProgressBarLine,
html[data-ypp-ui-style="${t.name}"] .ytProgressBarLineProgressBarBackground,
html[data-ypp-ui-style="${t.name}"] .ytProgressBarLineProgressBarLoaded,
html[data-ypp-ui-style="${t.name}"] .ytProgressBarLineProgressBarHovered,
html[data-ypp-ui-style="${t.name}"] .ytProgressBarLineProgressBarPlayed,
html[data-ypp-ui-style="${t.name}"] .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment {
  border-radius: ${t.radius} !important;
  background-color: ${t.accent} !important;
}
`;
}

function gen_buttons(t) {
  return `/* src/content/ui-styles/${t.name}/components/buttons.css */
html[data-ypp-ui-style="${t.name}"] .yt-spec-button-shape-next--mono .yt-spec-touch-feedback-shape__fill,
html[data-ypp-ui-style="${t.name}"] .yt-spec-button-shape-next--mono .yt-spec-touch-feedback-shape__stroke {
  display: none !important;
}
html[data-ypp-ui-style="${t.name}"] .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled,
html[data-ypp-ui-style="${t.name}"] button.ytSpecButtonShapeNextTonal,
html[data-ypp-ui-style="${t.name}"] .yt-spec-button-shape-next--tonal {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  color: ${t.text} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
  position: relative;
  overflow: hidden;
  cursor: pointer !important;
  font-weight: bold !important;
}
html[data-ypp-ui-style="${t.name}"] .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled:hover,
html[data-ypp-ui-style="${t.name}"] button.ytSpecButtonShapeNextTonal:hover {
  box-shadow: ${t.shadowHover} !important;
  transform: scale(1.06) !important;
  border: ${t.borderHover} !important;
}
html[data-ypp-ui-style="${t.name}"] .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled:active,
html[data-ypp-ui-style="${t.name}"] button.ytSpecButtonShapeNextTonal:active {
  transform: scale(0.97) !important;
  box-shadow: ${t.shadowActive} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper {
  display: flex !important;
  gap: 6px !important;
  background: none !important;
  box-shadow: none !important;
  overflow: visible !important;
}
html[data-ypp-ui-style="${t.name}"] .ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper button {
  border-radius: ${t.radius} !important;
  background: ${t.sf} !important;
  border: ${t.border} !important;
  color: ${t.text} !important;
  box-shadow: ${t.shadow} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] .ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper button:hover {
  box-shadow: ${t.shadowHover} !important;
  transform: scale(1.06) !important;
}
html[data-ypp-ui-style="${t.name}"] button.ytSpecButtonShapeNextText {
  border-radius: ${t.radius} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] button.ytSpecButtonShapeNextText:hover {
  background: ${t.sf} !important;
  box-shadow: ${t.shadowHover} !important;
  transform: scale(1.05) !important;
}

/* Full action button coverage */
html[data-ypp-ui-style="${t.name}"] #top-level-buttons-computed .yt-spec-button-shape-next,
html[data-ypp-ui-style="${t.name}"] .ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper .yt-spec-button-shape-next,
html[data-ypp-ui-style="${t.name}"] ytd-menu-renderer .yt-spec-button-shape-next,
html[data-ypp-ui-style="${t.name}"] yt-button-view-model .yt-spec-button-shape-next,
html[data-ypp-ui-style="${t.name}"] ytd-download-button-renderer .yt-spec-button-shape-next {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  color: ${t.text} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  font-weight: 700 !important;
  margin-right: 6px !important;
}
html[data-ypp-ui-style="${t.name}"] #top-level-buttons-computed .yt-spec-button-shape-next:hover,
html[data-ypp-ui-style="${t.name}"] ytd-menu-renderer .yt-spec-button-shape-next:hover {
  border: ${t.borderHover} !important;
  box-shadow: ${t.shadowHover} !important;
  transform: translate(-2px,-2px) !important;
}

/* SVG icon colors */
html[data-ypp-ui-style="${t.name}"] #top-level-buttons-computed .yt-spec-button-shape-next svg,
html[data-ypp-ui-style="${t.name}"] #top-level-buttons-computed .yt-spec-button-shape-next path,
html[data-ypp-ui-style="${t.name}"] ytd-menu-renderer .yt-spec-button-shape-next svg,
html[data-ypp-ui-style="${t.name}"] ytd-menu-renderer .yt-spec-button-shape-next path {
  fill: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] #top-level-buttons-computed .yt-spec-button-shape-next:hover svg,
html[data-ypp-ui-style="${t.name}"] #top-level-buttons-computed .yt-spec-button-shape-next:hover path {
  fill: ${t.accent} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper {
  background: none !important;
  border: none !important;
}

/* YPP custom buttons */
html[data-ypp-ui-style="${t.name}"] .ypp-btn-primary,
html[data-ypp-ui-style="${t.name}"] .ypp-play-all-btn,
html[data-ypp-ui-style="${t.name}"] .ypp-health-btn {
  border-radius: ${t.radius} !important;
  background: ${t.sf} !important;
  border: ${t.border} !important;
  color: ${t.text} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] .ypp-btn-primary:hover,
html[data-ypp-ui-style="${t.name}"] .ypp-play-all-btn:hover {
  box-shadow: ${t.shadowHover} !important;
  transform: scale(1.05) !important;
}
`;
}

function gen_cards(t) {
  const cardList = `ytd-rich-grid-media,
html[data-ypp-ui-style="${t.name}"] ytd-compact-video-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-playlist-panel-video-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-video-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-grid-video-renderer`;

  return `/* src/content/ui-styles/${t.name}/components/cards.css */
html[data-ypp-ui-style="${t.name}"] ytd-rich-grid-media,
html[data-ypp-ui-style="${t.name}"] ytd-compact-video-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-playlist-panel-video-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-video-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-grid-video-renderer {
  border: ${t.border} !important;
  background: ${t.sf} !important;
  padding: 10px !important;
  margin-bottom: 16px !important;
  border-radius: ${t.radius} !important;
  transition: all var(--bounce) !important;
  box-shadow: ${t.shadow} !important;
  position: relative;
  overflow: hidden;
}
html[data-ypp-ui-style="${t.name}"] ytd-rich-item-renderer {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  border: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
  transition: all var(--bounce) !important;
  margin-bottom: 8px !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-thumbnail,
html[data-ypp-ui-style="${t.name}"] #thumbnail {
  border-radius: ${t.name==='steampunk' ? '6px' : t.radius} !important;
  border: ${t.border} !important;
  overflow: hidden !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-reel-video-renderer {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  border: ${t.border} !important;
  overflow: hidden !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-playlist-panel-video-renderer.ytd-playlist-panel-renderer {
  border-radius: ${t.radius} !important;
  padding: 10px !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
  margin: 5px 0 !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-playlist-panel-video-renderer:hover {
  box-shadow: ${t.shadowHover} !important;
  transform: translateX(4px) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-macro-markers-list-item-renderer {
  border-radius: ${t.radius} !important;
  margin: 5px;
  border: ${t.border} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-macro-markers-list-item-renderer:hover {
  transform: scale(1.02) !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-unified-share-panel-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-add-to-playlist-renderer {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadowHover} !important;
  border: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-settings-options-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-account-settings-renderer {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  padding: 25px !important;
  border: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-rich-grid-slim-media #dismissible,
html[data-ypp-ui-style="${t.name}"] ytd-reel-item-renderer #dismissible {
  transition: all var(--bounce) !important;
  border-radius: ${t.radius} !important;
  border: 2px solid transparent !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-rich-grid-slim-media:hover #dismissible,
html[data-ypp-ui-style="${t.name}"] ytd-reel-item-renderer:hover #dismissible {
  background: ${t.sf} !important;
  box-shadow: ${t.shadowHover} !important;
  transform: scale(1.04) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-expandable-metadata-renderer {
  padding: 5px !important;
  border-radius: ${t.radius} !important;
  border: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-expandable-metadata-renderer:hover {
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] #contents.ytd-rich-grid-renderer {
  margin-left: 24px !important;
  margin-right: 12px !important;
}
`;
}

function gen_forms(t) {
  return `/* src/content/ui-styles/${t.name}/components/forms.css */
html[data-ypp-ui-style="${t.name}"] ytd-searchbox,
html[data-ypp-ui-style="${t.name}"] #search-form,
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-input,
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-textarea {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15) !important;
  font-family: ${t.font} !important;
  transition: all var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-searchbox[has-focus],
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-input:focus-within {
  border: ${t.borderHover} !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] .ypp-filter-dropdown {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  border: ${t.border} !important;
  color: ${t.text} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] .ypp-filter-dropdown:hover {
  background: ${t.sf} !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-comment-simplebox-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
}
`;
}

function gen_icons(t) {
  return `/* src/content/ui-styles/${t.name}/components/icons.css */
html[data-ypp-ui-style="${t.name}"] yt-icon svg,
html[data-ypp-ui-style="${t.name}"] yt-icon path {
  fill: ${t.text} !important;
  transition: fill 0.2s ease !important;
}
html[data-ypp-ui-style="${t.name}"] yt-icon:hover svg,
html[data-ypp-ui-style="${t.name}"] yt-icon:hover path {
  fill: ${t.accent} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-button svg,
html[data-ypp-ui-style="${t.name}"] .ytp-button path {
  fill: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] yt-icon-button#guide-button {
  border-radius: ${t.radius} !important;
  transition: transform var(--bounce), box-shadow var(--bounce), background var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] yt-icon-button#guide-button:hover {
  background: ${t.sf} !important;
  box-shadow: ${t.shadowHover} !important;
  transform: scale(1.1);
}
html[data-ypp-ui-style="${t.name}"] yt-icon-button#guide-button:active {
  transform: scale(0.95) !important;
}
html[data-ypp-ui-style="${t.name}"] .ytInlinePlayerControlsTopRightControlsCircleButton {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
  cursor: pointer !important;
}
html[data-ypp-ui-style="${t.name}"] .ytInlinePlayerControlsTopRightControlsCircleButton:hover {
  transform: scale(1.1) !important;
  box-shadow: ${t.shadowHover} !important;
}
`;
}

function gen_menus(t) {
  return `/* src/content/ui-styles/${t.name}/components/menus.css */
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-dialog,
html[data-ypp-ui-style="${t.name}"] ytd-menu-popup-renderer,
html[data-ypp-ui-style="${t.name}"] tp-yt-iron-dropdown,
html[data-ypp-ui-style="${t.name}"] #contentWrapper tp-yt-iron-dropdown,
html[data-ypp-ui-style="${t.name}"] ytd-multi-page-menu-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadowHover} !important;
  backdrop-filter: blur(12px) !important;
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-menu-popup-renderer .ytd-menu-popup-renderer {
  background: transparent !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-settings-menu,
html[data-ypp-ui-style="${t.name}"] .ytp-panel-menu {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-menuitem {
  color: ${t.text} !important;
  font-family: ${t.font} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-menuitem:hover {
  background: ${t.primary} !important;
  color: ${t.accent} !important;
}
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-listbox,
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-item {
  background: transparent !important;
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-item:hover {
  background: ${t.primary} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-notification-renderer {
  background: ${t.sf} !important;
  border-bottom: ${t.border} !important;
  transition: background var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-notification-renderer:hover {
  background: ${t.primary} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-settings-sidebar-renderer {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  padding: 15px !important;
  border: ${t.border} !important;
}
`;
}

function gen_navbar(t) {
  return `/* src/content/ui-styles/${t.name}/components/navbar.css */
html[data-ypp-ui-style="${t.name}"] ytd-masthead,
html[data-ypp-ui-style="${t.name}"] #masthead-container {
  background: ${t.primary} !important;
  border-bottom: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-topbar-logo-renderer {
  border-radius: ${t.radius} !important;
  padding: 0 !important;
  max-height: 45px !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-topbar-logo-renderer:hover {
  transform: scale(1.05) !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] #guide-wrapper.ytd-app {
  background: ${t.sf} !important;
  border-radius: 0 ${t.radius} ${t.radius} 0 !important;
  border: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
}
html[data-ypp-ui-style="${t.name}"] #guide-content.ytd-app {
  background: transparent;
}
html[data-ypp-ui-style="${t.name}"] ytd-guide-section-renderer {
  border-bottom: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-guide-entry-renderer {
  border-radius: ${t.radius} !important;
  transition: all var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer {
  background: transparent !important;
  border-radius: ${t.radius} !important;
  transition: all var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {
  background: ${t.sf} !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-mini-guide-renderer.ytd-app {
  top: 70px !important;
  left: 10px !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-mini-guide-entry-renderer {
  margin-top: 10px !important;
  border-radius: ${t.radius} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-mini-guide-entry-renderer:hover {
  transform: scale(1.15) !important;
  box-shadow: ${t.shadowHover} !important;
}
`;
}

function gen_panels(t) {
  return `/* src/content/ui-styles/${t.name}/components/panels.css */
html[data-ypp-ui-style="${t.name}"] ytd-playlist-panel-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] #secondary-inner ytd-playlist-panel-renderer {
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] .header.ytd-playlist-panel-renderer {
  background: ${t.primary} !important;
  border-bottom: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-miniplayer,
html[data-ypp-ui-style="${t.name}"] #miniplayer-bar {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadowHover} !important;
  overflow: hidden !important;
}
html[data-ypp-ui-style="${t.name}"] .ypp-video-controls,
html[data-ypp-ui-style="${t.name}"] .ypp-shadow-panel {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-transcript-search-panel-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-transcript-segment-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-transcript-segment-renderer:hover {
  background: ${t.primary} !important;
  color: ${t.accent} !important;
}
html[data-ypp-ui-style="${t.name}"] #ypp-pl-root .ypp-pl-sidebar {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
}
html[data-ypp-ui-style="${t.name}"] #ypp-pl-root .ypp-pl-btn-play,
html[data-ypp-ui-style="${t.name}"] #ypp-pl-root .ypp-pl-btn-shuffle,
html[data-ypp-ui-style="${t.name}"] #ypp-pl-root .ypp-pl-btn-tool {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  transition: transform var(--bounce), background var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] #ypp-pl-root .ypp-pl-btn-play:hover,
html[data-ypp-ui-style="${t.name}"] #ypp-pl-root .ypp-pl-btn-shuffle:hover {
  background: ${t.primary} !important;
  transform: scale(1.04) !important;
}
`;
}

function gen_channels(t) {
  return `/* src/content/ui-styles/${t.name}/pages/channels.css */
html[data-ypp-ui-style="${t.name}"] ytd-c4-tabbed-header-renderer,
html[data-ypp-ui-style="${t.name}"] #channel-header,
html[data-ypp-ui-style="${t.name}"] #channel-container {
  background: ${t.bg} !important;
  border-bottom: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] #tabs-inner-container {
  background: ${t.sf} !important;
  border-bottom: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-tab {
  border-radius: ${t.radius} !important;
  transition: all var(--bounce) !important;
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-tab:hover {
  background: ${t.primary} !important;
  transform: translateY(-2px) !important;
  box-shadow: ${t.shadow} !important;
}
html[data-ypp-ui-style="${t.name}"] tp-yt-paper-tab[aria-selected="true"] {
  background: ${t.accent} !important;
  color: ${t.bg} !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-channel-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  padding: 16px !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-channel-renderer:hover {
  box-shadow: ${t.shadowHover} !important;
  transform: translateY(-2px) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-c4-tabbed-header-renderer yt-img-shadow {
  border: ${t.border} !important;
  border-radius: 50% !important;
  box-shadow: ${t.shadowHover} !important;
}
`;
}

function gen_comments(t) {
  return `/* src/content/ui-styles/${t.name}/pages/comments.css */
html[data-ypp-ui-style="${t.name}"] ytd-comment-thread-renderer,
html[data-ypp-ui-style="${t.name}"] ytd-comment-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  padding: 12px !important;
  margin-bottom: 8px !important;
  box-shadow: ${t.shadow} !important;
  transition: all var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-comment-renderer:hover {
  box-shadow: ${t.shadowHover} !important;
  border: ${t.borderHover} !important;
}
html[data-ypp-ui-style="${t.name}"] #author-text.ytd-comment-renderer {
  color: ${t.accent} !important;
  font-weight: bold !important;
}
html[data-ypp-ui-style="${t.name}"] #content-text.ytd-comment-renderer {
  color: ${t.text} !important;
  font-family: ${t.font} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-comment-replies-renderer {
  border-left: ${t.border} !important;
  margin-left: 16px !important;
  padding-left: 12px !important;
}
html[data-ypp-ui-style="${t.name}"] #header-author yt-img-shadow {
  border: ${t.border} !important;
  border-radius: 50% !important;
}
html[data-ypp-ui-style="${t.name}"] #simplebox-placeholder {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  border: ${t.border} !important;
  color: ${t.textSub} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-backstage-post-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  padding: 16px !important;
  box-shadow: ${t.shadow} !important;
}
`;
}

function gen_home(t) {
  return `/* src/content/ui-styles/${t.name}/pages/home.css */
html[data-ypp-ui-style="${t.name}"] #frosted-glass.with-chipbar.ytd-app {
  background: none !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-feed-filter-chip-bar-renderer {
  background: transparent !important;
  border: none !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-browse[page-subtype=home] #chips {
  margin: 16px 0 0 0 !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  position: relative !important;
  overflow: hidden !important;
  padding: 0 10px !important;
  background: ${t.sf} !important;
  border: ${t.border} !important;
  transition: box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] yt-chip-cloud-chip-renderer {
  border-radius: var(--chip-radius) !important;
  border: var(--chip-border) !important;
  background: var(--chip-bg) !important;
  box-shadow: var(--chip-shadow) !important;
  transition: all 0.2s ease !important;
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] yt-chip-cloud-chip-renderer:hover {
  background: var(--chip-bg-hover) !important;
  transform: scale(1.05) !important;
}
html[data-ypp-ui-style="${t.name}"] yt-chip-cloud-chip-renderer[selected] {
  background: var(--chip-bg-selected) !important;
  color: var(--chip-color-selected) !important;
  border: var(--chip-border-selected) !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytChipShapeChip {
  border-radius: ${t.radius} !important;
  transition: transform var(--bounce), box-shadow var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] .ytChipShapeChip:hover {
  transform: scale(1.1) !important;
  box-shadow: ${t.shadowHover} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-rich-grid-renderer {
  background: ${t.bg} !important;
}
html[data-ypp-ui-style="${t.name}"] #primary.ytd-app {
  background: ${t.bg} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-browse {
  background: ${t.bg} !important;
}
`;
}

function gen_livechat(t) {
  return `/* src/content/ui-styles/${t.name}/pages/livechat.css */
html[data-ypp-ui-style="${t.name}"] yt-live-chat-app,
html[data-ypp-ui-style="${t.name}"] #chat,
html[data-ypp-ui-style="${t.name}"] yt-live-chat-renderer {
  background: ${t.bg} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  font-family: ${t.font} !important;
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] yt-live-chat-text-message-renderer {
  background: ${t.sf} !important;
  border-bottom: ${t.border} !important;
  padding: 6px 12px !important;
  transition: background var(--bounce) !important;
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] yt-live-chat-text-message-renderer:hover {
  background: ${t.primary} !important;
}
html[data-ypp-ui-style="${t.name}"] yt-live-chat-ticker-renderer {
  background: ${t.primary} !important;
  border-bottom: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] #author-name.yt-live-chat-author-chip {
  color: ${t.accent} !important;
  font-weight: bold !important;
}
html[data-ypp-ui-style="${t.name}"] yt-live-chat-paid-message-renderer {
  background: linear-gradient(135deg, ${t.primary}, ${t.secondary}) !important;
  border: ${t.borderHover} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadowHover} !important;
}
`;
}

function gen_player(t) {
  return `/* src/content/ui-styles/${t.name}/pages/player.css */
html[data-ypp-ui-style="${t.name}"] .ytp-chrome-bottom,
html[data-ypp-ui-style="${t.name}"] .ytp-gradient-bottom {
  background: linear-gradient(to top, ${t.primary} 0%, transparent 100%) !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-progress-bar-container {
  height: ${t.name==='neo-brutalism' ? '8px' : '4px'} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-play-progress,
html[data-ypp-ui-style="${t.name}"] .ytp-swatch-background-color {
  background-color: ${t.accent} !important;
  box-shadow: 0 0 8px ${t.accent} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-load-progress {
  background-color: ${t.textSub} !important;
  opacity: 0.5 !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-volume-slider-handle {
  background: ${t.accent} !important;
  border-radius: ${t.name==='matrix'||t.name==='neo-brutalism' ? '0px' : '50%'} !important;
  border: ${t.border} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-chrome-controls button {
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-chrome-controls button:hover {
  color: ${t.accent} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-settings-menu,
html[data-ypp-ui-style="${t.name}"] .ytp-panel-menu {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-menuitem {
  color: ${t.text} !important;
  font-family: ${t.font} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-menuitem:hover {
  background: ${t.primary} !important;
  color: ${t.accent} !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-ce-element {
  border-radius: ${t.name==='neo-brutalism' ? '0px' : t.radius} !important;
  border: ${t.border} !important;
  box-shadow: ${t.shadowHover} !important;
  overflow: hidden !important;
}
html[data-ypp-ui-style="${t.name}"] .ytp-ce-element:hover {
  box-shadow: ${t.shadowHover} !important;
  transform: scale(1.04) !important;
}
`;
}

function gen_search(t) {
  return `/* src/content/ui-styles/${t.name}/pages/search.css */
html[data-ypp-ui-style="${t.name}"] ytd-search,
html[data-ypp-ui-style="${t.name}"] ytd-search-header-renderer {
  background: ${t.bg} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-video-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  margin-bottom: 12px !important;
  padding: 12px !important;
  transition: all var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-video-renderer:hover {
  box-shadow: ${t.shadowHover} !important;
  border: ${t.borderHover} !important;
  transform: translateY(-2px) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-search-pyv-renderer {
  background: ${t.sf} !important;
  border: ${t.borderHover} !important;
  border-radius: ${t.radius} !important;
  padding: 12px !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-shelf-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  padding: 16px !important;
  box-shadow: ${t.shadow} !important;
  margin-bottom: 16px !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-searchbox {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
}
`;
}

function gen_shorts(t) {
  return `/* src/content/ui-styles/${t.name}/pages/shorts.css */
html[data-ypp-ui-style="${t.name}"] ytd-shorts,
html[data-ypp-ui-style="${t.name}"] #shorts-container {
  background: ${t.bg} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-reel-video-renderer {
  background: ${t.sf} !important;
  border-radius: ${t.radius} !important;
  box-shadow: ${t.shadow} !important;
  border: ${t.border} !important;
  overflow: hidden !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-reel-player-overlay-renderer {
  background: transparent !important;
}
html[data-ypp-ui-style="${t.name}"] #actions.ytd-reel-player-overlay-renderer ytd-button-renderer {
  background: ${t.sf} !important;
  border-radius: 50% !important;
  border: ${t.border} !important;
  box-shadow: ${t.shadow} !important;
  margin-bottom: 12px !important;
  transition: all var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] #actions.ytd-reel-player-overlay-renderer ytd-button-renderer:hover {
  box-shadow: ${t.shadowHover} !important;
  transform: scale(1.1) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-reel-item-renderer {
  border-radius: ${t.radius} !important;
  border: ${t.border} !important;
  overflow: hidden !important;
  transition: all var(--bounce) !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-reel-item-renderer:hover {
  box-shadow: ${t.shadowHover} !important;
}
`;
}

function gen_watch(t) {
  return `/* src/content/ui-styles/${t.name}/pages/watch.css */
html[data-ypp-ui-style="${t.name}"] ytd-watch-flexy {
  background: ${t.bg} !important;
}
html[data-ypp-ui-style="${t.name}"] #primary.ytd-watch-flexy,
html[data-ypp-ui-style="${t.name}"] #secondary.ytd-watch-flexy {
  background: ${t.bg} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-video-primary-info-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  padding: 16px !important;
  box-shadow: ${t.shadow} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-video-secondary-info-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  padding: 16px !important;
  margin-top: 8px !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-watch-metadata {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  padding: 12px !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-playlist-panel-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
}
html[data-ypp-ui-style="${t.name}"] #description-inline-expander {
  color: ${t.text} !important;
}
html[data-ypp-ui-style="${t.name}"] ytd-expandable-metadata-renderer {
  background: ${t.sf} !important;
  border: ${t.border} !important;
  border-radius: ${t.radius} !important;
  padding: 12px !important;
}
html[data-ypp-ui-style="${t.name}"] #above-the-fold {
  border-bottom: ${t.border} !important;
  padding-bottom: 12px !important;
}
`;
}

function gen_card_style(t) {
  return `/* src/content/ui-styles/${t.name}/card-style.css */
html[data-ypp-card-style="${t.name}"] {
  --sf:           ${t.sf};
  --shadow-base:  ${t.shadow};
  --shadow-hover: ${t.shadowHover};
  --shadow-active:${t.shadowActive};
  --blur:         blur(10px);
  --${t.name}-bg:       ${t.bg};
  --${t.name}-sf:       ${t.sf};
  --${t.name}-primary:  ${t.primary};
  --${t.name}-secondary:${t.secondary};
  --${t.name}-accent:   ${t.accent};
  --${t.name}-border:   ${t.border};
  --${t.name}-border-hover: ${t.borderHover};
  --${t.name}-text:     ${t.text};
  --${t.name}-text-sub: ${t.textSub};
  --${t.name}-radius:   ${t.radius};
}

html[data-ypp-card-style='${t.name}']
  :is(
    ytd-rich-item-renderer,
    ytd-video-renderer,
    ytd-playlist-renderer,
    ytd-radio-renderer,
    ytd-channel-renderer,
    ytd-compact-video-renderer,
    ytd-grid-video-renderer,
    .ypp-grid-item,
    yt-lockup-view-model
  ) {
  background: ${t.sf} !important;
  --yt-spec-text-primary: ${t.text} !important;
  --yt-spec-text-secondary: ${t.textSub} !important;
  border-radius: ${t.radius} !important;
  border: ${t.border} !important;
  padding: var(--ypp-density-pad, 14px) !important;
  box-shadow: ${t.shadow} !important;
  transition: all 0.2s ease !important;
}

html[data-ypp-card-style='${t.name}']
  :is(
    ytd-rich-item-renderer,
    ytd-video-renderer,
    ytd-playlist-renderer,
    ytd-radio-renderer,
    ytd-channel-renderer,
    ytd-compact-video-renderer,
    ytd-grid-video-renderer,
    .ypp-grid-item,
    yt-lockup-view-model
  ):hover {
  background: ${t.primary} !important;
  border-color: ${t.accent} !important;
  transform: ${t.name==='neo-brutalism' ? 'translate(-4px,-4px)' : 'translateY(-2px) scale(1.01)'} !important;
  box-shadow: ${t.shadowHover} !important;
}

html[data-ypp-card-style='${t.name}']
  :is(ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer) #video-title {
  color: ${t.text} !important;
  font-family: ${t.font} !important;
}

html[data-ypp-card-style='${t.name}']
  :is(ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer) #metadata-line span {
  color: ${t.textSub} !important;
}

html[data-ypp-card-style='${t.name}'] ytd-thumbnail {
  border-radius: ${t.name==='steampunk' ? '6px' : t.radius} !important;
  border: ${t.border} !important;
  overflow: hidden !important;
}

html[data-ypp-card-style='${t.name}'] #mouseover-overlay,
html[data-ypp-card-style='${t.name}'] ytd-video-preview {
  display: none !important;
}
`;
}

function gen_index(t) {
  return `@import "../shared/timeline-visibility.css";
/* ${t.name.toUpperCase()} - 17-File Structured UI Style */

@import "./base/animations.css";
@import "./base/background.css";
@import "./base/layout.css";
@import "./base/tokens.css";
@import "./components/badges.css";
@import "./components/buttons.css";
@import "./components/cards.css";
@import "./components/forms.css";
@import "./components/icons.css";
@import "./components/menus.css";
@import "./components/navbar.css";
@import "./components/panels.css";
@import "./pages/channels.css";
@import "./pages/comments.css";
@import "./pages/home.css";
@import "./pages/livechat.css";
@import "./pages/player.css";
@import "./pages/search.css";
@import "./pages/shorts.css";
@import "./pages/watch.css";
`;
}

function gen_theme_tokens(t) {
  return `/* ${t.name}/theme/base/tokens.css */
html[data-ypp-ui-style="${t.name}"] {
  /* Popup/Extension theme mirror */
  --ypp-bg-base:    ${t.bg};
  --ypp-bg-surface: ${t.sf};
  --ypp-accent:     ${t.accent};
  --ypp-text-primary: ${t.text};
  --ypp-text-secondary: ${t.textSub};
}
`;
}

// ─── MAIN LOOP ──────────────────────────────────────────────────────────────

themes.forEach(name => {
  const t = T[name];
  mkdirs(name);

  const files = {
    'base/animations.css':   gen_animations(t),
    'base/background.css':   gen_background(t),
    'base/layout.css':       gen_layout(t),
    'base/tokens.css':       gen_tokens(t),
    'components/badges.css': gen_badges(t),
    'components/buttons.css':gen_buttons(t),
    'components/cards.css':  gen_cards(t),
    'components/forms.css':  gen_forms(t),
    'components/icons.css':  gen_icons(t),
    'components/menus.css':  gen_menus(t),
    'components/navbar.css': gen_navbar(t),
    'components/panels.css': gen_panels(t),
    'pages/channels.css':    gen_channels(t),
    'pages/comments.css':    gen_comments(t),
    'pages/home.css':        gen_home(t),
    'pages/livechat.css':    gen_livechat(t),
    'pages/player.css':      gen_player(t),
    'pages/search.css':      gen_search(t),
    'pages/shorts.css':      gen_shorts(t),
    'pages/watch.css':       gen_watch(t),
    'card-style.css':        gen_card_style(t),
    'index.css':             gen_index(t),
    'theme/index.css':       `@import "../../shared/timeline-visibility.css";\n@import "./base/tokens.css";\n`,
    'theme/base/tokens.css': gen_theme_tokens(t),
  };

  let bundle = '';
  for (const [rel, css] of Object.entries(files)) {
    const full = path.join(baseDir, name, rel);
    fs.writeFileSync(full, css);
    if (rel !== 'index.css' && rel !== 'theme/index.css') {
      bundle += css + '\n';
    }
  }
  fs.writeFileSync(path.join(baseDir, name, 'bundle.css'), bundle);

  const lines = bundle.split('\n').length;
  const fileCount = Object.keys(files).length;
  console.log(`[${name}] Done — ${fileCount} files, bundle: ${lines} lines`);
});

console.log('\nAll 13 themes now match the vintage file structure!');
