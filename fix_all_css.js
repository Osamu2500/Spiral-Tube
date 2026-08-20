const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.css')) {
      files.push(fullPath);
    }
  }
  return files;
}

const cssFiles = getFiles(path.join(__dirname, 'src', 'content', 'ui-styles'));

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Fix missing closing brackets for keyframes followed by `/* Background` or `html[`
  content = content.replace(/(100%\s*\{\s*[^}]+\s*\})\s*(?=\/\* Background)/g, "$1\n}\n");
  content = content.replace(/(100%\s*\{\s*[^}]+\s*\})\s*(?=html\[)/g, "$1\n}\n");
  content = content.replace(/(100%\s*\{\s*[^}]+\s*\})\s*(?=body\.)/g, "$1\n}\n");
  content = content.replace(/(100%\s*\{\s*[^}]+\s*\})\s*(?=\/\* Navbar)/g, "$1\n}\n");
  content = content.replace(/(100%\s*\{\s*[^}]+\s*\})\s*(?=\/\* Card)/g, "$1\n}\n");
  content = content.replace(/(100%\s*\{\s*[^}]+\s*\})\s*(?=\/\*)/g, "$1\n}\n");

  content = content.replace(/(50%\s*\{\s*[^}]+\s*\})\s*(?=html\[)/g, "$1\n}\n");

  // 2. Fix unclosed URL strings
  content = content.replace(/background-image:\s*url\(\"?data:image\/svg\+xml;([^")]*)\"?\s*;/g, (match, p1) => {
    if (!match.includes(')')) {
      return `background-image: url("data:image/svg+xml;${p1}");`;
    }
    return match;
  });

  // 3. Fix unclosed strings
  content = content.replace(/background-image:\s*url\(\"data:image\/svg\+xml;([^")]*);\s*$/gm, 'background-image: url("data:image/svg+xml;$1");');

  // Specific fix for gothic/cherry/grunge where missing bracket before `/* Background floating`
  content = content.replace(/(scale\([^\)]+\);\s*})\s*(\/\* Background floating)/g, "$1\n}\n\n$2");
  content = content.replace(/(transform:\s*[^;]+;\s*})\s*(\/\* Background)/g, "$1\n}\n\n$2");

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed syntax errors in', file);
  }
});
