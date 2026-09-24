# Dead Code & Orphan File Elimination

## Symptom

The extension's bundle size grows infinitely over time, containing files, CSS, and legacy features that are no longer used but are difficult to safely identify and delete without breaking things.

## Root Cause

When features are rewritten or removed, developers often forget to delete the old `.js` or `.css` files. Without a strict build step or dependency graph analysis, these "orphan files" just sit in the repository taking up space, and occasionally get accidentally injected by manifest updates or legacy code.

## The Fix: Dependency Graph Sweeping

Do not guess when deleting files. Use a static import analysis approach to guarantee safety.

**The Protocol for Deletion:**

1. **Build the Dependency Graph:** Trace all `import` and `export` statements starting from the main entry points (`content.js`, `popup-main.js`, `background.js`).
2. **Flag Orphans:** Any file in the `src/` directory that does not appear in the graph is flagged as an orphan.
3. **The Triple-Check:** Before deleting an orphan file, you must verify:
   - **Dynamic Imports:** Check if it's loaded via `await import()`.
   - **Manifest Injections:** Check `manifest.json` to see if it's directly injected as a content script or background resource.
   - **String References:** Do a global text search (grep) for the file name just in case it's fetched as a raw asset.
4. **Execution:** Once verified, safely delete the file.

## AI Prompt Template

```text
We need to clean up dead code in the repository. Please write a script or use your analysis tools to build a dependency graph of our imports/exports. Identify any orphaned `.js` or `.css` files that are completely disconnected from our entry points. Before deleting them, perform the strict triple-check (dynamic imports, manifest injections, and string references) to ensure it is 100% safe to delete.
```
