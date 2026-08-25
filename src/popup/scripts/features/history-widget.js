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

