const fs = require('fs');
const path = require('path');

const navbarPath = path.resolve('src/content/ui-styles/vintage/components/navbar.css');
let navbarCSS = fs.readFileSync(navbarPath, 'utf8');

const overhaulIdx = navbarCSS.indexOf('/* Navbar Overhaul for vintage */');
if (overhaulIdx !== -1) {
    navbarCSS = navbarCSS.substring(0, overhaulIdx);
}

const searchDropdownCSS = `
/* Vintage Search Dropdown */
html[data-ypp-ui-style="vintage"] .sbdd_b,
html[data-ypp-ui-style="vintage"] .sbsb_a {
    background: var(--sf) !important;
    border: 2px dashed var(--vintage-secondary) !important;
    border-radius: 0 !important;
    box-shadow: 4px 4px rgba(0,0,0,0.1) !important;
}

html[data-ypp-ui-style="vintage"] .sbsb_c {
    color: var(--vintage-secondary) !important;
    font-family: Georgia, "Times New Roman", serif !important;
    font-weight: bold !important;
}

html[data-ypp-ui-style="vintage"] .sbsb_c:hover {
    background: var(--vintage-secondary) !important;
    color: var(--sf) !important;
}
`;

fs.writeFileSync(navbarPath, navbarCSS + searchDropdownCSS);

const buttonsPath = path.resolve('src/content/ui-styles/vintage/components/buttons.css');
let buttonsCSS = fs.readFileSync(buttonsPath, 'utf8');

buttonsCSS = buttonsCSS.split('html[data-ypp-ui-style="vintage"] #top-level-buttons-computed .yt-spec-button-shape-next').join(
    'html[data-ypp-ui-style="vintage"] #top-level-buttons-computed .yt-spec-button-shape-next,\nhtml[data-ypp-ui-style="vintage"] #actions-inner .yt-spec-button-shape-next'
);

fs.writeFileSync(buttonsPath, buttonsCSS);

console.log('Fixed vintage CSS files');
