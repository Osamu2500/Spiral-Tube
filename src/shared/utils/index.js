import * as core from './modules/core.js';
import * as debug from './modules/debug.js';
import * as dom from './modules/dom.js';
import * as storage from './modules/storage.js';
import * as ui from './modules/ui.js';

window.YPP = window.YPP || {};
window.YPP.Utils = { ...core, ...debug, ...dom, ...storage, ...ui };

export * from './modules/core.js';
export * from './modules/debug.js';
export * from './modules/dom.js';
export * from './modules/storage.js';
export * from './modules/ui.js';
