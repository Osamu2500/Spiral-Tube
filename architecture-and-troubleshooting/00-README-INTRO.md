# Spiral Tube Architecture & Troubleshooting Guides

Welcome to the `architecture-and-troubleshooting` directory. 

## 🎯 Purpose of this Folder
This directory serves as the definitive **Knowledge Base & Troubleshooting Guide** for the Spiral Tube Extension's architecture. 

Building complex Chrome Extensions (especially for a heavy Single Page Application like YouTube) involves battling constant race conditions, DOM thrashing, and strict Manifest V3 lifecycle limits. 

The documents in this folder exist to:
1. **Document Known Architectural Anti-Patterns:** Explain *why* certain bugs happen (e.g., why querying the DOM on cold-load fails, or why global DOM sweeps crash the browser).
2. **Provide Standardized Fixes:** Outline the exact correct architectural patterns (e.g., scoped `data-` attributes, idempotent injections, robust polling).
3. **Equip AI Assistants:** Provide pre-written, highly technical **"AI Prompt Templates."** If a bug ever regresses, you don't need to spend hours explaining the codebase to an AI. You simply copy the relevant prompt from these files and paste it, instantly granting the AI the exact context it needs to audit and fix the issue.

## 📂 Guide Directory

Here are the specific issues covered in this folder, categorized into logical subdirectories. If you encounter a bug, find the closest matching symptom below and open that file:

### `performance-and-lifecycle/`
Issues related to browser performance, memory management, SPA navigations, and Service Workers.
- **`performance-spa-navigation-freeze.md`**: Browser freezes when clicking a video or navigating.
- **`dom-mutation-memory-leaks.md`**: Browser slows down over time; memory leaks.
- **`race-conditions-and-initialization.md`**: Features fail to load on first launch but work on refresh.
- **`mv3-service-worker-lifecycle.md`**: Background processes die unexpectedly.
- **`manifest-v3-permissions-and-security.md`**: CSP violations, permissions errors.
- **`devtools-profiling-and-memory-snapshots.md`**: Using Chrome DevTools to trace memory leaks.

### `ui-and-layout/`
Issues related to DOM injection, CSS layout thrashing, and page-specific UI quirks.
- **`css-layout-thrashing-and-conflicts.md`**: UI elements jump around or duplicate.
- **`global_design_system_and_animations.md`**: Global design and animation guidelines.
- **`shorts_and_subscriptions_layouts.md`**: Quirks specific to Shorts and Subscriptions pages.
- **`watch_page_action_buttons.md`**: Handling action buttons on the watch page.
- **`youtube-theme-synchronization.md`**: Syncing custom UI with YouTube's Light/Dark mode.
- **`youtube-miniplayer-integration.md`**: Quirks related to YouTube's persistent miniplayer.

### `api-and-state/`
Issues related to YouTube's internal APIs, data synchronization, and messaging.
- **`youtube-player-api-sync.md`**: Player features fall out of sync with actual video state.
- **`chrome-storage-and-messaging-failures.md`**: Settings not syncing or large datasets failing to save.
- **`network-request-interception-failures.md`**: Issues intercepting YouTube's XHR/Fetch requests.
- **`youtube-redux-store-interception.md`**: Parsing ytInitialData and intercepting internal state.

---

*If you encounter a new, systemic architectural issue in the future, document the root cause and add a new file to this directory following the established format!*
