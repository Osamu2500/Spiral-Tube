/**
 * i18n.js — Full Multi-Language Translation Engine
 * Generated from the master UI Blueprint.
 * Covers every tab, section, feature, subfeature, description,
 * dropdown option, badge, and UI string in the extension popup.
 *
 * Languages: English (en), Spanish (es), French (fr), German (de), Japanese (ja)
 */

export const SUPPORTED_LANGUAGES = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'es', label: '🇪🇸 Español' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'ja', label: '🇯🇵 日本語' },
    { value: 'it', label: '🇮🇹 Italiano' },
    { value: 'pt', label: '🇵🇹 Português' },
    { value: 'ru', label: '🇷🇺 Русский' },
    { value: 'zh', label: '🇨🇳 中文' },
    { value: 'ko', label: '🇰🇷 한국어' },
    { value: 'ar', label: '🇸🇦 العربية' },
    { value: 'hi', label: '🇮🇳 हिन्दी' },
    { value: 'tr', label: '🇹🇷 Türkçe' },
    { value: 'nl', label: '🇳🇱 Nederlands' },
    { value: 'pl', label: '🇵🇱 Polski' },
    { value: 'vi', label: '🇻🇳 Tiếng Việt' },
    { value: 'th', label: '🇹🇭 ไทย' },
    { value: 'id', label: '🇮🇩 Bahasa Indonesia' },
    { value: 'sv', label: '🇸🇪 Svenska' }
];

let currentLang = 'en';
let loadedMessages = {};

// ─────────────────────────────────────────────────────────────────────────────
// MASTER DICTIONARY
// Every key from the UI Blueprint, translated into all languages.
// ─────────────────────────────────────────────────────────────────────────────

// MASTER DICTIONARY
// Every key from the UI Blueprint, translated into all 5 languages.
// ─────────────────────────────────────────────────────────────────────────────
// English is kept in the initial module graph so that callers can safely use
// `t()` before `initI18n()` completes. The remaining dictionaries are loaded
// only for the selected UI language instead of making every popup parse all
// 19 translations on startup.
import en from './en.js';

const dictionaryLoaders = {
    es: () => import('./es.js'),
    fr: () => import('./fr.js'),
    de: () => import('./de.js'),
    ja: () => import('./ja.js'),
    it: () => import('./it.js'),
    pt: () => import('./pt.js'),
    ru: () => import('./ru.js'),
    zh: () => import('./zh.js'),
    ko: () => import('./ko.js'),
    ar: () => import('./ar.js'),
    hi: () => import('./hi.js'),
    tr: () => import('./tr.js'),
    nl: () => import('./nl.js'),
    pl: () => import('./pl.js'),
    vi: () => import('./vi.js'),
    th: () => import('./th.js'),
    id: () => import('./id.js'),
    sv: () => import('./sv.js')
};

let currentDictionary = en;

async function loadSelectedDictionary() {
    if (currentLang === 'en') {
        currentDictionary = en;
        return;
    }

    const loadDictionary = dictionaryLoaders[currentLang];
    if (!loadDictionary) {
        currentLang = 'en';
        currentDictionary = en;
        return;
    }

    try {
        currentDictionary = (await loadDictionary()).default || en;
    } catch (_) {
        // A missing or invalid optional locale must never block the popup.
        currentLang = 'en';
        currentDictionary = en;
    }
}

export const initI18n = async () => {
    return new Promise(resolve => {
        if (typeof chrome === 'undefined' || !chrome.storage) {
            resolve();
            return;
        }
        chrome.storage.local.get(['settings'], async (data) => {
            if (data?.settings?.extensionLanguage) {
                currentLang = data.settings.extensionLanguage;
            }

            await loadSelectedDictionary();

            // Try to load Chrome's native messages.json for this locale
            try {
                if (chrome.runtime?.getURL) {
                    const url = chrome.runtime.getURL(`_locales/${currentLang}/messages.json`);
                    const res = await fetch(url);
                    if (res.ok) {
                        loadedMessages = await res.json();
                    }
                }
            } catch (e) {
                // No messages.json for this locale — fall back to dictionary
            }

            resolve();
        });
    });
};

/**
 * Translate a key.
 * Priority: messages.json (Chrome native) → language dictionary → English fallback → key itself.
 */
export const t = (key) => {
    // 1. Chrome messages.json (native localization)
    if (loadedMessages[key]?.message) return loadedMessages[key].message;

    // 2. Full dictionary lookup
    if (currentDictionary?.[key]) return currentDictionary[key];

    // 3. English fallback
    if (en[key]) return en[key];

    // 4. chrome.i18n API fallback
    if (typeof chrome !== 'undefined' && chrome.i18n) {
        const msg = chrome.i18n.getMessage(key);
        if (msg) return msg;
    }

    // 5. Return key itself as last resort
    return key.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

/**
 * Get the current language code.
 */
export const getCurrentLang = () => currentLang;

