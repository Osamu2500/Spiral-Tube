const fs = require('fs');
const path = require('path');

const stylesDir = 'src/content/ui-styles';
const folders = fs.readdirSync(stylesDir).filter(f => fs.statSync(path.join(stylesDir, f)).isDirectory());

let count = 0;
for (const folder of folders) {
    const bgPath = path.join(stylesDir, folder, 'base', 'background.css');
    if (fs.existsSync(bgPath)) {
        let content = fs.readFileSync(bgPath, 'utf8');
        
        // regex to find html[data-ypp-card-style="X"] body { or html[data-ypp-ui-style="X"] body {
        const regex1 = new RegExp(`html\\[data-ypp-(card|ui)-style="${folder}"\\]\\s*body\\s*\\{`, 'g');
        const regex2 = new RegExp(`html\\[data-ypp-(card|ui)-style=${folder}\\]\\s*body\\s*\\{`, 'g');
        
        if (regex1.test(content) || regex2.test(content)) {
            content = content.replace(regex1, `html,\n[dark] body,\n$&`);
            content = content.replace(regex2, `html,\n[dark] body,\n$&`);
            fs.writeFileSync(bgPath, content);
            console.log(`Fixed ${folder}`);
            count++;
        }
    }
}
console.log(`Fixed ${count} backgrounds.`);
