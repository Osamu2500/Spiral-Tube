const fs = require('fs');
const path = require('path');

const themes = ['pink', 'ice-blue', 'cairo-red', 'crystal-glass', 'fluent', 'retrowave-green', 'cherry', 'hacker'];
const stylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');

for (const theme of themes) {
    const themeDir = path.join(stylesDir, theme);
    if (!fs.existsSync(themeDir)) {
        console.log(`Skipping ${theme}, directory not found.`);
        continue;
    }

    const bundlePath = path.join(themeDir, 'bundle.css');
    if (!fs.existsSync(bundlePath)) {
        console.log(`Skipping ${theme}, bundle.css not found.`);
        continue;
    }

    let css = fs.readFileSync(bundlePath, 'utf8');

    // Replace [data-ypp-card-style="theme"] and [data-ypp-ui-style="theme"] with [data-ypp-theme="theme"]
    const regex1 = new RegExp(`html\\[data-ypp-card-style="${theme}"\\]`, 'gi');
    const regex2 = new RegExp(`html\\[data-ypp-card-style=${theme}\\]`, 'gi');
    const regex3 = new RegExp(`html\\[data-ypp-ui-style="${theme}"\\]`, 'gi');
    const regex4 = new RegExp(`html\\[data-ypp-ui-style=${theme}\\]`, 'gi');
    
    css = css.replace(regex1, `html[data-ypp-theme="${theme}"]`);
    css = css.replace(regex2, `html[data-ypp-theme="${theme}"]`);
    css = css.replace(regex3, `html[data-ypp-theme="${theme}"]`);
    css = css.replace(regex4, `html[data-ypp-theme="${theme}"]`);

    // Ensure body background is strictly applied for [dark]
    // Some themes had: html[data-ypp-card-style=pink] body { background: var(--pin-bg) !important; }
    // We want to make sure it covers dark mode too if they use CSS variables.
    
    // We will append a heavy global background override at the end of the file
    // to solve the "background stays black" issue
    let heavyOverride = `\n/* Heavy Background Override for ${theme} */\n`;
    heavyOverride += `html[data-ypp-theme="${theme}"], html[data-ypp-theme="${theme}"] body, html[data-ypp-theme="${theme}"] [dark], html[data-ypp-theme="${theme}"] [dark] body {\n`;
    heavyOverride += `    background-color: var(--yt-spec-base-background) !important;\n`;
    heavyOverride += `}\n`;
    
    css += heavyOverride;

    const themeSubDir = path.join(themeDir, 'theme');
    if (!fs.existsSync(themeSubDir)) {
        fs.mkdirSync(themeSubDir, { recursive: true });
    }

    const themeBundlePath = path.join(themeSubDir, 'bundle.css');
    fs.writeFileSync(themeBundlePath, css, 'utf8');
    
    console.log(`Successfully generated theme/bundle.css for ${theme}`);
}
