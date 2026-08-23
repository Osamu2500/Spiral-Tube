import './global-layout-manager.js';

import { GridAnimator } from './grid-animator.js';
window.YPP.FeatureManager.register(GridAnimator);

import { AutoScaleGrid } from './auto-scale-grid.js';
window.YPP.FeatureManager.register(AutoScaleGrid);

import { GridLayoutManager } from './layout-manager.js';
window.YPP.FeatureManager.register(GridLayoutManager);

import { FeedGridColumns } from './feed-grid-columns.js';
window.YPP.FeatureManager.register(FeedGridColumns);

import { TabviewSidebar } from './tabview-sidebar.js';
window.YPP.FeatureManager.register(TabviewSidebar);

import { StarTubeLayout } from './startube-layout.js';
window.YPP.FeatureManager.register(StarTubeLayout);
