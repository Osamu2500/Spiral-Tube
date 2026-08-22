const fs = require('fs');
const path = require('path');

const cardStylesDir = path.join(__dirname, '../src/content/card-styles');

const cardStyles = fs.readdirSync(cardStylesDir).filter(f => f.endsWith('.css'));

// Common giant selector found in all card styles
const giantSelectorRegex = /html\[data-ypp-card-style=['"][^'"]+['"]\]\s*:is\([\s\S]*?\)\s*\{([\s\S]*?)\}/;
const giantSelectorHoverRegex = /html\[data-ypp-card-style=['"][^'"]+['"]\]\s*:is\([\s\S]*?\):hover\s*\{([\s\S]*?)\}/;

cardStyles.forEach(file => {
  const filePath = path.join(cardStylesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const styleName = file.replace('.css', '');

  let baseCSS = '';
  let hoverCSS = '';

  const baseMatch = content.match(giantSelectorRegex);
  if (baseMatch) {
    baseCSS = baseMatch[1];
  }

  const hoverMatch = content.match(giantSelectorHoverRegex);
  if (hoverMatch) {
    hoverCSS = hoverMatch[1];
  }

  // Helper to extract CSS value
  function extractProp(css, propName) {
    const regex = new RegExp(`${propName}\\s*:\\s*([^!]+?)\\s*!important;`, 'i');
    const match = css.match(regex);
    return match ? match[1].trim() : null;
  }

  const outputTokens = {};
  
  if (baseCSS) {
    outputTokens['--ypp-card-bg'] = extractProp(baseCSS, 'background') || extractProp(baseCSS, 'background-color');
    outputTokens['--ypp-card-radius'] = extractProp(baseCSS, 'border-radius');
    outputTokens['--ypp-card-border'] = extractProp(baseCSS, 'border');
    outputTokens['--ypp-card-pad'] = extractProp(baseCSS, 'padding');
    outputTokens['--ypp-card-shadow'] = extractProp(baseCSS, 'box-shadow');
    outputTokens['--ypp-card-filter'] = extractProp(baseCSS, 'filter');
    outputTokens['--ypp-card-transition'] = extractProp(baseCSS, 'transition');
  }

  if (hoverCSS) {
    outputTokens['--ypp-card-bg-hover'] = extractProp(hoverCSS, 'background') || extractProp(hoverCSS, 'background-color');
    outputTokens['--ypp-card-border-hover'] = extractProp(hoverCSS, 'border') || extractProp(hoverCSS, 'border-color');
    outputTokens['--ypp-card-transform-hover'] = extractProp(hoverCSS, 'transform');
    outputTokens['--ypp-card-shadow-hover'] = extractProp(hoverCSS, 'box-shadow');
    outputTokens['--ypp-card-filter-hover'] = extractProp(hoverCSS, 'filter');
  }

  // Convert hardcoded background colors to use --ypp-bg-surface as a base, with the hex as fallback
  // e.g. background: #f4ecd8 -> var(--ypp-bg-surface, #f4ecd8)
  for (const key of ['--ypp-card-bg', '--ypp-card-bg-hover']) {
    if (outputTokens[key]) {
      const val = outputTokens[key];
      if (val.startsWith('#') || val.startsWith('rgb')) {
          if (val.includes('rgba') && (val.includes('0.0') || val.includes('0.1'))) {
             outputTokens[key] = `var(--ypp-bg-glass, ${val})`;
          } else {
             outputTokens[key] = `var(--ypp-bg-surface, ${val})`;
          }
      }
    }
  }
  
  // Generate the new CSS
  let newCssContent = `/* Tokenized Card Style: ${styleName} */\n`;
  newCssContent += `html[data-ypp-card-style="${styleName}"] {\n`;
  
  for (const [key, value] of Object.entries(outputTokens)) {
    if (value) {
        let cleanValue = value;
        if (key === '--ypp-card-border-hover' && cleanValue.startsWith('#') || cleanValue.startsWith('rgb')) {
            cleanValue = `1px solid var(--ypp-accent, ${cleanValue})`;
        }
        newCssContent += `  ${key}: ${cleanValue};\n`;
    }
  }
  newCssContent += `}\n`;
  
  // Keep mouseover-overlay rules and anything else that is not the main card styling
  const lines = content.split('\n');
  let keepLines = [];
  let inBlock = false;
  let braces = 0;
  
  for (let line of lines) {
     if (line.includes('html[data-ypp-card-style') && line.includes(':is(') && !line.includes('body:not')) {
         inBlock = true;
     }
     
     if (inBlock) {
         if (line.includes('{')) braces++;
         if (line.includes('}')) braces--;
         if (braces === 0 && line.includes('}')) {
             inBlock = false;
         }
         continue;
     }
     
     // Skip global fallback blocks 
     if (line.includes('/* Global AI-generated missing variable fallbacks */') ||
         line.includes('--sf:') || line.includes('--shadow-base:')) {
         continue;
     }
     
     if (!inBlock && line.trim() !== '') {
         keepLines.push(line);
     }
  }
  
  const leftover = keepLines.join('\n').replace(/html\[data-ypp-card-style="[^"]+"\]\s*{\s*}/g, '');
  
  fs.writeFileSync(filePath, newCssContent + '\n' + leftover);
});
console.log(`Successfully migrated ${cardStyles.length} card styles!`);
