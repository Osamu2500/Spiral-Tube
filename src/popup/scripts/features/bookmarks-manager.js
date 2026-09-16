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
    let selectedBookmarkIds = new Set();
    let actionBarEl = null;

    const createActionBar = () => {
        if (!actionBarEl) {
            actionBarEl = document.createElement('div');
            actionBarEl.className = 'bulk-action-bar';
            document.body.appendChild(actionBarEl);
            
            actionBarEl.innerHTML = `
                <span class="bulk-action-text">0 selected</span>
                <div class="bulk-action-buttons">
                    <button class="bulk-action-delete">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                        Delete
                    </button>
                    <button class="bulk-action-cancel">Cancel</button>
                </div>
            `;
            
            actionBarEl.querySelector('.bulk-action-cancel').addEventListener('click', () => {
                selectedBookmarkIds.clear();
                updateActionBar();
                renderBookmarks(searchInput ? searchInput.value.toLowerCase().trim() : '');
            });
            

            actionBarEl.querySelector('.bulk-action-delete').addEventListener('click', () => {
                if (confirm(`Delete ${selectedBookmarkIds.size} highlights?`)) {
                    const idsToDelete = Array.from(selectedBookmarkIds);
                    selectedBookmarkIds.clear();
                    updateActionBar();
                    
                    let deletedCount = 0;
                    idsToDelete.forEach(id => {
                        allBookmarks = allBookmarks.filter(b => b.id !== id);
                        chrome.runtime.sendMessage({ action: 'IDB_DELETE', storeName: 'bookmarks', key: id }, () => {
                            deletedCount++;
                            if (deletedCount === idsToDelete.length) {
                                renderBookmarks(searchInput ? searchInput.value.toLowerCase().trim() : '');
                            }
                        });
                    });
                }
            });
        }
    };

    const updateActionBar = () => {
        if (!actionBarEl) createActionBar();
        if (selectedBookmarkIds.size > 0) {
            actionBarEl.classList.add('visible');
            actionBarEl.querySelector('.bulk-action-text').textContent = `${selectedBookmarkIds.size} selected`;
        } else {
            actionBarEl.classList.remove('visible');
        }
    };

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
        
        // Group by videoId
        const groups = {};
        filtered.forEach(bm => {
            if (!groups[bm.videoId]) {
                groups[bm.videoId] = {
                    videoId: bm.videoId,
                    videoTitle: bm.videoTitle,
                    image: bm.image, // Use first available image
                    bookmarks: []
                };
            }
            // Keep looking for an image if first bookmark didn't have one
            if (!groups[bm.videoId].image && bm.image) {
                groups[bm.videoId].image = bm.image;
            }
            groups[bm.videoId].bookmarks.push(bm);
        });

        const sortedGroups = Object.values(groups).sort((a, b) => {
            // Sort groups by the most recently added bookmark in each group
            const maxA = Math.max(...a.bookmarks.map(b => b.createdAt));
            const maxB = Math.max(...b.bookmarks.map(b => b.createdAt));
            return maxB - maxA;
        });

        const cards = [];
        const contents = [];

        sortedGroups.forEach((group, index) => {
            const groupCard = document.createElement('div');
            groupCard.className = 'bookmark-group-card';
            
            const thumbUrl = `https://i.ytimg.com/vi/${group.videoId}/maxresdefault.jpg`;
            const fallbackUrl = `https://i.ytimg.com/vi/${group.videoId}/hqdefault.jpg`;
            const thumbHtml = `<img class="bookmark-group-thumb" src="${thumbUrl}" onerror="this.onerror=null; this.src='${fallbackUrl}';" alt="Thumbnail">`;
                
            groupCard.innerHTML = `
                <div class="bookmark-group-header">
                    <div class="bookmark-checkbox-wrapper group-checkbox">
                        <input type="checkbox" class="bookmark-checkbox">
                    </div>
                    ${thumbHtml}
                    <div class="bookmark-group-info-wrapper">
                        <div class="bookmark-group-info">
                            <div class="bookmark-group-title">${escapeHTML(group.videoTitle)}</div>
                            <div class="bookmark-group-count">${group.bookmarks.length} highlight${group.bookmarks.length > 1 ? 's' : ''}</div>
                        </div>
                        <div class="bookmark-group-chevron">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>
            `;
            
            const contentEl = document.createElement('div');
            contentEl.className = 'bookmark-group-content';
            
            const groupCheckboxWrapper = groupCard.querySelector('.group-checkbox');
            const groupCheckbox = groupCheckboxWrapper.querySelector('input');
            const videoBmIds = group.bookmarks.map(b => b.id);
            
            const updateGroupCheckbox = () => {
                const selectedInGroup = videoBmIds.filter(id => selectedBookmarkIds.has(id)).length;
                if (selectedInGroup === videoBmIds.length && videoBmIds.length > 0) {
                    groupCheckbox.checked = true;
                    groupCheckbox.indeterminate = false;
                    groupCheckboxWrapper.classList.add('checked');
                    groupCheckboxWrapper.classList.remove('indeterminate');
                } else if (selectedInGroup > 0) {
                    groupCheckbox.checked = false;
                    groupCheckbox.indeterminate = true;
                    groupCheckboxWrapper.classList.add('indeterminate');
                    groupCheckboxWrapper.classList.remove('checked');
                } else {
                    groupCheckbox.checked = false;
                    groupCheckbox.indeterminate = false;
                    groupCheckboxWrapper.classList.remove('checked', 'indeterminate');
                }
            };
            
            updateGroupCheckbox(); // Initial state
            
            groupCheckboxWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedInGroup = videoBmIds.filter(id => selectedBookmarkIds.has(id)).length;
                if (selectedInGroup === videoBmIds.length) {
                    videoBmIds.forEach(id => selectedBookmarkIds.delete(id));
                } else {
                    videoBmIds.forEach(id => selectedBookmarkIds.add(id));
                }
                
                updateGroupCheckbox();
                updateActionBar();
                
                // Update all sub-checkboxes visually without re-rendering
                contentEl.querySelectorAll('.sub-checkbox').forEach((wrapper, idx) => {
                    const bmId = videoBmIds[idx];
                    const isChecked = selectedBookmarkIds.has(bmId);
                    wrapper.querySelector('input').checked = isChecked;
                    if (isChecked) wrapper.classList.add('checked');
                    else wrapper.classList.remove('checked');
                });
            });

            const header = groupCard.querySelector('.bookmark-group-header');
            header.addEventListener('click', (e) => {
                if (e.target.closest('.group-checkbox')) return;
                const isExpanded = groupCard.classList.contains('expanded');
                
                // Close all others
                cards.forEach(c => c.classList.remove('expanded'));
                contents.forEach(c => c.remove());
                
                if (!isExpanded) {
                    groupCard.classList.add('expanded');
                    const lastCardIndex = Math.min(cards.length - 1, Math.floor(index / 4) * 4 + 3);
                    cards[lastCardIndex].after(contentEl);
                }
            });
            
            group.bookmarks.forEach(bm => {
                const date = new Date(bm.createdAt).toLocaleDateString();
                const subCard = document.createElement('div');
                subCard.className = 'bookmark-sub-card';
                
                const isSelected = selectedBookmarkIds.has(bm.id);
                let subThumbHtml = `
                    <div class="bookmark-checkbox-wrapper sub-checkbox ${isSelected ? 'checked' : ''}">
                        <input type="checkbox" class="bookmark-checkbox" ${isSelected ? 'checked' : ''}>
                    </div>`;
                
                if (bm.image) {
                    subThumbHtml += `
                    <div class="bookmark-sub-thumb-container">
                        <img src="${escapeHTML(bm.image)}" alt="Thumbnail">
                        <span class="bookmark-sub-time">${escapeHTML(formatTime(bm.timestamp))}</span>
                    </div>`;
                } else {
                    subThumbHtml += `
                    <div class="bookmark-sub-thumb-container empty-thumb">
                        <span class="bookmark-sub-time">${escapeHTML(formatTime(bm.timestamp))}</span>
                    </div>`;
                }
                
                subCard.innerHTML = `
                    ${subThumbHtml}
                    <div class="bookmark-sub-text-wrapper">
                        <div class="bookmark-sub-text">"${escapeHTML(bm.text)}"</div>
                        <input type="text" class="bookmark-sub-edit-input" style="display: none;" value="${escapeHTML(bm.text)}">
                        <div class="bookmark-sub-date">${escapeHTML(date)}</div>
                    </div>
                    <div class="bookmark-sub-actions">
                        <button class="bookmark-sub-action-btn bookmark-sub-edit" title="Edit Title">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button class="bookmark-sub-action-btn bookmark-sub-delete" data-id="${escapeHTML(bm.id)}" title="Delete Bookmark">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                        </button>
                    </div>
                `;
                
                const subCheckboxWrapper = subCard.querySelector('.sub-checkbox');
                subCheckboxWrapper.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isChecked = selectedBookmarkIds.has(bm.id);
                    if (isChecked) {
                        selectedBookmarkIds.delete(bm.id);
                        subCheckboxWrapper.querySelector('input').checked = false;
                        subCheckboxWrapper.classList.remove('checked');
                    } else {
                        selectedBookmarkIds.add(bm.id);
                        subCheckboxWrapper.querySelector('input').checked = true;
                        subCheckboxWrapper.classList.add('checked');
                    }
                    updateActionBar();
                    updateGroupCheckbox();
                });

                subCard.addEventListener('click', (e) => {
                    if (e.target.closest('.bookmark-sub-action-btn') || e.target.closest('.sub-checkbox') || e.target.closest('.bookmark-sub-edit-input')) return;
                    const url = `https://www.youtube.com/watch?v=${bm.videoId}&t=${Math.floor(bm.timestamp)}s`;
                    chrome.tabs.create({ url });
                });
                

                const editBtn = subCard.querySelector('.bookmark-sub-edit');
                const textEl = subCard.querySelector('.bookmark-sub-text');
                const inputEl = subCard.querySelector('.bookmark-sub-edit-input');

                const saveEdit = () => {
                    const newText = inputEl.value.trim();
                    if (newText && newText !== bm.text) {
                        bm.text = newText;
                        textEl.textContent = `"${newText}"`;
                        chrome.runtime.sendMessage({ action: 'IDB_SET', storeName: 'bookmarks', key: bm.id, data: bm });
                    }
                    inputEl.style.display = 'none';
                    textEl.style.display = '-webkit-box';
                };

                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    textEl.style.display = 'none';
                    inputEl.style.display = 'block';
                    inputEl.focus();
                });

                inputEl.addEventListener('blur', saveEdit);
                inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') {
                        inputEl.value = bm.text;
                        inputEl.style.display = 'none';
                        textEl.style.display = '-webkit-box';
                    }
                });
                
                const delBtn = subCard.querySelector('.bookmark-sub-delete');
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Delete this bookmark?')) {
                        allBookmarks = allBookmarks.filter(b => b.id !== bm.id);
                        chrome.runtime.sendMessage({ action: 'IDB_DELETE', storeName: 'bookmarks', key: bm.id }, () => {
                            renderBookmarks(searchInput ? searchInput.value.toLowerCase().trim() : '');
                        });
                    }
                });
                
                contentEl.appendChild(subCard);
            });
            
            cards.push(groupCard);
            contents.push(contentEl);
        });

        cards.forEach((c, index) => {
            listEl.appendChild(c);
            if (filter !== '') {
                c.classList.add('expanded');
                const lastCardIndex = Math.min(cards.length - 1, Math.floor(index / 4) * 4 + 3);
                listEl.insertBefore(contents[index], cards[lastCardIndex].nextSibling);
            }
        });
    };

    const loadBookmarks = () => {
        chrome.runtime.sendMessage({ action: 'IDB_GET_ALL', storeName: 'bookmarks' }, (response) => {
            if (response && response.success && Array.isArray(response.result)) {
                // response.result is an array of { key, value } objects
                allBookmarks = response.result.map(r => r.value).sort((a, b) => b.createdAt - a.createdAt);
            } else {
                allBookmarks = [];
            }
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

    // Initial load if already on bookmarks tab or if it's the saved last tab
    const bookmarksTab = document.getElementById('tab-bookmarks');
    const lastTab = localStorage.getItem('ypp-last-tab');
    if ((bookmarksTab && bookmarksTab.classList.contains('active')) || lastTab === 'bookmarks') {
        loadBookmarks();
    }
}

// =========================================================================
// PLAYER BAR ORGANIZER
// =========================================================================
