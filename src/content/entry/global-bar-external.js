/**
 * global-bar-external.js
 * ──────────────────────
 * Standalone entry point injected into ALL non-YouTube sites.
 * Boots GlobalBarUI + GlobalPlayerBar only.
 *
 * KEY: Everything is inside the async IIFE so the YPP namespace and
 * BaseFeature are defined BEFORE the feature modules evaluate.
 * Dynamic import() calls are inlined by Rollup (inlineDynamicImports: true)
 * but their execution is deferred to after the awaits, preserving correct order.
 */
(async () => {
    // ── Guard ────────────────────────────────────────────────────────────────
    if (window.location.hostname.includes('youtube.com')) return;

    // ── 1. Bootstrap the YPP namespace ──────────────────────────────────────
    window.YPP = window.YPP || {};
    window.YPP.features = window.YPP.features || {};

    // Minimal CONSTANTS
    window.YPP.CONSTANTS = window.YPP.CONSTANTS || {
        SELECTORS: {
            VIDEO: ['video']
        }
    };

    // Minimal Utils — only what GlobalPlayerBar / GlobalBarUI call
    window.YPP.Utils = window.YPP.Utils || {
        log: (msg, ctx = 'GPB', level = 'info') => {
            if (level === 'debug') return;
            const styles = {
                info:  'color:#3ea6ff;font-weight:bold;',
                warn:  'color:#ff9800;font-weight:bold;',
                error: 'color:#f44336;font-weight:bold;',
            };
            (console[level] || console.log)(
                `%c[YPP:${ctx}]`, styles[level] || styles.info, msg
            );
        },
        removeStyle: (id) => {
            if (!id) return;
            [document.getElementById(id), document.querySelector(`link#${id}`)]
                .forEach(el => el?.remove());
        },
        positionPopupBesideVideo: (panel, triggerBtn, video, panelW) => {
            const GAP = 10, MARGIN = 8;
            const W = window.innerWidth, H = window.innerHeight;
            const btnRect = triggerBtn.getBoundingClientRect();
            const vRect   = video?.getBoundingClientRect?.() || null;
            const hasVideo = vRect && vRect.width > 20 && vRect.height > 20;

            // Auto-scale: shrink panelW to never exceed available space
            let effectiveW = panelW;
            if (hasVideo) {
                const spaceLeft  = vRect.left - MARGIN;
                const spaceRight = W - vRect.right - MARGIN;
                const maxHoriz   = Math.max(spaceLeft, spaceRight, W * 0.45);
                effectiveW = Math.min(panelW, Math.max(280, maxHoriz - GAP));
            } else {
                effectiveW = Math.min(panelW, W * 0.45);
            }
            panel.style.width = effectiveW + 'px';

            // Clamp helpers (use effectiveW for horizontal)
            const estH     = Math.min(panel.scrollHeight > 40 ? panel.scrollHeight : 380, H * 0.85);
            const clampTop  = t => Math.max(MARGIN, Math.min(t, H - estH - MARGIN));
            const clampLeft = l => Math.max(MARGIN, Math.min(l, W - effectiveW - MARGIN));

            let left, top;

            if (hasVideo) {
                const spaceAbove = vRect.top - MARGIN;
                const spaceBelow = H - vRect.bottom - MARGIN;
                const spaceLeft  = vRect.left - MARGIN;
                const spaceRight = W - vRect.right - MARGIN;

                // Horizontal alignment: centre on button, clamp within viewport
                const btnCentreX = btnRect.left + btnRect.width / 2;
                const idealLeft  = clampLeft(btnCentreX - effectiveW / 2);

                if (spaceAbove >= Math.min(estH, 260)) {
                    // ABOVE the video — preferred when bar is on the side
                    top  = vRect.top - GAP - estH;
                    left = idealLeft;
                } else if (spaceBelow >= Math.min(estH, 260)) {
                    // BELOW the video
                    top  = vRect.bottom + GAP;
                    left = idealLeft;
                } else if (spaceLeft >= effectiveW + MARGIN) {
                    // LEFT of video
                    left = vRect.left - GAP - effectiveW;
                    top  = clampTop(btnRect.top + btnRect.height / 2 - estH / 2);
                } else if (spaceRight >= effectiveW + MARGIN) {
                    // RIGHT of video
                    left = vRect.right + GAP;
                    top  = clampTop(btnRect.top + btnRect.height / 2 - estH / 2);
                } else {
                    // Fallback: left of button, vertically centred
                    left = btnRect.left - GAP - effectiveW;
                    top  = clampTop(btnRect.top + btnRect.height / 2 - estH / 2);
                }
            } else {
                // No video — just go left of the button
                left = btnRect.left - GAP - effectiveW;
                top  = clampTop(btnRect.top + btnRect.height / 2 - estH / 2);
            }

            panel.style.left = clampLeft(left) + 'px';
            panel.style.top  = clampTop(top)   + 'px';
        },
        getPopupPortal: () => {
            let dlg = document.getElementById('ypp-popup-portal');
            if (dlg) return dlg;
            dlg = document.createElement('div');
            dlg.id = 'ypp-popup-portal';
            dlg.style.cssText =
                'display:block!important;position:fixed!important;inset:0!important;width:100%!important;height:100%!important;' +
                'max-width:100%!important;max-height:100%!important;' +
                'border:0!important;outline:0!important;padding:0!important;margin:0!important;' +
                'background:transparent!important;overflow:visible!important;' +
                'pointer-events:none!important;z-index:2147483647!important;' +
                'transform:none!important;filter:none!important;perspective:none!important;';
            
            if ('popover' in dlg) {
                dlg.popover = "manual";
            }
            
            document.documentElement.appendChild(dlg);
            
            if ('popover' in dlg) {
                try { dlg.showPopover(); } catch(e) {}
            }
            return dlg;
        },
    };


    // Minimal BaseFeature — GlobalPlayerBar extends this
    window.YPP.features.BaseFeature = class BaseFeature {
        constructor(name) {
            this.name      = name || this.constructor.name;
            this.isEnabled = false;
            this.settings  = {};
            this.utils     = window.YPP.Utils;
            this.eventListeners = [];
            this.abortController = new AbortController();
        }
        async enable()  {}
        async disable() {
            this.eventListeners.forEach(({target, type, listener, options}) => {
                target.removeEventListener(type, listener, options);
            });
            this.eventListeners = [];
        }
        update(settings) {
            this.settings = { ...this.settings, ...settings };
            if (this.onUpdate) this.onUpdate();
        }
        getConfigKey() {
            if (!this.name) return null;
            return this.name.charAt(0).toLowerCase() + this.name.slice(1);
        }
        addListener(target, type, listener, options) {
            target.addEventListener(type, listener, options);
            this.eventListeners.push({ target, type, listener, options });
        }
        pollFor(conditionFn, timeout = 10000, intervalMs = 250) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const check = () => {
                    if (this.abortController?.signal?.aborted) return reject(new Error('Aborted'));
                    try {
                        const result = conditionFn();
                        if (result) return resolve(result);
                    } catch (e) {}
                    if (Date.now() - startTime >= timeout) return reject(new Error('Timeout'));
                    setTimeout(check, intervalMs);
                };
                check();
            });
        }
    };

    // FilterPresets stub so GlobalBarUI constructor doesn't throw
    window.YPP.features.FilterPresets = window.YPP.features.FilterPresets || { PRESETS: [] };

    // ── 2. Load feature modules AFTER namespace is ready ─────────────────────
    // Dynamic imports are inlined by Rollup but execute after the awaits,
    // so BaseFeature above is guaranteed to exist when the modules run.
    await import('../features/player/global-bar-ui.js');
    await import('../features/player/global-bar.js');

    // Load custom cursor
    await import('../features/global/ui-tweaks/custom-cursor.js');
    
    // Load rich features
    await import('../features/player/media-effects/volume-booster/volume-booster.js');
    await import('../features/player/media-effects/volume-booster/volume-booster-ui.js');
    await import('../features/player/media-effects/video-filters/video-filters-presets.js');
    await import('../features/player/media-effects/video-filters/video-filters-overlay.js');
    await import('../features/player/media-effects/video-filters/video-filters-ui.js');
    await import('../features/player/media-effects/video-filters/video-filters.js');
    await import('../features/player/enhancements/video-speed-controller.js');
    await import('../features/player/domain-memory.js');
    await import('../features/player/domain-memory-ui.js');

    // ── 3. Read user settings ────────────────────────────────────────────────
    let settings = {};
    let blocklist = [];
    try {
        const { DEFAULT_SETTINGS } = await import('../../shared/default-settings.js');
        settings = { ...DEFAULT_SETTINGS };
        const data = await chrome.storage.local.get(['settings', 'globalPlayerBarBlocklist']);
        Object.assign(settings, data.settings || {});
        blocklist = data.globalPlayerBarBlocklist || [];
    } catch (_) {}

    // Mock FeatureManager so GlobalBarUI can fetch VolumeBoost / VideoFilters / DomainMemory
    const instances = {};
    window.YPP.featureManager = {
        getFeature: (name) => instances[name]
    };

    if (window.YPP.features.VolumeBooster) {
        instances['volumeBoost'] = new window.YPP.features.VolumeBooster();
        instances['volumeBoost'].update(settings);
        if (settings.enableVolumeBoost) instances['volumeBoost'].enable();
    }
    if (window.YPP.features.VideoFilters) {
        instances['videoFilters'] = new window.YPP.features.VideoFilters();
        instances['videoFilters'].update(settings);
        if (settings.enableCinemaFilters) instances['videoFilters'].enable();
    }
    if (window.YPP.features.VideoSpeedController) {
        instances['videoSpeedController'] = new window.YPP.features.VideoSpeedController();
        instances['videoSpeedController'].update(settings);
        if (settings.enableCustomSpeed !== false) instances['videoSpeedController'].enable();
    }
    if (window.YPP.features.DomainMemory) {
        instances['domainMemory'] = new window.YPP.features.DomainMemory();
        instances['domainMemory'].init(instances, settings);
        // Bug 3A fix: await so loadDomainProfile() finishes before restoreProfile() is called
        await instances['domainMemory'].enable();
    }
    if (window.YPP.features.CustomCursor) {
        instances['customCursor'] = new window.YPP.features.CustomCursor();
        instances['customCursor'].update(settings);
        instances['customCursor'].enable();
    }

    // ── Guard: are we inside an iframe? ──────────────────────────────────────
    const isInsideIframe = window !== window.top;

    // ── If inside iframe: run sub-features (VSC, filters, volume) only.
    //    Post video metadata to parent so the bar appears on the main page.
    if (isInsideIframe) {
        // Sub-features still work fine inside the iframe (they act on the <video> directly)
        // The bar itself is NOT created here — it would be clipped to the iframe viewport.

        let activeVideo = null;
        let mainObserver = null;
        let removalObserver = null;
        let heartbeatInterval = null;

        const capabilities = {
            pip: document.pictureInPictureEnabled !== false,
            fullscreen: document.fullscreenEnabled !== false,
            host: window.location.hostname
        };

        // Bridge: listen for video events and relay them to the parent frame
        const relayVideoEvents = (video) => {
            if (!video || video._yppBridged) return;
            // Only bridge one active video at a time
            if (activeVideo && activeVideo !== video) return;
            
            video._yppBridged = true;
            activeVideo = video;

            // Disconnect expensive observer
            if (mainObserver) {
                mainObserver.disconnect();
                mainObserver = null;
            }

            const relay = (type) => {
                try {
                    window.parent.postMessage({
                        ypp: true,
                        type: 'iframe-video-event',
                        event: type,
                        capabilities: capabilities,
                        state: {
                            paused: video.paused,
                            muted: video.muted,
                            volume: video.volume,
                            currentTime: video.currentTime,
                            duration: video.duration || 0,
                            playbackRate: video.playbackRate,
                            loop: video.loop,
                        }
                    }, '*');
                } catch (_) {}
            };

            ['play','pause','timeupdate','ratechange','volumechange','loadedmetadata','ended'].forEach(t => {
                video.addEventListener(t, () => relay(t), { passive: true });
            });

            // Heartbeat
            heartbeatInterval = setInterval(() => {
                if (video.isConnected) relay('heartbeat');
            }, 1000);

            // Re-arm main observer if video is removed
            removalObserver = new MutationObserver(() => {
                if (!document.contains(video)) {
                    removalObserver.disconnect();
                    removalObserver = null;
                    clearInterval(heartbeatInterval);
                    activeVideo = null;
                    startMainObserver();
                }
            });
            removalObserver.observe(document.documentElement, { childList: true, subtree: true });

            // Signal parent that a video exists
            relay('video-detected');
        };

        const startMainObserver = () => {
            if (mainObserver) return;
            mainObserver = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        if (!node || node.nodeType !== 1) continue;
                        if (node.tagName === 'VIDEO') relayVideoEvents(node);
                        else node.querySelectorAll?.('video').forEach(relayVideoEvents);
                    }
                }
            });
            mainObserver.observe(document.documentElement, { childList: true, subtree: true });
            document.querySelectorAll('video').forEach(relayVideoEvents);
        };

        startMainObserver();

        // Also relay commands from parent → video
        window.addEventListener('message', (e) => {
            if (!e.data?.ypp || e.data.type !== 'iframe-video-command') return;
            const { cmd, value } = e.data;
            
            if (cmd === 'sync-profile' && instances['domainMemory']) {
                instances['domainMemory']._domainProfile = value;
                instances['domainMemory']._isRemembering = true;
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    instances['domainMemory'].restoreProfile(video, false);
                });
                return;
            }

            const videos = document.querySelectorAll('video');
            if (!videos.length) return;
            
            videos.forEach(video => {
                if (cmd === 'play')         video.play().catch(() => {});
                if (cmd === 'pause')        video.pause();
                if (cmd === 'mute')         video.muted = true;
                if (cmd === 'unmute')       video.muted = false;
                if (cmd === 'volume')       video.volume = value;
                if (cmd === 'rate')         video.playbackRate = value;
                if (cmd === 'loop')         video.loop = !video.loop;
                if (cmd === 'pip')          video.requestPictureInPicture?.().catch(() => {});
                if (cmd === 'fullscreen')   video.closest?.('[tabindex]')?.requestFullscreen?.();
                if (cmd === 'seek')         video.currentTime += value;
                
                // Real-time styling sync (for filters)
                if (cmd === 'style')        video.style.setProperty(value.prop, value.val, value.imp || '');
                if (cmd === 'style-remove') video.style.removeProperty(value);
                if (cmd === 'class-add')    video.classList.add(value);
                if (cmd === 'class-remove') video.classList.remove(value);
            });
            
            // Handle Overlay Commands
            if (cmd === 'applyOverlay' && window.YPP?.features?.VideoFiltersOverlay) {
                // Mock context for the overlay module since it normally expects `this` (VideoFilters)
                const mockCtx = { 
                    _filterOverlay: window._yppCurrentFilterOverlay,
                    _getVideo: () => activeVideo 
                };
                window.YPP.features.VideoFiltersOverlay.applyOverlay(mockCtx, value.type, value.grainAmount);
                window._yppCurrentFilterOverlay = mockCtx._filterOverlay;
            }
            if (cmd === 'removeOverlay' && window.YPP?.features?.VideoFiltersOverlay) {
                const mockCtx = { _filterOverlay: window._yppCurrentFilterOverlay };
                window.YPP.features.VideoFiltersOverlay.removeOverlay(mockCtx);
                window._yppCurrentFilterOverlay = null;
            }
            if (cmd === 'manageSVGFilters' && window.YPP?.features?.VideoFiltersOverlay) {
                window.YPP.features.VideoFiltersOverlay.manageSVGFilters(value);
            }
            if (cmd === 'injectSVGSharpness' && window.YPP?.features?.VideoFiltersOverlay) {
                window.YPP.features.VideoFiltersOverlay.injectSVGSharpness(value);
            }
        });

        return; // Do NOT create GlobalPlayerBar inside iframe
    }

    // Default ON — show bar unless user explicitly disabled it
    if (settings.enableGlobalPlayerBar === false) return;

    // Check Blocklist
    const hostname = window.location.hostname.replace(/^www\./, '');
    if (blocklist.includes(hostname)) return;

    // ── 4. Boot the feature ──────────────────────────────────────────────────
    const bar = new window.YPP.features.GlobalPlayerBar();
    if (bar.update) bar.update(settings);
    bar.isEnabled = false;
    await bar.enable();
    bar.isEnabled = true;

    if (instances['domainMemory']) {
        const video = document.querySelector('video');
        if (video) instances['domainMemory'].restoreProfile(video, true);
    }

    // ── 4b. Listen for iframe video events (cross-origin iframe bridge) ───────
    //   When a streaming site embeds the player in a cross-origin iframe,
    //   the iframe script relays video events here via postMessage.
    //   We create a lightweight proxy object to drive the GlobalBarUI.
    (function setupIframeBridge() {
        let proxyVideo = null;
        let bridgedIframe = null; // the <iframe> element in this page's DOM
        let heartbeatTimeout = null;

        const handleHeartbeatLoss = () => {
            window.YPP.Utils.log('Iframe heartbeat lost. Connection reset.', 'Bridge', 'warn');
            if (proxyVideo && proxyVideo._internalState) proxyVideo._internalState.isConnected = false;
            bridgedIframe = null;
        };

        const sendCommand = (cmd, value) => {
            // Find the iframe to post commands to
            if (!bridgedIframe) return; // Only post to authenticated iframe
            bridgedIframe.contentWindow?.postMessage({ ypp: true, type: 'iframe-video-command', cmd, value }, '*');
        };

        window.addEventListener('message', (e) => {
            if (!e.data?.ypp || e.data.type !== 'iframe-video-event') return;

            // Security & Targeting: Only accept events from the verified bridged iframe
            if (bridgedIframe && e.source !== bridgedIframe.contentWindow) return;
            if (!bridgedIframe) {
                bridgedIframe = Array.from(document.querySelectorAll('iframe')).find(f => f.contentWindow === e.source);
                if (!bridgedIframe) return; // Ignore spoofed messages
                window.YPP.Utils.log('Bridged to new cross-origin iframe', 'Bridge');
            }

            const { event: evtType, state, capabilities } = e.data;

            // Capabilities handling
            if (capabilities && proxyVideo) {
                const capsChanged = JSON.stringify(proxyVideo._capabilities) !== JSON.stringify(capabilities);
                proxyVideo._capabilities = capabilities;
                if (capsChanged && bar._globalBarUI) {
                    bar._globalBarUI.updateButtonVisibility();
                }
            }

            // Heartbeat processing
            clearTimeout(heartbeatTimeout);
            heartbeatTimeout = setTimeout(handleHeartbeatLoss, 3500);

            // Create a proxy video object the first time we hear from the iframe
            if (!proxyVideo) {
                // Internal state that gets synced from iframe
                const _state = {
                    _proxy: true,
                    paused: true,
                    muted: false,
                    volume: 1,
                    currentTime: 0,
                    duration: 0,
                    playbackRate: 1,
                    loop: false,
                    isConnected: true,
                    offsetWidth: 1,
                    offsetHeight: 1,
                };

                // Use ES Proxy so property assignments relay commands to the iframe
                proxyVideo = new Proxy(_state, {
                    get(target, key) {
                        if (key === 'style') {
                            return { 
                                setProperty(prop, val, imp) { sendCommand('style', { prop, val, imp }); }, 
                                removeProperty(prop) { sendCommand('style-remove', prop); }, 
                                getPropertyValue() { return ''; } 
                            };
                        }
                        if (key === 'classList') {
                            return { 
                                add(cls) { sendCommand('class-add', cls); }, 
                                remove(cls) { sendCommand('class-remove', cls); }, 
                                contains() { return false; } 
                            };
                        }
                        if (key === 'manageSVGFilters') return (css) => sendCommand('manageSVGFilters', css);
                        if (key === 'injectSVGSharpness') return (amount) => sendCommand('injectSVGSharpness', amount);
                        if (key === 'applyOverlay') return (type, grainAmount) => sendCommand('applyOverlay', { type, grainAmount });
                        if (key === 'removeOverlay') return () => sendCommand('removeOverlay');
                        
                        if (key === 'getAttribute')    return () => null;
                        if (key === 'setAttribute')    return () => {};
                        if (key === 'removeAttribute') return () => {};
                        if (key === 'addEventListener')    return () => {};
                        if (key === 'removeEventListener') return () => {};
                        if (key === 'requestFullscreen')   return () => { sendCommand('fullscreen'); return Promise.resolve(); };
                        if (key === 'requestPictureInPicture') return () => { sendCommand('pip'); return Promise.resolve(); };
                        if (key === 'play')  return () => { sendCommand('play');  return Promise.resolve(); };
                        if (key === 'pause') return () => { sendCommand('pause'); };
                        if (key === 'closest') return () => ({ requestFullscreen() { sendCommand('fullscreen'); } });
                        if (key === '_internalState') return _state; // expose for direct sync
                        return target[key];
                    },
                    set(target, key, value) {
                        target[key] = value; // Update local state for UI reads
                        // Relay to iframe video
                        if (key === 'muted')        sendCommand(value ? 'mute' : 'unmute');
                        if (key === 'volume')        sendCommand('volume', value);
                        if (key === 'playbackRate')  sendCommand('rate', value);
                        if (key === 'loop')          sendCommand('loop');
                        if (key === 'currentTime')   sendCommand('seek', value);
                        return true;
                    }
                });

                // Inject bar with the proxy video
                if (bar.ui && !bar.ui.hasVideo(proxyVideo)) {
                    bar.ui.trackVideo(proxyVideo);
                }

                // Send the initial domain profile to the iframe so it applies immediately on load
                if (instances['domainMemory']) {
                    chrome.storage.local.get('ypp_domain_profiles').then(data => {
                        const activeKey = instances['domainMemory'].getScopeKey();
                        const myProfile = data.ypp_domain_profiles?.[activeKey];
                        if (myProfile) {
                            sendCommand('sync-profile', myProfile);
                        }
                    }).catch(() => {});
                }
            }

            // Sync proxy internal state directly from iframe (bypass proxy setter to avoid echo-back)
            if (state) {
                const internalState = proxyVideo._internalState;
                if (internalState) Object.assign(internalState, state);
            }

            // Trigger UI update
            if (bar.ui?.barElement) {
                bar.ui.updateUIState();
            }
        });

        // Listen for domain profile changes and broadcast them to the identified video iframe
        try {
            chrome.storage.onChanged.addListener((changes) => {
                if (changes.ypp_domain_profiles && !isInsideIframe && instances['domainMemory']) {
                    const activeKey = instances['domainMemory'].getScopeKey();
                    const myProfile = changes.ypp_domain_profiles.newValue?.[activeKey];
                    if (myProfile) {
                        sendCommand('sync-profile', myProfile);
                    }
                }
            });
        } catch (_) {}
    })();

    // ── 5. React to popup toggle changes in real-time ────────────────────────
    try {
        chrome.storage.onChanged.addListener(async (changes) => {
            let shouldBeEnabled = settings.enableGlobalPlayerBar !== false;
            let needsUpdate = false;

            if (changes.settings) {
                const newSettings = changes.settings.newValue || {};
                settings = { ...settings, ...newSettings };
                shouldBeEnabled = settings.enableGlobalPlayerBar !== false;
                needsUpdate = true;

                if (bar.update) bar.update(newSettings);

                // Update sub-features
                if (instances['volumeBoost']) {
                    instances['volumeBoost'].update(newSettings);
                }
                if (instances['videoFilters']) {
                    instances['videoFilters'].update(newSettings);
                }
                if (instances['videoSpeedController']) {
                    instances['videoSpeedController'].update(newSettings);
                }
                if (instances['customCursor']) {
                    instances['customCursor'].update(newSettings);
                }
            }

            if (changes.globalPlayerBarBlocklist) {
                blocklist = changes.globalPlayerBarBlocklist.newValue || [];
                needsUpdate = true;
            }

            if (!needsUpdate) return;

            const hostname = window.location.hostname.replace(/^www\./, '');
            if (blocklist.includes(hostname)) {
                shouldBeEnabled = false;
            }

            if (shouldBeEnabled && !bar.isEnabled) {
                await bar.enable();
                bar.isEnabled = true;
            } else if (!shouldBeEnabled && bar.isEnabled) {
                await bar.disable();
                bar.isEnabled = false;
            }
        });
    } catch (_) {}
})();
