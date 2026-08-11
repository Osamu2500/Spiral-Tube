const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');
const isBroken = ['pink', 'ice-blue', 'cairo-red', 'crystal-glass', 'fluent', 'retrowave-green', 'cherry', 'hacker', 'autumn', 'bento', 'christmas', 'nature', 'neumorphic'];

for (const theme of isBroken) {
    const themeDir = path.join(stylesDir, theme);
    const filesToProcess = [
        path.join(themeDir, 'bundle.css'),
        path.join(themeDir, 'theme', 'bundle.css')
    ];

    for (const file of filesToProcess) {
        if (!fs.existsSync(file)) continue;

        let content = fs.readFileSync(file, 'utf8');

        // 1. Completely remove all @media (prefers-color-scheme: dark) { ... } blocks
        // We use a regex that handles nested braces. Since regex for nested braces is hard in JS, 
        // we can find the index and match braces manually.
        
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

            // Remove the block
            content = content.substring(0, mediaIndex) + content.substring(closeBraceIndex);
        }

        // 2. We need to find the main variable declaration block for this theme
        // It looks like html[data-ypp-card-style="pink"] { --var1: val; --var2: val; }
        // or html[data-ypp-card-style=pink] { ... }
        
        const isThemeFile = file.includes('theme\\bundle.css') || file.includes('theme/bundle.css');
        const attrPrefix = isThemeFile ? 'data-ypp-theme' : 'data-ypp-card-style';
        
        // Find the block that starts with html[data-ypp-card-style=pink] { or similar
        const blockRegex = new RegExp(`html\\[${attrPrefix}=["']?${theme}["']?\\]\\s*\\{([\\s\\S]*?)\\}`, 'i');
        const match = content.match(blockRegex);
        
        if (match) {
            const varsBlock = match[1];
            
            // Generate the dark mode forced override block
            const darkOverride = `\n/* Forced light theme over dark mode */\nhtml[${attrPrefix}="${theme}"][dark], html[${attrPrefix}="${theme}"] [dark] {\n${varsBlock}\n}\n`;
            
            // Check if we already appended something similar to avoid duplicates
            if (!content.includes(`/* Forced light theme over dark mode */`)) {
                content += darkOverride;
            }
        }

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Processed ${file}`);
    }
}
