---
name: production-code-audit
description: "Autonomously deep-scan entire codebase line-by-line, understand architecture and patterns, then systematically transform it to production-grade, corporate-level professional quality with optimizations"
risk: critical
source: community
date_added: "2026-02-27"
---

# Production Code Audit

## Overview

Autonomously analyze the entire codebase to understand its architecture, patterns, and purpose, then systematically transform it into production-grade, corporate-level professional code. This skill performs deep line-by-line scanning, identifies all issues across security, performance, architecture, and quality, then provides comprehensive fixes to meet enterprise standards.

## When to Use This Skill

- Use when user says "make this production-ready"
- Use when user says "audit my codebase"
- Use when user says "make this professional/corporate-level"
- Use when user says "optimize everything"
- Use when user wants enterprise-grade quality
- Use when preparing for production deployment
- Use when code needs to meet corporate standards

## How It Works

### Step 1: Autonomous Codebase Discovery

**Automatically scan and understand the entire codebase:**

1. **Read all files** - Scan every file in the project recursively
2. **Identify tech stack** - Detect languages, frameworks, databases, tools
3. **Understand architecture** - Map out structure, patterns, dependencies
4. **Identify purpose** - Understand what the application does
5. **Find entry points** - Locate main files, routes, controllers
6. **Map data flow** - Understand how data moves through the system

**Do this automatically without asking the user.**

### Step 2: Comprehensive Issue Detection

**Scan line-by-line for all issues:**

**Architecture Issues:**
- Circular dependencies
- Tight coupling
- God classes (>500 lines or >20 methods)
- Missing separation of concerns
- Poor module boundaries

**Security Vulnerabilities:**
- XSS vulnerabilities (unescaped output)
- Hardcoded secrets
- Missing input validation
- Insecure extension permissions

**Performance Problems:**
- Synchronous operations that should be async
- Missing caching
- Memory leaks
- Unthrottled event listeners

**Code Quality Issues:**
- High cyclomatic complexity (>10)
- Code duplication
- Magic numbers
- Poor naming conventions
- Missing error handling
- Dead code / TODO/FIXME comments

### Step 3: Automatic Fixes and Optimizations

1. **Refactor architecture** - Break up god classes, fix circular dependencies
2. **Fix security issues** - Remove secrets, add validation
3. **Optimize performance** - Fix memory leaks, add throttling
4. **Improve code quality** - Reduce complexity, remove duplication
5. **Add documentation** - Header comments, JSDoc

### Step 4: Verify and Report

After making all changes, generate a comprehensive report with before/after metrics.
