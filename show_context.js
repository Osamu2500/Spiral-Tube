const fs = require('fs');

function showContext(file, line) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const start = Math.max(0, line - 5);
  const end = Math.min(lines.length, line + 5);
  console.log(`\n--- ${file} : ${line} ---`);
  for (let i = start; i < end; i++) {
    console.log(`${i+1}: ${lines[i]}`);
  }
}

showContext('src/content/ui-styles/kawaii/overrides.css', 150);
showContext('src/content/ui-styles/kawaii/overrides.css', 170);
showContext('src/content/ui-styles/kawaii/overrides.css', 635);
showContext('src/content/ui-styles/sakura/overrides.css', 228);
showContext('src/content/ui-styles/galaxy/overrides.css', 357);
showContext('src/content/ui-styles/retrowave-green/overrides.css', 36);
showContext('src/content/ui-styles/nebula/overrides.css', 5);
showContext('src/content/ui-styles/terminalism/overrides.css', 3);
showContext('src/content/ui-styles/frutiger-aero/overrides.css', 53);
showContext('src/content/ui-styles/harry-potter/overrides.css', 8);
showContext('src/content/ui-styles/retro/overrides.css', 203);
showContext('src/content/ui-styles/blue-sky/overrides.css', 36);
