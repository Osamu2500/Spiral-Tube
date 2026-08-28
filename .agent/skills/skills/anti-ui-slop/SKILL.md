---
name: anti-ui-slop
description: "Stop coding agents from shipping generic UI. Extend the product's design system, cover required states, and inspect the rendered result to ensure UI looks product-specific, not AI-generated."
category: frontend
risk: safe
source: https://github.com/uizze/uizze/tree/main/skills/anti-ui-slop
source_repo: uizze/uizze
source_type: official
date_added: "2026-08-16"
author: UIZZE
tags: [ui, ux, frontend, design, anti-ui-slop]
tools: [claude, codex, cursor, copilot]
license: MIT
---

# Stop Making UI Slop

Build product-specific UI — not generic AI-generated interfaces.

## Overview

Use the product brief, existing interface, components, and local design system before reaching for outside references. The goal is UI that looks like it was built by a design-aware engineer at a top company.

## When to Use

Use this skill when designing, implementing, redesigning, critiquing, or doing a pre-ship review of a web or extension interface.

## Work From the Product

1. Identify the screen's real job, primary user and action, required content, and important loading, empty, error, success, disabled, and permission states.
2. Reuse the repository's components, semantic tokens, typography, spacing, and interaction conventions before adding a new abstraction or visual language.
3. For a new interface or major redesign, write a short design contract covering hierarchy, workflow shape, allowed components, required states, and responsive behavior.

## Anti-Patterns to Avoid

| AI Default | Problem | Production Fix |
|---|---|---|
| Purple/indigo everything | Models default to "safe" palettes | Use the project's actual color palette |
| Excessive gradients | Visual noise | Flat or subtle gradients matching design system |
| Rounded everything | Ignores hierarchy of corner radii | Consistent border-radius from design system |
| Lorem ipsum copy | Hides layout problems | Realistic placeholder content |
| Oversized padding | Destroys visual hierarchy | Consistent spacing scale |
| Shadow-heavy designs | Dated appearance | Subtle, purposeful shadows |
| Generic card grids | Ignores information priority | Purpose-driven layouts |

## Chrome Extension UI Guidelines

- Match YouTube's dark theme (`#0f0f0f`, `#272727`) 
- Use the YPP design tokens already defined in CSS variables
- Panels must feel native to YouTube — not like a foreign UI widget
- Respect YouTube's z-index hierarchy to avoid overlap issues
- All interactive states: hover, focus, active, disabled must be handled
- Never use `!important` on layout properties — only on filter/style overrides
