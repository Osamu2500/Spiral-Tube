export function setupIframeBridge(bar, instances) {
    let proxyVideo = null;
    let bridgedSource = null;
    let heartbeatTimeout = null;

    const handleHeartbeatLoss = () => {
        window.YPP.Utils.log('Iframe heartbeat lost. Connection reset.', 'Bridge', 'warn');
        if (proxyVideo && proxyVideo._internalState) proxyVideo._internalState.isConnected = false;
        if (proxyVideo && bar.ui) bar.ui._untrackVideo(proxyVideo);
        bridgedSource = null;
        proxyVideo = null;
    };

    const sendCommand = (cmd, value) => {
        if (!bridgedSource) return;
        bridgedSource.postMessage({ ypp: true, type: 'iframe-video-command', cmd, value }, '*');
    };

    window.addEventListener('message', (e) => {
        if (!e.data?.ypp || e.data.type !== 'iframe-video-event') return;

        if (bridgedSource && e.source !== bridgedSource) return;
        if (!bridgedSource) {
            bridgedSource = e.source;
            window.YPP.Utils.log('Bridged to new nested cross-origin iframe', 'Bridge');
        }

        const { event: evtType, state, capabilities } = e.data;

        if (capabilities && proxyVideo) {
            const capsChanged = JSON.stringify(proxyVideo._capabilities) !== JSON.stringify(capabilities);
            proxyVideo._capabilities = capabilities;
            if (capsChanged && bar.ui) {
                bar.ui.updateButtonVisibility();
            }
        }

        if (evtType === 'video-hidden') {
            handleHeartbeatLoss();
            return;
        }

        clearTimeout(heartbeatTimeout);
        heartbeatTimeout = setTimeout(handleHeartbeatLoss, 3500);

        if (!proxyVideo) {
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
                _listeners: {}
            };

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
                    if (key === 'addEventListener') return (type, listener) => {
                        if (!target._listeners[type]) target._listeners[type] = [];
                        target._listeners[type].push(listener);
                    };
                    if (key === 'removeEventListener') return (type, listener) => {
                        if (target._listeners[type]) {
                            target._listeners[type] = target._listeners[type].filter(l => l !== listener);
                        }
                    };
                    if (key === 'requestFullscreen')   return () => { sendCommand('fullscreen'); return Promise.resolve(); };
                    if (key === 'requestPictureInPicture') return () => { sendCommand('pip'); return Promise.resolve(); };
                    if (key === 'play')  return () => { sendCommand('play');  return Promise.resolve(); };
                    if (key === 'pause') return () => { sendCommand('pause'); };
                    if (key === 'closest') return () => ({ requestFullscreen() { sendCommand('fullscreen'); } });
                    if (key === '_internalState') return _state; 
                    return target[key];
                },
                set(target, key, value) {
                    target[key] = value; 
                    if (key === 'muted')        sendCommand(value ? 'mute' : 'unmute');
                    if (key === 'volume')       sendCommand('volume', value);
                    if (key === 'playbackRate') sendCommand('rate', value);
                    if (key === 'loop')         sendCommand('loop');
                    if (key === 'currentTime')  sendCommand('seek', value);
                    if (typeof key === 'string' && key.startsWith('vb_')) {
                        sendCommand(key, value);
                    }
                    return true;
                }
            });

            if (bar.ui && !bar.ui.hasVideo(proxyVideo)) {
                bar.ui.trackVideo(proxyVideo);
                if (instances['volumeBoost']) {
                    instances['volumeBoost']._boundVideo = proxyVideo;
                    instances['volumeBoost']._audioConnected = true;
                }
            }

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

        if (state) {
            const internalState = proxyVideo._internalState;
            if (internalState) {
                Object.assign(internalState, state);
                if (evtType && internalState._listeners[evtType]) {
                    const fakeEvent = new Event(evtType);
                    Object.defineProperty(fakeEvent, 'target', { value: proxyVideo, writable: false });
                    internalState._listeners[evtType].forEach(fn => {
                        try { fn(fakeEvent); } catch (e) {}
                    });
                }
            }
        }

        if (bar.ui?.barElement) {
            bar.ui.updateUIState();
        }
    });

    try {
        chrome.storage.onChanged.addListener((changes) => {
            if (changes.ypp_domain_profiles && instances['domainMemory']) {
                const activeKey = instances['domainMemory'].getScopeKey();
                const myProfile = changes.ypp_domain_profiles.newValue?.[activeKey];
                if (myProfile) {
                    sendCommand('sync-profile', myProfile);
                }
            }
        });
    } catch (_) {}
}

export function runIframeLogic(instances) {
    let activeVideo = null;
    let mainObserver = null;
    let removalObserver = null;
    let heartbeatInterval = null;

    const capabilities = {
        pip: document.pictureInPictureEnabled !== false,
        fullscreen: document.fullscreenEnabled !== false,
        host: window.location.hostname,
        isFullscreen: !!document.fullscreenElement
    };

    const relayVideoEvents = (video) => {
        if (!video || video._yppBridged) return;
        if (activeVideo && activeVideo !== video) return;
        
        video._yppBridged = true;
        activeVideo = video;

        if (mainObserver) {
            mainObserver.disconnect();
            mainObserver = null;
        }

        const relay = (type) => {
            try {
                window.top.postMessage({
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

        video.addEventListener('mousemove', (e) => {
            if (e.movementX === 0 && e.movementY === 0) return;
            try {
                window.top.postMessage({ ypp: true, type: 'iframe-mousemove' }, '*');
            } catch (_) {}
        }, { passive: true });

        document.addEventListener('fullscreenchange', () => {
            capabilities.isFullscreen = !!document.fullscreenElement;
            relay('fullscreenchange');
        }, { passive: true });

        heartbeatInterval = setInterval(() => {
            if (video.isConnected && video.offsetWidth > 0 && video.offsetHeight > 0) {
                relay('heartbeat');
            } else if (video.isConnected) {
                relay('video-hidden');
            }
        }, 1000);

        removalObserver = new MutationObserver(() => {
            if (!document.contains(video)) {
                removalObserver.disconnect();
                removalObserver = null;
                clearInterval(heartbeatInterval);
                relay('video-hidden'); 
                video._yppBridged = false; 
                activeVideo = null;
                startMainObserver();
            }
        });
        removalObserver.observe(document.documentElement, { childList: true, subtree: true });

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
            
            if (cmd === 'style')        video.style.setProperty(value.prop, value.val, value.imp || '');
            if (cmd === 'style-remove') video.style.removeProperty(value);
            if (cmd === 'class-add')    video.classList.add(value);
            if (cmd === 'class-remove') video.classList.remove(value);
        });
        
        if (cmd === 'applyOverlay' && window.YPP?.features?.VideoFiltersOverlay) {
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

        if (typeof cmd === 'string' && cmd.startsWith('vb_') && instances['volumeBoost']) {
            const method = cmd.replace('vb_', '');
            if (typeof instances['volumeBoost'][method] === 'function') {
                if (Array.isArray(value)) {
                    instances['volumeBoost'][method](...value);
                } else {
                    instances['volumeBoost'][method](value);
                }
            }
        }
    });
}
