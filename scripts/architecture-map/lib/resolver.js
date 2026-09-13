function resolveDep(baseDep, dataMap) {
  if (dataMap.has(baseDep)) return baseDep;
  
  // Check with extensions
  const extensions = ['.js', '.ts', '.css'];
  for (const ext of extensions) {
    if (dataMap.has(baseDep + ext)) return baseDep + ext;
  }
  
  // Check for index files
  for (const ext of extensions) {
    const indexPath = baseDep + '/index' + ext;
    if (dataMap.has(indexPath)) return indexPath;
  }
  
  // Partial match fallback
  const partialMatch = Array.from(dataMap.keys()).find(k => k.endsWith(baseDep) || k.endsWith(baseDep + '.js'));
  return partialMatch || baseDep;
}

function computeReverseDependencies(dataMap) {
  for (const [filepath, entry] of dataMap.entries()) {
    const resolvedDeps = [];
    entry.depends.forEach(dep => {
      const resolved = resolveDep(dep, dataMap);
      resolvedDeps.push(resolved);
      
      const targetEntry = dataMap.get(resolved);
      if (targetEntry) {
        if (!targetEntry.dependedBy) targetEntry.dependedBy = [];
        if (!targetEntry.dependedBy.includes(filepath)) {
          targetEntry.dependedBy.push(filepath);
        }
      }
    });
    entry.depends = resolvedDeps;
  }
}

module.exports = {
  computeReverseDependencies
};
