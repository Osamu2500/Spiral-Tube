/**
 * apply-sakura-theme.js
 * Transforms the cloned vintage CSS into the Sakura Cherry Blossom design.
 * - Replaces all vintage colors with pink/rose sakura palette
 * - Replaces sharp/dashed borders with petal-soft rounded borders
 * - Replaces serif fonts with Nunito (cute, rounded)
 * - Fixes all border-radius values to petal-inspired shapes
 */

const fs   = require('fs');
const path = require('path');

const SAKURA_DIR = path.join(__dirname, '..', 'src', 'content', 'ui-styles', 'sakura');

// ─── COLOR MAP: vintage → sakura ─────────────────────────────────────────────
// We do exact color string replacements throughout all CSS files.
const COLOR_MAP = [
    // Page backgrounds
    ['#e8d5b5', '#fff0f5'],   // warm parchment  → blush pink
    ['#f4ecd8', '#fff7fa'],   // light parchment  → soft white-pink
    ['rgba(244, 236, 216, 0.92)', 'rgba(255, 247, 250, 0.94)'],
    ['rgba(244, 236, 216, .92)',  'rgba(255, 247, 250, .94)'],

    // Text colors
    ['#2c1f14', '#2d1a26'],   // dark brown  → dark plum
    ['#5c3d2e', '#7a3b5e'],   // medium brown → muted rose
    ['#7a5c45', '#9e6080'],   // light brown  → dusty rose
    ['#4a3728', '#4a2a3e'],
    ['#3e352f', '#4a2a3e'],

    // Accent / red → cherry rose
    ['#c13a3a', '#e8527a'],
    ['#a32e2e', '#c93f63'],
    ['rgba(193, 58, 58, 0.28)', 'rgba(232, 82, 122, 0.30)'],
    ['rgba(193, 58, 58, .28)',  'rgba(232, 82, 122, .30)'],
    ['rgba(193, 58, 58, 0.12)', 'rgba(232, 82, 122, 0.14)'],
    ['rgba(193, 58, 58, .12)',  'rgba(232, 82, 122, .14)'],
    ['rgba(193, 58, 58, 0.40)', 'rgba(232, 82, 122, 0.32)'],
    ['rgba(193, 58, 58, .40)',  'rgba(232, 82, 122, .32)'],
    ['rgba(193, 58, 58, 0.15)', 'rgba(232, 82, 122, 0.18)'],
    ['rgba(193, 58, 58, .15)',  'rgba(232, 82, 122, .18)'],

    // Border / glass colors
    ['rgba(62, 53, 47, 0.18)',  'rgba(220, 100, 140, 0.22)'],
    ['rgba(62, 53, 47, .18)',   'rgba(220, 100, 140, .22)'],
    ['rgba(62, 53, 47, 0.40)',  'rgba(220, 100, 140, 0.45)'],
    ['rgba(62, 53, 47, .40)',   'rgba(220, 100, 140, .45)'],
    ['rgba(62, 53, 47, 0.30)',  'rgba(220, 100, 140, 0.22)'],
    ['rgba(62, 53, 47, .30)',   'rgba(220, 100, 140, .22)'],
    ['rgba(62, 40, 20, 0.5)',   'rgba(180, 60, 100, 0.25)'],
    ['rgba(62, 40, 20, .5)',    'rgba(180, 60, 100, .25)'],

    // Scroll / misc
    ['rgba(255, 252, 245, 0.8)', 'rgba(255, 245, 250, 0.92)'],
    ['rgba(255, 252, 245, .8)',  'rgba(255, 245, 250, .92)'],
];

// ─── SHAPE MAP: dashed/sharp → petal-rounded ─────────────────────────────────
const SHAPE_MAP = [
    // Borders: remove dashed, use soft solid
    [/2px dashed var\(--vintage-secondary\)/g,   '1px solid rgba(232, 82, 122, 0.45)'],
    [/2px dashed var\(--vintage-primary\)/g,     '1.5px solid rgba(232, 82, 122, 0.65)'],
    [/2px dashed/g,                              '1px solid rgba(232, 82, 122, 0.45)'],
    [/1px dashed/g,                              '1px solid rgba(232, 82, 122, 0.35)'],

    // Petal border-radius — cards and surfaces get the petal asymmetric shape
    // The key to a "sakura petal" shape in CSS is: border-radius: 60% 40% 55% 45% / 50% 50% 60% 40%
    // We apply this to specific card selectors via the cards.css override below.
    // For general components: round but soft
    [/border-radius: 0 !important/g,             'border-radius: 20px !important'],
    [/border-radius: 0;/g,                       'border-radius: 20px;'],
    [/border-radius: 2px !important/g,           'border-radius: 20px !important'],
    [/border-radius: 2px;/g,                     'border-radius: 20px;'],
    [/border-radius: 4px !important/g,           'border-radius: 20px !important'],
    [/border-radius: 4px;/g,                     'border-radius: 20px;'],

    // Searchbox: pill shape
    [/border-radius: 2px !important.*ytd-searchbox/g, 'border-radius: 50px !important'],
];

// ─── FONT MAP: serif → Nunito ─────────────────────────────────────────────────
const FONT_MAP = [
    // Remove any existing font-face import / declaration
    [/"Times New Roman"[^;]*/g,   '"Nunito", "Quicksand", sans-serif'],
    [/'Times New Roman'[^;]*/g,   '"Nunito", "Quicksand", sans-serif'],
    [/Georgia[^;,)"]*/g,          '"Nunito", "Quicksand", sans-serif'],
    [/serif !important/g,         '"Nunito", "Quicksand", sans-serif !important'],
    [/serif;/g,                   '"Nunito", "Quicksand", sans-serif;'],
];

// ─── Helper: walk directory ───────────────────────────────────────────────────
function walk(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) results = results.concat(walk(full));
        else if (entry.name.endsWith('.css')) results.push(full);
    }
    return results;
}

// ─── Apply all replacements ───────────────────────────────────────────────────
let changedCount = 0;
for (const file of walk(SAKURA_DIR)) {
    // Skip the tokens file we already wrote perfectly
    if (file.includes('theme') && file.includes('tokens.css')) continue;
    // Skip already-built bundle files — they get rebuilt
    if (file === path.join(SAKURA_DIR, 'bundle.css')) continue;
    if (file === path.join(SAKURA_DIR, 'theme', 'bundle.css')) continue;

    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Colors
    for (const [from, to] of COLOR_MAP) {
        content = content.split(from).join(to);
    }

    // Shapes (regex)
    for (const [from, to] of SHAPE_MAP) {
        content = content.replace(from, to);
    }

    // Fonts
    for (const [from, to] of FONT_MAP) {
        content = content.replace(from, to);
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`  ✓ patched: ${path.relative(path.join(__dirname, '..'), file)}`);
        changedCount++;
    }
}

console.log(`\n🌸  Sakura theme patched (${changedCount} files updated)`);
