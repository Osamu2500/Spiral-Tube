import os
import re
import json

base_dir = r"F:\Youtube 2.0\src\content\design-system"
themes_dir = os.path.join(base_dir, "themes")
ui_styles_dir = os.path.join(base_dir, "ui-styles")
card_styles_dir = os.path.join(base_dir, "card-styles")
popup_file = r"F:\Youtube 2.0\src\popup\scripts\popup-components.js"

# 1. Parse popup-components.js to find all themes and their colors
themes_data = {}
with open(popup_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Match objects like: { key: 'autumn', label: 'Autumn', meta: 'Seasonal', color: '#b5541b' }
pattern = re.compile(r"\{\s*key:\s*'([^']+)',.*?color:\s*'([^']+)'\s*\}")
for match in pattern.finditer(content):
    key, color = match.groups()
    if color == 'split': continue
    themes_data[key] = color

# Handle userstyles which might have custom names in JS but different keys
if 'pink' in themes_data: themes_data['cherry'] = themes_data['pink']
if 'retrowave-green' in themes_data: themes_data['hacker-green'] = themes_data['retrowave-green']

def hex_to_rgba(hex_color, alpha):
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return f"rgba({r}, {g}, {b}, {alpha})"

def adjust_color(hex_color, percent):
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    r = max(0, min(255, int(int(hex_color[0:2], 16) * (1 + percent))))
    g = max(0, min(255, int(int(hex_color[2:4], 16) * (1 + percent))))
    b = max(0, min(255, int(int(hex_color[4:6], 16) * (1 + percent))))
    return f"#{r:02x}{g:02x}{b:02x}"

# 2. Update themes to ensure light themes have proper YouTube text overrides
for key, color in themes_data.items():
    theme_path = os.path.join(themes_dir, key)
    
    # Determine if theme is light
    r = int(color[1:3], 16)
    g = int(color[3:5], 16)
    b = int(color[5:7], 16)
    brightness = (r * 299 + g * 587 + b * 114) / 1000
    is_light = brightness > 155
    
    index_css = os.path.join(theme_path, "index.css")
    
    if is_light and os.path.exists(index_css):
        with open(index_css, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check if the specific youtube overrides are already there
        if '--yt-spec-text-primary' not in content:
            print(f"Adding dark text overrides to light theme: {key}")
            # We want to insert these before the closing brace
            yt_vars = """
  /* Critical YouTube Overrides for Light Themes */
  --yt-spec-text-primary: #0f0f0f !important;
  --yt-spec-text-secondary: rgba(0,0,0,0.7) !important;
  --yt-spec-icon-inactive: #0f0f0f !important;
  --yt-spec-icon-active-other: #0f0f0f !important;
  --yt-spec-brand-icon-inactive: #0f0f0f !important;
  --yt-spec-brand-icon-active: #0f0f0f !important;
}"""
            if '}' in content:
                new_content = content.replace('}', yt_vars, 1)
                with open(index_css, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print("Done updating light themes!")
