/**
 * @fileoverview
 * DOM Querying logic for the Auto Like Feature.
 * Separated to reduce bloat and organize responsibilities.
 */

export const SELECTORS = {
    LIKE_BUTTON: [
        'ytd-watch-metadata ytd-toggle-button-renderer:first-child button',
        'segmented-like-dislike-button-view-model button:first-child',
        'like-button-view-model button',
        '[aria-label*="like this video" i]',
        '[aria-label*="I like this" i]',
        'button.yt-spec-button-shape-next--tonal[aria-label*="like" i]',
    ],
    DISLIKE_BUTTON: [
        'dislike-button-view-model button',
        '[aria-label*="dislike this video" i]',
        '[aria-label*="I dislike this" i]',
    ],
    SUBSCRIBE_BUTTON: [
        'ytd-subscribe-button-renderer',
        'yt-smartimation',
    ],
    VIDEO: 'video.html5-main-video',
    MOVIE_PLAYER: '#movie_player',
    AD_ELEMENTS: '.video-ads, .ytp-ad-module',
};

export const LIKE_BUTTON_WAIT_MS = 10000;
export const VIDEO_ELEMENT_WAIT_MS = 15000;

export function findButton(selectors) {
    for (const selector of selectors) {
        const btn = document.querySelector(selector);
        if (btn) return btn;
    }
    return null;
}

export function findLikeButton() {
    return findButton(SELECTORS.LIKE_BUTTON);
}

export function findDislikeButton() {
    return findButton(SELECTORS.DISLIKE_BUTTON);
}

export async function resolveLikeButton(waitForElementFn, timeoutMs = LIKE_BUTTON_WAIT_MS) {
    let btn = findLikeButton();
    if (btn) return btn;

    const compoundSelector = SELECTORS.LIKE_BUTTON.join(', ');
    btn = await waitForElementFn(compoundSelector, timeoutMs);
    return btn ?? findLikeButton();
}

export function isButtonPressed(btn) {
    if (!btn) return false;
    const isPressed = btn.getAttribute('aria-pressed') === 'true';
    const isActive  = btn.classList.contains('active') || btn.classList.contains('style-default-active');
    return isPressed || isActive;
}

export function isAlreadyLiked() {
    const btn = findLikeButton();
    return isButtonPressed(btn);
}

export function isDisliked() {
    const btn = findDislikeButton();
    return isButtonPressed(btn);
}

export function isSubscribed() {
    for (const selector of SELECTORS.SUBSCRIBE_BUTTON) {
        const el = document.querySelector(selector);
        if (!el) continue;
        if (el.hasAttribute('subscribed') || el.querySelector('[subscribed]')) return true;
        const label = el.textContent?.trim().toLowerCase() ?? '';
        if (label.includes('subscribed') && !label.includes('unsubscribe')) return true;
    }
    // No subscribe button found (e.g., own channel, or logged out)
    return true; 
}

export function isAdPlaying() {
    const player = document.getElementById(SELECTORS.MOVIE_PLAYER.slice(1));
    if (player?.classList.contains('ad-showing')) return true;

    const adEl = document.querySelector(SELECTORS.AD_ELEMENTS);
    return !!adEl && adEl.getBoundingClientRect().height > 0;
}
