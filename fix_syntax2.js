const fs = require('fs');
const path = require('path');

const filesToFix = ['frutiger-aero', 'abyss', 'nebula', 'kawaii', 'harry-potter', 'retrowave-green', 'terminalism', 'blue-sky', 'autumn', 'galaxy'];

filesToFix.forEach(f => {
  const filepath = path.join('src', 'content', 'ui-styles', f, 'overrides.css');
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // 1. Remove stray `}` at the beginning of the file (usually line 3)
  content = content.replace(/\/\* Unique Shapes and Patterns for [a-z\-]+ \*\/\r?\n\r?\n\}/g, '/* Unique Shapes and Patterns for ' + f + ' */\n');

  // 2. Fix broken keyframe syntax like:
  // 0% { transform: translateY(0);
  // }
  // To:
  // 0% { transform: translateY(0); }
  content = content.replace(/((?:\d+%,?\s*)*\d+%|from|to)\s*\{\s*([^}]+?);\r?\n\}/g, '$1 { $2; }');

  // 3. Fix multiple missing braces in keyframes, e.g. galaxyFloat
  content = content.replace(/@keyframes\s+[a-zA-Z0-9_-]+\s*\{\s*\r?\n\s*((?:\d+%,?\s*)*\d+%|from|to)\s*\{\s*([^}]+?);\r?\n\}/g, match => {
      return match.replace(/;\r?\n\}/, '; }');
  });

  // 4. Abyss unterminated string
  content = content.replace(/content:\s*"([^"]*)$/gm, 'content: "$1";');

  // 5. Kawaii specific syntax errors (it had nested keyframes and weird whitespace)
  if (f === 'kawaii') {
    // missing % sign or whatever
    content = content.replace(/@keyframes\s+([a-zA-Z0-9_-]+)\s*\{\s*0%\s*\{[^\}]+\}\s*100%\s*\{[^\}]+\}\s*@keyframes\s+\1\s*\{/g, '@keyframes $1 {');
    // weird url spaces
    content = content.replace(/url\(\s+/g, 'url(');
  }

  // 6. Harry Potter unclosed strings
  if (f === 'harry-potter') {
    content = content.replace(/url\(\s*'([^']*)(\r?\n)/g, "url('$1')$2");
    content = content.replace(/url\(\s*"([^"]*)(\r?\n)/g, 'url("$1")$2');
  }
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed syntax in ' + f);
  }
});
