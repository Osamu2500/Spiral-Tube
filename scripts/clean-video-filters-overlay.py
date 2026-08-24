import re
import os

css_content = """@keyframes ypp-vhs-tracking { 0% { top: -10%; } 100% { top: 110%; } }
@keyframes ypp-flare-pan { 0% { transform: translateX(0) scaleY(0.5); opacity: 0; } 10% { opacity: 1; transform: translateX(20%) scaleY(1); } 90% { opacity: 1; transform: translateX(80%) scaleY(1); } 100% { transform: translateX(100%) scaleY(0.5); opacity: 0; } }
@keyframes ypp-crt-flicker {
    0%   { opacity: 1; }
    48%  { opacity: 1; }
    50%  { opacity: 0.94; }
    52%  { opacity: 1; }
    88%  { opacity: 1; }
    90%  { opacity: 0.97; }
    92%  { opacity: 1; }
}
@keyframes ypp-vhs-band {
    0%   { top: -8px; }
    100% { top: 102%; }
}
@keyframes ypp-grain {
    0%  { background-position: 0% 0%; }
    10% { background-position: -5% -5%; }
    20% { background-position: -10% 5%; }
    30% { background-position: 5% -10%; }
    40% { background-position: -5% 15%; }
    50% { background-position: -10% 5%; }
    60% { background-position: 15% 0%; }
    70% { background-position: 0% 10%; }
    80% { background-position: -15% 0%; }
    90% { background-position: 10% 5%; }
    100%{ background-position: 5% 0%; }
}
@keyframes ypp-daguerreotype-flicker {
    0%, 100% { opacity: 1; }
    15%       { opacity: 0.96; }
    40%       { opacity: 1; }
    70%       { opacity: 0.93; }
    85%       { opacity: 1; }
}
@keyframes ypp-chroma-band {
    0%   { top: -4px; }
    100% { top: 102%; }
}
"""

with open('src/content/pages/watch/player/media-effects/video-filters/video-filters-overlay.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

with open('src/content/pages/watch/player/media-effects/video-filters/video-filters-overlay.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the glitch anim style block
glitch_pattern = re.compile(r'const\s+styleId\s*=\s*\'ypp-glitch-anim\';\s*if\s*\(!document\.getElementById.*?document\.head\.appendChild\(s\);\s*\}', re.DOTALL)
content = glitch_pattern.sub('', content)

# Remove the cinemascope anim style block
cinema_pattern = re.compile(r'const\s+styleId\s*=\s*\'ypp-cinemascope-anim\';\s*if\s*\(!document\.getElementById.*?document\.head\.appendChild\(s\);\s*\}', re.DOTALL)
content = cinema_pattern.sub('', content)

# Replace injectOverlayCSS body
inject_css_pattern = re.compile(r'(static injectOverlayCSS\(\) \{).*?(^\s*\}\s*$)', re.MULTILINE | re.DOTALL)
def replace_inject(m):
    return m.group(1) + "\n  }\n"
content = inject_css_pattern.sub(replace_inject, content)

# Remove the global export window.YPP.features.VideoFiltersOverlay = VideoFiltersOverlay;
global_export_pattern = re.compile(r'window\.YPP\.features\.VideoFiltersOverlay\s*=\s*VideoFiltersOverlay;', re.DOTALL)
content = global_export_pattern.sub('', content)

# Add CSS import at the top
content = "import './video-filters-overlay.css';\n" + content

with open('src/content/pages/watch/player/media-effects/video-filters/video-filters-overlay.js', 'w', encoding='utf-8') as f:
    f.write(content)
