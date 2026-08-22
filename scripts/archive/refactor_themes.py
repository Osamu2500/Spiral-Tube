import os
import glob
import tinycss2

def categorize_rule(rule):
    # Determine which file a rule belongs to based on its string representation.
    # tinycss2 doesn't always provide easy selector strings for nested rules or media queries without deep inspection,
    # so we'll serialize the rule and do simple string matching.
    text = rule.serialize()
    
    # Priority matching
    if '@keyframes' in text or 'animation' in text or 'transition' in text:
        return 'base/animations.css'
    elif 'ytd-comment' in text:
        return 'pages/comments.css'
    elif 'ytd-masthead' in text or 'topbar' in text or 'ytSearchbox' in text:
        return 'components/navbar.css'
    elif 'yt-spec-button' in text or 'ytp-button' in text or 'yt-button' in text or 'ytp-menuitem' in text:
        return 'components/buttons.css'
    elif 'ytd-watch' in text or 'ytp-' in text or '#player' in text or 'html5-video' in text:
        return 'pages/watch.css'
    elif 'ytd-browse' in text or 'ytd-guide' in text or '#chips' in text or 'ytd-mini-guide' in text:
        return 'pages/home.css'
    elif 'ytd-video-renderer' in text or 'thumbnail' in text or 'ytd-grid' in text or 'ytd-rich' in text:
        return 'components/cards.css'
    elif text.startswith('html') or text.startswith(':root') or text.startswith('[dark]') or text.startswith('*'):
        return 'base/tokens.css'
    else:
        return 'misc.css'

def process_theme(filepath):
    theme_name = os.path.basename(filepath).replace('.css', '')
    if theme_name == 'frutiger-aero':
        return # Skip

    out_dir = os.path.join(os.path.dirname(filepath), theme_name)
    os.makedirs(out_dir, exist_ok=True)
    
    # Create subdirectories
    for sub in ['base', 'components', 'pages']:
        os.makedirs(os.path.join(out_dir, sub), exist_ok=True)
        
    with open(filepath, 'r', encoding='utf-8') as f:
        css = f.read()
        
    rules = tinycss2.parse_stylesheet(css, skip_comments=True, skip_whitespace=True)
    
    buckets = {}
    
    for rule in rules:
        bucket = categorize_rule(rule)
        if bucket not in buckets:
            buckets[bucket] = []
        buckets[bucket].append(rule.serialize())
        
    # Write files
    imported_files = []
    
    for bucket, rules_str in buckets.items():
        out_file = os.path.join(out_dir, bucket)
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(rules_str))
        imported_files.append(bucket)
        
    # Write index.css
    index_file = os.path.join(out_dir, 'index.css')
    with open(index_file, 'w', encoding='utf-8') as f:
        # Standardize the order of imports
        ordered = ['base/tokens.css', 'base/animations.css', 
                   'components/navbar.css', 'components/buttons.css', 'components/cards.css',
                   'pages/home.css', 'pages/watch.css', 'pages/comments.css', 'misc.css']
        
        for file in ordered:
            if file in imported_files:
                f.write(f'@import "./{file}";\n')

    print(f"Refactored {theme_name} into {len(buckets)} files.")
    
    # Move original file to .bak so it's not picked up accidentally?
    # No, we will rename it because our build script outputs to the root directory
    os.rename(filepath, filepath + '.bak')

def main():
    ui_styles_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/content/themes/ui-styles'))
    css_files = glob.glob(os.path.join(ui_styles_dir, '*.css'))
    
    for f in css_files:
        if not f.endswith('.bak'):
            process_theme(f)

if __name__ == '__main__':
    main()
