const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('f:/Spiral Tube/src/popup/popup.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });

dom.window.chrome = {
  storage: { local: { get: () => {}, set: () => {} }, sync: { get: () => {}, set: () => {} } },
  runtime: { getURL: () => '', sendMessage: () => {}, lastError: null },
  i18n: { getMessage: (k) => k }
};

dom.window.console.error = function(...args) {
    console.log('[JSDOM ERROR]', ...args);
};

// We cannot easily run ES modules natively in JSDOM, but we can do a quick check
console.log('JSDOM loaded.');
