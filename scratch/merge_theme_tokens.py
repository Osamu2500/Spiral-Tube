import os
import re
import shutil

themes_dir = r"F:\Youtube 2.0\src\content\design-system\themes"

layout_properties = [
    "height", "width", "padding", "margin", "border-radius",
    "top", "left", "right", "bottom", "font-size", "line-height",
    "z-index", "transform", "display", "flex", "grid", "position"
]

# Create a regex to match CSS declarations that have these keywords in the property name
layout_regex = re.compile(r'^\s*--[a-zA-Z0-9_-]*(?:' + '|'.join(layout_properties) + r')[a-zA-Z0-9_-]*\s*:.*?;', re.IGNORECASE)
regular_css_layout_regex = re.compile(r'^\s*(?:' + '|'.join(layout_properties) + r')\s*:.*?;', re.IGNORECASE)

def strip_layout_rules(content):
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if layout_regex.match(line) or regular_css_layout_regex.match(line):
            continue
        new_lines.append(line)
    return '\n'.join(new_lines)

for theme_name in os.listdir(themes_dir):
    theme_path = os.path.join(themes_dir, theme_name)
    if not os.path.isdir(theme_path):
        continue
        
    index_path = os.path.join(theme_path, "index.css")
    base_dir = os.path.join(theme_path, "base")
    tokens_path = os.path.join(base_dir, "tokens.css")
    
    if os.path.exists(tokens_path) and os.path.exists(index_path):
        print(f"Processing {theme_name}...")
        
        with open(tokens_path, 'r', encoding='utf-8') as f:
            tokens_content = f.read()
            
        with open(index_path, 'r', encoding='utf-8') as f:
            index_content = f.read()
            
        # Remove the @import statement from index.css
        index_content = re.sub(r'@import\s+[\'"]\./base/tokens\.css[\'"]\s*;', '', index_content)
        
        # Merge contents
        merged_content = tokens_content + "\n" + index_content
        
        # Strip layout variables
        merged_content = strip_layout_rules(merged_content)
        
        # Write back to index.css
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(merged_content)
            
        # Delete base directory
        shutil.rmtree(base_dir)
        print(f"  -> Merged tokens and removed base folder for {theme_name}")

print("Done merging themes!")
