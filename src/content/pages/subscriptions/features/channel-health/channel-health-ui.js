/**
 * Channel Health UI
 * Owns: DOM rendering, scanning, animations, and modal dialog for the Channel Health Dashboard.
 * Relies on ChannelHealthAPI for YouTube communications.
 * Does not affect functionality outside the Channel Health feature.
 */
import anime from 'animejs/lib/anime.es.js';
import { CustomDialog } from './custom-dialog.js';
import { ChannelHealthAPI } from './channel-health-api.js';
import { ChannelHealthDB } from './channel-health-db.js';

export class ChannelHealthUI {
    static featureId = 'channelHealthUI';
    static executionPhase = 'idle';
    static priority = 999;

    static openModal() {
        if (document.getElementById('ypp-health-modal')) return;

        const overlay = document.createElement('div');
        overlay.className = 'ypp-health-modal-overlay open';
        overlay.id = 'ypp-health-modal';
        document.documentElement.appendChild(overlay);

        overlay.innerHTML = String.raw`
            <div class="ypp-health-modal-content ypp-organizer-modal">
                <div class="ypp-health-header">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div class="ypp-health-header-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <span class="ypp-modal-title" style="font-size: 24px; font-weight: 600; color: #fff; letter-spacing: -0.5px;">Channel Health Dashboard</span>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button id="ypp-health-scan-btn" class="ypp-health-btn-scan">Start Scan</button>
                        </div>
                        <button id="ypp-health-unsub-btn" class="ypp-health-btn-unsub" style="display: none;">Unsubscribe Selected</button>
                        <button id="ypp-health-unsub-history-btn" class="ypp-health-btn-secondary" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer;">Unsubscribed History</button>
                        
                        <div style="width: 1px; height: 24px; background: rgba(255,255,255,0.1); margin: 0 8px;"></div>
                        <button class="ypp-modal-close ypp-health-btn-close">&times;</button>
                    </div>
                </div>
                <div class="ypp-organizer-body" style="flex-direction: row; padding: 32px; overflow: hidden; display: flex; flex: 1; background: transparent; gap: 32px;">
                    <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                        <div style="display: flex; gap: 24px; margin-bottom: 24px;">
                            <div class="ypp-health-stat" data-filter="active">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#2ed573;"></div> Active (< 30 days)</div>
                                <div class="ypp-health-stat-value" id="ypp-health-active">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="warning">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#ffb340;"></div> Inactive (> 1 month)</div>
                                <div class="ypp-health-stat-value" style="color: rgba(241, 245, 249, 0.8);" id="ypp-health-warning">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="dead">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#ff4e45;"></div> Dead (> 3 months)</div>
                                <div class="ypp-health-stat-value" style="color: rgba(241, 245, 249, 0.5);" id="ypp-health-dead">0</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; margin-bottom: 16px; align-items: center;">
                            <div style="display: flex; gap: 8px; margin-right: auto; flex-shrink:0;">
                                <button id="ypp-health-select-all-btn" class="ypp-health-btn-secondary" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer;">Select All Visible</button>
                                <button id="ypp-health-unselect-all-btn" class="ypp-health-btn-tertiary" style="background: rgba(255,255,255,0.02); color: #94a3b8; border: 1px solid rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer;">Unselect All</button>
                                <button id="ypp-health-unsub-btn-bottom" class="ypp-health-btn-unsub" style="display: none; background: rgba(255, 78, 69, 0.15); color: #ff6b6b; border: 1px solid rgba(255, 78, 69, 0.4); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Unsubscribe Selected</button>
                                <button id="ypp-health-export-btn" class="ypp-health-btn-secondary" style="display: none; background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; margin-left: 8px;">Export CSV</button>
                            </div>
                            <div style="display:flex;gap:3px;align-items:center;flex-shrink:0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:3px;">
                                <button class="ypp-ctype-btn ypp-ctype-active" data-ctype="all" style="border-radius:7px;padding:5px 11px;">All</button>
                                <button class="ypp-ctype-btn" data-ctype="video" style="border-radius:7px;padding:5px 11px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;opacity:0.9"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>Videos</button>
                                <button class="ypp-ctype-btn" data-ctype="short" style="border-radius:7px;padding:5px 11px;"><svg width="9" height="11" viewBox="0 0 18 24" fill="currentColor" style="flex-shrink:0;opacity:0.9"><rect x="0" y="0" width="18" height="24" rx="4"/><path d="M6.5 8.5l6 3.5-6 3.5V8.5z" fill="rgba(0,0,0,0.45)"/></svg>Shorts</button>
                            </div>
                            <div style="position: relative; flex: 1; max-width: 200px; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" style="position: absolute; left: 14px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" class="ypp-health-input" id="ypp-health-search-input" placeholder="Search channels..." style="width: 100%; padding: 10px 16px 10px 38px;"/>
                            </div>

                            <select id="ypp-health-filter-dropdown" class="ypp-health-select">
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="warning">Inactive</option>
                                <option value="dead">Dead</option>
                            </select>
                            <select id="ypp-health-sort-dropdown" class="ypp-health-select">
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="az">Alphabetical</option>
                            </select>
                        </div>
                        <div id="ypp-health-results" class="ypp-scroll-list" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 8px;">
                            <div style="text-align: center; color: #666; margin-top: 60px; font-size: 16px; font-weight: 500;">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; display:block; margin-left:auto; margin-right:auto;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                Click "Start Scan" to fetch channel data.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Animate entrance using anime.js
        window.anime?.({
            targets: '.ypp-organizer-modal',
            opacity: [0, 1],
            scale: [0.95, 1],
            easing: 'spring(1, 80, 10, 0)',
            duration: 600
        });

        overlay.querySelector('.ypp-modal-close')?.addEventListener('click', () => {
            overlay.classList.remove('open');
            setTimeout(() => overlay.remove(), 300);
        });

        const filterSel = overlay.querySelector('#ypp-health-filter-dropdown');
        const sortSel = overlay.querySelector('#ypp-health-sort-dropdown');
        const resultsEl = overlay.querySelector('#ypp-health-results');
        const searchInput = overlay.querySelector('#ypp-health-search-input');
        const stats = overlay.querySelectorAll('.ypp-health-stat');

        const selectAllBtn = overlay.querySelector('#ypp-health-select-all-btn');
        const unselectAllBtn = overlay.querySelector('#ypp-health-unselect-all-btn');

        selectAllBtn?.addEventListener('click', () => {
            const rows = resultsEl.querySelectorAll('.ypp-channel-health-row');
            let changed = false;
            rows.forEach(row => {
                if (row.style.display !== 'none') {
                    const cb = row.querySelector('.ypp-unsub-checkbox');
                    if (cb && !cb.disabled && !cb.checked) {
                        cb.checked = true;
                        changed = true;
                    }
                }
            });
            if (changed) {
                resultsEl.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        unselectAllBtn?.addEventListener('click', () => {
            const checkboxes = resultsEl.querySelectorAll('.ypp-unsub-checkbox:checked');
            if (checkboxes.length > 0) {
                checkboxes.forEach(cb => { if (!cb.disabled) cb.checked = false; });
                resultsEl.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // ── Content Type Filter ──────────────────────────────────────
        let currentContentType = 'all';

        const recomputeStatCounts = () => {
            const channels = ChannelHealthUI._lastScanChannels;
            if (!channels) return;
            let a = 0, w = 0, d = 0;
            channels.forEach(ch => {
                let status;
                if      (currentContentType === 'video') status = ch.videoInfo?.status || 'dead';
                else if (currentContentType === 'short') status = ch.shortInfo?.status || 'dead';
                else if (currentContentType === 'post')  status = ch.postInfo?.status  || 'dead';
                else                                      status = ch.status;
                if      (status === 'active')  a++;
                else if (status === 'warning') w++;
                else                           d++;
            });
            overlay.querySelector('#ypp-health-active').textContent  = a;
            overlay.querySelector('#ypp-health-warning').textContent = w;
            overlay.querySelector('#ypp-health-dead').textContent    = d;
        };

        const ctypeBtns = overlay.querySelectorAll('.ypp-ctype-btn');
        ctypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                ctypeBtns.forEach(b => b.classList.remove('ypp-ctype-active'));
                btn.classList.add('ypp-ctype-active');
                currentContentType = btn.dataset.ctype;
                recomputeStatCounts();
                updateView();
            });
        });

        overlay.querySelector('#ypp-health-scan-btn')?.addEventListener('click', () => {
            this.runScan(overlay, filterSel, sortSel, searchInput);
        });

        overlay.querySelector('#ypp-health-unsub-btn')?.addEventListener('click', () => {
            this.bulkUnsubscribe(overlay);
        });

        overlay.querySelector('#ypp-health-unsub-btn-bottom')?.addEventListener('click', () => {
            this.bulkUnsubscribe(overlay);
        });

        const updateView = () => {
            if (!filterSel || !sortSel) return;
            const filter  = filterSel.value;
            const sort    = sortSel.value;
            const searchQ = searchInput ? searchInput.value.toLowerCase().trim() : '';

            stats.forEach(s => {
                s.style.background = s.dataset.filter === filter
                    ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)';
            });

            const rows = Array.from(resultsEl.querySelectorAll('.ypp-channel-health-row'));

            rows.sort((a, b) => {
                if (sort === 'az') return a.dataset.name.localeCompare(b.dataset.name);
                let timeA, timeB;
                if (currentContentType === 'video') {
                    timeA = parseFloat(a.dataset.videoUploadTime) || Infinity;
                    timeB = parseFloat(b.dataset.videoUploadTime) || Infinity;
                } else if (currentContentType === 'short') {
                    timeA = parseFloat(a.dataset.shortUploadTime) || Infinity;
                    timeB = parseFloat(b.dataset.shortUploadTime) || Infinity;
                } else {
                    timeA = parseFloat(a.dataset.uploadTime) || Infinity;
                    timeB = parseFloat(b.dataset.uploadTime) || Infinity;
                }
                if (sort === 'latest') return timeA - timeB;
                if (sort === 'oldest') return timeB - timeA;
                return 0;
            });

            rows.forEach(row => {
                resultsEl.appendChild(row);
                let rowStatus;
                if      (currentContentType === 'video') rowStatus = row.dataset.videoStatus || 'dead';
                else if (currentContentType === 'short') rowStatus = row.dataset.shortStatus || 'dead';
                else if (currentContentType === 'post')  rowStatus = row.dataset.postStatus  || 'dead';
                else                                      rowStatus = row.dataset.status;
                const showByStatus = (filter === 'all' || rowStatus === filter);
                const showBySearch = !searchQ || row.dataset.name.toLowerCase().includes(searchQ);
                row.style.display  = (showByStatus && showBySearch) ? 'flex' : 'none';
            });
        };

        stats.forEach(stat => {
            stat.addEventListener('click', () => {
                filterSel.value = filterSel.value === stat.dataset.filter ? 'all' : stat.dataset.filter;
                updateView();
            });
        });

        filterSel?.addEventListener('change', updateView);
        sortSel?.addEventListener('change',   updateView);
        if (searchInput) searchInput.addEventListener('input', updateView);
    }

    static async runScan(overlay, filterSel, sortSel, searchInput, skipFetch = false) {
        const btn = overlay.querySelector('#ypp-health-scan-btn');
        const resultsEl = overlay.querySelector('#ypp-health-results');
        
        btn.textContent = 'Scanning...';
        btn.disabled = true;
        btn.style.opacity = '0.5';
        resultsEl.innerHTML = `
            <div id="ypp-scan-status" style="text-align:center; color:#aaa; margin-top:40px; font-size:14px;">
                <div style="margin-bottom:12px;">Fetching subscriptions list...</div>
                <div id="ypp-scan-progress" style="font-size:12px; color:#777;"></div>
            </div>`;

        const progressEl = overlay.querySelector('#ypp-scan-progress');
        const statusEl   = overlay.querySelector('#ypp-scan-status div');

        try {
            let channels = [];
            const skipFullScan = skipFetch && ChannelHealthUI._lastScanChannels;
            
            if (skipFullScan) {
                channels = ChannelHealthUI._lastScanChannels;
                if (statusEl) statusEl.remove();
                btn.textContent = 'Updating UI...';
            } else {
                channels = await ChannelHealthAPI.fetchSubscriptions((count) => {
                    if (statusEl) statusEl.textContent = `Fetching subscriptions list... (${count} found so far)`;
                });
            }

            if (channels.length === 0) {
                resultsEl.innerHTML = '<div style="text-align:center;color:rgba(255, 78, 69, 0.8);margin-top:40px;">No subscriptions found.</div>';
                btn.textContent = 'Scan Complete';
                btn.disabled = false;
                btn.style.opacity = '1';
                return;
            }

            resultsEl.innerHTML = `
                <div id="ypp-health-results-list" style="display:flex; flex-direction:column; gap:12px;"></div>
            `;
            if (statusEl) statusEl.remove();

            const resultsListEl = overlay.querySelector('#ypp-health-results-list');
            
            // Add skeleton loaders
            for(let i=0; i<Math.min(channels.length, 12); i++) {
                const skel = document.createElement('div');
                skel.className = 'ypp-health-skeleton-row';
                skel.innerHTML = `
                    <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.05);margin-right:16px;"></div>
                    <div style="flex:1;">
                        <div style="width:40%;height:14px;background:rgba(255,255,255,0.05);border-radius:4px;margin-bottom:8px;"></div>
                        <div style="width:25%;height:10px;background:rgba(255,255,255,0.05);border-radius:4px;"></div>
                    </div>
                `;
                skel.style.cssText = 'display:flex;align-items:center;padding:14px 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:16px;animation:ypp-pulse 1.5s infinite ease-in-out;';
                resultsListEl.appendChild(skel);
            }

            const now = Date.now();
            const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
            let activeCount = 0, warningCount = 0, deadCount = 0, doneCount = 0;

            const updateCounters = () => {
                overlay.querySelector('#ypp-health-active').textContent  = activeCount;
                overlay.querySelector('#ypp-health-warning').textContent = warningCount;
                overlay.querySelector('#ypp-health-dead').textContent    = deadCount;
                btn.textContent = `Scanning… ${doneCount}/${channels.length}`;
                
                if (doneCount >= channels.length) {
                    const exportBtn = overlay.querySelector('#ypp-health-export-btn');
                    if (exportBtn) {
                        exportBtn.style.display = 'inline-block';
                        exportBtn.onclick = () => {
                            const csvContent = "data:text/csv;charset=utf-8," 
                                + "Channel Name,Channel URL,Last Upload Date,Status\n"
                                + channels.map(c => `"${(c.name || '').replace(/"/g, '""')}","https://youtube.com/channel/${c.id}","${c.lastUploadText}","${c.status}"`).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "youtube_channel_health.csv");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        };
                    }
                }
            };

            const buildRow = (c) => {
                const colorMap = { active: '#2ed573', warning: '#ffb340', dead: '#ff4e45' };
                const color = colorMap[c.status] || '#94a3b8';

                const row = document.createElement('div');
                row.className = 'ypp-channel-health-row';
                row.dataset.status          = c.status;
                row.dataset.name            = c.name;
                row.dataset.uploadTime      = c.lastUpload != null ? c.lastUpload : Infinity;
                row.dataset.videoStatus     = c.videoInfo?.status || 'none';
                row.dataset.shortStatus     = c.shortInfo?.status || 'none';
                row.dataset.postStatus      = 'unknown';
                row.dataset.videoUploadTime = c.videoInfo ? (now - c.videoInfo.pubTime) : Infinity;
                row.dataset.shortUploadTime = c.shortInfo ? (now - c.shortInfo.pubTime) : Infinity;
                row.style.borderLeft = '4px solid ' + color;

                const img = document.createElement('img');
                img.src = c.icon || '';
                img.className = 'ypp-health-row-avatar';
                img.onerror = function() { this.style.display = 'none'; };
                row.appendChild(img);

                const infoDiv = document.createElement('div');
                infoDiv.style.cssText = 'flex:1;min-width:0;';

                const nameDiv = document.createElement('div');
                nameDiv.style.cssText = 'color:#f1f5f9;font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.2px;';
                nameDiv.textContent = c.name;
                infoDiv.appendChild(nameDiv);

                // ── Content Pills: Video | Short | Post ──────────────────
                const PILL_ICONS = {
                    // Solid video camera
                    video: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>`,
                    // Vertical phone with play triangle
                    short: `<svg width="9" height="12" viewBox="0 0 18 24" fill="currentColor" style="flex-shrink:0"><rect x="0" y="0" width="18" height="24" rx="4"/><path d="M6.5 8.5l6 3.5-6 3.5V8.5z" fill="rgba(0,0,0,0.45)"/></svg>`,
                    // Solid speech bubble (community post)
                    post:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`
                };

                const createPill = (type, info, isUnknown = false) => {
                    const pill = document.createElement('div');
                    pill.className = 'ypp-cpill';
                    pill.dataset.type = type;
                    let statusKey, label;
                    if (isUnknown)  { statusKey = 'unknown'; label = '–'; }
                    else if (!info) { statusKey = 'none';    label = 'None'; }
                    else            { statusKey = info.status; label = info.text; }
                    pill.classList.add(`ypp-cpill-${statusKey}`);
                    pill.innerHTML = `${PILL_ICONS[type]}<span>${label}</span>`;
                    return pill;
                };

                const pillsDiv = document.createElement('div');
                pillsDiv.className = 'ypp-content-pills';
                pillsDiv.appendChild(createPill('video', c.videoInfo));
                pillsDiv.appendChild(createPill('short', c.shortInfo));
                pillsDiv.appendChild(createPill('post', c.postInfo, true));
                infoDiv.appendChild(pillsDiv);

                row.appendChild(infoDiv);

                const actionsDiv = document.createElement('div');
                actionsDiv.style.cssText = 'display:flex;align-items:center;gap:12px;flex-shrink:0;';

                const deepScanBtn = document.createElement('button');
                deepScanBtn.className = 'ypp-health-btn-visit ypp-deep-scan-btn';
                deepScanBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> Deep Scan`;
                deepScanBtn.style.cssText = 'border: 1px solid rgba(255,179,64,0.3); color: #ffb340; background: rgba(255,179,64,0.05); cursor: pointer;';
                deepScanBtn.onclick = async () => {
                    const originalHtml = deepScanBtn.innerHTML;
                    deepScanBtn.innerHTML = 'Scanning...';
                    deepScanBtn.disabled = true;
                    try {
                        const { lastVideoText, lastShortText, lastPostText, oldestVideoText, oldestPostText }
                            = await ChannelHealthAPI.deepScan(c.id);

                        // ── Update latest pills ─────────────────
                        const updatePill = (pill, textVal, type) => {
                            if (!pill || !textVal) return;
                            const isNone  = textVal === 'None' || textVal === 'Error';
                            let statusKey = 'unknown';

                            if (isNone) {
                                statusKey = 'none';
                            } else {
                                const elapsed = ChannelHealthAPI.parseRelativeTime(textVal);
                                if (elapsed !== null) {
                                    const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
                                    if (elapsed < MONTH_MS) statusKey = 'active';
                                    else if (elapsed < 3 * MONTH_MS) statusKey = 'warning';
                                    else statusKey = 'dead';
                                } else {
                                    statusKey = 'warning'; // e.g. "Has Shorts"
                                }
                            }
                            
                            pill.className = `ypp-cpill ypp-cpill-${statusKey}`;
                            pill.innerHTML = `${PILL_ICONS[type]}<span>${isNone ? 'None' : textVal}</span>`;
                            row.dataset[`${type}Status`] = statusKey;
                            
                            if (type === 'video') c.videoInfo = { text: textVal, status: statusKey };
                            if (type === 'short') c.shortInfo = { text: textVal, status: statusKey };
                            if (type === 'post')  c.postInfo  = { text: textVal, status: statusKey };
                        };

                        updatePill(pillsDiv.querySelector('.ypp-cpill[data-type="video"]'), lastVideoText, 'video');
                        updatePill(pillsDiv.querySelector('.ypp-cpill[data-type="short"]'), lastShortText, 'short');
                        updatePill(pillsDiv.querySelector('.ypp-cpill[data-type="post"]'),  lastPostText,  'post');

                        // ── Append history pills ──────────────────────────────
                        const calIcon = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

                        const addHistoryPill = (label, text, colorStyle) => {
                            if (!text) return;
                            const pill = document.createElement('div');
                            pill.className = 'ypp-cpill';
                            pill.style.cssText = colorStyle;
                            pill.innerHTML = `${calIcon}<span>${label}: ${text}</span>`;
                            pillsDiv.appendChild(pill);
                        };

                        // Oldest video — blue
                        addHistoryPill(
                            'Since',
                            oldestVideoText,
                            'background:rgba(96,165,250,0.08);border-color:rgba(96,165,250,0.2);color:#93c5fd;'
                        );
                        // Oldest community post — soft purple
                        addHistoryPill(
                            'First post',
                            oldestPostText,
                            'background:rgba(167,139,250,0.08);border-color:rgba(167,139,250,0.2);color:#c4b5fd;'
                        );

                        deepScanBtn.remove();
                    } catch (e) {
                        deepScanBtn.innerHTML = 'Error';
                        setTimeout(() => { deepScanBtn.innerHTML = originalHtml; deepScanBtn.disabled = false; }, 2000);
                    }
                };

                actionsDiv.appendChild(deepScanBtn);

                const visitLink = document.createElement('a');
                visitLink.href = '/channel/' + c.id;
                visitLink.target = '_blank';
                visitLink.className = 'ypp-health-btn-visit';
                visitLink.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Visit`;
                actionsDiv.appendChild(visitLink);

                const label = document.createElement('label');
                label.className = 'ypp-custom-checkbox-label';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'ypp-unsub-checkbox';
                cb.value = c.id;
                cb.dataset.params = c.unsubParams || '';
                const checkmark = document.createElement('span');
                checkmark.className = 'ypp-custom-checkmark';
                label.appendChild(cb);
                label.appendChild(checkmark);
                const textSpan = document.createElement('span');
                textSpan.textContent = 'Select';
                label.appendChild(textSpan);
                actionsDiv.appendChild(label);

                const indivBtn = document.createElement('button');
                indivBtn.className = 'ypp-indiv-unsub-btn';
                indivBtn.textContent = 'Unsubscribe';
                indivBtn.addEventListener('click', () => this.individualUnsubscribe(c.id, c.unsubParams, c.name, row, indivBtn));
                actionsDiv.appendChild(indivBtn);

                row.appendChild(actionsDiv);
                return row;
            };

            const processChannelUI = (c) => {
                doneCount++;
                const skel = resultsListEl?.querySelector('.ypp-health-skeleton-row');
                if (skel) skel.remove();

                const row = buildRow(c);
                
                let show = true;
                if (filterSel && filterSel.value !== 'all' && c.status !== filterSel.value) show = false;
                if (show && searchInput && searchInput.value) {
                    if (!c.name.toLowerCase().includes(searchInput.value.toLowerCase())) show = false;
                }
                
                row.style.display = show ? 'flex' : 'none';
                if (resultsListEl) {
                    resultsListEl.appendChild(row);
                } else {
                    resultsEl.appendChild(row);
                }
                updateCounters();
            };

            if (skipFullScan) {
                channels.forEach(c => {
                    c.postInfo = null;
                    if (c.status === 'active') activeCount++;
                    else if (c.status === 'warning') warningCount++;
                    else deadCount++;
                    processChannelUI(c);
                });
            } else {
                const RSS_TIMEOUT_MS = 5000;
                const CONCURRENCY_LIMIT = 25;
                let currentIndex = 0;
                
                let healthCache = await ChannelHealthDB.getScanCache();
                if (!healthCache) healthCache = {};
                const CACHE_TTL = 24 * 60 * 60 * 1000; 
                let cacheUpdated = false;

                const classify = (pubTime) => {
                    const diff = now - pubTime;
                    if (diff < MONTH_MS)     return 'active';
                    if (diff < 3 * MONTH_MS) return 'warning';
                    return 'dead';
                };

                const fetchChannel = async (c) => {
                    const cached = healthCache[c.id];
                    if (cached && (now - cached.timestamp < CACHE_TTL)) {
                        c.videoInfo  = cached.videoInfo  || null;
                        c.shortInfo  = cached.shortInfo  || null;
                        c.postInfo   = null;
                        c.status     = cached.status;
                        c.lastUpload = cached.lastUpload;
                        c.lastUploadText = cached.lastUploadText;
                        if      (c.status === 'active')  activeCount++;
                        else if (c.status === 'warning') warningCount++;
                        else                             deadCount++;
                        processChannelUI(c);
                        return;
                    }

                    try {
                        const controller = new AbortController();
                        const tid = setTimeout(() => controller.abort(), RSS_TIMEOUT_MS);
                        const rssRes  = await fetch(`/feeds/videos.xml?channel_id=${c.id}`, { signal: controller.signal });
                        clearTimeout(tid);
                        const rssText = await rssRes.text();

                        const { latestVideo, latestShort } = ChannelHealthAPI.parseRSS(rssText);

                        c.videoInfo = latestVideo
                            ? { pubTime: latestVideo.pubTime, text: latestVideo.text, status: classify(latestVideo.pubTime) }
                            : null;
                        c.shortInfo = latestShort
                            ? { pubTime: latestShort.pubTime, text: latestShort.text, status: classify(latestShort.pubTime) }
                            : null;
                        c.postInfo  = null;

                        // Overall status: whichever of video / short is most recent
                        const candidates = [c.videoInfo, c.shortInfo].filter(Boolean);
                        if (candidates.length > 0) {
                            const best = candidates.reduce((a, b) => a.pubTime > b.pubTime ? a : b);
                            c.lastUpload     = now - best.pubTime;
                            c.lastUploadText = best.text;
                            c.status         = best.status;
                        } else {
                            c.lastUpload     = Infinity;
                            c.lastUploadText = 'No content';
                            c.status         = 'dead';
                        }

                        if      (c.status === 'active')  activeCount++;
                        else if (c.status === 'warning') warningCount++;
                        else                             deadCount++;

                        healthCache[c.id] = {
                            videoInfo:       c.videoInfo,
                            shortInfo:       c.shortInfo,
                            status:          c.status,
                            lastUpload:      c.lastUpload,
                            lastUploadText:  c.lastUploadText,
                            timestamp:       now
                        };
                        cacheUpdated = true;

                    } catch (e) {
                        c.videoInfo  = null;
                        c.shortInfo  = null;
                        c.postInfo   = null;
                        c.status     = e.name === 'AbortError' ? 'warning' : 'dead';
                        c.lastUploadText = e.name === 'AbortError' ? 'Timeout' : 'Error';
                        c.lastUpload = Infinity;
                        if (c.status === 'warning') warningCount++; else deadCount++;
                    }
                    processChannelUI(c);
                };

                const worker = async () => {
                    while (currentIndex < channels.length) {
                        const c = channels[currentIndex++];
                        await fetchChannel(c);
                    }
                };

                const workers = Array.from({ length: Math.min(CONCURRENCY_LIMIT, channels.length) }, () => worker());
                await Promise.all(workers);
                
                if (cacheUpdated) {
                    await ChannelHealthDB.saveScanCache(healthCache);
                }
                
                ChannelHealthUI._lastScanChannels = channels;
            } 

            btn.textContent = `Scan Complete (${channels.length})`;
            btn.disabled = false;
            btn.style.opacity = '1';

            if (!overlay._checkboxListenerAttached) {
                overlay._checkboxListenerAttached = true;
                resultsEl.addEventListener('change', (e) => {
                    if (!e.target.classList.contains('ypp-unsub-checkbox')) return;
                    const n = resultsEl.querySelectorAll('.ypp-unsub-checkbox:checked').length;
                    const unsubBtn = overlay.querySelector('#ypp-health-unsub-btn');
                    const unsubBtnBottom = overlay.querySelector('#ypp-health-unsub-btn-bottom');

                    if (unsubBtn) {
                        unsubBtn.textContent = n > 0 ? `Unsubscribe Selected (${n})` : 'Unsubscribe Selected';
                        unsubBtn.disabled = n === 0;
                        unsubBtn.style.display = n > 1 ? 'inline-block' : 'none';
                    }
                    if (unsubBtnBottom) {
                        unsubBtnBottom.textContent = n > 0 ? `Unsubscribe Selected (${n})` : 'Unsubscribe Selected';
                        unsubBtnBottom.style.display = n > 1 ? 'inline-block' : 'none';
                    }
                });
            }

            if (filterSel) filterSel.dispatchEvent(new Event('change'));

        } catch (e) {
            window.YPP.Utils?.log('Scan error', 'CHANNEL-HEALTH', 'error', e);
            resultsEl.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.8);margin-top:40px;font-size:14px;">Scan failed: ' + (e.message || 'Unknown error') + '</div>';
            btn.textContent = 'Retry Scan';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }

    static async individualUnsubscribe(channelId, params, channelName, rowEl, btnEl) {
        const confirmed = await CustomDialog.confirm(
            'Unsubscribe',
            `Unsubscribe from ${channelName}?`,
            'Unsubscribe',
            true
        );
        if (!confirmed) return;

        const originalText = btnEl.textContent;
        btnEl.textContent = 'Unsubscribing...';
        btnEl.disabled = true;

        const resetBtn = (text, color) => {
            btnEl.textContent = text;
            btnEl.disabled = false;
            if (color) {
                btnEl.style.color = color;
                btnEl.style.borderColor = color;
            }
        };

        try {
            const config = await ChannelHealthAPI.getYoutubeConfig();

            if (!config.apiKey || !config.context) {
                resetBtn(originalText, null);
                await CustomDialog.alert('Auth Error', 'Could not get YouTube credentials. Please refresh and try again.');
                return;
            }

            let succeeded = await ChannelHealthAPI._tryApiUnsubscribe({ id: channelId, params, name: channelName }, config);
            if (!succeeded) succeeded = await ChannelHealthAPI._tryFreshApiUnsubscribe(channelId, config);
            if (!succeeded) succeeded = await ChannelHealthAPI._tryNativeDomUnsubscribe(channelId);
            if (!succeeded) succeeded = await ChannelHealthAPI._tryIframeUnsubscribe(channelId);

            if (succeeded) {
                rowEl.style.transition = 'opacity 0.4s ease';
                rowEl.style.opacity = '0.35';
                btnEl.textContent = '✓ Unsubscribed';
                btnEl.style.color = 'rgba(255, 255, 255, 0.8)';
                btnEl.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                btnEl.disabled = true;
                
                const icon = rowEl.querySelector('img')?.src || '';
                ChannelHealthDB.addUnsubChannel({ id: channelId, name: channelName, icon, unsubTime: Date.now() }).catch(() => {});

                const cb = rowEl.querySelector('.ypp-unsub-checkbox');
                if (cb) { cb.disabled = true; cb.checked = false; }
                
                setTimeout(() => {
                    rowEl.style.maxHeight = rowEl.offsetHeight + 'px';
                    rowEl.style.overflow = 'hidden';
                    rowEl.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, margin 0.4s ease';
                    requestAnimationFrame(() => {
                        rowEl.style.maxHeight = '0';
                        rowEl.style.opacity = '0';
                        rowEl.style.marginBottom = '0';
                    });
                    setTimeout(() => rowEl.remove(), 450);
                }, 1200);
            } else {
                resetBtn(originalText, 'rgba(255, 255, 255, 0.8)');
                setTimeout(() => resetBtn(originalText, null), 3000);
                await CustomDialog.alert(
                    'Unsubscribe Failed',
                    `Could not unsubscribe from ${channelName}.\n\nYouTube may have blocked the request. Try visiting the channel page directly.`
                );
            }
        } catch (e) {
            window.YPP.Utils?.log('individualUnsubscribe error', 'CHANNEL-HEALTH', 'error', e);
            resetBtn(originalText, null);
        }
    }

    static async bulkUnsubscribe(overlay) {
        const checkboxes = overlay.querySelectorAll('.ypp-unsub-checkbox:checked');
        if (checkboxes.length === 0) return;

        if (!(await CustomDialog.confirm('Bulk Unsubscribe', `Are you sure you want to permanently unsubscribe from ${checkboxes.length} channels?`, 'Unsubscribe', true))) return;

        const btn = overlay.querySelector('#ypp-health-unsub-btn');
        btn.textContent = 'Unsubscribing...';
        btn.disabled = true;

        const channels = Array.from(checkboxes).map(cb => ({
            id: cb.value,
            params: cb.dataset.params,
            onSuccess: () => {
                const row = cb.closest('.ypp-channel-health-row');
                row.style.opacity = '0.3';
                cb.disabled = true;
                cb.checked = false;
                
                const unsubBtn = row.querySelector('.ypp-indiv-unsub-btn');
                if (unsubBtn) {
                    unsubBtn.disabled = true;
                    unsubBtn.textContent = 'Unsubscribed';
                }
                
                const name = row.dataset.name || 'Unknown';
                const icon = row.querySelector('.ypp-health-row-avatar')?.src || '';
                ChannelHealthDB.addUnsubChannel({ id: cb.value, name, icon, unsubTime: Date.now() }).catch(() => {});
            }
        }));

        const successCount = await ChannelHealthAPI.doUnsubscribe(channels);

        btn.textContent = `Unsubscribed ${successCount}`;
        setTimeout(() => {
            btn.style.display = 'none';
        }, 2000);
    }
}
