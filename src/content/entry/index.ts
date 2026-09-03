// Core dependencies
import '../../shared/config/constants/index.js';
import '../../shared/config/settings-schema.js';
import '../core/system/error-handler.js';
import '../core/dom/element-cache.js';
import '../../shared/utils/index.js';
import '../core/utils/youtube-parsers.js';

import '../core/events/event-bus.js';
import '../core/dom/dom-api.js';
import '../core/dom/dom-observer.ts';
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
import '../components/buttons/button.js';
import '../components/panels/panel.js';

// Base feature class
import '../core/system/base-feature.js';

// Domains (Combined)

// --- src/content/global/features/index.js ---
import '../core/events/hotkeys-manager.js';
import { ThemeManager } from '../features/ui-tweaks/theme.js';
window.YPP.FeatureManager.register(ThemeManager);
import '../components/account-menus/account-menu-data.js';
import '../components/account-menus/account-menu-ui.js';
import { AccountMenu } from '../components/account-menus/account-menu.js';
window.YPP.FeatureManager.register(AccountMenu);
import { HeaderButton } from '../features/navigation/header-button.js';
window.YPP.FeatureManager.register(HeaderButton);

import '../core/data/watched-store.js';
import { MultiSelect } from '../pages/shared-feed/features/multi-select/multi-select.js';
window.YPP.FeatureManager.register(MultiSelect);
import { CopyLinkButton } from '../pages/shared-feed/components/video-cards/copy-link.js';
window.YPP.FeatureManager.register(CopyLinkButton);
import { KeyboardShortcuts } from '../core/events/keyboard-shortcuts.js';
window.YPP.FeatureManager.register(KeyboardShortcuts);
import { CardPipeline } from '../pages/shared-feed/components/video-cards/card-pipeline.js';
window.YPP.FeatureManager.register(CardPipeline);
import { ChannelBlacklist } from '../pages/shared-feed/features/channel-filters/channel-blacklist.js';
window.YPP.FeatureManager.register(ChannelBlacklist);
import { ChannelWhitelist } from '../pages/shared-feed/features/channel-filters/channel-whitelist.js';
window.YPP.FeatureManager.register(ChannelWhitelist);
import { HeaderNav } from '../features/navigation/header-nav.js';
window.YPP.FeatureManager.register(HeaderNav);
import { ChannelColumns } from '../pages/shared-feed/components/video-cards/channel-columns.js';
window.YPP.FeatureManager.register(ChannelColumns);
import { PremiumLogo } from '../features/ui-tweaks/premium-logo.js';
window.YPP.FeatureManager.register(PremiumLogo);
import { ResumeBadges } from '../pages/shared-feed/tracking/resume-badges.js';
window.YPP.FeatureManager.register(ResumeBadges);
import { SaveSupremeUI } from '../features/ui-tweaks/save-supreme-ui.js';
window.YPP.FeatureManager.register(SaveSupremeUI);
import { CustomizeYouTubeUI } from '../features/ui-tweaks/customize-youtube-ui.js';
window.YPP.FeatureManager.register(CustomizeYouTubeUI);
import { ReduceAnimations } from '../features/performance/reduce-animations.js';
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
import '../pages/search/search-manager.js';

// --- src/content/pages/shorts/index.ts ---
import { ShortsRemover } from '../pages/shared-feed/filters/shorts-remover.js';
window.YPP.FeatureManager.register(ShortsRemover);
import { RedirectShorts } from '../pages/shorts/features/visibility/redirect-shorts.js';
window.YPP.FeatureManager.register(RedirectShorts);
import { StopShortsLooping } from '../pages/shorts/features/playback/stop-looping.js';
window.YPP.FeatureManager.register(StopShortsLooping);
import { ShortsAutoScroll } from '../pages/shorts/features/playback/auto-scroll.js';
window.YPP.FeatureManager.register(ShortsAutoScroll);
import { ShortsVolumeNormalizer } from '../pages/shorts/features/playback/volume-normalizer.js';
window.YPP.FeatureManager.register(ShortsVolumeNormalizer);

// --- src/content/pages/subscriptions/index.ts ---
import { SubscriptionsBar } from '../pages/subscriptions/layout/subscriptions-bar.js';
window.YPP.FeatureManager.register(SubscriptionsBar);
import { ChannelHealth } from '../pages/subscriptions/features/channel-health/channel-health.js';
window.YPP.FeatureManager.register(ChannelHealth);
import { TwoColumnSubscriptions } from '../pages/subscriptions/features/grid-layout/two-column-subscriptions.js';
window.YPP.FeatureManager.register(TwoColumnSubscriptions);
import { FilterBar } from '../pages/subscriptions/declutter/filter-bar.js';
window.YPP.FeatureManager.register(FilterBar);
import { CustomDialog } from '../pages/subscriptions/features/channel-health/custom-dialog.js';
window.YPP.FeatureManager.register(CustomDialog);

// --- src/content/pages/watch/index.ts ---
import '../pages/watch/core/watch-manager.js';
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
import { ZenMode } from '../pages/watch/layouts/modes/zen-mode.js';
window.YPP.FeatureManager.register(ZenMode);
import { FocusMode } from '../pages/watch/layouts/modes/focus-mode.js';
window.YPP.FeatureManager.register(FocusMode);
import { StudyMode } from '../pages/watch/layouts/study-mode/study-mode.js';
window.YPP.FeatureManager.register(StudyMode);
import { CommentFilter } from '../pages/watch/components/comments/comment-filter.js';
window.YPP.FeatureManager.register(CommentFilter);
import { WatchRedesign } from '../pages/watch/layouts/modes/watch-redesign.js';
window.YPP.FeatureManager.register(WatchRedesign);
import { InlineChannelButtons } from '../pages/watch/features/ui-tweaks/inline-channel-buttons.js';
window.YPP.FeatureManager.register(InlineChannelButtons);
import { AutoHideTopbar } from '../pages/watch/features/ui-tweaks/auto-hide-topbar.js';
window.YPP.FeatureManager.register(AutoHideTopbar);
import { SeamlessMode } from '../pages/watch/layouts/seamless-mode/seamless-mode.js';
window.YPP.FeatureManager.register(SeamlessMode);
import { PlayerBarUI } from '../pages/watch/player/core/player-bar-ui.js';
window.YPP.features.PlayerBarUI = PlayerBarUI;
import { PlayerControls } from '../pages/watch/player/core/player-controls.js';
window.YPP.features.PlayerControls = PlayerControls;
import { SnapshotButton } from '../pages/watch/player/controls/snapshot-button.js';
window.YPP.FeatureManager.register(SnapshotButton);
import { LoopButton } from '../pages/watch/player/controls/loop-button.js';
window.YPP.FeatureManager.register(LoopButton);
import '../pages/watch/player/utils/filter-presets.js';
import { AutoLike } from '../pages/watch/player/automation/auto-like/auto-like.js';
window.YPP.FeatureManager.register(AutoLike);
import { BookmarksManager } from '../pages/watch/player/controls/bookmarks.js';
window.YPP.FeatureManager.register(BookmarksManager);
import { IntentionalDelay } from '../pages/watch/player/enhancements/intentional-delay.js';
window.YPP.FeatureManager.register(IntentionalDelay);
import { VideoSpeedController } from '../pages/watch/player/enhancements/video-speed-controller/video-speed-controller.js';
window.YPP.FeatureManager.register(VideoSpeedController);

import { AutoSubtitles } from '../pages/watch/player/automation/auto-subtitles/auto-subtitles.js';
AutoSubtitles._purgeOrphans();
window.YPP.FeatureManager.register(AutoSubtitles);


import { VSCAudioSupport } from '../pages/watch/player/enhancements/video-speed-controller/vsc-audio-support.js';
window.YPP.FeatureManager.register(VSCAudioSupport);
import { VSCHideByDefault } from '../pages/watch/player/enhancements/video-speed-controller/vsc-hide-by-default.js';
window.YPP.FeatureManager.register(VSCHideByDefault);
import { VSCForceSpeed } from '../pages/watch/player/enhancements/video-speed-controller/vsc-force-speed.js';
window.YPP.FeatureManager.register(VSCForceSpeed);
import { VSCRememberSpeed } from '../pages/watch/player/enhancements/video-speed-controller/vsc-remember-speed.js';
window.YPP.FeatureManager.register(VSCRememberSpeed);

import '../pages/watch/player/utils/domain-memory-ui.js';
import { DomainMemory } from '../pages/watch/player/utils/domain-memory.js';
window.YPP.FeatureManager.register(DomainMemory);
import { AutoQuality } from '../pages/watch/player/automation/auto-quality/auto-quality.js';
window.YPP.FeatureManager.register(AutoQuality);
import { TimeDisplay } from '../pages/watch/player/enhancements/time-display.js';
window.YPP.FeatureManager.register(TimeDisplay);

import { AmbientMode } from '../pages/watch/player/media-effects/ambient-mode/ambient-mode.js';
window.YPP.FeatureManager.register(AmbientMode);
import { AudioMode } from '../pages/watch/player/media-effects/ambient-mode/audio-mode.js';
window.YPP.FeatureManager.register(AudioMode);

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
import { BaseFilterFeature } from '../pages/shared-feed/filters/base-filter-feature.js';
window.YPP.FeatureManager.register(BaseFilterFeature);
import { ScreenFilters } from '../pages/shared-feed/filters/screen-filters.js';
window.YPP.FeatureManager.register(ScreenFilters);
import { HideWatched } from '../pages/shared-feed/filters/hide-watched.js';
import { CleanMixUrls } from '../features/misc/clean-mix-urls.js';
window.YPP.FeatureManager.register(HideWatched);
window.YPP.FeatureManager.register(CleanMixUrls);
import { HideMetrics } from '../pages/shared-feed/filters/hide-metrics.js';
window.YPP.FeatureManager.register(HideMetrics);
import '../pages/shared-feed/filters/filter-ui-interactions.js';
import { DurationFilter } from '../pages/shared-feed/filters/duration-filter.js';
window.YPP.FeatureManager.register(DurationFilter);
import { BlocklistFilter } from '../pages/shared-feed/filters/blocklist-filter.js';
window.YPP.FeatureManager.register(BlocklistFilter);
import { FeedFilter } from '../pages/shared-feed/filters/feed-filter.js';
window.YPP.FeatureManager.register(FeedFilter);
import { FiltersManager } from '../pages/shared-feed/filters/filters-manager.js';
window.YPP.FeatureManager.register(FiltersManager);
import { ViewsFilter } from '../pages/shared-feed/filters/views-filter.js';
window.YPP.FeatureManager.register(ViewsFilter);
import { UploadDateFilter } from '../pages/shared-feed/filters/upload-date-filter.js';
window.YPP.FeatureManager.register(UploadDateFilter);
import { ClickbaitFilter } from '../pages/shared-feed/filters/clickbait-filter.js';
window.YPP.FeatureManager.register(ClickbaitFilter);
import { ShortsFilter } from '../pages/shared-feed/filters/shorts-filter.js';
window.YPP.FeatureManager.register(ShortsFilter);
import { LiveFilter } from '../pages/shared-feed/filters/live-filter.js';
window.YPP.FeatureManager.register(LiveFilter);
import { MixesFilter } from '../pages/shared-feed/filters/mixes-filter.js';
window.YPP.FeatureManager.register(MixesFilter);
import { PlaylistsFilter } from '../pages/shared-feed/filters/playlists-filter.js';
window.YPP.FeatureManager.register(PlaylistsFilter);

// --- src/content/global/layout/index.ts ---
import '../layouts/core/global-layout-manager.js';
import { GridAnimator } from '../pages/shared-feed/layout/grid-animator.js';
window.YPP.FeatureManager.register(GridAnimator);
import { AutoScaleGrid } from '../pages/shared-feed/layout/auto-scale-grid.js';
window.YPP.FeatureManager.register(AutoScaleGrid);
import { GridLayoutManager } from '../layouts/core/layout-manager.js';
window.YPP.FeatureManager.register(GridLayoutManager);
import { FeedGridColumns } from '../pages/shared-feed/layout/feed-grid-columns.js';
window.YPP.FeatureManager.register(FeedGridColumns);
import { TabviewSidebar } from '../layouts/core/tabview-sidebar.js';
window.YPP.FeatureManager.register(TabviewSidebar);

// --- src/content/global/ui/global-bar/index.ts ---
import { GlobalBarUI } from '../features/global-bar/global-bar-ui.js';
window.YPP.FeatureManager.register(GlobalBarUI);
import { GlobalPlayerBar } from '../features/global-bar/global-bar.js';
window.YPP.FeatureManager.register(GlobalPlayerBar);

// --- src/content/pages/watch/player/media-effects/video-filters/index.js ---
import '../pages/watch/player/media-effects/video-filters/video-filters-presets.js';
import '../pages/watch/player/media-effects/video-filters/video-filters-ui.js';
import '../pages/watch/player/media-effects/video-filters/video-filters-overlay.js';
import { VideoFilters } from '../pages/watch/player/media-effects/video-filters/video-filters.js';
window.YPP.FeatureManager.register(VideoFilters);
import '../pages/watch/player/media-effects/video-filters/video-filters.css';

// --- src/content/pages/watch/player/media-effects/volume-booster/index.js ---
import '../pages/watch/player/media-effects/volume-booster/volume-booster-ui.js';
import { VolumeBooster } from '../pages/watch/player/media-effects/volume-booster/volume-booster.js';
window.YPP.FeatureManager.register(VolumeBooster);
import '../pages/watch/player/media-effects/volume-booster/volume-booster.css';


// Main entry
import './main.ts';
