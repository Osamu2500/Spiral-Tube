// popup-extras.js — History Widget, Backup Tools, and Bookmarks Manager
// All code is wrapped in exported functions. No side-effects at module level.
import { FILTERS } from '../../../content/pages/watch/player/media-effects/video-filters/video-filters-presets.js';

// =========================================================================
// HISTORY WIDGET
// =========================================================================

const escapeHTML = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

let currentCalDate = new Date();
let selectedCalDateString = null;


export function renderGlobalPlayerBarBlocklist(container, state) {
    if (!document.getElementById('ypp-blocklist-styles')) {
        const style = document.createElement('style');
        style.id = 'ypp-blocklist-styles';
        style.textContent = `
            .blocklist-wrap {
                width: 100%; box-sizing: border-box; margin-top: 12px;
                background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
                border: 1px solid transparent; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px;
            }
            .blocklist-title { font-size: 13.5px; font-weight: 700; color: var(--text-1); display: flex; align-items: center; gap: 8px; }
            .blocklist-search-wrap { display: flex; align-items: center; gap: 8px; }
            .blocklist-input {
                flex: 1; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px;
                padding: 8px 14px; font-size: 12px; color: var(--text-1); outline: none; transition: all 0.2s;
            }
            .blocklist-input:focus { border-color: color-mix(in srgb, var(--accent-primary) 50%, transparent); }
            .blocklist-btn {
                background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
                color: var(--text-1); border-radius: 8px; padding: 8px 12px; font-size: 11px; font-weight: 600; cursor: pointer; transition: 0.2s;
            }
            .blocklist-btn:hover { background: rgba(255, 255, 255, 0.1); }
            .blocklist-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;
                max-height: 250px; overflow-y: auto; padding-right: 4px;
            }
            .blocklist-grid::-webkit-scrollbar { width: 5px; }
            .blocklist-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
            .blocklist-item {
                background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 8px 10px;
                display: flex; align-items: center; justify-content: space-between; gap: 8px; transition: 0.2s;
            }
            .blocklist-item:hover { background: rgba(255,255,255,0.06); }
            .blocklist-domain { font-size: 11px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
            .blocklist-rm {
                background: none; border: none; color: #fca5a5; cursor: pointer; padding: 2px;
                display: flex; align-items: center; justify-content: center; opacity: 0.7; transition: 0.2s;
            }
            .blocklist-rm:hover { opacity: 1; color: #ff3366; }
            .blocklist-empty { text-align: center; padding: 20px; font-size: 11px; color: var(--text-dim); grid-column: 1 / -1; }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <div class="blocklist-wrap">
            <div class="blocklist-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                Blocked Domains (No Global Bar)
            </div>
            <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 4px;">Enter a domain (e.g. netflix.com) to block the global player bar on that site.</div>
            <div class="blocklist-search-wrap">
                <input type="text" id="bl-input" class="blocklist-input" placeholder="example.com" />
                <button type="button" id="bl-add" class="blocklist-btn">Add Block</button>
            </div>
            <div id="bl-grid" class="blocklist-grid"></div>
        </div>
    `;

    const input = container.querySelector('#bl-input');
    const addBtn = container.querySelector('#bl-add');
    const grid = container.querySelector('#bl-grid');

    let blocklist = [];

    const saveAndRender = () => {
        chrome.storage.local.set({ globalPlayerBarBlocklist: blocklist }, renderList);
    };

    const renderList = () => {
        grid.innerHTML = '';
        if (blocklist.length === 0) {
            grid.innerHTML = '<div class="blocklist-empty">No blocked domains yet.</div>';
            return;
        }

        blocklist.forEach((domain, idx) => {
            const el = document.createElement('div');
            el.className = 'blocklist-item';
            el.innerHTML = `
                <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; flex: 1;">
                    <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=32" style="width: 14px; height: 14px; border-radius: 3px;" onerror="this.style.display='none';" />
                    <span class="blocklist-domain" title="${domain}">${domain}</span>
                </div>
                <button class="blocklist-rm" title="Remove block" data-idx="${idx}">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;
            el.querySelector('.blocklist-rm').addEventListener('click', (e) => {
                const i = parseInt(e.currentTarget.dataset.idx, 10);
                blocklist.splice(i, 1);
                saveAndRender();
            });
            grid.appendChild(el);
        });
    };

    const addDomain = () => {
        let val = input.value.trim().toLowerCase();
        if (!val) return;
        try {
            if (val.startsWith('http')) {
                const url = new URL(val);
                val = url.hostname;
            }
        } catch(e) {}
        
        val = val.replace(/^www\./, '');

        if (val && !blocklist.includes(val)) {
            blocklist.unshift(val);
            saveAndRender();
        }
        input.value = '';
    };

    addBtn.addEventListener('click', addDomain);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addDomain();
    });

    chrome.storage.local.get('globalPlayerBarBlocklist', (data) => {
        blocklist = data.globalPlayerBarBlocklist || [];
        renderList();
    });
}

