import { findSchemaItem, ITEM_RENDERERS } from './popup-renderer.js';

let currentFavorites = [];

export function initFavorites(doc, state, t) {
    const container = doc.getElementById('favorites-container');
    const emptyState = doc.getElementById('favorites-empty-state');
    if (!container) return;

    // Load favorites
    chrome.storage.local.get('favorite_settings', (data) => {
        currentFavorites = data.favorite_settings || [];
        renderFavorites();
    });

    // Handle right click to toggle favorite
    if (!doc._yppFavoritesInit) {
        doc._yppFavoritesInit = true;
        doc.addEventListener('contextmenu', (e) => {
        const card = e.target.closest('.toggle-card, .setting-item');
        if (!card) return;

        // Skip if it's already in the favorites tab to avoid confusion, or handle unpinning directly
        const inFavoritesTab = card.closest('#tab-favorites');
        
        // Find input id
        const input = card.querySelector('input[type="checkbox"], input[type="range"], select, input[type="text"]');
        let settingId = input ? input.id : null;
        
        if (!settingId && card.id && card.id.startsWith('modeCard-')) {
            settingId = card.id.replace('modeCard-', '');
        }

        if (!settingId) return;
        
        e.preventDefault(); // prevent default context menu
        
        if (currentFavorites.includes(settingId)) {
            // Remove
            currentFavorites = currentFavorites.filter(id => id !== settingId);
            showToast(doc, 'Removed from Favorites');
        } else {
            // Add
            currentFavorites.push(settingId);
            showToast(doc, 'Added to Favorites');
        }
        
        chrome.storage.local.set({ favorite_settings: currentFavorites });
        renderFavorites();
    });
    }

    function renderFavorites() {
        container.innerHTML = '';
        
        if (currentFavorites.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        const grid = doc.createElement('div');
        grid.className = 'feature-grid';
        
        currentFavorites.forEach(id => {
            const schemaData = findSchemaItem(id, t);
            if (schemaData && schemaData.item) {
                const fn = ITEM_RENDERERS[schemaData.item.type];
                if (fn) {
                    const el = fn(schemaData.item, state);
                    if (el) grid.appendChild(el);
                }
            }
        });
        
        container.appendChild(grid);
    }
}

function showToast(doc, msg) {
    let toast = doc.getElementById('ypp-toast');
    if (!toast) {
        toast = doc.createElement('div');
        toast.id = 'ypp-toast';
        toast.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: var(--accent-primary, #ff4e45); color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); pointer-events: none; opacity: 0; transition: opacity 0.3s;';
        doc.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    
    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}
