import { forceHide } from '../engine/filter-core.js';
import { prefs } from '../../core/state-manager.js';
import { isFeatureEnabledForPath } from '../../utils/path-utils.js';

export function hideBlacklistedShorts() {
  document
    .querySelectorAll('ytm-shorts-lockup-view-model, a[href^="/shorts/"]')
    .forEach(node => {
      const container =
        node.closest('ytm-shorts-lockup-view-model') ||
        node.closest('ytd-rich-item-renderer, ytm-video-with-context-renderer') ||
        node;
      // This is handled in blacklist-filter.js, but keeping the selector logic here just in case.
      // Usually, shorts hide logic is in CSS.
    });
}

export function shouldHideShorts(pathname) {
  if (!prefs.hideShortsEnabled) return false;
  return isFeatureEnabledForPath('hideShorts', pathname, prefs);
}
