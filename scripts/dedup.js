const fs = require('fs');
const path = require('path');

const togglesDir = 'f:\\Youtube 2.0\\src\\content\\design-system\\features\\toggles';

// The 5 main chunks that might contain duplicates
const mainChunks = ['components.css', 'layout.css', 'misc.css', 'player.css', 'search.css'];

// The small separated files
const smallFiles = [];
const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.css') && !mainChunks.includes(file)) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

walkSync(togglesDir, smallFiles);

console.log('Found ' + smallFiles.length + ' small toggle files.');

// Read all main chunks
const chunkContents = {};
mainChunks.forEach(chunk => {
  const p = path.join(togglesDir, chunk);
  if (fs.existsSync(p)) {
    chunkContents[chunk] = fs.readFileSync(p, 'utf8');
  }
});

let removedCount = 0;

smallFiles.forEach(smallFile => {
  const code = fs.readFileSync(smallFile, 'utf8').trim();
  if (code.length < 10) return;

  // We only replace exact blocks.
  // The small files were originally extracted by taking blocks like `/* === NAME === */ ... `
  // Let's just find the exact CSS block (ignoring whitespace if possible, but exact match is safer).
  const lines = code.split('\n').filter(l => l.trim() && !l.includes('/*') && !l.includes('*/'));
  if (lines.length === 0) return;
  
  const searchString = lines.join('\n').trim();

  // Very naive: try to replace the exact file content (minus any wrapping comments we added).
  // Actually, since I know the exact headers were used to split, let's just find the headers!
  // Wait, the small files have exact code inside.
  
  mainChunks.forEach(chunk => {
      if (!chunkContents[chunk]) return;
      
      // Let's try replacing the exact `code`
      if (chunkContents[chunk].includes(code)) {
          chunkContents[chunk] = chunkContents[chunk].replace(code, '');
          removedCount++;
          console.log(`Removed duplicate from ${chunk} for ${path.basename(smallFile)}`);
      } else {
          // Try a fuzzy match or header match?
          // I will just use regex to match the selector.
          const firstSelector = lines[0].split('{')[0].trim();
          if (firstSelector && chunkContents[chunk].includes(firstSelector)) {
             console.log(`WARNING: Code not exact, but selector ${firstSelector} found in ${chunk}. Manual check may be needed for ${path.basename(smallFile)}.`);
          }
      }
  });
});

mainChunks.forEach(chunk => {
  if (chunkContents[chunk]) {
    fs.writeFileSync(path.join(togglesDir, chunk), chunkContents[chunk]);
  }
});

console.log('Done! Removed ' + removedCount + ' duplicates.');
