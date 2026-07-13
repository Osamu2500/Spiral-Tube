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
import '../core/system/feature-manager.js';

// CSS Imports
import '../features/global/core-styles.css';
import '../features/global/layout/grid-layout.css';
import '../features/player/player.css';
import '../features/global/layout/header-ast.css';
import '../features/global/layout/sidebar-ast.css';
import '../features/pages/watch/comments.css';
import '../features/pages/search/search-ast.css';
import '../features/pages/library/playlist/playlist-ast.css';
import '../features/pages/library/history/history-ast.css';
import '../features/pages/subscriptions/subscriptions-ast.css';
import '../features/pages/home/home-ast.css';
import '../features/shorts/shorts-ast.css';
import '../features/global/layout/header-nav.css';
import '../features/pages/home/cards.css';

// Managers (Phase 4.5)
import '../core/managers/hotkeys-manager.js';
import '../core/managers/base-page-manager.js';
import '../core/managers/global-layout-manager.js';
import '../core/managers/home-page-manager.js';
import '../core/managers/subs-page-manager.js';
import '../core/managers/search-page-manager.js';
import '../core/managers/watch-page-manager.js';
import '../core/managers/thumbnail-color-manager.js';

// UI Architecture (Phase 4)
import '../ui/managers/ui-manager.js';
import '../ui/components/button.js';
import '../ui/components/panel.js';

// Base feature class
import '../core/system/base-feature.js';
import { BaseFilterFeature } from '../features/global/filters/base-filter-feature.js';
window.YPP.FeatureManager.register(BaseFilterFeature);

import { SplitScrolling } from '../features/player/enhancements/split-scrolling.js';
window.YPP.FeatureManager.register(SplitScrolling);

// Global features
import { ThemeManager } from '../features/global/ui-tweaks/theme.js';
window.YPP.FeatureManager.register(ThemeManager);
import { AccountMenu } from '../features/global/account-menu/account-menu.js';
window.YPP.FeatureManager.register(AccountMenu);
import { GridAnimator } from '../features/global/ui-tweaks/grid-animator.js';
window.YPP.FeatureManager.register(GridAnimator);
// Toggles handled by GlobalLayoutManager
import { ScreenFilters } from '../features/global/ui-tweaks/screen-filters.js';
window.YPP.FeatureManager.register(ScreenFilters);
import { CustomCSS } from '../features/global/ui-tweaks/custom-css.js';
window.YPP.FeatureManager.register(CustomCSS);
import { CustomCursor } from '../features/global/ui-tweaks/custom-cursor.js';
window.YPP.FeatureManager.register(CustomCursor);

import '../features/global/behavior/watched-store.js';
import { MultiSelect } from '../features/global/behavior/multi-select.js';
window.YPP.FeatureManager.register(MultiSelect);
import '../features/global/ui-tweaks/multi-select.css';

window.YPP.FeatureManager.register(MultiSelect);
import '../features/global/ui-tweaks/multi-select.css';

import { HideWatched } from '../features/global/ui-tweaks/hide-watched.js';
window.YPP.FeatureManager.register(HideWatched);
import { HideMixes } from '../features/global/ui-tweaks/hide-mixes.js';
window.YPP.FeatureManager.register(HideMixes);
import { HidePromos } from '../features/global/ui-tweaks/hide-promos.js';
window.YPP.FeatureManager.register(HidePromos);
import { HideExplore } from '../features/global/ui-tweaks/hide-explore.js';
window.YPP.FeatureManager.register(HideExplore);
import { HideMetrics } from '../features/global/ui-tweaks/hide-metrics.js';
window.YPP.FeatureManager.register(HideMetrics);
import { HidePlaylists } from '../features/global/ui-tweaks/hide-playlists.js';
window.YPP.FeatureManager.register(HidePlaylists);
import { HidePodcasts } from '../features/global/ui-tweaks/hide-podcasts.js';
window.YPP.FeatureManager.register(HidePodcasts);
import { HidePosts } from '../features/global/ui-tweaks/hide-posts.js';
window.YPP.FeatureManager.register(HidePosts);
import { HideChannelCards } from '../features/global/ui-tweaks/hide-channel-cards.js';
window.YPP.FeatureManager.register(HideChannelCards);
import { HideMusic } from '../features/global/ui-tweaks/hide-music.js';
window.YPP.FeatureManager.register(HideMusic);
import { KeyboardShortcuts } from '../features/global/behavior/keyboard-shortcuts.js';
window.YPP.FeatureManager.register(KeyboardShortcuts);
import '../features/global/filters/filter-ui-interactions.js';
import '../features/global/filters/filters.css';
import { DurationFilter } from '../features/global/filters/duration-filter.js';
window.YPP.FeatureManager.register(DurationFilter);
import { BlocklistFilter } from '../features/global/filters/blocklist-filter.js';
window.YPP.FeatureManager.register(BlocklistFilter);
import { FeedFilter } from '../features/global/filters/feed-filter.js';
window.YPP.FeatureManager.register(FeedFilter);
import { FullVideoTitles } from '../features/global/ui-tweaks/full-video-titles.js';
window.YPP.FeatureManager.register(FullVideoTitles);
import { FiltersManager } from '../features/global/filters/filters-manager.js';
window.YPP.FeatureManager.register(FiltersManager);
import { MetadataFilters } from '../features/global/filters/metadata-filters.js';
window.YPP.FeatureManager.register(MetadataFilters);
import { ChannelBlacklist } from '../features/global/filters/channel-blacklist.js';
window.YPP.FeatureManager.register(ChannelBlacklist);
import { ChannelWhitelist } from '../features/global/filters/channel-whitelist.js';
window.YPP.FeatureManager.register(ChannelWhitelist);


// Layout features
import { AutoScaleGrid } from '../features/global/layout/auto-scale-grid.js';
window.YPP.FeatureManager.register(AutoScaleGrid);
import { HeaderNav } from '../features/global/layout/header-nav.js';
window.YPP.FeatureManager.register(HeaderNav);
import { GridLayoutManager } from '../features/global/layout/layout-manager.js';
window.YPP.FeatureManager.register(GridLayoutManager);

// Home page features
import { HomeOrganizer } from '../features/pages/home/home-organizer.js';
window.YPP.FeatureManager.register(HomeOrganizer);
import { CinematicMode } from '../features/pages/home/cinematic-mode.js';
window.YPP.FeatureManager.register(CinematicMode);

// Shorts features
import { HideShorts } from '../features/shorts/modifiers/hide-shorts.js';
window.YPP.FeatureManager.register(HideShorts);
import { RedirectShorts } from '../features/shorts/modifiers/redirect-shorts.js';
window.YPP.FeatureManager.register(RedirectShorts);
import { StopShortsLooping } from '../features/shorts/modifiers/stop-looping.js';
window.YPP.FeatureManager.register(StopShortsLooping);
import { ShortsAutoScroll } from '../features/shorts/enhancements/auto-scroll.js';
window.YPP.FeatureManager.register(ShortsAutoScroll);
import { ShortsVolumeNormalizer } from '../features/shorts/enhancements/volume-normalizer.js';
window.YPP.FeatureManager.register(ShortsVolumeNormalizer);

// Subscription features
import { FolderStorage } from '../features/pages/subscriptions/folder-storage.js';
window.YPP.FeatureManager.register(FolderStorage);
import { CustomDialog } from '../features/pages/subscriptions/folder-ui.js';
window.YPP.FeatureManager.register(CustomDialog);
import { ContextMenu } from '../features/pages/subscriptions/context-menu.js';
window.YPP.FeatureManager.register(ContextMenu);
import { SubscriptionFolders } from '../features/pages/subscriptions/subscription-folders.js';
window.YPP.FeatureManager.register(SubscriptionFolders);
import { SubscriptionManager } from '../features/pages/subscriptions/subscription-manager.js';
window.YPP.FeatureManager.register(SubscriptionManager);
import { FolderFeed } from '../features/pages/subscriptions/folder-feed.js';
window.YPP.FeatureManager.register(FolderFeed);
import { DeckMode } from '../features/pages/subscriptions/deck-mode.js';
window.YPP.FeatureManager.register(DeckMode);
import { SubscriptionsOrganizer } from '../features/pages/subscriptions/index.js';
window.YPP.FeatureManager.register(SubscriptionsOrganizer);
import { ChannelHealth } from '../features/pages/subscriptions/channel-health.js';
window.YPP.FeatureManager.register(ChannelHealth);
import { GroupSidebar } from '../features/pages/subscriptions/group-sidebar.js';
window.YPP.FeatureManager.register(GroupSidebar);

// Layout features
import { ChannelColumns } from '../features/global/layout/channel-columns.js';
window.YPP.FeatureManager.register(ChannelColumns);
import { FeedGridColumns } from '../features/global/layout/feed-grid-columns.js';
window.YPP.FeatureManager.register(FeedGridColumns);

// Search features
import { SearchViewMode } from '../features/pages/search/search-view-mode.js';
window.YPP.FeatureManager.register(SearchViewMode);
import { SearchObserver } from '../features/pages/search/search-observer.js';
window.YPP.FeatureManager.register(SearchObserver);
import { SearchFilter } from '../features/pages/search/search-filter.js';
window.YPP.FeatureManager.register(SearchFilter);
import { SearchRedesign } from '../features/pages/search/search-redesign.js';
window.YPP.FeatureManager.register(SearchRedesign);


// Library & History features

import { HistoryRedesign } from '../features/pages/library/history/history-redesign.js';
window.YPP.FeatureManager.register(HistoryRedesign);
import { PlaylistRedesign } from '../features/pages/library/playlist/playlist-redesign.js';
window.YPP.FeatureManager.register(PlaylistRedesign);
import { PlaylistDuration } from '../features/pages/library/playlist/duration-calculator.js';
window.YPP.FeatureManager.register(PlaylistDuration);
import { ReversePlaylist } from '../features/pages/library/playlist/reverse-playlist.js';
window.YPP.FeatureManager.register(ReversePlaylist);

// Watch page features
import { WatchHistoryTracker } from '../features/pages/watch/watch-history.js';
window.YPP.FeatureManager.register(WatchHistoryTracker);
import { SmartHistory } from '../features/pages/watch/smart-history.js';
window.YPP.FeatureManager.register(SmartHistory);
import { WatchTimeAlert } from '../features/pages/watch/watch-time-alert.js';
window.YPP.FeatureManager.register(WatchTimeAlert);
import { WatchTimeLimit } from '../features/pages/watch/watch-time-limit.js';
window.YPP.FeatureManager.register(WatchTimeLimit);
import { ContinueWatching } from '../features/pages/watch/continue-watching.js';
window.YPP.FeatureManager.register(ContinueWatching);
import { ZenMode } from '../features/pages/watch/zen-mode.js';
window.YPP.FeatureManager.register(ZenMode);
import { FocusMode } from '../features/pages/watch/focus-mode.js';
window.YPP.FeatureManager.register(FocusMode);
import { StudyMode } from '../features/pages/watch/study-mode.js';
window.YPP.FeatureManager.register(StudyMode);
import { CommentFilter } from '../features/pages/watch/comment-filter.js';
window.YPP.FeatureManager.register(CommentFilter);
import { WatchRedesign } from '../features/pages/watch/watch-redesign.js';
window.YPP.FeatureManager.register(WatchRedesign);

// Player features
import { PlayerBarUI } from '../features/player/player-bar-ui.js';
window.YPP.FeatureManager.register(PlayerBarUI);
import { PlayerControls } from '../features/player/player-controls.js';
window.YPP.FeatureManager.register(PlayerControls);
import { SnapshotButton } from '../features/player/controls/snapshot-button.js';
window.YPP.FeatureManager.register(SnapshotButton);
import { LoopButton } from '../features/player/controls/loop-button.js';
window.YPP.FeatureManager.register(LoopButton);
import { PlayerSettingsMenu } from '../features/player/player-settings-menu.js';
window.YPP.FeatureManager.register(PlayerSettingsMenu);
// FilterPresets is a standalone UI/data manager, not a standard BaseFeature. Keep standard import.
import '../features/player/filter-presets.js';
import { GlobalBarUI } from '../features/player/global-bar-ui.js';
window.YPP.FeatureManager.register(GlobalBarUI);
import { GlobalPlayerBar } from '../features/player/global-bar.js';
window.YPP.FeatureManager.register(GlobalPlayerBar);
import { PlayerTools } from '../features/player/controls/player-tools.js';
window.YPP.FeatureManager.register(PlayerTools);
import { AutoLike } from '../features/player/automation/auto-like.js';
window.YPP.FeatureManager.register(AutoLike);
import { BookmarksManager } from '../features/player/controls/bookmarks.js';
window.YPP.FeatureManager.register(BookmarksManager);
import { IntentionalDelay } from '../features/player/enhancements/intentional-delay.js';
window.YPP.FeatureManager.register(IntentionalDelay);
import { ReturnDislike } from '../features/player/enhancements/return-dislike.js';
window.YPP.FeatureManager.register(ReturnDislike);

// YouTube Pro Plus ported features
import { PremiumLogo } from '../features/global/ui-tweaks/premium-logo.js';
window.YPP.FeatureManager.register(PremiumLogo);
import { SmartDownload } from '../features/player/enhancements/smart-download.js';
window.YPP.FeatureManager.register(SmartDownload);
import { ResumeBadges } from '../features/global/ui-tweaks/resume-badges.js';
window.YPP.FeatureManager.register(ResumeBadges);
import { SpeedBooster } from '../features/player/enhancements/speed-booster.js';
window.YPP.FeatureManager.register(SpeedBooster);

import { VideoSpeedController } from '../features/player/enhancements/video-speed-controller.js';
window.YPP.FeatureManager.register(VideoSpeedController);
import { AudioEQ } from '../features/player/media-effects/audio-eq.js';
window.YPP.FeatureManager.register(AudioEQ);
import { AutoTranscript } from '../features/player/automation/auto-transcript.js';
window.YPP.FeatureManager.register(AutoTranscript);
import { StatsForNerds } from '../features/player/automation/stats-for-nerds.js';
window.YPP.FeatureManager.register(StatsForNerds);
import { MiniPlayerScroll } from '../features/player/automation/mini-player-scroll.js';
window.YPP.FeatureManager.register(MiniPlayerScroll);
import { VSCAudioSupport } from '../features/player/enhancements/vsc-audio-support.js';
window.YPP.FeatureManager.register(VSCAudioSupport);
import { VSCHideByDefault } from '../features/player/enhancements/vsc-hide-by-default.js';
window.YPP.FeatureManager.register(VSCHideByDefault);
import { VSCForceSpeed } from '../features/player/enhancements/vsc-force-speed.js';
window.YPP.FeatureManager.register(VSCForceSpeed);
window.YPP.FeatureManager.register(VSCForceSpeed);
import { VSCRememberSpeed } from '../features/player/enhancements/vsc-remember-speed.js';
window.YPP.FeatureManager.register(VSCRememberSpeed);

import { FloatingPlayer } from '../features/player/controls/floating-player.js';
window.YPP.FeatureManager.register(FloatingPlayer);
import '../features/player/media-effects/video-filters/video-filters-presets.js';
import '../features/player/media-effects/video-filters/video-filters-overlay.js';
import '../features/player/media-effects/video-filters/video-filters-ui.js';
import { VideoFilters } from '../features/player/media-effects/video-filters/video-filters.js';
window.YPP.FeatureManager.register(VideoFilters);
import '../features/player/media-effects/volume-booster/volume-booster-ui.js';
import { VolumeBooster } from '../features/player/media-effects/volume-booster/volume-booster.js';
window.YPP.FeatureManager.register(VolumeBooster);
import { AutoQuality } from '../features/player/automation/auto-quality.js';
window.YPP.FeatureManager.register(AutoQuality);
import { TimeDisplay } from '../features/player/enhancements/time-display.js';
window.YPP.FeatureManager.register(TimeDisplay);
import { SponsorBlock } from '../features/player/automation/sponsor-block.js';
window.YPP.FeatureManager.register(SponsorBlock);
import { AdSkipper } from '../features/player/automation/ad-skipper.js';
window.YPP.FeatureManager.register(AdSkipper);
import { AmbientMode } from '../features/player/media-effects/ambient-mode/ambient-mode.js';
window.YPP.FeatureManager.register(AmbientMode);
import { AudioMode } from '../features/player/media-effects/ambient-mode/audio-mode.js';
window.YPP.FeatureManager.register(AudioMode);
import { VideoControls } from '../features/player/controls/video-controls.js';
window.YPP.FeatureManager.register(VideoControls);
import { ClassicProgressBar } from '../features/player/controls/classic-progress-bar.js';
window.YPP.FeatureManager.register(ClassicProgressBar);
import { WheelControls } from '../features/player/controls/wheel-controls.js';
window.YPP.FeatureManager.register(WheelControls);
import { AudioCompressor } from '../features/player/media-effects/audio-compressor.js';
window.YPP.FeatureManager.register(AudioCompressor);
import { VideoResumer } from '../features/player/automation/video-resumer.js';
window.YPP.FeatureManager.register(VideoResumer);
import { AutoPause } from '../features/player/automation/auto-pause.js';
window.YPP.FeatureManager.register(AutoPause);
import { AutoCinema } from '../features/player/automation/auto-cinema.js';
window.YPP.FeatureManager.register(AutoCinema);
import { AutoPiP } from '../features/player/automation/auto-pip.js';
window.YPP.FeatureManager.register(AutoPiP);
import '../features/player/controls/sidebar-layout.css';

// Feature Manager & Main entry
import '../core/system/feature-manager.js';
import './main.js';
