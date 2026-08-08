(function() {
    if (window._yppYtcfgBridgeLoaded) return;
    window._yppYtcfgBridgeLoaded = true;

    // Security: only respond to requests from the YouTube origin.
    // This prevents cross-origin iframes embedded on youtube.com from
    // triggering this bridge and reading auth tokens (VISITOR_DATA,
    // DELEGATED_SESSION_ID) from the response.
    const YOUTUBE_ORIGIN = 'https://www.youtube.com';

    window.addEventListener('message', (e) => {
        // Reject messages from any origin other than YouTube itself.
        if (e.origin !== YOUTUBE_ORIGIN) return;

        if (e.data && e.data.type === 'YPP_YTCFG_REQUEST') {
            try {
                // Target the response only to the YouTube origin (not '*'),
                // so cross-origin listeners cannot intercept it.
                window.postMessage({
                    type: 'YPP_YTCFG_RESPONSE',
                    reqId: e.data.reqId,
                    config: {
                        apiKey:        window.ytcfg?.get('INNERTUBE_API_KEY'),
                        context:       window.ytcfg?.get('INNERTUBE_CONTEXT'),
                        visitorData:   window.ytcfg?.get('VISITOR_DATA'),
                        clientVersion: window.ytcfg?.get('INNERTUBE_CLIENT_VERSION') || '2.20240101.01.00',
                        sessionIndex:  window.ytcfg?.get('SESSION_INDEX') || '0',
                        pageId:        window.ytcfg?.get('DELEGATED_SESSION_ID') || window.ytcfg?.get('PAGE_ID')
                    }
                }, YOUTUBE_ORIGIN);
            } catch (err) {
                // Ignore errors (e.g. if ytcfg is not yet available)
            }
        }
    });
})();
