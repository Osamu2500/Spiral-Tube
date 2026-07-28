const fs = require('fs');

let js = fs.readFileSync('src/popup/popup-components.js', 'utf8');

// A map of light themes and their respective light background hex colors
const lightThemeColors = {
  'kawaii': '#fff1f4',
  'claymorphism': '#f0e8ff',
  'frutiger-aero': '#bfe6ff',
  'blue-sky': '#87ceeb',
  'vintage': '#e0cda7',
  'nature': '#d4e157',
  'minimalism': '#fafafa',
  'crystal-glass': '#f0f0f0',
  'ice-blue': '#e0f7fa',
  'retro': '#c0c0c0',
  'summer': '#fff9c4',
  'spring': '#c8e6c9',
  'skeuomorphic': '#e0e0e0',
  'glass': '#ffffff',
  'frosted': '#f5f5f5',
  'flat': '#ffffff',
  'folder': '#ffe082',
  'minimalist': '#ffffff'
};

for (const [theme, color] of Object.entries(lightThemeColors)) {
  // We need to replace the color attribute for these themes in the JS array
  // Example match: { key: 'kawaii', label: 'Kawaii', meta: 'New', color: '#1a1a1a' }
  // We will regex replace the color string for the specific key
  const regex = new RegExp(`(key:\\s*['"\`]${theme}['"\`][^}]+color:\\s*)['"\`][^'"\`]+['"\`]`, 'i');
  js = js.replace(regex, `$1'${color}'`);
}

fs.writeFileSync('src/popup/popup-components.js', js);
console.log('Patched light theme colors in popup-components.js');
