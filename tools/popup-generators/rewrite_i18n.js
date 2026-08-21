const fs = require('fs');
const path = require('path');

const i18nPath = path.join('F:', 'Youtube 2.0', 'src', 'shared', 'i18n.js');
let content = fs.readFileSync(i18nPath, 'utf8');

const dictStart = content.indexOf('const dictionaries = {');
const dictEnd = content.indexOf('export const initI18n');

if (dictStart !== -1 && dictEnd !== -1) {
    const before = content.substring(0, dictStart);
    const after = content.substring(dictEnd);

    const imports = [
        "import en from './locales/en.js';",
        "import es from './locales/es.js';",
        "import fr from './locales/fr.js';",
        "import de from './locales/de.js';",
        "import ja from './locales/ja.js';",
        "import it from './locales/it.js';",
        "import pt from './locales/pt.js';",
        "import ru from './locales/ru.js';",
        "import zh from './locales/zh.js';",
        "import ko from './locales/ko.js';",
        "import ar from './locales/ar.js';",
        "import hi from './locales/hi.js';",
        "import tr from './locales/tr.js';",
        "import nl from './locales/nl.js';",
        "import pl from './locales/pl.js';",
        "import vi from './locales/vi.js';",
        "import th from './locales/th.js';",
        "import id from './locales/id.js';",
        "import sv from './locales/sv.js';"
    ].join('\n');

    const newDict = \n\n\nconst dictionaries = {\n    en, es, fr, de, ja, it, pt, ru, zh, ko, ar, hi, tr, nl, pl, vi, th, id, sv\n};\n\n;

    fs.writeFileSync(i18nPath, before + newDict + after);
    console.log('Successfully rewrote i18n.js!');
} else {
    console.log('Failed to find dictionary bounds.');
}
