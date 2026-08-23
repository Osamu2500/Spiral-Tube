import { BaseFilterFeature } from './base-filter-feature.js';
window.YPP.FeatureManager.register(BaseFilterFeature);

import { ScreenFilters } from './screen-filters.js';
window.YPP.FeatureManager.register(ScreenFilters);

import { HideWatched } from './hide-watched.js';
window.YPP.FeatureManager.register(HideWatched);

import { HideMetrics } from './hide-metrics.js';
window.YPP.FeatureManager.register(HideMetrics);

import './filter-ui-interactions.js';

import { DurationFilter } from './duration-filter.js';
window.YPP.FeatureManager.register(DurationFilter);

import { BlocklistFilter } from './blocklist-filter.js';
window.YPP.FeatureManager.register(BlocklistFilter);

import { FeedFilter } from './feed-filter.js';
window.YPP.FeatureManager.register(FeedFilter);

import { FiltersManager } from './filters-manager.js';
window.YPP.FeatureManager.register(FiltersManager);

import { ViewsFilter } from './views-filter.js';
window.YPP.FeatureManager.register(ViewsFilter);

import { UploadDateFilter } from './upload-date-filter.js';
window.YPP.FeatureManager.register(UploadDateFilter);

import { ClickbaitFilter } from './clickbait-filter.js';
window.YPP.FeatureManager.register(ClickbaitFilter);
