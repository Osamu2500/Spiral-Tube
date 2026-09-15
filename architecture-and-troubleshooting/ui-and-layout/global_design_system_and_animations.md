# Global Design System & Animations

## 1. Spring Animations & Hover States

### Issue
Interactive elements across the UI (buttons, sidebar items, video thumbnails) lacked a cohesive, modern, and premium feel on hover, relying on basic YouTube defaults or blunt scaling.

### Approach
Implemented a consistent "spring" transition across the UI. Instead of just scaling up elements, we introduced a sophisticated `translateY` lift effect combined with subtle scaling and box-shadow enhancements.

### Solution
Created a global CSS variable for the spring transition:
`--ypp-transition-spring: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);`

Applied this to buttons globally:
```css
button {
  transition: transform var(--ypp-transition-spring), box-shadow var(--ypp-transition-smooth) !important;
}
button:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
}
button:active {
  transform: scale(0.95) !important;
}
```

### Future Prompt / Instructions
> **Prompt for AI:** "When adding hover interactions to any new UI components in this extension, always use the `--ypp-transition-spring` cubic-bezier function. Prefer `translateY(-2px)` lifts over simple scaling, and pair it with a deep, soft `box-shadow`. Ensure `:active` states use `transform: scale(0.95)` for a tactile click feel."

---

## 2. Unifying the Search Box (Pill to Squircle)

### Issue
The navbar search box retained YouTube's native pill shape (fully rounded ends), which clashed with the extension's new `squircle` (rounded rectangle) design language. Additionally, the focus state was a harsh native outline.

### Approach
Overrode the border-radius of the `#search-form` and its input fields to use the standard `--ypp-squircle-radius` (16px). Replaced the native focus outline with a soft, glowing blue box-shadow.

### Solution
```css
ytd-searchbox #search-form {
  border-radius: var(--ypp-squircle-radius, 16px) !important;
}
ytd-searchbox #search-form:focus-within {
  box-shadow: 0 0 0 2px rgba(62, 166, 255, 0.4), 0 4px 20px rgba(62, 166, 255, 0.15) !important;
  border-color: var(--ypp-accent, #3ea6ff) !important;
}
```

### Future Prompt / Instructions
> **Prompt for AI:** "To maintain design consistency, ensure no elements use YouTube's native 'pill' shapes (like `border-radius: 999px`). Everything should use `--ypp-squircle-radius` or `--ypp-border-radius-base`. When styling focus states, disable native `outline` and use a layered `box-shadow` to create a glowing effect."
