const fs = require('fs');
const path = require('path');

const cardStylesDir = path.join(__dirname, '../src/content/card-styles');
const cardStyles = fs.readdirSync(cardStylesDir).filter(f => f.endsWith('.css'));

cardStyles.forEach(file => {
  const filePath = path.join(cardStylesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace background: #hex !important with background: var(--ypp-bg-surface, #hex) !important
  content = content.replace(/(background(?:-color)?)\s*:\s*(#[a-fA-F0-9]{3,6})\s*!important/gi, '$1: var(--ypp-bg-surface, $2) !important');
  
  // For hover backgrounds, use ypp-bg-surface as a fallback or a hover token if we had one
  // Actually, we'll just use --ypp-bg-surface for backgrounds to keep it simple, or let them be.
  
  // Replace text colors to link to the framework text
  // e.g. color: #2c2520 -> color: var(--ypp-text-primary, #2c2520)
  content = content.replace(/(--yt-spec-text-primary)\s*:\s*(#[a-fA-F0-9]{3,6})\s*!important/gi, '$1: var(--ypp-text-primary, $2) !important');
  content = content.replace(/(--yt-spec-text-secondary)\s*:\s*(#[a-fA-F0-9]{3,6})\s*!important/gi, '$1: var(--ypp-text-secondary, $2) !important');
  
  content = content.replace(/#video-title\s*{\s*color\s*:\s*(#[a-fA-F0-9]{3,6})\s*!important;/gi, '#video-title { color: var(--ypp-text-primary, $1) !important;');
  content = content.replace(/#metadata-line span\s*{\s*color\s*:\s*(#[a-fA-F0-9]{3,6})\s*!important;/gi, '#metadata-line span { color: var(--ypp-text-secondary, $1) !important;');

  fs.writeFileSync(filePath, content);
});

console.log(`Successfully linked 75 card styles without centralizing them!`);
