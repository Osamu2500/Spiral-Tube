export const FILTERS = [
        { category: 'Classic', name: 'Normal',        css: 'none',                                                        overlay: null },
        { category: 'Classic', name: 'Sepia',         css: 'sepia(100%)',                                                  overlay: null },
        { category: 'Classic', name: 'Grayscale',     css: 'grayscale(100%)',                                              overlay: null },
        { category: 'Classic', name: 'High Contrast', css: 'contrast(160%) saturate(90%)',                                 overlay: null },
        { category: 'Classic', name: 'Vivid',         css: 'saturate(200%) contrast(110%)',                                overlay: null },
        { category: 'Classic', name: 'Warm',          css: 'sepia(40%) saturate(130%) contrast(100%) brightness(105%)',    overlay: null },
        { category: 'Classic', name: 'Cool',          css: 'hue-rotate(200deg) saturate(130%) brightness(95%)',            overlay: null },
        { category: 'Classic', name: 'Invert',        css: 'invert(100%)',                                                 overlay: null },

        { category: 'Cinematic', name: 'Cinematic',     css: 'contrast(115%) saturate(110%) brightness(95%) hue-rotate(350deg)', overlay: null },
        { category: 'Cinematic', name: 'Noir',          css: 'grayscale(100%) contrast(130%) brightness(85%)',               overlay: null },
        { category: 'Cinematic', name: 'B&W Cinematic', css: 'grayscale(100%) contrast(140%) brightness(90%)', overlay: null },
        { category: 'Cinematic', name: 'Teal & Orange', css: 'hue-rotate(180deg) saturate(130%) contrast(115%) brightness(100%)', overlay: null },
        { category: 'Cinematic', name: 'Documentary',   css: 'contrast(120%) saturate(90%) brightness(100%)', overlay: null },
        { category: 'Cinematic', name: 'HDR',           css: 'contrast(140%) saturate(120%) brightness(110%)', overlay: null },

        { category: 'Retro & Analog', name: 'Retro',         css: 'sepia(60%) hue-rotate(330deg) saturate(150%) contrast(120%)', overlay: null },
        { category: 'Retro & Analog', name: '📺 CRT Classic',css: 'url(#ypp-crt-rgb) contrast(135%) brightness(110%) saturate(85%)', overlay: 'crt' },
        { category: 'Retro & Analog', name: '📺 CRT Light',  css: 'url(#ypp-crt-rgb) contrast(110%) brightness(105%) saturate(95%)', overlay: 'crt-light' },
        { category: 'Retro & Analog', name: '🕹️ CRT Arcade', css: 'url(#ypp-crt-rgb) contrast(125%) brightness(115%) saturate(140%)', overlay: 'crt-arcade' },
        { category: 'Retro & Analog', name: '📟 Terminal (Green)', css: 'url(#ypp-crt-rgb) grayscale(100%) sepia(100%) hue-rotate(80deg) saturate(300%) contrast(150%) brightness(120%)', overlay: 'crt-green' },
        { category: 'Retro & Analog', name: '📠 Terminal (Amber)', css: 'url(#ypp-crt-rgb) grayscale(100%) sepia(100%) hue-rotate(30deg) saturate(300%) contrast(150%) brightness(120%)', overlay: 'crt-amber' },
        { category: 'Retro & Analog', name: '📼 VHS Tape',   css: 'contrast(90%) brightness(85%) saturate(60%) hue-rotate(5deg)',overlay: 'vhs' },
        { category: 'Retro & Analog', name: '🎞 Old Film',   css: 'sepia(70%) contrast(90%) brightness(85%) blur(0.3px)',         overlay: 'oldfilm' },
        { category: 'Retro & Analog', name: 'Film Grain',    css: 'contrast(110%) brightness(100%) saturate(100%)', overlay: 'oldfilm' },
        { category: 'Retro & Analog', name: '90s TV',        css: 'contrast(85%) brightness(90%) saturate(75%) hue-rotate(5deg)', overlay: 'crt' },
        { category: 'Retro & Analog', name: 'Polaroid',      css: 'sepia(20%) contrast(105%) brightness(108%) saturate(110%)', overlay: null },

        { category: 'Artistic', name: 'Cyberpunk',     css: 'hue-rotate(180deg) saturate(180%) contrast(120%) brightness(110%)', overlay: null },
        { category: 'Artistic', name: 'Vaporwave',     css: 'hue-rotate(280deg) saturate(160%) contrast(110%) brightness(105%)', overlay: null },
        { category: 'Artistic', name: '80s Synthwave', css: 'hue-rotate(300deg) saturate(180%) contrast(130%) brightness(100%)', overlay: null },
        { category: 'Artistic', name: 'Neon Noir',     css: 'hue-rotate(280deg) saturate(200%) contrast(140%) brightness(85%)', overlay: null },
        { category: 'Artistic', name: 'Sci-Fi',        css: 'hue-rotate(220deg) saturate(140%) contrast(125%) brightness(90%)', overlay: null },

        { category: 'Artistic', name: 'Comic Book',    css: 'contrast(200%) saturate(150%) brightness(110%)', overlay: null },
        { category: 'Artistic', name: 'Lomo',          css: 'saturate(150%) contrast(110%) brightness(95%) vignette(0.5)', overlay: null },
        { category: 'Artistic', name: 'Manga / Comic B&W', css: 'url(#ypp-fx-manga-bw)', preview: 'linear-gradient(135deg, #ffffff, #000000)', overlay: 'halftone' },
        { category: 'Artistic', name: 'Vaporwave V2',      css: 'url(#ypp-fx-colorize) hue-rotate(280deg) saturate(200%) contrast(120%)', preview: 'linear-gradient(135deg, #ff0844, #ffb199)', overlay: 'vhs' },
        { category: 'Artistic', name: 'Synthwave Neon',    css: 'url(#ypp-fx-neon-glow) hue-rotate(300deg) saturate(250%) contrast(130%) brightness(90%)', preview: 'linear-gradient(135deg, #f857a6, #ff5858)', overlay: 'crt' },

        { category: 'Atmospheric', name: 'Golden Hour',   css: 'sepia(30%) hue-rotate(30deg) saturate(130%) brightness(110%) contrast(105%)', overlay: null },
        { category: 'Atmospheric', name: 'Blue Hour',     css: 'hue-rotate(210deg) saturate(120%) brightness(95%) contrast(110%)', overlay: null },
        { category: 'Atmospheric', name: 'Summer',        css: 'sepia(15%) hue-rotate(40deg) saturate(140%) brightness(110%)', overlay: null },
        { category: 'Atmospheric', name: 'Winter',        css: 'hue-rotate(200deg) saturate(80%) brightness(105%) contrast(110%)', overlay: null },
        { category: 'Atmospheric', name: 'Autumn',        css: 'sepia(40%) hue-rotate(30deg) saturate(130%) brightness(100%)', overlay: null },
        { category: 'Atmospheric', name: 'Spring',        css: 'hue-rotate(100deg) saturate(150%) brightness(108%) contrast(105%)', overlay: null },
        { category: 'Atmospheric', name: 'Sunset',        css: 'sepia(30%) hue-rotate(330deg) saturate(150%) contrast(110%) brightness(105%)', overlay: null },

        { category: 'Mood', name: 'Dreamy',        css: 'brightness(110%) contrast(90%) saturate(120%) blur(0.5px)',    overlay: null },
        { category: 'Mood', name: 'Muted',         css: 'saturate(70%) contrast(90%) brightness(105%)', overlay: null },
        { category: 'Mood', name: 'Pastel',        css: 'saturate(60%) brightness(115%) contrast(85%)', overlay: null },
        { category: 'Mood', name: 'Soft Focus',    css: 'brightness(105%) contrast(95%) saturate(90%) blur(0.8px)', overlay: null },
        { category: 'Mood', name: 'Horror',        css: 'contrast(130%) brightness(80%) saturate(70%) hue-rotate(10deg)', overlay: null },
        { category: 'Mood', name: 'Fantasy',       css: 'saturate(140%) brightness(105%) contrast(110%) hue-rotate(300deg)', overlay: null },
        { category: 'Mood', name: 'Gothic',        css: 'contrast(125%) brightness(85%) saturate(60%) hue-rotate(340deg)', overlay: null },

        { category: 'Special Effects', name: 'Night Vision', css: 'saturate(0%) sepia(100%) hue-rotate(60deg) brightness(140%) contrast(160%)', overlay: 'nightvision' },
        { category: 'Special Effects', name: 'Thermal',      css: 'invert(100%) hue-rotate(180deg) saturate(400%) contrast(200%)', overlay: null },
        { category: 'Special Effects', name: 'X-Ray',        css: 'invert(100%) grayscale(100%) contrast(150%)', overlay: null },
        { category: 'Special Effects', name: 'Psychedelic',  css: 'hue-rotate(90deg) saturate(300%) contrast(150%) invert(20%)', overlay: null },
        { category: 'Special Effects', name: 'Psychedelic Glitch', css: 'url(#ypp-fx-glitch) hue-rotate(180deg) saturate(300%) contrast(150%) invert(10%)', overlay: null },
        { category: 'Special Effects', name: 'RGB Glitch',   css: 'url(#ypp-fx-glitch) contrast(120%) brightness(110%) saturate(120%)', overlay: null },
        { category: 'Special Effects', name: 'The Matrix',   css: 'url(#ypp-fx-matrix) contrast(150%) brightness(130%)', overlay: null },
        { category: 'Special Effects', name: 'Posterize (Classic)', css: 'url(#ypp-fx-posterize) saturate(150%) contrast(115%) brightness(115%)', overlay: null },
        { category: 'Special Effects', name: 'Pop Art',      css: 'url(#ypp-fx-pop-art) saturate(220%) contrast(130%) brightness(120%)', overlay: null },
        { category: 'Special Effects', name: '8-Bit Retro',  css: 'url(#ypp-fx-8bit) saturate(140%) contrast(110%) brightness(120%)', overlay: null },
        { category: 'Special Effects', name: 'Pencil Sketch',css: 'url(#ypp-fx-sketch) brightness(108%)', overlay: null },
        { category: 'Special Effects', name: 'Colored Pencil',css: 'url(#ypp-fx-colored-pencil) saturate(140%) brightness(110%)', overlay: null },
        { category: 'Special Effects', name: 'Comic Book',   css: 'url(#ypp-fx-posterize) saturate(180%) contrast(130%) brightness(115%)', overlay: 'halftone' },
        { category: 'Special Effects', name: 'Oil Painting', css: 'saturate(200%) contrast(120%) blur(1px)', overlay: null },
        { category: 'Special Effects', name: 'Emboss',       css: 'url(#ypp-fx-emboss) grayscale(100%) contrast(150%) brightness(120%)', overlay: null },
        { category: 'Special Effects', name: 'Neon Edge',    css: 'url(#ypp-fx-edge) saturate(200%) brightness(120%)', overlay: null },
        { category: 'Special Effects', name: 'Deep Fried',   css: 'saturate(400%) contrast(300%) brightness(120%) hue-rotate(-10deg)', overlay: null },
        { category: 'Special Effects', name: 'Duotone Red',  css: 'grayscale(100%) sepia(100%) hue-rotate(320deg) saturate(400%) contrast(140%)', overlay: null },
        { category: 'Special Effects', name: 'Colorize B&W', css: 'url(#ypp-fx-colorize) saturate(120%) contrast(110%)', overlay: null },
        { category: 'Special Effects', name: 'Vintage Colorize', css: 'url(#ypp-fx-technicolor) saturate(110%) contrast(115%)', overlay: null },
        { category: 'Special Effects', name: 'Dream Colorize', css: 'url(#ypp-fx-dreamcolor) saturate(130%) contrast(110%)', overlay: null },
        { category: 'Special Effects', name: 'Predator Thermal', css: 'url(#ypp-fx-predator) saturate(200%) contrast(150%)', preview: 'linear-gradient(135deg, #ff0000, #00ff00)', overlay: null },
        { category: 'Special Effects', name: 'Security Cam (Night)',  css: 'grayscale(100%) contrast(120%) brightness(130%) sepia(20%) hue-rotate(80deg) blur(0.5px)', preview: 'linear-gradient(135deg, #8baaaa, #ae8b9c)', overlay: 'security-cam' },

        // ── V4 Special Effects ──
        { category: 'Special Effects', name: 'Gameboy (DMG-01)', css: 'url(#ypp-fx-gameboy)', preview: 'linear-gradient(135deg, #0f380f, #9bbc0f)', overlay: 'gameboy' },
        { category: 'Special Effects', name: 'Aerochrome IR',   css: 'url(#ypp-fx-aerochrome) saturate(130%) contrast(115%)', preview: 'linear-gradient(135deg, #ff6b6b, #ffa07a)', overlay: null },
        { category: 'Special Effects', name: 'Sin City Red',    css: 'url(#ypp-fx-sin-city) contrast(130%)', preview: 'linear-gradient(135deg, #1a1a1a, #cc0000)', overlay: null },
        { category: 'Special Effects', name: 'Watercolor',      css: 'url(#ypp-fx-watercolor) saturate(130%) brightness(105%)', preview: 'linear-gradient(135deg, #a8edea, #fed6e3)', overlay: null },
        { category: 'Special Effects', name: 'Cyberpunk 2077',  css: 'url(#ypp-fx-cyberpunk) contrast(130%) brightness(90%)', preview: 'linear-gradient(135deg, #00f2fe, #f857a6)', overlay: null },
        { category: 'Special Effects', name: 'VHS Pro',         css: 'url(#ypp-fx-vhs-pro) contrast(110%) brightness(95%) saturate(80%)', preview: 'linear-gradient(135deg, #833ab4, #fd1d1d)', overlay: 'chroma-bleed' },
        { category: 'Special Effects', name: 'Cross Process',   css: 'url(#ypp-fx-cross-process) contrast(120%) saturate(130%)', preview: 'linear-gradient(135deg, #f7971e, #ffd200)', overlay: null },

        // ── V4 Cinematic LUTs ──
        { category: 'Cinematic', name: 'Duotone Teal',      css: 'url(#ypp-fx-duotone-teal) contrast(120%)', preview: 'linear-gradient(135deg, #2afadf, #4c83ff)', overlay: null },
        { category: 'Cinematic', name: 'Golden Sunset LUT', css: 'url(#ypp-fx-golden-lut) contrast(115%) saturate(110%)', preview: 'linear-gradient(135deg, #f7971e, #c94b4b)', overlay: null },
        { category: 'Cinematic', name: 'Daguerreotype',     css: 'grayscale(100%) sepia(40%) contrast(150%) brightness(85%)', preview: 'linear-gradient(135deg, #8a7560, #3d2b1f)', overlay: 'daguerreotype' },


        { category: 'Social Media', name: '1977',        css: 'sepia(50%) hue-rotate(-30deg) saturate(140%)', overlay: null },
        { category: 'Social Media', name: 'Aden',        css: 'sepia(20%) brightness(115%) saturate(140%)', overlay: null },
        { category: 'Social Media', name: 'Amaro',       css: 'sepia(35%) contrast(110%) brightness(120%) saturate(130%)', overlay: null },
        { category: 'Social Media', name: 'Ashby',       css: 'sepia(50%) contrast(120%) saturate(180%)', overlay: null },
        { category: 'Social Media', name: 'Brannan',     css: 'sepia(40%) contrast(125%) brightness(110%) saturate(90%) hue-rotate(-2deg)', overlay: null },
        { category: 'Social Media', name: 'Brooklyn',    css: 'sepia(25%) contrast(125%) brightness(125%) hue-rotate(5deg)', overlay: null },
        { category: 'Social Media', name: 'Charmes',     css: 'sepia(25%) contrast(125%) brightness(125%) saturate(135%) hue-rotate(-5deg)', overlay: null },
        { category: 'Social Media', name: 'Clarendon',   css: 'contrast(120%) saturate(135%) brightness(110%) hue-rotate(5deg)', overlay: null },
        { category: 'Social Media', name: 'Crema',       css: 'sepia(50%) contrast(125%) brightness(115%) saturate(90%) hue-rotate(-2deg)', overlay: null },
        { category: 'Social Media', name: 'Dogpatch',    css: 'sepia(35%) saturate(110%) contrast(150%) brightness(110%)', overlay: null },
        { category: 'Social Media', name: 'Earlybird',   css: 'sepia(25%) contrast(125%) brightness(115%) saturate(90%) hue-rotate(-5deg)', overlay: null },
        { category: 'Social Media', name: 'Gingham',     css: 'brightness(105%) hue-rotate(350deg) contrast(110%) saturate(120%)', overlay: null },
        { category: 'Social Media', name: 'Ginza',       css: 'sepia(25%) contrast(115%) brightness(120%) saturate(135%) hue-rotate(-5deg)', overlay: null },
        { category: 'Social Media', name: 'Hefe',        css: 'sepia(40%) contrast(150%) brightness(120%) saturate(140%) hue-rotate(-10deg)', overlay: null },
        { category: 'Social Media', name: 'Helena',      css: 'sepia(50%) contrast(105%) brightness(105%) saturate(135%)', overlay: null },
        { category: 'Social Media', name: 'Hudson',      css: 'sepia(25%) contrast(120%) brightness(120%) saturate(105%) hue-rotate(-15deg)', overlay: null },
        { category: 'Social Media', name: 'Inkwell',     css: 'grayscale(100%) sepia(15%) contrast(110%) brightness(110%)', overlay: null },
        { category: 'Social Media', name: 'Juno',        css: 'saturate(140%) contrast(110%) brightness(115%) hue-rotate(15deg)', overlay: null },
        { category: 'Social Media', name: 'Kelvin',      css: 'sepia(15%) contrast(150%) brightness(110%) saturate(120%) hue-rotate(-10deg)', overlay: null },
        { category: 'Social Media', name: 'Lark',        css: 'contrast(120%) saturate(120%) brightness(110%) hue-rotate(5deg)', overlay: null },
        { category: 'Social Media', name: 'Lo-Fi',       css: 'saturate(110%) contrast(150%)', overlay: null },
        { category: 'Social Media', name: 'Ludwig',      css: 'sepia(25%) contrast(105%) brightness(105%) saturate(200%) hue-rotate(-5deg)', overlay: null },
        { category: 'Social Media', name: 'Maven',       css: 'sepia(25%) contrast(105%) brightness(105%) saturate(150%) hue-rotate(-5deg)', overlay: null },
        { category: 'Social Media', name: 'Mayfair',     css: 'contrast(110%) brightness(115%) saturate(110%)', overlay: null },
        { category: 'Social Media', name: 'Moon',        css: 'grayscale(100%) contrast(110%) brightness(110%)', overlay: null },
        { category: 'Social Media', name: 'Nashville',   css: 'sepia(25%) contrast(150%) brightness(105%) saturate(120%) hue-rotate(-15deg)', overlay: null },
        { category: 'Social Media', name: 'Perpetua',    css: 'contrast(110%) brightness(125%) saturate(110%)', overlay: null },
        { category: 'Social Media', name: 'Reyes',       css: 'sepia(75%) contrast(75%) brightness(125%) saturate(140%)', overlay: null },
        { category: 'Social Media', name: 'Rise',        css: 'sepia(25%) contrast(125%) brightness(120%) saturate(90%) hue-rotate(5deg)', overlay: null },
        { category: 'Social Media', name: 'Sierra',      css: 'sepia(25%) contrast(150%) brightness(90%) saturate(120%) hue-rotate(-15deg)', overlay: null },
        { category: 'Social Media', name: 'Slumber',     css: 'sepia(35%) contrast(125%) brightness(105%) saturate(130%)', overlay: null },
        { category: 'Social Media', name: 'Stinson',     css: 'sepia(35%) contrast(125%) brightness(115%) saturate(110%)', overlay: null },
        { category: 'Social Media', name: 'Sutro',       css: 'sepia(40%) contrast(120%) brightness(90%) saturate(140%) hue-rotate(-10deg)', overlay: null },
        { category: 'Social Media', name: 'Toaster',     css: 'sepia(25%) contrast(150%) brightness(95%) saturate(110%) hue-rotate(-15deg)', overlay: null },
        { category: 'Social Media', name: 'Valencia',    css: 'sepia(25%) contrast(125%) brightness(110%) saturate(110%)', overlay: null },
        { category: 'Social Media', name: 'Walden',      css: 'sepia(35%) contrast(80%) brightness(125%) saturate(140%) hue-rotate(-10deg)', overlay: null },
        { category: 'Social Media', name: 'Willow',      css: 'grayscale(100%) sepia(20%) contrast(110%) brightness(120%)', overlay: null },
        { category: 'Social Media', name: 'X-Pro II',    css: 'sepia(45%) contrast(125%) brightness(175%) saturate(130%) hue-rotate(-5deg)', overlay: null },

        // ── FujiFilm Recipes ──
        { category: 'FujiFilm Recipes', name: 'Classic Chrome', css: 'sepia(20%) saturate(85%) contrast(110%) brightness(105%)', preview: 'linear-gradient(135deg, #d3cbb8, #9a8c78)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'Velvia (Vivid)', css: 'saturate(140%) contrast(115%) brightness(105%)', preview: 'linear-gradient(135deg, #ff0055, #00ffaa)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'Astia (Soft)',   css: 'saturate(110%) contrast(90%) brightness(110%)', preview: 'linear-gradient(135deg, #ffb6c1, #add8e6)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'Provia (Std)',   css: 'saturate(105%) contrast(105%)', preview: 'linear-gradient(135deg, #e0e0e0, #888888)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'Kodachrome 64',  css: 'sepia(25%) saturate(120%) contrast(120%) brightness(105%)', preview: 'linear-gradient(135deg, #ff4500, #ff8c00)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'Portra 400',     css: 'sepia(15%) saturate(110%) contrast(95%) brightness(115%)', preview: 'linear-gradient(135deg, #f5deb3, #d2b48c)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'Acros (B&W)',    css: 'grayscale(100%) contrast(125%) brightness(105%)', preview: 'linear-gradient(135deg, #ffffff, #000000)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'Classic Negative', css: 'sepia(15%) saturate(80%) contrast(130%) brightness(95%) hue-rotate(5deg)', preview: 'linear-gradient(135deg, #4b5d67, #322f3d)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'Eterna (Cinema)', css: 'saturate(70%) contrast(85%) brightness(110%)', preview: 'linear-gradient(135deg, #9ca3af, #d1d5db)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'PRO Neg. Hi',    css: 'saturate(95%) contrast(115%)', preview: 'linear-gradient(135deg, #c4aead, #e2d1c3)', overlay: null },
        { category: 'FujiFilm Recipes', name: 'PRO Neg. Std',   css: 'saturate(90%) contrast(95%)', preview: 'linear-gradient(135deg, #dfd5c9, #f7f1e3)', overlay: null },

        // ── Anime Worlds ──
        { category: 'Anime Worlds', name: 'Studio Ghibli',   css: 'saturate(140%) contrast(110%) brightness(110%)', preview: 'linear-gradient(135deg, #74ebd5, #9face6)', overlay: null },
        { category: 'Anime Worlds', name: 'Makoto Shinkai',  css: 'saturate(145%) contrast(125%) brightness(115%)', preview: 'linear-gradient(135deg, #4facfe, #00f2fe)', overlay: null },
        { category: 'Anime Worlds', name: 'KyoAni Soft',     css: 'saturate(110%) contrast(90%) brightness(115%)', preview: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', overlay: null },
        { category: 'Anime Worlds', name: 'Ufotable Night',  css: 'saturate(120%) contrast(135%) brightness(95%)', preview: 'linear-gradient(135deg, #30cfd0, #330867)', overlay: null },
        { category: 'Anime Worlds', name: 'MAPPA Dark',      css: 'saturate(75%) contrast(130%) brightness(95%)', preview: 'linear-gradient(135deg, #434343, #000000)', overlay: null },
        { category: 'Anime Worlds', name: '90s Retro Anime', css: 'sepia(20%) saturate(110%) contrast(95%) brightness(105%)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)', overlay: null },
        { category: 'Anime Worlds', name: 'Pastel Shojo',    css: 'saturate(115%) contrast(90%) brightness(120%)', preview: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', overlay: null },
        { category: 'Anime Worlds', name: 'Isekai Fantasy',  css: 'saturate(135%) contrast(115%) brightness(110%)', preview: 'linear-gradient(135deg, #84fab0, #8fd3f4)', overlay: null },
        { category: 'Anime Worlds', name: 'Cyberpunk Edgerunner', css: 'saturate(150%) contrast(130%) brightness(105%)', preview: 'linear-gradient(135deg, #f83600, #f9d423)', overlay: null },
        { category: 'Anime Worlds', name: 'Shonen Pop',      css: 'saturate(140%) contrast(115%) brightness(105%)', preview: 'linear-gradient(135deg, #f6d365, #fda085)', overlay: null },

        // ── Cinematic Worlds ──
        // Each filter is tuned to recreate the iconic color grade of a specific film/franchise
        { category: 'Cinematic Worlds', name: 'Dune',                css: 'sepia(30%) saturate(90%) contrast(120%) brightness(105%)', preview: 'linear-gradient(135deg, #d4a373, #faedcd)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Twilight',            css: 'saturate(60%) contrast(115%) brightness(95%)', preview: 'linear-gradient(135deg, #6c757d, #adb5bd)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Disney Magic',        css: 'saturate(150%) contrast(110%) brightness(110%)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Pixar Glow',          css: 'brightness(115%) contrast(105%) saturate(140%)', preview: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Avatar: Pandora',     css: 'saturate(130%) contrast(120%) brightness(105%)', preview: 'linear-gradient(135deg, #43e97b, #38f9d7)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Interstellar',        css: 'saturate(80%) contrast(125%) brightness(95%)', preview: 'linear-gradient(135deg, #09203f, #537895)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Mad Max: Fury Road',  css: 'sepia(20%) saturate(130%) contrast(130%) brightness(110%)', preview: 'linear-gradient(135deg, #e65c00, #F9D423)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Lord of the Rings',   css: 'sepia(10%) saturate(115%) contrast(115%) brightness(105%)', preview: 'linear-gradient(135deg, #38ef7d, #11998e)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Blade Runner 2049',   css: 'sepia(15%) saturate(130%) contrast(125%) brightness(105%)', preview: 'linear-gradient(135deg, #f12711, #f5af19)', overlay: null },
        { category: 'Cinematic Worlds', name: 'Marvel Studios',      css: 'saturate(125%) contrast(115%) brightness(105%)', preview: 'linear-gradient(135deg, #1cb5e0, #000046)', overlay: null },

        // ── Nature & Documentary ──
        { category: 'Nature & Documentary', name: 'National Geographic', css: 'saturate(130%) contrast(115%) brightness(105%)', preview: 'linear-gradient(135deg, #fffc00, #ffffff)', overlay: null },
        { category: 'Nature & Documentary', name: 'Planet Earth',        css: 'saturate(140%) contrast(110%) brightness(105%)', preview: 'linear-gradient(135deg, #00c6ff, #0072ff)', overlay: null },
        { category: 'Nature & Documentary', name: 'Deep Ocean',          css: 'saturate(110%) contrast(115%) brightness(95%)', preview: 'linear-gradient(135deg, #000428, #004e92)', overlay: null },
        { category: 'Nature & Documentary', name: 'Safari',              css: 'sepia(15%) saturate(120%) contrast(115%) brightness(105%)', preview: 'linear-gradient(135deg, #e1eec3, #f05053)', overlay: null },
        { category: 'Nature & Documentary', name: 'Rainforest',          css: 'saturate(135%) contrast(115%) brightness(100%)', preview: 'linear-gradient(135deg, #11998e, #38ef7d)', overlay: null },
        { category: 'Nature & Documentary', name: 'Arctic Frost',        css: 'saturate(80%) contrast(110%) brightness(110%)', preview: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', overlay: null },

        // ── Special Effects ──
        { category: 'Special Effects', name: 'VHS Tape',         css: 'saturate(150%) contrast(120%) sepia(30%) hue-rotate(-10deg) blur(0.5px)', preview: 'linear-gradient(135deg, #ff00cc, #333399)', overlay: 'vhs' },
        { category: 'Special Effects', name: 'Dreamy Memory',    css: 'url(#ypp-fx-dreamcolor) blur(1px)', preview: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', overlay: 'grain_custom' },
        { category: 'Special Effects', name: 'Infrared Vision',  css: 'invert(100%) hue-rotate(180deg) saturate(200%) contrast(120%)', preview: 'linear-gradient(135deg, #ff0844, #ffb199)', overlay: null },
        { category: 'Special Effects', name: 'Cyberpunk Glitch', css: 'url(#ypp-fx-glitch) contrast(150%) saturate(200%) hue-rotate(30deg) brightness(90%)', preview: 'linear-gradient(135deg, #f857a6, #ff5858)', overlay: 'crt' },
        { category: 'Special Effects', name: 'Sin City (Noir)',  css: 'grayscale(100%) contrast(150%) brightness(90%)', preview: 'linear-gradient(135deg, #434343, #000000)', overlay: 'grain_custom' },
        { category: 'Special Effects', name: 'Thermal Vision',   css: 'invert(100%) hue-rotate(240deg) saturate(300%) contrast(150%) brightness(120%)', preview: 'linear-gradient(135deg, #ff9966, #ff5e62)', overlay: null },
        { category: 'Special Effects', name: 'Security Camera',  css: 'grayscale(100%) contrast(80%) brightness(80%) sepia(20%) blur(0.5px)', preview: 'linear-gradient(135deg, #8baaaa, #ae8b9c)', overlay: 'crt' },
        { category: 'Special Effects', name: 'Vintage 8mm',      css: 'sepia(50%) contrast(120%) brightness(90%)', preview: 'linear-gradient(135deg, #d4a373, #faedcd)', overlay: 'oldfilm' },

        // ── Dreamcore & Weirdcore ──
        { category: 'Dreamcore', name: 'Liminal Space', css: 'url(#ypp-fx-technicolor) saturate(150%) contrast(90%) brightness(110%) blur(0.5px)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)', overlay: 'grain_custom' },
        { category: 'Dreamcore', name: 'Poolrooms',     css: 'saturate(80%) contrast(110%) brightness(115%) hue-rotate(15deg)', preview: 'linear-gradient(135deg, #89f7fe, #66a6ff)', overlay: 'grain_custom' },
        { category: 'Dreamcore', name: 'Nostalgia Trip',css: 'sepia(30%) saturate(140%) contrast(100%) brightness(110%)', preview: 'linear-gradient(135deg, #fdfbfb, #ebedee)', overlay: 'grain_custom' },
        { category: 'Dreamcore', name: 'Weirdcore',     css: 'url(#ypp-fx-colorize) contrast(150%) saturate(200%) brightness(90%)', preview: 'linear-gradient(135deg, #ff0844, #ffb199)', overlay: 'crt' },
        { category: 'Dreamcore', name: 'True Dreamcore',css: 'url(#ypp-fx-glitch) saturate(180%) contrast(140%) sepia(40%) hue-rotate(-15deg) blur(0.5px)', preview: 'linear-gradient(135deg, #ff00cc, #333399)', overlay: 'vhs' },
        
        { category: 'Dreamcore', name: 'Soft Dreamcore',css: 'saturate(110%) contrast(85%) brightness(125%) sepia(15%) blur(0.8px)', preview: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', overlay: 'grain_custom' },
        { category: 'Dreamcore', name: 'Lucid Dream',   css: 'saturate(160%) contrast(95%) brightness(120%) hue-rotate(-10deg)', preview: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', overlay: null },
        { category: 'Dreamcore', name: 'Fever Dream',   css: 'url(#ypp-fx-dreamcolor) saturate(250%) contrast(130%) hue-rotate(60deg) blur(1px)', preview: 'linear-gradient(135deg, #ff5858, #f09819)', overlay: 'vhs' },
        { category: 'Dreamcore', name: 'The Backrooms', css: 'sepia(80%) saturate(150%) hue-rotate(35deg) contrast(120%) brightness(90%)', preview: 'linear-gradient(135deg, #d4fc79, #96e6a1)', overlay: 'crt' },
        { category: 'Dreamcore', name: 'Ethereal Glow', css: 'saturate(70%) contrast(110%) brightness(130%) blur(1.5px)', preview: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', overlay: null },
        { category: 'Dreamcore', name: 'False Memory',  css: 'grayscale(40%) sepia(20%) contrast(90%) brightness(115%) blur(0.3px)', preview: 'linear-gradient(135deg, #d5d4d0, #eeeeec)', overlay: 'oldfilm' },

        // ── Anime Styles ──
        { category: 'Anime', name: 'Studio Ghibli',     css: 'saturate(140%) contrast(110%) brightness(105%) hue-rotate(5deg)', preview: 'linear-gradient(135deg, #a8e063, #56ab2f)', overlay: null },
        { category: 'Anime', name: 'Makoto Shinkai',    css: 'saturate(180%) contrast(120%) brightness(115%) hue-rotate(-15deg)', preview: 'linear-gradient(135deg, #00c6ff, #0072ff)', overlay: null },
        { category: 'Anime', name: 'Kyoto Animation',   css: 'saturate(120%) contrast(95%) brightness(110%) blur(0.3px)', preview: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', overlay: null },
        { category: 'Anime', name: 'Ufotable (Night)',  css: 'saturate(160%) contrast(130%) brightness(90%) hue-rotate(-10deg)', preview: 'linear-gradient(135deg, #1f1c2c, #928dab)', overlay: null },
        { category: 'Anime', name: 'Cyberpunk Neon',    css: 'saturate(200%) contrast(140%) brightness(95%) hue-rotate(-30deg)', preview: 'linear-gradient(135deg, #f857a6, #ff5858)', overlay: 'crt' },
        { category: 'Anime', name: 'Titan Gritty',      css: 'sepia(40%) saturate(70%) contrast(125%) brightness(95%)', preview: 'linear-gradient(135deg, #8b4513, #a0522d)', overlay: 'grain_custom' },
        { category: 'Anime', name: '90s Retro Cel',     css: 'saturate(110%) contrast(90%) sepia(15%) brightness(110%)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)', overlay: 'oldfilm' },

        // ── Cinematic Looks ──
        { category: 'Cinematic', name: 'Teal & Orange',      css: 'saturate(130%) contrast(120%) hue-rotate(-10deg) sepia(15%)', preview: 'linear-gradient(135deg, #004e92, #f05053)', overlay: null },
        { category: 'Cinematic', name: 'The Matrix',         css: 'saturate(120%) contrast(130%) brightness(90%) hue-rotate(90deg) sepia(40%)', preview: 'linear-gradient(135deg, #000000, #0f9b0f)', overlay: null },
        { category: 'Cinematic', name: 'Mad Max Desert',     css: 'saturate(180%) contrast(140%) brightness(105%) sepia(30%) hue-rotate(-10deg)', preview: 'linear-gradient(135deg, #ff512f, #dd2476)', overlay: 'grain_custom' },
        { category: 'Cinematic', name: 'Wes Anderson',       css: 'saturate(110%) contrast(85%) brightness(110%) sepia(35%) hue-rotate(5deg)', preview: 'linear-gradient(135deg, #f6d365, #fda085)', overlay: null },
        { category: 'Cinematic', name: 'The Batman Noir',    css: 'saturate(50%) contrast(130%) brightness(75%) sepia(30%) hue-rotate(-20deg)', preview: 'linear-gradient(135deg, #000000, #434343)', overlay: 'grain_custom' },
        { category: 'Cinematic', name: 'Dune Arrakis',       css: 'saturate(45%) contrast(120%) brightness(100%) sepia(50%)', preview: 'linear-gradient(135deg, #bca586, #8c7657)', overlay: 'grain_custom' },
        { category: 'Cinematic', name: 'Fincher Gloom',      css: 'saturate(80%) contrast(125%) brightness(85%) sepia(25%) hue-rotate(40deg)', preview: 'linear-gradient(135deg, #2c3e50, #3498db)', overlay: null },
        { category: 'Cinematic', name: 'Bleach Bypass',      css: 'saturate(30%) contrast(160%) brightness(95%) sepia(10%)', preview: 'linear-gradient(135deg, #606c88, #3f4c6b)', overlay: 'grain_custom' },
        { category: 'Cinematic', name: 'Day for Night',      css: 'saturate(60%) contrast(110%) brightness(50%) sepia(60%) hue-rotate(180deg)', preview: 'linear-gradient(135deg, #141e30, #243b55)', overlay: null },
        { category: 'Cinematic', name: 'Classic Technicolor',css: 'saturate(160%) contrast(115%) brightness(105%) sepia(10%)', preview: 'linear-gradient(135deg, #ff0844, #ffb199)', overlay: 'oldfilm' },
        { category: 'Cinematic', name: 'Tatooine Suns',      css: 'saturate(140%) contrast(120%) brightness(110%) sepia(40%) hue-rotate(-15deg)', preview: 'linear-gradient(135deg, #fceabb, #f8b500)', overlay: 'grain_custom' },
        { category: 'Cinematic', name: 'Death Star Cold',    css: 'saturate(60%) contrast(130%) brightness(90%) hue-rotate(190deg) sepia(20%)', preview: 'linear-gradient(135deg, #2c3e50, #000000)', overlay: null },
        { category: 'Cinematic', name: 'Nordic Noir',        css: 'saturate(60%) contrast(140%) brightness(90%) sepia(20%) hue-rotate(190deg)', preview: 'linear-gradient(135deg, #1f4037, #99f2c8)', overlay: null },
        { category: 'Cinematic', name: 'Vintage 70s',        css: 'sepia(40%) saturate(120%) contrast(90%) brightness(110%) hue-rotate(-10deg)', preview: 'linear-gradient(135deg, #ffb347, #ffcc33)', overlay: 'oldfilm' },

        // ── Cinematic Worlds (Blockbusters & Auteurs) ──
        // Oppenheimer: near-monochrome silver-halide B&W, pushed contrast, no color cast
        { category: 'Cinematic Worlds', name: 'Oppenheimer (B&W)', css: 'grayscale(100%) contrast(145%) brightness(95%)', preview: 'linear-gradient(135deg, #1f1f1f, #8e9eab)', overlay: 'grain_custom' },
        // Barbie: hyper-magenta/pink, lifted shadows, pushed saturation on warm tones
        { category: 'Cinematic Worlds', name: 'Barbie Dreamhouse', css: 'saturate(160%) contrast(108%) brightness(112%) hue-rotate(-8deg)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)', overlay: null },
        // Grand Budapest: Wes Anderson's pastel symmetry — warm pinks, muted blues, soft contrast
        { category: 'Cinematic Worlds', name: 'Grand Budapest Hotel', css: 'saturate(130%) contrast(100%) brightness(108%) sepia(20%) hue-rotate(5deg)', preview: 'linear-gradient(135deg, #f3e7e9, #e3eeff)', overlay: null },
        // John Wick: steely blue-grey with crushed blacks, high contrast, controlled desaturation
        { category: 'Cinematic Worlds', name: 'John Wick (Neon)', css: 'saturate(85%) contrast(138%) brightness(90%) sepia(10%) hue-rotate(8deg)', preview: 'linear-gradient(135deg, #43e97b, #38f9d7)', overlay: null },
        // Joker: Todd Phillips used a sickly green-gold cast, high contrast, underexposed shadows
        { category: 'Cinematic Worlds', name: 'Joker (Gritty Gotham)', css: 'saturate(115%) contrast(132%) brightness(88%) sepia(30%) hue-rotate(12deg)', preview: 'linear-gradient(135deg, #b8860b, #4a4a1e)', overlay: 'grain_custom' },
        // Harry Potter Deathly Hallows: cold, steel-grey desaturation, low brightness, blue-steel tint
        { category: 'Cinematic Worlds', name: 'Harry Potter (Hallows)', css: 'saturate(55%) contrast(122%) brightness(88%) sepia(8%) hue-rotate(-5deg)', preview: 'linear-gradient(135deg, #141e30, #243b55)', overlay: null },
        // Moonlight: rich deep blues, deep contrast, neon-teal on shadows — Barry Jenkins' signature
        { category: 'Cinematic Worlds', name: 'Moonlight', css: 'saturate(145%) contrast(145%) brightness(88%) sepia(5%) hue-rotate(8deg)', preview: 'linear-gradient(135deg, #0f2027, #2c5364)', overlay: null },
        // Saving Private Ryan: bleach bypass — highly desaturated, brown-green skin tones, flat grain
        { category: 'Cinematic Worlds', name: 'Saving Private Ryan', css: 'saturate(45%) contrast(138%) brightness(93%) sepia(18%)', preview: 'linear-gradient(135deg, #4b6cb7, #182848)', overlay: 'grain_custom' },
        // Amélie: Jeunet's vivid reds and greens, warm amber shadows, high saturation
        { category: 'Cinematic Worlds', name: 'Amélie', css: 'saturate(155%) contrast(115%) brightness(103%) sepia(15%) hue-rotate(5deg)', preview: 'linear-gradient(135deg, #f7971e, #ffd200)', overlay: null },
        // 300: heavy bleach bypass + golden sepia grade, extreme contrast, underexposed flesh tones
        { category: 'Cinematic Worlds', name: '300 (Sparta)', css: 'saturate(60%) contrast(168%) brightness(88%) sepia(55%)', preview: 'linear-gradient(135deg, #e65c00, #F9D423)', overlay: 'grain_custom' },
        // Arrival: cold, misty, low-saturation grey with a subtle green-grey cast for the alien scenes
        { category: 'Cinematic Worlds', name: 'Arrival', css: 'saturate(65%) contrast(118%) brightness(95%) sepia(12%)', preview: 'linear-gradient(135deg, #3a7bd5, #3a6073)', overlay: null },
        // Drive: Refn's pink neon Miami palette — high contrast, pushed shadows, hot pink highlights
        { category: 'Cinematic Worlds', name: 'Drive (Synth Noir)', css: 'saturate(140%) contrast(135%) brightness(92%) sepia(8%) hue-rotate(-10deg)', preview: 'linear-gradient(135deg, #fc00ff, #00dbde)', overlay: null },
        // Parasite (Basement): cold, grey-green, flat and clinical. No warmth at all.
        { category: 'Cinematic Worlds', name: 'Parasite (Basement)', css: 'saturate(70%) contrast(120%) brightness(82%) sepia(5%) hue-rotate(10deg)', preview: 'linear-gradient(135deg, #114357, #f29492)', overlay: null },
        // Parasite (Mansion): warm, lush, over-exposed, bright whites. The Park family's sanitized world.
        { category: 'Cinematic Worlds', name: 'Parasite (Mansion)', css: 'saturate(128%) contrast(108%) brightness(115%) sepia(18%)', preview: 'linear-gradient(135deg, #f6d365, #fda085)', overlay: null },
        // Euphoria: Sam Levinson's ultra-saturated glitter world — pushed magentas and purples
        { category: 'Cinematic Worlds', name: 'Euphoria', css: 'saturate(165%) contrast(122%) brightness(105%) hue-rotate(-8deg)', preview: 'linear-gradient(135deg, #b224ef, #7579ff)', overlay: null },
        // Stranger Things (Upside Down): dark, desaturated, heavy grain, cold. The alternate dimension.
        { category: 'Cinematic Worlds', name: 'Stranger Things (Upside Down)', css: 'saturate(40%) contrast(130%) brightness(78%) sepia(10%)', preview: 'linear-gradient(135deg, #0b1a30, #1a365d)', overlay: 'grain_custom' },
        // Stranger Things (80s): warm, nostalgic, slightly lifted shadows, film grain of VHS era
        { category: 'Cinematic Worlds', name: 'Stranger Things (80s)', css: 'saturate(128%) contrast(112%) brightness(108%) sepia(22%)', preview: 'linear-gradient(135deg, #f12711, #f5af19)', overlay: null },
        // Fight Club: green-yellow fluorescent office pallor, underexposed, gritty
        { category: 'Cinematic Worlds', name: 'Fight Club', css: 'saturate(75%) contrast(138%) brightness(85%) sepia(22%) hue-rotate(8deg)', preview: 'linear-gradient(135deg, #2b5876, #4e4376)', overlay: 'grain_custom' },
        // The Revenant: cold, natural light, clean. Lubezki's magic-hour cinematography.
        { category: 'Cinematic Worlds', name: 'The Revenant', css: 'saturate(75%) contrast(122%) brightness(96%) sepia(8%)', preview: 'linear-gradient(135deg, #8baaaa, #ae8b9c)', overlay: null },
        // Spider-Verse (Miles): Ben-Day dots comic style, vivid primaries, high contrast
        { category: 'Cinematic Worlds', name: 'Spider-Verse (Miles)', css: 'url(#ypp-fx-halftone) saturate(175%) contrast(138%) brightness(112%)', preview: 'linear-gradient(135deg, #ff0844, #ffb199)', overlay: 'halftone' },

        // ── Legendary Film Stocks ──
        // Portra 160: very low grain, lifted shadows, warm neutral, renders skin tones beautifully
        { category: 'Film Stocks', name: 'Kodak Portra 160', css: 'saturate(108%) contrast(88%) brightness(112%) sepia(8%)', preview: 'linear-gradient(135deg, #fdfbfb, #ebedee)', overlay: null },
        // Portra 800: same warmth but pushed — slightly more grain, slightly more contrast
        { category: 'Film Stocks', name: 'Kodak Portra 800', css: 'saturate(118%) contrast(102%) brightness(108%) sepia(14%)', preview: 'linear-gradient(135deg, #f6d365, #fda085)', overlay: 'grain_custom' },
        // Tri-X 400: the classic street photography B&W — punchy, gritty, deep shadows
        { category: 'Film Stocks', name: 'Kodak Tri-X 400', css: 'grayscale(100%) contrast(138%) brightness(102%)', preview: 'linear-gradient(135deg, #ffffff, #000000)', overlay: 'grain_custom' },
        // HP5 Plus: latitude king — softer B&W, high dynamic range, beautiful midtones
        { category: 'Film Stocks', name: 'Ilford HP5 Plus', css: 'grayscale(100%) contrast(95%) brightness(112%)', preview: 'linear-gradient(135deg, #e0e0e0, #888888)', overlay: 'grain_custom' },
        // Fuji Superia: slightly green in the shadows, punchy reds, pleasant everyday film
        { category: 'Film Stocks', name: 'Fuji Superia 400', css: 'saturate(125%) contrast(112%) brightness(105%) sepia(5%) hue-rotate(6deg)', preview: 'linear-gradient(135deg, #11998e, #38ef7d)', overlay: 'grain_custom' },
        // CineStill 800T: remjet-removed cinema film — tungsten-balanced (cooler shadows, warm highlights, RED halation)
        { category: 'Film Stocks', name: 'CineStill 800T', css: 'saturate(115%) contrast(120%) brightness(105%) sepia(8%) hue-rotate(-5deg)', preview: 'linear-gradient(135deg, #00c6ff, #0072ff)', overlay: 'grain_custom' },
        // Polaroid 600 (Expired): washed out, warm magenta-yellow drift, low contrast
        { category: 'Film Stocks', name: 'Polaroid 600 (Expired)', css: 'saturate(75%) contrast(88%) brightness(122%) sepia(32%)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)', overlay: null },
        // Agfa Vista 200: punchy reds and oranges, slightly warm, good saturation — a beloved EU film
        { category: 'Film Stocks', name: 'Agfa Vista 200', css: 'saturate(138%) contrast(115%) brightness(108%) sepia(10%)', preview: 'linear-gradient(135deg, #f09819, #edde5d)', overlay: null },
        // Lomography Purple: cross-processed slide film — extreme purple/magenta shift (this one IS supposed to be weird)
        { category: 'Film Stocks', name: 'Lomography Purple', css: 'saturate(145%) contrast(118%) brightness(102%) hue-rotate(-15deg) sepia(20%)', preview: 'linear-gradient(135deg, #b224ef, #7579ff)', overlay: null },
        // Kodachrome 64: the National Geographic stock — rich reds, warm but punchy, medium contrast
        { category: 'Film Stocks', name: 'Kodachrome (1970s)', css: 'saturate(145%) contrast(128%) brightness(105%) sepia(18%)', preview: 'linear-gradient(135deg, #f12711, #f5af19)', overlay: 'grain_custom' },

        // ── Animation & Anime ──
        // Evangelion: Anno's desaturated cel palette — pale skin, flat shadows, punchy isolated reds
        { category: 'Anime', name: 'Evangelion (90s Cel)', css: 'saturate(82%) contrast(118%) brightness(112%) sepia(15%)', preview: 'linear-gradient(135deg, #ff0844, #ffb199)', overlay: null },
        // Akira: Otomo's hyper-detailed Tokyo — neon city lights, vivid reds against dark nights
        { category: 'Anime', name: 'Akira (Neo-Tokyo)', css: 'saturate(155%) contrast(138%) brightness(93%)', preview: 'linear-gradient(135deg, #f83600, #f9d423)', overlay: null },
        // Cowboy Bebop: desaturated jazz-noir — sepia-soaked, muted greens and purples, moody
        { category: 'Anime', name: 'Cowboy Bebop (Noir)', css: 'saturate(80%) contrast(122%) brightness(95%) sepia(30%)', preview: 'linear-gradient(135deg, #5c258d, #4389a2)', overlay: null },
        // Arcane Piltover: warm golden brass and amber, painterly high-detail aesthetic
        { category: 'Anime', name: 'Arcane (Piltover)', css: 'saturate(132%) contrast(115%) brightness(112%) sepia(22%)', preview: 'linear-gradient(135deg, #f6d365, #fda085)', overlay: null },
        // Arcane Zaun: grimy undercity — poisonous green-purple with low brightness and high grit
        { category: 'Anime', name: 'Arcane (Zaun)', css: 'saturate(130%) contrast(125%) brightness(88%) sepia(8%) hue-rotate(10deg)', preview: 'linear-gradient(135deg, #02aab0, #00cdac)', overlay: null },
        // Violet Evergarden: KyoAni's lush pastel watercolor — soft blur, lifted whites, warm greens
        { category: 'Anime', name: 'Violet Evergarden', css: 'saturate(142%) contrast(102%) brightness(115%) sepia(10%) blur(0.25px)', preview: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', overlay: null },
        // AoT Paths: the golden sand/wheat sepia dream dimension — warm, ethereal, high contrast
        { category: 'Anime', name: 'Attack on Titan (Paths)', css: 'saturate(85%) contrast(128%) brightness(108%) sepia(40%)', preview: 'linear-gradient(135deg, #e0b866, #c8943a)', overlay: null },
        // Ghost in the Shell 1995: Oshii's rainy Hong Kong future — muted, slightly blue-green, clinical
        { category: 'Anime', name: 'Ghost in the Shell (95)', css: 'saturate(80%) contrast(118%) brightness(92%) sepia(8%) hue-rotate(12deg)', preview: 'linear-gradient(135deg, #00b4db, #0083b0)', overlay: null },
        // Demon Slayer: Ufotable's ultra-vivid breathing art — brilliant warm oranges, ultra-high saturation
        { category: 'Anime', name: 'Demon Slayer (Breathing)', css: 'saturate(175%) contrast(128%) brightness(112%)', preview: 'linear-gradient(135deg, #fceabb, #f8b500)', overlay: null },
        // Retro 80s Anime: VHS tape degredation — soft, warm, chroma bleed, nostalgic
        { category: 'Anime', name: 'Retro 80s Anime (VHS)', css: 'url(#ypp-fx-vhs-pro) saturate(108%) contrast(98%) brightness(110%) sepia(18%)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)', overlay: 'chroma-bleed' },

        // ── Internet Aesthetics & Weirdcore ──
        // Frutiger Aero: 2000s glossy tech — clean, bright, high saturation, sky-blue and lime greens
        { category: 'Aesthetics & Weirdcore', name: 'Frutiger Aero', css: 'saturate(175%) contrast(112%) brightness(122%) hue-rotate(8deg)', preview: 'linear-gradient(135deg, #00c6ff, #0072ff)', overlay: null },
        // Y2K Plastic: chrome, pink, and electric blue sheen. Bubblegum holographic.
        { category: 'Aesthetics & Weirdcore', name: 'Y2K Plastic', css: 'saturate(155%) contrast(118%) brightness(118%) hue-rotate(-12deg)', preview: 'linear-gradient(135deg, #fc00ff, #00dbde)', overlay: null },
        // Liminal Space: empty fluorescent-lit spaces — sickly yellow-green, flat contrast, slightly hazy
        { category: 'Aesthetics & Weirdcore', name: 'Liminal Space', css: 'saturate(72%) contrast(88%) brightness(115%) sepia(25%) hue-rotate(12deg) blur(0.4px)', preview: 'linear-gradient(135deg, #dce35b, #45b649)', overlay: null },
        // Deep Web Red Room: full red monochrome, grainy, threatening
        { category: 'Aesthetics & Weirdcore', name: 'Deep Web (Red Room)', css: 'grayscale(100%) sepia(100%) saturate(300%) contrast(155%) brightness(82%) hue-rotate(338deg)', preview: 'linear-gradient(135deg, #1a1a1a, #cc0000)', overlay: 'crt' },
        // Cottagecore: warm dappled sunlight, soft greens and yellows, gentle and pastoral
        { category: 'Aesthetics & Weirdcore', name: 'Cottagecore', css: 'saturate(115%) contrast(92%) brightness(115%) sepia(22%)', preview: 'linear-gradient(135deg, #d4fc79, #96e6a1)', overlay: null },
        // Goblincore: damp earth, moss, mushrooms — muddy desaturated greens and browns
        { category: 'Aesthetics & Weirdcore', name: 'Goblincore', css: 'saturate(65%) contrast(115%) brightness(88%) sepia(38%)', preview: 'linear-gradient(135deg, #7b920a, #add100)', overlay: 'grain_custom' },
        // Fairycore: overexposed, soft glow, pale pastels, ethereal blur
        { category: 'Aesthetics & Weirdcore', name: 'Fairycore', css: 'saturate(130%) contrast(88%) brightness(128%) sepia(10%) blur(0.9px)', preview: 'linear-gradient(135deg, #ff9a9e, #fecfef)', overlay: null },
        // Glitch Art Databend: intentional corruption artifact — keep this extreme (it's meant to be broken)
        { category: 'Aesthetics & Weirdcore', name: 'Glitch Art (Databend)', css: 'url(#ypp-fx-glitch) saturate(200%) contrast(150%) hue-rotate(90deg)', preview: 'linear-gradient(135deg, #4facfe, #00f2fe)', overlay: 'chroma-bleed' },
        // Vaporwave Mallsoft: empty mall ambience — washed pinks and purples, slightly hazy
        { category: 'Aesthetics & Weirdcore', name: 'Vaporwave (Mallsoft)', css: 'saturate(115%) contrast(92%) brightness(110%) sepia(12%) hue-rotate(-8deg) blur(0.8px)', preview: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', overlay: null },
        // Webcore 1999: harsh early internet — high contrast, blown-out neons, CRT flicker
        { category: 'Aesthetics & Weirdcore', name: 'Webcore (1999)', css: 'url(#ypp-crt-rgb) saturate(178%) contrast(142%) brightness(118%)', preview: 'linear-gradient(135deg, #0000ff, #ffff00)', overlay: 'crt-light' },
        // Traumacore: bleached, faded, slightly pink — like a degraded childhood photo
        { category: 'Aesthetics & Weirdcore', name: 'Traumacore', css: 'saturate(55%) contrast(88%) brightness(118%) sepia(25%)', preview: 'linear-gradient(135deg, #e2ebf0, #cfd9df)', overlay: 'oldfilm' },
        // Night Vision Mil-Spec: authentic phosphor green intensifier tube (this one IS extreme by design)
        { category: 'Aesthetics & Weirdcore', name: 'Night Vision (Mil-Spec)', css: 'grayscale(100%) sepia(100%) hue-rotate(80deg) saturate(400%) contrast(140%) brightness(130%)', preview: 'linear-gradient(135deg, #00ff00, #003300)', overlay: 'nightvision' },
        // Thermal FLIR: false-color infrared (extreme by design, not cinematic)
        { category: 'Aesthetics & Weirdcore', name: 'Thermal (FLIR)', css: 'url(#ypp-fx-predator) saturate(280%) contrast(175%)', preview: 'linear-gradient(135deg, #0000ff, #ff0000)', overlay: null }
];

if (typeof window !== 'undefined') {
    window.YPP = window.YPP || {};
    window.YPP.features = window.YPP.features || {};
    window.YPP.features.VideoFiltersPresets = { FILTERS };
}

