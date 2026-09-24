const fs = require("fs"); 
const path = require("path");
const content = fs.readFileSync("src/popup/scripts/features/index.js", "utf8"); 
const importRegex = /(?:import|export)\s+(?:.*?from\s+)?['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\)|@import\s+['"]?([^'"\)]+)['"]?|<script.*?src=['"]([^'"]+)['"].*?>|<link.*?href=['"]([^'"]+)['"].*?>/g; 
let match; 
while ((match = importRegex.exec(content)) !== null) { 
    console.log("Matched: " + match[1]); 
}
