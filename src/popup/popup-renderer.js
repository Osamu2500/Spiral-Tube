/**
 * popup-renderer.js  — v3.1 Architecture
 * ─────────────────────────────────────────────────────────────────────
 * Reads POPUP_SCHEMA and builds the DOM for every non-custom tab.
 * This replaces hundreds of lines of repetitive HTML in popup.html.
 *
 * Responsibilities:
 *   • Render nav items from schema
 *   • Render section cards and setting items for schema-driven tabs
 *   • Skip tabs with custom:true (they keep their own HTML)
 *   • Honour the `hidden` flag on individual items
 *   • Inject custom slots (sponsorBlockCategories, shortcutsPanel, etc.)
 *   • Register new inputs with popup-state so they save/load automatically
 *
 * Usage (in popup-main.js):
 *   import { renderSchema } from './popup-renderer.js';
 *   renderSchema(document, state);
 * ─────────────────────────────────────────────────────────────────────
 */

import { CUSTOM_SLOT_RENDERERS, getPopupSchema } from './popup-schema.js';

// ── SVG helpers ────────────────────────────────────────────────────────
const NS_SVG = 'http://www.w3.org/2000/svg';

function makeSVG(pathD, size = 15) {
    const svg = document.createElementNS(NS_SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    if (pathD) {
        const path = document.createElementNS(NS_SVG, 'path');
        path.setAttribute('d', pathD);
        svg.appendChild(path);
    }
    return svg;
}

// ── Global Tooltip & Help Badge Helper ──────────────────────────────────
let globalTooltipEl = null;

function getOrCreateGlobalTooltip(doc) {
    if (!globalTooltipEl || !doc.body.contains(globalTooltipEl)) {
        globalTooltipEl = doc.getElementById('ypp-global-tooltip');
        if (!globalTooltipEl) {
            globalTooltipEl = doc.createElement('div');
            globalTooltipEl.id = 'ypp-global-tooltip';
            globalTooltipEl.className = 'ypp-global-tooltip';
            doc.body.appendChild(globalTooltipEl);
            doc.addEventListener('click', (e) => {
                if (!e.target.closest('.feature-help-btn')) {
                    hideGlobalTooltip();
                }
            });
        }
    }
    return globalTooltipEl;
}

function showGlobalTooltip(target, text) {
    if (!text || !target) return;
    const doc = target.ownerDocument || document;
    const tooltip = getOrCreateGlobalTooltip(doc);
    tooltip.innerHTML = text;
    tooltip.classList.add('show');

    const rect = target.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth || 220;
    const tooltipHeight = tooltip.offsetHeight || 50;

    let top = rect.top - tooltipHeight - 8;
    if (top < 10) {
        top = rect.bottom + 8;
    }
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));

    tooltip.style.top = `${Math.round(top)}px`;
    tooltip.style.left = `${Math.round(left)}px`;
}

function hideGlobalTooltip() {
    if (globalTooltipEl) {
        globalTooltipEl.classList.remove('show');
    }
}

export function createHelpButton(descText) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'feature-help-btn';
    btn.textContent = '?';
    btn.setAttribute('aria-label', descText || 'Help');
    btn.addEventListener('mouseenter', (e) => showGlobalTooltip(e.target, descText));
    btn.addEventListener('mouseleave', () => hideGlobalTooltip());
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showGlobalTooltip(e.target, descText);
    });
    return btn;
}

export function convertStaticDescriptionsToHelpButtons(doc = document) {
    doc.querySelectorAll('.info').forEach(info => {
        const nameEl = info.querySelector('.name');
        const descEl = info.querySelector('.desc');
        if (nameEl && descEl) {
            if (descEl.querySelector('[id$="Value"], #blueLightValue, #dimValue') || descEl.id?.endsWith('Value') || descEl.id === 'blueLightValue' || descEl.id === 'dimValue') return;
            const text = descEl.textContent || '';
            if (text.trim() && !nameEl.querySelector('.feature-help-btn')) {
                nameEl.appendChild(createHelpButton(text.trim()));
                descEl.remove();
            }
        }
    });
}

// ── Item renderers ─────────────────────────────────────────────────────

function renderToggle(item, state) {
    if (item.hidden) return null;

    const card = document.createElement('div');
    card.className = `toggle-card ${item.class || ''}`.trim();
    if (item.style) card.style.cssText = item.style;
    if (item.cssText) card.style.cssText = item.cssText;  // alias

    // Icon
    if (item.icon) {
        const iconWrap = document.createElement('div');
        iconWrap.style.cursor = 'pointer';
        iconWrap.className = 'feature-icon';
        iconWrap.appendChild(makeSVG(item.icon, 14));
        card.appendChild(iconWrap);
    }

    // Info
    const info = document.createElement('div');
    info.style.cursor = 'pointer';
    info.className = 'info';
    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.style.cssText = 'display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px;';
    nameEl.textContent = item.label;
    if (item.desc) {
        nameEl.appendChild(createHelpButton(item.desc));
    }
    if (item.badge) {
        const b = document.createElement('span');
        b.textContent = item.badge;
        b.className = 'new-feature-badge';
        nameEl.appendChild(b);
    }
    if (item.inlineSlot) {
        const b = document.createElement('span');
        b.innerHTML = item.inlineSlot;
        nameEl.appendChild(b);
    }
    info.appendChild(nameEl);
    card.appendChild(info);

    // Toggle
    const label = document.createElement('label');
    label.className = 'toggle';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = item.id;
    label.appendChild(input);
    const span = document.createElement('span');
    span.className = 'slider';
    label.appendChild(span);
    card.appendChild(label);

    if (item.bottomSlot) {
        const bottom = document.createElement('div');
        bottom.className = 'sub-setting-row';
        bottom.innerHTML = item.bottomSlot;
        card.appendChild(bottom);
    }

    _registerInput(input, state);
    return card;
}

function renderRange(item, state) {
    if (item.hidden) return null;

    const wrap = document.createElement('div');
    const isWide = item.class && item.class.includes('span-2');

    if (item.parent) {
        wrap.className = 'sub-setting-row';
        wrap.style.marginTop = '8px';
        wrap.style.paddingTop = '8px';
        wrap.style.borderTop = '1px solid rgba(255,255,255,0.06)';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.gap = '6px';
    } else {
        wrap.className = `setting-item toggle-card ${item.class || ''}`.trim();
        wrap.style.flexDirection = isWide ? 'row' : 'column';
        wrap.style.alignItems = isWide ? 'center' : 'stretch';
        wrap.style.justifyContent = isWide ? 'space-between' : 'center';
        wrap.style.gap = '8px';
    }

    if (item.icon) {
        const iconWrap = document.createElement('div');
        iconWrap.style.cursor = 'pointer';
        iconWrap.className = 'feature-icon';
        iconWrap.appendChild(makeSVG(item.icon, 14));
        wrap.appendChild(iconWrap);
    }

    const info = document.createElement('div');
    info.className = 'info';
    info.style.margin = '0';
    if (!isWide) info.style.width = '100%';
    info.style.display = 'flex';
    info.style.justifyContent = 'space-between';
    info.style.flexDirection = isWide ? 'column' : 'row';
    info.style.flex = isWide ? '1' : 'none'; // Allow info to take remaining space if side-by-side

    const valueId = item.id + 'Value';
    const unit = item.unit != null ? item.unit : '%';
    
    // Determine initial value based on discrete options or raw min/max
    let initialValue = (state?.settings && state.settings[item.id] !== undefined) ? state.settings[item.id] : (item.default ?? item.min ?? 0);
    
    // For UI rendering
    let displayValue = initialValue;
    if (item.discreteOptions) {
        // Find the matching option label
        const opt = item.discreteOptions.find(o => o.value == initialValue) || item.discreteOptions[0];
        displayValue = opt.label;
    }
    
    if (item.parent) {
        info.innerHTML = `<span class="name" style="font-size:12px; display:inline-flex; align-items:center; flex-wrap:wrap; gap:4px;">${item.label}</span><span class="desc"><span id="${valueId}" style="font-size:12px; font-weight:bold; color:var(--red);">${displayValue}</span><span style="font-size:12px; font-weight:bold; color:var(--red);">${item.discreteOptions ? '' : unit}</span></span>`;
    } else {
        info.innerHTML = `<span class="name" style="display:inline-flex; align-items:center; flex-wrap:wrap; gap:4px;">${item.label}</span><span class="desc"><span id="${valueId}">${displayValue}</span>${item.discreteOptions ? '' : unit}</span>`;
    }
    if (item.desc) {
        const nameEl = info.querySelector('.name');
        if (nameEl) nameEl.appendChild(createHelpButton(item.desc));
    }
    
    wrap.appendChild(info);

    const rangeWrap = document.createElement('div');
    rangeWrap.className = 'range-container';
    if (isWide) {
        rangeWrap.style.width = '140px';
        rangeWrap.style.flexShrink = '0';
        rangeWrap.style.marginTop = '0';
        rangeWrap.style.marginLeft = 'auto';
    }
    const input = document.createElement('input');
    input.type = 'range';
    
    let hiddenInput = null;
    
    if (item.discreteOptions) {
        input.min = 0;
        input.max = item.discreteOptions.length - 1;
        input.step = 1;
        // Find the index of the initial value
        let initialIndex = item.discreteOptions.findIndex(o => o.value == initialValue);
        if (initialIndex === -1) initialIndex = 0;
        input.value = initialIndex;
        
        // Hidden input to store the actual value in state
        hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = item.id;
        hiddenInput.value = item.discreteOptions[initialIndex].value;
        wrap.appendChild(hiddenInput);
        
        // Don't set id on the range input so _registerInput skips it, 
        // we'll register the hidden input instead.
        input.id = '';
        
        input.addEventListener('input', () => {
            const index = parseInt(input.value, 10);
            const opt = item.discreteOptions[index];
            const display = document.getElementById(valueId);
            if (display) display.textContent = opt.label;
            hiddenInput.value = opt.value;
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        const originalValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(hiddenInput, 'value', {
            get: function() { return originalValueDesc.get.call(this); },
            set: function(val) {
                originalValueDesc.set.call(this, val);
                let idx = item.discreteOptions.findIndex(o => o.value == val);
                if (idx === -1) idx = 0;
                input.value = idx;
                const display = document.getElementById(valueId);
                if (display) display.textContent = item.discreteOptions[idx].label;
            }
        });
        _registerInput(hiddenInput, state);
    } else {
        input.id = item.id;
        input.min = item.min ?? 0;
        input.max = item.max ?? 100;
        input.step = item.step ?? 1;
        input.value = initialValue;
        
        input.addEventListener('input', () => {
            const display = document.getElementById(valueId);
            if (display) display.textContent = input.value;
        });

        const originalValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(input, 'value', {
            get: function() { return originalValueDesc.get.call(this); },
            set: function(val) {
                originalValueDesc.set.call(this, val);
                const display = document.getElementById(valueId);
                if (display) display.textContent = val;
            }
        });
        _registerInput(input, state);
    }
    
    rangeWrap.appendChild(input);
    wrap.appendChild(rangeWrap);

    return wrap;
}

function renderSelect(item, state) {
    if (item.hidden) return null;

    // ── Special case: Language selector → custom flag-pill picker ──────────
    if (item.id === 'extensionLanguage') {
        return _renderLangPicker(item, state);
    }

    const wrap = document.createElement('div');
    wrap.className = 'toggle-card span-2-tile'; // Gives it the tile look
    wrap.style.gridColumn = 'span 2';

    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.alignItems = 'center';
    headerRow.style.gap = '10px';
    headerRow.style.flex = '1';

    if (item.icon) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'feature-icon';
        iconWrap.appendChild(makeSVG(item.icon, 14));
        headerRow.appendChild(iconWrap);
    }

    const info = document.createElement('div');
    info.className = 'info';

    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.style.cssText = 'display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px;';
    nameEl.textContent = item.label;
    if (item.desc) {
        nameEl.appendChild(createHelpButton(item.desc));
    }
    info.appendChild(nameEl);
    headerRow.appendChild(info);
    wrap.appendChild(headerRow);

    const select = document.createElement('select');
    select.id = item.id;
    select.className = 'theme-select';
    select.style.padding = '4px 10px';
    select.style.fontSize = '11px';
    select.style.maxWidth = '100px';
    select.style.flexShrink = '0';
    
    (item.options || []).forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        select.appendChild(o);
    });
    wrap.appendChild(select);

    _registerInput(select, state);
    return wrap;
}

/**
 * Custom language picker: compact pill chips matching the card-style-btn
 * design — same flex-wrap masonry as Video Card Styles.
 * A hidden <select> keeps the existing state machinery working with no
 * other code changes needed.
 */
function _renderLangPicker(item, state) {
    const LANGS = [
        { 
            value: 'en', native: 'English',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:1px;"><rect width="60" height="40" fill="#fff"/><path fill="#B22234" d="M0 0h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0z"/><rect width="26" height="21.5" fill="#3C3B6E"/><path fill="#fff" d="M3 3h2v2H3zm6 0h2v2H9zm6 0h2v2h-2zm6 0h2v2h-2z M3 8h2v2H3zm6 0h2v2H9zm6 0h2v2h-2zm6 0h2v2h-2z M3 13h2v2H3zm6 0h2v2H9zm6 0h2v2h-2zm6 0h2v2h-2z M3 18h2v2H3zm6 0h2v2H9zm6 0h2v2h-2zm6 0h2v2h-2z"/></svg>'
        },
        { 
            value: 'es', native: 'Español',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:1px;"><rect width="60" height="10" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/><rect y="30" width="60" height="10" fill="#AA151B"/><circle cx="20" cy="20" r="5" fill="#AA151B"/></svg>'
        },
        { 
            value: 'fr', native: 'Français',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:1px;"><rect width="20" height="40" fill="#002654"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg>'
        },
        { 
            value: 'de', native: 'Deutsch',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:1px;"><rect width="60" height="13.3" fill="#000"/><rect y="13.3" width="60" height="13.3" fill="#D00"/><rect y="26.6" width="60" height="13.4" fill="#FFCE00"/></svg>'
        },
        { 
            value: 'ja', native: '日本語',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:1px; border:1px solid rgba(255,255,255,0.1);"><rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="12" fill="#BC002D"/></svg>'
        },
    ];

    // ── Simple wrapper, NO toggle-card class to match Video Card Styles exactly ──
    const wrap = document.createElement('div');
    wrap.style.gridColumn = 'span 4'; // Full width, matching video card styles
    wrap.style.marginTop = '4px';
    wrap.style.marginBottom = '12px';

    // ── Hidden <select> — state machinery unchanged ───────────────────────
    const hiddenSelect = document.createElement('select');
    hiddenSelect.id = item.id;
    hiddenSelect.style.display = 'none';
    LANGS.forEach(l => {
        const o = document.createElement('option');
        o.value = l.value;
        o.textContent = l.native;
        hiddenSelect.appendChild(o);
    });
    wrap.appendChild(hiddenSelect);

    // ── Pill chips — EXACT same pattern as card-style-btn ────────────────
    const grid = document.createElement('div');
    grid.className = 'card-style-grid lang-flag-grid';

    LANGS.forEach(lang => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-btn card-style-btn lang-flag-btn';
        btn.dataset.value = lang.value;
        btn.title = lang.native;

        // Custom flex to align SVG and text perfectly
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '6px';
        btn.style.padding = '6px 10px';

        btn.innerHTML = `${lang.svg} <span>${lang.native}</span>`;

        btn.addEventListener('click', () => {
            grid.querySelectorAll('.lang-flag-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            hiddenSelect.value = lang.value;
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });

        grid.appendChild(btn);
    });

    wrap.appendChild(grid);
    _registerInput(hiddenSelect, state);

    // we need to activate the matching pill once the value is populated.
    // Use a MutationObserver on the hidden select's value attribute OR
    // a short timeout after the state load cycle.
    const activatePill = () => {
        const val = hiddenSelect.value || 'en';
        grid.querySelectorAll('.lang-flag-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.value === val);
        });
    };

    // Call immediately (in case value is already set) + after a tick
    activatePill();
    requestAnimationFrame(activatePill);
    setTimeout(activatePill, 150); // Catch async storage load

    // Also react to programmatic changes on the hidden select
    hiddenSelect.addEventListener('change', activatePill);

    return wrap;
}

function renderLayoutToggle(item, state) {
    if (item.hidden) return null;

    const wrap = document.createElement('div');
    wrap.className = 'setting-item';
    wrap.style.gridColumn = 'span 2';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'stretch';
    wrap.style.marginTop = '8px';
    wrap.style.background = 'rgba(255,255,255,0.02)';
    wrap.style.padding = '12px';
    wrap.style.borderRadius = '12px';
    wrap.style.border = '1px solid rgba(255,255,255,0.05)';

    // Header row
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.justifyContent = 'space-between';
    headerRow.style.alignItems = 'center';
    headerRow.style.marginBottom = '12px';

    const info = document.createElement('div');
    info.className = 'info';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.style.cssText = 'display:flex; align-items:center; flex-wrap:wrap; gap:6px;';
    nameSpan.innerHTML = `${item.label} <span id="sidebar-layout-lock" style="display:none; color:var(--accent-primary);" title="Locked by Immersive Glass"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>`;
    nameSpan.appendChild(createHelpButton(item.desc || 'Video cards size'));
    info.appendChild(nameSpan);
    headerRow.appendChild(info);

    // Toggle Buttons
    const toggleWrap = document.createElement('div');
    toggleWrap.id = item.id + 'Toggle';
    toggleWrap.className = 'sidebar-layout-toggle';
    toggleWrap.style.display = 'inline-flex';
    toggleWrap.style.background = 'rgba(255,255,255,0.06)';
    toggleWrap.style.padding = '3px';
    toggleWrap.style.borderRadius = '8px';
    toggleWrap.style.border = '1px solid rgba(255,255,255,0.08)';

    const svgDenseStr = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="4" height="3" rx="0.5"/><line x1="9" y1="7.5" x2="21" y2="7.5"/><rect x="3" y="11" width="4" height="3" rx="0.5"/><line x1="9" y1="12.5" x2="21" y2="12.5"/><rect x="3" y="16" width="4" height="3" rx="0.5"/><line x1="9" y1="17.5" x2="21" y2="17.5"/></svg>`;
    const svgCompactStr = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="6" height="4" rx="1"/><line x1="11" y1="7" x2="21" y2="7"/><rect x="3" y="13" width="6" height="4" rx="1"/><line x1="11" y1="15" x2="21" y2="15"/></svg>`;
    const svgRegularStr = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="8" height="6" rx="1"/><line x1="13" y1="6" x2="21" y2="6"/><rect x="3" y="14" width="8" height="6" rx="1"/><line x1="13" y1="16" x2="21" y2="16"/></svg>`;
    const svgSpaciousStr = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="10" height="7" rx="1"/><line x1="15" y1="5" x2="21" y2="5"/><rect x="3" y="14" width="10" height="7" rx="1"/><line x1="15" y1="16" x2="21" y2="16"/></svg>`;
    const svgExpandedStr = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="11" rx="2"/><line x1="3" y1="17" x2="21" y2="17"/><line x1="3" y1="21" x2="15" y2="21"/></svg>`;

    const parseSVG = (str) => new DOMParser().parseFromString(str, 'image/svg+xml').documentElement;

    const btnStyle = 'display:flex; align-items:center; justify-content:center; flex:1; gap:4px; font-size:11px; padding:5px 8px; border:none; cursor:pointer; transition:all 0.2s; font-weight:500; border-radius:6px; background:transparent; color:rgba(255,255,255,0.5);';

    const btnDense = document.createElement('button');
    btnDense.type = 'button';
    btnDense.className = 'sidebar-layout-btn';
    btnDense.dataset.layout = 'dense';
    btnDense.style.cssText = btnStyle;
    btnDense.appendChild(parseSVG(svgDenseStr));
    btnDense.appendChild(document.createTextNode(' Dense'));

    const btnCompact = document.createElement('button');
    btnCompact.type = 'button';
    btnCompact.className = 'sidebar-layout-btn';
    btnCompact.dataset.layout = 'compact';
    btnCompact.style.cssText = btnStyle;
    btnCompact.appendChild(parseSVG(svgCompactStr));
    btnCompact.appendChild(document.createTextNode(' Compact'));

    const btnRegular = document.createElement('button');
    btnRegular.type = 'button';
    btnRegular.className = 'sidebar-layout-btn';
    btnRegular.dataset.layout = 'regular';
    btnRegular.style.cssText = btnStyle;
    btnRegular.appendChild(parseSVG(svgRegularStr));
    btnRegular.appendChild(document.createTextNode(' Regular'));

    const btnSpacious = document.createElement('button');
    btnSpacious.type = 'button';
    btnSpacious.className = 'sidebar-layout-btn';
    btnSpacious.dataset.layout = 'spacious';
    btnSpacious.style.cssText = btnStyle;
    btnSpacious.appendChild(parseSVG(svgSpaciousStr));
    btnSpacious.appendChild(document.createTextNode(' Spacious'));

    const btnExpanded = document.createElement('button');
    btnExpanded.type = 'button';
    btnExpanded.className = 'sidebar-layout-btn';
    btnExpanded.dataset.layout = 'expanded';
    btnExpanded.style.cssText = btnStyle;
    btnExpanded.appendChild(parseSVG(svgExpandedStr));
    btnExpanded.appendChild(document.createTextNode(' Expanded'));

    toggleWrap.appendChild(btnDense);
    toggleWrap.appendChild(btnCompact);
    toggleWrap.appendChild(btnRegular);
    toggleWrap.appendChild(btnSpacious);
    toggleWrap.appendChild(btnExpanded);
    headerRow.appendChild(toggleWrap);
    wrap.appendChild(headerRow);



    // Hidden input
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = item.id;
    hiddenInput.value = item.default || 'spacious';
    wrap.appendChild(hiddenInput);

    // Logic
    const updateVisuals = (layout) => {
        [btnDense, btnCompact, btnRegular, btnSpacious, btnExpanded].forEach(b => {
            const isActive = b.dataset.layout === layout;
            b.classList.toggle('active', isActive);
            b.style.background = isActive ? 'color-mix(in srgb, var(--accent-primary) 22%, transparent)' : 'transparent';
            b.style.color = isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.5)';
        });
    };

    const applyActiveState = (layout) => {
        hiddenInput.value = layout;
        updateVisuals(layout);
        // Note: Do NOT force-enable enableCustomSidebar here.
        // The master toggle is independent of which layout variant is selected.
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Ensure robust saving
        import('./popup-state.js').then(module => {
            if (module.saveSettings) {
                module.saveSettings();
            }
        });
    };

    btnDense.onclick = () => applyActiveState('dense');
    btnCompact.onclick = () => applyActiveState('compact');
    btnRegular.onclick = () => applyActiveState('regular');
    btnSpacious.onclick = () => applyActiveState('spacious');
    btnExpanded.onclick = () => applyActiveState('expanded');

    const originalValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    Object.defineProperty(hiddenInput, 'value', {
        get: function() { return originalValueDesc.get.call(this); },
        set: function(val) {
            originalValueDesc.set.call(this, val);
            updateVisuals(val);
        }
    });

    // Initialize UI visual state without triggering save
    updateVisuals(hiddenInput.value);

    // Lock logic for Immersive Glass
    const enforceLock = () => {
        // ONLY lock the sidebar layout
        if (item.id !== 'sidebarLayout') {
            return;
        }

        const lockIcon = wrap.querySelector('#sidebar-layout-lock');
        const cardStyleInput = document.getElementById('cardStyle');
        const isLocked = cardStyleInput && cardStyleInput.value === 'immersive-glass';
        
        if (isLocked) {
            if (lockIcon) lockIcon.style.display = 'inline-block';
            toggleWrap.style.pointerEvents = 'none';
            toggleWrap.style.opacity = '0.5';
            updateVisuals('expanded');
            if (hiddenInput.value !== 'expanded') {
                hiddenInput.value = 'expanded';
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            // Note: Do NOT force-enable enableCustomSidebar here.
            // Immersive Glass lock only controls the layout variant buttons,
            // not whether the user has the custom sidebar enabled at all.
        } else {
            if (lockIcon) lockIcon.style.display = 'none';
            toggleWrap.style.pointerEvents = 'auto';
            toggleWrap.style.opacity = '1';
            updateVisuals(hiddenInput.value);
        }
    };

    // Wait for DOM to finish rendering schema before attaching listener
    setTimeout(() => {
        const cardStyleInput = document.getElementById('cardStyle');
        if (cardStyleInput) {
            cardStyleInput.addEventListener('change', enforceLock);
            enforceLock();
        }
    }, 150);
    
    _registerInput(hiddenInput, state);
    return wrap;
}

function renderCustomSlot(item) {
    if (item.hidden) return null;
    // The slot element will be filled by the custom renderer registered
    // via CUSTOM_SLOT_RENDERERS.set(id, fn)
    const slot = document.createElement('div');
    slot.id = item.slot || item.id;
    slot.dataset.slot = item.slot || item.id;
    if (item.class) slot.className = item.class;
    if (item.style) slot.style.cssText = item.style;
    return slot;
}

function renderInlineToggle(item, state) {
    if (item.hidden && (typeof item.hidden === 'function' ? item.hidden(state) : item.hidden)) return null;

    const wrap = document.createElement('div');
    wrap.className = 'inline-setting-row';
    wrap.style.marginTop = '8px';

    const infoGroup = document.createElement('div');
    infoGroup.style.display = 'flex';
    infoGroup.style.alignItems = 'center';
    infoGroup.style.gap = '12px';

    if (item.icon) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'feature-icon';
        iconWrap.style.flexShrink = '0';
        iconWrap.appendChild(makeSVG(item.icon, 14));
        infoGroup.appendChild(iconWrap);
    }

    const info = document.createElement('div');
    info.className = 'info';
    info.style.display = 'flex';
    info.style.flexDirection = 'column';

    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.style.cssText = 'display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px;';
    nameEl.textContent = item.label;
    if (item.desc) {
        nameEl.appendChild(createHelpButton(item.desc));
    }
    info.appendChild(nameEl);
    infoGroup.appendChild(info);
    wrap.appendChild(infoGroup);

    const label = document.createElement('label');
    label.className = 'toggle';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = item.id;
    label.appendChild(input);
    const span = document.createElement('span');
    span.className = 'slider';
    label.appendChild(span);
    wrap.appendChild(label);

    _registerInput(input, state);
    return wrap;
}

function renderColor(item, state) {
    if (item.hidden) return null;

    const wrap = document.createElement('div');
    wrap.className = 'inline-setting-row';
    wrap.style.marginTop = '8px';

    const infoGroup = document.createElement('div');
    infoGroup.style.display = 'flex';
    infoGroup.style.alignItems = 'center';
    infoGroup.style.gap = '12px';

    if (item.icon) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'feature-icon';
        iconWrap.style.flexShrink = '0';
        iconWrap.appendChild(makeSVG(item.icon, 14));
        infoGroup.appendChild(iconWrap);
    }

    const info = document.createElement('div');
    info.className = 'info';
    info.style.display = 'flex';
    info.style.flexDirection = 'column';

    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.style.cssText = 'display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px;';
    nameEl.textContent = item.label;
    if (item.desc) {
        nameEl.appendChild(createHelpButton(item.desc));
    }
    info.appendChild(nameEl);
    infoGroup.appendChild(info);
    wrap.appendChild(infoGroup);

    const input = document.createElement('input');
    input.type = 'color';
    input.id = item.id;
    input.className = 'color-picker';
    input.style.border = 'none';
    input.style.width = '32px';
    input.style.height = '32px';
    input.style.borderRadius = '8px';
    input.style.padding = '0';
    input.style.background = 'none';
    input.style.cursor = 'pointer';
    wrap.appendChild(input);

    _registerInput(input, state);
    return wrap;
}

function renderButtonGroup(item, state) {
    if (item.hidden) return null;

    const isWide = item.class && item.class.includes('span-2');

    const wrap = document.createElement('div');
    wrap.className = `toggle-card ${item.class || ''}`.trim();
    wrap.style.flexDirection = isWide ? 'row' : 'column';
    wrap.style.alignItems = isWide ? 'center' : 'stretch';
    wrap.style.justifyContent = isWide ? 'space-between' : 'center';
    wrap.style.flexWrap = isWide ? 'nowrap' : 'wrap';
    wrap.style.gap = '8px';

    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.alignItems = 'center';
    headerRow.style.gap = '10px';
    if (isWide) {
        headerRow.style.flex = '1';
    }

    let iconWrap = null;
    if (item.icon) {
        iconWrap = document.createElement('div');
        iconWrap.className = 'feature-icon';
        iconWrap.style.flexShrink = '0';
        iconWrap.appendChild(makeSVG(item.icon, 14));
        headerRow.appendChild(iconWrap);
    }

    const info = document.createElement('div');
    info.className = 'info';
    info.style.display = 'flex';
    info.style.flexDirection = 'column';

    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.style.cssText = 'display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px;';
    nameEl.textContent = item.label;
    if (item.desc) {
        nameEl.appendChild(createHelpButton(item.desc));
    }
    info.appendChild(nameEl);
    headerRow.appendChild(info);
    wrap.appendChild(headerRow);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '4px';
    
    if (isWide) {
        btnGroup.style.width = '240px';
        btnGroup.style.flexShrink = '0';
        btnGroup.style.marginTop = '0';
        btnGroup.style.marginLeft = 'auto';
    } else {
        btnGroup.style.marginTop = '4px';
    }
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.id = item.id;
    wrap.appendChild(input);

    const btns = [];
    (item.options || []).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'group-btn';
        btn.textContent = opt.label;
        btn.dataset.value = opt.value;
        
        btn.style.flex = '1';
        btn.style.padding = '6px 4px';
        btn.style.fontSize = '10px';
        btn.style.background = 'rgba(255,255,255,0.05)';
        btn.style.border = '1px solid rgba(255,255,255,0.1)';
        btn.style.color = 'rgba(255,255,255,0.5)';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s ease';
        
        btn.onclick = () => {
            btns.forEach(b => {
                b.style.background = 'rgba(255,255,255,0.05)';
                b.style.color = 'rgba(255,255,255,0.5)';
                b.style.borderColor = 'rgba(255,255,255,0.1)';
            });
            btn.style.background = 'color-mix(in srgb, var(--accent-primary) 22%, transparent)';
            btn.style.color = 'var(--accent-primary)';
            btn.style.borderColor = 'color-mix(in srgb, var(--accent-primary) 50%, transparent)';
            
            input.value = opt.value;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        };
        
        btns.push(btn);
        btnGroup.appendChild(btn);
    });
    
    wrap.appendChild(btnGroup);

    const originalValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    Object.defineProperty(input, 'value', {
        get: function() { return originalValueDesc.get.call(this); },
        set: function(val) {
            originalValueDesc.set.call(this, val);
            const activeBtn = btns.find(b => b.dataset.value === val) || btns[0];
            if (activeBtn) {
                btns.forEach(b => {
                    b.style.background = 'rgba(255,255,255,0.05)';
                    b.style.color = 'rgba(255,255,255,0.5)';
                    b.style.borderColor = 'rgba(255,255,255,0.1)';
                });
                activeBtn.style.background = 'color-mix(in srgb, var(--accent-primary) 22%, transparent)';
                activeBtn.style.color = 'var(--accent-primary)';
                activeBtn.style.borderColor = 'color-mix(in srgb, var(--accent-primary) 50%, transparent)';
            }
            if (iconWrap) {
                if (val && val !== 'hidden') {
                    iconWrap.classList.add('active');
                } else {
                    iconWrap.classList.remove('active');
                }
            }
        }
    });

    _registerInput(input, state);
    return wrap;
}

const ITEM_RENDERERS = {
    toggle: renderToggle,
    inlineToggle: renderInlineToggle,
    range:  renderRange,
    select: renderSelect,
    color: renderColor,
    layoutToggle: renderLayoutToggle,
    custom: renderCustomSlot,
    'button-group': renderButtonGroup,
};


// ── Section builder ────────────────────────────────────────────────────

/** Apply consistent tile styling to a child element inside the expanded parent card. */
function applyChildTileStyle(el) {
    el.style.marginTop    = '0';
    el.style.paddingTop   = '0';
    el.style.borderTop    = 'none';
    el.style.background   = 'rgba(0,0,0,0.15)';
    el.style.padding      = '10px 12px';
    el.style.borderRadius = '8px';
    el.style.boxSizing    = 'border-box';
}

/** Build a full-width header row by draining the existing children of parentEl. */
function buildParentHeaderRow(parentEl) {
    const headerRow = document.createElement('div');
    headerRow.style.cssText = 'display:flex; align-items:center; width:100%; gap:10px;';
    while (parentEl.firstChild) headerRow.appendChild(parentEl.firstChild);
    return headerRow;
}

/** Build the 4-column sub-settings grid for a parent card. */
function buildChildrenGrid(childItems, state) {
    const grid = document.createElement('div');
    grid.className = 'children-container';
    grid.style.cssText = [
        'width:100%',
        'display:grid',
        'grid-template-columns:repeat(4,1fr)',
        'gap:12px',
        'margin-top:16px',
        'padding-top:16px',
        'border-top:1px solid rgba(255,255,255,0.06)',
    ].join(';');

    childItems.forEach(childItem => {
        const renderer = ITEM_RENDERERS[childItem.type];
        if (!renderer) return;
        const childEl = renderer(childItem, state);
        if (!childEl) return;
        applyChildTileStyle(childEl);
        grid.appendChild(childEl);
    });

    return grid;
}

/** Expand a toggle card to full-width and inject its children as a 4-tile grid. */
function expandParentCardWithChildren(parentEl, childItems, state) {
    parentEl.style.gridColumn   = '1 / -1';
    parentEl.style.flexDirection = 'column';
    parentEl.style.alignItems   = 'stretch';
    parentEl.classList.add('span-full-tile');

    const headerRow    = buildParentHeaderRow(parentEl);
    const childrenGrid = buildChildrenGrid(childItems, state);

    parentEl.appendChild(headerRow);
    parentEl.appendChild(childrenGrid);
}

function buildSection(section, state) {
    const sec = document.createElement('div');
    sec.className = 'settings-section';

    // Header
    const hdr = document.createElement('div');
    hdr.className = 'section-header';
    hdr.innerHTML = `
        <div class="section-title-wrap">
            <div class="section-text-wrap">
                <div class="section-title">
                    ${section.icon ? `<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">${section.icon}</svg>` : ''}
                    ${section.title}
                </div>
                ${section.subtitle ? `<div class="section-subtitle">${section.subtitle}</div>` : ''}
            </div>
        </div>`;
    sec.appendChild(hdr);

    // Content Wrapper for collapsing
    const content = document.createElement('div');
    content.className = 'section-content';
    const contentInner = document.createElement('div');
    contentInner.className = 'section-content-inner';

    // Group
    const grp = document.createElement('div');
    grp.className = 'card-group';

    // Separate items into grid-eligible, full-width, and children
    const nonChildren = section.items.filter(i => !i.parent && !i.hidden);
    const children    = section.items.filter(i => i.parent && !i.hidden);

    const gridItems  = nonChildren.filter(i => i.type === 'toggle' || i.type === 'button-group' || i.type === 'range' || i.type === 'select' || i.type === 'custom');
    const inlineToggleItems = nonChildren.filter(i => i.type === 'inlineToggle');
    const otherItems  = nonChildren.filter(i => i.type !== 'toggle' && i.type !== 'button-group' && i.type !== 'inlineToggle' && i.type !== 'range' && i.type !== 'select' && i.type !== 'custom');

    const renderedElements = {};

    if (gridItems.length > 0) {
        const grid = document.createElement('div');
        grid.className = 'feature-grid';
        gridItems.forEach(item => {
            const fn = ITEM_RENDERERS[item.type];
            const el = fn ? fn(item, state) : null;
            if (el) {
                renderedElements[item.id] = el;
                grid.appendChild(el);
            }
        });
        grp.appendChild(grid);

        // Emit slot divs INSIDE the parent toggle card
        gridItems.forEach(item => {
            if (item.slot) {
                let slot = document.getElementById(item.slot);
                if (!slot) {
                    slot = document.createElement('div');
                    slot.id = item.slot;
                }
                const parentEl = renderedElements[item.id];
                if (parentEl) {
                    parentEl.appendChild(slot); // Append inside the card
                } else {
                    grp.appendChild(slot); // Fallback
                }
            }
        });
    }

    // Group children by parent id and expand each parent card into a 4-tile grid
    const childrenByParent = {};
    children.forEach(childItem => {
        const list = childrenByParent[childItem.parent] ?? (childrenByParent[childItem.parent] = []);
        list.push(childItem);
    });

    Object.entries(childrenByParent).forEach(([parentId, childItems]) => {
        const parentEl = renderedElements[parentId];
        if (parentEl) expandParentCardWithChildren(parentEl, childItems, state);
    });

    if (inlineToggleItems.length > 0) {
        const grid = document.createElement('div');
        grid.className = 'select-grid';
        inlineToggleItems.forEach(item => {
            const fn = ITEM_RENDERERS[item.type];
            const el = fn ? fn(item, state) : null;
            if (el) grid.appendChild(el);
        });
        grp.appendChild(grid);
    }

    if (otherItems.length > 0) {
        otherItems.forEach(item => {
            const fn = ITEM_RENDERERS[item.type];
            const el = fn ? fn(item, state) : null;
            if (el) grp.appendChild(el);
        });
    }

    contentInner.appendChild(grp);
    content.appendChild(contentInner);
    sec.appendChild(content);
    return sec;
}

// ── State registration ─────────────────────────────────────────────────

function _registerInput(input, state) {
    if (!state || !input.id) return;
    // Don't double-register (popup-state.js may have already picked it up
    // from the HTML shell via initStorage())
    if (state.elements[input.id]) return;
    state.elements[input.id] = input;
    if (!state.settingKeys.includes(input.id)) {
        state.settingKeys.push(input.id);
    }
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Render all non-custom schema tabs into the #tabs-container element.
 * @param {Document} doc
 * @param {object}   state   — from popup-state.js
 */
export function renderSchema(doc, state, t) {
    const main = doc.getElementById('tabs-container') || doc.querySelector('main');
    if (!main) {
        console.warn('[YPP:Renderer] No #tabs-container or <main> found — skipping schema render');
        return;
    }

    const schema = getPopupSchema(t);

    schema.forEach(tab => {
        // Skip custom tabs — they have their HTML in popup.html
        if (tab.custom) return;

        const section = doc.getElementById(`tab-${tab.id}`);
        if (!section) return; // section must exist in HTML shell

        // Clear placeholder content (if any) and inject schema-generated sections
        // But preserve anything with data-preserve="true"
        Array.from(section.children)
            .filter(el => !el.dataset.preserve)
            .forEach(el => el.remove());

        tab.sections.forEach(s => {
            const node = buildSection(s, state);
            const firstPreserved = Array.from(section.children).find(el => el.dataset.preserve === 'true');
            if (firstPreserved) {
                section.insertBefore(node, firstPreserved);
            } else {
                section.appendChild(node);
            }
        });
    });

    // Run custom slot renderers
    CUSTOM_SLOT_RENDERERS.forEach((fn, slotId) => {
        const el = doc.getElementById(slotId);
        if (el) fn(el, state);
    });

    // Convert static/HTML tab descriptions to interactive round ? help badges
    convertStaticDescriptionsToHelpButtons(doc);
}

/**
 * Register a custom slot renderer.
 * @param {string}   slotId   — matches item.slot in schema
 * @param {Function} fn       — (container, state) => void
 */
export function registerSlot(slotId, fn) {
    CUSTOM_SLOT_RENDERERS.set(slotId, fn);
}

/**
 * Utility: look up a schema item by its setting id across all tabs.
 * Useful for components that need to reflect schema metadata (e.g. label for a search hit).
 * @param {string} settingId
 * @returns {object|null}
 */
export function findSchemaItem(settingId, t) {
    const schema = getPopupSchema(t);
    for (const tab of schema) {
        for (const section of (tab.sections || [])) {
            for (const item of (section.items || [])) {
                if (item.id === settingId) return { tab, section, item };
            }
        }
    }
    return null;
}
