const fs = require('fs');
const path = 'src/shared/i18n.js';
let data = fs.readFileSync(path, 'utf8');

const regex = /    'it': \{[\s\S]*?id': \{[^\n]*\n/;
const match = data.match(regex);

if (match) {
    let extracted = match[0];
    
    // Add back 'sv' that got lost
    extracted += "    'sv': { nav_home: 'Hem', nav_shorts: 'Shorts', nav_player: 'Spelare', speed: 'Hastighet', modes: 'Lägen', declutter: 'Rensa', nav_search: 'Sök', nav_subs: 'Prenumerationer', nav_history: 'Historik', nav_bookmarks: 'Bokmärken', nav_appearance: 'Design', nav_popup_design: 'Popup', nav_pro: 'Pro', nav_hotkeys: 'Genvägar', nav_config: 'Konfig' },\n";
    
    // Remove the block from the top
    data = data.replace(regex, '');
    
    // Insert into dictionaries
    data = data.replace('const dictionaries = {', 'const dictionaries = {\n' + extracted);
    
    fs.writeFileSync(path, data);
    console.log('Successfully fixed i18n structure.');
} else {
    console.log('Regex did not match.');
}
