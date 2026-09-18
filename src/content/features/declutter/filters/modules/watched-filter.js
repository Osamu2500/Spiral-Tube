/**
 * MODULE: Watched Filter
 * DESCRIPTION: Hides or dims already watched videos across YouTube.
 * SCOPE: Applies DOM filters based on video progress bars and watched badges.
 *
 * Handles two YouTube DOM generations:
 *   - Legacy: ytd-thumbnail-overlay-resume-playback-renderer #progress (style.width %)
 *   - New (YT 2024+): yt-lockup-view-model containing the same overlay element,
 *     or .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment (CSS-driven width)
 */
import { applyFilter } from '../engine/filter-core.js';
import { getVideoContainerSelectors, findOutermostMatch } from '../engine/filter-selectors.js';
import { prefs } from '../../core/state-manager.js';
import { isFeatureEnabledForPath } from '../../utils/path-utils.js';

/**
 * Read the progress percentage from a resume-playback renderer bar.
 * Handles both the inline style.width approach and the CSS-class-driven approach.
 */
function readProgressPct(bar) {
  // Legacy: style.width is set directly as "80%"
  const inlineWidth = parseFloat(bar.style.width);
  if (!isNaN(inlineWidth)) return inlineWidth;

  // New format: width is driven by CSS and the element has a computed style
  try {
    const computed = window.getComputedStyle(bar).width;
    const parent = bar.closest('ytd-thumbnail-overlay-resume-playback-renderer, ytd-thumbnail');
    if (parent) {
      const parentWidth = parseFloat(window.getComputedStyle(parent).width);
      const barWidth = parseFloat(computed);
      if (!isNaN(barWidth) && !isNaN(parentWidth) && parentWidth > 0) {
        return (barWidth / parentWidth) * 100;
      }
    }
  } catch (_) {
    // ignore
  }
  return NaN;
}

export function hideWatched(pathname) {
  const { hideThreshold, hideWatchedMode } = prefs;
  if (hideThreshold === 0) return;

  const selectors = getVideoContainerSelectors();

  // ─── Pass 1: Legacy + new progress bar (#progress, watched segment bar) ───
  document
    .querySelectorAll(
      'ytd-thumbnail-overlay-resume-playback-renderer #progress, ' +
      '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment, ' +
      '.ytwThumbnailOverlayResumePlaybackRendererThumbnailOverlayResumePlaybackProgress, ' +
      'ytm-thumbnail-overlay-resume-playback-renderer .thumbnail-overlay-resume-playback-progress',
    )
    .forEach(bar => {
      // Skip if this bar belongs to a currently playing video
      if (
        bar.classList.contains('ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment')
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

      const pct = readProgressPct(bar);
      if (isNaN(pct) || pct <= hideThreshold) return;

      const item = findOutermostMatch(bar, selectors);
      if (!item) return;

      applyFilter(item, 'Already watched', hideWatchedMode);
    });

  // ─── Pass 2: New lockup format (yt-lockup-view-model with progress overlay) ───
  document
    .querySelectorAll(
      'yt-lockup-view-model ytd-thumbnail-overlay-resume-playback-renderer #progress, ' +
      'yt-lockup-view-model .ytwThumbnailOverlayResumePlaybackRendererThumbnailOverlayResumePlaybackProgress',
    )
    .forEach(bar => {
      const pct = readProgressPct(bar);
      if (isNaN(pct) || pct <= hideThreshold) return;

      // The outermost container for a lockup card is ytd-rich-item-renderer
      const lockup = bar.closest('yt-lockup-view-model');
      if (!lockup) return;

      const item =
        lockup.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer') ||
        lockup;
      if (!item) return;

      applyFilter(item, 'Already watched', hideWatchedMode);
    });

  // ─── Pass 3: Fully-watched badge (100% watched — shows a checkmark, no progress bar) ───
  // Only trigger if threshold <= 100 (i.e. user actually wants 100% treated as watched)
  if (hideThreshold <= 100) {
    document
      .querySelectorAll(
        // New checkmark badge on lockup cards
        'yt-lockup-view-model ytd-thumbnail-overlay-toggle-button-renderer[is-toggled], ' +
        // Legacy "Watch again" / fully-watched overlay
        'ytd-thumbnail-overlay-resume-playback-renderer:has(#progress[style*="100%"]), ' +
        // New fully-watched segment indicator
        '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment[style*="100%"]',
      )
      .forEach(el => {
        const item = findOutermostMatch(el, selectors) ||
          el.closest('ytd-rich-item-renderer, yt-lockup-view-model, ytd-video-renderer');
        if (!item) return;
        applyFilter(item, 'Already watched', hideWatchedMode);
      });
  }
}

export function shouldHideWatched(pathname) {
  return isFeatureEnabledForPath('hideWatched', pathname, prefs);
}
