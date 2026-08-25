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

let stylesStr = JSON.stringify(items, null, 2)
  .replace(/\"/g, '\'')
  .replace(/'id':/g, 'id:')
  .replace(/'label':/g, 'label:');

const c = fs.readFileSync('src/shared/config/constants.js', 'utf8');
fs.writeFileSync('src/shared/config/constants.js', 
  c.replace(/export const CARD_STYLES = \[[\s\S]*?\];/, 'export const CARD_STYLES = ' + stylesStr + ';')
   .replace(/export const YOUTUBE_PAGE_THEMES = \[[\s\S]*?\];/, 'export const YOUTUBE_PAGE_THEMES = ' + stylesStr + ';')
);
console.log("Updated constants.js with " + items.length + " styles.");
