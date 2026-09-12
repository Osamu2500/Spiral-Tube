/**
 * Popup Design Tab — Interactive Handler
 * Powers all sliders, segmented pickers, presets, and swatch interactions.
 */
export function initPopupDesignScale(doc, chrome) {

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const $ = (id) => doc.getElementById(id);
    const $$ = (sel) => doc.querySelectorAll(sel);

    const setCSS = (prop, val) => document.documentElement.style.setProperty(prop, val);

    const dispatchBoth = (el) => {
        el.dispatchEvent(new Event('input',  { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const sliderProgress = (slider) => {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const pct = ((val - min) / (max - min)) * 100;
        slider.style.setProperty('--pd-progress', pct + '%');
    };

    // ─── CSS Live-Apply on slider input ──────────────────────────────────────
    const SLIDER_CSS_MAP = {
        popupWidth:  (v) => setCSS('--popup-width',    v + 'px'),
        popupHeight: (v) => setCSS('--popup-height',   v + 'px'),
        popupZoom:   (v) => setCSS('--popup-zoom',     v),
        popupRadius: (v) => setCSS('--ui-radius',      v + 'px'),
        fontScale:   (v) => setCSS('--ui-font-scale',  (v / 100).toFixed(2)),
    };

    // ─── Undo Stack ───────────────────────────────────────────────────────────
    const undoStack = [];
    let undoTimer;

    const undoChip = (() => {
        const chip = doc.createElement('div');
        chip.className = 'pd-undo-chip';
        chip.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:11px;height:11px;flex-shrink:0"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg><span>Undo</span>`;
        const grid = doc.querySelector('.pd-scale-grid');
        if (grid) {
            grid.style.position = 'relative';
            grid.appendChild(chip);
        }
        chip.addEventListener('click', () => {
            if (!undoStack.length) return;
            const { id, value } = undoStack.pop();
            const el = $(id);
            if (el) { el.value = value; dispatchBoth(el); }
            chip.classList.remove('pd-undo-visible');
        });
        return {
            show() {
                clearTimeout(undoTimer);
                chip.classList.add('pd-undo-visible');
                undoTimer = setTimeout(() => chip.classList.remove('pd-undo-visible'), 3000);
            }
        };
    })();

    // ─── Sliders ──────────────────────────────────────────────────────────────
    ['popupZoom', 'popupWidth', 'popupHeight', 'popupRadius', 'fontScale'].forEach(id => {
        const el = $(id);
        if (!el) return;

        sliderProgress(el);
        let lastVal = el.value;

        el.addEventListener('mousedown', () => { lastVal = el.value; });

        el.addEventListener('input', () => {
            sliderProgress(el);
            SLIDER_CSS_MAP[id]?.(el.value);
            if (el.value !== lastVal) {
                undoStack.push({ id, value: lastVal });
                if (undoStack.length > 8) undoStack.shift();
                undoChip.show();
                lastVal = el.value;
            }
        });

        // Right-click resets to default
        const defaults = { popupZoom: '0.65', popupWidth: '560', popupHeight: '600', popupRadius: '12', fontScale: '100' };
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (defaults[id] !== undefined) {
                undoStack.push({ id, value: el.value });
                el.value = defaults[id];
                dispatchBoth(el);
                undoChip.show();
            }
        });
    });

    // ─── Value Badge Updates ──────────────────────────────────────────────────
    const badgeUpdaters = {
        popupWidth:  (v) => `${Math.round(v)}px`,
        popupHeight: (v) => `${Math.round(v)}px`,
        popupZoom:   (v) => parseFloat(v).toFixed(2),
        popupRadius: (v) => `${Math.round(v)}px`,
        fontScale:   (v) => `${Math.round(v)}%`,
    };

    Object.entries(badgeUpdaters).forEach(([id, fmt]) => {
        const slider = $(id);
        const badge  = $(`${id}Value`);
        if (!slider || !badge) return;

        const update = () => { badge.textContent = fmt(slider.value); };
        slider.addEventListener('input', update);
        update();

        // Double-click badge to type value directly
        badge.title = 'Double-click to type';
        badge.addEventListener('dblclick', () => {
            badge.contentEditable = 'true';
            badge.classList.add('pd-val-editing');
            badge.focus();
            document.execCommand('selectAll', false, null);
            const done = () => {
                badge.contentEditable = 'false';
                badge.classList.remove('pd-val-editing');
                const raw = parseFloat(badge.textContent);
                if (!isNaN(raw)) {
                    slider.value = Math.min(parseFloat(slider.max), Math.max(parseFloat(slider.min), raw));
                    dispatchBoth(slider);
                } else {
                    update();
                }
            };
            badge.addEventListener('blur', done, { once: true });
            badge.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); badge.blur(); } }, { once: true });
        });
    });

    // ─── Zone Labels ──────────────────────────────────────────────────────────
    const updateZone = (zone, label, cls) => {
        if (!zone) return;
        zone.textContent = label;
        zone.className = `pd-scale-zone${cls ? ' pd-zone-' + cls : ''}`;
    };

    const updateZoomZone = () => {
        const v = parseFloat($('popupZoom')?.value ?? 0.65);
        if      (v <= 0.35) updateZone($('popupZoomZone'), 'Too Small', 'danger');
        else if (v <= 0.55) updateZone($('popupZoomZone'), 'Compact',   'warn');
        else if (v <= 0.75) updateZone($('popupZoomZone'), 'Comfortable', 'ok');
        else                updateZone($('popupZoomZone'), 'Large',     'accent');
    };

    const updateWidthZone = () => {
        const v = parseFloat($('popupWidth')?.value ?? 560);
        if      (v === 560) updateZone($('popupWidthZone'), '✓ Default', 'ok');
        else if (v >= 720)  updateZone($('popupWidthZone'), '⚠ Very Wide', 'warn');
        else if (v < 480)   updateZone($('popupWidthZone'), 'Narrow',    'warn');
        else                updateZone($('popupWidthZone'), 'Custom',    '');
    };

    const updateRadiusZone = () => {
        const v = parseFloat($('popupRadius')?.value ?? 12);
        const swatch = $('radiusPreviewSwatch');
        if (swatch) swatch.style.borderRadius = v + 'px';
        if      (v === 0)  updateZone($('popupRadiusZone'), 'Square',  '');
        else if (v <= 5)   updateZone($('popupRadiusZone'), 'Subtle',  '');
        else if (v <= 14)  updateZone($('popupRadiusZone'), 'Rounded', 'ok');
        else               updateZone($('popupRadiusZone'), 'Pill',    'accent');
    };

    $('popupZoom')?.addEventListener('input', updateZoomZone);
    $('popupWidth')?.addEventListener('input', updateWidthZone);
    $('popupRadius')?.addEventListener('input', updateRadiusZone);
    updateZoomZone(); updateWidthZone(); updateRadiusZone();

    // ─── Font Sample Live Preview ─────────────────────────────────────────────
    const fontSlider = $('fontScale');
    const fontSample = $('fontScaleSample');
    const updateFontSample = () => {
        if (!fontSlider || !fontSample) return;
        const pct = parseFloat(fontSlider.value) / 100;
        fontSample.style.fontSize = (11 * pct) + 'px';
    };
    fontSlider?.addEventListener('input', updateFontSample);
    updateFontSample();

    // ─── Grid Columns Segmented ───────────────────────────────────────────────
    const gridPicker = $('featureGridColsSegmented');
    const gridInput  = $('featureGridCols');
    const gridBadge  = $('featureGridColsValue');
    const gridPreview = $('gridMiniPreview');

    const updateGridPreview = (cols) => {
        if (!gridPreview) return;
        gridPreview.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridPreview.innerHTML = Array.from({ length: parseInt(cols) }, () => '<div class="pd-grid-cell"></div>').join('');
    };

    const syncGridActive = () => {
        gridPicker?.querySelectorAll('.pd-seg-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === gridInput?.value);
        });
    };

    gridPicker?.querySelectorAll('.pd-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (gridInput) gridInput.value = btn.dataset.value;
            if (gridBadge) gridBadge.textContent = btn.dataset.value;
            syncGridActive();
            updateGridPreview(btn.dataset.value);
            if (gridInput) dispatchBoth(gridInput);
        });
    });

    syncGridActive();
    updateGridPreview(gridInput?.value ?? '4');

    // ─── UI Density Segmented ─────────────────────────────────────────────────
    const densityPicker = $('densitySegmented');
    const densityInput  = $('popupDensity');
    const densityBadge  = $('popupDensityValue');

    const syncDensityActive = () => {
        densityPicker?.querySelectorAll('.pd-seg-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === densityInput?.value);
        });
    };

    densityPicker?.querySelectorAll('.pd-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (densityInput) {
                densityInput.value = btn.dataset.value;
                setCSS('--ui-density', btn.dataset.value);
            }
            if (densityBadge) densityBadge.textContent = btn.dataset.label || btn.dataset.value;
            syncDensityActive();
            if (densityInput) dispatchBoth(densityInput);
        });
    });

    densityInput?.addEventListener('input', () => {
        const active = densityPicker?.querySelector(`[data-value="${densityInput.value}"]`);
        if (densityBadge) densityBadge.textContent = active?.dataset.label ?? densityInput.value;
        syncDensityActive();
    });

    syncDensityActive();

    // ─── Accent Color Swatches ────────────────────────────────────────────────
    const accentInput = $('accentColor');
    const accentChip  = doc.querySelector('#accentChipPreview');

    const updateAccentUI = (color) => {
        document.documentElement.style.setProperty('--accent-primary', color);
        if (accentChip) {
            accentChip.style.background = color;
            accentChip.style.boxShadow = `0 0 10px ${color}88`;
        }
        doc.querySelectorAll('#accentSwatches .pd-swatch').forEach(s => {
            s.classList.toggle('pd-swatch-active', s.dataset.color === color);
        });
    };

    doc.querySelectorAll('#accentSwatches .pd-swatch[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            if (accentInput) { accentInput.value = color; dispatchBoth(accentInput); }
            updateAccentUI(color);
        });
    });

    accentInput?.addEventListener('input', () => updateAccentUI(accentInput.value));
    accentInput?.addEventListener('change', () => updateAccentUI(accentInput.value));
    if (accentInput) updateAccentUI(accentInput.value);

    // Dual gradient secondary swatches
    const dualToggle  = $('enableDualAccent');
    const secInput    = $('secondaryAccentColor');
    const secSwatches = $('secondaryAccentSwatches');

    const updateSecondaryUI = (color) => {
        document.documentElement.style.setProperty('--accent-secondary', color);
        secSwatches?.querySelectorAll('.pd-swatch[data-sec-color]').forEach(s => {
            s.classList.toggle('pd-swatch-active', s.dataset.secColor === color);
        });
    };

    secSwatches?.querySelectorAll('.pd-swatch[data-sec-color]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!dualToggle?.checked) return;
            const color = btn.dataset.secColor;
            if (secInput) { secInput.value = color; dispatchBoth(secInput); }
            updateSecondaryUI(color);
        });
    });

    secInput?.addEventListener('change', () => updateSecondaryUI(secInput.value));

    // ─── Popup Theme Cards ────────────────────────────────────────────────────
    doc.querySelectorAll('.pd-theme-card').forEach(card => {
        card.addEventListener('click', () => {
            doc.querySelectorAll('.pd-theme-card').forEach(c => c.classList.remove('pd-theme-active'));
            card.classList.add('pd-theme-active');
        });
    });

    // ─── Presets ──────────────────────────────────────────────────────────────
    const setAllScale = (config) => {
        Object.entries(config).forEach(([id, val]) => {
            const el = $(id);
            if (el) { el.value = val; dispatchBoth(el); }
        });
        // Sync grid & density segmented visuals
        syncGridActive(); syncDensityActive();
        updateGridPreview($('' + 'featureGridCols')?.value ?? '4');
    };

    const flashPreset = (btn) => {
        btn.classList.add('pd-preset-applied');
        setTimeout(() => btn.classList.remove('pd-preset-applied'), 600);
    };

    $('presetScaleDefault')?.addEventListener('click', (e) => {
        flashPreset(e.currentTarget);
        setAllScale({ popupZoom: '0.65', popupWidth: '560', popupHeight: '600', popupRadius: '12', fontScale: '100', featureGridCols: '4', popupDensity: '1.0' });
    });

    $('presetScaleCompact')?.addEventListener('click', (e) => {
        flashPreset(e.currentTarget);
        setAllScale({ popupZoom: '0.5', popupWidth: '450', popupHeight: '500', popupRadius: '8',  fontScale: '90',  featureGridCols: '3', popupDensity: '0.85' });
    });

    $('presetScaleWide')?.addEventListener('click', (e) => {
        flashPreset(e.currentTarget);
        setAllScale({ popupZoom: '0.8', popupWidth: '800', popupHeight: '650', popupRadius: '16', fontScale: '110', featureGridCols: '6', popupDensity: '1.2' });
    });

    // Save / Load Custom Preset
    const saveBtn   = $('presetScaleSave');
    const customBtn = $('presetScaleCustom');

    const getSnapshot = () => ({
        popupZoom:       $('popupZoom')?.value,
        popupWidth:      $('popupWidth')?.value,
        popupHeight:     $('popupHeight')?.value,
        featureGridCols: $('featureGridCols')?.value,
        popupDensity:    $('popupDensity')?.value,
        popupRadius:     $('popupRadius')?.value,
        fontScale:       $('fontScale')?.value,
    });

    chrome.storage.local.get(['customScalePreset'], (res) => {
        if (res.customScalePreset && customBtn) customBtn.style.display = '';
    });

    saveBtn?.addEventListener('click', () => {
        chrome.storage.local.set({ customScalePreset: getSnapshot() }, () => {
            if (customBtn) customBtn.style.display = '';
            flashPreset(saveBtn);
            const lastNode = saveBtn.childNodes[saveBtn.childNodes.length - 1];
            const orig = lastNode?.textContent ?? '';
            if (lastNode) lastNode.textContent = ' Saved ✓';
            setTimeout(() => { if (lastNode) lastNode.textContent = orig; }, 1500);
        });
    });

    customBtn?.addEventListener('click', () => {
        chrome.storage.local.get(['customScalePreset'], (res) => {
            if (!res.customScalePreset) return;
            setAllScale(res.customScalePreset);
            flashPreset(customBtn);
        });
    });
}
