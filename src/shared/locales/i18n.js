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
import en from './locales/en.js';
import es from './locales/es.js';
import fr from './locales/fr.js';
import de from './locales/de.js';
import ja from './locales/ja.js';
import it from './locales/it.js';
import pt from './locales/pt.js';
import ru from './locales/ru.js';
import zh from './locales/zh.js';
import ko from './locales/ko.js';
import ar from './locales/ar.js';
import hi from './locales/hi.js';
import tr from './locales/tr.js';
import nl from './locales/nl.js';
import pl from './locales/pl.js';
import vi from './locales/vi.js';
import th from './locales/th.js';
import id from './locales/id.js';
import sv from './locales/sv.js';

const dictionaries = {
    en, es, fr, de, ja, it, pt, ru, zh, ko, ar, hi, tr, nl, pl, vi, th, id, sv
};

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
    const dict = dictionaries[currentLang];
    if (dict?.[key]) return dict[key];

    // 3. English fallback
    if (dictionaries['en'][key]) return dictionaries['en'][key];

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

