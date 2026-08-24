export const SELECTORS = {
    TITLE: 'h1, yt-formatted-string[id="title"], .title',
    OWNER: 'ytd-channel-name a, #owner-text a, a.yt-simple-endpoint[href*="/@"]',
    STATS: 'yt-formatted-string#stats, .metadata-stats, div[class*="metadata"], yt-formatted-string.ytd-playlist-byline-renderer',
    BANNER_IMG: 'yt-image img, #thumbnail img, .yt-core-image, img.yt-img-shadow, yt-playlist-header-view-model img',
    VIDEO_TITLE: 'a#video-title, yt-formatted-string#video-title, h3 a',
    VIDEO_URL: 'a#video-title, a#thumbnail, a.yt-simple-endpoint[href*="/watch"]',
    VIDEO_CHANNEL: 'ytd-channel-name a, #channel-name a, .ytd-channel-name a',
    THUMB_IMG: 'ytd-thumbnail img, yt-image img, .yt-core-image, img#img',
    INDEX: '#index-container, .index-message-wrapper, yt-formatted-string#index',
    TIME_OVERLAY: 'ytd-thumbnail-overlay-time-status-renderer, badge-shape, span.ytd-thumbnail-overlay-time-status-renderer',
    BADGE_SPAN: '#text, .badge-shape-wiz__text'
};
