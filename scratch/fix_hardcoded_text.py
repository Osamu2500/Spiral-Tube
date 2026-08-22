import os
import re

directories_to_scan = [
    r"F:\Youtube 2.0\src\content\design-system",
    r"F:\Youtube 2.0\src\content\global",
    r"F:\Youtube 2.0\src\content\pages"
]

exclude_directories = [
    r"F:\Youtube 2.0\src\content\pages\watch\player" # Do not modify player controls
]

def should_exclude(filepath):
    for ex in exclude_directories:
        if filepath.startswith(ex):
            return True
    return False

# Pattern to find color: #fff or color: #ffffff (case insensitive)
# Group 1 captures any trailing !important or semicolon
pattern = re.compile(r'color:\s*#(?:fff|ffffff)\b(\s*!important)?(;?)', re.IGNORECASE)

files_modified = 0

for directory in directories_to_scan:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if not file.endswith(".css"):
                continue
                
            filepath = os.path.join(root, file)
            if should_exclude(filepath):
                continue
                
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            def replacer(match):
                important = match.group(1) or ""
                semicolon = match.group(2) or ""
                return f"color: var(--ypp-text-primary, #fff){important}{semicolon}"
                
            new_content = pattern.sub(replacer, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated hardcoded text color in: {filepath}")
                files_modified += 1

print(f"Done! Modified {files_modified} files.")
