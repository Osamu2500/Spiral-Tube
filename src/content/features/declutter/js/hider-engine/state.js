const TIMING = {
  DEBOUNCE_MUTATIONS: 100,
  PAGE_CHANGE_DELAY: 100,
  ELEMENT_POLL_INTERVAL: 50,
};

const prefs = {
  extensionEnabled: true,
  hideThreshold: 0,
  hideHomeEnabled: true,
  hideChannelEnabled: true,
  hideSearchEnabled: true,
  hideSubsEnabled: true,
  hideCorrEnabled: true,
  viewsHideThreshold: 1000,
  viewsHideHomeEnabled: true,
  viewsHideChannelEnabled: true,
  viewsHideSearchEnabled: true,
  viewsHideSubsEnabled: true,
  viewsHideCorrEnabled: true,
  hideShortsEnabled: false,
  hideShortsHome: true,
  hideShortsChannel: true,
  hideShortsSubs: true,
  hideShortsSearch: true,
  hideShortsRelated: true,
  hideShortsSearchEnabled: true,
  hideMixesEnabled: false,
  hideMixesHome: true,
  hideMixesChannel: true,
  hideMixesSubs: true,
  hideMixesSearch: true,
  hideMixesRelated: true,
  hidePlaylistsEnabled: false,
  hidePlaylistsHome: true,
  hidePlaylistsChannel: true,
  hidePlaylistsSubs: true,
  hidePlaylistsSearch: true,
  hidePlaylistsRelated: true,
  hideLivesEnabled: false,
  hideUpcomingEnabled: false,
  hidePodcastsEnabled: false,
  hidePodcastsHome: true,
  hidePodcastsChannel: true,
  hidePodcastsSubs: true,
  hidePodcastsSearch: true,
  hidePodcastsRelated: true,
  hidePostsEnabled: false,
  hidePostsHome: true,
  hidePostsChannel: true,
  hidePostsSubs: true,
  hidePostsSearch: true,
  hidePostsRelated: true,
  hidePromosEnabled: false,
  dateFilterNewerThreshold: 0,
  dateFilterOlderThreshold: 0,
  dateFilterHomeEnabled: false,
  dateFilterChannelEnabled: false,
  dateFilterSearchEnabled: false,
  dateFilterSubsEnabled: false,
  dateFilterCorrEnabled: false,
  dimMode: false,
  tutorialCompleted: false,
  channelWhitelist: [],
  channelWhitelistEnabled: true,
  channelBlacklist: [],
  channelBlacklistEnabled: true,
  hideInterfaceElements: false,
};

const FILTER_REAPPLY_KEYS = new Set([
  'hideThreshold',
  'hideHomeEnabled',
  'hideChannelEnabled',
  'hideSearchEnabled',
  'hideSubsEnabled',
  'hideCorrEnabled',
  'viewsHideThreshold',
  'viewsHideHomeEnabled',
  'viewsHideChannelEnabled',
  'viewsHideSearchEnabled',
  'viewsHideSubsEnabled',
  'viewsHideCorrEnabled',
  'hideShortsEnabled',
  'hideShortsHome',
  'hideShortsChannel',
  'hideShortsSubs',
  'hideShortsSearch',
  'hideShortsRelated',
  'hideShortsSearchEnabled',
  'hideMixesEnabled',
  'hidePlaylistsEnabled',
  'hideLiveStreams',
  'hideUpcoming',
  'hidePodcasts',
  'hidePosts',
  'hideWatchedMode',
  'viewsFilterEnabledMode',
  'dateFilterEnabledMode',
  'aggressiveShortsBlockMode',
  'hideMixesMode',
  'hidePlaylistsMode',
  'hideLiveStreamsMode',
  'hideUpcomingMode',
  'hidePodcastsMode',
  'hidePostsMode',
  'hidePromosMode',
  'dateFilterNewerThreshold',
  'dateFilterOlderThreshold',
  'dateFilterHomeEnabled',
  'dateFilterChannelEnabled',
  'dateFilterSearchEnabled',
  'dateFilterSubsEnabled',
  'dateFilterCorrEnabled',
  'channelWhitelist',
  'channelWhitelistEnabled',
  'channelBlacklist',
  'channelBlacklistEnabled',
]);

const WHITELIST_REAPPLY_KEYS = new Set(['channelWhitelist', 'channelWhitelistEnabled']);

function isChannelListed(channel) {
  return channelListIncludes(channel, prefs.channelWhitelist);
}

function isChannelExempt(channel) {
  return isChannelListed(channel) && !!prefs.channelWhitelistEnabled;
}

function isChannelPaused(channel) {
  return isChannelListed(channel) && !prefs.channelWhitelistEnabled;
}

function isChannelOnBlacklist(channel) {
  return channelListIncludes(channel, prefs.channelBlacklist);
}

function isChannelBlacklisted(channel) {
  return isChannelOnBlacklist(channel) && !!prefs.channelBlacklistEnabled;
}

const CHANNEL_BLACKLIST_KEYS = { listKey: 'channelBlacklist', enabledKey: 'channelBlacklistEnabled' };
const CHANNEL_WHITELIST_KEYS = { listKey: 'channelWhitelist', enabledKey: 'channelWhitelistEnabled' };

function setChannelWhitelisted(channel, shouldWhitelist) {
  const result = computeWhitelistUpdate(
    channel,
    shouldWhitelist,
    prefs.channelWhitelist,
    prefs.channelWhitelistEnabled,
  );
  if (!result) return null;

  if (result.updates.channelWhitelist) prefs.channelWhitelist = result.list;
  if (result.updates.channelWhitelistEnabled) prefs.channelWhitelistEnabled = true;

  if (shouldWhitelist && result.changedChannels.length) {
    const unblacklist = computeWhitelistUpdate(
      result.changedChannels,
      false,
      prefs.channelBlacklist,
      prefs.channelBlacklistEnabled,
      CHANNEL_BLACKLIST_KEYS,
    );
    if (unblacklist && unblacklist.updates.channelBlacklist) {
      prefs.channelBlacklist = unblacklist.list;
      result.updates.channelBlacklist = unblacklist.list;
    }
  }

  safeStorageSet('sync', result.updates);
  return result;
}

function setChannelBlacklisted(channel, shouldBlacklist) {
  const result = computeWhitelistUpdate(
    channel,
    shouldBlacklist,
    prefs.channelBlacklist,
    prefs.channelBlacklistEnabled,
    CHANNEL_BLACKLIST_KEYS,
  );
  if (!result) return null;

  if (result.updates.channelBlacklist) prefs.channelBlacklist = result.list;
  if (result.updates.channelBlacklistEnabled) prefs.channelBlacklistEnabled = true;

  if (shouldBlacklist && result.changedChannels.length) {
    const unwhitelist = computeWhitelistUpdate(
      result.changedChannels,
      false,
      prefs.channelWhitelist,
      prefs.channelWhitelistEnabled,
    );
    if (unwhitelist && unwhitelist.updates.channelWhitelist) {
      prefs.channelWhitelist = unwhitelist.list;
      result.updates.channelWhitelist = unwhitelist.list;
    }
  }

  safeStorageSet('sync', result.updates);
  return result;
}

function updatePrefsFromYPP(s) {
  prefs.extensionEnabled = true;
  
  if (!s.hideWatched) {
    prefs.hideThreshold = 0;
  } else {
    prefs.hideThreshold = s.hideWatchedThreshold ?? 80;
  }
  
  prefs.hideHomeEnabled = s.hideWatchedHome ?? true;
  prefs.hideChannelEnabled = s.hideWatchedChannel ?? true;
  prefs.hideSearchEnabled = s.hideWatchedSearch ?? true;
  prefs.hideSubsEnabled = s.hideWatchedSubs ?? true;
  prefs.hideCorrEnabled = s.hideWatchedRelated ?? true;

  prefs.viewsHideThreshold = s.viewsFilterThreshold ?? 1000;
  prefs.viewsHideHomeEnabled = s.viewsFilterHome ?? true;
  prefs.viewsHideChannelEnabled = s.viewsFilterChannel ?? true;
  prefs.viewsHideSearchEnabled = s.viewsFilterSearch ?? true;
  prefs.viewsHideSubsEnabled = s.viewsFilterSubs ?? true;
  prefs.viewsHideCorrEnabled = s.viewsFilterRelated ?? true;
  if (!s.viewsFilterEnabled) {
    prefs.viewsHideThreshold = 0;
  }

  prefs.hideShortsEnabled = s.aggressiveShortsBlock ?? false;
  prefs.hideShortsHome = s.shortsFilterHome ?? true;
  prefs.hideShortsChannel = s.shortsFilterChannel ?? true;
  prefs.hideShortsSubs = s.shortsFilterSubs ?? true;
  prefs.hideShortsSearch = s.shortsFilterSearch ?? true;
  prefs.hideShortsRelated = s.shortsFilterRelated ?? true;
  prefs.hideShortsSearchEnabled = s.shortsFilterSearch ?? true;
  
  prefs.hideMixesEnabled = s.hideMixes ?? false;
  prefs.hideMixesHome = s.hideMixesHome ?? true;
  prefs.hideMixesChannel = s.hideMixesChannel ?? true;
  prefs.hideMixesSubs = s.hideMixesSubs ?? true;
  prefs.hideMixesSearch = s.hideMixesSearch ?? true;
  prefs.hideMixesRelated = s.hideMixesRelated ?? true;

  prefs.hidePlaylistsEnabled = s.hidePlaylists ?? false;
  prefs.hidePlaylistsHome = s.hidePlaylistsHome ?? true;
  prefs.hidePlaylistsChannel = s.hidePlaylistsChannel ?? true;
  prefs.hidePlaylistsSubs = s.hidePlaylistsSubs ?? true;
  prefs.hidePlaylistsSearch = s.hidePlaylistsSearch ?? true;
  prefs.hidePlaylistsRelated = s.hidePlaylistsRelated ?? true;

  prefs.hideLivesEnabled = s.hideLiveStreams ?? false;

  prefs.dateFilterNewerThreshold = s.uploadDateNewer ?? 0;
  prefs.dateFilterOlderThreshold = s.dateFilterOlderThreshold ?? 0;
  if (!s.dateFilterEnabled) {
    prefs.dateFilterNewerThreshold = 0;
    prefs.dateFilterOlderThreshold = 0;
  }
  
  prefs.dateFilterHomeEnabled = s.dateFilterHome ?? true;
  prefs.dateFilterChannelEnabled = s.dateFilterChannel ?? true;
  prefs.dateFilterSearchEnabled = s.dateFilterSearch ?? true;
  prefs.dateFilterSubsEnabled = s.dateFilterSubs ?? true;
  prefs.dateFilterCorrEnabled = s.dateFilterRelated ?? true;

  prefs.hideUpcomingEnabled = s.hideUpcoming ?? false;
  
  prefs.hidePodcastsEnabled = s.hidePodcasts ?? false;
  prefs.hidePodcastsHome = s.hidePodcastsHome ?? true;
  prefs.hidePodcastsChannel = s.hidePodcastsChannel ?? true;
  prefs.hidePodcastsSubs = s.hidePodcastsSubs ?? true;
  prefs.hidePodcastsSearch = s.hidePodcastsSearch ?? true;
  prefs.hidePodcastsRelated = s.hidePodcastsRelated ?? true;

  prefs.hidePostsEnabled = s.hidePosts ?? false;
  prefs.hidePostsHome = s.hidePostsHome ?? true;
  prefs.hidePostsChannel = s.hidePostsChannel ?? true;
  prefs.hidePostsSubs = s.hidePostsSubs ?? true;
  prefs.hidePostsSearch = s.hidePostsSearch ?? true;
  prefs.hidePostsRelated = s.hidePostsRelated ?? true;

  prefs.hidePromosEnabled = s.hidePromoShelves ?? false;

  prefs.hideWatchedMode = s.hideWatchedMode || 'dim';
  prefs.viewsFilterEnabledMode = s.viewsFilterEnabledMode || 'hide';
  prefs.dateFilterEnabledMode = s.dateFilterEnabledMode || 'hide';
  
  prefs.hideShortsMode = s.aggressiveShortsBlockMode || 'hide';
  prefs.hideMixesMode = s.hideMixesMode || 'hide';
  prefs.hidePlaylistsMode = s.hidePlaylistsMode || 'hide';
  prefs.hideLivesMode = s.hideLiveStreamsMode || 'hide';
  prefs.hideUpcomingMode = s.hideUpcomingMode || 'hide';
  prefs.hidePodcastsMode = s.hidePodcastsMode || 'hide';
  prefs.hidePostsMode = s.hidePostsMode || 'hide';
  prefs.hidePromosMode = s.hidePromosMode || 'hide';

  prefs.tutorialCompleted = true; // disable tutorial
  prefs.channelWhitelistEnabled = s.channelWhitelistEnabled ?? true;
  prefs.channelBlacklistEnabled = s.channelBlacklistEnabled ?? true;
  prefs.hideInterfaceElements = s.hideOnPageControls ?? false;
}

function initPrefs() {
  return new Promise(resolve => {
    try {
      if (window.YPP && window.YPP.settings) {
        updatePrefsFromYPP(window.YPP.settings);
        resolve();
      } else {
        // Read from local storage (where PATCH_SETTINGS writes to)
        chrome.storage.local.get('settings', localResult => {
          const localSettings = localResult.settings;
          if (localSettings && Object.keys(localSettings).length > 0) {
            updatePrefsFromYPP(localSettings);
            if (localSettings.channelWhitelist) prefs.channelWhitelist = localSettings.channelWhitelist;
            if (localSettings.channelWhitelistEnabled !== undefined) prefs.channelWhitelistEnabled = localSettings.channelWhitelistEnabled;
            if (localSettings.channelBlacklist) prefs.channelBlacklist = localSettings.channelBlacklist;
            if (localSettings.channelBlacklistEnabled !== undefined) prefs.channelBlacklistEnabled = localSettings.channelBlacklistEnabled;
            resolve();
          } else {
            // Fallback to sync if local is empty
            chrome.storage.sync.get('settings', syncResult => {
              const rawSettings = syncResult.settings || {};
              updatePrefsFromYPP(rawSettings);
              resolve();
            });
          }
        });
      }
    } catch (e) {
      resolve();
    }
  });
}

function setupPrefsListener() {
  try {
    if (window.YPP && window.YPP.events) {
      window.YPP.events.on('settings:updated', () => {
         updatePrefsFromYPP(window.YPP.settings);
         injectZeroJSCSS();
         resetAppliedFilters(true);
         startHiding(currentPath);
      });
      window.YPP.events.on('watched:updated', () => {
         updatePrefsFromYPP(window.YPP.settings);
         injectZeroJSCSS();
         startHiding(currentPath);
      });
    }
  } catch (e) {}
}

// Fix #1: Direct storage listener — works independently of window.YPP.events
// This is the PRIMARY update path. When the popup saves settings via PATCH_SETTINGS,
// the service worker writes to chrome.storage.local, which fires this listener.
function setupStorageListener() {
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      // Only care about local storage (that's where PATCH_SETTINGS writes)
      if (area !== 'local') return;
      const settingsChange = changes.settings;
      if (!settingsChange || !settingsChange.newValue) return;

      const newSettings = settingsChange.newValue;
      updatePrefsFromYPP(newSettings);

      // Also sync channel lists from new settings
      if (newSettings.channelWhitelist) prefs.channelWhitelist = newSettings.channelWhitelist;
      if (newSettings.channelWhitelistEnabled !== undefined) prefs.channelWhitelistEnabled = newSettings.channelWhitelistEnabled;
      if (newSettings.channelBlacklist) prefs.channelBlacklist = newSettings.channelBlacklist;
      if (newSettings.channelBlacklistEnabled !== undefined) prefs.channelBlacklistEnabled = newSettings.channelBlacklistEnabled;

      // Immediately re-apply CSS rules and re-run JS filters
      injectZeroJSCSS();
      resetAppliedFilters(true);
      startHiding(currentPath);
    });
  } catch (e) {
    logger.warn('setupStorageListener failed:', e);
  }
}
