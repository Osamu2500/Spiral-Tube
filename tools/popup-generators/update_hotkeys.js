const fs = require('fs');
const cssPath = 'src/popup/popup.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Overhaul .vsc-shortcut-row
css = css.replace(
  /\.vsc-shortcut-row\s*{[\s\S]*?}/,
  `.vsc-shortcut-row {\n  display: flex; gap: 8px; align-items: center;\n  background: rgba(255,255,255,0.02); padding: 10px 14px;\n  border-radius: 12px; border: 1px solid rgba(255,255,255,0.04);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);\n  transition: all 0.25s var(--ease-spring); width: 100%; box-sizing: border-box;\n}`
);

css = css.replace(
  /\.vsc-shortcut-row:hover\s*{[\s\S]*?}/,
  `.vsc-shortcut-row:hover {\n  background: color-mix(in srgb, var(--accent-primary) 5%, rgba(255,255,255,0.05));\n  border-color: color-mix(in srgb, var(--accent-primary) 30%, rgba(255,255,255,0.1));\n  transform: translateY(-2px) scale(1.015);\n  box-shadow: 0 8px 24px color-mix(in srgb, var(--accent-primary) 12%, rgba(0,0,0,0.3)), inset 0 1px 0 rgba(255,255,255,0.1);\n}`
);

// 2. Overhaul input/select
css = css.replace(
  /\.vsc-select, \.vsc-key-input, \.vsc-val-input\s*{[\s\S]*?}/,
  `.vsc-select, .vsc-key-input, .vsc-val-input {\n  background: rgba(0,0,0,0.25); color: #fff;\n  border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;\n  padding: 8px 12px; font-size: 11px; outline: none;\n  font-family: inherit; transition: all 0.2s var(--ease-spring);\n  backdrop-filter: blur(12px);\n}`
);

css = css.replace(
  /\.vsc-select:hover, \.vsc-key-input:hover, \.vsc-val-input:hover\s*{[\s\S]*?}/,
  `.vsc-select:hover, .vsc-key-input:hover, .vsc-val-input:hover {\n  border-color: rgba(255,255,255,0.2);\n  background: rgba(0,0,0,0.4);\n  transform: translateY(-1px);\n}`
);

css = css.replace(
  /\.vsc-select:focus, \.vsc-key-input:focus, \.vsc-val-input:focus\s*{[\s\S]*?}/,
  `.vsc-select:focus, .vsc-key-input:focus, .vsc-val-input:focus {\n  border-color: var(--accent-primary);\n  background: rgba(0,0,0,0.5);\n  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent-primary) 30%, transparent), 0 0 12px var(--accent-glow-sm);\n  transform: translateY(-1px);\n}`
);

// 3. Overhaul RM button
css = css.replace(
  /\.vsc-rm-btn\s*{[\s\S]*?}/,
  `.vsc-rm-btn {\n  width: 28px; height: 28px; background: rgba(255,78,69,0.05); color: #ff4e45;\n  border: 1px solid rgba(255,78,69,0.1); border-radius: 8px; cursor: pointer;\n  font-size: 14px; display: flex; align-items: center; justify-content: center;\n  transition: all 0.25s var(--ease-spring);\n  flex-shrink: 0;\n}`
);

css = css.replace(
  /\.vsc-rm-btn:hover\s*{[\s\S]*?}/,
  `.vsc-rm-btn:hover {\n  background: linear-gradient(135deg, rgba(255,78,69,0.8), rgba(220,38,38,0.8));\n  color: white;\n  border-color: rgba(255,255,255,0.2);\n  transform: scale(1.1) translateY(-1px);\n  box-shadow: 0 4px 12px rgba(255,78,69,0.3), inset 0 1px 1px rgba(255,255,255,0.3);\n}`
);

// Also do .shortcut-panel-row
css = css.replace(
  /\.shortcut-panel-row\s*{[\s\S]*?}/,
  `.shortcut-panel-row {\n  display: flex; flex-direction: column; align-items: flex-start; gap: 8px;\n  background: rgba(255,255,255,0.02); padding: 10px 14px;\n  border-radius: 12px; border: 1px solid rgba(255,255,255,0.04);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);\n}`
);

fs.writeFileSync(cssPath, css);
console.log('Nav Hotkeys UI overhauled.');
