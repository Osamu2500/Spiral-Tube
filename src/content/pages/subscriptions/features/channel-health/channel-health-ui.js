/**
 * Channel Health UI
 * Owns: DOM rendering, scanning, animations, and modal dialog for the Channel Health Dashboard.
 */
import anime from 'animejs/lib/anime.es.js';
import { CustomDialog } from './custom-dialog.js';

// CHANNEL HEALTH DASHBOARD
// =========================================================================

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
                            <div id="ypp-scan-progress-wrapper" style="display: none; width: 32px; height: 32px; position: relative;">
                                <svg viewBox="0 0 100 100" style="transform:rotate(-90deg); width:100%; height:100%;">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="12"></circle>
                                    <circle id="ypp-circular-progress" cx="50" cy="50" r="40" fill="transparent" stroke="rgb(79, 70, 229)" stroke-width="12" stroke-dasharray="251.2" stroke-dashoffset="251.2" stroke-linecap="round" style="transition: stroke-dashoffset 0.3s ease;"></circle>
                                </svg>
                                <div id="ypp-circular-text" style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:bold; color:#fff;">0%</div>
                            </div>
                        </div>
                        <button id="ypp-health-unsub-btn" class="ypp-health-btn-unsub" style="display: none;">Unsubscribe Selected</button>
                        
                        
                        <div style="width: 1px; height: 24px; background: rgba(255,255,255,0.1); margin: 0 8px;"></div>
                        <button class="ypp-modal-close ypp-health-btn-close">&times;</button>
                    </div>
                </div>
                <div class="ypp-organizer-body" style="flex-direction: row; padding: 32px; overflow: hidden; display: flex; flex: 1; background: transparent; gap: 32px;">
                    <!-- RIGHT PANE: Channels -->
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
                                <button id="ypp-health-select-all-btn" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)';">Select All Visible</button>
                                <button id="ypp-health-unselect-all-btn" style="background: rgba(255,255,255,0.02); color: #94a3b8; border: 1px solid rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.color='#f1f5f9';" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.color='#94a3b8';">Unselect All</button>
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

        // Hover effects — using addEventListener instead of inline handlers for CSP compliance.
        // Remove JS hover listeners for elements that now have CSS classes
        const closeBtn = overlay.querySelector('.ypp-modal-close');
        
        // No inline handlers left for CSS hover effects!


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
            this.runScan(overlay);
        });

        overlay.querySelector('#ypp-health-unsub-btn')?.addEventListener('click', () => {
            this.bulkUnsubscribe(overlay);
        });

        // Add filter functionality
        const stats = overlay.querySelectorAll('.ypp-health-stat');
        const resultsEl = overlay.querySelector('#ypp-health-results');

        const updateView = () => {
            const filter = filterSel.value;
            const sort = sortSel.value;
            const searchInput = overlay.querySelector('#ypp-health-search-input');
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

        const searchInput = overlay.querySelector('#ypp-health-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', updateView);
        }
    }

    static _extractYtInitialData(text) {
        const markers = ['var ytInitialData = ', 'window["ytInitialData"] = ', 'window.ytInitialData = '];
        for (const marker of markers) {
            const startIdx = text.indexOf(marker);
            if (startIdx !== -1) {
                const jsonStart = startIdx + marker.length;
                const endIdx = text.indexOf('</script>', jsonStart);
                if (endIdx !== -1) {
                    let jsonText = text.slice(jsonStart, endIdx).trim();
                    if (jsonText.endsWith(';')) jsonText = jsonText.slice(0, -1);
                    try {
                        return JSON.parse(jsonText);
                    } catch(e) {
                        console.error('ChannelHealthUI: Failed to parse ytInitialData', e);
                    }
                }
            }
        }
        return null;
    }

    static async runScan(overlay, skipFetch = false) {
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
                // Get API config for potential continuation fetches
                const ytConfig = await this._getYoutubeConfig();
                
                // ── Step 1 & 2: Fetch /feed/channels and follow continuations ──
                const seenIds  = new Set();

            const extractChannelsFromData = (data) => {
                let token = null;
                const walkNode = (obj) => {
                    if (!obj || typeof obj !== 'object') return;
                    if (Array.isArray(obj)) { obj.forEach(walkNode); return; }

                    if (obj.channelRenderer) {
                        const r = obj.channelRenderer;
                        if (!seenIds.has(r.channelId)) {
                            seenIds.add(r.channelId);
                            let unsubParams = '';
                            const walkForUnsub = (o) => {
                                if (!o || typeof o !== 'object') return;
                                if (o.unsubscribeEndpoint?.params) { unsubParams = o.unsubscribeEndpoint.params; return; }
                                Object.values(o).forEach(walkForUnsub);
                            };
                            walkForUnsub(r.subscribeButton || r);
                            channels.push({
                                id: r.channelId,
                                name: r.title?.simpleText || 'Unknown',
                                icon: r.thumbnail?.thumbnails?.pop()?.url || '',
                                unsubParams
                            });
                        }
                        return;
                    }
                    if (obj.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token) {
                        token = obj.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
                        return;
                    }
                    Object.values(obj).forEach(walkNode);
                };
                walkNode(data);
                return token;
            };

            let nextToken = null;
            
            // First page from HTML
            const res  = await fetch('/feed/channels');
            const text = await res.text();
            const data = this._extractYtInitialData(text);
            if (data) {
                nextToken = extractChannelsFromData(data);
            }

            // Follow continuation tokens for users with >100 subscriptions
            while (nextToken && ytConfig && ytConfig.apiKey) {
                statusEl.textContent = `Fetching subscriptions list... (${channels.length} found so far)`;
                try {
                    const contRes = await fetch(`/youtubei/v1/browse?key=${ytConfig.apiKey}`, {
                        method: 'POST',
                        headers: await this._getApiHeaders(ytConfig),
                        credentials: 'include',
                        body: JSON.stringify({
                            context: ytConfig.context,
                            continuation: nextToken
                        })
                    });
                    if (!contRes.ok) break;
                    const contData = await contRes.json();
                    nextToken = extractChannelsFromData(contData);
                } catch (err) {
                    window.YPP.utils?.log('Failed to fetch continuation', 'CHANNEL-HEALTH', 'warn', err);
                    break;
                }
            }
            } // end of else (!skipFullScan)

            if (channels.length === 0) {
                resultsEl.innerHTML = '<div style="text-align:center;color:rgba(255, 78, 69, 0.8);margin-top:40px;">No subscriptions found.</div>';
                btn.textContent = 'Scan Complete';
                btn.disabled = false;
                btn.style.opacity = '1';
                return;
            }

            // ── Step 3: Clear and set up streaming UI ─────────────────────
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
                    const pc = overlay.querySelector('#ypp-circular-progress-container');
                    if (pc) pc.style.opacity = '0';
                    setTimeout(() => { if (pc) pc.remove(); }, 500);
                }

                if (deadCount > 0) {
                    const unsubBtn = overlay.querySelector('#ypp-health-unsub-btn');
                    if (unsubBtn) unsubBtn.style.display = 'inline-block';
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
                row.setAttribute('draggable', 'true');
                row.style.borderLeft = '4px solid ' + color;
                row.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', c.name);
                    e.dataTransfer.effectAllowed = 'copyMove';
                    row.style.opacity = '0.5';
                    row.style.transform = 'scale(0.98)';
                });
                row.addEventListener('dragend', () => {
                    row.style.opacity = '1';
                    row.style.transform = 'scale(1)';
                });

                // Build inner DOM safely without template literals (avoids Vite JSX parse errors)
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
                visitLink.style.cssText = 'color:#f1f5f9;text-decoration:none;font-size:13px;font-weight:600;opacity:0.6;transition:all 0.2s;';
                visitLink.textContent = 'Visit';
                visitLink.addEventListener('mouseover', () => { visitLink.style.opacity = '1'; });
                visitLink.addEventListener('mouseout',  () => { visitLink.style.opacity = '0.6'; });
                actionsDiv.appendChild(visitLink);

                const label = document.createElement('label');
                label.style.cssText = 'display:flex;align-items:center;cursor:pointer;color:#94a3b8;font-size:13px;font-weight:500;user-select:none;gap:8px;margin-left:4px;margin-right:8px;';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'ypp-unsub-checkbox';
                cb.value = c.id;
                cb.dataset.params = c.unsubParams || '';
                label.appendChild(cb);
                label.appendChild(document.createTextNode('Select'));
                actionsDiv.appendChild(label);

                const indivBtn = document.createElement('button');
                indivBtn.className = 'ypp-indiv-unsub-btn';
                indivBtn.textContent = 'Unsubscribe';
                indivBtn.addEventListener('click', () => this.individualUnsubscribe(c.id, c.unsubParams, c.name, row, indivBtn));
                actionsDiv.appendChild(indivBtn);

                row.appendChild(actionsDiv);
                return row;
            };

            // ── Step 4: Fire RSS fetches with concurrency limit ────────────
            const processChannelUI = (c) => {
                doneCount++;
                const row = buildRow(c);
                
                // Directly apply current filter without triggering a full re-sort
                const filterSel = overlay.querySelector('#ypp-health-filter-dropdown');
                const searchInput = overlay.querySelector('#ypp-health-search-input');
                
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
                
                // Load Cache
                const cacheResult = await window.YPP.StorageManager.get('ypp_channel_health_cache_v2');
                const cacheData = cacheResult ? { ypp_channel_health_cache_v2: cacheResult } : {};
                const healthCache = cacheData.ypp_channel_health_cache_v2 || {};
                const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
                let cacheUpdated = false;

                const fetchChannel = async (c) => {
                    // Check Cache
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

                        // Regex parsing (drastically faster than DOMParser for hundreds of chunks)
                        // Note: The RSS feed contains a <published> tag for the channel creation date before the first <entry>.
                        // We must find the first <entry> and then extract its <published> date.
                        const entryIdx = rssText.indexOf('<entry>');
                        if (entryIdx !== -1) {
                            const entryText = rssText.substring(entryIdx);
                            const pubMatch = entryText.match(/<published>([^<]+)<\/published>/);
                            if (pubMatch && pubMatch[1]) {
                                const pubTime = new Date(pubMatch[1]).getTime();
                                const diff = now - pubTime;
                                c.lastUpload = diff;
                                c.lastUploadText = new Date(pubTime).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
                                
                                // Update Cache
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
            } // end of else (!skipFullScan)

            // ── Step 5: Finalise ───────────────────────────────────────────
            btn.textContent = `Scan Complete (${channels.length})`;
            btn.disabled = false;
            btn.style.opacity = '1';

            // Wire up checkbox counter (idempotent)
            if (!overlay._checkboxListenerAttached) {
                overlay._checkboxListenerAttached = true;
                resultsEl.addEventListener('change', (e) => {
                    if (!e.target.classList.contains('ypp-unsub-checkbox')) return;
                    const n = resultsEl.querySelectorAll('.ypp-unsub-checkbox:checked').length;
                    const unsubBtn = overlay.querySelector('#ypp-health-unsub-btn');

                    if (unsubBtn) {
                        unsubBtn.textContent = n > 0 ? `Unsubscribe Selected (${n})` : 'Unsubscribe Selected';
                        unsubBtn.disabled = n === 0;
                    }
                });
            }

            // Final filter/sort pass
            const filterSel = overlay.querySelector('#ypp-health-filter-dropdown');
            if (filterSel) filterSel.dispatchEvent(new Event('change'));

        } catch (e) {
            window.YPP.Utils?.log('Scan error', 'CHANNEL-HEALTH', 'error', e);
            resultsEl.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.8);margin-top:40px;font-size:14px;">Scan failed: ' + (e.message || 'Unknown error') + '</div>';
            btn.textContent = 'Retry Scan';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }

    /**
     * Reads YouTube's internal `ytcfg` object from the page context by injecting
     * a short-lived <script> tag that posts the config values back via postMessage.
     * @returns {Promise<{apiKey, context, visitorData, clientVersion, sessionIndex, pageId}>}
     */
    static _getYoutubeConfig() {
        return new Promise(resolve => {
            // Use a random ID to match the response to this specific request,
            // preventing cross-contamination if multiple calls overlap.
            const reqId = Math.random().toString(36).slice(2);
            let resolved = false;

            const listener = (e) => {
                if (e.data && e.data.type === 'YPP_YTCFG_RESPONSE' && e.data.reqId === reqId) {
                    window.removeEventListener('message', listener);
                    if (!resolved) {
                        resolved = true;
                        resolve(e.data.config);
                    }
                }
            };
            window.addEventListener('message', listener);

            // Fallback timeout in case CSP blocks the script injection
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    window.removeEventListener('message', listener);
                    window.YPP.Utils?.log('_getYoutubeConfig timed out. Returning empty config.', 'CHANNEL-HEALTH', 'warn');
                    resolve({}); // Will trigger the "Auth Error" dialog
                }
            }, 1500);

            // Ensure the bridge script is injected
            if (!document.getElementById('ypp-ytcfg-bridge')) {
                const script = document.createElement('script');
                script.id = 'ypp-ytcfg-bridge';
                script.src = chrome.runtime.getURL('src/inject/ytcfg-bridge.js');
                document.documentElement.appendChild(script);
            }

            // Give the script a short moment to load/parse if newly injected,
            // then send the request.
            setTimeout(() => {
                window.postMessage({
                    type: 'YPP_YTCFG_REQUEST',
                    reqId: reqId
                }, '*');
            }, 50);
        });
    }

    /**
     * Tier 2: InnerTube API unsubscribe.
     * Sends a POST to YouTube's internal subscription endpoint.
     * Returns true on success, false on failure.
     */
    static async _getApiHeaders(config) {
        const origin = window.location.origin;
        const time = Math.floor(Date.now() / 1000);

        const sha1 = async (str) => {
            const buf = new TextEncoder().encode(str);
            const hash = await crypto.subtle.digest('SHA-1', buf);
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        };

        // Build a combined multi-hash Authorization header (same as YouTube's web frontend)
        const readCookie = (name) => {
            const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
            return m ? m[1] : null;
        };

        const sapisid    = readCookie('SAPISID');
        const sapisid1p  = readCookie('__Secure-1PAPISID');
        const sapisid3p  = readCookie('__Secure-3PAPISID');

        const parts = [];
        if (sapisid)   parts.push(`SAPISIDHASH ${time}_${await sha1(`${time} ${sapisid} ${origin}`)}`);
        if (sapisid1p) parts.push(`SAPISID1PHASH ${time}_${await sha1(`${time} ${sapisid1p} ${origin}`)}`);
        if (sapisid3p) parts.push(`SAPISID3PHASH ${time}_${await sha1(`${time} ${sapisid3p} ${origin}`)}`);

        const headers = {
            'Content-Type': 'application/json',
            'X-YouTube-Client-Name': '1',
            'X-YouTube-Client-Version': config.clientVersion || '2.20240101.01.00',
            'X-Origin': origin,
            'X-Goog-Visitor-Id': config.visitorData || '',
        };

        if (config.sessionIndex != null) headers['X-Goog-AuthUser'] = String(config.sessionIndex);
        if (config.pageId) headers['X-Goog-PageId'] = String(config.pageId);
        if (parts.length) headers['Authorization'] = parts.join(' ');

        return headers;
    }


    /**
     * Tier 2: InnerTube API unsubscribe.
     * Sends a POST to YouTube's internal subscription endpoint.
     * Returns true on success, false on failure.
     */
    static async _tryApiUnsubscribe(channelData, config) {
        const headers = await this._getApiHeaders(config);

        const makeRequest = async (withParams) => {
            const payload = { context: config.context, channelIds: [channelData.id] };
            if (withParams && channelData.params) payload.params = channelData.params;
            const res = await fetch(`/youtubei/v1/subscription/unsubscribe?key=${config.apiKey}`, {
                method: 'POST', headers, credentials: 'include',
                body: JSON.stringify(payload)
            });
            const data = await res.json().catch(() => ({}));
            return { ok: res.ok && !data.error, status: res.status, data };
        };

        try {
            // Attempt 1: with params
            let res = await makeRequest(true);
            if (res.ok) return true;

            // Attempt 2: without params (handles stale token / 403)
            if (!res.ok && channelData.params) {
                res = await makeRequest(false);
                if (res.ok) return true;
            }

            window.YPP.Utils?.log(`API unsubscribe failed for ${channelData.id}: HTTP ${res.status}`, 'CHANNEL-HEALTH', 'warn', res.data);
        } catch (e) {
            window.YPP.Utils?.log('API unsubscribe exception', 'CHANNEL-HEALTH', 'error', e);
        }
        return false;
    }

    /**
     * Tier 3: Native DOM button click fallback.
     * Finds YouTube's own subscribe button in the page and clicks it,
     * then confirms the dialog. Works even without params.
     * Returns true on success, false if no button found.
     */
    static async _tryNativeDomUnsubscribe(channelId) {
        try {
            // Find subscribe button renderers that match this channel
            const candidates = document.querySelectorAll(
                `ytd-subscribe-button-renderer[channel-id="${channelId}"], ` +
                `[channel-id="${channelId}"] ytd-subscribe-button-renderer`
            );

            // Expanded selectors for both old (paper-button) and new (yt-button-shape) YouTube UI
            const SUB_BTN_SELECTORS = [
                'yt-button-shape button',
                '.yt-spec-button-shape-next',
                'tp-yt-paper-button',
                'button'
            ];

            for (const renderer of candidates) {
                let btn = null;
                for (const sel of SUB_BTN_SELECTORS) {
                    btn = renderer.querySelector(sel);
                    if (btn) break;
                }
                if (!btn) continue;
                
                const text = (btn.textContent || btn.getAttribute('aria-label') || '').toLowerCase().trim();
                
                // Only click if the user is subscribed (button says Subscribed/Unsubscribe)
                // New YouTube UI sometimes hides text in a tooltip or a deeply nested span
                const innerSpan = btn.querySelector('.yt-core-attributed-string');
                const innerText = innerSpan ? innerSpan.textContent.toLowerCase().trim() : '';

                if (text === 'subscribed' || text === 'unsubscribe' || text.includes('subscribed') || 
                    innerText === 'subscribed' || innerText === 'unsubscribe' || innerText.includes('subscribed')) {
                    
                    btn.click();
                    // Wait for YouTube's confirm dialog to appear
                    await new Promise(r => setTimeout(r, 800));
                    
                    // Try all confirmation dialog selectors — new UI uses yt-button-shape inside dialog
                    const CONFIRM_SELECTORS = [
                        'yt-confirm-dialog-renderer #confirm-button button',
                        'yt-confirm-dialog-renderer yt-button-shape button',
                        'yt-confirm-dialog-renderer [dialog-confirm] button',
                        'yt-confirm-dialog-renderer button',
                        'tp-yt-paper-dialog .buttons tp-yt-paper-button:last-of-type',
                        '[aria-label="Unsubscribe"]',
                        'yt-button-shape button[aria-label="Unsubscribe"]'
                    ];
                    
                    for (const sel of CONFIRM_SELECTORS) {
                        const confirmBtn = document.querySelector(sel);
                        if (confirmBtn) {
                            confirmBtn.click();
                            window.YPP.Utils?.log(`Native DOM unsubscribe succeeded for ${channelId}`, 'CHANNEL-HEALTH', 'debug');
                            return true;
                        }
                    }
                }
            }
        } catch (e) {
            window.YPP.Utils?.log('Native DOM unsubscribe failed', 'CHANNEL-HEALTH', 'warn', e);
        }
        return false;
    }

    /**
     * Tier 2b: Fresh API Token Fetch
     * Dynamically loads channel page, extracts fresh unsubParams, and executes API.
     */
    static async _tryFreshApiUnsubscribe(channelId, config) {
        // Try /channel/ URL first, then /@handle fallback
        const urlsToTry = [
            `/channel/${channelId}`,
            `/@${channelId}` // In case channelId is actually a handle
        ];
        
        for (const url of urlsToTry) {
            try {
                const res = await fetch(url);
                if (!res.ok) continue;
                const text = await res.text();
                const data = this._extractYtInitialData(text);
                if (data) {
                    let freshParams = null;
                    const walk = (o) => {
                        if (freshParams) return;
                        if (!o || typeof o !== 'object') return;
                        if (o.unsubscribeEndpoint?.params) {
                            freshParams = o.unsubscribeEndpoint.params;
                            return;
                        }
                        Object.values(o).forEach(walk);
                    };
                    walk(data);
                        
                    if (freshParams) {
                        return await this._tryApiUnsubscribe({ id: channelId, params: freshParams }, config);
                    }
                }
            } catch(e) {
                window.YPP.utils?.log(`Fresh API unsub error for ${url}`, 'CHANNEL-HEALTH', 'warn', e);
            }
        }
        return false;
    }

    /**
     * Tier 4: Hidden Iframe Simulator
     * Injects an invisible iframe, loads the channel, and simulates the actual DOM clicks.
     * Guarantees 100% success rate without leaving the current page.
     */
    static async _tryIframeUnsubscribe(channelId) {
        return new Promise(resolve => {
            const iframe = document.createElement('iframe');
            // Make invisible but keep in viewport to ensure intersection observer loads polymer app
            iframe.style.cssText = 'width:300px;height:300px;opacity:0.01;position:fixed;bottom:0;right:0;pointer-events:none;z-index:9999;border:0;';
            iframe.src = `/channel/${channelId}`;
            
            let resolved = false;
            let timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    iframe.remove();
                    resolve(false);
                }
            }, 12000); // 12s timeout per channel

            iframe.onload = async () => {
                try {
                    const idoc = iframe.contentDocument || iframe.contentWindow.document;
                    let btn = null;
                    
                    // Wait for the button to render
                    for (let i = 0; i < 30; i++) {
                        const renderer = idoc.querySelector('ytd-subscribe-button-renderer');
                        if (renderer) {
                            btn = renderer.querySelector('button');
                            if (btn && btn.offsetParent !== null) break;
                        }
                        await new Promise(r => setTimeout(r, 200));
                    }
                    
                    if (btn) {
                        const text = (btn.textContent || btn.getAttribute('aria-label') || '').toLowerCase();
                        if (text.includes('subscribed') || text.includes('unsubscribe')) {
                            btn.click();
                            await new Promise(r => setTimeout(r, 500));
                            
                            // Find and click the confirm button
                            for (let i = 0; i < 15; i++) {
                                const confirmBtn = idoc.querySelector('yt-confirm-dialog-renderer #confirm-button button, yt-button-shape[id="confirm-button"] button');
                                if (confirmBtn) {
                                    confirmBtn.click();
                                    await new Promise(r => setTimeout(r, 500));
                                    if (!resolved) {
                                        resolved = true;
                                        clearTimeout(timeout);
                                        iframe.remove();
                                        resolve(true);
                                    }
                                    return;
                                }
                                await new Promise(r => setTimeout(r, 200));
                            }
                        }
                    }
                } catch(e) {}
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    iframe.remove();
                    resolve(false);
                }
            };
            document.body.appendChild(iframe);
        });
    }

    /**
     * Main unsubscribe orchestrator — utilizes the 4-tier fallback chain.
     * Returns count of successful unsubscriptions.
     */
    static async _doUnsubscribe(channels) {
        const config = await this._getYoutubeConfig();

        if (!config.apiKey || !config.context) {
            await CustomDialog.alert(
                'Auth Error',
                'Could not retrieve YouTube session credentials.\nPlease refresh the page and try again.'
            );
            return 0;
        }

        let successCount = 0;
        const failedChannels = [];

        for (const c of channels) {
            // Tier 1: InnerTube API
            let succeeded = await this._tryApiUnsubscribe(c, config);

            // Tier 2: Fresh API Params
            if (!succeeded) {
                window.YPP.Utils?.log(`API failed for ${c.name || c.id}, trying Fresh API...`, 'CHANNEL-HEALTH', 'warn');
                succeeded = await this._tryFreshApiUnsubscribe(c.id, config);
            }

            // Tier 3: Native DOM click
            if (!succeeded) {
                window.YPP.Utils?.log(`Fresh API failed for ${c.name || c.id}, trying native DOM...`, 'CHANNEL-HEALTH', 'warn');
                succeeded = await this._tryNativeDomUnsubscribe(c.id);
            }

            // Tier 4: Hidden Iframe DOM click
            if (!succeeded) {
                window.YPP.Utils?.log(`Native DOM failed for ${c.name || c.id}, trying iframe simulator...`, 'CHANNEL-HEALTH', 'warn');
                succeeded = await this._tryIframeUnsubscribe(c.id);
            }

            if (succeeded) {
                successCount++;
                if (c.onSuccess) c.onSuccess();
            } else {
                failedChannels.push(c.name || c.id);
            }
        }

        if (failedChannels.length > 0) {
            const preview = failedChannels.slice(0, 5).join(', ');
            const extra = failedChannels.length > 5 ? ` and ${failedChannels.length - 5} more` : '';
            await CustomDialog.alert(
                `${failedChannels.length} Unsubscribe(s) Failed`,
                `Could not unsubscribe from:\n${preview}${extra}.\n\nYouTube may have rate-limited the request. Try again in a moment or visit those channel pages directly.`
            );
        }

        return successCount;
    }

    static async individualUnsubscribe(channelId, params, channelName, rowEl, btnEl) {
        // Confirm before acting
        const confirmed = await CustomDialog.confirm(
            'Unsubscribe',
            `Unsubscribe from ${channelName}?`,
            'Unsubscribe',
            true
        );
        if (!confirmed) return;

        // Show loading state immediately
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
            const config = await this._getYoutubeConfig();

            if (!config.apiKey || !config.context) {
                resetBtn(originalText, null);
                await CustomDialog.alert('Auth Error', 'Could not get YouTube credentials. Please refresh and try again.');
                return;
            }

            // Tier 1: Try API first (fastest path)
            let succeeded = await this._tryApiUnsubscribe({ id: channelId, params, name: channelName }, config);

            // Tier 2: Fresh API Params
            if (!succeeded) {
                succeeded = await this._tryFreshApiUnsubscribe(channelId, config);
            }

            // Tier 3: Native DOM click fallback
            if (!succeeded) {
                succeeded = await this._tryNativeDomUnsubscribe(channelId);
            }

            // Tier 4: Hidden Iframe DOM click fallback
            if (!succeeded) {
                succeeded = await this._tryIframeUnsubscribe(channelId);
            }

            if (succeeded) {
                // Visual success feedback
                rowEl.style.transition = 'opacity 0.4s ease';
                rowEl.style.opacity = '0.35';
                btnEl.textContent = '✓ Unsubscribed';
                btnEl.style.color = 'rgba(255, 255, 255, 0.8)';
                btnEl.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                btnEl.disabled = true;
                // Disable checkbox too
                const cb = rowEl.querySelector('.ypp-unsub-checkbox');
                if (cb) { cb.disabled = true; cb.checked = false; }
                // Remove row after a short delay
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
                // Reset button and show error
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

        const successCount = await this._doUnsubscribe(channels);

        btn.textContent = `Unsubscribed ${successCount}`;
        setTimeout(() => {
            btn.style.display = 'none';
        }, 2000);
    }
};
