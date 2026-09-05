// Core framework and dependencies
import '../../shared/config/constants/index.js';
import '../../shared/config/settings-schema.js';
import '../core/system/error-handler.js';
import '../core/dom/element-cache.js';
import '../../shared/utils/index.js';
import '../core/utils/filter-primitives.js';
import '../core/utils/youtube-parsers.js';

import '../core/events/event-bus.js';
import '../core/dom/dom-api.js';
import '../core/dom/dom-observer.ts';
import '../core/system/storage-manager.js';
import '../core/events/event-delegator.js';
import '../core/system/feature-manager.ts';

// Base feature class
import '../core/system/base-feature.js';

// The CSS is injected natively via MV3 content_scripts in manifest.json.
// However, Vite requires it to be imported here to build the CSS bundle.
import '../styles/base-ui-design/index.css';

// Managers & Data
import '../core/system/base-page-manager.js';
import '../core/ui-managers/thumbnail-color-manager.js';
import '../core/ui-managers/ui-manager.js';
import '../core/data/watched-store.js';
import '../core/events/hotkeys-manager.js';
