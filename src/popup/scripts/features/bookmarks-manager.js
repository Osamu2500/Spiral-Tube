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


export function initBookmarksManager() {
    const listEl = document.getElementById('bookmarksList');
    const searchInput = document.getElementById('bookmarkSearchInput');
    if (!listEl) return;

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);
        return h > 0
            ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
            : `${m}:${s.toString().padStart(2, '0')}`;
    };

    let allBookmarks = [];

    const renderBookmarks = (filter = '') => {
        const filtered = allBookmarks.filter(b =>
            (b.videoTitle || '').toLowerCase().includes(filter) ||
            (b.text || '').toLowerCase().includes(filter)
        );

        if (filtered.length === 0) {
            listEl.innerHTML = `
                <div class="empty-state" style="text-align:center; padding: 40px 20px; color:rgba(255,255,255,0.5);">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px; height:48px; margin-bottom:10px; opacity:0.5; display: block; margin: 0 auto 10px;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                   <div style="font-size:14px; font-weight:500;">No bookmarks found</div>
                </div>`;
            return;
        }

        listEl.innerHTML = '';
        filtered.forEach(bm => {
            const date = new Date(bm.createdAt).toLocaleDateString();
            const card = document.createElement('div');
            card.className = 'bookmark-card';
            card.innerHTML = `
                <div class="bookmark-header">
                    <div style="flex:1;">
                        <div class="bookmark-title">${escapeHTML(bm.videoTitle)}</div>
                        <span class="bookmark-time">${escapeHTML(formatTime(bm.timestamp))}</span>
                    </div>
                    <button class="bookmark-delete" data-id="${escapeHTML(bm.id)}" title="Delete Bookmark">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                    </button>
                </div>
                <div class="bookmark-text">"${escapeHTML(bm.text)}"</div>
                <div class="bookmark-date">${escapeHTML(date)}</div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.bookmark-delete')) return;
                const url = `https://www.youtube.com/watch?v=${bm.videoId}&t=${Math.floor(bm.timestamp)}s`;
                chrome.tabs.create({ url });
            });

            const delBtn = card.querySelector('.bookmark-delete');
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Delete this bookmark?')) {
                    allBookmarks = allBookmarks.filter(b => b.id !== bm.id);
                    chrome.storage.local.set({ ypp_bookmarks: allBookmarks }, () => {
                        renderBookmarks(searchInput ? searchInput.value.toLowerCase().trim() : '');
                    });
                }
            });

            listEl.appendChild(card);
        });
    };

    const loadBookmarks = () => {
        chrome.storage.local.get(['ypp_bookmarks'], (result) => {
            allBookmarks = result.ypp_bookmarks || [];
            renderBookmarks();
        });
    };

    // Reload bookmarks when the tab is clicked
    document.querySelectorAll('.nav-item[data-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.dataset.tab === 'bookmarks') loadBookmarks();
        });
    });

    // Search filter
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderBookmarks(e.target.value.toLowerCase().trim());
        });
    }

    // Initial load if already on bookmarks tab
    const bookmarksTab = document.getElementById('tab-bookmarks');
    if (bookmarksTab && bookmarksTab.classList.contains('active')) {
        loadBookmarks();
    }
}

// =========================================================================
// PLAYER BAR ORGANIZER
// =========================================================================
