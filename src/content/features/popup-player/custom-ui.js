/**
 * custom-ui.js
 * 
 * Scope: Popup Player UI Overrides
 * Description: Replaces the native popup player UI with custom Squircle-themed 
 * Dropdowns for Size and Ratio. Implements a robust resizing engine to bypass
 * vendor bugs, ensuring the popup always fits within the viewport.
 * 
 * Note: This module is injected into the main page context (dist/content.js) 
 * and targets the `.ytpop-top-bar` element created by the vendor bundle.
 */

// --- Constants & Configuration ---
const POPUP_CONSTANTS = {
    RATIOS: ['16:9', '21:9', '4:3', '1:1', '9:16'],
    SIZES: [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0],
    BASE_WIDTH: 400,
    DEFAULT_RATIO: '16:9',
    DEFAULT_SIZE: 1.5,
    MIN_OFFSET_X: 20,
    MIN_OFFSET_Y: 40 // Accounts for top bar
};

// --- State ---
let state = {
    ratio: POPUP_CONSTANTS.DEFAULT_RATIO,
    size: POPUP_CONSTANTS.DEFAULT_SIZE,
    isInitialized: false,
    ratioDropdown: null,
    sizeDropdown: null
};

// --- Initialization ---
function initCustomUI() {
    if (state.isInitialized) return;
    
    const topBar = document.querySelector('.ytpop-top-bar');
    if (!topBar) return;
    
    // Prevent duplicate injection if dropdowns already exist in this DOM node
    if (topBar.querySelector('.ytpop-custom-dropdown')) {
        state.isInitialized = true;
        return;
    }
    
    state.isInitialized = true;
    
    // Read initial state from storage
    chrome.storage.local.get(['popupRatio', 'popupSize'], (data) => {
        if (data.popupRatio) state.ratio = data.popupRatio;
        if (data.popupSize) state.size = parseFloat(data.popupSize);
        
        injectDropdowns(topBar);
        applyCustomResize();
    });
}

// --- Storage Sync ---
chrome.storage.onChanged.addListener((changes) => {
    let shouldResize = false;
    
    if (changes.popupRatio) {
        state.ratio = changes.popupRatio.newValue;
        shouldResize = true;
    }
    if (changes.popupSize) {
        state.size = parseFloat(changes.popupSize.newValue);
        shouldResize = true;
    }
    
    if (shouldResize) {
        updateDropdownUI();
        applyCustomResize();
    }
});

// --- Core Logic ---
function parseRatio(ratioStr) {
    if (!ratioStr || typeof ratioStr !== 'string') return 16 / 9;
    const parts = ratioStr.split(':');
    if (parts.length === 2) {
        const width = parseFloat(parts[0]);
        const height = parseFloat(parts[1]);
        if (width > 0 && height > 0) return width / height;
    }
    return 16 / 9;
}

function applyCustomResize() {
    // 1. Calculate precise dimensions
    const width = POPUP_CONSTANTS.BASE_WIDTH * state.size;
    const ratioVal = parseRatio(state.ratio);
    const height = width / ratioVal;

    // 2. Delegate to the Pro Engine API if available
    if (window.spiralPopupEngine) {
        window.spiralPopupEngine.setSize(width, height);
        return;
    }

    // Fallback for styling just in case
    const container = document.querySelector('.ytpop-container');
    if (!container) return;

    container.style.setProperty('width', `${width}px`, 'important');
    container.style.setProperty('height', `${height}px`, 'important');
    container.style.setProperty('--custom-width', `${width}px`);
    container.style.setProperty('--custom-height', `${height}px`);
}

// --- UI Components ---
function createDropdown(label, options, currentValue, onChange) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ytpop-custom-dropdown';
    
    const button = document.createElement('button');
    button.className = 'ytpop-ctrl-btn ytpop-dropdown-btn';
    
    // Icon SVG
    const svgIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
    button.innerHTML = `<span>${label}: ${currentValue}</span> ${svgIcon}`;
    
    const menu = document.createElement('div');
    menu.className = 'ytpop-dropdown-menu';
    
    options.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'ytpop-dropdown-item';
        const displayValue = opt + (typeof opt === 'number' ? 'x' : '');
        
        if (opt == currentValue) item.classList.add('active');
        item.textContent = displayValue;
        
        item.addEventListener('click', () => {
            menu.classList.remove('show');
            onChange(opt);
        });
        menu.appendChild(item);
    });

    // Toggle logic (using mousedown to bypass vendor drag event cancellation)
    button.addEventListener('mousedown', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        
        // Close other dropdowns
        document.querySelectorAll('.ytpop-dropdown-menu').forEach(m => {
            if (m !== menu) m.classList.remove('show');
        });
        
        menu.classList.toggle('show');
    });

    // Close on outside click
    document.addEventListener('mousedown', (e) => {
        if (!wrapper.contains(e.target)) {
            menu.classList.remove('show');
        }
    });

    wrapper.appendChild(button);
    wrapper.appendChild(menu);
    
    // Store update method for storage sync
    wrapper._updateValue = (newVal) => {
        const displayValue = newVal + (typeof newVal === 'number' ? 'x' : '');
        button.querySelector('span').textContent = `${label}: ${displayValue}`;
        
        Array.from(menu.children).forEach(child => {
            child.classList.toggle('active', child.textContent === displayValue);
        });
    };
    
    return wrapper;
}

function injectDropdowns(topBar) {
    // Aggressively remove original vendor buttons to prevent duplicate UI
    const oldSizeBtn = topBar.querySelector('.ytpop-size-btn');
    const oldRatioBtn = topBar.querySelector('.ytpop-ratio-btn');
    if (oldSizeBtn) oldSizeBtn.remove();
    if (oldRatioBtn) oldRatioBtn.remove();

    // Attempt to insert before the close button to maintain visual order
    const closeBtn = topBar.querySelector('.ytpop-close-btn');
    
    state.ratioDropdown = createDropdown('Ratio', POPUP_CONSTANTS.RATIOS, state.ratio, (val) => {
        state.ratio = val;
        chrome.storage.local.set({ popupRatio: val });
    });
    
    state.sizeDropdown = createDropdown('Size', POPUP_CONSTANTS.SIZES, state.size, (val) => {
        state.size = val;
        chrome.storage.local.set({ popupSize: val.toString() });
    });

    if (closeBtn) {
        topBar.insertBefore(state.ratioDropdown, closeBtn);
        topBar.insertBefore(state.sizeDropdown, closeBtn);
    } else {
        topBar.appendChild(state.ratioDropdown);
        topBar.appendChild(state.sizeDropdown);
    }
}

function updateDropdownUI() {
    if (state.ratioDropdown) state.ratioDropdown._updateValue(state.ratio);
    if (state.sizeDropdown) state.sizeDropdown._updateValue(state.size);
}

// --- Lifecycle Management ---
const observer = new MutationObserver(() => {
    const topBar = document.querySelector('.ytpop-top-bar');
    if (topBar) {
        // If topBar exists but doesn't have our dropdowns, we need to init
        if (!topBar.querySelector('.ytpop-custom-dropdown')) {
            state.isInitialized = false;
            initCustomUI();
        }
    } else {
        state.isInitialized = false; 
    }
});

observer.observe(document.body, { childList: true, subtree: true });
