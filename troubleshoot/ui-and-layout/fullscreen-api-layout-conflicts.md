# Fullscreen API & Layout Conflicts

## Symptom
When the user clicks YouTube's native "Fullscreen" button (or presses 'f'), the video layout breaks entirely. Black boxes appear on the screen, the video player shrinks into a corner, or scrollbars appear unexpectedly. The layout works perfectly in normal or theater mode.

## Root Cause
Features that manipulate the height, width, or overflow properties of YouTube's core container elements (like `ytd-app`, `ytd-watch-flexy`, or the `#columns` grid) conflict catastrophically with the browser's native Fullscreen API. 
When an element enters fullscreen, the browser creates a new rendering context that assumes the element has full control over dimensions. If the extension forces `height: 100vh` or `overflow: hidden` on a parent element (e.g., to create a split-scrolling effect), it restricts the fullscreen context, causing visual clipping and black boxes.

## The Fix: Native Fullscreen Detection
Any feature that manipulates the global page layout must explicitly check if the browser is in fullscreen mode, and if so, safely disable its overrides.

1. **CSS Selectors:** Use the `:not(:fullscreen)` pseudo-class (and its vendor prefixes) in your CSS to ensure your layout overrides only apply when the browser is NOT in fullscreen.
   ```css
   html:not([fullscreen]) ytd-watch-flexy[data-feature-enabled="true"] {
       overflow: hidden;
   }
   ```
2. **JavaScript State Check:** If your layout requires JS calculations, bind to the `fullscreenchange` event and check `document.fullscreenElement`.
   ```javascript
   document.addEventListener('fullscreenchange', () => {
       if (document.fullscreenElement) {
           // Disable layout manipulation
           layoutController.disable();
       } else {
           // Re-enable layout manipulation
           layoutController.enable();
       }
   });
   ```

## AI Prompt Template
```text
The extension's layout manipulation (like Split Scrolling or Cinema Mode) is breaking when the user enters native Fullscreen mode. Please review the CSS and JavaScript for this feature. Ensure we are using the `:not(:fullscreen)` pseudo-class or checking `document.fullscreenElement` to gracefully disable our layout overrides whenever the browser enters fullscreen.
```
