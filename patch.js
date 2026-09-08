const fs = require('fs');
let content = fs.readFileSync('src/popup/scripts/schema/tabs/tab-declutter.js', 'utf8');

// 1. Remove filterMode
content = content.replace(/\{\s*type:\s*'select',\s*id:\s*'filterMode'[\s\S]*?\},/m, '');

// 2. Change .hw-mode-btn to .feature-mode-btn in hideWatched style
content = content.replace(/\.hw-mode-btn/g, '.feature-mode-btn');

// Helper to create the Dim/Hide HTML
const getDimHideHTML = (featureId) => `<div style="display:inline-flex; background:rgba(0,0,0,0.3); border-radius:10px; padding:3px; border: 1px solid rgba(255,255,255,0.05); margin-right:12px;"><button type="button" class="feature-mode-btn active" data-feature="${featureId}" data-mode="dim">Dim</button><button type="button" class="feature-mode-btn" data-feature="${featureId}" data-mode="hide">Hide</button></div><input type="hidden" id="${featureId}Mode" value="hide" />`;

// 3. Inject Dim/Hide into aggressiveShortsBlock
content = content.replace(
  /(id:\s*'aggressiveShortsBlock'[\s\S]*?inlineSlot:\s*'<style>.*?<\/style><div style="display:flex; align-items:center; flex:1; gap:24px;"><div style="display:flex; align-items:center; justify-content:flex-start; flex:1; gap:12px;">)(<\/div>)/,
  `$1${getDimHideHTML('aggressiveShortsBlock')}$2`
);

// 4. Inject Dim/Hide into viewsFilterEnabled
content = content.replace(
  /(id:\s*'viewsFilterEnabled'[\s\S]*?inlineSlot:\s*'<div style="display:flex; align-items:center; flex:1; gap:24px;"><div style="display:flex; align-items:center; justify-content:flex-start; flex:1; gap:12px;">)/,
  `$1${getDimHideHTML('viewsFilterEnabled')}`
);

// 5. Inject Dim/Hide into dateFilterEnabled
content = content.replace(
  /(id:\s*'dateFilterEnabled'[\s\S]*?inlineSlot:\s*'<div style="display:flex; align-items:center; flex:1; gap:24px;"><div style="display:flex; align-items:center; justify-content:flex-start; flex:1; gap:16px;">)/,
  `$1${getDimHideHTML('dateFilterEnabled')}`
);

// 6. Inject Dim/Hide into hideLiveStreams and hideUpcoming (they don't have inlineSlot yet, so we add it)
content = content.replace(
  /(id:\s*'hideLiveStreams',\s*class:\s*'span-1',\s*label:\s*'Live Streams',[\s\S]*?icon: P\('.*?'\)),/m,
  `$1, inlineSlot: '<div style="display:flex; align-items:center; margin-left:auto; transform:scale(0.85); transform-origin:right;">${getDimHideHTML('hideLiveStreams')}</div>',`
);

content = content.replace(
  /(id:\s*'hideUpcoming',\s*class:\s*'span-1',\s*label:\s*'Upcoming & Premieres',[\s\S]*?icon: P\('.*?'\)),/m,
  `$1, inlineSlot: '<div style="display:flex; align-items:center; margin-left:auto; transform:scale(0.85); transform-origin:right;">${getDimHideHTML('hideUpcoming')}</div>',`
);

// 7. Inject Dim/Hide into Playlists, Mixes, Podcasts, Community Posts
const contentFeatures = ['hidePlaylists', 'hideMixes', 'hidePodcasts', 'hidePosts'];
for (const feature of contentFeatures) {
  const regex = new RegExp(`(id:\\s*'${feature}'[\\s\\S]*?inlineSlot:\\s*'<div style="display:flex; align-items:center; gap:6px; margin-left:auto; flex:1; justify-content:flex-end;">)`);
  content = content.replace(regex, `$1${getDimHideHTML(feature)}`);
}

// 8. hideWatched uses id="hwMode-dim" and data-mode="dim", let's replace it to use the new generic data-feature="hideWatched"
content = content.replace(
  /<button type="button" id="hwMode-dim" class="feature-mode-btn active" data-mode="dim">Dim<\/button><button type="button" id="hwMode-hide" class="feature-mode-btn" data-mode="hide">Hide<\/button>/,
  '<button type="button" class="feature-mode-btn active" data-feature="hideWatched" data-mode="dim">Dim</button><button type="button" class="feature-mode-btn" data-feature="hideWatched" data-mode="hide">Hide</button>'
);

fs.writeFileSync('src/popup/scripts/schema/tabs/tab-declutter.js', content, 'utf8');
console.log('Modified tab-declutter.js');
