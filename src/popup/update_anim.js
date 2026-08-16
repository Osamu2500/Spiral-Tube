const fs = require('fs');
let css = fs.readFileSync('src/popup/popup.css', 'utf8');

// 1. Tab content animation
css = css.replace(
  '.tab-content { display: none; }',
  '.tab-content { display: none; }\n@keyframes tab-enter {\n  from { opacity: 0; transform: scale(0.98); }\n  to { opacity: 1; transform: scale(1); }\n}'
);

css = css.replace(
  '.tab-content.active { display: block; opacity: 1; transform: translateY(0); }',
  '.tab-content.active { display: block; opacity: 1; transform: translateY(0); animation: tab-enter 0.35s var(--ease-spring) both; }'
);

// 2. Section enter animation
css = css.replace(
  '@keyframes section-enter {\r\n  from { opacity: 0; transform: translateY(10px); }\r\n  to   { opacity: 1; transform: translateY(0); }\r\n}',
  '@keyframes section-enter {\r\n  from { opacity: 0; transform: translateY(12px) scale(0.99); }\r\n  to   { opacity: 1; transform: translateY(0) scale(1); }\r\n}'
);

css = css.replace(
  'animation: section-enter 0.28s var(--ease-snap) both;',
  'animation: section-enter 0.4s var(--ease-spring) both;'
);

// 3. Tactile active states
css = css.replace(
  '.nav-item:hover {\r\n  background: rgba(255, 255, 255, 0.05);',
  '.nav-item:hover {\r\n  background: rgba(255, 255, 255, 0.05);\r\n}\r\n.nav-item:active {\r\n  transform: scale(0.94);'
);

css = css.replace(
  'transition: border-color 0.25s ease, box-shadow 0.25s ease;',
  'transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease;\r\n}\r\n.feature-card:active {\r\n  transform: scale(0.97);'
);

// Toggle transition
css = css.replace(
  '.slider {\r\n  position: absolute; inset: 0;',
  '.slider {\r\n  position: absolute; inset: 0;\r\n  transition: all 0.4s var(--ease-spring);'
);

fs.writeFileSync('src/popup/popup.css', css, 'utf8');
console.log('CSS updated successfully');
