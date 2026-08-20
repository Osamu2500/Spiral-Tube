const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');

// Fix kawaii
const kawaiiPath = path.join(uiStylesDir, 'kawaii', 'overrides.css');
if (fs.existsSync(kawaiiPath)) {
  let content = fs.readFileSync(kawaiiPath, 'utf8');
  content = content.replace(/@keyframes kawaiiBounce \{\n\s*transform: translateY\(0\);\n\}\n\s*50% \{\n\s*transform: translateY\(-5px\);\n\}\n\s*100% \{\n\s*transform: translateY\(0\);\n\}/, 
    `@keyframes kawaiiBounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}`);
  
  // also fix line 170
  content = content.replace(/background-color: var\(--ypp-bg-surface, #fff\) !important;\n\s*\}/, 
    `background-color: var(--ypp-bg-surface, #fff) !important;`);
  
  fs.writeFileSync(kawaiiPath, content, 'utf8');
}

// Fix frutiger-aero
const aeroPath = path.join(uiStylesDir, 'frutiger-aero', 'overrides.css');
if (fs.existsSync(aeroPath)) {
  let content = fs.readFileSync(aeroPath, 'utf8');
  content = content.replace(/@keyframes faFloat1 \{\n\s*transform: scale\(0.94\) translateY\(-6px\);\n\}\n\n\s*60% \{\n\s*transform: scale\(1.02\) translateY\(2px\);\n\}\n\n\s*100% \{\n\s*transform: scale\(0.94\) translateY\(-6px\);\n\}/,
    `@keyframes faFloat1 {
  0% { transform: scale(0.94) translateY(-6px); }
  60% { transform: scale(1.02) translateY(2px); }
  100% { transform: scale(0.94) translateY(-6px); }
}`);
  content = content.replace(/@keyframes faFloatIcon \{\n\s*transform: translateY\(10px\);\n\}\n\n\s*100% \{\n\s*transform: translateY\(0\);\n\}/,
    `@keyframes faFloatIcon {
  0% { transform: translateY(10px); }
  100% { transform: translateY(0); }
}`);
  fs.writeFileSync(aeroPath, content, 'utf8');
}

// Fix vintage
const vintagePath = path.join(uiStylesDir, 'vintage', 'index.css');
if (fs.existsSync(vintagePath)) {
  let content = fs.readFileSync(vintagePath, 'utf8');
  content = content.replace(/""vintage""/g, '"vintage"');
  fs.writeFileSync(vintagePath, content, 'utf8');
}

console.log('Fixed final edge cases');
