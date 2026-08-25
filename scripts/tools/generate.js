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

let popupStr = '';
let themeStr = '';
let cardStr = '';

items.forEach(i => {
  popupStr += `                <button type="button" class="popup-style-btn${i.id === 'default' ? ' active' : ''}" data-style="${i.id}">${i.label}</button>\n`;
  themeStr += `                <button type="button" class="theme-btn youtube-style-btn${i.id === 'default' ? ' active' : ''}" data-style="${i.id}">${i.label}</button>\n`;
  cardStr += `                <button type="button" class="card-style-btn${i.id === 'default' ? ' active' : ''}" data-style="${i.id}">${i.label}</button>\n`;
});

fs.writeFileSync('popup_btns.html', popupStr.trimEnd());
fs.writeFileSync('theme_btns.html', themeStr.trimEnd());
fs.writeFileSync('card_btns.html', cardStr.trimEnd());
console.log('Generated button HTML files.');
