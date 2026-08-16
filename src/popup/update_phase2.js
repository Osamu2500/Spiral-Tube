const fs = require('fs');
const cssPath = 'src/popup/popup.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Scrollbars Overhaul
css = css.replace(
  /\.tab-content::-webkit-scrollbar\s*{\s*width:\s*4px;\s*}\s*\.tab-content::-webkit-scrollbar-thumb\s*{\s*background:\s*rgba\(255,255,255,\.08\);\s*border-radius:\s*4px;\s*}\s*\.tab-content::-webkit-scrollbar-thumb:hover\s*{\s*background:\s*rgba\(255,255,255,\.18\);\s*}/g,
  `::-webkit-scrollbar {\n  width: 6px;\n  background: transparent;\n}\n::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 10px;\n  border: 2px solid transparent;\n  background-clip: padding-box;\n}\n::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.3);\n  border-radius: 10px;\n  border: 2px solid transparent;\n  background-clip: padding-box;\n}\n.tab-content::-webkit-scrollbar { width: 6px; }\n.tab-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border: 2px solid transparent; background-clip: padding-box; border-radius: 10px; }\n.tab-content::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.3); border: 2px solid transparent; background-clip: padding-box; }`
);

// 2. Select Menus & Dropdowns
css = css.replace(
  /\.theme-select\s*{\s*width:\s*100%;\s*padding:\s*10px\s*14px;[\s\S]*?}/,
  `.theme-select {\n  width: 100%; padding: 10px 14px;\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  border-radius: 12px;\n  color: var(--text-1);\n  font-size: 12px; font-weight: 500;\n  outline: none; cursor: pointer;\n  -webkit-appearance: none;\n  transition: all var(--fast) var(--ease-spring);\n  backdrop-filter: blur(12px);\n}\n.theme-select:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(255, 255, 255, 0.2);\n  transform: translateY(-1px) scale(1.01);\n  box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n}`
);

// 3. Top-bar & Nav Backdrop Blurs
css = css.replace(
  /\.top-bar\s*{[\s\S]*?}/,
  `.top-bar {\n  -webkit-backdrop-filter: blur(40px) saturate(200%);\n  backdrop-filter: blur(40px) saturate(200%);\n  height: 64px; padding: 0 22px;\n  display: flex; align-items: center;\n  justify-content: space-between;\n  flex-shrink: 0;\n  background: rgba(10, 10, 12, 0.4);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.05);\n  position: relative;\n  z-index: 5;  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.08);\n}`
);

// 4. toggle-card dynamic micro-interactions
// Let's replace the hover scale for .toggle-card
css = css.replace(
  /\.toggle-card:hover\s*{[\s\S]*?}/,
  `.toggle-card:hover {\n  background: color-mix(in srgb, var(--accent-primary) 8%, rgba(255,255,255,0.05));\n  border-color: color-mix(in srgb, var(--accent-primary) 50%, rgba(255,255,255,0.1));\n  transform: translateY(-2px) scale(1.015);\n  box-shadow: 0 8px 24px color-mix(in srgb, var(--accent-primary) 15%, rgba(0,0,0,0.4)), inset 0 1px 0 rgba(255,255,255,0.1);\n}`
);

// Write changes
fs.writeFileSync(cssPath, css);
console.log('Phase 2 UI Polish completed in popup.css.');
