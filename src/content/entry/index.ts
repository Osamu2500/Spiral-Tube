// Core dependencies
import '../../shared/config/constants.js';
import '../../shared/config/settings-schema.js';
import '../core/system/error-handler.js';
import '../core/dom/element-cache.js';
import '../../shared/utils/utils.js';
import '../core/utils/youtube-parsers.js';

import '../core/events/event-bus.js';
import '../core/dom/dom-api.js';
import '../core/dom/dom-observer.js';
import '../core/system/storage-manager.js';
import '../core/events/event-delegator.js';
import '../core/system/feature-manager.ts';

// CSS Imports
import '../styles/index.css';

// Managers (Phase 4.5)
import '../core/system/base-page-manager.js';
import '../styles/color/thumbnail-color-manager.js';

// UI Architecture (Phase 4)
import '../styles/managers/ui-manager.js';
import '../global/components/buttons/button.js';
import '../global/components/panels/panel.js';

// Base feature class
import '../core/system/base-feature.js';

// Domains (Combined)

// --- src/content/global/features/index.js ---
import '../global/features/navigation/hotkeys-manager.js';
import { ThemeManager } from '../global/features/ui-tweaks/theme.js';
window.YPP.FeatureManager.register(ThemeManager);
import '../global/features/account-menu/account-menu-data.js';
import '../global/features/account-menu/account-menu-ui.js';
import { AccountMenu } from '../global/features/account-menu/account-menu.js';
window.YPP.FeatureManager.register(AccountMenu);
import { HeaderButton } from '../global/features/navigation/header-button.js';
window.YPP.FeatureManager.register(HeaderButton);
import { CustomCursor } from '../global/features/misc/custom-cursor.js';
window.YPP.FeatureManager.register(CustomCursor);
import '../global/features/data/watched-store.js';
import { MultiSelect } from '../global/features/misc/multi-select.js';
window.YPP.FeatureManager.register(MultiSelect);
import { CopyLinkButton } from '../global/features/video-cards/copy-link.js';
window.YPP.FeatureManager.register(CopyLinkButton);
import { KeyboardShortcuts } from '../global/features/navigation/keyboard-shortcuts.js';
window.YPP.FeatureManager.register(KeyboardShortcuts);
import { CardPipeline } from '../global/features/video-cards/card-pipeline.js';
window.YPP.FeatureManager.register(CardPipeline);
import { ChannelBlacklist } from '../global/features/channel-filters/channel-blacklist.js';
window.YPP.FeatureManager.register(ChannelBlacklist);
import { ChannelWhitelist } from '../global/features/channel-filters/channel-whitelist.js';
window.YPP.FeatureManager.register(ChannelWhitelist);
import { HeaderNav } from '../global/features/navigation/header-nav.js';
window.YPP.FeatureManager.register(HeaderNav);
import { ChannelColumns } from '../global/features/video-cards/channel-columns.js';
window.YPP.FeatureManager.register(ChannelColumns);
import { PremiumLogo } from '../global/features/ui-tweaks/premium-logo.js';
window.YPP.FeatureManager.register(PremiumLogo);
import { ResumeBadges } from '../pages/shared-feed/tracking/resume-badges.js';
window.YPP.FeatureManager.register(ResumeBadges);
import { SaveSupremeUI } from '../global/features/ui-tweaks/save-supreme-ui.js';
window.YPP.FeatureManager.register(SaveSupremeUI);
import { CustomizeYouTubeUI } from '../global/features/ui-tweaks/customize-youtube-ui.js';
window.YPP.FeatureManager.register(CustomizeYouTubeUI);
import { CPUTamer } from '../global/features/performance/cpu-tamer.js';
window.YPP.FeatureManager.register(CPUTamer);
import { ReduceAnimations } from '../global/features/performance/reduce-animations.js';
window.YPP.FeatureManager.register(ReduceAnimations);

// --- src/content/pages/home/index.ts ---
import { HomeOrganizer } from '../pages/home/features/home-organizer.js';
window.YPP.FeatureManager.register(HomeOrganizer);
import { CinematicMode } from '../pages/home/layout/cinematic/cinematic-mode.js';
window.YPP.FeatureManager.register(CinematicMode);

// --- src/content/pages/playlist/index.ts ---
import { PlaylistRedesign } from '../pages/playlist/layout/playlist-redesign/playlist-redesign.js';
window.YPP.FeatureManager.register(PlaylistRedesign);
import { PlaylistDuration } from '../pages/playlist/features/duration-calculator.js';
window.YPP.FeatureManager.register(PlaylistDuration);
import { ReversePlaylist } from '../pages/playlist/features/reverse-playlist.js';
window.YPP.FeatureManager.register(ReversePlaylist);

// --- src/content/pages/search/index.ts ---
import { SearchViewMode } from '../pages/search/layout/search-view-mode.js';
window.YPP.FeatureManager.register(SearchViewMode);
import { SearchObserver } from '../pages/search/features/search-observer.js';
window.YPP.FeatureManager.register(SearchObserver);
import { SearchRedesign } from '../pages/search/layout/search-redesign.js';
window.YPP.FeatureManager.register(SearchRedesign);

// --- src/content/pages/shorts/index.ts ---
import { HideShorts } from '../pages/shorts/features/visibility/hide-shorts.js';
window.YPP.FeatureManager.register(HideShorts);
import { RedirectShorts } from '../pages/shorts/features/visibility/redirect-shorts.js';
window.YPP.FeatureManager.register(RedirectShorts);
import { StopShortsLooping } from '../pages/shorts/features/playback/stop-looping.js';
window.YPP.FeatureManager.register(StopShortsLooping);
import { ShortsAutoScroll } from '../pages/shorts/features/playback/auto-scroll.js';
window.YPP.FeatureManager.register(ShortsAutoScroll);
import { ShortsVolumeNormalizer } from '../pages/shorts/features/playback/volume-normalizer.js';
window.YPP.FeatureManager.register(ShortsVolumeNormalizer);

// --- src/content/pages/subscriptions/index.ts ---
import { ChannelHealth } from '../pages/subscriptions/features/channel-health/channel-health.js';
window.YPP.FeatureManager.register(ChannelHealth);
import { TwoColumnSubscriptions } from '../pages/subscriptions/features/grid-layout/two-column-subscriptions.js';
window.YPP.FeatureManager.register(TwoColumnSubscriptions);
import { FilterBar } from '../pages/subscriptions/declutter/filter-bar.js';
window.YPP.FeatureManager.register(FilterBar);
import { CustomDialog } from '../pages/subscriptions/features/channel-health/custom-dialog.js';
window.YPP.FeatureManager.register(CustomDialog);

// --- src/content/pages/watch/index.ts ---
import '../pages/watch/watch-manager.js';
import { SplitScrolling } from '../pages/watch/player/enhancements/split-scrolling.js';
window.YPP.FeatureManager.register(SplitScrolling);
import { WatchHistoryTracker } from '../pages/watch/features/history/watch-history.js';
window.YPP.FeatureManager.register(WatchHistoryTracker);
import { SmartHistory } from '../pages/watch/features/history/smart-history.js';
window.YPP.FeatureManager.register(SmartHistory);
import { WatchTimeAlert } from '../pages/watch/features/time-management/watch-time-alert.js';
window.YPP.FeatureManager.register(WatchTimeAlert);
import { WatchTimeLimit } from '../pages/watch/features/time-management/watch-time-limit.js';
window.YPP.FeatureManager.register(WatchTimeLimit);
import { ContinueWatching } from '../pages/watch/features/history/continue-watching.js';
window.YPP.FeatureManager.register(ContinueWatching);
import { ZenMode } from '../pages/watch/layout/zen-mode.js';
window.YPP.FeatureManager.register(ZenMode);
import { FocusMode } from '../pages/watch/layout/focus-mode.js';
window.YPP.FeatureManager.register(FocusMode);
import { StudyMode } from '../pages/watch/layout/study/study-mode.js';
window.YPP.FeatureManager.register(StudyMode);
import { CommentFilter } from '../pages/watch/comments/comment-filter.js';
window.YPP.FeatureManager.register(CommentFilter);
import { WatchRedesign } from '../pages/watch/layout/watch-redesign.js';
window.YPP.FeatureManager.register(WatchRedesign);
import { InlineChannelButtons } from '../pages/watch/features/ui-elements/inline-channel-buttons.js';
window.YPP.FeatureManager.register(InlineChannelButtons);
import { SeamlessMode } from '../pages/watch/layout/seamless/seamless-mode.js';
window.YPP.FeatureManager.register(SeamlessMode);
import { PlayerBarUI } from '../pages/watch/player/player-bar-ui.js';
window.YPP.features.PlayerBarUI = PlayerBarUI;
import { PlayerControls } from '../pages/watch/player/player-controls.js';
window.YPP.features.PlayerControls = PlayerControls;
import { SnapshotButton } from '../pages/watch/player/controls/snapshot-button.js';
window.YPP.FeatureManager.register(SnapshotButton);
import { LoopButton } from '../pages/watch/player/controls/loop-button.js';
window.YPP.FeatureManager.register(LoopButton);
import { PlayerSettingsMenu } from '../pages/watch/player/player-settings-menu.js';
window.YPP.features.PlayerSettingsMenu = PlayerSettingsMenu;
import '../pages/watch/player/filter-presets.js';
import { PlayerTools } from '../pages/watch/player/controls/player-tools.js';
window.YPP.FeatureManager.register(PlayerTools);
import { AutoLike } from '../pages/watch/player/automation/auto-like/auto-like.js';
window.YPP.FeatureManager.register(AutoLike);
import { BookmarksManager } from '../pages/watch/player/controls/bookmarks.js';
window.YPP.FeatureManager.register(BookmarksManager);
import { IntentionalDelay } from '../pages/watch/player/enhancements/intentional-delay.js';
window.YPP.FeatureManager.register(IntentionalDelay);
import { VideoSpeedController } from '../pages/watch/player/enhancements/video-speed-controller/video-speed-controller.js';
window.YPP.FeatureManager.register(VideoSpeedController);
import { AudioEQ } from '../pages/watch/player/media-effects/audio-eq.js';
window.YPP.FeatureManager.register(AudioEQ);
import { AutoSubtitles } from '../pages/watch/player/automation/auto-subtitles/auto-subtitles.js';
AutoSubtitles._purgeOrphans();
window.YPP.FeatureManager.register(AutoSubtitles);
import { AutoTranscript } from '../pages/watch/player/automation/auto-transcript/auto-transcript.js';
window.YPP.FeatureManager.register(AutoTranscript);
import { MiniPlayerScroll } from '../pages/watch/player/automation/mini-player-scroll/mini-player-scroll.js';
window.YPP.FeatureManager.register(MiniPlayerScroll);
import { VSCAudioSupport } from '../pages/watch/player/enhancements/video-speed-controller/vsc-audio-support.js';
window.YPP.FeatureManager.register(VSCAudioSupport);
import { VSCHideByDefault } from '../pages/watch/player/enhancements/video-speed-controller/vsc-hide-by-default.js';
window.YPP.FeatureManager.register(VSCHideByDefault);
import { VSCForceSpeed } from '../pages/watch/player/enhancements/video-speed-controller/vsc-force-speed.js';
window.YPP.FeatureManager.register(VSCForceSpeed);
import { VSCRememberSpeed } from '../pages/watch/player/enhancements/video-speed-controller/vsc-remember-speed.js';
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
import { AutoQuality } from '../pages/watch/player/automation/auto-quality/auto-quality.js';
window.YPP.FeatureManager.register(AutoQuality);
import { TimeDisplay } from '../pages/watch/player/enhancements/time-display.js';
window.YPP.FeatureManager.register(TimeDisplay);
import { AdSkipper } from '../pages/watch/player/automation/ad-skipper/ad-skipper.js';
window.YPP.FeatureManager.register(AdSkipper);
import { AmbientMode } from '../pages/watch/player/media-effects/ambient-mode/ambient-mode.js';
window.YPP.FeatureManager.register(AmbientMode);
import { AudioMode } from '../pages/watch/player/media-effects/ambient-mode/audio-mode.js';
window.YPP.FeatureManager.register(AudioMode);
import { ClassicProgressBar } from '../pages/watch/player/controls/classic-progress-bar.js';
window.YPP.FeatureManager.register(ClassicProgressBar);
import { VideoResumer } from '../pages/watch/player/automation/video-resumer/video-resumer.js';
window.YPP.FeatureManager.register(VideoResumer);
import { AutoPause } from '../pages/watch/player/automation/auto-pause/auto-pause.js';
window.YPP.FeatureManager.register(AutoPause);
import { AutoCinema } from '../pages/watch/player/automation/auto-cinema/auto-cinema.js';
window.YPP.FeatureManager.register(AutoCinema);
import { AutoPiP } from '../pages/watch/player/automation/auto-pip/auto-pip.js';
window.YPP.FeatureManager.register(AutoPiP);
import { RealCinemaMode } from '../pages/watch/player/enhancements/real-cinema-mode.js';
window.YPP.FeatureManager.register(RealCinemaMode);
import { LiveStreamTime } from '../pages/watch/player/enhancements/live-stream-time.js';
window.YPP.FeatureManager.register(LiveStreamTime);



// --- src/content/global/filters/index.ts ---
import { BaseFilterFeature } from '../global/filters/base-filter-feature.js';
window.YPP.FeatureManager.register(BaseFilterFeature);
import { ScreenFilters } from '../global/filters/screen-filters.js';
window.YPP.FeatureManager.register(ScreenFilters);
import { HideWatched } from '../global/filters/hide-watched.js';
window.YPP.FeatureManager.register(HideWatched);
import { HideMetrics } from '../global/filters/hide-metrics.js';
window.YPP.FeatureManager.register(HideMetrics);
import '../global/filters/filter-ui-interactions.js';
import { DurationFilter } from '../global/filters/duration-filter.js';
window.YPP.FeatureManager.register(DurationFilter);
import { BlocklistFilter } from '../global/filters/blocklist-filter.js';
window.YPP.FeatureManager.register(BlocklistFilter);
import { FeedFilter } from '../global/filters/feed-filter.js';
window.YPP.FeatureManager.register(FeedFilter);
import { FiltersManager } from '../global/filters/filters-manager.js';
window.YPP.FeatureManager.register(FiltersManager);
import { ViewsFilter } from '../global/filters/views-filter.js';
window.YPP.FeatureManager.register(ViewsFilter);
import { UploadDateFilter } from '../global/filters/upload-date-filter.js';
window.YPP.FeatureManager.register(UploadDateFilter);
import { ClickbaitFilter } from '../global/filters/clickbait-filter.js';
window.YPP.FeatureManager.register(ClickbaitFilter);

// --- src/content/global/layout/index.ts ---
import '../global/layout/global-layout-manager.js';
import { GridAnimator } from '../global/layout/grid-animator.js';
window.YPP.FeatureManager.register(GridAnimator);
import { AutoScaleGrid } from '../global/layout/auto-scale-grid.js';
window.YPP.FeatureManager.register(AutoScaleGrid);
import { GridLayoutManager } from '../global/layout/layout-manager.js';
window.YPP.FeatureManager.register(GridLayoutManager);
import { FeedGridColumns } from '../global/layout/feed-grid-columns.js';
window.YPP.FeatureManager.register(FeedGridColumns);
import { TabviewSidebar } from '../global/layout/tabview-sidebar.js';
window.YPP.FeatureManager.register(TabviewSidebar);
import { StarTubeLayout } from '../global/layout/startube-layout.js';
window.YPP.FeatureManager.register(StarTubeLayout);

// --- src/content/global/ui/global-bar/index.ts ---
import { GlobalBarUI } from '../global/ui/global-bar/global-bar-ui.js';
window.YPP.FeatureManager.register(GlobalBarUI);
import { GlobalPlayerBar } from '../global/ui/global-bar/global-bar.js';
window.YPP.FeatureManager.register(GlobalPlayerBar);

// --- src/content/pages/watch/player/media-effects/video-filters/index.js ---
import '../pages/watch/player/media-effects/video-filters/video-filters-presets.js';
import '../pages/watch/player/media-effects/video-filters/video-filters-ui.js';
import '../pages/watch/player/media-effects/video-filters/video-filters-overlay.js';
import '../pages/watch/player/media-effects/video-filters/video-filters.js';

// --- src/content/pages/watch/player/media-effects/volume-booster/index.js ---
import '../pages/watch/player/media-effects/volume-booster/volume-booster-ui.js';
import '../pages/watch/player/media-effects/volume-booster/volume-booster.js';


// Main entry
import './main.ts';
