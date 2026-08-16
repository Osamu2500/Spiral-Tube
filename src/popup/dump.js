const fs = require('fs');
let html = fs.readFileSync('src/popup/popup.html', 'utf8');

let start = html.indexOf('<section id="tab-history"');
let end = html.indexOf('</section>', start);
fs.writeFileSync('src/popup/history_dump.txt', html.substring(start, end + 10));
console.log('Dumped history tab.');

let schema = fs.readFileSync('src/popup/popup-schema.js', 'utf8');
fs.writeFileSync('src/popup/schema_dump.js', schema);
