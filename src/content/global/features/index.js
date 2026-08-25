import './navigation/hotkeys-manager.js';

import { ThemeManager } from './ui-tweaks/theme.js';
window.YPP.FeatureManager.register(ThemeManager);

import './account-menu/account-menu-data.js';
import './account-menu/account-menu-ui.js';
import { AccountMenu } from './account-menu/account-menu.js';
window.YPP.FeatureManager.register(AccountMenu);

import { HeaderButton } from './navigation/header-button.js';
window.YPP.FeatureManager.register(HeaderButton);

import { CustomCursor } from './misc/custom-cursor.js';
window.YPP.FeatureManager.register(CustomCursor);

import './data/watched-store.js';

import { MultiSelect } from './misc/multi-select.js';
window.YPP.FeatureManager.register(MultiSelect);

import { CopyLinkButton } from './video-cards/copy-link.js';
window.YPP.FeatureManager.register(CopyLinkButton);

import { KeyboardShortcuts } from './navigation/keyboard-shortcuts.js';
window.YPP.FeatureManager.register(KeyboardShortcuts);

import { CardPipeline } from './video-cards/card-pipeline.js';
window.YPP.FeatureManager.register(CardPipeline);

import { ChannelBlacklist } from './channel-filters/channel-blacklist.js';
window.YPP.FeatureManager.register(ChannelBlacklist);

import { ChannelWhitelist } from './channel-filters/channel-whitelist.js';
window.YPP.FeatureManager.register(ChannelWhitelist);

import { HeaderNav } from './navigation/header-nav.js';
window.YPP.FeatureManager.register(HeaderNav);

import { ChannelColumns } from './video-cards/channel-columns.js';
window.YPP.FeatureManager.register(ChannelColumns);

import { PremiumLogo } from './ui-tweaks/premium-logo.js';
window.YPP.FeatureManager.register(PremiumLogo);

import { ResumeBadges } from '../../pages/shared-feed/tracking/resume-badges.js';
window.YPP.FeatureManager.register(ResumeBadges);

import { SaveSupremeUI } from './ui-tweaks/save-supreme-ui.js';
window.YPP.FeatureManager.register(SaveSupremeUI);

import { CustomizeYouTubeUI } from './ui-tweaks/customize-youtube-ui.js';
window.YPP.FeatureManager.register(CustomizeYouTubeUI);

import { CPUTamer } from './performance/cpu-tamer.js';
window.YPP.FeatureManager.register(CPUTamer);

import { ReduceAnimations } from './performance/reduce-animations.js';
window.YPP.FeatureManager.register(ReduceAnimations);
