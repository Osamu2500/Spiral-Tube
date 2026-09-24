# View Transitions API Quirks in Chrome Extensions

## Overview
The `document.startViewTransition()` API enables beautiful, app-like page transitions. However, when used within the confined environment of a Chrome Extension popup, it suffers from specific browser quirks that can throw unhandled promise rejections and break the UI if not properly caught.

## 🔴 Known Architectural Anti-Pattern: Unprotected View Transitions
Calling `document.startViewTransition(callback)` directly without a `try/catch` block.

**Why this fails:**
If a user opens the extension popup while the parent browser tab is in the middle of navigating (or if the popup's document briefly loses visibility during initialization), Chrome instantly aborts the transition and throws:
`InvalidStateError: Transition was aborted because of invalid data. Document hidden`

If this rejection is unhandled, it triggers the global `unhandledrejection` listener. If your error handler is aggressive (e.g., replaces the DOM with an error message), a harmless browser animation quirk will completely crash your popup UI.

## ✅ The Standardized Fix: Graceful Fallbacks
Always wrap View Transitions in a `try/catch` and fallback to `requestAnimationFrame` for safety.

```javascript
export function updateUI() {
    const applyChanges = () => {
        // ... manipulate DOM ...
    };

    if (document.startViewTransition) {
        try {
            document.startViewTransition(applyChanges);
        } catch (_) {
            // Silently catch the 'Document hidden' InvalidStateError
            // and fallback to standard rendering
            requestAnimationFrame(applyChanges);
        }
    } else {
        requestAnimationFrame(applyChanges);
    }
}
```

Additionally, ensure your global `unhandledrejection` handler filters out benign browser quirks:
```javascript
window.addEventListener('unhandledrejection', (e) => {
    if (String(e.reason).includes('Document hidden')) {
        e.preventDefault(); // Ignore View Transition visibility quirks
        return;
    }
    console.error('Unhandled Promise Rejection:', e.reason);
});
```
