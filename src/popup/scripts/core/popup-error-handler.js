// popup-error-handler.js
// Non-destructive global error boundary for the popup.
// Logs errors to the console without wiping the popup UI.
// Only shows an overlay for truly fatal errors (uncaught JS syntax/runtime errors).

const IGNORED_PATTERNS = [
    'Document hidden',          // View Transitions API: non-critical
    'ResizeObserver loop',      // Browser quirk: safe to ignore
    'Non-Error promise rejection', // Often benign third-party rejections
];

function isIgnorable(msg) {
    if (!msg) return false;
    const str = String(msg);
    return IGNORED_PATTERNS.some(p => str.includes(p));
}

window.addEventListener('error', (e) => {
    if (isIgnorable(e.message)) {
        e.preventDefault();
        return;
    }
    console.error('[YPP] Global Error:', e.message, '\nFile:', e.filename, '\nLine:', e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
    if (isIgnorable(e.reason)) {
        e.preventDefault();
        return;
    }
    console.error('[YPP] Unhandled Promise Rejection:', e.reason);
});
