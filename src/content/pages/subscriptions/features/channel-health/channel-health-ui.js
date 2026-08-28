/**
 * Channel Health UI
 * Owns: DOM rendering, scanning, animations, and modal dialog for the Channel Health Dashboard.
 * Relies on ChannelHealthAPI for YouTube communications.
 * Does not affect functionality outside the Channel Health feature.
 */
import anime from 'animejs/lib/anime.es.js';
import { CustomDialog } from './custom-dialog.js';
import { ChannelHealthAPI } from './channel-health-api.js';

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
                        <div id="ypp-scan-progress-wrapper" style="display: none; width: 48px; height: 48px; position: relative; margin-left: 8px;">
                            <svg viewBox="0 0 100 100" style="transform:rotate(-90deg); width:100%; height:100%;">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="12"></circle>
                                <circle id="ypp-circular-progress" cx="50" cy="50" r="40" fill="transparent" stroke="rgb(79, 70, 229)" stroke-width="12" stroke-dasharray="251.2" stroke-dashoffset="251.2" stroke-linecap="round" style="transition: stroke-dashoffset 0.3s ease;"></circle>
                            </svg>
                            <div id="ypp-circular-text" style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:bold; color:#fff;">0%</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button id="ypp-health-scan-btn" class="ypp-health-btn-scan">Start Scan</button>
                        </div>
                        <button id="ypp-health-unsub-btn" class="ypp-health-btn-unsub" style="display: none;">Unsubscribe Selected</button>
                        
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
                        <div style="display: flex; justify-content: flex-end; gap: 16px; margin-bottom: 16px; align-items: center;">
                            <div style="display: flex; gap: 8px; margin-right: auto;">
                                <button id="ypp-health-select-all-btn" class="ypp-health-btn-secondary" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer;">Select All Visible</button>
                                <button id="ypp-health-unselect-all-btn" class="ypp-health-btn-tertiary" style="background: rgba(255,255,255,0.02); color: #94a3b8; border: 1px solid rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer;">Unselect All</button>
                                <button id="ypp-health-unsub-btn-bottom" class="ypp-health-btn-unsub" style="display: none; background: rgba(255, 78, 69, 0.15); color: #ff6b6b; border: 1px solid rgba(255, 78, 69, 0.4); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Unsubscribe Selected</button>
                            </div>
                            <div style="position: relative; flex: 1; max-width: 280px; display: flex; align-items: center;">
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
            const filter = filterSel.value;
            const sort = sortSel.value;
            const searchQ = searchInput ? searchInput.value.toLowerCase().trim() : '';
            
            // Sync stats background
            stats.forEach(s => {
                s.style.background = s.dataset.filter === filter ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)';
            });

            const rows = Array.from(resultsEl.querySelectorAll('.ypp-channel-health-row'));
            
            // Sort
            rows.sort((a, b) => {
                if (sort === 'az') return a.dataset.name.localeCompare(b.dataset.name);
                
                const timeA = parseFloat(a.dataset.uploadTime) || Infinity;
                const timeB = parseFloat(b.dataset.uploadTime) || Infinity;
                
                if (sort === 'latest') return timeA - timeB;
                if (sort === 'oldest') return timeB - timeA;
                return 0;
            });
            
            // Apply sorting and filtering
            rows.forEach(row => {
                resultsEl.appendChild(row); // Re-appending reorders them
                
                let showByStatus = (filter === 'all' || row.dataset.status === filter);
                let showBySearch = true;
                
                if (searchQ) {
                    const name = row.dataset.name.toLowerCase();
                    showBySearch = name.includes(searchQ);
                }

                if (showByStatus && showBySearch) {
                    row.style.display = 'flex';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        stats.forEach(stat => {
            stat.addEventListener('click', () => {
                filterSel.value = filterSel.value === stat.dataset.filter ? 'all' : stat.dataset.filter;
                updateView();
            });
        });

        filterSel?.addEventListener('change', updateView);
        sortSel?.addEventListener('change', updateView);
        if (searchInput) {
            searchInput.addEventListener('input', updateView);
        }
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

            const progressWrapper = overlay.querySelector('#ypp-scan-progress-wrapper');
            if (progressWrapper) progressWrapper.style.display = 'block';

            const progressCircle = overlay.querySelector('#ypp-circular-progress');
            const progressText = overlay.querySelector('#ypp-circular-text');
            const resultsListEl = overlay.querySelector('#ypp-health-results-list');

            const now = Date.now();
            const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
            let activeCount = 0, warningCount = 0, deadCount = 0, doneCount = 0;

            const updateCounters = () => {
                overlay.querySelector('#ypp-health-active').textContent  = activeCount;
                overlay.querySelector('#ypp-health-warning').textContent = warningCount;
                overlay.querySelector('#ypp-health-dead').textContent    = deadCount;
                btn.textContent = `Scanning… ${doneCount}/${channels.length}`;
                
                if (channels.length > 0) {
                    const percent = Math.floor((doneCount / channels.length) * 100);
                    if (progressText) progressText.textContent = `${percent}%`;
                    if (progressCircle) {
                        const offset = 251.2 - (251.2 * percent) / 100;
                        progressCircle.style.strokeDashoffset = offset;
                    }
                }

                if (doneCount >= channels.length) {
                    const pc = overlay.querySelector('#ypp-scan-progress-wrapper');
                    if (pc) pc.style.opacity = '0';
                    setTimeout(() => { if (pc) pc.remove(); }, 500);
                }
            };

            const buildRow = (c) => {
                const colorMap = { active: '#2ed573', warning: '#ffb340', dead: '#ff4e45' };
                const color = colorMap[c.status] || '#94a3b8';

                const row = document.createElement('div');
                row.className = 'ypp-channel-health-row';
                row.dataset.status     = c.status;
                row.dataset.name       = c.name;
                row.dataset.uploadTime = c.lastUpload != null ? c.lastUpload : Infinity;
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

                const uploadDiv = document.createElement('div');
                uploadDiv.style.cssText = 'color:#94a3b8;font-size:12px;margin-top:2px;font-weight:500;';
                uploadDiv.textContent = 'Last upload: ';
                const uploadSpan = document.createElement('span');
                uploadSpan.style.color = color;
                uploadSpan.textContent = c.lastUploadText || 'Unknown';
                uploadDiv.appendChild(uploadSpan);
                infoDiv.appendChild(uploadDiv);

                row.appendChild(infoDiv);

                const actionsDiv = document.createElement('div');
                actionsDiv.style.cssText = 'display:flex;align-items:center;gap:12px;flex-shrink:0;';

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
                    if (c.status === 'active') activeCount++;
                    else if (c.status === 'warning') warningCount++;
                    else deadCount++;
                    processChannelUI(c);
                });
            } else {
                const RSS_TIMEOUT_MS = 5000;
                const CONCURRENCY_LIMIT = 25;
                let currentIndex = 0;
                
                const cacheResult = await window.YPP.StorageManager.get('ypp_channel_health_cache_v2');
                const cacheData = cacheResult ? { ypp_channel_health_cache_v2: cacheResult } : {};
                const healthCache = cacheData.ypp_channel_health_cache_v2 || {};
                const CACHE_TTL = 24 * 60 * 60 * 1000; 
                let cacheUpdated = false;

                const fetchChannel = async (c) => {
                    const cached = healthCache[c.id];
                    if (cached && (now - cached.timestamp < CACHE_TTL)) {
                        c.lastUpload = now - cached.pubTime;
                        c.lastUploadText = cached.lastUploadText;
                        if      (c.lastUpload < MONTH_MS)     { c.status = 'active';  activeCount++;  }
                        else if (c.lastUpload < 3 * MONTH_MS) { c.status = 'warning'; warningCount++; }
                        else                                  { c.status = 'dead';    deadCount++;    }
                        processChannelUI(c);
                        return;
                    }

                    try {
                        const controller = new AbortController();
                        const tid = setTimeout(() => controller.abort(), RSS_TIMEOUT_MS);

                        const rssRes  = await fetch(`/feeds/videos.xml?channel_id=${c.id}`, { signal: controller.signal });
                        clearTimeout(tid);
                        const rssText = await rssRes.text();

                        const entryIdx = rssText.indexOf('<entry>');
                        if (entryIdx !== -1) {
                            const entryText = rssText.substring(entryIdx);
                            const pubMatch = entryText.match(/<published>([^<]+)<\/published>/);
                            if (pubMatch && pubMatch[1]) {
                                const pubTime = new Date(pubMatch[1]).getTime();
                                const diff = now - pubTime;
                                c.lastUpload = diff;
                                c.lastUploadText = new Date(pubTime).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
                                
                                healthCache[c.id] = { pubTime: pubTime, lastUploadText: c.lastUploadText, timestamp: now };
                                cacheUpdated = true;

                                if      (diff < MONTH_MS)     { c.status = 'active';  activeCount++;  }
                                else if (diff < 3 * MONTH_MS) { c.status = 'warning'; warningCount++; }
                                else                           { c.status = 'dead';    deadCount++;    }
                            } else {
                                c.status = 'dead'; c.lastUploadText = 'No date'; c.lastUpload = Infinity; deadCount++;
                            }
                        } else {
                            c.status = 'dead'; c.lastUploadText = 'No videos'; c.lastUpload = Infinity; deadCount++;
                        }
                    } catch (e) {
                        c.status = e.name === 'AbortError' ? 'warning' : 'dead';
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
                    await window.YPP.StorageManager.set('ypp_channel_health_cache_v2', healthCache);
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
            }
        }));

        const successCount = await ChannelHealthAPI.doUnsubscribe(channels);

        btn.textContent = `Unsubscribed ${successCount}`;
        setTimeout(() => {
            btn.style.display = 'none';
        }, 2000);
    }
}
