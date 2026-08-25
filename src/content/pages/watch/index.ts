/**
 * @fileoverview
 * Watch Page Features Index
 * 
 * Target: /watch route.
 * Purpose: Registers all watch-specific features, layouts, and player components 
 * with the FeatureManager so they can be instantiated when needed.
 * 
 * This file is purely for registration and does not execute standalone logic.
 */

import './watch-manager.js';

import { SplitScrolling } from './player/enhancements/split-scrolling.js';
window.YPP.FeatureManager.register(SplitScrolling);

import { WatchHistoryTracker } from './features/history/watch-history.js';
window.YPP.FeatureManager.register(WatchHistoryTracker);

import { SmartHistory } from './features/history/smart-history.js';
window.YPP.FeatureManager.register(SmartHistory);

import { WatchTimeAlert } from './features/time-management/watch-time-alert.js';
window.YPP.FeatureManager.register(WatchTimeAlert);

import { WatchTimeLimit } from './features/time-management/watch-time-limit.js';
window.YPP.FeatureManager.register(WatchTimeLimit);

import { ContinueWatching } from './features/history/continue-watching.js';
window.YPP.FeatureManager.register(ContinueWatching);

import { ZenMode } from './layout/zen-mode.js';
window.YPP.FeatureManager.register(ZenMode);

import { FocusMode } from './layout/focus-mode.js';
window.YPP.FeatureManager.register(FocusMode);

import { StudyMode } from './layout/study/study-mode.js';
window.YPP.FeatureManager.register(StudyMode);

import { CommentFilter } from './comments/comment-filter.js';
window.YPP.FeatureManager.register(CommentFilter);

import { WatchRedesign } from './layout/watch-redesign.js';
window.YPP.FeatureManager.register(WatchRedesign);

import { InlineChannelButtons } from './features/ui-elements/inline-channel-buttons.js';
window.YPP.FeatureManager.register(InlineChannelButtons);

import { SeamlessMode } from './layout/seamless/seamless-mode.js';
window.YPP.FeatureManager.register(SeamlessMode);

import { PlayerBarUI } from './player/player-bar-ui.js';
window.YPP.features.PlayerBarUI = PlayerBarUI;

import { PlayerControls } from './player/player-controls.js';
window.YPP.features.PlayerControls = PlayerControls;

import { SnapshotButton } from './player/controls/snapshot-button.js';
window.YPP.FeatureManager.register(SnapshotButton);

import { LoopButton } from './player/controls/loop-button.js';
window.YPP.FeatureManager.register(LoopButton);

import { PlayerSettingsMenu } from './player/player-settings-menu.js';
window.YPP.features.PlayerSettingsMenu = PlayerSettingsMenu;

import './player/filter-presets.js';

import { PlayerTools } from './player/controls/player-tools.js';
window.YPP.FeatureManager.register(PlayerTools);

import { AutoLike } from './player/automation/auto-like/auto-like.js';
window.YPP.FeatureManager.register(AutoLike);

import { BookmarksManager } from './player/controls/bookmarks.js';
window.YPP.FeatureManager.register(BookmarksManager);

import { IntentionalDelay } from './player/enhancements/intentional-delay.js';
window.YPP.FeatureManager.register(IntentionalDelay);

import { VideoSpeedController } from './player/enhancements/video-speed-controller/video-speed-controller.js';
window.YPP.FeatureManager.register(VideoSpeedController);

import { AudioEQ } from './player/media-effects/audio-eq.js';
window.YPP.FeatureManager.register(AudioEQ);

import { AutoSubtitles } from './player/automation/auto-subtitles/auto-subtitles.js';
AutoSubtitles._purgeOrphans();
window.YPP.FeatureManager.register(AutoSubtitles);

import { AutoTranscript } from './player/automation/auto-transcript/auto-transcript.js';
window.YPP.FeatureManager.register(AutoTranscript);

import { MiniPlayerScroll } from './player/automation/mini-player-scroll/mini-player-scroll.js';
window.YPP.FeatureManager.register(MiniPlayerScroll);

import { VSCAudioSupport } from './player/enhancements/video-speed-controller/vsc-audio-support.js';
window.YPP.FeatureManager.register(VSCAudioSupport);

import { VSCHideByDefault } from './player/enhancements/video-speed-controller/vsc-hide-by-default.js';
window.YPP.FeatureManager.register(VSCHideByDefault);

import { VSCForceSpeed } from './player/enhancements/video-speed-controller/vsc-force-speed.js';
window.YPP.FeatureManager.register(VSCForceSpeed);

import { VSCRememberSpeed } from './player/enhancements/video-speed-controller/vsc-remember-speed.js';
window.YPP.FeatureManager.register(VSCRememberSpeed);

import './player/media-effects/video-filters/video-filters-presets.js';
import './player/media-effects/video-filters/video-filters-overlay.js';
import './player/media-effects/video-filters/video-filters-ui.js';

import { VideoFilters } from './player/media-effects/video-filters/video-filters.js';
window.YPP.FeatureManager.register(VideoFilters);

import './player/media-effects/volume-booster/volume-booster-ui.js';
import { VolumeBooster } from './player/media-effects/volume-booster/volume-booster.js';
window.YPP.FeatureManager.register(VolumeBooster);

import './player/domain-memory-ui.js';
import { DomainMemory } from './player/domain-memory.js';
window.YPP.FeatureManager.register(DomainMemory);

import { AutoQuality } from './player/automation/auto-quality/auto-quality.js';
window.YPP.FeatureManager.register(AutoQuality);

import { TimeDisplay } from './player/enhancements/time-display.js';
window.YPP.FeatureManager.register(TimeDisplay);

import { AdSkipper } from './player/automation/ad-skipper/ad-skipper.js';
window.YPP.FeatureManager.register(AdSkipper);

import { AmbientMode } from './player/media-effects/ambient-mode/ambient-mode.js';
window.YPP.FeatureManager.register(AmbientMode);

import { AudioMode } from './player/media-effects/ambient-mode/audio-mode.js';
window.YPP.FeatureManager.register(AudioMode);

import { ClassicProgressBar } from './player/controls/classic-progress-bar.js';
window.YPP.FeatureManager.register(ClassicProgressBar);

import { VideoResumer } from './player/automation/video-resumer/video-resumer.js';
window.YPP.FeatureManager.register(VideoResumer);

import { AutoPause } from './player/automation/auto-pause/auto-pause.js';
window.YPP.FeatureManager.register(AutoPause);

import { AutoCinema } from './player/automation/auto-cinema/auto-cinema.js';
window.YPP.FeatureManager.register(AutoCinema);

import { AutoPiP } from './player/automation/auto-pip/auto-pip.js';
window.YPP.FeatureManager.register(AutoPiP);

import { RealCinemaMode } from './player/enhancements/real-cinema-mode.js';
window.YPP.FeatureManager.register(RealCinemaMode);

import { LiveStreamTime } from './player/enhancements/live-stream-time.js';
window.YPP.FeatureManager.register(LiveStreamTime);
