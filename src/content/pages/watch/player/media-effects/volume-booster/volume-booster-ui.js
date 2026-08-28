import anime from 'animejs/lib/anime.es.js';

import { EQTabUI } from './ui/tab-eq.js';
import { DynamicsTabUI } from './ui/tab-dynamics.js';
import { SpatialTabUI } from './ui/tab-spatial.js';
import { FXTabUI } from './ui/tab-fx.js';
export class VolumeBoosterUI {
    static featureId = 'volumeBoosterUI';
    static executionPhase = 'idle';
    static priority = 999;

    static saveVolumeSettings(ctx) {
        // Bug fix: Use a safe inline debounce so this works on external sites
        // where window.YPP.Utils.debounce may not be defined.
        if (!this.debouncedSave) {
            const debounce = window.YPP?.Utils?.debounce
                || ((fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; });
            this.debouncedSave = debounce((ctxArg) => {
                const newSettings = {
                    volumeLevel: ctxArg._volumeGain,
                    volumeBalance: ctxArg._balance,
                    volumeCompressor: ctxArg._compressorEnabled,
                    volumeMono: ctxArg._monoEnabled,
                    volumeStereoWidth: ctxArg._stereoWidth,
                    volumeBypassed: ctxArg._bypassed,
                    volumeVisualizerMode: ctxArg._visualizerMode,
                    volumeVinylMode: ctxArg._vinylMode,
                    volumePlaybackRate: ctxArg._playbackRate,
                    volumeReverbEnv: ctxArg._reverbEnv,
                    volumeReverbMix: ctxArg._reverbMix,
                    volumeInvertL: ctxArg._invertL,
                    volumeInvertR: ctxArg._invertR,
                    volumeAutoGain: ctxArg._autoGain,
                    volumeEqBands: JSON.stringify(ctxArg._eqGains),
                    volumeCompThreshold: ctxArg.compressorNode ? ctxArg.compressorNode.threshold.value : -24,
                    volumeCompRatio: ctxArg.compressorNode ? ctxArg.compressorNode.ratio.value : 4,
                    volumeCompAttack: ctxArg.compressorNode ? ctxArg.compressorNode.attack.value : 0.003,
                    volumeCompRelease: ctxArg.compressorNode ? ctxArg.compressorNode.release.value : 0.25,
                    volumeCompKnee: ctxArg.compressorNode ? ctxArg.compressorNode.knee.value : 30
                };
                if (window.YPP?.MainApp?.saveSettings) {
                    window.YPP.MainApp.saveSettings(newSettings);
                } else if (chrome?.storage?.local) {
                    chrome.storage.local.get('settings').then(data => {
                        const updated = { ...(data.settings || {}), ...newSettings };
                        chrome.storage.local.set({ settings: updated });
                    }).catch(() => {});
                }
                if (window.YPP?.featureManager?.getFeature('domainMemory')?.recordChange) {
                    window.YPP.featureManager.getFeature('domainMemory').recordChange('volumeBoost');
                }
            }, 300);
        }
        this.debouncedSave(ctx);
    }

    static toggleEQPanel(ctx, video, anchorBtn) {
        // ALWAYS fetch the active video, overriding any stale reference from UI closures
        video = document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');

        if (ctx._volumePopup) {
            if (document.body.contains(ctx._volumePopup)) ctx._volumePopup.remove();
            if (ctx._volumePopup.parentNode) ctx._volumePopup.parentNode.removeChild(ctx._volumePopup);
            ctx._volumePopup = null;
            
            // Force clean up any orphaned elements
            document.querySelectorAll('#ypp-eq-panel').forEach(e => e.remove());
            
            if (anchorBtn && anchorBtn.classList) anchorBtn.classList.remove('active');
            
            if (ctx._volumePopupOutsideHandler) {
                if (ctx.removeListener) ctx.removeListener(document, 'click', ctx._volumePopupOutsideHandler);
                document.removeEventListener('click', ctx._volumePopupOutsideHandler);
                ctx._volumePopupOutsideHandler = null;
            }
            if (ctx._volumePopupEscapeHandler) {
                if (ctx.removeListener) ctx.removeListener(document, 'keydown', ctx._volumePopupEscapeHandler);
                document.removeEventListener('keydown', ctx._volumePopupEscapeHandler);
                ctx._volumePopupEscapeHandler = null;
            }
            return;
        }

        // Force clean up before building a new one
        document.querySelectorAll('#ypp-eq-panel').forEach(e => e.remove());

        if (anchorBtn && anchorBtn.classList) anchorBtn.classList.add('active');

        const panel = document.createElement('div');
        panel.id = 'ypp-eq-panel';

        // Check if opened from Global Bar
        const isGlobalBar = !!anchorBtn.closest('.ypp-global-player-bar');
        if (isGlobalBar) {
            panel.style.boxShadow = '0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)';

            // Position it next to the global bar
            const bar = anchorBtn.closest('.ypp-global-player-bar');
            panel.style.bottom = 'auto';
            const panelHeight = 400; // approx height
            const topPx = Math.max(16, (window.innerHeight - panelHeight) / 2);

            if (bar.classList.contains('ypp-bar-pos-right')) {
                panel.style.right = '76px';
                panel.style.left = 'auto';
                panel.style.top = topPx + 'px';
            } else if (bar.classList.contains('ypp-bar-pos-left')) {
                panel.style.left = '76px';
                panel.style.right = 'auto';
                panel.style.top = topPx + 'px';
            } else if (bar.classList.contains('ypp-bar-pos-top')) {
                panel.style.top = '76px';
                panel.style.right = '24px';
                panel.style.left = 'auto';
            } else {
                panel.style.bottom = '76px';
                panel.style.top = 'auto';
                panel.style.right = '24px';
                panel.style.left = 'auto';
            }
        } else {
            Object.assign(panel.style, {
                position: 'fixed',
                top: '110px',
                right: '24px',
                left: 'auto',
                bottom: 'auto',
                maxHeight: 'calc(100vh - 134px)',
                zIndex: '2147483646'
            });
        }


        // ── Header
        const header = document.createElement('div');
        header.className = 'ypp-eq-header';
        header.innerHTML = `
            <div class="ypp-eq-title-group">
                <div class="ypp-eq-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                        <path d="M7 18h2V6H7v12zm4 4h2V2h-2v20zm-8-8h2v-4H3v4zm12 4h2V6h-2v12zm4-8v4h2v-4h-2z"/>
                    </svg>
                </div>
                <div>
                    <div class="ypp-eq-title">Equalizer</div>
                </div>
            </div>
            <div style="display:flex; align-items:center;">
                <button class="ypp-eq-link-btn" title="Auto-apply preset to this Channel">🔗</button>
                <button class="ypp-eq-ab-btn${ctx._bypassed ? ' active' : ''}" title="Bypass All Effects">A/B</button>
                <button class="ypp-eq-close-btn" id="ypp-eq-close">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        `;
        panel.appendChild(header);

        // -- Draggable Panel Logic --
        let isDragging = false;
        let dragStartX, dragStartY, initialLeft, initialTop;
        header.style.cursor = 'grab';
        
        const onDragMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            panel.style.left = (initialLeft + dx) + 'px';
            panel.style.top = (initialTop + dy) + 'px';
            panel.style.bottom = 'auto'; 
            panel.style.right = 'auto'; 
        };
        
        const onDragEnd = () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'grab';
                document.removeEventListener('mousemove', onDragMove);
                document.removeEventListener('mouseup', onDragEnd);
            }
        };

        header.onmousedown = (e) => {
            if (e.target.closest('button')) return;
            isDragging = true;
            header.style.cursor = 'grabbing';
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            const rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            
            // Only convert to fixed coords on first drag to avoid jump
            panel.style.left = initialLeft + 'px';
            panel.style.top = initialTop + 'px';
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
            panel.style.margin = '0';
            
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragEnd);
            e.preventDefault();
        };

        const abBtn = header.querySelector('.ypp-eq-ab-btn');
        abBtn.onclick = () => {
            if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
            ctx.setBypass(!ctx._bypassed);
            abBtn.classList.toggle('active', ctx._bypassed);
            VolumeBoosterUI.saveVolumeSettings(ctx);
        };

        const linkBtn = header.querySelector('.ypp-eq-link-btn');
        linkBtn.onclick = () => {
            const el = document.querySelector('ytd-video-owner-renderer ytd-channel-name yt-formatted-string a') || document.querySelector('#owner #channel-name a');
            const channel = el ? el.textContent.trim() : null;
            if (!channel) return alert('Could not detect channel name. Make sure a video is playing.');
            
            if (!activePresetBtn) {
                alert('Please select or save a Preset first to link it to this channel.');
                return;
            }
            const presetName = activePresetBtn.textContent;
            
            let profiles = {};
            if (ctx._channelProfiles) profiles = { ...ctx._channelProfiles };
            
            if (profiles[channel] === presetName) {
                if (confirm(`Unlink preset "${presetName}" from channel "${channel}"?`)) {
                    delete profiles[channel];
                    linkBtn.classList.remove('active');
                } else return;
            } else {
                profiles[channel] = presetName;
                linkBtn.classList.add('active');
                alert(`Successfully linked preset "${presetName}" to channel "${channel}"!\n\nThis preset will now auto-apply whenever you watch their videos.`);
            }
            
            ctx._channelProfiles = profiles;
            if (chrome?.storage?.local) {
                chrome.storage.local.get('settings').then(data => {
                    const updated = { ...(data.settings || {}), volumeChannelProfiles: JSON.stringify(profiles) };
                    chrome.storage.local.set({ settings: updated });
                }).catch(() => {});
            }
        };

        header.querySelector('#ypp-eq-close').onclick = () => this.toggleEQPanel(ctx, video, anchorBtn);

        // -- Active Preset State Management --
        let activePresetBtn = null;
        const clearActivePreset = () => {
            if (activePresetBtn && activePresetBtn.textContent !== 'Flat') {
                activePresetBtn.classList.remove('active');
                activePresetBtn = null;
            }
        };

        // ── Volume Gain Row
        const gainRow = document.createElement('div');
        gainRow.className = 'ypp-eq-gain-row';
        const gainValue = document.createElement('span');
        gainValue.className = 'ypp-eq-gain-value';
        gainValue.textContent = Math.round(ctx._volumeGain * 100) + '%';
        const gainSlider = document.createElement('input');
        gainSlider.type = 'range'; gainSlider.min = 1; gainSlider.max = 6; gainSlider.step = 0.05;
        gainSlider.value = ctx._volumeGain;
        gainSlider.className = 'ypp-eq-hslider';
        gainSlider.oninput = (e) => {
            if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
            const v = parseFloat(e.target.value);
            ctx.setVolume(v);
            gainValue.textContent = Math.round(v * 100) + '%';
            anchorBtn.classList.toggle('active', v > 1.01 || ctx._eqGains.some(g => g !== 0) || ctx._balance !== 0);
            clearActivePreset();
            VolumeBoosterUI.saveVolumeSettings(ctx);
            this.updateGainTrack(gainSlider);
        };
        gainRow.innerHTML = `<span class="ypp-eq-row-label">Volume Boost</span>`;
        gainRow.appendChild(gainSlider);
        gainRow.appendChild(gainValue);
        panel.appendChild(gainRow);
        this.updateGainTrack(gainSlider);

        // ── Balance Row
        const balanceRow = document.createElement('div');
        balanceRow.className = 'ypp-eq-gain-row';
        const balanceValue = document.createElement('span');
        balanceValue.className = 'ypp-eq-gain-value';
        balanceValue.textContent = ctx._balance === 0 ? 'C' : (ctx._balance < 0 ? 'L' + Math.abs(Math.round(ctx._balance * 100)) : 'R' + Math.round(ctx._balance * 100));
        const balanceSlider = document.createElement('input');
        balanceSlider.type = 'range'; balanceSlider.min = -1; balanceSlider.max = 1; balanceSlider.step = 0.05;
        balanceSlider.value = ctx._balance;
        balanceSlider.className = 'ypp-eq-hslider ypp-eq-balance-slider';
        balanceSlider.oninput = (e) => {
            if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
            const v = parseFloat(e.target.value);
            ctx.setBalance(v);
            balanceValue.textContent = v === 0 ? 'C' : (v < 0 ? 'L' + Math.abs(Math.round(v * 100)) : 'R' + Math.round(v * 100));
            anchorBtn.classList.toggle('active', ctx._volumeGain > 1.01 || ctx._eqGains.some(g => g !== 0) || v !== 0);
            clearActivePreset();
            this.updateBalanceTrack(balanceSlider);
            VolumeBoosterUI.saveVolumeSettings(ctx);
        };
        balanceSlider.ondblclick = () => {
            if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
            ctx.setBalance(0);
            balanceSlider.value = 0;
            balanceValue.textContent = 'C';
            this.updateBalanceTrack(balanceSlider);
            VolumeBoosterUI.saveVolumeSettings(ctx);
        };
        balanceRow.innerHTML = `<span class="ypp-eq-row-label">Balance</span>`;
        balanceRow.appendChild(balanceSlider);
        balanceRow.appendChild(balanceValue);
        panel.appendChild(balanceRow);
        this.updateBalanceTrack(balanceSlider);

        // ── EQ/Dynamics/Spatial Tabs ──
        const tabBar = document.createElement('div');
        tabBar.style.cssText = 'display:flex;border-bottom:1px solid rgba(255,255,255,0.08);';
        const mkTab = (label, active) => {
            const t = document.createElement('button');
            t.textContent = label;
            const pad = isGlobalBar ? '6px' : '10px';
            const fs  = isGlobalBar ? '10px' : '12px';
            t.style.cssText = `flex:1;padding:${pad};background:transparent;border:none;color:${active ? '#fff' : 'rgba(255,255,255,0.45)'};font-size:${fs};font-weight:600;cursor:pointer;border-bottom:2px solid ${active ? 'rgba(255,255,255,0.7)' : 'transparent'};transition:all 0.2s;font-family:inherit;`;
            t.onmouseenter = () => { if (!t.classList.contains('active')) t.style.color = 'rgba(255,255,255,0.75)'; };
            t.onmouseleave = () => { if (!t.classList.contains('active')) t.style.color = 'rgba(255,255,255,0.45)'; };
            if (active) t.classList.add('active');
            return t;
        };
        const tabEQ  = mkTab('Equalizer', true);
        const tabDyn = mkTab('Dynamics', false);
        const tabSpa = mkTab('Spatial', false);
        const tabFX = mkTab('Voices FX', false);
        tabBar.append(tabEQ, tabDyn, tabSpa, tabFX);
        panel.appendChild(tabBar);

        // ── Presets ──
        const presetsRow = document.createElement('div');
        presetsRow.className = 'ypp-eq-presets-row';
        Object.keys(ctx._presets).forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'ypp-eq-preset-btn';
            btn.textContent = name;
            if (name === 'Flat') { btn.classList.add('active'); activePresetBtn = btn; }
            btn.onclick = () => {
                ctx.applyPreset(name);
                this.syncBandUI(ctx, panel, uiState.canvasEl);
                if (activePresetBtn) activePresetBtn.classList.remove('active');
                btn.classList.add('active');
                activePresetBtn = btn;
                VolumeBoosterUI.saveVolumeSettings(ctx);
            };
            const defaults = ['Flat', 'Bass Boost', 'Vocal Enhancer', 'Night Mode', 'Electronic'];
            if (!defaults.includes(name)) {
                btn.title = `Right-click to delete "${name}"`;
                btn.oncontextmenu = (e) => {
                    e.preventDefault();
                    if (confirm(`Delete custom preset "${name}"?`)) {
                        delete ctx._presets[name];
                        const custom = {};
                        Object.keys(ctx._presets).forEach(k => {
                            if (!defaults.includes(k)) custom[k] = ctx._presets[k];
                        });
                        if (chrome?.storage?.local) {
                            chrome.storage.local.get('settings').then(data => {
                                const updated = { ...(data.settings || {}), volumeCustomPresets: JSON.stringify(custom) };
                                chrome.storage.local.set({ settings: updated });
                            }).catch(() => {});
                        }
                        this.toggleEQPanel(ctx, video, anchorBtn);
                        setTimeout(() => this.toggleEQPanel(ctx, video, anchorBtn), 20);
                    }
                };
            }
            presetsRow.appendChild(btn);
        });

        // Add '+' button for Custom Presets
        const addPresetBtn = document.createElement('button');
        addPresetBtn.className = 'ypp-eq-preset-btn ypp-eq-add-btn';
        addPresetBtn.innerHTML = '+';
        addPresetBtn.title = 'Save Custom Preset';
        addPresetBtn.style.cssText = 'padding: 3px 8px; border-style: dashed;';
        addPresetBtn.onclick = () => {
            const name = prompt('Enter a name for your custom preset (or overwrite existing):');
            if (!name) return;
            
            // Snapshot current state
            const newPreset = {
                eq: [...ctx._eqGains],
                compressor: ctx._compressorEnabled && ctx.compressorNode ? { ratio: ctx.compressorNode.ratio.value, threshold: ctx.compressorNode.threshold.value } : null,
                volume: ctx._volumeGain,
                mono: ctx._monoEnabled,
                width: ctx._stereoWidth
            };
            
            ctx._presets[name] = newPreset;
            
            // Extract custom presets to save
            const defaults = ['Flat', 'Bass Boost', 'Vocal Enhancer', 'Night Mode', 'Electronic'];
            const custom = {};
            Object.keys(ctx._presets).forEach(k => {
                if (!defaults.includes(k)) custom[k] = ctx._presets[k];
            });
            
            // Persist
            if (chrome?.storage?.local) {
                chrome.storage.local.get('settings').then(data => {
                    const updated = { ...(data.settings || {}), volumeCustomPresets: JSON.stringify(custom) };
                    chrome.storage.local.set({ settings: updated });
                }).catch(() => {});
            }
            
            // Re-render UI to show new preset
            this.toggleEQPanel(ctx, video, anchorBtn);
            setTimeout(() => this.toggleEQPanel(ctx, video, anchorBtn), 50);
        };
        presetsRow.appendChild(addPresetBtn);

        panel.appendChild(presetsRow);

        
        const mkDynRow = (label, min, max, step, val, unit, onChange) => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:12px;margin-bottom:14px;';
            const lbl = document.createElement('span');
            lbl.style.cssText = 'font-size:10px;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.5px;min-width:80px;';
            lbl.textContent = label;
            const valEl = document.createElement('span');
            valEl.style.cssText = 'font-size:11px;font-weight:800;color:#fff;min-width:36px;text-align:right;';
            valEl.textContent = val + unit;
            const sl = document.createElement('input');
            sl.type='range'; sl.min=min; sl.max=max; sl.step=step; sl.value=val;
            sl.className='ypp-eq-hslider';
            sl.style.flex='1';
            sl.oninput = (e) => { valEl.textContent = e.target.value + unit; onChange(parseFloat(e.target.value)); clearActivePreset(); VolumeBoosterUI.saveVolumeSettings(ctx); };
            row.append(lbl, sl, valEl);
            return row;
        };

        const saveSettings = VolumeBoosterUI.saveVolumeSettings.bind(VolumeBoosterUI);
        
        const uiState = {
            ctx, panel, video, anchorBtn, clearActivePreset, saveSettings, mkDynRow,
            DynamicsTabUI, SpatialTabUI, FXTabUI, VolumeBoosterUI
        };

        const eqContentWrap = EQTabUI.build(uiState);
        panel.appendChild(eqContentWrap);

        const dynPanel = DynamicsTabUI.build(uiState);
        dynPanel.style.display = 'none';
        panel.appendChild(dynPanel);

        const spaPanel = SpatialTabUI.build(uiState);
        spaPanel.style.display = 'none';
        panel.appendChild(spaPanel);

        const fxPanel = FXTabUI.build(uiState);
        fxPanel.style.display = 'none';
        panel.appendChild(fxPanel);

        const tabPanels = [eqContentWrap, dynPanel, spaPanel, fxPanel];
        const tabs = [tabEQ, tabDyn, tabSpa, tabFX];
        tabs.forEach((tab, i) => {
            tab.onclick = () => {
                if (tab.classList.contains('active')) return;
                tabs.forEach((t, j) => {
                    const active = i === j;
                    t.classList.toggle('active', active);
                    t.style.color = active ? '#fff' : 'rgba(255,255,255,0.45)';
                    t.style.borderBottom = `2px solid ${active ? 'rgba(255,255,255,0.7)' : 'transparent'}`;
                    
                    if (active) {
                        tabPanels[j].style.display = '';
                        if (typeof anime !== 'undefined') {
                            const rows = Array.from(tabPanels[j].children);
                            anime({
                                targets: rows,
                                opacity: [0, 1],
                                translateY: [12, 0],
                                delay: anime.stagger(40),
                                duration: 400,
                                easing: 'easeOutQuart'
                            });
                        }
                    } else {
                        tabPanels[j].style.display = 'none';
                    }
                });
            };
        });

// ── Shared Footer ──
        const footer = document.createElement('div');
        footer.className = 'ypp-eq-footer';
        footer.style.justifyContent = 'flex-end'; // Align reset button to the right

        const resetBtn = document.createElement('button');
        resetBtn.className = 'ypp-eq-reset-btn';
        resetBtn.textContent = 'Reset All';
        resetBtn.onclick = () => {
            if (ctx.ctx && ctx.ctx.state === 'suspended') ctx.ctx.resume().catch(()=>{});
            
            // Reset Audio State
            ctx.setVolume(1.0);
            ctx.setBalance(0);
            ctx.setWidth(1.0);
            ctx.setMono(false, true);
            ctx._compressorEnabled = true;
            if (ctx.compressorNode) {
                ctx.compressorNode.ratio.value = 4;
                ctx.compressorNode.threshold.value = -24;
                ctx.compressorNode.attack.value = 0.003;
                ctx.compressorNode.release.value = 0.25;
                ctx.compressorNode.knee.value = 30;
            }
            ctx.setVinylMode(false);
            ctx.setPlaybackRate(1.0);
            ctx.setReverbEnvironment('None');
            ctx.setReverbMix(0.0);
            ctx.setPhaseInvert('L', false);
            ctx.setPhaseInvert('R', false);
            ctx.setAutoGain(false);
            ctx._eqGains.fill(0);
            this.syncBandUI(ctx, panel, uiState.canvasEl);

            // Update UI Elements
            if (typeof gainSlider !== 'undefined') {
                gainSlider.value = 1.0;
                if (typeof gainValue !== 'undefined') gainValue.textContent = '100%';
                this.updateGainTrack(gainSlider);
            }
            if (anchorBtn && anchorBtn.classList) anchorBtn.classList.remove('active');

            if (typeof balanceSlider !== 'undefined') {
                balanceSlider.value = 0;
                if (typeof balanceValue !== 'undefined') balanceValue.textContent = 'C';
                this.updateBalanceTrack(balanceSlider);
            }

            const sRow = document.querySelector('#ypp-eq-tab-spa');
            if (sRow) {
                const ranges = sRow.querySelectorAll('.ypp-eq-hslider');
                if(ranges[0]) { ranges[0].value = 100; ranges[0].nextElementSibling.textContent = '100%'; }
                if(ranges[1]) { ranges[1].value = 0; ranges[1].nextElementSibling.textContent = '0%'; }
                if(ranges[2]) { ranges[2].value = 1.0; ranges[2].nextElementSibling.textContent = '1x'; }
                if(ranges[3]) { ranges[3].value = 0; ranges[3].nextElementSibling.textContent = '0%'; }
                
                const btns = sRow.querySelectorAll('.ypp-eq-preset-btn');
                btns.forEach(b => b.classList.remove('active'));
                const nb = Array.from(btns).find(b => b.textContent === 'None');
                if (nb) nb.classList.add('active');
                
                const compBtns = sRow.querySelectorAll('.ypp-eq-comp-btn');
                compBtns.forEach(b => b.classList.remove('active'));
            }

            const dRow = document.querySelector('#ypp-eq-tab-dyn');
            if (dRow) {
                const ag = dRow.querySelector('.ypp-eq-comp-btn');
                if (ag) { ag.classList.remove('active'); ag.textContent = 'OFF'; }
            }

            if (typeof activePresetBtn !== 'undefined' && activePresetBtn) {
                activePresetBtn.classList.remove('active');
            }
            if (typeof presetsRow !== 'undefined' && presetsRow) {
                const flatPreset = presetsRow.querySelector('.ypp-eq-preset-btn');
                if (flatPreset) flatPreset.classList.add('active');
                if (typeof activePresetBtn !== 'undefined') activePresetBtn = flatPreset;
            }
            VolumeBoosterUI.saveVolumeSettings(ctx);
        };
        
        footer.appendChild(resetBtn);
        panel.appendChild(footer);

        // Inner core wrapper removed; CSS now handles Ethereal Glass directly.

        // Mount into the shared top-layer dialog portal
        if (isGlobalBar) {
            const dlg = window.YPP.Utils.getPopupPortal();
            panel.style.pointerEvents = 'auto';
            if (window.self !== window.top) {
                panel.style.right = '16px';
                panel.style.left = 'auto';
            }
            dlg.appendChild(panel);
        } else {
            document.body.appendChild(panel);
        }
        ctx._volumePopup = panel;
        if (window.YPP?.Utils?.makePopupZoomInvariant) {
            window.YPP.Utils.makePopupZoomInvariant(panel);
        }

        // Re-bind preset clicks to update all UI (since some presets affect dynamics/spatial)
        Object.keys(ctx._presets).forEach((name, idx) => {
            const btn = presetsRow.children[idx];
            btn.onclick = () => {
                ctx.applyPreset(name);
                this.syncBandUI(ctx, panel, uiState.canvasEl);

                gainSlider.value = ctx._volumeGain;
                gainValue.textContent = Math.round(ctx._volumeGain * 100) + '%';
                this.updateGainTrack(gainSlider);
                anchorBtn.classList.toggle('active', ctx._volumeGain > 1.0);

                balanceSlider.value = ctx._balance;
                balanceValue.textContent = ctx._balance === 0 ? 'C' : (ctx._balance < 0 ? 'L' + Math.abs(Math.round(ctx._balance * 100)) : 'R' + Math.round(ctx._balance * 100));
                this.updateBalanceTrack(balanceSlider);

                panel.dispatchEvent(new Event('ypp-eq-update'));

                if (activePresetBtn) activePresetBtn.classList.remove('active');
                btn.classList.add('active');
                activePresetBtn = btn;
                VolumeBoosterUI.saveVolumeSettings(ctx);
            };
        });

        if (typeof anime !== 'undefined') {
            anime({
                targets: panel.querySelectorAll('.ypp-eq-band-col'),
                translateY: [20, 0],
                opacity: [0, 1],
                delay: anime.stagger(30, { start: 150 }),
                easing: 'spring(1, 80, 10, 0)',
                duration: 600,
            });
        }

        // Visualizer Loop
        let animFrameId = null;
        const renderLoop = () => {
            if (!ctx._volumePopup) return; // Stop if closed
            if (ctx.analyserNode) {
                this.drawCurve(ctx, uiState.canvasEl, true);
            }
            animFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // Initial curve draw (if no analyser yet)
        if (!ctx.analyserNode) this.drawCurve(ctx, uiState.canvasEl);

        // Click-outside to close
        const outside = (e) => {
            if (ctx._volumePopup && !ctx._volumePopup.contains(e.target) && !anchorBtn.contains(e.target)) {
                if (animFrameId) cancelAnimationFrame(animFrameId);
                this.toggleEQPanel(ctx, video, anchorBtn);
            }
        };
        ctx._volumePopupOutsideHandler = outside;
        setTimeout(() => ctx.addListener ? ctx.addListener(document, 'click', outside) : document.addEventListener('click', outside), 0);

        // Escape key closes the EQ panel
        const onKeyDown = (e) => {
            if (e.key === 'Escape' && ctx._volumePopup) {
                // DO NOT stop propagation here; allow YouTube to handle the ESC key natively
                // (e.g. to exit fullscreen) to prevent the "ESC button toggle issue"
                if (animFrameId) cancelAnimationFrame(animFrameId);
                this.toggleEQPanel(ctx, video, anchorBtn);
            }
        };
        ctx._volumePopupEscapeHandler = onKeyDown;
        if (ctx.addListener) ctx.addListener(document, 'keydown', onKeyDown);
        else document.addEventListener('keydown', onKeyDown);
    }

    static syncBandUI(ctx, panel, canvas) {
        const sliders = panel.querySelectorAll('.ypp-eq-vslider');
        const dbLabels = panel.querySelectorAll('.ypp-eq-band-db');
        sliders.forEach((s, i) => {
            s.value = ctx._eqGains[i];
        });
        dbLabels.forEach((el, i) => {
            const db = ctx._eqGains[i];
            el.textContent = (db >= 0 ? '+' : '') + db;
        });
        if (!ctx.analyserNode) this.drawCurve(ctx, canvas);
    }

    static updateGainTrack(slider) {
        const pct = ((parseFloat(slider.value) - 1) / (6 - 1)) * 100;
        slider.style.background = `linear-gradient(90deg, rgba(255,255,255,0.85) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    }

    static updateBalanceTrack(slider) {
        const val = parseFloat(slider.value);
        const pct = ((val + 1) / 2) * 100;
        
        if (val < 0) {
            slider.style.background = `linear-gradient(90deg, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.85) ${pct}%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.1) 50%)`;
        } else {
            slider.style.background = `linear-gradient(90deg, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.85) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
        }
    }

    static drawCurve(ctxRef, canvas, withSpectrum = false) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const mode = ctxRef._visualizerMode || 0;
        if (mode === 4) return; // Off

        const logMin = Math.log10(20), logMax = Math.log10(20000);
        const dbRange = 13;

        // Draw Spectrum Analyzer
        if (withSpectrum && ctxRef.analyserNode && (mode === 0 || mode === 2)) {
            const bufferLength = ctxRef.analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            ctxRef.analyserNode.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            const barWidth = (W / bufferLength) * 2.5;
            let barHeight;
            let xPos = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * H;
                ctx.fillRect(xPos, H - barHeight, barWidth - 1, barHeight);
                xPos += barWidth;
            }
        }

        // Draw Waveform
        if (withSpectrum && ctxRef.analyserNode && mode === 3) {
            const bufferLength = ctxRef.analyserNode.fftSize;
            const dataArray = new Uint8Array(bufferLength);
            ctxRef.analyserNode.getByteTimeDomainData(dataArray);
            
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            const sliceWidth = W * 1.0 / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * H / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.lineTo(W, H / 2);
            ctx.stroke();
        }

        if (mode === 0 || mode === 1) {
            // Center baseline
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

        // Vertical band markers
        ctxRef._bands.forEach(band => {
            const x = ((Math.log10(band.freq) - logMin) / (logMax - logMin)) * W;
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 5]);
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            ctx.setLineDash([]);
        });

        // Compute gain at each pixel using summed Gaussian approximation
        const gainAt = (freq) => {
            let total = 0;
            ctxRef._bands.forEach((band, i) => {
                const db = ctxRef._eqGains[i];
                if (db === 0) return;
                const bw = band.type === 'peaking' ? 0.85 : 1.6;
                const logDist = Math.log2(freq / band.freq) / bw;
                total += db * Math.exp(-logDist * logDist * 2.2);
            });
            return Math.max(-dbRange, Math.min(dbRange, total));
        };

        const pts = [];
        for (let x = 0; x <= W; x++) {
            const logFreq = logMin + (x / W) * (logMax - logMin);
            const db = gainAt(Math.pow(10, logFreq));
            pts.push([x, H / 2 - (db / dbRange) * (H / 2 - 5)]);
        }

        // Fill under curve
        const fillGrad = ctx.createLinearGradient(0, 0, 0, H);
        fillGrad.addColorStop(0, 'rgba(255, 255, 255, 0.20)');
        fillGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        fillGrad.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
        ctx.beginPath();
        ctx.moveTo(0, H / 2);
        pts.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.lineTo(W, H / 2);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Curve line (monochrome glass)
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.stroke();
        }
    }

    static injectEQStyles() {
        if (document.getElementById('ypp-eq-styles')) return;
        const style = document.createElement('style');
        style.id = 'ypp-eq-styles';
        style.textContent = `
/* ── EQ Panel ── */
#ypp-eq-panel {
    position: fixed;
    bottom: 72px;
    right: 24px;
    width: 440px;
    background-color: rgba(18, 18, 20, 0.45);
    background-image: radial-gradient(ellipse 80% 60% at 0% 0%, rgba(62, 166, 255, 0.15) 0%, transparent 70%), radial-gradient(ellipse 70% 60% at 100% 100%, rgba(255, 65, 108, 0.1) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255, 65, 108, 0.05) 0%, transparent 100%);
    border: 1px solid rgba(255,255,255,0.1);
    border-top: 1px solid rgba(255,255,255,0.25);
    border-radius: 20px;
    z-index: 2147483646;
    color: #fff;
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
    box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
    backdrop-filter: blur(48px) saturate(200%);
    -webkit-backdrop-filter: blur(48px) saturate(200%);
    user-select: none;
    overflow: hidden;
    animation: ypp-eq-in 0.28s cubic-bezier(0.2, 0, 0, 1) forwards;
}
@keyframes ypp-eq-in {
    from { opacity:0; transform:translateY(12px) scale(calc(0.96 * var(--ypp-auto-scale, 1))); }
    to   { opacity:1; transform:translateY(0)   scale(var(--ypp-auto-scale, 1));    }
}

/* Header */
.ypp-eq-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px 11px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
}
.ypp-eq-title-group { display:flex; align-items:center; gap:10px; }
.ypp-eq-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255, 255, 255, 0.15);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
}
.ypp-eq-title { font-size:13px; font-weight:700; letter-spacing:-0.3px; }
.ypp-eq-subtitle { font-size:10px; color:rgba(255,255,255,0.38); font-weight:500; margin-top:1px; }
.ypp-eq-close-btn {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.7); border-radius: 50%; width:24px; height:24px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition: background 0.2s, color 0.2s;
}
.ypp-eq-close-btn:hover { background: rgba(255,255,255,0.14); color:#fff; }

/* Gain Row */
.ypp-eq-gain-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
}
.ypp-eq-row-label {
    font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.45);
    text-transform: uppercase; letter-spacing: 0.5px; min-width: 60px;
}
.ypp-eq-gain-value {
    font-size: 11px; font-weight: 800; color: #ffffff;
    min-width: 34px; text-align: right;
}

/* Horizontal slider */
.ypp-eq-hslider {
    -webkit-appearance: none; appearance: none; flex: 1;
    height: 3px; border-radius: 3px; outline: none; cursor: pointer;
    border: none; transition: height 0.15s ease;
}
.ypp-eq-hslider:hover { height: 5px; }
.ypp-eq-hslider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%;
    background: #fff; border: 2px solid #fff; cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.2);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
}
.ypp-eq-hslider::-webkit-slider-thumb:hover {
    transform: scale(1.35);
    box-shadow: 0 2px 10px rgba(0,0,0,0.6), 0 0 0 4px rgba(255,255,255,0.3), 0 0 12px rgba(255,255,255,0.4);
}

/* Presets */
.ypp-eq-presets-row {
    display: flex; gap: 5px; padding: 7px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
}
.ypp-eq-presets-row::-webkit-scrollbar { display: none; }
.ypp-eq-preset-btn {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.6); border-radius: 16px; cursor: pointer;
    font-size: 10px; font-weight: 600; padding: 3px 10px;
    font-family: inherit; transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
}
.ypp-eq-preset-btn:hover {
    background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.3); color: #fff;
}
.ypp-eq-preset-btn.active {
    background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.5);
    color: #ffffff; box-shadow: 0 0 10px rgba(255,255,255,0.15);
}

/* Canvas */
.ypp-eq-canvas {
    display: block; width: calc(100% - 32px); height: 40px;
    margin: 0 16px 2px; border-radius: 8px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
}

/* Band columns */
.ypp-eq-bands {
    display: flex; gap: 0; padding: 4px 10px 8px;
    justify-content: space-between;
}
.ypp-eq-band-col {
    display: flex; flex-direction: column; align-items: center;
    gap: 2px; flex: 1; padding: 0 1px;
}
.ypp-eq-band-db {
    font-size: 8px; font-weight: 800; min-height: 10px; line-height: 1;
}
.ypp-eq-band-track {
    position: relative; height: 46px; width: 100%;
    display: flex; align-items: center; justify-content: center;
}
.ypp-eq-band-center {
    position: absolute; width: 100%; height: 1px;
    background: rgba(255,255,255,0.1); top: 50%; left: 0;
    pointer-events: none;
}
.ypp-eq-band-freq {
    font-size: 8px; color: rgba(255,255,255,0.38); font-weight:600;
}

/* Vertical slider (rotated horizontal) */
.ypp-eq-vslider {
    -webkit-appearance: none; appearance: none;
    width: 42px;
    height: 2px; border-radius: 2px; outline: none; cursor: pointer;
    background: rgba(255,255,255,0.1); border: none;
    transform: rotate(-90deg);
    transform-origin: center;
    position: absolute;
    transition: height 0.1s ease;
}
.ypp-eq-vslider:hover { height: 4px; }
.ypp-eq-vslider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--band-color, #ffffff);
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255,255,255,0.3);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.ypp-eq-vslider::-webkit-slider-thumb:hover { transform: scale(1.45); }

/* Footer */
.ypp-eq-footer {
    display: flex; align-items: center; gap: 6px;
    padding: 0 16px 10px;
}
.ypp-eq-comp-btn {
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.55); border-radius: 16px; cursor: pointer;
    font-size: 10px; font-weight: 600; padding: 4px 10px;
    font-family: inherit; transition: all 0.2s ease;
}
.ypp-eq-comp-btn.active {
    background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4);
    color: #ffffff; box-shadow: 0 0 8px rgba(255,255,255,0.15);
}
.ypp-eq-comp-btn:hover { background: rgba(255,255,255,0.1); }
.ypp-eq-reset-btn {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.22);
    color: #ffffff; border-radius: 16px; cursor: pointer;
    font-size: 10px; font-weight: 600; padding: 4px 10px;
    font-family: inherit; transition: all 0.2s ease;
}
.ypp-eq-reset-btn:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); }
.ypp-eq-hint {
    font-size: 8px; color: rgba(255,255,255,0.22); margin-left: auto;
}
        `;
        document.head.appendChild(style);
    }
};

window.YPP.features.VolumeBoosterUI = VolumeBoosterUI;
