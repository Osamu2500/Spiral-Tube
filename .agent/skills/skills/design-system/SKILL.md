---
name: design-system
description: "Mechanical implementation invariants for frontend design: token architecture, typography hierarchy, loading order, FOUT prevention, motion timing, color semantics. Use when building components, pages, or design systems."
risk: critical
source: https://github.com/connerkward/ckw-design-skill/tree/main/design-system
source_repo: connerkward/ckw-design-skill
source_type: community
date_added: 2026-07-01
license: MIT
author: Conner K Ward
---

# Design System

## When to Use

Use this skill when you need mechanical implementation invariants for frontend design: token architecture, typography hierarchy, FOUT prevention, chrome stability, motion timing, and color semantics. Apply when implementing UI components, pages, or design systems.

## Token Architecture

All colors map to a small set of primitives. No random hex values.

- **Foreground**: Text hierarchy (primary, secondary, muted)
- **Background**: Surface elevation (base, raised, overlay)
- **Border**: Separation hierarchy (subtle, default, emphasis)
- **Brand**: Identity and primary accent
- **Semantic**: Destructive, warning, success, info

Use tokens in code (CSS variables, theme objects); **never hardcode hex for UI**.

### YPP Token Mapping

```css
/* Extension-specific tokens */
--ypp-bg-base: #0f0f0f;
--ypp-bg-raised: #1a1a1a;
--ypp-bg-overlay: #222222;
--ypp-border-subtle: rgba(255,255,255,0.08);
--ypp-border-default: rgba(255,255,255,0.15);
--ypp-text-primary: #ffffff;
--ypp-text-secondary: rgba(255,255,255,0.7);
--ypp-text-muted: rgba(255,255,255,0.4);
--ypp-accent: #3ea6ff;
```

## Typography

- **Hierarchy**: Headlines — heavier weight, tighter letter-spacing. Body — comfortable weight for readability. Labels/UI — medium weight at smaller sizes.
- Combine size, weight, and letter-spacing so hierarchy is clear at a glance.
- If you squint and can't distinguish headline from body, hierarchy is too weak.

## Motion Timing

- **Micro interactions** (hover, toggle): 120–180ms ease
- **Panel open/close**: 200–280ms ease-out / ease-in
- **Large transitions**: 300–400ms with `cubic-bezier(0.4, 0, 0.2, 1)`
- Never animate properties that cause layout reflow (`width`, `height`, `top`, `left`)
- Prefer `transform` and `opacity` — GPU-composited, no reflow

```css
/* Good: GPU-composited */
transition: transform 0.25s ease, opacity 0.25s ease;

/* Bad: causes layout reflow */
transition: height 0.25s ease;
```

## Color Semantics

- **Primary action**: `--ypp-accent` (`#3ea6ff`)
- **Destructive**: `#ff4444` or `#f44336`
- **Success**: `#4caf50`
- **Warning**: `#ff9800`
- **Disabled**: `rgba(255,255,255,0.25)` on muted background

## Chrome Stability (Extension Context)

- Use `will-change: transform` on panels that animate in
- Add `isolation: isolate` to prevent z-index conflicts with YouTube layers
- Avoid `overflow: hidden` on the panel root — YouTube may clip it
- All panels should stack at `z-index: 2147483647` (max) to ensure visibility
