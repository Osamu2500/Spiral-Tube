const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');
const folders = fs.readdirSync(stylesDir).filter(f => fs.statSync(path.join(stylesDir, f)).isDirectory() && f !== 'shared');

for (const theme of folders) {
    const themeDir = path.join(stylesDir, theme);
    const bundlePath = path.join(themeDir, 'bundle.css');
    
    if (!fs.existsSync(bundlePath)) {
        continue;
    }

    const themeSubDir = path.join(themeDir, 'theme');
    const themeBundlePath = path.join(themeSubDir, 'bundle.css');

    // Only process if it doesn't have a theme/bundle.css or if it's one of the broken ones
    const isBroken = ['pink', 'ice-blue', 'cairo-red', 'crystal-glass', 'fluent', 'retrowave-green', 'cherry', 'hacker', 'autumn', 'bento', 'christmas', 'nature', 'neumorphic'].includes(theme);

    if (!fs.existsSync(themeBundlePath) || isBroken) {
        let css = fs.readFileSync(bundlePath, 'utf8');

        const regex1 = new RegExp(`html\\[data-ypp-card-style="${theme}"\\]`, 'gi');
        const regex2 = new RegExp(`html\\[data-ypp-card-style=${theme}\\]`, 'gi');
        const regex3 = new RegExp(`html\\[data-ypp-ui-style="${theme}"\\]`, 'gi');
        const regex4 = new RegExp(`html\\[data-ypp-ui-style=${theme}\\]`, 'gi');
        
        css = css.replace(regex1, `html[data-ypp-theme="${theme}"]`);
        css = css.replace(regex2, `html[data-ypp-theme="${theme}"]`);
        css = css.replace(regex3, `html[data-ypp-theme="${theme}"]`);
        css = css.replace(regex4, `html[data-ypp-theme="${theme}"]`);

        let heavyOverride = `\n/* Heavy Background Override for ${theme} */\n`;
        heavyOverride += `html[data-ypp-theme="${theme}"], html[data-ypp-theme="${theme}"] body, html[data-ypp-theme="${theme}"] [dark], html[data-ypp-theme="${theme}"] [dark] body {\n`;
        heavyOverride += `    background-color: var(--yt-spec-base-background, var(--ypp-bg-base, var(--pin-bg, #0f0f0f))) !important;\n`;
        heavyOverride += `}\n`;
        
        css += heavyOverride;

        if (!fs.existsSync(themeSubDir)) {
            fs.mkdirSync(themeSubDir, { recursive: true });
        }

        fs.writeFileSync(themeBundlePath, css, 'utf8');
        console.log(`Successfully generated theme/bundle.css for ${theme}`);
    }
}
