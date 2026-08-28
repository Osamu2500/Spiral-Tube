---
name: frontend-architecture
description: "Portable, framework-agnostic architecture for frontend projects. Organizes code into feature modules with strict import boundaries, server-state vs UI-state split, and clear component-promotion rules."
risk: critical
source: https://github.com/stareezy-1/frontend-architecture-skill/tree/main/skills/frontend-architecture
source_repo: stareezy-1/frontend-architecture-skill
source_type: community
date_added: 2026-07-01
license: MIT
---

# Frontend Architecture (Portable, Module-Based)

## When to Use

Use this skill when you need to organize a frontend codebase into a clean, maintainable structure. Applicable to Chrome extensions, SPAs, and any JS-heavy project.

## The Five Core Ideas

1. **Feature modules own their world.** Each feature is a self-contained folder with its own components, hooks, state, and a single public entry point.
2. **Pages/screens are directories, not files.** A view is a folder that co-locates its component, styles, and sub-components.
3. **State is split by origin.** Persisted/server data lives in storage. UI/transient state lives in module scope. They never overlap.
4. **Imports cross boundaries only through barrels.** Reach into another module only via its `index.js` — never into internals.
5. **Code is promoted, not pre-placed.** It starts as local as possible and moves outward only when a second consumer appears.

## Chrome Extension Directory Layout

```
src/
├── content/
│   ├── core/               ← shared utilities, BaseFeature, constants
│   ├── entry/              ← content script entry point
│   └── pages/
│       └── watch/
│           └── player/
│               ├── media-effects/
│               │   ├── video-filters/  ← feature module
│               │   │   ├── video-filters.js        ← orchestrator (entry)
│               │   │   ├── video-filters-ui.js     ← UI layer
│               │   │   ├── video-filters-overlay.js
│               │   │   ├── video-filters-presets.js
│               │   │   ├── video-filters.css
│               │   │   └── ui/                     ← sub-components
│               │   └── volume-booster/  ← feature module
│               │       ├── volume-booster.js        ← orchestrator
│               │       ├── volume-booster-ui.js     ← UI layer
│               │       ├── volume-booster.css
│               │       ├── constants/              ← EQ presets, bands
│               │       ├── modules/                ← audio sub-modules
│               │       └── ui/                     ← UI sub-components
│               └── enhancements/       ← simpler standalone features
└── popup/                  ← extension popup
```

## Import Rules

```js
// CORRECT — import from module's main file
import { VideoFilters } from './video-filters/video-filters.js';

// CORRECT — import from sub-module within same feature
import { AudioFXMixin } from './modules/audio-fx.js';

// WRONG — cross-feature internal import
import { something } from '../video-filters/ui/tab-presets.js'; // ❌
```

## State Ownership

| State Type | Location | Example |
|---|---|---|
| Feature settings | `chrome.storage.sync` via BaseFeature | `enableVolumeBoost`, EQ gains |
| UI transient state | Module-level instance variables | `this._volumePopup`, `this._filterPanel` |
| Audio graph nodes | Instance variables on feature class | `this.gainNode`, `this.ctx` |
| Shared constants | `constants/` folder | `EQ_BANDS`, `FILTERS` |

## Component Promotion Rules

1. Start: logic lives directly in the feature orchestrator
2. Promote to sub-module: when logic exceeds ~150 lines or has clear independence (e.g., `audio-fx.js`, `audio-dynamics.js`)
3. Promote to `ui/`: when UI rendering is complex enough to separate (e.g., `tab-fx.js`, `tab-presets.js`)
4. Promote to `core/`: when used by 2+ feature modules (e.g., `BaseFeature`, `SELECTORS`)
