/**
 * clone-vintage-theme.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Clones the entire Vintage theme folder structure and rewrites all design
 * tokens so you can create a brand-new UI style with minimal effort.
 *
 * Usage:
 *   node scripts/clone-vintage-theme.js <new-theme-id> [--preview]
 *
 * Examples:
 *   node scripts/clone-vintage-theme.js steampunk-dark
 *   node scripts/clone-vintage-theme.js neon-tokyo --preview
 *
 * After running, edit your new theme's tokens file at:
 *   src/content/ui-styles/<new-theme-id>/theme/base/tokens.css
 *
 * Then run:  npm run build:css
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');

// ─── 1. CLI args ─────────────────────────────────────────────────────────────
const args      = process.argv.slice(2);
const newId     = args.find(a => !a.startsWith('--'));
const preview   = args.includes('--preview');

if (!newId) {
    console.error('❌  Usage: node scripts/clone-vintage-theme.js <new-theme-id>');
    process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(newId)) {
    console.error('❌  Theme ID must be lowercase letters, numbers, and hyphens only.');
    process.exit(1);
}

// ─── 2. Paths ─────────────────────────────────────────────────────────────────
const ROOT       = path.join(__dirname, '..');
const STYLES_DIR = path.join(ROOT, 'src', 'content', 'ui-styles');
const SRC        = path.join(STYLES_DIR, 'vintage');
const DEST       = path.join(STYLES_DIR, newId);

if (fs.existsSync(DEST) && !preview) {
    console.error(`❌  Theme "${newId}" already exists at ${DEST}`);
    console.error('    Delete it first, or choose a different ID.');
    process.exit(1);
}

// ─── 3. What we rewrite in every file ────────────────────────────────────────
//
// We replace the data-attribute selector and the html class so every CSS rule
// targets the new theme, not vintage.
//
// vintage  → uses:  html[data-ypp-ui-style="vintage"]
//                   html.yt-spiral-tube-theme
//
// new theme → uses: html[data-ypp-ui-style="<newId>"]
//                   html.yt-spiral-tube-theme   ← keep this! it's the base class
//
// Also swap the card-style class used inside CSS if it appears.

const REPLACEMENTS = [
    // Attribute selector for UI style
    { from: /data-ypp-ui-style="vintage"/g,     to: `data-ypp-ui-style="${newId}"` },
    // Any leftover string references (comments, labels)
    { from: /\bVintage\b/g,                     to: toTitleCase(newId) },
];

function toTitleCase(str) {
    return str.replace(/(^|-+)([a-z])/g, (_, sep, ch) => (sep ? ' ' : '') + ch.toUpperCase());
}

// ─── 4. Recursive copy + rewrite ─────────────────────────────────────────────
function copyDir(src, dest) {
    if (!preview) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath  = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}

function copyFile(src, dest) {
    let content = fs.readFileSync(src, 'utf8');

    // Apply every replacement
    for (const { from, to } of REPLACEMENTS) {
        content = content.replace(from, to);
    }

    const relDest = path.relative(ROOT, dest);
    if (preview) {
        console.log(`  [PREVIEW] Would write → ${relDest}`);
    } else {
        fs.writeFileSync(dest, content, 'utf8');
        console.log(`  ✓ ${relDest}`);
    }
}

// ─── 5. Run ────────────────────────────────────────────────────────────────────
console.log(`\n🎨  Cloning Vintage → "${newId}"${preview ? ' (PREVIEW — no files written)' : ''}\n`);
copyDir(SRC, DEST);

// ─── 6. Post-clone summary ────────────────────────────────────────────────────
if (!preview) {
    console.log(`
✅  Theme "${newId}" created at:
    ${DEST}

📝  Next steps:
    1. Edit the design tokens (colors, shadows, borders, shapes):
       ${path.join(DEST, 'theme', 'base', 'tokens.css')}

    2. The KEY variables to change are:
         --ypp-bg-base         → page background color
         --ypp-bg-surface      → card / panel surface color
         --ypp-text-primary    → main text color
         --ypp-text-secondary  → metadata / secondary text
         --ypp-accent          → accent / highlight color
         --ypp-shadow-card     → card shadow (offset, color)
         --ypp-shadow-float    → hover shadow
         --vintage-border      → border style (e.g. 2px dashed, 1px solid…)
         border-radius values  → controls roundness throughout all components

    3. Rebuild:
       npm run build:css

    4. Register the theme in src/content/config/constants.js and settings-schema.js
       (look for 'vintage' entries and add yours alongside them)

💡  Tip: To change border STYLE (dashed → solid → double) do a global
    find-replace inside your new theme folder:
      "2px dashed" → "2px solid"   (for a clean modern look)
      "border-radius: 0"           (keep for flat/retro)
      "border-radius: 12px"        (round/modern)
      "border-radius: 50%"         (pill buttons)
`);
} else {
    console.log('\n(Run without --preview to actually create the files)');
}
