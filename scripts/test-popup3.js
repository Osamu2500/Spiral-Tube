const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

(async () => {
  const extPath = path.resolve(__dirname, '..');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puppeteer-'));
  
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: tmpDir,
    args: [
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`
    ]
  });

  await new Promise(r => setTimeout(r, 2000));
  const targets = await browser.targets();
  const extTarget = targets.find(t => t.type() === 'service_worker' || t.type() === 'background_page' || (t.url() && t.url().startsWith('chrome-extension://')));
  const extUrl = extTarget.url();
  const extId = extUrl.split('/')[2];

  const page = await browser.newPage();
  
  // Capture console
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto(`chrome-extension://${extId}/src/popup/popup.html`);
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
