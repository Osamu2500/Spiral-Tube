const fs = require('fs');

let html = fs.readFileSync('src/popup/popup.html', 'utf8');

// Fix the empty 'data-' attributes on all buttons
html = html.replace(/data-\s+data-i18n="([^"]+)"/g, (match, i18nKey) => {
    // Map i18n key to actual style value if needed
    let style = i18nKey;
    if (i18nKey === 'hogwarts_magic') style = 'harry-potter';
    if (i18nKey === 'hacker_green') style = 'retrowave-green';
    if (i18nKey === 'retro_os') style = 'retro';
    if (i18nKey === 'pink') style = 'cherry';
    if (i18nKey === 'material_you') style = 'material';
    if (i18nKey === 'liquid_glass') style = 'liquid-glass';
    if (i18nKey === 'blue_sky') style = 'blue-sky';
    if (i18nKey === 'frutiger_aero') style = 'frutiger-aero';
    if (i18nKey === 'crystal_glass') style = 'crystal-glass';
    if (i18nKey === 'ice_blue') style = 'ice-blue';
    if (i18nKey === 'cairo_red') style = 'cairo-red';
    if (i18nKey === 'player_retouch') style = 'player-retouch';
    
    return `data-style="${style}" data-i18n="${i18nKey}"`;
});

// Now let's append our new themes to all three sections if they aren't there yet
const sections = [
    {
        name: 'youtube-style-btn',
        tagStart: '<button type="button" class="ypp-inline-97 theme-btn youtube-style-btn" data-style="startube" data-i18n="startube">StarTube (V3)</button>',
        newId: 98 // Just roughly pick the next number, wait, actually we can just regex insert them at the end of the div
    },
    {
        name: 'popup-style-btn',
        tagStart: '<button type="button" class="ypp-inline-129 theme-btn popup-style-btn" data-style="harry-potter" data-i18n="hogwarts_magic">Hogwarts Magic</button>'
    },
    {
        name: 'card-style-btn',
        tagStart: '<button type="button" class="ypp-inline-169 theme-btn card-style-btn" data-style="crystal-glass" data-i18n="crystal_glass">Crystal Glass</button>'
    }
];

const newThemesHTML = (type) => `
                <button type="button" class="theme-btn ${type}" data-style="nebula" data-i18n="nebula">Nebula</button>
                <button type="button" class="theme-btn ${type}" data-style="deepspace" data-i18n="deep_space">Deep Space</button>
                <button type="button" class="theme-btn ${type}" data-style="bloodmoon" data-i18n="blood_moon">Blood Moon</button>`;

sections.forEach(sec => {
    // Check if nebula already exists in this section (we can just check if we have data-style="nebula" with this class)
    if (!html.includes(`class="theme-btn ${sec.name}" data-style="nebula"`)) {
        html = html.replace(sec.tagStart, sec.tagStart + newThemesHTML(sec.name));
    }
});

fs.writeFileSync('src/popup/popup.html', html);
console.log('Fixed data-style attributes and added new themes.');
