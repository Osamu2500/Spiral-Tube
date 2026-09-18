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
  // Map internal prefixes to settings schema prefixes
  let schemaPrefix = featurePrefix;
  if (featurePrefix === 'hideShorts') schemaPrefix = 'shortsFilter';
  if (featurePrefix === 'hideViews') schemaPrefix = 'viewsFilter';
  
  return (
    (pathname === '/' && prefs[`${schemaPrefix}Home`]) ||
    (isChannelPagePath(pathname) && prefs[`${schemaPrefix}Channel`]) ||
    (pathname === '/results' && prefs[`${schemaPrefix}Search`]) ||
    (pathname === '/watch' && prefs[`${schemaPrefix}Related`]) ||
    (pathname === '/feed/subscriptions' && prefs[`${schemaPrefix}Subs`])
  );
}
