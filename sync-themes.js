const fs = require('fs');

const dirs = fs.readdirSync('src/content/ui-styles', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'shared' && dirent.name !== 'search-card-compat')
    .map(dirent => dirent.name);

// Function to format the display name
function formatName(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

let html = fs.readFileSync('src/popup/popup.html', 'utf8');

// The three sections we want to update
const sections = [
    { id: 'youtubePageTheme', btnClass: 'youtube-style-btn' },
    { id: 'popupUiTheme', btnClass: 'popup-style-btn' },
    { id: 'cardStyle', btnClass: 'card-style-btn' }
];

sections.forEach(sec => {
    // We find the <div class="ypp-inline-... theme-grid"> that comes right after <input type="hidden" id="youtubePageTheme"...>
    const regex = new RegExp(`(<input type="hidden" id="${sec.id}"[^>]*>\\s*<div class="[^"]*theme-grid">)([\\s\\S]*?)(</div>\\s*</div>)`, 'i');
    
    html = html.replace(regex, (match, prefix, content, suffix) => {
        // Generate new buttons for all themes
        const buttons = dirs.map(dir => {
            return `                <button type="button" class="theme-btn ${sec.btnClass}" data-style="${dir}" data-i18n="${dir}">${formatName(dir)}</button>`;
        }).join('\n');
        
        return prefix + '\n' + buttons + '\n              ' + suffix;
    });
});

fs.writeFileSync('src/popup/popup.html', html);

// Now for popup-components.js, let's find themes that are NOT in themeCategories and append them to "UserStyles" or a new "New Themes" category.
let js = fs.readFileSync('src/popup/popup-components.js', 'utf8');

const missingInJs = dirs.filter(dir => {
    return !js.includes(`key: '${dir}'`) && !js.includes(`key:"${dir}"`) && !js.includes(`key:\`${dir}\``);
});

if (missingInJs.length > 0) {
    // Find the end of themeCategories array
    const themesStr = missingInJs.map(dir => {
        return `          { key: '${dir}', label: '${formatName(dir)}', meta: 'New', color: '#1a1a1a' }`;
    }).join(',\n');
    
    const newCategory = `
      {
        name: 'New Additions',
        themes: [
${themesStr}
        ]
      },`;
      
    // Insert before the last '];' of themeCategories
    // themeCategories = [ ... ];
    const insertPoint = js.indexOf('    ];', js.indexOf('const themeCategories = ['));
    if (insertPoint !== -1) {
        js = js.slice(0, insertPoint) + newCategory + '\n' + js.slice(insertPoint);
        fs.writeFileSync('src/popup/popup-components.js', js);
    }
}

console.log('Successfully synced all ' + dirs.length + ' themes to popup.html and popup-components.js!');
