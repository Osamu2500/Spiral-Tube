import os
import glob
import tinycss2
import shutil

UI_STYLES_DIR = r"f:\Youtube 2.0\src\content\themes\ui-styles"

def classify_rule(rule_text):
    text = rule_text.lower()
    
    # 1. Base / Tokens
    if 'html' in text and ('--' in text or 'font-family' in text):
        return 'base/tokens.css'
        
    # 2. Animations
    if '@keyframes' in text or 'animation' in text or '::before' in text or '::after' in text:
        return 'base/animations.css'
        
    # 3. Navbar / Shell
    if ('masthead' in text or 
        'searchbox' in text or 
        'ytd-app' in text or 
        'page-manager' in text or 
        '#guide-button' in text):
        return 'components/navbar.css'
        
    # 4. Buttons
    if ('button' in text or 
        'ypp-btn' in text or 
        'toggle' in text or 
        'yt-spec-button' in text or 
        'like' in text or 
        'dislike' in text):
        return 'components/buttons.css'
        
    # 5. Menus & Popups
    if ('menu' in text or 
        'popup' in text or 
        'dialog' in text or 
        'tooltip' in text or 
        'listbox' in text or 
        'dropdown' in text or
        'toast' in text):
        return 'components/menus.css'
        
    # 6. Comments
    if 'comment' in text:
        return 'pages/comments.css'
        
    # 7. Watch Page & Player
    if ('video-stream' in text or 
        'player' in text or 
        'ypp-eq' in text or 
        'ypp-cinema' in text or 
        'global-player-bar' in text or
        'progress-bar' in text or
        'ypp-pl-' in text):
        return 'pages/watch.css'
        
    # 8. Home Page / Navigation
    if ('chip' in text or 
        'guide' in text or 
        'sidebar' in text or 
        'browse' in text or
        'tabs' in text or
        'filter' in text):
        return 'pages/home.css'
        
    # 9. Cards & Panels (Catch-all for content renderers)
    if ('renderer' in text or 
        'grid' in text or 
        'panel' in text or 
        'card' in text or 
        'metadata' in text or
        'thumbnail' in text):
        return 'components/cards.css'
        
    # 10. Globals / Misc layout
    return 'base/layout.css'

def process_file(filepath):
    filename = os.path.basename(filepath)
    theme_name = filename[:-4]
    
    # Skip already processed or non-css files
    if theme_name in ['frutiger-aero', 'aurora'] or not filename.endswith('.css'):
        return
        
    print(f"Refactoring {theme_name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        css_content = f.read()
        
    rules = tinycss2.parse_stylesheet(css_content, skip_comments=False)
    
    categories = {
        'base/tokens.css': [],
        'base/animations.css': [],
        'base/layout.css': [],
        'components/navbar.css': [],
        'components/buttons.css': [],
        'components/menus.css': [],
        'components/cards.css': [],
        'pages/home.css': [],
        'pages/watch.css': [],
        'pages/comments.css': []
    }
    
    current_comment = None
    
    for node in rules:
        if node.type == 'comment':
            current_comment = node.serialize()
            continue
            
        if node.type == 'whitespace':
            continue
            
        rule_text = node.serialize()
        category = classify_rule(rule_text)
        
        if current_comment:
            categories[category].append(current_comment)
            current_comment = None
            
        categories[category].append(rule_text)
        
    # Create directories and write files
    theme_dir = os.path.join(UI_STYLES_DIR, theme_name)
    os.makedirs(theme_dir, exist_ok=True)
    
    index_content = "/* Refactored modular theme */\n\n"
    
    for rel_path, content_list in categories.items():
        if not content_list:
            continue
            
        full_path = os.path.join(theme_dir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(content_list))
            
        index_content += f'@import "./{rel_path}";\n'
        
    # Write index.css
    with open(os.path.join(theme_dir, 'index.css'), 'w', encoding='utf-8') as f:
        f.write(index_content)
        
    # Rename original monolithic file so esbuild can write over it cleanly
    os.rename(filepath, filepath + '.bak')

if __name__ == "__main__":
    for f in glob.glob(os.path.join(UI_STYLES_DIR, '*.css')):
        process_file(f)
    print("Done!")
