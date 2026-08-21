/**
 * backfill_card_tokens.js
 * 
 * Reads every ui-styles tokens.css and backfills the --ypp-card-* token block
 * if it's missing. The values are derived intelligently from the design's existing
 * surface/shadow/accent tokens so they look correct without any manual work.
 */

const fs = require('fs');
const path = require('path');

const UI_STYLES_DIR = path.join(__dirname, '../src/content/core-framework/ui-styles');

// The card token block template — we derive values from each design's own tokens
function generateCardTokenBlock(tokens) {
  const get = (key, fallback) => {
    const match = tokens.match(new RegExp(`${key.replace(/[-]/g, '\\-')}\\s*:\\s*([^!;\\n]+)`, 'i'));
    return match ? match[1].trim() : fallback;
  };

  const bgSurface   = get('--ypp-bg-surface',         'transparent');
  const bgHover     = get('--ypp-surface-bg-hover',    get('--ypp-bg-surface-hover', bgSurface));
  const border      = get('--ypp-surface-border',      '1px solid transparent');
  const shadow      = get('--ypp-shadow-base',         'none');
  const shadowHover = get('--ypp-shadow-hover',        shadow);
  const backdrop    = get('--ypp-card-backdrop-filter','none');

  return `
  /* ── Card Token Connections ─────────────────────────────────────────── */
  --ypp-card-bg:                    ${bgSurface} !important;
  --ypp-card-bg-hover:              ${bgHover} !important;
  --ypp-card-border:                ${border} !important;
  --ypp-card-border-hover:          ${border} !important;
  --ypp-card-shadow:                ${shadow} !important;
  --ypp-card-shadow-hover:          ${shadowHover} !important;
  --ypp-card-backdrop-filter:       ${backdrop} !important;
  --ypp-card-backdrop-filter-hover: ${backdrop} !important;`;
}

let updated = 0;
let skipped = 0;

const entries = fs.readdirSync(UI_STYLES_DIR, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const tokensPath = path.join(UI_STYLES_DIR, entry.name, 'tokens.css');
  if (!fs.existsSync(tokensPath)) continue;

  const css = fs.readFileSync(tokensPath, 'utf8');

  // Already has card tokens — skip
  if (css.includes('--ypp-card-bg')) {
    skipped++;
    continue;
  }

  // Find the closing brace of the :root[data-ypp-ui-design] block
  // We inject card tokens just before the first closing brace of the token block
  const firstBlockEnd = css.indexOf('}');
  if (firstBlockEnd === -1) {
    console.log(`⚠️  Could not find token block in: ${entry.name}/tokens.css`);
    continue;
  }

  const cardBlock = generateCardTokenBlock(css);
  const newCss = css.slice(0, firstBlockEnd) + cardBlock + '\n' + css.slice(firstBlockEnd);

  fs.writeFileSync(tokensPath, newCss);
  console.log(`✅ Backfilled card tokens: ${entry.name}`);
  updated++;
}

console.log(`\n✨ Done! Updated: ${updated}, Already OK: ${skipped}`);
