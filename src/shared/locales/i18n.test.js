import { describe, expect, it, vi } from 'vitest';
import en from './en.js';
import fr from './fr.js';

describe('i18n dictionary loading', () => {
    it('keeps English available immediately and loads the selected locale before resolving', async () => {
        vi.stubGlobal('chrome', {
            storage: {
                local: {
                    get: (_keys, callback) => callback({ settings: { extensionLanguage: 'fr' } })
                }
            }
        });

        const { initI18n, t } = await import('./i18n.js');

        // Callers can translate safely before asynchronous setup finishes.
        expect(t('nav_home')).toBe(en.nav_home);

        await initI18n();
        expect(t('nav_home')).toBe(fr.nav_home);
    });
});
