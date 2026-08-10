import '../content/config/constants.js';
import '../content/config/settings-schema.js';
import '../content/config/utils.js';

import { initStorage, loadSettings, state, saveSettings, updateSetting, notifyThemeChange } from './popup-state.js';
import * as UI from './popup-ui.js';
import { initComponents } from './popup-components.js';
import { initHistoryWidget, initBackupTools, initBookmarksManager, renderPlayerBarOrganizer, renderDomainMemoryManager } from './popup-extras.js';
import { renderSchema, registerSlot, convertStaticDescriptionsToHelpButtons } from './popup-renderer.js';
import { initI18n, t } from '../shared/i18n.js';

// --- Register Custom Slots ---
registerSlot('player_bar_organizer', renderPlayerBarOrganizer);
registerSlot('domain_memory_manager', renderDomainMemoryManager);
registerSlot('intentionalDelaySlot', (container, state) => {
    container.className = 'setting-item toggle-card';
    container.style.cssText = 'grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 12px; padding: 10px 14px;';
    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; width: 100%; min-width: 0;">
            <div class="feature-icon" style="cursor: pointer; flex-shrink: 0;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="info" style="cursor: pointer; flex: 1; min-width: 0;">
                <span class="name" style="font-size: 13px; font-weight: 500; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Intentional Delay</span>
                <span class="desc" style="font-size: 11px; opacity: 0.6; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Add a pause before videos start</span>
            </div>
            <label class="toggle" style="margin-left: auto; flex-shrink: 0;">
                <input type="checkbox" id="intentionalDelay">
                <span class="slider"></span>
            </label>
        </div>
        <div class="inline-slider-wrapper" style="display: flex; align-items: center; gap: 8px; width: 100%; padding-left: 12px; border-left: 1px solid rgba(255, 255, 255, 0.08);">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.6; flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <input type="range" id="intentionalDelayTimeUI" min="0" max="35" step="1" style="width: 100%; flex-grow: 1; cursor: pointer;">
            <span style="font-size: 11px; font-weight: 500; min-width: 28px; text-align: right; opacity: 0.8;"><span id="intentionalDelayTimeValue">1</span>s</span>
        </div>
        <input type="hidden" id="intentionalDelayTime" value="1" />
    `;
    const DELAY_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 220, 240, 260, 280, 300];
    const sliderUI = container.querySelector('#intentionalDelayTimeUI');
    const hiddenInput = container.querySelector('#intentionalDelayTime');
    const valDisplay = container.querySelector('#intentionalDelayTimeValue');
    if (sliderUI && hiddenInput && valDisplay) {
        sliderUI.addEventListener('input', () => {
            const idx = parseInt(sliderUI.value, 10) || 0;
            const val = DELAY_STEPS[idx] !== undefined ? DELAY_STEPS[idx] : 1;
            valDisplay.textContent = val;
            hiddenInput.value = val;
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        });
        const origDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(hiddenInput, 'value', {
            get: function() { return origDesc.get.call(this); },
            set: function(val) {
                origDesc.set.call(this, val);
                let idx = DELAY_STEPS.findIndex(v => v >= Number(val || 1));
                if (idx === -1) idx = 0;
                sliderUI.value = idx;
                valDisplay.textContent = DELAY_STEPS[idx];
            }
        });
    }
});
registerSlot('autoLikeSlot', (container, state) => {
    container.className = 'setting-item toggle-card';
    container.style.cssText = 'grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr 2fr; align-items: center; gap: 12px; padding: 10px 14px;';
    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; width: 100%; min-width: 0;">
            <div class="feature-icon" style="cursor: pointer; flex-shrink: 0;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            </div>
            <div class="info" style="cursor: pointer; flex: 1; min-width: 0;">
                <span class="name" style="font-size: 13px; font-weight: 500; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Auto Like</span>
                <span class="desc" style="font-size: 11px; opacity: 0.6; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Automatically like video</span>
            </div>
            <label class="toggle" style="margin-left: auto; flex-shrink: 0;">
                <input type="checkbox" id="autoLike">
                <span class="slider"></span>
            </label>
        </div>
        <div class="inline-slider-wrapper" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 0 12px; border-left: 1px solid rgba(255, 255, 255, 0.08); border-right: 1px solid rgba(255, 255, 255, 0.08);">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.6; flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <input type="range" id="autoLikeThresholdUI" min="0" max="32" step="1" style="width: 100%; flex-grow: 1; cursor: pointer;">
            <span id="autoLikeThresholdValue" style="font-size: 11px; font-weight: 500; min-width: 36px; text-align: right; opacity: 0.8;">0s</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="view-mode-btn gpb-btn" data-target="autoLikeSubscribedOnly" style="font-size: 11px; padding: 5px 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; cursor: pointer; color: inherit; background: rgba(255,255,255,0.04); transition: all 0.2s;" title="Subscribed Only">Subs</button>
            <button type="button" class="view-mode-btn gpb-btn" data-target="autoLikeChannelLists" style="font-size: 11px; padding: 5px 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; cursor: pointer; color: inherit; background: rgba(255,255,255,0.04); transition: all 0.2s;" title="Use Channel Lists">Lists</button>
            <button type="button" class="view-mode-btn gpb-btn" data-target="autoLikeWaitAds" style="font-size: 11px; padding: 5px 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; cursor: pointer; color: inherit; background: rgba(255,255,255,0.04); transition: all 0.2s;" title="Wait for Ads">Ads</button>
            <button type="button" class="view-mode-btn gpb-btn" data-target="autoLikeHumanize" style="font-size: 11px; padding: 5px 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; cursor: pointer; color: inherit; background: rgba(255,255,255,0.04); transition: all 0.2s;" title="Humanize Delay">Human</button>
            <button type="button" id="autoLikeDelayTypeBtn" class="view-mode-btn" style="font-size: 11px; padding: 5px 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; cursor: pointer; color: inherit; background: rgba(255,255,255,0.04); transition: all 0.2s;" title="Switch between Seconds / Percent">% / s</button>
        </div>
        <input type="hidden" id="autoLikeSubscribedOnly" />
        <input type="hidden" id="autoLikeChannelLists" />
        <input type="hidden" id="autoLikeWaitAds" />
        <input type="hidden" id="autoLikeHumanize" />
        <input type="hidden" id="autoLikeDelayType" value="seconds" />
        <input type="hidden" id="autoLikeThreshold" value="50" />
    `;
});
registerSlot('vsc_shortcuts_manager', (container, state) => {
    container.innerHTML = `
        <div class="vsc-shortcuts-header" style="display:flex; justify-content:space-between; margin-bottom:10px; font-weight:bold; font-size:12px; opacity:0.7;">
            <span style="flex:2">Action</span>
            <span style="flex:1">Key</span>
            <span style="flex:1">Value</span>
            <span style="width:24px"></span>
        </div>
        <div id="vsc-shortcuts-list" style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;"></div>
        <button id="vsc-add-shortcut" class="action-btn" style="width:100%;">+ Add Shortcut</button>
    `;

    const listContainer = container.querySelector('#vsc-shortcuts-list');
    const addBtn = container.querySelector('#vsc-add-shortcut');

    const ACTIONS = {
        showHide: 'Show/hide controller',
        decrease: 'Decrease speed',
        increase: 'Increase speed',
        rewind: 'Rewind',
        advance: 'Advance',
        reset: 'Reset speed',
        preferred: 'Preferred speed',
        mute: 'Mute',
        decreaseVolume: 'Decrease volume',
        increaseVolume: 'Increase volume',
        pause: 'Pause',
        setMarker: 'Set marker',
        jumpMarker: 'Jump to marker'
    };

    const renderList = (shortcuts) => {
        listContainer.innerHTML = '';
        shortcuts.forEach((sc, index) => {
            const row = document.createElement('div');
            row.className = 'vsc-shortcut-row';

            const select = document.createElement('select');
            select.className = 'vsc-select';
            for (const [val, label] of Object.entries(ACTIONS)) {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = label;
                opt.style.background = '#1a1a1a';
                opt.style.color = '#ffffff';
                if (sc.action === val) opt.selected = true;
                select.appendChild(opt);
            }
            
            const keyInput = document.createElement('input');
            keyInput.type = 'text';
            keyInput.value = sc.key || '';
            keyInput.placeholder = 'None';
            keyInput.className = 'vsc-key-input';
            
            keyInput.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') return;
                e.preventDefault();
                
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    sc.key = '';
                    keyInput.value = '';
                    keyInput.style.color = '';
                    save();
                    return;
                }

                const keys = [];
                if (e.ctrlKey) keys.push('Ctrl');
                if (e.altKey) keys.push('Alt');
                if (e.shiftKey) keys.push('Shift');
                if (e.metaKey) keys.push('Meta');
                
                let keyName = e.key;
                if (e.shiftKey) {
                    const shiftMap = { '<': ',', '>': '.', ':': ';', '"': "'", '{': '[', '}': ']', '|': '\\', '?': '/', '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=' };
                    if (shiftMap[keyName]) keyName = shiftMap[keyName];
                }
                if (keyName === ' ') keyName = 'Space';
                
                if (['Control', 'Shift', 'Alt', 'Meta'].includes(keyName)) {
                    keyInput.value = keys.join('+') + '+...';
                    return;
                }
                
                keyName = keyName.length === 1 ? keyName.toUpperCase() : keyName;
                keys.push(keyName);
                const finalKey = keys.join('+');
                
                // Duplicate detection
                chrome.storage.local.get('settings', (data) => {
                    const settings = data.settings || {};
                    const allAdv = settings.advancedShortcuts || [];
                    const allVsc = settings.vscShortcuts || [];
                    const allKeys = [...allAdv, ...allVsc].map(s => s.key).filter(k => k);
                    
                    let occurrences = 0;
                    for (const k of allKeys) {
                        if (k === finalKey) occurrences++;
                    }
                    
                    if (occurrences > 0 && finalKey !== sc.key) {
                        keyInput.style.color = '#ff4e45';
                    } else {
                        keyInput.style.color = '';
                    }

                    sc.key = finalKey;
                    keyInput.value = finalKey;
                    save();
                });
            });

            const valInput = document.createElement('input');
            valInput.type = 'number';
            valInput.step = 'any';
            valInput.value = sc.value === null ? '' : sc.value;
            valInput.placeholder = 'N/A';
            valInput.className = 'vsc-val-input';
            
            const updateValDisabled = () => {
                const needsValue = ['decrease', 'increase', 'rewind', 'advance', 'reset', 'preferred'].includes(sc.action);
                valInput.disabled = !needsValue;
                valInput.style.opacity = needsValue ? '1' : '0.3';
                if (!needsValue) valInput.value = '';
            };
            updateValDisabled();

            select.addEventListener('change', (e) => {
                sc.action = e.target.value;
                updateValDisabled();
                save();
            });

            valInput.addEventListener('input', (e) => {
                sc.value = parseFloat(e.target.value) || null;
                save();
            });

            const rmBtn = document.createElement('button');
            rmBtn.innerHTML = '✕';
            rmBtn.className = 'vsc-rm-btn';
            rmBtn.addEventListener('click', () => {
                shortcuts.splice(index, 1);
                save();
                renderList(shortcuts);
            });

            row.appendChild(select);
            row.appendChild(keyInput);
            row.appendChild(valInput);
            row.appendChild(rmBtn);
            listContainer.appendChild(row);
        });
    };

    const save = () => {
        updateSetting('vscShortcuts', currentShortcuts);
    };

    let currentShortcuts = [];
    chrome.storage.local.get('settings', (data) => {
        currentShortcuts = data.settings?.vscShortcuts !== undefined ? data.settings.vscShortcuts : [
            { action: 'decrease', key: 'Z', value: 0.25 },
            { action: 'increase', key: 'X', value: 0.25 },
            { action: 'rewind', key: 'S', value: 10 },
            { action: 'advance', key: 'D', value: 10 },
            { action: 'reset', key: 'R', value: 1.0 },
            { action: 'showHide', key: 'V', value: 0 }
        ];
        renderList(currentShortcuts);
    });

    addBtn.addEventListener('click', () => {
        currentShortcuts.push({ action: 'showHide', key: '', value: null });
        save();
        renderList(currentShortcuts);
    });
});

registerSlot('advanced_shortcuts_manager', (container, state) => {
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
            <div class="vsc-shortcuts-header" style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:bold; font-size:12px; opacity:0.7;">
                <span style="flex:2">Action</span>
                <span style="flex:1; text-align:center;">Key</span>
                <span style="width:24px"></span>
            </div>
            <div id="adv-shortcuts-list" style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;"></div>
            <button id="adv-add-shortcut" class="action-btn" style="width:100%;">+ Add Shortcut</button>
            <div id="adv-error-msg" style="color:#ff4e45; font-size:11px; text-align:center; height:14px;"></div>
        </div>
    `;

    const listContainer = container.querySelector('#adv-shortcuts-list');
    const addBtn = container.querySelector('#adv-add-shortcut');
    const errorMsg = container.querySelector('#adv-error-msg');
    
    // Close all popovers when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-trigger') && !e.target.closest('.custom-select-popover')) {
            document.querySelectorAll('.custom-select-popover').forEach(p => p.style.display = 'none');
        }
    });

    const ACTIONS = {
        // --- Modes ---
        zenMode: 'Toggle Zen Mode',
        focusMode: 'Toggle Focus Mode',
        cinemaMode: 'Toggle Cinema Mode',
        ambientMode: 'Toggle Ambient Mode',
        autoCinema: 'Toggle Auto Cinema',
        // --- Player Controls ---
        pip: 'Picture-in-Picture',
        zenMode: 'Toggle Zen Mode',
        seamlessMode: 'Toggle Seamless Mode',
        snapshot: 'Take Video Snapshot',
        loop: 'Toggle Loop',
        enableGlobalPlayerBar: 'Toggle Player Bar',
        enableVolumeBoost: 'Toggle Volume Booster',
        enableCinemaFilters: 'Toggle Video Filters',
        enableCustomSpeed: 'Toggle Custom Speed',
        enableTranscript: 'Toggle Transcript',
        // --- UI / Theme ---
        trueBlack: 'Toggle True Black Dark Mode',
        hideScrollbar: 'Toggle Scrollbar',
        grayscaleThumbnails: 'Toggle Grayscale Thumbs',
        grid4x4: 'Toggle 4x4 Grid Layout',
        // --- Declutter ---
        hideComments: 'Toggle Comments',
        hideRelated: 'Toggle Related Videos',
        hideLiveChat: 'Toggle Live Chat',
        hideShorts: 'Toggle Shorts',
        hideEndScreens: 'Toggle End Screens',
        hideAnnotations: 'Toggle Annotations',
        hideMixes: 'Toggle Mixes',
        hideWatched: 'Toggle Watched Videos',
        hideMerch: 'Toggle Merch & Offers',
        hideFundraiser: 'Toggle Fundraisers',
        hideChannelCards: 'Toggle Channel Cards',
        hideFeed: 'Toggle Home Feed',
        hideTrending: 'Toggle Trending Tab',
        // --- Search ---
        searchGrid: 'Toggle Search Grid',
        cleanSearch: 'Toggle Clean Search',
        // --- Shorts ---
        shortsAutoScroll: 'Toggle Shorts Auto Scroll',
        shortsVolumeNormalizer: 'Toggle Shorts Volume',
        // --- Automation ---
        autoSkipAds: 'Toggle Auto Skip Ads',
        autoPlayNext: 'Toggle Auto Play Next',
        sponsorBlock: 'Toggle SponsorBlock',
        // --- Misc ---
        intentionalDelay: 'Toggle Intentional Delay',
        watchTimeAlert: 'Toggle Watch Time Alert'
    };

    const renderList = (shortcuts) => {
        // Clean up previously appended popovers from body
        document.querySelectorAll('.custom-select-popover').forEach(p => p.remove());
        
        listContainer.innerHTML = '';
        shortcuts.forEach((sc, index) => {
            const row = document.createElement('div');
            row.className = 'vsc-shortcut-row';

            // Custom Masonry Select
            const selectContainer = document.createElement('div');
            selectContainer.className = 'custom-select-wrapper';
            selectContainer.style.position = 'relative';
            selectContainer.style.flex = '2';
            
            const trigger = document.createElement('div');
            trigger.className = 'vsc-select custom-select-trigger';
            trigger.style.display = 'flex';
            trigger.style.justifyContent = 'space-between';
            trigger.style.alignItems = 'center';
            trigger.style.cursor = 'pointer';
            trigger.style.userSelect = 'none';
            trigger.style.padding = '0 8px';
            trigger.style.height = '100%';
            trigger.innerHTML = `<span class="label" style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${ACTIONS[sc.action] || 'Select Action'}</span><span style="opacity:0.5; font-size:10px; margin-left:4px;">▼</span>`;
            
            const popover = document.createElement('div');
            popover.className = 'custom-select-popover';
            popover.style.display = 'none';
            popover.style.position = 'absolute';
            popover.style.width = '560px';
            popover.style.background = '#1a1a1a';
            popover.style.border = '1px solid rgba(255,255,255,0.1)';
            popover.style.borderRadius = '8px';
            popover.style.padding = '8px';
            popover.style.zIndex = '10000';
            popover.style.boxShadow = '0 8px 32px rgba(0,0,0,0.7)';
            // True masonry grid
            popover.style.columnCount = '4';
            popover.style.columnGap = '8px';
            
            
            for (const [val, label] of Object.entries(ACTIONS)) {
                const opt = document.createElement('div');
                opt.textContent = label;
                opt.style.padding = '6px 8px';
                opt.style.fontSize = '11px';
                opt.style.color = sc.action === val ? '#fff' : 'rgba(255,255,255,0.7)';
                opt.style.background = sc.action === val ? 'rgba(255,255,255,0.1)' : 'transparent';
                opt.style.border = '1px solid rgba(255,255,255,0.1)';
                opt.style.borderRadius = '4px';
                opt.style.cursor = 'pointer';
                opt.style.marginBottom = '8px';
                opt.style.breakInside = 'avoid';
                
                opt.addEventListener('mouseenter', () => { if (sc.action !== val) opt.style.background = 'rgba(255,255,255,0.05)'; });
                opt.addEventListener('mouseleave', () => { if (sc.action !== val) opt.style.background = 'transparent'; });
                
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sc.action = val;
                    trigger.querySelector('.label').textContent = label;
                    popover.style.display = 'none';
                    save();
                    renderList(shortcuts);
                });
                popover.appendChild(opt);
            }
            
            // Append popover to body to escape any overflow: hidden/auto containers
            document.body.appendChild(popover);
            
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = popover.style.display === 'block';
                document.querySelectorAll('.custom-select-popover').forEach(p => p.style.display = 'none');
                
                if (!isVisible) {
                    const rect = selectContainer.getBoundingClientRect();
                    // Render first at 0,0 to accurately measure height without viewport constraints affecting it
                    popover.style.top = '0px';
                    popover.style.left = (rect.left + window.scrollX) + 'px';
                    popover.style.display = 'block';
                    
                    const popRect = popover.getBoundingClientRect();
                    let finalTop = rect.bottom + window.scrollY + 4;
                    
                    // Smart upward/clamped logic
                    if (finalTop + popRect.height > window.innerHeight) {
                        // Try upward
                        finalTop = rect.top + window.scrollY - popRect.height - 4;
                        // If it also overflows top, clamp to viewport top
                        if (finalTop < 8) {
                            finalTop = 8;
                        }
                    }
                    
                    popover.style.top = finalTop + 'px';
                }
            });
            
            selectContainer.appendChild(trigger);
            
            const keyInput = document.createElement('input');
            keyInput.type = 'text';
            keyInput.value = sc.key || '';
            keyInput.placeholder = 'None';
            keyInput.className = 'vsc-key-input';
            keyInput.style.flex = '1';
            keyInput.style.textAlign = 'center';
            
            keyInput.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') return;
                e.preventDefault();
                
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    sc.key = '';
                    keyInput.value = '';
                    keyInput.style.color = '';
                    errorMsg.textContent = '';
                    save();
                    return;
                }

                const keys = [];
                if (e.ctrlKey) keys.push('Ctrl');
                if (e.altKey) keys.push('Alt');
                if (e.shiftKey) keys.push('Shift');
                if (e.metaKey) keys.push('Meta');
                
                let keyName = e.key;
                if (e.shiftKey) {
                    const shiftMap = { '<': ',', '>': '.', ':': ';', '"': "'", '{': '[', '}': ']', '|': '\\', '?': '/', '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=' };
                    if (shiftMap[keyName]) keyName = shiftMap[keyName];
                }
                if (keyName === ' ') keyName = 'Space';
                
                if (['Control', 'Shift', 'Alt', 'Meta'].includes(keyName)) {
                    keyInput.value = keys.join('+') + '+...';
                    return;
                }
                
                keyName = keyName.length === 1 ? keyName.toUpperCase() : keyName;
                keys.push(keyName);
                const finalKey = keys.join('+');
                
                // Duplicate detection
                chrome.storage.local.get('settings', (data) => {
                    const settings = data.settings || {};
                    const allAdv = settings.advancedShortcuts || [];
                    const allVsc = settings.vscShortcuts || [];
                    const allKeys = [...allAdv, ...allVsc].map(s => s.key).filter(k => k);
                    
                    // Count occurrences of this key
                    let occurrences = 0;
                    for (const k of allKeys) {
                        if (k === finalKey) occurrences++;
                    }
                    
                    if (occurrences > 0 && finalKey !== sc.key) {
                        keyInput.style.color = '#ff4e45';
                        errorMsg.textContent = `Warning: '${finalKey}' is already used by another action!`;
                    } else {
                        keyInput.style.color = '';
                        errorMsg.textContent = '';
                    }

                    sc.key = finalKey;
                    keyInput.value = finalKey;
                    save();
                });
            });

            const rmBtn = document.createElement('button');
            rmBtn.innerHTML = '✕';
            rmBtn.className = 'vsc-rm-btn';
            rmBtn.addEventListener('click', () => {
                shortcuts.splice(index, 1);
                errorMsg.textContent = '';
                save();
                renderList(shortcuts);
            });

            row.appendChild(selectContainer);
            row.appendChild(keyInput);
            row.appendChild(rmBtn);
            listContainer.appendChild(row);
        });
    };

    const save = () => {
        updateSetting('advancedShortcuts', currentShortcuts);
    };

    let currentShortcuts = [];
    chrome.storage.local.get('settings', (data) => {
        // Fallback to legacy bindings if advancedShortcuts is empty and legacy exists
        const s = data.settings || {};
        if (s.advancedShortcuts !== undefined && s.advancedShortcuts.length > 0) {
            currentShortcuts = s.advancedShortcuts;
        } else {
            // Migrate old ones if any
            const defaults = [
                { action: 'zenMode', key: s.shortcut_zenMode || 'Shift+Z' },
                { action: 'zenMode', key: s.shortcut_zenMode || 'Shift+Z' },
                { action: 'seamlessMode', key: s.shortcut_seamlessMode || 'Shift+S' },
                { action: 'cinemaMode', key: s.shortcut_cinemaMode || 'Shift+C' },
                { action: 'snapshot', key: s.shortcut_snapshot || 'Shift+S' },
                { action: 'loop', key: s.shortcut_loop || 'Shift+L' },
                { action: 'pip', key: s.shortcut_pip || 'Shift+P' },
                { action: 'ambientMode', key: s.shortcut_ambientMode || 'Shift+M' }
            ];
            currentShortcuts = defaults;
            save(); // Immediately save migration
        }
        renderList(currentShortcuts);
    });

    addBtn.addEventListener('click', () => {
        currentShortcuts.push({ action: 'zenMode', key: '' });
        currentShortcuts.push({ action: 'seamlessMode', key: '' });
        currentShortcuts.push({ action: 'cinemaMode', key: '' });
    });
});

registerSlot('recapButtons', (container, state) => {
    container.innerHTML = `
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="btnOpenRecap" class="action-btn ypp-glass-btn" style="flex:1; background: rgba(255, 0, 80, 0.15); border: 1px solid rgba(255, 0, 80, 0.3); color: #ff3366; backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); box-shadow: 0 8px 32px rgba(255, 0, 80, 0.2), inset 0 1px 2px rgba(255,255,255,0.1);">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; vertical-align: middle;"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                My Recap
            </button>
            <button id="btnOpenResumeHistory" class="action-btn ypp-glass-btn" style="flex:1; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1);">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; vertical-align: middle;"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Resume History
            </button>
        </div>
        
        <!-- Hidden overlay panels -->
        <div id="ypp-recap-overlay" style="display:none; position:absolute; top:0; left:0; right:0; bottom:0; z-index:100; padding:20px; overflow-y:auto; flex-direction:column; background: rgba(18, 18, 24, 0.85); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h2 style="margin:0; font-size:18px; display:flex; align-items:center; gap:8px;">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ff3366" stroke-width="2"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                    Your Youtube Recap
                </h2>
                <button id="btnCloseRecap" style="background:rgba(255,255,255,0.1); border:none; color:white; cursor:pointer; padding:5px; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <div class="ypp-stat-card" style="flex:1; background: linear-gradient(135deg, rgba(255, 51, 102, 0.1), rgba(255, 51, 102, 0.05)); padding:15px; border-radius:12px; border:1px solid rgba(255, 51, 102, 0.2); text-align:center; box-shadow: 0 8px 32px rgba(255, 51, 102, 0.1);">
                    <div style="font-size:11px; opacity:0.8; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px; color:#ff3366;">Videos Watched</div>
                    <div id="recapTotalVideos" style="font-size:26px; font-weight:800; color:#fff; text-shadow: 0 0 10px rgba(255, 51, 102, 0.5);">0</div>
                </div>
                <div class="ypp-stat-card" style="flex:1; background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.05)); padding:15px; border-radius:12px; border:1px solid rgba(0, 229, 255, 0.2); text-align:center; box-shadow: 0 8px 32px rgba(0, 229, 255, 0.1);">
                    <div style="font-size:11px; opacity:0.8; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px; color:#00e5ff;">Time Watched</div>
                    <div id="recapTotalTime" style="font-size:26px; font-weight:800; color:#fff; text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);">0h</div>
                </div>
            </div>
            
            <h3 style="margin:0 0 10px 0; font-size:14px; color:rgba(255,255,255,0.9); font-weight:600; text-transform:uppercase; letter-spacing:1px;">Top 5 Channels</h3>
            <div id="recapTopChannels" style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;"></div>
            
            <h3 style="margin:0 0 10px 0; font-size:14px; color:rgba(255,255,255,0.9); font-weight:600; text-transform:uppercase; letter-spacing:1px;">Top 5 Videos</h3>
            <div id="recapTopVideos" style="display:flex; flex-direction:column; gap:8px; padding-bottom: 20px;"></div>
        </div>

        <div id="ypp-resume-overlay" style="display:none; position:absolute; top:0; left:0; right:0; bottom:0; z-index:100; padding:20px; overflow-y:auto; flex-direction:column; background: rgba(18, 18, 24, 0.85); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h2 style="margin:0; font-size:18px; display:flex; align-items:center; gap:8px;">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00e5ff" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Resume History
                </h2>
                <button id="btnCloseResume" style="background:rgba(255,255,255,0.1); border:none; color:white; cursor:pointer; padding:5px; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            
            <div id="resumeHistoryList" style="display:flex; flex-direction:column; gap:10px; padding-bottom: 20px;"></div>
        </div>
    `;

    const btnRecap = container.querySelector('#btnOpenRecap');
    const overlayRecap = container.querySelector('#ypp-recap-overlay');
    const btnCloseRecap = container.querySelector('#btnCloseRecap');
    
    const btnResume = container.querySelector('#btnOpenResumeHistory');
    const overlayResume = container.querySelector('#ypp-resume-overlay');
    const btnCloseResume = container.querySelector('#btnCloseResume');

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0m';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    const processRecap = (videos) => {
        let totalTime = 0;
        let channelStats = {};
        let topVideos = [];

        videos.forEach(v => {
            totalTime += (v.time || 0);
            
            if (v.channel) {
                if (!channelStats[v.channel]) channelStats[v.channel] = 0;
                channelStats[v.channel] += (v.time || 0);
            }
            
            // For top videos, we might want by watchCount or duration
            topVideos.push(v);
        });

        // Sort channels by time
        const topChannels = Object.entries(channelStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Sort videos by watchCount then time
        topVideos.sort((a, b) => {
            if ((b.watchCount || 1) !== (a.watchCount || 1)) return (b.watchCount || 1) - (a.watchCount || 1);
            return (b.time || 0) - (a.time || 0);
        });
        topVideos = topVideos.slice(0, 5);

        container.querySelector('#recapTotalVideos').textContent = videos.length;
        container.querySelector('#recapTotalTime').textContent = formatTime(totalTime);

        const channelsContainer = container.querySelector('#recapTopChannels');
        channelsContainer.innerHTML = topChannels.length ? '' : '<div style="opacity:0.5; font-size:12px;">No channel data.</div>';
        
        topChannels.forEach(([name, time], idx) => {
            channelsContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px 14px; border-radius:8px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.2s;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="color:#ff3366; font-weight:800; font-size:14px; background:rgba(255,51,102,0.1); padding:2px 8px; border-radius:12px;">#${idx + 1}</span>
                        <span style="font-size:13px; font-weight:500;">${name}</span>
                    </div>
                    <span style="font-size:12px; color:rgba(255,255,255,0.7); font-weight:500;">${formatTime(time)}</span>
                </div>
            `;
        });

        const videosContainer = container.querySelector('#recapTopVideos');
        videosContainer.innerHTML = topVideos.length ? '' : '<div style="opacity:0.5; font-size:12px;">No video data.</div>';
        
        topVideos.forEach((v, idx) => {
            videosContainer.innerHTML += `
                <div style="display:flex; gap:12px; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; cursor:pointer; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.2s;" onclick="window.open('${v.videolink}', '_blank')" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                    <div style="position:relative; width:80px; height:45px; flex-shrink:0;">
                        <img src="${v.thumbnail}" style="width:100%; height:100%; border-radius:4px; object-fit:cover;" />
                        <div style="position:absolute; top:-6px; left:-6px; background:#ff3366; color:white; font-size:10px; font-weight:bold; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.5);">${idx+1}</div>
                    </div>
                    <div style="display:flex; flex-direction:column; justify-content:center; overflow:hidden;">
                        <div style="font-size:12px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px;">${v.title}</div>
                        <div style="font-size:11px; color:rgba(255,255,255,0.6); display:flex; align-items:center; gap:6px;">
                            <span>${v.channel}</span>
                            <span style="background:rgba(255,255,255,0.1); width:4px; height:4px; border-radius:50%;"></span>
                            <span>${v.watchCount > 1 ? v.watchCount + ' plays' : formatTime(v.time)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    };

    const processResumeHistory = (videos) => {
        const list = container.querySelector('#resumeHistoryList');
        // Filter out completed videos and ones barely started
        let resumeList = videos.filter(v => !v.complete && v.time > 10 && v.duration && (v.time / v.duration) < 0.95 && !v.doNotResume);
        resumeList.sort((a, b) => b.timestamp - a.timestamp);
        
        list.innerHTML = resumeList.length ? '' : '<div style="text-align:center; padding:30px; opacity:0.5;">No videos in progress.</div>';

        resumeList.forEach(v => {
            const percent = Math.min(100, (v.time / v.duration) * 100);
            
            const item = document.createElement('div');
            item.style.cssText = 'display:flex; gap:12px; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; position:relative; overflow:hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.2s;';
            item.onmouseover = () => item.style.background = 'rgba(255,255,255,0.1)';
            item.onmouseout = () => item.style.background = 'rgba(255,255,255,0.05)';
            item.innerHTML = `
                <div style="position:relative; width:100px; height:56px; flex-shrink:0; cursor:pointer;" class="resume-thumb">
                    <img src="${v.thumbnail}" style="width:100px; height:56px; border-radius:4px; object-fit:cover;" />
                    <div style="position:absolute; bottom:0; left:0; right:0; height:3px; background:rgba(255,255,255,0.2); border-radius:0 0 4px 4px; overflow:hidden;">
                        <div style="height:100%; width:${percent}%; background:#00e5ff; box-shadow: 0 0 8px #00e5ff;"></div>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; justify-content:space-between; flex:1; min-width:0;">
                    <div class="resume-title" style="font-size:12px; font-weight:600; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; cursor:pointer;">${v.title}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:11px; color:rgba(255,255,255,0.6); font-weight:500;">${formatTime(v.time)} / ${formatTime(v.duration)}</span>
                        <button class="rm-resume-btn" style="background:rgba(255,255,255,0.1); border:none; color:white; cursor:pointer; padding:4px; border-radius:4px; display:flex; align-items:center; justify-content:center; transition:0.2s;" onmouseover="this.style.background='rgba(255,0,0,0.5)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" title="Remove from Resume History">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                    </div>
                </div>
            `;

            item.querySelector('.resume-thumb').addEventListener('click', () => window.open(v.videolink + '&t=' + Math.floor(v.time) + 's', '_blank'));
            item.querySelector('.resume-title').addEventListener('click', () => window.open(v.videolink + '&t=' + Math.floor(v.time) + 's', '_blank'));
            
            item.querySelector('.rm-resume-btn').addEventListener('click', () => {
                // Blacklist this video from resuming
                chrome.storage.local.get('ytProVideos', (data) => {
                    let h = data.ytProVideos || [];
                    const found = h.find(x => x.videolink === v.videolink);
                    if (found) {
                        found.doNotResume = true;
                        chrome.storage.local.set({ ytProVideos: h }, () => {
                            item.remove();
                        });
                    }
                });
            });

            list.appendChild(item);
        });
    };

    btnRecap.addEventListener('click', () => {
        chrome.storage.local.get('ytProVideos', (data) => {
            processRecap(data.ytProVideos || []);
            overlayRecap.style.display = 'flex';
        });
    });

    btnResume.addEventListener('click', () => {
        chrome.storage.local.get('ytProVideos', (data) => {
            processResumeHistory(data.ytProVideos || []);
            overlayResume.style.display = 'flex';
        });
    });

    btnCloseRecap.addEventListener('click', () => overlayRecap.style.display = 'none');
    btnCloseResume.addEventListener('click', () => overlayResume.style.display = 'none');
});


const initUniversalListeners = (document, state, UI, saveSettings) => {
    state.settingKeys.forEach(key => {
        const el = state.elements[key];
        if (el) {
            el.addEventListener('change', () => {
                saveSettings(() => UI.showSaveIndicator(document));
                UI.updateDependencyUI(document);
                UI.updateCustomizationPreview(document, state);
                UI.syncModeCards(document);
                
                if (key === 'popupUiTheme' && el.value) {
                    document.body.className = `ypp-theme-${el.value}`;
                }

                if (key === 'extensionLanguage' && el.value) {
                    // Reload popup instantly to apply new language without complex state management
                    setTimeout(() => window.location.reload(), 100);
                }

                if (key === 'youtubePageTheme' && el.value) {
                    const uiStyle = el.value;
                    const themeMap = {
                        'default': 'default',
                        'nature': 'forest',
                        'liquid-glass': 'default',
                        'neumorphic': 'default'
                    };
                    const newTheme = themeMap[uiStyle] || uiStyle;
                    const themeBtn = document.querySelector(`.theme-btn[data-theme="${newTheme}"]`);
                    if (themeBtn && !themeBtn.classList.contains('active')) {
                        themeBtn.click();
                    }
                    
                    if (state.elements.cardStyle) {
                        const cardStyleMap = {
                            'default': 'default',
                            'liquid-glass': 'glass',
                            'forest': 'nature',
                            'technozen': 'minimalist'
                        };
                        const mappedCardStyle = cardStyleMap[uiStyle] || uiStyle;
                        if (state.elements.cardStyle.value !== mappedCardStyle) {
                            state.elements.cardStyle.value = mappedCardStyle;
                            document.querySelectorAll('.card-style-btn').forEach(b => {
                                b.classList.toggle('active', b.dataset.style === mappedCardStyle);
                            });
                            state.elements.cardStyle.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }
                

                
                if (el.type === 'checkbox' && window.anime) {
                    const toggleCard = el.closest('.toggle-card') || el.closest('.mode-card');
                    if (toggleCard) {
                        window.anime({
                            targets: toggleCard,
                            scale: [0.97, 1],
                            duration: 400,
                            easing: 'easeOutElastic(1, .6)'
                        });
                    }
                    const slider = el.nextElementSibling;
                    if (slider && slider.classList.contains('slider')) {
                        window.anime({
                            targets: slider,
                            scale: [0.85, 1],
                            duration: 400,
                            easing: 'easeOutElastic(1, .6)'
                        });
                    }
                }
            });
            if (el.type === 'color' || el.tagName === 'TEXTAREA') {
                el.addEventListener('input', () => {
                    UI.updateDependencyUI(document);
                    UI.updateCustomizationPreview(document, state);
                    saveSettings(() => UI.showSaveIndicator(document));
                });
            }
        }
    });

    ['ambientIntensity', 'ambientBlur', 'blueLight', 'dim', 'homeColumns', 'searchColumns', 'channelColumns', 'subscriptionsColumns', 'historyColumns', 'minVideoDuration', 'watchTimeAlertHours', 'hideWatchedThreshold', 'intentionalDelayTime', 'seamlessModeGridCols'].forEach(key => {
        const slider = state.elements[key];
        const display = document.getElementById(key + 'Value');
        if (slider) {
            slider.addEventListener('input', () => {
                if (display) display.textContent = slider.value + (key === 'hideWatchedThreshold' ? '%' : '');
                saveSettings(() => UI.showSaveIndicator(document));
            });
        }
    });

    ['fontScale'].forEach(id => {
        const el = document.getElementById(id);
        const suffix = '%';
        const disp = document.getElementById(id + 'Value');
        if (el) {
            el.addEventListener('input', () => {
                if (disp) disp.textContent = el.value + suffix;
                if (id === 'fontScale') {
                    document.documentElement.style.setProperty('--ui-font-scale', (el.value / 100).toFixed(2));
                }
                saveSettings(() => UI.showSaveIndicator(document));
            });
        }
    });
};

const initMiscButtons = (document, saveSettings, loadSettings) => {
    const enableAnimationsEl = document.getElementById('enableAnimations');
    if (enableAnimationsEl) {
        enableAnimationsEl.addEventListener('change', () => {
            document.documentElement.classList.toggle('ypp-no-animations', !enableAnimationsEl.checked);
        });
    }
    const reducedMotionEl = document.getElementById('reducedMotion');
    if (reducedMotionEl) {
        reducedMotionEl.addEventListener('change', () => {
            document.documentElement.classList.toggle('ypp-reduced-motion', reducedMotionEl.checked);
        });
    }



    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
             const defaultSettings = (window.YPP && window.YPP.CONSTANTS) 
                    ? window.YPP.CONSTANTS.DEFAULT_SETTINGS 
                    : {};
            if (confirm('Are you sure you want to reset all settings to default?')) {
                chrome.storage.local.set({ settings: defaultSettings }, () => {
                    chrome.storage.local.remove(['ytProVolumeSettings'], () => {
                        loadSettings();
                    });
                });
            }
        });
    }
};

const initPresets = (document, saveSettings, UI) => {
    const applyPresetFromUI = (updates) => {
        Object.keys(updates).forEach(key => {
            const el = document.getElementById(key);
            if (el && el.type === 'checkbox') {
                el.checked = updates[key];
                el.dispatchEvent(new Event('change'));
            }
        });
        saveSettings(() => UI.showSaveIndicator(document));
    };

    document.getElementById('presetFocus')?.addEventListener('click', (e) => {
        e.stopPropagation();
        applyPresetFromUI({ enableFocusMode: true, hideComments: true, minimalMode: false, cinemaMode: false, zenMode: false, seamlessMode: false });
    });
    document.getElementById('presetResearch')?.addEventListener('click', (e) => {
        e.stopPropagation();
        applyPresetFromUI({ enableFocusMode: false, searchGrid: true, hideComments: false, minimalMode: false, cinemaMode: false, zenMode: false, seamlessMode: false });
    });
    document.getElementById('presetMinimal')?.addEventListener('click', (e) => {
        e.stopPropagation();
        applyPresetFromUI({ minimalMode: true, enableFocusMode: false, cinemaMode: false, zenMode: false, seamlessMode: false });
    });
};

const initSponsorBlockSettings = (document, saveSettings, UI) => {
    const sbToggle  = document.getElementById('sponsorBlock');
    const sbPanel   = document.getElementById('sponsorBlockCategories');
    const sbCatIds  = ['sb_sponsor','sb_intro','sb_selfpromo','sb_interaction','sb_music_offtopic','sb_preview'];
    if (sbToggle && sbPanel) {
        const _syncPanel = () => {
            sbPanel.style.display = sbToggle.checked ? 'block' : 'none';
        };
        sbToggle.addEventListener('change', () => {
            _syncPanel();
            saveSettings(() => UI.showSaveIndicator(document));
        });
        _syncPanel();
        sbCatIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => saveSettings(() => UI.showSaveIndicator(document)));
        });
    }
};

const initApp = async () => {
    try {
        await initI18n();

        // 0. i18n Initialization
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const msg = t(el.getAttribute('data-i18n'));
            if (msg) el.textContent = msg;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const msg = t(el.getAttribute('data-i18n-placeholder'));
            if (msg) el.setAttribute('placeholder', msg);
        });

        // 1. v3.1: Render schema-driven tabs before settings hydration
        renderSchema(document, state, t);

        // 1.5 Initialize State (cache DOM elements)
        initStorage(document);

        // 2. Initialize Core UI (Tabs, Modals, Global Search)
        UI.initUI(document);

        // 3. Setup Components
        const components = initComponents(document, state, UI, updateSetting, notifyThemeChange, () => saveSettings(() => UI.showSaveIndicator(document)));

        // 4. Load Settings & Update UI
        loadSettings([
            (settings) => components.initThemeSelector(settings.activeTheme),
            (settings) => UI.updateDependencyUI(document),
            (settings) => UI.updateCustomizationPreview(document, state),
            (settings) => UI.syncModeCards(document),
            (settings) => {
                const popupTheme = settings.popupUiTheme || 'liquid-glass';
                document.body.className = `ypp-theme-${popupTheme}`;
                const themeSelect = document.getElementById('popupUiTheme');
                if (themeSelect) themeSelect.value = popupTheme;
            }
        ]);

        components.initPremiumAccentDropdown();
        components.initSearchViewMode();
        components.initHideWatchedModePill();
        components.initHideWatchedPageButtons();
        components.initGlobalPlayerBarGrid();
        components.initCardStyleGrid();
        components.initYoutubeStyleGrid();
        components.initPopupStyleGrid();
        components.initCursorStyleGrid();
        components.initAccentColorSwatches();
        components.initCustomThemeBuilder();
        components.initImageBackgroundTheme();
        components.initAutoLikeInlineControls();
        components.initViewsFilterInlineSlider();
        components.initDateFilterInlineSliders();
        components.initBasicInlineSlider('searchColumns', 4);
        components.initBasicInlineSlider('seamlessModeGridCols', 4);
        components.initBasicInlineSlider('channelColumns', 5);
        components.initBasicInlineSlider('subscriptionsColumns', 5);
        components.initBasicInlineSlider('historyColumns', 5);
        UI.initDualAccentToggle(document);

        // 5. Wire Universal Event Listeners
        initUniversalListeners(document, state, UI, saveSettings);
        initMiscButtons(document, saveSettings, loadSettings);
        initPresets(document, saveSettings, UI);

        // 6. Remaining Sub-systems
        initHistoryWidget();
        initBackupTools();
        initBookmarksManager();
        initSponsorBlockSettings(document, saveSettings, UI);

        // 6.5 Apply popup theme (based on saved state)
        if (localStorage.getItem('ypp-popup-dark') === 'true' || localStorage.getItem('ypp-popup-dark') === null) {
            document.body.classList.add('ypp-theme-dark');
        } else {
            document.body.classList.remove('ypp-theme-dark');
        }

        // 7. Skeleton — remove popup-loading once settings are hydrated
        document.body.classList.add('popup-loading');

        const _removeSkeleton = () => {
            document.body.classList.remove('popup-loading');
            convertStaticDescriptionsToHelpButtons(document);
            
            // Spring stagger intro animations
            if (window.anime) {
                window.anime({
                    targets: '.nav-item',
                    translateX: [-20, 0],
                    opacity: [0, 1],
                    delay: window.anime.stagger(40),
                    duration: 800,
                    easing: 'easeOutElastic(1, .6)'
                });
                
                window.anime({
                    targets: '.tab-content.active .card-group, .tab-content.active .feature-grid > div',
                    translateY: [20, 0],
                    opacity: [0, 1],
                    delay: window.anime.stagger(60, {start: 100}),
                    duration: 800,
                    easing: 'easeOutElastic(1, .7)'
                });
            }
        };
        loadSettings([_removeSkeleton]);


    } catch (e) {
        document.body.textContent = `Error initializing popup: ${e.message}\n${e.stack}`;
        document.body.setAttribute('style', 'color:red; padding:20px; font-size:16px; white-space:pre-wrap; background:#111;');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
