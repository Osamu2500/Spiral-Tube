const path = require('path');

const HEADER_REGEX = /\/\*\*([\s\S]*?)\*\//;
const SELECTOR_REGEX = /(?:querySelector|getElementById|getElementsByClassName)\(['"`](.*?)['"`]\)/g;
const EXPORT_REGEX = /export\s+(?:const|let|var|function|class)\s+([a-zA-Z0-9_]+)/g;
const DEFAULT_EXPORT_REGEX = /export\s+default\s+([a-zA-Z0-9_]+)/;

function parseHeader(content) {
  const match = content.match(HEADER_REGEX);
  if (!match) return null;

  const headerText = match[1];
  const fields = ['file', 'purpose', 'targets', 'depends', 'depended_by', 'storage', 'observers', 'category'];
  const result = {};

  fields.forEach(field => {
    const fieldRegex = new RegExp(`@${field}\\s+([^@]+)`);
    const fieldMatch = headerText.match(fieldRegex);
    if (fieldMatch) {
      let value = fieldMatch[1].trim();
      value = value.replace(/\n\s*\*\s*/g, ' ').trim();
      
      if (['depends', 'depended_by'].includes(field)) {
         result[field] = value === 'none' ? [] : value.split(',').map(s => s.trim());
      } else {
         result[field] = value;
      }
    }
  });

  const isValid = fields.every(field => result[field] !== undefined);
  return isValid ? result : null;
}

function extractFirstBlockComment(content) {
  const match = content.match(HEADER_REGEX);
  if (match) {
    // Strip leading stars and empty lines
    const lines = match[1].split('\n')
      .map(line => line.replace(/^\s*\*\s*/, '').trim())
      .filter(line => line.length > 0 && !line.startsWith('@'));
    return lines.join(' ').substring(0, 300);
  }
  return null;
}

function inferMetadata(filePath, content, SRC_DIR) {
  const relPath = path.relative(SRC_DIR, filePath).replace(/\\/g, '/');
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);
  
  // Category inference
  const parts = relPath.split('/');
  let category = 'uncategorized';
  if (parts.length > 1) {
    category = parts.slice(0, parts.length - 1).join('/');
  }

  // Purpose inference
  let purpose = 'No description available.';
  const blockComment = extractFirstBlockComment(content);
  if (blockComment) {
    purpose = blockComment;
  } else if (ext === '.css') {
    purpose = `Styles for ${fileName.replace('.css', '')}`;
  } else {
    const classMatch = content.match(/class\s+(\w+)/);
    if (classMatch) {
      purpose = `Implements ${classMatch[1]}`;
    } else if (content.includes('function')) {
      purpose = `Utility/Function module`;
    }
  }

  // Targets inference
  let targets = [];
  let match;
  while ((match = SELECTOR_REGEX.exec(content)) !== null) {
    if (!targets.includes(match[1])) targets.push(match[1]);
  }
  let targetsStr = targets.length > 0 ? targets.join(', ') : 'none';

  // Storage inference
  let storage = [];
  if (content.includes('chrome.storage')) storage.push('chrome.storage');
  if (content.includes('YPP.settings') || content.includes('this.settings')) storage.push('YPP.settings');
  let storageStr = storage.length > 0 ? storage.join(', ') : 'none';

  // Observers inference
  let observers = [];
  if (content.includes('MutationObserver')) observers.push('MutationObserver');
  if (content.includes('IntersectionObserver')) observers.push('IntersectionObserver');
  if (content.includes('ResizeObserver')) observers.push('ResizeObserver');
  let observersStr = observers.length > 0 ? observers.join(', ') : 'none';

  // Depends inference
  let depends = [];
  const importRegex = ext === '.css' 
    ? /@import\s+url\(['"]?(.*?)['"]?\)/g 
    : /import\s+.*?\s+from\s+['"`](.*?)['"`]/g;
    
  while ((match = importRegex.exec(content)) !== null) {
    let depPath = match[1];
    if (depPath.startsWith('.')) {
      depPath = path.relative(SRC_DIR, path.resolve(path.dirname(filePath), depPath)).replace(/\\/g, '/');
    }
    depends.push(depPath);
  }

  return {
    path: relPath,
    category,
    purpose,
    targets: targetsStr,
    depends,
    dependedBy: [], // Will compute globally
    storage: storageStr,
    observers: observersStr
  };
}

module.exports = {
  EXPORT_REGEX,
  DEFAULT_EXPORT_REGEX,
  parseHeader,
  inferMetadata
};
