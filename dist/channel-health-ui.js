var e=Object.defineProperty,t=(t,a,l)=>((t,a,l)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:l}):t[a]=l)(t,"symbol"!=typeof a?a+"":a,l);import"./content.js";import{ChannelHealthDB as a}from"./channel-health-db.js";import{ChannelHealthScanner as l}from"./channel-health-scanner.js";import{ChannelHealthHistory as n}from"./channel-health-history.js";import{ChannelHealthActions as i}from"./channel-health-actions.js";import"./channel-health-api.js";import"./custom-dialog.js";import"./channel-health-row-builder.js";class s{static async openModal(){var e,t,s,o,r;if(document.getElementById("ypp-health-modal"))return;const d=document.createElement("div");d.className="ypp-health-modal-overlay open",d.id="ypp-health-modal",document.documentElement.appendChild(d);const p={activeDays:30,deadDays:90};l.currentSettings=p,d.innerHTML=String.raw`
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
                            <button id="ypp-health-fetch-list-btn" class="ypp-health-btn-scan" style="background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);">Fetch List</button>
                            <button id="ypp-health-scan-btn" class="ypp-health-btn-scan ypp-disabled-btn" style="opacity: 0.5; cursor: not-allowed; transition: all 0.3s;">Scan Videos</button>
                            <button id="ypp-health-search-shorts-btn" class="ypp-health-btn-secondary ypp-disabled-btn" style="background: rgba(255,255,255,0.05); color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: not-allowed; opacity: 0.5; transition: all 0.3s;">Scan Shorts</button>
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
                            <input type="number" id="ypp-setting-active-days" value="${p.activeDays}" class="ypp-settings-input" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; color: #fff; font-size: 15px; font-weight: 500; outline: none; transition: border-color 0.2s, box-shadow 0.2s;" />
                        </div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 8px; line-height: 1.4;">Channels with uploads newer than this are <span style="color:#2ed573; font-weight:500;">Active</span>.</div>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <label style="display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px;">Dead Threshold (Days)</label>
                        <div style="position: relative; display: flex; align-items: center;">
                            <input type="number" id="ypp-setting-dead-days" value="${p.deadDays}" class="ypp-settings-input" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; color: #fff; font-size: 15px; font-weight: 500; outline: none; transition: border-color 0.2s, box-shadow 0.2s;" />
                        </div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 8px; line-height: 1.4;">Channels older than this are <span style="color:#ff4e45; font-weight:500;">Dead</span>. In between are <span style="color:#ffb340; font-weight:500;">Inactive</span>.</div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 32px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                        <button id="ypp-settings-cancel-btn" class="ypp-settings-cancel-btn" style="flex: 1; background: rgba(255,255,255,0.05); color: #fff; border: none; padding: 12px; border-radius: 14px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s;">Cancel</button>
                        <button id="ypp-settings-save-btn" class="ypp-settings-save-btn" style="flex: 1; background: #3b82f6; color: #fff; border: none; padding: 12px; border-radius: 14px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">Save Settings</button>
                    </div>

                    <!-- Advanced Tools -->
                    <div style="margin-top: 24px;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Advanced Tools</div>
                        <div style="display: flex; gap: 12px;">
                            <button id="ypp-health-export-csv-btn-advanced" class="ypp-settings-advanced-btn" style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 8px; color: #cbd5e1; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s;">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Export CSV
                            </button>
                            <button id="ypp-health-unsub-history-btn-advanced" class="ypp-settings-advanced-btn" style="flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 8px; color: #cbd5e1; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s;">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Unsub History
                            </button>
                        </div>
                    </div>
                </div>

                <div class="ypp-organizer-body" style="zoom: 0.90; flex-direction: row; padding: 32px; overflow: hidden; display: flex; flex: 1; background: transparent; gap: 32px;">
                    <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                        <div style="display: flex; gap: 24px; margin-bottom: 24px;">
                            <div class="ypp-health-stat" data-filter="active">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#2ed573;"></div> Active (< <span id="ypp-health-active-days-label">${p.activeDays}</span> days)</div>
                                <div class="ypp-health-stat-value" id="ypp-health-active">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="warning">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#ffb340;"></div> Inactive</div>
                                <div class="ypp-health-stat-value" style="color: rgba(241, 245, 249, 0.8);" id="ypp-health-warning">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="dead">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#ff4e45;"></div> Dead (> <span id="ypp-health-dead-days-label">${p.deadDays}</span> days)</div>
                                <div class="ypp-health-stat-value" style="color: rgba(241, 245, 249, 0.5);" id="ypp-health-dead">0</div>
                            </div>
                            <div class="ypp-health-stat" data-filter="error">
                                <div class="ypp-health-stat-label"><div style="width:6px; height:6px; border-radius:50%; background:#94a3b8;"></div> Failed Scans</div>
                                <div class="ypp-health-stat-value" style="color: rgba(241, 245, 249, 0.4);" id="ypp-health-error">0</div>
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
        `,null==(e=window.anime)||e.call(window,{targets:".ypp-organizer-modal",opacity:[0,1],scale:[.95,1],easing:"spring(1, 80, 10, 0)",duration:600}),null==(t=d.querySelector(".ypp-modal-close"))||t.addEventListener("click",()=>{d.classList.remove("open"),setTimeout(()=>d.remove(),300)}),d.addEventListener("scanProgress",e=>{var t;const{done:a,total:l,complete:n}=e.detail,i=d.querySelector("#ypp-health-progress-container"),s=d.querySelector("#ypp-health-progress-fill");if(i&&s){!n&&a<=5&&(i.style.opacity="1");const e=l>0?a/l*100:0;null==(t=window.anime)||t.call(window,{targets:s,width:`${e}%`,duration:300,easing:"linear"}),n&&setTimeout(()=>{i.style.opacity="0"},800)}});const c=d.querySelector("#ypp-health-filter-dropdown"),h=d.querySelector("#ypp-health-sort-dropdown"),y=d.querySelector("#ypp-health-search-input"),u=d.querySelectorAll(".ypp-ctype-btn"),b=d.querySelector("#ypp-health-fetch-list-btn"),g=d.querySelector("#ypp-health-scan-btn"),v=d.querySelector("#ypp-health-search-shorts-btn");let x=!1;b.addEventListener("click",async()=>{b.style.opacity="0.5",b.style.cursor="not-allowed",b.textContent="Fetching...",await l.fetchOnly(d,c,h,y),x=!0,b.style.display="none",g.classList.remove("ypp-disabled-btn"),g.style.opacity="1",g.style.cursor="pointer",v.classList.remove("ypp-disabled-btn"),v.style.opacity="1",v.style.cursor="pointer"}),g.addEventListener("click",()=>{x?l.runScan(d,c,h,y,!1):alert("Please run 'Fetch List' first to load your channels.")}),v.addEventListener("click",()=>{x?l.runShortsScan(d,c,h,y):alert("Please run 'Fetch List' first to load your channels.")}),null==(s=d.querySelector("#ypp-health-unsub-history-btn-advanced"))||s.addEventListener("click",()=>{n.show(d)});const f=d.querySelector("#ypp-health-settings-btn"),w=d.querySelector("#ypp-health-settings-panel");null==f||f.addEventListener("click",()=>{var e,t;"none"===w.style.display?(w.style.display="block",null==(e=window.anime)||e.call(window,{targets:w,opacity:[0,1],translateY:[-10,0],duration:300,easing:"easeOutQuint"})):null==(t=window.anime)||t.call(window,{targets:w,opacity:[1,0],translateY:[0,-10],duration:200,easing:"easeInQuad",complete:()=>w.style.display="none"})}),null==(o=d.querySelector("#ypp-settings-cancel-btn"))||o.addEventListener("click",()=>{w.style.display="none"}),null==(r=d.querySelector("#ypp-settings-save-btn"))||r.addEventListener("click",async()=>{const e=parseInt(d.querySelector("#ypp-setting-active-days").value,10),t=parseInt(d.querySelector("#ypp-setting-dead-days").value,10);if(e>0&&t>e){const n={activeDays:e,deadDays:t};if(!(await a.saveSettings(n)))return void alert("Failed to save settings. Please try again.");l.currentSettings=n,w.style.display="none",l.lastScanChannels&&l.runScan(d,c,h,y,!0)}else alert("Invalid settings. Dead days must be greater than active days, and both must be > 0.")});const m=d.querySelector("#ypp-health-select-all-btn"),k=d.querySelector("#ypp-health-unselect-all-btn");null==m||m.addEventListener("click",()=>{d.querySelectorAll(".ypp-channel-health-row").forEach(e=>{if("none"!==e.style.display){const t=e.querySelector(".ypp-unsub-checkbox");t&&(t.checked=!0)}}),d.querySelector("#ypp-health-results").dispatchEvent(new Event("change"))}),null==k||k.addEventListener("click",()=>{d.querySelectorAll(".ypp-unsub-checkbox").forEach(e=>e.checked=!1),d.querySelector("#ypp-health-results").dispatchEvent(new Event("change"))});const S=d.querySelector("#ypp-health-unsub-btn"),q=d.querySelector("#ypp-health-unsub-btn-bottom");null==S||S.addEventListener("click",()=>i.bulkUnsubscribe(d)),null==q||q.addEventListener("click",()=>i.bulkUnsubscribe(d));const C=d.querySelector("#ypp-health-export-csv-btn-advanced");null==C||C.addEventListener("click",()=>{if(!l.lastScanChannels||0===l.lastScanChannels.length)return void alert("No channels scanned yet. Please start a scan first.");const e=[["Channel Name","Channel ID","Status","Last Upload"]];l.lastScanChannels.forEach(t=>{let a=t.status;"video"===d._currentContentType?a=t.videoInfo?t.videoInfo.status:"unknown":"short"===d._currentContentType&&(a=t.shortInfo?t.shortInfo.status:"unknown");let l=t.lastUploadText||"Unknown";e.push([`"${t.name.replace(/"/g,'""')}"`,t.id,a,`"${l}"`])});const t="data:text/csv;charset=utf-8,"+e.map(e=>e.join(",")).join("\\n"),a=encodeURI(t),n=document.createElement("a");n.setAttribute("href",a),n.setAttribute("download","channel_health_export.csv"),document.body.appendChild(n),n.click(),document.body.removeChild(n)});const E=d.querySelector("#ypp-health-view-toggle-btn"),L=d.querySelector("#ypp-view-icon-grid"),z=d.querySelector("#ypp-view-icon-list");null==E||E.addEventListener("click",()=>{const e=d.querySelector("#ypp-health-results");if(e){e.classList.toggle("ypp-grid-view")?(L.style.display="none",z.style.display="block"):(L.style.display="block",z.style.display="none")}});const I=()=>{const e=d.querySelector("#ypp-health-results-list");if(!e||!l.lastScanChannels)return;const t=(null==c?void 0:c.value)||"all",a=(null==y?void 0:y.value.toLowerCase().trim())||"",n=d._currentContentType||"all";let i=0,s=0,o=0,r=0;e.querySelectorAll(".ypp-channel-health-row").forEach(e=>{let l;l="video"===n?e.dataset.videoStatus||"dead":"short"===n?e.dataset.shortStatus||"dead":e.dataset.status||"dead";const d=!a||(e.dataset.name||"").toLowerCase().includes(a),p=d&&("all"===t||l===t);e.style.display=p?"flex":"none",d&&("active"===l?i++:"warning"===l?s++:"dead"===l?o++:"error"===l&&r++)});const p=d.querySelector("#ypp-health-active"),h=d.querySelector("#ypp-health-warning"),u=d.querySelector("#ypp-health-dead"),b=d.querySelector("#ypp-health-error");p&&(p.textContent=i),h&&(h.textContent=s),u&&(u.textContent=o),b&&(b.textContent=r),A()},A=()=>{const e=d.querySelector("#ypp-health-results-list");if(!e)return;const t=Array.from(e.querySelectorAll(".ypp-channel-health-row")),a=(null==h?void 0:h.value)||"latest";t.sort((e,t)=>{if("az"===a)return(e.dataset.name||"").localeCompare(t.dataset.name||"");let l=1/0,n=1/0;const i=d._currentContentType||"all";return"video"===i?(l=parseInt(e.dataset.videoUploadTime,10),n=parseInt(t.dataset.videoUploadTime,10)):"short"===i?(l=parseInt(e.dataset.shortUploadTime,10),n=parseInt(t.dataset.shortUploadTime,10)):(l=parseInt(e.dataset.uploadTime,10),n=parseInt(t.dataset.uploadTime,10)),isNaN(l)&&(l=1/0),isNaN(n)&&(n=1/0),"latest"===a?l-n:"oldest"===a?n-l:0}),t.forEach(t=>e.appendChild(t))};let D;null==c||c.addEventListener("change",I),null==y||y.addEventListener("input",()=>{clearTimeout(D),D=setTimeout(()=>{I()},200)}),null==h||h.addEventListener("change",()=>{A()}),u.forEach(e=>{e.addEventListener("click",()=>{u.forEach(e=>e.classList.remove("ypp-ctype-active")),e.classList.add("ypp-ctype-active"),d._currentContentType=e.dataset.ctype,d.dataset.ctype=e.dataset.ctype,I()})});d.querySelectorAll(".ypp-health-stat").forEach(e=>{e.addEventListener("click",()=>{c&&e.dataset.filter&&(c.value=e.dataset.filter,I())})}),a.getSettings().then(e=>{l.currentSettings=e;const t=d.querySelector("#ypp-setting-active-days"),a=d.querySelector("#ypp-setting-dead-days"),n=d.querySelector("#ypp-health-active-days-label"),i=d.querySelector("#ypp-health-dead-days-label");t&&(t.value=e.activeDays),a&&(a.value=e.deadDays),n&&(n.textContent=e.activeDays),i&&(i.textContent=e.deadDays)})}}t(s,"featureId","channelHealthUI"),t(s,"executionPhase","idle"),t(s,"priority",999);export{s as ChannelHealthUI};
