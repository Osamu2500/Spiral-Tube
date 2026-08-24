import re

with open('src/content/pages/watch/player/media-effects/video-filters/video-filters-ui.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS import and VideoFiltersPresets import at the top
content = "import './video-filters-ui.css';\nimport { VideoFiltersPresets } from './video-filters-presets.js';\n" + content

# 2. Empty out _injectStyles()
inject_styles_pattern = re.compile(r'(static _injectStyles\(\) \{).*?(^\s*\}\s*$)', re.MULTILINE | re.DOTALL)
# But wait, to be totally safe, I'll just use string replacement for the exact document.head.appendChild block.
# Actually, replacing the whole body of _injectStyles() is easiest.
def replace_inject(match):
    return match.group(1) + "\n    }\n"

# We can find `static _injectStyles() {` and replace everything until the matching `}`.
# But it's easier to just regex the specific `document.createElement('style')`...`appendChild(style);`
style_block_pattern = re.compile(
    r'\s*if\s*\(document\.getElementById\(\'ypp-cinema-styles\'\)\).*?document\.head\.appendChild\(style\);',
    re.DOTALL
)
content = style_block_pattern.sub('', content)

# 3. Remove the this._injectStyle calls
star_btn_pattern = re.compile(r'\s*this\._injectStyle\(\'ypp-star-btn-style\',\s*`.*?`\);', re.DOTALL)
content = star_btn_pattern.sub('', content)

adj_v2_pattern = re.compile(r'\s*this\._injectStyle\(\'ypp-adj-v2-styles\',\s*`.*?`\);', re.DOTALL)
content = adj_v2_pattern.sub('', content)

# 4. Remove window.YPP global export at the bottom
global_export_pattern = re.compile(r'window\.YPP\.features\s*=\s*window\.YPP\.features\s*\|\|\s*\{\};\s*window\.YPP\.features\.VideoFiltersUI\s*=\s*VideoFiltersUI;', re.DOTALL)
content = global_export_pattern.sub('', content)

# 5. Replace references to window.YPP.features.VideoFiltersPresets with VideoFiltersPresets
content = content.replace('window.YPP?.features?.VideoFiltersPresets', 'VideoFiltersPresets')
content = content.replace('window.YPP.features.VideoFiltersPresets', 'VideoFiltersPresets')

with open('src/content/pages/watch/player/media-effects/video-filters/video-filters-ui.js', 'w', encoding='utf-8') as f:
    f.write(content)
