/**
 * domain-memory-ui.js
 * ───────────────────
 * Glass 2.0 UI for the Domain Memory panel on external streaming sites.
 *
 * Improvements in this version:
 * - Bug 1 fix: Event listeners are cleaned up via ctx._removePanel (no more leaks)
 * - Bug 4 fix: Stats rows show filter name + intensity + EQ status
 * - UI 1: SVG scope tabs, close slide-out animation, favicon in header, last-saved row
 * - UI 3: Toast shows what was applied (vol%, filter name, speed)
 * - UI 4: Auto-remember toggle live-re-renders stat rows
 */

export class DomainMemoryUI {
    static featureId = 'domainMemoryUI';
    static executionPhase = 'idle';
    static priority = 999;

    static createPanel(ctx, video, btn) {
        this._injectStyles();
        
        const panel = document.createElement('div');
        panel.id = 'ypp-domain-panel';
        panel.className = 'ypp-glass-panel ypp-domain-panel-root';
        Object.assign(panel.style, {
            position: 'fixed',
            width: 'min(440px, calc(100vw - 32px))',
            backgroundColor: 'rgba(11, 12, 20, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '18px',
            zIndex: '2147483647',
            color: '#fff',
            fontFamily: 'Inter, -apple-system, sans-serif',
            boxShadow: '0 28px 72px rgba(0,0,0,0.75), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            overflow: 'hidden',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            animation: 'ypp-domain-panel-in 0.28s cubic-bezier(0.2, 0, 0, 1) forwards'
        });

        // Active profile: rainbow gradient border
        const isSeriesMode = ctx._scopeMode === 'series';
        if (ctx._domainProfile && ctx._isRemembering) {
            panel.style.borderColor = isSeriesMode
                ? 'rgba(167, 139, 250, 0.45)'
                : 'rgba(16, 185, 129, 0.45)';
            panel.style.boxShadow += isSeriesMode
                ? ', 0 0 0 1px rgba(167,139,250,0.15)'
                : ', 0 0 0 1px rgba(16,185,129,0.12)';
        }

        const header = this._buildHeader(ctx);
        const body = this._buildBody(ctx, video);
        const footer = this._buildFooter(ctx, video, panel);

        panel.append(header, body, footer);

        this._mountPanel(panel, btn);
        ctx._domainPanel = panel;
        this._attachEventListeners(ctx, btn);
    }

    static _injectStyles() {
        if (document.getElementById('ypp-domain-memory-styles')) return;
        const style = document.createElement('style');
        style.id = 'ypp-domain-memory-styles';
        style.textContent = `
            @keyframes ypp-domain-panel-in {
                from { opacity: 0; transform: translateY(8px) scale(0.97); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes ypp-domain-panel-out {
                from { opacity: 1; transform: translateY(0) scale(1); }
                to   { opacity: 0; transform: translateY(8px) scale(0.97); }
            }
            .ypp-domain-pill-btn {
                position: relative !important;
            }
            .ypp-domain-scope-label {
                font-size: 9px;
                font-weight: 800;
                letter-spacing: 0.5px;
                line-height: 1;
                margin-top: 1px;
            }
            .ypp-domain-badge-indicator {
                position: absolute;
                top: 4px;
                right: 4px;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.35);
                transition: background 0.3s ease, box-shadow 0.3s ease;
            }
            .ypp-domain-active .ypp-domain-badge-indicator {
                background: #10b981 !important;
                box-shadow: 0 0 10px #10b981, 0 0 4px #fff !important;
            }
            .ypp-domain-scope-toggle {
                display: grid;
                grid-template-columns: 1fr 1fr;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 3px;
                margin-bottom: 12px;
                gap: 3px;
            }
            .ypp-scope-tab {
                border: none;
                background: transparent;
                color: rgba(255, 255, 255, 0.55);
                font-size: 11px;
                font-weight: 600;
                padding: 7px 10px;
                border-radius: 9px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                letter-spacing: 0.2px;
            }
            .ypp-scope-tab.active-domain {
                background: rgba(16, 185, 129, 0.2);
                color: #6ee7b7;
                border: 1px solid rgba(16, 185, 129, 0.4);
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
            }
            .ypp-scope-tab.active-series {
                background: rgba(167, 139, 250, 0.2);
                color: #c4b5fd;
                border: 1px solid rgba(167, 139, 250, 0.4);
                box-shadow: 0 2px 8px rgba(167, 139, 250, 0.25);
            }
            .ypp-scope-tab.active-host {
                background: rgba(245, 158, 11, 0.2);
                color: #fcd34d;
                border: 1px solid rgba(245, 158, 11, 0.4);
                box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
            }
            .ypp-scope-tab:hover:not(.active-domain):not(.active-series):not(.active-host) {
                background: rgba(255, 255, 255, 0.08);
                color: #fff;
            }
            .ypp-domain-stat-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.07);
                border-radius: 10px;
                margin-bottom: 6px;
                transition: background 0.2s;
            }
            .ypp-domain-stat-row:hover {
                background: rgba(255, 255, 255, 0.07);
            }
            .ypp-domain-stat-label {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.65);
                display: flex;
                align-items: center;
                gap: 7px;
            }
            .ypp-domain-stat-value {
                font-size: 11px;
                font-weight: 700;
                color: #fff;
                background: rgba(255, 255, 255, 0.1);
                padding: 3px 10px;
                border-radius: 20px;
                max-width: 180px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .ypp-domain-stat-value.active {
                background: rgba(16, 185, 129, 0.18);
                color: #6ee7b7;
            }
            .ypp-domain-stat-value.active-series {
                background: rgba(167, 139, 250, 0.18);
                color: #c4b5fd;
            }
            .ypp-domain-stat-value.active-host {
                background: rgba(245, 158, 11, 0.18);
                color: #fcd34d;
            }
            .ypp-domain-switch-wrap {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 11px 13px;
                background: rgba(59, 130, 246, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 12px;
                margin-bottom: 10px;
            }
            .ypp-domain-btn-action {
                width: 100%;
                padding: 9px 14px;
                background: rgba(255, 255, 255, 0.07);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: #fff;
                font-size: 11.5px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.18s ease;
                margin-bottom: 5px;
                letter-spacing: 0.2px;
            }
            .ypp-domain-btn-action:hover {
                background: rgba(255, 255, 255, 0.14);
                border-color: rgba(255, 255, 255, 0.25);
                transform: translateY(-1px);
            }
            .ypp-domain-btn-action:active {
                transform: translateY(0);
            }
            .ypp-domain-btn-primary {
                background: linear-gradient(135deg, rgba(59,130,246,0.85), rgba(99,102,241,0.85));
                border-color: rgba(255, 255, 255, 0.2);
                box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
            }
            .ypp-domain-btn-primary:hover {
                background: linear-gradient(135deg, rgba(96,165,250,0.9), rgba(129,140,248,0.9));
                box-shadow: 0 6px 20px rgba(79, 70, 229, 0.55);
            }
            .ypp-domain-btn-danger {
                color: #fca5a5;
                background: rgba(239, 68, 68, 0.1);
                border-color: rgba(239, 68, 68, 0.22);
            }
            .ypp-domain-btn-danger:hover {
                background: rgba(239, 68, 68, 0.2);
                border-color: rgba(239, 68, 68, 0.42);
                color: #fecaca;
            }
            .ypp-domain-btn-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5px;
            }
            .ypp-domain-last-saved {
                font-size: 10px;
                color: rgba(255, 255, 255, 0.35);
                text-align: center;
                padding: 4px 0 0 0;
                letter-spacing: 0.2px;
            }
            .ypp-domain-section-label {
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.8px;
                text-transform: uppercase;
                color: rgba(255,255,255,0.35);
                margin-bottom: 7px;
                padding: 0 2px;
            }
        `;
        document.head.appendChild(style);
    }

    static _buildHeader(ctx) {
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '13px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '13px',
            fontWeight: '700'
        });

        const isSeriesMode = ctx._scopeMode === 'series';
        const isHostMode = ctx._scopeMode === 'host';
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(ctx._domain)}&sz=32`;
        const accentColor = isHostMode ? '#fcd34d' : (isSeriesMode ? '#a78bfa' : '#10b981');
        const savedName = ctx._domainProfile?.name;
        const defaultTitle = isHostMode ? 'Server Profile' : (isSeriesMode ? 'Series Profile' : `${ctx._domain}`);
        const titleLabel = savedName ? savedName : defaultTitle;

        const video = ctx._getVideo();
        const activeHost = video?._capabilities?.host || ctx._domain;
        
        let subtext = isHostMode ? `Server: ${activeHost}` : (isSeriesMode ? 'Series-level profile' : 'Site-wide profile');
        
        // Advanced Domain Memory System: Display matched rule
        if (ctx._activeMatchedType && ctx._activeMatchedType !== 'New') {
            let displayKey = ctx._activeMatchedKey;
            if (displayKey && displayKey.length > 30) displayKey = displayKey.substring(0, 27) + '...';
            
            if (ctx._activeMatchedType === 'Exact URL Match') {
                subtext = `Rule: Exact URL Match`;
            } else if (ctx._activeMatchedType === 'Wildcard Match') {
                subtext = `Rule: Wildcard (${displayKey})`;
            } else if (ctx._activeMatchedType === 'Series') {
                subtext = `Rule: Series Path`;
            } else if (ctx._activeMatchedType === 'Domain') {
                subtext = `Rule: Site-wide`;
            }
        } else if (ctx._activeMatchedType === 'New') {
            subtext = `Unsaved profile (${isSeriesMode ? 'Series' : 'Site-wide'})`;
        }

        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 9px; flex: 1; min-width: 0;">
                <div style="width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                    <img src="${faviconUrl}" width="18" height="18" style="border-radius:4px;" onerror="this.style.display='none';this.parentNode.innerHTML='<svg width=16 height=16 viewBox=\\'0 0 24 24\\' fill=\\'${accentColor}\\'><path d=\\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z\\'/></svg>';" />
                </div>
                <div style="display: flex; flex-direction: column; overflow: hidden; flex: 1;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <div id="ypp-dm-title" style="font-size:13px;font-weight:700;color:#fff;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${titleLabel}">${titleLabel}</div>
                        <button id="ypp-dm-edit-name" style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;padding:0;display:flex;transition:color 0.2s;" title="Rename Profile">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                    </div>
                    <div style="font-size:10px;color:rgba(255,255,255,0.45);margin-top:1px;">${subtext}</div>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                <div style="width:7px;height:7px;border-radius:50%;background:${accentColor};box-shadow:0 0 8px ${accentColor};flex-shrink:0;"></div>
            </div>
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
        Object.assign(closeBtn.style, {
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#aaa',
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.15s'
        });
        closeBtn.onmouseenter = () => { closeBtn.style.background = 'rgba(255,255,255,0.12)'; closeBtn.style.color = '#fff'; };
        closeBtn.onmouseleave = () => { closeBtn.style.background = 'rgba(255,255,255,0.06)'; closeBtn.style.color = '#aaa'; };
        closeBtn.onclick = () => {
            this._animateClose(ctx._domainPanel, () => ctx._removePanel());
        };

        const rightGroup = header.lastElementChild;
        rightGroup.appendChild(closeBtn);
        
        const editBtn = header.querySelector('#ypp-dm-edit-name');
        if (editBtn) {
            editBtn.onmouseenter = () => editBtn.style.color = '#fff';
            editBtn.onmouseleave = () => editBtn.style.color = 'rgba(255,255,255,0.4)';
            editBtn.onclick = () => {
                const newName = prompt('Enter a custom name for this profile:', savedName || '');
                if (newName !== null) {
                    if (!ctx._domainProfile) ctx._domainProfile = {};
                    ctx._domainProfile.name = newName.trim();
                    ctx.recordChange('name');
                    const finalLabel = newName.trim() || (isSeriesMode ? 'Series Profile' : `${ctx._domain}`);
                    const titleEl = header.querySelector('#ypp-dm-title');
                    titleEl.textContent = finalLabel;
                    titleEl.title = finalLabel;
                }
            };
        }
        
        return header;
    }

    static _animateClose(panel, onDone) {
        if (!panel) { onDone(); return; }
        panel.style.animation = 'ypp-domain-panel-out 0.2s cubic-bezier(0.4, 0, 1, 1) forwards';
        setTimeout(onDone, 200);
    }

    static _buildBody(ctx, video) {
        const body = document.createElement('div');
        body.id = 'ypp-domain-panel-body';
        Object.assign(body.style, {
            padding: '13px 15px',
            display: 'flex',
            flexDirection: 'column'
        });

        // ── 1. Scope Selector Toggle (Domain vs Series vs Host) ──
        const scopeWrap = document.createElement('div');
        scopeWrap.className = 'ypp-domain-scope-toggle';
        scopeWrap.style.gridTemplateColumns = '1fr 1fr 1fr';
        
        const isSeriesMode = ctx._scopeMode === 'series';
        const isHostMode = ctx._scopeMode === 'host';
        const isDomainMode = !isSeriesMode && !isHostMode;

        const domainSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
        const seriesSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7l-5 3V8l5 3zm5-3l-5 3 5 3V9z"/></svg>`;
        const hostSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H5v-2h9v2zm5-4H5V6h14v8z"/></svg>`;

        scopeWrap.innerHTML = `
            <button class="ypp-scope-tab ${isDomainMode ? 'active-domain' : ''}" data-scope="domain">
                ${domainSvg} Site
            </button>
            <button class="ypp-scope-tab ${isSeriesMode ? 'active-series' : ''}" data-scope="series">
                ${seriesSvg} Series
            </button>
            <button class="ypp-scope-tab ${isHostMode ? 'active-host' : ''}" data-scope="host">
                ${hostSvg} Server
            </button>
        `;
        scopeWrap.querySelectorAll('.ypp-scope-tab').forEach(btn => {
            btn.onclick = async (e) => {
                const mode = e.currentTarget.getAttribute('data-scope');
                await ctx.setScopeMode(mode);
                this._animateClose(ctx._domainPanel, () => {
                    ctx._domainPanel = null;
                    ctx.togglePanel(video, ctx._domainBtn);
                });
            };
        });
        body.appendChild(scopeWrap);

        // ── 2. Auto-Remember Toggle Box ──
        const isEnabled = ctx._isRemembering !== false;
        let scopeDesc = '';
        if (isSeriesMode) scopeDesc = 'Remembers presets for this series only';
        else if (isHostMode) scopeDesc = 'Remembers presets globally for this video host';
        else scopeDesc = `Remembers presets across all of ${ctx._domain}`;

        const toggleWrap = document.createElement('div');
        toggleWrap.className = 'ypp-domain-switch-wrap';
        toggleWrap.innerHTML = `
            <div>
                <div style="font-size: 12px; font-weight: 700; color: #fff;">Auto-Remember Episodes</div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.55); margin-top: 2px;">${scopeDesc}</div>
            </div>
            <label style="position: relative; display: inline-block; width: 36px; height: 20px; cursor: pointer; flex-shrink: 0;">
                <input type="checkbox" ${isEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                <span id="ypp-dm-slider-bg" style="position: absolute; inset: 0; background-color: ${isEnabled ? '#3b82f6' : 'rgba(255,255,255,0.18)'}; border-radius: 9999px; transition: 0.25s;"></span>
                <span id="ypp-dm-slider-thumb" style="position: absolute; top: 2px; left: ${isEnabled ? '18px' : '2px'}; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: 0.25s; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></span>
            </label>
        `;

        const checkbox = toggleWrap.querySelector('input[type="checkbox"]');
        const sliderBg = toggleWrap.querySelector('#ypp-dm-slider-bg');
        const sliderThumb = toggleWrap.querySelector('#ypp-dm-slider-thumb');

        checkbox.onchange = (e) => {
            const val = e.target.checked;
            ctx.toggleDomainMemory(val);
            sliderBg.style.backgroundColor = val ? '#3b82f6' : 'rgba(255,255,255,0.18)';
            sliderThumb.style.left = val ? '18px' : '2px';
            // UI 4: live re-render the stats section
            const statsContainer = body.querySelector('#ypp-dm-stats');
            if (statsContainer) {
                statsContainer.innerHTML = this._buildStatsHTML(ctx, video, val);
            }
        };
        body.appendChild(toggleWrap);

        // ── 3. Stats Rows — Bug 4 fix: full detail ──
        const statsContainer = document.createElement('div');
        statsContainer.id = 'ypp-dm-stats';
        const statsLabel = document.createElement('div');
        statsLabel.className = 'ypp-domain-section-label';
        statsLabel.textContent = 'Current Profile';
        body.appendChild(statsLabel);
        statsContainer.innerHTML = this._buildStatsHTML(ctx, video, isEnabled);
        body.appendChild(statsContainer);

        // ── 4. Improvement 4: Last saved timestamp ──
        if (ctx._domainProfile?.lastUpdated) {
            const savedDiv = document.createElement('div');
            savedDiv.className = 'ypp-domain-last-saved';
            savedDiv.textContent = `Last saved ${this._formatRelativeTime(ctx._domainProfile.lastUpdated)}`;
            body.appendChild(savedDiv);
        }

        return body;
    }

    /** Bug 4 fix + UI 4: build detailed stats HTML, called on initial render and on toggle change */
    static _buildStatsHTML(ctx, video, isRemembering) {
        if (!isRemembering) {
            return `
                <div class="ypp-domain-stat-row" style="justify-content:center;color:rgba(255,255,255,0.4);font-size:11px;gap:6px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    Auto-remember is OFF — settings won't be saved
                </div>
            `;
        }

        // Volume Boost
        const vb = ctx._instances?.['volumeBoost'];
        let volText = '100% (Normal)';
        let volActive = false;
        if (vb) {
            const gainPct = Math.round((vb._volumeGain || 1) * 100);
            volActive = gainPct !== 100;
            const eqGains = Array.isArray(vb._eqGains) ? vb._eqGains : [];
            const isEqCustom = eqGains.some(g => Math.abs(g) > 0.05);
            volText = `${gainPct}%${isEqCustom ? ' · Custom EQ' : ''}`;
        }

        // Cinema Filter
        const vf = ctx._instances?.['videoFilters'];
        let filterText = 'No Filter';
        let filterActive = false;
        if (vf && vf.currentFilterIndex) {
            const presetName = window.YPP?.features?.VideoFiltersPresets?.FILTERS?.[vf.currentFilterIndex]?.name;
            const intensity = vf.filterIntensity ?? 100;
            filterActive = true;
            filterText = presetName
                ? `${presetName}${intensity !== 100 ? ` · ${intensity}%` : ''}`
                : `Filter #${vf.currentFilterIndex}`;
        }

        // Speed
        const speedVal = (video && !isNaN(video.playbackRate)) ? video.playbackRate : 1;
        const speedActive = speedVal !== 1;
        const speedText = `${Number(speedVal).toFixed(2)}x`;

        const isSeriesMode = ctx._scopeMode === 'series';
        const activeClass = isSeriesMode ? 'active-series' : 'active';

        return `
            <div class="ypp-domain-stat-row">
                <span class="ypp-domain-stat-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                    Volume Boost
                </span>
                <span class="ypp-domain-stat-value ${volActive ? activeClass : ''}">${volText}</span>
            </div>
            <div class="ypp-domain-stat-row">
                <span class="ypp-domain-stat-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11v6l5-3-5-3z"/></svg>
                    Cinema Filter
                </span>
                <span class="ypp-domain-stat-value ${filterActive ? activeClass : ''}" title="${filterText}">${filterText}</span>
            </div>
            <div class="ypp-domain-stat-row">
                <span class="ypp-domain-stat-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M10 8v8l6-4-6-4zm2-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    Video Speed
                </span>
                <span class="ypp-domain-stat-value ${speedActive ? activeClass : ''}">${speedText}</span>
            </div>
        `;
    }

    static _formatRelativeTime(ts) {
        if (!ts) return '';
        const diffMs = Date.now() - ts;
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return 'just now';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
        const diffDay = Math.floor(diffHr / 24);
        return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    }

    static _buildFooter(ctx, video, panel) {
        const footer = document.createElement('div');
        Object.assign(footer.style, {
            padding: '11px 15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        });

        // ── 1. Snapshot Primary Button ──
        const saveBtn = document.createElement('button');
        saveBtn.className = 'ypp-domain-btn-action ypp-domain-btn-primary';
        saveBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
            Snapshot as Default
        `;
        saveBtn.onclick = () => {
            ctx.recordChange('manual');
            ctx._showRestoreToast(video);
            this._animateClose(ctx._domainPanel, () => ctx._removePanel());
        };

        // ── 2. Import & Export Row ──
        const ioRow = document.createElement('div');
        ioRow.className = 'ypp-domain-btn-row';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'ypp-domain-btn-action';
        copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            Copy JSON
        `;
        copyBtn.onclick = async () => {
            try {
                const jsonStr = ctx.exportProfileJSON();
                await navigator.clipboard.writeText(jsonStr);
                copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="#10b981"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Copied!`;
                copyBtn.style.color = '#6ee7b7';
                setTimeout(() => {
                    copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copy JSON`;
                    copyBtn.style.color = '';
                }, 2000);
            } catch (_) {}
        };

        const pasteBtn = document.createElement('button');
        pasteBtn.className = 'ypp-domain-btn-action';
        pasteBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg>
            Paste JSON
        `;
        pasteBtn.onclick = async () => {
            try {
                const input = prompt('Paste your saved Profile JSON:');
                if (input && input.trim()) {
                    const success = await ctx.importProfileJSON(input.trim());
                    if (success) {
                        this._animateClose(ctx._domainPanel, () => ctx._removePanel());
                    }
                }
            } catch (_) {}
        };

        ioRow.append(copyBtn, pasteBtn);

        // ── 3. Bypass Button ──
        const bypassBtn = document.createElement('button');
        bypassBtn.className = 'ypp-domain-btn-action';
        bypassBtn.style.userSelect = 'none'; // Prevent text selection on hold
        bypassBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            Hold to Bypass Effects
        `;
        let bypassActive = false;
        const enableBypass = () => {
            if (bypassActive) return;
            bypassActive = true;
            bypassBtn.style.background = 'rgba(239, 68, 68, 0.2)';
            bypassBtn.style.color = '#fca5a5';
            
            // Bypass logic
            if (ctx._instances['videoFilters']) {
                const vf = ctx._instances['videoFilters'];
                vf.currentFilterIndex = 0;
                vf.filterIntensity = 100;
                vf.filterAdjustments = {
                    brightness: 100, contrast: 100, saturate: 100, hueRotate: 0,
                    sepia: 0, grayscale: 0, invert: 0, blur: 0, opacity: 100,
                    dehaze: 0, clarity: 0, grain: 0, sharpness: 0, temperature: 0,
                    vibrance: 100, highlights: 0, shadows: 0, vignette: 0,
                    exposure: 0, tint: 0, fade: 0, noiseReduction: 0
                };
                if (video) vf._applyComputedFilter(video);
            }
            if (ctx._instances['volumeBoost']) {
                const vb = ctx._instances['volumeBoost'];
                vb.setGain?.(1);
                vb.setBalance?.(0);
                vb.setEQ?.([0,0,0,0,0,0,0,0,0,0]);
            }
        };

        const disableBypass = () => {
            if (!bypassActive) return;
            bypassActive = false;
            bypassBtn.style.background = '';
            bypassBtn.style.color = '';
            if (video) ctx.restoreProfile(video, false);
        };

        bypassBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); enableBypass(); });
        bypassBtn.addEventListener('pointerup', (e) => { e.preventDefault(); disableBypass(); });
        bypassBtn.addEventListener('pointerleave', () => disableBypass());

        // ── 4. Reset Button ──
        const resetBtn = document.createElement('button');
        resetBtn.className = 'ypp-domain-btn-action ypp-domain-btn-danger';
        const displayLabel = ctx._scopeMode === 'series' ? 'Series' : ctx._domain;
        resetBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
            Reset ${displayLabel}
        `;
        resetBtn.onclick = () => {
            ctx.resetDomainProfile();
            this._animateClose(ctx._domainPanel, () => ctx._removePanel());
        };

        const exportAllBtn = document.createElement('button');
        exportAllBtn.className = 'ypp-domain-btn-action';
        exportAllBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Export All Profiles
        `;
        exportAllBtn.onclick = async () => {
            try {
                if (chrome?.storage?.local) {
                    const data = await chrome.storage.local.get('ypp_domain_profiles'); // Use the correct key
                    const jsonStr = JSON.stringify(data.ypp_domain_profiles || {}, null, 2);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ypp_domain_profiles_backup_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                }
            } catch (err) {
                console.error('[YPP] Failed to export profiles:', err);
            }
        };

        const bottomRow = document.createElement('div');
        bottomRow.className = 'ypp-domain-btn-row';
        bottomRow.append(exportAllBtn, resetBtn);

        footer.append(saveBtn, ioRow, bypassBtn, bottomRow);
        return footer;
    }

    static _mountPanel(panel, btn) {
        if (btn?.closest?.('.ypp-global-player-bar')) {
            // Use the popup portal to escape host-site overflow/stacking contexts,
            // matching the same pattern used by VideoFiltersUI._mountPanel.
            const portal = window.YPP?.Utils?.getPopupPortal?.();
            const bar = btn.closest('.ypp-global-player-bar');
            panel.style.position = 'fixed';
            panel.style.zIndex = '2147483647';
            panel.style.pointerEvents = 'auto';
            panel.style.bottom = 'auto';
            const topPx = Math.max(76, Math.floor((window.innerHeight - 440) / 2));
            if (bar.classList.contains('ypp-bar-pos-right')) {
                panel.style.right = '76px';
                panel.style.left = 'auto';
                panel.style.top = topPx + 'px';
            } else if (bar.classList.contains('ypp-bar-pos-left')) {
                panel.style.left = '76px';
                panel.style.right = 'auto';
                panel.style.top = topPx + 'px';
            } else {
                panel.style.top = '64px';
                panel.style.right = '24px';
                panel.style.left = 'auto';
            }
            if (portal) {
                portal.appendChild(panel);
            } else {
                document.body.appendChild(panel);
            }
        } else {
            document.body.appendChild(panel);
            Object.assign(panel.style, {
                position: 'fixed',
                top: '64px',
                right: '24px',
                left: 'auto',
                bottom: 'auto'
            });
        }
        if (window.YPP?.Utils?.makePopupZoomInvariant) {
            window.YPP.Utils.makePopupZoomInvariant(panel);
        }
    }


    /**
     * Bug 1 fix: Handlers stored on ctx, removed in ctx._removePanel()
     */
    static _attachEventListeners(ctx, btn) {
        const outside = (e) => {
            if (ctx._domainPanel && !ctx._domainPanel.contains(e.target) && !btn?.contains(e.target)) {
                this._animateClose(ctx._domainPanel, () => ctx._removePanel());
            }
        };
        ctx._domainPanelOutsideHandler = outside;
        setTimeout(() => document.addEventListener('click', outside), 0);

        const onKeyDown = (e) => {
            if (e.key === 'Escape' && ctx._domainPanel) {
                this._animateClose(ctx._domainPanel, () => ctx._removePanel());
            }
        };
        ctx._domainPanelKeydownHandler = onKeyDown;
        document.addEventListener('keydown', onKeyDown);
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.DomainMemoryUI = DomainMemoryUI;
