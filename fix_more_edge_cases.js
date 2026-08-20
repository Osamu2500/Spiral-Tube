const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');

// Fix blue-sky
const blueSkyPath = path.join(uiStylesDir, 'blue-sky', 'overrides.css');
if (fs.existsSync(blueSkyPath)) {
  let content = fs.readFileSync(blueSkyPath, 'utf8');
  content = content.replace(/@keyframes bskyFadeIn \{\n\s*transform: translateY\(16px\) scale\(0\.98\);\n\s*opacity: 0;\n\}\n\s*100% \{\n\s*transform: translateY\(0\) scale\(1\);\n\s*opacity: 1;\n\s*\}/, 
    `@keyframes bskyFadeIn {
  0% { transform: translateY(16px) scale(0.98); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}`);
  fs.writeFileSync(blueSkyPath, content, 'utf8');
}

// Fix autumn
const autumnPath = path.join(uiStylesDir, 'autumn', 'overrides.css');
if (fs.existsSync(autumnPath)) {
  let content = fs.readFileSync(autumnPath, 'utf8');
  // Just rewrite animation block entirely to be safe
  content = content.replace(/\}?\n\s*0%, 100% \{\n\s*box-shadow: 4px 4px 18px rgba\(0,0,0,0.55\);\n\}\n\n\s*50% \{\n\s*box-shadow: 6px 6px 24px rgba\(0,0,0,0.7\);\n\}/, 
    `
  0%, 100% { box-shadow: 4px 4px 18px rgba(0,0,0,0.55); }
  50% { box-shadow: 6px 6px 24px rgba(0,0,0,0.7); }`);
  
  content = content.replace(/@keyframes autumnShadow \{\n\s*\n\s*0%, 100% \{\n\s*box-shadow: 4px 4px 18px rgba\(0,0,0,0.55\);\n\s*\}\n\s*50% \{\n\s*box-shadow: 6px 6px 24px rgba\(0,0,0,0.7\);\n\s*\}\n\}/, 
    `@keyframes autumnShadow {
  0%, 100% { box-shadow: 4px 4px 18px rgba(0,0,0,0.55); }
  50% { box-shadow: 6px 6px 24px rgba(0,0,0,0.7); }
}`);
  // actually a simpler fix for autumn
  content = content.replace(/@keyframes autumnShadow\s*\{[\s\S]*?\}(?=\s*\n|$)/g, `@keyframes autumnShadow {
  0%, 100% { box-shadow: 4px 4px 18px rgba(0,0,0,0.55); }
  50% { box-shadow: 6px 6px 24px rgba(0,0,0,0.7); }
}`);
  
  fs.writeFileSync(autumnPath, content, 'utf8');
}

console.log('Fixed final final edge cases');
