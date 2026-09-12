import re

file_path = "f:\\Spiral Tube\\src\\content\\pages\\watch\\layout\\modes\\css\\sidebar-mode.css"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove 'body[data-ypp-sidebar-size="expanded"]' from the layout structural overrides block
# These selectors are comma separated list in :is(...)

# We want to remove 'body[data-ypp-sidebar-size="expanded"]' from these lines:
# :is(body[data-ypp-sidebar-size="macro"], body[data-ypp-sidebar-size="mini"], body[data-ypp-sidebar-size="compact"], body[data-ypp-sidebar-size="regular"], body[data-ypp-sidebar-size="spacious"], body[data-ypp-sidebar-size="huge"], body[data-ypp-sidebar-size="expanded"]) ytd-watch-flexy:not([theater])

pattern = r',\s*body\[data-ypp-sidebar-size="expanded"\]'
content = re.sub(pattern, '', content)

# Remove the explicit width declaration for expanded mode (since we deleted it in previous step, but let's be safe)
target_width = """/* Expanded mode (Uses default YouTube sidebar width to not squish video) */
body[data-ypp-sidebar-size="expanded"] ytd-watch-flexy:not([theater]) {
  --ytd-watch-flexy-sidebar-width: 402px !important;
  --ytd-watch-flexy-sidebar-min-width: 402px !important;
}"""
content = content.replace(target_width, "")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
