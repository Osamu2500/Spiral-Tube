import { isChannelPagePath } from '../../utils/channel-utils.js';
import { prefs } from '../../core/state-manager.js';
import { isCoreFilterPath } from './lives-upcoming-filter.js';

export function shouldHidePodcasts(pathname) {
  if (!prefs.hidePodcastsEnabled) return false;
  
  const {
    hidePodcastsHome,
    hidePodcastsChannel,
    hidePodcastsSearch,
    hidePodcastsSubs,
    hidePodcastsRelated,
  } = prefs;

  return (
    (pathname === '/' && hidePodcastsHome) ||
    (isChannelPagePath(pathname) && hidePodcastsChannel) ||
    (pathname === '/results' && hidePodcastsSearch) ||
    (pathname === '/watch' && hidePodcastsRelated) ||
    (pathname === '/feed/subscriptions' && hidePodcastsSubs)
  );
}

export function shouldHidePosts(pathname) {
  if (!prefs.hidePostsEnabled) return false;
  
  const {
    hidePostsHome,
    hidePostsChannel,
    hidePostsSearch,
    hidePostsSubs,
    hidePostsRelated,
  } = prefs;

  return (
    (pathname === '/' && hidePostsHome) ||
    (isChannelPagePath(pathname) && hidePostsChannel) ||
    (pathname === '/results' && hidePostsSearch) ||
    (pathname === '/watch' && hidePostsRelated) ||
    (pathname === '/feed/subscriptions' && hidePostsSubs)
  );
}

export function shouldHidePromos(pathname) {
  return prefs.hidePromosEnabled && isCoreFilterPath(pathname);
}

export function shouldHideTrending(pathname) {
  return prefs.hideTrendingEnabled && isCoreFilterPath(pathname);
}
