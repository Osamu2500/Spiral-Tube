/**
 * Centralized DOM query getters for YouTube elements.
 * 
 * Replaces duplicate querying across features to improve maintainability 
 * and performance when classes/selectors change.
 */

// Player elements
export function getPlayerVideoElement(container) {
    if (container) {
        return container.querySelector('video.html5-main-video') || container.querySelector('video');
    }
    return document.querySelector('video.html5-main-video') || document.querySelector('video');
}

export function getPlayerBar(container) {
    const root = container || document;
    return root.querySelector('.ytp-chrome-bottom');
}

export function getProgressBar(container) {
    const root = container || document;
    return root.querySelector('.ytp-progress-bar-container') || root.querySelector('.ytp-progress-bar');
}

// Player controls
export function getRightControls(container) {
    const root = container || document;
    return root.querySelector('.ytp-right-controls') || root.querySelector('.ytp-right-controls-right');
}

export function getLeftControls(container) {
    const root = container || document;
    return root.querySelector('.ytp-left-controls');
}

// Metadata action buttons (Like, Dislike, Share, Download)
export function getActionButtonsContainer(container) {
    const root = container || document;
    return root.querySelector('ytd-menu-renderer') || root.querySelector('#menu') || root.querySelector('ytd-watch-metadata #actions');
}

export function getLikeButton(container) {
    const root = container || document;
    return root.querySelector('ytd-watch-metadata ytd-toggle-button-renderer:first-child button') || 
           root.querySelector('segmented-like-dislike-button-view-model button:first-child') ||
           root.querySelector('like-button-view-model button') ||
           root.querySelector('[aria-label*="like this video" i]') ||
           root.querySelector('button.yt-spec-button-shape-next--tonal[aria-label*="like" i]');
}

export function getDislikeButton(container) {
    const root = container || document;
    return root.querySelector('dislike-button-view-model button') ||
           root.querySelector('[aria-label*="dislike this video" i]') ||
           root.querySelector('[aria-label*="I dislike this" i]');
}

export function getSubscribeButton(container) {
    const root = container || document;
    return root.querySelector('ytd-subscribe-button-renderer') || root.querySelector('yt-smartimation');
}

export function getChannelName(container) {
    const root = container || document;
    return root.querySelector('ytd-video-owner-renderer ytd-channel-name a') || root.querySelector('#upload-info .ytd-channel-name a');
}

export function getAdElements() {
    return document.querySelector('.video-ads, .ytp-ad-module');
}
