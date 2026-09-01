/**
 * @fileoverview
 * Player Bar Organizer
 * 
 * Target: Extension Popup
 * Purpose: Handles the drag-and-drop UI for reordering player bar buttons.
 */
export function renderPlayerBarOrganizer(container, state) {
    container.innerHTML = `
        <div style="margin-top:12px; background:rgba(0,0,0,0.2); padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:12px; font-weight:bold; margin-bottom:8px; opacity:0.8;">Reorder Player Bar Buttons (Drag & Drop)</div>
            <div id="player-bar-draggable-list" style="display:flex; flex-direction:row; flex-wrap:wrap; gap:8px;"></div>
        </div>
    `;

    const list = container.querySelector('#player-bar-draggable-list');

    // The available buttons that can be reordered
    const BUTTON_DEFS = {
        pb_speed: { label: 'Speed Controls', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 6v12l8.5-6L4 6zm9 0v12l8.5-6L13 6z"/></svg>' },
        pb_pip: { label: 'Auto PiP', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4-7H1v16h22V4zm-2 14H3V6h18v12z"/></svg>' },
        pb_snapshot: { label: 'Snapshot', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="3.2"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>' },
        pb_loop: { label: 'Loop', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>' },
        pb_bookmark: { label: 'Bookmarks', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>' },
        pb_volume: { label: 'Volume Boost', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>' },
        pb_cinema: { label: 'Video Filters', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V5H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-4h1.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/></svg>' }
    };

    const DEFAULT_SEQ = Object.keys(BUTTON_DEFS);

    const renderList = (sequence) => {
        list.innerHTML = '';
        sequence.forEach((id) => {
            if (!BUTTON_DEFS[id]) return;
            
            const el = document.createElement('div');
            el.className = 'draggable-btn-item';
            el.dataset.id = id;
            el.draggable = true;
            el.style.cssText = 'display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.05); padding:6px 12px; border-radius:16px; cursor:grab; border:1px solid rgba(255,255,255,0.02); transition:background 0.2s;';
            
            el.innerHTML = `
                <div style="opacity:0.3; cursor:grab; pointer-events:none;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
                <div style="color:var(--accent-primary); display:flex;">${BUTTON_DEFS[id].icon}</div>
                <div style="font-size:12px; opacity:0.9;">${BUTTON_DEFS[id].label}</div>
            `;
            
            el.addEventListener('dragstart', (e) => {
                el.style.opacity = '0.4';
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', id);
                setTimeout(() => el.classList.add('dragging'), 0);
            });
            el.addEventListener('dragend', () => {
                el.style.opacity = '1';
                el.classList.remove('dragging');
            });
            
            list.appendChild(el);
        });
    };

    let dragTarget = null;
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const draggingEl = list.querySelector('.dragging');
        if (!draggingEl) return;
        
        const afterElement = getDragAfterElement(list, e.clientX, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggingEl);
        } else {
            list.insertBefore(draggingEl, afterElement);
        }
    });

    list.addEventListener('drop', (e) => {
        e.preventDefault();
        const newSequence = Array.from(list.querySelectorAll('.draggable-btn-item')).map(el => el.dataset.id);
        
        chrome.storage.local.get('settings', (data) => {
            const s = data.settings || {};
            s.playerBarSequence = newSequence;
            chrome.storage.local.set({ settings: s }, () => {
                const event = new CustomEvent('ypp-settings-changed', { bubbles: true });
                container.dispatchEvent(event);
            });
        });
    });

    function getDragAfterElement(container, x, y) {
        const draggableElements = [...container.querySelectorAll('.draggable-btn-item:not(.dragging)')];
        for (const child of draggableElements) {
            const box = child.getBoundingClientRect();
            if (y <= box.bottom) {
                if (y < box.top) {
                    return child; 
                }
                if (x < box.left + box.width / 2) {
                    return child; 
                }
            }
        }
        return null;
    }

    chrome.storage.local.get('settings', (data) => {
        const s = data.settings || {};
        let seq = s.playerBarSequence || DEFAULT_SEQ;
        
        const missing = DEFAULT_SEQ.filter(x => !seq.includes(x));
        if (missing.length > 0) {
            seq = [...seq, ...missing];
        }
        renderList(seq);
    });
}
