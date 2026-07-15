const fs = require('fs');
const path = require('path');

const cursorsDir = path.join('src', 'assets', 'cursors');
const folders = fs.readdirSync(cursorsDir).filter(f => fs.statSync(path.join(cursorsDir, f)).isDirectory());

let html = `                <button type="button" class="cursor-style-btn active" data-style="default" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s;">
                  <div class="cursor-icon" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L5.5 3.21z"></path></svg>
                  </div>
                  <span style="font-size: 11px; opacity: 0.8; font-weight: 500;">Default</span>
                </button>\n`;

const customNames = {
  'among-us': 'Among Us',
  'fifa-2026': 'FIFA 26',
  'hello-kitty': 'Sanrio',
  'luffy': 'Luffy',
  'mickey-mouse': 'Mickey',
  'minecraft-sword': 'Minecraft',
  'pinky-pixel': 'Pixel'
};

for (const folder of folders) {
  let displayName = customNames[folder];
  if (!displayName) {
     displayName = folder.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
     displayName = displayName.replace(' Animated', '').replace(/\(\d+\)/g, '').trim();
     if (displayName.length > 15) {
       displayName = displayName.substring(0, 15) + '...';
     }
  }
  
  // We deleted .cur files, so we know .png exist
  const cursorImg = `../assets/cursors/${folder}/cursor.png`;
  const pointerImg = `../assets/cursors/${folder}/pointer.png`;
  
  html += `                <button type="button" class="cursor-style-btn" data-style="${folder}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 4px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s;">
                  <div style="display: flex; gap: 4px; margin-bottom: 6px; align-items: center; justify-content: center;">
                    <img src="${cursorImg}" alt="Cursor" style="width: 22px; height: 22px; object-fit: contain;">
                    <img src="${pointerImg}" alt="Pointer" style="width: 22px; height: 22px; object-fit: contain;">
                  </div>
                  <span style="font-size: 11px; opacity: 0.8; font-weight: 500; text-align: center; line-height: 1.1;">${displayName}</span>
                </button>\n`;
}

const popupPath = path.join('src', 'popup', 'popup.html');
let popupHtml = fs.readFileSync(popupPath, 'utf8');

const regex = /(<div class="cursor-masonry-grid" id="cursorMasonryGrid"[^>]*>)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>\s*<!-- 4\. Animations & Screen Filters -->)/;

const match = popupHtml.match(regex);
if (match) {
  const newHtml = popupHtml.replace(regex, `$1\n${html}              $3`);
  fs.writeFileSync(popupPath, newHtml);
  console.log('Successfully injected all cursors into popup.html');
} else {
  console.error('Regex match not found');
}
