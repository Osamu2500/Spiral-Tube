export class VideoFiltersUI {
    static featureId = 'videoFiltersUI';
    static executionPhase = 'idle';
    static priority = 999;


    /**
     * Debounce-saves all video filter state to Chrome storage so settings
     * survive SPA navigation (switching episodes).
     * Mirrors VolumeBoosterUI.saveVolumeSettings for the same pattern.
     * @param {VideoFilters} ctx - The VideoFilters feature instance
     */
    static saveFilterSettings(ctx) {
        if (!this._debouncedFilterSave) {
            const debounce = window.YPP?.Utils?.debounce
                || ((fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; });
            this._debouncedFilterSave = debounce((ctxArg) => {
                const adj = ctxArg.filterAdjustments;
                const newSettings = {
                    cinemaFilterIndex:       ctxArg.currentFilterIndex,
                    cinemaFilterIntensity:   ctxArg.filterIntensity,
                    cinemaFilterBrightness:  adj.brightness,
                    cinemaFilterContrast:    adj.contrast,
                    cinemaFilterSaturate:    adj.saturate,
                    cinemaFilterHue:         adj.hueRotate,
                    cinemaFilterSepia:       adj.sepia,
                    cinemaFilterGrayscale:   adj.grayscale,
                    cinemaFilterInvert:      adj.invert,
                    cinemaFilterBlur:        adj.blur,
                    cinemaFilterOpacity:     adj.opacity,
                    cinemaFilterDehaze:      adj.dehaze,
                    cinemaFilterClarity:     adj.clarity,
                    cinemaFilterGrain:       adj.grain,
                    cinemaFilterSharpness:   adj.sharpness,
                    cinemaFilterTemperature: adj.temperature,
                    cinemaFilterVibrance:    adj.vibrance,
                    cinemaFilterHighlights:  adj.highlights,
                    cinemaFilterShadows:     adj.shadows,
                    cinemaFilterVignette:    adj.vignette,
                };
                
                if (window.YPP?.MainApp?.saveSettings) {
                    window.YPP.MainApp.saveSettings(newSettings);
                } else if (chrome?.storage?.local) {
                    // Fallback for external sites without MainApp
                    chrome.storage.local.get('settings').then(data => {
                        const updated = { ...(data.settings || {}), ...newSettings };
                        chrome.storage.local.set({ settings: updated });
                    }).catch(() => {});
                }
            }, 300);
        }
        this._debouncedFilterSave(ctx);
    }
    static createFilterPanel(ctx, video, btn) {
        this._injectStyles();
        
        const panel = this._buildContainer(btn);
        const header = this._buildHeader(ctx, video);
        
        const tabsWrap = document.createElement('div');
        tabsWrap.style.cssText = 'display:flex;border-bottom:1px solid rgba(255,255,255,0.1);flex-shrink:0;';
        
        const tabFiltersBtn = document.createElement('button');
        tabFiltersBtn.className = 'ypp-cinema-tab-btn active';
        tabFiltersBtn.textContent = 'Presets';
        
        const tabAdjustBtn = document.createElement('button');
        tabAdjustBtn.className = 'ypp-cinema-tab-btn';
        tabAdjustBtn.textContent = 'Adjustments';

        tabsWrap.append(tabFiltersBtn, tabAdjustBtn);

        const tabContent = document.createElement('div');
        tabContent.className = 'ypp-cinema-scroll';
        Object.assign(tabContent.style, {
            padding: '0', flex: '1 1 0%', minHeight: '0', overflowY: 'auto', overflowX: 'hidden',
            background: 'transparent', scrollbarWidth: 'thin', position: 'relative'
        });

        const presetsContent = this.buildPresetsTab(ctx, video, btn);
        const adjustContent  = this.buildAdjustTab(ctx, video);

        const fadeWrap = (el) => { el.style.cssText += ';transition:opacity 0.18s ease;'; return el; };
        fadeWrap(presetsContent);
        fadeWrap(adjustContent);
        
        adjustContent.style.display = 'none';
        adjustContent.style.opacity = '0';
        presetsContent.style.opacity = '1';

        this._setupTabSwitching(tabFiltersBtn, tabAdjustBtn, presetsContent, adjustContent);
        tabContent.append(presetsContent, adjustContent);

        const footer = this._buildFooter(ctx, video, btn);

        panel.append(header, tabsWrap, tabContent, footer);
        this._mountPanel(panel, btn);
        ctx._filterPanel = panel;

        this._attachEventListeners(ctx, btn);
    }

    static _injectStyles() {
        const existing = document.getElementById('ypp-cinema-styles');
        if (existing) existing.remove();
        const style = document.createElement('style');
        style.id = 'ypp-cinema-styles';
        style.textContent = `
            @keyframes ypp-panel-glass-in { from { opacity: 0; transform: translateY(-16px) scale(calc(0.94 * var(--ypp-auto-scale, 1))); } to { opacity: 1; transform: translateY(0) scale(var(--ypp-auto-scale, 1)); } }
            @keyframes ypp-panel-scale-in { from { opacity: 0; transform: scale(calc(0.92 * var(--ypp-auto-scale, 1))); } to { opacity: 1; transform: scale(var(--ypp-auto-scale, 1)); } }
            @keyframes ypp-card-enter { from { opacity: 0; transform: translateY(8px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes ypp-spin-glow { 100% { transform: rotate(360deg); } }

            /* Modern Tab Buttons */
            .ypp-cinema-tab-btn { flex: 1; padding: 6px 10px; background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600; cursor: pointer; position: relative; transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .ypp-cinema-tab-btn::after { content: ''; position: absolute; bottom: 0; left: 50%; width: 0%; height: 2px; background: #fff; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform: translateX(-50%); border-radius: 2px 2px 0 0; }
            .ypp-cinema-tab-btn:hover { color: rgba(255,255,255,0.8); background: linear-gradient(to top, rgba(255,255,255,0.05), transparent); }
            .ypp-cinema-tab-btn.active { color: #fff; }
            .ypp-cinema-tab-btn.active::after { width: 100%; }

            /* Advanced Glassmorphism Category Header */
            .ypp-filter-cat-details summary { list-style: none; padding: 6px 10px; cursor: pointer; font-size: 10.5px; font-weight: 600; background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); color: rgba(255,255,255,0.9); border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; transition: all 0.25s ease; backdrop-filter: blur(8px); }
            .ypp-filter-cat-details summary::-webkit-details-marker { display: none; }
            .ypp-filter-cat-details summary:hover { background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)); color: #fff; padding-left: 14px; }
            .ypp-filter-cat-details summary::after { content: '▼'; font-size: 9px; opacity: 0.5; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
            .ypp-filter-cat-details[open] summary::after { transform: rotate(180deg); opacity: 1; }
            
            /* Premium Hover Lift Cards - 5 Columns for high density */
            .ypp-filter-card-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; padding: 4px 6px; }
            .ypp-filter-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 4px 2px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); text-align: center; position: relative; gap: 2px; overflow: hidden; animation: ypp-card-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
            .ypp-filter-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); border-color: rgba(255,255,255,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1); }
            
            /* Active State with dynamic conic border */
            .ypp-filter-card.active { background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05)); border-color: transparent; box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 6px rgba(255,255,255,0.1); }
            .ypp-filter-card.active::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent, rgba(255,255,255,0.4), transparent 30%); animation: ypp-spin-glow 4s linear infinite; pointer-events: none; z-index: 0; opacity: 0.8; }
            .ypp-filter-card.active::after { content: ''; position: absolute; inset: 1px; background: rgba(20, 20, 22, 0.95); border-radius: 7px; z-index: 1; }
            .ypp-filter-card > * { position: relative; z-index: 2; }

            .ypp-filter-lut-preview { width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 2px 8px rgba(0,0,0,0.4); transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
            .ypp-filter-card:hover .ypp-filter-lut-preview { transform: scale(1.15) rotate(2deg); border-color: rgba(255,255,255,0.5); }
            
            .ypp-star-btn { position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.5); border: none; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0.8); transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; padding: 0; backdrop-filter: blur(4px); }
            .ypp-filter-card:hover .ypp-star-btn, .ypp-star-btn[data-fav="true"] { opacity: 1; transform: scale(1); }
            .ypp-star-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.15) !important; }

            .ypp-card-check { position: absolute; top: -3px; left: -3px; background: #fff; color: #000; width: 13px; height: 13px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.5); z-index: 3; }

            /* Search Input */
            .ypp-vcp-search-wrap { position: relative; display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0 10px; transition: all 0.3s ease; box-shadow: inset 0 2px 6px rgba(0,0,0,0.2); margin: 6px 10px !important; }
            .ypp-vcp-search-wrap:focus-within { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); box-shadow: 0 0 0 3px rgba(255,255,255,0.05), inset 0 2px 4px rgba(0,0,0,0.1); }
            .ypp-vcp-search-input { width: 100%; background: transparent; border: none; color: #fff; padding: 6px 0 6px 6px; font-size: 11px; font-family: inherit; outline: none; }
            .ypp-vcp-search-input::placeholder { color: rgba(255,255,255,0.4); font-weight: 500; }
            .ypp-vcp-search-icon { color: rgba(255,255,255,0.5); display: flex; transition: color 0.3s; transform: scale(0.85); }
            .ypp-vcp-search-wrap:focus-within .ypp-vcp-search-icon { color: #fff; }

            /* Adjustments Grid */
            .ypp-adjust-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; padding: 8px; }
            .ypp-adjust-card { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s, border-color 0.3s; box-shadow: 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
            .ypp-adjust-card:hover { background: rgba(0, 0, 0, 0.45); transform: translateY(-2px); border-color: rgba(255, 255, 255, 0.35); box-shadow: 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2); }
            .ypp-adjust-card-header { display: flex; justify-content: space-between; align-items: center; }
            .ypp-adjust-card-title { display: flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.9); }
            .ypp-adjust-card-val { font-size: 9.5px; font-weight: 700; color: #fff; background: rgba(255,255,255,0.1); padding: 1px 5px; border-radius: 6px; letter-spacing: 0.5px; }
            
            /* Enhanced Sliders */
            .ypp-vcp-slider { -webkit-appearance: none; width: 100%; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.15); outline: none; margin: 6px 0; position: relative; }
            .ypp-vcp-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 10px; height: 10px; border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.5); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid #1a1a1c; }
            .ypp-vcp-slider::-webkit-slider-thumb:hover { transform: scale(1.3); }
            .ypp-vcp-slider:active::-webkit-slider-thumb { transform: scale(1.1); background: #f0f0f0; }

            /* Custom Sleek Scrollbar */
            .ypp-cinema-scroll::-webkit-scrollbar { width: 5px; }
            .ypp-cinema-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.15); }
            .ypp-cinema-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.25); border-radius: 3px; }
            .ypp-cinema-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.45); }
        `;
        document.head.appendChild(style);
    }

    static _buildContainer(btn) {
        const panel = document.createElement('div');
        panel.id = 'ypp-cinema-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '56px', right: '24px', left: 'auto', bottom: 'auto', height: 'calc(100vh - 72px)', maxHeight: 'calc(100vh - 72px)', width: '430px',
            backgroundColor: 'rgba(18, 18, 20, 0.65)',
            backgroundImage: 'radial-gradient(ellipse 80% 60% at 0% 0%, color-mix(in srgb, var(--accent-primary, #3ea6ff) 25%, transparent) 0%, transparent 70%), radial-gradient(ellipse 70% 60% at 100% 100%, color-mix(in srgb, var(--accent-secondary, #ff416c) 20%, transparent) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 50% 50%, color-mix(in srgb, var(--accent-secondary, #ff416c) 5%, transparent) 0%, transparent 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)', borderTop: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '14px',
            zIndex: '2147483646', color: '#fff', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(64px) saturate(180%)', WebkitBackdropFilter: 'blur(64px) saturate(180%)',
            overflow: 'hidden', userSelect: 'none', display: 'flex', flexDirection: 'column',
            animation: 'ypp-panel-glass-in 0.3s cubic-bezier(0.2, 0, 0, 1) forwards'
        });


        return panel;
    }

    static _buildHeader(ctx, video) {
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex', alignItems: 'center', padding: '6px 12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '12px', fontWeight: '600', flexShrink: '0'
        });
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-right: auto;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
                Cinematic Filters
            </div>
            <div id="ypp-header-actions" style="display: flex; align-items: center; gap: 8px;"></div>
        `;

        const compareBtn = document.createElement('div');
        compareBtn.className = `ypp-vcp-compare-toggle ${ctx.isComparing ? 'active' : ''}`;
        compareBtn.innerHTML = `A/B`;
        compareBtn.onclick = (e) => {
            e.stopPropagation();
            ctx.isComparing = !ctx.isComparing;
            compareBtn.className = `ypp-vcp-compare-toggle ${ctx.isComparing ? 'active' : ''}`;
            ctx._applyComputedFilter(video);
        };
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
        Object.assign(closeBtn.style, { background: 'transparent', border: 'none', color: '#f1f1f1', cursor: 'pointer', padding: '0', display: 'flex' });
        closeBtn.onclick = () => ctx._removeFilterPanel();

        header.querySelector('#ypp-header-actions').append(compareBtn, closeBtn);
        return header;
    }

    static _setupTabSwitching(tab1, tab2, content1, content2) {
        let tabTransitionTimeout;
        const switchTab = (show, hide, activeBtn, inactiveBtn) => {
            if (activeBtn.classList.contains('active')) return;
            inactiveBtn.classList.remove('active');
            activeBtn.classList.add('active');
            hide.style.opacity = '0';
            clearTimeout(tabTransitionTimeout);
            tabTransitionTimeout = setTimeout(() => {
                hide.style.display = 'none';
                show.style.display = 'block';
                requestAnimationFrame(() => requestAnimationFrame(() => show.style.opacity = '1'));
            }, 180);
        };
        tab1.onclick = () => switchTab(content1, content2, tab1, tab2);
        tab2.onclick = () => switchTab(content2, content1, tab2, tab1);
    }

    static _buildFooter(ctx, video, btn) {
        const footer = document.createElement('div');
        Object.assign(footer.style, { padding: '6px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: '0' });

        const activeFilterName = window.YPP?.features?.VideoFiltersPresets?.FILTERS?.[ctx.currentFilterIndex]?.name || 'Normal';
        const activePill = document.createElement('div');
        activePill.id = 'ypp-active-filter-name';
        Object.assign(activePill.style, { fontSize: '10.5px', color: '#aaaaaa' });
        activePill.textContent = activeFilterName;
        
        const resetBtn = document.createElement('button');
        resetBtn.innerHTML = `<span>Reset All</span>`;
        Object.assign(resetBtn.style, { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', borderRadius: '12px', cursor: 'pointer', fontSize: '10.5px', fontWeight: '500', padding: '4px 8px' });
        resetBtn.onmouseenter = () => resetBtn.style.background = 'rgba(255,255,255,0.2)';
        resetBtn.onmouseleave = () => resetBtn.style.background = 'rgba(255,255,255,0.1)';
        
        resetBtn.onclick = () => {
            ctx.currentFilterIndex = 0;
            ctx.filterIntensity = 100;
            ctx.filterAdjustments = { brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, sepia: 0, grayscale: 0, invert: 0, blur: 0, opacity: 100, dehaze: 0, clarity: 0, grain: 0, sharpness: 0, temperature: 0, vibrance: 100, highlights: 0, shadows: 0, vignette: 0 };
            ctx._applyComputedFilter(video);
            this.saveFilterSettings(ctx);
            if (btn) { btn.classList.remove('active'); btn.title = 'Cinema Filters'; }
            ctx._removeFilterPanel();
            this.createFilterPanel(ctx, video, btn);
        };
        
        footer.append(activePill, resetBtn);
        return footer;
    }

    static _mountPanel(panel, btn) {
        if (btn?.closest?.('.ypp-global-player-bar')) {
            const dlg = window.YPP.Utils.getPopupPortal();
            panel.style.pointerEvents = 'auto';
            const bar = btn.closest('.ypp-global-player-bar');
            panel.style.bottom = 'auto';
            const panelHeight = Math.min(620, window.innerHeight - 200);
            const topPx = Math.max(76, Math.floor((window.innerHeight - panelHeight) / 2));
            if (bar.classList.contains('ypp-bar-pos-right')) {
                panel.style.right = '76px';
                panel.style.left = 'auto';
                panel.style.top = topPx + 'px';
            } else if (bar.classList.contains('ypp-bar-pos-left')) {
                panel.style.left = '76px';
                panel.style.right = 'auto';
                panel.style.top = topPx + 'px';
            } else if (bar.classList.contains('ypp-bar-pos-top')) {
                panel.style.top = '56px';
                panel.style.right = '24px';
                panel.style.left = 'auto';
            } else {
                panel.style.right = '76px';
                panel.style.left = 'auto';
                panel.style.top = topPx + 'px';
            }
            if (window.self !== window.top) {
                panel.style.right = '32px';
                panel.style.left = 'auto';
            }
            dlg.appendChild(panel);
        } else {
            document.body.appendChild(panel);
            Object.assign(panel.style, {
                position: 'fixed',
                top: '56px',
                right: '24px',
                left: 'auto',
                bottom: 'auto',
                height: 'calc(100vh - 72px)',
                maxHeight: 'calc(100vh - 72px)',
                zIndex: '2147483646'
            });
        }
        if (window.YPP?.Utils?.makePopupZoomInvariant) {
            window.YPP.Utils.makePopupZoomInvariant(panel);
        }
    }

    static _attachEventListeners(ctx, btn) {
        const outside = (e) => {
            if (ctx._filterPanel && !ctx._filterPanel.contains(e.target) && !btn?.contains(e.target)) {
                ctx._removeFilterPanel();
            }
        };
        ctx._filterPanelOutsideHandler = outside;
        setTimeout(() => ctx.addListener ? ctx.addListener(document, 'click', outside) : document.addEventListener('click', outside), 0);

        const onKeyDown = (e) => {
            if (e.key === 'Escape' && ctx._filterPanel) {
                ctx._removeFilterPanel();
            }
        };
        ctx._filterPanelKeydownHandler = onKeyDown;
        if (ctx.addListener) ctx.addListener(document, 'keydown', onKeyDown);
        else document.addEventListener('keydown', onKeyDown);
    }

    static buildPresetsTab(ctx, video, btn) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;min-height:0;';

        // ── Favorites (localStorage)
        const FAV_KEY  = 'ypp-fav-filters';
        const loadFavs = () => { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; } };
        let currentFavs = loadFavs();
        const saveFavs = (arr) => {
            try {
                localStorage.setItem(FAV_KEY, JSON.stringify(arr));
            } catch(e) {
                window.YPP.Utils.log('Failed to save favorite filters', 'VIDEO-FILTERS', 'warn', e);
            }
        };
        const toggleFav = (idx) => {
            const pos = currentFavs.indexOf(idx);
            pos === -1 ? currentFavs.push(idx) : currentFavs.splice(pos, 1);
            saveFavs(currentFavs);
        };

        // ── Search bar
        const searchWrap = document.createElement('div');
        searchWrap.className = 'ypp-vcp-search-wrap';
        Object.assign(searchWrap.style, { margin: '12px 14px', marginBottom: '6px' });
        searchWrap.innerHTML = `
            <span class="ypp-vcp-search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></span>
            <input type="text" class="ypp-vcp-search-input" placeholder="Search presets (e.g. Night Vision)...">
        `;
        const searchInput = searchWrap.querySelector('input');
        wrap.appendChild(searchWrap);

        const listContainer = document.createElement('div');
        wrap.appendChild(listContainer);

        const starFilled  = `<svg width="11" height="11" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
        const starOutline = `<svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zm-10 6.93l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.81 4.38.38-3.32 2.88 1 4.28L12 16.17z"/></svg>`;


        // ── Build a single filter card
        const buildCard = (filter, index) => {
            const card = document.createElement('div');
            const isActive = ctx.currentFilterIndex === index;
            const isFav    = currentFavs.includes(index);
            card.className = `ypp-filter-card ${isActive ? 'active' : ''}`;
            card.title = filter.name;
            card.style.animationDelay = `${Math.min((index % 20) * 30, 500)}ms`;
            
            const cssFilter = filter.css === 'none' ? 'grayscale(0%)' : filter.css;
            const previewBg = filter.preview ? filter.preview : 'linear-gradient(135deg, #ff4b4b, #4b6fff, #4bff8b)';
            
            card.innerHTML = `
                <div class="ypp-filter-lut-preview" style="background:${previewBg}; filter:${cssFilter}"></div>
                <span style="font-size:8.5px;font-weight:600;color:${isActive ? '#fff' : 'rgba(255,255,255,0.8)'};flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;letter-spacing:0px;">${filter.name}</span>
                ${isActive ? '<div class="ypp-card-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div>' : ''}
                <button class="ypp-star-btn" title="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}" data-fav="${isFav}">${isFav ? starFilled : starOutline}</button>
            `;
            const starBtn = card.querySelector('.ypp-star-btn');
            starBtn.onclick = (e) => {
                e.stopPropagation();
                toggleFav(index);
                renderFilteredList(searchInput.value);
            };
            card.onclick = (e) => {
                if (e.target.closest('.ypp-star-btn')) return;
                e.stopPropagation();
                // Clear preview state FIRST — prevents mouseleave from reverting this commit
                ctx._previewFilterIndex = undefined;
                ctx.currentFilterIndex = index;
                ctx._applyComputedFilter(video);
                VideoFiltersUI.saveFilterSettings(ctx);
                if (btn) { index > 0 ? btn.classList.add('active') : btn.classList.remove('active'); }
                ctx._showToast(video, `✨ ${filter.name}`);
                const pill = ctx._filterPanel?.querySelector('#ypp-active-filter-name');
                if (pill) pill.textContent = filter.name;
                listContainer.querySelectorAll('.ypp-filter-card').forEach(c => {
                    c.classList.remove('active');
                    const sp = c.querySelector('span'); if (sp) sp.style.color = 'rgba(255,255,255,0.8)';
                    const chk = c.querySelector('.ypp-card-check'); if (chk) chk.remove();
                });
                card.classList.add('active');
                const sp = card.querySelector('span'); if (sp) sp.style.color = '#fff';
                if (!card.querySelector('.ypp-card-check')) {
                    starBtn.insertAdjacentHTML('beforebegin', '<div class="ypp-card-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div>');
                }
            };
            card.onmouseenter = () => {
                if (ctx.currentFilterIndex === index) return;
                ctx._previewFilterIndex = ctx.currentFilterIndex;
                ctx.currentFilterIndex = index;
                ctx._applyComputedFilter(video);
            };
            card.onmouseleave = () => {
                if (ctx._previewFilterIndex === undefined) return;
                ctx.currentFilterIndex = ctx._previewFilterIndex;
                ctx._previewFilterIndex = undefined;
                ctx._applyComputedFilter(video);
            };
            return card;
        };

        // ── Build a <details> category block
        const buildCategory = (cat, items, open = false) => {
            const details = document.createElement('details');
            details.className = 'ypp-filter-cat-details';
            if (open) details.open = true;
            const summary = document.createElement('summary');
            summary.innerHTML = cat === '⭐ Favorites'
                ? `<span style="display:flex;align-items:center;gap:8px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>${cat}</span>`
                : cat;
            details.appendChild(summary);
            const grid = document.createElement('div');
            grid.className = 'ypp-filter-card-grid';
            items.forEach(({ filter, index }) => grid.appendChild(buildCard(filter, index)));
            details.appendChild(grid);
            return details;
        };

        // ── Main render
        const renderFilteredList = (query = '') => {
            listContainer.innerHTML = '';
            const q = query.toLowerCase();
            const FILTERS = window.YPP?.features?.VideoFiltersPresets?.FILTERS || [];

            // Favorites at top — always open, only shown without search
            if (!query && currentFavs.length > 0) {
                const favItems = currentFavs.filter(i => FILTERS[i]).map(i => ({ filter: FILTERS[i], index: i }));
                if (favItems.length) listContainer.appendChild(buildCategory('⭐ Favorites', favItems, true));
            }

            // Category groups — closed by default; open only when searching
            const groups = {};
            FILTERS.forEach((filter, index) => {
                if (q && !filter.name.toLowerCase().includes(q) && !filter.category.toLowerCase().includes(q)) return;
                const cat = filter.category || 'Other';
                if (!groups[cat]) groups[cat] = [];
                groups[cat].push({ filter, index });
            });
            Object.keys(groups).forEach(cat => {
                listContainer.appendChild(buildCategory(cat, groups[cat], !!query));
            });

            if (query && Object.keys(groups).length === 0) {
                const empty = document.createElement('div');
                empty.style.cssText = 'padding:40px 20px;text-align:center;color:rgba(255,255,255,0.3);font-size:13px;font-style:italic;';
                empty.textContent = 'No filters matching your search...';
                listContainer.appendChild(empty);
            }
        };

        searchInput.oninput = (e) => renderFilteredList(e.target.value);
        renderFilteredList();

        // Star button styles (once)
        this._injectStyle('ypp-star-btn-style', `
            .ypp-star-btn{background:transparent;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:50%;width:20px;height:20px;opacity:0;transition:opacity 0.15s,transform 0.15s;transform:scale(0.85);}
            .ypp-filter-card:hover .ypp-star-btn,.ypp-star-btn[data-fav="true"]{opacity:1;transform:scale(1);}
            .ypp-star-btn:hover{background:rgba(255,215,0,0.12);transform:scale(1.15)!important;}
            .ypp-card-check{background:#fff;color:#000;border-radius:50%;width:14px;height:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        `);

        return wrap;
    }


    static buildAdjustTab(ctx, video) {
        const wrap = document.createElement('div');
        Object.assign(wrap.style, { padding: '8px 0' });

        const intensitySection = document.createElement('div');
        intensitySection.className = 'ypp-intensity-section';
        Object.assign(intensitySection.style, {
            padding: '10px 16px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)'
        });
        const intHeader = document.createElement('div');
        Object.assign(intHeader.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '8px'
        });
        intHeader.innerHTML = `
            <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);display:flex;align-items:center;gap:6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Global Intensity
            </span>
            <span id="ypp-int-val" style="color:#ffffff;font-weight:800;font-size:11px;background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:20px;">${ctx.filterIntensity}%</span>
        `;
        intensitySection.appendChild(intHeader);
        const intSlider = document.createElement('input');
        intSlider.type = 'range';
        intSlider.className = 'ypp-vcp-slider';
        intSlider.min = '0';
        intSlider.max = '100';
        intSlider.value = ctx.filterIntensity !== undefined ? ctx.filterIntensity : 100;
        intSlider.style.cssText = 'width:100%;-webkit-appearance:none;height:4px;border-radius:4px;background:rgba(255,255,255,0.15);outline:none;cursor:pointer;';
        intSlider.oninput = (e) => {
            ctx.filterIntensity = Number(e.target.value);
            intensitySection.querySelector('#ypp-int-val').textContent = ctx.filterIntensity + '%';
            ctx._applyComputedFilter(video);
            VideoFiltersUI.saveFilterSettings(ctx);
        };
        intensitySection.appendChild(intSlider);
        wrap.appendChild(intensitySection);

        // Core Adjustments — SVG icons, no emojis
        const SVG = {
            brightness: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>`,
            contrast:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/></svg>`,
            saturate:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
            hueRotate:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
            dehaze:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`,
            clarity:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
            sharpness:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>`,
            grain:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM11 7h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm-4-8h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm8-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z"/></svg>`,
            sepia:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5S15.01 22 17.5 22s4.5-2.01 4.5-4.5S19.99 13 17.5 13zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>`,
            grayscale:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/></svg>`,
            invert:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 1L1 11l10 10L21 11 11 1zm0 17.17L3.83 11 11 3.83V18.17z"/></svg>`,
            blur:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 5.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-7c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3-6c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>`,
            opacity:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
            temperature:`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-3 7c-1.65 0-3-1.35-3-3 0-1.3.84-2.4 2-2.82V5c0-.55.45-1 1-1s1 .45 1 1v9.18c1.16.42 2 1.52 2 2.82 0 1.65-1.35 3-3 3z"/></svg>`,
            vibrance:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`,
            highlights: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>`,
            shadows:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 21h20L12 3zm0 3.99L19.53 19H4.47L12 6.99z"/></svg>`,
            vignette:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>`
        };
        const configs = [
            { id: 'brightness',  label: 'Brightness',  svgKey: 'brightness',  min: 0,   max: 200, def: 100, unit: '%' },
            { id: 'contrast',    label: 'Contrast',    svgKey: 'contrast',    min: 0,   max: 200, def: 100, unit: '%' },
            { id: 'saturate',    label: 'Saturation',  svgKey: 'saturate',    min: 0,   max: 300, def: 100, unit: '%' },
            { id: 'temperature', label: 'Temperature', svgKey: 'temperature', min: -100,max: 100, def: 0,   unit: 'K' },
            { id: 'vibrance',    label: 'Vibrance',    svgKey: 'vibrance',    min: 0,   max: 200, def: 100, unit: '%' },
            { id: 'highlights',  label: 'Highlights',  svgKey: 'highlights',  min: -100,max: 100, def: 0,   unit: '%' },
            { id: 'shadows',     label: 'Shadows',     svgKey: 'shadows',     min: -100,max: 100, def: 0,   unit: '%' },
            { id: 'hueRotate',   label: 'Hue Rotate',  svgKey: 'hueRotate',   min: 0,   max: 360, def: 0,   unit: '°' },
            { id: 'dehaze',      label: 'Dehaze',      svgKey: 'dehaze',      min: 0,   max: 100, def: 0,   unit: '%' },
            { id: 'clarity',     label: 'Clarity',     svgKey: 'clarity',     min: 0,   max: 100, def: 0,   unit: '%' },
            { id: 'sharpness',   label: 'Sharpness',   svgKey: 'sharpness',   min: 0,   max: 100, def: 0,   unit: '%' },
            { id: 'vignette',    label: 'Vignette',    svgKey: 'vignette',    min: 0,   max: 100, def: 0,   unit: '%' },
            { id: 'grain',       label: 'Film Grain',  svgKey: 'grain',       min: 0,   max: 100, def: 0,   unit: '%' },
            { id: 'sepia',       label: 'Sepia',       svgKey: 'sepia',       min: 0,   max: 100, def: 0,   unit: '%' },
            { id: 'grayscale',   label: 'Grayscale',   svgKey: 'grayscale',   min: 0,   max: 100, def: 0,   unit: '%' },
            { id: 'invert',      label: 'Invert',      svgKey: 'invert',      min: 0,   max: 100, def: 0,   unit: '%' },
            { id: 'blur',        label: 'Blur',        svgKey: 'blur',        min: 0,   max: 20,  def: 0,   unit: 'px' },
            { id: 'opacity',     label: 'Opacity',     svgKey: 'opacity',     min: 0,   max: 100, def: 100, unit: '%' }
        ];
        // Ensure new adjustment keys are initialized
        ['temperature','vibrance','highlights','shadows','vignette'].forEach(k => {
            if (ctx.filterAdjustments[k] === undefined) {
                ctx.filterAdjustments[k] = (k === 'vibrance') ? 100 : 0;
            }
        });

        const grid = document.createElement('div');
        grid.className = 'ypp-adjust-grid';

        configs.forEach(cfg => {
            const card = document.createElement('div');
            card.className = 'ypp-adjust-card';

            const headerRow = document.createElement('div');
            headerRow.className = 'ypp-adjust-card-header';

            const title = document.createElement('div');
            title.className = 'ypp-adjust-card-title';
            title.innerHTML = `<span style="opacity:0.7;display:flex;">${SVG[cfg.svgKey] || ''}</span><span>${cfg.label}</span>`;

            const valWrap = document.createElement('div');
            valWrap.style.display = 'flex';
            valWrap.style.alignItems = 'center';
            valWrap.style.gap = '6px';

            const currentValue = ctx.filterAdjustments[cfg.id] !== undefined ? ctx.filterAdjustments[cfg.id] : cfg.def;

            const val = document.createElement('div');
            val.className = 'ypp-adjust-card-val';
            val.textContent = currentValue + cfg.unit;

            const resetBtn = document.createElement('button');
            resetBtn.innerHTML = '↺';
            Object.assign(resetBtn.style, {
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontSize: '14px', padding: '0 4px'
            });
            resetBtn.title = `Reset ${cfg.label}`;
            resetBtn.onclick = (e) => {
                e.stopPropagation();
                ctx.filterAdjustments[cfg.id] = cfg.def;
                slider.value = cfg.def;
                val.textContent = cfg.def + cfg.unit;
                ctx._applyComputedFilter(video);
                VideoFiltersUI.saveFilterSettings(ctx);
            };
            resetBtn.onmouseenter = () => resetBtn.style.color = '#fff';
            resetBtn.onmouseleave = () => resetBtn.style.color = 'rgba(255,255,255,0.5)';

            valWrap.appendChild(val);
            valWrap.appendChild(resetBtn);
            headerRow.appendChild(title);
            headerRow.appendChild(valWrap);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'ypp-vcp-slider';
            slider.min = cfg.min; slider.max = cfg.max;
            slider.value = currentValue;
            slider.oninput = (e) => {
                const v = Number(e.target.value);
                ctx.filterAdjustments[cfg.id] = v;
                val.textContent = v + cfg.unit;
                ctx._applyComputedFilter(video);
                VideoFiltersUI.saveFilterSettings(ctx);
            };

            card.appendChild(headerRow);
            card.appendChild(slider);
            grid.appendChild(card);
        });

        wrap.appendChild(grid);
        return wrap;
    }

    static _injectStyle(id, css) {
        if (!document.getElementById(id)) {
            const s = document.createElement('style');
            s.id = id;
            s.textContent = css;
            (document.head || document.documentElement).appendChild(s);
        }
    }
};

window.YPP.features.VideoFiltersUI = VideoFiltersUI;
