const fs = require('fs');
const files = [
  'src/content/pages/watch/layout/modes/sidebar-mode.css',
  'src/content/global/components/sidebar/sidebar.css',
  'src/content/pages/watch/player/player.css'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/body\.ypp-sidebar-([a-z]+)/g, 'body[data-ypp-sidebar-size="$1"]');
  fs.writeFileSync(file, content);
});

// Watch manager fix
const file = 'src/content/pages/watch/watch-manager.js';
let content = fs.readFileSync(file, 'utf8');

const oldClasses = [
    'ypp-sidebar-dense',
    'ypp-sidebar-macro',
    'ypp-sidebar-mini',
    'ypp-sidebar-compact',
    'ypp-sidebar-regular',
    'ypp-sidebar-spacious',
    'ypp-sidebar-huge',
    'ypp-sidebar-expanded',
    'ypp-sidebar-grid',
    'ypp-sidebar-hidden'
];
oldClasses.forEach(cls => {
    content = content.replace("'" + cls + "',\n", "");
    content = content.replace("'" + cls + "',\r\n", "");
    content = content.replace("'" + cls + "',", "");
});

content = content.replace(/body\.classList\.add\('ypp-sidebar-([a-z]+)'\);/g, 'body.setAttribute("data-ypp-sidebar-size", "$1");');

fs.writeFileSync(file, content);
console.log('Done');
