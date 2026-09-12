import { isFeatureEnabledForPath } from '../../utils/path-utils.js';
import { prefs } from '../../core/state-manager.js';
import { isCoreFilterPath } from './lives-upcoming-filter.js';

export function shouldHidePodcasts(pathname) {
  if (!prefs.hidePodcastsEnabled) return false;
  return isFeatureEnabledForPath('hidePodcasts', pathname, prefs);
}

export function shouldHidePosts(pathname) {
  if (!prefs.hidePostsEnabled) return false;
  return isFeatureEnabledForPath('hidePosts', pathname, prefs);
}

export function shouldHidePromos(pathname) {
  return prefs.hidePromosEnabled && isCoreFilterPath(pathname);
}

export function shouldHideTrending(pathname) {
  return prefs.hideTrendingEnabled && isCoreFilterPath(pathname);
}
