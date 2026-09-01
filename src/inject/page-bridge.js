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

    function cacheInsert(store, orderList, key, value, max) {
        if (!store.has(key)) {
            orderList.push(key);
            if (orderList.length > max) {
                store.delete(orderList.shift());
            }
        }
        store.set(key, value);
    }

    /**
     * Walk a YouTube renderer object tree and extract videoId → channelHandle pairs.
     * @param {*} obj - Any JSON-like object from ytInitialData
     */
    function walkRendererTree(obj) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
            for (const item of obj) walkRendererTree(item);
            return;
        }

        // Common renderer shapes that carry both videoId and ownerChannelName / channelHandle
        const videoId =
            obj.videoId ||
            obj.playlistVideoRenderer?.videoId ||
            obj.gridVideoRenderer?.videoId ||
            obj.compactVideoRenderer?.videoId ||
            obj.richItemRenderer?.content?.videoRenderer?.videoId;

        const browseId = 
            obj.browseId ||
            obj.channelId ||
            obj.navigationEndpoint?.browseEndpoint?.browseId ||
            obj.gridChannelRenderer?.channelId;

        const channelHandle =
            obj.ownerText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url ||
            obj.shortBylineText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url ||
            obj.longBylineText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url;

        if (channelHandle) {
            // Normalise to lowercase /@ format
            const normalized = channelHandle.toLowerCase().replace(/^https:\/\/www\.youtube\.com/, '');
            
            if (videoId) {
                cacheInsert(cache, videoCacheOrder, videoId, normalized, VIDEO_CACHE_MAX);
            }
            if (browseId && typeof browseId === 'string' && browseId.startsWith('UC')) {
                const key = ('/channel/' + browseId).toLowerCase();
                if (channelIdCache.get(key) !== normalized) {
                    cacheInsert(channelIdCache, channelIdCacheOrder, key, normalized, CHANNEL_ID_CACHE_MAX);
                    channelIdCacheDirty = true;
                }
            }
        }

        // Recurse through all values
        for (const val of Object.values(obj)) {
            if (val && typeof val === 'object') walkRendererTree(val);
        }
    }

    let flushScheduled = false;
    function flushCacheToDOM() {
        if (flushScheduled || !channelIdCacheDirty) return;
        flushScheduled = true;
        Promise.resolve().then(() => {
            flushScheduled = false;
            if (!channelIdCacheDirty) return;
            try {
                const root = document.documentElement;
                if (!root) return;
                channelIdCacheDirty = false;
                root.setAttribute('data-ypp-channelid-cache', JSON.stringify(Object.fromEntries(channelIdCache)));
            } catch (_) {}
        });
    }

    /**
     * Process ytInitialData when it becomes available.
     */
    function processInitialData(data) {
        try {
            walkRendererTree(data);
            flushCacheToDOM();
        } catch (e) {
            // Silent — never crash the page
        }
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
                } catch(e) {}
            }
        });
        return originalXhrSend.apply(this, args);
    };

})();
