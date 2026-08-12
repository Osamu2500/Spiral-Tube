const fs = require('fs');
const path = require('path');

const uiStylesDir = path.join(__dirname, '..', 'src', 'content', 'ui-styles');

function buildCSS(themeName, rules) {
    const prefix = `html[data-ypp-ui-style="${themeName}"]`;
    let cssString = `\n/* Navbar Overhaul for ${themeName} */\n`;
    for (const [target, cssText] of Object.entries(rules)) {
        const scopedSelector = target.split(',').map(s => `${prefix} ${s.trim()}`).join(`,\n`);
        cssString += `${scopedSelector} {\n${cssText}\n}\n`;
    }
    return cssString;
}

const themeConfigs = {
    'anime': {
        '#masthead-container, ytd-masthead': `background: linear-gradient(90deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%) !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 4px 15px rgba(255, 117, 140, 0.3) !important;`,
        'ytd-topbar-logo-renderer': `filter: drop-shadow(2px 2px 0px #fff) !important; transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;`,
        'ytd-topbar-logo-renderer:hover': `transform: scale(1.1) rotate(-3deg) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 50px !important; border: 2px solid #ff758c !important; background: rgba(255, 255, 255, 0.9) !important; box-shadow: inset 0 2px 5px rgba(0,0,0,0.05) !important; padding: 0 10px !important;`,
        '#search-input input': `font-family: 'Comic Sans MS', cursive, sans-serif !important; color: #ff758c !important; font-weight: bold !important; font-size: 16px !important;`,
        '#search-icon-legacy': `background: #ff758c !important; border-radius: 0 50px 50px 0 !important; border: none !important; width: 60px !important;`,
        '#search-icon-legacy yt-icon': `color: white !important;`,
        '#voice-search-button': `background: #ff758c !important; border-radius: 50% !important; border: 2px solid #fff !important; box-shadow: 0 2px 10px rgba(255,117,140,0.4) !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 20px !important; border: 2px solid #ff758c !important; background: #fffafb !important; box-shadow: 0 10px 25px rgba(255,117,140,0.3) !important; overflow: hidden !important;`,
        '.sbsb_c:hover': `background: #ffecf0 !important; font-weight: bold !important; color: #ff758c !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `background: rgba(255,255,255,0.5) !important; border-radius: 50% !important; border: 2px solid transparent !important; transition: all 0.2s !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `border: 2px solid #ff758c !important; background: #fff !important; transform: translateY(-3px) !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 50% !important; border: 3px solid #ff758c !important; padding: 2px !important; background: #fff !important; transition: transform 0.3s !important;`,
        '#avatar-btn yt-img-shadow:hover': `transform: rotate(360deg) scale(1.1) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer, tp-yt-iron-dropdown ytd-account-settings-menu-renderer': `border-radius: 20px !important; border: 2px solid #ff758c !important; background: #fffafb !important; box-shadow: 0 10px 25px rgba(255,117,140,0.3) !important;`
    },
    'galaxy': {
        '#masthead-container, ytd-masthead': `background: url('https://www.transparenttextures.com/patterns/stardust.png'), linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%) !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 0 20px rgba(138, 43, 226, 0.5) !important;`,
        'ytd-topbar-logo-renderer': `filter: drop-shadow(0 0 8px rgba(138,43,226,0.8)) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 30px !important; border: 1px solid rgba(255,255,255,0.2) !important; background: rgba(0, 0, 0, 0.4) !important; box-shadow: 0 0 15px rgba(138, 43, 226, 0.3) !important;`,
        '#search-input input': `color: #e0e0e0 !important; font-family: 'Space Mono', monospace, sans-serif !important; text-shadow: 0 0 5px rgba(255,255,255,0.3) !important;`,
        '#search-icon-legacy': `background: rgba(138, 43, 226, 0.3) !important; border-radius: 0 30px 30px 0 !important; border-left: 1px solid rgba(255,255,255,0.1) !important; transition: all 0.3s !important;`,
        '#search-icon-legacy:hover': `background: rgba(138, 43, 226, 0.6) !important; box-shadow: 0 0 15px rgba(138,43,226,0.8) !important;`,
        '#voice-search-button': `background: rgba(0,0,0,0.5) !important; border-radius: 50% !important; border: 1px solid rgba(138,43,226,0.5) !important; box-shadow: inset 0 0 10px rgba(138,43,226,0.5) !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 16px !important; border: 1px solid rgba(138,43,226,0.5) !important; background: rgba(15,32,39,0.95) !important; box-shadow: 0 0 30px rgba(138,43,226,0.4) !important; backdrop-filter: blur(10px) !important;`,
        '.sbsb_c:hover': `background: rgba(138,43,226,0.3) !important; text-shadow: 0 0 5px #fff !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `border-radius: 50% !important; background: transparent !important; transition: all 0.3s !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `background: rgba(138,43,226,0.3) !important; box-shadow: 0 0 15px rgba(138,43,226,0.5) !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 50% !important; border: 2px solid rgba(138,43,226,0.8) !important; box-shadow: 0 0 15px rgba(138,43,226,0.5) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 16px !important; border: 1px solid rgba(138,43,226,0.5) !important; background: rgba(15,32,39,0.95) !important; box-shadow: 0 0 30px rgba(138,43,226,0.4) !important; backdrop-filter: blur(10px) !important;`
    },
    'gothic': {
        '#masthead-container, ytd-masthead': `background: #1a1a1a !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 4px 10px rgba(0,0,0,0.8) !important;`,
        'ytd-topbar-logo-renderer': `filter: sepia(1) hue-rotate(300deg) saturate(3) drop-shadow(2px 2px 0px #000) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 0 !important; border: 2px solid #4a0404 !important; background: #000 !important;`,
        '#search-input input': `font-family: 'Playfair Display', serif !important; color: #b30000 !important; text-align: center !important; font-style: italic !important;`,
        '#search-icon-legacy': `background: #2a0000 !important; border-radius: 0 !important; border: 2px solid #4a0404 !important; border-left: none !important; transition: background 0.2s !important;`,
        '#search-icon-legacy:hover': `background: #4a0404 !important;`,
        '#search-icon-legacy yt-icon': `color: #b30000 !important;`,
        '#voice-search-button': `background: #000 !important; border-radius: 0 !important; border: 1px solid #4a0404 !important; color: #b30000 !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 0 !important; border: 4px double #800000 !important; background: #1a1a1a !important; box-shadow: 0 10px 30px rgba(0,0,0,0.9) !important;`,
        '.sbsb_c': `font-family: 'Playfair Display', serif !important; color: #a0a0a0 !important;`,
        '.sbsb_c:hover': `background: #2a0000 !important; color: #ff3333 !important; font-style: italic !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `border-radius: 0 !important; border: 1px solid transparent !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `border: 1px solid #800000 !important; background: #2a0000 !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 0 !important; border: 2px solid #800000 !important; filter: grayscale(100%) contrast(1.5) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 0 !important; border: 4px double #800000 !important; background: #1a1a1a !important; box-shadow: 0 10px 30px rgba(0,0,0,0.9) !important;`
    },
    'grunge': {
        '#masthead-container, ytd-masthead': `background: url('https://www.transparenttextures.com/patterns/concrete-wall.png'), #333 !important; border: none !important; border-bottom: none !important; border-top: none !important;`,
        'ytd-topbar-logo-renderer': `filter: grayscale(80%) contrast(150%) !important; transform: rotate(-2deg) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 2px 8px 3px 5px !important; border: 2px solid #000 !important; background: #222 !important; box-shadow: 3px 3px 0 #000 !important;`,
        '#search-input input': `font-family: 'Courier New', monospace !important; color: #fff !important; text-transform: uppercase !important;`,
        '#search-icon-legacy': `background: #444 !important; border-radius: 0 5px 2px 0 !important; border: 2px solid #000 !important; border-left: none !important;`,
        '#voice-search-button': `background: #222 !important; border-radius: 40% 60% 70% 30% !important; border: 2px dashed #000 !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 2px 8px 3px 5px !important; border: 3px solid #000 !important; background: #222 !important; box-shadow: 6px 6px 0 #000 !important;`,
        '.sbsb_c:hover': `background: #444 !important; text-decoration: line-through !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `background: #000 !important; color: #fff !important; transform: rotate(5deg) scale(1.1) !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 10% !important; border: 2px solid #000 !important; filter: sepia(0.5) contrast(1.2) !important; transform: rotate(3deg) !important;`
    },
    'hologram': {
        '#masthead-container, ytd-masthead': `background: rgba(255, 255, 255, 0.05) !important; border: none !important; border-bottom: none !important; border-top: none !important; backdrop-filter: blur(15px) !important; box-shadow: 0 4px 30px rgba(0, 255, 255, 0.1) !important;`,
        'ytd-topbar-logo-renderer': `filter: drop-shadow(0 0 5px rgba(0,255,255,0.8)) hue-rotate(180deg) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 8px !important; border: 1px solid rgba(0, 255, 255, 0.4) !important; background: rgba(0, 255, 255, 0.05) !important; box-shadow: inset 0 0 10px rgba(0,255,255,0.2), 0 0 10px rgba(0,255,255,0.2) !important; backdrop-filter: blur(5px) !important;`,
        '#search-input input': `font-family: 'Inter', sans-serif !important; color: #00ffff !important; text-shadow: 0 0 3px #00ffff !important; letter-spacing: 1px !important;`,
        '#search-icon-legacy': `background: rgba(0,255,255,0.1) !important; border-radius: 0 8px 8px 0 !important; border-left: 1px solid rgba(0,255,255,0.4) !important;`,
        '#search-icon-legacy yt-icon': `color: #00ffff !important; filter: drop-shadow(0 0 2px #00ffff) !important;`,
        '#voice-search-button': `background: rgba(0,255,255,0.05) !important; border-radius: 50% !important; border: 1px solid rgba(0,255,255,0.4) !important; color: #00ffff !important; box-shadow: 0 0 10px rgba(0,255,255,0.2) !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 12px !important; border: 1px solid rgba(0, 255, 255, 0.4) !important; background: rgba(10, 10, 15, 0.8) !important; backdrop-filter: blur(20px) !important; box-shadow: 0 10px 40px rgba(0,255,255,0.2) !important;`,
        '.sbsb_c': `color: #00ffff !important;`,
        '.sbsb_c:hover': `background: rgba(0,255,255,0.2) !important; box-shadow: inset 0 0 10px rgba(0,255,255,0.5) !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `color: #00ffff !important; filter: drop-shadow(0 0 2px #00ffff) !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `background: rgba(0,255,255,0.2) !important; border-radius: 50% !important; box-shadow: 0 0 15px rgba(0,255,255,0.4) !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 50% !important; border: 2px solid #00ffff !important; box-shadow: 0 0 15px #00ffff !important; opacity: 0.8 !important;`,
        '#avatar-btn yt-img-shadow:hover': `opacity: 1 !important; filter: brightness(1.2) !important;`
    },
    'matrix': {
        '#masthead-container, ytd-masthead': `background: #000 !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 0 15px #0f0 !important;`,
        'ytd-topbar-logo-renderer': `filter: grayscale(1) sepia(1) hue-rotate(70deg) saturate(5) drop-shadow(0 0 5px #0f0) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 0 !important; border: 1px solid #0f0 !important; background: #001100 !important;`,
        '#search-input input': `font-family: 'Courier New', Courier, monospace !important; color: #0f0 !important; text-shadow: 0 0 2px #0f0 !important;`,
        '#search-icon-legacy': `background: #002200 !important; border-radius: 0 !important; border-left: 1px solid #0f0 !important;`,
        '#search-icon-legacy yt-icon': `color: #0f0 !important;`,
        '#voice-search-button': `background: #001100 !important; border-radius: 0 !important; border: 1px solid #0f0 !important; color: #0f0 !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 0 !important; border: 1px solid #0f0 !important; background: #000 !important; box-shadow: 0 5px 20px rgba(0,255,0,0.4) !important;`,
        '.sbsb_c': `font-family: 'Courier New', Courier, monospace !important; color: #0a0 !important;`,
        '.sbsb_c:hover': `background: #003300 !important; color: #0f0 !important; text-shadow: 0 0 4px #0f0 !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `border-radius: 0 !important; color: #0f0 !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `background: #003300 !important; box-shadow: 0 0 10px #0f0 !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 0 !important; border: 2px solid #0f0 !important; filter: grayscale(1) sepia(1) hue-rotate(70deg) saturate(3) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 0 !important; border: 1px solid #0f0 !important; background: #000 !important; font-family: 'Courier New', Courier, monospace !important;`
    },
    'nature': {
        '#masthead-container, ytd-masthead': `background: linear-gradient(135deg, #1b5e20 0%, #388e3c 100%) !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 4px 15px rgba(27, 94, 32, 0.4) !important;`,
        'ytd-topbar-logo-renderer': `filter: sepia(0.6) hue-rotate(80deg) saturate(1.5) drop-shadow(1px 1px 2px #000) !important; transition: transform 0.4s ease-in-out !important;`,
        'ytd-topbar-logo-renderer:hover': `transform: scale(1.05) rotate(2deg) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 4px 24px 4px 24px !important; border: 2px solid #81c784 !important; background: rgba(255, 255, 255, 0.1) !important; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2) !important; padding: 0 10px !important;`,
        '#search-input input': `font-family: 'Georgia', serif !important; color: #e8f5e9 !important; font-style: italic !important; font-size: 16px !important;`,
        '#search-icon-legacy': `background: #2e7d32 !important; border-radius: 0 24px 4px 0 !important; border: none !important; border-left: 2px solid #81c784 !important; transition: background 0.3s !important;`,
        '#search-icon-legacy:hover': `background: #1b5e20 !important;`,
        '#search-icon-legacy yt-icon': `color: #c8e6c9 !important;`,
        '#voice-search-button': `background: #2e7d32 !important; border-radius: 4px 24px 4px 24px !important; border: 2px solid #81c784 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important; color: #c8e6c9 !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 4px 24px 4px 24px !important; border: 2px solid #81c784 !important; background: #0b1f10 !important; box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;`,
        '.sbsb_c': `font-family: 'Georgia', serif !important; color: #a5d6a7 !important;`,
        '.sbsb_c:hover': `background: #1b5e20 !important; color: #e8f5e9 !important; padding-left: 20px !important; transition: all 0.2s !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `background: rgba(46, 125, 50, 0.4) !important; border-radius: 4px 24px 4px 24px !important; border: 1px solid #81c784 !important; color: #e8f5e9 !important; transition: transform 0.3s !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `transform: scale(1.1) !important; background: #2e7d32 !important; box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 4px 24px 4px 24px !important; border: 2px solid #81c784 !important; padding: 2px !important; background: #1b5e20 !important; transition: transform 0.4s !important;`,
        '#avatar-btn yt-img-shadow:hover': `transform: rotate(-10deg) scale(1.1) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 4px 24px 4px 24px !important; border: 2px solid #81c784 !important; background: #0b1f10 !important; box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;`
    },
    'neo-brutalism': {
        '#masthead-container, ytd-masthead': `background: #fdf5e6 !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 8px 0 #000 !important;`,
        'ytd-topbar-logo-renderer': `filter: none !important; transform: scale(1.1) !important; transform-origin: left center !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 0 !important; border: 3px solid #000 !important; background: #fff !important; box-shadow: 5px 5px 0 #000 !important; margin-right: 15px !important;`,
        '#search-input input': `font-family: 'Space Grotesk', sans-serif !important; color: #000 !important; font-weight: 800 !important; font-size: 16px !important;`,
        '#search-icon-legacy': `background: #ffdb58 !important; border-radius: 0 !important; border-left: 3px solid #000 !important;`,
        '#search-icon-legacy:hover': `background: #ff5733 !important;`,
        '#search-icon-legacy yt-icon': `color: #000 !important;`,
        '#voice-search-button': `background: #c39bd3 !important; border-radius: 0 !important; border: 3px solid #000 !important; box-shadow: 4px 4px 0 #000 !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 0 !important; border: 4px solid #000 !important; background: #fff !important; box-shadow: 8px 8px 0 #000 !important;`,
        '.sbsb_c': `font-family: 'Space Grotesk', sans-serif !important; font-weight: bold !important; color: #000 !important; border-bottom: 2px solid #000 !important;`,
        '.sbsb_c:hover': `background: #33ff57 !important; transform: translateX(5px) !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `border-radius: 0 !important; border: 3px solid #000 !important; background: #fff !important; box-shadow: 3px 3px 0 #000 !important; margin: 0 4px !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `background: #ff5733 !important; box-shadow: 0 0 0 #000 !important; transform: translate(3px, 3px) !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 0 !important; border: 3px solid #000 !important; box-shadow: 4px 4px 0 #000 !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 0 !important; border: 4px solid #000 !important; background: #fdf5e6 !important; box-shadow: 10px 10px 0 #000 !important;`
    },
    'origami': {
        '#masthead-container, ytd-masthead': `background: #f0f0f0 !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 5px 15px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 0 !important; border: 1px solid #ccc !important; background: #fff !important; clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%) !important; box-shadow: inset 2px 2px 5px rgba(0,0,0,0.05) !important; padding-left: 15px !important;`,
        '#search-input input': `font-family: 'Lato', sans-serif !important; color: #333 !important;`,
        '#search-icon-legacy': `background: #e0e0e0 !important; border-radius: 0 !important; border: none !important; clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%) !important; margin-left: 5px !important;`,
        '#voice-search-button': `background: #fff !important; border-radius: 0 !important; border: 1px solid #ccc !important; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 0 !important; background: #fff !important; border: 1px solid #ddd !important; box-shadow: 5px 5px 15px rgba(0,0,0,0.1) !important; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%) !important;`,
        '.sbsb_c:hover': `background: #f5f5f5 !important; border-left: 4px solid #999 !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `border-radius: 0 !important; clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%) !important; background: #fff !important; border: 1px solid #eee !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 0 !important; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%) !important; border: 2px solid #ccc !important; padding: 2px !important; background: #fff !important;`
    },
    'retro-wave': {
        '#masthead-container, ytd-masthead': `background: linear-gradient(180deg, #10002b 0%, #240046 100%) !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff !important;`,
        'ytd-topbar-logo-renderer': `filter: drop-shadow(2px 2px 0px #00ffff) drop-shadow(-2px -2px 0px #ff00ff) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 20px !important; border: 2px solid #00ffff !important; background: rgba(36,0,70,0.8) !important; box-shadow: 0 0 10px #00ffff, inset 0 0 10px #00ffff !important;`,
        '#search-input input': `font-family: 'Impact', sans-serif !important; color: #ff00ff !important; font-size: 16px !important; text-shadow: 1px 1px 2px #000 !important; letter-spacing: 1px !important;`,
        '#search-icon-legacy': `background: #ff00ff !important; border-radius: 0 20px 20px 0 !important; border-left: 2px solid #00ffff !important; box-shadow: inset 0 0 10px #fff !important;`,
        '#search-icon-legacy yt-icon': `color: #fff !important; filter: drop-shadow(0 0 2px #fff) !important;`,
        '#voice-search-button': `background: #10002b !important; border-radius: 50% !important; border: 2px solid #ff00ff !important; box-shadow: 0 0 10px #ff00ff, inset 0 0 10px #ff00ff !important; color: #00ffff !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 12px !important; border: 2px solid #00ffff !important; background: linear-gradient(180deg, #240046 0%, #3c096c 100%) !important; box-shadow: 0 0 20px #00ffff !important; background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,255,255,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,255,255,0.1) 20px) !important;`,
        '.sbsb_c': `color: #ff00ff !important; font-family: 'Impact', sans-serif !important; font-weight: normal !important;`,
        '.sbsb_c:hover': `background: rgba(255,0,255,0.3) !important; color: #fff !important; text-shadow: 0 0 5px #00ffff !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `border-radius: 5px !important; border: 1px solid #ff00ff !important; background: #10002b !important; color: #00ffff !important; box-shadow: 0 0 5px #ff00ff !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `background: #ff00ff !important; color: #fff !important; box-shadow: 0 0 15px #ff00ff !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 10px !important; border: 3px solid #00ffff !important; box-shadow: 0 0 15px #00ffff !important; filter: contrast(1.5) saturate(1.5) hue-rotate(-20deg) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 12px !important; border: 2px solid #ff00ff !important; background: #10002b !important; box-shadow: 0 0 20px #ff00ff !important;`
    },
    'steampunk': {
        '#masthead-container, ytd-masthead': `background: linear-gradient(to bottom, #5c4033 0%, #3b2f2f 100%) !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 8px 15px rgba(0,0,0,0.6) !important;`,
        'ytd-topbar-logo-renderer': `filter: sepia(0.8) contrast(1.2) drop-shadow(1px 1px 2px #000) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 5px !important; border: 3px double #d2b48c !important; background: url('https://www.transparenttextures.com/patterns/old-wall.png'), #4a3a30 !important; box-shadow: inset 0 0 10px rgba(0,0,0,0.8) !important;`,
        '#search-input input': `font-family: 'Playfair Display', serif !important; color: #wheat !important; font-size: 16px !important; text-shadow: 1px 1px 1px #000 !important;`,
        '#search-icon-legacy': `background: linear-gradient(to bottom, #d2b48c, #8b6508) !important; border-radius: 0 5px 5px 0 !important; border-left: 2px solid #3b2f2f !important; box-shadow: inset 0 0 5px rgba(255,255,255,0.3) !important;`,
        '#search-icon-legacy yt-icon': `color: #3b2f2f !important;`,
        '#voice-search-button': `background: radial-gradient(circle, #8b6508, #4a3a30) !important; border-radius: 50% !important; border: 3px double #d2b48c !important; box-shadow: 2px 2px 5px rgba(0,0,0,0.5), inset 0 0 5px rgba(0,0,0,0.8) !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 5px !important; border: 4px groove #d2b48c !important; background: url('https://www.transparenttextures.com/patterns/old-wall.png'), #3b2f2f !important; box-shadow: 0 10px 25px rgba(0,0,0,0.8) !important;`,
        '.sbsb_c': `font-family: 'Playfair Display', serif !important; color: #wheat !important; border-bottom: 1px dotted #8b6508 !important;`,
        '.sbsb_c:hover': `background: rgba(139,101,8,0.3) !important; color: #fff !important; font-style: italic !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `border-radius: 50% !important; background: transparent !important; border: 2px solid transparent !important; color: #d2b48c !important; transition: transform 0.5s !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': `transform: rotate(90deg) !important; background: rgba(139,101,8,0.2) !important; border: 2px solid #8b6508 !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 50% !important; border: 4px ridge #d2b48c !important; box-shadow: 2px 2px 8px rgba(0,0,0,0.6) !important; filter: sepia(0.6) contrast(1.1) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 5px !important; border: 4px groove #d2b48c !important; background: #3b2f2f !important; box-shadow: 0 10px 25px rgba(0,0,0,0.8) !important; font-family: 'Playfair Display', serif !important;`
    },
    'vaporwave': {
        '#masthead-container, ytd-masthead': `background: linear-gradient(90deg, #ff71ce 0%, #01cdfe 50%, #05ffa1 100%) !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 4px 15px rgba(185,103,255,0.4) !important;`,
        'ytd-topbar-logo-renderer': `filter: hue-rotate(90deg) drop-shadow(2px 2px 0px #fff) !important; transform: skewX(-5deg) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 0 !important; border-top: 2px solid #fff !important; border-left: 2px solid #fff !important; border-right: 2px solid #000 !important; border-bottom: 2px solid #000 !important; background: #c0c0c0 !important; padding: 2px !important;`,
        '#search-input input': `font-family: 'MS Sans Serif', 'Tahoma', sans-serif !important; color: #000 !important; font-size: 14px !important; font-weight: bold !important; letter-spacing: 1px !important;`,
        '#search-icon-legacy': `background: #dfdfdf !important; border-top: 2px solid #fff !important; border-left: 2px solid #fff !important; border-right: 2px solid #000 !important; border-bottom: 2px solid #000 !important; border-radius: 0 !important; margin-left: 2px !important;`,
        '#search-icon-legacy yt-icon': `color: #000 !important;`,
        '#search-icon-legacy:active': `border-top: 2px solid #000 !important; border-left: 2px solid #000 !important; border-right: 2px solid #fff !important; border-bottom: 2px solid #fff !important;`,
        '#voice-search-button': `background: #dfdfdf !important; border-radius: 0 !important; border-top: 2px solid #fff !important; border-left: 2px solid #fff !important; border-right: 2px solid #000 !important; border-bottom: 2px solid #000 !important; color: #000 !important; margin-left: 5px !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 0 !important; border-top: 2px solid #fff !important; border-left: 2px solid #fff !important; border-right: 2px solid #000 !important; border-bottom: 2px solid #000 !important; background: #c0c0c0 !important; box-shadow: 5px 5px 0 rgba(0,0,0,0.2) !important;`,
        '.sbsb_c': `font-family: 'MS Sans Serif', sans-serif !important; color: #000 !important;`,
        '.sbsb_c:hover': `background: #000080 !important; color: #fff !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `border-radius: 0 !important; border-top: 2px solid #fff !important; border-left: 2px solid #fff !important; border-right: 2px solid #000 !important; border-bottom: 2px solid #000 !important; background: #dfdfdf !important; color: #000 !important; margin: 0 2px !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 0 !important; border-top: 2px solid #000 !important; border-left: 2px solid #000 !important; border-right: 2px solid #fff !important; border-bottom: 2px solid #fff !important; filter: hue-rotate(45deg) saturate(1.5) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 0 !important; border-top: 2px solid #fff !important; border-left: 2px solid #fff !important; border-right: 2px solid #000 !important; border-bottom: 2px solid #000 !important; background: #c0c0c0 !important;`
    },
    'woodblock': {
        '#masthead-container, ytd-masthead': `background: url('https://www.transparenttextures.com/patterns/wood-pattern.png'), #8b5a2b !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 5px 10px rgba(0,0,0,0.5) !important;`,
        'ytd-topbar-logo-renderer': `filter: sepia(0.5) brightness(0.8) contrast(1.2) drop-shadow(1px 1px 1px #333) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 12px !important; border: 3px inset #5c3a21 !important; background: #cd853f !important; box-shadow: inset 3px 3px 6px rgba(0,0,0,0.4) !important;`,
        '#search-input input': `font-family: 'Georgia', serif !important; color: #3e2723 !important; font-weight: bold !important; text-shadow: 1px 1px 0px rgba(255,255,255,0.2) !important;`,
        '#search-icon-legacy': `background: #a0522d !important; border-radius: 0 12px 12px 0 !important; border-left: 2px solid #5c3a21 !important; box-shadow: inset -2px -2px 5px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.2) !important;`,
        '#search-icon-legacy yt-icon': `color: #fff !important;`,
        '#voice-search-button': `background: #a0522d !important; border-radius: 50% !important; border: 3px solid #5c3a21 !important; box-shadow: 2px 2px 5px rgba(0,0,0,0.3) !important; color: #fff !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 12px !important; border: 4px solid #5c3a21 !important; background: url('https://www.transparenttextures.com/patterns/wood-pattern.png'), #8b5a2b !important; box-shadow: 5px 5px 15px rgba(0,0,0,0.6) !important;`,
        '.sbsb_c': `font-family: 'Georgia', serif !important; color: #fff !important; border-bottom: 1px solid #5c3a21 !important;`,
        '.sbsb_c:hover': `background: #5c3a21 !important; color: #ffebcd !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `background: #a0522d !important; border-radius: 10px !important; border: 2px solid #5c3a21 !important; box-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 12px !important; border: 3px solid #5c3a21 !important; filter: sepia(0.3) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 12px !important; border: 4px solid #5c3a21 !important; background: url('https://www.transparenttextures.com/patterns/wood-pattern.png'), #cd853f !important; box-shadow: 5px 5px 15px rgba(0,0,0,0.6) !important;`
    },
    'y2k': {
        '#masthead-container, ytd-masthead': `background: linear-gradient(180deg, #d4d4d4 0%, #ffffff 50%, #b5b5b5 100%) !important; border: none !important; border-bottom: none !important; border-top: none !important; box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;`,
        'ytd-topbar-logo-renderer': `filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3)) saturate(1.5) !important;`,
        '#container.ytd-searchbox, ytd-searchbox': `border-radius: 25px !important; border: 2px solid #999 !important; background: linear-gradient(to bottom, #fff 0%, #e0e0e0 100%) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(255,255,255,0.8) !important; padding: 0 15px !important;`,
        '#search-input input': `font-family: 'Verdana', sans-serif !important; color: #333 !important; font-size: 14px !important; font-weight: bold !important; text-shadow: 1px 1px 0 #fff !important;`,
        '#search-icon-legacy': `background: linear-gradient(to bottom, #4da6ff 0%, #0066cc 100%) !important; border-radius: 20px !important; border: 2px solid #005cbf !important; box-shadow: inset 0 2px 5px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3) !important; height: 32px !important; margin: 4px !important; width: 60px !important;`,
        '#search-icon-legacy yt-icon': `color: #fff !important; filter: drop-shadow(0 -1px 1px rgba(0,0,0,0.5)) !important;`,
        '#search-icon-legacy:hover': `background: linear-gradient(to bottom, #66b3ff 0%, #0073e6 100%) !important;`,
        '#voice-search-button': `background: linear-gradient(to bottom, #ff4d4d 0%, #cc0000 100%) !important; border-radius: 50% !important; border: 2px solid #b30000 !important; box-shadow: inset 0 2px 5px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3) !important; color: #fff !important;`,
        '.sbdd_b, .sbsb_a': `border-radius: 15px !important; border: 2px solid #999 !important; background: #f5f5f5 !important; box-shadow: 0 8px 20px rgba(0,0,0,0.3) !important;`,
        '.sbsb_c': `font-family: 'Verdana', sans-serif !important; color: #333 !important; font-weight: bold !important;`,
        '.sbsb_c:hover': `background: linear-gradient(to bottom, #4da6ff 0%, #0066cc 100%) !important; color: #fff !important; text-shadow: 0 -1px 1px rgba(0,0,0,0.5) !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': `background: linear-gradient(to bottom, #f0f0f0 0%, #cccccc 100%) !important; border-radius: 50% !important; border: 1px solid #999 !important; box-shadow: inset 0 2px 3px rgba(255,255,255,0.8), 0 2px 3px rgba(0,0,0,0.2) !important; color: #555 !important; transition: transform 0.1s !important;`,
        'ytd-topbar-menu-button-renderer yt-icon-button:active, ytd-notification-topbar-button-renderer yt-icon-button:active': `box-shadow: inset 0 2px 5px rgba(0,0,0,0.4) !important; transform: translateY(2px) !important;`,
        '#avatar-btn yt-img-shadow': `border-radius: 50% !important; border: 3px solid #0066cc !important; box-shadow: 0 3px 6px rgba(0,0,0,0.3) !important;`,
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': `border-radius: 15px !important; border: 2px solid #999 !important; background: linear-gradient(to bottom, #ffffff 0%, #e6e6e6 100%) !important; box-shadow: 0 10px 25px rgba(0,0,0,0.4) !important;`
    }
};

const BORDER_STYLES = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];
const FONTS = [
    "'Comic Sans MS', cursive",
    "'Space Mono', monospace",
    "'Playfair Display', serif",
    "'Courier New', monospace",
    "'Space Grotesk', sans-serif",
    "'Lato', sans-serif",
    "'Impact', sans-serif",
    "'Georgia', serif",
    "'Verdana', sans-serif",
    "'Trebuchet MS', sans-serif",
    "'Times New Roman', serif",
    "'Arial Black', sans-serif",
    "'Palatino Linotype', serif",
    "'Lucida Console', monospace",
    "'Brush Script MT', cursive",
    "'Garamond', serif"
];
const BOX_SHADOWS = [
    (c1, c2) => "0 4px 20px " + c2 + "66",
    (c1, c2) => "5px 5px 0 " + c2,
    (c1, c2) => "inset 0 0 15px " + c1 + "33, 0 0 15px " + c1 + "88",
    (c1, c2) => "0 10px 30px rgba(0,0,0,0.5)",
    (c1, c2) => "0 0 10px " + c1 + ", 0 0 20px " + c1,
    (c1, c2) => "8px 8px 16px rgba(0,0,0,0.2), -8px -8px 16px rgba(255,255,255,0.1)"
];
const BACKGROUNDS = [
    (c1, c2, op) => "linear-gradient(135deg, " + c1 + op + ", " + c2 + op + ")",
    (c1, c2, op) => "radial-gradient(circle, " + c1 + op + ", " + c2 + op + ")",
    (c1, c2, op) => "repeating-linear-gradient(45deg, " + c1 + "22, " + c1 + "22 10px, " + c2 + "22 10px, " + c2 + "22 20px), rgba(20,20,20, 0.9)",
    (c1, c2, op) => "linear-gradient(to right, rgba(0,0,0,0.9), " + c1 + "88)",
    (c1, c2, op) => c1 + op,
    (c1, c2, op) => "url('https://www.transparenttextures.com/patterns/dark-matter.png'), " + c2 + op
];
const BORDER_RADIUS = [
    '0px', '4px', '8px', '12px', '20px', '30px', '50px',
    '20px 0 20px 0', '0 20px 0 20px', '10px 30px 10px 30px', '50% 10% 50% 10%'
];

function getGenericDesign(themeName) {
    let hash = 0;
    for (let i = 0; i < themeName.length; i++) {
        hash = themeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Pseudo-random deterministic selector
    const p = (max) => Math.abs(hash % max);
    
    const hue1 = p(360);
    const hue2 = (hue1 + 120 + p(60)) % 360;
    
    const c1 = "hsl(" + hue1 + ", 80%, 55%)";
    const c2 = "hsl(" + hue2 + ", 70%, 45%)";
    const bgOpacity = Math.abs(hash % 2) === 0 ? 'ff' : 'ee';
    
    const bStyle = BORDER_STYLES[p(BORDER_STYLES.length)];
    const font = FONTS[p(FONTS.length)];
    const shadowGen = BOX_SHADOWS[p(BOX_SHADOWS.length)];
    const bgGen = BACKGROUNDS[p(BACKGROUNDS.length)];
    const radius = BORDER_RADIUS[p(BORDER_RADIUS.length)];
    
    const bWidth = (p(3) + 1) + 'px';
    const borderFull = bWidth + " " + bStyle + " " + c1;

    return {
        '#masthead-container, ytd-masthead': "background: " + bgGen(c1, c2, bgOpacity) + " !important; border: none !important; border-top: none !important; border-bottom: none !important; backdrop-filter: blur(12px) !important; box-shadow: " + shadowGen(c1, c2) + " !important;",
        'ytd-topbar-logo-renderer': "filter: drop-shadow(2px 2px 4px " + c1 + ") hue-rotate(" + p(180) + "deg) saturate(" + (p(2)+1) + ") !important; transition: transform 0.3s !important;",
        'ytd-topbar-logo-renderer:hover': "transform: scale(1.08) rotate(" + (p(10)-5) + "deg) !important;",
        '#container.ytd-searchbox, ytd-searchbox': "border-radius: " + radius + " !important; border: " + borderFull + " !important; background: rgba(10,10,10,0.6) !important; box-shadow: inset 0 0 10px " + c2 + "66 !important;",
        '#search-input input': "font-family: " + font + " !important; color: " + c1 + " !important; font-weight: bold !important; letter-spacing: 1px !important; text-shadow: 1px 1px 2px " + c2 + "88 !important;",
        '#search-icon-legacy': "background: " + c2 + "33 !important; border-radius: 0 " + radius + " " + radius + " 0 !important; border: none !important; border-left: " + borderFull + " !important; transition: all 0.3s !important;",
        '#search-icon-legacy:hover': "background: " + c1 + "88 !important; box-shadow: " + shadowGen(c1, c2) + " !important;",
        '#search-icon-legacy yt-icon': "color: #ffffff !important; filter: drop-shadow(0 0 2px " + c1 + ") !important;",
        '#voice-search-button': "background: " + c2 + "44 !important; border-radius: " + radius + " !important; border: " + borderFull + " !important; color: #fff !important; box-shadow: 0 0 8px " + c1 + "88 !important; transition: transform 0.2s !important;",
        '#voice-search-button:hover': "transform: scale(1.1) !important; background: " + c1 + "66 !important;",
        '.sbdd_b, .sbsb_a': "border-radius: " + radius + " !important; border: " + borderFull + " !important; background: rgba(15,15,20,0.95) !important; backdrop-filter: blur(20px) !important; box-shadow: " + shadowGen(c1, c2) + " !important;",
        '.sbsb_c': "color: #e0e0e0 !important; font-family: " + font + " !important; transition: all 0.2s !important;",
        '.sbsb_c:hover': "background: " + c2 + "55 !important; color: " + c1 + " !important; padding-left: 20px !important; font-weight: bold !important; box-shadow: inset 4px 0 0 " + c1 + " !important;",
        'ytd-topbar-menu-button-renderer yt-icon-button, ytd-notification-topbar-button-renderer yt-icon-button': "background: " + c2 + "22 !important; border-radius: " + radius + " !important; border: 1px " + bStyle + " " + c1 + " !important; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;",
        'ytd-topbar-menu-button-renderer yt-icon-button:hover, ytd-notification-topbar-button-renderer yt-icon-button:hover': "background: " + c1 + "66 !important; color: #fff !important; transform: translateY(-4px) scale(1.1) !important; box-shadow: " + shadowGen(c1, c2) + " !important;",
        '#avatar-btn yt-img-shadow': "border-radius: " + radius + " !important; border: " + bWidth + " " + bStyle + " " + c1 + " !important; box-shadow: " + shadowGen(c1, c2) + " !important; padding: 2px !important; background: " + c2 + "44 !important; transition: transform 0.4s !important;",
        '#avatar-btn yt-img-shadow:hover': "transform: rotate(" + p(360) + "deg) scale(1.15) !important;",
        'tp-yt-iron-dropdown ytd-multi-page-menu-renderer': "border-radius: " + radius + " !important; border: " + borderFull + " !important; background: rgba(10,10,15,0.95) !important; backdrop-filter: blur(25px) !important; box-shadow: " + shadowGen(c1, c2) + " !important;"
    };
}

const allThemes = fs.readdirSync(uiStylesDir).filter(f => fs.statSync(path.join(uiStylesDir, f)).isDirectory());

let injectedCount = 0;

for (const theme of allThemes) {
    const rules = themeConfigs[theme] || getGenericDesign(theme);
    const cssText = buildCSS(theme, rules);
    
    const modularNavbarPath = path.join(uiStylesDir, theme, 'components', 'navbar.css');
    const flatBundlePath = path.join(uiStylesDir, theme, 'bundle.css');
    
    let targetPath = null;
    
    if (fs.existsSync(path.join(uiStylesDir, theme, 'components'))) {
        targetPath = modularNavbarPath;
    } else if (fs.existsSync(flatBundlePath)) {
        targetPath = flatBundlePath;
    } else {
        targetPath = flatBundlePath;
    }

    let existingContent = '';
    if (fs.existsSync(targetPath)) {
        existingContent = fs.readFileSync(targetPath, 'utf8');
    }
    
    const marker = "/* Navbar Overhaul for " + theme + " */";
    if (existingContent.includes(marker)) {
        const startIdx = existingContent.indexOf(marker);
        const beforeBlock = existingContent.substring(0, startIdx).trimEnd();
        fs.writeFileSync(targetPath, beforeBlock + "\n" + cssText, 'utf8');
        console.log("Replaced Navbar CSS in " + theme);
        injectedCount++;
    } else {
        fs.appendFileSync(targetPath, "\n" + cssText, 'utf8');
        console.log("Injected Navbar CSS into " + theme);
        injectedCount++;
    }
}

console.log("\\nDone! Successfully injected unique navbar designs into " + injectedCount + " themes.");
