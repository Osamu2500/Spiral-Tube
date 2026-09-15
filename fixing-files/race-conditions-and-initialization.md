# Issue: Race Conditions & Feature Initialization Failures

## Overview
A "Race Condition" occurs when the extension relies on YouTube's DOM elements existing, but the extension code runs *before* YouTube has finished rendering those elements. 

**Symptoms:**
- You open a YouTube video directly in a new tab (Cold Load), and custom buttons, layout changes, or features are missing.
- However, if you press F5 (refresh) or navigate to another video (SPA switch), the features magically appear and work perfectly.

## Root Cause Analysis

1. **The SPA vs Cold Load Difference:**
   On a Cold Load, Chrome executes the extension's `content_scripts` at `document_start` or `document_idle`. YouTube's core application (`ytd-app`) is heavily heavily deferred and dynamically rendered via JavaScript (Polymer framework). 
   Therefore, if the extension immediately runs `document.querySelector('.ytp-right-controls')`, it will return `null` and the logic aborts silently.
   On an SPA navigation (clicking a video from the homepage), YouTube's DOM is already fully constructed, so `querySelector` succeeds instantly.

2. **Manager vs Feature Instantiation Sync:**
   The extension has a central `FeatureManager` that spins up feature classes (like `VolumeBooster`, `SeamlessMode`). If a specific page UI (like `PlayerBarUI`) attempts to call `featureManager.getFeature('VolumeBooster')` before `FeatureManager` has finished loading everything, it receives `null` and skips injecting the button.

## Process / Solution

### 1. Robust Polling (`waitForElement`)
Never assume a YouTube DOM element exists synchronously during initialization. Always use a robust polling mechanism.
Instead of:
```javascript
const bar = document.querySelector('.ytp-right-controls');
if (bar) bar.appendChild(myButton);
```
Use the architecture's built-in `pollFor` or `waitForElement`:
```javascript
async initUI() {
    try {
        const bar = await this.utils.waitForElement('.ytp-right-controls', 5000);
        bar.appendChild(myButton);
    } catch (e) {
        this.utils.log('Player controls never appeared', 'UI', 'warn');
    }
}
```

### 2. State Syncing across Managers
Ensure that Page Managers wait for the Feature Manager to fully instantiate classes before asking for them. 
This is why `WatchPageManager.onActivate()` contains:
```javascript
try {
  await this.utils.pollFor(() => window.YPP?.featureManager?.instantiated, 3000, 50);
} catch (e) {}
```
This forces the UI injection to pause until the underlying logic classes are ready.

### 3. Defensive Abort Controllers
When relying on asynchronous polling, the user might click away to a different page *before* the element is found. Always bind the polling to the feature's lifecycle (using an `AbortController` in `BaseFeature`) so the promise rejects safely instead of blindly injecting a button on the wrong page 5 seconds later.

---

## AI Prompt Template for Future Regressions
*If features are randomly missing on a fresh page load but work when navigating or refreshing, copy and paste this prompt to the AI:*

> **Prompt to AI:**
> "Certain features or UI injections in the extension are failing to appear on a cold page load (opening a link in a new tab) but they work perfectly if I click around or hit refresh. This indicates a race condition with YouTube's dynamic DOM or our initialization sequence.
> 
> Please audit the codebase for the following:
> 1. Check the injection logic for the failing feature. Is it using synchronous `document.querySelector` on load instead of `await this.utils.waitForElement()`?
> 2. Ensure that any page managers (like `WatchPageManager` or `GlobalLayoutManager`) are strictly awaiting `FeatureManager.instantiated` before attempting to extract feature states or inject UI buttons that depend on those features.
> 3. Verify that `app:pageChange` and `app:videoChange` event listeners are securely attached early enough in the `main.ts` bootstrap sequence so they don't miss YouTube's initial events on cold load."
