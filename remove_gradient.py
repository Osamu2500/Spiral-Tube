import re

file_path = "f:\\Spiral Tube\\src\\content\\pages\\watch\\layout\\modes\\css\\sidebar-mode.css"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = 'background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0) 100%) !important;'
replacement = 'background: transparent !important;'

content = content.replace(target, replacement)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
