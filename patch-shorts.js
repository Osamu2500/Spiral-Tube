const fs = require('fs');

const path = 'src/popup/scripts/popup-schema.js';
let content = fs.readFileSync(path, 'utf8');

// Insert Shorts auto scroll and volume normalizer
content = content.replace(
    /(id:\s*'stopShortsLooping',[\s\S]*?},)/,
    `$1
          {
            type: 'toggle',
            id: 'shortsAutoScroll',
            label: 'Auto Scroll Shorts',
            desc: 'Automatically scroll to next short when finished',
            icon: ICONS.play,
          },
          {
            type: 'toggle',
            id: 'shortsVolumeNormalizer',
            label: 'Volume Normalizer',
            desc: 'Prevent loud jumps in volume',
            icon: ICONS.volumeUp,
          },`
);

// Insert Blacklist and Whitelist into Declutter
content = content.replace(
    /(id:\s*'hideClickbaitEnabled',[\s\S]*?},)/,
    `$1
          {
            type: 'toggle',
            id: 'channelBlacklistEnabled',
            label: 'Channel Blacklist',
            desc: 'Block specific channels from appearing',
            icon: ICONS.hide,
          },
          {
            type: 'toggle',
            id: 'channelWhitelistEnabled',
            label: 'Channel Whitelist',
            desc: 'Only allow specific channels to appear',
            icon: ICONS.check,
          },`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched shorts and filters');
