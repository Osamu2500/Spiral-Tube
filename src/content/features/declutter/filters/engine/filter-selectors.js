import { isChannelPagePath } from '../../utils/channel-utils.js';

export const VIDEO_CONTAINER_SELECTORS_WATCH =
  'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer';

export const VIDEO_CONTAINER_SELECTORS_CHANNEL =
  'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer';

export const VIDEO_CONTAINER_SELECTORS_DEFAULT =
  'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer, ytm-rich-item-renderer';

export const BLACKLIST_EXTRA_SELECTORS = 
  'ytd-playlist-renderer, ytd-compact-playlist-renderer, ytd-radio-renderer, ytd-compact-radio-renderer';

export function getVideoContainerSelectors() {
  const pathname = window.location.pathname;
  const isChannelPage = isChannelPagePath(pathname);

  if (pathname === '/watch') {
    return VIDEO_CONTAINER_SELECTORS_WATCH;
  }
  if (isChannelPage) {
    return VIDEO_CONTAINER_SELECTORS_CHANNEL;
  }
  return VIDEO_CONTAINER_SELECTORS_DEFAULT;
}

export function findOutermostMatch(element, selectors) {
  let item = element;
  let match = null;
  while (item) {
    if (item.matches(selectors)) {
      match = item;
    }
    item = item.parentElement;
  }
  return match;
}
