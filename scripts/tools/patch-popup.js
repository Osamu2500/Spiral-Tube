const fs = require('fs');

let html = fs.readFileSync('src/popup/popup.html', 'utf8');

const popupBtns = fs.readFileSync('popup_btns.html', 'utf8');
const themeBtns = fs.readFileSync('theme_btns.html', 'utf8');
const cardBtns = fs.readFileSync('card_btns.html', 'utf8');

// Replace block 1 (Popup UI Design)
html = html.replace(
  /(<!-- 1\. Popup UI Design -->[\s\S]*?<div class="card-style-grid"[^>]*>\s*)([\s\S]*?)(\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- 2\. UI Design)/,
  `$1${popupBtns}$3`
);

// Replace block 2 (UI Design & Page Themes)
html = html.replace(
  /(<!-- 2\. UI Design & Page Themes -->[\s\S]*?<div class="card-style-grid"[^>]*>\s*)([\s\S]*?)(\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- Card Styles -->)/,
  `$1${themeBtns}$3`
);

// Replace block 3 (Card Styles)
html = html.replace(
  /(<!-- Card Styles -->[\s\S]*?<div class="card-style-grid"[^>]*>\s*)([\s\S]*?)(\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- 5\. Top Bar Nav Buttons -->)/,
  `$1${cardBtns}$3`
);

fs.writeFileSync('src/popup/popup.html', html);
console.log('Replaced blocks in popup.html');
