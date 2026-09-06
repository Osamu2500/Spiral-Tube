/**
 * Channel Health Scanner
 * Purpose: Manages the background worker queue and API coordination for scanning YouTube channels.
 * Scope: Coordinates data fetching (videos/shorts), state management, and updates UI progress counters.
 * Note: DOM row creation is delegated to ChannelHealthRowBuilder.
 * Confirmation: This file exclusively targets the Channel Health Dashboard and does NOT affect any unrelated YouTube functionalities or other extension features.
 */
import { ChannelHealthAPI } from './channel-health-api.js';
import { ChannelHealthDB } from './channel-health-db.js';
import { ChannelHealthActions } from './channel-health-actions.js';
import { ChannelHealthRowBuilder } from './channel-health-row-builder.js';

export class ChannelHealthScanner {
    // Shared state
    static currentSettings = { activeDays: 30, deadDays: 90 };
    static lastScanChannels = null;

    static async fetchOnly(overlay, filterSel, sortSel, searchInput) {
        return this.runScan(overlay, filterSel, sortSel, searchInput, false, 'none');
    }

    static async runScan(overlay, filterSel, sortSel, searchInput, reRenderOnly = false, scanType = 'video') {
        const isShorts = scanType === 'short';
        const isFetchOnly = scanType === 'none';
        const btnId = isFetchOnly ? '#ypp-health-fetch-list-btn' : (isShorts ? '#ypp-health-search-shorts-btn' : '#ypp-health-scan-btn');
        const btn = overlay.querySelector(btnId);
        const resultsEl = overlay.querySelector('#ypp-health-results');

        if (isFetchOnly) {
            btn.textContent = 'Fetching...';
        } else {
            btn.textContent = isShorts ? 'Scanning Shorts...' : 'Scanning...';
        }
        btn.disabled = true;
        btn.style.opacity = '0.5';

        try {
            const hasChannels = this.lastScanChannels && this.lastScanChannels.length > 0;
            const skipFetch = reRenderOnly || (hasChannels && !isFetchOnly);
            const skipWorkerPool = reRenderOnly && hasChannels;

            let channels = skipFetch ? this.lastScanChannels : [];
            let isFetchingSubscriptions = false;
            let startProcessing = null;
            let startedProcessing = false;
            let updateCountersRef = null;

            if (!skipFetch) {
                resultsEl.innerHTML = `
                    <div id="ypp-scan-status" style="text-align:center; color:#aaa; margin-top:40px; font-size:14px;">
                        <div style="margin-bottom:12px;">Fetching subscriptions list...</div>
                        <div id="ypp-scan-progress" style="font-size:12px; color:#777;"></div>
                    </div>`;
            }

            const statusEl = overlay.querySelector('#ypp-scan-status div');

            if (skipFetch) {
                if (statusEl) statusEl.remove();
                if (reRenderOnly) btn.textContent = 'Updating...';
            } else {
                isFetchingSubscriptions = true;

                // IMPORTANT: fetchSubscriptions is called AFTER startProcessing is defined below,
                // so the batch callback can safely call startProcessing().
                // We use a deferred start pattern: define the callback ref first, then assign.
                ChannelHealthAPI.fetchSubscriptions(
                    (count) => {
                        const el = overlay.querySelector('#ypp-scan-status div');
                        if (el) el.textContent = `Fetching subscriptions... (${count} found so far)`;
                    },
                    (batch) => {
                        channels.push(...batch);
                        if (startProcessing && !startedProcessing) {
                            startedProcessing = true;
                            startProcessing();
                        }
                    }
                ).then((allChannels) => {
                    isFetchingSubscriptions = false;
                    this.lastScanChannels = allChannels;
                    if (allChannels.length === 0) {
                        resultsEl.innerHTML = '<div style="text-align:center;color:rgba(255,78,69,0.8);margin-top:40px;">No subscriptions found.</div>';
                        btn.textContent = isFetchOnly ? 'Fetch Complete' : 'Scan Complete';
                        btn.disabled = false;
                        btn.style.opacity = '1';
                    }
                    if (updateCountersRef) updateCountersRef();
                }).catch(() => {
                    isFetchingSubscriptions = false;
                });
            }

            if (skipFetch && channels.length === 0) {
                resultsEl.innerHTML = '<div style="text-align:center;color:rgba(255,78,69,0.8);margin-top:40px;">No subscriptions found.</div>';
                btn.textContent = isFetchOnly ? 'Fetch Complete' : 'Scan Complete';
                btn.disabled = false;
                btn.style.opacity = '1';
                return;
            }

            // startProcessing is defined HERE — after fetchSubscriptions is called but before
            // any batch can actually arrive (JS is single-threaded, batches arrive on next tick).
            startProcessing = async () => {
                try {
                    // Set up results list
                    let resultsListEl = overlay.querySelector('#ypp-health-results-list');
                    if (!resultsListEl) {
                        resultsEl.innerHTML = `<div id="ypp-health-results-list" style="display:flex; flex-direction:column; gap:12px;"></div>`;
                        resultsListEl = overlay.querySelector('#ypp-health-results-list');
                    } else if (!skipFetch && !reRenderOnly) {
                        resultsListEl.innerHTML = '';
                    }
                    if (statusEl) statusEl.remove();

                    // Show skeleton rows immediately so UI feels responsive right away
                    if (!skipFetch) {
                        const skeletonCount = Math.min(channels.length || 12, 12);
                        for (let i = 0; i < skeletonCount; i++) {
                            const skel = document.createElement('div');
                            skel.className = 'ypp-health-skeleton-row';
                            skel.style.cssText = 'display:flex;align-items:center;padding:14px 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:16px;animation:ypp-pulse 1.5s infinite ease-in-out;gap:16px;';
                            skel.innerHTML = `
                                <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.06);flex-shrink:0;"></div>
                                <div style="flex:1;">
                                    <div style="width:38%;height:13px;background:rgba(255,255,255,0.06);border-radius:4px;margin-bottom:9px;"></div>
                                    <div style="width:22%;height:10px;background:rgba(255,255,255,0.04);border-radius:4px;"></div>
                                </div>`;
                            resultsListEl.appendChild(skel);
                        }
                    }

                    const now = Date.now();
                    let activeCount = 0, warningCount = 0, deadCount = 0, errorCount = 0, doneCount = 0;

                    const updateCounters = () => {
                        overlay.querySelector('#ypp-health-active').textContent  = activeCount;
                        overlay.querySelector('#ypp-health-warning').textContent = warningCount;
                        overlay.querySelector('#ypp-health-dead').textContent    = deadCount;
                        if (overlay.querySelector('#ypp-health-error')) {
                            overlay.querySelector('#ypp-health-error').textContent = errorCount;
                        }
                        
                        if (isFetchOnly) {
                            btn.textContent = `Fetching… ${doneCount}`;
                        } else {
                            btn.textContent = `Scanning… ${doneCount}/${isFetchingSubscriptions ? '?' : channels.length}`;
                        }
                        
                        const titleEl = overlay.querySelector('.ypp-modal-title');
                        if (titleEl) {
                            titleEl.textContent = `Channel Health Dashboard (${channels.length} channels)`;
                        }

                        if (doneCount >= channels.length && !isFetchingSubscriptions) {
                            overlay.dispatchEvent(new CustomEvent('scanProgress', { detail: { done: doneCount, total: channels.length, complete: true } }));
                            const exportBtn = overlay.querySelector('#ypp-health-export-btn');
                            if (exportBtn) {
                                exportBtn.style.display = 'inline-block';
                                exportBtn.onclick = () => {
                                    const csvContent = "data:text/csv;charset=utf-8,"
                                        + "Channel Name,Channel URL,Last Upload Date,Status\n"
                                        + channels.map(c => `"${(c.name || '').replace(/"/g, '""')}","https://youtube.com/channel/${c.id}","${c.lastUploadText}","${c.status}"`).join("\n");
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodeURI(csvContent));
                                    link.setAttribute("download", "youtube_channel_health.csv");
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                };
                            }
                        }
                    };
                    updateCountersRef = updateCounters;

                    const safeList = await ChannelHealthDB.getSafeList();

                    const processChannelUI = (c) => {
                        doneCount++;
                        // Read content type fresh every call — never stale from closure
                        const currentContentType = overlay._currentContentType || 'all';

                        const existingRow = document.getElementById('ypp-row-' + c.id);
                        const row = ChannelHealthRowBuilder.buildRow(c, safeList, resultsEl);

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

                        if (overlay.classList.contains('ypp-grid-view')) {
                            row.classList.add('ypp-grid-view');
                        }

                        const list = overlay.querySelector('#ypp-health-results-list');
                        if (list) {
                            if (existingRow) {
                                list.replaceChild(row, existingRow);
                            } else {
                                // Swap out the first skeleton placeholder if any remain
                                const skel = list.querySelector('.ypp-health-skeleton-row');
                                if (skel) {
                                    list.replaceChild(row, skel);
                                } else {
                                    list.appendChild(row);
                                }
                            }
                        }
                        updateCounters();
                        if (!skipWorkerPool && doneCount % 5 === 0) {
                            overlay.dispatchEvent(new CustomEvent('scanProgress', { detail: { done: doneCount, total: channels.length, complete: false } }));
                        }
                    };

                    if (skipWorkerPool) {
                        channels.forEach(c => {
                            const currentContentType = overlay._currentContentType || 'all';
                            let cStatus = c.status;
                            if (currentContentType === 'video') cStatus = c.videoInfo ? c.videoInfo.status : 'dead';
                            else if (currentContentType === 'short') cStatus = c.shortInfo ? c.shortInfo.status : 'dead';

                            if (cStatus === 'active') activeCount++;
                            else if (cStatus === 'warning') warningCount++;
                            else deadCount++;

                            processChannelUI(c);
                        });
                    } else {
                        const CONCURRENCY_LIMIT = 10;
                        let currentIndex = 0;

                        // Persistent cache removed per user request for fresh scans

                        const fetchChannel = async (c) => {
                            if (scanType === 'none') {
                                c.status = 'none';
                                processChannelUI(c);
                                return;
                            }

                            try {
                                let resultText = null;
                                let attempts = 0;
                                const maxAttempts = 3;
                                
                                while (attempts < maxAttempts) {
                                    resultText = isShorts
                                        ? await ChannelHealthAPI.scanShorts(c.id)
                                        : await ChannelHealthAPI.fetchLatestVideo(c.id);
                                        
                                    if (resultText !== 'Error') break;
                                    
                                    attempts++;
                                    if (attempts < maxAttempts) {
                                        // Exponential backoff: 1s, 2s
                                        await new Promise(r => setTimeout(r, attempts * 1000));
                                    }
                                }

                                const settings = this.currentSettings;
                                const MS_IN_DAY = 24 * 60 * 60 * 1000;
                                const classify = (pubTime) => {
                                    const diff = Date.now() - pubTime;
                                    if (diff < settings.activeDays * MS_IN_DAY) return 'active';
                                    if (diff < settings.deadDays * MS_IN_DAY) return 'warning';
                                    return 'dead';
                                };

                                if (resultText && resultText !== 'No Videos' && resultText !== 'No Shorts' && resultText !== 'Error' && resultText !== 'Failed to scan') {
                                    const pubTime = Date.now() - (ChannelHealthAPI.parseRelativeTime(resultText) || 0);
                                    if (isShorts) c.shortInfo = { pubTime, text: resultText, status: classify(pubTime) };
                                    else          c.videoInfo = { pubTime, text: resultText, status: classify(pubTime) };
                                } else if (resultText === 'Failed to scan' || resultText === 'Error') {
                                    if (isShorts) c.shortInfo = { pubTime: -Infinity, text: 'Failed to scan', status: 'error' };
                                    else          c.videoInfo = { pubTime: -Infinity, text: 'Failed to scan', status: 'error' };
                                } else {
                                    const fallback = isShorts ? 'No Shorts' : 'No Videos';
                                    if (isShorts) c.shortInfo = { pubTime: -Infinity, text: fallback, status: 'dead' };
                                    else          c.videoInfo = { pubTime: -Infinity, text: fallback, status: 'dead' };
                                }

                                c.postInfo = null;

                                const targetInfo = isShorts ? c.shortInfo : c.videoInfo;
                                if (targetInfo && targetInfo.pubTime > -Infinity) {
                                    c.lastUpload     = Date.now() - targetInfo.pubTime;
                                    c.lastUploadText = targetInfo.text;
                                    c.status         = targetInfo.status;
                                } else {
                                    c.lastUpload     = Infinity;
                                    c.lastUploadText = targetInfo ? targetInfo.text : (isShorts ? 'No Shorts' : 'No Videos');
                                    c.status         = targetInfo ? targetInfo.status : 'dead';
                                }

                                if      (c.status === 'active')  activeCount++;
                                else if (c.status === 'warning') warningCount++;
                                else if (c.status === 'dead')    deadCount++;
                                else if (c.status === 'error')   errorCount++;
                                // No persistent cache write

                            } catch (e) {
                                const fallback = isShorts ? 'No Shorts' : 'No Videos';
                                if (isShorts) c.shortInfo = { pubTime: -Infinity, text: fallback, status: 'dead' };
                                else          c.videoInfo = { pubTime: -Infinity, text: fallback, status: 'dead' };
                                c.postInfo       = null;
                                c.status         = 'dead';
                                c.lastUploadText = fallback;
                                c.lastUpload     = Infinity;
                                deadCount++;
                            }
                            processChannelUI(c);
                        };

                        const worker = async () => {
                            while (true) {
                                if (currentIndex < channels.length) {
                                    const c = channels[currentIndex++];
                                    if (c) await fetchChannel(c);
                                } else if (isFetchingSubscriptions) {
                                    await new Promise(r => setTimeout(r, 200));
                                } else {
                                    break;
                                }
                            }
                        };

                        const numWorkers = isFetchingSubscriptions ? CONCURRENCY_LIMIT : Math.min(CONCURRENCY_LIMIT, channels.length);
                        const workers = Array.from({ length: numWorkers }, (_, i) =>
                            new Promise(r => setTimeout(r, i * 80)).then(() => worker())
                        );
                        await Promise.all(workers);



                        this.lastScanChannels = channels;
                    }

                    if (isFetchOnly) {
                        btn.textContent = `Fetch Complete (${channels.length})`;
                    } else if (!skipWorkerPool) {
                        btn.textContent = `Scan Complete (${channels.length})`;
                    } else {
                        btn.textContent = `Updated (${channels.length})`;
                    }

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
                    window.YPP.Utils?.log('runScan worker error', 'CHANNEL-HEALTH', 'error', e);
                    btn.textContent = 'Error';
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
            }; // end startProcessing

            // Trigger immediately if we're doing a skip-fetch re-render
            if (skipFetch && channels.length > 0) {
                startedProcessing = true;
                startProcessing();
            }

        } catch (e) {
            window.YPP.Utils?.log('runScan error', 'CHANNEL-HEALTH', 'error', e);
            const btn2 = overlay.querySelector(isShorts ? '#ypp-health-search-shorts-btn' : '#ypp-health-scan-btn');
            if (btn2) { btn2.textContent = 'Error'; btn2.disabled = false; btn2.style.opacity = '1'; }
        }
    }

    /**
     * Trigger a Shorts-only scan. Fully independent of the Video scan.
     */
    static async runShortsScan(overlay, filterSel, sortSel, searchInput) {
        overlay._currentContentType = 'short';

        // Reflect the tab change in the UI
        const ctypeBtns = overlay.querySelectorAll('.ypp-ctype-btn');
        ctypeBtns.forEach(b => b.classList.remove('ypp-ctype-active'));
        const shortBtn = Array.from(ctypeBtns).find(b => b.dataset.ctype === 'short');
        if (shortBtn) shortBtn.classList.add('ypp-ctype-active');

        return this.runScan(overlay, filterSel, sortSel, searchInput, false, 'short');
    }
}
