const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + filePath);
    }
}

replaceInFile('troubleshoot/api-and-state/youtube-player-api-sync.md', [
    [/Volume Booster/g, 'Equaliser'],
    [/Volume Booster UI/g, 'Equaliser UI']
]);
replaceInFile('troubleshoot/troubleshooting-prompts.md', [
    [/Global Player Bar/gi, 'Global Bar']
]);
replaceInFile('README.md', [
    [/volume booster/gi, 'equaliser'],
    [/Volume Booster/g, 'Equaliser'],
    [/Global Player Bar/gi, 'Global Bar']
]);
replaceInFile('manifest.json', [
    [/volume booster/g, 'equaliser']
]);
replaceInFile('src/shared/utils/dom-manager.js', [
    [/volume booster/g, 'equaliser']
]);
replaceInFile('src/popup/scripts/features/domain-memory.js', [
    [/volume booster/gi, 'equaliser'],
    [/GLOBAL PLAYER BAR/g, 'GLOBAL BAR']
]);
replaceInFile('src/content/features/global-bar/domain/domain-memory.js', [
    [/Volume Booster/g, 'Equaliser']
]);
replaceInFile('src/content/pages/watch/player/media-effects/equaliser/equaliser.js', [
    [/Volume Booster disabled/g, 'Equaliser disabled']
]);
replaceInFile('src/content/features/global-bar/ui/global-bar-ui.js', [
    [/global player bar/gi, 'global bar']
]);
replaceInFile('src/content/features/global-bar/ui/global-bar-state.js', [
    [/Global Player Bar/gi, 'Global Bar']
]);
replaceInFile('src/content/features/global-bar/core/global-bar.js', [
    [/Global Player Bar/gi, 'Global Bar']
]);
replaceInFile('vite.config.external.js', [
    [/Global Player Bar/gi, 'Global Bar']
]);
replaceInFile('src/popup/styles/core/popup.css', [
    [/Global Player Bar/gi, 'Global Bar']
]);

const localeDir = 'src/shared/locales';
if (fs.existsSync(localeDir)) {
    const files = fs.readdirSync(localeDir);
    files.forEach(f => {
        if (!f.endsWith('.js')) return;
        replaceInFile(path.join(localeDir, f), [
            [/\"global_player_bar\":\s*\"Global Player Bar\"/g, '\"global_player_bar\": \"Global Bar\"'],
            [/\"volume_booster\":\s*\"Volume Booster\"/g, '\"volume_booster\": \"Equaliser\"']
        ]);
    });
}
