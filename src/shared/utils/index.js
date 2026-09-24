import * as core from './core/core.js';
import * as debug from './core/debug.js';
import * as dom from './dom/dom.js';
import * as storage from './storage/storage.js';
import * as ui from './dom/ui.js';

window.YPP = window.YPP || {};
window.YPP.Utils = { ...core, ...debug, ...dom, ...storage, ...ui };

export * from './core/core.js';
export * from './core/debug.js';
export * from './dom/dom.js';
export * from './storage/storage.js';
export * from './dom/ui.js';
