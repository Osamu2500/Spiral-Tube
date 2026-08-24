// Core dependencies
import '../../shared/config/constants.js';
import '../../shared/config/settings-schema.js';
import '../core/system/error-handler.js';
import '../core/dom/element-cache.js';
import '../../shared/utils/utils.js';
import '../core/utils/youtube-parsers.js';

import '../core/events/event-bus.js';
import '../core/dom/dom-api.js';
import '../core/dom/dom-observer.js';
import '../core/system/storage-manager.js';
import '../core/events/event-delegator.js';
import '../core/system/feature-manager.js';

// CSS Imports
import '../design-system/index.css';

// Managers (Phase 4.5)
import '../core/system/base-page-manager.js';
import '../design-system/color/thumbnail-color-manager.js';

// UI Architecture (Phase 4)
import '../design-system/components/managers/ui-manager.js';
import '../design-system/components/components/button.js';
import '../design-system/components/components/panel.js';

// Base feature class
import '../core/system/base-feature.js';

// Domains
import '../global/filters/index.js';
import '../global/features/index.js';
import '../global/layout/index.js';
import '../global/ui/global-bar/index.js';

import '../pages/home/index.js';
import '../pages/shorts/index.js';
import '../pages/subscriptions/index.js';
import '../pages/search/index.js';
import '../pages/playlist/index.js';
import '../pages/watch/index.js';

// Main entry
import './main.js';
