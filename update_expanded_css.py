import sys

file_path = "f:\\Spiral Tube\\src\\content\\pages\\watch\\layout\\modes\\css\\sidebar-mode.css"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace expanded mode width
target_1 = """/* Expanded mode */
body[data-ypp-sidebar-size="expanded"] ytd-watch-flexy:not([theater]) {
  --ytd-watch-flexy-sidebar-width: 550px !important;
  --ytd-watch-flexy-sidebar-min-width: 550px !important;
}"""
replacement_1 = """/* Expanded mode (Uses default YouTube sidebar width to not squish video) */
body[data-ypp-sidebar-size="expanded"] ytd-watch-flexy:not([theater]) {
  --ytd-watch-flexy-sidebar-width: 402px !important;
  --ytd-watch-flexy-sidebar-min-width: 402px !important;
}"""

if target_1 in content:
    content = content.replace(target_1, replacement_1)
    print("Replaced 1")
else:
    print("Could not find target 1")

# Replace padding
target_2 = """  padding: 40px 16px 16px !important;"""
replacement_2 = """  padding: 30px 12px 12px !important;"""

if target_2 in content:
    content = content.replace(target_2, replacement_2)
    print("Replaced 2")
else:
    print("Could not find target 2")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
