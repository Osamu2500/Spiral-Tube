import { prefs, stateManager } from './state-manager.js';
import { injectZeroJSCSS } from './css-injector.js';
import { resetAppliedFilters } from '../filters/engine/filter-core.js';
import { waitForPageElements, onMutations } from './dom-observer.js';
import { readChannelCacheFromDOM, readChannelIdentityCacheFromDOM } from '../utils/channel-utils.js';

import { shouldHideBlacklisted, hideBlacklisted } from '../filters/modules/blacklist-filter.js';
import { shouldHideWatched, hideWatched } from '../filters/modules/watched-filter.js';
import { shouldHideViews, hideUnderVisuals, shouldHideDateFilter, hideDateFilter } from '../filters/modules/meta-filters.js';
import { shouldHideMemberships, hideMembershipsShelf } from '../filters/modules/misc-filters.js';


export { injectZeroJSCSS };


export async function startHiding(pathname) {
  window.declutterStartHiding = startHiding;

  if (!prefs.extensionEnabled) {
    resetAppliedFilters(true);
    return;
  }

  // Update CSS body classes for the current path
  injectZeroJSCSS();

  // Short-circuit if all JS-powered filters are disabled
  const anyFilterActive =
    shouldHideBlacklisted(pathname) ||
    shouldHideWatched(pathname) ||
    shouldHideViews(pathname) ||
    shouldHideDateFilter(pathname) ||
    shouldHideMemberships(pathname);

  if (!anyFilterActive) return;

  await waitForPageElements(pathname);

  if (shouldHideBlacklisted(pathname)) hideBlacklisted();
  if (shouldHideWatched(pathname)) hideWatched(pathname);
  if (shouldHideViews(pathname)) hideUnderVisuals();
  if (shouldHideDateFilter(pathname)) hideDateFilter();
  if (shouldHideMemberships(pathname)) hideMembershipsShelf();
}

export function bootHiderEngine() {
  stateManager.setupListeners();
  
  stateManager.onChange(() => {
    injectZeroJSCSS();
    resetAppliedFilters(true);
    startHiding(window.location.pathname);
  });

  injectZeroJSCSS();

  readChannelCacheFromDOM();
  readChannelIdentityCacheFromDOM();
  startHiding(window.location.pathname);

  const observer = new MutationObserver(onMutations);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-ypp-video-cache', 'data-ypp-channelid-cache'],
  });
  
  // Only watch for new DOM nodes (childList) on the body.
  // IMPORTANT: characterData:true fires for every text change (player time, view counts, etc)
  // and causes thousands of callbacks per second — never use it with subtree:true.
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
