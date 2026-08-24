import os
import re

files_to_process = [
    'src/content/pages/watch/player/media-effects/volume-booster/volume-booster-ui.js',
    'src/content/pages/watch/player/media-effects/ambient-mode/audio-mode.js',
    'src/content/pages/watch/player/media-effects/ambient-mode/ambient-mode.js',
    'src/content/pages/watch/player/enhancements/time-display.js',
    'src/content/pages/watch/player/enhancements/split-scrolling.js',
    'src/content/pages/watch/player/enhancements/intentional-delay.js',
    'src/content/pages/watch/player/domain-memory-ui.js',
    'src/content/pages/watch/player/controls/snapshot-button.js',
    'src/content/pages/watch/player/controls/loop-button.js',
    'src/content/pages/watch/player/controls/classic-progress-bar.js',
    'src/content/pages/watch/player/automation/auto-transcript.js',
    'src/content/pages/watch/player/automation/auto-subtitles.js',
    'src/content/pages/watch/player/automation/auto-pip.js',
    'src/content/pages/watch/player/automation/auto-cinema.js'
]

# Pattern to capture the entire style block, including the declaration and the appendChild call
# It matches things like:
# const style = document.createElement('style'); ... style.textContent = `...`; ... document.head.appendChild(style);
# OR this._style = document.createElement('style'); ... this._style.textContent = `...`; ... document.head.appendChild(this._style);

pattern = re.compile(
    r'(?:(?:const|let|var)\s+)?(this\.[a-zA-Z0-9_$]+|[a-zA-Z0-9_$]+)\s*=\s*(?:document|window\.document)\.createElement\(\'style\'\);'
    r'[\s\S]*?\1\.textContent\s*=\s*`([^`]*)`;'
    r'[\s\S]*?(?:(?:[a-zA-Z0-9_$]+\.)*appendChild\(\1\);)',
    re.DOTALL
)

for filepath in files_to_process:
    full_path = os.path.join('f:/Youtube 2.0', filepath)
    if not os.path.exists(full_path):
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = pattern.findall(content)
    if not matches:
        continue

    css_content = ""
    for match in matches:
        css = match[1]
        css_content += css.strip() + "\n\n"

    # Remove the blocks
    def replace_block(m):
        return ""
    new_content = pattern.sub(replace_block, content)

    # Clean up empty if-blocks around styles
    if_pattern = re.compile(r'if\s*\([^)]*\)\s*\{\s*\}', re.DOTALL)
    new_content = if_pattern.sub('', new_content)

    # Clean up empty methods
    method_pattern = re.compile(r'(static\s+)?_?inject(?:Styles?|CSS)\(\)\s*\{\s*\}', re.DOTALL)
    new_content = method_pattern.sub('', new_content)

    # Write CSS file
    basename = os.path.basename(filepath)
    name_no_ext = os.path.splitext(basename)[0]
    css_path = os.path.join(os.path.dirname(full_path), name_no_ext + '.css')
    
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content.strip() + '\n')

    # Add import
    import_stmt = f"import './{name_no_ext}.css';\n"
    if import_stmt not in new_content:
        # Avoid inserting before @fileoverview
        if new_content.startswith('/*'):
            # find end of first comment block
            end_comment = new_content.find('*/')
            if end_comment != -1:
                end_comment += 2
                new_content = new_content[:end_comment] + '\n' + import_stmt + new_content[end_comment:]
            else:
                new_content = import_stmt + new_content
        else:
            new_content = import_stmt + new_content

    # Remove global exports if present
    # Replace window.YPP.features.ClassName = ClassName;
    global_export_pattern = re.compile(r'window\.YPP\.features\.[a-zA-Z0-9_$]+\s*=\s*[a-zA-Z0-9_$]+;\s*', re.DOTALL)
    new_content = global_export_pattern.sub('', new_content)

    # Also clean up window.YPP.features = window.YPP.features || {};
    global_init_pattern = re.compile(r'window\.YPP\.features\s*=\s*window\.YPP\.features\s*\|\|\s*\{\};\s*', re.DOTALL)
    new_content = global_init_pattern.sub('', new_content)
    
    # Also clean up window.YPP = window.YPP || {};
    ypp_init_pattern = re.compile(r'window\.YPP\s*=\s*window\.YPP\s*\|\|\s*\{\};\s*', re.DOTALL)
    new_content = ypp_init_pattern.sub('', new_content)

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Processed {filepath}")
