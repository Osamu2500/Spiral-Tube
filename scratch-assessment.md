
# Stage 1 Assessment: Entire Extension Folder Structure

## 1. CURRENT SHAPE
*(Tree omitted for brevity, but all 800+ files were mapped with line counts and analyzed.)*
- Total Files: ~800+
- The codebase is split into: `assets`, `background`, `content`, `inject`, `options`, `popup`, `shared`.
- `content` is the largest, split into `components`, `core`, `entry`, `features`, `layouts`, `pages`, `styles`.

## 2. INTERNAL CONSISTENCY
- **Page Folders (`content/pages`)**: Have inconsistent shapes.
  - `home` has `features`, `modes`
  - `playlist` has `features`, `layout`
  - `search` has `features`, `layout`, `styles`
  - `shared-feed` has `components`, `features`, `layout`, `tracking`, `typography`, `utils`
  - `watch` has `components`, `features`, `layout`, `player`
  *(They all have `features` and most have `layout`, but some have `styles`, `components`, `player`.)*
- **Naming Conventions**: Files are predominantly `kebab-case`, which is consistent and good. However, CSS files are sometimes named just `layout.css` or `index.css`, while others are prefixed like `home-layout.css`.
- **Barrel Files (`index.js`)**: Inconsistently applied. Some folders have them (e.g., `shared-feed/index.js`), others do not.

## 3. MISPLACED FILES
- `content/features/ui-managers/` (contains `ui-manager.js`, `thumbnail-color-manager.js`): This isn't a feature; it's core infrastructure. It belongs in `content/core/ui-managers/`.
- `content/pages/search/styles/search-grid-mode-backup.css`: Backup files shouldn't be in the production source tree. It should be removed.
- `shared/utils/dom-manager.js`: Should be inside `shared/utils/modules/` to match the rest of the utility modules.
- `content/features/misc/clean-mix-urls.js`: "misc" is an anti-pattern. This is a navigation or watch feature and belongs in `content/features/navigation/` or `content/pages/watch/features/`.

## 4. MISSING GROUPING
- `content/features/ui-tweaks/`: Contains 17 loose files (CSS and JS mix). They should be grouped by functionality (e.g., `logo/`, `scrollbar/`, `thumbnails/`, `theme/`).
- `content/pages/search/` has loose `search-manager.js`. It should be grouped into `core` or `features` under search.
- `content/pages/watch/` has loose `watch-manager.js`. It should be grouped similarly.

## 5. OVER-NESTING
- `content/components/buttons/button.js`: Flatten to `content/components/button.js`.
- `content/components/panels/panel.js`: Flatten to `content/components/panel.js`.
- `content/features/cinematic/cinematic.css`: Flatten to `content/features/cinematic.css` if it has no other files, OR group it better.
- `content/pages/watch/components/comments/comment-filter.js`: Flatten to `content/pages/watch/features/comment-filter/` (it's a feature, not just a component).
- `content/pages/shared-feed/components/shorts-shelf/shorts-shelf.css`: Move to a flatter structure under `shared-feed/features/` or `styles/`.

## 6. ENTRY POINT CLARITY
- `content/features/ui-tweaks`: Has no `index.js`. External files import directly from individual files.
- `content/pages/watch/player`: Deeply nested without clear entry points. External files might bypass structure.
- Barrel files (`index.js`) need to be consistently added to any new grouping folders to encapsulate their contents.

## 7. PROPOSED STRUCTURE
- **Moves & Renames**:
  - `content/features/ui-managers` -> `content/core/ui-managers`
  - `content/features/misc/clean-mix-urls.js` -> `content/features/navigation/clean-mix-urls.js`
  - `shared/utils/dom-manager.js` -> `shared/utils/modules/dom-manager.js`
  - `content/pages/search/search-manager.js` -> `content/pages/search/core/search-manager.js`
  - `content/pages/watch/watch-manager.js` -> `content/pages/watch/core/watch-manager.js`
  - `content/pages/shared-feed/components/video-cards/*` -> `content/pages/shared-feed/features/video-cards/*`
- **Flattens**:
  - `content/components/buttons/button.js` -> `content/components/button.js`
  - `content/components/panels/panel.js` -> `content/components/panel.js`
  - `content/pages/watch/components/comments/comment-filter.js` -> `content/pages/watch/features/comment-filter.js`
- **Groupings**:
  - Group `content/features/ui-tweaks/` into `theme/`, `layout/`, and `branding/` subfolders, each with an `index.js`.
  - Group `content/pages/search/styles/` into the corresponding layout features in `content/pages/search/layout/`.
- **Deletions**:
  - Remove `content/pages/search/styles/search-grid-mode-backup.css`.

All external imports referencing these files will be updated to point to the new paths or the new barrel exports.
