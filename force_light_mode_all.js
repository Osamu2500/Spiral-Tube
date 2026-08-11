const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');
const exclude = ['shared', 'vintage', 'retro'];
const folders = fs.readdirSync(stylesDir).filter(f => fs.statSync(path.join(stylesDir, f)).isDirectory() && !exclude.includes(f));

for (const theme of folders) {
    const themeDir = path.join(stylesDir, theme);
    const filesToProcess = [
        path.join(themeDir, 'bundle.css'),
        path.join(themeDir, 'theme', 'bundle.css')
    ];

    for (const file of filesToProcess) {
        if (!fs.existsSync(file)) continue;

        let content = fs.readFileSync(file, 'utf8');

        // Remove media dark block if present
        while (true) {
            const mediaIndex = content.indexOf('@media (prefers-color-scheme: dark)');
            if (mediaIndex === -1) break;

            const openBraceIndex = content.indexOf('{', mediaIndex);
            if (openBraceIndex === -1) break;

            let braceCount = 1;
            let closeBraceIndex = openBraceIndex + 1;

            while (braceCount > 0 && closeBraceIndex < content.length) {
                if (content[closeBraceIndex] === '{') braceCount++;
                if (content[closeBraceIndex] === '}') braceCount--;
                closeBraceIndex++;
            }

            content = content.substring(0, mediaIndex) + content.substring(closeBraceIndex);
        }

        const isThemeFile = file.includes('theme\\bundle.css') || file.includes('theme/bundle.css');
        const attrPrefix = isThemeFile ? 'data-ypp-theme' : 'data-ypp-card-style';
        
        const blockRegex = new RegExp(`html\\[${attrPrefix}=["']?${theme}["']?\\]\\s*\\{([\\s\\S]*?)\\}`, 'i');
        const match = content.match(blockRegex);
        
        if (match) {
            const varsBlock = match[1];
            const darkOverride = `\n/* Forced light theme over dark mode */\nhtml[${attrPrefix}="${theme}"][dark], html[${attrPrefix}="${theme}"] [dark] {\n${varsBlock}\n}\n`;
            
            if (!content.includes(`/* Forced light theme over dark mode */`)) {
                content += darkOverride;
            }
        }

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Processed ${file}`);
    }
}
