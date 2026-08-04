/**
 * Video Filters Feature Orchestrator
 */

export class VideoFilters extends window.YPP.features.BaseFeature {
    static featureId = 'videoFilters';
    static executionPhase = 'sequential-ui';
    static priority = 8;

    constructor() {
        super('VideoFilters');
        this.name = 'VideoFilters';
        
        this.currentFilterIndex = 0;
        this.filterIntensity = 100;
        this.isComparing = false;
        
        this.filterAdjustments = {
            brightness: 100, contrast: 100, saturate: 100, hueRotate: 0,
            sepia: 0, grayscale: 0, invert: 0, blur: 0, opacity: 100,
            dehaze: 0, clarity: 0, grain: 0, sharpness: 0, temperature: 0,
            vibrance: 100, highlights: 0, shadows: 0, vignette: 0,
            // V2 new adjustments
            exposure: 0, tint: 0, fade: 0, noiseReduction: 0
        };
        
        this._filterOverlay = null;
        this._filterPanel = null;
        this._filterBtn = null;
        this._filterPanelOutsideHandler = null;
        this._filterPanelKeydownHandler = null;
        this._filterPanelResizeHandler = null;
        this._previewFilterIndex = undefined;
        this._lastOverlayKey = null;
    }

    getConfigKey() { return 'enableCinemaFilters'; }

    _getVideo() {
        return document.querySelector(window.YPP.CONSTANTS.SELECTORS.VIDEO[0]) || document.querySelector('video');
    }

    async enable() {
        await super.enable();
        if (!this.settings?.enableCinemaFilters) return;
        
        const video = this._getVideo();
        if (video) this._restoreFilterState(video);
    }

    async disable() {
        await super.disable();
        try {
            window.YPP.features.VideoFiltersOverlay.removeOverlay(this);
            this._removeFilterPanel();
            if (this._filterBtn) {
                this._filterBtn.remove();
                this._filterBtn = null;
            }
        } catch (err) {
            this.utils?.log?.('[YPP] VideoFilters disable error: ' + err.message, 'VideoFilters', 'error');
        }
    }

    onUpdate() {
        this.enable();
    }

    onPageChange() {
        if (!this.settings?.enableCinemaFilters) return;
        const video = this._getVideo();
        if (video) this._restoreFilterState(video);
    }

    onVideoChange(videoElement) {
        if (!this.settings?.enableCinemaFilters) return;
        const video = videoElement || this._getVideo();
        if (video) this._restoreFilterState(video);
    }

    createButton(initialVideo) {
        const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"/></svg>`;
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = 'Cinema Filters';
        btn.className = 'ypp-action-btn';
        btn.onclick = (e) => {
            e.stopPropagation();
            this.toggleFilterPanel(this._getVideo(), btn);
        };
        this._filterBtn = btn;
        return btn;
    }

    toggleFilterPanel(video, btn) {
        if (this._filterPanel) {
            this._removeFilterPanel();
            return;
        }
        window.YPP.features.VideoFiltersUI.createFilterPanel(this, video, btn);
    }

    _removeFilterPanel() {
        if (this._filterPanel) {
            this._filterPanel.remove();
            this._filterPanel = null;
        }
        
        const removeListenerSafe = (target, type, handler) => {
            if (!handler) return;
            if (this.removeListener) this.removeListener(target, type, handler);
            else target.removeEventListener(type, handler);
        };

        removeListenerSafe(document, 'click', this._filterPanelOutsideHandler);
        removeListenerSafe(document, 'keydown', this._filterPanelKeydownHandler);
        removeListenerSafe(window, 'resize', this._filterPanelResizeHandler);
        
        this._filterPanelOutsideHandler = null;
        this._filterPanelKeydownHandler = null;
        this._filterPanelResizeHandler = null;
        this._previewFilterIndex = undefined;
    }

    _applyComputedFilter(video) {
        video = video || this._getVideo();
        if (!video) return;

        if (this.isComparing) {
            this._clearVideoFilters(video);
            return;
        }

        const preset = window.YPP.features.VideoFiltersPresets.FILTERS[this.currentFilterIndex];
        const adj = this.filterAdjustments;
        const inst = this.filterIntensity / 100;
        
        const baseValues = this._calculateBaseValues(adj);
        const hasSVGCurves = this._applySVGCurves(baseValues, adj);
        let finalFilter = this._buildCSSFilterString(preset, adj, inst, hasSVGCurves);
        
        if (adj.sharpness > 0) {
            window.YPP.features.VideoFiltersOverlay.injectSVGSharpness(adj.sharpness);
            finalFilter += ` url(#ypp-svg-sharpness)`;
        }

        window.YPP.features.VideoFiltersOverlay.injectSpecialEffectsSVG();
        if (preset.overlay && preset.overlay.startsWith('crt')) {
            window.YPP.features.VideoFiltersOverlay.injectCRTSVGFilter();
        }

        video.style.setProperty('filter', finalFilter, 'important');
        this._syncOverlays(preset, adj);
    }

    _clearVideoFilters(video) {
        video.style.setProperty('filter', 'none', 'important');
        video.style.setProperty('opacity', '1', 'important');
        window.YPP.features.VideoFiltersOverlay.removeOverlay(this);
    }

    _calculateBaseValues(adj) {
        let contrast = adj.contrast;
        let brightness = adj.brightness;
        
        if (adj.dehaze > 0) {
            contrast += adj.dehaze * 0.5;
            brightness -= adj.dehaze * 0.1;
        }
        if (adj.clarity > 0) {
            contrast += adj.clarity * 0.3;
        }
        
        let saturate = adj.saturate;
        if (adj.vibrance !== undefined && adj.vibrance !== 100) {
            saturate = saturate * (adj.vibrance / 100);
        }
        
        return { contrast, brightness, saturate };
    }

    _applySVGCurves(baseValues, adj) {
        const needsCurves = baseValues.contrast !== 100 || baseValues.brightness !== 100 || 
                            adj.shadows !== 0 || adj.highlights !== 0 || adj.temperature !== 0;
                            
        if (needsCurves) {
            window.YPP.features.VideoFiltersOverlay.updateDynamicSVGFilter({
                brightness: baseValues.brightness,
                contrast: baseValues.contrast,
                shadows: adj.shadows || 0,
                highlights: adj.highlights || 0,
                temperature: adj.temperature || 0
            });
            return true;
        }
        return false;
    }

    _buildCSSFilterString(preset, adj, inst, hasSVGCurves) {
        const s = (v, def = 100) => def + (v - def) * inst;
        const baseValues = this._calculateBaseValues(adj);

        // Exposure: maps -100..+100 => brightness(0.5..1.5)
        const exposureBrightness = adj.exposure !== 0
            ? 100 + (adj.exposure * inst)
            : null;

        // Tint: maps -100..+100 => a subtle hue nudge in green-magenta axis
        const tintHue = adj.tint !== 0 ? adj.tint * 0.5 * inst : null;

        // Fade: lifts blacks — simulated by a slight brightness + contrast reduction
        const fadeBrightness = adj.fade > 0 ? 100 + (adj.fade * 0.15 * inst) : null;
        const fadeContrast   = adj.fade > 0 ? 100 - (adj.fade * 0.3 * inst)  : null;

        // Noise Reduction: a very subtle blur
        const noiseBlur = adj.noiseReduction > 0 ? (adj.noiseReduction / 100) * 1.5 * inst : null;

        const adjStr = [
            hasSVGCurves ? `url(#ypp-dynamic-filter)` : '',
            baseValues.saturate !== 100 ? `saturate(${s(baseValues.saturate)}%)` : '',
            adj.hueRotate !== 0 ? `hue-rotate(${adj.hueRotate * inst}deg)` : '',
            tintHue ? `hue-rotate(${tintHue}deg)` : '',
            adj.sepia > 0 ? `sepia(${adj.sepia * inst}%)` : '',
            adj.grayscale > 0 ? `grayscale(${adj.grayscale * inst}%)` : '',
            adj.invert > 0 ? `invert(${adj.invert * inst}%)` : '',
            exposureBrightness ? `brightness(${exposureBrightness}%)` : '',
            fadeBrightness ? `brightness(${fadeBrightness}%) contrast(${fadeContrast}%)` : '',
            (adj.blur > 0 || noiseBlur) ? `blur(${((adj.blur || 0) + (noiseBlur || 0)) * inst}px)` : '',
            adj.opacity !== 100 ? `opacity(${s(adj.opacity)}%)` : ''
        ].filter(Boolean).join(' ');

        if (preset.css !== 'none' && adjStr) return `${preset.css} ${adjStr}`;
        if (preset.css !== 'none') return preset.css;
        if (adjStr) return adjStr;
        return 'none';
    }

    _syncOverlays(preset, adj) {
        const overlayKey = `${this.currentFilterIndex}:${adj.grain}:${adj.vignette}`;
        const needsOverlay = preset.overlay || adj.grain > 0 || adj.vignette > 0 || preset.name === 'Night Vision';
        const overlayChanged = this._lastOverlayKey !== overlayKey;

        if (!needsOverlay) {
            window.YPP.features.VideoFiltersOverlay.removeOverlay(this);
            this._lastOverlayKey = null;
        } else if (overlayChanged) {
            window.YPP.features.VideoFiltersOverlay.removeOverlay(this);
            window.YPP.features.VideoFiltersOverlay.applyOverlay(this, preset.overlay, adj.grain);
            this._lastOverlayKey = overlayKey;
        }
    }

    _restoreFilterState(video) {
        const s = this.settings || {};
        
        const keyMap = {
            cinemaFilterBrightness: 'brightness',
            cinemaFilterContrast: 'contrast',
            cinemaFilterSaturate: 'saturate',
            cinemaFilterHue: 'hueRotate',
            cinemaFilterSepia: 'sepia',
            cinemaFilterGrayscale: 'grayscale',
            cinemaFilterInvert: 'invert',
            cinemaFilterBlur: 'blur',
            cinemaFilterOpacity: 'opacity',
            cinemaFilterDehaze: 'dehaze',
            cinemaFilterClarity: 'clarity',
            cinemaFilterGrain: 'grain',
            cinemaFilterSharpness: 'sharpness',
            cinemaFilterTemperature: 'temperature',
            cinemaFilterVibrance: 'vibrance',
            cinemaFilterHighlights: 'highlights',
            cinemaFilterShadows: 'shadows',
            cinemaFilterVignette: 'vignette',
            cinemaFilterExposure: 'exposure',
            cinemaFilterTint: 'tint',
            cinemaFilterFade: 'fade',
            cinemaFilterNoiseReduction: 'noiseReduction'
        };

        let hasActiveFilter = false;

        for (const [settingKey, stateKey] of Object.entries(keyMap)) {
            if (s[settingKey] !== undefined) {
                this.filterAdjustments[stateKey] = s[settingKey];
            }
            if (this.filterAdjustments[stateKey] !== (['hueRotate','sepia','grayscale','invert','blur','dehaze','clarity','grain','sharpness','temperature','highlights','shadows','vignette'].includes(stateKey) ? 0 : 100)) {
                hasActiveFilter = true;
            }
        }

        if (s.cinemaFilterIndex !== undefined) {
            this.currentFilterIndex = s.cinemaFilterIndex;
            if (this.currentFilterIndex > 0) hasActiveFilter = true;
        }
        if (s.cinemaFilterIntensity !== undefined) {
            this.filterIntensity = s.cinemaFilterIntensity;
        }

        if (hasActiveFilter && video) {
            this._applyComputedFilter(video);
        }
    }

    _showToast(video, message) {
        if (this.utils?.createToast) {
            this.utils.createToast(message);
        } else {
            const toast = document.createElement('div');
            toast.className = 'ypp-toast-mini';
            toast.textContent = message;
            const parent = document.getElementById('movie_player') || video?.parentElement || document.body;
            if (parent) {
                parent.appendChild(toast);
                this.pollFor(() => false, 2000, 2000).catch(() => toast.remove());
            }
        }
    }
};

window.YPP.features.VideoFilters = VideoFilters;
