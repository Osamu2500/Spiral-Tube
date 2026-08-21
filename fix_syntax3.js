const fs = require('fs');
const path = require('path');

const filesToFix = ['frutiger-aero', 'abyss', 'nebula', 'kawaii', 'harry-potter', 'retrowave-green'];

filesToFix.forEach(f => {
  const filepath = path.join('src', 'content', 'ui-styles', f, 'overrides.css');
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Frutiger aero syntax error:
  // @keyframes aero-pulse {
  //   transform: scale(1);
  // }
  // 60% {
  //   transform: scale(1.05);
  // }
  // 100% {
  //   transform: scale(1);
  // }
  if (f === 'frutiger-aero') {
    content = content.replace(/@keyframes aero-pulse\s*\{\s*transform: scale\(1\);\r?\n\}/, '@keyframes aero-pulse { 0% { transform: scale(1); }');
    content = content.replace(/@keyframes aero-pulse \{\s*0% \{\s*transform: scale\(1\);\s*\}\s*60% \{\s*transform: scale\(1\.05\);\s*\}\s*100% \{\s*transform: scale\(1\);\s*\}\s*\}/g, '@keyframes aero-pulse { 0% { transform: scale(1); } 60% { transform: scale(1.05); } 100% { transform: scale(1); } }');
    // For keyframes that are totally broken, let's just rewrite them
    content = content.replace(/@keyframes aero-pulse\s*\{[\s\S]*?(?=\/\*)/, '@keyframes aero-pulse { 0% { box-shadow: 0 0 20px rgba(0, 150, 255, 0.4); } 50% { box-shadow: 0 0 35px rgba(0, 150, 255, 0.7); } 100% { box-shadow: 0 0 20px rgba(0, 150, 255, 0.4); } }\n');
    content = content.replace(/@keyframes aero-float\s*\{[\s\S]*?(?=\/\*)/, '@keyframes aero-float { 0% { transform: translateY(0); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } }\n');
    content = content.replace(/@keyframes aero-shimmer\s*\{[\s\S]*?(?=\/\*)/, '@keyframes aero-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }\n');
  }

  // Nebula
  if (f === 'nebula') {
    content = content.replace(/@keyframes nebulaFloat\s*\{\s*transform: translateY\(0\);\r?\n\}\r?\n\r?\n50%\s*\{\s*transform: translateY\(-10px\);\r?\n\}/, '@keyframes nebulaFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }');
  }

  // Harry potter
  if (f === 'harry-potter') {
    content = content.replace(/background:\s*url\([^;]+;/g, match => match.replace(/\r?\n/g, ''));
    // fix the missing brace at the end
    if (content.split('}').length < content.split('{').length) {
      content += '\n}';
    }
  }

  // Retrowave green
  if (f === 'retrowave-green') {
    content = content.replace(/@keyframes retrowaveScan\s*\{\s*-webkit-mask-image: linear-gradient\([\s\S]*?\r?\n\}/, '@keyframes retrowaveScan { 0% { background-position: 0% 0%; } 100% { background-position: 0% 100%; } }');
  }

  // Kawaii
  if (f === 'kawaii') {
    // Expected percentage but found "@keyframes" at line 67
    content = content.replace(/@keyframes kawaiiFloat\s*\{\s*@keyframes kawaiiFloat/, '@keyframes kawaiiFloat');
    
    // weird url spaces
    content = content.replace(/var\(\s+--/g, 'var(--');
    content = content.replace(/url\(\s+['"]/g, 'url(');
    content = content.replace(/@keyframes kawaiiBounce\s*\{\s*(50%[^}]+?\}[\s\S]*?)100%[^}]+?\}/g, '@keyframes kawaiiBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }');
  }

  // Abyss
  if (f === 'abyss') {
    content = content.replace(/content:\s*"([^"]*)\r?\n/g, 'content: "$1";\n');
    if (content.split('}').length < content.split('{').length) {
      content += '\n}';
    }
  }

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed syntax in ' + f);
  }
});
