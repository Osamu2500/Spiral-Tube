/**
 * MODULE: Path Utils
 * DESCRIPTION: Provides utility functions for route and URL matching.
 * SCOPE: Shared across content script modules.
 */
import { isChannelPagePath } from './channel-utils.js';

/**
 * Checks whether a generic feature should be enabled on the current path,
 * mapping the standard page suffixes to the provided feature prefix.
 *
 * @param {string} featurePrefix The prefix of the feature (e.g. 'hideWatched', 'hideMixes')
 * @param {string} pathname The current URL pathname (e.g. window.location.pathname)
 * @param {object} prefs The current preferences object
 * @returns {boolean} True if the feature is enabled for this path
 */
export function isFeatureEnabledForPath(featurePrefix, pathname, prefs) {
  let homeKey, channelKey, searchKey, watchKey, subsKey;

  if (featurePrefix === 'viewsFilter' || featurePrefix === 'hideViews') {
    homeKey = 'viewsHideHomeEnabled';
    channelKey = 'viewsHideChannelEnabled';
    searchKey = 'viewsHideSearchEnabled';
    watchKey = 'viewsHideCorrEnabled';
    subsKey = 'viewsHideSubsEnabled';
  } else if (featurePrefix === 'dateFilter' || featurePrefix === 'hideDate') {
    homeKey = 'dateFilterHomeEnabled';
    channelKey = 'dateFilterChannelEnabled';
    searchKey = 'dateFilterSearchEnabled';
    watchKey = 'dateFilterCorrEnabled';
    subsKey = 'dateFilterSubsEnabled';
  } else {
    // For hideShorts, hideMixes, hidePlaylists, hidePodcasts, hidePosts
    homeKey = `${featurePrefix}Home`;
    channelKey = `${featurePrefix}Channel`;
    searchKey = `${featurePrefix}Search`;
    watchKey = `${featurePrefix}Related`;
    subsKey = `${featurePrefix}Subs`;
  }

  return (
    (pathname === '/' && prefs[homeKey]) ||
    (isChannelPagePath(pathname) && prefs[channelKey]) ||
    (pathname === '/results' && prefs[searchKey]) ||
    (pathname === '/watch' && prefs[watchKey]) ||
    (pathname === '/feed/subscriptions' && prefs[subsKey])
  );
}
