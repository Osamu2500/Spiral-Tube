/**
 * Channel Health Scanner
 * Owns: The logic for scanning YouTube channels for Video and Shorts health.
 * Does not affect functionality outside the Channel Health feature.
 */
import { ChannelHealthAPI } from './channel-health-api.js';
import { ChannelHealthDB } from './channel-health-db.js';
import { ChannelHealthActions } from './channel-health-actions.js';

export class ChannelHealthScanner {
    // Shared state
    static currentSettings = { activeDays: 30, deadDays: 90 };
    static lastScanChannels = null;

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

        const statusEl = overlay.querySelector('#ypp-scan-status div');

        try {
            let channels = [];
            const skipFullScan = skipFetch && this.lastScanChannels;
            
            if (skipFullScan) {
                channels = this.lastScanChannels;
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
            let activeCount = 0, warningCount = 0, deadCount = 0, doneCount = 0;

            const updateCounters = () => {
                overlay.querySelector('#ypp-health-active').textContent  = activeCount;
                overlay.querySelector('#ypp-health-warning').textContent = warningCount;
                overlay.querySelector('#ypp-health-dead').textContent    = deadCount;
                btn.textContent = `Scanning… ${doneCount}/${channels.length}`;
                
                if (doneCount >= channels.length) {
                    overlay.dispatchEvent(new CustomEvent('scanProgress', { detail: { done: doneCount, total: channels.length, complete: true } }));
                    const exportBtn = overlay.querySelector('#ypp-health-export-btn');
                    if (exportBtn) {
                        exportBtn.style.display = 'inline-block';
                        exportBtn.onclick = () => {
                            const csvContent = "data:text/csv;charset=utf-8," 
                                + "Channel Name,Channel URL,Last Upload Date,Statusn"
                                + channels.map(c => `"${(c.name || '').replace(/"/g, '""')}","https://youtube.com/channel/${c.id}","${c.lastUploadText}","${c.status}"`).join("n");
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

            const safeList = await ChannelHealthDB.getSafeList();

            const buildRow = (c) => {
                const colorMap = { active: '#2ed573', warning: '#ffb340', dead: '#ff4e45', error: '#94a3b8' };
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
                row.style.setProperty('--ypp-status-color', color);

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

                // Content Pills: Video | Short
                const PILL_ICONS = {
                    video: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>`,
                    short: `<svg width="9" height="12" viewBox="0 0 18 24" fill="currentColor" style="flex-shrink:0"><rect x="0" y="0" width="18" height="24" rx="4"/><path d="M6.5 8.5l6 3.5-6 3.5V8.5z" fill="rgba(0,0,0,0.45)"/></svg>`
                };

                const createPill = (type, info) => {
                    if (!info || !info.text) return null;
                    const pill = document.createElement('div');
                    pill.className = `ypp-cpill ypp-cpill-${info.status}`;
                    pill.dataset.type = type;
                    pill.innerHTML = `${PILL_ICONS[type]}<span>${info.text}</span>`;
                    return pill;
                };

                const pillsDiv = document.createElement('div');
                pillsDiv.className = 'ypp-content-pills';
                const vPill = createPill('video', c.videoInfo);
                const sPill = createPill('short', c.shortInfo);
                if (vPill) pillsDiv.appendChild(vPill);
                if (sPill) pillsDiv.appendChild(sPill);
                infoDiv.appendChild(pillsDiv);

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
                const isSafe = safeList.includes(c.id);
                if (isSafe) cb.disabled = true;

                const checkmark = document.createElement('span');
                checkmark.className = 'ypp-custom-checkmark';
                if (isSafe) checkmark.style.opacity = '0.3';

                label.appendChild(cb);
                label.appendChild(checkmark);
                const textSpan = document.createElement('span');
                textSpan.textContent = 'Select';
                label.appendChild(textSpan);
                actionsDiv.appendChild(label);

                const shieldBtn = document.createElement('button');
                shieldBtn.className = `ypp-health-shield-btn ${isSafe ? 'active' : ''}`;
                shieldBtn.title = isSafe ? "Remove from Safe List" : "Add to Safe List";
                shieldBtn.innerHTML = isSafe ? 
                    `<svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>` : 
                    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
                shieldBtn.addEventListener('click', async () => {
                    const nowSafe = await ChannelHealthDB.toggleSafeList(c.id);
                    if (nowSafe !== null) {
                        shieldBtn.classList.toggle('active', nowSafe);
                        shieldBtn.innerHTML = nowSafe ? 
                            `<svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>` : 
                            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
                        shieldBtn.title = nowSafe ? "Remove from Safe List" : "Add to Safe List";
                        cb.disabled = nowSafe;
                        checkmark.style.opacity = nowSafe ? '0.3' : '1';
                        if (nowSafe) cb.checked = false;
                        resultsEl.dispatchEvent(new Event('change'));
                    }
                });
                actionsDiv.appendChild(shieldBtn);

                const indivBtn = document.createElement('button');
                indivBtn.className = 'ypp-indiv-unsub-btn';
                indivBtn.textContent = 'Unsubscribe';
                indivBtn.addEventListener('click', () => ChannelHealthActions.individualUnsubscribe(c.id, c.unsubParams, c.name, row, indivBtn));
                actionsDiv.appendChild(indivBtn);

                row.appendChild(actionsDiv);
                return row;
            };

            const currentContentType = overlay._currentContentType || 'all';

            const processChannelUI = (c) => {
                doneCount++;
                const skel = resultsListEl?.querySelector('.ypp-health-skeleton-row');
                if (skel) skel.remove();

                const row = buildRow(c);
                
                let show = true;
                if (filterSel && filterSel.value !== 'all') {
                    let rowStatus;
                    if      (currentContentType === 'video') rowStatus = row.dataset.videoStatus || 'dead';
                    else if (currentContentType === 'short') rowStatus = row.dataset.shortStatus || 'dead';
                    else if (currentContentType === 'post')  rowStatus = row.dataset.postStatus  || 'dead';
                    else                                     rowStatus = row.dataset.status;

                    if (rowStatus !== filterSel.value) show = false;
                }
                
                if (show && searchInput && searchInput.value) {
                    if (!c.name.toLowerCase().includes(searchInput.value.toLowerCase())) show = false;
                }
                
                row.style.display = show ? 'flex' : 'none';
                if (resultsListEl && !skipFullScan) {
                    resultsListEl.appendChild(row);
                } else if (resultsListEl && skipFullScan) {
                    // For skipFullScan, we must batch them or just append. 
                    resultsListEl.appendChild(row);
                }
                updateCounters();
                if (!skipFullScan && doneCount % 5 === 0) {
                    overlay.dispatchEvent(new CustomEvent('scanProgress', { detail: { done: doneCount, total: channels.length, complete: false } }));
                }
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
                const CONCURRENCY_LIMIT = 10;
                let currentIndex = 0;
                
                let healthCache = await ChannelHealthDB.getScanCache();
                if (!healthCache) healthCache = {};
                let cacheUpdated = false;

                const fetchChannel = async (c) => {
                    const cached = healthCache[c.id];
                    const VERY_SHORT_TTL = 60 * 60 * 1000;
                    if (cached && (now - cached.timestamp < VERY_SHORT_TTL) && cached.videoInfo) {
                        c.videoInfo  = cached.videoInfo;
                        c.shortInfo  = null;
                        c.postInfo   = null;
                        
                        c.lastUpload = now - c.videoInfo.pubTime;
                        c.lastUploadText = c.videoInfo.text;
                        c.status = c.videoInfo.status;
                        
                        if      (c.status === 'active')  activeCount++;
                        else if (c.status === 'warning') warningCount++;
                        else                             deadCount++;
                        processChannelUI(c);
                        return;
                    }

                    try {
                        const videoText = await ChannelHealthAPI.fetchLatestVideo(c.id);

                        const settings = this.currentSettings;
                        const MS_IN_DAY = 24 * 60 * 60 * 1000;
                        const classify = (pubTime) => {
                            const diff = now - pubTime;
                            if (diff < settings.activeDays * MS_IN_DAY) return 'active';
                            if (diff < settings.deadDays * MS_IN_DAY) return 'warning';
                            return 'dead';
                        };

                        if (videoText && videoText !== 'Error' && videoText !== 'Has Videos') {
                            const pubTime = now - (ChannelHealthAPI.parseRelativeTime(videoText) || 0);
                            c.videoInfo = { pubTime, text: videoText, status: classify(pubTime) };
                        } else if (videoText === 'Has Videos') {
                            c.videoInfo = { pubTime: now - (settings.activeDays * MS_IN_DAY + 1), text: 'Has Videos', status: 'warning' };
                        } else if (videoText === 'Error') {
                            c.videoInfo = { pubTime: Infinity, text: 'No Videos', status: 'error' };
                        } else {
                            c.videoInfo = null;
                        }

                        c.shortInfo = null;
                        c.postInfo  = null;

                        if (c.videoInfo) {
                            c.lastUpload     = now - c.videoInfo.pubTime;
                            c.lastUploadText = c.videoInfo.text;
                            c.status         = c.videoInfo.status;
                        } else {
                            c.lastUpload     = Infinity;
                            c.lastUploadText = 'No Videos';
                            c.status         = 'dead';
                        }

                        if      (c.status === 'active')  activeCount++;
                        else if (c.status === 'warning') warningCount++;
                        else                             deadCount++;

                        if (c.lastUploadText !== 'Error') {
                            healthCache[c.id] = {
                                videoInfo:       c.videoInfo,
                                shortInfo:       null,
                                status:          c.status,
                                lastUpload:      c.lastUpload,
                                lastUploadText:  c.lastUploadText,
                                timestamp:       now
                            };
                            cacheUpdated = true;
                        }

                    } catch (e) {
                        c.videoInfo  = null;
                        c.shortInfo  = null;
                        c.postInfo   = null;
                        c.status     = 'error';
                        c.lastUploadText = 'Error';
                        c.lastUpload = Infinity;
                        deadCount++;
                    }
                    processChannelUI(c);
                };

                const worker = async () => {
                    while (currentIndex < channels.length) {
                        const c = channels[currentIndex++];
                        await fetchChannel(c);
                    }
                };

                const workers = Array.from({ length: Math.min(CONCURRENCY_LIMIT, channels.length) }, async (_, i) => {
                    await new Promise(r => setTimeout(r, i * 100));
                    return worker();
                });
                await Promise.all(workers);
                
                if (cacheUpdated) {
                    await ChannelHealthDB.saveScanCache(healthCache);
                }
                
                this.lastScanChannels = channels;
            } 

            btn.textContent = `Scan Complete (${channels.length})`;
            btn.disabled = false;
            btn.style.opacity = '1';

            if (sortSel) sortSel.dispatchEvent(new Event('change'));

            if (!overlay._checkboxListenerAttached) {
                overlay._checkboxListenerAttached = true;
                resultsEl.addEventListener('change', (e) => {
                    if (!e.target.classList.contains('ypp-unsub-checkbox')) return;
                    const n = resultsEl.querySelectorAll('.ypp-unsub-checkbox:checked').length;
                    const unsubBtn = overlay.querySelector('#ypp-health-unsub-btn');
                    const unsubBtnBottom = overlay.querySelector('#ypp-health-unsub-btn-bottom');

                    if (unsubBtn) {
                        unsubBtn.textContent = n > 0 ? `Unsubscribe Selected (${n})` : 'Unsubscribe Selected';
                        unsubBtn.style.display = n > 0 ? 'inline-block' : 'none';
                    }
                    if (unsubBtnBottom) {
                        unsubBtnBottom.textContent = n > 0 ? `Unsubscribe Selected (${n})` : 'Unsubscribe Selected';
                        unsubBtnBottom.style.display = n > 0 ? 'inline-block' : 'none';
                    }
                });
            }

        } catch (e) {
            window.YPP.Utils?.log('runScan error', 'CHANNEL-HEALTH', 'error', e);
            btn.textContent = 'Error';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }

    static async runShortsScan(overlay, filterSel, sortSel, searchInput) {
        const btn = overlay.querySelector('#ypp-health-search-shorts-btn');
        if (!this.lastScanChannels) {
            alert('Please run a full Scan Videos first to load your channels.');
            return;
        }

        const originalText = btn.textContent;
        btn.textContent = 'Scanning Shorts...';
        btn.disabled = true;

        try {
            const targetChannels = this.lastScanChannels;
            
            if (targetChannels.length === 0) {
                btn.textContent = 'No channels found';
                setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 2000);
                return;
            }

            const now = Date.now();
            const CONCURRENCY_LIMIT = 10;
            let currentIndex = 0;
            const MS_IN_DAY = 24 * 60 * 60 * 1000;
            const settings = this.currentSettings;

            const classify = (pubTime) => {
                const diff = now - pubTime;
                if (diff < settings.activeDays * MS_IN_DAY) return 'active';
                if (diff < settings.deadDays * MS_IN_DAY) return 'warning';
                return 'dead';
            };

            let doneCount = 0;

            const worker = async () => {
                while (currentIndex < targetChannels.length) {
                    const c = targetChannels[currentIndex++];
                    const shortText = await ChannelHealthAPI.scanShorts(c.id);

                    if (shortText && shortText !== 'Error' && shortText !== 'Has Shorts') {
                        const pubTime = now - (ChannelHealthAPI.parseRelativeTime(shortText) || 0);
                        c.shortInfo = { pubTime, text: shortText, status: classify(pubTime) };
                    } else if (shortText === 'Has Shorts') {
                        c.shortInfo = { pubTime: now - (settings.activeDays * MS_IN_DAY + 1), text: 'Has Shorts', status: 'warning' };
                    } else if (shortText === 'Error') {
                        c.shortInfo = { pubTime: Infinity, text: 'No Shorts', status: 'error' };
                    } else {
                        c.shortInfo = null;
                    }

                    if (c.shortInfo) {
                        const videoPubTime = c.videoInfo ? c.videoInfo.pubTime : 0;
                        const shortPubTime = c.shortInfo.pubTime;

                        if (shortPubTime > videoPubTime) {
                            c.status = c.shortInfo.status;
                            c.lastUpload = now - shortPubTime;
                            c.lastUploadText = c.shortInfo.text;
                        } else if (c.videoInfo) {
                            c.status = c.videoInfo.status;
                            c.lastUpload = now - videoPubTime;
                            c.lastUploadText = c.videoInfo.text;
                        }
                    }
                    
                    doneCount++;
                    overlay.dispatchEvent(new CustomEvent('scanProgress', { detail: { done: doneCount, total: targetChannels.length, complete: false } }));
                    btn.textContent = `Scanning Shorts... (${doneCount}/${targetChannels.length})`;
                }
            };

            const workers = Array.from({ length: Math.min(CONCURRENCY_LIMIT, targetChannels.length) }, async (_, i) => {
                await new Promise(r => setTimeout(r, i * 100));
                return worker();
            });
            await Promise.all(workers);

            await this.runScan(overlay, filterSel, sortSel, searchInput, true);

        } catch (e) {
            window.YPP.Utils?.log('Shorts scan error', 'CHANNEL-HEALTH', 'error', e);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
}
