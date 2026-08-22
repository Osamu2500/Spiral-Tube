import os
import re
import glob

themes_dir = r"F:\Youtube 2.0\src\content\design-system\themes"
ui_styles_dir = r"F:\Youtube 2.0\src\content\design-system\ui-styles"

# 1. Strip layout properties from color themes
layout_props = [
    'padding', 'margin', 'border-radius', 'height', 'width', 
    'display', 'flex', 'position', 'top', 'left', 'right', 'bottom', 
    'z-index', 'overflow', 'justify-content', 'align-items', 'gap'
]

# regex to find properties that start with any of the layout props
# but since it's variables, maybe they use layout prop names?
# Actually, the user says "Strip out any variables that change layout (like height, width, padding, border-radius) from the color themes"
# we can look for `--ypp-.*(?:height|width|padding|margin|radius|border-radius|spacing|gap|size).*:.*`

layout_var_re = re.compile(r'^\s*--ypp-[a-zA-Z0-9_-]*(?:height|width|padding|margin|radius|border-radius|spacing|gap|size|display|flex|position)[a-zA-Z0-9_-]*\s*:.*;', re.IGNORECASE)

light_themes = [
    'kawaii', 'hologram', 'vintage', 'blue-sky', 'technozen', 'frutiger-aero', 
    'claymorphism', 'neo-brutalism', 'brutalism', 'y2k', 'sakura', 'steampunk', 
    'woodblock', 'origami', 'ice-blue', 'crystal-glass', 'cherry'
]

for theme in os.listdir(themes_dir):
    theme_path = os.path.join(themes_dir, theme)
    if not os.path.isdir(theme_path):
        continue
    
    index_css = os.path.join(theme_path, 'index.css')
    if os.path.exists(index_css):
        with open(index_css, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        new_lines = []
        for line in lines:
            if layout_var_re.search(line):
                continue
            new_lines.append(line)
            
        # Add dark text if light theme
        if theme in light_themes:
            # check if it already has --ypp-text-primary
            has_text = any('--ypp-text-primary' in l for l in new_lines)
            if not has_text:
                # insert it before the closing brace of the main block
                # finding the last closing brace
                for i in range(len(new_lines)-1, -1, -1):
                    if '}' in new_lines[i]:
                        new_lines.insert(i, '  --ypp-text-primary: #0f0f0f !important;\n  --ypp-text-secondary: #606060 !important;\n')
                        break
        
        with open(index_css, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)


# 2. Merge tokens.css into index.css for all UI styles
for style in os.listdir(ui_styles_dir):
    style_path = os.path.join(ui_styles_dir, style)
    if not os.path.isdir(style_path):
        continue
        
    index_css = os.path.join(style_path, 'index.css')
    tokens_css = os.path.join(style_path, 'tokens.css')
    
    if os.path.exists(tokens_css) and os.path.exists(index_css):
        with open(tokens_css, 'r', encoding='utf-8') as f:
            tokens_content = f.read()
            
        with open(index_css, 'r', encoding='utf-8') as f:
            index_content = f.read()
            
        # remove @import "./tokens.css"
        index_content = re.sub(r'@import\s+["\']./tokens\.css["\'];?', '', index_content)
        
        with open(index_css, 'w', encoding='utf-8') as f:
            f.write("/* Merged tokens.css */\n")
            f.write(tokens_content)
            f.write("\n")
            f.write(index_content)
            
        os.remove(tokens_css)

print("Processing complete!")
