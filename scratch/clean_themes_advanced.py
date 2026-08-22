import os
import re

themes_dir = r"F:\Youtube 2.0\src\content\design-system\themes"

for theme in os.listdir(themes_dir):
    theme_path = os.path.join(themes_dir, theme)
    if not os.path.isdir(theme_path):
        continue
        
    index_css = os.path.join(theme_path, 'index.css')
    if not os.path.exists(index_css):
        continue
        
    with open(index_css, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Remove entire blocks that style specific UI elements like #owner, #comments, ytd-comment-thread-renderer, #description
    # We can match `html[data-ypp-...][^\{]*#(owner|channel-name|description|comments)[^\{]*\{[^}]*\}`
    # and `html[data-ypp-...][^\{]*ytd-watch-metadata[^\{]*\{[^}]*\}`
    # Actually, any block that has more than just the plain html[data-ypp-theme="..."] or html[data-ypp-theme="..."] * or html[data-ypp-theme="..."].ypp-theme-effects::before/after
    
    # It's easier to use a regex to replace data-ypp-ui-design with data-ypp-theme first.
    content = content.replace('data-ypp-ui-design', 'data-ypp-theme')
    
    # 2. Now let's remove any block that styles specific YouTube elements.
    # Color themes should ONLY style `html[...]`, `html[...] *`, and pseudo elements `html[...].ypp-theme-effects::...`
    # Let's find all blocks and filter them.
    
    # A simple way is to match all blocks:
    # `([^{]+)\{([^}]+)\}`
    # Then check the selector.
    
    new_blocks = []
    
    # We will iterate through blocks using regex
    # But regex for balanced braces is hard in python.
    # Since CSS is simple, let's just do it manually.
    
    lines = content.split('\n')
    cleaned_lines = []
    in_bad_block = False
    
    for line in lines:
        if in_bad_block:
            if '}' in line:
                in_bad_block = False
            continue
            
        # check if line starts a block
        if '{' in line:
            # check the selector
            # if it contains '#' or 'ytd-' (except for variables --ytd-...)
            # wait, variables are inside blocks. The selector is before '{'.
            # A good heuristic: if the selector has '#owner', '#comments', '#description', '#channel-name', 'ytd-'
            selector = line.split('{')[0]
            if any(x in selector for x in ['#owner', '#comments', '#description', '#channel-name', 'ytd-comment', 'ytd-watch']):
                in_bad_block = True
                if '}' in line:
                    in_bad_block = False
                continue
                
        cleaned_lines.append(line)
        
    with open(index_css, 'w', encoding='utf-8') as f:
        f.write('\n'.join(cleaned_lines))

print("Advanced cleaning complete!")
