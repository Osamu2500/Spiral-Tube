const fs = require('fs');
const cssPath = 'src/popup/popup.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Update Typography Colors
css = css.replace(
  /--text-primary:\s*#f5eef0;[\s\S]*?--text-muted:\s*#a08890;[\s\S]*?--text-dim:\s*rgba\(160,\s*136,\s*144,\s*0\.55\);/,
  `--text-primary: #ffffff;\n  --text-muted:   #a1a1aa;\n  --text-dim:     #52525b;`
);

// 2. Update Section Title Gradient
css = css.replace(
  /\.section-title\s*{[\s\S]*?}/,
  `.section-title {\n  font-size: 11px; font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: .15em; margin: 0;\n  display: flex; align-items: center; gap: 8px;\n  color: #fff;\n  background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  text-shadow: 0 2px 10px rgba(255,255,255,0.15);\n}`
);

// 3. Update Toggle Card hover and inner borders
css = css.replace(
  /\.toggle-card\s*{\s*background:\s*rgba\(255,\s*255,\s*255,\s*0\.02\);\s*border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.04\);\s*border-radius:\s*14px;/g,
  `.toggle-card {\n  background: rgba(255, 255, 255, 0.02);\n  border: 1px solid rgba(255, 255, 255, 0.04);\n  border-radius: 12px;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);`
);

// Improve slider UI
css = css.replace(
  /\.ypp-slider::-webkit-slider-runnable-track\s*{[\s\S]*?}/g,
  `.ypp-slider::-webkit-slider-runnable-track {\n  width: 100%; height: 2px;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: var(--r-pill);\n}`
);

css = css.replace(
  /\.ypp-slider::-webkit-slider-thumb\s*{[\s\S]*?}/g,
  `.ypp-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  height: 12px; width: 12px;\n  border-radius: 50%;\n  background: #ffffff;\n  margin-top: -5px;\n  cursor: pointer;\n  box-shadow: 0 0 12px var(--accent-primary), 0 0 4px rgba(255,255,255,0.8);\n  transition: transform var(--fast) var(--ease-spring), box-shadow var(--fast) var(--ease);\n}`
);

css = css.replace(
  /\.ypp-slider:hover::-webkit-slider-thumb\s*{[\s\S]*?}/g,
  `.ypp-slider:hover::-webkit-slider-thumb { transform: scale(1.25); box-shadow: 0 0 16px var(--accent-primary), 0 0 6px #fff; }`
);

fs.writeFileSync(cssPath, css);
console.log('Typography, gradients, and shapes updated in popup.css');
