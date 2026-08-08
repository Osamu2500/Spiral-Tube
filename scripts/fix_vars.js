const fs = require('fs');
const path = require('path');
const uiStylesDir = path.join('f:/Youtube 2.0/src/content/ui-styles');
const dirs = fs.readdirSync(uiStylesDir, {withFileTypes: true}).filter(d => d.isDirectory()).map(d => d.name);

let modifiedCount = 0;
dirs.forEach(dir => {
    const cardStylePath = path.join(uiStylesDir, dir, 'card-style.css');
    const tokensPath = path.join(uiStylesDir, dir, 'base', 'tokens.css');
    
    if (fs.existsSync(cardStylePath) && fs.existsSync(tokensPath)) {
        let cardCSS = fs.readFileSync(cardStylePath, 'utf8');
        
        // Find the block: html[data-ypp-card-style="..."] { ... } at the top
        const regex = /html\[data-ypp-card-style=['"]?[^'"]+['"]?\]\s*\{([\s\S]*?)\}/;
        const match = cardCSS.match(regex);
        
        if (match) {
            const vars = match[1];
            // Remove it from card-style.css
            cardCSS = cardCSS.replace(match[0], '');
            fs.writeFileSync(cardStylePath, cardCSS);
            
            // Add to tokens.css
            let tokensCSS = fs.readFileSync(tokensPath, 'utf8');
            tokensCSS += `\n\n/* Global variables extracted from card-style */\nhtml[data-ypp-ui-style="${dir}"] {${vars}\n  --bounce: cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n`;
            fs.writeFileSync(tokensPath, tokensCSS);
            
            modifiedCount++;
        }
    }
});
console.log('Modified ' + modifiedCount + ' UI styles.');
