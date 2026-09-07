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

function waitForPageElements(pathname, timeout = 3000) {
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
    if (!found) logger.warn(`Timeout waiting for page elements on ${pathname}`);
    return found;
  });
}

async function startHiding(pathname) {
  if (!prefs.extensionEnabled) {
    resetAppliedFilters(true);
    removeWarning();
    return;
  }

  await waitForPageElements(pathname);

  const canHideBlacklisted = shouldHideBlacklisted(pathname);
  const canHideWatched = shouldHideWatched(pathname);
  const canHideViews = shouldHideViews(pathname);
  const canHideShortsFlag = shouldHideShorts(pathname);
  const canHideDateFilter = shouldHideDateFilter(pathname);
  const canHideMixes = shouldHideMixes(pathname);
  const canHidePlaylists = shouldHidePlaylists(pathname);
  const canHideLives = shouldHideLives(pathname);

  if (canHideBlacklisted) {
    hideBlacklisted();
  }

  if (canHideWatched) {
    hideWatched(pathname);
  }

  if (canHideViews) {
    hideUnderVisuals();
  }

  if (canHideDateFilter) {
    hideDateFilter();
  }

  if (isInlineWhitelistPath(pathname)) {
    syncInlineWhitelistButton(pathname);
    syncInlineBlacklistButton(pathname);
  }
}

function detectPageChange() {
  const newPath = window.location.pathname;

  if (newPath !== currentPath) {
    logger.log(`Page changed: ${currentPath} -> ${newPath}`);
    currentPath = newPath;

    removeWarning();
    rapidLoaderCount = 0;
    warningDismissed = false;

    // cleanupTour();
    // removeTutorialOverlay();
    // ensureHeaderButton();

    removeInlineWhitelistButton();
    removeInlineBlacklistButton();
    removeBlacklistHoverButton();

    if (pageLoadTimeout) {
      clearTimeout(pageLoadTimeout);
    }

    pageLoadTimeout = setTimeout(() => {
      startHiding(currentPath);
      pageLoadTimeout = null;
    }, TIMING.PAGE_CHANGE_DELAY);
    
    injectZeroJSCSS(); // Update CSS rules for the new path

    // header dropdown removed

    return true;
  }

  return false;
}

const injectZeroJSCSS = () => {
  if (!prefs.extensionEnabled) return;
  let css = '';
  
  if (prefs.hideShortsEnabled && shouldHideShorts(currentPath)) {
    const action = prefs.hideShortsMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-reel-shelf-renderer, 
      ytm-reel-shelf-renderer,
      ytd-rich-shelf-renderer[is-shorts],
      ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
      ytd-rich-section-renderer:has(ytd-reel-shelf-renderer),
      ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),
      ytd-rich-item-renderer:has(a[href^="/shorts"]),
      ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),
      ytd-video-renderer:has(a[href^="/shorts"]),
      ytd-grid-video-renderer:has(a[href^="/shorts"]),
      ytd-compact-video-renderer:has(a[href^="/shorts"]) {
        ${action}
      }
    `;
  }
  
  if (prefs.hideMixesEnabled && shouldHideMixes(currentPath)) {
    const action = prefs.hideMixesMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-radio-renderer,
      ytd-compact-radio-renderer,
      ytd-rich-item-renderer:has(a[href*="start_radio=1"]), 
      ytd-rich-item-renderer:has(a[href*="list=RD"]),
      ytd-rich-item-renderer:has([title^="My Mix"]),
      ytd-rich-item-renderer:has([title^="Mix -"]),
      ytd-video-renderer:has(a[href*="start_radio=1"]),
      ytd-video-renderer:has(a[href*="list=RD"]),
      ytd-video-renderer:has([title^="My Mix"]),
      ytd-video-renderer:has([title^="Mix -"]),
      ytd-compact-video-renderer:has(a[href*="start_radio=1"]),
      ytd-compact-video-renderer:has(a[href*="list=RD"]),
      ytd-compact-video-renderer:has([title^="My Mix"]),
      ytd-compact-video-renderer:has([title^="Mix -"]) {
        ${action}
      }
    `;
  }

  if (prefs.hidePlaylistsEnabled && shouldHidePlaylists(currentPath)) {
    const action = prefs.hidePlaylistsMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-playlist-renderer,
      ytd-compact-playlist-renderer,
      ytd-grid-playlist-renderer,
      ytd-rich-item-renderer:has(ytd-thumbnail-overlay-bottom-panel-renderer),
      ytd-rich-item-renderer:has(ytd-playlist-thumbnail),
      ytd-video-renderer:has(ytd-thumbnail-overlay-bottom-panel-renderer),
      ytd-compact-video-renderer:has(ytd-thumbnail-overlay-bottom-panel-renderer) {
        ${action}
      }
    `;
  }

  if (prefs.hideLivesEnabled && shouldHideLives(currentPath)) {
    const action = prefs.hideLivesMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-rich-item-renderer:has(.badge-style-type-live-now),
      ytd-rich-item-renderer:has([overlay-style="LIVE"]),
      ytd-video-renderer:has([overlay-style="LIVE"]),
      ytd-compact-video-renderer:has([overlay-style="LIVE"]),
      ytd-grid-video-renderer:has([overlay-style="LIVE"]) {
        ${action}
      }
    `;
  }

  if (prefs.hideUpcomingEnabled && shouldHideUpcoming(currentPath)) {
    const action = prefs.hideUpcomingMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-rich-item-renderer:has([overlay-style="UPCOMING"]),
      ytd-video-renderer:has([overlay-style="UPCOMING"]),
      ytd-compact-video-renderer:has([overlay-style="UPCOMING"]),
      ytd-grid-video-renderer:has([overlay-style="UPCOMING"]) {
        ${action}
      }
    `;
  }

  if (prefs.hidePodcastsEnabled && shouldHidePodcasts(currentPath)) {
    const action = prefs.hidePodcastsMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-rich-item-renderer:has(a[href*="/podcast/"]),
      ytd-video-renderer:has(a[href*="/podcast/"]),
      ytd-compact-video-renderer:has(a[href*="/podcast/"]),
      ytd-grid-video-renderer:has(a[href*="/podcast/"]),
      ytd-playlist-renderer:has(a[href*="/podcast/"]) {
        ${action}
      }
    `;
  }

  if (prefs.hidePostsEnabled && shouldHidePosts(currentPath)) {
    const action = prefs.hidePostsMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-post-renderer,
      ytd-backstage-post-thread-renderer,
      ytd-rich-item-renderer:has(ytd-post-renderer),
      ytd-rich-item-renderer:has(ytd-backstage-post-thread-renderer),
      ytd-item-section-renderer:has(ytd-post-renderer),
      ytd-rich-section-renderer:has(ytd-post-renderer),
      ytd-rich-section-renderer:has(ytd-backstage-post-thread-renderer) {
        ${action}
      }
    `;
  }

  if (prefs.hidePromosEnabled) {
    const action = prefs.hidePromosMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-rich-section-renderer:has(ytd-brand-video-singleton-renderer),
      ytd-rich-section-renderer:has(ytd-statement-banner-renderer),
      ytd-rich-section-renderer:has(ytd-compact-promoted-video-renderer),
      ytd-rich-section-renderer:has(ytd-promoted-sparkles-web-renderer),
      ytd-rich-section-renderer:has(.badge-style-type-ad),
      ytd-rich-section-renderer:has(ytd-horizontal-card-list-renderer),
      ytd-rich-section-renderer:has(ytd-game-card-renderer),
      ytd-rich-shelf-renderer:not([is-shorts]):not(:has([is-shorts])):not(:has(a[href*="/shorts"])):not(:has(ytd-rich-grid-slim-media)),
      ytd-rich-section-renderer:not([is-shorts]):not(:has([is-shorts])):not(:has(a[href*="/shorts"])):not(:has(ytd-rich-grid-slim-media)):has(ytd-shelf-renderer) {
        ${action}
      }
    `;
  }

  let styleEl = document.getElementById('ypp-zero-js-hider');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'ypp-zero-js-hider';
    if (document.head) document.head.appendChild(styleEl);
    else document.documentElement.appendChild(styleEl);
  }
  styleEl.textContent = css;
};

const throttledHiding = throttle(() => {
  if (!detectPageChange()) {
    startHiding(currentPath);
  }
}, 250);

function onMutations(mutations) {
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

  // ensureHeaderButton();

  detectInfiniteLoaderLoop(mutations);

  throttledHiding();
}

async function init() {
  setupPrefsListener();
  injectDimStyles();
  injectInlineWhitelistStyles();
  injectInlineBlacklistStyles();
  watchYouTubeTheme();
  preventHoverPreviewOnDimmedItems();
  attachBlacklistHoverListener();

  logger.log('Extension initialized on', currentPath);
  readChannelCacheFromDOM();
  readChannelIdentityCacheFromDOM();
  await startHiding(currentPath);

  const observer = new MutationObserver(onMutations);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [YT_HIDER_CACHE_ATTR, YT_HIDER_CHANNELID_CACHE_ATTR],
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  logger.log('MutationObserver started');

  if (isYouTube() && prefs.extensionEnabled) {
    // Disabled tutorial and header button from original hider extension
  }
}

async function bootZeroJSCSS() {
  setupStorageListener(); // Must be first — so changes during initPrefs are captured
  await initPrefs();
  injectZeroJSCSS();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
bootZeroJSCSS();

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_CURRENT_CHANNEL') {
    sendResponse({ channel: getCurrentPageChannel() });
    return true;
  }
});
