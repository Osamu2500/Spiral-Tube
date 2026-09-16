# Issue: Chrome Extension Storage & Messaging Failures

## Overview
Settings changes made in the popup aren't reflecting on the YouTube page, features aren't saving their state between sessions, or cross-script communication (Content Script <-> Service Worker) is failing.

**Symptoms:**
- The user toggles a feature in the popup, but the webpage ignores the change until a hard refresh.
- "QuotaExceeded" errors appear in the extension console.
- Attempting to send a message to `chrome.runtime` throws a "Message port closed before a response was received" error.

## Root Cause Analysis

1. **Storage Quota Limits (`chrome.storage.sync`):**
   Chrome's `sync` storage has extremely strict limits (MAX_WRITE_OPERATIONS_PER_MINUTE is 120, MAX_ITEMS is 512, and QUOTA_BYTES_PER_ITEM is 8KB). If the extension attempts to save complex objects (like a massive array of watched videos or a huge channel blacklist) into `sync`, it will instantly hit quota limits and all future saves will silently fail.

2. **Disconnected Message Ports:**
   When the popup sends a message to the content script, but the content script's `chrome.runtime.onMessage` listener throws an uncaught error (or doesn't return `true` for asynchronous responses), the messaging port collapses.

3. **Content Script Isolation:**
   Sometimes, settings updates happen in the background, but the currently active YouTube tab isn't listening for `chrome.storage.onChanged` correctly, or the listener was detached during a previous SPA navigation.

## Process / Solution

### 1. Hybrid Storage Strategy (Sync + Local)
Never store massive arrays (History, Watch Cache, large Blacklists) in `chrome.storage.sync`. 
Reserve `sync` strictly for small, lightweight boolean toggles (e.g., `enableFocusMode: true`).
Use `chrome.storage.local` or IndexedDB for heavy datasets.
```javascript
// Example architecture pattern:
function saveHeavyData(data) {
    try {
        chrome.storage.local.set({ largeDataset: data });
    } catch(e) {
        console.error("Local storage failed", e);
    }
}
```

### 2. Async Messaging Handling
When writing a `chrome.runtime.onMessage` listener that performs asynchronous work, you **must** return `true` at the end of the synchronous execution block, otherwise Chrome instantly closes the port.
```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'DO_ASYNC_WORK') {
        performAsyncWork().then(result => {
            sendResponse({ success: true, data: result });
        });
        return true; // CRITICAL: Tells Chrome to keep the port open
    }
});
```

### 3. Bulletproof Storage Listeners
Ensure `chrome.storage.onChanged` is attached once in `main.ts`, and that it safely merges the incoming changes into the central `this.settings` object, then explicitly calls `updateSettings()` on the Feature Manager and all Page Managers.

---

## AI Prompt Template for Future Regressions
*If settings aren't saving, toggles aren't syncing between the popup and the page, or quota errors appear, copy and paste this prompt to the AI:*

> **Prompt to AI:**
> "Settings changes made in the popup are not syncing to the YouTube page, or large datasets (like history/blacklists) are failing to save due to potential quota limits or broken messaging ports.
> 
> Please audit the storage and messaging architecture:
> 1. Check where large datasets are being saved. Are we accidentally dumping heavy arrays into `chrome.storage.sync` instead of `chrome.storage.local`?
> 2. Audit all `chrome.runtime.onMessage` listeners in the Content Scripts and Service Worker. Ensure that any listener performing async work (Promises/async-await) explicitly returns `true`.
> 3. Verify the `chrome.storage.onChanged` listener in `main.ts`. Ensure it is correctly catching the new values, merging them into the global settings state, and aggressively pushing those updates to the `FeatureManager` and `PageManagers` without requiring a hard refresh."
