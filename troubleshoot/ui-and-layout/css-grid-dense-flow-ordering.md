# CSS Grid `dense` Flow Ordering Bugs

## Symptom
UI elements within a CSS Grid (such as `.feature-grid`) render out of chronological order. Specifically, smaller elements (spanning 1 column) jump ahead of wider elements (spanning all columns, like `grid-column: 1 / -1`), appearing above them in the UI when they should appear below.

## Root Cause
The CSS property `grid-auto-flow: row dense;` instructs the browser's layout engine to aggressively pack items into the grid to minimize empty space. 
When a full-width element (e.g., a subtitle divider) is placed, it often forces the grid to jump to a new row, leaving empty cells on the current row. 
Because `dense` is active, the layout engine searches the DOM *after* the full-width element for any smaller items that can fit into those empty cells, and pulls them backward in the layout, destroying the logical DOM order.

## The Fix
Remove the `dense` keyword from `grid-auto-flow` on grids where sequential ordering is critical, especially when combining items of varying spans (like dividers).
Use `grid-auto-flow: row;` (the default) instead. This ensures items strictly follow their DOM order, leaving empty cells blank if a subsequent large item requires a line break.

## AI Prompt Template
```text
I am seeing items in a CSS Grid rendering out of order. Some smaller cards or buttons are jumping above full-width dividers or titles, even though they are listed after them in the DOM/HTML.
Please check the CSS for `.feature-grid` or the parent container. Look for `grid-auto-flow: row dense;` and remove the `dense` keyword. We need the grid to respect strict chronological DOM ordering.
```
