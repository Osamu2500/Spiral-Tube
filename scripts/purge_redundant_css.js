const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const TARGET_DIRS = [
  path.join(__dirname, '../src/content/core-framework/ui-styles'),
  path.join(__dirname, '../src/content/core-framework/card-styles')
];

// Selectors that are already handled globally by core-framework/components/cards.css
// Any rule containing THESE as primary targets in overrides.css is bloated and should be purged,
// unless it contains keyframes or very specific complex states.
const REDUNDANT_SELECTORS = [
  'ytd-rich-item-renderer',
  'ytd-video-renderer',
  'ytd-playlist-renderer',
  'ytd-radio-renderer',
  'ytd-channel-renderer',
  'ytd-compact-video-renderer',
  'ytd-grid-video-renderer',
  '.ypp-grid-item',
  'ytd-reel-item-renderer',
  'ytd-rich-shelf-renderer',
  'ytd-comment-thread-renderer',
  'ytd-playlist-panel-renderer',
  'ytd-watch-metadata',
  'ytd-account-item-renderer',
  'ytd-guide-entry-renderer',
  'ytd-mini-guide-entry-renderer',
  'ytd-search-filter-renderer',
  'ytd-macro-markers-list-item-renderer',
  'ytd-c4-tabbed-header-renderer',
  'ytd-live-chat-renderer',
  'yt-live-chat-text-message-renderer',
  'ytd-miniplayer',
  '.ytp-settings-menu',
  '.ytp-chrome-bottom',
  '.ytp-endscreen-content',
  '.ytp-ce-element',
  'yt-error-screen',
  'ytd-thumbnail',
  'yt-image',
  'ytd-playlist-thumbnail',
  'yt-img-shadow',
  '.yt-spec-avatar-shape__image',
  '.yt-spec-button-shape-next',
  'yt-button-shape button',
  'yt-chip-cloud-chip-renderer',
  '.yt-chip-shape',
  '.ytChipShapeChip',
  'ytd-browse[page-subtype=home] #chips',
  'button[aria-label*="Download" i]',
  'button[title*="Download" i]'
];

const plugin = postcss.plugin('purge-bloat', () => {
  return (root) => {
    root.walkRules((rule) => {
      // If the rule's selector ONLY contains redundant targets and basic styling, kill it.
      let isRedundant = false;
      for (const sel of REDUNDANT_SELECTORS) {
        if (rule.selector.includes(sel)) {
          isRedundant = true;
          break;
        }
      }
      
      // But keep rules if they contain animations, highly specific sub-elements (like #video-title), etc.
      // Actually, since the new architecture delegates ALL structural shape/shadow to tokens,
      // we can safely remove rules that strictly just set border-radius, box-shadow, clip-path, background, filter.
      
      if (isRedundant) {
        let hasCustomProperties = false;
        rule.walkDecls(decl => {
            const prop = decl.prop;
            // Properties that are safe to delete because they are tokenized globally
            const isStructural = ['border-radius', 'box-shadow', 'clip-path', 'background-image', 'background', 'filter', 'backdrop-filter', 'transform', 'border', 'padding', 'margin'].includes(prop);
            
            // If there's a property that is NOT structural (e.g., color, font-size, animation), keep the rule.
            if (!isStructural && prop !== 'color' && prop !== 'font-family') {
                hasCustomProperties = true;
            }
            if (prop === 'animation') {
                hasCustomProperties = true; // DEFINITELY keep animations
            }
        });

        if (!hasCustomProperties) {
            // It's completely redundant!
            rule.remove();
        }
      }
    });

    // Clean up empty media queries or at-rules
    root.walkAtRules((atRule) => {
      if (atRule.nodes && atRule.nodes.length === 0) {
        atRule.remove();
      }
    });
  };
});

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processDirectory(fullPath);
    } else if (file === 'overrides.css' || (dir.includes('card-styles') && file.endsWith('.css') && file !== 'index.css' && file !== 'tokens.css')) {
      const css = fs.readFileSync(fullPath, 'utf8');
      const originalSize = css.length;
      
      const result = await postcss([plugin()]).process(css, { from: fullPath, to: fullPath });
      
      // Clean up multiple blank lines
      const cleanCss = result.css.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
      
      if (cleanCss.length === 0 || cleanCss === '/* Unique Shapes and Patterns */' || cleanCss === '/* Empty Overrides */') {
          // File is empty, we can delete it!
          fs.unlinkSync(fullPath);
          console.log(`🗑️ DELETED empty file: ${fullPath.replace(__dirname, '')}`);
          
          // Remove the @import from index.css
          const indexCssPath = path.join(path.dirname(fullPath), 'index.css');
          if (fs.existsSync(indexCssPath)) {
              let indexCss = fs.readFileSync(indexCssPath, 'utf8');
              indexCss = indexCss.replace(/@import\s+['"]\.\/overrides\.css['"];?\n?/g, '');
              fs.writeFileSync(indexCssPath, indexCss);
          }
      } else if (cleanCss.length < originalSize) {
          fs.writeFileSync(fullPath, cleanCss);
          const savedKB = ((originalSize - cleanCss.length) / 1024).toFixed(2);
          console.log(`✅ PURGED: ${fullPath.replace(__dirname, '')} (-${savedKB} KB)`);
      }
    }
  }
}

async function run() {
  console.log('🚀 Starting Redundant CSS Purge...');
  for (const dir of TARGET_DIRS) {
    if (fs.existsSync(dir)) {
      await processDirectory(dir);
    }
  }
  console.log('✨ Purge Complete!');
}

run().catch(console.error);
