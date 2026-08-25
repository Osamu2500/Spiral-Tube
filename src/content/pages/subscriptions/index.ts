import { ChannelHealth } from './features/channel-health/channel-health.js';
window.YPP.FeatureManager.register(ChannelHealth);

import { TwoColumnSubscriptions } from './features/grid-layout/two-column-subscriptions.js';
window.YPP.FeatureManager.register(TwoColumnSubscriptions);

import { FilterBar } from './declutter/filter-bar.js';
window.YPP.FeatureManager.register(FilterBar);

import { CustomDialog } from './features/channel-health/custom-dialog.js';
window.YPP.FeatureManager.register(CustomDialog);
