const fs = require('fs');
const path = require('path');

const FEATURE_MAP = {
        theme: 'Theme', subsOrganizer: 'SubscriptionsOrganizer', cinematicMode: 'CinematicMode',
        accountMenu: 'AccountMenu', headerNav: 'HeaderNav', redirectShorts: 'RedirectShorts',
        playerTools: 'PlayerTools', autoLike: 'AutoLike', gridAnimator: 'GridAnimator',
        multiSelect: 'MultiSelect', hideMetrics: 'HideMetrics', intentionalDelay: 'IntentionalDelay',
        playlistDuration: 'PlaylistDuration', watchHistory: 'WatchHistoryTracker', watchTimeAlert: 'WatchTimeAlert',
        watchTimeLimit: 'WatchTimeLimit', historyTracker: 'HistoryTracker', historyRedesign: 'HistoryRedesign',
        playlistRedesign: 'PlaylistRedesign', ambientMode: 'AmbientMode', audioMode: 'AudioMode',
        videoControls: 'VideoControls', videoSpeedController: 'VideoSpeedController', returnYouTubeDislike: 'ReturnDislike',
        sponsorBlock: 'SponsorBlock', floatingPlayer: 'FloatingPlayer', videoFilters: 'VideoFilters',
        reversePlaylist: 'ReversePlaylist', continueWatching: 'ContinueWatching', contextMenu: 'ContextMenu',
        hideWatched: 'HideWatched', hideMixes: 'HideMixes', keyboardShortcuts: 'KeyboardShortcuts',
        wheelControls: 'WheelControls', audioCompressor: 'AudioCompressor', videoResumer: 'VideoResumer',
        autoPause: 'AutoPause', commentFilter: 'CommentFilter', globalPlayerBar: 'GlobalPlayerBar',
        volumeBoost: 'VolumeBooster', autoQuality: 'AutoQuality', timeDisplay: 'TimeDisplay',
        watchRedesign: 'WatchRedesign', bookmarksManager: 'BookmarksManager', classicProgressBar: 'ClassicProgressBar',
        snapshotButton: 'SnapshotButton', loopButton: 'LoopButton', splitScrolling: 'SplitScrolling',
        customCSS: 'CustomCSS', feedFilter: 'FeedFilter', layout: 'Layout', autoScaleLayout: 'AutoScaleGrid',
        displayFullTitle: 'FullVideoTitles', subscriptionFolders: 'SubscriptionFolders', filterBar: 'FilterBar',
        channelHealth: 'ChannelHealth', groupSidebar: 'GroupSidebar', deckMode: 'DeckMode',
        premiumLogo: 'PremiumLogo', smartDownload: 'SmartDownload', resumeBadges: 'ResumeBadges',
        speedBooster: 'SpeedBooster', liquidGlassUiTheme: 'LiquidGlassUiTheme', cyberpunkUiTheme: 'CyberpunkUiTheme',
        neumorphicUiTheme: 'NeumorphicUiTheme', natureUiTheme: 'NatureUiTheme', forestUiTheme: 'ForestUiTheme',
        vintageUiTheme: 'VintageUiTheme', oceanUiTheme: 'OceanUiTheme', blueSkyUiTheme: 'BlueSkyUiTheme',
        retroUiTheme: 'RetroUiTheme', technozenUiTheme: 'TechnozenUiTheme'
};

const PRIORITY_ORDER = [
    'theme', 'headerNav', 'sidebarLayout', 'layout', 'autoScaleLayout',
    'keyboardShortcuts', 'videoSpeedController', 'volumeBoost', 'videoFilters',
    'hideWatched', 'multiSelect',
    'playlistRedesign', 'gridAnimator', 'ambientMode'
];
const SEQUENTIAL_UI = [
    'theme', 'headerNav', 'sidebarLayout', 'layout', 'playlistRedesign', 
    'volumeBoost', 'videoFilters', 'historyRedesign', 'watchRedesign', 
    'globalPlayerBar', 'deckMode', 'subscriptionFolders'
];
const AFTER_LAYOUT = ['autoScaleLayout'];

const srcDir = path.join(__dirname, 'src/content/features');

function getFeatureInfo(className) {
    for (const [key, val] of Object.entries(FEATURE_MAP)) {
        if (val === className) {
            let priority = PRIORITY_ORDER.indexOf(key);
            priority = priority === -1 ? 999 : priority;
            let phase = 'idle';
            if (SEQUENTIAL_UI.includes(key)) phase = 'sequential-ui';
            else if (AFTER_LAYOUT.includes(key)) phase = 'post-layout';
            return { featureId: key, priority, phase };
        }
    }
    // Unknown feature
    return { featureId: className.charAt(0).toLowerCase() + className.slice(1), priority: 999, phase: 'idle' };
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.js') && file !== 'base-feature.js') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Remove window.YPP namespaces
            if (content.includes('window.YPP = window.YPP || {};')) {
                content = content.replace('window.YPP = window.YPP || {};\n', '');
                modified = true;
            }
            if (content.includes('window.YPP.features = window.YPP.features || {};')) {
                content = content.replace('window.YPP.features = window.YPP.features || {};\n', '');
                modified = true;
            }

            // Replace class definition
            const regex = /window\.YPP\.features\.([a-zA-Z0-9_]+)\s*=\s*class\s+([a-zA-Z0-9_]+)(.*?{)/g;
            content = content.replace(regex, (match, attachName, className, rest) => {
                modified = true;
                const info = getFeatureInfo(className);
                
                return `export class ${className}${rest}
    static featureId = '${info.featureId}';
    static executionPhase = '${info.phase}';
    static priority = ${info.priority};
`;
            });

            if (modified) {
                fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(srcDir);
console.log('Feature files updated.');
