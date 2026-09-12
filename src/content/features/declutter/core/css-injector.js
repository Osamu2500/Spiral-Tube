/**
 * @file css-injector.js
 * @description Core declutter module. Injects a highly optimized static CSS block into the DOM 
 * to handle hiding/dimming of UI elements across YouTube. Avoids runtime string concatenation.
 * Scoped entirely to declutter feature logic.
 */
import { prefs } from './state-manager.js';
import { shouldHideShorts } from '../filters/modules/shorts-filter.js';
import { shouldHideMixes, shouldHidePlaylists } from '../filters/modules/mixes-playlists-filter.js';
import { shouldHideLives, shouldHideUpcoming } from '../filters/modules/lives-upcoming-filter.js';
import { shouldHidePodcasts, shouldHidePosts, shouldHidePromos, shouldHideTrending } from '../filters/modules/misc-filters.js';

let isStaticCSSInjected = false;

const CSS_RULES = {
  'hide-shorts': [
    'ytd-reel-shelf-renderer',
    'ytm-reel-shelf-renderer',
    'ytd-reel-item-renderer',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    'ytd-rich-section-renderer:has(ytd-reel-shelf-renderer)',
    'ytd-rich-section-renderer:has(yt-lockup-view-model:has(a[href*="/shorts/"]))',
    'ytd-shelf-renderer:has(ytd-reel-item-renderer)',
    'ytd-shelf-renderer:has(yt-lockup-view-model:has(a[href*="/shorts/"]))',
    'ytd-horizontal-card-list-renderer:has(ytd-reel-item-renderer)',
    'ytd-horizontal-card-list-renderer:has(yt-lockup-view-model:has(a[href*="/shorts/"]))',
    'ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"])',
    'ytd-rich-item-renderer:has(a[href*="/shorts/"])',
    'ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"])',
    'ytd-video-renderer:has(a[href*="/shorts/"])',
    'ytd-grid-video-renderer:has(a[href*="/shorts/"])',
    'ytd-compact-video-renderer:has(a[href*="/shorts/"])',
    'yt-lockup-view-model:has(a[href*="/shorts/"])',
    'yt-lockup-view-model:has([overlay-style="SHORTS"])',
    'ytd-item-section-renderer.ypp-shorts-section',
    '[data-ypp-shelf-type="shorts"]'
  ],
  'hide-mixes': [
    'ytd-radio-renderer',
    'ytd-compact-radio-renderer',
    'ytd-rich-item-renderer:has(a[href*="start_radio=1"])',
    'ytd-rich-item-renderer:has(a[href*="list=RD"])',
    'ytd-rich-item-renderer:has([title^="My Mix"])',
    'ytd-rich-item-renderer:has([title^="Mix -"])',
    'ytd-video-renderer:has(a[href*="start_radio=1"])',
    'ytd-video-renderer:has(a[href*="list=RD"])',
    'ytd-video-renderer:has([title^="My Mix"])',
    'ytd-video-renderer:has([title^="Mix -"])',
    'ytd-compact-video-renderer:has(a[href*="start_radio=1"])',
    'ytd-compact-video-renderer:has(a[href*="list=RD"])',
    'ytd-compact-video-renderer:has([title^="My Mix"])',
    'ytd-compact-video-renderer:has([title^="Mix -"])'
  ],
  'hide-playlists': [
    'ytd-playlist-renderer',
    'ytd-compact-playlist-renderer',
    'ytd-grid-playlist-renderer',
    'ytd-rich-item-renderer:has(ytd-thumbnail-overlay-bottom-panel-renderer)',
    'ytd-rich-item-renderer:has(ytd-playlist-thumbnail)',
    'ytd-video-renderer:has(ytd-thumbnail-overlay-bottom-panel-renderer)',
    'ytd-compact-video-renderer:has(ytd-thumbnail-overlay-bottom-panel-renderer)'
  ],
  'hide-lives': [
    'ytd-rich-item-renderer:has(.badge-style-type-live-now)',
    'ytd-rich-item-renderer:has([overlay-style="LIVE"])',
    'ytd-video-renderer:has([overlay-style="LIVE"])',
    'ytd-compact-video-renderer:has([overlay-style="LIVE"])',
    'ytd-grid-video-renderer:has([overlay-style="LIVE"])'
  ],
  'hide-upcoming': [
    'ytd-rich-item-renderer:has([overlay-style="UPCOMING"])',
    'ytd-video-renderer:has([overlay-style="UPCOMING"])',
    'ytd-compact-video-renderer:has([overlay-style="UPCOMING"])',
    'ytd-grid-video-renderer:has([overlay-style="UPCOMING"])'
  ],
  'hide-podcasts': [
    'ytd-rich-item-renderer:has(a[href*="/podcast/"])',
    'ytd-video-renderer:has(a[href*="/podcast/"])',
    'ytd-compact-video-renderer:has(a[href*="/podcast/"])',
    'ytd-grid-video-renderer:has(a[href*="/podcast/"])',
    'ytd-playlist-renderer:has(a[href*="/podcast/"])'
  ],
  'hide-posts': [
    'ytd-post-renderer',
    'ytd-backstage-post-thread-renderer',
    'ytd-rich-item-renderer:has(ytd-post-renderer)',
    'ytd-rich-item-renderer:has(ytd-backstage-post-thread-renderer)',
    'ytd-item-section-renderer:has(ytd-post-renderer)',
    'ytd-rich-section-renderer:has(ytd-post-renderer)',
    'ytd-rich-section-renderer:has(ytd-backstage-post-thread-renderer)'
  ],
  'hide-promos': [
    'ytd-rich-section-renderer:has(ytd-brand-video-singleton-renderer)',
    'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)',
    'ytd-rich-section-renderer:has(ytd-compact-promoted-video-renderer)',
    'ytd-rich-section-renderer:has(ytd-promoted-sparkles-web-renderer)',
    'ytd-rich-section-renderer:has(.badge-style-type-ad)',
    'ytd-rich-section-renderer:has(ytd-horizontal-card-list-renderer)',
    'ytd-rich-section-renderer:has(ytd-game-card-renderer)'
  ],
  'hide-trending': [
    'ytd-rich-section-renderer:has(a[href*="/trending"])',
    'ytd-rich-section-renderer:has(a[href*="/explore"])',
    'ytd-rich-section-renderer:has(yt-icon[icon="yt-icons:trending"])',
    'ytd-guide-entry-renderer:has(a[href*="/feed/trending"])',
    'ytd-mini-guide-entry-renderer:has(a[href*="/feed/trending"])',
    'ytd-guide-entry-renderer:has(a[href*="/feed/explore"])',
    'ytd-rich-section-renderer:has(yt-chip-cloud-renderer)',
    'ytd-rich-section-renderer:has(ytd-feed-filter-chip-bar-renderer)',
    'ytd-rich-section-renderer:has(yt-related-chip-cloud-renderer)',
    'ytd-rich-section-renderer:has(ytd-search-query-renderer)',
    'ytd-rich-section-renderer:has([class*="ytChipsShelfViewModel"])',
    'ytd-rich-shelf-renderer:not([is-shorts]):not(:has([is-shorts])):not(:has(a[href*="/shorts"])):not(:has(ytd-rich-grid-slim-media))',
    'ytd-rich-section-renderer:not([is-shorts]):not(:has([is-shorts])):not(:has(a[href*="/shorts"])):not(:has(ytd-rich-grid-slim-media)):has(ytd-shelf-renderer)'
  ]
};

function injectStaticCSS() {
  if (isStaticCSSInjected) return;

  let staticCSS = '';
  for (const [feature, selectors] of Object.entries(CSS_RULES)) {
    const isList = selectors.join(',\n      ');
    staticCSS += `
      /* ${feature} */
      body.ypp-feature-${feature}:not(.ypp-feature-${feature}-dim) :is(
        ${isList}
      ) { display: none !important; }
      
      body.ypp-feature-${feature}.ypp-feature-${feature}-dim :is(
        ${isList}
      ) { opacity: 0.2 !important; }
    `;
  }

  let styleEl = document.getElementById('ypp-zero-js-hider');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'ypp-zero-js-hider';
    if (document.head) document.head.appendChild(styleEl);
    else document.documentElement.appendChild(styleEl);
  }
  styleEl.textContent = staticCSS;
  isStaticCSSInjected = true;
}

function applyFeatureClass(featureName, isEnabled, mode) {
  if (isEnabled) {
    document.body.classList.add(`ypp-feature-${featureName}`);
    if (mode === 'dim') {
      document.body.classList.add(`ypp-feature-${featureName}-dim`);
    } else {
      document.body.classList.remove(`ypp-feature-${featureName}-dim`);
    }
  } else {
    document.body.classList.remove(`ypp-feature-${featureName}`, `ypp-feature-${featureName}-dim`);
  }
}

export function injectZeroJSCSS() {
  if (!prefs.extensionEnabled) {
    document.body.className = document.body.className.replace(/ypp-feature-\S+/g, '');
    return;
  }
  
  injectStaticCSS();
  const currentPath = window.location.pathname;
  
  applyFeatureClass('hide-shorts', prefs.hideShortsEnabled && shouldHideShorts(currentPath), prefs.hideShortsMode);
  applyFeatureClass('hide-mixes', prefs.hideMixesEnabled && shouldHideMixes(currentPath), prefs.hideMixesMode);
  applyFeatureClass('hide-playlists', prefs.hidePlaylistsEnabled && shouldHidePlaylists(currentPath), prefs.hidePlaylistsMode);
  applyFeatureClass('hide-lives', prefs.hideLivesEnabled && shouldHideLives(currentPath), prefs.hideLivesMode);
  applyFeatureClass('hide-upcoming', prefs.hideUpcomingEnabled && shouldHideUpcoming(currentPath), prefs.hideUpcomingMode);
  applyFeatureClass('hide-podcasts', prefs.hidePodcastsEnabled && shouldHidePodcasts(currentPath), prefs.hidePodcastsMode);
  applyFeatureClass('hide-posts', prefs.hidePostsEnabled && shouldHidePosts(currentPath), prefs.hidePostsMode);
  applyFeatureClass('hide-promos', prefs.hidePromosEnabled && shouldHidePromos(currentPath), prefs.hidePromosMode);
  applyFeatureClass('hide-trending', prefs.hideTrendingEnabled && shouldHideTrending(currentPath), prefs.hideTrendingMode);
}
