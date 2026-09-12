import re

file_path = "f:\\Spiral Tube\\src\\content\\pages\\watch\\layout\\modes\\css\\sidebar-mode.css"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix broken selectors that are missing commas
bad_selector_1 = 'body[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-compact-video-renderer :is(#related, ytd-watch-next-secondary-results-renderer) :is(yt-lockup-view-model, ytd-lockup-view-model) :is(#related, ytd-watch-next-secondary-results-renderer) ytd-rich-item-renderer {'
good_selector_1 = 'body[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-compact-video-renderer,\nbody[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) :is(yt-lockup-view-model, ytd-lockup-view-model),\nbody[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-rich-item-renderer {'
content = content.replace(bad_selector_1, good_selector_1)

bad_selector_2 = 'body[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-compact-video-renderer #dismissible :is(#related, ytd-watch-next-secondary-results-renderer) :is(yt-lockup-view-model, ytd-lockup-view-model) .yt-lockup-view-model-wiz :is(#related, ytd-watch-next-secondary-results-renderer) ytd-rich-item-renderer #content {'
good_selector_2 = 'body[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-compact-video-renderer #dismissible,\nbody[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) :is(yt-lockup-view-model, ytd-lockup-view-model) .yt-lockup-view-model-wiz,\nbody[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-rich-item-renderer #content {'
content = content.replace(bad_selector_2, good_selector_2)

bad_selector_3 = 'body[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) :is(#thumbnail, ytd-thumbnail).ytd-compact-video-renderer :is(#related, ytd-watch-next-secondary-results-renderer) :is(yt-lockup-view-model, ytd-lockup-view-model) a:is(:has(yt-image), :has(img)) :is(#related, ytd-watch-next-secondary-results-renderer) ytd-rich-item-renderer ytd-thumbnail {'
good_selector_3 = 'body[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) :is(#thumbnail, ytd-thumbnail).ytd-compact-video-renderer,\nbody[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) :is(yt-lockup-view-model, ytd-lockup-view-model) a:is(:has(yt-image), :has(img)),\nbody[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-rich-item-renderer ytd-thumbnail {'
content = content.replace(bad_selector_3, good_selector_3)

bad_selector_4 = 'body[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-compact-video-renderer .text-wrapper :is(#related, ytd-watch-next-secondary-results-renderer) :is(yt-lockup-view-model, ytd-lockup-view-model) .yt-lockup-metadata-view-model-wiz :is(#related, ytd-watch-next-secondary-results-renderer) ytd-rich-item-renderer #details {'
good_selector_4 = 'body[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-compact-video-renderer .text-wrapper,\nbody[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) :is(yt-lockup-view-model, ytd-lockup-view-model) .yt-lockup-metadata-view-model-wiz,\nbody[data-ypp-sidebar-size="expanded"] :is(#related, ytd-watch-next-secondary-results-renderer) ytd-rich-item-renderer #details {'
content = content.replace(bad_selector_4, good_selector_4)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
