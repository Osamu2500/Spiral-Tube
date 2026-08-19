const fs = require('fs');

// === 1. popup-schema.js ===
let schema = fs.readFileSync('src/popup/popup-schema.js', 'utf8');

// Remove copyLinkButton from Search tab
const searchOld = `{ type:'toggle', id:'copyLinkButton',    label: t('copy_link_button'), desc: t('copy_link_button_desc'), icon:ICONS.promos },\r\n                ]`;
const searchNew = `]\r`;
if (schema.includes(searchOld)) {
    schema = schema.replace(searchOld, searchNew);
    console.log('Removed copyLinkButton from Search tab.');
} else {
    // Try LF
    const searchOldLF = `{ type:'toggle', id:'copyLinkButton',    label: t('copy_link_button'), desc: t('copy_link_button_desc'), icon:ICONS.promos },\n                ]`;
    if (schema.includes(searchOldLF)) {
        schema = schema.replace(searchOldLF, `]\n`);
        console.log('Removed copyLinkButton from Search tab (LF).');
    } else {
        console.log('WARNING: Could not find copyLinkButton in Search tab. Attempting manual search...');
        const idx = schema.indexOf("id:'copyLinkButton'");
        if (idx !== -1) {
            console.log('Found at idx', idx, JSON.stringify(schema.substring(idx-20, idx+150)));
        }
    }
}

// Add copyLinkButton with pages pill to Pro tab Video Management section
const proVideoMgmt = `                title: 'Video Management',\r
                icon: ICONS.player,\r
                items: [\r
                    { type:'toggle', id:'multiSelect', label: t('multi_select_videos'), desc: t('hold_shift_click_to_select_multiple_videos'), icon:ICONS.multiSelect, slot:'multiSelectOptions' },\r
                ]\r
            },`;

const proVideoMgmtNew = `                title: 'Video Management',\r
                icon: ICONS.player,\r
                items: [\r
                    { type:'toggle', id:'multiSelect', label: t('multi_select_videos'), desc: t('hold_shift_click_to_select_multiple_videos'), icon:ICONS.multiSelect, slot:'multiSelectOptions' },\r
                    { type:'toggle', id:'copyLinkButton', class:'span-4', label: t('copy_link_button'), desc: t('copy_link_button_desc'), icon:ICONS.promos, inlineSlot: '<div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:flex-end; width:100%; gap:12px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06);"><div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;"><span style="font-size:11px; opacity:0.6; margin-right:2px; font-weight:500;">Pages:</span><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="home" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Home</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="channel" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Channel</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="subs" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Subs</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="search" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Search</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="related" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Related</button></div></div>' },\r
                ]\r
            },`;

if (schema.includes(proVideoMgmt)) {
    schema = schema.replace(proVideoMgmt, proVideoMgmtNew);
    console.log('Added copyLinkButton with pages to Pro tab.');
} else {
    // Try variations with LF
    const proVideoMgmtLF = `                title: 'Video Management',\n                icon: ICONS.player,\n                items: [\n                    { type:'toggle', id:'multiSelect', label: t('multi_select_videos'), desc: t('hold_shift_click_to_select_multiple_videos'), icon:ICONS.multiSelect, slot:'multiSelectOptions' },\n                ]\n            },`;
    if (schema.includes(proVideoMgmtLF)) {
        const proVideoMgmtNewLF = `                title: 'Video Management',\n                icon: ICONS.player,\n                items: [\n                    { type:'toggle', id:'multiSelect', label: t('multi_select_videos'), desc: t('hold_shift_click_to_select_multiple_videos'), icon:ICONS.multiSelect, slot:'multiSelectOptions' },\n                    { type:'toggle', id:'copyLinkButton', class:'span-4', label: t('copy_link_button'), desc: t('copy_link_button_desc'), icon:ICONS.promos, inlineSlot: '<div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:flex-end; width:100%; gap:12px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06);"><div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;"><span style="font-size:11px; opacity:0.6; margin-right:2px; font-weight:500;">Pages:</span><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="home" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Home</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="channel" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Channel</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="subs" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Subs</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="search" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Search</button><button type="button" class="theme-btn card-style-btn copy-link-page-btn active" data-page="related" style="font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; transition:all 0.2s;">Related</button></div></div>' },\n                ]\n            },`;
        schema = schema.replace(proVideoMgmtLF, proVideoMgmtNewLF);
        console.log('Added copyLinkButton with pages to Pro tab (LF path).');
    } else {
        console.log('WARNING: Could not find Video Management section in Pro tab.');
        const idx = schema.indexOf("Video Management");
        if (idx !== -1) {
            console.log('Context:', JSON.stringify(schema.substring(idx-5, idx+100)));
        }
    }
}

fs.writeFileSync('src/popup/popup-schema.js', schema, 'utf8');

// === 2. settings-schema.js — add per-page settings ===
let settingsSchema = fs.readFileSync('src/content/config/settings-schema.js', 'utf8');
const settingsTarget = `copyLinkButton:      { type: 'boolean', default: true },`;
const settingsReplacement = `copyLinkButton:      { type: 'boolean', default: true },
        copyLinkHome:        { type: 'boolean', default: true },
        copyLinkChannel:     { type: 'boolean', default: true },
        copyLinkSubs:        { type: 'boolean', default: true },
        copyLinkSearch:      { type: 'boolean', default: true },
        copyLinkRelated:     { type: 'boolean', default: true },`;
if (settingsSchema.includes(settingsTarget)) {
    settingsSchema = settingsSchema.replace(settingsTarget, settingsReplacement);
    fs.writeFileSync('src/content/config/settings-schema.js', settingsSchema, 'utf8');
    console.log('Added per-page settings to settings-schema.js.');
} else {
    console.log('WARNING: Could not find copyLinkButton in settings-schema.js');
}

// === 3. shared/default-settings.js — add per-page defaults ===
let defaults = fs.readFileSync('src/shared/default-settings.js', 'utf8');
const defaultTarget = `copyLinkButton: true,`;
const defaultReplacement = `copyLinkButton: true,
  copyLinkHome: true,
  copyLinkChannel: true,
  copyLinkSubs: true,
  copyLinkSearch: true,
  copyLinkRelated: true,`;
if (defaults.includes(defaultTarget)) {
    defaults = defaults.replace(defaultTarget, defaultReplacement);
    fs.writeFileSync('src/shared/default-settings.js', defaults, 'utf8');
    console.log('Added per-page defaults to default-settings.js.');
} else {
    console.log('WARNING: Could not find copyLinkButton in default-settings.js');
}

console.log('All schema changes done.');
