# 🎨 UI Design Structure — Master Reference Guide

> **Every UI design in this project MUST follow this structure.**
> This document defines the full anatomy of a UI design system — from tokens
> to pages to interactions. If a file or concept is listed here, it must be
> accounted for in every new design.

---

## 📁 Full Folder Structure

```
ui/
├── index.css                      # Master CSS import (imports everything in order)
├── card-style.css                 # Standalone card style (mandatory for theme.js loading)
│
├── base/                          # Foundational styles and variables
│   ├── tokens.css                 # Color variables, sizing, fonts, shadows
│   ├── background.css             # Enforces theme background/text color via html, [dark] body
│   ├── layout.css                 # Grids, spacing, margins, scrollbars
│   └── animations.css             # Keyframes, theme animation effects, and global transitions
│
├── components/                    # All reusable UI components
│   ├── buttons.css                # Action buttons, subscribe buttons, toggles
│   ├── cards.css                  # Structural card tweaks within the full theme
│   ├── icons.css                  # Icon coloring and sizing
│   ├── menus.css                  # Dropdowns, context menus
│   ├── navbar.css                 # Topbar masthead and extension bar
│   └── panels.css                 # Extension EQ/Cinema popups
│   │
│   └── (Optional/Extended)        # Used in newer/complex themes
│       ├── dialogs.css            # Modals and popups
│       ├── miniplayer.css         # Miniplayer styling
│       └── toasts.css             # Notification toasts
│
└── pages/                         # Page-specific DOM targeting
    ├── home.css                   # Homepage grid and chips
    ├── watch.css                  # Watch page layout and sidebar
    ├── player.css                 # Video player controls, player bar, and progress bar
    ├── search.css                 # Search results styling
    ├── channels.css               # Channel header and tabs
    ├── comments.css               # Comment threads and input
    └── livechat.css               # Live chat window
    │
    └── (Optional/Extended)        # Used in newer/complex themes
        ├── community.css          # Community posts
        ├── shorts.css             # Shorts player styling
        └── playlist.css           # My playlist page redesign
```

---

## 🧩 File Logic & Application Dictionary

This section defines exactly what elements and logic belong in each specific CSS file within the blueprint.

### Root Files
- **`index.css`**: The master import file. It contains ZERO actual CSS rules. It solely exists to `@import` the other files in the strict, mandatory cascading order (Base -> Components -> Pages).
- **`card-style.css`**: The standalone card implementation. This file contains the styles for `ytd-rich-grid-media`, `ytd-compact-video-renderer`, and other video items, strictly scoped under the `html[data-ypp-card-style="theme-name"]` selector. It is dynamically loaded by `theme.js` when a user selects a card style independently of the main UI design.

### Base Directory (`base/`)
- **`tokens.css`**: Stores all CSS variables (colors, fonts, borders, shadows) under `html[data-ypp-ui-style="..."]`.
- **`background.css`**: Must clear native YouTube layers by making `ytd-app` transparent and hiding `#background`. Paints the actual theme onto `html, [dark] body` to prevent FOUC and ensure robust overrides.
- **`layout.css`**: Responsible for global scrollbar overrides (hiding scrollbars via `::-webkit-scrollbar` when `ypp-hide-scrollbar` is active) and global margins/padding for `#columns` and `#page-manager`.
- **`animations.css`**: Contains all `@keyframes`, transition timings, and theme-specific animation effects (e.g., floating particles, VHS glitches, gradient shifts).

### Component Directory (`components/`)
- **`buttons.css`**: Covers all action buttons (like, share, download, subscribe). Must work on transparent themes using translucent glass fills (Rule 2).
- **`cards.css`**: The core UI theme's card tweaks. Works alongside `card-style.css` to fine-tune spacing or typography inside cards when the full theme is active.
- **`icons.css`**: Targets SVG paths and fills (`yt-icon`, `.yt-spec-icon-shape`).
- **`menus.css`**: Styles dropdown menus (`ytd-menu-popup-renderer`), right-click context menus, and three-dot action menus.
- **`navbar.css`**: Styles the topbar masthead (`#masthead`), the search box container, and the YPP extension's topbar buttons.
- **`panels.css`**: Extension UI panels (`#ypp-eq-panel`, `#ypp-cinema-panel`). Must NOT use `position: relative !important` because JS handles dynamic positioning (Rule 5).
- **`dialogs.css`** (Optional): Popups and modals (`tp-yt-paper-dialog`).
- **`miniplayer.css`** (Optional): The picture-in-picture / bottom-right miniplayer (`ytd-miniplayer`).
- **`toasts.css`** (Optional): Notification popups (`tp-yt-paper-toast`).

### Page Directory (`pages/`)
- **`home.css`**: The main YouTube homepage (`ytd-browse[page-subtype="home"]`). Target grid rows and category chips here.
- **`watch.css`**: The main video player page layout (`ytd-watch-flexy`). Responsible for structuring the theater mode layout and the secondary sidebar constraints.
- **`player.css`**: Covers the actual video player UI (`.html5-video-player`). Must style the player bar, progress bar, scrubber, volume slider, and settings gear. Must ensure compatibility with native and custom player bars without z-index collisions (Rule 3).
- **`search.css`**: Search result page (`ytd-search`). Must NOT inject filter bars or moving hover-previews to keep static thumbnails clean (Rule 7).
- **`channels.css`**: Channel profile pages (`ytd-browse[page-subtype="channels"]`). Styles the channel banner, avatar, and navigation tabs.
- **`comments.css`**: The comment section (`ytd-comments`). Styles the comment input box, replies, and sort dropdowns.
- **`livechat.css`**: The live stream chat window (`ytd-live-chat-frame`). 
- **`playlist.css`** (Optional): Redesigned playlist panels (`ytd-playlist-panel-renderer`) and standalone playlist pages.
- **`community.css`** (Optional): Community posts on channel pages.
- **`shorts.css`** (Optional): The YouTube Shorts vertical player UI.

---

## 🎨 Design Tokens Reference (`base/tokens.css`)

Every UI must define its design variables inside `base/tokens.css`. This file replaces the fragmented token system of older designs.

```css
html[data-ypp-ui-style="theme-name"] {
  /* Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f0f0f0;
  
  /* Text */
  --text-primary: #111111;
  --text-secondary: #555555;
  
  /* Accents */
  --accent-color: #0b5fa3;
  
  /* Typography & Sizing */
  --font-family: 'Inter', sans-serif;
  --radius-sm: 4px;
  --radius-lg: 12px;
}
```

---

## 🌗 Background & Color Enforcement (`base/background.css`)

Instead of relying on fragile Light/Dark theme switching or YouTube's native variables, themes must enforce their own visual identity robustly using `base/background.css`.

| Requirement              | Details                                  |
|--------------------------|------------------------------------------|
| **Clear Native Layers**  | Ensure `ytd-app` is transparent (`background: transparent !important;`) and hide `#background` (`display: none !important;`). |
| **Enforced Palette**     | Paint the background directly onto `html, [dark] body` to override YouTube's native colors and lock the theme to its intended aesthetic. |
| **Text Visibility**      | Force high-contrast text (`color: ... !important;`) on the same `html, [dark] body` selector. |

---

## 🏗️ `index.css` — Master Import Order

The `index.css` file must import the structural files in this exact order to ensure proper CSS cascading:

```css
/* 1. Base (foundational styles) */
@import './base/tokens.css';
@import './base/animations.css';
@import './base/background.css';
@import './base/layout.css';

/* 2. Components */
@import './components/buttons.css';
@import './components/cards.css';
@import './components/icons.css';
@import './components/menus.css';
@import './components/navbar.css';
@import './components/panels.css';

/* Optional Components */
@import './components/dialogs.css';
@import './components/miniplayer.css';
@import './components/toasts.css';

/* 3. Pages */
@import './pages/channels.css';
@import './pages/comments.css';
@import './pages/home.css';
@import './pages/livechat.css';
@import './pages/player.css';
@import './pages/search.css';
@import './pages/watch.css';

/* Optional Pages */
@import './pages/community.css';
@import './pages/shorts.css';
@import './pages/playlist.css';
```

---


## 🚨 YouTube Extension UI Blueprint — Mandatory Rules & Critical Element Coverage

When designing or updating YouTube UI themes and extension styles, the following rules **MUST be strictly followed across all themes**:

### 1. Player Page Secondary Video Sidebar — NO BORDER BOX RULE
- **Rule**: For the video player page's secondary recommendation sidebar (`#secondary`, `#secondary-inner`, `#related`, and all secondary `ytd-compact-video-renderer` items), **DO NOT add border boxes, card container boxes, outlines, or background containers**.
- **Implementation**:
  - `#secondary`, `#secondary-inner`, `#related`, and secondary `ytd-compact-video-renderer` items must have `background: transparent !important;`, `border: none !important;`, `box-shadow: none !important;`, and `outline: none !important;`.
  - Do not wrap secondary video thumbnails or titles in card borders; let them sit cleanly on the page background without visual clutter.

### 2. Action Buttons (Like, Dislike, Share, Save, Download) — Multi-Version & Transparent Theme Compatibility
- **Rule**: All player action buttons must work reliably across modern and legacy YouTube Polymer DOM layouts and must render cleanly on **transparent, glassmorphic, and dark themes**.
- **Implementation**:
  - Target both legacy and modern button shape selectors (`ytd-menu-renderer`, `ytd-watch-metadata`, `yt-button-shape`, `.yt-spec-button-shape-next`).
  - **Transparent Theme Compatibility**: Do not rely on hardcoded opaque white or grey backgrounds. Action buttons on transparent/glass themes must use translucent glass fills (`rgba(...)` or `--ypp-bg-glass`) with high-contrast foreground icons and text so they never vanish, clip, or appear unreadable against video backgrounds or custom wallpapers.

### 3. Video Player Controls, Progress Bar, Scrubber, Channel Bar & Custom Player Bar Compatibility
- **Rule**: All video player bar elements and channel header bars must be styled and tested for seamless operation with both **native YouTube player controls** and **custom extension player bars**.
- **Implementation**:
  - **Player Controls**: Cover play/pause, volume slider handle (`.ytp-volume-slider-handle`), scrubber button (`.ytp-scrubber-button`), and progress bar (`.ytp-progress-list`, `.ytp-play-progress`).
  - **Custom Player Bar Support**: Ensure custom progress bars and custom player bars do not suffer from double-borders, clipped scrubbers, or z-index collisions when custom extension controls are active.
  - **Channel Bar**: Cover channel header banners (`ytd-c4-tabbed-header-renderer`, `#channel-header`) so tabs and subscribe buttons match the theme aesthetic.

### 4. Redesigned Playlist Page Coverage
- **Rule**: The UI design must cover both legacy and **redesigned YouTube playlist pages** (`ytd-playlist-panel-renderer`, modern playlist headers, and playlist hero cards).
- **Implementation**:
  - Ensure the playlist panel container, header hero card, and individual playlist video items (`ytd-playlist-video-renderer`) are styled consistently.
  - Active/currently playing playlist items must have a clear highlight state without breaking layout or overflowing the playlist drawer.

### 5. Extension Popup Panels (`#ypp-eq-panel`, `#ypp-cinema-panel`, `.ypp-popup-panel`) — NO CSS POSITION OVERRIDES
- **Rule**: Never apply `position: relative !important;` or hardcoded screen coordinates (`left: 0`, `top: 0`) in CSS theme files to extension popup panels.
- **Implementation**:
  - Extension popups are dynamically positioned by JavaScript (`position: fixed` or `position: absolute`) relative to the clicked button on the player bar.
  - Overriding `position` in CSS breaks JavaScript anchor calculation and causes panels to render incorrectly on the far left of the page.

### 6. Global Hide-Scrollbar Consistency Across All Themes & Sidebars
- **Rule**: When the `hideScrollbar` feature is enabled (`body.ypp-hide-scrollbar` or attribute `data-ypp-hidescrollbar="true"`), **ALL scrollbars across ALL UI designs and layout columns MUST be hidden**.
- **Implementation**:
  - Ensure `#secondary` (Up Next recommendation column), `#secondary-inner`, `#page-manager`, `#columns`, and all inner scroll containers in every UI design theme (such as Harry Potter / Hogwarts) have `scrollbar-width: none !important;` and `::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }` with sufficient specificity to override any theme or split-scrolling scrollbar styles.

### 7. Search Results Page Cleanliness & Static Thumbnail Protection
- **Rule**: Search result pages (`/results`) must display normal, static thumbnails cleanly without injected filter bars or moving hover-preview boxes.
- **Implementation**:
  - Do not inject the YPP filter bar (`#ypp-search-filter-btn`) onto search result pages.
  - Ensure static thumbnails (`ytd-thumbnail yt-image`, `img`) remain `display: block !important; visibility: visible !important; opacity: 1 !important;` without breaking dimensions.
  - Suppress moving picture previews (`ytd-moving-thumbnail-renderer`, `ytd-video-preview`) on search results so thumbnails remain normal static images.

---

## ✅ New UI Design Checklist

Before any UI design is considered **complete**, verify:

### Foundation
- [ ] All design tokens defined in `tokens/`
- [ ] Base reset and root styles applied
- [ ] `background.css` enforces the theme's colors robustly against `html, [dark] body`
- [ ] `index.css` imports all files in correct order

### Components
- [ ] All core components (button, input, etc.) built
- [ ] All required card types created
- [ ] Navigation components (navbar, sidebar, tabs) implemented
Before any UI design is considered **complete**, verify every item below:

### 📁 Root Files
- [ ] `index.css` exists and contains **zero CSS rules** — only `@import` statements in the correct order
- [ ] `card-style.css` exists and is scoped under `html[data-ypp-card-style="theme-name"]`

### 🟦 Base Layer
- [ ] `base/tokens.css` — All CSS variables defined under `html[data-ypp-ui-style="..."]`: colors, fonts, borders, shadows, radii
- [ ] `base/background.css` — `ytd-app` is transparent, `#background` is hidden, gradient/color is painted directly onto `html, [dark] body`
- [ ] `base/layout.css` — `#columns`, `#page-manager` margins set; scrollbar hiding via `::-webkit-scrollbar` works under `body.ypp-hide-scrollbar`
- [ ] `base/animations.css` — All `@keyframes` defined; theme animation effects (e.g., glitch, particles, gradient shifts) implemented

### 🟩 Components Layer
- [ ] `components/buttons.css` — Like, dislike, share, subscribe, download buttons styled; transparent/glass theme compatible with `rgba()`
- [ ] `components/cards.css` — `ytd-rich-grid-media`, `ytd-compact-video-renderer` themed; hover and active states covered
- [ ] `components/icons.css` — `yt-icon`, `.yt-spec-icon-shape` SVG fills and colors set
- [ ] `components/menus.css` — `ytd-menu-popup-renderer`, three-dot menus, context menus styled
- [ ] `components/navbar.css` — `#masthead`, search box, YPP topbar buttons styled
- [ ] `components/panels.css` — `#ypp-eq-panel`, `#ypp-cinema-panel` themed; **NO `position: relative !important`**
- [ ] `components/dialogs.css` *(Optional)* — `tp-yt-paper-dialog` styled
- [ ] `components/miniplayer.css` *(Optional)* — `ytd-miniplayer` styled
- [ ] `components/toasts.css` *(Optional)* — `tp-yt-paper-toast` notifications styled

### 🟧 Pages Layer
- [ ] `pages/home.css` — `ytd-browse[page-subtype="home"]`, grid rows, category filter chips styled
- [ ] `pages/watch.css` — `ytd-watch-flexy`, theater mode, `#secondary` sidebar — **no border boxes on secondary items**
- [ ] `pages/player.css` — `.html5-video-player`, player bar, progress bar (`.ytp-progress-list`, `.ytp-play-progress`), scrubber (`.ytp-scrubber-button`), volume slider styled; no z-index conflicts with custom player bar
- [ ] `pages/search.css` — `ytd-search` styled; **no injected filter bar**, static thumbnails protected, `ytd-moving-thumbnail-renderer` suppressed
- [ ] `pages/channels.css` — `ytd-browse[page-subtype="channels"]`, channel banner, avatar, tabs, subscribe button styled
- [ ] `pages/comments.css` — `ytd-comments`, comment input, reply threads, sort dropdown styled
- [ ] `pages/livechat.css` — `ytd-live-chat-frame` styled
- [ ] `pages/playlist.css` *(Optional)* — `ytd-playlist-panel-renderer`, playlist hero card, `ytd-playlist-video-renderer`, active-playing highlight
- [ ] `pages/community.css` *(Optional)* — Community tab posts styled
- [ ] `pages/shorts.css` *(Optional)* — Shorts vertical player styled

### 🚨 Mandatory YouTube Rules (All Must Pass)
- [ ] **Rule 1** — `#secondary`, `#secondary-inner`, `#related` have `background: transparent`, `border: none`, `box-shadow: none`
- [ ] **Rule 2** — Action buttons work on transparent/glass themes with `rgba()` fills; no opaque white/grey hardcoded backgrounds
- [ ] **Rule 3** — Player bar, progress bar (`.ytp-play-progress`), scrubber (`.ytp-scrubber-button`) styled; no z-index collision with custom extension bar
- [ ] **Rule 4** — Playlist panel (`ytd-playlist-panel-renderer`) styled; active item has highlight; no layout overflow
- [ ] **Rule 5** — Extension popup panels (`#ypp-eq-panel`, `#ypp-cinema-panel`) have **ZERO `position: relative !important`** in CSS
- [ ] **Rule 6** — `body.ypp-hide-scrollbar` hides ALL scrollbars across `#secondary`, `#page-manager`, `#columns`, inner containers
- [ ] **Rule 7** — Search page: no filter bar injected, no moving thumbnails, static thumbnails remain `display: block; visibility: visible; opacity: 1`

### ✨ Quality
- [ ] All colors use token variables — **zero hardcoded color values**
- [ ] All animations have a `prefers-reduced-motion` fallback
- [ ] `card-style.css` tested independently from the full UI theme
- [ ] No orphaned CSS files present in the theme folder
- [ ] `index.css` import order matches the mandatory order in this blueprint

---

> 📌 **This document is the law for UI designs.**
> Any design that skips a section in this structure without documented justification is considered incomplete.
