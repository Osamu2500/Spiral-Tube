const fs = require('fs');
const { JSDOM } = require('jsdom');

const contentJs = fs.readFileSync('dist/content.js', 'utf8');

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
  url: "https://www.youtube.com/",
  runScripts: "dangerously",
  virtualConsole: new (require('jsdom').VirtualConsole)()
});

dom.window.chrome = {
    runtime: { id: "test_extension_id", getURL: (p) => p, getManifest: () => ({ version: "2.3.0" }), onMessage: { addListener: () => {} } },
    storage: { local: { get: () => {}, onChanged: { addListener: () => {} } }, onChanged: { addListener: () => {} } }
};

dom.virtualConsole.on("jsdomError", (error) => {
  console.error("JSDOM Error:", error.stack || error);
});

dom.virtualConsole.on("error", (error) => {
  console.error("Console Error:", error);
});

try {
  dom.window.eval(contentJs);
  console.log("Successfully evaluated content.js");
  if (dom.window.YPP) {
      console.log("window.YPP exists!", Object.keys(dom.window.YPP));
  } else {
      console.log("window.YPP DOES NOT EXIST");
  }
} catch (e) {
  console.error("Evaluation Error:", e.stack || e);
}
