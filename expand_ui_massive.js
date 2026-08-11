const fs = require('fs');
const path = require('path');

const stylesDir = 'src/content/ui-styles';
const targets = fs.readdirSync(stylesDir).filter(name => {
    return fs.statSync(path.join(stylesDir, name)).isDirectory() && !['shared', 'vintage', 'retro'].includes(name);
});

// Huge array of configurations for each theme
const themeConfigs = {
    "polaroid": {
        font: '"Indie Flower", "Caveat", "Comic Sans MS", cursive',
        radius: '2px',
        border: '12px solid #fff',
        shadow: '0 10px 20px rgba(0,0,0,0.15)',
        cardBg: '#fff',
        hoverTransform: 'scale(1.02) rotate(2deg)',
        avatarClip: 'none',
        thumbnailPadding: '10px 10px 40px 10px',
        thumbnailBg: '#fff'
    },
    "hologram": {
        font: '"Orbitron", "Rajdhani", sans-serif',
        radius: '16px',
        border: '1px solid rgba(0, 255, 255, 0.5)',
        shadow: '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(255, 0, 255, 0.2)',
        cardBg: 'rgba(255,255,255,0.05)',
        hoverTransform: 'scale(1.05) translateY(-5px)',
        avatarClip: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        thumbnailPadding: '0',
        thumbnailBg: 'transparent'
    },
    "kawaii": {
        font: '"Quicksand", "Nunito", "Varela Round", sans-serif',
        radius: '30px',
        border: '4px solid #ffb6c1',
        shadow: '0 8px 0 #ff69b4',
        cardBg: '#fff0f5',
        hoverTransform: 'translateY(-8px)',
        avatarClip: 'circle(50% at 50% 50%)',
        thumbnailPadding: '8px',
        thumbnailBg: '#fff'
    },
    "fluent": {
        font: '"Segoe UI Variable", "Segoe UI", sans-serif',
        radius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        shadow: '0 8px 32px rgba(0,0,0,0.1)',
        cardBg: 'rgba(255,255,255,0.6)',
        hoverTransform: 'scale(1.01)',
        avatarClip: 'circle(50% at 50% 50%)',
        thumbnailPadding: '0',
        thumbnailBg: 'transparent'
    },
    "crystal-glass": {
        font: '"Inter", "SF Pro Display", sans-serif',
        radius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        cardBg: 'rgba(255, 255, 255, 0.1)',
        hoverTransform: 'translateY(-4px)',
        avatarClip: 'circle(50% at 50% 50%)',
        thumbnailPadding: '0',
        thumbnailBg: 'transparent'
    },
    "cyberpunk": {
        font: '"Oxanium", "Share Tech Mono", monospace',
        radius: '0px',
        border: '2px solid #fcee0a',
        shadow: '4px 4px 0 #00ff00, -4px -4px 0 #ff003c',
        cardBg: 'rgba(20,20,20,0.9)',
        hoverTransform: 'translate(4px, 4px)',
        avatarClip: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)',
        thumbnailPadding: '0',
        thumbnailBg: 'transparent'
    },
    "material": {
        font: '"Roboto", "Product Sans", sans-serif',
        radius: '16px',
        border: 'none',
        shadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        cardBg: 'var(--yt-spec-raised-background)',
        hoverTransform: 'translateY(-2px)',
        avatarClip: 'circle(50% at 50% 50%)',
        thumbnailPadding: '0',
        thumbnailBg: 'transparent'
    },
    "brutalism": {
        font: '"Space Grotesk", "Courier New", monospace',
        radius: '0px',
        border: '4px solid #000',
        shadow: '8px 8px 0 #000',
        cardBg: '#fff',
        hoverTransform: 'translate(-4px, -4px)',
        avatarClip: 'none',
        thumbnailPadding: '0',
        thumbnailBg: 'transparent'
    },
    "neumorphic": {
        font: '"Nunito Sans", sans-serif',
        radius: '20px',
        border: 'none',
        shadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        cardBg: '#e0e5ec',
        hoverTransform: 'scale(1.02)',
        avatarClip: 'circle(50% at 50% 50%)',
        thumbnailPadding: '10px',
        thumbnailBg: 'transparent'
    },
    "default": {
        font: 'inherit',
        radius: '12px',
        border: '1px solid rgba(128,128,128,0.2)',
        shadow: '0 4px 12px rgba(0,0,0,0.05)',
        cardBg: 'var(--yt-spec-raised-background)',
        hoverTransform: 'scale(1.02)',
        avatarClip: 'circle(50% at 50% 50%)',
        thumbnailPadding: '0',
        thumbnailBg: 'transparent'
    }
};

function getConfig(themeName) {
    if (themeConfigs[themeName]) return themeConfigs[themeName];
    for (const key in themeConfigs) {
        if (themeName.includes(key)) return themeConfigs[key];
    }
    return themeConfigs["default"];
}

function generateMassiveCSS(themeName, config) {
    const attr = 'data-ypp-card-style="' + themeName + '"';
    const uiAttr = 'data-ypp-ui-style="' + themeName + '"';
    
    let extraBackdrop = '';
    if (themeName === 'fluent' || themeName === 'crystal-glass' || themeName === 'glassmorphism') {
        extraBackdrop = 'backdrop-filter: blur(20px) saturate(150%) !important; -webkit-backdrop-filter: blur(20px) !important;';
    }
    if (themeName === 'hologram' || themeName === 'holographic') {
        extraBackdrop = 'backdrop-filter: blur(5px) hue-rotate(90deg) !important;';
    }

    const css = [
        "/* ========================================================================== */",
        "/* MASSIVE UI EXPANSION FOR: " + themeName + " */",
        "/* ========================================================================== */",
        "",
        "/* 1. Global Typography */",
        "html[" + attr + "], html[" + uiAttr + "] {",
        "    --ypp-global-font: " + config.font + ";",
        "    --ypp-global-radius: " + config.radius + ";",
        "    --ypp-global-border: " + config.border + ";",
        "    --ypp-global-shadow: " + config.shadow + ";",
        "}",
        "",
        "html[" + attr + "] *, html[" + uiAttr + "] * {",
        "    font-family: var(--ypp-global-font) !important;",
        "}",
        "",
        "/* 2. Titles and Headers */",
        "html[" + attr + "] h1, html[" + attr + "] h2, html[" + attr + "] h3, ",
        "html[" + attr + "] yt-formatted-string.ytd-video-renderer, ",
        "html[" + attr + "] yt-formatted-string.ytd-rich-grid-media,",
        "html[" + uiAttr + "] h1, html[" + uiAttr + "] h2, html[" + uiAttr + "] h3, ",
        "html[" + uiAttr + "] yt-formatted-string.ytd-video-renderer, ",
        "html[" + uiAttr + "] yt-formatted-string.ytd-rich-grid-media {",
        "    font-weight: 800 !important;",
        "    letter-spacing: " + (themeName === 'brutalism' ? '-1px' : '0.5px') + " !important;",
        "    text-transform: " + (themeName === 'brutalism' ? 'uppercase' : 'none') + " !important;",
        "    line-height: 1.4 !important;",
        "}",
        "",
        "/* 3. Cards & Grid Items */",
        "html[" + attr + "] ytd-rich-item-renderer,",
        "html[" + attr + "] ytd-video-renderer,",
        "html[" + attr + "] ytd-playlist-renderer,",
        "html[" + attr + "] ytd-grid-video-renderer,",
        "html[" + attr + "] ytd-compact-video-renderer,",
        "html[" + uiAttr + "] ytd-rich-item-renderer,",
        "html[" + uiAttr + "] ytd-video-renderer,",
        "html[" + uiAttr + "] ytd-playlist-renderer,",
        "html[" + uiAttr + "] ytd-grid-video-renderer,",
        "html[" + uiAttr + "] ytd-compact-video-renderer {",
        "    background: " + config.cardBg + " !important;",
        "    border: " + config.border + " !important;",
        "    border-radius: " + config.radius + " !important;",
        "    box-shadow: " + config.shadow + " !important;",
        "    padding: 12px !important;",
        "    margin-bottom: 16px !important;",
        "    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;",
        "    " + extraBackdrop,
        "}",
        "",
        "html[" + attr + "] ytd-rich-item-renderer:hover,",
        "html[" + attr + "] ytd-video-renderer:hover,",
        "html[" + uiAttr + "] ytd-rich-item-renderer:hover,",
        "html[" + uiAttr + "] ytd-video-renderer:hover {",
        "    transform: " + config.hoverTransform + " !important;",
        "    z-index: 10 !important;",
        "}",
        "",
        "/* 4. Thumbnails */",
        "html[" + attr + "] ytd-thumbnail, html[" + attr + "] yt-image,",
        "html[" + uiAttr + "] ytd-thumbnail, html[" + uiAttr + "] yt-image {",
        "    background: " + config.thumbnailBg + " !important;",
        "    padding: " + config.thumbnailPadding + " !important;",
        "    border-radius: " + (themeName === 'polaroid' ? '0px' : 'calc(var(--ypp-global-radius) * 0.8)') + " !important;",
        "    transition: transform 0.4s ease, filter 0.4s ease !important;",
        "    overflow: hidden !important;",
        "}",
        "",
        "html[" + attr + "] ytd-thumbnail:hover yt-image,",
        "html[" + uiAttr + "] ytd-thumbnail:hover yt-image {",
        "    transform: scale(1.08) !important;",
        "    filter: contrast(1.1) brightness(1.1) saturate(1.2) !important;",
        "}",
        "",
        "/* 5. Avatars */",
        "html[" + attr + "] yt-img-shadow, html[" + attr + "] .yt-spec-avatar-shape__image,",
        "html[" + uiAttr + "] yt-img-shadow, html[" + uiAttr + "] .yt-spec-avatar-shape__image {",
        "    clip-path: " + config.avatarClip + " !important;",
        "    border-radius: " + (config.avatarClip === 'none' ? '0' : '0') + " !important;",
        (themeName === 'polaroid' ? '    border: 2px solid #000 !important; padding: 2px !important; background: #fff !important;' : ''),
        "    transition: transform 0.3s ease !important;",
        "}",
        "",
        "html[" + attr + "] yt-img-shadow:hover,",
        "html[" + uiAttr + "] yt-img-shadow:hover {",
        "    transform: rotate(10deg) scale(1.1) !important;",
        "}",
        "",
        "/* 6. Masthead (Header) */",
        "html[" + attr + "] ytd-masthead, html[" + uiAttr + "] ytd-masthead {",
        "    border-bottom: " + config.border + " !important;",
        "    box-shadow: " + config.shadow + " !important;",
        "    " + extraBackdrop,
        "}",
        "",
        "/* 7. Search Box */",
        "html[" + attr + "] ytd-searchbox #container.ytd-searchbox,",
        "html[" + uiAttr + "] ytd-searchbox #container.ytd-searchbox {",
        "    border-radius: " + config.radius + " 0 0 " + config.radius + " !important;",
        "    border: " + config.border + " !important;",
        "    box-shadow: inset 0 2px 5px rgba(0,0,0,0.1) !important;",
        "}",
        "",
        "html[" + attr + "] ytd-searchbox #search-icon-legacy,",
        "html[" + uiAttr + "] ytd-searchbox #search-icon-legacy {",
        "    border-radius: 0 " + config.radius + " " + config.radius + " 0 !important;",
        "    border: " + config.border + " !important;",
        "    border-left: none !important;",
        "    transition: all 0.2s ease !important;",
        "}",
        "",
        "html[" + attr + "] ytd-searchbox #search-icon-legacy:hover,",
        "html[" + uiAttr + "] ytd-searchbox #search-icon-legacy:hover {",
        "    background: rgba(128,128,128,0.2) !important;",
        "}",
        "",
        "/* 8. Buttons & Chips */",
        "html[" + attr + "] yt-button-shape button, html[" + attr + "] .yt-spec-button-shape-next,",
        "html[" + uiAttr + "] yt-button-shape button, html[" + uiAttr + "] .yt-spec-button-shape-next {",
        "    border-radius: " + config.radius + " !important;",
        "    border: " + config.border + " !important;",
        "    text-transform: " + (themeName === 'brutalism' ? 'uppercase' : 'none') + " !important;",
        "    font-weight: 700 !important;",
        "    box-shadow: " + config.shadow + " !important;",
        "    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important;",
        "}",
        "",
        "html[" + attr + "] yt-button-shape button:hover,",
        "html[" + uiAttr + "] yt-button-shape button:hover {",
        "    transform: " + (config.hoverTransform === 'scale(1.02)' ? 'scale(1.05)' : 'translateY(-2px)') + " !important;",
        "    filter: brightness(1.2) !important;",
        "}",
        "",
        "/* 9. Chips / Filter bar */",
        "html[" + attr + "] yt-chip-cloud-chip-renderer,",
        "html[" + uiAttr + "] yt-chip-cloud-chip-renderer {",
        "    border-radius: " + config.radius + " !important;",
        "    border: " + config.border + " !important;",
        "    box-shadow: " + (themeName === 'brutalism' ? '2px 2px 0 #000' : '0 2px 5px rgba(0,0,0,0.1)') + " !important;",
        "    transition: transform 0.2s !important;",
        "}",
        "html[" + attr + "] yt-chip-cloud-chip-renderer:hover,",
        "html[" + uiAttr + "] yt-chip-cloud-chip-renderer:hover {",
        "    transform: translateY(-2px) !important;",
        "}",
        "",
        "/* 10. Sidebar / Guide */",
        "html[" + attr + "] ytd-guide-entry-renderer, html[" + attr + "] ytd-mini-guide-entry-renderer,",
        "html[" + uiAttr + "] ytd-guide-entry-renderer, html[" + uiAttr + "] ytd-mini-guide-entry-renderer {",
        "    border-radius: " + config.radius + " !important;",
        "    margin: 4px 8px !important;",
        "    transition: all 0.2s ease !important;",
        "    border: " + (themeName === 'brutalism' ? '2px solid transparent' : 'none') + " !important;",
        "}",
        "",
        "html[" + attr + "] ytd-guide-entry-renderer:hover,",
        "html[" + uiAttr + "] ytd-guide-entry-renderer:hover {",
        "    transform: translateX(5px) !important;",
        "    background: rgba(128, 128, 128, 0.1) !important;",
        (themeName === 'brutalism' ? '    border: 2px solid #000 !important; box-shadow: 4px 4px 0 #000 !important;' : ''),
        "}",
        "",
        "/* 11. Comments */",
        "html[" + attr + "] ytd-comment-thread-renderer,",
        "html[" + uiAttr + "] ytd-comment-thread-renderer {",
        "    background: " + config.cardBg + " !important;",
        "    border: " + config.border + " !important;",
        "    border-radius: " + config.radius + " !important;",
        "    box-shadow: " + config.shadow + " !important;",
        "    padding: 16px !important;",
        "    margin-bottom: 20px !important;",
        "    " + extraBackdrop,
        "}",
        "",
        "/* 12. Player Controls */",
        "html[" + attr + "] .ytp-chrome-bottom,",
        "html[" + uiAttr + "] .ytp-chrome-bottom {",
        "    background: " + config.cardBg + " !important;",
        "    border: " + config.border + " !important;",
        "    border-radius: " + config.radius + " !important;",
        "    padding: 8px !important;",
        "    margin: 16px !important;",
        "    width: calc(100% - 32px) !important;",
        "    box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;",
        "    " + extraBackdrop,
        "}",
        "",
        "html[" + attr + "] .ytp-scrubber-button,",
        "html[" + uiAttr + "] .ytp-scrubber-button {",
        "    border-radius: " + (themeName === 'brutalism' ? '0' : '50%') + " !important;",
        "    border: " + (themeName === 'brutalism' ? '4px solid #000' : '2px solid #fff') + " !important;",
        "    transform: " + (themeName === 'brutalism' ? 'scale(1.5) rotate(45deg)' : 'scale(1.2)') + " !important;",
        "    box-shadow: " + config.shadow + " !important;",
        "}",
        "",
        "html[" + attr + "] .ytp-play-progress, html[" + attr + "] .ytp-load-progress,",
        "html[" + uiAttr + "] .ytp-play-progress, html[" + uiAttr + "] .ytp-load-progress {",
        "    border-radius: " + config.radius + " !important;",
        "}",
        "",
        "/* 13. Dialogs / Menus */",
        "html[" + attr + "] tp-yt-paper-dialog, html[" + attr + "] ytd-menu-popup-renderer,",
        "html[" + uiAttr + "] tp-yt-paper-dialog, html[" + uiAttr + "] ytd-menu-popup-renderer {",
        "    border-radius: " + config.radius + " !important;",
        "    border: " + config.border + " !important;",
        "    box-shadow: 0 30px 60px rgba(0,0,0,0.4) !important;",
        "    " + extraBackdrop,
        "}",
        "",
        "/* 14. Channel Header */",
        "html[" + attr + "] ytd-c4-tabbed-header-renderer,",
        "html[" + uiAttr + "] ytd-c4-tabbed-header-renderer {",
        "    border-bottom: " + config.border + " !important;",
        "    box-shadow: " + config.shadow + " !important;",
        "}",
        "",
        "html[" + attr + "] #channel-header,",
        "html[" + uiAttr + "] #channel-header {",
        "    background: " + config.cardBg + " !important;",
        "    border-radius: " + config.radius + " !important;",
        "    margin: 16px !important;",
        "    padding: 24px !important;",
        "    border: " + config.border + " !important;",
        "    " + extraBackdrop,
        "}",
        "",
        "/* 15. Subscribe Button Specialized */",
        "html[" + attr + "] ytd-subscribe-button-renderer yt-button-shape button,",
        "html[" + uiAttr + "] ytd-subscribe-button-renderer yt-button-shape button {",
        (themeName === 'polaroid' ? '    background: #000 !important; color: #fff !important; border: 2px solid #000 !important;' : ''),
        (themeName === 'kawaii' ? '    background: #ff69b4 !important; color: #fff !important; border: 4px solid #ffb6c1 !important; border-radius: 30px !important;' : ''),
        (themeName === 'cyberpunk' ? '    background: #fcee0a !important; color: #000 !important; border: 2px solid #000 !important; border-radius: 0 !important; box-shadow: 4px 4px 0 #00ff00 !important;' : ''),
        "    font-size: 1.1em !important;",
        "    padding: 10px 24px !important;",
        "}",
        "",
        "/* 16. Live Chat */",
        "html[" + attr + "] yt-live-chat-renderer,",
        "html[" + uiAttr + "] yt-live-chat-renderer {",
        "    border-radius: " + config.radius + " !important;",
        "    border: " + config.border + " !important;",
        "    box-shadow: " + config.shadow + " !important;",
        "    overflow: hidden !important;",
        "}",
        "",
        "html[" + attr + "] yt-live-chat-text-message-renderer,",
        "html[" + uiAttr + "] yt-live-chat-text-message-renderer {",
        "    border-radius: " + config.radius + " !important;",
        "    margin: 4px 8px !important;",
        "    padding: 8px 12px !important;",
        "    background: rgba(128,128,128,0.05) !important;",
        "    transition: background 0.2s !important;",
        "}",
        "html[" + attr + "] yt-live-chat-text-message-renderer:hover,",
        "html[" + uiAttr + "] yt-live-chat-text-message-renderer:hover {",
        "    background: rgba(128,128,128,0.1) !important;",
        "}",
        "",
        "/* 17. Tooltips */",
        "html[" + attr + "] tp-yt-paper-tooltip,",
        "html[" + uiAttr + "] tp-yt-paper-tooltip {",
        "    border-radius: " + config.radius + " !important;",
        "    border: " + config.border + " !important;",
        "    font-weight: 700 !important;",
        "    box-shadow: " + config.shadow + " !important;",
        "    padding: 10px 14px !important;",
        "    font-size: 14px !important;",
        "}",
        "",
        "/* 18. Badges */",
        "html[" + attr + "] ytd-badge-supported-renderer,",
        "html[" + uiAttr + "] ytd-badge-supported-renderer {",
        "    border-radius: " + config.radius + " !important;",
        "    border: " + config.border + " !important;",
        "    padding: 2px 6px !important;",
        "}"
    ];

    return css.join("\\n");
}

let count = 0;
for (const theme of targets) {
    const themeDir = path.join(stylesDir, theme);
    if (!fs.existsSync(themeDir)) continue;

    const componentsDir = path.join(themeDir, 'components');
    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
    }

    const config = getConfig(theme);
    const massiveCss = generateMassiveCSS(theme, config);
    
    const compFile = path.join(componentsDir, 'massive_ui.css');
    fs.writeFileSync(compFile, massiveCss);

    const indexFile = path.join(themeDir, 'index.css');
    if (fs.existsSync(indexFile)) {
        let indexContent = fs.readFileSync(indexFile, 'utf8');
        if (!indexContent.includes('massive_ui.css')) {
            indexContent += "\\n@import './components/massive_ui.css';\\n";
            fs.writeFileSync(indexFile, indexContent);
        }
    } else {
        fs.writeFileSync(indexFile, "@import './components/massive_ui.css';\\n");
    }
    
    count++;
}

console.log("Successfully generated massive UI styles for " + count + " themes.");
