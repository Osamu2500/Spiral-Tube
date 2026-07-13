const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'src', 'content', 'themes', 'ui-styles', 'frutiger-aero.css');
let content = fs.readFileSync(cssPath, 'utf8');

const marker = '/* Different sizes, speeds, and delays */';
const idx = content.indexOf(marker);
if (idx !== -1) {
    content = content.substring(0, idx + marker.length) + '\n';
}

let rules = [];
for (let i = 1; i <= 50; i++) {
    const size = Math.floor(Math.random() * 95) + 5;
    const left = Math.floor(Math.random() * 100);
    const dur = Math.floor(Math.random() * 12) + 3;
    
    const destBottom = Math.floor(Math.random() * 100);
    const destX = Math.floor(Math.random() * 300) - 100;
    const delay = (Math.random() * dur).toFixed(1);
    
    rules.push(`
.fa-bubble:nth-child(${i}) {
  width: ${size}px;
  height: ${size}px;
  left: ${left}vw;
  animation: faMove${i} ${dur}s infinite linear;
  animation-delay: -${delay}s;
}
@keyframes faMove${i} {
  0% { bottom: -100px; transform: translateX(0); opacity: 0; }
  10% { opacity: 0.8; }
  100% { bottom: ${destBottom}vh; transform: translateX(${destX}px); opacity: 0; }
}`);
}

fs.writeFileSync(cssPath, content + rules.join('\n'));
console.log('Updated CSS with 50 bubbles.');
