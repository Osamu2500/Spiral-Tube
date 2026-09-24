# Feature-Based Architecture & Co-Location

## Symptom

The codebase becomes difficult to navigate. Changing a single feature (e.g., Cinema Mode) requires touching 4 or 5 different files scattered across completely different directories (e.g., `src/content/features/...` and `src/content/styles/base-ui-design/...`). This leads to orphaned CSS files when JavaScript is deleted, and makes dependency tracking nearly impossible.

## Root Cause

The extension was originally organized by **File Type** rather than by **Feature**.
This means all CSS was dumped into massive `styles/` directories, and all JS was dumped into `features/` or `scripts/`. This is an anti-pattern for large SPAs and extensions because features are tightly coupled entities.

## The Fix: Feature-Based Co-Location

We are transitioning to a **Feature-Based Architecture**.
This means that all logic, styles, and templates for a specific feature must live together in the exact same directory.

**Example of the Correct Structure:**

```text
src/content/features/cinema-mode/
  ├── cinema-mode.js       (The logic)
  ├── cinema-mode.css      (The styles)
  └── cinema-mode-ui.js    (Optional: HTML templates/DOM generation)
```

**Architectural Rules:**

1. **Never** create a global CSS file for a specific feature.
2. **Never** put a feature's CSS in a different folder than its JS.
3. **Flattening:** Keep directory depth to a maximum of 3-4 levels. Avoid ultra-deep nesting like `pages/watch/player/media-effects/video-filters/ui/`.
4. **Shared Directory:** The `src/shared/` folder must ONLY contain code used by **both** the Content Scripts and the Popup/Background (e.g., Storage wrappers, constants). Do not put DOM-specific UI code in `shared/`.

## AI Prompt Template

```text
I am creating a new feature for the extension. Please ensure you follow our Feature-Based Architecture rules. Do not put the CSS in a global styles folder. Instead, create a new directory for this feature and co-locate the `.js` and `.css` files together within it. Keep the folder structure shallow (max 3-4 levels deep).
```
