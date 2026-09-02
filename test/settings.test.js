import { describe, it, expect, beforeEach } from 'vitest';

// Basic mock to allow settings-schema to load in Node
global.window = { YPP: {} };
await import('../src/shared/config/settings-schema.js');

describe('Settings Schema Validation', () => {
    let schema;

    beforeEach(() => {
        schema = window.YPP.SettingsSchema;
    });

    it('should fill missing keys with defaults', () => {
        const raw = {};
        const result = schema.validateAndMerge(raw);
        expect(result.schemaVersion).toBe(2);
        expect(result.premiumTheme).toBe(true);
        expect(result.activeTheme).toBe('default');
    });

    it('should clamp numbers out of bounds', () => {
        const raw = { homeColumns: 999, fontScale: 10 };
        const result = schema.validateAndMerge(raw);
        // max is 10, min is 80
        expect(result.homeColumns).toBe(10);
        expect(result.fontScale).toBe(80);
    });

    it('should reset wrong types to default', () => {
        const raw = { premiumTheme: 'yes', hideMixes: 1 };
        const result = schema.validateAndMerge(raw);
        expect(result.premiumTheme).toBe(true); // default
        expect(result.hideMixes).toBe(false); // default
    });
});
