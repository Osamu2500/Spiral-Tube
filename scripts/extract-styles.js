const fs = require('fs');
const path = require('path');

const popupPath = path.join(__dirname, 'src', 'popup', 'popup.html');
const cssPath = path.join(__dirname, 'src', 'popup', 'popup-extracted.css');

let html = fs.readFileSync(popupPath, 'utf8');

let styleCounter = 1;
let cssLines = [];

html = html.replace(/<[a-zA-Z0-9\-]+([^>]+)>/g, (match, attrs) => {
    if (!attrs.includes('style="')) return match;
    
    let styleMatch = attrs.match(/style="([^"]+)"/);
    if (!styleMatch) return match;
    
    let styleVal = styleMatch[1];
    
    // Clean the style value to avoid issues
    styleVal = styleVal.trim();
    if (!styleVal.endsWith(';')) styleVal += ';';
    
    let className = `ypp-inline-${styleCounter++}`;
    cssLines.push(`.${className} { ${styleVal} }`);
    
    // Remove style attribute completely
    let newAttrs = attrs.replace(/\s*style="[^"]+"/, '');
    
    // Add to existing class or create new class attribute
    if (newAttrs.includes('class="')) {
        newAttrs = newAttrs.replace(/class="/, `class="${className} `);
    } else {
        newAttrs += ` class="${className}"`;
    }
    
    return match.replace(attrs, newAttrs);
});

// Link the new CSS file if it's not already linked
if (!html.includes('popup-extracted.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="popup-extracted.css" />\n  </head>');
}

fs.writeFileSync(popupPath, html, 'utf8');
fs.writeFileSync(cssPath, cssLines.join('\n'), 'utf8');

console.log('Extracted ' + (styleCounter - 1) + ' inline styles.');
