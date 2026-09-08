import { TIMING } from '../utils/constants.js';
import { readChannelCacheFromDOM, readChannelIdentityCacheFromDOM } from '../utils/channel-utils.js';
import { debounce, throttle, pollUntil } from '../utils/common.js';
import { isChannelPagePath } from '../utils/channel-utils.js';
import { prefs } from './state-manager.js';
import { startHiding, injectZeroJSCSS } from './bootstrapper.js';


const YT_HIDER_CACHE_ATTR = 'data-ypp-video-cache';
const YT_HIDER_CHANNELID_CACHE_ATTR = 'data-ypp-channelid-cache';
let currentPath = window.location.pathname;
let pageLoadTimeout = null;

const PAGE_SELECTORS = {
  '/': [
    'ytd-rich-grid-renderer',
    'ytd-two-column-browse-results-renderer',
    'ytm-browse',
    'ytm-rich-grid-renderer',
  ],
  '/results': [
    'ytd-search',
    'ytd-item-section-renderer',
    'ytm-search',
    'ytm-section-list-renderer',
  ],
  '/watch': [
    'ytd-watch-flexy',
    '#primary',
    'ytm-watch',
    'ytm-single-column-watch-next-results-renderer',
  ],
  '/feed/subscriptions': [
    'ytd-browse',
    'ytd-section-list-renderer',
    'ytm-browse',
  ],
};

export function waitForPageElements(pathname, timeout = 3000) {
  let selectors = PAGE_SELECTORS[pathname];

  if (!selectors && isChannelPagePath(pathname)) {
    selectors = PAGE_SELECTORS['/'];
  }

  if (!selectors) {
    return Promise.resolve(true);
  }

  const checkElements = () => {
    for (const selector of selectors) {
      if (document.querySelector(selector)) {
        return true;
      }
    }
    return false;
  };

  return pollUntil(checkElements, { timeout }).promise.then(found => {
    if (!found) console.warn(`Timeout waiting for page elements on ${pathname}`);
    return found;
  });
}

export function detectPageChange() {
  const newPath = window.location.pathname;

  if (newPath !== currentPath) {
    currentPath = newPath;

    if (pageLoadTimeout) {
      clearTimeout(pageLoadTimeout);
    }

    pageLoadTimeout = setTimeout(() => {
      startHiding(currentPath);
      pageLoadTimeout = null;
    }, TIMING.PAGE_CHANGE_DELAY);
    
    injectZeroJSCSS();

    return true;
  }

  return false;
}

const throttledHiding = throttle(() => {
  if (!detectPageChange()) {
    startHiding(currentPath);
  }
}, 250);

export function onMutations(mutations) {
  const cacheChanged = mutations.some(
    m => m.type === 'attributes' && m.attributeName === YT_HIDER_CACHE_ATTR,
  );
  const channelIdCacheChanged = mutations.some(
    m =>
      m.type === 'attributes' &&
      m.attributeName === YT_HIDER_CHANNELID_CACHE_ATTR,
  );
  if (cacheChanged) readChannelCacheFromDOM();
  if (channelIdCacheChanged) readChannelIdentityCacheFromDOM();

  throttledHiding();
}
