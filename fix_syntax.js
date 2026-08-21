const fs = require('fs');
const path = require('path');

function replace(file, from, to) {
  const filepath = path.join('src', 'content', 'ui-styles', file, 'overrides.css');
  let content = fs.readFileSync(filepath, 'utf8');
  if (content.includes(from)) {
    content = content.replace(from, to);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Fixed in ${file}`);
  } else {
    console.log(`Pattern not found in ${file}`);
  }
}

// Fix frutiger-aero
replace('frutiger-aero', 
`}

/* ── Card hover: glassy float ── */
@keyframes aero-float {
  from { transform: translateY(0) scale(1);
}

to {
  transform: translateY(-8px) scale(1.02);
}

}`, 
`/* ── Card hover: glassy float ── */
@keyframes aero-float {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(-8px) scale(1.02); }
}`);

// Fix abyss
replace('abyss', `content: "";`, `content: "";`); // Wait, abyss line 65 and 1574
replace('abyss', `box-shadow: 0 0 20px rgba(0, 255, 204, 0.5) !important`, `box-shadow: 0 0 20px rgba(0, 255, 204, 0.5) !important;`);

// Let's do a more robust string replacement for keyframes in general.
const filesToFix = ['frutiger-aero', 'abyss', 'nebula', 'kawaii', 'harry-potter', 'retrowave-green', 'terminalism', 'blue-sky', 'autumn', 'galaxy'];

filesToFix.forEach(f => {
  const filepath = path.join('src', 'content', 'ui-styles', f, 'overrides.css');
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Common keyframe breakage pattern:
  // @keyframes name {
  //   0% { transform: translateY(0);
  // }
  //
  // 50% {
  //   transform: translateY(-10px);
  // }
  // }
  
  // Let's fix the stray '}' at the top of some files.
  content = content.replace(/\/\* Unique Shapes and Patterns for [a-z\-]+ \*\/\r?\n\r?\n\}/g, '/* Unique Shapes and Patterns for ' + f + ' */');
  
  // Fix keyframes missing closing brace for inner rules
  content = content.replace(/(\d+%|from|to)\s*\{\s*([^}]+);\r?\n\}/g, '$1 { $2; \n  }');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Applied general fixes to ' + f);
  }
});
