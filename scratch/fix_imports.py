import os
import re

themes_dir = r"F:\Youtube 2.0\src\content\design-system\themes"

for root, dirs, files in os.walk(themes_dir):
    for file in files:
        if file == "index.css":
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all @import lines
            imports = re.findall(r'^\s*@import\s+[^;]+;', content, flags=re.MULTILINE)
            if imports:
                # Remove them from the content
                new_content = re.sub(r'^\s*@import\s+[^;]+;\n?', '', content, flags=re.MULTILINE)
                # Add them to the top
                final_content = '\n'.join(imports) + '\n\n' + new_content
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(final_content)
                print(f"Fixed imports in {filepath}")
