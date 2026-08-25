const fs = require('fs');
let code = fs.readFileSync('src/popup/scripts/core/popup-schema.js', 'utf8');

// Inject Ad & Sponsor Blocking in Player tab
const playerTarget = "id: 'player',";
const adBlockerSection = `
      {
        title: 'Ad & Sponsor Blocking',
        icon: ICONS.compressor,
        items: [
          { type: 'toggle', id: 'autoSkipAds', label: 'Auto Skip Ads', desc: 'Automatically skip YouTube video ads', icon: ICONS.play },
          { type: 'toggle', id: 'autoSkipPromos', label: 'Auto Skip Promos', desc: 'Skip self-promotion segments', icon: ICONS.play },
          { type: 'toggle', id: 'autoSkipSponsors', label: 'Auto Skip Sponsors', desc: 'Skip sponsored segments in videos', icon: ICONS.play },
          { type: 'toggle', id: 'sponsorBlock', label: 'SponsorBlock API', desc: 'Use crowdsourced SponsorBlock data', icon: ICONS.magicWand },
        ],
      },`;

// Inject Content Blocking and Watched Videos in Declutter tab
const declutterTarget = "id: 'declutter',";
const declutterSections = `
      {
        title: 'Content Blocking',
        icon: ICONS.filter,
        items: [
          { type: 'toggle', id: 'hideShorts', label: 'Hide Shorts Globally', desc: 'Remove YouTube Shorts from all feeds', icon: ICONS.shorts },
          { type: 'toggle', id: 'hideSearchShorts', label: 'Hide Shorts in Search', desc: 'Remove Shorts from search results', icon: ICONS.search },
        ],
      },
      {
        title: 'Watched Videos',
        icon: ICONS.eyeSlash,
        items: [
          { type: 'toggle', id: 'hideWatchedMode', label: 'Hide Watched Videos', desc: 'Remove videos you have already seen', icon: ICONS.eyeSlash },
          { type: 'range', id: 'hideWatchedThreshold', class: 'span-2', label: 'Watched Threshold', desc: 'Percentage watched to trigger', min: 10, max: 100, step: 5, unit: '%' },
        ],
      },`;

// Inject Subscription Organizers in Subscriptions tab
const subsTarget = "id: 'subscriptions',";
const subsSections = `
      {
        title: 'Subscription Organizers',
        icon: ICONS.subs,
        items: [
          { type: 'toggle', id: 'enableSubsManager', label: 'Subs Manager', desc: 'Enable advanced subscription manager', icon: ICONS.settingsSync },
          { type: 'toggle', id: 'subscriptionFolders', label: 'Subscription Folders', desc: 'Organize subscriptions into folders', icon: ICONS.folder },
        ],
      },`;

code = code.replace(
  "id: 'netflixSubtitles',",
  "id: 'autoPlayNext',\n            label: 'Auto Play Next',\n            desc: 'Toggle YouTube autoplay next behavior',\n            icon: ICONS.play,\n          },\n          {\n            type: 'toggle',\n            id: 'netflixSubtitles',"
);

code = code.replace(
  "id: 'revertProgressBar',",
  "id: 'revertProgressBar',\n            label: t('classic_progress_bar'),\n            desc: t('solid_red_no_pink_gradient'),\n            icon: ICONS.progressBar,\n          },\n          {\n            type: 'toggle',\n            id: 'returnYouTubeDislike',\n            label: 'Return YouTube Dislike',\n            desc: 'Restore dislike counts on videos',\n            icon: ICONS.thumbsUp,\n          },\n          {\n            type: 'toggle',\n            id: 'markWatched',\n            label: 'Mark as Watched Button',\n            desc: 'Add a button to manually mark videos as watched',\n            icon: ICONS.eyeSlash,"
);

function insertAfter(str, searchStr, insertStr) {
    const idx = str.indexOf(searchStr);
    if (idx === -1) return str;
    const sectionsIdx = str.indexOf('sections: [', idx);
    if (sectionsIdx === -1) return str;
    const targetIdx = sectionsIdx + 'sections: ['.length;
    return str.slice(0, targetIdx) + insertStr + str.slice(targetIdx);
}

code = insertAfter(code, playerTarget, adBlockerSection);
code = insertAfter(code, declutterTarget, declutterSections);
code = insertAfter(code, subsTarget, subsSections);

fs.writeFileSync('src/popup/scripts/core/popup-schema.js', code);
console.log('Successfully injected orphan features into popup-schema.js');
