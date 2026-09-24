import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('./src');
const EXTS = ['.js', '.ts', '.css', '.html'];

// Helper to recursively get all files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      if (EXTS.some(ext => filePath.endsWith(ext))) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const allFiles = getAllFiles(SRC_DIR).map(f => f.replace(/\\/g, '/'));
const referencedFiles = new Set();

// Entry points that are naturally not imported by anything
const ENTRY_POINTS = [
  'src/content/entry/index.ts',
  'src/content/entry/main.ts',
  'src/content/entry/core-init.ts',
  'src/content/styles/base-ui-design/index.css',
  'src/background/index.ts',
  'src/popup/scripts/core/popup-main.js',
  'src/service-worker.js',
  'src/declarative_net_request/rules.json',
  'src/shared/config/constants/index.js'
];

ENTRY_POINTS.forEach(ep => {
    const fullPath = path.resolve(ep).replace(/\\/g, '/');
    referencedFiles.add(fullPath);
});

// Regex to find imports
const importRegex = /(?:import|export)\s+(?:.*?from\s+)?['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\)|@import\s+['"]?([^'"\)]+)['"]?|<script.*?src=['"]([^'"]+)['"].*?>|<link.*?href=['"]([^'"]+)['"].*?>/g;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1] || match[2] || match[3] || match[4] || match[5];
    if (!importPath || importPath.startsWith('http') || importPath.startsWith('chrome-extension')) continue;
    
    // Strip query strings
    if (importPath.includes('?')) {
        importPath = importPath.split('?')[0];
    }
    
    // Resolve relative paths
    if (!importPath.startsWith('/') || importPath.startsWith('./') || importPath.startsWith('../')) {
      let resolved = path.resolve(path.dirname(filePath), importPath).replace(/\\/g, '/');
      
      // If it's a CSS file imported without extension? usually has it.
      if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.js')) resolved += '.js';
      if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.ts')) resolved += '.ts';
      if (!fs.existsSync(resolved) && fs.existsSync(resolved + '/index.js')) resolved += '/index.js';
      
      if (fs.existsSync(resolved)) {
        if (!referencedFiles.has(resolved)) {
          referencedFiles.add(resolved);
          if (filePath.includes('popup-main.js') || filePath.includes('features/index.js')) {
            console.log(`[DEBUG] ${filePath} -> ${resolved}`);
          }
          processFile(resolved); // recursively process
        }
      }
    } else if (importPath.startsWith('/src/')) {
        // Absolute from root
        let resolved = path.resolve('.' + importPath).replace(/\\/g, '/');
        if (fs.existsSync(resolved)) {
            if (!referencedFiles.has(resolved)) {
                referencedFiles.add(resolved);
                processFile(resolved);
            }
        }
    }
  }
}

// Start from all known entries
const initialEntries = Array.from(referencedFiles);
initialEntries.forEach(ep => processFile(ep));

// Also treat popup HTMLs as entries
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
htmlFiles.forEach(f => {
    referencedFiles.add(f);
    processFile(f);
});

// Also parse manifest.json
const manifestPath = path.resolve('./manifest.json');
if (fs.existsSync(manifestPath)) {
    const manifest = fs.readFileSync(manifestPath, 'utf-8');
    let match;
    const manifestRegex = /"([^"]+\.(?:js|css|html|ts))"/g;
    while ((match = manifestRegex.exec(manifest)) !== null) {
        const filePath = path.resolve(match[1]).replace(/\\/g, '/');
        if (fs.existsSync(filePath) && filePath.includes('/src/')) {
            referencedFiles.add(filePath);
            processFile(filePath);
        }
    }
}


const orphans = allFiles.filter(f => !referencedFiles.has(f));

console.log('--- ORPHAN FILES ---');
orphans.forEach(o => {
    // Only log src files
    if (o.includes('/src/')) {
        console.log(o.substring(o.indexOf('/src/')));
    }
});
console.log(`Total Orphans: ${orphans.length}`);
