const fs = require("fs");
const path = require("path");

const KEEP = ["abyss", "sakura", "vintage", "aurora", "autumn"];
const uiStylesDir = "src/content/ui-styles";

let fixedCount = 0;

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDir(full);
        } else if (entry.name.endsWith(".css")) {
            let content = fs.readFileSync(full, "utf8");
            // Check if the file is a single-line minified CSS with escaped \n
            if (content.includes("\\n") && content.split("\n").length < 5) {
                // Unescape \n -> real newlines, \t -> real tabs
                const fixed = content
                    .replace(/\\n/g, "\n")
                    .replace(/\\t/g, "\t");
                fs.writeFileSync(full, fixed);
                fixedCount++;
                console.log("Fixed: " + full);
            }
        }
    }
}

const themes = fs.readdirSync(uiStylesDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .filter(name => !KEEP.includes(name));

for (const theme of themes) {
    processDir(path.join(uiStylesDir, theme));
}

console.log(`\nFixed ${fixedCount} files.`);
