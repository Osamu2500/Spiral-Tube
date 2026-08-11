const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');
const folders = fs.readdirSync(stylesDir).filter(f => fs.statSync(path.join(stylesDir, f)).isDirectory() && f !== 'shared');

const isBroken = ['pink', 'ice-blue', 'cairo-red', 'crystal-glass', 'fluent', 'retrowave-green', 'cherry', 'hacker', 'autumn', 'bento', 'christmas', 'nature', 'neumorphic'];

for (const theme of folders) {
    if (!isBroken.includes(theme)) {
        continue;
    }

    const themeDir = path.join(stylesDir, theme);
    const bundlePath = path.join(themeDir, 'bundle.css');
    
    if (!fs.existsSync(bundlePath)) {
        continue;
    }

    let css = fs.readFileSync(bundlePath, 'utf8');

    // FIX 1: Append heavy background override to the UI Design bundle (bundle.css)
    const heavyOverrideCard = `\n/* Dark mode background override for UI Design */\nhtml[data-ypp-card-style="${theme}"][dark] body, html[data-ypp-ui-style="${theme}"][dark] body {\n    background-color: var(--yt-spec-base-background) !important;\n}\n`;
    
    if (!css.includes(`html[data-ypp-card-style="${theme}"][dark] body`)) {
        fs.writeFileSync(bundlePath, css + heavyOverrideCard, 'utf8');
        console.log(`Appended [dark] override to ${theme}/bundle.css`);
    }

    // FIX 2: Generate the Color Theme bundle (theme/bundle.css)
    const themeSubDir = path.join(themeDir, 'theme');
    const themeBundlePath = path.join(themeSubDir, 'bundle.css');

    // We take the newly modified bundle.css content
    let themeCss = css + heavyOverrideCard;
    
    // Replace all card-style/ui-style selectors with theme selectors
    const regex1 = new RegExp(`html\\[data-ypp-card-style="${theme}"\\]`, 'gi');
    const regex2 = new RegExp(`html\\[data-ypp-card-style=${theme}\\]`, 'gi');
    const regex3 = new RegExp(`html\\[data-ypp-ui-style="${theme}"\\]`, 'gi');
    const regex4 = new RegExp(`html\\[data-ypp-ui-style=${theme}\\]`, 'gi');
    
    themeCss = themeCss.replace(regex1, `html[data-ypp-theme="${theme}"]`);
    themeCss = themeCss.replace(regex2, `html[data-ypp-theme="${theme}"]`);
    themeCss = themeCss.replace(regex3, `html[data-ypp-theme="${theme}"]`);
    themeCss = themeCss.replace(regex4, `html[data-ypp-theme="${theme}"]`);

    if (!fs.existsSync(themeSubDir)) {
        fs.mkdirSync(themeSubDir, { recursive: true });
    }

    fs.writeFileSync(themeBundlePath, themeCss, 'utf8');
    console.log(`Generated ${theme}/theme/bundle.css`);
}
