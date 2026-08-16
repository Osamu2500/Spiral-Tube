const fs = require('fs');
const path = 'src/popup/popup-renderer.js';
let code = fs.readFileSync(path, 'utf8');

// I'll define simple distinct SVG flags for the 20 languages.
const LANGS_CODE = `const LANGS = [
        { value: 'en', native: 'English', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="40" fill="#fff"/><path fill="#B22234" d="M0 0h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0zm0 6.15h60v3.07H0z"/><rect width="26" height="21.5" fill="#3C3B6E"/><path fill="#fff" d="M3 3h2v2H3zm6 0h2v2H9zm6 0h2v2h-2zm6 0h2v2h-2z M3 8h2v2H3zm6 0h2v2H9zm6 0h2v2h-2zm6 0h2v2h-2z M3 13h2v2H3zm6 0h2v2H9zm6 0h2v2h-2zm6 0h2v2h-2z"/></svg>' },
        { value: 'es', native: 'Español', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="10" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/><rect y="30" width="60" height="10" fill="#AA151B"/><circle cx="20" cy="20" r="5" fill="#AA151B"/></svg>' },
        { value: 'fr', native: 'Français', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="20" height="40" fill="#002654"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg>' },
        { value: 'de', native: 'Deutsch', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="13.3" fill="#000"/><rect y="13.3" width="60" height="13.3" fill="#D00"/><rect y="26.6" width="60" height="13.4" fill="#FFCE00"/></svg>' },
        { value: 'ja', native: '日本語', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px; border:1px solid rgba(255,255,255,0.1);"><rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="12" fill="#BC002D"/></svg>' },
        { value: 'it', native: 'Italiano', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#CE2B37"/></svg>' },
        { value: 'pt', native: 'Português', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="24" height="40" fill="#006600"/><rect x="24" width="36" height="40" fill="#ff0000"/><circle cx="24" cy="20" r="10" fill="#ffcc00"/></svg>' },
        { value: 'ru', native: 'Русский', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="13.3" fill="#fff"/><rect y="13.3" width="60" height="13.3" fill="#0039A6"/><rect y="26.6" width="60" height="13.4" fill="#D52B1E"/></svg>' },
        { value: 'zh', native: '中文', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="40" fill="#DE2910"/><path fill="#FFDE00" d="M10 5l3 8h-8l6-5-3-8 6 5z"/></svg>' },
        { value: 'ko', native: '한국어', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px; border:1px solid rgba(255,255,255,0.1);"><rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="10" fill="#CD2E3A"/><path d="M20 20a10 10 0 0 1 20 0" fill="#0F64CD"/></svg>' },
        { value: 'ar', native: 'العربية', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="40" fill="#006C35"/><path fill="#fff" d="M30 10a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path fill="#006C35" d="M34 10a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>' },
        { value: 'hi', native: 'हिन्दी', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="13.3" fill="#FF9933"/><rect y="13.3" width="60" height="13.3" fill="#fff"/><rect y="26.6" width="60" height="13.4" fill="#138808"/><circle cx="30" cy="20" r="5" fill="#000080" stroke="#fff"/></svg>' },
        { value: 'tr', native: 'Türkçe', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="40" fill="#E30A17"/><circle cx="25" cy="20" r="10" fill="#fff"/><circle cx="28" cy="20" r="8" fill="#E30A17"/><path fill="#fff" d="M36 20l5-3-2 5 2 5-5-3-5 3 2-5-2-5z"/></svg>' },
        { value: 'nl', native: 'Nederlands', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="13.3" fill="#AE1C28"/><rect y="13.3" width="60" height="13.3" fill="#fff"/><rect y="26.6" width="60" height="13.4" fill="#21468B"/></svg>' },
        { value: 'pl', native: 'Polski', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px; border:1px solid rgba(255,255,255,0.1);"><rect width="60" height="20" fill="#fff"/><rect y="20" width="60" height="20" fill="#DC143C"/></svg>' },
        { value: 'vi', native: 'Tiếng Việt', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="40" fill="#DA251D"/><path fill="#FFCD00" d="M30 10l3 8h8l-6 5 2 8-7-5-7 5 2-8-6-5h8z"/></svg>' },
        { value: 'th', native: 'ไทย', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="6.6" fill="#ED1C24"/><rect y="6.6" width="60" height="6.6" fill="#fff"/><rect y="13.2" width="60" height="13.6" fill="#241D4F"/><rect y="26.8" width="60" height="6.6" fill="#fff"/><rect y="33.4" width="60" height="6.6" fill="#ED1C24"/></svg>' },
        { value: 'id', native: 'Indonesia', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px; border:1px solid rgba(255,255,255,0.1);"><rect width="60" height="20" fill="#FF0000"/><rect y="20" width="60" height="20" fill="#fff"/></svg>' },
        { value: 'sv', native: 'Svenska', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="14" height="10" style="border-radius:2px;"><rect width="60" height="40" fill="#006AA7"/><rect x="18" width="8" height="40" fill="#FECC00"/><rect y="16" width="60" height="8" fill="#FECC00"/></svg>' }
    ];`;

code = code.replace(/const LANGS = \[[\s\S]*?\];/, LANGS_CODE);

// Replace the innerHTML injection so that it includes the SVG flag
code = code.replace(
    /btn\.innerHTML = `<span>\$\{lang\.native\}<\/span>`;/,
    `btn.innerHTML = \`\${lang.svg} <span>\${lang.native}</span>\`;`
);

fs.writeFileSync(path, code);
console.log('Successfully injected SVG flags into popup-renderer.js');
