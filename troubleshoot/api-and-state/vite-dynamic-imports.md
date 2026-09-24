# Vite Dynamic Imports & Dead Code Analysis

**Symptom:** Custom scripts (like `find-orphans.mjs`) or static analysis tools report that hundreds of valid extension files (like pages, themes, or components) are "dead code" or "orphans", even though the extension uses them perfectly fine.

**Root Cause:**
Modern bundlers like Vite support dynamic imports via macros like `import.meta.glob()`. In Spiral Tube, the entry point (`src/content/entry/index.ts`) eagerly loads all features and pages using:
```javascript
const globalModules = import.meta.glob([
    '../features/**/*.js',
    '../layouts/**/*.js',
    '../pages/**/*.js'
], { eager: true });
```
Because these are not explicit `import X from Y` statements, regex-based parsing scripts or basic AST traversers will fail to see the dependency link. They will incorrectly assume the files are orphaned and recommend deleting them. If you delete them, they will silently stop being bundled by Vite, breaking the extension.

**Key Areas to Check:** `src/content/entry/index.ts`, custom utility scripts (e.g., `scripts/find-orphans.mjs`), and dynamically loaded CSS themes.

> **Prompt to AI:**
> "I am running a script or tool to find dead code/orphans in the extension, and it's flagging a massive number of files in `src/content/pages/` or `src/content/styles/themes/` as unused.
> 
> Please be aware:
> 1. The extension uses Vite's `import.meta.glob()` in `index.ts` to dynamically bundle entire directories. Regex-based static analysis WILL miss these.
> 2. CSS themes and base UI styles are often injected via `manifest.json` or loaded by Vite explicitly in `core-init.ts`.
> 3. Before deleting ANY 'dead' file, manually verify if its directory is included in `import.meta.glob()` or `manifest.json`. If it is, it's not dead. Do not delete it."
