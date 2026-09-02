(function() {
    // Escapes MV3 isolated world and runs in the page context.
    // Constantly checks for YouTube account items and extracts Polymer data properties
    // to expose the avatar URLs to the content script world via HTML attributes.
    function extractAvatars() {
        const items = document.querySelectorAll('ytd-active-account-header-renderer, ytd-account-item-renderer, ytd-account-item');
        for (const el of items) {
            try {
                const d = el.data || el.__data;
                if (d && !el.hasAttribute('data-ypp-avatar')) {
                    const thumbs = d.accountPhoto?.thumbnails || d.thumbnail?.thumbnails || d.photo?.thumbnails || d.thumbnails;
                    if (Array.isArray(thumbs) && thumbs.length) {
                        const best = thumbs[thumbs.length - 1];
                        if (best?.url) el.setAttribute('data-ypp-avatar', best.url);
                    } else if (d.accountPhoto?.url) {
                        el.setAttribute('data-ypp-avatar', d.accountPhoto.url);
                    } else if (d.thumbnail?.url) {
                        el.setAttribute('data-ypp-avatar', d.thumbnail.url);
                    }
                }
            } catch(e) {}
        }
    }
    
    // Run once on load
    extractAvatars();

    // Run on mutations (when the menu is opened/populated)
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        try {
            for (const m of mutations) {
                if (m.addedNodes) {
                    for (const node of m.addedNodes) {
                        if (node.nodeType === 1) {
                            shouldRun = true;
                            break;
                        }
                    }
                }
                if (shouldRun) break;
            }
        } catch (e) {}
        if (shouldRun) extractAvatars();
    });
    
    // Observe the app root or document body
    const root = window.YPP.DOMManager?.getAppRoot() || document.body;
    if (root) {
        observer.observe(root, { childList: true, subtree: true });
    }
})();
