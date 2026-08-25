const fs = require('fs');
let code = fs.readFileSync('src/popup/scripts/ui/popup-icons.js', 'utf8');

const additions = `
    play: 'M5 3l14 9-14 9V3z',
    folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5.33C2 4.6 2.6 4 3.33 4h5.34l2 2h9.33A2 2 0 0 1 22 8v11z',
    thumbsUp: 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
`;

code = code.replace(/export const ICONS = \{/, 'export const ICONS = {' + additions);
fs.writeFileSync('src/popup/scripts/ui/popup-icons.js', code);
