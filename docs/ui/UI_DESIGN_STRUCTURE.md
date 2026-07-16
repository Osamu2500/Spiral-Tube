# 🎨 UI Design Structure — Master Reference Guide

> **Every UI design in this project MUST follow this structure.**
> This document defines the full anatomy of a UI design system — from tokens
> to pages to interactions. If a file or concept is listed here, it must be
> accounted for in every new design.

---

## 📁 Full Folder Structure

```
ui/
├── tokens/                        # Design tokens (the single source of truth)
│   ├── colors.css                 # Color palette & semantic color variables
│   ├── typography.css             # Font families, sizes, weights, line-heights
│   ├── spacing.css                # Spacing scale (4px grid system)
│   ├── borders.css                # Border radii, border widths, border colors
│   ├── shadows.css                # Box shadows, text shadows, drop shadows
│   ├── motion.css                 # Duration, easing curves, transition presets
│   ├── breakpoints.css            # Responsive breakpoint definitions
│   └── z-index.css                # Z-index scale and layer naming
│
├── base/                          # Reset, normalize, and foundational styles
│   ├── reset.css                  # CSS reset (box-model, margins, paddings)
│   ├── root.css                   # :root variable declarations (all tokens applied)
│   ├── typography-base.css        # Base heading/body/link styles
│   ├── scrollbar.css              # Custom scrollbar styles
│   ├── selection.css              # ::selection highlight color
│   └── accessibility.css          # Focus rings, skip links, reduced motion
│
├── theme/                         # Light/Dark/Custom theme switching
│   ├── light.css                  # Light mode overrides
│   ├── dark.css                   # Dark mode overrides
│   ├── theme-switcher.js          # JS logic to toggle themes + persist to storage
│   └── theme.md                   # Theme documentation and usage rules
│
├── layout/                        # Page-level layout primitives
│   ├── grid.css                   # CSS Grid system (columns, auto-fit, etc.)
│   ├── flex.css                   # Flexbox utility classes
│   ├── container.css              # Max-width centered containers
│   ├── stack.css                  # Vertical stacking layout
│   ├── sidebar.css                # Sidebar layout (fixed/collapsible)
│   ├── header.css                 # Global header/navbar layout
│   ├── footer.css                 # Global footer layout
│   └── main.css                   # Main content area (padding, min-height)
│
├── components/                    # All reusable UI components
│   │
│   ├── core/                      # Atomic-level components
│   │   ├── button.css             # Button variants (primary, secondary, ghost, icon)
│   │   ├── button.js              # Button behavior (loading states, ripple effect)
│   │   ├── input.css              # Text inputs, textarea, number, search
│   │   ├── input.js               # Input validation, masking, clear button
│   │   ├── label.css              # Form labels and required indicators
│   │   ├── checkbox.css           # Checkbox and radio button styles
│   │   ├── toggle.css             # Toggle switch component
│   │   ├── toggle.js              # Toggle state logic
│   │   ├── select.css             # Dropdown/select component
│   │   ├── select.js              # Custom select behavior
│   │   ├── badge.css              # Status badges (success, warning, error, info)
│   │   ├── chip.css               # Filter chips, tag chips
│   │   ├── icon.css               # Icon sizing, color, and alignment system
│   │   ├── avatar.css             # User avatar (image, initials, group)
│   │   ├── avatar.js              # Fallback to initials on image error
│   │   ├── divider.css            # Horizontal and vertical dividers
│   │   ├── spinner.css            # Loading spinner animations
│   │   ├── skeleton.css           # Skeleton loading placeholders
│   │   └── tooltip.css            # Hover/focus tooltips
│   │   └── tooltip.js             # Tooltip positioning logic
│   │
│   ├── cards/                     # Card component system (critical section)
│   │   ├── card-base.css          # Base card: padding, radius, shadow, bg
│   │   ├── card-hover.css         # Hover lift/glow effects
│   │   ├── card-image.css         # Card with top image (16:9, square, cover)
│   │   ├── card-stat.css          # Stat/metric card (number + label + trend)
│   │   ├── card-profile.css       # User/profile card with avatar and bio
│   │   ├── card-action.css        # Card with CTA buttons at bottom
│   │   ├── card-glass.css         # Glassmorphism card (blur + transparency)
│   │   ├── card-gradient.css      # Gradient background card
│   │   ├── card-compact.css       # Dense/compact list-style card
│   │   ├── card-media.css         # Video/audio card with thumbnail overlay
│   │   └── card-interactive.css   # Selectable/clickable card with checked state
│   │
│   ├── navigation/                # Navigation components
│   │   ├── navbar.css             # Top navigation bar
│   │   ├── navbar.js              # Mobile menu toggle, active link logic
│   │   ├── sidebar-nav.css        # Side navigation with nested items
│   │   ├── sidebar-nav.js         # Collapsible groups, active highlight
│   │   ├── breadcrumb.css         # Breadcrumb trail
│   │   ├── tabs.css               # Tab bar with active indicator
│   │   ├── tabs.js                # Tab switching logic
│   │   ├── pagination.css         # Page number pagination
│   │   ├── pagination.js          # Page change logic
│   │   └── bottom-nav.css         # Mobile bottom navigation bar
│   │
│   ├── overlays/                  # Modal, drawer, popover, toast
│   │   ├── modal.css              # Modal dialog styles
│   │   ├── modal.js               # Open/close, trap focus, esc key
│   │   ├── drawer.css             # Side drawer/panel
│   │   ├── drawer.js              # Drawer open/close with animation
│   │   ├── popover.css            # Floating popover panel
│   │   ├── popover.js             # Positioning, close on outside click
│   │   ├── toast.css              # Notification toasts (success/error/info)
│   │   ├── toast.js               # Auto-dismiss, stack queue, manual close
│   │   ├── dropdown.css           # Dropdown menu
│   │   ├── dropdown.js            # Dropdown toggle and keyboard nav
│   │   ├── context-menu.css       # Right-click context menu
│   │   └── context-menu.js        # Context menu trigger and positioning
│   │
│   ├── feedback/                  # User feedback components
│   │   ├── alert.css              # Inline alerts (info, warning, error, success)
│   │   ├── progress-bar.css       # Linear progress bar
│   │   ├── progress-bar.js        # Animated progress updates
│   │   ├── progress-ring.css      # Circular/ring progress indicator
│   │   ├── empty-state.css        # Empty state (no data) illustration + message
│   │   ├── error-state.css        # Error state with retry button
│   │   └── confirmation.css       # Confirmation dialog (destructive actions)
│   │
│   ├── data-display/              # Tables, lists, charts containers
│   │   ├── table.css              # Data table with sortable headers
│   │   ├── table.js               # Sort, filter, row selection logic
│   │   ├── list.css               # Unordered/ordered list variants
│   │   ├── list-item.css          # List item with icon, meta, action
│   │   ├── data-grid.css          # Dense data grid layout
│   │   ├── timeline.css           # Vertical/horizontal timeline
│   │   ├── stat-block.css         # KPI/stats display block
│   │   ├── code-block.css         # Code display with syntax highlighting
│   │   └── chart-container.css    # Wrapper for charts (consistent sizing)
│   │
│   └── forms/                     # Complex form components
│       ├── form-group.css         # Label + input + helper text grouping
│       ├── form-error.css         # Inline validation error messages
│       ├── search-bar.css         # Search input with icon and clear
│       ├── search-bar.js          # Debounce, suggestions, clear logic
│       ├── date-picker.css        # Date/time picker component
│       ├── date-picker.js         # Calendar logic and selection
│       ├── file-upload.css        # Drag-and-drop file upload zone
│       ├── file-upload.js         # File validation, preview, progress
│       ├── range-slider.css       # Custom range slider
│       ├── range-slider.js        # Dual-handle range logic
│       └── color-picker.css       # Color picker input
│
├── pages/                         # Page-level structure and layout
│   ├── _page-base.css             # Base page styles (all pages extend this)
│   ├── landing.css                # Landing/home page layout
│   ├── dashboard.css              # Dashboard page (widgets, grid)
│   ├── auth.css                   # Login / Register / Forgot Password
│   ├── profile.css                # User profile page
│   ├── settings.css               # Settings page with section nav
│   ├── detail.css                 # Detail/single-item view page
│   ├── list.css                   # List/browse/gallery page
│   ├── search-results.css         # Search results page
│   ├── onboarding.css             # Multi-step onboarding flow
│   ├── error-404.css              # 404 Not Found page
│   ├── error-500.css              # 500 Server Error page
│   └── maintenance.css            # Maintenance / coming soon page
│
├── animations/                    # Motion and animation library
│   ├── keyframes.css              # All @keyframe definitions
│   ├── transitions.css            # Transition utility classes
│   ├── entrance.css               # Fade in, slide in, zoom in effects
│   ├── exit.css                   # Fade out, slide out, zoom out effects
│   ├── scroll.css                 # Scroll-triggered animation classes
│   ├── scroll.js                  # IntersectionObserver for scroll reveals
│   ├── micro.css                  # Micro-interactions (pulse, shake, bounce)
│   └── page-transition.js         # Page-level transition orchestration
│
├── utilities/                     # Single-purpose utility classes
│   ├── display.css                # flex, grid, block, hidden, etc.
│   ├── position.css               # relative, absolute, fixed, sticky
│   ├── overflow.css               # overflow hidden, scroll, auto
│   ├── text.css                   # text-align, truncate, wrap, transform
│   ├── cursor.css                 # cursor pointer, not-allowed, etc.
│   ├── opacity.css                # Opacity scale utilities
│   ├── sizing.css                 # Width/height utilities (w-full, h-screen)
│   ├── aspect-ratio.css           # Aspect ratio utilities (16:9, 1:1, 4:3)
│   ├── visually-hidden.css        # Screen-reader-only utility
│   └── print.css                  # Print-friendly styles
│
├── icons/                         # Icon system
│   ├── icons.svg                  # SVG sprite sheet (all icons)
│   ├── icons.js                   # Icon render helper function
│   └── icons.md                   # List of all available icons + usage
│
├── assets/                        # Static design assets
│   ├── fonts/                     # Self-hosted font files
│   ├── images/                    # UI images (not user content)
│   ├── illustrations/             # Empty state / onboarding illustrations
│   └── logos/                     # App logo in all variants (light, dark, icon)
│
├── docs/                          # Design system documentation
│   ├── DESIGN_SYSTEM.md           # Overview of the entire design system
│   ├── COLOR_USAGE.md             # How and when to use each color
│   ├── TYPOGRAPHY_GUIDE.md        # Type scale and usage examples
│   ├── COMPONENT_CATALOG.md       # All components with usage examples
│   ├── ACCESSIBILITY.md           # A11y rules and how they're implemented
│   ├── ANIMATION_GUIDE.md         # When and how to use animations
│   └── CARD_SYSTEM.md             # Card type guide with visual examples
│
└── index.css                      # Master CSS import (imports everything in order)
```

---

## 🎨 Design Tokens Reference

Every UI must define these token categories inside `tokens/`:

### Colors (`tokens/colors.css`)
```css
:root {
  /* Brand */
  --color-brand-50: ...;
  --color-brand-100: ...;
  /* ... through 900 */

  /* Neutrals */
  --color-neutral-0: #ffffff;
  --color-neutral-50: ...;
  /* ... through 950 */

  /* Semantic */
  --color-success: ...;
  --color-warning: ...;
  --color-error: ...;
  --color-info: ...;

  /* Surfaces */
  --color-surface-primary: ...;
  --color-surface-secondary: ...;
  --color-surface-elevated: ...;
  --color-surface-overlay: ...;

  /* Text */
  --color-text-primary: ...;
  --color-text-secondary: ...;
  --color-text-muted: ...;
  --color-text-inverse: ...;
  --color-text-link: ...;

  /* Borders */
  --color-border-default: ...;
  --color-border-subtle: ...;
  --color-border-strong: ...;
}
```

### Typography (`tokens/typography.css`)
```css
:root {
  /* Font families */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Outfit', sans-serif;

  /* Type scale */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */

  /* Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.05em;
  --tracking-wider: 0.1em;
}
```

### Spacing (`tokens/spacing.css`)
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px  */
  --space-2: 0.5rem;    /* 8px  */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Shadows (`tokens/shadows.css`)
```css
:root {
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md:  0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg:  0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl:  0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
  --shadow-2xl: 0 25px 50px rgba(0,0,0,0.25);
  --shadow-glow: 0 0 20px rgba(var(--color-brand-rgb), 0.4);
  --shadow-inner: inset 0 2px 4px rgba(0,0,0,0.06);
}
```

### Motion (`tokens/motion.css`)
```css
:root {
  /* Durations */
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;

  /* Easing */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## 🃏 Card System Rules

All cards must be built from `card-base.css` and extend with modifiers:

| Card Type         | File                   | Use Case                          |
|-------------------|------------------------|-----------------------------------|
| Base              | `card-base.css`        | Default card wrapper              |
| Image Card        | `card-image.css`       | Blog posts, products, media       |
| Stat Card         | `card-stat.css`        | KPIs, metrics, dashboards         |
| Profile Card      | `card-profile.css`     | Users, authors, team members      |
| Action Card       | `card-action.css`      | Pricing, feature, CTA cards       |
| Glass Card        | `card-glass.css`       | Hero sections, overlays           |
| Gradient Card     | `card-gradient.css`    | Highlights, featured items        |
| Compact Card      | `card-compact.css`     | Dense lists, notifications        |
| Media Card        | `card-media.css`       | Videos, podcasts, audio           |
| Interactive Card  | `card-interactive.css` | Selectable grids, checkable items |

### Card Anatomy (every card must have)
```
┌──────────────────────────────┐
│  [Card Header]               │  ← Title, subtitle, badge, action icon
│  ─────────────────────────── │
│  [Card Media]  (optional)    │  ← Image, video thumbnail, icon
│  [Card Body]                 │  ← Main content, description, data
│  [Card Footer] (optional)    │  ← Actions, meta info, timestamps
└──────────────────────────────┘
```

---

## 📄 Page Requirements

Every page file must cover:

| Section          | Description                                              |
|------------------|----------------------------------------------------------|
| `<head>` meta    | Title, description, OG tags, favicon                     |
| Header/Nav       | Logo, links, theme toggle, user menu                     |
| Hero/Banner      | Page title, subtitle, primary CTA                        |
| Main Content     | Core page content in semantic `<main>`                   |
| Sidebar          | Filters, navigation, or supplementary content (if needed)|
| Footer           | Links, copyright, social links                           |
| Loading State    | Skeleton or spinner shown during data fetch              |
| Empty State      | Illustrated empty state for no-data scenarios            |
| Error State      | Error message with retry action                          |
| Responsive       | Mobile-first, tablet, desktop breakpoints covered        |

### Required Pages Checklist

- [ ] **Landing / Home** — Hero, features, testimonials, CTA
- [ ] **Dashboard** — Stats, charts, recent activity, quick actions
- [ ] **Authentication** — Login, Register, Forgot Password, Reset Password
- [ ] **User Profile** — Avatar, bio, stats, activity feed
- [ ] **Settings** — Account, appearance, notifications, privacy sections
- [ ] **Detail View** — Single item full view with related items
- [ ] **List / Browse** — Grid or list with filters, sort, search, pagination
- [ ] **Search Results** — Search bar, filters, result count, results grid
- [ ] **Onboarding** — Step-by-step flow with progress indicator
- [ ] **404 Not Found** — Friendly error with navigation back
- [ ] **500 Server Error** — Error message with support contact
- [ ] **Maintenance** — Coming soon / under maintenance page

---

## 🧩 Component Completion Checklist

For every component, all states must be styled:

| State           | Must Be Covered                                          |
|-----------------|----------------------------------------------------------|
| Default         | Normal resting appearance                                |
| Hover           | Color shift, shadow, cursor change                       |
| Active/Pressed  | Pressed-down visual feedback                             |
| Focus           | Visible focus ring (keyboard accessible)                 |
| Disabled        | Reduced opacity, no-pointer cursor                       |
| Loading         | Spinner or skeleton replacement                          |
| Error           | Red border, error icon, error message                    |
| Success         | Green indicator, check icon                              |
| Empty           | Illustrated placeholder                                  |
| Dark Mode       | All above states in dark theme                           |

---

## 📐 Responsive Breakpoints

All layouts must be tested at every breakpoint:

| Name   | Min Width | Target Devices                   |
|--------|-----------|----------------------------------|
| `xs`   | 0px       | Small phones (320px+)            |
| `sm`   | 480px     | Large phones                     |
| `md`   | 768px     | Tablets / landscape phones       |
| `lg`   | 1024px    | Small laptops / large tablets    |
| `xl`   | 1280px    | Standard desktops                |
| `2xl`  | 1536px    | Large/ultra-wide desktops        |

```css
/* Usage in CSS */
@media (min-width: 768px)  { /* md  */ }
@media (min-width: 1024px) { /* lg  */ }
@media (min-width: 1280px) { /* xl  */ }
```

---

## ♿ Accessibility Requirements

Every UI design **must** satisfy these accessibility rules:

- [ ] All interactive elements have a visible focus ring
- [ ] Color contrast ratio ≥ 4.5:1 for text (WCAG AA)
- [ ] All images have descriptive `alt` text
- [ ] Form inputs are paired with `<label>` elements
- [ ] All icons used as buttons have `aria-label`
- [ ] Modals trap focus and restore on close
- [ ] Skip-to-content link at top of page
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Touch targets are minimum 44×44px
- [ ] Keyboard-navigable without mouse

---

## 🌗 Theme Requirements

Every UI design must support both light and dark themes:

| Requirement              | Details                                  |
|--------------------------|------------------------------------------|
| Default theme            | Must be dark mode (modern standard)      |
| Theme toggle             | Persistent via `localStorage`            |
| System preference        | Respect `prefers-color-scheme`           |
| Zero FOUC                | Theme applied before paint               |
| All tokens switched      | Surface, text, border, shadow all switch |
| Images/illustrations adapt | Use CSS filters or theme-aware sources |

---

## 🏗️ `index.css` — Master Import Order

```css
/* 1. Tokens (no selectors, only variables) */
@import './tokens/colors.css';
@import './tokens/typography.css';
@import './tokens/spacing.css';
@import './tokens/borders.css';
@import './tokens/shadows.css';
@import './tokens/motion.css';
@import './tokens/breakpoints.css';
@import './tokens/z-index.css';

/* 2. Base (foundational styles) */
@import './base/reset.css';
@import './base/root.css';
@import './base/typography-base.css';
@import './base/scrollbar.css';
@import './base/selection.css';
@import './base/accessibility.css';

/* 3. Theme */
@import './theme/light.css';
@import './theme/dark.css';

/* 4. Layout */
@import './layout/grid.css';
@import './layout/flex.css';
@import './layout/container.css';
@import './layout/stack.css';
@import './layout/sidebar.css';
@import './layout/header.css';
@import './layout/footer.css';
@import './layout/main.css';

/* 5. Core Components */
@import './components/core/button.css';
@import './components/core/input.css';
/* ... all core components ... */

/* 6. Cards */
@import './components/cards/card-base.css';
@import './components/cards/card-hover.css';
/* ... all card types ... */

/* 7. Navigation */
@import './components/navigation/navbar.css';
/* ... all nav components ... */

/* 8. Overlays */
@import './components/overlays/modal.css';
/* ... all overlays ... */

/* 9. Feedback */
@import './components/feedback/alert.css';
/* ... all feedback ... */

/* 10. Data Display */
@import './components/data-display/table.css';
/* ... all data display ... */

/* 11. Forms */
@import './components/forms/form-group.css';
/* ... all form components ... */

/* 12. Animations */
@import './animations/keyframes.css';
@import './animations/transitions.css';
@import './animations/entrance.css';
@import './animations/exit.css';
@import './animations/scroll.css';
@import './animations/micro.css';

/* 13. Utilities (last — highest specificity allowed) */
@import './utilities/display.css';
@import './utilities/text.css';
/* ... all utilities ... */
@import './utilities/print.css';
```

---

## ✅ New UI Design Checklist

Before any UI design is considered **complete**, verify:

### Foundation
- [ ] All design tokens defined in `tokens/`
- [ ] Base reset and root styles applied
- [ ] Light + Dark theme working with toggle
- [ ] `index.css` imports all files in correct order

### Components
- [ ] All core components (button, input, etc.) built
- [ ] All required card types created
- [ ] Navigation components (navbar, sidebar, tabs) implemented
- [ ] Overlays (modal, toast, drawer) working
- [ ] All component states covered (default, hover, focus, disabled, loading, error)

### Pages
- [ ] All required pages created
- [ ] Every page has header, main content, and footer
- [ ] Loading, empty, and error states on every page
- [ ] All pages are responsive across all breakpoints

### Quality
- [ ] Accessibility checklist passed
- [ ] Dark mode fully tested
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No hardcoded colors/sizes (all use tokens)
- [ ] No unused CSS files
- [ ] Documentation in `docs/` is up to date

---

> 📌 **This document is the law for UI designs.**
> Any design that skips a section in this structure without documented justification is considered incomplete.
