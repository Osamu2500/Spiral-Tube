const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const {search, replace} of replacements) {
        content = content.split(search).join(replace);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No changes made to ${filePath}`);
    }
}

replaceInFile('src/content/global/components/chips/chips.css', [
    { search: 'var(--yt-spec-10-percent-layer)', replace: 'var(--ypp-glass-bg-hover, rgba(255, 255, 255, 0.1))' },
    { search: 'var(--yt-spec-20-percent-layer)', replace: 'var(--ypp-surface-bg-active, rgba(255, 255, 255, 0.18))' }
]);
