const fs = require('fs');

// --- UPDATE CSS ---
let css = fs.readFileSync('src/popup/popup.css', 'utf8');

const glowCss = `
/* ─── Glow Button Animation ─── */
.glow {
  --glow-line-color: #fff;
  --glow-line-thickness: 2px;
  --glow-line-length: 20;
  --glow-blur-color: #fff;
  --glow-blur-size: 5px;
  --animation-speed: 1200ms;
  --container-offset: 60px;
  position: relative;
}
.glow-container {
  pointer-events: none;
  position: absolute;
  inset: calc(var(--container-offset) / -2);
  width: calc(100% + var(--container-offset));
  height: calc(100% + var(--container-offset));
  opacity: 0;
  z-index: 10;
}
.glow-blur, .glow-line {
  width: calc(100% - var(--container-offset));
  height: calc(100% - var(--container-offset));
  x: calc(var(--container-offset) / 2);
  y: calc(var(--container-offset) / 2);
  fill: transparent;
  stroke: black;
  stroke-width: 5px;
  stroke-dasharray: var(--glow-line-length) calc(50 - var(--glow-line-length));
}
.glow-line {
  stroke: var(--glow-line-color);
  stroke-width: var(--glow-line-thickness);
}
.glow-blur {
  filter: blur(var(--glow-blur-size));
  stroke: var(--glow-blur-color);
  stroke-width: var(--glow-blur-size);
}
.glow:is(:hover, :focus) .glow-blur, .glow:is(:hover, :focus) .glow-line {
  stroke-dashoffset: -80px;
  transition: stroke-dashoffset var(--animation-speed) ease-in, stroke-dasharray var(--animation-speed) ease-in;
}
.glow:is(:hover, :focus) .glow-container {
  animation: glow-visibility var(--animation-speed) ease-in;
}
@keyframes glow-visibility {
  0%, 100% { opacity: 0; }
  25%, 75% { opacity: 1; }
}

`;

if (!css.includes('.glow-container')) {
  css += glowCss;
  
  // Remove overflow: hidden from .action-btn, .theme-btn etc so the glow can be seen outside
  css = css.replace(/overflow:\s*hidden;/g, (match, offset, str) => {
    // only replace if it's inside a button rule... this regex might be too broad.
    return match; // Let's keep it safe for now, or just append an override.
  });

  css += `
.action-btn, .theme-btn, .card-style-btn, .nav-item {
  overflow: visible !important;
}
`;
  fs.writeFileSync('src/popup/popup.css', css, 'utf8');
}

// --- UPDATE JS ---
let js = fs.readFileSync('src/popup/popup-main.js', 'utf8');

const glowJs = `
function initGlowButtons() {
  const buttons = document.querySelectorAll('.action-btn, .theme-btn, .card-style-btn, .nav-item');
  
  buttons.forEach(btn => {
    btn.classList.add('glow');
    
    // Add SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('glow-container');
    
    const rectBlur = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectBlur.setAttribute('pathLength', '100');
    rectBlur.setAttribute('stroke-linecap', 'round');
    rectBlur.classList.add('glow-blur');
    
    const rectLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectLine.setAttribute('pathLength', '100');
    rectLine.setAttribute('stroke-linecap', 'round');
    rectLine.classList.add('glow-line');
    
    svg.appendChild(rectBlur);
    svg.appendChild(rectLine);
    btn.appendChild(svg);
    
    // Set rx dynamically
    const rx = getComputedStyle(btn).borderRadius;
    rectBlur.setAttribute('rx', rx);
    rectLine.setAttribute('rx', rx);
  });
}

// Call it after components are rendered
`;

if (!js.includes('initGlowButtons')) {
  js = js.replace('initComponents();', 'initComponents();\n    setTimeout(initGlowButtons, 100);');
  js += glowJs;
  fs.writeFileSync('src/popup/popup-main.js', js, 'utf8');
}

console.log('Glow logic injected');
