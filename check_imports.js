const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) results = results.concat(walk(full));
    else if (f.name.endsWith('.css')) results.push(full);
  }
  return results;
}

const files = walk(path.join(__dirname, 'src/content'));
let issues = [];
files.forEach((f) => {
  const content = fs.readFileSync(f, 'utf8');
  const imports = content.match(/@import\s+["'][^"']+["']/g) || [];
  imports.forEach((imp) => {
    const m = imp.match(/["']([^"']+)["']/);
    if (!m) return;
    const rawPath = m[1];
    if (!rawPath.startsWith('http') && !rawPath.startsWith('chrome-extension')) {
      const resolved = path.resolve(path.dirname(f), rawPath);
      if (!fs.existsSync(resolved)) {
        issues.push({ file: f.replace(__dirname + path.sep, ''), import: rawPath });
      }
    }
  });
});

if (issues.length === 0) {
  console.log('✅ All CSS @imports resolve correctly!');
} else {
  console.log('❌ ' + issues.length + ' broken imports found:');
  issues.slice(0, 30).forEach((i) => console.log('  ' + i.file + '\n    -> ' + i.import));
}
