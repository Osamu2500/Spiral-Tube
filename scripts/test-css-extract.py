import re
import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the whole block
    pattern = re.compile(
        r'(\s*)(?:const|let|var|this\.)?\s*([a-zA-Z0-9_$]+)\s*=\s*(?:document|window\.document)\.createElement\(\'style\'\);'
        r'[\s\S]*?\2\.textContent\s*=\s*`([^`]*)`;'
        r'[\s\S]*?(?:(?:[a-zA-Z0-9_$]+\.)*appendChild\(\2\);)',
        re.DOTALL
    )

    matches = pattern.findall(content)
    if not matches:
        return False

    css_content = ""
    for match in matches:
        css = match[2]
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
    css_path = os.path.join(os.path.dirname(filepath), name_no_ext + '.css')
    
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)

    # Add import
    import_stmt = f"import './{name_no_ext}.css';\n"
    if import_stmt not in new_content:
        # insert after the first comment block or at the beginning
        if new_content.startswith('/*'):
            end_comment = new_content.find('*/') + 2
            new_content = new_content[:end_comment] + '\n' + import_stmt + new_content[end_comment:]
        else:
            new_content = import_stmt + new_content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Processed {filepath}")
    return True

process_file('src/content/pages/watch/player/automation/auto-cinema.js')
