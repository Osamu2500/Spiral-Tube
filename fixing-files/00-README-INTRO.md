# Spiral Tube Fixing Files & Architecture Guides

Welcome to the `fixing-files` directory. 

## 🎯 Purpose of this Folder
This directory serves as the definitive **Knowledge Base & Troubleshooting Guide** for the Spiral Tube Extension's architecture. 

Building complex Chrome Extensions (especially for a heavy Single Page Application like YouTube) involves battling constant race conditions, DOM thrashing, and strict Manifest V3 lifecycle limits. 

The documents in this folder exist to:
1. **Document Known Architectural Anti-Patterns:** Explain *why* certain bugs happen (e.g., why querying the DOM on cold-load fails, or why global DOM sweeps crash the browser).
2. **Provide Standardized Fixes:** Outline the exact correct architectural patterns (e.g., scoped `data-` attributes, idempotent injections, robust polling).
3. **Equip AI Assistants:** Provide pre-written, highly technical **"AI Prompt Templates."** If a bug ever regresses, you don't need to spend hours explaining the codebase to an AI. You simply copy the relevant prompt from these files and paste it, instantly granting the AI the exact context it needs to audit and fix the issue.

## 📂 Guide Directory

Here are the specific issues covered in this folder. If you encounter a bug, find the closest matching symptom below and open that file:

### 1. `performance-spa-navigation-freeze.md`
- **Use when:** The browser freezes for 5-15 seconds when clicking a video from the sidebar.
- **Covers:** Global DOM sweep thrashing, unnecessary polling loops on video switch, and heavy layout engine teardowns in Seamless/Ambient modes.

### 2. `dom-mutation-memory-leaks.md`
- **Use when:** The browser slowly grinds to a halt the longer you leave a YouTube tab open, or fans spin up aggressively.
- **Covers:** `MutationObserver` infinite loops, the `characterData` trap on YouTube timers, and memory leaks from uncleaned event listeners.

### 3. `race-conditions-and-initialization.md`
- **Use when:** Custom buttons or UI features fail to load when you open a link in a new tab (Cold Load), but magically work if you refresh the page.
- **Covers:** YouTube's delayed DOM rendering, `FeatureManager` instantiation race conditions, and robust polling via `waitForElement`.

### 4. `css-layout-thrashing-and-conflicts.md`
- **Use when:** Injected UI elements (like custom player buttons) duplicate themselves, jump around aggressively during load, or break YouTube's native alignment.
- **Covers:** Integrating with YouTube's native Flexbox/Grid CSS, idempotent DOM injections, and avoiding specificity wars.

### 5. `youtube-player-api-sync.md`
- **Use when:** Features that control the video (Volume Booster, Auto-Pause, Video Speed) fall out of sync with what the video is actually doing.
- **Covers:** Hooking into YouTube's internal `movie_player` API, Web Audio API context singleton patterns, and event propagation wars.

### 6. `chrome-storage-and-messaging-failures.md`
- **Use when:** Settings toggled in the popup aren't syncing to the page, or large datasets (like history) fail to save.
- **Covers:** `chrome.storage.sync` quota limits, broken asynchronous messaging ports, and hybrid storage strategies.

### 7. `mv3-service-worker-lifecycle.md`
- **Use when:** Background processes or messaging ports randomly die after 5 minutes of browsing.
- **Covers:** Chrome's aggressive 5-minute inactivity kills, the 30-second execution limits, and stateless Service Worker architecture.

---

*If you encounter a new, systemic architectural issue in the future, document the root cause and add a new file to this directory following the established format!*
