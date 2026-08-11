const fs = require('fs');
const path = require('path');
const stylesDir = 'src/content/ui-styles';
const targets = ["player-retouch", "startube"];

for (const theme of targets) {
    const indexFile = path.join(stylesDir, theme, 'index.css');
    if (fs.existsSync(indexFile)) {
        let content = fs.readFileSync(indexFile, 'utf8');
        const importStatement = `@import './components/expanded_ui.css';`;
        if (content.includes(importStatement)) {
            content = content.replace(`\n${importStatement}\n`, ''); // remove from end
            content = `${importStatement}\n` + content; // add to beginning
            fs.writeFileSync(indexFile, content);
        }
    }
}
