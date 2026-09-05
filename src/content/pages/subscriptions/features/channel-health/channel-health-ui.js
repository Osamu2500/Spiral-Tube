/**
 * Channel Health UI
 * Owns: DOM rendering, scanning, animations, and modal dialog for the Channel Health Dashboard.
 * Relies on ChannelHealthAPI for YouTube communications.
 * Does not affect functionality outside the Channel Health feature.
 */
import anime from 'animejs/lib/anime.es.js';
import { ChannelHealthDB } from './channel-health-db.js';
import { ChannelHealthScanner } from './channel-health-scanner.js';
import { ChannelHealthHistory } from './channel-health-history.js';
import { ChannelHealthActions } from './channel-health-actions.js';

export class ChannelHealthUI {
    static featureId = 'channelHealthUI';
    static executionPhase = 'idle';
    static priority = 999;

    static async openModal() {
        if (document.getElementById('ypp-health-modal')) return;

        const overlay = document.createElement('div');
        overlay.className = 'ypp-health-modal-overlay open';
        overlay.id = 'ypp-health-modal';
        document.documentElement.appendChild(overlay);

        const settings = await ChannelHealthDB.getSettings();
        ChannelHealthScanner.currentSettings = settings;

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
                            <button id="ypp-health-scan-btn" class="ypp-health-btn-scan">Scan Videos</button>
                            <button id="ypp-health-search-shorts-btn" class="ypp-health-btn-secondary" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer;">Scan Shorts</button>
                        </div>
                        <button id="ypp-health-unsub-btn" class="ypp-health-btn-unsub" style="display: none;">Unsubscribe Selected</button>
                        
                        <!-- Settings button -->
                        <button id="ypp-health-settings-btn" class="ypp-health-btn-secondary" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            Settings
                        </button>
                        
                        <div style="width: 1px; height: 24px; background: rgba(255,255,255,0.1); margin: 0 8px;"></div>
                        <button class="ypp-modal-close ypp-health-btn-close">&times;</button>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div id="ypp-health-progress-container" style="height:3px; background:rgba(255,255,255,0.05); overflow:hidden; opacity:0; transition: opacity 0.3s; width:100%;">
                    <div id="ypp-health-progress-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #3b82f6, #2ed573); border-radius:3px;"></div>
                </div>

                <!-- Settings Panel Overlay -->
                <div id="ypp-health-settings-panel" style="display: none; position: absolute; top: 72px; right: 24px; background: rgba(15, 17, 23, 0.98); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 28px; width: 360px; z-index: 100; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset;">
                    <div style="font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; letter-spacing: -0.3px;">
                        <div style="background: rgba(59, 130, 246, 0.15); padding: 8px; border-radius: 12px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
                        </div>
                        Dashboard Settings
                    </div>
                    <div style="margin-bottom: 18px;">
                        <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px;">Active Threshold (Days)</label>
                        <div style="position: relative; display: flex; align-items: center;">
                            <input type="number" id="ypp-setting-active-days" value="${settings.activeDays}" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; color: #fff; font-size: 15px; font-weight: 500; outline: none; transition: border-color 0.2s, box-shadow 0.2s;" onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.2)'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'; this.style.boxShadow='none'" />
                        </div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 8px; line-height: 1.4;">Channels with uploads newer than this are <span style="color:#2ed573; font-weight:500;">Active</span>.</div>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px;">Dead Threshold (Days)</label>
                        <div style="position: relative; display: flex; align-items: center;">
                            <input type="number" id="ypp-setting-dead-days" value="${settings.deadDays}" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; color: #fff; font-size: 15px; font-weight: 500; outline: none; transition: border-color 0.2s, box-shadow 0.2s;" onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.2)'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'; this.style.boxShadow='none'" />
                        </div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 8px; line-height: 1.4;">Channels older than this are <span style="color:#ff4e45; font-weight:500;">Dead</span>. In between are <span style="color:#ffb340; font-weight:500;">Inactive</span>.</div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 32px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                        <button id="ypp-settings-cancel-btn" style="flex: 1; background: rgba(255,255,255,0.05); color: #fff; border: none; padding: 12px; border-radius: 14px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">Cancel</button>
                        <button id="ypp-settings-save-btn" style="flex: 1; background: #3b82f6; color: #fff; border: none; padding: 12px; border-radius: 14px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">Save Settings</button>
                    </div>

                    <!-- Advanced Tools -->
                    <div style="margin-top: 24px;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Advanced Tools</div>
                        <div style="display: flex; gap: 12px;">
                            <button id="ypp-health-export-csv-btn-advanced" style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 8px; color: #cbd5e1; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255,255,255,0.04)'; this.style.color='#cbd5e1';">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Export CSV
                            </button>
                            <button id="ypp-health-unsub-history-btn-advanced" style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 8px; color: #cbd5e1; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255,255,255,0.04)'; this.style.color='#cbd5e1';">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Unsub History
                            </button>
                        </div>
                    </div>
                </div>

                <div class="ypp-organizer-body" style="flex-direction: row; padding: 32px; overflow: hidden; display: flex; flex: 1; background: transparent; gap: 32px;">
                    <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                        <div style="display: flex; gap: 24px; margin-bottom: 24px;">
                            <div class="ypp-health-stat" data-filter="active">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#2ed573;"></div> Active (< ${settings.activeDays} days)</div>
                                <div class="ypp-health-stat-value" id="ypp-health-active">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="warning">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#ffb340;"></div> Inactive</div>
                                <div class="ypp-health-stat-value" style="color: rgba(241, 245, 249, 0.8);" id="ypp-health-warning">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="dead">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#ff4e45;"></div> Dead (> ${settings.deadDays} days)</div>
                                <div class="ypp-health-stat-value" style="color: rgba(241, 245, 249, 0.5);" id="ypp-health-dead">0</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; margin-bottom: 16px; align-items: center;">
                            <div style="display: flex; gap: 8px; margin-right: auto; flex-shrink:0;">
                                <button id="ypp-health-select-all-btn" class="ypp-health-btn-secondary" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer;">Select All Visible</button>
                                <button id="ypp-health-unselect-all-btn" class="ypp-health-btn-tertiary" style="background: rgba(255,255,255,0.02); color: #94a3b8; border: 1px solid rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer;">Unselect All</button>
                                <button id="ypp-health-unsub-btn-bottom" class="ypp-health-btn-unsub" style="display: none; background: rgba(255, 78, 69, 0.15); color: #ff6b6b; border: 1px solid rgba(255, 78, 69, 0.4); padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Unsubscribe Selected</button>
                            </div>
                            <div style="display:flex;gap:3px;align-items:center;flex-shrink:0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:3px;">
                                <button class="ypp-ctype-btn ypp-ctype-active" data-ctype="all" style="border-radius:6px;padding:5px 11px;">All</button>
                                <button class="ypp-ctype-btn" data-ctype="video" style="border-radius:6px;padding:5px 11px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;opacity:0.9"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>Videos</button>
                                <button class="ypp-ctype-btn" data-ctype="short" style="border-radius:6px;padding:5px 11px;"><svg width="9" height="11" viewBox="0 0 18 24" fill="currentColor" style="flex-shrink:0;opacity:0.9"><rect x="0" y="0" width="18" height="24" rx="4"/><path d="M6.5 8.5l6 3.5-6 3.5V8.5z" fill="rgba(0,0,0,0.45)"/></svg>Shorts</button>
                            </div>
                            <div style="position: relative; flex: 1; max-width: 200px; display: flex; align-items: center;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" style="position: absolute; left: 14px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" class="ypp-health-input" id="ypp-health-search-input" placeholder="Search channels..." style="width: 100%; padding: 10px 16px 10px 38px; border-radius: 8px;"/>
                            </div>

                            <select id="ypp-health-filter-dropdown" class="ypp-health-select" style="border-radius: 8px;">
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="warning">Inactive</option>
                                <option value="dead">Dead</option>
                                <option value="error">Failed Scan</option>
                            </select>
                            <select id="ypp-health-sort-dropdown" class="ypp-health-select" style="border-radius: 8px;">
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="az">Alphabetical</option>
                            </select>
                            <button id="ypp-health-view-toggle-btn" class="ypp-health-btn-secondary" style="background: rgba(255,255,255,0.03); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Toggle Grid/List View">
                                <svg id="ypp-view-icon-grid" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                <svg id="ypp-view-icon-list" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
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

        // Animate entrance
        window.anime?.({
            targets: '.ypp-organizer-modal',
            opacity: [0, 1],
            scale: [0.95, 1],
            easing: 'spring(1, 80, 10, 0)',
            duration: 600
        });

        // Add event listeners
        overlay.querySelector('.ypp-modal-close')?.addEventListener('click', () => {
            overlay.classList.remove('open');
            setTimeout(() => overlay.remove(), 300);
        });

        // Progress Bar Event Listener
        overlay.addEventListener('scanProgress', (e) => {
            const { done, total, complete } = e.detail;
            const container = overlay.querySelector('#ypp-health-progress-container');
            const fill = overlay.querySelector('#ypp-health-progress-fill');
            if (container && fill) {
                if (!complete && done <= 5) {
                    container.style.opacity = '1';
                }
                const pct = total > 0 ? (done / total) * 100 : 0;
                window.anime?.({
                    targets: fill,
                    width: `${pct}%`,
                    duration: 300,
                    easing: 'linear'
                });
                
                if (complete) {
                    setTimeout(() => { container.style.opacity = '0'; }, 800);
                }
            }
        });

        const filterSel = overlay.querySelector('#ypp-health-filter-dropdown');
        const sortSel = overlay.querySelector('#ypp-health-sort-dropdown');
        const searchInput = overlay.querySelector('#ypp-health-search-input');
        const ctypeBtns = overlay.querySelectorAll('.ypp-ctype-btn');

        const scanBtn = overlay.querySelector('#ypp-health-scan-btn');
        scanBtn.addEventListener('click', () => {
            ChannelHealthScanner.runScan(overlay, filterSel, sortSel, searchInput, false);
        });

        const scanShortsBtn = overlay.querySelector('#ypp-health-search-shorts-btn');
        scanShortsBtn.addEventListener('click', () => {
            ChannelHealthScanner.runShortsScan(overlay, filterSel, sortSel, searchInput);
        });

        overlay.querySelector('#ypp-health-unsub-history-btn-advanced')?.addEventListener('click', () => {
            ChannelHealthHistory.show(overlay);
        });

        // Settings Logic
        const settingsBtn = overlay.querySelector('#ypp-health-settings-btn');
        const settingsPanel = overlay.querySelector('#ypp-health-settings-panel');
        settingsBtn?.addEventListener('click', () => {
            if (settingsPanel.style.display === 'none') {
                settingsPanel.style.display = 'block';
                window.anime?.({
                    targets: settingsPanel,
                    opacity: [0, 1],
                    translateY: [-10, 0],
                    duration: 300,
                    easing: 'easeOutQuint'
                });
            } else {
                window.anime?.({
                    targets: settingsPanel,
                    opacity: [1, 0],
                    translateY: [0, -10],
                    duration: 200,
                    easing: 'easeInQuad',
                    complete: () => settingsPanel.style.display = 'none'
                });
            }
        });

        overlay.querySelector('#ypp-settings-cancel-btn')?.addEventListener('click', () => {
            settingsPanel.style.display = 'none';
        });

        overlay.querySelector('#ypp-settings-save-btn')?.addEventListener('click', async () => {
            const newActive = parseInt(overlay.querySelector('#ypp-setting-active-days').value, 10);
            const newDead = parseInt(overlay.querySelector('#ypp-setting-dead-days').value, 10);
            if (newActive > 0 && newDead > newActive) {
                const newSettings = { activeDays: newActive, deadDays: newDead };
                const success = await ChannelHealthDB.saveSettings(newSettings);
                if (!success) {
                    alert('Failed to save settings. Please try again.');
                    return;
                }
                ChannelHealthScanner.currentSettings = newSettings;
                settingsPanel.style.display = 'none';
                
                // Re-evaluate and re-render if data is loaded
                if (ChannelHealthScanner.lastScanChannels) {
                    ChannelHealthScanner.runScan(overlay, filterSel, sortSel, searchInput, true);
                }
            } else {
                alert('Invalid settings. Dead days must be greater than active days, and both must be > 0.');
            }
        });

        // Selection & Action Logic
        const selectAllBtn = overlay.querySelector('#ypp-health-select-all-btn');
        const unselectAllBtn = overlay.querySelector('#ypp-health-unselect-all-btn');

        selectAllBtn?.addEventListener('click', () => {
            overlay.querySelectorAll('.ypp-channel-health-row').forEach(row => {
                if (row.style.display !== 'none') {
                    const cb = row.querySelector('.ypp-unsub-checkbox');
                    if (cb) cb.checked = true;
                }
            });
            overlay.querySelector('#ypp-health-results').dispatchEvent(new Event('change'));
        });

        unselectAllBtn?.addEventListener('click', () => {
            overlay.querySelectorAll('.ypp-unsub-checkbox').forEach(cb => cb.checked = false);
            overlay.querySelector('#ypp-health-results').dispatchEvent(new Event('change'));
        });

        const unsubBtn = overlay.querySelector('#ypp-health-unsub-btn');
        const unsubBtnBottom = overlay.querySelector('#ypp-health-unsub-btn-bottom');
        
        unsubBtn?.addEventListener('click', () => ChannelHealthActions.bulkUnsubscribe(overlay));
        unsubBtnBottom?.addEventListener('click', () => ChannelHealthActions.bulkUnsubscribe(overlay));

        // Export Logic
        const exportBtn = overlay.querySelector('#ypp-health-export-csv-btn-advanced');
        exportBtn?.addEventListener('click', () => {
            if (!ChannelHealthScanner.lastScanChannels || ChannelHealthScanner.lastScanChannels.length === 0) {
                alert('No channels scanned yet. Please start a scan first.');
                return;
            }
            
            const rows = [
                ['Channel Name', 'Channel ID', 'Status', 'Last Upload']
            ];
            
            ChannelHealthScanner.lastScanChannels.forEach(c => {
                let status = c.status;
                if (overlay._currentContentType === 'video') status = c.videoInfo ? c.videoInfo.status : 'unknown';
                else if (overlay._currentContentType === 'short') status = c.shortInfo ? c.shortInfo.status : 'unknown';
                
                let lastUpload = c.lastUploadText || 'Unknown';
                rows.push([
                    `"${c.name.replace(/"/g, '""')}"`,
                    c.id,
                    status,
                    `"${lastUpload}"`
                ]);
            });
            
            const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "channel_health_export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // View Toggle Logic
        const viewToggleBtn = overlay.querySelector('#ypp-health-view-toggle-btn');
        const gridIcon = overlay.querySelector('#ypp-view-icon-grid');
        const listIcon = overlay.querySelector('#ypp-view-icon-list');
        
        viewToggleBtn?.addEventListener('click', () => {
            const resultsContainer = overlay.querySelector('#ypp-health-results');
            if (resultsContainer) {
                const isGrid = resultsContainer.classList.toggle('ypp-grid-view');
                if (isGrid) {
                    gridIcon.style.display = 'none';
                    listIcon.style.display = 'block';
                } else {
                    gridIcon.style.display = 'block';
                    listIcon.style.display = 'none';
                }
            }
        });

        // Filtering and Sorting
        const applyFilters = () => {
            if (ChannelHealthScanner.lastScanChannels) {
                ChannelHealthScanner.runScan(overlay, filterSel, sortSel, searchInput, true);
            }
        };
        
        const sortResults = () => {
            const list = overlay.querySelector('#ypp-health-results-list');
            if (!list) return;
            const rows = Array.from(list.querySelectorAll('.ypp-channel-health-row'));
            const sortVal = sortSel.value;
            rows.sort((a, b) => {
                if (sortVal === 'az') return a.dataset.name.localeCompare(b.dataset.name);
                let tA = Infinity, tB = Infinity;
                const ct = overlay._currentContentType || 'all';
                if (ct === 'video') { tA = parseInt(a.dataset.videoUploadTime, 10); tB = parseInt(b.dataset.videoUploadTime, 10); }
                else if (ct === 'short') { tA = parseInt(a.dataset.shortUploadTime, 10); tB = parseInt(b.dataset.shortUploadTime, 10); }
                else { tA = parseInt(a.dataset.uploadTime, 10); tB = parseInt(b.dataset.uploadTime, 10); }
                
                if (isNaN(tA)) tA = Infinity;
                if (isNaN(tB)) tB = Infinity;
                
                if (sortVal === 'latest') return tA - tB; // smallest diff first
                if (sortVal === 'oldest') return tB - tA; // largest diff first
                return 0;
            });
            rows.forEach(r => list.appendChild(r));
        };

        filterSel?.addEventListener('change', applyFilters);
        
        let searchTimeout;
        searchInput?.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 300);
        });

        sortSel?.addEventListener('change', sortResults);

        // Content Type Switcher
        ctypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                ctypeBtns.forEach(b => b.classList.remove('ypp-ctype-active'));
                btn.classList.add('ypp-ctype-active');
                overlay._currentContentType = btn.dataset.ctype;
                applyFilters();
                sortResults();
            });
        });
    }
}
