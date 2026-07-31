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
    static priority = 5; // Run early to manage other features

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
            path = path.replace(/\/(?:episode[-_]?)?\d+$/i, '');
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
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
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
     * Loads the stored profile for the current scope from chrome.storage.local
     */
    async loadDomainProfile() {
        try {
            const data = await chrome.storage.local.get('ypp_domain_profiles');
            const allProfiles = data.ypp_domain_profiles || {};
            
            // Check scope preference (stored in domain metadata or default domain)
            const domainMeta = allProfiles[this._domain];
            if (domainMeta && domainMeta.scopeMode === 'series') {
                this._scopeMode = 'series';
            } else {
                this._scopeMode = 'domain';
            }

            const activeKey = this.getScopeKey();
            const profile = allProfiles[activeKey] || allProfiles[this._domain];

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
            if (vbCfg.compressor !== undefined) {
                vb._compressorEnabled = !!vbCfg.compressor;
            }
            if (vbCfg.mono !== undefined) {
                vb._monoEnabled = !!vbCfg.mono;
            }
            appliedAny = true;
        }

        // 2. Restore Cinema Filters & Ensure CSS/WebGL Connection
        if (p.videoFilters && this._instances['videoFilters']) {
            const vf = this._instances['videoFilters'];
            const vfCfg = p.videoFilters;

            if (vfCfg.filterIndex !== undefined) {
                vf.currentFilterIndex = vfCfg.filterIndex;
            }
            if (vfCfg.intensity !== undefined) {
                vf.filterIntensity = vfCfg.intensity;
            }
            if (vfCfg.adjustments && typeof vfCfg.adjustments === 'object') {
                Object.assign(vf.filterAdjustments, vfCfg.adjustments);
            }
            if (typeof vf._applyComputedFilter === 'function') {
                vf._applyComputedFilter(video);
            }
            appliedAny = true;
        }

        // 3. Restore Playback Speed
        if (p.playbackRate && !isNaN(p.playbackRate) && p.playbackRate > 0) {
            try {
                if (video.playbackRate !== p.playbackRate) {
                    video.playbackRate = p.playbackRate;
                }
            } catch (_) {}
            if (this._instances['videoSpeedController']) {
                this._instances['videoSpeedController'].playbackRate = p.playbackRate;
            }
            appliedAny = true;
        }

        this._updateButtonStatus();

        if (appliedAny && showToast) {
            this._showRestoreToast(video);
        }
    }

    _showRestoreToast(video) {
        const displayLabel = this._scopeMode === 'series' ? 'Series' : this._domain;
        const msg = `🌐 Restored profile for ${displayLabel}`;
        if (this.utils?.createToast) {
            this.utils.createToast(msg);
        } else {
            const existing = document.getElementById('ypp-domain-toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.id = 'ypp-domain-toast';
            toast.style.cssText = `
                position: fixed;
                top: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(-20px);
                background: rgba(14, 15, 23, 0.88);
                color: #fff;
                border: 1px solid rgba(16, 185, 129, 0.55);
                border-radius: 9999px;
                padding: 7px 18px;
                font-family: Inter, sans-serif;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
                z-index: 2147483647;
                opacity: 0;
                pointer-events: none;
                transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease;
                backdrop-filter: blur(16px);
            `;
            toast.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#10b981"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                <span>${msg}</span>
            `;
            document.body.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(-50%) translateY(0)';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(-15px)';
                setTimeout(() => toast.remove(), 350);
            }, 2600);
        }
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
            
            // Keep default domain entry informed of the chosen scope mode
            if (this._scopeMode === 'series' && activeKey !== this._domain) {
                allProfiles[this._domain] = { ...(allProfiles[this._domain] || {}), scopeMode: 'series' };
            }
            
            await chrome.storage.local.set({ ypp_domain_profiles: allProfiles });
            this._updateButtonStatus();
            window.YPP?.Utils?.log?.(`Saved profile for scope ${activeKey}`, 'DomainMemory', 'info');
        } catch (e) {
            window.YPP?.Utils?.log?.('Failed to save domain profile: ' + e.message, 'DomainMemory', 'warn');
        }
    }

    /**
     * Switch scope mode between 'domain' (entire site) and 'series' (specific show)
     */
    async setScopeMode(mode) {
        if (mode !== 'domain' && mode !== 'series') return;
        this._scopeMode = mode;
        await this.loadDomainProfile();
        if (this._isRemembering) {
            await this._executeSaveProfile();
        }
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
                    vibrance: 100, highlights: 0, shadows: 0, vignette: 0
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

    _setupEpisodeNavigationHooks() {
        if (window._ypp_domain_nav_hooked) return;
        window._ypp_domain_nav_hooked = true;

        const notifyNavigation = () => {
            setTimeout(() => {
                const video = this._getVideo();
                if (video) {
                    this.restoreProfile(video, true);
                }
            }, 250);
        };

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            const res = originalPushState.apply(this, args);
            notifyNavigation();
            return res;
        };

        history.replaceState = function (...args) {
            const res = originalReplaceState.apply(this, args);
            notifyNavigation();
            return res;
        };

        window.addEventListener('popstate', notifyNavigation);
    }

    _setupVideoSourceMonitoring() {
        if (this._observer) this._observer.disconnect();

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

        document.addEventListener('loadedmetadata', (e) => {
            if (e.target && e.target.tagName === 'VIDEO') {
                this.restoreProfile(e.target, false);
            }
        }, { capture: true });
    }

    createButton(video) {
        const icon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
        const btn = document.createElement('button');
        btn.id = 'ypp-gpb-domain';
        btn.className = 'ypp-action-btn ypp-domain-pill-btn';
        btn.title = `Domain Memory (${this._domain})`;
        btn.innerHTML = `
            ${icon}
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
        if (!ind) return;

        const activeLabel = this._scopeMode === 'series' ? 'Series' : this._domain;

        if (this._domainProfile && this._isRemembering) {
            this._domainBtn.classList.add('ypp-domain-active');
            this._domainBtn.title = `Profile Active (${activeLabel}): Auto-remembers episodes`;
        } else if (this._isRemembering) {
            this._domainBtn.classList.add('ypp-domain-active');
            this._domainBtn.title = `Auto-Remembering ON (${activeLabel})`;
        } else {
            this._domainBtn.classList.remove('ypp-domain-active');
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
    }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.DomainMemory = DomainMemory;
