import os
import glob
import tinycss2
import shutil

THEMES_DIR = r"f:\Youtube 2.0\src\content\themes"
UI_STYLES_DIR = r"f:\Youtube 2.0\src\content\themes\ui-styles"

# The Frutiger Aero 17-file gold standard
UI_STYLE_STRUCTURE = [
    'base/animations.css',
    'base/background.css',
    'base/tokens.css',
    'components/buttons.css',
    'components/cards.css',
    'components/icons.css',
    'components/menus.css',
    'components/navbar.css',
    'components/panels.css',
    'pages/channels.css',
    'pages/comments.css',
    'pages/home.css',
    'pages/livechat.css',
    'pages/player.css',
    'pages/search.css',
    'pages/watch.css'
]

def classify_rule_ui(rule_text):
    text = rule_text.lower()
    
    if '@keyframes' in text or 'animation' in text or '::before' in text or '::after' in text:
        return 'base/animations.css'
        
    if 'html' in text and ('--' in text or 'font-family' in text):
        return 'base/tokens.css'
        
    if 'yt-live-chat' in text or 'livechat' in text:
        return 'pages/livechat.css'
        
    if 'ytd-channel' in text or 'c4-tabbed' in text:
        return 'pages/channels.css'
        
    if 'comment' in text:
        return 'pages/comments.css'
        
    if 'ytd-search' in text or 'searchbox' in text or 'search-filter' in text:
        return 'pages/search.css'
        
    if 'video-stream' in text or 'html5-video' in text or 'ytp-' in text:
        return 'pages/player.css'
        
    if 'ypp-eq' in text or 'ypp-cinema' in text or 'global-player-bar' in text:
        return 'pages/watch.css'
        
    if 'chip' in text or 'guide' in text or 'sidebar' in text or 'browse' in text or '#sections' in text:
        return 'pages/home.css'
        
    if 'masthead' in text or 'ytd-app' in text or 'page-manager' in text:
        return 'components/navbar.css'
        
    if 'menu' in text or 'popup' in text or 'dialog' in text or 'tooltip' in text or 'listbox' in text or 'toast' in text:
        return 'components/menus.css'
        
    if 'button' in text or 'ypp-btn' in text or 'toggle' in text or 'yt-spec-button' in text or 'like' in text or 'dislike' in text:
        return 'components/buttons.css'
        
    if 'icon' in text or 'yt-icon' in text:
        return 'components/icons.css'
        
    if 'engagement-panel' in text or 'anchored-panel' in text:
        return 'components/panels.css'
        
    if 'renderer' in text or 'grid' in text or 'card' in text or 'metadata' in text or 'thumbnail' in text:
        return 'components/cards.css'
        
    if 'background' in text:
        return 'base/background.css'
        
    return 'base/tokens.css'  # Default bucket

def process_ui_style(filepath):
    theme_name = os.path.basename(filepath)[:-4]
    if not filepath.endswith('.css'): return
    
    print(f"Structuring UI Style: {theme_name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        css_content = f.read()
        
    rules = tinycss2.parse_stylesheet(css_content, skip_comments=False)
    
    categories = {path: [] for path in UI_STYLE_STRUCTURE}
    current_comment = None
    
    for node in rules:
        if node.type == 'comment':
            current_comment = node.serialize()
            continue
        if node.type == 'whitespace':
            continue
            
        rule_text = node.serialize()
        category = classify_rule_ui(rule_text)
        
        if current_comment:
            categories[category].append(current_comment)
            current_comment = None
        categories[category].append(rule_text)
        
    theme_dir = os.path.join(UI_STYLES_DIR, theme_name)
    os.makedirs(theme_dir, exist_ok=True)
    
    index_content = "/* 17-File Structured UI Style */\n\n"
    
    for rel_path in UI_STYLE_STRUCTURE:
        content_list = categories[rel_path]
        full_path = os.path.join(theme_dir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(content_list) if content_list else f"/* {rel_path} - Empty by default */\n")
            
        index_content += f'@import "./{rel_path}";\n'
        
    with open(os.path.join(theme_dir, 'index.css'), 'w', encoding='utf-8') as f:
        f.write(index_content)
        
    os.remove(filepath)

def process_color_theme(filepath):
    theme_name = os.path.basename(filepath)[:-4]
    if not filepath.endswith('.css') or theme_name == 'ui-styles': return
    
    print(f"Structuring Color Theme: {theme_name}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    theme_dir = os.path.join(THEMES_DIR, theme_name)
    os.makedirs(os.path.join(theme_dir, 'base'), exist_ok=True)
    
    with open(os.path.join(theme_dir, 'base', 'tokens.css'), 'w', encoding='utf-8') as f:
        f.write(content)
        
    with open(os.path.join(theme_dir, 'index.css'), 'w', encoding='utf-8') as f:
        f.write('@import "./base/tokens.css";\n')
        
    os.remove(filepath)

if __name__ == "__main__":
    for f in glob.glob(os.path.join(UI_STYLES_DIR, '*.css')):
        process_ui_style(f)
    for f in glob.glob(os.path.join(THEMES_DIR, '*.css')):
        process_color_theme(f)
    print("Complete parity achieved!")
