const fs = require('fs');
const path = require('path');

const themes = ['abyss', 'aurora', 'autumn', 'bento', 'bloodmoon', 'christmas', 'claymorphism'];

const newSelectorTpl = (themeName) => `html[data-ypp-theme="${themeName}"] :is(
  ytd-rich-item-renderer,
  ytd-video-renderer,
  ytd-playlist-renderer,
  ytd-radio-renderer,
  ytd-channel-renderer,
  ytd-compact-video-renderer,
  ytd-grid-video-renderer,
  .ypp-grid-item,
  yt-lockup-view-model:not(
    :is(
      ytd-rich-item-renderer,
      ytd-video-renderer,
      ytd-playlist-renderer,
      ytd-radio-renderer,
      ytd-channel-renderer,
      ytd-compact-video-renderer,
      ytd-grid-video-renderer,
      .ypp-grid-item
    ) *
  )
)`;

const newHoverSelectorTpl = (themeName) => `html[data-ypp-theme="${themeName}"] :is(
  ytd-rich-item-renderer,
  ytd-video-renderer,
  ytd-playlist-renderer,
  ytd-radio-renderer,
  ytd-channel-renderer,
  ytd-compact-video-renderer,
  ytd-grid-video-renderer,
  .ypp-grid-item,
  yt-lockup-view-model:not(
    :is(
      ytd-rich-item-renderer,
      ytd-video-renderer,
      ytd-playlist-renderer,
      ytd-radio-renderer,
      ytd-channel-renderer,
      ytd-compact-video-renderer,
      ytd-grid-video-renderer,
      .ypp-grid-item
    ) *
  )
):hover`;

themes.forEach(theme => {
  const cardsFile = path.join(__dirname, '..', 'src', 'content', 'ui-styles', theme, 'components', 'cards.css');
  if (fs.existsSync(cardsFile)) {
    let content = fs.readFileSync(cardsFile, 'utf8');

    // 1. We replace the main selector block
    // We match `html[data-ypp-theme="themename"] :is(...) {`
    // OR legacy `html[data-ypp-theme="themename"] ytd-rich-grid-media, ... {`
    
    // Regex for the main selector block ending with `{`
    const regexMain = new RegExp(`html\\[data-ypp-theme="${theme}"\\](?:\\s*:is\\([\\s\\S]*?\\)|(?:\\s*[\\w\\-\\.\\#]+,?\\s*)+)\\s*\\{`, 'g');
    
    // Regex for hover selector block
    const regexHover = new RegExp(`html\\[data-ypp-theme="${theme}"\\](?:\\s*:is\\([\\s\\S]*?\\)|(?:\\s*[\\w\\-\\.\\#]+:hover,?\\s*)+):hover\\s*\\{`, 'g');

    // It's safer to just find the blocks manually by looking for the first `html[data-ypp-theme="..."] ` before `{`
    // Let's do a simple regex that finds the first block of selectors for the base and hover state.
    // Actually, for bloodmoon, christmas, claymorphism, they use:
    // html[data-ypp-theme="claymorphism"] ytd-rich-item-renderer,
    // html[data-ypp-theme="claymorphism"] ytd-grid-video-renderer, ... {
    
    // Since regex might fail, I'll do string replacements.
    
    // Since this script might be tricky with regex, let me write a simpler approach: 
    // Just find the block ending with `{` that contains `ytd-video-renderer` and doesn't contain `:hover`.
  }
});
