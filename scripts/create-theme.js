const fs = require('fs');
const path = require('path');

// Parse CLI arguments
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    params[key] = value || true;
  }
});

const sourceTheme = params.source;
const newTheme = params.name;
const newLabel = params.label || (newTheme ? newTheme.charAt(0).toUpperCase() + newTheme.slice(1) : '');
const newColor = params.color || '#cccccc';

if (!sourceTheme || !newTheme) {
  console.error("Usage: node create-theme.js --source=<existing-theme> --name=<new-theme> [--label=\"New Theme\"] [--color=\"#hexcode\"]");
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
const uiStylesDir = path.join(rootDir, 'src', 'content', 'ui-styles');
const sourceDir = path.join(uiStylesDir, sourceTheme);
const targetDir = path.join(uiStylesDir, newTheme);

if (!fs.existsSync(sourceDir)) {
  console.error(`Source theme folder '${sourceTheme}' does not exist at ${sourceDir}`);
  process.exit(1);
}

if (fs.existsSync(targetDir)) {
  console.error(`Target theme folder '${newTheme}' already exists at ${targetDir}`);
  process.exit(1);
}

// 1. Copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
console.log(`Cloning ${sourceTheme} to ${newTheme}...`);
copyDir(sourceDir, targetDir);

// 2. Replace CSS selectors
function processCssFiles(dir) {
  let entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    let fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processCssFiles(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Replace attribute selector
      const regex1 = new RegExp(`\\[data-ypp-ui-style="${sourceTheme}"\\]`, 'g');
      content = content.replace(regex1, `[data-ypp-ui-style="${newTheme}"]`);
      // Optional: Replace class if it exists (e.g. .ypp-theme-vintage -> .ypp-theme-new)
      const regex2 = new RegExp(`\\.ypp-theme-${sourceTheme}`, 'g');
      content = content.replace(regex2, `.ypp-theme-${newTheme}`);
      fs.writeFileSync(fullPath, content);
    }
  }
}
processCssFiles(targetDir);
console.log(`Updated CSS selectors in ${newTheme}`);

// Helper to replace contents based on source presence
function insertAfterSource(filePath, sourceMarker, insertString, splitChar = ',') {
  if (!fs.existsSync(filePath)) return false;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(insertString)) return true; // Already exists
  
  // Try to find the exact line/block where source is, and duplicate/modify it
  // This is a generic naive approach:
  const lines = content.split('\n');
  const newLines = [];
  let modified = false;
  
  for (let line of lines) {
    newLines.push(line);
    // If we find the source theme string on this line, and we haven't already inserted (to prevent infinite loops in generic matches)
    if (line.includes(`'${sourceTheme}'`) || line.includes(`"${sourceTheme}"`) || line.includes(`data-style="${sourceTheme}"`)) {
        // Try to construct a new line based on the existing one
        let newLine = line.replace(new RegExp(`'${sourceTheme}'`, 'g'), `'${newTheme}'`)
                          .replace(new RegExp(`"${sourceTheme}"`, 'g'), `"${newTheme}"`)
                          .replace(new RegExp(`data-style="${sourceTheme}"`, 'g'), `data-style="${newTheme}"`);
                          
        // Attempt to replace capitalized Source label with New label (e.g. 'Vintage' -> 'Sakura')
        const sourceLabel = sourceTheme.charAt(0).toUpperCase() + sourceTheme.slice(1);
        newLine = newLine.replace(new RegExp(sourceLabel, 'g'), newLabel);
        
        newLines.push(newLine);
        modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    return true;
  }
  return false;
}

// Special handling for settings-schema.js which has arrays like ['vintage', 'ocean']
function updateSettingsSchema(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const sourcePattern = new RegExp(`'${sourceTheme}'`, 'g');
  // Match arrays containing the source theme
  const arrayRegex = new RegExp(`\\[([^\\]]*'${sourceTheme}'[^\\]]*)\\]`, 'g');
  
  content = content.replace(arrayRegex, (match, arrayContent) => {
    if (arrayContent.includes(`'${newTheme}'`)) return match; // already added
    // add it right after the source theme
    return match.replace(`'${sourceTheme}'`, `'${sourceTheme}', '${newTheme}'`);
  });
  
  fs.writeFileSync(filePath, content);
}

// 3. Update constants.js
const constantsPath = path.join(rootDir, 'src', 'content', 'config', 'constants.js');
insertAfterSource(constantsPath);
console.log(`Updated constants.js`);

// 4. Update settings-schema.js
const schemaPath = path.join(rootDir, 'src', 'content', 'config', 'settings-schema.js');
if (fs.existsSync(schemaPath)) updateSettingsSchema(schemaPath);
console.log(`Updated settings-schema.js`);

// 5. Update popup.html
const popupHtmlPath = path.join(rootDir, 'src', 'popup', 'popup.html');
insertAfterSource(popupHtmlPath);
console.log(`Updated popup.html`);

// 6. Update popup-components.js
const popupJsPath = path.join(rootDir, 'src', 'popup', 'popup-components.js');
// The naive line replacement will work here too since the popup object looks like:
// { key: 'vintage', label: 'Vintage', ... }
insertAfterSource(popupJsPath);
console.log(`Updated popup-components.js`);

// Add to package.json build script if needed
console.log(`\nTheme '${newTheme}' generated successfully!`);
console.log(`\nNext steps:`);
console.log(`1. Edit the CSS variables in src/content/ui-styles/${newTheme}/base/tokens.css`);
console.log(`2. Run 'npm run build:css' to build the new theme bundles.`);
console.log(`3. Reload the unpacked extension in Chrome.\n`);
