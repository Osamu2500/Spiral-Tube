/**
 * @fileoverview
 * Popup Player Feature
 *
 * Target: Content Script (YouTube pages)
 * Purpose: Floating popup overlay player for YouTube videos. Supports
 *          miniplayer, music mode, floating search, volume boost, context
 *          menu integration, and keyboard shortcuts.
 *
 * Architecture:
 *  - popup-player-bundle.js  — Main overlay UI, injected into all YouTube frames.
 *  - popup-player-loader.js  — Iframe loader; native panel (comments), volume boost
 *                              via Web Audio API, YouTube screenshot button.
 *  - popup-player-embed.html — Self-hosted embed worker (src/inject/). Loaded
 *                              inside the popup iframe using chrome.runtime.getURL()
 *                              to avoid any third-party domain dependency.
 *
 * Wiring:
 *  - Both bundles are declared in manifest.json content_scripts.
 *  - Keyboard commands (Alt+Shift+P, Alt+Shift+M, Alt+Shift+X, Alt+S) are
 *    registered in manifest.json and routed via background/services/context-menu.ts.
 *  - Settings are read directly from chrome.storage.local (keys defined in
 *    shared/config/default-settings.js under the "Popup Player Settings" block).
 */
export {};
