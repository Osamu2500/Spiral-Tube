# Chrome Storage Bottlenecks & Settings Caching

## Symptom
The extension causes micro-stutters or freezes when scrolling, resizing the window, or interacting with the UI. The issue disappears when the extension is disabled.

## Root Cause
`chrome.storage.local.get` is an asynchronous API that communicates across the extension's boundaries. It is inherently slow. 
If layout logic (like a `resize` listener, `scroll` listener, or `MutationObserver` callback) requests the current extension settings by calling `await chrome.storage.local.get()` directly, it creates a massive performance bottleneck. Hundreds of asynchronous storage queries stack up, blocking the main thread and freezing the page.

## The Fix: In-Memory Caching & Throttling
Never call `chrome.storage.local.get()` directly inside high-frequency loops or event listeners.

1. **In-Memory Cache:** The `SettingsManager` must maintain a synchronous, in-memory cache of the current settings state (e.g., `this.cache = {}`).
2. **One-Time Load:** On initialization, the `SettingsManager` queries `chrome.storage.local` once and populates the cache.
3. **Synchronous Reads:** All content scripts and features must read from the cache synchronously (e.g., `SettingsManager.get('theme')`), rather than awaiting a storage query.
4. **Listener Updates:** The `SettingsManager` binds to `chrome.storage.onChanged` to passively update its internal cache whenever settings are modified from the popup, ensuring the cache is always fresh without needing to actively poll the storage API.

## AI Prompt Template
```text
The extension is suffering from micro-stutters because a feature is calling `await chrome.storage.local.get()` inside a high-frequency loop (like a MutationObserver or scroll event). Please refactor this logic to use our `SettingsManager`'s synchronous in-memory cache instead. Ensure we only read from the cache and rely on `chrome.storage.onChanged` to keep it updated.
```
