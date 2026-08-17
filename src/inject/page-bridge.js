/**
 * page-bridge.js — MAIN world script
 * -----------------------------------
 * Runs in MAIN world (world: "MAIN") at document_start.
 * Intercepts YouTube's internal ytInitialData to cache videoId → channelHandle
 * mappings. The ISOLATED-world content scripts can read from window.YPP.channelCache.
 *
 * Based on the reference extension's page-bridge.js approach.
 */

(function () {
    'use strict';

    // Initialize the shared namespace and cache on window
    window.YPP = window.YPP || {};
    window.YPP.channelCache = window.YPP.channelCache || new Map();

    const cache = window.YPP.channelCache;

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

        const channelHandle =
            obj.ownerText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url ||
            obj.shortBylineText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url ||
            obj.longBylineText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url;

        if (videoId && channelHandle) {
            // Normalise to lowercase /@ format
            const normalized = channelHandle.toLowerCase().replace(/^https:\/\/www\.youtube\.com/, '');
            cache.set(videoId, normalized);
        }

        // Recurse through all values
        for (const val of Object.values(obj)) {
            if (val && typeof val === 'object') walkRendererTree(val);
        }
    }

    /**
     * Process ytInitialData when it becomes available.
     */
    function processInitialData(data) {
        try {
            walkRendererTree(data);
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
    // We listen for the custom event YouTube uses to broadcast page data.
    document.addEventListener('yt-page-data-updated', () => {
        try {
            if (window.ytInitialData) processInitialData(window.ytInitialData);
        } catch (e) {}
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
            return response;
        });
    };

})();
