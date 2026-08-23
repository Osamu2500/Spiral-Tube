import './search-manager.js';

import { SearchViewMode } from './layout/search-view-mode.js';
window.YPP.FeatureManager.register(SearchViewMode);

import { SearchObserver } from './features/search-observer.js';
window.YPP.FeatureManager.register(SearchObserver);

import { SearchRedesign } from './layout/search-redesign.js';
window.YPP.FeatureManager.register(SearchRedesign);
