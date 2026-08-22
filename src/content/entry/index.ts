// Core dependencies
import '../config/constants.js';
import '../config/settings-schema.js';
import '../core/system/error-handler.js';
import '../core/dom/element-cache.js';
import '../config/utils.js';
import '../config/youtube-parsers.js';

import '../core/events/event-bus.js';
import '../core/dom/dom-api.js';
import '../core/dom/dom-observer.js';
import '../core/system/storage-manager.js';
import '../core/events/event-delegator.js';
import '../core/system/feature-manager.js';

// CSS Imports
import '../global/styles/core-styles.css';
import '../design-system/index.css';
import '../global/styles/grid-layout.css';
import '../pages/watch/player/player.css';
import '../global/styles/header-ast.css';
import '../global/styles/sidebar-ast.css';
import '../pages/watch/styles/comments.css';
import '../pages/search/styles/search-grid.css';
import '../pages/playlist/styles/playlist-ast.css';
import '../pages/history/styles/history-ast.css';
import '../pages/subscriptions/styles/subscriptions-ast.css';
import '../pages/home/styles/home-ast.css';
import '../pages/shorts/styles/shorts-ast.css';
import '../global/styles/header-nav.css';
import '../pages/home/styles/cards.css';

// Managers (Phase 4.5)
import '../global/features/hotkeys-manager.js';
import '../core/system/base-page-manager.js';
import '../global/layout/global-layout-manager.js';
import '../pages/home/home-manager.js';
import '../pages/subscriptions/subs-manager.js';
import '../pages/search/search-manager.js';
import '../pages/watch/watch-manager.js';
import '../design-system/color/thumbnail-color-manager.js';

// UI Architecture (Phase 4)
import '../design-system/components/managers/ui-manager.js';
import '../design-system/components/components/button.js';
import '../design-system/components/components/panel.js';

// Base feature class
import '../core/system/base-feature.js';
import { BaseFilterFeature } from '../global/declutter/base-filter-feature.js';
window.YPP.FeatureManager.register(BaseFilterFeature);

import { SplitScrolling } from '../pages/watch/player/enhancements/split-scrolling.js';
window.YPP.FeatureManager.register(SplitScrolling);

// Global features
import { ThemeManager } from '../global/features/theme.js';
window.YPP.FeatureManager.register(ThemeManager);
import '../global/features/account-menu-data.js';
import '../global/features/account-menu-ui.js';
import { AccountMenu } from '../global/features/account-menu.js';
window.YPP.FeatureManager.register(AccountMenu);
import { HeaderButton } from '../global/features/header-button.js';
window.YPP.FeatureManager.register(HeaderButton);
import { GridAnimator } from '../global/layout/grid-animator.js';
window.YPP.FeatureManager.register(GridAnimator);
// Toggles handled by GlobalLayoutManager
import { ScreenFilters } from '../global/declutter/screen-filters.js';
window.YPP.FeatureManager.register(ScreenFilters);
import { CustomCursor } from '../global/features/custom-cursor.js';
window.YPP.FeatureManager.register(CustomCursor);

import '../global/features/watched-store.js';
import { MultiSelect } from '../global/features/multi-select.js';
window.YPP.FeatureManager.register(MultiSelect);
import '../global/styles/multi-select.css';

import { HideWatched } from '../global/declutter/hide-watched.js';
window.YPP.FeatureManager.register(HideWatched);
import { HideMetrics } from '../global/declutter/hide-metrics.js';
window.YPP.FeatureManager.register(HideMetrics);
import { CopyLinkButton } from '../global/features/copy-link.js';
window.YPP.FeatureManager.register(CopyLinkButton);
import { KeyboardShortcuts } from '../global/features/keyboard-shortcuts.js';
window.YPP.FeatureManager.register(KeyboardShortcuts);
import '../global/declutter/filter-ui-interactions.js';
import '../global/styles/filters.css';
import { DurationFilter } from '../global/declutter/duration-filter.js';
window.YPP.FeatureManager.register(DurationFilter);
import { BlocklistFilter } from '../global/declutter/blocklist-filter.js';
window.YPP.FeatureManager.register(BlocklistFilter);
import { FeedFilter } from '../global/declutter/feed-filter.js';
window.YPP.FeatureManager.register(FeedFilter);
import { FiltersManager } from '../global/declutter/filters-manager.js';
window.YPP.FeatureManager.register(FiltersManager);
import { CardPipeline } from '../global/features/card-pipeline.js';
window.YPP.FeatureManager.register(CardPipeline);
import { ViewsFilter } from '../global/declutter/views-filter.js';
window.YPP.FeatureManager.register(ViewsFilter);
import { UploadDateFilter } from '../global/declutter/upload-date-filter.js';
window.YPP.FeatureManager.register(UploadDateFilter);
import { ClickbaitFilter } from '../global/declutter/clickbait-filter.js';
window.YPP.FeatureManager.register(ClickbaitFilter);
import { ChannelBlacklist } from '../global/features/channel-blacklist.js';
window.YPP.FeatureManager.register(ChannelBlacklist);
import { ChannelWhitelist } from '../global/features/channel-whitelist.js';
window.YPP.FeatureManager.register(ChannelWhitelist);


// Layout features
import { AutoScaleGrid } from '../global/layout/auto-scale-grid.js';
window.YPP.FeatureManager.register(AutoScaleGrid);
import { HeaderNav } from '../global/features/header-nav.js';
window.YPP.FeatureManager.register(HeaderNav);
import { GridLayoutManager } from '../global/layout/layout-manager.js';
window.YPP.FeatureManager.register(GridLayoutManager);

// Home page features
import { HomeOrganizer } from '../pages/home/features/home-organizer.js';
window.YPP.FeatureManager.register(HomeOrganizer);
import { CinematicMode } from '../pages/home/layout/cinematic-mode.js';
window.YPP.FeatureManager.register(CinematicMode);

// Shorts features
import { HideShorts } from '../pages/shorts/declutter/hide-shorts.js';
window.YPP.FeatureManager.register(HideShorts);
import { RedirectShorts } from '../pages/shorts/features/redirect-shorts.js';
window.YPP.FeatureManager.register(RedirectShorts);
import { StopShortsLooping } from '../pages/shorts/features/stop-looping.js';
window.YPP.FeatureManager.register(StopShortsLooping);
import { ShortsAutoScroll } from '../pages/shorts/features/auto-scroll.js';
window.YPP.FeatureManager.register(ShortsAutoScroll);
import { ShortsVolumeNormalizer } from '../pages/shorts/features/volume-normalizer.js';
window.YPP.FeatureManager.register(ShortsVolumeNormalizer);

// Subscription features
import { FolderStorage } from '../pages/subscriptions/features/folder-storage.js';
window.YPP.FeatureManager.register(FolderStorage);
import { CustomDialog } from '../pages/subscriptions/features/folder-ui.js';
window.YPP.FeatureManager.register(CustomDialog);
import { ContextMenu } from '../pages/subscriptions/features/context-menu.js';
window.YPP.FeatureManager.register(ContextMenu);
import { SubscriptionFolders } from '../pages/subscriptions/features/subscription-folders.js';
window.YPP.FeatureManager.register(SubscriptionFolders);
import { SubscriptionManager } from '../pages/subscriptions/features/subscription-manager.js';
window.YPP.FeatureManager.register(SubscriptionManager);
import { FolderFeed } from '../pages/subscriptions/features/folder-feed.js';
window.YPP.FeatureManager.register(FolderFeed);
import { DeckMode } from '../pages/subscriptions/layout/deck-mode.js';
window.YPP.FeatureManager.register(DeckMode);
import { SubscriptionsOrganizer } from '../pages/subscriptions/features/index.js';
window.YPP.FeatureManager.register(SubscriptionsOrganizer);
import { ChannelHealth } from '../pages/subscriptions/features/channel-health.js';
window.YPP.FeatureManager.register(ChannelHealth);
import { GroupSidebar } from '../pages/subscriptions/layout/group-sidebar.js';
window.YPP.FeatureManager.register(GroupSidebar);

// Layout features
import { ChannelColumns } from '../global/features/channel-columns.js';
window.YPP.FeatureManager.register(ChannelColumns);
import { FeedGridColumns } from '../global/layout/feed-grid-columns.js';
window.YPP.FeatureManager.register(FeedGridColumns);

// Search features
import { SearchObserver } from '../pages/search/features/search-observer.js';
window.YPP.FeatureManager.register(SearchObserver);
import { SearchRedesign } from '../pages/search/layout/search-redesign.js';
window.YPP.FeatureManager.register(SearchRedesign);


// Library & History features

import { HistoryRedesign } from '../pages/history/layout/history-redesign.js';
window.YPP.FeatureManager.register(HistoryRedesign);
import { PlaylistRedesign } from '../pages/playlist/layout/playlist-redesign.js';
window.YPP.FeatureManager.register(PlaylistRedesign);
import { PlaylistDuration } from '../pages/playlist/features/duration-calculator.js';
window.YPP.FeatureManager.register(PlaylistDuration);
import { ReversePlaylist } from '../pages/playlist/features/reverse-playlist.js';
window.YPP.FeatureManager.register(ReversePlaylist);

// Watch page features
import { WatchHistoryTracker } from '../pages/watch/features/watch-history.js';
window.YPP.FeatureManager.register(WatchHistoryTracker);
import { SmartHistory } from '../pages/watch/features/smart-history.js';
window.YPP.FeatureManager.register(SmartHistory);
import { WatchTimeAlert } from '../pages/watch/features/watch-time-alert.js';
window.YPP.FeatureManager.register(WatchTimeAlert);
import { WatchTimeLimit } from '../pages/watch/features/watch-time-limit.js';
window.YPP.FeatureManager.register(WatchTimeLimit);
import { ContinueWatching } from '../pages/watch/features/continue-watching.js';
window.YPP.FeatureManager.register(ContinueWatching);
import { ZenMode } from '../pages/watch/layout/zen-mode.js';
window.YPP.FeatureManager.register(ZenMode);
import { FocusMode } from '../pages/watch/layout/focus-mode.js';
window.YPP.FeatureManager.register(FocusMode);
import { StudyMode } from '../pages/watch/layout/study-mode.js';
window.YPP.FeatureManager.register(StudyMode);
import { CommentFilter } from '../pages/watch/declutter/comment-filter.js';
window.YPP.FeatureManager.register(CommentFilter);
import { WatchRedesign } from '../pages/watch/layout/watch-redesign.js';
window.YPP.FeatureManager.register(WatchRedesign);
import { InlineChannelButtons } from '../pages/watch/features/inline-channel-buttons.js';
window.YPP.FeatureManager.register(InlineChannelButtons);
import { SeamlessMode } from '../pages/watch/layout/seamless-mode.js';
window.YPP.FeatureManager.register(SeamlessMode);

// Player features (imported to register on window.YPP.features for WatchPageManager)
import '../pages/watch/player/player-bar-ui.js';
import '../pages/watch/player/player-controls.js';
import { SnapshotButton } from '../pages/watch/player/controls/snapshot-button.js';
window.YPP.FeatureManager.register(SnapshotButton);
import { LoopButton } from '../pages/watch/player/controls/loop-button.js';
window.YPP.FeatureManager.register(LoopButton);
import '../pages/watch/player/player-settings-menu.js';
// FilterPresets is a standalone UI/data manager, not a standard BaseFeature. Keep standard import.
import '../pages/watch/player/filter-presets.js';
import { GlobalBarUI } from '../global/global-bar/global-bar-ui.js';
window.YPP.FeatureManager.register(GlobalBarUI);
import { GlobalPlayerBar } from '../global/global-bar/global-bar.js';
window.YPP.FeatureManager.register(GlobalPlayerBar);
import { PlayerTools } from '../pages/watch/player/controls/player-tools.js';
window.YPP.FeatureManager.register(PlayerTools);
import { AutoLike } from '../pages/watch/player/automation/auto-like.js';
window.YPP.FeatureManager.register(AutoLike);
import { BookmarksManager } from '../pages/watch/player/controls/bookmarks.js';
window.YPP.FeatureManager.register(BookmarksManager);
import { IntentionalDelay } from '../pages/watch/player/enhancements/intentional-delay.js';
window.YPP.FeatureManager.register(IntentionalDelay);


// YouTube Pro Plus ported features
import { PremiumLogo } from '../global/features/premium-logo.js';
window.YPP.FeatureManager.register(PremiumLogo);
// import { SmartDownload } from '../features/player/enhancements/smart-download.js';
// window.YPP.FeatureManager.register(SmartDownload);
import { ResumeBadges } from '../global/features/resume-badges.js';
window.YPP.FeatureManager.register(ResumeBadges);

import { VideoSpeedController } from '../pages/watch/player/enhancements/video-speed-controller.js';
window.YPP.FeatureManager.register(VideoSpeedController);
import { AudioEQ } from '../pages/watch/player/media-effects/audio-eq.js';
window.YPP.FeatureManager.register(AudioEQ);
import { AutoSubtitles } from '../pages/watch/player/automation/auto-subtitles.js';
// Always purge leftover subtitle DOM from previous sessions before deciding whether to enable.
// This is what prevents the custom subtitles from appearing when the feature is toggled OFF.
AutoSubtitles._purgeOrphans();
window.YPP.FeatureManager.register(AutoSubtitles);
import { AutoTranscript } from '../pages/watch/player/automation/auto-transcript.js';
window.YPP.FeatureManager.register(AutoTranscript);
import { MiniPlayerScroll } from '../pages/watch/player/automation/mini-player-scroll.js';
window.YPP.FeatureManager.register(MiniPlayerScroll);
import { VSCAudioSupport } from '../pages/watch/player/enhancements/vsc-audio-support.js';
window.YPP.FeatureManager.register(VSCAudioSupport);
import { VSCHideByDefault } from '../pages/watch/player/enhancements/vsc-hide-by-default.js';
window.YPP.FeatureManager.register(VSCHideByDefault);
import { VSCForceSpeed } from '../pages/watch/player/enhancements/vsc-force-speed.js';
window.YPP.FeatureManager.register(VSCForceSpeed);
import { VSCRememberSpeed } from '../pages/watch/player/enhancements/vsc-remember-speed.js';
window.YPP.FeatureManager.register(VSCRememberSpeed);

import '../pages/watch/player/media-effects/video-filters/video-filters-presets.js';
import '../pages/watch/player/media-effects/video-filters/video-filters-overlay.js';
import '../pages/watch/player/media-effects/video-filters/video-filters-ui.js';
import { VideoFilters } from '../pages/watch/player/media-effects/video-filters/video-filters.js';
window.YPP.FeatureManager.register(VideoFilters);
import '../pages/watch/player/media-effects/volume-booster/volume-booster-ui.js';
import { VolumeBooster } from '../pages/watch/player/media-effects/volume-booster/volume-booster.js';
window.YPP.FeatureManager.register(VolumeBooster);
import '../pages/watch/player/domain-memory-ui.js';
import { DomainMemory } from '../pages/watch/player/domain-memory.js';
window.YPP.FeatureManager.register(DomainMemory);
import { AutoQuality } from '../pages/watch/player/automation/auto-quality.js';
window.YPP.FeatureManager.register(AutoQuality);
import { TimeDisplay } from '../pages/watch/player/enhancements/time-display.js';
window.YPP.FeatureManager.register(TimeDisplay);

import { AdSkipper } from '../pages/watch/player/automation/ad-skipper.js';
window.YPP.FeatureManager.register(AdSkipper);
import { AmbientMode } from '../pages/watch/player/media-effects/ambient-mode/ambient-mode.js';
window.YPP.FeatureManager.register(AmbientMode);
import { AudioMode } from '../pages/watch/player/media-effects/ambient-mode/audio-mode.js';
window.YPP.FeatureManager.register(AudioMode);
import { ClassicProgressBar } from '../pages/watch/player/controls/classic-progress-bar.js';
window.YPP.FeatureManager.register(ClassicProgressBar);
import { VideoResumer } from '../pages/watch/player/automation/video-resumer.js';
window.YPP.FeatureManager.register(VideoResumer);
import { AutoPause } from '../pages/watch/player/automation/auto-pause.js';
window.YPP.FeatureManager.register(AutoPause);
import { AutoCinema } from '../pages/watch/player/automation/auto-cinema.js';
window.YPP.FeatureManager.register(AutoCinema);
import { AutoPiP } from '../pages/watch/player/automation/auto-pip.js';
window.YPP.FeatureManager.register(AutoPiP);
import { RealCinemaMode } from '../pages/watch/player/enhancements/real-cinema-mode.js';
window.YPP.FeatureManager.register(RealCinemaMode);
import { LiveStreamTime } from '../pages/watch/player/enhancements/live-stream-time.js';
window.YPP.FeatureManager.register(LiveStreamTime);
import { TwoColumnSubscriptions } from '../pages/subscriptions/features/two-column-subscriptions.js';
window.YPP.FeatureManager.register(TwoColumnSubscriptions);


import { SaveSupremeUI } from '../global/features/save-supreme-ui.js';
window.YPP.FeatureManager.register(SaveSupremeUI);
import { CustomizeYouTubeUI } from '../global/features/customize-youtube-ui.js';
window.YPP.FeatureManager.register(CustomizeYouTubeUI);
import { CPUTamer } from '../global/features/cpu-tamer.js';
window.YPP.FeatureManager.register(CPUTamer);
import { ReduceAnimations } from '../global/features/reduce-animations.js';
window.YPP.FeatureManager.register(ReduceAnimations);
import { TabviewSidebar } from '../global/layout/tabview-sidebar.js';
window.YPP.FeatureManager.register(TabviewSidebar);
import { StarTubeLayout } from '../global/layout/startube-layout.js';
window.YPP.FeatureManager.register(StarTubeLayout);
import '../pages/watch/player/controls/sidebar-layout.css';

// Main entry
import './main.js';
