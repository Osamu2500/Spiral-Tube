# View Transitions API Quirks in Chrome Extensions

**Symptom:** Unhandled Promise Rejections throwing errors in the console such as:
`InvalidStateError: Transition was aborted because of invalid data. Document hidden`

**Root Cause:**
The View Transitions API (`document.startViewTransition()`) is a powerful way to animate DOM changes. However, it has a strict requirement: **the document must be visible.**
In Chrome extensions (especially popups or injected iframes), if a user triggers an action that causes a view transition, but the document visibility changes (e.g., they click away, or the popup opens while a background page is transitioning), the browser immediately aborts the transition and throws an `InvalidStateError`.
If this error is unhandled, it will bubble up as an unhandled promise rejection and potentially trigger global error boundaries, causing the UI to break.

**Key Areas to Check:** `popup-ui.js`, rendering engines, or any layout logic using `document.startViewTransition()`.

> **Prompt to AI:**
> "The extension is throwing an `InvalidStateError: Document hidden` related to view transitions, and it's breaking the UI or triggering global error handlers.
> 
> Please perform the following checks:
> 1. Search the codebase for `document.startViewTransition`. Ensure *every* call is wrapped in a `try/catch` block.
> 2. In the `catch` block, silently handle the error (or log it) and immediately fallback to executing the DOM update via `requestAnimationFrame()` directly.
> 3. Ensure global error handlers (like `window.addEventListener('unhandledrejection')`) are ignoring this specific, non-critical browser quirk so it doesn't nuke the UI."
