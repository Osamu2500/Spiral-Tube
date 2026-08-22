const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '../src/content/ui-styles');
const skipDirs = ['default', 'nature', 'vintage'];

const getDirs = source => fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !skipDirs.includes(dirent.name))
    .map(dirent => dirent.name);

function getFilesRecursively(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(file));
        } else if (file.endsWith('.css') && !file.endsWith('index.css') && !file.endsWith('tokens.css') && !file.endsWith('overrides.css')) {
            results.push(file);
        }
    });
    return results;
}

const styles = getDirs(uiStylesDir);

styles.forEach(style => {
    const styleDir = path.join(uiStylesDir, style);
    const tokensPath = path.join(styleDir, 'base', 'tokens.css');
    
    let tokensContent = '';
    let extractedFont = '';
    let primaryColor = '';
    
    // 1. Parse existing tokens.css if it exists to extract key colors and fonts
    if (fs.existsSync(tokensPath)) {
        const tContent = fs.readFileSync(tokensPath, 'utf8');
        
        // Find font-family
        const fontMatch = tContent.match(/font-family:\s*([^;!]+)/);
        if (fontMatch) extractedFont = fontMatch[1].trim();
        
        // Find main colors (e.g., --theme-primary, --theme-bg)
        // Since different styles use different prefixes (e.g. --cyb-primary, --abyss-primary), we just look for primary/bg
        const bgMatch = tContent.match(/--[a-z0-9]+-bg:\s*([^;!]+)/);
        const primaryMatch = tContent.match(/--[a-z0-9]+-primary:\s*([^;!]+)/);
        const secondaryMatch = tContent.match(/--[a-z0-9]+-secondary:\s*([^;!]+)/);
        const panelMatch = tContent.match(/--[a-z0-9]+-card:\s*([^;!]+)|--[a-z0-9]+-panel:\s*([^;!]+)/);
        
        const bg = bgMatch ? bgMatch[1].trim() : 'transparent';
        primaryColor = primaryMatch ? primaryMatch[1].trim() : '#ffffff';
        const secondary = secondaryMatch ? secondaryMatch[1].trim() : 'rgba(255, 255, 255, 0.7)';
        const panel = panelMatch ? (panelMatch[1] || panelMatch[2]).trim() : 'rgba(0, 0, 0, 0.5)';
        
        tokensContent = `/* Token Overrides for ${style} */
:root[data-ypp-ui-design="${style}"],
html[data-ypp-ui-style="${style}"] {
  --ypp-surface-bg: ${bg} !important;
  --ypp-surface-bg-hover: ${panel} !important;
  --ypp-surface-bg-active: ${panel} !important;
  
  --ypp-primary-accent: ${primaryColor} !important;
  --ypp-text-primary: ${secondary} !important;
  
  --ypp-surface-border: 1px solid ${primaryColor}40 !important;
  --ypp-shadow-base: 0 4px 12px ${primaryColor}20 !important;
  --ypp-shadow-hover: 0 8px 24px ${primaryColor}40 !important;
  
  ${extractedFont ? `--yt-font-family: ${extractedFont} !important;` : ''}
}

${extractedFont ? `
html[data-ypp-ui-style="${style}"] * {
  font-family: ${extractedFont} !important;
}
` : ''}
`;
    } else {
        // Fallback generic token block
        tokensContent = `/* Token Overrides for ${style} */
:root[data-ypp-ui-design="${style}"],
html[data-ypp-ui-style="${style}"] {
  --ypp-surface-bg: rgba(0, 0, 0, 0.5) !important;
}
`;
    }

    // 2. Parse all other CSS files to extract unique shapes, patterns, gradients, and animations
    let uniqueRules = [];
    const allFiles = getFilesRecursively(styleDir);
    
    allFiles.forEach(file => {
        const cssContent = fs.readFileSync(file, 'utf8');
        // Simple CSS parser using Regex
        const blocks = cssContent.match(/([^{]+)\{([^}]+)\}/g);
        if (blocks) {
            blocks.forEach(block => {
                const match = block.match(/([^{]+)\{([^}]+)\}/);
                if (match) {
                    const selector = match[1].trim();
                    const rules = match[2];
                    
                    // Ignore font-family in global wildcard since we handle it in tokens
                    if (selector === '*' || selector === 'html' || selector.includes('body')) {
                        if (!selector.includes('#')) return; // skip global selectors
                    }
                    
                    const keepLines = [];
                    rules.split(';').forEach(rule => {
                        const trimmed = rule.trim();
                        if (!trimmed) return;
                        
                        // We KEEP unique aesthetic properties, we STRIP manual color/layout assignments
                        const isUnique = /(background-image|linear-gradient|radial-gradient|clip-path|animation|border-radius|box-shadow|filter|backdrop-filter|transform|text-shadow)/i.test(trimmed);
                        
                        // Make sure it's not just a basic transparent background
                        const isBasic = /background:\s*(transparent|none)/i.test(trimmed);
                        
                        if (isUnique && !isBasic) {
                            keepLines.push(trimmed);
                        }
                    });
                    
                    if (keepLines.length > 0) {
                        // Standardize the selector so it maps to the new attribute just in case
                        let safeSelector = selector.replace(/html\[data-ypp-ui-style="[^"]+"\]/g, `html[data-ypp-ui-design="${style}"]`);
                        uniqueRules.push(`${safeSelector} {\n  ${keepLines.join(';\n  ')};\n}`);
                    }
                }
            });
        }
    });
    
    let overridesContent = `/* Unique Shapes and Patterns for ${style} */\n\n` + uniqueRules.join('\n\n');
    
    // 3. Write new unified files
    fs.writeFileSync(path.join(styleDir, 'tokens.css'), tokensContent);
    fs.writeFileSync(path.join(styleDir, 'overrides.css'), overridesContent);
    
    const indexContent = `@import "./tokens.css";\n@import "./overrides.css";\n`;
    fs.writeFileSync(path.join(styleDir, 'index.css'), indexContent);
    
    // 4. Delete legacy directories
    ['base', 'components', 'pages'].forEach(dir => {
        const full = path.join(styleDir, dir);
        if (fs.existsSync(full)) {
            fs.rmSync(full, { recursive: true, force: true });
        }
    });
    
    console.log(`Migrated ${style} to token architecture.`);
});

console.log(`Successfully migrated ${styles.length} UI styles!`);
