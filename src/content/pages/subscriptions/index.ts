import './subs-manager.js';

import { FolderStorage } from './features/folder-storage.js';
window.YPP.FeatureManager.register(FolderStorage);

import { CustomDialog } from './features/folder-ui.js';
window.YPP.FeatureManager.register(CustomDialog);

import { ContextMenu } from './features/context-menu.js';
window.YPP.FeatureManager.register(ContextMenu);

import { SubscriptionFolders } from './features/subscription-folders.js';
window.YPP.FeatureManager.register(SubscriptionFolders);

import { SubscriptionManager } from './features/subscription-manager.js';
window.YPP.FeatureManager.register(SubscriptionManager);

import { FolderFeed } from './features/folder-feed.js';
window.YPP.FeatureManager.register(FolderFeed);

import { DeckMode } from './layout/deck-mode.js';
window.YPP.FeatureManager.register(DeckMode);

import { SubscriptionsOrganizer } from './features/index.js';
window.YPP.FeatureManager.register(SubscriptionsOrganizer);

import { ChannelHealth } from './features/channel-health.js';
window.YPP.FeatureManager.register(ChannelHealth);

import { GroupSidebar } from './layout/group-sidebar.js';
window.YPP.FeatureManager.register(GroupSidebar);

import { TwoColumnSubscriptions } from './features/two-column-subscriptions.js';
window.YPP.FeatureManager.register(TwoColumnSubscriptions);
