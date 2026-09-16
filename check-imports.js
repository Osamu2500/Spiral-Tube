const fs = require('fs');
const path = require('path');

function checkImports(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const dir = path.dirname(filePath);
  const regex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let importStr = match[1];
    if (importStr.startsWith('.')) {
      const importPath = path.resolve(dir, importStr);
      if (!fs.existsSync(importPath) && !fs.existsSync(importPath + '.js')) {
        console.log('Missing import in', filePath, ':', importStr, '->', importPath);
      }
    }
  }
}

const glob = require('fs').readdirSync('f:/Spiral Tube/src/popup/scripts', {recursive: true})
  .filter(f => f.endsWith('.js'));
glob.forEach(f => {
  checkImports(path.join('f:/Spiral Tube/src/popup/scripts', f));
});
console.log('Done checking all popup scripts');
