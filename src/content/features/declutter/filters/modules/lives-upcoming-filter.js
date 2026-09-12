import { applyFilter } from '../engine/filter-core.js';
import { prefs } from '../../core/state-manager.js';
import { isChannelPagePath } from '../../utils/channel-utils.js';

export function isCoreFilterPath(pathname) {
  if (!pathname) return false;

  if (
    pathname === '/feed/playlists' ||
    pathname === '/playlist' ||
    pathname === '/feed/library' ||
    pathname === '/feed/history'
  ) {
    return false;
  }

  return (
    pathname === '/' ||
    pathname === '/results' ||
    pathname === '/watch' ||
    pathname === '/feed/subscriptions' ||
    isChannelPagePath(pathname)
  );
}

export function hideLives() {
  const mode = prefs.hideLivesMode || 'hide';
  // Target by live badge selectors (badge-shape is YouTube's modern element)
  document
    .querySelectorAll(
      'badge-shape.yt-badge-shape--thumbnail-live, badge-shape.yt-badge-shape--live, ' +
      'badge-shape.ytBadgeShapeThumbnailLive, badge-shape.ytBadgeShapeLive, ' +
      'ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"]',
    )
    .forEach(el => {
      const item =
        el.closest(
          'ytd-rich-item-renderer, ytm-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer',
        ) || el.closest('yt-lockup-view-model');
      if (item) applyFilter(item, 'Live stream', mode);
    });
  // Target by live ring avatar (for channel live indicators)
  document.querySelectorAll('yt-lockup-view-model').forEach(el => {
    if (
      el.querySelector('.yt-spec-avatar-shape--live-ring') ||
      el.querySelector('.yt-spec-avatar-shape__live-badge')
    ) {
      const item =
        el.closest('ytd-rich-item-renderer, ytm-rich-item-renderer') || el;
      applyFilter(item, 'Live stream', mode);
    }
  });
}

export function shouldHideLives(pathname) {
  return prefs.hideLiveStreams && isCoreFilterPath(pathname);
}

export function shouldHideUpcoming(pathname) {
  return prefs.hideUpcoming && isCoreFilterPath(pathname);
}
