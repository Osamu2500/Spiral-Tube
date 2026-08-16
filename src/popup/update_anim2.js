const fs = require('fs');
let css = fs.readFileSync('src/popup/popup.css', 'utf8');

css = css.replace(
  '.theme-btn {\r\n  display: flex; align-items: center; gap: 8px; padding: 6px 10px;\r\n  background: var(--bg-card); border: 1px solid var(--border);\r\n  border-radius: var(--r-lg); cursor: pointer; transition: all .2s ease;\r\n  text-align: left; position: relative; overflow: hidden; font-family: inherit;\r\n}',
  '.theme-btn {\r\n  display: flex; align-items: center; gap: 8px; padding: 6px 10px;\r\n  background: var(--bg-card); border: 1px solid var(--border);\r\n  border-radius: var(--r-lg); cursor: pointer; transition: all 0.25s var(--ease-spring), transform 0.1s;\r\n  text-align: left; position: relative; overflow: hidden; font-family: inherit;\r\n}\r\n.theme-btn:active {\r\n  transform: scale(0.95);\r\n}'
);

fs.writeFileSync('src/popup/popup.css', css, 'utf8');
console.log('CSS updated successfully (part 2)');
