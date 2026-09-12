import { ICONS, P } from '../../ui/popup-icons.js';

// ─── Accent Color preset palette ────────────────────────────────────────────
const ACCENT_COLORS = [
    { color: '#6366f1', label: 'Indigo' },
    { color: '#3ea6ff', label: 'Blue' },
    { color: '#10b981', label: 'Emerald' },
    { color: '#f59e0b', label: 'Amber' },
    { color: '#ef4444', label: 'Red' },
    { color: '#ec4899', label: 'Pink' },
    { color: '#8b5cf6', label: 'Violet' },
    { color: '#06b6d4', label: 'Cyan' },
];

// ─── Accent Color Slot ───────────────────────────────────────────────────────
export function renderAccentColorSlot(container, state) {
    container.className = 'pd-section-body';
    container.innerHTML = `
      <div class="pd-accent-wrap">
        <!-- Primary Color -->
        <div class="pd-color-block">
          <div class="pd-color-header">
            <span class="pd-color-label">Primary Color</span>
            <span class="pd-color-preview-chip" id="accentChipPreview"></span>
          </div>
          <div class="pd-swatches" id="accentSwatches" role="group" aria-label="Accent Color">
            ${ACCENT_COLORS.map(c => `
              <button type="button" class="pd-swatch" data-color="${c.color}" style="--swatch-color:${c.color}" title="${c.label}" aria-label="${c.label}"></button>
            `).join('')}
            <label class="pd-swatch pd-swatch-custom" title="Custom Color" aria-label="Custom Color">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              <input type="color" id="accentColor" value="#6366f1" tabindex="-1" aria-label="Custom Accent Color">
            </label>
          </div>
        </div>

        <!-- Dual Gradient Accent -->
        <div class="pd-color-block pd-gradient-block">
          <div class="pd-color-header">
            <span class="pd-color-label">Dual Gradient Accent</span>
            <label class="toggle pd-toggle-sm">
              <input type="checkbox" id="enableDualAccent" aria-label="Enable Dual Gradient Accent">
              <span class="slider"></span>
            </label>
          </div>
          <div class="pd-swatches pd-swatches-secondary pd-gradient-disabled" id="secondaryAccentSwatches" role="group" aria-label="Secondary Accent Color">
            ${ACCENT_COLORS.map(c => `
              <button type="button" class="pd-swatch secondary-color-swatch" data-sec-color="${c.color}" style="--swatch-color:${c.color}" title="${c.label}" aria-label="${c.label}"></button>
            `).join('')}
            <label class="pd-swatch pd-swatch-custom" title="Custom Secondary Color" aria-label="Custom Secondary Color">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              <input type="color" id="secondaryAccentColor" value="#8b5cf6" tabindex="-1" aria-label="Custom Secondary Accent Color">
            </label>
          </div>
        </div>
      </div>
    `;

    // Restore saved values
    const accentInput = container.querySelector('#accentColor');
    const dualToggle  = container.querySelector('#enableDualAccent');
    const secInput    = container.querySelector('#secondaryAccentColor');

    if (state?.settings) {
        if (state.settings.accentColor) {
            accentInput.value = state.settings.accentColor;
            _markSwatchActive(container.querySelector('#accentSwatches'), state.settings.accentColor);
            _updateChip(container.querySelector('#accentChipPreview'), state.settings.accentColor);
        }
        if (state.settings.enableDualAccent) {
            dualToggle.checked = true;
            container.querySelector('.pd-swatches-secondary').classList.remove('pd-gradient-disabled');
        }
        if (state.settings.secondaryAccentColor) {
            secInput.value = state.settings.secondaryAccentColor;
            _markSwatchActive(container.querySelector('#secondaryAccentSwatches'), null, state.settings.secondaryAccentColor);
        }
    }

    // Dual toggle enables / disables secondary row
    dualToggle.addEventListener('change', () => {
        container.querySelector('.pd-swatches-secondary').classList.toggle('pd-gradient-disabled', !dualToggle.checked);
    });
}

function _markSwatchActive(group, color, secColor) {
    if (!group) return;
    group.querySelectorAll('.pd-swatch').forEach(s => {
        const attr = secColor !== undefined ? 'data-sec-color' : 'data-color';
        s.classList.toggle('pd-swatch-active', s.dataset[attr === 'data-color' ? 'color' : 'secColor'] === (color ?? secColor));
    });
}

function _updateChip(chip, color) {
    if (!chip) return;
    chip.style.background = color;
    chip.style.boxShadow = `0 0 8px ${color}88`;
}

// ─── Popup Scale Slot ────────────────────────────────────────────────────────
export function renderPopupScaleSlot(container, state) {
    container.className = 'pd-section-body';
    container.innerHTML = `
      <div class="pd-scale-grid">

        <!-- Width -->
        <div class="pd-scale-card" id="scaleCard-width">
          <div class="pd-scale-card-head">
            <span class="pd-scale-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="12" height="12"><path d="M21 12H3"/><path d="M18 9l3 3-3 3"/><path d="M6 9l-3 3 3 3"/></svg>
            </span>
            <span class="pd-scale-name">Width</span>
            <span class="pd-scale-zone" id="popupWidthZone"></span>
            <span class="pd-scale-val" id="popupWidthValue">560px</span>
          </div>
          <input type="range" class="pd-slider" id="popupWidth" min="400" max="800" step="10" aria-label="Popup Width">
        </div>

        <!-- Height -->
        <div class="pd-scale-card" id="scaleCard-height">
          <div class="pd-scale-card-head">
            <span class="pd-scale-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="12" height="12"><path d="M12 21V3"/><path d="M9 18l3 3 3-3"/><path d="M9 6l3-3 3 3"/></svg>
            </span>
            <span class="pd-scale-name">Height</span>
            <span class="pd-scale-val" id="popupHeightValue">600px</span>
          </div>
          <input type="range" class="pd-slider" id="popupHeight" min="400" max="700" step="10" aria-label="Popup Height">
        </div>

        <!-- Grid Columns -->
        <div class="pd-scale-card" id="scaleCard-grid">
          <div class="pd-scale-card-head">
            <span class="pd-scale-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="12" height="12"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </span>
            <span class="pd-scale-name">Grid Columns</span>
            <span class="pd-scale-val" id="featureGridColsValue">4</span>
          </div>
          <div class="pd-seg" id="featureGridColsSegmented" role="group" aria-label="Grid Columns">
            <button class="pd-seg-btn" data-value="2" type="button">2</button>
            <button class="pd-seg-btn" data-value="3" type="button">3</button>
            <button class="pd-seg-btn active" data-value="4" type="button">4</button>
            <button class="pd-seg-btn" data-value="5" type="button">5</button>
            <button class="pd-seg-btn" data-value="6" type="button">6</button>
            <button class="pd-seg-btn" data-value="7" type="button">7</button>
          </div>
          <input type="hidden" id="featureGridCols" value="4">
          <div class="pd-grid-preview" id="gridMiniPreview"></div>
        </div>

        <!-- UI Density -->
        <div class="pd-scale-card" id="scaleCard-density">
          <div class="pd-scale-card-head">
            <span class="pd-scale-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="12" height="12"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </span>
            <span class="pd-scale-name">UI Density</span>
            <span class="pd-scale-val" id="popupDensityValue">Normal</span>
          </div>
          <div class="pd-seg pd-seg-density" id="densitySegmented" role="group" aria-label="UI Density">
            <button class="pd-seg-btn" data-value="0.7" data-label="Ultra Compact" type="button">XS</button>
            <button class="pd-seg-btn" data-value="0.85" data-label="Compact" type="button">S</button>
            <button class="pd-seg-btn active" data-value="1.0" data-label="Normal" type="button">M</button>
            <button class="pd-seg-btn" data-value="1.2" data-label="Comfortable" type="button">L</button>
            <button class="pd-seg-btn" data-value="1.4" data-label="Spacious" type="button">XL</button>
          </div>
          <input type="hidden" id="popupDensity" value="1.0">
        </div>

        <!-- Zoom Level -->
        <div class="pd-scale-card" id="scaleCard-zoom">
          <div class="pd-scale-card-head">
            <span class="pd-scale-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="12" height="12"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
            <span class="pd-scale-name">Zoom Level</span>
            <span class="pd-scale-zone" id="popupZoomZone"></span>
            <span class="pd-scale-val" id="popupZoomValue">0.65</span>
          </div>
          <input type="range" class="pd-slider" id="popupZoom" min="0.2" max="1.0" step="0.05" aria-label="Popup Zoom">
        </div>

        <!-- UI Roundness -->
        <div class="pd-scale-card" id="scaleCard-radius">
          <div class="pd-scale-card-head">
            <span class="pd-scale-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="12" height="12"><rect x="3" y="3" width="18" height="18" rx="6"/></svg>
            </span>
            <span class="pd-scale-name">UI Roundness</span>
            <span class="pd-scale-zone" id="popupRadiusZone"></span>
            <span class="pd-scale-val" id="popupRadiusValue">12px</span>
          </div>
          <div class="pd-radius-row">
            <input type="range" class="pd-slider" id="popupRadius" min="0" max="24" step="1" aria-label="UI Roundness">
            <div class="pd-radius-swatch" id="radiusPreviewSwatch"></div>
          </div>
        </div>

        <!-- Font Scale -->
        <div class="pd-scale-card" id="scaleCard-font">
          <div class="pd-scale-card-head">
            <span class="pd-scale-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="12" height="12"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            </span>
            <span class="pd-scale-name">Font Scale</span>
            <span class="pd-scale-val" id="fontScaleValue">100%</span>
          </div>
          <input type="range" class="pd-slider" id="fontScale" min="80" max="150" step="5" aria-label="Font Scale">
          <div class="pd-font-sample" id="fontScaleSample">The quick brown fox</div>
        </div>

        <!-- Quick Presets -->
        <div class="pd-scale-card pd-presets-card">
          <p class="pd-presets-label">Quick Presets</p>
          <div class="pd-presets-row">
            <button type="button" class="pd-preset-btn" id="presetScaleDefault">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
              Reset
            </button>
            <button type="button" class="pd-preset-btn" id="presetScaleCompact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>
              Compact
            </button>
            <button type="button" class="pd-preset-btn" id="presetScaleWide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
              Wide
            </button>
          </div>
          <div class="pd-presets-row pd-presets-row2">
            <button type="button" class="pd-preset-btn pd-preset-save" id="presetScaleSave">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Custom
            </button>
            <button type="button" class="pd-preset-btn pd-preset-custom" id="presetScaleCustom" style="display:none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              My Custom
            </button>
          </div>
        </div>

      </div>
    `;
}

// ─── Popup UI Design / Theme Cards Slot ─────────────────────────────────────
const THEME_CARDS = [
    {
        id: 'liquid-glass',
        label: 'Liquid Glass',
        desc: 'Frosted blur & depth',
        gradient: 'linear-gradient(135deg,rgba(99,102,241,0.25) 0%,rgba(139,92,246,0.15) 100%)',
        accent: '#6366f1',
    },
    {
        id: 'cyberpunk',
        label: 'Cyberpunk',
        desc: 'Neon grid & glow',
        gradient: 'linear-gradient(135deg,rgba(6,182,212,0.25) 0%,rgba(16,185,129,0.15) 100%)',
        accent: '#06b6d4',
    },
    {
        id: 'neumorphic',
        label: 'Neumorphic',
        desc: 'Soft 3-D depth',
        gradient: 'linear-gradient(135deg,rgba(107,114,128,0.20) 0%,rgba(55,65,81,0.30) 100%)',
        accent: '#9ca3af',
    },
    {
        id: 'minimal-flat',
        label: 'Minimal Flat',
        desc: 'Clean & distraction-free',
        gradient: 'linear-gradient(135deg,rgba(241,245,249,0.06) 0%,rgba(148,163,184,0.10) 100%)',
        accent: '#94a3b8',
    },
    {
        id: 'aurora',
        label: 'Aurora',
        desc: 'Northern lights vibes',
        gradient: 'linear-gradient(135deg,rgba(52,211,153,0.22) 0%,rgba(99,102,241,0.22) 100%)',
        accent: '#34d399',
    },
    {
        id: 'sunset',
        label: 'Sunset',
        desc: 'Warm orange dusk',
        gradient: 'linear-gradient(135deg,rgba(251,146,60,0.25) 0%,rgba(239,68,68,0.20) 100%)',
        accent: '#fb923c',
    },
];

export function renderPopupUiDesignSlot(container, state) {
    container.className = 'pd-section-body';
    const current = state?.settings?.popupUiTheme ?? 'liquid-glass';

    container.innerHTML = `
      <input type="hidden" id="popupUiTheme" value="${current}" aria-label="Popup UI Theme">
      <div class="pd-theme-grid">
        ${THEME_CARDS.map(t => `
          <button type="button"
            class="pd-theme-card ${current === t.id ? 'pd-theme-active' : ''}"
            data-style="${t.id}"
            style="--theme-grad:${t.gradient};--theme-accent:${t.accent}"
            title="${t.label}"
          >
            <div class="pd-theme-preview">
              <div class="pd-theme-preview-bar"></div>
              <div class="pd-theme-preview-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div class="pd-theme-info">
              <span class="pd-theme-name">${t.label}</span>
              <span class="pd-theme-desc">${t.desc}</span>
            </div>
            <div class="pd-theme-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </button>
        `).join('')}
      </div>
    `;

    // Wire up selection
    container.querySelectorAll('.pd-theme-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.pd-theme-card').forEach(c => c.classList.remove('pd-theme-active'));
            card.classList.add('pd-theme-active');
            const hidden = container.querySelector('#popupUiTheme');
            if (hidden) {
                hidden.value = card.dataset.style;
                hidden.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
}

// ─── Tab Definition ──────────────────────────────────────────────────────────
export const getPopup_designTab = (t) => ({
    id: 'popup_design',
    label: 'Popup Design',
    icon: ICONS.uiComponents,
    custom: false,
    sections: [
        {
            title: t('accent_color', 'Accent Color'),
            icon: ICONS.uiComponents,
            items: [{ type: 'custom', id: 'accentColorSlot', style: 'grid-column: 1 / -1; width: 100%;' }]
        },
        {
            title: t('popup_scale', 'Popup UI Scale'),
            icon: ICONS.autoScale,
            items: [{ type: 'custom', id: 'popupScaleSlot', style: 'grid-column: 1 / -1; width: 100%;' }]
        },
        {
            title: t('popup_ui_design', 'Popup UI Design'),
            icon: ICONS.designTab,
            items: [{ type: 'custom', id: 'popupUiDesignSlot', style: 'grid-column: 1 / -1; width: 100%;' }]
        }
    ]
});
