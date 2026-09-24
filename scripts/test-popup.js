const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

(async () => {
  const extPath = path.resolve(__dirname, '..');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puppeteer-'));
  
  console.log('Launching browser with extension from:', extPath);
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
  if (!extTarget) {
      console.log('Could not find extension target! Targets:');
      for (const t of targets) console.log(t.type(), t.url());
      await browser.close();
      return;
  }
  
  const extUrl = extTarget.url();
  const extId = extUrl.split('/')[2];
  console.log('Extension ID:', extId);

  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Opening popup...');
  await page.goto(`chrome-extension://${extId}/src/popup/popup.html`);
  
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
