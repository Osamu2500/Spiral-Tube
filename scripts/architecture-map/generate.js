/**
 * scripts/generate-architecture-map.js
 * 
 * Purpose: Scans the `src/content` directory and orchestrates the parsing 
 * and resolution of metadata to generate a comprehensive architecture map.
 */

const fs = require('fs');
const path = require('path');
const parser = require('./lib/parser');
const resolver = require('./lib/resolver');

const SRC_DIR = path.resolve(__dirname, '../../src/content');
const DATA_FILE = path.resolve(__dirname, '../../docs/js/data.js');

function scanFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function generateMap() {
  const files = scanFiles(SRC_DIR);
  const dataMap = new Map();

  // Phase 1: Parse/Infer all files
  files.forEach(file => {
    let content;
    let stats;
    try {
      content = fs.readFileSync(file, 'utf-8');
      stats = fs.statSync(file);
    } catch (e) {
      console.warn(`Could not read file ${file}. Skipping.`);
      return;
    }

    const header = parser.parseHeader(content);
    
    const sizeKB = (stats.size / 1024).toFixed(1) + ' KB';
    const loc = content.split('\n').length;
    
    let exportsList = [];
    let expMatch;
    while ((expMatch = parser.EXPORT_REGEX.exec(content)) !== null) {
      exportsList.push(expMatch[1]);
    }
    const defaultMatch = content.match(parser.DEFAULT_EXPORT_REGEX);
    if (defaultMatch) {
      exportsList.push(defaultMatch[1] + ' (default)');
    } else if (content.includes('export default')) {
      exportsList.push('default');
    }

    let entry;
    if (header) {
      entry = {
        path: path.relative(SRC_DIR, file).replace(/\\/g, '/'),
        category: header.category,
        purpose: header.purpose,
        targets: header.targets,
        depends: header.depends,
        dependedBy: header.depended_by,
        storage: header.storage,
        observers: header.observers
      };
    } else {
      entry = parser.inferMetadata(file, content, SRC_DIR);
    }
    
    entry.size = sizeKB;
    entry.loc = loc;
    entry.exports = exportsList.length > 0 ? exportsList.join(', ') : 'none';
    
    dataMap.set(entry.path, entry);
  });

  // Phase 2: Compute dependedBy based on depends
  resolver.computeReverseDependencies(dataMap);

  // Phase 3: Write to JS Data file
  const dataArray = Array.from(dataMap.values());
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const outputContent = `window.ARCHITECTURE_DATA = ${JSON.stringify(dataArray, null, 2)};`;
  fs.writeFileSync(DATA_FILE, outputContent, 'utf-8');

  console.log(`✅ Architecture map generated successfully at ${DATA_FILE}`);
  console.log(`Processed ${dataArray.length} files.`);
}

generateMap();
