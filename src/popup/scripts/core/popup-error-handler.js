// popup-error-handler.js
// Global error boundary for the popup. Catches unhandled errors and
// promise rejections so the user sees a readable message instead of a blank popup.
window.addEventListener('error', (e) => {
    document.body.innerHTML = `<div class="ypp-inline-392">Global Error: ${e.message}<br>File: ${e.filename}<br>Line: ${e.lineno}</div>`;
});
window.addEventListener('unhandledrejection', (e) => {
    document.body.innerHTML = `<div class="ypp-inline-393">Promise Rejection: ${e.reason}</div>`;
});
