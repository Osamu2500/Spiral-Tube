---
name: javascript-testing-patterns
description: "Comprehensive guide for implementing robust testing strategies in JavaScript/TypeScript applications — unit tests, integration tests, mocking, and Chrome extension testing patterns."
risk: safe
source: community
date_added: "2026-02-27"
---

# JavaScript Testing Patterns

Comprehensive guide for implementing robust testing strategies in JavaScript/TypeScript applications using modern testing frameworks and best practices.

## Use This Skill When

- Setting up test infrastructure for new projects
- Writing unit tests for functions and classes
- Testing Chrome extension content scripts
- Mocking browser APIs (AudioContext, MutationObserver, chrome.storage)
- Implementing test-driven development

## Testing Pyramid

```
      /\
     /E2E\         ← Few: Playwright / Puppeteer (browser automation)
    /------\
   /Integr. \      ← Some: Component + API integration
  /----------\
 /   Unit     \    ← Many: Pure functions, class methods
/--------------\
```

## Unit Testing Patterns

### Pure Function Tests

```js
import { buildCSSFilterString } from './video-filters.js';

describe('buildCSSFilterString', () => {
    it('returns none when no adjustments', () => {
        const result = buildCSSFilterString(null, defaultAdj, 1, false);
        expect(result).toBe('none');
    });

    it('applies intensity scaling', () => {
        const adj = { ...defaultAdj, saturate: 150 };
        const result = buildCSSFilterString(null, adj, 0.5, false);
        expect(result).toContain('saturate(125%)');
    });
});
```

### Mocking Browser APIs

```js
// Mock AudioContext
global.AudioContext = jest.fn().mockImplementation(() => ({
    createGain: jest.fn(() => ({ gain: { value: 1, setTargetAtTime: jest.fn() } })),
    createBiquadFilter: jest.fn(() => ({ type: '', frequency: { value: 0 }, gain: { value: 0 }, Q: { value: 0 } })),
    destination: {},
    currentTime: 0,
    state: 'running',
    resume: jest.fn(() => Promise.resolve()),
}));

// Mock chrome.storage
global.chrome = {
    storage: {
        sync: {
            get: jest.fn((keys, cb) => cb({})),
            set: jest.fn((data, cb) => cb && cb()),
        },
    },
    runtime: { id: 'test-extension-id' },
};

// Mock MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
}));
```

### Class Method Tests

```js
describe('VolumeBooster', () => {
    let feature;
    beforeEach(() => {
        feature = new VolumeBooster();
        feature.settings = { enableVolumeBoost: true };
    });

    afterEach(() => {
        feature.disable();
    });

    it('loads volume from settings', () => {
        feature._loadSettings({ volumeLevel: 1.5 });
        expect(feature._volumeGain).toBe(1.5);
    });

    it('handles missing settings gracefully', () => {
        expect(() => feature._loadSettings(null)).not.toThrow();
    });
});
```

## Chrome Extension Testing

### Content Script Isolation

```js
// Test that the feature doesn't pollute global scope
it('uses window.YPP namespace', () => {
    expect(window.YPP.features.VideoFilters).toBeDefined();
    expect(window.undocumentedGlobal).toBeUndefined();
});
```

### DOM Integration Tests

```js
it('creates filter button with correct attributes', () => {
    document.body.innerHTML = '<div id="movie_player"></div>';
    const feature = new VideoFilters();
    const btn = feature.createButton(null);

    expect(btn.className).toBe('ypp-action-btn');
    expect(btn.title).toBe('Cinema Filters');
    expect(btn.querySelector('svg')).not.toBeNull();
});
```

## What to Test

- ✅ Pure transformation functions (filter string builders, value calculators)
- ✅ Settings parsing (`_loadSettings`)
- ✅ Event handler registration/cleanup
- ✅ Edge cases: null video, empty settings, corrupted storage data
- ❌ Don't test implementation details (internal variable names)
- ❌ Don't test third-party library internals (AudioContext nodes)
