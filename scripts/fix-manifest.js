const fs = require('fs');
const content = fs.readFileSync('manifest.json', 'utf8');
const obj = JSON.parse(content);
fs.writeFileSync('manifest.json', JSON.stringify(obj, null, 4));
