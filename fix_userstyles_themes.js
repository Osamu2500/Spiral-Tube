const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');
const excludedDirs = ['shared', 'vintage', 'retro'];

function updateFile(filePath, themeName, isThemeBundle) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove our previously appended dark mode overrides if they exist
    content = content.replace(/\/\* Dark mode override logic[\s\S]*$/m, '');
    content = content.replace(/\/\* Heavy Background Override[\s\S]*$/m, '');
    content = content.replace(/\/\* Dark mode background override[\s\S]*$/m, '');
    
    // Extract the theme variables (e.g., --pin-bg, --ice-surface)
    // The first line usually contains the declarations.
    const varMatch = content.match(/--([a-z0-9\-]+)-bg:\s*([^!]+)!\s*important/i);
    let prefix = themeName.substring(0, 3); // fallback
    if (varMatch) {
        prefix = varMatch[1];
    }
    
    // Also, retro/vintage removes the @media queries completely but I already did that.
    
    // Build the selector based on whether it's a UI Design (card-style) or Color Theme (theme)
    const attr = isThemeBundle ? 'data-ypp-theme' : 'data-ypp-card-style';
    
    const extraCss = `
/* Dark mode override logic to mimic Vintage/Retro */
html[${attr}="${themeName}"][dark] body, html[data-ypp-ui-style="${themeName}"][dark] body,
html[${attr}="${themeName}"][dark] ytd-app, html[data-ypp-ui-style="${themeName}"][dark] ytd-app,
html[${attr}="${themeName}"][dark] #page-manager, html[data-ypp-ui-style="${themeName}"][dark] #page-manager,
html[${attr}="${themeName}"][dark] ytd-mini-guide-renderer, html[data-ypp-ui-style="${themeName}"][dark] ytd-mini-guide-renderer,
html[${attr}="${themeName}"][dark] ytd-mini-guide-entry-renderer, html[data-ypp-ui-style="${themeName}"][dark] ytd-mini-guide-entry-renderer,
html[${attr}="${themeName}"][dark] #guide-content, html[data-ypp-ui-style="${themeName}"][dark] #guide-content,
html[${attr}="${themeName}"][dark] ytd-app > #content, html[data-ypp-ui-style="${themeName}"][dark] ytd-app > #content {
    background-color: var(--${prefix}-bg) !important;
    background: var(--${prefix}-bg) !important;
}

html[${attr}="${themeName}"][dark], html[${attr}="${themeName}"] [dark],
html[data-ypp-ui-style="${themeName}"][dark], html[data-ypp-ui-style="${themeName}"] [dark] {
    --yt-spec-base-background: var(--${prefix}-bg) !important;
    --yt-spec-raised-background: var(--${prefix}-surface, var(--${prefix}-bg)) !important;
    --yt-spec-menu-background: var(--${prefix}-surface, var(--${prefix}-bg)) !important;
    --yt-spec-inverted-background: var(--${prefix}-text, #fff) !important;
    --yt-spec-additive-background: var(--${prefix}-surface, var(--${prefix}-bg)) !important;
    --yt-spec-text-primary: var(--${prefix}-text, #000) !important;
    --yt-spec-text-secondary: var(--${prefix}-primary, var(--${prefix}-muted)) !important;
    --yt-spec-text-disabled: var(--${prefix}-secondary, var(--${prefix}-muted)) !important;
    --yt-spec-text-primary-inverse: var(--${prefix}-bg, #000) !important;
    --yt-spec-icon-active-other: var(--${prefix}-primary, var(--${prefix}-text)) !important;
    --yt-spec-icon-inactive: var(--${prefix}-secondary, var(--${prefix}-muted)) !important;
    --yt-spec-icon-disabled: var(--${prefix}-muted, #ccc) !important;
    --yt-spec-button-chip-background-hover: var(--${prefix}-surface, var(--${prefix}-bg)) !important;
    --yt-spec-touch-response: var(--${prefix}-surface, var(--${prefix}-bg)) !important;
    --yt-spec-brand-background-solid: var(--${prefix}-bg) !important;
    --yt-spec-brand-background-primary: var(--${prefix}-bg) !important;
    --yt-spec-brand-background-secondary: var(--${prefix}-surface, var(--${prefix}-bg)) !important;
    --yt-spec-general-background-a: var(--${prefix}-bg) !important;
    --yt-spec-general-background-b: var(--${prefix}-bg) !important;
    --yt-spec-general-background-c: var(--${prefix}-surface, var(--${prefix}-bg)) !important;
    --yt-spec-error-indicator: var(--${prefix}-primary, red) !important;
    background-color: var(--${prefix}-bg) !important;
    color: var(--${prefix}-text, #000) !important;
}
`;

    // Write back the updated content
    fs.writeFileSync(filePath, content.trim() + '\n' + extraCss, 'utf8');
    console.log("Updated: " + filePath + " with prefix: " + prefix);
}

function processThemeDirectory(themeDir, themeName) {
    const bundlePath = path.join(themeDir, 'bundle.css');
    updateFile(bundlePath, themeName, false);

    const themeBundlePath = path.join(themeDir, 'theme', 'bundle.css');
    updateFile(themeBundlePath, themeName, true);
}

const items = fs.readdirSync(stylesDir);
for (const item of items) {
    const itemPath = path.join(stylesDir, item);
    if (fs.statSync(itemPath).isDirectory() && !excludedDirs.includes(item)) {
        processThemeDirectory(itemPath, item);
    }
}

console.log('Finished processing all themes.');
