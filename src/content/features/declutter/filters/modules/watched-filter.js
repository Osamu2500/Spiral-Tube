import { applyFilter } from '../engine/filter-core.js';
import { getVideoContainerSelectors, findOutermostMatch } from '../engine/filter-selectors.js';
import { prefs } from '../../core/state-manager.js';
import { isFeatureEnabledForPath } from '../../utils/path-utils.js';

export function hideWatched(pathname) {
  const { hideThreshold, hideWatchedMode } = prefs;

  if (hideThreshold === 0) return;

  document
    .querySelectorAll(
      'ytd-thumbnail-overlay-resume-playback-renderer #progress, .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment, .ytwThumbnailOverlayResumePlaybackRendererThumbnailOverlayResumePlaybackProgress, ytm-thumbnail-overlay-resume-playback-renderer .thumbnail-overlay-resume-playback-progress',
    )
    .forEach(bar => {
      if (
        bar.classList.contains(
          'ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment',
        )
      ) {
        const thumbnail = bar.closest('ytd-thumbnail');
        if (
          thumbnail &&
          thumbnail.querySelector(
            'ytd-thumbnail-overlay-now-playing-renderer[now-playing-badge]',
          )
        )
          return;
      }

      const pct = parseFloat(bar.style.width) || 0;
      if (pct <= hideThreshold) return;

      const item = findOutermostMatch(bar, getVideoContainerSelectors());
      if (!item) return;

      applyFilter(item, 'Already watched', hideWatchedMode);
    });
}

export function shouldHideWatched(pathname) {
  return isFeatureEnabledForPath('hideWatched', pathname, prefs);
}
