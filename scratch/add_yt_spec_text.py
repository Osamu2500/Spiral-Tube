import os

themes_dir = r"F:\Youtube 2.0\src\content\design-system\themes"

light_themes = [
    'kawaii', 'hologram', 'vintage', 'blue-sky', 'technozen', 'frutiger-aero', 
    'claymorphism', 'neo-brutalism', 'brutalism', 'y2k', 'sakura', 'steampunk', 
    'woodblock', 'origami', 'ice-blue', 'crystal-glass', 'cherry'
]

block = """
  /* Critical YouTube Overrides for Light Themes */
  --yt-spec-text-primary: #0f0f0f !important;
  --yt-spec-text-secondary: rgba(0,0,0,0.7) !important;
  --yt-spec-icon-inactive: #0f0f0f !important;
  --yt-spec-icon-active-other: #0f0f0f !important;
  --yt-spec-brand-icon-inactive: #0f0f0f !important;
  --yt-spec-brand-icon-active: #0f0f0f !important;
"""

for theme in light_themes:
    index_css = os.path.join(themes_dir, theme, 'index.css')
    if not os.path.exists(index_css):
        print(f"Not found: {theme}")
        continue
        
    with open(index_css, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if '--yt-spec-text-primary' not in content:
        # insert before the last closing brace
        idx = content.rfind('}')
        if idx != -1:
            content = content[:idx] + block + content[idx:]
            with open(index_css, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Added overrides to {theme}")
        else:
            print(f"Could not find closing brace in {theme}")
