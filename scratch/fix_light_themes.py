import os
import re

themes_dir = r"F:\Youtube 2.0\src\content\design-system\themes"

light_themes = [
    'hacker-green'
]

def clean_file(content):
    # Remove the malformed blocks like /* TEXT READABILITY FIX */ and all its broken selectors
    # We'll use a regex to strip out anything from /* TEXT READABILITY FIX down to the next html[data-ypp-theme
    pattern = r'/\*\s*={10,}.*?TEXT READABILITY FIX.*?html\[data-ypp-theme="[^"]+"\]\s*\{'
    # Wait, the regex might be tricky. Let's just remove specific known bad blocks manually or with a broad replacement.
    
    # Let's just strip everything from /* =========================================== */ down to html[data-ypp-theme="..."] {
    # If the file has a dangling #description-text,
    content = re.sub(r'/\*\s*={10,}\s*\*/\s*/\*\s*TEXT READABILITY FIX.*?#description-text,\s*(html\[data-ypp-theme="[^"]+"\]\s*\{)', r'\1', content, flags=re.DOTALL)
    
    # Also clean up the previous block I added if it's there so we don't duplicate
    content = re.sub(r'/\* Critical YouTube Overrides for Light Themes \*/.*?(?=\})', '', content, flags=re.DOTALL)
    
    # Also clean up any old text readability fixes that I inject, in case of multiple runs
    content = re.sub(r'/\* --- TEXT READABILITY FIX --- \*/.*', '', content, flags=re.DOTALL)
    
    return content

for theme in light_themes:
    index_css = os.path.join(themes_dir, theme, 'index.css')
    if not os.path.exists(index_css):
        continue
        
    with open(index_css, 'r', encoding='utf-8') as f:
        content = f.read()
        
    content = clean_file(content)
    
    # Remove any trailing newlines or braces to append properly
    content = content.rstrip()
    if content.endswith('}'):
        content = content[:-1].rstrip()
    else:
        # If the file doesn't end with }, let's find the last }
        idx = content.rfind('}')
        if idx != -1:
            content = content[:idx] + content[idx+1:].rstrip()

    block = f"""
  /* Critical YouTube Overrides for Light Themes */
  --yt-spec-text-primary: var(--ypp-text-primary, #0f0f0f) !important;
  --yt-spec-text-secondary: var(--ypp-text-secondary, rgba(0,0,0,0.7)) !important;
  --yt-spec-icon-inactive: var(--ypp-text-primary, #0f0f0f) !important;
  --yt-spec-icon-active-other: var(--ypp-text-primary, #0f0f0f) !important;
  --yt-spec-brand-icon-inactive: var(--ypp-text-primary, #0f0f0f) !important;
  --yt-spec-brand-icon-active: var(--ypp-text-primary, #0f0f0f) !important;
}}

/* --- TEXT READABILITY FIX --- */
/* Enforce dark text color globally for this light theme */
html[data-ypp-theme="{theme}"] body,
html[data-ypp-theme="{theme}"] yt-formatted-string,
html[data-ypp-theme="{theme}"] span,
html[data-ypp-theme="{theme}"] div,
html[data-ypp-theme="{theme}"] a,
html[data-ypp-theme="{theme}"] h1,
html[data-ypp-theme="{theme}"] h2,
html[data-ypp-theme="{theme}"] h3,
html[data-ypp-theme="{theme}"] #video-title,
html[data-ypp-theme="{theme}"] .title,
html[data-ypp-theme="{theme}"] ytd-guide-entry-renderer *,
html[data-ypp-theme="{theme}"] ytd-mini-guide-entry-renderer * {{
  color: var(--ypp-text-primary) !important;
  text-shadow: none !important;
}}

html[data-ypp-theme="{theme}"] svg {{
  fill: var(--ypp-text-primary) !important;
}}

/* Secondary text overrides */
html[data-ypp-theme="{theme}"] ytd-rich-grid-media #metadata-line span,
html[data-ypp-theme="{theme}"] ytd-compact-video-renderer #metadata-line span,
html[data-ypp-theme="{theme}"] ytd-video-renderer #metadata-line span,
html[data-ypp-theme="{theme}"] #metadata-line span,
html[data-ypp-theme="{theme}"] .inline-metadata-item,
html[data-ypp-theme="{theme}"] #byline-container yt-formatted-string,
html[data-ypp-theme="{theme}"] #byline-container span,
html[data-ypp-theme="{theme}"] #byline-container a,
html[data-ypp-theme="{theme}"] #description-text {{
  color: var(--ypp-text-secondary) !important;
}}

/* Exempt Buttons to preserve contrast */
html[data-ypp-theme="{theme}"] ytd-button-renderer yt-formatted-string,
html[data-ypp-theme="{theme}"] yt-button-shape *,
html[data-ypp-theme="{theme}"] ytd-subscribe-button-renderer *,
html[data-ypp-theme="{theme}"] ytd-badge-supported-renderer * {{
  color: inherit !important;
}}
"""
    
    with open(index_css, 'w', encoding='utf-8') as f:
        f.write(content + "\n" + block)
    print(f"Fixed {theme}")
