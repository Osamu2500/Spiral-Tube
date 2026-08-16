const fs = require('fs');

// 1. Update popup.html
const htmlPath = 'src/popup/popup.html';
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('<span class="nav-label">Speed</span>', '<span class="nav-label" data-i18n="speed">Speed</span>');
html = html.replace('<span class="nav-label">Modes</span>', '<span class="nav-label" data-i18n="modes">Modes</span>');
html = html.replace('<span class="nav-label">Declutter</span>', '<span class="nav-label" data-i18n="declutter">Declutter</span>');
fs.writeFileSync(htmlPath, html);

// 2. Update i18n.js
const i18nPath = 'src/shared/i18n.js';
let i18n = fs.readFileSync(i18nPath, 'utf8');

const newLanguages = `export const SUPPORTED_LANGUAGES = [
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
];`;

i18n = i18n.replace(/export const SUPPORTED_LANGUAGES = \[[\s\S]*?\];/, newLanguages);

const additionalDictionaries = `
    'it': { nav_home: 'Home', nav_shorts: 'Shorts', nav_player: 'Player', speed: 'Velocità', modes: 'Modalità', declutter: 'Riordina', nav_search: 'Cerca', nav_subs: 'Iscrizioni', nav_history: 'Cronologia', nav_bookmarks: 'Segnalibri', nav_appearance: 'Design', nav_popup_design: 'Popup', nav_pro: 'Pro', nav_hotkeys: 'Scorciatoie', nav_config: 'Config' },
    'pt': { nav_home: 'Início', nav_shorts: 'Shorts', nav_player: 'Reprodutor', speed: 'Velocidade', modes: 'Modos', declutter: 'Organizar', nav_search: 'Buscar', nav_subs: 'Inscrições', nav_history: 'Histórico', nav_bookmarks: 'Favoritos', nav_appearance: 'Design', nav_popup_design: 'Popup', nav_pro: 'Pro', nav_hotkeys: 'Atalhos', nav_config: 'Config' },
    'ru': { nav_home: 'Главная', nav_shorts: 'Shorts', nav_player: 'Плеер', speed: 'Скорость', modes: 'Режимы', declutter: 'Порядок', nav_search: 'Поиск', nav_subs: 'Подписки', nav_history: 'История', nav_bookmarks: 'Закладки', nav_appearance: 'Дизайн', nav_popup_design: 'Popup', nav_pro: 'Pro', nav_hotkeys: 'Хоткеи', nav_config: 'Настройки' },
    'zh': { nav_home: '首页', nav_shorts: '短视频', nav_player: '播放器', speed: '速度', modes: '模式', declutter: '清理', nav_search: '搜索', nav_subs: '订阅', nav_history: '历史', nav_bookmarks: '书签', nav_appearance: '外观', nav_popup_design: '弹窗设计', nav_pro: '高级', nav_hotkeys: '快捷键', nav_config: '设置' },
    'ko': { nav_home: '홈', nav_shorts: 'Shorts', nav_player: '플레이어', speed: '속도', modes: '모드', declutter: '정리', nav_search: '검색', nav_subs: '구독', nav_history: '기록', nav_bookmarks: '북마크', nav_appearance: '디자인', nav_popup_design: '팝업 디자인', nav_pro: '프로', nav_hotkeys: '단축키', nav_config: '설정' },
    'ar': { nav_home: 'الرئيسية', nav_shorts: 'Shorts', nav_player: 'المشغل', speed: 'السرعة', modes: 'الأوضاع', declutter: 'ترتيب', nav_search: 'بحث', nav_subs: 'الاشتراكات', nav_history: 'السجل', nav_bookmarks: 'الإشارات', nav_appearance: 'التصميم', nav_popup_design: 'النافذة', nav_pro: 'برو', nav_hotkeys: 'اختصارات', nav_config: 'إعدادات' },
    'hi': { nav_home: 'होम', nav_shorts: 'Shorts', nav_player: 'प्लेयर', speed: 'गति', modes: 'मोड', declutter: 'साफ़ करें', nav_search: 'खोज', nav_subs: 'सदस्यता', nav_history: 'इतिहास', nav_bookmarks: 'बुकमार्क', nav_appearance: 'डिज़ाइन', nav_popup_design: 'पॉपअप', nav_pro: 'प्रो', nav_hotkeys: 'हॉटकीज़', nav_config: 'सेटिंग्स' },
    'tr': { nav_home: 'Ana Sayfa', nav_shorts: 'Shorts', nav_player: 'Oynatıcı', speed: 'Hız', modes: 'Modlar', declutter: 'Temizle', nav_search: 'Ara', nav_subs: 'Abonelikler', nav_history: 'Geçmiş', nav_bookmarks: 'Yer İşaretleri', nav_appearance: 'Tasarım', nav_popup_design: 'Açılır Pencere', nav_pro: 'Pro', nav_hotkeys: 'Kısayollar', nav_config: 'Ayarlar' },
    'nl': { nav_home: 'Home', nav_shorts: 'Shorts', nav_player: 'Speler', speed: 'Snelheid', modes: 'Modi', declutter: 'Opruimen', nav_search: 'Zoeken', nav_subs: 'Abonnementen', nav_history: 'Geschiedenis', nav_bookmarks: 'Bladwijzers', nav_appearance: 'Ontwerp', nav_popup_design: 'Popup', nav_pro: 'Pro', nav_hotkeys: 'Sneltoetsen', nav_config: 'Configuratie' },
    'pl': { nav_home: 'Główna', nav_shorts: 'Shorts', nav_player: 'Odtwarzacz', speed: 'Prędkość', modes: 'Tryby', declutter: 'Porządek', nav_search: 'Szukaj', nav_subs: 'Subskrypcje', nav_history: 'Historia', nav_bookmarks: 'Zakładki', nav_appearance: 'Wygląd', nav_popup_design: 'Popup', nav_pro: 'Pro', nav_hotkeys: 'Skróty', nav_config: 'Ustawienia' },
    'vi': { nav_home: 'Trang chủ', nav_shorts: 'Shorts', nav_player: 'Trình phát', speed: 'Tốc độ', modes: 'Chế độ', declutter: 'Dọn dẹp', nav_search: 'Tìm kiếm', nav_subs: 'Đăng ký', nav_history: 'Lịch sử', nav_bookmarks: 'Dấu trang', nav_appearance: 'Thiết kế', nav_popup_design: 'Cửa sổ bật lên', nav_pro: 'Pro', nav_hotkeys: 'Phím tắt', nav_config: 'Cài đặt' },
    'th': { nav_home: 'หน้าแรก', nav_shorts: 'Shorts', nav_player: 'เครื่องเล่น', speed: 'ความเร็ว', modes: 'โหมด', declutter: 'จัดระเบียบ', nav_search: 'ค้นหา', nav_subs: 'การติดตาม', nav_history: 'ประวัติ', nav_bookmarks: 'บุ๊กมาร์ก', nav_appearance: 'การออกแบบ', nav_popup_design: 'ป๊อปอัป', nav_pro: 'Pro', nav_hotkeys: 'ปุ่มลัด', nav_config: 'การตั้งค่า' },
    'id': { nav_home: 'Beranda', nav_shorts: 'Shorts', nav_player: 'Pemutar', speed: 'Kecepatan', modes: 'Mode', declutter: 'Rapikan', nav_search: 'Cari', nav_subs: 'Langganan', nav_history: 'Riwayat', nav_bookmarks: 'Markah', nav_appearance: 'Desain', nav_popup_design: 'Popup', nav_pro: 'Pro', nav_hotkeys: 'Pintasan', nav_config: 'Setelan' },
    'sv': { nav_home: 'Hem', nav_shorts: 'Shorts', nav_player: 'Spelare', speed: 'Hastighet', modes: 'Lägen', declutter: 'Rensa', nav_search: 'Sök', nav_subs: 'Prenumerationer', nav_history: 'Historik', nav_bookmarks: 'Bokmärken', nav_appearance: 'Design', nav_popup_design: 'Popup', nav_pro: 'Pro', nav_hotkeys: 'Genvägar', nav_config: 'Konfig' }
};`;

i18n = i18n.replace(/};\s*\/\/ ─+/, '},\n' + additionalDictionaries + '\n};\n\n// ─+');
fs.writeFileSync(i18nPath, i18n);

// 3. Update popup-renderer.js
const rendererPath = 'src/popup/popup-renderer.js';
let renderer = fs.readFileSync(rendererPath, 'utf8');

const newRenderLangPicker = `function _renderLangPicker(item, state) {
    const LANGS = [
        { value: 'en', native: '🇺🇸 English' },
        { value: 'es', native: '🇪🇸 Español' },
        { value: 'fr', native: '🇫🇷 Français' },
        { value: 'de', native: '🇩🇪 Deutsch' },
        { value: 'ja', native: '🇯🇵 日本語' },
        { value: 'it', native: '🇮🇹 Italiano' },
        { value: 'pt', native: '🇵🇹 Português' },
        { value: 'ru', native: '🇷🇺 Русский' },
        { value: 'zh', native: '🇨🇳 中文' },
        { value: 'ko', native: '🇰🇷 한국어' },
        { value: 'ar', native: '🇸🇦 العربية' },
        { value: 'hi', native: '🇮🇳 हिन्दी' },
        { value: 'tr', native: '🇹🇷 Türkçe' },
        { value: 'nl', native: '🇳🇱 Nederlands' },
        { value: 'pl', native: '🇵🇱 Polski' },
        { value: 'vi', native: '🇻🇳 Tiếng Việt' },
        { value: 'th', native: '🇹🇭 ไทย' },
        { value: 'id', native: '🇮🇩 Bahasa Indonesia' },
        { value: 'sv', native: '🇸🇪 Svenska' }
    ];

    const wrap = document.createElement('div');
    wrap.style.gridColumn = 'span 4'; 
    wrap.style.marginTop = '4px';
    wrap.style.marginBottom = '12px';

    const hiddenSelect = document.createElement('select');
    hiddenSelect.id = item.id;
    hiddenSelect.style.display = 'none';
    LANGS.forEach(l => {
        const o = document.createElement('option');
        o.value = l.value;
        o.textContent = l.native;
        hiddenSelect.appendChild(o);
    });
    wrap.appendChild(hiddenSelect);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '8px';
    grid.style.maxHeight = '140px';
    grid.style.overflowY = 'auto';
    grid.style.paddingRight = '8px'; // for scrollbar space

    LANGS.forEach(lang => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-btn card-style-btn lang-flag-btn';
        btn.dataset.value = lang.value;
        btn.title = lang.native;

        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '8px';
        btn.style.padding = '8px 12px';
        btn.style.fontSize = '11px';
        btn.style.fontWeight = '500';
        btn.style.justifyContent = 'flex-start';
        btn.style.border = '1px solid rgba(255,255,255,0.05)';
        btn.style.background = 'rgba(255,255,255,0.02)';
        btn.style.borderRadius = '10px';
        btn.style.transition = 'all 0.2s var(--ease-spring)';

        btn.innerHTML = \`<span>\${lang.native}</span>\`;

        btn.addEventListener('click', () => {
            grid.querySelectorAll('.lang-flag-btn').forEach(b => {
                b.style.background = 'rgba(255,255,255,0.02)';
                b.style.borderColor = 'rgba(255,255,255,0.05)';
                b.style.transform = 'translateY(0)';
                b.style.boxShadow = 'none';
                b.classList.remove('active');
            });
            btn.classList.add('active');
            btn.style.background = 'color-mix(in srgb, var(--accent-primary) 15%, transparent)';
            btn.style.borderColor = 'var(--accent-primary)';
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 4px 12px color-mix(in srgb, var(--accent-primary) 30%, transparent)';
            
            hiddenSelect.value = lang.value;
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Add hover effect via JS since inline styles override CSS
        btn.addEventListener('mouseenter', () => {
            if(!btn.classList.contains('active')) {
                btn.style.background = 'rgba(255,255,255,0.06)';
                btn.style.borderColor = 'rgba(255,255,255,0.1)';
            }
        });
        btn.addEventListener('mouseleave', () => {
            if(!btn.classList.contains('active')) {
                btn.style.background = 'rgba(255,255,255,0.02)';
                btn.style.borderColor = 'rgba(255,255,255,0.05)';
            }
        });

        grid.appendChild(btn);
    });

    wrap.appendChild(grid);
    _registerInput(hiddenSelect, state);

    const activatePill = () => {
        const val = hiddenSelect.value || 'en';
        grid.querySelectorAll('.lang-flag-btn').forEach(b => {
            const isActive = b.dataset.value === val;
            b.classList.toggle('active', isActive);
            if (isActive) {
                b.style.background = 'color-mix(in srgb, var(--accent-primary) 15%, transparent)';
                b.style.borderColor = 'var(--accent-primary)';
                b.style.transform = 'translateY(-2px)';
                b.style.boxShadow = '0 4px 12px color-mix(in srgb, var(--accent-primary) 30%, transparent)';
            } else {
                b.style.background = 'rgba(255,255,255,0.02)';
                b.style.borderColor = 'rgba(255,255,255,0.05)';
                b.style.transform = 'translateY(0)';
                b.style.boxShadow = 'none';
            }
        });
    };

    activatePill();
    requestAnimationFrame(activatePill);
    setTimeout(activatePill, 150);
    hiddenSelect.addEventListener('change', activatePill);

    return wrap;
}`;

renderer = renderer.replace(/function _renderLangPicker\(item, state\) {[\s\S]*?return wrap;\n}/, newRenderLangPicker);
fs.writeFileSync(rendererPath, renderer);

console.log('DOM i18n Auto-scanner pre-requisites completed. New languages injected.');
