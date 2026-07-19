// popup-extras.js — History Widget, Backup Tools, and Bookmarks Manager
// All code is wrapped in exported functions. No side-effects at module level.

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

export function initHistoryWidget() {
    renderHeatmap();
    setupCalendarListeners();
}

function parseStorageData(raw) {
    if (!raw) return null;
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return parsed.data !== undefined ? parsed.data : parsed;
        } catch(e) {
            return raw;
        }
    }
    return raw;
}

function setupCalendarListeners() {
    const btn = document.getElementById('history-calendar-btn');
    const panel = document.getElementById('history-details-panel');

    if (btn && panel) {
        btn.addEventListener('click', () => {
            panel.classList.toggle('active');
            if (panel.classList.contains('active')) {
                renderCalendar(currentCalDate);
            }
        });
    }

    document.getElementById('cal-prev')?.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() - 1);
        renderCalendar(currentCalDate);
    });

    document.getElementById('cal-next')?.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        renderCalendar(currentCalDate);
    });
}

function renderHeatmap() {
    const heatmapContainer = document.getElementById('history-heatmap');
    const todayDisplay = document.getElementById('history-today-time');
    if (!heatmapContainer) return;

    const daysToShow = 30;
    const dates = [];
    const today = new Date();
    for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const keys = dates.map(date => `ypp_analytics_${date}`);
    const todayKey = `ypp_analytics_${today.toISOString().split('T')[0]}`;

    chrome.storage.local.get([...keys, todayKey], (result) => {
        // Update today's display
        const todayData = parseStorageData(result[todayKey]);
        let todaySeconds = 0;
        if (typeof todayData === 'number') todaySeconds = todayData;
        else if (todayData && todayData.totalSeconds) todaySeconds = todayData.totalSeconds;

        if (todayDisplay) {
            const h = Math.floor(todaySeconds / 3600);
            const m = Math.floor((todaySeconds % 3600) / 60);
            todayDisplay.textContent = h > 0 ? `${h}h ${m}m` : `${m}m`;
        }

        // Render Heatmap
        heatmapContainer.innerHTML = '';
        dates.forEach(date => {
            const dayData = parseStorageData(result[`ypp_analytics_${date}`]);
            let seconds = 0;
            if (typeof dayData === 'number') seconds = dayData;
            else if (dayData && dayData.totalSeconds) seconds = dayData.totalSeconds;

            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            const minutes = Math.floor(seconds / 60);
            cell.title = `${date}: ${minutes}m`;

            if (seconds > 0) {
                if (seconds < 15 * 60) cell.classList.add('level-1');
                else if (seconds < 60 * 60) cell.classList.add('level-2');
                else if (seconds < 180 * 60) cell.classList.add('level-3');
                else cell.classList.add('level-4');
            }
            heatmapContainer.appendChild(cell);
        });
    });
}

function renderCalendar(date) {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('cal-month-year');
    if (!grid || !label) return;

    grid.innerHTML = '';
    label.textContent = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Day name headers
    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(d => {
        const headerCell = document.createElement('div');
        headerCell.className = 'calendar-day-name';
        headerCell.textContent = d;
        grid.appendChild(headerCell);
    });

    // Empty slots for start
    for (let i = 0; i < startingDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-empty';
        grid.appendChild(empty);
    }

    // Fetch data for the whole month
    const dateKeys = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        dateKeys.push(`ypp_analytics_${dayString}`);
    }

    chrome.storage.local.get(dateKeys, (result) => {
        for (let i = 1; i <= daysInMonth; i++) {
            const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const data = parseStorageData(result[`ypp_analytics_${dayString}`]);

            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.textContent = i;

            if (data) {
                if ((typeof data === 'number' && data > 60) || (data.totalSeconds && data.totalSeconds > 60)) {
                    cell.classList.add('has-data');
                }
            }

            if (selectedCalDateString === dayString) {
                cell.classList.add('selected');
            }

            cell.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                cell.classList.add('selected');
                selectedCalDateString = dayString;
                renderVideoList(data);

                const topTime = document.getElementById('history-today-time');
                const topLabel = document.querySelector('.daily-stat .label');

                let seconds = 0;
                if (data) {
                    if (typeof data === 'number') seconds = data;
                    else if (data.totalSeconds) seconds = data.totalSeconds;
                }

                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                if (topTime) topTime.textContent = h > 0 ? `${h}h ${m}m` : `${m}m`;

                if (topLabel) {
                    const todayStr = new Date().toISOString().split('T')[0];
                    if (dayString === todayStr) {
                        topLabel.textContent = "TODAY'S WATCH TIME";
                    } else {
                        const d = new Date(year, month, i);
                        const formatted = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                        topLabel.textContent = `${formatted.toUpperCase()} WATCH TIME`;
                    }
                }
            });

            grid.appendChild(cell);
        }
    });
}

function renderVideoList(data) {
    const list = document.getElementById('video-log-list');
    if (!list) return;
    list.innerHTML = '';

    if (!data) {
        list.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">No history for this date</div>';
        return;
    }

    let videos = [];
    if (typeof data === 'number') {
        list.innerHTML = `<div style="text-align:center; padding:20px; color:#aaa;">Legacy data: ${Math.floor(data / 60)} mins recorded. (Details unavailable)</div>`;
        return;
    } else if (data.videos) {
        videos = Object.values(data.videos);
    }

    if (videos.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">No videos recorded</div>';
        return;
    }

    videos.sort((a, b) => b.lastWatched - a.lastWatched);

    videos.forEach(v => {
        const el = document.createElement('div');
        el.className = 'log-item';
        const m = Math.floor(v.seconds / 60);
        const s = v.seconds % 60;
        const timeStr = m > 0 ? `${m}m` : `${s}s`;
        el.innerHTML = `
            <div class="log-time">${escapeHTML(timeStr)}</div>
            <div class="log-info">
               <a href="${escapeHTML(v.url)}" target="_blank" class="log-title" title="${escapeHTML(v.title)}">${escapeHTML(v.title)}</a>
               <div class="log-channel">${escapeHTML(v.channel)}</div>
            </div>
        `;
        list.appendChild(el);
    });
}

// =========================================================================
// BACKUP TOOLS
// =========================================================================

export function initBackupTools() {
    // --- Local folder export/import ---
    const exportBtn = document.getElementById('exportFoldersBtn');
    const importBtn = document.getElementById('importFoldersBtn');
    const fileInput = document.getElementById('importFoldersFile');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            chrome.storage.local.get(['ypp_subscription_folders', 'ypp_folder_config'], (result) => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
                const a = document.createElement('a');
                a.setAttribute('href', dataStr);
                a.setAttribute('download', 'ypp_folders_backup_' + new Date().toISOString().split('T')[0] + '.json');
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
        });
    }

    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (event) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (importedData.ypp_subscription_folders) {
                        chrome.storage.local.set({
                            'ypp_subscription_folders': importedData.ypp_subscription_folders,
                            'ypp_folder_config': importedData.ypp_folder_config || {}
                        }, () => {
                            alert('Folders imported successfully! Please refresh YouTube.');
                        });
                    } else {
                        alert('Invalid backup file format.');
                    }
                } catch (err) {
                    alert('Error reading file.');
                }
            };
            if (event.target.files[0]) {
                fileReader.readAsText(event.target.files[0]);
            }
        });
    }

    // --- Cloud backup (Google Drive) ---
    const btnBackupUp = document.getElementById('btnBackupUp');
    const btnBackupDown = document.getElementById('btnBackupDown');
    const lastSyncTimeLabel = document.getElementById('lastSyncTimeLabel');

    const updateLastSyncLabel = (timeStr) => {
        if (!lastSyncTimeLabel) return;
        if (!timeStr) {
            lastSyncTimeLabel.textContent = 'Last sync: Never';
            return;
        }
        const date = new Date(timeStr);
        const formatted = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastSyncTimeLabel.textContent = `Last sync: ${formatted}`;
    };

    chrome.storage.local.get('ypp_last_sync_time', (data) => {
        updateLastSyncLabel(data.ypp_last_sync_time || null);
    });

    if (btnBackupUp) {
        btnBackupUp.addEventListener('click', () => {
            const originalHTML = btnBackupUp.innerHTML;
            btnBackupUp.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"></path></svg> Backing up...';
            btnBackupUp.style.pointerEvents = 'none';

            chrome.runtime.sendMessage({ action: 'SYNC_BACKUP_UP' }, (response) => {
                btnBackupUp.style.pointerEvents = 'auto';
                if (response && response.success) {
                    btnBackupUp.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Success!';
                    updateLastSyncLabel(response.timestamp);
                    setTimeout(() => { btnBackupUp.innerHTML = originalHTML; }, 2000);
                } else {
                    btnBackupUp.innerHTML = 'Error!';
                    setTimeout(() => { btnBackupUp.innerHTML = originalHTML; }, 2000);
                    alert('Backup failed. Please ensure you are signed into Chrome.');
                }
            });
        });
    }

    if (btnBackupDown) {
        btnBackupDown.addEventListener('click', () => {
            if (!confirm('This will OVERWRITE your current local data with the Google Drive backup. Proceed?')) return;

            const originalHTML = btnBackupDown.innerHTML;
            btnBackupDown.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"></path></svg> Restoring...';
            btnBackupDown.style.pointerEvents = 'none';

            chrome.runtime.sendMessage({ action: 'SYNC_BACKUP_DOWN' }, (response) => {
                btnBackupDown.style.pointerEvents = 'auto';
                if (response && response.success) {
                    btnBackupDown.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Restored!';
                    if (response.timestamp) updateLastSyncLabel(response.timestamp);
                    setTimeout(() => { btnBackupDown.innerHTML = originalHTML; }, 2000);
                } else {
                    btnBackupDown.innerHTML = 'Error!';
                    setTimeout(() => { btnBackupDown.innerHTML = originalHTML; }, 2000);
                    alert('Restore failed. No backup found or authentication error.');
                }
            });
        });
    }
}

// =========================================================================
// BOOKMARKS MANAGER
// =========================================================================

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
        pb_pip: { label: 'Picture-in-Picture', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4-7H1v16h22V4zm-2 14H3V6h18v12z"/></svg>' },
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
