const fs = require('fs');

function updateFile(filePath, searchContent, replacementContent) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchContent)) {
    content = content.replace(searchContent, replacementContent);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`Could not find target content in ${filePath}`);
  }
}

// 1. Update popup.css
const popupCssPath = 'src/popup/styles/core/popup.css';
const popupSearch = `  /* ── Spacing & Shape ── */
  --ui-radius: 12px;
  --r-xl: calc(var(--ui-radius) * 1.6);
  --r-lg: calc(var(--ui-radius) * 1.1);
  --r-md: calc(var(--ui-radius) * 0.8);
  --r-sm: calc(var(--ui-radius) * 0.5);
  --r-pill: 100px;`;

const popupReplace = `  /* ── Spacing & Shape (Squircle Mapping) ── */
  --ui-radius: var(--ypp-squircle-md, 12px);
  --r-xl: var(--ypp-squircle-xl, 24px);
  --r-lg: var(--ypp-squircle-lg, 16px);
  --r-md: var(--ypp-squircle-md, 10px);
  --r-sm: var(--ypp-squircle-sm, 6px);
  --r-pill: var(--ypp-radius-pill, 100px);`;

updateFile(popupCssPath, popupSearch, popupReplace);

// 2. Add tokens to base-ui-index.css
const baseUiPath = 'src/content/styles/base-ui-index.css';
let baseUiContent = fs.readFileSync(baseUiPath, 'utf8');
if (!baseUiContent.includes('--ypp-glass-bg')) {
  const tokens = `
/* =========================================
   CORE UI TOKENS (Glassmorphism & Squircles)
   ========================================= */
:root {
  /* Squircle Geometry */
  --ypp-squircle-xl: 24px;
  --ypp-squircle-lg: 16px;
  --ypp-squircle-md: 10px;
  --ypp-squircle-sm: 6px;
  --ypp-radius-pill: 999px;
  
  /* Blurs & Glassmorphism */
  --ypp-glass-bg: rgba(20, 20, 20, 0.65);
  --ypp-glass-bg-hover: rgba(255, 255, 255, 0.1);
  --ypp-glass-blur: blur(16px);
  --ypp-glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --ypp-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
`;
  baseUiContent = baseUiContent.replace('/* =========================================\r\n   GLOBAL COMPONENTS', tokens + '\n/* =========================================\r\n   GLOBAL COMPONENTS');
  baseUiContent = baseUiContent.replace('/* =========================================\n   GLOBAL COMPONENTS', tokens + '\n/* =========================================\n   GLOBAL COMPONENTS');
  fs.writeFileSync(baseUiPath, baseUiContent, 'utf8');
  console.log(`Updated ${baseUiPath}`);
}
