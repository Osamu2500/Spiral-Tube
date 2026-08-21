/**
 * Folder UI
 * Owns: DOM injection and rendering for the Guide sidebar (left navigation),
 * filter chips (on feed), channel/card popovers, and DOM observers for these UI elements.
 *
 * Security notes:
 *  - CustomDialog: title/message/confirmText are HTML-escaped; prompt defaultValue is set
 *    via DOM .value property (never injected into an HTML attribute).
 *  - renderGuideFolders: folder names HTML-escaped before innerHTML; render-key cache skips
 *    full re-renders when data is unchanged.
 *  - renderChannelPopover: rebuilt with DOM methods — no innerHTML for dynamic content,
 *    no inline event handlers. XSS-safe for channelName and folderName. Click-outside
 *    listener attached exactly once (flag guard) to prevent unbounded accumulation.
 *  - ChannelHealthUI / runScan: all onmouseover/onmouseout inline JS removed; replaced
 *    with addEventListener (required for Chrome MV3 CSP compliance). Checkbox change
 *    listener guarded against accumulation on Retry.
 *  - runScan: ytInitialData extracted with string indices rather than a regex, fixing
 *    silent failure on YouTube's typical multiline JSON payload.
 *  - _getYoutubeConfig: extracted as a named private static method for clarity and
 *    independent testability.
 */

import anime from 'animejs/lib/anime.es.js';
import './channel-health-ui.js';





export class CustomDialog {
    static featureId = 'customDialog';
    static executionPhase = 'idle';
    static priority = 999;


    // ── Private helpers ────────────────────────────────────────────────────

    /**
     * Creates and appends the semi-transparent overlay backdrop to the body.
     * @returns {HTMLDivElement}
     */
    static _createOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = [
            'position:fixed;top:0;left:0;width:100%;height:100%',
            'background:rgba(0,0,0,0.6);backdrop-filter:blur(8px)',
            'z-index:999999;display:flex;align-items:center;justify-content:center',
            'opacity:0;transition:opacity 0.2s',
        ].join(';');
        overlay.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; display: flex !important; justify-content: center !important; align-items: center !important; background: transparent !important; pointer-events: auto !important;'; document.documentElement.appendChild(overlay);
        return overlay;
    }

    /**
     * Wraps `innerHtml` in the shared dialog card shell and injects it into
     * `overlay`, then triggers the entry animation.
     * @param {HTMLElement} overlay
     * @param {string}      innerHtml  Already-escaped HTML for the card body
     * @returns {HTMLElement} The card element (overlay.children[0])
     */
    static _buildCard(overlay, innerHtml) {
        overlay.innerHTML = `
            <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;width:100%;max-width:360px;box-shadow:0 16px 48px rgba(0,0,0,0.5);transform:scale(0.95);transition:transform 0.2s;display:flex;flex-direction:column;gap:16px;">
                ${innerHtml}
            </div>
        `;
        const card = overlay.children[0];
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
        return card;
    }

    /**
     * Animates the dialog out and removes the overlay from the DOM.
     * @param {HTMLElement} overlay
     * @param {Function}    resolve  Promise resolver
     * @param {*}           value    Value to resolve the promise with
     */
    static _closeOverlay(overlay, resolve, value) {
        overlay.style.opacity = '0';
        overlay.children[0].style.transform = 'scale(0.95)';
        setTimeout(() => overlay.remove(), 200);
        resolve(value);
    }

    // ── Public API ─────────────────────────────────────────────────────────

    /**
     * Shows a simple alert dialog with an OK button.
     * @param {string} title
     * @param {string} message
     * @returns {Promise<void>}
     */
    static alert(title, message) {
        return new Promise(resolve => {
            const overlay = this._createOverlay();
            this._buildCard(overlay, `
                <div style="font-size:18px;font-weight:600;color:#fff;">${_escHtml(title)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;">${_escHtml(message)}</div>
                <div style="display:flex;justify-content:flex-end;">
                    <button id="ypp-alert-ok" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">OK</button>
                </div>
            `);
            overlay.querySelector('#ypp-alert-ok').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, undefined)
            );
        });
    }

    /**
     * Shows a confirm dialog with Cancel / Confirm buttons.
     * @param {string}  title
     * @param {string}  message
     * @param {string}  [confirmText='Confirm']
     * @param {boolean} [danger=false]  When true the confirm button is styled red
     * @returns {Promise<boolean>}  true = confirmed, false = cancelled
     */
    static confirm(title, message, confirmText = 'Confirm', danger = false) {
        return new Promise(resolve => {
            const overlay = this._createOverlay();
            const btnColor = danger ? 'rgba(255,78,69,0.4)' : 'rgba(255,255,255,0.15)';
            this._buildCard(overlay, `
                <div style="font-size:18px;font-weight:600;color:#fff;">${_escHtml(title)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;">${_escHtml(message)}</div>
                <div style="display:flex;justify-content:flex-end;gap:12px;">
                    <button id="ypp-confirm-cancel" style="background:rgba(255,255,255,0.05);color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Cancel</button>
                    <button id="ypp-confirm-ok" style="background:${btnColor};color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">${_escHtml(confirmText)}</button>
                </div>
            `);
            overlay.querySelector('#ypp-confirm-cancel').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, false)
            );
            overlay.querySelector('#ypp-confirm-ok').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, true)
            );
        });
    }

    /**
     * Shows a text-input prompt dialog.
     * @param {string} title
     * @param {string} message
     * @param {string} [placeholder='']
     * @param {string} [defaultValue='']
     * @returns {Promise<string|null>}  The input value, or null if cancelled
     */
    static prompt(title, message, placeholder = '', defaultValue = '') {
        return new Promise(resolve => {
            const overlay = this._createOverlay();
            // Escape values going into HTML attributes to prevent injection
            const safePlaceholder = _escHtml(placeholder);
            this._buildCard(overlay, `
                <div style="font-size:18px;font-weight:600;color:#fff;">${_escHtml(title)}</div>
                <div style="font-size:14px;color:#aaa;line-height:1.5;margin-bottom:-4px;">${_escHtml(message)}</div>
                <input type="text" id="ypp-prompt-input" placeholder="${safePlaceholder}" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:12px;border-radius:8px;font-size:14px;outline:none;width:100%;box-sizing:border-box;">
                <div style="display:flex;justify-content:flex-end;gap:12px;">
                    <button id="ypp-prompt-cancel" style="background:rgba(255,255,255,0.05);color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Cancel</button>
                    <button id="ypp-prompt-ok" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:10px 20px;border-radius:8px;font-weight:500;cursor:pointer;">Submit</button>
                </div>
            `);

            // Set defaultValue via DOM property (safe — avoids attribute injection)
            const input = overlay.querySelector('#ypp-prompt-input');
            input.value = defaultValue;
            input.focus();
            input.select();

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter')  this._closeOverlay(overlay, resolve, input.value);
                if (e.key === 'Escape') this._closeOverlay(overlay, resolve, null);
            });
            overlay.querySelector('#ypp-prompt-cancel').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, null)
            );
            overlay.querySelector('#ypp-prompt-ok').addEventListener('click', () =>
                this._closeOverlay(overlay, resolve, input.value)
            );
        });
    }
};

/** Escapes a string for safe insertion into innerHTML. */
function _escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export class FolderUI {
    static featureId = 'folderUI';
    static executionPhase = 'idle';
    static priority = 999;


    /**
     * @param {Object} storage       - FolderStorage instance
     * @param {Object} orchestrator  - Callbacks/state from SubscriptionFolders (e.g. activeFolder, getters/setters)
     */
    constructor(storage, orchestrator) {
        this.storage      = storage;
        this.orchestrator = orchestrator;
        this.observer     = window.YPP.sharedObserver || new window.YPP.Utils.DOMObserver();

        /** @type {boolean} Whether the popover click-outside listener has been attached */
        this._popoverListenerAttached = false;
        /** @type {string|null} Cache key for the last renderGuideFolders render */
        this._guideRenderKey = null;
    }

    // =========================================================================
    // GUIDE SIDEBAR UI
    // =========================================================================

    /** Set up the observer to inject folders into the left navigation guide. */
    injectGuideFolders() {
        this.observer.register('guide-folders', '#guide-inner-content #sections ytd-guide-section-renderer', (elements) => {
            const sections = Array.from(document.querySelectorAll('#guide-inner-content ytd-guide-section-renderer'));
            let subsSection = sections.find(sec => {
                const title = sec.querySelector('#title')?.textContent?.toLowerCase() || '';
                return title.includes('subscriptions') || title.includes('abonnements');
            });
            if (!subsSection && sections.length > 1) {
                subsSection = sections[1];
            }
            if (subsSection) {
                this.renderGuideFolders(subsSection);
            }
        }, { runOnce: true });
    }

    /** Re-render the folder list within the guide. Skips re-render if data hasn't changed. */
    renderGuideFolders(sectionEl = null) {
        // --- Render-key cache: skip full re-render when nothing has changed ---
        const folderNames = Object.keys(this.storage.folders);
        const activeFolder = this.orchestrator.getActiveFolder();
        const newRenderKey = folderNames.join(',') + '|' + (activeFolder || '');
        const containerExists = !!document.getElementById('ypp-sub-folders-container');
        if (newRenderKey === this._guideRenderKey && containerExists) return;
        this._guideRenderKey = newRenderKey;

        let container = document.getElementById('ypp-sub-folders-container');

        if (!container && sectionEl) {
            container = document.createElement('div');
            container.id = 'ypp-sub-folders-container';
            container.className = 'ypp-sub-folders';

            const itemsContainer = sectionEl.querySelector('#items');
            if (itemsContainer) {
                itemsContainer.parentNode.insertBefore(container, itemsContainer.nextSibling);
            }

            // === EVENT DELEGATION ===
            // Attach listeners to the container once, avoiding memory leaks on re-renders.
            // All interactions bubble up to this container.
            this.orchestrator.addListener(container, 'click', async (e) => {
                const addBtn = e.target.closest('#ypp-add-folder-btn');
                if (addBtn) {
                    const name = await window.YPP.features.CustomDialog.prompt('New Folder', 'Enter new folder name:');
                    if (name && name.trim()) {
                        if (this.storage.addFolder(name.trim())) {
                            this._guideRenderKey = null;
                            this.renderGuideFolders();
                            this.renderFilterChips();
                        }
                    }
                    return;
                }

                const playBtn = e.target.closest('.ypp-play-all-btn');
                if (playBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const folderItem = playBtn.closest('.ypp-folder-item');
                    if (folderItem) {
                        this.orchestrator.playAll(folderItem.dataset.folder);
                    }
                    return;
                }

                const folderItem = e.target.closest('.ypp-folder-item');
                if (folderItem) {
                    const folderName = folderItem.dataset.folder;
                    if (!window.location.href.includes('/feed/subscriptions')) {
                        sessionStorage.setItem('ypp_pending_folder', folderName);
                        const tempLink = document.createElement('a');
                        tempLink.href = '/feed/subscriptions';
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        tempLink.remove();
                    } else {
                        this.orchestrator.setActiveFolder(folderName, e.shiftKey || e.ctrlKey || e.metaKey);
                    }
                }
            });

            this.orchestrator.addListener(container, 'dragstart', (e) => {
                const folderItem = e.target.closest('.ypp-folder-item');
                if (folderItem) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', folderItem.dataset.folder);
                    folderItem.classList.add('ypp-dragging');
                }
            });

            this.orchestrator.addListener(container, 'dragend', (e) => {
                const folderItem = e.target.closest('.ypp-folder-item');
                if (folderItem) {
                    folderItem.classList.remove('ypp-dragging');
                    container.querySelectorAll('.ypp-folder-item').forEach(item => {
                        item.classList.remove('ypp-drag-over-top', 'ypp-drag-over-bottom');
                    });
                }
            });

            this.orchestrator.addListener(container, 'dragover', (e) => {
                const folderItem = e.target.closest('.ypp-folder-item');
                if (folderItem) {
                    e.preventDefault();
                    const rect = folderItem.getBoundingClientRect();
                    const mid = rect.top + rect.height / 2;
                    if (e.clientY < mid) {
                        folderItem.classList.add('ypp-drag-over-top');
                        folderItem.classList.remove('ypp-drag-over-bottom');
                    } else {
                        folderItem.classList.add('ypp-drag-over-bottom');
                        folderItem.classList.remove('ypp-drag-over-top');
                    }
                }
            });

            this.orchestrator.addListener(container, 'dragleave', (e) => {
                const folderItem = e.target.closest('.ypp-folder-item');
                if (folderItem) {
                    folderItem.classList.remove('ypp-drag-over-top', 'ypp-drag-over-bottom');
                }
            });

            this.orchestrator.addListener(container, 'drop', (e) => {
                const folderItem = e.target.closest('.ypp-folder-item');
                if (folderItem) {
                    e.preventDefault();
                    folderItem.classList.remove('ypp-drag-over-top', 'ypp-drag-over-bottom');
                    const folderName = folderItem.dataset.folder;
                    const draggedFolder = e.dataTransfer.getData('text/plain');
                    if (draggedFolder && draggedFolder !== folderName) {
                        const keys = Object.keys(this.storage.folders);
                        let dropIndex = keys.indexOf(folderName);
                        
                        const rect = folderItem.getBoundingClientRect();
                        const mid = rect.top + rect.height / 2;
                        if (e.clientY >= mid) {
                            dropIndex += 1;
                        }
                        
                        const oldIndex = keys.indexOf(draggedFolder);
                        if (oldIndex < dropIndex) dropIndex -= 1;

                        if (this.storage.reorderFolder(draggedFolder, dropIndex)) {
                            this._guideRenderKey = null;
                            this.renderGuideFolders();
                            this.renderFilterChips();
                        }
                    }
                }
            });
            // ========================
        }
        if (!container) return; // Wait for DOM

        // Build header (safe static HTML)
        container.innerHTML = `
            <style>
                /* Handle hover state with pure CSS instead of JS mouseenter/mouseleave */
                .ypp-folder-item:hover .ypp-play-all-btn { opacity: 1 !important; }
            </style>
            <div class="ypp-folder-header">
                <h3>My Folders</h3>
                <button id="ypp-add-folder-btn" class="ypp-icon-btn">+</button>
            </div>
            <div id="ypp-folder-list"></div>
        `;

        const list = container.querySelector('#ypp-folder-list');

        folderNames.forEach(folderName => {
            const config = this.storage.folderConfig[folderName] || {};
            const el = document.createElement('div');
            el.className = 'ypp-folder-item';
            el.draggable = true;
            el.dataset.folder = folderName;
            if (activeFolder && activeFolder.split(',').map(f => f.trim()).includes(folderName)) el.classList.add('active');

            // Use _escHtml for dynamic values going into innerHTML to prevent XSS
            const safeIcon = _escHtml(config.icon || '📁');
            const safeName = _escHtml(folderName);
            const count = this.storage.folders[folderName].length;

            el.innerHTML = `
                <div class="ypp-folder-icon">${safeIcon}</div>
                <div class="ypp-folder-name" style="flex: 1;">${safeName}</div>
                <div class="ypp-folder-count">${count}</div>
                <button class="ypp-play-all-btn" title="Play All" style="margin-left: 8px; width: 24px; height: 24px; padding: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; border: none; cursor: pointer; background: rgba(255,255,255,0.1); color: white;">
                    <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
            `;
            list.appendChild(el);
        });
    }

    removeGuideFolders() {
        const container = document.getElementById('ypp-sub-folders-container');
        if (container) container.remove();
    }

    // =========================================================================
    // FILTER CHIPS UI (Feed Page)
    // =========================================================================

    /** Force-inject the chips bar into the DOM (waits for the grid via observer). */
    renderFilterChips() {
        if (!this.orchestrator.isFeedPage()) return;

        const GRID_SELECTOR = 'ytd-browse ytd-rich-grid-renderer, ytd-browse ytd-section-list-renderer, ytd-browse ytd-item-section-renderer, #contents ytd-rich-grid-renderer, ytd-rich-grid-renderer, ytd-section-list-renderer';

        const inject = (elements) => {
            const grid = elements?.[0] || document.querySelector(GRID_SELECTOR);
            if (!grid) return;
            const parent = grid.parentNode;
            if (!parent) return;

            let chipsBar = document.getElementById('ypp-folder-chips');

            if (!chipsBar) {
                chipsBar = document.createElement('div');
                chipsBar.id = 'ypp-folder-chips';
                chipsBar.className = 'ypp-folder-chips-bar';
            }

            // Ensure full width above the grid without overlapping video cards
            chipsBar.style.cssText = 'width: 100% !important; max-width: 100% !important; display: flex !important; flex-wrap: wrap !important; align-items: center !important; justify-content: space-between !important; position: relative !important; z-index: 100 !important; margin: 0 0 24px 0 !important; box-sizing: border-box !important;';

            if (chipsBar.nextElementSibling !== grid || chipsBar.parentNode !== parent) {
                parent.insertBefore(chipsBar, grid);
            }

            this.rebuildChipsContent(chipsBar);
        };

        this.observer.register(
            'inject-filter-chips',
            GRID_SELECTOR,
            inject
        );

        // Also poll immediately in case the grid is already in the DOM and mutation observer doesn't fire
        if (window.YPP?.Utils?.pollFor) {
            window.YPP.Utils.pollFor(() => document.querySelector(GRID_SELECTOR), 8000, 250)
                .then(el => { if (el) inject([el]); })
                .catch(() => {});
        } else {
            const existing = document.querySelector(GRID_SELECTOR);
            if (existing) inject([existing]);
        }
    }

    /**
     * Re-render the left side of the chips bar in-place.
     * Safe to call at any time; creates the bar if missing.
     */
    rebuildChipsContent(chipsBar) {
        if (!chipsBar) chipsBar = document.getElementById('ypp-folder-chips');
        if (!chipsBar) return; // Bar not injected yet — observer will handle it

        const showFolders = this.orchestrator.settings?.subscriptionFolders !== false;
        const showFilter = this.orchestrator.settings?.enableFilterBar !== false;
        const showHealth = this.orchestrator.settings?.enableChannelHealth !== false;

        if (showFolders || showFilter || showHealth) {
            // Wipe and rebuild only the left container — preserves the right filter bar
            const existingLeft = chipsBar.querySelector('.ypp-folder-chips-left');
            if (existingLeft) existingLeft.remove();
            const existingFeedFilter = chipsBar.querySelectorAll('.ypp-feed-filter-chips');
            existingFeedFilter.forEach(el => el.remove());
            chipsBar.querySelectorAll('.ypp-feed-filter-chips').forEach(el => el.remove());

            const activeFolder = this.orchestrator.getActiveFolder();

            // ================= 1-ROW LAYOUT =================
            chipsBar.style.display = 'flex';
            chipsBar.style.flexDirection = 'row';
            chipsBar.style.gap = '8px';
            chipsBar.style.marginBottom = '16px';
            
            if (showFolders) {
                // --- FILTER CHIPS ---
                const ffSettings = this.orchestrator.settings || {};
                const feedFilterBar = document.createElement('div');
                feedFilterBar.className = 'ypp-sub-filter-group ypp-feed-filter-chips';
                feedFilterBar.style.cssText = 'display: flex; align-items: center; gap: 4px; flex-wrap: wrap; width: 100%;';
                
                this.orchestrator.ffActiveChips = this.orchestrator.ffActiveChips || {};

                const getChipBg = (state) => {
                    if (state === 'show') return 'rgba(43, 166, 64, 0.2)';
                    if (state === 'hide') return 'rgba(235, 64, 52, 0.2)';
                    return 'rgba(255,255,255,0.1)';
                };
                
                const getChipBorder = (state) => {
                    if (state === 'show') return '1px solid rgba(43, 166, 64, 0.5)';
                    if (state === 'hide') return '1px solid rgba(235, 64, 52, 0.5)';
                    return '1px solid transparent';
                };

                const getChipColor = (state) => {
                    if (state === 'show') return '#4ade80';
                    if (state === 'hide') return '#f87171';
                    return '#f1f1f1';
                };

                const createFfChip = (id, label, iconSvg = '', isDefault = false) => {
                    if (ffSettings[`ff_${id}_visible`] === false) return;
                    
                    if (!this.orchestrator.ffInitialized) {
                        if (ffSettings[`ff_${id}_default`] || isDefault) {
                            this.orchestrator.ffActiveChips[id] = 'show';
                        } else {
                            this.orchestrator.ffActiveChips[id] = 'neutral';
                        }
                    }

                    const chip = document.createElement('button');
                    let state = this.orchestrator.ffActiveChips[id] || 'neutral';
                    chip.className = `ypp-filter-chip ypp-ff-chip ypp-ff-${state}`;
                    chip.dataset.id = id;
                    chip.innerHTML = (iconSvg ? `<span style="margin-right:4px;">${iconSvg}</span>` : '') + label;
                    chip.style.cssText = `
                        padding: 6px 12px;
                        border-radius: 16px;
                        font-size: 13px;
                        font-weight: 500;
                        background: ${getChipBg(state)};
                        color: ${getChipColor(state)};
                        border: ${getChipBorder(state)};
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        transition: 0.2s;
                    `;

                    chip.addEventListener('click', () => {
                        const multiSelect = ffSettings.ff_opt_multiselect;
                        if (id === 'all') {
                            Object.keys(this.orchestrator.ffActiveChips).forEach(k => {
                                this.orchestrator.ffActiveChips[k] = 'neutral';
                            });
                            this.orchestrator.ffActiveChips['all'] = 'show';
                        } else {
                            if (!multiSelect) {
                                const currentState = this.orchestrator.ffActiveChips[id] || 'neutral';
                                Object.keys(this.orchestrator.ffActiveChips).forEach(k => {
                                    this.orchestrator.ffActiveChips[k] = 'neutral';
                                });
                                this.orchestrator.ffActiveChips[id] = currentState;
                            }
                            
                            this.orchestrator.ffActiveChips['all'] = 'neutral';
                            
                            const current = this.orchestrator.ffActiveChips[id] || 'neutral';
                            if (current === 'neutral') this.orchestrator.ffActiveChips[id] = 'show';
                            else if (current === 'show') this.orchestrator.ffActiveChips[id] = 'hide';
                            else this.orchestrator.ffActiveChips[id] = 'neutral';
                            
                            const anyActive = Object.values(this.orchestrator.ffActiveChips).some(s => s !== 'neutral');
                            if (!anyActive) {
                                this.orchestrator.ffActiveChips['all'] = 'show';
                            }
                        }
                        
                        feedFilterBar.querySelectorAll('.ypp-ff-chip').forEach(c => {
                            const s = this.orchestrator.ffActiveChips[c.dataset.id] || 'neutral';
                            c.className = `ypp-filter-chip ypp-ff-chip ypp-ff-${s}`;
                            c.style.background = getChipBg(s);
                            c.style.color = getChipColor(s);
                            c.style.border = getChipBorder(s);
                        });
                        
                        window.YPP.events?.emit('feed-filter:update-chips', this.orchestrator.ffActiveChips);
                        this.orchestrator.updateFilterState();
                    });
                    feedFilterBar.appendChild(chip);
                };

                createFfChip('all', 'All', '', true);
                createFfChip('live', 'Live', '<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5l6-4.5-6-4.5v9z"/></svg>');
                createFfChip('streamed', 'Streamed', '<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>');
                createFfChip('video', 'Video', '<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z"/></svg>');
                createFfChip('shorts', 'Shorts', '<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l1.2-.63s-1.16-.49-1.19-.5c-1.38-.6-2.08-2.14-1.59-3.57.48-1.39 1.96-2.19 3.4-1.92L6 8.52l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72l-1.2.63s1.16.49 1.19.5c1.38.6 2.08 2.14 1.59 3.57-.48 1.39-1.96 2.19-3.4 1.92L18 15.48z"/></svg>');
                createFfChip('scheduled', 'Scheduled', '<svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>');
                                        createFfChip('posts', 'Posts', '');
                createFfChip('playlist', 'Playlist', '');

                const watchSelectStyle = 'background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 6px 10px; border-radius: 16px; cursor: pointer; outline: none; font-size: 13px; font-weight: 500; transition: 0.2s; height: 30px; margin-left: 8px;';
                const watchDropdown = document.createElement('select');
                watchDropdown.style.cssText = watchSelectStyle;
                
                ['All', 'Unwatched', 'Watched'].forEach(opt => {
                    const el = document.createElement('option');
                    el.value = opt.toLowerCase();
                    el.textContent = opt;
                    el.style.background = '#222';
                    watchDropdown.appendChild(el);
                });
                
                if (!this.orchestrator.ffInitialized) {
                    if (ffSettings.ff_unwatched_default) {
                        watchDropdown.value = 'unwatched';
                        this.orchestrator.ffActiveWatch = 'unwatched';
                    } else if (ffSettings.ff_watched_default) {
                        watchDropdown.value = 'watched';
                        this.orchestrator.ffActiveWatch = 'watched';
                    } else {
                        this.orchestrator.ffActiveWatch = 'all';
                    }
                } else {
                    watchDropdown.value = this.orchestrator.ffActiveWatch || 'all';
                }
                
                watchDropdown.addEventListener('change', (e) => {
                    this.orchestrator.ffActiveWatch = e.target.value;
                    this.orchestrator.updateFilterState();
                });
                feedFilterBar.appendChild(watchDropdown);

                if (ffSettings.ff_search_visible !== false) {
                    const searchInput = document.createElement('input');
                    searchInput.type = 'text';
                    searchInput.placeholder = 'Search...';
                    searchInput.style.cssText = 'background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 16px; font-size: 13px; outline: none; width: 140px; height: 30px; transition: width 0.2s; margin-left: 8px;';
                    
                    if (!this.orchestrator.ffInitialized) {
                        this.orchestrator.ffActiveSearch = ffSettings.ff_search_default || '';
                    }
                    searchInput.value = this.orchestrator.ffActiveSearch || '';
                    
                    searchInput.addEventListener('focus', () => searchInput.style.width = '200px');
                    searchInput.addEventListener('blur', () => searchInput.style.width = '140px');
                    searchInput.addEventListener('input', (e) => {
                        this.orchestrator.ffActiveSearch = e.target.value.toLowerCase();
                        this.orchestrator.updateFilterState();
                    });
                    feedFilterBar.appendChild(searchInput);
                }

                this.orchestrator.ffInitialized = true;

                // Combine both rows
                            chipsBar.appendChild(feedFilterBar);
            }

            // Re-inject the right container (which holds Channel Health button) if it's missing
            if (!chipsBar.querySelector('.ypp-folder-chips-right')) {
                this._injectFilterBar(chipsBar);
            }

        } else {
            chipsBar.style.display = 'none';
            chipsBar.innerHTML = '';
        }
    }

    removeFilterChips() {
        const chipsBar = document.getElementById('ypp-folder-chips');
        if (chipsBar) chipsBar.remove();
        const filterBar = document.querySelector('.ypp-sub-filter-bar');
        if (filterBar) filterBar.remove();
    }

    _injectFilterBar(chipsBar) {
        if (!chipsBar) return;
        
        // Remove existing right container if it exists
        const existingRight = chipsBar.querySelector('.ypp-folder-chips-right');
        if (existingRight) existingRight.remove();
        
        const existingSeparator = chipsBar.querySelector('.ypp-filter-separator');
        if (existingSeparator) existingSeparator.remove();

        const showFilter = this.orchestrator.settings?.enableFilterBar !== false;
        const showHealth = this.orchestrator.settings?.enableChannelHealth !== false;

        if (!showFilter && !showHealth) return;

        // Add separator
        const separator = document.createElement('div');
        separator.className = 'ypp-filter-separator';
        chipsBar.appendChild(separator);

        const rightContainer = document.createElement('div');
        rightContainer.className = 'ypp-folder-chips-right';
        
        const selectStyle = 'background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; cursor: pointer; outline: none; font-size: 14px; font-weight: 500; min-width: 120px; transition: 0.2s;';

        let innerHTML = '';

        if (showFilter) {
            innerHTML += `
                <div class="ypp-sub-filter-group" style="display: flex; align-items: center; gap: 8px;">
                    <span class="ypp-sub-filter-label" style="color: #aaa; font-size: 13px; font-weight: 500; text-transform: uppercase;">Duration</span>
                    <select class="ypp-filter-dropdown" id="ypp-duration-filter" style="${selectStyle}">
                        <option value="all" style="background:#222; color:#fff;">All</option>
                        <option value="short" style="background:#222; color:#fff;">Under 5 min</option>
                        <option value="medium" style="background:#222; color:#fff;">5 – 20 min</option>
                        <option value="long" style="background:#222; color:#fff;">Over 20 min</option>
                        <option value="custom" style="background:#222; color:#fff;">Custom...</option>
                    </select>
                </div>
                <div class="ypp-sub-filter-group" style="display: flex; align-items: center; gap: 8px;">
                    <span class="ypp-sub-filter-label" style="color: #aaa; font-size: 13px; font-weight: 500; text-transform: uppercase;">Uploaded</span>
                    <select class="ypp-filter-dropdown" id="ypp-date-filter" style="${selectStyle}">
                        <option value="all" style="background:#222; color:#fff;">All time</option>
                        <option value="today" style="background:#222; color:#fff;">Today</option>
                        <option value="week" style="background:#222; color:#fff;">This week</option>
                        <option value="month" style="background:#222; color:#fff;">This month</option>
                        <option value="custom" style="background:#222; color:#fff;">Custom...</option>
                    </select>
                </div>
                <div class="ypp-sub-filter-group" style="display: flex; align-items: center; gap: 8px;">
                    <span class="ypp-sub-filter-label" style="color: #aaa; font-size: 13px; font-weight: 500; text-transform: uppercase;">Sort by</span>
                    <select class="ypp-filter-dropdown" id="ypp-sort-filter" style="${selectStyle}">
                        <option value="latest" style="background:#222; color:#fff;">Latest</option>
                        <option value="oldest" style="background:#222; color:#fff;">Oldest</option>
                        <option value="longest" style="background:#222; color:#fff;">Longest</option>
                        <option value="shortest" style="background:#222; color:#fff;">Shortest</option>
                    </select>
                </div>
            `;
        }

        if (showHealth) {
            innerHTML += `
                <div class="ypp-sub-filter-group">
                    <button id="ypp-health-btn" class="ypp-btn-primary" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 14px; border-radius: 8px; transition: 0.2s;">
                        <svg height="18" width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z"/></svg>
                        Channel Health
                    </button>
                </div>
            `;
        }

        rightContainer.innerHTML = innerHTML;
        chipsBar.appendChild(rightContainer);

        const bar = rightContainer;

        // Hover effects for select and button
        bar.querySelectorAll('.ypp-filter-dropdown').forEach(s => {
            s.addEventListener('mouseover', () => s.style.background = 'rgba(255,255,255,0.12)');
            s.addEventListener('mouseout', () => s.style.background = 'rgba(255,255,255,0.08)');
        });

        const handleFilterChange = async (e) => {
            const select = e.target;
            let val = select.value;

            if (val === 'custom') {
                if (select.id === 'ypp-duration-filter') {
                    const maxMins = await window.YPP.features.CustomDialog.prompt('Custom Duration', "Enter maximum video duration in minutes (e.g., 15):");
                    if (maxMins && !isNaN(maxMins)) {
                        val = `custom:${maxMins}`;
                        const opt = document.createElement('option');
                        opt.value = val;
                        opt.textContent = `Under ${maxMins}m`;
                        opt.style.background = '#222';
                        select.appendChild(opt);
                        select.value = val;
                    } else {
                        select.value = 'all';
                        val = 'all';
                    }
                } else if (select.id === 'ypp-date-filter') {
                    const maxDays = await window.YPP.features.CustomDialog.prompt('Custom Date', "Enter maximum days ago (e.g., 3):");
                    if (maxDays && !isNaN(maxDays)) {
                        val = `custom:${maxDays}`;
                        const opt = document.createElement('option');
                        opt.value = val;
                        opt.textContent = `Past ${maxDays} days`;
                        opt.style.background = '#222';
                        select.appendChild(opt);
                        select.value = val;
                    } else {
                        select.value = 'all';
                        val = 'all';
                    }
                }
            }

            const duration = document.getElementById('ypp-duration-filter')?.value || 'all';
            const date = document.getElementById('ypp-date-filter')?.value || 'all';
            const sort = document.getElementById('ypp-sort-filter')?.value || 'latest';

            window.YPP.events?.emit('subscriptions:filter-changed', { duration, date, sort });
        };

        bar.querySelectorAll('.ypp-filter-dropdown').forEach(select => {
            select.addEventListener('change', handleFilterChange);
        });

        bar.querySelector('#ypp-health-btn')?.addEventListener('click', () => {
            if (window.YPP.features.ChannelHealthUI) {
                window.YPP.features.ChannelHealthUI.openModal(this);
            }
        });
    }

    _createToggleChip(container, label, initialState, onChange) {
        const chip = document.createElement('button');
        chip.className = `ypp-filter-chip ypp-toggle-chip ${initialState ? 'active' : ''}`;
        chip.textContent = label;
        chip.addEventListener('click', () => {
            const newState = !chip.classList.contains('active');
            chip.classList.toggle('active', newState);
            onChange(newState);
        });
        container.appendChild(chip);
    }

    updateChipStylesForFolder(folderName) {
        document.querySelectorAll('.ypp-filter-chip').forEach(chip => {
            if (chip.dataset.folder === folderName) {
                chip.classList.add('active');
            } else if (chip.dataset.folder !== undefined) {
                chip.classList.remove('active');
            }
        });
        document.querySelectorAll('.ypp-folder-item').forEach(el => {
            // Optional chaining guards against missing .ypp-folder-name (defensive)
            if (el.querySelector('.ypp-folder-name')?.textContent === folderName) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    // =========================================================================
    // CHANNEL / CARD POPOVERS
    // =========================================================================

    /** Inject badges onto feed cards. */
    injectCardBadges() {
        // Disabled per user request
    }

    /** Inject "Folders" badge onto channel header pages. */
    injectChannelBadge() {
        this.observer.register('channel-badge', 'ytd-subscribe-button-renderer', (elements) => {
            if (!elements || elements.length === 0) return;
            const container = elements[0].parentNode;
            if (document.getElementById('ypp-channel-folder-btn')) return;

            const btn = document.createElement('button');
            btn.id = 'ypp-channel-folder-btn';
            btn.className = 'ypp-tactile-btn';
            btn.innerHTML = String.raw`<span style="margin-right:4px;">📁</span> Folders`;

            const channelNameEl = document.querySelector('ytd-channel-name#channel-name .yt-formatted-string');
            if (!channelNameEl) return;

            const channelName = channelNameEl.textContent.trim();
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.renderChannelPopover(btn, channelName);
            });

            container.insertBefore(btn, elements[0]);
        }, { runOnce: true });
    }

    /**
     * Renders (or re-renders) the folder-membership popover anchored below `buttonEl`.
     *
     * Security notes:
     *  - The outer shell is static HTML with no dynamic values interpolated, so innerHTML is safe.
     *  - channelName is set via textContent (XSS-safe).
     *  - Folder list items are built entirely via DOM methods: no innerHTML, no inline handlers,
     *    and no attribute injection — eliminating both XSS and CSP-violating onmouseover attributes.
     *
     * @param {HTMLElement} buttonEl    - Anchor element the popover appears below
     * @param {string}      channelName - Channel to assign/remove from folders
     */
    renderChannelPopover(buttonEl, channelName) {
        let popover = document.getElementById('ypp-folder-popover');
        if (!popover) {
            popover = document.createElement('div');
            popover.id = 'ypp-folder-popover';
            popover.className = 'ypp-glass-popover';
            document.body.appendChild(popover);
        }

        // Attach click-outside listener exactly once — prevents unbounded accumulation
        // across multiple popover opens. Stored as a named handler for _teardown() removal.
        if (!this._popoverListenerAttached) {
            this._popoverListenerAttached = true;
            this._popoverClickOutsideHandler = (e) => {
                const popoverEl = document.getElementById('ypp-folder-popover');
                if (!popoverEl) return;
                const clickedInside    = popoverEl.contains(e.target);
                const clickedFolderBtn = e.target.closest('.ypp-card-folder-btn') || e.target.closest('#ypp-channel-folder-btn');
                if (!clickedInside && !clickedFolderBtn) {
                    popoverEl.classList.remove('visible');
                }
            };
            document.addEventListener('click', this._popoverClickOutsideHandler);
        }


        const rect = buttonEl.getBoundingClientRect();
        popover.style.top  = `${rect.bottom + window.scrollY + 8}px`;
        popover.style.left = `${rect.left + window.scrollX}px`;
        popover.style.zIndex = '999999';

        // Static shell only — no dynamic values interpolated here.
        popover.innerHTML = `
            <div style="background: rgba(28, 27, 31, 0.7); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.4); width: 260px; overflow: hidden; display: flex; flex-direction: column;">
                <div class="ypp-popover-header" style="padding: 20px 20px 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(208, 188, 255, 0.05);">
                    <div style="font-size: 11px; color: rgba(208, 188, 255, 0.8); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; font-weight: 600; font-family: 'Roboto', 'Google Sans', sans-serif;">Save to folder</div>
                    <div id="ypp-popover-channel-name" style="font-size: 16px; color: #E6E1E5; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Roboto', 'Google Sans', sans-serif;"></div>
                </div>
                <div class="ypp-popover-list" id="ypp-popover-list" style="padding: 12px; max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;"></div>
            </div>
        `;

        // Inject channel name via textContent — XSS-safe, no HTML parsing.
        popover.querySelector('#ypp-popover-channel-name').textContent = channelName;

        const listEl    = popover.querySelector('#ypp-popover-list');
        const folderKeys = Object.keys(this.storage.folders);

        if (folderKeys.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.cssText = 'padding: 16px; text-align: center; color: rgba(255,255,255,0.5); font-size: 13px;';
            emptyMsg.textContent = 'No folders exist.';
            listEl.appendChild(emptyMsg);
        } else {
            folderKeys.forEach(folderName => {
                const isChecked = this.storage.folders[folderName].includes(channelName);

                // Build via DOM — no innerHTML injection, no inline event handler attributes.
                const label = document.createElement('label');
                label.className = 'ypp-folder-checkbox';
                label.style.cssText = 'display: flex; align-items: center; padding: 12px 14px; border-radius: 12px; cursor: pointer; transition: background 0.2s;';
                label.addEventListener('mouseover', () => { label.style.background = 'rgba(255,255,255,0.08)'; });
                label.addEventListener('mouseout',  () => { label.style.background = 'transparent'; });

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                // dataset assignment is safe — bypasses HTML attribute parsing.
                checkbox.dataset.folder = folderName;
                checkbox.checked = isChecked;
                checkbox.style.cssText = 'margin-right: 14px; accent-color: #fff; width: 18px; height: 18px; cursor: pointer; border-radius: 4px;';

                // Wire up change handler with a closure over the typed `folderName`.
                checkbox.addEventListener('change', () => {
                    const activeFolder = this.orchestrator.getActiveFolder();
                    if (checkbox.checked) {
                        this.storage.addChannelToFolder(channelName, folderName);
                        if (activeFolder === folderName || activeFolder === '__no_folder__') {
                            this.orchestrator.forceRefreshFeed();
                        }
                    } else {
                        this.storage.removeChannelFromFolder(channelName, folderName);
                        if (activeFolder === folderName || activeFolder === '__no_folder__') {
                            this.orchestrator.forceRefreshFeed();
                        }
                    }
                    this.renderGuideFolders(); // Live-update sidebar channel counts

                    // Live filter update for Channel Health modal list
                    const filterSel = document.getElementById('ypp-health-folder-filter-dropdown');
                    if (filterSel && filterSel.value !== 'all') {
                        const row = document.querySelector(`.ypp-channel-health-row[data-name="${CSS.escape(channelName)}"]`);
                        if (row) {
                            let folders = row.dataset.folders ? row.dataset.folders.split(',') : [];
                            if (checkbox.checked) {
                                if (!folders.includes(folderName)) folders.push(folderName);
                            } else {
                                folders = folders.filter(f => f !== folderName);
                            }
                            row.dataset.folders = folders.join(',');
                            
                            const folderFilter = filterSel.value;
                            let shouldShow = (folderFilter === '__no_folder__') ? (folders.length === 0) : folders.includes(folderFilter);
                            
                            if (!shouldShow) {
                                row.style.display = 'none';
                            } else {
                                // Important: We need to also check the status filter and search filter before showing
                                const statusFilter = document.getElementById('ypp-health-filter-dropdown')?.value || 'all';
                                const searchQ = document.getElementById('ypp-health-search-input')?.value?.toLowerCase()?.trim() || '';
                                let matchesStatus = (statusFilter === 'all' || row.dataset.status === statusFilter);
                                let matchesSearch = searchQ ? row.dataset.name.toLowerCase().includes(searchQ) : true;
                                if (matchesStatus && matchesSearch) row.style.display = 'flex';
                            }
                        }
                    }
                });

                const nameSpan = document.createElement('span');
                nameSpan.style.cssText = 'color: #E6E1E5; font-size: 15px; font-weight: 500; font-family: "Roboto", "Google Sans", sans-serif;';
                nameSpan.textContent = folderName; // XSS-safe

                label.appendChild(checkbox);
                label.appendChild(nameSpan);
                listEl.appendChild(label);
            });
        }

        popover.classList.add('visible');
    }
};

// ========================================

window.YPP.features.CustomDialog = CustomDialog;

window.YPP.features.FolderUI = FolderUI;

