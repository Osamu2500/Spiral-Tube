const fs = require('fs');

const files = fs.readdirSync('src/content/design-system/card-styles');
const items = files.filter(f => f.endsWith('.css')).map(f => {
  const content = fs.readFileSync('src/content/design-system/card-styles/' + f, 'utf8');
  const firstLine = content.split('\n')[0];
  let label = f.replace('.css', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  if (firstLine.startsWith('/*') && firstLine.includes('Card Style')) {
    label = firstLine.replace('/* ', '').replace(' Card Style */', '').replace(' */', '').trim();
  }
  return { id: f.replace('.css', ''), label };
});

const getHtml = (items, btnClass) => {
  let html = '';
  for (const item of items) {
    const activeClass = item.id === 'default' ? ' active' : '';
    html += `                <button type="button" class="${btnClass}${activeClass}" data-style="${item.id}">${item.label}</button>\n`;
  }
  return html.trimEnd();
};

const popupHtml = getHtml(items, 'popup-style-btn');
const cardHtml = getHtml(items, 'card-style-btn');

let htmlContent = fs.readFileSync('src/popup/popup.html', 'utf8');

// Replace Popup UI Theme block
htmlContent = htmlContent.replace(
  /<div class="card-style-grid" style="margin-top: 0;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- 3\. Custom Cursors -->/,
  '<div class="card-style-grid" style="margin-top: 0;">\n' + popupHtml + '\n              </div>\n            </div>\n          </div>\n\n          <!-- 3. Custom Cursors -->'
);

// Replace Card Styles block
htmlContent = htmlContent.replace(
  /<div class="card-style-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- 2\. UI Design & Page Themes -->/,
  '<div class="card-style-grid">\n' + cardHtml + '\n              </div>\n            </div>\n          </div>\n\n          <!-- 2. UI Design & Page Themes -->'
);

fs.writeFileSync('src/popup/popup.html', htmlContent);
console.log("Updated popup.html");
