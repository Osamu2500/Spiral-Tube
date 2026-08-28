import { PresetsTabUI } from './ui/tab-presets.js';
import { AdjustTabUI } from './ui/tab-adjust.js';

export class VideoFiltersUI {
    static featureId = 'videoFiltersUI';
    static executionPhase = 'idle';
    static priority = 999;

    static PresetsTabUI = null;
    static AdjustTabUI = null;
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
                if (window.YPP?.featureManager?.getFeature('domainMemory')?.recordChange) {
                    window.YPP.featureManager.getFeature('domainMemory').recordChange('videoFilters');
                }
            }, 300);
        }
        this._debouncedFilterSave(ctx);
    }
    static createFilterPanel(ctx, video, btn) {
        try {
            ctx._removeFilterPanel();
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
        tabContent.id = 'ypp-cinema-scroll-container';
        Object.assign(tabContent.style, {
            padding: '0', flex: '1 1 0%', minHeight: '0', overflowY: 'auto', overflowX: 'hidden',
            background: 'transparent', scrollbarWidth: 'thin', position: 'relative'
        });

        const presetsContent = document.createElement('div');
        const adjustContent = document.createElement('div');

        // Build UI tabs natively
        presetsContent.appendChild(PresetsTabUI.build(ctx, video, btn));
        adjustContent.appendChild(AdjustTabUI.build(ctx, video));

        const fadeWrap = (el) => { el.style.cssText += ';transition:opacity 0.18s ease;'; return el; };
        fadeWrap(presetsContent);
        fadeWrap(adjustContent);
        
        adjustContent.style.display = 'none';
        adjustContent.style.opacity = '0';
        presetsContent.style.opacity = '1';

        this._setupTabSwitching(
            [tabFiltersBtn, tabAdjustBtn], 
            [presetsContent, adjustContent]
        );

        tabContent.append(presetsContent, adjustContent);
        
        // Prevent wheel events from bubbling to movie_player
        tabContent.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
        
        const footer = this._buildFooter(ctx, video, btn);

        panel.append(header, tabsWrap, tabContent, footer);
        this._mountPanel(panel, btn);
        ctx._filterPanel = panel;

        this._attachEventListeners(ctx, btn);
        } catch (error) {
            console.error('[YPP] VideoFiltersUI crash:', error);
        }
    }


    static _buildContainer(btn) {
        const panel = document.createElement('div');
        panel.id = 'ypp-cinema-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '56px', right: '24px', left: 'auto', bottom: '16px', width: '440px',
            backgroundColor: 'rgba(18, 18, 20, 0.65)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.04\'/%3E%3C/svg%3E"), radial-gradient(ellipse 80% 60% at 0% 0%, color-mix(in srgb, var(--accent-primary, #3ea6ff) 25%, transparent) 0%, transparent 70%), radial-gradient(ellipse 70% 60% at 100% 100%, color-mix(in srgb, var(--accent-secondary, #ff416c) 20%, transparent) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 50% 50%, color-mix(in srgb, var(--accent-secondary, #ff416c) 5%, transparent) 0%, transparent 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '14px',
            zIndex: '2147483646', color: '#fff', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
            backdropFilter: 'blur(72px) saturate(200%)', WebkitBackdropFilter: 'blur(72px) saturate(200%)',
            overflow: 'hidden', userSelect: 'none', display: 'flex', flexDirection: 'column',
            overscrollBehavior: 'contain',
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

        const compareBtn = document.createElement('button');
        compareBtn.className = `ypp-vcp-compare-toggle ${ctx.isComparing ? 'active' : ''}`;
        compareBtn.innerHTML = `A/B`;
        
        // Sync function exposed to context so both buttons can use it
        ctx._syncCompareUI = (val) => {
            compareBtn.className = `ypp-vcp-compare-toggle ${val ? 'active' : ''}`;
            const holdBtn = ctx._filterPanel?.querySelector('.ypp-adj-cp-compare-btn');
            if (holdBtn) {
                holdBtn.style.background = val ? 'rgba(62, 166, 255, 0.2)' : '';
                holdBtn.style.borderColor = val ? 'rgba(62, 166, 255, 0.4)' : '';
                holdBtn.style.color = val ? '#3ea6ff' : '';
            }
        };

        compareBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            ctx.isComparing = !ctx.isComparing;
            window.YPP?.Utils?.log(`A/B toggled to: ${ctx.isComparing}`, 'VideoFiltersUI');
            ctx._syncCompareUI(ctx.isComparing);
            ctx._applyComputedFilter(video);
        };
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
        Object.assign(closeBtn.style, { background: 'transparent', border: 'none', color: '#f1f1f1', cursor: 'pointer', padding: '0', display: 'flex' });
        closeBtn.onclick = () => ctx._removeFilterPanel();

        header.querySelector('#ypp-header-actions').append(compareBtn, closeBtn);
        return header;
    }

    static _setupTabSwitching(btns, contents) {
        btns.forEach((btn, i) => {
            btn.onclick = () => {
                if (btn.classList.contains('active')) return;
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                contents.forEach((content, j) => {
                    if (i === j) {
                        content.style.display = 'block';
                        content.offsetHeight;
                        content.style.opacity = '1';
                    } else {
                        content.style.opacity = '0';
                        setTimeout(() => {
                            if (!btns[j].classList.contains('active')) {
                                content.style.display = 'none';
                            }
                        }, 180);
                    }
                });
            };
        });
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
            panel.style.height = panelHeight + 'px';
            panel.style.maxHeight = panelHeight + 'px';
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
                bottom: '16px',
                height: 'auto',
                maxHeight: 'none',
                zIndex: '2147483646'
            });
        }
        if (window.YPP?.Utils?.makePopupZoomInvariant) {
            window.YPP.Utils.makePopupZoomInvariant(panel);
        }
    }

    static _attachEventListeners(ctx, btn) {
        const outside = (e) => {
            const path = e.composedPath ? e.composedPath() : [];
            if (ctx._filterPanel && !path.includes(ctx._filterPanel) && (!btn || !path.includes(btn))) {
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


};

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.VideoFiltersUI = VideoFiltersUI;
