import '../../../../../core/system/base-feature.js';

import { VideoFiltersOverlay } from './video-filters-overlay.js';
import { VideoFiltersUI } from './video-filters-ui.js';
import { FILTERS } from './video-filters-presets.js';

/**
 * @class VideoFilters
 * @extends window.YPP.features.BaseFeature
 * @description Orchestrator for cinematic video filters and color grading.
 * Manages the WebGL/CSS filter pipeline and synchronizes state between the UI and video element.
 * 
 * **Production Code Audit**: 
 * - Performance: Utilizes `requestAnimationFrame` for high-frequency slider updates.
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
            exposure: 0, tint: 0, fade: 0, noiseReduction: 0,
            // V3 Stylized adjustments
            aberration: 0, bloom: 0, scanlines: 0, letterbox: 0, vhs: 0
        };
        
        this._filterOverlay = null;
        this._filterPanel = null;
        this._filterBtn = null;
        this._filterPanelOutsideHandler = null;
        this._filterPanelKeydownHandler = null;
        this._filterPanelResizeHandler = null;
        this._previewFilterIndex = undefined;
        this._lastOverlayKey = null;
        // rAF throttle handles for slider dragging
        this._rafPending = false;
        this._savePending = null;
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
            VideoFiltersOverlay.removeOverlay(this);
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
            // Bug 2F fix: use the captured initialVideo, not a fresh _getVideo() query
            this.toggleFilterPanel(initialVideo || this._getVideo(), btn);
        };
        this._filterBtn = btn;
        return btn;
    }

    toggleFilterPanel(video, btn) {
        if (this._filterPanel) {
            this._removeFilterPanel();
            return;
        }
        VideoFiltersUI.createFilterPanel(this, video, btn);
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

        removeListenerSafe(document, 'pointerdown', this._filterPanelOutsideHandler);
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

        VideoFiltersUI?._injectStyles?.();
        
        if (!this._rafPendingForVideo) {
            this._rafPendingForVideo = new WeakSet();
        }
        
        if (this._rafPendingForVideo.has(video)) return;
        this._rafPendingForVideo.add(video);
        
        const apply = () => {
            if (!this._rafPendingForVideo.has(video)) return; // already ran
            this._rafPendingForVideo.delete(video);
            this._doApplyComputedFilter(video);
        };
        
        requestAnimationFrame(apply);
        setTimeout(apply, 32); // Fallback for throttled iframes
    }

    forceEnsureFilter(video) {
        video = video || this._getVideo();
        if (!video) return;
        
        this._applyComputedFilter(video);
        
        let attempts = 0;
        const interval = this.setInterval(() => {
            attempts++;
            if (attempts > 6 || !video.isConnected) {
                clearInterval(interval);
                return;
            }
            // If the user manually cleared the filter in the meantime, stop forcing it.
            if (this.currentFilterIndex === 0 && !this._hasAdjustments()) {
                clearInterval(interval);
                return;
            }
            // Re-trigger application to override any SPA player overrides that slipped past the observer
            this._applyComputedFilter(video);
        }, 500);
    }

    _doApplyComputedFilter(video) {
        video = video || this._getVideo();
        if (!video) return;

        if (this.isComparing) {
            this._clearVideoFilters(video);
            return;
        }

        const preset = FILTERS[this.currentFilterIndex];
        const adj = this.filterAdjustments;
        const inst = this.filterIntensity / 100;
        
        const baseValues = this._calculateBaseValues(adj);
        const hasSVGCurves = this._applySVGCurves(baseValues, adj);
        let finalFilter = this._buildCSSFilterString(preset, adj, inst, hasSVGCurves);
        
        const docUrl = window.location.href.split('#')[0];

        if (adj.sharpness !== 0) {
            if (video._proxy) video.injectSVGSharpness(adj.sharpness);
            else VideoFiltersOverlay.injectSVGSharpness(adj.sharpness);
            finalFilter += ` url("${docUrl}#ypp-svg-sharpness")`;
        }

        if (adj.aberration > 0) {
            if (!video._proxy) VideoFiltersOverlay.injectSVGAberration(adj.aberration);
            finalFilter += ` url("${docUrl}#ypp-svg-aberration")`;
        }
        if (adj.bloom > 0) {
            if (!video._proxy) VideoFiltersOverlay.injectSVGBloom(adj.bloom);
            finalFilter += ` url("${docUrl}#ypp-svg-bloom")`;
        }
        if (adj.vhs > 0) {
            if (!video._proxy) VideoFiltersOverlay.injectSVGVHS(adj.vhs);
            finalFilter += ` url("${docUrl}#ypp-svg-vhs")`;
        }

        if (video._proxy) video.manageSVGFilters(finalFilter);
        else VideoFiltersOverlay.manageSVGFilters(finalFilter);

        // Hardware-accelerated CSS variable pipeline + Inline fallback immunity
        
        if (adj.letterbox > 0) {
            const lb = adj.letterbox * 0.3; // scale 0-100 to 0-30%
            video.style.setProperty('clip-path', `inset(${lb}% 0 ${lb}% 0)`, 'important');
            video.style.setProperty('--ypp-video-clip', `inset(${lb}% 0 ${lb}% 0)`);
        } else {
            video.style.removeProperty('clip-path');
            video.style.removeProperty('--ypp-video-clip');
        }

        this._applyFilterStyles(video, finalFilter);

        // Re-apply overlay elements
        this._syncOverlays(preset, adj, video);
        
        this._ensureVideoState(video);
    }

    _applyFilterStyles(video, finalFilter) {
        video.classList.add('ypp-cinema-active');
        video.style.setProperty('--ypp-video-filter', finalFilter);
        video.style.setProperty('filter', finalFilter, 'important');
        video.style.setProperty('will-change', 'filter', 'important');
        video.style.setProperty('transform', 'translateZ(0)', 'important');
        video.style.setProperty('transition', 'filter 0.35s ease, -webkit-filter 0.35s ease', 'important');
    }

    _ensureVideoState(video) {
        if (!video) return;
        
        // Ensure DOMObserver is tracking this video
        if (window.YPP.sharedObserver && window.YPP.sharedObserver.observeVideoAttributes) {
            window.YPP.sharedObserver.observeVideoAttributes(video);
        }
        
        if (this._hasVideoAttrListener) return;
        this._hasVideoAttrListener = true;
        
        this.onBusEvent('attr:videoStyleReset', (payload) => {
            const affectedVideo = payload.videoNode;
            if (this.currentFilterIndex === 0 && !this._hasAdjustments()) return;
            
            let needsReapply = false;
            if (!affectedVideo.classList.contains('ypp-cinema-active')) {
                needsReapply = true;
            }
            const currentFilter = affectedVideo.style.getPropertyValue('filter');
            const targetFilter = affectedVideo.style.getPropertyValue('--ypp-video-filter');
            
            if (!targetFilter || !currentFilter || currentFilter === 'none' || currentFilter === 'initial' || currentFilter === 'unset') {
                needsReapply = true;
            }
            
            if (needsReapply) {
                VideoFiltersUI?._injectStyles?.();
                
                const preset = FILTERS[this.currentFilterIndex];
                const adj = this.filterAdjustments;
                const inst = this.filterIntensity / 100;
                const baseValues = this._calculateBaseValues(adj);
                const hasSVGCurves = this._applySVGCurves(baseValues, adj);
                let finalFilter = this._buildCSSFilterString(preset, adj, inst, hasSVGCurves);
                const docUrl = window.location.href.split('#')[0];
                if (adj.sharpness !== 0) finalFilter += ` url("${docUrl}#ypp-svg-sharpness")`;
                if (adj.aberration > 0) finalFilter += ` url("${docUrl}#ypp-svg-aberration")`;
                if (adj.bloom > 0) finalFilter += ` url("${docUrl}#ypp-svg-bloom")`;
                if (adj.vhs > 0) finalFilter += ` url("${docUrl}#ypp-svg-vhs")`;
                
                this._applyFilterStyles(affectedVideo, finalFilter);

                if (adj.letterbox > 0) {
                    const lb = adj.letterbox * 0.3;
                    affectedVideo.style.setProperty('clip-path', `inset(${lb}% 0 ${lb}% 0)`, 'important');
                    affectedVideo.style.setProperty('--ypp-video-clip', `inset(${lb}% 0 ${lb}% 0)`);
                } else {
                    affectedVideo.style.removeProperty('clip-path');
                    affectedVideo.style.removeProperty('--ypp-video-clip');
                }
            }
        });
    }

    _hasAdjustments() {
        const adj = this.filterAdjustments;
        return adj.brightness !== 100 || adj.contrast !== 100 || adj.saturate !== 100 || 
               adj.dehaze > 0 || adj.clarity > 0 || adj.vibrance !== 100 || 
               adj.exposure !== 0 || adj.shadows !== 0 || adj.highlights !== 0 || 
               adj.temperature !== 0 || adj.tint !== 0 || adj.hueRotate !== 0 || 
               adj.sepia > 0 || adj.grayscale > 0 || adj.invert > 0 || 
               adj.fade > 0 || adj.blur > 0 || adj.noiseReduction > 0 || adj.sharpness !== 0 ||
               adj.aberration > 0 || adj.bloom > 0 || adj.scanlines > 0 || adj.letterbox > 0 || adj.vhs > 0;
    }

    _clearVideoFilters(video) {
        video.classList.remove('ypp-cinema-active');
        video.style.removeProperty('--ypp-video-filter');
        video.style.setProperty('filter', 'none', 'important'); // Fallback clear
        video.style.setProperty('opacity', '1', 'important');
        video.style.removeProperty('clip-path');
        video.style.removeProperty('--ypp-video-clip');
        VideoFiltersOverlay.removeOverlay(this);
        if (video.removeOverlay) video.removeOverlay();
        if (video.manageSVGFilters) video.manageSVGFilters('');
        this._lastOverlayKey = null;
    }

    _calculateBaseValues(adj) {
        let contrast = adj.contrast;
        let brightness = adj.brightness;
        
        // Remove legacy clarity/dehaze hacks here, they are handled in SVG or skipped for better alternatives
        
        let saturate = adj.saturate;
        if (adj.vibrance !== undefined && adj.vibrance !== 100) {
            saturate = saturate * (adj.vibrance / 100);
        }
        
        return { contrast, brightness, saturate };
    }

    _applySVGCurves(baseValues, adj) {
        const needsCurves = baseValues.contrast !== 100 || baseValues.brightness !== 100 || 
                            adj.shadows !== 0 || adj.highlights !== 0 || adj.temperature !== 0 ||
                            adj.exposure !== 0 || adj.tint !== 0 || adj.fade !== 0;
                            
        if (needsCurves) {
            VideoFiltersOverlay.setupDynamicSVGFilter();
            VideoFiltersOverlay.updateDynamicSVGFilter({
                brightness: baseValues.brightness,
                contrast: baseValues.contrast,
                shadows: adj.shadows || 0,
                highlights: adj.highlights || 0,
                temperature: adj.temperature || 0,
                exposure: adj.exposure || 0,
                tint: adj.tint || 0,
                fade: adj.fade || 0
            });
            return true;
        }
        return false;
    }

    _buildCSSFilterString(preset, adj, inst, hasSVGCurves) {
        const s = (v, def = 100) => def + (v - def) * inst;
        const baseValues = this._calculateBaseValues(adj);

        // Noise Reduction: a very subtle blur
        const noiseBlur = adj.noiseReduction > 0 ? (adj.noiseReduction / 100) * 1.5 * inst : null;
        
        // Dehaze & Clarity legacy fallback (we are using CSS contrast/saturate for simplicity in dynamic CSS if SVG is off)
        const cssDehazeContrast = adj.dehaze !== 0 ? (adj.dehaze * 0.5 * inst) : 0;
        const cssClarityContrast = adj.clarity !== 0 ? (adj.clarity * 0.3 * inst) : 0;
        const extraContrast = cssDehazeContrast + cssClarityContrast;
        
        const isExternal = !window.location.hostname.includes('youtube.com');
        const docUrl = isExternal ? '' : window.location.href.split('#')[0];

        const adjStr = [
            hasSVGCurves ? `url("${docUrl}#ypp-dynamic-filter")` : '',
            baseValues.saturate !== 100 ? `saturate(${s(baseValues.saturate)}%)` : '',
            adj.hueRotate !== 0 ? `hue-rotate(${adj.hueRotate * inst}deg)` : '',
            adj.sepia > 0 ? `sepia(${adj.sepia * inst}%)` : '',
            adj.grayscale > 0 ? `grayscale(${adj.grayscale * inst}%)` : '',
            adj.invert > 0 ? `invert(${adj.invert * inst}%)` : '',
            extraContrast !== 0 ? `contrast(${100 + extraContrast}%)` : '',
            (adj.blur > 0 || noiseBlur) ? `blur(${((adj.blur || 0) + (noiseBlur || 0)) * inst}px)` : '',
            adj.opacity !== 100 ? `opacity(${s(adj.opacity)}%)` : ''
        ].filter(Boolean).join(' ');

        // Apply base URL fix to preset CSS filters too (like CRT)
        let presetCss = preset.css;
        if (presetCss && presetCss !== 'none') {
            presetCss = presetCss.replace(/url\(#(ypp-[^)]+)\)/g, `url("${docUrl}#$1")`);
        }

        if (presetCss !== 'none' && adjStr) return `${presetCss} ${adjStr}`;
        if (presetCss !== 'none') return presetCss;
        if (adjStr) return adjStr;
        return 'none';
    }

    _syncOverlays(preset, adj, video) {
        video = video || this._getVideo();
        const overlayKey = `${this.currentFilterIndex}:${adj.grain}:${adj.vignette}:${adj.scanlines}`;
        const needsOverlay = preset.overlay || adj.grain > 0 || adj.vignette > 0 || adj.scanlines > 0 || preset.name === 'Night Vision';
        const overlayChanged = this._lastOverlayKey !== overlayKey;

        if (!needsOverlay) {
            if (video && video._proxy) video.removeOverlay();
            else VideoFiltersOverlay.removeOverlay(this);
            this._lastOverlayKey = null;
        } else if (overlayChanged) {
            if (video && video._proxy) video.removeOverlay();
            else VideoFiltersOverlay.removeOverlay(this);
            
            if (video && video._proxy) video.applyOverlay(preset.overlay, adj.grain);
            else VideoFiltersOverlay.applyOverlay(this, preset.overlay, adj.grain, adj.scanlines, adj.vignette);
            
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
            cinemaFilterNoiseReduction: 'noiseReduction',
            cinemaFilterAberration: 'aberration',
            cinemaFilterBloom: 'bloom',
            cinemaFilterScanlines: 'scanlines',
            cinemaFilterLetterbox: 'letterbox',
            cinemaFilterVhs: 'vhs'
        };

        let hasActiveFilter = false;

        for (const [settingKey, stateKey] of Object.entries(keyMap)) {
            if (s[settingKey] !== undefined) {
                this.filterAdjustments[stateKey] = s[settingKey];
            }
        if (this.filterAdjustments[stateKey] !== (
            ['hueRotate','sepia','grayscale','invert','blur','dehaze','clarity',
             'grain','sharpness','temperature','highlights','shadows','vignette',
             // V2 keys — default is also 0
             'exposure','tint','fade','noiseReduction'
            ].includes(stateKey) ? 0 : 100
        )) {
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
        } else if (this.currentFilterIndex === 0 && !hasActiveFilter && video) {
            this._clearVideoFilters(video);
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
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.VideoFilters = VideoFilters;
