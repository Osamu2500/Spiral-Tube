const fs = require('fs');
const path = require('path');
const stylesDir = 'src/content/ui-styles';
const uiDesigns = ["abyss","aurora","autumn","blue-sky","brutalism","cherry","christmas","claymorphism","coffee","deepspace","discord","dracula","ember","forest","frutiger-aero","hacker","harry-potter","kawaii","liquid-glass","material","maximalism","midnight","minimalism","nature","nebula","neumorphic","nord","ocean","outrun","player-retouch","retro","retrowave-green","startube","sunset","technozen","terminalism","vintage"];

for (const d of uiDesigns) {
    const bundle = path.join(stylesDir, d, 'bundle.css');
    if (fs.existsSync(bundle)) {
        const size = fs.statSync(bundle).size;
        console.log(`${d}: ${size} bytes`);
    } else {
        console.log(`${d}: NO BUNDLE`);
    }
}
