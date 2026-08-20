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

  // Fix truncated SVG URLs
  // This matches a line with exactly `background-image: url(data:image/svg+xml;` and nothing else, followed by a newline and `}`
  content = content.replace(/background-image:\s*url\(data:image\/svg\+xml;\s*\n/g, '/* Removed broken SVG background */\n');

  // Also replace if it's on a single line but empty
  content = content.replace(/background-image:\s*url\(\"?data:image\/svg\+xml;\"?\);\s*\n/g, '/* Removed broken SVG background */\n');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed SVG syntax in', file);
  }
});
