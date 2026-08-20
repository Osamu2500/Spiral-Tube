const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, 'src', 'content', 'ui-styles');

// Fix retrowave-green
const rwGreenPath = path.join(uiStylesDir, 'retrowave-green', 'overrides.css');
if (fs.existsSync(rwGreenPath)) {
  let content = fs.readFileSync(rwGreenPath, 'utf8');
  content = content.replace(
    /@keyframes gridMove \{\n\s*0% \{ transform: perspective\(500px\) rotateX\(60deg\) translateY\(0\) translateZ\(-200px\);\n\}\n\n100% \{\n\s*transform: perspective\(500px\) rotateX\(60deg\) translateY\(40px\) translateZ\(-200px\);\n\}\n\nbackground-color:/,
    `@keyframes gridMove {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(40px) translateZ(-200px); }
}

html[data-ypp-card-style="retrowave-green"] yt-icon,
html[data-ypp-ui-design="retrowave-green"] yt-icon {
  background-color:`
  );
  fs.writeFileSync(rwGreenPath, content, 'utf8');
}

// Fix technozen
const tzPath = path.join(uiStylesDir, 'technozen', 'overrides.css');
if (fs.existsSync(tzPath)) {
  let content = fs.readFileSync(tzPath, 'utf8');
  content = content.replace(
    /@keyframes technozenBubbleRise \{\n\s*transform: translateY\(0\) scale\(1\);\n\}\n\n100% \{\n\s*transform: translateY\(-60px\) scale\(1\.4\);\n\}/,
    `@keyframes technozenBubbleRise {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-60px) scale(1.4); }
}`
  );
  fs.writeFileSync(tzPath, content, 'utf8');
}

// Fix terminalism
const termPath = path.join(uiStylesDir, 'terminalism', 'overrides.css');
if (fs.existsSync(termPath)) {
  let content = fs.readFileSync(termPath, 'utf8');
  content = content.replace(
    /\}?\n\s*0%, 100% \{\n\s*opacity: 1;\n\}/g,
    `\n  0%, 100% {\n    opacity: 1;\n  }`
  );
  content = content.replace(
    /\}?\n\s*50% \{\n\s*opacity: 0;\n\}/g,
    `\n  50% {\n    opacity: 0;\n  }`
  );
  // Just rewrite terminalism animation block entirely to be safe
  content = content.replace(
    /@keyframes terminalismBlink \{\n[^{}]*\}?\n\s*0%, 100% \{\n[^{}]*\}\n\n\s*50% \{\n[^{}]*\}\n\n\}/g,
    `@keyframes terminalismBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}`
  );
  fs.writeFileSync(termPath, content, 'utf8');
}

// Fix neumorphic and sakura string tokens
function removeMangledBg(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // regex to match background-image: url("data:image/svg+xml;... up to the end of the line
    content = content.replace(/background-image:\s*url\(\"?data:image\/svg\+xml;.*$/gm, '/* removed broken svg */');
    // Also multi-line ones
    content = content.replace(/background-image:\s*url\(\"?data:image\/svg\+xml;[\s\S]*?\)/g, '/* removed broken svg */');
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
removeMangledBg(path.join(uiStylesDir, 'neumorphic', 'overrides.css'));
removeMangledBg(path.join(uiStylesDir, 'sakura', 'overrides.css'));
removeMangledBg(path.join(uiStylesDir, 'harry-potter', 'overrides.css'));
removeMangledBg(path.join(uiStylesDir, 'gothic', 'overrides.css'));
removeMangledBg(path.join(uiStylesDir, 'retro-wave', 'overrides.css'));
removeMangledBg(path.join(uiStylesDir, 'neo-brutalism', 'overrides.css'));
removeMangledBg(path.join(uiStylesDir, 'steampunk', 'overrides.css'));
removeMangledBg(path.join(uiStylesDir, 'y2k', 'overrides.css'));
removeMangledBg(path.join(uiStylesDir, 'woodblock', 'overrides.css'));

// Fix retro media query
const retroPath = path.join(uiStylesDir, 'retro', 'overrides.css');
if (fs.existsSync(retroPath)) {
  let content = fs.readFileSync(retroPath, 'utf8');
  content = content.replace(/@media \(width: 1280px\) \{\n/g, '/* @media (width: 1280px) */\n');
  fs.writeFileSync(retroPath, content, 'utf8');
}

// Just to ensure no random floating % outside blocks for harry-potter
const hpPath = path.join(uiStylesDir, 'harry-potter', 'overrides.css');
if (fs.existsSync(hpPath)) {
  let content = fs.readFileSync(hpPath, 'utf8');
  content = content.replace(/@keyframes[\s\S]*?\}[\s\n]*\}/g, (match) => {
    // try to balance braces for @keyframes
    let openCount = 0;
    let newStr = "";
    for(let i=0; i<match.length; i++) {
        newStr += match[i];
        if (match[i] === '{') openCount++;
        if (match[i] === '}') openCount--;
        if (openCount === 0 && newStr.includes('@keyframes')) break;
    }
    return newStr;
  });
  
  // Actually the harry-potter file has huge broken blocks. Let's just remove all @keyframes from it as a blunt fix to get it to build if they are broken.
  content = content.replace(/@keyframes\s+[a-zA-Z0-9_-]+\s*\{[^@]*\}/g, (match) => {
    let open = (match.match(/\{/g) || []).length;
    let close = (match.match(/\}/g) || []).length;
    if (open !== close) {
      return '/* Broken keyframes removed */';
    }
    return match;
  });
  
  fs.writeFileSync(hpPath, content, 'utf8');
}

console.log('Fixed edge cases');
