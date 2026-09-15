# Watch Page Action Buttons Fixes

## 1. Action Buttons Wrapping Below Channel Bar

### Issue
The action buttons (Like, Share, Download) were shifting to a new line below the channel information block instead of staying on the same horizontal row.

### Approach
We inspected the `#top-row` flex container and the `#actions` wrapper. We identified that the `#actions` container was given `width: 100% !important;`, which forced the flexbox to wrap it to a new line since the channel info block was already taking up space.

### Solution
Removed the `width: 100%` and replaced it with a flexible auto-width approach:
```css
html.yt-spiral-tube-theme body ytd-watch-metadata #actions.ytd-watch-metadata {
    flex: 1 1 auto !important;
    width: auto !important; 
    justify-content: flex-end !important; 
    min-width: 0 !important;
}
```

### Future Prompt / Instructions
> **Prompt for AI:** "When styling the YouTube watch page action buttons next to the channel info, ensure that the `#actions` container uses `flex: 1 1 auto` and `width: auto` instead of `width: 100%`. If it wraps to a new line unexpectedly, check the flex-grow and width properties of the `.ytd-watch-metadata #actions` container and ensure it is allowed to share the row with `#owner`."

---

## 2. Bottom Cropping on Squircle Action Buttons

### Issue
The action buttons (Like, Share, Ask, Download) appeared slightly cropped or flattened at the bottom edge. The squircle border radius and box-shadows were being cut off.

### Approach
This is a classic `overflow: hidden` issue. YouTube's native DOM for these buttons introduces several intermediate wrapper elements (`yt-button-shape`, `yt-button-view-model`, `yt-smartimation`, `.yt-spec-button-shape-next`). Some of these natively clip their contents.

### Solution
Applied `overflow: visible !important` to all intermediate wrappers globally, while preserving `overflow: hidden` only where absolutely necessary (like the `.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper` which needs it to round the outer corners of the segmented pill).

```css
html.yt-spiral-tube-theme body ytd-watch-metadata #top-level-buttons-computed,
html.yt-spiral-tube-theme body ytd-watch-metadata ytd-menu-renderer,
html.yt-spiral-tube-theme body ytd-watch-metadata yt-button-shape,
html.yt-spiral-tube-theme body ytd-watch-metadata yt-button-view-model,
html.yt-spiral-tube-theme body ytd-watch-metadata yt-smartimation,
html.yt-spiral-tube-theme body ytd-watch-metadata .yt-spec-button-shape-next {
    overflow: visible !important;
}
```

### Future Prompt / Instructions
> **Prompt for AI:** "If custom shapes (like squircles) or drop-shadows on YouTube action buttons are getting clipped or flattened at the edges, identify all parent wrappers injected by YouTube (e.g., `yt-smartimation`, `yt-button-shape`, `ytd-menu-renderer`). Apply `overflow: visible !important` to them to prevent clipping."

---

## 3. The 4px Vertical Misalignment Bug

### Issue
The action buttons container was not perfectly vertically aligned with the channel information block.

### Approach
Inspected the computed styles of the parent wrappers and found a native margin applied by YouTube's layout on `#top-level-buttons`. Specifically, `margin: 0px 0px 4px` was pushing the buttons off-center vertically.

### Solution
Zeroed out the margin and padding on the top-level button wrappers.
```css
html.yt-spiral-tube-theme body ytd-watch-metadata #top-level-buttons-computed,
html.yt-spiral-tube-theme body ytd-watch-metadata #top-level-buttons {
    margin: 0 !important;
    padding: 0 !important;
}
```

### Future Prompt / Instructions
> **Prompt for AI:** "To achieve perfect vertical centering between the channel bar and the action buttons on the watch page, ensure you strip out YouTube's native bottom margin on `#top-level-buttons` and `#top-level-buttons-computed` using `margin: 0 !important;`."

---

## 4. Like/Dislike Pill Active State Color Inheritance

### Issue
When the Like or Dislike button became active (e.g., the user liked the video), the container successfully got the custom blue glow/shadow, but the text and SVG icon stubbornly remained white.

### Approach
YouTube's native DOM explicitly assigns `color` and `fill` styles to the child elements (`span` and `yt-icon`) of the button. Because they have specific native rules, they do not inherit the `color` property assigned to the parent `<button>` element.

### Solution
Used the universal child selector `*` to force all descendants of the active button to inherit the color and use it as their fill.
```css
html.yt-spiral-tube-theme body ytd-watch-metadata .ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper button.ytSpecButtonShapeNextSegmentedStart[aria-pressed="true"] * {
  color: inherit !important;
  fill: currentColor !important;
}
```

### Future Prompt / Instructions
> **Prompt for AI:** "When overriding the active/toggled state colors for YouTube's segmented Like/Dislike buttons, targeting the `<button>` is not enough. You must target the child elements using the `*` selector (e.g., `button[aria-pressed="true"] *`) and set `color: inherit !important; fill: currentColor !important;` to override YouTube's native hardcoded icon colors."
