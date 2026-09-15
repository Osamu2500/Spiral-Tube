# Issue: DOM Mutation Infinite Loops and Memory Leaks

## Overview
A common critical failure in complex YouTube extensions is the browser slowing down to a crawl, fans spinning up, or the tab completely freezing over time. This is almost always caused by improperly configured `MutationObserver` instances that either leak across SPA navigations or fall into infinite loops.

## Root Cause Analysis

1. **The `characterData` Trap on YouTube:**
   YouTube's DOM is highly dynamic. The video player time, view counts, and live chat counters update the DOM text constantly. If an extension attaches a `MutationObserver` to the `document.body` or `#content` with the configuration `{ childList: true, subtree: true, characterData: true }`, the observer will fire thousands of times per second. 
   
2. **Infinite Loops from Self-Triggering:**
   If a `MutationObserver` listens for changes in a container, and the callback function for that observer *modifies* that same container (e.g., adding a class, injecting a button), the modification triggers the observer again. This creates a synchronous infinite loop that instantly crashes the tab.

3. **Memory Leaks from SPA Navigations:**
   Because YouTube is a Single Page Application (SPA), the `document` object is rarely destroyed. If an extension's `onPageChange` logic creates a `new MutationObserver` or calls `.addEventListener()` without cleaning up the previous ones, the extension will stack multiple identical observers and listeners, multiplying CPU usage exponentially on every click.

## Process / Solution

### 1. Fix the `characterData` Trap
Never use `characterData: true` with `subtree: true` on a broad container like `document.body`. 
If you absolutely must observe text changes (e.g., waiting for a subscriber count to load), attach the observer *directly* to the specific, deep text node parent, not the whole page.
**Correct Observer Config:**
```javascript
const observer = new MutationObserver(callback);
observer.observe(document.body, { 
    childList: true, 
    subtree: true
    // NO characterData or attributes unless strictly filtered
});
```

### 2. Prevent Infinite Loops
Always use a flag or an idempotent check (like a `data-` attribute) before modifying the DOM inside a mutation callback.
```javascript
function onMutations(mutations) {
    for (const mutation of mutations) {
        const target = mutation.target;
        // Check if we already processed it before touching it!
        if (target.hasAttribute('data-ypp-processed')) continue;
        
        target.setAttribute('data-ypp-processed', 'true');
        // Do modifications...
    }
}
```

### 3. Cleanup on SPA Navigations
Ensure every feature has a `disable()` or `cleanupEvents()` method that is explicitly called when a feature is toggled off or the user navigates away from the relevant page type.
In this architecture, use the built-in `BaseFeature.registerObserver` which automatically tracks and cleans up observer IDs.

---

## AI Prompt Template for Future Regressions
*If the extension begins to severely lag over time or crashes the tab, copy and paste this prompt to the AI:*

> **Prompt to AI:**
> "The extension is causing severe CPU usage, tab freezing, or memory leaks over time on YouTube. I suspect an issue with DOM Observers or Event Listeners.
> 
> Please audit the codebase for the following:
> 1. Search for `new MutationObserver` or `registerObserver`. Ensure that NO observer attached to `document.body` or `ytd-app` is using `{ characterData: true }` alongside `subtree: true`.
> 2. Check the callbacks for all `MutationObservers`. Ensure that any DOM modification (adding classes, styles, or injecting elements) is guarded by an idempotent check (e.g., `if (el.hasAttribute('data-processed')) return;`) to prevent infinite mutation loops.
> 3. Verify that `addEventListener` and `MutationObserver` instances attached inside `onPageChange` or `enable()` are being correctly tracked and disconnected in `disable()` or `cleanupEvents()` so they don't stack on SPA navigations."
