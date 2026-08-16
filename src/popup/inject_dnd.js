const fs = require('fs');
let html = fs.readFileSync('src/popup/popup.html', 'utf8');

// Add draggable="true" to settings-section
html = html.replace(/<div class="([^"]*?)settings-section([^"]*?)"/g, (match, p1, p2) => {
    if (match.includes('draggable')) return match;
    return `<div class="${p1}settings-section${p2}" draggable="true"`;
});

// Prepend drag handle into section-header
html = html.replace(/<div class="([^"]*?)section-header([^"]*?)">/g, (match) => {
    if (match.includes('drag-handle')) return match;
    return `${match}\n              <span class="drag-handle" title="Drag to reorder">&#8942;&#8942;</span>`;
});

fs.writeFileSync('src/popup/popup.html', html);
console.log('popup.html updated with drag and drop elements.');
