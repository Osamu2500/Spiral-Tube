import { isFeatureEnabledForPath } from '../../utils/path-utils.js';
import { prefs } from '../../core/state-manager.js';
import { isCoreFilterPath } from './lives-upcoming-filter.js';
import { applyFilter } from '../engine/filter-core.js';

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

export function shouldHideMemberships(pathname) {
  return prefs.hideMembershipsEnabled && isCoreFilterPath(pathname);
}

export function hideMembershipsShelf() {
  if (!prefs.hideMembershipsEnabled) return;
  const mode = prefs.hideMembershipsMode || 'hide';
  
  document.querySelectorAll('ytd-rich-shelf-renderer #title-container #title').forEach(titleNode => {
    const text = titleNode.textContent.toLowerCase();
    if (text.includes('get more from memberships') || text.includes('memberships')) {
      const section = titleNode.closest('ytd-rich-section-renderer') || titleNode.closest('ytd-rich-shelf-renderer');
      if (section) {
        applyFilter(section, 'Memberships Shelf', mode);
      }
    }
  });
}

