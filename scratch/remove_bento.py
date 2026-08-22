import re

file_path = r'F:\Youtube 2.0\src\content\config\settings-schema.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove 'bento', and 'bento' from arrays
content = re.sub(r"'bento',\s*", "", content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated settings-schema.js")

popup_css_path = r'F:\Youtube 2.0\src\popup\styles\popup-themes.css'
with open(popup_css_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove body.ypp-theme-bento blocks
content = re.sub(r"body\.ypp-theme-bento\s+[^\{]+\{.*?\}", "", content, flags=re.DOTALL)
content = re.sub(r"/\*\s*Bento\s*\*/", "", content, flags=re.IGNORECASE)

with open(popup_css_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated popup-themes.css")

popup_html = r'F:\Youtube 2.0\src\popup\popup.html'
with open(popup_html, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'.*data-style="bento".*\n', '', content)

with open(popup_html, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated popup.html")
