# Issue: Severe Performance Freeze (10-15s) During SPA Video Navigation

## Overview
When navigating between videos on the watch page (e.g., clicking a video from the related sidebar), the browser would freeze for 10-15 seconds. This was a critical performance bottleneck directly tied to how the extension handled YouTube's Single Page Application (SPA) architecture during identical page-type transitions (Watch → Watch).

## Root Cause Analysis

The extension's routing and feature orchestration was treating **same-page video switches** identical to **hard page loads**. When YouTube emitted its internal navigation event (`yt-navigate-finish`), the extension's Event Bus fired `app:pageChange`. 

This triggered a devastating cascade of performance-heavy operations:

1. **WatchPageManager Over-Initialization:**
   - `WatchPageManager.activate()` fired every time. Because the URL changed, it bypassed the early-return guard and ran the full `onActivate()` lifecycle.
   - `onActivate()` triggered a `pollFor` loop that waited up to 3 seconds for features to instantiate, unnecessarily blocking execution.
   - The player bar UI was completely destroyed and re-injected from scratch.

2. **Global DOM Thrashing (data-ypp-processed sweep):**
   - Both the page transition listener and `updateSettings()` were executing `document.querySelectorAll('[data-ypp-processed="true"]')` and stripping the attribute from the entire document globally. 
   - This forced the `MutationObserver` in `main.js` and all features to re-evaluate every single processed DOM node on the screen, causing massive synchronous layout recalculation (thrashing).

3. **Feature Engine Teardowns:**
   - Features like **Seamless Mode** and **Ambient Mode** were hooked into `onPageChange()`.
   - On every video click, Seamless Mode would completely tear down its layout engines and rebuild them (which involves aggressively moving DOM elements around).
   - Ambient Mode would run a full `disable()` and `enable()` cycle.

## Implementation Fixes

The core solution involved shifting from a "Destructive Rebuild" pattern to an "Idempotent State Update" pattern for SPA navigations.

### 1. Smart Navigation Guard in `watch-manager.js`
Modified `WatchPageManager.activate(url)` to detect if the user is already on the watch page.
```javascript
activate(url) {
  const isAlreadyOnWatch = this.isActive && window.location.pathname.startsWith('/watch');
  if (isAlreadyOnWatch) {
    this.currentUrl = url;
    this._onVideoSwitch(); // Lightweight path
    return;
  }
  super.activate(url); // Heavy path
}
```
Created `_onVideoSwitch()` which merely re-checks the player bar injection and re-applies current DOM layout state without triggering polling or rebuilds.

### 2. Scoped DOM Resets
Replaced the global `querySelectorAll` sweeps with strictly scoped selectors. The reset now only targets the elements that actually need re-injection upon video switch (the player bar controls):
```javascript
document.querySelectorAll(
  '.ytp-chrome-bottom[data-ypp-processed], .ytp-right-controls[data-ypp-processed], ytd-reel-video-renderer[data-ypp-processed]'
).forEach(el => el.removeAttribute('data-ypp-processed'));
```
Also completely removed the DOM sweep from `updateSettings()`.

### 3. Feature Lifecycle Optimizations
- **Seamless Mode (`seamless-mode.js`)**: Updated `onPageChange()` to check `wasOnWatchPage`. If transitioning watch-to-watch, it skips the heavy `_deactivateEngines() / _activateEngines()` cycle and merely triggers a debounced `_executeMacroLayoutSwap()`.
- **Ambient Mode (`ambient-mode.js`)**: Updated `onPageChange()` to check if the ambient class is already active on the body. Since Ambient Mode already has an `onVideoChange()` handler that updates the canvas context, the full `disable/enable` teardown on page change was bypassed.

---

## AI Prompt Template for Future Regressions
*If this issue ever re-appears in the future, you can copy and paste the following prompt to the AI to help it instantly understand the architecture and fix the issue:*

> **Prompt to AI:**
> "I am experiencing a severe lag/freeze (10+ seconds) when clicking a new video from the sidebar on YouTube (a Watch-to-Watch SPA navigation). We previously fixed a similar issue in our architecture. 
> 
> Please audit the codebase for the following regressions:
> 1. Check `WatchPageManager.activate()` and ensure it is still differentiating between a full page load and a lightweight `_onVideoSwitch()`.
> 2. Search the codebase for `querySelectorAll('[data-ypp-processed]')`. Make sure no features or managers are doing global DOM sweeps to reset this attribute on page transitions or setting updates. It must be scoped to specific elements (like `.ytp-chrome-bottom`).
> 3. Check `feature-manager.ts` and `main.ts` to ensure `app:pageChange` isn't triggering heavy `onActivate()` lifecycles on features that should instead be relying on the lightweight `app:videoChange` event.
> 4. Look at heavy layout modes (like Seamless Mode, Cinema Mode, Focus Mode) and ensure their `onPageChange()` handlers aren't needlessly tearing down and restarting their engines when `isWatchPage` remains true between navigations."
