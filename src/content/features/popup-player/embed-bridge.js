/**
 * embed-bridge.js
 * 
 * Scope: YouTube Embed Iframe Bridge
 * Description: Injected exclusively into `youtube-nocookie.com/embed/*` via manifest.json.
 * Synchronizes extension features (Volume Booster, Cinema Filters, Squircle UI) 
 * directly with the isolated popup player iframe.
 * 
 * Note: Does not affect standard youtube.com pages.
 */

// --- Constants ---
const BRIDGE_CONSTANTS = {
    DEFAULT_VOLUME_BOOST: 100,
    DEFAULT_FILTER: 100,
    THEME_MARGIN: '0 !important',
    THEME_BOTTOM: '12px !important',
    THEME_LEFT_RIGHT: '12px !important',
    THEME_RADIUS: '16px !important'
};

// --- State ---
const state = {
    videoElement: null,
    audioCtx: null,
    source: null,
    gainNode: null,
    isInitialized: false
};

// --- Initialization ---
function initBridge() {
    if (state.isInitialized) return;

    state.videoElement = document.querySelector('video');
    
    if (!state.videoElement) {
        // Wait for video element injection
        const observer = new MutationObserver(() => {
            const vid = document.querySelector('video');
            if (vid) {
                observer.disconnect();
                state.videoElement = vid;
                state.isInitialized = true;
                applySettings();
                injectPlayerBarTheme();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return;
    }
    
    state.isInitialized = true;
    applySettings();
    injectPlayerBarTheme();
}

// --- Storage Sync ---
function applySettings() {
    chrome.storage.local.get(null, (settings) => {
        applyFilters(settings);
        applyVolumeBoost(settings);
    });
}

chrome.storage.onChanged.addListener((changes) => {
    const hasFilterChange = Object.keys(changes).some(k => k.startsWith('cinemaFilter') || k === 'enableCinemaFilters');
    const hasVolumeChange = Object.keys(changes).some(k => k.includes('volume') || k.includes('Volume'));
    
    if (hasFilterChange || hasVolumeChange) {
        chrome.storage.local.get(null, (settings) => {
            if (hasFilterChange) applyFilters(settings);
            if (hasVolumeChange) applyVolumeBoost(settings);
        });
    }
});

// --- Feature: Video Filters ---
function applyFilters(settings) {
    if (!state.videoElement) return;
    
    if (settings.enableCinemaFilters === false) {
        state.videoElement.style.filter = '';
        return;
    }
    
    // Safely parse or fallback to defaults
    const getSetting = (key, defaultVal) => settings[key] !== undefined ? settings[key] : defaultVal;
    
    const brightness = getSetting('cinemaFilterBrightness', BRIDGE_CONSTANTS.DEFAULT_FILTER);
    const contrast = getSetting('cinemaFilterContrast', BRIDGE_CONSTANTS.DEFAULT_FILTER);
    const saturate = getSetting('cinemaFilterSaturate', BRIDGE_CONSTANTS.DEFAULT_FILTER);
    const hue = getSetting('cinemaFilterHue', 0);
    const sepia = getSetting('cinemaFilterSepia', 0);
    const grayscale = getSetting('cinemaFilterGrayscale', 0);
    const invert = getSetting('cinemaFilterInvert', 0);
    const blur = getSetting('cinemaFilterBlur', 0);
    
    // Construct single filter string
    state.videoElement.style.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturate}%)
        hue-rotate(${hue}deg)
        sepia(${sepia}%)
        grayscale(${grayscale}%)
        invert(${invert}%)
        blur(${blur}px)
    `.replace(/\s+/g, ' ').trim();
}

// --- Feature: Volume Booster ---
function applyVolumeBoost(settings) {
    if (!state.videoElement) return;
    
    const isEnabled = settings.enableVolumeBoost || settings.volumeBoostEnabled;
    const level = settings.volumeBoostLevel || BRIDGE_CONSTANTS.DEFAULT_VOLUME_BOOST;
    
    if (!isEnabled || level <= BRIDGE_CONSTANTS.DEFAULT_VOLUME_BOOST) {
        if (state.gainNode) state.gainNode.gain.value = 1;
        return;
    }
    
    if (!state.audioCtx) {
        try {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            state.source = state.audioCtx.createMediaElementSource(state.videoElement);
            state.gainNode = state.audioCtx.createGain();
            
            state.source.connect(state.gainNode);
            state.gainNode.connect(state.audioCtx.destination);
        } catch (e) {
            console.error('[Spiral Tube] Popup Bridge AudioContext error:', e);
            return;
        }
    }
    
    // Autoplay policy circumvention (resume context on interaction)
    if (state.audioCtx.state === 'suspended') {
        const resumeCtx = () => {
            state.audioCtx.resume();
            state.videoElement.removeEventListener('play', resumeCtx);
        };
        state.videoElement.addEventListener('play', resumeCtx);
    }
    
    // Map percentage to linear multiplier (e.g. 200 = 2x)
    state.gainNode.gain.value = level / 100;
}

// --- Feature: Custom Player Bar Theme ---
function injectPlayerBarTheme() {
    const styleId = 'ytpop-bridge-theme';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Theming the native embed controls to match Spiral Tube Squircle aesthetic */
        .ytp-chrome-bottom {
            background: rgba(20, 20, 20, 0.7) !important;
            backdrop-filter: blur(12px) !important;
            border-radius: ${BRIDGE_CONSTANTS.THEME_RADIUS};
            margin: ${BRIDGE_CONSTANTS.THEME_MARGIN}; 
            bottom: ${BRIDGE_CONSTANTS.THEME_BOTTOM}; 
            left: ${BRIDGE_CONSTANTS.THEME_LEFT_RIGHT}; 
            right: ${BRIDGE_CONSTANTS.THEME_LEFT_RIGHT};
            width: calc(100% - 24px) !important;
            padding-bottom: 0 !important;
        }
        .ytp-progress-bar-container {
            bottom: auto !important;
            top: -6px !important;
            height: 12px !important;
        }
        .ytp-progress-list {
            border-radius: 6px !important;
        }
        .ytp-play-progress, .ytp-swatch-background-color {
            background: var(--ytpop-accent, #ff4e45) !important;
        }
        /* Hide annotations/cards */
        .annotation-shape, .annotation-type-text {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// --- Feature: Cross-Origin Messaging (Screenshots) ---
window.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'TAKE_SCREENSHOT') {
        if (!state.videoElement) return;
        
        try {
            const canvas = document.createElement('canvas');
            canvas.width = state.videoElement.videoWidth;
            canvas.height = state.videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            
            // Replicate visual filters onto the canvas export
            ctx.filter = state.videoElement.style.filter;
            ctx.drawImage(state.videoElement, 0, 0, canvas.width, canvas.height);
            
            // Post result back to parent extension frame
            window.parent.postMessage({
                action: 'SCREENSHOT_READY',
                dataUrl: canvas.toDataURL('image/png')
            }, '*');
        } catch (err) {
            console.error('[Spiral Tube] Popup Screenshot error (likely CORS):', err);
        }
    }
});

// --- Bootstrapper ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridge);
} else {
    initBridge();
}
