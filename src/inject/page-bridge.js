/**
 * page-bridge.js — MAIN world script
 * -----------------------------------
 * Runs in MAIN world (world: "MAIN") at document_start.
 * Intercepts YouTube's internal ytInitialData to cache videoId → channelHandle
 * mappings.
 *
 * Modified to implement cache size constraints, yt-action seeding, and
 * channelId bridging via DOM dataset for the ISOLATED world context.
 */

(function () {
    'use strict';

    // Initialize the shared namespace and cache on window
    window.YPP = window.YPP || {};
    window.YPP.channelCache = window.YPP.channelCache || new Map();
    window.YPP.channelIdCache = window.YPP.channelIdCache || new Map();

    const cache = window.YPP.channelCache;
    const channelIdCache = window.YPP.channelIdCache;

    const VIDEO_CACHE_MAX = 2000;
    const CHANNEL_ID_CACHE_MAX = 1000;
    const videoCacheOrder = [];
    const channelIdCacheOrder = [];
    
    let channelIdCacheDirty = false;
    let videoCacheDirty = false;

    let flushScheduled = false;
    function flushCacheToDOM() {
        if (flushScheduled || (!channelIdCacheDirty && !videoCacheDirty)) return;
        flushScheduled = true;
        Promise.resolve().then(() => {
            flushScheduled = false;
            try {
                const root = document.documentElement;
                if (!root) return;
                if (channelIdCacheDirty) {
                    channelIdCacheDirty = false;
                    root.setAttribute('data-ypp-channelid-cache', JSON.stringify(Object.fromEntries(channelIdCache)));
                }
                if (videoCacheDirty) {
                    videoCacheDirty = false;
                    root.setAttribute('data-ypp-video-cache', JSON.stringify(Object.fromEntries(cache)));
                }
            } catch (_) {}
        });
    }

    /**
     * Defensive, depth-limited iterative walk through YouTube's undocumented JSON schema.
     * Every property access is wrapped in try/catch to survive schema changes.
     */
    function walkRendererTree(data, startDepth = 0) {
        if (!data || typeof data !== 'object') return;
        
        const stack = [[data, startDepth]];
        const visited = new WeakSet();
        const MAX_TIME_MS = 12;

        function processChunk() {
            const start = performance.now();
            
            while (stack.length > 0) {
                if (performance.now() - start > MAX_TIME_MS) {
                    setTimeout(processChunk, 0); // Yield and resume
                    return;
                }

                const [obj, depth] = stack.pop();
                if (!obj || typeof obj !== 'object' || visited.has(obj) || depth > 30) continue;
                visited.add(obj);

                if (Array.isArray(obj)) {
                    for (let i = obj.length - 1; i >= 0; i--) {
                        stack.push([obj[i], depth + 1]);
                    }
                    continue;
                }

                // Defensive extraction
                let videoId = null;
                try { videoId = obj.videoId; } catch(e) {}
                if (!videoId) { try { videoId = obj.playlistVideoRenderer?.videoId; } catch(e) {} }
                if (!videoId) { try { videoId = obj.gridVideoRenderer?.videoId; } catch(e) {} }
                if (!videoId) { try { videoId = obj.compactVideoRenderer?.videoId; } catch(e) {} }
                if (!videoId) { try { videoId = obj.richItemRenderer?.content?.videoRenderer?.videoId; } catch(e) {} }

                let browseId = null;
                try { browseId = obj.browseId; } catch(e) {}
                if (!browseId) { try { browseId = obj.channelId; } catch(e) {} }
                if (!browseId) { try { browseId = obj.navigationEndpoint?.browseEndpoint?.browseId; } catch(e) {} }
                if (!browseId) { try { browseId = obj.gridChannelRenderer?.channelId; } catch(e) {} }

                let channelHandle = null;
                try { channelHandle = obj.ownerText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url; } catch(e) {}
                if (!channelHandle) { try { channelHandle = obj.shortBylineText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url; } catch(e) {} }
                if (!channelHandle) { try { channelHandle = obj.longBylineText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url; } catch(e) {} }

                if (channelHandle) {
                    try {
                        const normalized = channelHandle.toLowerCase().replace(/^https:\/\/www\.youtube\.com/, '');
                        
                        if (videoId) {
                            if (cache.get(videoId) !== normalized) {
                                cacheInsert(cache, videoCacheOrder, videoId, normalized, VIDEO_CACHE_MAX);
                                videoCacheDirty = true;
                            }
                        }
                        if (browseId && typeof browseId === 'string' && browseId.startsWith('UC')) {
                            const key = ('/channel/' + browseId).toLowerCase();
                            if (channelIdCache.get(key) !== normalized) {
                                cacheInsert(channelIdCache, channelIdCacheOrder, key, normalized, CHANNEL_ID_CACHE_MAX);
                                channelIdCacheDirty = true;
                            }
                        }
                    } catch(e) {}
                }

                try {
                    const keys = Object.keys(obj);
                    for (let i = keys.length - 1; i >= 0; i--) {
                        const key = keys[i];
                        if (key === 'responseContext' || key === 'trackingParams') continue;
                        
                        let val;
                        try { val = obj[key]; } catch(e) { continue; }
                        
                        if (val && typeof val === 'object') {
                            stack.push([val, depth + 1]);
                        }
                    }
                } catch(e) {}
            }
            
            flushCacheToDOM();
        }

        processChunk();
    }

    function processInitialData(data) {
        walkRendererTree(data, 0);
    }

    // Intercept ytInitialData assignment (fires early on page loads)
    let _ytInitialData = null;
    try {
        Object.defineProperty(window, 'ytInitialData', {
            configurable: true,
            enumerable: true,
            get() { return _ytInitialData; },
            set(val) {
                _ytInitialData = val;
                processInitialData(val);
            }
        });
    } catch (e) {
        // If already defined (SPA navigation), process it now
        if (window.ytInitialData) processInitialData(window.ytInitialData);
    }

    // Also hook into YouTube's SPA navigation responses
    // YouTube fires yt-navigate-finish and updates ytInitialData internally.
    document.addEventListener('yt-page-data-updated', () => {
        try {
            if (window.ytInitialData) processInitialData(window.ytInitialData);
        } catch (e) {}
    });

    // Hook yt-action for infinite scroll continuations
    document.addEventListener('yt-action', (e) => {
        try {
            const args = e?.detail?.args;
            if (!Array.isArray(args)) return;
            for (const arg of args) {
                if (!arg || typeof arg !== 'object') continue;
                if (arg.appendContinuationItemsAction?.continuationItems) {
                    walkRendererTree(arg.appendContinuationItemsAction.continuationItems);
                }
                if (arg.reloadContinuationItemsCommand?.continuationItems) {
                    walkRendererTree(arg.reloadContinuationItemsCommand.continuationItems);
                }
            }
            flushCacheToDOM();
        } catch (_) {}
    });

    // Also intercept polymer fetch responses by watching XHR/fetch for browse/next endpoints
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
        return originalFetch.apply(this, args).then(response => {
            const url = (typeof args[0] === 'string' ? args[0] : args[0]?.url) || '';
            if (url.includes('/browse') || url.includes('/next') || url.includes('/search')) {
                response.clone().json().then(data => {
                    processInitialData(data);
                }).catch(() => {});
            }
            // V3 Netflix Subtitles Interception
            if (url.includes('/api/timedtext')) {
                response.clone().json().then(data => {
                    window.dispatchEvent(new CustomEvent('ypp-timedtext-intercepted', {
                        detail: { url, data }
                    }));
                }).catch(() => {});
            }
            return response;
        });
    };

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalXhrOpen.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
            if (this._url && this._url.includes('/api/timedtext')) {
                try {
                    const data = JSON.parse(this.responseText);
                    window.dispatchEvent(new CustomEvent('ypp-timedtext-intercepted', {
                        detail: { url: this._url, data }
                    }));
                } catch(e) {
                    console.warn('[YPP] Failed to parse timedtext response', e);
                }
            }
        });
        return originalXhrSend.apply(this, args);
    };

})();
