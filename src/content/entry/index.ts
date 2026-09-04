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

// The CSS is injected natively via MV3 content_scripts in manifest.json.
// However, Vite requires it to be imported here to build the CSS bundle.
import '../styles/base-ui-design/index.css';

// Managers (Phase 4.5)
import '../core/system/base-page-manager.js';
import '../features/ui-managers/thumbnail-color-manager.js';

// UI Architecture (Phase 4)
import '../features/ui-managers/ui-manager.js';
import '../components/buttons/button.js';
import '../components/panels/panel.js';

// Base feature class
import '../core/system/base-feature.js';

// Domains (Combined)
import { HomeOrganizer, CinematicMode } from '../pages/home/index.js';
import { PlaylistRedesign, PlaylistDuration, ReversePlaylist } from '../pages/playlist/index.js';
import '../pages/search/index.js';
import { MultiSelect, CopyLinkButton, CardPipeline, ChannelBlacklist, ChannelWhitelist, ChannelColumns, ResumeBadges, ShortsRemover, BaseFilterFeature, ScreenFilters, HideWatched, HideMetrics, DurationFilter, BlocklistFilter, FeedFilter, FiltersManager, ViewsFilter, UploadDateFilter, ClickbaitFilter, ShortsFilter, LiveFilter, MixesFilter, PlaylistsFilter, GridAnimator, AutoScaleGrid, FeedGridColumns } from '../pages/shared-feed/index.js';
import '../pages/shared-feed/index.js';
import { RedirectShorts, StopShortsLooping, ShortsAutoScroll, ShortsVolumeNormalizer } from '../pages/shorts/index.js';
import { SubscriptionsBar, ChannelHealth, TwoColumnSubscriptions, FilterBar, CustomDialog } from '../pages/subscriptions/index.js';
import { SplitScrolling, WatchHistoryTracker, SmartHistory, WatchTimeAlert, WatchTimeLimit, ContinueWatching, ZenMode, FocusMode, StudyMode, CommentFilter, WatchRedesign, InlineChannelButtons, AutoHideTopbar, SeamlessMode, PlayerBarUI, PlayerControls, SnapshotButton, LoopButton, AutoLike, BookmarksManager, IntentionalDelay, VideoSpeedController, AutoSubtitles, VSCAudioSupport, VSCHideByDefault, VSCForceSpeed, VSCRememberSpeed, AutoQuality, TimeDisplay, AmbientMode, AudioMode, VideoResumer, AutoPause, AutoCinema, AutoPiP, RealCinemaMode, LiveStreamTime, VideoFilters, VolumeBooster } from '../pages/watch/index.js';
import '../pages/watch/index.js';

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

window.YPP.FeatureManager.register(MultiSelect);

window.YPP.FeatureManager.register(CopyLinkButton);
import { KeyboardShortcuts } from '../core/events/keyboard-shortcuts.js';
window.YPP.FeatureManager.register(KeyboardShortcuts);

window.YPP.FeatureManager.register(CardPipeline);

window.YPP.FeatureManager.register(ChannelBlacklist);

window.YPP.FeatureManager.register(ChannelWhitelist);
import { HeaderNav } from '../features/navigation/header-nav.js';
window.YPP.FeatureManager.register(HeaderNav);

window.YPP.FeatureManager.register(ChannelColumns);
import { PremiumLogo } from '../features/ui-tweaks/premium-logo.js';
window.YPP.FeatureManager.register(PremiumLogo);

window.YPP.FeatureManager.register(ResumeBadges);
import { SaveSupremeUI } from '../features/ui-tweaks/save-supreme-ui.js';
window.YPP.FeatureManager.register(SaveSupremeUI);
import { CustomizeYouTubeUI } from '../features/ui-tweaks/customize-youtube-ui.js';
window.YPP.FeatureManager.register(CustomizeYouTubeUI);
import { ReduceAnimations } from '../features/performance/reduce-animations.js';
window.YPP.FeatureManager.register(ReduceAnimations);

// --- src/content/pages/home/index.ts ---

window.YPP.FeatureManager.register(HomeOrganizer);

window.YPP.FeatureManager.register(CinematicMode);

// --- src/content/pages/playlist/index.ts ---

window.YPP.FeatureManager.register(PlaylistRedesign);

window.YPP.FeatureManager.register(PlaylistDuration);

window.YPP.FeatureManager.register(ReversePlaylist);

// --- src/content/pages/search/index.ts ---

// --- src/content/pages/shorts/index.ts ---

window.YPP.FeatureManager.register(ShortsRemover);

window.YPP.FeatureManager.register(RedirectShorts);

window.YPP.FeatureManager.register(StopShortsLooping);

window.YPP.FeatureManager.register(ShortsAutoScroll);

window.YPP.FeatureManager.register(ShortsVolumeNormalizer);

// --- src/content/pages/subscriptions/index.ts ---

window.YPP.FeatureManager.register(SubscriptionsBar);

window.YPP.FeatureManager.register(ChannelHealth);

window.YPP.FeatureManager.register(TwoColumnSubscriptions);

window.YPP.FeatureManager.register(FilterBar);

window.YPP.FeatureManager.register(CustomDialog);

// --- src/content/pages/watch/index.ts ---

window.YPP.FeatureManager.register(SplitScrolling);

window.YPP.FeatureManager.register(WatchHistoryTracker);

window.YPP.FeatureManager.register(SmartHistory);

window.YPP.FeatureManager.register(WatchTimeAlert);

window.YPP.FeatureManager.register(WatchTimeLimit);

window.YPP.FeatureManager.register(ContinueWatching);

window.YPP.FeatureManager.register(ZenMode);

window.YPP.FeatureManager.register(FocusMode);

window.YPP.FeatureManager.register(StudyMode);

window.YPP.FeatureManager.register(CommentFilter);

window.YPP.FeatureManager.register(WatchRedesign);

window.YPP.FeatureManager.register(InlineChannelButtons);

window.YPP.FeatureManager.register(AutoHideTopbar);

window.YPP.FeatureManager.register(SeamlessMode);

window.YPP.features.PlayerBarUI = PlayerBarUI;

window.YPP.features.PlayerControls = PlayerControls;

window.YPP.FeatureManager.register(SnapshotButton);

window.YPP.FeatureManager.register(LoopButton);

window.YPP.FeatureManager.register(AutoLike);

window.YPP.FeatureManager.register(BookmarksManager);

window.YPP.FeatureManager.register(IntentionalDelay);

window.YPP.FeatureManager.register(VideoSpeedController);

AutoSubtitles._purgeOrphans();
window.YPP.FeatureManager.register(AutoSubtitles);

window.YPP.FeatureManager.register(VSCAudioSupport);

window.YPP.FeatureManager.register(VSCHideByDefault);

window.YPP.FeatureManager.register(VSCForceSpeed);

window.YPP.FeatureManager.register(VSCRememberSpeed);

import '../features/global-player-bar/domain/domain-memory-ui.js';
import { DomainMemory } from '../features/global-player-bar/domain/domain-memory.js';
window.YPP.FeatureManager.register(DomainMemory);

window.YPP.FeatureManager.register(AutoQuality);

window.YPP.FeatureManager.register(TimeDisplay);

window.YPP.FeatureManager.register(AmbientMode);

window.YPP.FeatureManager.register(AudioMode);

window.YPP.FeatureManager.register(VideoResumer);

window.YPP.FeatureManager.register(AutoPause);

window.YPP.FeatureManager.register(AutoCinema);

window.YPP.FeatureManager.register(AutoPiP);

window.YPP.FeatureManager.register(RealCinemaMode);

window.YPP.FeatureManager.register(LiveStreamTime);

// --- src/content/global/filters/index.ts ---

window.YPP.FeatureManager.register(BaseFilterFeature);

window.YPP.FeatureManager.register(ScreenFilters);

import { CleanMixUrls } from '../features/misc/clean-mix-urls.js';
window.YPP.FeatureManager.register(HideWatched);
window.YPP.FeatureManager.register(CleanMixUrls);

window.YPP.FeatureManager.register(HideMetrics);

window.YPP.FeatureManager.register(DurationFilter);

window.YPP.FeatureManager.register(BlocklistFilter);

window.YPP.FeatureManager.register(FeedFilter);

window.YPP.FeatureManager.register(FiltersManager);

window.YPP.FeatureManager.register(ViewsFilter);

window.YPP.FeatureManager.register(UploadDateFilter);

window.YPP.FeatureManager.register(ClickbaitFilter);

window.YPP.FeatureManager.register(ShortsFilter);

window.YPP.FeatureManager.register(LiveFilter);

window.YPP.FeatureManager.register(MixesFilter);

window.YPP.FeatureManager.register(PlaylistsFilter);

// --- src/content/global/layout/index.ts ---
import '../layouts/core/global-layout-manager.js';

window.YPP.FeatureManager.register(GridAnimator);

window.YPP.FeatureManager.register(AutoScaleGrid);
import { GridLayoutManager } from '../layouts/core/layout-manager.js';
window.YPP.FeatureManager.register(GridLayoutManager);

window.YPP.FeatureManager.register(FeedGridColumns);
import { TabviewSidebar } from '../layouts/core/tabview-sidebar.js';
window.YPP.FeatureManager.register(TabviewSidebar);

// --- src/content/global/ui/global-bar/index.ts ---
import { GlobalBarUI } from '../features/global-player-bar/ui/global-bar-ui.js';
window.YPP.FeatureManager.register(GlobalBarUI);
import { GlobalPlayerBar } from '../features/global-player-bar/core/global-player-bar.js';
window.YPP.FeatureManager.register(GlobalPlayerBar);

// --- src/content/pages/watch/player/media-effects/video-filters/index.js ---

window.YPP.FeatureManager.register(VideoFilters);

// --- src/content/pages/watch/player/media-effects/volume-booster/index.js ---

window.YPP.FeatureManager.register(VolumeBooster);

// Main entry
import './main.ts';
