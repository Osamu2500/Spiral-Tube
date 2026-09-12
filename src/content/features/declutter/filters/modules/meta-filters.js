/**
 * MODULE: Meta Filters
 * DESCRIPTION: Handles filtering videos based on upload date and view counts.
 * SCOPE: Applies DOM filters; does not affect core YouTube rendering.
 */
import { applyFilter } from '../engine/filter-core.js';
import { getVideoContainerSelectors, findOutermostMatch } from '../engine/filter-selectors.js';
import { extractUploadAgeDays, resolveUploadAgeFromSpans } from '../../parsers/date-parser.js';
import { extractViewCount, resolveViewsFromSpans } from '../../parsers/view-parser.js';
import { prefs } from '../../core/state-manager.js';
import { isFeatureEnabledForPath } from '../../utils/path-utils.js';

const LIVE_INDICATOR_SELECTORS =
  'badge-shape.yt-badge-shape--thumbnail-live, badge-shape.yt-badge-shape--live, ' +
  'badge-shape.ytBadgeShapeThumbnailLive, badge-shape.ytBadgeShapeLive, ' +
  'ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"], ' +
  '.badge-style-type-live-now';

export function isLiveVideo(element) {
  if (!element) return false;
  const container =
    element.closest(
      'yt-lockup-view-model, ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytm-rich-item-renderer, ytm-video-with-context-renderer, ytm-compact-video-renderer',
    ) || element;
  return !!container.querySelector(LIVE_INDICATOR_SELECTORS);
}

export function shouldHideDateFilter(pathname) {
  if (prefs.dateFilterNewerThreshold === 0 && prefs.dateFilterOlderThreshold === 0) return false;
  return isFeatureEnabledForPath('dateFilter', pathname, prefs);
}

export function getDateFilterReason(ageDays) {
  const { dateFilterNewerThreshold, dateFilterOlderThreshold } = prefs;

  if (dateFilterNewerThreshold > 0 && ageDays < dateFilterNewerThreshold)
    return 'Video too new';
  if (dateFilterOlderThreshold > 0 && ageDays > dateFilterOlderThreshold)
    return 'Video too old';

  return null;
}

export function getMetadataSpansFromContainer(metadataContainer) {
  const rowSelectors =
    '.yt-content-metadata-view-model-wiz__metadata-row, .yt-content-metadata-view-model__metadata-row, .ytContentMetadataViewModelMetadataRow';
  const textSelectors =
    'span.yt-core-attributed-string, span.ytContentMetadataViewModelMetadataText';

  const metadataRows = metadataContainer.querySelectorAll(rowSelectors);
  if (metadataRows.length) {
    const spans = [];
    metadataRows.forEach(row => {
      row.querySelectorAll(textSelectors).forEach(span => {
        spans.push(span);
      });
    });
    return spans;
  }

  return Array.from(
    metadataContainer.querySelectorAll(
      'span.ytContentMetadataViewModelMetadataText',
    ),
  );
}

export function hideDateFilter() {
  const selectors = getVideoContainerSelectors();

  document.querySelectorAll('#metadata-line').forEach(metaLine => {
    let spans = metaLine.querySelectorAll('span.inline-metadata-item');
    if (!spans.length) {
      spans = metaLine.querySelectorAll('span');
    }
    if (!spans.length) return;

    const result = resolveUploadAgeFromSpans(spans);
    if (!result) return;
    const dateReason = getDateFilterReason(result.ageDays);
    if (!dateReason) return;

    const item = findOutermostMatch(result.span, selectors);
    if (item) applyFilter(item, dateReason, prefs.dateFilterEnabledMode);
  });

  document
    .querySelectorAll('.YtmBadgeAndBylineRendererItemByline')
    .forEach(span => {
      const text = (span.textContent || '').trim();
      const parts = text.split(/[·•]/);
      let ageDays = NaN;
      for (const part of parts) {
        const v = extractUploadAgeDays(part.trim());
        if (!isNaN(v)) ageDays = v;
      }
      if (isNaN(ageDays)) return;
      const dateReason = getDateFilterReason(ageDays);
      if (!dateReason) return;

      const container = span.closest(
        'ytm-video-with-context-renderer, ytm-rich-item-renderer, ytm-compact-video-renderer',
      );
      if (container) {
        applyFilter(container, dateReason, prefs.dateFilterEnabledMode);
        const wrapper = container.closest('ytm-rich-item-renderer');
        if (wrapper) applyFilter(wrapper, dateReason, prefs.dateFilterEnabledMode);
      }
    });

  document
    .querySelectorAll('yt-content-metadata-view-model, yt-lockup-view-model')
    .forEach(metadataContainer => {
      const allSpans = getMetadataSpansFromContainer(metadataContainer);
      if (!allSpans.length) return;

      const result = resolveUploadAgeFromSpans(allSpans);
      if (!result) return;
      const dateReason = getDateFilterReason(result.ageDays);
      if (!dateReason) return;

      const item = findOutermostMatch(result.span, selectors);
      if (item) applyFilter(item, dateReason, prefs.dateFilterEnabledMode);
    });
}

export function shouldHideViews(pathname) {
  return isFeatureEnabledForPath('viewsFilter', pathname, prefs);
}

export function hideUnderVisuals() {
  const { viewsHideThreshold } = prefs;
  const selectors = getVideoContainerSelectors();

  document.querySelectorAll('#metadata-line').forEach(metaLine => {
    let spans = metaLine.querySelectorAll('span.inline-metadata-item');
    if (!spans.length) {
      spans = metaLine.querySelectorAll('span');
    }
    if (!spans.length) return;

    const result = resolveViewsFromSpans(spans);
    if (!result || result.views >= viewsHideThreshold) return;
    if (isLiveVideo(result.span)) return;

    const item = findOutermostMatch(result.span, selectors);
    if (item) applyFilter(item, 'Views too low', prefs.viewsFilterEnabledMode);
  });

  document
    .querySelectorAll('.YtmBadgeAndBylineRendererItemByline')
    .forEach(span => {
      const text = (span.textContent || '').trim();
      const result = extractViewCount(text);
      if (!result || typeof result !== 'object') return;
      if (result.views >= viewsHideThreshold) return;
      if (isLiveVideo(span)) return;

      const container = span.closest(
        'ytm-video-with-context-renderer, ytm-rich-item-renderer, ytm-compact-video-renderer',
      );

      if (container) {
        applyFilter(container, 'Views too low', prefs.viewsFilterEnabledMode);
        const wrapper = container.closest('ytm-rich-item-renderer');
        if (wrapper) applyFilter(wrapper, 'Views too low', prefs.viewsFilterEnabledMode);
      }
    });

  hideNewFormatVideos();
}

export function hideNewFormatVideos() {
  const { viewsHideThreshold } = prefs;
  const selectors = getVideoContainerSelectors();

  document
    .querySelectorAll('yt-content-metadata-view-model, yt-lockup-view-model')
    .forEach(metadataContainer => {
      const allSpans = getMetadataSpansFromContainer(metadataContainer);
      if (!allSpans.length) return;

      const result = resolveViewsFromSpans(allSpans);

      if (!result || result.views >= viewsHideThreshold) return;
      if (isLiveVideo(result.span)) return;

      const item = findOutermostMatch(result.span, selectors);
      if (item) applyFilter(item, 'Views too low', prefs.viewsFilterEnabledMode);
    });
}
