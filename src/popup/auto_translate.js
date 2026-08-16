const fs = require('fs');

async function main() {
    const i18nPath = 'src/shared/i18n.js';
    let i18nContent = fs.readFileSync(i18nPath, 'utf8');

    // 1. Extract the `en` dictionary
    const enDictRegex = /'en':\s*\{([\s\S]*?)\n\s*\},/g;
    const match = enDictRegex.exec(i18nContent);
    if (!match) {
        console.error("Could not find 'en' dictionary in i18n.js");
        return;
    }

    // Evaluate the object to get all keys and values
    // We can parse it by creating a dummy script context
    let enObj = {};
    try {
        const objStr = `({${match[1]}})`;
        enObj = eval(objStr);
    } catch (e) {
        console.error("Failed to parse 'en' dictionary string", e);
        return;
    }

    const TARGET_LANGS = [
        'es', 'fr', 'de', 'ja', 'it', 'pt', 'ru', 'zh', 'ko', 'ar', 
        'hi', 'tr', 'nl', 'pl', 'vi', 'th', 'id', 'sv'
    ];

    console.log(`Loaded ${Object.keys(enObj).length} keys. Proceeding to translate into ${TARGET_LANGS.length} languages.`);

    const newDicts = {};
    newDicts['en'] = enObj; // preserve EN

    // Function to translate an array of texts
    async function translateBatch(texts, targetLang) {
        const joined = texts.join('\n');
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(joined)}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            
            let fullTranslated = '';
            data[0].forEach(item => {
                if (item[0]) fullTranslated += item[0];
            });
            
            const results = fullTranslated.split('\n').map(s => s.trim());
            // If length mismatches due to Google merging lines, pad it
            while(results.length < texts.length) results.push('');
            return results;
        } catch (e) {
            console.error(`Translation failed for ${targetLang}`, e);
            return texts; // fallback
        }
    }

    // We will do this sequentially to avoid Google API rate limits
    const keys = Object.keys(enObj);
    const values = Object.values(enObj);

    // Batching to prevent URL length limits
    const BATCH_SIZE = 40;

    for (const lang of TARGET_LANGS) {
        console.log(`Translating to ${lang}...`);
        newDicts[lang] = {};
        
        for (let i = 0; i < values.length; i += BATCH_SIZE) {
            const batchKeys = keys.slice(i, i + BATCH_SIZE);
            const batchVals = values.slice(i, i + BATCH_SIZE);
            
            const translatedVals = await translateBatch(batchVals, lang);
            
            batchKeys.forEach((key, idx) => {
                newDicts[lang][key] = translatedVals[idx] || batchVals[idx];
            });
            
            // small delay to prevent 429 Too Many Requests
            await new Promise(r => setTimeout(r, 400));
        }
    }

    console.log("Translation complete. Rebuilding dictionaries object...");

    let newDictStr = 'const dictionaries = {\n';
    for (const lang of ['en', ...TARGET_LANGS]) {
        newDictStr += `    '${lang}': {\n`;
        for (const key of keys) {
            // Remove literal newlines to prevent parser breakages
            let val = newDicts[lang][key] ? newDicts[lang][key].replace(/'/g, "\\'").replace(/\n/g, ' ') : '';
            newDictStr += `        '${key}': '${val}',\n`;
        }
        newDictStr += `    },\n`;
    }
    newDictStr += '};\n';

    // Replace the old dictionaries block in i18n.js
    const oldBlockRegex = /const dictionaries = \{[\s\S]*?^\};\s*$/m;
    // Wait, the file has `const dictionaries = {` all the way down to `};`.
    // Let's replace everything between `const dictionaries = {` and `};`.
    
    const parts = i18nContent.split('const dictionaries = {');
    const bottomParts = parts[1].split(/^};\s*$/m);
    
    if (bottomParts.length >= 2) {
        const finalContent = parts[0] + newDictStr + bottomParts.slice(1).join('};\n');
        fs.writeFileSync(i18nPath, finalContent);
        console.log("i18n.js successfully rewritten!");
    } else {
        console.error("Regex split failed! Dumping to dictionaries_dump.js");
        fs.writeFileSync('src/shared/dictionaries_dump.js', newDictStr);
    }
}

main().catch(console.error);
