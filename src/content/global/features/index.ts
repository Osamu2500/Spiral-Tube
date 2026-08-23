import './hotkeys-manager.js';

import { ThemeManager } from './theme.js';
window.YPP.FeatureManager.register(ThemeManager);

import './account-menu-data.js';
import './account-menu-ui.js';
import { AccountMenu } from './account-menu.js';
window.YPP.FeatureManager.register(AccountMenu);

import { HeaderButton } from './header-button.js';
window.YPP.FeatureManager.register(HeaderButton);

import { CustomCursor } from './custom-cursor.js';
window.YPP.FeatureManager.register(CustomCursor);

import './watched-store.js';

import { MultiSelect } from './multi-select.js';
window.YPP.FeatureManager.register(MultiSelect);

import { CopyLinkButton } from './copy-link.js';
window.YPP.FeatureManager.register(CopyLinkButton);

import { KeyboardShortcuts } from './keyboard-shortcuts.js';
window.YPP.FeatureManager.register(KeyboardShortcuts);

import { CardPipeline } from './card-pipeline.js';
window.YPP.FeatureManager.register(CardPipeline);

import { ChannelBlacklist } from './channel-blacklist.js';
window.YPP.FeatureManager.register(ChannelBlacklist);

import { ChannelWhitelist } from './channel-whitelist.js';
window.YPP.FeatureManager.register(ChannelWhitelist);

import { HeaderNav } from './header-nav.js';
window.YPP.FeatureManager.register(HeaderNav);

import { ChannelColumns } from './channel-columns.js';
window.YPP.FeatureManager.register(ChannelColumns);

import { PremiumLogo } from './premium-logo.js';
window.YPP.FeatureManager.register(PremiumLogo);

import { ResumeBadges } from './resume-badges.js';
window.YPP.FeatureManager.register(ResumeBadges);

import { SaveSupremeUI } from './save-supreme-ui.js';
window.YPP.FeatureManager.register(SaveSupremeUI);

import { CustomizeYouTubeUI } from './customize-youtube-ui.js';
window.YPP.FeatureManager.register(CustomizeYouTubeUI);

import { CPUTamer } from './cpu-tamer.js';
window.YPP.FeatureManager.register(CPUTamer);

import { ReduceAnimations } from './reduce-animations.js';
window.YPP.FeatureManager.register(ReduceAnimations);
