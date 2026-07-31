/**
 * domain-memory-ui.js
 * ───────────────────
 * Sleek Glassmorphism UI for inspecting and managing domain-specific
 * player bar profiles (Volume Booster, Cinema Filters, and Speed).
 *
 * Includes:
 * - Scope Selector (Domain-wide vs. Series-level scoping)
 * - Auto-Remember Toggle
 * - Real-time statistics display
 * - Snapshot, Reset, Copy JSON, and Paste JSON controls
 */

export class DomainMemoryUI {
    static featureId = 'domainMemoryUI';
    static executionPhase = 'idle';
    static priority = 999;

    static createPanel(ctx, video, btn) {
        this._injectStyles();
        
        const panel = document.createElement('div');
        panel.id = 'ypp-domain-panel';
        panel.className = 'ypp-glass-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            width: '375px',
            backgroundColor: 'rgba(14, 15, 23, 0.84)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderTop: '1px solid rgba(255, 255, 255, 0.28)',
            borderRadius: '16px',
            zIndex: '2147483647',
            color: '#fff',
            fontFamily: 'Inter, -apple-system, sans-serif',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            overflow: 'hidden',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            animation: 'ypp-panel-glass-in 0.25s cubic-bezier(0.2, 0, 0, 1) forwards'
        });

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
            .ypp-domain-pill-btn {
                position: relative !important;
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
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 10px;
                padding: 3px;
                margin-bottom: 12px;
                gap: 4px;
            }
            .ypp-scope-tab {
                border: none;
                background: transparent;
                color: rgba(255, 255, 255, 0.65);
                font-size: 11px;
                font-weight: 600;
                padding: 6px 10px;
                border-radius: 7px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }
            .ypp-scope-tab.active {
                background: rgba(59, 130, 246, 0.28);
                color: #fff;
                border: 1px solid rgba(99, 102, 241, 0.45);
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            }
            .ypp-scope-tab:hover:not(.active) {
                background: rgba(255, 255, 255, 0.08);
                color: #fff;
            }
            .ypp-domain-stat-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 9px 14px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 10px;
                margin-bottom: 7px;
            }
            .ypp-domain-stat-label {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.75);
                display: flex;
                align-items: center;
                gap: 7px;
            }
            .ypp-domain-stat-value {
                font-size: 11.5px;
                font-weight: 700;
                color: #fff;
                background: rgba(255, 255, 255, 0.1);
                padding: 3px 9px;
                border-radius: 20px;
            }
            .ypp-domain-switch-wrap {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 14px;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.12));
                border: 1px solid rgba(99, 102, 241, 0.35);
                border-radius: 12px;
                margin-bottom: 12px;
            }
            .ypp-domain-btn-action {
                width: 100%;
                padding: 9px 14px;
                background: rgba(255, 255, 255, 0.07);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 10px;
                color: #fff;
                font-size: 11.5px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease;
                margin-bottom: 6px;
            }
            .ypp-domain-btn-action:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.28);
                transform: translateY(-1px);
            }
            .ypp-domain-btn-primary {
                background: linear-gradient(135deg, #3b82f6, #6366f1);
                border-color: rgba(255, 255, 255, 0.25);
                box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
            }
            .ypp-domain-btn-primary:hover {
                background: linear-gradient(135deg, #60a5fa, #818cf8);
                box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
            }
            .ypp-domain-btn-danger {
                color: #fca5a5;
                background: rgba(239, 68, 68, 0.1);
                border-color: rgba(239, 68, 68, 0.25);
            }
            .ypp-domain-btn-danger:hover {
                background: rgba(239, 68, 68, 0.22);
                border-color: rgba(239, 68, 68, 0.45);
            }
            .ypp-domain-btn-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
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
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '13px',
            fontWeight: '700'
        });

        const titleLabel = ctx._scopeMode === 'series' ? 'Series Profile' : `Site Profile (${ctx._domain})`;

        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3ea6ff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                <span>${titleLabel}</span>
            </div>
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 12z"/></svg>`;
        Object.assign(closeBtn.style, {
            background: 'transparent',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex'
        });
        closeBtn.onclick = () => ctx._removePanel();

        header.appendChild(closeBtn);
        return header;
    }

    static _buildBody(ctx, video) {
        const body = document.createElement('div');
        Object.assign(body.style, {
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column'
        });

        // ── 1. Scope Selector Toggle (Domain vs Series) ──
        const scopeWrap = document.createElement('div');
        scopeWrap.className = 'ypp-domain-scope-toggle';
        const isSeriesMode = ctx._scopeMode === 'series';
        scopeWrap.innerHTML = `
            <button class="ypp-scope-tab ${!isSeriesMode ? 'active' : ''}" data-scope="domain">
                🌐 Entire Site
            </button>
            <button class="ypp-scope-tab ${isSeriesMode ? 'active' : ''}" data-scope="series">
                📺 This Series
            </button>
        `;
        scopeWrap.querySelectorAll('.ypp-scope-tab').forEach(btn => {
            btn.onclick = async (e) => {
                const mode = e.currentTarget.getAttribute('data-scope');
                await ctx.setScopeMode(mode);
                ctx._removePanel();
                ctx.togglePanel(video, ctx._domainBtn);
            };
        });
        body.appendChild(scopeWrap);

        // ── 2. Auto-Remember Toggle Box ──
        const isEnabled = ctx._isRemembering !== false;
        const scopeDesc = isSeriesMode
            ? 'Remembers presets for this series only'
            : `Remembers presets across all of ${ctx._domain}`;

        const toggleWrap = document.createElement('div');
        toggleWrap.className = 'ypp-domain-switch-wrap';
        toggleWrap.innerHTML = `
            <div>
                <div style="font-size: 12px; font-weight: 700; color: #fff;">Auto-Remember Episodes</div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.65); margin-top: 2px;">
                    ${scopeDesc}
                </div>
            </div>
            <label style="position: relative; display: inline-block; width: 36px; height: 20px; cursor: pointer;">
                <input type="checkbox" ${isEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; inset: 0; background-color: ${isEnabled ? '#3b82f6' : 'rgba(255,255,255,0.2)'}; border-radius: 9999px; transition: 0.3s;"></span>
                <span style="position: absolute; top: 2px; left: ${isEnabled ? '18px' : '2px'}; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></span>
            </label>
        `;

        const checkbox = toggleWrap.querySelector('input[type="checkbox"]');
        checkbox.onchange = (e) => {
            const val = e.target.checked;
            ctx.toggleDomainMemory(val);
            const sliderBg = toggleWrap.querySelectorAll('span')[0];
            const sliderThumb = toggleWrap.querySelectorAll('span')[1];
            sliderBg.style.backgroundColor = val ? '#3b82f6' : 'rgba(255,255,255,0.2)';
            sliderThumb.style.left = val ? '18px' : '2px';
        };

        body.appendChild(toggleWrap);

        // ── 3. Stats Rows ──
        const getVbVal = () => {
            const vb = ctx._instances['volumeBoost'];
            if (!vb) return '100% (Normal)';
            const gainPct = Math.round((vb._volumeGain || 1) * 100);
            return `${gainPct}% Boost`;
        };

        const getVfVal = () => {
            const vf = ctx._instances['videoFilters'];
            if (!vf || !vf.currentFilterIndex) return 'Normal Filter';
            const presetName = window.YPP?.features?.VideoFiltersPresets?.FILTERS?.[vf.currentFilterIndex]?.name || 'Custom';
            return `${presetName} (${vf.filterIntensity || 100}%)`;
        };

        const getSpeedVal = () => {
            if (video && !isNaN(video.playbackRate)) {
                return `${Number(video.playbackRate).toFixed(2)}x`;
            }
            return '1.00x';
        };

        const statsContainer = document.createElement('div');
        statsContainer.innerHTML = `
            <div class="ypp-domain-stat-row">
                <span class="ypp-domain-stat-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                    Volume Boost
                </span>
                <span class="ypp-domain-stat-value">${getVbVal()}</span>
            </div>
            <div class="ypp-domain-stat-row">
                <span class="ypp-domain-stat-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 5.52-4.48 10-10 10z"/></svg>
                    Cinema Filter
                </span>
                <span class="ypp-domain-stat-value">${getVfVal()}</span>
            </div>
            <div class="ypp-domain-stat-row">
                <span class="ypp-domain-stat-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 8v8l6-4-6-4zm2-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    Video Speed
                </span>
                <span class="ypp-domain-stat-value">${getSpeedVal()}</span>
            </div>
        `;

        body.appendChild(statsContainer);

        return body;
    }

    static _buildFooter(ctx, video, panel) {
        const footer = document.createElement('div');
        Object.assign(footer.style, {
            padding: '12px 16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        });

        // ── 1. Snapshot Primary Button ──
        const saveBtn = document.createElement('button');
        saveBtn.className = 'ypp-domain-btn-action ypp-domain-btn-primary';
        saveBtn.innerHTML = `<span>⚡ Snapshot Current as Default</span>`;
        saveBtn.onclick = () => {
            ctx.recordChange('manual');
            ctx._showRestoreToast(video);
            ctx._removePanel();
        };

        // ── 2. Import & Export Row ──
        const ioRow = document.createElement('div');
        ioRow.className = 'ypp-domain-btn-row';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'ypp-domain-btn-action';
        copyBtn.innerHTML = `<span>📋 Copy JSON</span>`;
        copyBtn.onclick = async () => {
            try {
                const jsonStr = ctx.exportProfileJSON();
                await navigator.clipboard.writeText(jsonStr);
                if (ctx.utils?.createToast) {
                    ctx.utils.createToast('📋 Copied Site Profile JSON to Clipboard!');
                }
            } catch (_) {}
        };

        const pasteBtn = document.createElement('button');
        pasteBtn.className = 'ypp-domain-btn-action';
        pasteBtn.innerHTML = `<span>📥 Paste JSON</span>`;
        pasteBtn.onclick = async () => {
            try {
                const input = prompt('Paste your saved Profile JSON:');
                if (input && input.trim()) {
                    const success = await ctx.importProfileJSON(input.trim());
                    if (success) {
                        ctx._removePanel();
                        if (ctx.utils?.createToast) {
                            ctx.utils.createToast('⚡ Profile imported and applied!');
                        }
                    }
                }
            } catch (_) {}
        };

        ioRow.append(copyBtn, pasteBtn);

        // ── 3. Reset Button ──
        const resetBtn = document.createElement('button');
        resetBtn.className = 'ypp-domain-btn-action ypp-domain-btn-danger';
        const displayLabel = ctx._scopeMode === 'series' ? 'Series' : ctx._domain;
        resetBtn.innerHTML = `<span>🔄 Reset ${displayLabel} to Defaults</span>`;
        resetBtn.onclick = () => {
            ctx.resetDomainProfile();
            ctx._removePanel();
        };

        footer.append(saveBtn, ioRow, resetBtn);
        return footer;
    }

    static _mountPanel(panel, btn) {
        if (btn?.closest?.('.ypp-global-player-bar')) {
            const bar = btn.closest('.ypp-global-player-bar');
            panel.style.bottom = 'auto';
            const topPx = Math.max(76, Math.floor((window.innerHeight - 420) / 2));
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
            document.body.appendChild(panel);
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

    static _attachEventListeners(ctx, btn) {
        const outside = (e) => {
            if (ctx._domainPanel && !ctx._domainPanel.contains(e.target) && !btn?.contains(e.target)) {
                ctx._removePanel();
            }
        };
        ctx._domainPanelOutsideHandler = outside;
        setTimeout(() => document.addEventListener('click', outside), 0);

        const onKeyDown = (e) => {
            if (e.key === 'Escape' && ctx._domainPanel) {
                ctx._removePanel();
            }
        };
        ctx._domainPanelKeydownHandler = onKeyDown;
        document.addEventListener('keydown', onKeyDown);
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.DomainMemoryUI = DomainMemoryUI;
