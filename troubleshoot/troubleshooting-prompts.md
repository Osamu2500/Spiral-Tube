# Extension Troubleshooting & AI Prompts Guide

This document contains detailed architectural notes and pre-written prompts for debugging common issues across the Spiral Tube extension. If you ever encounter regressions, copy the relevant prompt and provide it to the AI to instantly give it the necessary context.

---

## 1. SPA Navigation Freezes & Lag (Global & Watch Page)
**Symptom:** The browser freezes for 5-15 seconds when clicking a video from the sidebar, navigating to the home page, or switching between feeds.
**Root Cause:** YouTube is a Single Page Application (SPA). `yt-navigate-finish` fires on every click, but the extension may be doing a full "hard reload" of all its features, tearing down and rebuilding heavy DOM elements unnecessarily instead of applying lightweight state updates.
**Key Areas to Check:** `BasePageManager.activate`, `WatchPageManager.activate`, `main.ts` (Event Bus `app:pageChange`), and global DOM sweeps like `document.querySelectorAll('[data-ypp-processed]')`.

> **Prompt to AI:**
> "I am experiencing severe lag/freezing when navigating within YouTube (e.g., clicking a video, or going from Home to Watch). The extension seems to be struggling with SPA navigations. 
> 
> Please audit the architecture for the following regressions:
> 1. Check `BasePageManager.activate()` and specific managers like `WatchPageManager.activate()`. Are they bypassing heavy initialization loops (like `pollFor` or `_initFeatures`) when transitioning between the *same* page type (e.g., Watch to Watch)?
> 2. Search the codebase for global DOM sweeps like `document.querySelectorAll('[data-ypp-processed]')`. Ensure no features or managers are globally stripping this attribute on page transitions or setting updates. It must be scoped to specific elements.
> 3. Check heavy layout modes (Seamless Mode, Cinema Mode, Ambient Mode, Focus Mode). Ensure their `onPageChange()` handlers aren't needlessly calling full `disable()` and `enable()` cycles, or tearing down their layout engines when navigating between similar pages."

---

## 2. UI Layout Thrashing & Misaligned Elements
**Symptom:** Injected buttons (like the Global Bar buttons) appear misaligned, lower than they should be, or the UI aggressively jumps around when a page loads.
**Root Cause:** The extension is either fighting YouTube's native flexbox/grid CSS, or injecting elements before YouTube has finished rendering its own DOM, resulting in incorrect CSS calculation. Also, missing or overwritten `data-ypp-processed` tags can cause buttons to inject multiple times.
**Key Areas to Check:** `PlayerBarUI.injectControls()`, `GlobalBar`, flexbox alignment in `channel-bar.css`, and DOM observer latency.

> **Prompt to AI:**
> "Injected UI elements (like the custom buttons in the player bar or owner container) are misaligned, jumping around, or injecting multiple times. 
> 
> Please perform the following checks:
> 1. Inspect the CSS applying to the container (e.g., `#owner` or `.ytp-right-controls`). Ensure we are respecting YouTube's native `flexbox` properties (like `align-items: center; justify-content: space-between`).
> 2. Check the injection logic (e.g., `PlayerBarUI.attemptInjection`). Are we verifying if the element already exists before injecting? Is the `data-ypp-processed` tag accurately tracking state without being aggressively wiped by another feature?
> 3. Verify that we aren't hardcoding brittle pixel heights or absolute positioning where dynamic flex/grid gap layouts should be used instead."

---

## 3. DOM Observers & Event Memory Leaks
**Symptom:** The extension gets slower the longer you keep a YouTube tab open.
**Root Cause:** `MutationObserver` instances or event listeners are being attached on every page navigation without being properly cleaned up or disconnected. Alternatively, a `MutationObserver` on the `document.body` is configured with `characterData: true`, causing it to fire thousands of times a second when the video timer ticks.
**Key Areas to Check:** `BaseFeature.registerObserver`, `dom-observer.js` (Declutter), and `addListener` usage in features.

> **Prompt to AI:**
> "The extension is causing the browser to slow down over time, indicating a potential memory leak or runaway MutationObserver.
> 
> Please audit the following:
> 1. Search for `new MutationObserver`. Ensure that observers are properly disconnected during the `disable()` lifecycle of features.
> 2. Ensure that NO `MutationObserver` attached to `document.body` or `#content` is using `characterData: true` alongside `subtree: true`, as this fires constantly during video playback.
> 3. Check event listener attachments. Ensure we are using the `BaseFeature.addListener` wrapper so that they are automatically tracked and removed during cleanup, avoiding duplicate attachments on SPA navigations."

---

## 4. Features Failing to Load on First Launch (Race Conditions)
**Symptom:** You load a YouTube page directly from a new tab (cold load), and the player bar buttons, filters, or specific features just don't appear. However, if you refresh, they magically work.
**Root Cause:** Race conditions between the time the DOM is ready, the `FeatureManager` instantiates the classes, and the page managers attempt to call them. 
**Key Areas to Check:** `main.ts` initialization order, `FeatureManager.instantiated`, and how `PageManagers` retrieve feature instances.

> **Prompt to AI:**
> "Certain features (like the player bar buttons or layout modes) randomly fail to load on a cold refresh, but work if I navigate around or refresh a second time. This is a race condition.
> 
> Please audit the initialization order:
> 1. Check `main.ts`. Ensure `FeatureManager.init()` is called and awaited *before* the `PageManagers` (like `WatchPageManager.activate`) attempt to render UI that depends on those features.
> 2. Look at how UI injectors retrieve features (e.g., `window.YPP.featureManager.getFeature()`). If it returns null, ensure there is a fallback or a `pollFor` mechanism that waits for the feature manager to finish instantiating.
> 3. Verify that `DOMContentReady` dependencies are strictly enforced before triggering DOM manipulation."

---

## 5. Web Audio API & Global Compressor Ducking (Volume Drops)
**Symptom:** When a heavy Voice FX (like a distortion, robotic, or demonic voice) is applied, the video volume suddenly drops to a whisper, and the audio sounds heavily compressed or pumped.
**Root Cause:** The audio node (e.g., WaveShaper) is boosting the signal gain above 0 dBFS. When this hot signal hits the global DynamicsCompressorNode (or YouTube's internal limiters), the compressor aggressively ducks the volume to prevent clipping.
**Key Areas to Check:** `audio-fx.js`, `audio-dynamics.js`, and anywhere a `WaveShaperNode` or resonant `BiquadFilterNode` is used.

> **Prompt to AI:**
> "I am experiencing severe volume drops or heavy compression 'pumping' when I enable certain heavy Voice FX or EQ filters.
> 
> Please audit the audio routing for the following issues:
> 1. Check the Voice FX chain in 'audio-fx.js'. Are any effects (like Demonic, Alien, or Sulfux) using WaveShapers or high-gain filters without a dedicated output attenuation gain node?
> 2. Ensure that immediately after a high-gain node, there is a local 'GainNode' initialized to a value like 0.3 to manually pull the signal back down to standard line level before it hits the master compressor.
> 3. Verify that the global DynamicsCompressorNode has a reasonable threshold and ratio, and isn't being slammed by an untamed wet signal."

---

## 6. UI Container Stretching & Missing Scrollbars
**Symptom:** A popup menu or settings container looks fine on a small tab, but when switching to a tab with lots of buttons (e.g., Voice FX grid), the container stretches vertically off the screen and refuses to show a scrollbar.
**Root Cause:** The container lacks a strict physical height constraint, allowing the inner flex/grid children to force the parent to grow infinitely.
**Key Areas to Check:** `equaliser.css`, `equaliser-ui.js`, and inline styles for `.ypp-eq-panel` or `.ypp-eq-popup`.

> **Prompt to AI:**
> "The popup container is stretching vertically and breaking the layout when I open tabs with lots of content, and the scrollbar isn't appearing.
> 
> Please audit the CSS for the following issues:
> 1. Check the main container class (e.g., '.ypp-eq-popup'). Ensure it has a strict 'height' (e.g., '380px') and 'max-height' defined, rather than just 'height: auto' or 'height: 100%'.
> 2. Ensure 'box-sizing: border-box' is applied so padding doesn't cause a layout blowout.
> 3. Verify that 'overflow-y: auto' is applied to the strictly-height-constrained parent, and that the inner content (like a grid of buttons) is allowed to overflow naturally."
