/**
 * domain-memory.js
 * ────────────────
 * Rock-Solid Domain Analyzer & Episode Memory Engine for the Global Player Bar.
 *
 * Capabilities:
 * - Cross-Origin Iframe Attribution: Automatically links third-party embedded video iframes
 *   (e.g., megacloud, rapid-cloud) back to the parent streaming site domain (e.g., itachi.tv).
 * - Multi-Scope Support: Switch between Domain-Wide (itachi.tv) and Series-Level
 *   scoping (itachi.tv/watch/185736) for independent audio/visual presets per show.
 * - Player Lifecycle Re-Binding: Monitors DOM video replacement and automatically reconnects
 *   Web Audio API gain nodes and CSS/WebGL filters when servers or episodes switch.
 * - JSON Import/Export: Backup and share your custom equalizer, filter, and speed presets.
 */

export class DomainMemory extends (window.YPP?.features?.BaseFeature || class { constructor(n) { this.name = n; } }) {
    static featureId = 'domainMemory';
    static executionPhase = 'idle';
    static priority = 10; // Run after other features (like Video Filters) to correctly restore overrides

    constructor() {
        super('DomainMemory');
        this.name = 'DomainMemory';
        this._instances = {};
        this._settings = {};
        this._domain = this.getDomain();
        this._scopeMode = 'domain'; // 'domain' | 'series'
        this._domainProfile = null;
        this._isRemembering = true;
        this._domainBtn = null;
        this._domainPanel = null;
        this._lastRestoredUrl = null;
        this._lastRestoredVideoSrc = null;
        this._observer = null;
        this._debouncedRestore = null;
        this._debouncedSave = null;

        // Bug 2 fix: store per-instance navigation hook state
        this._origPushState = null;
        this._origReplaceState = null;
        this._navHookActive = false;
        this._navHandler = null;
        this._popstateHandler = null;

        // Bug 3 fix: store loadedmetadata handler for cleanup
        this._loadedMetadataHandler = null;
    }

    /**
     * Resolves the true parent hostname even inside cross-origin third-party iframe players.
     * e.g., "megacloud.tv" iframe on "itachi.tv" -> returns "itachi.tv"
     */
    getDomain() {
        try {
            let host = window.location.hostname || '';
            if (window !== window.top) {
                try {
                    if (window.top.location.hostname) {
                        host = window.top.location.hostname;
                    }
                } catch (_) {
                    // Cross-origin iframe: safely extract parent domain from document.referrer
                    if (document.referrer) {
                        try {
                            const refUrl = new URL(document.referrer);
                            if (refUrl.hostname) host = refUrl.hostname;
                        } catch (e) {}
                    }
                }
            }
            host = host.toLowerCase().replace(/^www\./, '');
            return host || 'localhost';
        } catch (_) {
            return 'localhost';
        }
    }

    /**
     * Extracts a series-level identifier path by stripping trailing episode numbers.
     * e.g., "https://itachi.tv/watch/185736/my-hero-academia-vigilantes/2"
     * -> "itachi.tv/watch/185736/my-hero-academia-vigilantes"
     */
    getSeriesPath() {
        try {
            let urlStr = window.location.href;
            if (window !== window.top) {
                try {
                    urlStr = window.top.location.href;
                } catch (_) {
                    if (document.referrer) urlStr = document.referrer;
                }
            }
            const u = new URL(urlStr);
            let path = u.pathname.replace(/\/+$/, '');
            // Strip trailing episode segment like /1, /episode-1, /ep-2, /2
            path = path.replace(/\/(?:episode[-_]?)?(\d+)$/i, '');
            return `${this._domain}${path}`;
        } catch (_) {
            return this._domain;
        }
    }

    /**
     * Returns the active storage scope key ('domain' or 'series' path)
     */
    getScopeKey() {
        if (this._scopeMode === 'series') {
            return this.getSeriesPath();
        }
        if (this._scopeMode === 'host') {
            const video = this._getVideo();
            if (video && video._capabilities && video._capabilities.host) {
                return video._capabilities.host;
            }
        }
        return this._domain;
    }

    init(instances = {}, settings = {}) {
        this._instances = instances;
        this._settings = settings;
        this._domain = this.getDomain();
        
        const debounce = window.YPP?.Utils?.debounce || ((fn, ms) => {
            let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
        });
        
        this._debouncedRestore = debounce((video, showToast = true) => {
            this._executeRestore(video, showToast);
        }, 150);

        this._debouncedSave = debounce(() => {
            this._executeSaveProfile();
        }, 350);
    }

    async enable() {
        if (this.enableSuper) await super.enable();
        
        // Load scope preference first (separate key)
        await this._loadScopePref();

        // Load stored profile for this scope
        await this.loadDomainProfile();

        // Hook into SPA navigation & video source mutations
        this._setupEpisodeNavigationHooks();
        this._setupVideoSourceMonitoring();

        // Perform initial restore if video exists
        const video = this._getVideo();
        if (video) {
            this.restoreProfile(video, true);
        }
    }

    async disable() {
        if (this.disableSuper) await super.disable();

        // Bug 2 fix: restore patched history methods
        if (this._navHookActive) {
            if (this._origPushState) history.pushState = this._origPushState;
            if (this._origReplaceState) history.replaceState = this._origReplaceState;
            if (this._popstateHandler) window.removeEventListener('popstate', this._popstateHandler);
            this._navHookActive = false;
            this._origPushState = null;
            this._origReplaceState = null;
            this._popstateHandler = null;
            this._navHandler = null;
        }

        // Bug 3 fix: remove loadedmetadata listener
        if (this._loadedMetadataHandler) {
            document.removeEventListener('loadedmetadata', this._loadedMetadataHandler, { capture: true });
            this._loadedMetadataHandler = null;
        }

        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
        
        if (this._videoWatcherId && window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.unobserve(this._videoWatcherId);
            this._videoWatcherId = null;
        }
        if (this._videoObservers) {
            this._videoObservers.forEach(mo => mo.disconnect());
            this._videoObservers = [];
        }

        this._removePanel();
        if (this._domainBtn) {
            this._domainBtn.remove();
            this._domainBtn = null;
        }
    }

    _getVideo() {
        return document.querySelector(window.YPP?.CONSTANTS?.SELECTORS?.VIDEO?.[0] || 'video');
    }

    /**
     * Improvement 2: Load scope preference from a dedicated storage key
     * (separate from profiles so reset/clear never clobbers it)
     */
    async _loadScopePref() {
        try {
            const data = await chrome.storage.local.get('ypp_domain_scope_prefs');
            const prefs = data.ypp_domain_scope_prefs || {};
            if (prefs[this._domain] === 'series') {
                this._scopeMode = 'series';
            } else {
                this._scopeMode = 'domain';
            }
        } catch (_) {}
    }

    /**
     * Improvement 2: Save scope preference to its own dedicated key
     */
    async _saveScopePref() {
        try {
            const data = await chrome.storage.local.get('ypp_domain_scope_prefs');
            const prefs = data.ypp_domain_scope_prefs || {};
            prefs[this._domain] = this._scopeMode;
            await chrome.storage.local.set({ ypp_domain_scope_prefs: prefs });
        } catch (_) {}
    }

    /**
     * Loads the stored profile for the current scope from chrome.storage.local
     */
    async loadDomainProfile() {
        try {
            const data = await chrome.storage.local.get('ypp_domain_profiles');
            let allProfiles = data.ypp_domain_profiles || {};

            // Pruning logic: remove abandoned profiles untouched for > 6 months (180 days)
            const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            let needsPrune = false;
            
            for (const key of Object.keys(allProfiles)) {
                const profile = allProfiles[key];
                if (profile && profile.lastUpdated && (now - profile.lastUpdated > SIX_MONTHS_MS)) {
                    delete allProfiles[key];
                    needsPrune = true;
                }
            }
            
            if (needsPrune) {
                chrome.storage.local.set({ ypp_domain_profiles: allProfiles }).catch(() => {});
            }

            const activeKey = this.getScopeKey();
            const profile = allProfiles[activeKey];

            if (profile && profile.enabled !== false) {
                this._domainProfile = profile;
                this._isRemembering = true;
            } else if (profile && profile.enabled === false) {
                this._domainProfile = null;
                this._isRemembering = false;
            } else {
                this._domainProfile = null;
                this._isRemembering = true; // Auto-remember ON by default
            }
            this._updateButtonStatus();
        } catch (e) {
            window.YPP?.Utils?.log?.('Error loading domain profile: ' + e.message, 'DomainMemory', 'warn');
        }
    }

    /**
     * Restores saved settings (Volume Booster, Cinema Filters, Speed) and re-binds Web Audio / Filters
     */
    restoreProfile(videoElement, showToast = false) {
        const video = videoElement || this._getVideo();
        if (!video) return;

        this._debouncedRestore(video, showToast);
    }

    _executeRestore(video, showToast = false) {
        if (!video || !this._domainProfile || !this._isRemembering) return;

        let appliedAny = false;
        const p = this._domainProfile;

        // 1. Restore Volume Booster & Verify Web Audio Connection
        if (p.volumeBoost && this._instances['volumeBoost']) {
            const vb = this._instances['volumeBoost'];
            const vbCfg = p.volumeBoost;
            
            // Re-bind Web Audio node if video element was swapped out
            if (vb._currentVideo !== video && typeof vb.attachVideo === 'function') {
                vb.attachVideo(video);
            }

            if (vbCfg.gain !== undefined) {
                vb._volumeGain = vbCfg.gain;
                if (typeof vb.setGain === 'function') {
                    vb.setGain(vbCfg.gain);
                }
            }
            if (vbCfg.balance !== undefined) {
                vb._balance = vbCfg.balance;
                if (typeof vb.setBalance === 'function') {
                    vb.setBalance(vbCfg.balance);
                }
            }
            if (vbCfg.eqGains && Array.isArray(vbCfg.eqGains)) {
                vb._eqGains = [...vbCfg.eqGains];
                if (typeof vb.setEQ === 'function') {
                    vb.setEQ(vbCfg.eqGains);
                }
            }
            appliedAny = true;
        }
        
        // 2. Restore Cinema Filters & Ensure CSS/WebGL Connection
        if (p.videoFilters && this._instances['videoFilters']) {
            const vf = this._instances['videoFilters'];
            const vfCfg = p.videoFilters;

            // Bug 2B fix: respect the user's enableCinemaFilters toggle
            if (!vf.settings?.enableCinemaFilters) {
                // Feature is disabled — skip restoring filters but still continue with speed
            } else {
            if (vfCfg.filterIndex !== undefined) {
                vf.currentFilterIndex = vfCfg.filterIndex;
                if (vf.settings) vf.settings.cinemaFilterIndex = vfCfg.filterIndex;
            }
            if (vfCfg.intensity !== undefined) {
                vf.filterIntensity = vfCfg.intensity;
                if (vf.settings) vf.settings.cinemaFilterIntensity = vfCfg.intensity;
            }
            if (vfCfg.adjustments && typeof vfCfg.adjustments === 'object') {
                Object.assign(vf.filterAdjustments, vfCfg.adjustments);
                if (vf.settings) {
                    vf.settings.cinemaFilterBrightness = vfCfg.adjustments.brightness;
                    vf.settings.cinemaFilterContrast = vfCfg.adjustments.contrast;
                    vf.settings.cinemaFilterSaturate = vfCfg.adjustments.saturate;
                    vf.settings.cinemaFilterHue = vfCfg.adjustments.hueRotate;
                    vf.settings.cinemaFilterSepia = vfCfg.adjustments.sepia;
                    vf.settings.cinemaFilterGrayscale = vfCfg.adjustments.grayscale;
                    vf.settings.cinemaFilterInvert = vfCfg.adjustments.invert;
                    vf.settings.cinemaFilterBlur = vfCfg.adjustments.blur;
                    vf.settings.cinemaFilterOpacity = vfCfg.adjustments.opacity;
                    vf.settings.cinemaFilterDehaze = vfCfg.adjustments.dehaze;
                    vf.settings.cinemaFilterClarity = vfCfg.adjustments.clarity;
                    vf.settings.cinemaFilterGrain = vfCfg.adjustments.grain;
                    vf.settings.cinemaFilterSharpness = vfCfg.adjustments.sharpness;
                    vf.settings.cinemaFilterTemperature = vfCfg.adjustments.temperature;
                    vf.settings.cinemaFilterVibrance = vfCfg.adjustments.vibrance;
                    vf.settings.cinemaFilterHighlights = vfCfg.adjustments.highlights;
                    vf.settings.cinemaFilterShadows = vfCfg.adjustments.shadows;
                    vf.settings.cinemaFilterVignette = vfCfg.adjustments.vignette;
                    vf.settings.cinemaFilterExposure = vfCfg.adjustments.exposure;
                    vf.settings.cinemaFilterTint = vfCfg.adjustments.tint;
                    vf.settings.cinemaFilterFade = vfCfg.adjustments.fade;
                    vf.settings.cinemaFilterNoiseReduction = vfCfg.adjustments.noiseReduction;
                }
            }

            if (typeof vf.forceEnsureFilter === 'function') {
                vf.forceEnsureFilter(video);
                appliedAny = true;
            } else if (typeof vf._applyComputedFilter === 'function') {
                vf._applyComputedFilter(video);
                appliedAny = true;
            }
            } // end enableCinemaFilters check
        }

        // 3. Restore Custom Speed
        if (p.playbackRate && !isNaN(p.playbackRate) && p.playbackRate > 0) {
            try {
                if (video.playbackRate !== p.playbackRate) {
                    if (this._instances['videoSpeedController']) {
                        this._instances['videoSpeedController'].settings.vscLastSpeed = p.playbackRate;
                        this._instances['videoSpeedController'].setSpeed(video, p.playbackRate);
                    } else {
                        video.playbackRate = p.playbackRate;
                    }
                }
            } catch (e) {
                console.error('[YPP] Failed to restore playback speed:', e);
            }
            appliedAny = true;
        }

        this._updateButtonStatus();

        if (appliedAny && showToast) {
            this._showRestoreToast(video);
        }
    }

    /**
     * UI 3: Rich restore toast — shows exactly what was applied
     */
    _showRestoreToast(video) {
        const p = this._domainProfile;
        const displayLabel = this._scopeMode === 'series' ? this.getSeriesPath().split('/').pop() || this._domain : this._domain;

        // Build applied-settings summary
        const parts = [];
        if (p?.volumeBoost?.gain && p.volumeBoost.gain !== 1) {
            parts.push(`${Math.round(p.volumeBoost.gain * 100)}% Vol`);
        }
        if (p?.videoFilters?.filterIndex && p.videoFilters.filterIndex !== 0) {
            const filterName = window.YPP?.features?.VideoFiltersPresets?.FILTERS?.[p.videoFilters.filterIndex]?.name;
            if (filterName) parts.push(filterName);
        }
        if (p?.playbackRate && p.playbackRate !== 1) {
            parts.push(`${p.playbackRate}x`);
        }

        const settingsSummary = parts.length > 0 ? parts.join(' · ') : 'Profile';
        const scopeIcon = this._scopeMode === 'series'
            ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="#a78bfa"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7l-5 3V8l5 3zm5-3l-5 3 5 3V9z"/></svg>`
            : `<svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;

        const existing = document.getElementById('ypp-domain-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'ypp-domain-toast';
        toast.style.cssText = `
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: rgba(14, 15, 23, 0.92);
            color: #fff;
            border: 1px solid rgba(16, 185, 129, 0.45);
            border-top: 1px solid rgba(16, 185, 129, 0.7);
            border-radius: 9999px;
            padding: 8px 20px 8px 14px;
            font-family: Inter, -apple-system, sans-serif;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 12px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
            z-index: 2147483647;
            opacity: 0;
            pointer-events: none;
            transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease;
            backdrop-filter: blur(20px);
            white-space: nowrap;
        `;
        toast.innerHTML = `
            ${scopeIcon}
            <span style="color: rgba(255,255,255,0.65); font-weight: 500; font-size: 11px;">Restored</span>
            <span style="color: #fff;">${displayLabel}</span>
            ${parts.length > 0 ? `<span style="color: rgba(255,255,255,0.45);">·</span><span style="color: #10b981; font-size: 11px;">${settingsSummary}</span>` : ''}
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-12px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    recordChange(sourceFeature) {
        if (!this._isRemembering) return;
        this._debouncedSave();
    }

    async _executeSaveProfile() {
        if (!this._isRemembering) return;

        const activeKey = this.getScopeKey();
        const p = this._domainProfile || { enabled: true };
        p.lastUpdated = Date.now();
        p.scopeKey = activeKey;
        p.scopeMode = this._scopeMode;
        p.domain = this._domain;

        // Snapshot Volume Booster
        const vb = this._instances['volumeBoost'];
        if (vb) {
            p.volumeBoost = {
                gain: vb._volumeGain || 1,
                balance: vb._balance || 0,
                eqGains: Array.isArray(vb._eqGains) ? [...vb._eqGains] : [0,0,0,0,0,0,0,0,0,0],
                compressor: !!vb._compressorEnabled,
                mono: !!vb._monoEnabled
            };
        }

        // Snapshot Cinema Filters
        const vf = this._instances['videoFilters'];
        if (vf) {
            p.videoFilters = {
                filterIndex: vf.currentFilterIndex || 0,
                intensity: vf.filterIntensity !== undefined ? vf.filterIntensity : 100,
                adjustments: { ...(vf.filterAdjustments || {}) }
            };
        }

        // Snapshot Playback Speed
        const video = this._getVideo();
        if (video && !isNaN(video.playbackRate)) {
            p.playbackRate = video.playbackRate;
        }

        this._domainProfile = p;

        try {
            const data = await chrome.storage.local.get('ypp_domain_profiles');
            const allProfiles = data.ypp_domain_profiles || {};
            allProfiles[activeKey] = p;
            await chrome.storage.local.set({ ypp_domain_profiles: allProfiles });
            this._updateButtonStatus();
            window.YPP?.Utils?.log?.(`Saved profile for scope ${activeKey}`, 'DomainMemory', 'info');
        } catch (e) {
            window.YPP?.Utils?.log?.('Failed to save domain profile: ' + e.message, 'DomainMemory', 'warn');
        }
    }

    /**
     * Bug 6 fix: Switch scope mode — load new scope profile WITHOUT overwriting it first.
     * Improvement 2: Persist scope pref in a dedicated key.
     */
    async setScopeMode(mode) {
        if (mode !== 'domain' && mode !== 'series' && mode !== 'host') return;
        this._scopeMode = mode;
        // Save pref first
        await this._saveScopePref();
        // Load the profile for the NEW scope (do NOT save before loading)
        await this.loadDomainProfile();
        // Restore the loaded profile onto the current video
        const video = this._getVideo();
        if (video) this.restoreProfile(video, true);
    }

    async toggleDomainMemory(enable) {
        this._isRemembering = enable;
        const activeKey = this.getScopeKey();
        if (enable) {
            await this._executeSaveProfile();
        } else {
            try {
                const data = await chrome.storage.local.get('ypp_domain_profiles');
                const allProfiles = data.ypp_domain_profiles || {};
                allProfiles[activeKey] = { enabled: false, lastUpdated: Date.now() };
                await chrome.storage.local.set({ ypp_domain_profiles: allProfiles });
                this._domainProfile = null;
            } catch (_) {}
        }
        this._updateButtonStatus();
    }

    async resetDomainProfile() {
        try {
            const activeKey = this.getScopeKey();
            const data = await chrome.storage.local.get('ypp_domain_profiles');
            const allProfiles = data.ypp_domain_profiles || {};
            delete allProfiles[activeKey];
            await chrome.storage.local.set({ ypp_domain_profiles: allProfiles });
            
            this._domainProfile = null;
            
            // Reset filters & volume boost
            if (this._instances['videoFilters']) {
                const vf = this._instances['videoFilters'];
                vf.currentFilterIndex = 0;
                vf.filterIntensity = 100;
                vf.filterAdjustments = {
                    brightness: 100, contrast: 100, saturate: 100, hueRotate: 0,
                    sepia: 0, grayscale: 0, invert: 0, blur: 0, opacity: 100,
                    dehaze: 0, clarity: 0, grain: 0, sharpness: 0, temperature: 0,
                    vibrance: 100, highlights: 0, shadows: 0, vignette: 0,
                    // Bug 3B fix: include V2 keys in reset
                    exposure: 0, tint: 0, fade: 0, noiseReduction: 0
                };
                const video = this._getVideo();
                if (video) vf._applyComputedFilter(video);
            }
            if (this._instances['volumeBoost']) {
                const vb = this._instances['volumeBoost'];
                vb.setGain?.(1);
                vb.setBalance?.(0);
                vb.setEQ?.([0,0,0,0,0,0,0,0,0,0]);
            }
            this._updateButtonStatus();
        } catch (_) {}
    }


    /**
     * Exports current scope profile as a JSON string
     */
    exportProfileJSON() {
        const profile = this._domainProfile || {};
        return JSON.stringify(profile, null, 2);
    }

    /**
     * Imports a JSON profile string and applies it immediately
     */
    async importProfileJSON(jsonStr) {
        try {
            const imported = JSON.parse(jsonStr);
            if (!imported || typeof imported !== 'object') throw new Error('Invalid JSON format');
            
            this._domainProfile = { ...imported, enabled: true, lastUpdated: Date.now() };
            this._isRemembering = true;
            await this._executeSaveProfile();
            
            const video = this._getVideo();
            if (video) this.restoreProfile(video, true);
            return true;
        } catch (e) {
            window.YPP?.Utils?.log?.('Failed to import profile: ' + e.message, 'DomainMemory', 'warn');
            return false;
        }
    }

    /**
     * Bug 2 fix: Per-instance navigation hook — stored on instance, restored in disable().
     */
    _setupEpisodeNavigationHooks() {
        if (this._navHookActive) return;
        this._navHookActive = true;

        const self = this;
        const notifyNavigation = () => {
            setTimeout(() => {
                const video = self._getVideo();
                if (video) {
                    self.restoreProfile(video, true);
                }
            }, 300);
        };
        this._navHandler = notifyNavigation;

        this._origPushState = history.pushState;
        this._origReplaceState = history.replaceState;
        const origPush = this._origPushState;
        const origReplace = this._origReplaceState;

        history.pushState = function (...args) {
            const res = origPush.apply(this, args);
            notifyNavigation();
            return res;
        };
        history.replaceState = function (...args) {
            const res = origReplace.apply(this, args);
            notifyNavigation();
            return res;
        };

        this._popstateHandler = notifyNavigation;
        window.addEventListener('popstate', this._popstateHandler);
    }

    /**
     * Bug 3 fix: Store loadedmetadata handler ref so disable() can remove it.
     */
    _setupVideoSourceMonitoring() {
        if (this._observer) this._observer.disconnect();
        this._observer = null;

        const videoSelector = window.YPP?.CONSTANTS?.SELECTORS?.VIDEO?.[0] || 'video';
        
        if (window.YPP?.sharedObserver) {
            window.YPP.sharedObserver.register(
                'domain-memory-watcher',
                videoSelector,
                (elements) => {
                    elements.forEach(video => {
                        this._attachLocalVideoObserver(video);
                        this.restoreProfile(video, true);
                    });
                }
            );
            this._videoWatcherId = 'domain-memory-watcher';
        } else {
            // Fallback just in case, though sharedObserver should always be present
            this._observer = new MutationObserver((mutations) => {
                let videoChanged = false;
                for (const m of mutations) {
                    if (m.type === 'attributes' && (m.attributeName === 'src' || m.attributeName === 'currentsrc')) {
                        if (m.target && m.target.tagName === 'VIDEO') {
                            videoChanged = true;
                            break;
                        }
                    }
                    if (m.addedNodes?.length) {
                        for (const node of m.addedNodes) {
                            if (node.tagName === 'VIDEO' || node.querySelector?.('video')) {
                                videoChanged = true;
                                break;
                            }
                        }
                    }
                }
                if (videoChanged) {
                    const video = this._getVideo();
                    if (video) {
                        this.restoreProfile(video, true);
                    }
                }
            });

            this._observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'currentsrc']
            });
        }

        // Bug 3 fix: store handler reference so it can be removed in disable()
        this._loadedMetadataHandler = (e) => {
            if (e.target && e.target.tagName === 'VIDEO') {
                this.restoreProfile(e.target, false);
            }
        };
        document.addEventListener('loadedmetadata', this._loadedMetadataHandler, { capture: true });
        
        // Initial attach
        const existingVideo = this._getVideo();
        if (existingVideo) this._attachLocalVideoObserver(existingVideo);
    }
    
    _attachLocalVideoObserver(video) {
        if (!video || video._yppDomainMemoryObserved) return;
        video._yppDomainMemoryObserved = true;
        
        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'attributes' && (m.attributeName === 'src' || m.attributeName === 'currentsrc')) {
                    this.restoreProfile(video, true);
                    break;
                }
            }
        });
        mo.observe(video, { attributes: true, attributeFilter: ['src', 'currentsrc'] });
        
        this._videoObservers = this._videoObservers || [];
        this._videoObservers.push(mo);
    }

    /**
     * Improvement 3: Button shows D (Domain) or S (Series) label beside the icon.
     * Green = Domain active, Purple = Series active.
     */
    createButton(video) {
        const icon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
        const btn = document.createElement('button');
        btn.id = 'ypp-gpb-domain';
        btn.className = 'ypp-action-btn ypp-domain-pill-btn';
        btn.title = `Domain Memory (${this._domain})`;
        btn.innerHTML = `
            ${icon}
            <span class="ypp-domain-scope-label">D</span>
            <span class="ypp-domain-badge-indicator"></span>
        `;
        btn.onclick = (e) => {
            e.stopPropagation();
            this.togglePanel(this._getVideo(), btn);
        };
        this._domainBtn = btn;
        this._updateButtonStatus();
        return btn;
    }

    _updateButtonStatus() {
        if (!this._domainBtn) return;
        const ind = this._domainBtn.querySelector('.ypp-domain-badge-indicator');
        const scopeLabel = this._domainBtn.querySelector('.ypp-domain-scope-label');
        if (!ind) return;

        const isSeriesMode = this._scopeMode === 'series';
        const activeLabel = isSeriesMode ? 'Series' : this._domain;

        // Update the D/S scope label
        if (scopeLabel) {
            scopeLabel.textContent = isSeriesMode ? 'S' : 'D';
            scopeLabel.style.color = isSeriesMode ? '#a78bfa' : '#10b981';
        }

        if (this._domainProfile && this._isRemembering) {
            this._domainBtn.classList.add('ypp-domain-active');
            // Series mode: purple glow; Domain mode: green glow
            ind.style.background = isSeriesMode ? '#a78bfa' : '#10b981';
            ind.style.boxShadow = isSeriesMode
                ? '0 0 10px #a78bfa, 0 0 4px #fff'
                : '0 0 10px #10b981, 0 0 4px #fff';
            this._domainBtn.title = `Profile Active (${activeLabel}): Auto-remembers episodes`;
        } else if (this._isRemembering) {
            this._domainBtn.classList.add('ypp-domain-active');
            ind.style.background = isSeriesMode ? '#a78bfa' : '#10b981';
            ind.style.boxShadow = isSeriesMode
                ? '0 0 10px #a78bfa, 0 0 4px #fff'
                : '0 0 10px #10b981, 0 0 4px #fff';
            this._domainBtn.title = `Auto-Remembering ON (${activeLabel})`;
        } else {
            this._domainBtn.classList.remove('ypp-domain-active');
            ind.style.background = 'rgba(255,255,255,0.35)';
            ind.style.boxShadow = 'none';
            this._domainBtn.title = `Domain Memory OFF (${activeLabel})`;
        }
    }

    togglePanel(video, btn) {
        if (this._domainPanel) {
            this._removePanel();
            return;
        }
        if (window.YPP?.features?.DomainMemoryUI) {
            window.YPP.features.DomainMemoryUI.createPanel(this, video, btn);
        }
    }

    _removePanel() {
        if (this._domainPanel) {
            this._domainPanel.remove();
            this._domainPanel = null;
        }
        // Bug 1 fix: clean up event listeners added by DomainMemoryUI
        if (this._domainPanelOutsideHandler) {
            document.removeEventListener('click', this._domainPanelOutsideHandler);
            this._domainPanelOutsideHandler = null;
        }
        if (this._domainPanelKeydownHandler) {
            document.removeEventListener('keydown', this._domainPanelKeydownHandler);
            this._domainPanelKeydownHandler = null;
        }
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.DomainMemory = DomainMemory;
