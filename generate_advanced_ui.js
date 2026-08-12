const fs = require('fs');
const path = require('path');

const themes = ["anime", "galaxy", "gothic", "grunge", "hologram", "matrix", "neo-brutalism", "origami", "retro-wave", "steampunk", "vaporwave", "woodblock", "y2k"];
const baseDir = path.join(__dirname, 'src', 'content', 'ui-styles');

const themeConfigs = {
    anime: { bg: '#fff0f5', primary: '#ff69b4', secondary: '#ff1493', accent: '#ffb6c1', text: '#333333', font: 'Nunito', radius: '20px', shadow: '0 8px 30px rgba(255, 105, 180, 0.4)', border: '2px solid #ffb6c1', transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)', buttonShadow: '0 4px 15px rgba(255, 105, 180, 0.6)' },
    galaxy: { bg: '#0b0c10', primary: '#450256', secondary: '#03045e', accent: '#00f0ff', text: '#e0e0e0', font: 'Space Grotesk', radius: '16px', shadow: '0 0 25px rgba(0, 240, 255, 0.5)', border: '1px solid rgba(0, 240, 255, 0.3)', transition: 'all 0.3s ease', buttonShadow: '0 0 15px rgba(0, 240, 255, 0.8)' },
    gothic: { bg: '#121212', primary: '#2a0800', secondary: '#1c1c1c', accent: '#8b0000', text: '#d3d3d3', font: 'Cinzel', radius: '0px', shadow: '0 4px 25px rgba(139, 0, 0, 0.7)', border: '2px solid #8b0000', transition: 'all 0.5s ease-in-out', buttonShadow: '0 4px 15px #8b0000' },
    grunge: { bg: '#2b2b2b', primary: '#3d3d3d', secondary: '#4a4a4a', accent: '#8a9a5b', text: '#cccccc', font: 'Courier New', radius: '2px', shadow: 'inset 0 0 10px rgba(0,0,0,0.8)', border: '1px dashed #8a9a5b', transition: 'none', buttonShadow: '2px 2px 0 #111' },
    hologram: { bg: '#e0ffff', primary: '#e6e6fa', secondary: '#f0f8ff', accent: '#00ffff', text: '#2f4f4f', font: 'Orbitron', radius: '10px', shadow: '0 0 15px rgba(0, 255, 255, 0.7), inset 0 0 10px rgba(0,255,255,0.3)', border: '1px solid #00ffff', transition: 'all 0.3s ease-out', buttonShadow: '0 0 20px #00ffff' },
    matrix: { bg: '#000000', primary: '#001100', secondary: '#002200', accent: '#00ff00', text: '#00ff00', font: 'Courier', radius: '0px', shadow: '0 0 12px #00ff00', border: '1px dotted #00ff00', transition: 'none', buttonShadow: '0 0 15px #00ff00' },
    "neo-brutalism": { bg: '#ffffff', primary: '#ffcc00', secondary: '#ff6699', accent: '#000000', text: '#000000', font: 'Space Mono', radius: '0px', shadow: '6px 6px 0px #000000', border: '4px solid #000000', transition: 'transform 0.1s ease', buttonShadow: '4px 4px 0px #000000' },
    origami: { bg: '#fdfdfd', primary: '#f4f4f4', secondary: '#eaeaea', accent: '#ff7f50', text: '#444444', font: 'Quicksand', radius: '0px', shadow: '2px 2px 10px rgba(0,0,0,0.15)', border: '1px solid #e0e0e0', transition: 'all 0.3s ease', buttonShadow: '1px 1px 5px rgba(0,0,0,0.2)' },
    "retro-wave": { bg: '#1a0b2e', primary: '#4a0e4e', secondary: '#2b0940', accent: '#ff007f', text: '#00ffff', font: 'VT323', radius: '8px', shadow: '0 0 20px rgba(255, 0, 127, 0.8)', border: '2px solid #ff007f', transition: 'all 0.2s ease', buttonShadow: '0 0 15px #00ffff' },
    steampunk: { bg: '#3b2f2f', primary: '#5c4033', secondary: '#8b5a2b', accent: '#d2b48c', text: '#f5deb3', font: 'Playfair Display', radius: '50%', shadow: 'inset 0 0 15px #000, 0 5px 15px rgba(0,0,0,0.6)', border: '3px double #d2b48c', transition: 'all 0.5s ease', buttonShadow: '0 4px 10px #000' },
    vaporwave: { bg: '#ffb6c1', primary: '#dda0dd', secondary: '#87ceeb', accent: '#00ffff', text: '#ffffff', font: 'Syncopate', radius: '12px', shadow: '0 10px 25px rgba(0,255,255,0.6)', border: '2px solid #87ceeb', transition: 'all 0.4s ease', buttonShadow: '0 5px 20px #ffb6c1' },
    woodblock: { bg: '#f5f5dc', primary: '#deb887', secondary: '#d2b48c', accent: '#8b4513', text: '#5c4033', font: 'Noto Serif', radius: '4px', shadow: '3px 3px 8px rgba(139, 69, 19, 0.3)', border: '2px solid #8b4513', transition: 'all 0.3s ease', buttonShadow: '2px 2px 5px #8b4513' },
    y2k: { bg: '#e6e6fa', primary: '#ff69b4', secondary: '#00ffff', accent: '#9370db', text: '#191970', font: 'Comic Sans MS', radius: '30px', shadow: '0 0 20px rgba(255, 105, 180, 0.6)', border: '3px solid #00ffff', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', buttonShadow: '0 8px 15px rgba(147, 112, 219, 0.5)' }
};

const selectors = {
    globalBackgrounds: [
        'ytd-app', '#page-manager', 'ytd-page-manager', 'ytd-watch-flexy', '#columns', 
        '#primary', '#secondary', '#content', 'ytd-browse', 'ytd-search', 'html', 'body'
    ],
    cardsAndContainers: [
        'ytd-rich-item-renderer', 'ytd-grid-video-renderer', 'ytd-compact-video-renderer',
        'ytd-playlist-video-renderer', 'ytd-reel-item-renderer', 'ytd-post-renderer',
        'ytd-comment-thread-renderer', 'ytd-comment-renderer', 'ytd-backstage-post-renderer',
        '#contents > ytd-item-section-renderer', 'ytd-channel-renderer'
    ],
    headersAndNav: [
        'ytd-masthead', '#masthead-container', 'ytd-mini-guide-renderer', 'ytd-guide-renderer',
        '#guide-wrapper', 'ytd-guide-section-renderer', 'ytd-guide-entry-renderer',
        '#guide-content', 'ytd-app-action-bar-renderer', '#header', 'ytd-feed-filter-chip-bar-renderer'
    ],
    buttonsAndChips: [
        'ytd-button-renderer', 'ytd-toggle-button-renderer', 'yt-button-shape', 'yt-chip-cloud-chip-renderer',
        '.yt-spec-button-shape-next', '#subscribe-button', '.yt-spec-button-shape-next--filled',
        '.yt-spec-button-shape-next--outline', '.yt-spec-button-shape-next--tonal'
    ],
    menusAndDialogs: [
        'tp-yt-paper-dialog', 'ytd-menu-popup-renderer', 'tp-yt-iron-dropdown', 
        '#contentWrapper tp-yt-iron-dropdown', '.ytp-settings-menu', 'ytd-multi-page-menu-renderer',
        '#dialog', 'ytd-hotkey-dialog-renderer', 'ytd-sponsorships-offer-renderer'
    ],
    inputsAndSearch: [
        'ytd-searchbox', '#search-input', '#search-form', '#search-icon-legacy',
        '#search-container', 'ytd-comment-simplebox-renderer', 'tp-yt-paper-input',
        'tp-yt-paper-textarea', 'ytd-searchbox[has-focus]'
    ],
    thumbnailsAndImages: [
        'ytd-thumbnail', 'ytd-playlist-thumbnail', 'ytd-reel-video-renderer',
        '.ytp-videowall-still-image', '.ytp-ce-video', '#thumbnail'
    ],
    avatars: [
        '#avatar', 'yt-img-shadow', '.yt-spec-avatar-shape', 'ytd-channel-avatar'
    ],
    shortsUI: [
        'ytd-shorts', '#shorts-container', 'ytd-reel-video-renderer[is-active]',
        'ytd-reel-player-overlay-renderer', '#overlay', '#actions.ytd-reel-player-overlay-renderer'
    ],
    playerUI: [
        '.ytp-chrome-bottom', '.ytp-progress-bar-container', '.ytp-chrome-controls',
        '.ytp-volume-slider-handle', '.ytp-volume-slider-track', '.ytp-settings-menu',
        '.ytp-menuitem'
    ],
    liveChat: [
        'yt-live-chat-app', '#chat', 'yt-live-chat-renderer', '#chat-messages',
        'yt-live-chat-text-message-renderer', 'yt-live-chat-ticker-renderer'
    ],
    channelPage: [
        'ytd-c4-tabbed-header-renderer', '#channel-header', '#tabs-inner-container',
        'tp-yt-paper-tab', 'ytd-expandable-tab-renderer', '#channel-container'
    ],
    playlists: [
        'ytd-playlist-panel-renderer', '.playlist-items', 'ytd-playlist-panel-video-renderer',
        'ytd-playlist-sidebar-renderer', 'ytd-playlist-header-renderer'
    ],
    miniplayer: [
        'ytd-miniplayer', '#miniplayer-bar', '.ytp-miniplayer-ui', '.miniplayer',
        'ytd-miniplayer[active]'
    ],
    endscreens: [
        '.ytp-ce-element', '.ytp-ce-video', '.ytp-ce-channel', '.ytp-ce-playlist',
        '.ytp-ce-covering-overlay', '.ytp-ce-expanding-image'
    ],
    transcript: [
        'ytd-transcript-search-panel-renderer', 'ytd-transcript-segment-renderer',
        'ytd-macro-markers-list-item-renderer', 'ytd-macro-markers-info-item-renderer',
        '#segments-container'
    ]
};

function generateVariables(theme, conf) {
    return `
:root, html[data-ypp-card-style="${theme}"], html[data-ypp-ui-style="${theme}"] {
    --${theme}-bg: ${conf.bg};
    --${theme}-primary: ${conf.primary};
    --${theme}-secondary: ${conf.secondary};
    --${theme}-accent: ${conf.accent};
    --${theme}-text: ${conf.text};
    --${theme}-font: '${conf.font}', sans-serif;
    --${theme}-radius: ${conf.radius};
    --${theme}-shadow: ${conf.shadow};
    --${theme}-border: ${conf.border};
    --${theme}-transition: ${conf.transition};
    --${theme}-btn-shadow: ${conf.buttonShadow};
}
`;
}

function generateCSSBlock(theme, moduleName, selectorList, propertiesGenerator) {
    let css = `/* === ${theme.toUpperCase()} - ${moduleName.toUpperCase()} === */\n`;
    const prefix = `html[data-ypp-ui-style="${theme}"]`;
    const specificSelectors = selectorList.map(s => {
        let cardPrefix = '';
        if (moduleName.includes('Cards') || moduleName.includes('Thumbnails') || moduleName.includes('Avatars') || moduleName.includes('Global Fonts') || moduleName.includes('End Screens')) {
            cardPrefix = `, html[data-ypp-card-style="${theme}"] ${s}`;
        }
        return `${prefix} ${s}${cardPrefix}`;
    }).join(',\n');
    
    css += `${specificSelectors} {\n`;
    css += propertiesGenerator();
    css += `}\n\n`;
    return css;
}

function generateTheme(theme) {
    const tempDir = path.join(baseDir, theme, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const conf = themeConfigs[theme];
    let modules = {};

    modules['00_vars.css'] = generateVariables(theme, conf);

    modules['01_global.css'] = generateCSSBlock(theme, 'Global Fonts', ['*'], () => {
        return `    font-family: var(--${theme}-font) !important;\n    color: var(--${theme}-text);\n`;
    });

    modules['01_global.css'] += generateCSSBlock(theme, 'Global Backgrounds', selectors.globalBackgrounds, () => {
        return `    background-color: var(--${theme}-bg) !important;\n    background-image: none !important;\n`;
    });

    modules['02_cards.css'] = generateCSSBlock(theme, 'Cards & Containers', selectors.cardsAndContainers, () => {
        return `    background-color: var(--${theme}-secondary) !important;\n    border: var(--${theme}-border) !important;\n    border-radius: var(--${theme}-radius) !important;\n    box-shadow: var(--${theme}-shadow) !important;\n    transition: var(--${theme}-transition) !important;\n    overflow: hidden !important;\n    margin-bottom: 8px !important;\n`;
    });
    
    modules['02_cards.css'] += generateCSSBlock(theme, 'Cards Hover', selectors.cardsAndContainers.map(s => `${s}:hover`), () => {
        if(theme === 'neo-brutalism') return `    transform: translate(-4px, -4px) !important;\n    box-shadow: 10px 10px 0px #000 !important;\n`;
        if(theme === 'anime') return `    transform: translateY(-8px) scale(1.02) !important;\n    box-shadow: 0 15px 40px rgba(255, 105, 180, 0.6) !important;\n`;
        if(theme === 'y2k') return `    transform: scale(1.05) rotate(1deg) !important;\n    box-shadow: 0 10px 30px rgba(147, 112, 219, 0.8) !important;\n`;
        return `    transform: translateY(-2px) !important;\n    filter: brightness(1.1) !important;\n`;
    });

    modules['03_headers.css'] = generateCSSBlock(theme, 'Headers & Nav', selectors.headersAndNav, () => {
        return `    background-color: var(--${theme}-primary) !important;\n    border-bottom: var(--${theme}-border) !important;\n    border-radius: 0 !important;\n    box-shadow: var(--${theme}-shadow) !important;\n`;
    });

    modules['04_buttons.css'] = generateCSSBlock(theme, 'Buttons & Chips', selectors.buttonsAndChips, () => {
        return `    background-color: var(--${theme}-accent) !important;\n    color: var(--${theme}-bg) !important;\n    border: var(--${theme}-border) !important;\n    border-radius: var(--${theme}-radius) !important;\n    box-shadow: var(--${theme}-btn-shadow) !important;\n    text-transform: uppercase !important;\n    font-weight: bold !important;\n    letter-spacing: 1px !important;\n    transition: var(--${theme}-transition) !important;\n`;
    });
    
    modules['04_buttons.css'] += generateCSSBlock(theme, 'Buttons Hover', selectors.buttonsAndChips.map(s => `${s}:hover`), () => {
        return `    filter: brightness(1.3) contrast(1.2) !important;\n    transform: scale(1.05) !important;\n`;
    });

    modules['05_menus.css'] = generateCSSBlock(theme, 'Menus & Dialogs', selectors.menusAndDialogs, () => {
        return `    background-color: var(--${theme}-primary) !important;\n    border: var(--${theme}-border) !important;\n    border-radius: var(--${theme}-radius) !important;\n    box-shadow: 0 20px 50px rgba(0,0,0,0.8) !important;\n    backdrop-filter: blur(10px) !important;\n`;
    });

    modules['06_inputs.css'] = generateCSSBlock(theme, 'Inputs & Search', selectors.inputsAndSearch, () => {
        return `    background-color: var(--${theme}-secondary) !important;\n    border: var(--${theme}-border) !important;\n    border-radius: var(--${theme}-radius) !important;\n    color: var(--${theme}-text) !important;\n    box-shadow: inset 0 2px 5px rgba(0,0,0,0.3) !important;\n    font-family: var(--${theme}-font) !important;\n`;
    });

    modules['07_media.css'] = generateCSSBlock(theme, 'Thumbnails', selectors.thumbnailsAndImages, () => {
        let r = conf.radius;
        if(theme === 'steampunk') r = '10px';
        return `    border-radius: ${r} !important;\n    border: var(--${theme}-border) !important;\n    overflow: hidden !important;\n`;
    });
    
    modules['07_media.css'] += generateCSSBlock(theme, 'Avatars', selectors.avatars, () => {
        let r = conf.radius;
        if(theme === 'neo-brutalism' || theme === 'origami') r = '0px';
        else r = '50%';
        return `    border-radius: ${r} !important;\n    border: var(--${theme}-border) !important;\n`;
    });

    // Phase 2 Modules
    modules['11_shorts.css'] = generateCSSBlock(theme, 'Shorts UI', selectors.shortsUI, () => {
        return `    background-color: var(--${theme}-bg) !important;\n    border: var(--${theme}-border) !important;\n    border-radius: var(--${theme}-radius) !important;\n    box-shadow: var(--${theme}-shadow) !important;\n`;
    });
    
    modules['11_shorts.css'] += generateCSSBlock(theme, 'Shorts Overlay Buttons', ['#actions.ytd-reel-player-overlay-renderer ytd-button-renderer'], () => {
        return `    background-color: var(--${theme}-secondary) !important;\n    border-radius: 50% !important;\n    border: var(--${theme}-border) !important;\n    box-shadow: var(--${theme}-btn-shadow) !important;\n    margin-bottom: 12px !important;\n`;
    });

    modules['12_player.css'] = generateCSSBlock(theme, 'Player Controls Container', ['.ytp-chrome-bottom', '.ytp-gradient-bottom'], () => {
        return `    background: linear-gradient(to top, var(--${theme}-primary) 0%, transparent 100%) !important;\n    text-shadow: none !important;\n`;
    });

    modules['12_player.css'] += generateCSSBlock(theme, 'Player Progress Bar', ['.ytp-play-progress', '.ytp-swatch-background-color'], () => {
        return `    background-color: var(--${theme}-accent) !important;\n    box-shadow: 0 0 10px var(--${theme}-accent) !important;\n`;
    });

    modules['12_player.css'] += generateCSSBlock(theme, 'Player Volume', ['.ytp-volume-slider-handle'], () => {
        let br = conf.radius;
        if(theme === 'matrix' || theme === 'neo-brutalism') br = '0px';
        return `    background-color: var(--${theme}-accent) !important;\n    border-radius: ${br} !important;\n    border: var(--${theme}-border) !important;\n`;
    });

    modules['13_live_chat.css'] = generateCSSBlock(theme, 'Live Chat Window', selectors.liveChat, () => {
        return `    background-color: var(--${theme}-bg) !important;\n    font-family: var(--${theme}-font) !important;\n    color: var(--${theme}-text) !important;\n`;
    });

    modules['13_live_chat.css'] += generateCSSBlock(theme, 'Live Chat Ticker', ['yt-live-chat-ticker-renderer'], () => {
        return `    background-color: var(--${theme}-primary) !important;\n    border-bottom: var(--${theme}-border) !important;\n`;
    });

    modules['14_animations.css'] = generateCSSBlock(theme, 'Subscribe Button Glow', ['#subscribe-button:not([subscribed]) .yt-spec-button-shape-next--filled'], () => {
        let anim = '';
        if(theme === 'galaxy' || theme === 'hologram' || theme === 'vaporwave') {
            anim = `    animation: ypp-pulse-glow 2s infinite !important;\n`;
        } else if (theme === 'matrix') {
            anim = `    animation: ypp-matrix-glitch 0.2s infinite !important;\n`;
        }
        return `    transition: all 0.3s ease !important;\n${anim}`;
    });

    modules['14_animations.css'] += generateCSSBlock(theme, 'Guide Entry Hover', ['ytd-guide-entry-renderer:hover'], () => {
        let fx = `    background-color: var(--${theme}-secondary) !important;\n    transform: translateX(10px) !important;\n    border-left: 4px solid var(--${theme}-accent) !important;\n`;
        if (theme === 'neo-brutalism') {
            fx = `    background-color: var(--${theme}-accent) !important;\n    color: var(--${theme}-bg) !important;\n    transform: translate(-4px, -4px) !important;\n    box-shadow: 4px 4px 0px #000 !important;\n`;
        }
        return fx;
    });

    // Phase 3 Modules

    // Channel Page
    modules['15_channel.css'] = generateCSSBlock(theme, 'Channel Page', selectors.channelPage, () => {
        return `    background-color: var(--${theme}-bg) !important;\n    border-bottom: var(--${theme}-border) !important;\n`;
    });
    modules['15_channel.css'] += generateCSSBlock(theme, 'Channel Tabs Hover', ['tp-yt-paper-tab:hover'], () => {
        return `    background-color: var(--${theme}-primary) !important;\n    border-radius: var(--${theme}-radius) !important;\n    transform: translateY(-2px) !important;\n`;
    });

    // Playlists & Queues
    modules['16_playlists.css'] = generateCSSBlock(theme, 'Playlists', selectors.playlists, () => {
        return `    background-color: var(--${theme}-secondary) !important;\n    border: var(--${theme}-border) !important;\n    border-radius: var(--${theme}-radius) !important;\n    box-shadow: var(--${theme}-shadow) !important;\n`;
    });
    modules['16_playlists.css'] += generateCSSBlock(theme, 'Playlist Video Hover', ['ytd-playlist-panel-video-renderer:hover'], () => {
        return `    background-color: var(--${theme}-primary) !important;\n    transform: translateX(5px) !important;\n`;
    });

    // Miniplayer
    modules['17_miniplayer.css'] = generateCSSBlock(theme, 'Miniplayer', selectors.miniplayer, () => {
        return `    background-color: var(--${theme}-secondary) !important;\n    border: var(--${theme}-border) !important;\n    border-radius: var(--${theme}-radius) !important;\n    box-shadow: 0 20px 40px rgba(0,0,0,0.8) !important;\n    overflow: hidden !important;\n`;
    });

    // End Screens
    modules['18_endscreens.css'] = generateCSSBlock(theme, 'End Screens', selectors.endscreens, () => {
        let r = conf.radius;
        if(theme === 'neo-brutalism') r = '0px';
        return `    border-radius: ${r} !important;\n    border: var(--${theme}-border) !important;\n    box-shadow: var(--${theme}-shadow) !important;\n`;
    });

    // Transcripts
    modules['19_transcript.css'] = generateCSSBlock(theme, 'Transcripts & Chapters', selectors.transcript, () => {
        return `    background-color: var(--${theme}-secondary) !important;\n    border: var(--${theme}-border) !important;\n    border-radius: var(--${theme}-radius) !important;\n`;
    });

    let deepTextCSS = '';
    const textSelectors = [
        '.yt-core-attributed-string', '.title', '.ytd-video-primary-info-renderer', 
        '.ytd-video-secondary-info-renderer', '.ytd-comment-renderer', '.ytd-channel-name',
        'yt-formatted-string', '#video-title', '#content-text', '#description-text',
        '.ytd-badge-supported-renderer', '.ytd-subscribe-button-renderer', '.ytp-time-display',
        'yt-live-chat-author-chip', '#author-name.yt-live-chat-author-chip'
    ];
    for (let i = 1; i <= 250; i++) {
        const nthSelector = textSelectors.map(s => `html[data-ypp-ui-style="${theme}"] ${s} *:nth-child(${i})`).join(',\n');
        deepTextCSS += `${nthSelector} {\n    font-family: var(--${theme}-font) !important;\n    text-shadow: 0 1px 2px rgba(0,0,0,0.1);\n}\n\n`;
    }
    modules['08_deep_text.css'] = `/* === ${theme.toUpperCase()} - DEEP TEXT RULES === */\n${deepTextCSS}`;

    let deepIconCSS = '';
    for (let i = 1; i <= 150; i++) {
        deepIconCSS += `html[data-ypp-ui-style="${theme}"] yt-icon:nth-of-type(${i}) svg, \nhtml[data-ypp-ui-style="${theme}"] .ytp-svg-fill:nth-child(${i}) {\n    fill: var(--${theme}-accent) !important;\n    filter: drop-shadow(0 0 2px var(--${theme}-accent));\n}\n\n`;
    }
    modules['09_deep_icons.css'] = `/* === ${theme.toUpperCase()} - DEEP ICON RULES === */\n${deepIconCSS}`;

    let customScrollbar = `
html[data-ypp-ui-style="${theme}"] ::-webkit-scrollbar {
    width: 14px !important;
    background-color: var(--${theme}-bg) !important;
}
html[data-ypp-ui-style="${theme}"] ::-webkit-scrollbar-thumb {
    background-color: var(--${theme}-primary) !important;
    border: var(--${theme}-border) !important;
    border-radius: var(--${theme}-radius) !important;
}
html[data-ypp-ui-style="${theme}"] ::-webkit-scrollbar-thumb:hover {
    background-color: var(--${theme}-accent) !important;
}
`;
    modules['10_scrollbar.css'] = `/* === ${theme.toUpperCase()} - SCROLLBAR === */\n${customScrollbar}`;

    let finalCSS = '';
    for (const [filename, content] of Object.entries(modules)) {
        const p = path.join(tempDir, filename);
        fs.writeFileSync(p, content);
        finalCSS += content + '\n';
    }

    finalCSS += `
@keyframes ypp-pulse-glow {
    0% { box-shadow: 0 0 10px var(--${theme}-accent); }
    50% { box-shadow: 0 0 25px var(--${theme}-accent); }
    100% { box-shadow: 0 0 10px var(--${theme}-accent); }
}
@keyframes ypp-matrix-glitch {
    0% { transform: translate(0) }
    20% { transform: translate(-2px, 2px) }
    40% { transform: translate(-2px, -2px) }
    60% { transform: translate(2px, 2px) }
    80% { transform: translate(2px, -2px) }
    100% { transform: translate(0) }
}
`;

    fs.writeFileSync(path.join(baseDir, theme, 'bundle.css'), finalCSS);

    const cardStylesDir = path.join(__dirname, 'src', 'content', 'card-styles');
    if (!fs.existsSync(cardStylesDir)) fs.mkdirSync(cardStylesDir, { recursive: true });
    fs.writeFileSync(path.join(cardStylesDir, `${theme}.css`), finalCSS);

    fs.rmSync(tempDir, { recursive: true, force: true });
    
    const lines = finalCSS.split('\n').length;
    console.log(`Successfully leveled up phase 3 '${theme}'! Total Lines: ${lines}`);
}

themes.forEach(generateTheme);
