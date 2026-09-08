import { prefs } from './state-manager.js';
import { shouldHideShorts } from '../filters/modules/shorts-filter.js';
import { shouldHideMixes, shouldHidePlaylists } from '../filters/modules/mixes-playlists-filter.js';
import { shouldHideLives, shouldHideUpcoming } from '../filters/modules/lives-upcoming-filter.js';
import { shouldHidePodcasts, shouldHidePosts, shouldHidePromos, shouldHideTrending } from '../filters/modules/misc-filters.js';

export function injectZeroJSCSS() {
  if (!prefs.extensionEnabled) {
    let styleEl = document.getElementById('ypp-zero-js-hider');
    if (styleEl) styleEl.textContent = '';
    return;
  }
  
  let css = '';
  const currentPath = window.location.pathname;
  
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

  if (prefs.hidePromosEnabled && shouldHidePromos(currentPath)) {
    const action = prefs.hidePromosMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-rich-section-renderer:has(ytd-brand-video-singleton-renderer),
      ytd-rich-section-renderer:has(ytd-statement-banner-renderer),
      ytd-rich-section-renderer:has(ytd-compact-promoted-video-renderer),
      ytd-rich-section-renderer:has(ytd-promoted-sparkles-web-renderer),
      ytd-rich-section-renderer:has(.badge-style-type-ad),
      ytd-rich-section-renderer:has(ytd-horizontal-card-list-renderer),
      ytd-rich-section-renderer:has(ytd-game-card-renderer) {
        ${action}
      }
    `;
  }

  if (prefs.hideTrendingEnabled && shouldHideTrending(currentPath)) {
    const action = prefs.hideTrendingMode === 'dim' ? 'opacity: 0.2 !important;' : 'display: none !important;';
    css += `
      ytd-rich-section-renderer:has(a[href*="/trending"]),
      ytd-rich-section-renderer:has(a[href*="/explore"]),
      ytd-rich-section-renderer:has(yt-icon[icon="yt-icons:trending"]),
      ytd-guide-entry-renderer:has(a[href*="/feed/trending"]),
      ytd-mini-guide-entry-renderer:has(a[href*="/feed/trending"]),
      ytd-guide-entry-renderer:has(a[href*="/feed/explore"]),
      ytd-rich-section-renderer:has(yt-chip-cloud-renderer),
      ytd-rich-section-renderer:has(ytd-feed-filter-chip-bar-renderer),
      ytd-rich-section-renderer:has(yt-related-chip-cloud-renderer),
      ytd-rich-section-renderer:has(ytd-search-query-renderer),
      ytd-rich-section-renderer:has([class*="ytChipsShelfViewModel"]),
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
}
