import { applyFilter, forceHide, isChannelBlacklisted, resolveChannelForElement } from '../engine/filter-core.js';
import { getVideoContainerSelectors, findOutermostMatch, BLACKLIST_EXTRA_SELECTORS } from '../engine/filter-selectors.js';
import { prefs } from '../../core/state-manager.js';
import { isCoreFilterPath } from './lives-upcoming-filter.js';

const BLACKLIST_REASON = 'Blacklisted channel';

export function shouldHideBlacklisted(pathname) {
  return (
    prefs.channelBlacklistEnabled &&
    Array.isArray(prefs.channelBlacklist) &&
    prefs.channelBlacklist.length > 0 &&
    isCoreFilterPath(pathname)
  );
}

export function hideBlacklistedVideos() {
  const selectors = getVideoContainerSelectors() + ', ' + BLACKLIST_EXTRA_SELECTORS;
  const seen = new Set();

  document.querySelectorAll(selectors).forEach(node => {
    const container = findOutermostMatch(node, selectors);
    if (!container || seen.has(container)) return;
    seen.add(container);

    const ch = resolveChannelForElement(container);
    if (isChannelBlacklisted(ch)) {
      applyFilter(container, BLACKLIST_REASON, 'hide');
    }
  });
}

export function hideBlacklistedShorts() {
  document
    .querySelectorAll('ytm-shorts-lockup-view-model, a[href^="/shorts/"]')
    .forEach(node => {
      const container =
        node.closest('ytm-shorts-lockup-view-model') ||
        node.closest('ytd-rich-item-renderer, ytm-video-with-context-renderer') ||
        node;
      const ch = resolveChannelForElement(container);
      if (isChannelBlacklisted(ch)) {
        forceHide(container);
      }
    });
}

export function hideBlacklisted() {
  hideBlacklistedVideos();
  hideBlacklistedShorts();
}
