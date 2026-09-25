# CSS Scoping and Specificity Leaks

## Symptom
A UI styling change intended for a specific feature (e.g., hiding comments in Minimal Mode, or restyling the player controls in Player Retouch) is leaking out and affecting the entire YouTube interface even when the feature is toggled off in the extension settings.

## Root Cause
CSS rules in the extension were written too globally, without checking if the parent feature flag was active. 
When the extension injects its CSS files (either via Manifest V3 `content_scripts` or dynamic injection), those rules instantly apply to the DOM. If a rule simply targets `.ytp-chrome-bottom`, it will always apply, regardless of the user's settings. 

## The Fix: Data Attribute Scoping
Every single CSS rule tied to a togglable feature MUST be tightly scoped to a specific `data-` attribute on the `html` or `body` tag, or the root component of the feature.

1. **JavaScript State Manager:** When a feature is enabled in the popup, the Content Script must inject a `data-feature-[name]="true"` attribute onto the `html` element. When disabled, it must remove the attribute.
   ```javascript
   if (settings.playerRetouch) {
       document.documentElement.setAttribute('data-player-retouch', 'true');
   } else {
       document.documentElement.removeAttribute('data-player-retouch');
   }
   ```
2. **CSS Scoping:** All CSS rules in that feature's `.css` file must be wrapped or prefixed with that exact attribute selector.
   ```css
   /* WRONG: This will leak globally */
   .ytp-chrome-bottom {
       background: transparent !important;
   }

   /* CORRECT: This only applies when the feature is toggled ON */
   html[data-player-retouch="true"] .ytp-chrome-bottom {
       background: transparent !important;
   }
   ```
3. **Use `:is()` for Cleanliness:** If you have many selectors, use CSS `:is()` to keep things clean.
   ```css
   html[data-player-retouch="true"] :is(.ytp-chrome-bottom, .ytp-chrome-top) {
       opacity: 0.5;
   }
   ```

## AI Prompt Template
```text
The styles for a specific feature are leaking globally and breaking YouTube's UI when the feature is turned off. Please audit the CSS file for this feature and ensure every single CSS rule is strictly scoped to `html[data-feature-name="true"]`. Do not allow any global, unscoped CSS rules in this file.
```
