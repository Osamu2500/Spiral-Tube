const fs = require('fs');
const path = require('path');

const themes = ["anime", "galaxy", "gothic", "grunge", "hologram", "matrix", "neo-brutalism", "origami", "retro-wave", "steampunk", "vaporwave", "woodblock", "y2k"];
const baseDir = path.join(__dirname, 'src', 'content', 'ui-styles');

const themeColors = {
    anime: { bg: '#fff0f5', primary: '#ff69b4', secondary: '#ff1493', accent: '#ffb6c1', text: '#333333', font: 'Nunito', radius: '16px', shadow: '0 4px 15px rgba(255, 105, 180, 0.3)' },
    galaxy: { bg: '#0b0c10', primary: '#450256', secondary: '#03045e', accent: '#00f0ff', text: '#e0e0e0', font: 'Space Grotesk', radius: '20px', shadow: '0 0 20px rgba(0, 240, 255, 0.4)' },
    gothic: { bg: '#121212', primary: '#2a0800', secondary: '#1c1c1c', accent: '#8b0000', text: '#d3d3d3', font: 'Cinzel', radius: '0px', shadow: '0 4px 20px rgba(139, 0, 0, 0.5)' },
    grunge: { bg: '#2b2b2b', primary: '#3d3d3d', secondary: '#4a4a4a', accent: '#8a9a5b', text: '#cccccc', font: 'Courier New', radius: '2px', shadow: 'none' },
    hologram: { bg: '#e0ffff', primary: '#e6e6fa', secondary: '#f0f8ff', accent: '#00ffff', text: '#2f4f4f', font: 'Orbitron', radius: '10px', shadow: '0 0 10px rgba(0, 255, 255, 0.6)' },
    matrix: { bg: '#000000', primary: '#001100', secondary: '#002200', accent: '#00ff00', text: '#00ff00', font: 'Courier', radius: '0px', shadow: '0 0 8px #00ff00' },
    "neo-brutalism": { bg: '#ffffff', primary: '#ffcc00', secondary: '#ff6699', accent: '#000000', text: '#000000', font: 'Space Mono', radius: '0px', shadow: '5px 5px 0px #000000' },
    origami: { bg: '#fdfdfd', primary: '#f4f4f4', secondary: '#eaeaea', accent: '#ff7f50', text: '#444444', font: 'Quicksand', radius: '4px', shadow: '1px 1px 5px rgba(0,0,0,0.1)' },
    "retro-wave": { bg: '#1a0b2e', primary: '#4a0e4e', secondary: '#2b0940', accent: '#ff007f', text: '#00ffff', font: 'VT323', radius: '8px', shadow: '0 0 15px rgba(255, 0, 127, 0.6)' },
    steampunk: { bg: '#3b2f2f', primary: '#5c4033', secondary: '#8b5a2b', accent: '#d2b48c', text: '#f5deb3', font: 'Playfair Display', radius: '10px', shadow: 'inset 0 0 10px #000' },
    vaporwave: { bg: '#ffb6c1', primary: '#dda0dd', secondary: '#87ceeb', accent: '#00ffff', text: '#ffffff', font: 'Syncopate', radius: '12px', shadow: '0 5px 15px rgba(0,255,255,0.4)' },
    woodblock: { bg: '#f5f5dc', primary: '#deb887', secondary: '#d2b48c', accent: '#8b4513', text: '#5c4033', font: 'Noto Serif', radius: '4px', shadow: '2px 2px 5px rgba(139, 69, 19, 0.2)' },
    y2k: { bg: '#e6e6fa', primary: '#ff69b4', secondary: '#00ffff', accent: '#9370db', text: '#191970', font: 'Comic Sans MS', radius: '25px', shadow: '0 0 12px rgba(255, 105, 180, 0.5)' }
};

themes.forEach(theme => {
    const bundlePath = path.join(baseDir, theme, 'bundle.css');
    if (fs.existsSync(bundlePath)) {
        let content = fs.readFileSync(bundlePath, 'utf8');
        
        if (!content.includes(':root, html[data-ypp-ui-style="' + theme + '"]')) {
            const colors = themeColors[theme] || themeColors.galaxy;
            const vars = `
:root, html[data-ypp-card-style="${theme}"], html[data-ypp-ui-style="${theme}"] {
    --${theme}-bg: ${colors.bg};
    --${theme}-primary: ${colors.primary};
    --${theme}-secondary: ${colors.secondary};
    --${theme}-accent: ${colors.accent};
    --${theme}-text: ${colors.text};
    --${theme}-font: '${colors.font}', sans-serif;
    --${theme}-radius: ${colors.radius};
    --${theme}-shadow: ${colors.shadow};
}

`;
            fs.writeFileSync(bundlePath, vars + content);
            console.log(`Fixed variables for ${theme}`);
        } else {
            console.log(`${theme} already has variables`);
        }
    } else {
        console.log(`Missing bundle.css for ${theme}`);
    }
});
