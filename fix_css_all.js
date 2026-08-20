const fs = require('fs');

function fixFile(file, replacer) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = replacer(content);
    fs.writeFileSync(file, content);
  }
}

// kawaii
fixFile('src/content/ui-styles/kawaii/overrides.css', content => {
  content = content.replace(/background-color: var\(--kawaii-text-secondary\)/g, '/* background-color: var(--kawaii-text-secondary) */');
  content = content.replace(/background-color: var\(--ypp-bg-surface, #fff\)/g, '/* background-color: var(--ypp-bg-surface, #fff) */');
  content = content.replace(/100% \{\n  transform: translateY\(-15px\) scale\(1\.2\);\n/g, '100% {\n  transform: translateY(-15px) scale(1.2);\n}\n');
  return content;
});

// sakura
fixFile('src/content/ui-styles/sakura/overrides.css', content => {
  content = content.replace(/@media \(width: 1280px\) \{/g, '/* @media (width: 1280px) { */');
  return content;
});

// retro
fixFile('src/content/ui-styles/retro/overrides.css', content => {
  content = content.replace(/@media \(width: 1280px\) \{/g, '/* @media (width: 1280px) { */');
  return content;
});

// galaxy
fixFile('src/content/ui-styles/galaxy/overrides.css', content => {
  content = content.replace(/}\n@keyframes galaxyFloat \{\n  0%, 100% \{/g, '@keyframes galaxyFloat {\n  0%, 100% {');
  content = content.replace(/}\n\n}\n@keyframes galaxyFloat \{/g, '}\n@keyframes galaxyFloat {');
  content = content.replace(/@keyframes galaxyFloat \{\n  0%, 100% \{ transform: translateY\(0\);\n\}\n\n50% \{/g, '@keyframes galaxyFloat {\n  0%, 100% { transform: translateY(0);\n}\n\n50% {');
  // Just blanket fix extra } before @keyframes galaxyFloat
  content = content.replace(/}\n@keyframes galaxyFloat \{/g, '@keyframes galaxyFloat {');
  return content;
});

// retrowave-green
fixFile('src/content/ui-styles/retrowave-green/overrides.css', content => {
  content = content.replace(/background-color: var\(--retrowave-green-text-secondary\)/g, '/* background-color */');
  return content;
});

// nebula
fixFile('src/content/ui-styles/nebula/overrides.css', content => {
  content = content.replace(/@keyframes nebula-twinkle \{\n  transform: scale\(1\);\n\}/g, '@keyframes nebula-twinkle {\n  0% { transform: scale(1); }');
  return content;
});

// terminalism
fixFile('src/content/ui-styles/terminalism/overrides.css', content => {
  content = content.replace(/}\n@keyframes termGlowPulse \{/g, '@keyframes termGlowPulse {');
  return content;
});

// frutiger-aero
fixFile('src/content/ui-styles/frutiger-aero/overrides.css', content => {
  content = content.replace(/@keyframes faero-pop-in \{\n  transform: scale\(0.94\) translateY\(-6px\);\n\}/g, '@keyframes faero-pop-in {\n  0% { transform: scale(0.94) translateY(-6px); }');
  content = content.replace(/@keyframes faero-card-in \{\n  transform: translateY\(10px\);\n\}/g, '@keyframes faero-card-in {\n  0% { transform: translateY(10px); }');
  return content;
});

// blue-sky
fixFile('src/content/ui-styles/blue-sky/overrides.css', content => {
  content = content.replace(/}\n\/\* ── Fade-in/g, '/* ── Fade-in');
  content = content.replace(/@keyframes sky-fade-in \{\n  transform: translateY\(16px\) scale\(0.98\);\n\}/g, '@keyframes sky-fade-in {\n  0% { transform: translateY(16px) scale(0.98); }');
  return content;
});

// harry-potter
fixFile('src/content/ui-styles/harry-potter/overrides.css', content => {
  // Move imports to top
  const importMatch = content.match(/@import url\("[^"]+"\);\n/);
  if (importMatch) {
    content = content.replace(importMatch[0], '');
    content = importMatch[0] + content;
  }
  return content;
});

console.log('Fixed CSS files.');
