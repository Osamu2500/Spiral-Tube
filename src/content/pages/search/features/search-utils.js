/**
 * Search Utils
 * Stateless DOM element classification and helpers for the search page.
 * Does not affect unrelated files/functionality outside its scope.
 */

export const SearchUtils = {
    // -------------------------------------------------------------------------
    // Static constants (tag-level classification)
    // -------------------------------------------------------------------------

    NOISE_TAGS: new Set([
        'ytd-shelf-renderer',
        'ytd-horizontal-card-list-renderer',
        'ytd-vertical-list-renderer',
        'ytd-universal-watch-card-renderer',
        'ytd-background-promo-renderer',
        'ytd-search-refinement-card-renderer',
        'ytd-reel-shelf-renderer',
        'ytd-rich-shelf-renderer',
        'ytd-rich-section-renderer',
        'yt-horizontal-list-renderer',
        'yt-collection-shelf-view-model'
    ]),

    VIDEO_TAGS: new Set([
        'ytd-video-renderer',
        'ytd-compact-video-renderer', // used by music/song results and some compact search layouts
        'ytd-playlist-renderer',
        'ytd-radio-renderer',
        'ytd-channel-renderer',
        'yt-lockup-view-model',
        'ytd-lockup-view-model'
    ]),

    SELECTORS: {
        VERTICAL_ITEMS: 'ytd-vertical-list-renderer #items',
        HORIZONTAL_SCROLL: 'ytd-horizontal-card-list-renderer #scroll-container',
        HORIZONTAL_ITEMS: 'ytd-horizontal-card-list-renderer #items',
        GENERIC_ITEMS: '#items',
        GENERIC_SCROLL: '#scroll-container',
        CONTENTS: '#contents',
        RENDERERS: 'ytd-video-renderer, ytd-compact-video-renderer, ytd-playlist-renderer, ytd-radio-renderer, ytd-rich-item-renderer, ytd-channel-renderer, yt-lockup-view-model',
        FLATTENABLE_RENDERERS: 'ytd-video-renderer, ytd-compact-video-renderer, ytd-playlist-renderer, ytd-radio-renderer, ytd-rich-item-renderer, yt-lockup-view-model',
        THUMBNAIL: 'ytd-thumbnail, ytd-playlist-thumbnail',
        DISMISSIBLE: '#dismissible',
        INNER_THUMB: 'a#thumbnail, yt-image',
        TEXT_WRAPPER: '.text-wrapper',
        ACTION_MENU: '#action-menu, .action-menu',
        BADGES: 'ytd-badge-supported-renderer, #badges',
        CHANNEL_INFO: '#channel-info',
        SHORTS_LINK: 'a[href*="/shorts/"]',
        SHORTS_OVERLAY: '[overlay-style="SHORTS"]',
        TITLE: '#title-container #title',
        SHELF_HEADER_TITLE: '.ytShelfHeaderLayoutTitleRow',
        SHORTS_BTN: 'ytd-icon-button-renderer[aria-label="Shorts"]',
        BADGE_RENDERER: 'ytd-badge-supported-renderer'
    },

    // -------------------------------------------------------------------------
    // Shorts & Shelf detection helpers
    // -------------------------------------------------------------------------

    isShorts(node) {
        const { SELECTORS } = this;
        const tag = node.tagName.toLowerCase();
        
        if (tag === 'ytd-reel-shelf-renderer') return true;
        if (tag === 'ytd-rich-shelf-renderer' && node.hasAttribute('is-shorts')) return true;
        if (node.querySelector(SELECTORS.SHORTS_LINK)) return true;
        if (node.querySelector(SELECTORS.SHORTS_OVERLAY)) return true;

        const title = node.querySelector(SELECTORS.TITLE)?.textContent?.trim() || '';
        if (/shorts/i.test(title)) return true;

        const badges = node.querySelectorAll(SELECTORS.BADGE_RENDERER);
        for (let i = 0; i < badges.length; i++) {
            if (badges[i].textContent.trim() === 'Shorts') return true;
        }
        
        return this.isShortsShelf(node);
    },

    isShortsShelf(node) {
        const { SELECTORS } = this;
        
        const title = node.querySelector(SELECTORS.TITLE)?.textContent?.trim() || '';
        if (/shorts/i.test(title)) return true;
        
        const titleRow = node.querySelector(SELECTORS.SHELF_HEADER_TITLE)?.textContent?.trim() || '';
        if (/shorts/i.test(titleRow)) return true;
        
        if (node.querySelector(SELECTORS.SHORTS_BTN)) return true;
        if (node.querySelector(SELECTORS.SHORTS_LINK)) return true;
        
        return false;
    },

    isFlattenableShelf(node) {
        const tag = node.tagName.toLowerCase();
        
        if (
            tag === 'ytd-horizontal-card-list-renderer' ||
            tag === 'ytd-vertical-list-renderer'        ||
            tag === 'ytd-shelf-renderer'                ||
            tag === 'ytd-rich-shelf-renderer'           ||
            tag === 'yt-collection-shelf-view-model'
        ) {
            if (!this.isShortsShelf(node)) {
                // ytd-compact-video-renderer covers music/song results in shelves —
                // without it, music shelves are never flattenable and get hidden.
                return !!node.querySelector(this.SELECTORS.FLATTENABLE_RENDERERS);
            }
        }
        return false;
    }
};

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.SearchUtils = SearchUtils;
