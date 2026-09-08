import { applyFilter } from '../engine/filter-core.js';
import { prefs } from '../../core/state-manager.js';
import { isChannelPagePath } from '../../utils/channel-utils.js';

export function hideMixes() {
  const mode = prefs.hideMixesMode || 'hide';
  // Target by content-id class (most reliable — set by YouTube's Polymer)
  document.querySelectorAll('[class*="content-id-RD"]').forEach(el => {
    const item =
      el.closest('ytd-rich-item-renderer, ytm-rich-item-renderer') ||
      el.closest('yt-lockup-view-model');
    if (item) applyFilter(item, 'Mix playlist', mode);
  });
  // Target by href (catches search results & sidebar)
  document.querySelectorAll('a[href*="start_radio=1"], a[href*="list=RD"]').forEach(link => {
    const item =
      link.closest(
        'ytd-rich-item-renderer, ytd-compact-radio-renderer, ytd-radio-renderer, ytm-rich-item-renderer, ytm-video-with-context-renderer',
      ) || link.closest('yt-lockup-view-model');
    if (item) applyFilter(item, 'Mix playlist', mode);
  });
  // Direct radio renderer elements
  document
    .querySelectorAll('ytd-radio-renderer, ytd-compact-radio-renderer')
    .forEach(node => applyFilter(node, 'Mix playlist', mode));
}

export function shouldHideMixes(pathname) {
  if (!prefs.hideMixesEnabled) return false;
  
  const {
    hideMixesHome,
    hideMixesChannel,
    hideMixesSearch,
    hideMixesSubs,
    hideMixesRelated,
  } = prefs;

  return (
    (pathname === '/' && hideMixesHome) ||
    (isChannelPagePath(pathname) && hideMixesChannel) ||
    (pathname === '/results' && hideMixesSearch) ||
    (pathname === '/watch' && hideMixesRelated) ||
    (pathname === '/feed/subscriptions' && hideMixesSubs)
  );
}

export function hidePlaylists() {
  const mode = prefs.hidePlaylistsMode || 'hide';
  // Target by content-id class (PL prefix = regular YouTube playlist)
  document.querySelectorAll('[class*="content-id-PL"]').forEach(el => {
    const item =
      el.closest('ytd-rich-item-renderer, ytm-rich-item-renderer') ||
      el.closest('yt-lockup-view-model');
    if (item) applyFilter(item, 'Playlist', mode);
  });
  // Direct playlist renderer elements (search results & sidebar)
  document
    .querySelectorAll('ytd-playlist-renderer, ytd-compact-playlist-renderer')
    .forEach(node => applyFilter(node, 'Playlist', mode));
}

export function shouldHidePlaylists(pathname) {
  if (!prefs.hidePlaylistsEnabled) return false;
  
  const {
    hidePlaylistsHome,
    hidePlaylistsChannel,
    hidePlaylistsSearch,
    hidePlaylistsSubs,
    hidePlaylistsRelated,
  } = prefs;

  return (
    (pathname === '/' && hidePlaylistsHome) ||
    (isChannelPagePath(pathname) && hidePlaylistsChannel) ||
    (pathname === '/results' && hidePlaylistsSearch) ||
    (pathname === '/watch' && hidePlaylistsRelated) ||
    (pathname === '/feed/subscriptions' && hidePlaylistsSubs)
  );
}
