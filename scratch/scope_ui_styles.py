import os
import re

ui_styles_dir = r"F:\Youtube 2.0\src\content\design-system\ui-styles"

def process_css_file(filepath, style_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it's already scoped in a similar way, or if it's empty, skip
    if f'html[data-ypp-ui-design="{style_name}"]' in content and not 'index.css' in filepath:
        # Actually, let's just re-scope to be safe. But wait, if it's already scoped we shouldn't double wrap.
        pass

    # Extract all @import
    imports = []
    def import_replacer(match):
        imports.append(match.group(0))
        return ''
    content = re.sub(r'@import\s+.*?;', import_replacer, content)

    # Extract all @keyframes blocks
    keyframes = []
    # This regex matches @keyframes name { ... } by matching curly braces safely assuming well-formed CSS without deeply nested braces inside keyframes (usually true for standard CSS)
    # Actually, a simpler way is to find @keyframes and then find the matching closing brace.
    def extract_blocks(text, keyword):
        blocks = []
        idx = 0
        while True:
            idx = text.find(keyword, idx)
            if idx == -1:
                break
            
            # Find the opening brace of the block
            open_brace = text.find('{', idx)
            if open_brace == -1:
                break
                
            # Find the matching closing brace
            brace_count = 1
            close_brace = open_brace + 1
            while close_brace < len(text) and brace_count > 0:
                if text[close_brace] == '{':
                    brace_count += 1
                elif text[close_brace] == '}':
                    brace_count -= 1
                close_brace += 1
                
            block = text[idx:close_brace]
            blocks.append(block)
            
            # Replace the extracted block with empty string in the text
            text = text[:idx] + text[close_brace:]
            # Do not advance idx since we shortened the string
        return text, blocks

    content, extracted_keyframes = extract_blocks(content, '@keyframes ')
    content, extracted_fontfaces = extract_blocks(content, '@font-face ')

    # If the file only had @imports and @keyframes, it might be empty now
    if not content.strip():
        # Just write the extracted parts
        new_content = '\n'.join(imports) + '\n\n' + '\n\n'.join(extracted_fontfaces) + '\n\n' + '\n\n'.join(extracted_keyframes)
    else:
        # Wrap the remaining content
        wrapped_content = f'html[data-ypp-ui-design="{style_name}"] {{\n{content}\n}}'
        new_content = '\n'.join(imports) + '\n\n' + '\n\n'.join(extracted_fontfaces) + '\n\n' + '\n\n'.join(extracted_keyframes) + '\n\n' + wrapped_content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Scoped {filepath}")

for style_name in os.listdir(ui_styles_dir):
    style_dir = os.path.join(ui_styles_dir, style_name)
    if os.path.isdir(style_dir):
        # We process overrides.css and tokens.css
        # index.css usually just has @imports, but we can process it if it has real CSS
        for file in os.listdir(style_dir):
            if file.endswith('.css'):
                if file == 'index.css':
                    # Only process index.css if it doesn't just contain @imports
                    with open(os.path.join(style_dir, file), 'r', encoding='utf-8') as f:
                        text = f.read()
                    if not re.sub(r'@import\s+.*?;', '', text).strip():
                        continue # Skip if it's only imports
                
                process_css_file(os.path.join(style_dir, file), style_name)

print("Done scoping all UI styles.")
