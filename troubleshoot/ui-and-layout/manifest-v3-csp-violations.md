# Manifest V3 CSP Violations & Popup Crashes

**Symptom:** The extension popup (or options page) fails to load correctly, shows a blank screen, or throws errors in the console like:
`Refused to execute inline script because it violates the following Content Security Policy directive...`

**Root Cause:**
Manifest V3 enforces a very strict default Content Security Policy (CSP). 
Specifically, it strictly forbids:
1. Inline `<script>...</script>` tags inside HTML files.
2. Inline event handlers like `<button onclick="...">`.
3. `eval()` and similar dynamic code execution.

If a popup HTML file contains any inline JavaScript (even a simple `console.log`), the browser will refuse to execute it and may abort the entire execution context, breaking other scripts.
Furthermore, using `document.body.innerHTML = 'Error'` to handle global errors in the popup can inadvertently wipe the entire DOM, including the scripts needed to recover.

**Key Areas to Check:** `popup.html`, `options.html`, `popup-main.js`, and error boundary implementations.

> **Prompt to AI:**
> "The extension popup is failing to open or throwing CSP (Content Security Policy) errors. 
> 
> Please audit the architecture for the following:
> 1. Check `popup.html` and `options.html` for any inline `<script>` tags or `onclick` attributes. All JavaScript MUST be extracted into external `.js` files and referenced via `<script src="..."></script>`.
> 2. Check the entry point (`popup-main.js` or similar) for global error handlers. Ensure we are not destructively wiping `document.body.innerHTML` on non-critical errors (which destroys the UI).
> 3. If there is a `window.addEventListener('error', ...)` hook, ensure it is defined in a separate, isolated file (e.g., `popup-error-handler.js`) and loaded *first* in the HTML to catch early initialization errors safely."
