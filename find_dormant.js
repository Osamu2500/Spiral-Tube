const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, exts, fileList);
        } else if (exts.includes(path.extname(filePath))) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const allFiles = getAllFiles(path.join(__dirname, 'src'), ['.js', '.ts', '.css']);
const dormantFiles = [];

for (const file of allFiles) {
    const filename = path.basename(file);
    // index.ts and styles are usually entry points
    if (filename === 'index.ts' || filename === 'service-worker.js' || filename === 'content.js' || filename === 'page-bridge.js' || filename.endsWith('.json')) {
        continue;
    }
    
    // Check if imported anywhere
    let isImported = false;
    for (const otherFile of allFiles) {
        if (file === otherFile) continue;
        const content = fs.readFileSync(otherFile, 'utf8');
        // Simple heuristic: check if filename exists in the content
        if (content.includes(filename) || content.includes(filename.replace(/\.(js|ts|css)$/, ''))) {
            isImported = true;
            break;
        }
    }
    
    if (!isImported) {
        dormantFiles.push(file);
    }
}

console.log("DORMANT/ORPHANED FILES FOUND:");
dormantFiles.forEach(f => console.log(f.replace(__dirname, '')));
