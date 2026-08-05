export class VideoFiltersOverlay {
  static featureId = 'videoFiltersOverlay';
  static executionPhase = 'idle';
  static priority = 999;

  static applyOverlay(ctx, type, grainAmount = 0) {
    const container =
      document.getElementById('movie_player') ||
      document.querySelector('.html5-video-player') ||
      document.body;

    if (!container) return;

    const overlay = this._buildOverlayElement(container);

    this._applyOverlayStyles(overlay, ctx, type, grainAmount);

    container.appendChild(overlay);
    ctx._filterOverlay = overlay;
    this.injectOverlayCSS();
  }

  static manageSVGFilters(activeCSS = '') {
    // Lazy inject CRT filter (id: ypp-crt-rgb)
    if (activeCSS.includes('ypp-crt-rgb')) this.injectCRTSVGFilter();

    // Modular dynamic filter injection
    const matches = activeCSS.matchAll(/url\(#(ypp-fx-[^)]+)\)/g);
    for (const match of matches) {
        this.injectSpecialEffectsSVG(match[1]);
    }

    // Glitch SVG: inject + pause/unpause animated filters based on active use (GPU saver)
    if (activeCSS.includes('ypp-fx-glitch') || activeCSS.includes('ypp-fx-rgb-split')) {
        this.injectGlitchSVGFilter();
        const glitchSVG = document.getElementById('ypp-glitch-svg-defs');
        if (glitchSVG && glitchSVG.unpauseAnimations) glitchSVG.unpauseAnimations();
    } else {
        const glitchSVG = document.getElementById('ypp-glitch-svg-defs');
        if (glitchSVG && glitchSVG.pauseAnimations) glitchSVG.pauseAnimations();
    }
  }

  static _buildOverlayElement(container) {
    const overlay = document.createElement('div');
    overlay.id = 'ypp-filter-overlay';
    const isBody = container === document.body;

    Object.assign(overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      top: '0',
      left: '0',
      width: isBody ? '100vw' : '100%',
      height: isBody ? '100vh' : '100%',
      pointerEvents: 'none',
      zIndex: isBody ? '2147483640' : '5',
    });

    return overlay;
  }

  static _applyOverlayStyles(overlay, ctx, type, grainAmount) {
    const vignette = ctx.filterAdjustments?.vignette || 0;

    if (vignette > 0) {
      const spread = vignette * 2.5;
      const alpha = vignette / 100;
      overlay.style.boxShadow = `inset 0 0 ${spread}px rgba(0,0,0,${alpha})`;
    }

    if (grainAmount > 0 || type === 'grain_custom') {
      overlay.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
      overlay.style.opacity = (grainAmount || 20) / 100;
      overlay.style.mixBlendMode = 'overlay';
      overlay.style.pointerEvents = 'none';
    }

    if (type === 'nightvision') {
      overlay.style.backgroundImage = `
                radial-gradient(circle, transparent 40%, rgba(0, 30, 0, 0.8) 100%),
                repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)
            `;
      overlay.style.boxShadow = 'inset 0 0 100px rgba(0, 255, 0, 0.1)';
      overlay.style.mixBlendMode = 'multiply';
    } else if (type && type.startsWith('crt')) {
      this.injectCRTSVGFilter();

      let vignette =
        'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%),';
      let scanlines =
        'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px),';
      let rgbMask =
        'repeating-linear-gradient(90deg, rgba(255,40,40,0.1) 0px, rgba(255,40,40,0.1) 1px, rgba(40,255,40,0.1) 1px, rgba(40,255,40,0.1) 2px, rgba(40,40,255,0.1) 2px, rgba(40,40,255,0.1) 3px, transparent 3px, transparent 3px)';
      let boxShadow = 'inset 0 0 80px rgba(0,0,0,0.6)';

      if (type === 'crt-light') {
        vignette = '';
        scanlines =
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 3px),';
        rgbMask =
          'repeating-linear-gradient(90deg, rgba(255,40,40,0.05) 0px, rgba(255,40,40,0.05) 1px, rgba(40,255,40,0.05) 1px, rgba(40,255,40,0.05) 2px, rgba(40,40,255,0.05) 2px, rgba(40,40,255,0.05) 3px, transparent 3px, transparent 3px)';
        boxShadow = 'none';
      } else if (type === 'crt-arcade') {
        vignette =
          'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 75%, rgba(0,0,0,0.2) 100%),';
        scanlines =
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px),';
        rgbMask =
          'repeating-linear-gradient(90deg, rgba(255,40,40,0.15) 0px, rgba(255,40,40,0.15) 1px, rgba(40,255,40,0.15) 1px, rgba(40,255,40,0.15) 2px, rgba(40,40,255,0.15) 2px, rgba(40,40,255,0.15) 3px, transparent 3px, transparent 3px)';
        boxShadow = 'inset 0 0 40px rgba(0,0,0,0.4)';
      } else if (type === 'crt-green') {
        rgbMask =
          'repeating-linear-gradient(90deg, rgba(0,255,0,0.15) 0px, rgba(0,255,0,0.15) 1px, transparent 1px, transparent 3px)';
      } else if (type === 'crt-amber') {
        rgbMask =
          'repeating-linear-gradient(90deg, rgba(255,176,0,0.15) 0px, rgba(255,176,0,0.15) 1px, transparent 1px, transparent 3px)';
      }

      overlay.style.backgroundImage = `${vignette}\n${scanlines}\n${rgbMask}`;
      overlay.style.backgroundSize = vignette
        ? '100% 100%, 100% 3px, 3px 100%'
        : '100% 3px, 3px 100%';
      overlay.style.boxShadow = boxShadow;
      overlay.style.borderRadius = vignette ? '6px' : '0px';
      overlay.style.animation = 'ypp-crt-flicker 3s ease-in-out infinite';
    } else if (type === 'halftone') {
      overlay.style.backgroundImage = `radial-gradient(circle, #000 1px, transparent 1.5px)`;
      overlay.style.backgroundSize = '4px 4px';
      overlay.style.opacity = '0.25';
      overlay.style.mixBlendMode = 'multiply';
    } else if (type === 'vhs') {
      overlay.style.backgroundImage = `
                repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)
            `;
      overlay.style.mixBlendMode = 'multiply';
      const band = document.createElement('div');
      Object.assign(band.style, {
        position: 'absolute',
        left: '0',
        width: '100%',
        height: '6px',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(1px)',
        animation: 'ypp-vhs-band 4s linear infinite',
        pointerEvents: 'none',
      });
      overlay.appendChild(band);
    } else if (type === 'oldfilm') {
      overlay.style.backgroundImage = `
                radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)
            `;
      overlay.style.animation = 'ypp-grain 0.1s steps(1) infinite';
    } else if (type === 'security-cam') {
      overlay.style.backgroundImage = `
                repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 4px)
            `;
      overlay.style.boxShadow = 'inset 0 0 60px rgba(0,0,0,0.6)';
      overlay.style.mixBlendMode = 'multiply';
    } else if (type === 'gameboy') {
      overlay.style.backgroundImage = `
                repeating-linear-gradient(0deg, rgba(15, 56, 15, 0.25) 0px, rgba(15, 56, 15, 0.25) 1px, transparent 1px, transparent 3px),
                repeating-linear-gradient(90deg, rgba(15, 56, 15, 0.1) 0px, rgba(15, 56, 15, 0.1) 1px, transparent 1px, transparent 3px)
            `;
      overlay.style.boxShadow = 'inset 0 0 80px rgba(15, 56, 15, 0.5)';
    } else if (type === 'daguerreotype') {
      overlay.style.backgroundImage = `
                radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)
            `;
      overlay.style.animation =
        'ypp-grain 0.08s steps(1) infinite, ypp-daguerreotype-flicker 5s ease-in-out infinite';
    } else if (type === 'chroma-bleed') {
      const band = document.createElement('div');
      Object.assign(band.style, {
        position: 'absolute',
        left: '0',
        width: '100%',
        height: '3px',
        background: 'linear-gradient(90deg, rgba(255,0,128,0.4), rgba(0,255,255,0.4))',
        filter: 'blur(2px)',
        animation: 'ypp-chroma-band 6s linear infinite',
        pointerEvents: 'none',
      });
      overlay.appendChild(band);
      overlay.style.backgroundImage = `
                repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)
            `;
      overlay.style.mixBlendMode = 'multiply';
    } else if (type === 'glitch-tracking') {
      const band = document.createElement('div');
      Object.assign(band.style, {
        position: 'absolute',
        left: '0',
        width: '100%',
        height: '20px',
        background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)',
        animation: 'ypp-vhs-tracking 2s linear infinite',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        transform: 'translateZ(0)',
        willChange: 'top'
      });
      overlay.appendChild(band);
      
      const styleId = 'ypp-glitch-anim';
      if (!document.getElementById(styleId)) {
          const s = document.createElement('style');
          s.id = styleId;
          s.textContent = `@keyframes ypp-vhs-tracking { 0% { top: -10%; } 100% { top: 110%; } }`;
          document.head.appendChild(s);
      }
    } else if (type === 'cinemascope') {
      overlay.style.boxShadow = 'inset 0 12vh 0 0 #000, inset 0 -12vh 0 0 #000';
      const flare = document.createElement('div');
      Object.assign(flare.style, {
        position: 'absolute',
        top: '30%',
        left: '-100%',
        width: '200%',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, rgba(0, 150, 255, 0.4), rgba(255, 255, 255, 0.8), rgba(0, 150, 255, 0.4), transparent)',
        filter: 'blur(3px)',
        transform: 'scaleY(0.5)',
        mixBlendMode: 'screen',
        animation: 'ypp-flare-pan 8s cubic-bezier(0.25, 1, 0.5, 1) infinite',
        pointerEvents: 'none',
      });
      overlay.appendChild(flare);
      const styleId = 'ypp-cinemascope-anim';
      if (!document.getElementById(styleId)) {
          const s = document.createElement('style');
          s.id = styleId;
          s.textContent = `@keyframes ypp-flare-pan { 0% { transform: translateX(0) scaleY(0.5); opacity: 0; } 10% { opacity: 1; transform: translateX(20%) scaleY(1); } 90% { opacity: 1; transform: translateX(80%) scaleY(1); } 100% { transform: translateX(100%) scaleY(0.5); opacity: 0; } }`;
          document.head.appendChild(s);
      }
    }
  }

  static injectSVGSharpness(amount) {
    if (amount <= 0) return;

    const strength = (amount / 100) * 2;
    const center = 1 + 4 * strength;
    const edge = -strength;
    const matrix = `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`;

    let svg = document.getElementById('ypp-svg-sharpness-defs');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'ypp-svg-sharpness-defs';
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = 'ypp-svg-sharpness';

      const convolve = document.createElementNS('http://www.w3.org/2000/svg', 'feConvolveMatrix');
      convolve.setAttribute('order', '3 3');
      convolve.setAttribute('preserveAlpha', 'true');
      convolve.setAttribute('kernelMatrix', matrix);
      convolve.id = 'ypp-sharpness-kernel';

      filter.appendChild(convolve);
      defs.appendChild(filter);
      svg.appendChild(defs);
      document.body.appendChild(svg);
    } else {
      const kernel =
        document.getElementById('ypp-sharpness-kernel') || svg.querySelector('feConvolveMatrix');
      if (kernel) kernel.setAttribute('kernelMatrix', matrix);
    }
  }

  static injectGlitchSVGFilter() {
    if (document.getElementById('ypp-glitch-svg-defs')) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.id = 'ypp-glitch-svg-defs';
    svg.setAttribute('xmlns', svgNS);
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';

    const rgbSplit = `
        <filter id="ypp-fx-rgb-split" color-interpolation-filters="sRGB">
            <feOffset in="SourceGraphic" dx="4" dy="0" result="red-shift">
                <animate attributeName="dx" values="2; 5; 2; 1; 2" dur="4s" repeatCount="indefinite" />
            </feOffset>
            <feOffset in="SourceGraphic" dx="-4" dy="0" result="blue-shift">
                <animate attributeName="dx" values="-2; -1; -2; -5; -2" dur="4s" repeatCount="indefinite" />
            </feOffset>
            <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-only" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green-only" />
            <feColorMatrix in="blue-shift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-only" />
            <feBlend mode="screen" in="red-only" in2="green-only" result="rg" />
            <feBlend mode="screen" in="rg" in2="blue-only" result="rgb" />
        </filter>
    `;

    const datamosh = `
        <filter id="ypp-fx-glitch-datamosh" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.2" numOctaves="1" result="noise">
                <animate attributeName="baseFrequency" values="0.01 0.2; 0.05 0.5; 0.01 0.2; 0.1 0.1; 0.01 0.2" dur="2s" keyTimes="0; 0.1; 0.2; 0.9; 1" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  3 -1 -1 0 0" in="noise" result="chunky-noise" />
            <feDisplacementMap in="SourceGraphic" in2="chunky-noise" scale="30" xChannelSelector="R" yChannelSelector="G" result="displaced">
                <animate attributeName="scale" values="0; 50; 0; 0; 0" dur="2s" keyTimes="0; 0.1; 0.2; 0.9; 1" repeatCount="indefinite" />
            </feDisplacementMap>
            <feOffset in="displaced" dx="10" dy="0" result="red-shift">
                <animate attributeName="dx" values="0; 30; 0; 0; 0" dur="2s" keyTimes="0; 0.1; 0.2; 0.9; 1" repeatCount="indefinite" />
            </feOffset>
            <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-only" />
            <feColorMatrix in="displaced" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cyan-only" />
            <feBlend mode="screen" in="red-only" in2="cyan-only" result="glitch-final" />
        </filter>
    `;

    svg.innerHTML = `<defs>${rgbSplit}${datamosh}</defs>`;
    document.body.appendChild(svg);
  }

  static injectCRTSVGFilter() {
    if (document.getElementById('ypp-crt-svg-defs')) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.id = 'ypp-crt-svg-defs';
    svg.setAttribute('xmlns', svgNS);
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';

    const defs = document.createElementNS(svgNS, 'defs');
    const filter = document.createElementNS(svgNS, 'filter');
    filter.id = 'ypp-crt-rgb';
    filter.setAttribute('x', '0%');
    filter.setAttribute('y', '0%');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    const el = (tag, attrs) => {
      const e = document.createElementNS(svgNS, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      return e;
    };

    filter.append(
      el('feOffset', { in: 'SourceGraphic', dx: '1.5', dy: '0', result: 'rShifted' }),
      el('feColorMatrix', {
        in: 'rShifted',
        type: 'matrix',
        values: '1 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0',
        result: 'rOnly',
      }),
      el('feColorMatrix', {
        in: 'SourceGraphic',
        type: 'matrix',
        values: '0 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 1 0',
        result: 'gOnly',
      }),
      el('feOffset', { in: 'SourceGraphic', dx: '-1.5', dy: '0', result: 'bShifted' }),
      el('feColorMatrix', {
        in: 'bShifted',
        type: 'matrix',
        values: '0 0 0 0 0   0 0 0 0 0   0 0 1 0 0   0 0 0 1 0',
        result: 'bOnly',
      }),
      el('feBlend', { in: 'rOnly', in2: 'gOnly', mode: 'screen', result: 'rg' }),
      el('feBlend', { in: 'rg', in2: 'bOnly', mode: 'screen' })
    );

    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
  }

  static _SVG_EFFECT_MAP = {
      'ypp-fx-matrix': `<feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"/>`,
      'ypp-fx-edge': `<feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1"/>`,
      'ypp-fx-emboss': `<feConvolveMatrix order="3 3" preserveAlpha="true" kernelMatrix="-2 -1 0 -1 1 1 0 1 2"/>`,
      'ypp-fx-posterize': `<feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 0.1 0.25 0.5 0.75 0.9 1"/>
          <feFuncG type="discrete" tableValues="0 0.1 0.25 0.5 0.75 0.9 1"/>
          <feFuncB type="discrete" tableValues="0 0.1 0.25 0.5 0.75 0.9 1"/>
      </feComponentTransfer>`,
      'ypp-fx-colorize': `<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feComponentTransfer in="gray">
          <feFuncR type="table" tableValues="0.05 0.3 0.8 1.0 1.0"/>
          <feFuncG type="table" tableValues="0.00 0.0 0.1 0.7 1.0"/>
          <feFuncB type="table" tableValues="0.10 0.4 0.3 0.1 1.0"/>
      </feComponentTransfer>`,
      'ypp-fx-technicolor': `<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feComponentTransfer in="gray">
          <feFuncR type="table" tableValues="0.0 0.3 0.7 0.9 1.0"/>
          <feFuncG type="table" tableValues="0.1 0.2 0.5 0.8 0.95"/>
          <feFuncB type="table" tableValues="0.2 0.4 0.2 0.4 0.9"/>
      </feComponentTransfer>`,
      'ypp-fx-dreamcolor': `<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feComponentTransfer in="gray">
          <feFuncR type="table" tableValues="0.1 0.4 0.8 0.5 0.9"/>
          <feFuncG type="table" tableValues="0.0 0.2 0.5 0.8 1.0"/>
          <feFuncB type="table" tableValues="0.3 0.5 0.7 0.9 0.9"/>
      </feComponentTransfer>`,
      'ypp-fx-glitch': `<feOffset in="SourceGraphic" dx="6" dy="0" result="red-shift"/>
      <feOffset in="SourceGraphic" dx="-6" dy="0" result="blue-shift"/>
      <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-only"/>
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green-only"/>
      <feColorMatrix in="blue-shift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-only"/>
      <feBlend mode="screen" in="red-only" in2="green-only" result="red-green"/>
      <feBlend mode="screen" in="red-green" in2="blue-only"/>`,
      'ypp-fx-sketch': `<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feGaussianBlur in="gray" stdDeviation="4" result="blur"/>
      <feComponentTransfer in="blur" result="invertedBlur">
          <feFuncR type="linear" slope="-1" intercept="1"/>
          <feFuncG type="linear" slope="-1" intercept="1"/>
          <feFuncB type="linear" slope="-1" intercept="1"/>
      </feComponentTransfer>
      <feBlend mode="color-dodge" in="invertedBlur" in2="gray" result="sketch"/>
      <feComponentTransfer in="sketch">
          <feFuncR type="linear" slope="1.2" intercept="-0.2"/>
          <feFuncG type="linear" slope="1.2" intercept="-0.2"/>
          <feFuncB type="linear" slope="1.2" intercept="-0.2"/>
      </feComponentTransfer>`,
      'ypp-fx-colored-pencil': `<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
      <feComponentTransfer in="blur" result="invertedBlur">
          <feFuncR type="linear" slope="-1" intercept="1"/>
          <feFuncG type="linear" slope="-1" intercept="1"/>
          <feFuncB type="linear" slope="-1" intercept="1"/>
      </feComponentTransfer>
      <feBlend mode="color-dodge" in="invertedBlur" in2="SourceGraphic" result="sketch"/>
      <feComponentTransfer in="sketch">
          <feFuncR type="linear" slope="1.2" intercept="-0.2"/>
          <feFuncG type="linear" slope="1.2" intercept="-0.2"/>
          <feFuncB type="linear" slope="1.2" intercept="-0.2"/>
      </feComponentTransfer>`,
      'ypp-fx-pop-art': `<feComponentTransfer>
          <feFuncR type="discrete" tableValues="0.1 0.4 0.8 1"/>
          <feFuncG type="discrete" tableValues="0.1 0.4 0.8 1"/>
          <feFuncB type="discrete" tableValues="0.1 0.4 0.8 1"/>
      </feComponentTransfer>
      <feColorMatrix type="matrix" values="1 0 0 0 0.1  0 1 0 0 0.1  0 0 1 0 0.1  0 0 0 1 0"/>`,
      'ypp-fx-8bit': `<feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1"/>
          <feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1"/>
          <feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1"/>
      </feComponentTransfer>`,
      'ypp-fx-manga-bw': `<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feComponentTransfer in="gray" result="highContrast">
          <feFuncR type="discrete" tableValues="0 1"/>
          <feFuncG type="discrete" tableValues="0 1"/>
          <feFuncB type="discrete" tableValues="0 1"/>
      </feComponentTransfer>`,
      'ypp-fx-gameboy': `<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feComponentTransfer in="gray">
          <feFuncR type="discrete" tableValues="0.059 0.188 0.306 0.616"/>
          <feFuncG type="discrete" tableValues="0.220 0.392 0.545 0.749"/>
          <feFuncB type="discrete" tableValues="0.059 0.188 0.306 0.616"/>
      </feComponentTransfer>`,
      'ypp-fx-aerochrome': `<feColorMatrix type="matrix"
          values="0   1   0   0   0
                  0   0   1   0   0
                 -0.5 0  0.2  0   0.1
                  0   0   0   1   0"/>`,
      'ypp-fx-selective-red': `<feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feColorMatrix in="SourceGraphic" type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  4 -2 -2 0 -0.1" result="maskRaw"/>
      <feComponentTransfer in="maskRaw" result="mask">
          <feFuncA type="linear" slope="5" intercept="0"/>
      </feComponentTransfer>
      <feComposite in="SourceGraphic" in2="mask" operator="in" result="isolated"/>
      <feBlend in="isolated" in2="gray" mode="normal"/>`,
      'ypp-fx-selective-blue': `<feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feColorMatrix in="SourceGraphic" type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  -2 -2 4 0 -0.1" result="maskRaw"/>
      <feComponentTransfer in="maskRaw" result="mask">
          <feFuncA type="linear" slope="5" intercept="0"/>
      </feComponentTransfer>
      <feComposite in="SourceGraphic" in2="mask" operator="in" result="isolated"/>
      <feBlend in="isolated" in2="gray" mode="normal"/>`,
      'ypp-fx-bloom': `<!-- Extract bright highlights -->
      <feComponentTransfer in="SourceGraphic" result="highlights">
          <feFuncR type="linear" slope="2" intercept="-1"/>
          <feFuncG type="linear" slope="2" intercept="-1"/>
          <feFuncB type="linear" slope="2" intercept="-1"/>
      </feComponentTransfer>
      <feGaussianBlur in="highlights" stdDeviation="12" result="blurred"/>
      <!-- Warm Halation Tint -->
      <feColorMatrix in="blurred" type="matrix" 
          values="1.3 0 0 0 0
                  0 0.9 0 0 0
                  0 0 0.7 0 0
                  0 0 0 1 0" result="glow"/>
      <feBlend in="glow" in2="SourceGraphic" mode="screen"/>`,
      'ypp-fx-watercolor': `<feGaussianBlur stdDeviation="2.5" result="blurred"/>
      <feComponentTransfer in="blurred" result="boosted">
          <feFuncR type="linear" slope="1.1" intercept="-0.05"/>
          <feFuncG type="linear" slope="1.1" intercept="-0.05"/>
          <feFuncB type="linear" slope="1.1" intercept="-0.05"/>
      </feComponentTransfer>
      <feConvolveMatrix order="3 3" kernelMatrix="0 -0.3 0 -0.3 2.2 -0.3 0 -0.3 0" in="boosted"/>`,
      'ypp-fx-cyberpunk': `<feComponentTransfer>
          <feFuncR type="table" tableValues="0.0 0.05 0.3 0.75 1.0"/>
          <feFuncG type="table" tableValues="0.0 0.1  0.4 0.8  1.0"/>
          <feFuncB type="table" tableValues="0.2 0.5  0.8 0.9  1.0"/>
      </feComponentTransfer>`,
      'ypp-fx-vhs-pro': `<feOffset in="SourceGraphic" dx="5" dy="0" result="rShift"/>
      <feOffset in="SourceGraphic" dx="-5" dy="0" result="bShift"/>
      <feColorMatrix in="rShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rOnly"/>
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gOnly"/>
      <feColorMatrix in="bShift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bOnly"/>
      <feBlend mode="screen" in="rOnly" in2="gOnly" result="rg"/>
      <feBlend mode="screen" in="rg" in2="bOnly"/>`,
      'ypp-fx-anime-warm': `<feComponentTransfer>
          <feFuncR type="table" tableValues="0.1 0.4 0.7 0.9 1.0"/>
          <feFuncG type="table" tableValues="0.05 0.35 0.65 0.85 0.95"/>
          <feFuncB type="table" tableValues="0.0 0.25 0.5 0.7 0.85"/>
      </feComponentTransfer>`,
      'ypp-fx-anime-cold': `<feColorMatrix type="matrix" values="0.7 0.1 0.1 0 0  0 0.85 0.15 0 0  0 0.1 0.9 0 0.05  0 0 0 1 0"/>`,
      'ypp-fx-cross-process': `<feComponentTransfer>
          <feFuncR type="table" tableValues="0.0 0.05 0.1 0.6 1.2"/>
          <feFuncG type="table" tableValues="0.0 0.1  0.3 0.7 1.0"/>
          <feFuncB type="table" tableValues="0.2 0.6  0.9 0.8 0.6"/>
      </feComponentTransfer>`,
      'ypp-fx-duotone-teal': `<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray"/>
      <feComponentTransfer in="gray">
          <feFuncR type="table" tableValues="0.0 0.8 1.0"/>
          <feFuncG type="table" tableValues="0.2 0.5 0.7"/>
          <feFuncB type="table" tableValues="0.3 0.1 0.0"/>
      </feComponentTransfer>`,
      'ypp-fx-golden-lut': `<feComponentTransfer>
          <feFuncR type="table" tableValues="0.05 0.4 0.9 1.1"/>
          <feFuncG type="table" tableValues="0.02 0.3 0.7 0.9"/>
          <feFuncB type="table" tableValues="0.0  0.1 0.2 0.4"/>
      </feComponentTransfer>`
  };

  static injectSpecialEffectsSVG(filterId) {
    if (!filterId || document.getElementById(filterId)) return;
    
    let svg = document.getElementById('ypp-special-fx-defs');
    let defs;
    if (!svg) {
        const svgNS = 'http://www.w3.org/2000/svg';
        svg = document.createElementNS(svgNS, 'svg');
        svg.id = 'ypp-special-fx-defs';
        svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
        defs = document.createElementNS(svgNS, 'defs');
        svg.appendChild(defs);
        document.body.appendChild(svg);
    } else {
        defs = svg.querySelector('defs');
    }

    const filterContent = this._SVG_EFFECT_MAP[filterId];
    if (filterContent) {
        const temp = document.createElement('div');
        temp.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><filter id="${filterId}" color-interpolation-filters="sRGB">${filterContent}</filter></svg>`;
        const newFilter = temp.querySelector('filter');
        if (newFilter) {
            defs.appendChild(newFilter);
        }
    }
  }

  static injectOverlayCSS() {
    if (document.getElementById('ypp-overlay-css')) return;
    const style = document.createElement('style');
    style.id = 'ypp-overlay-css';
    style.textContent = `
            @keyframes ypp-crt-flicker {
                0%   { opacity: 1; }
                48%  { opacity: 1; }
                50%  { opacity: 0.94; }
                52%  { opacity: 1; }
                88%  { opacity: 1; }
                90%  { opacity: 0.97; }
                92%  { opacity: 1; }
            }
            @keyframes ypp-vhs-band {
                0%   { top: -8px; }
                100% { top: 102%; }
            }
            @keyframes ypp-grain {
                0%  { background-position: 0% 0%; }
                10% { background-position: -5% -5%; }
                20% { background-position: -10% 5%; }
                30% { background-position: 5% -10%; }
                40% { background-position: -5% 15%; }
                50% { background-position: -10% 5%; }
                60% { background-position: 15% 0%; }
                70% { background-position: 0% 10%; }
                80% { background-position: -15% 0%; }
                90% { background-position: 10% 5%; }
                100%{ background-position: 5% 0%; }
            }
            @keyframes ypp-daguerreotype-flicker {
                0%, 100% { opacity: 1; }
                15%       { opacity: 0.96; }
                40%       { opacity: 1; }
                70%       { opacity: 0.93; }
                85%       { opacity: 1; }
            }
            @keyframes ypp-chroma-band {
                0%   { top: -4px; }
                100% { top: 102%; }
            }
        `;
    document.head.appendChild(style);
  }

  static removeOverlay(ctx) {
    if (ctx._filterOverlay) {
      ctx._filterOverlay.remove();
      ctx._filterOverlay = null;
    }
  }

  static setupDynamicSVGFilter() {
    if (document.getElementById('ypp-dynamic-svg-grade')) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.id = 'ypp-dynamic-svg-grade';
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';

    svg.innerHTML = `
            <defs>
                <filter id="ypp-dynamic-filter" color-interpolation-filters="sRGB">
                    <feComponentTransfer id="ypp-svg-curves">
                        <feFuncR type="table" tableValues="0 1"/>
                        <feFuncG type="table" tableValues="0 1"/>
                        <feFuncB type="table" tableValues="0 1"/>
                    </feComponentTransfer>
                </filter>
            </defs>
        `;
    document.body.appendChild(svg);
  }

  static _pendingDynamicUpdate = null;

  static updateDynamicSVGFilter(adj) {
    if (this._pendingDynamicUpdate) {
      cancelAnimationFrame(this._pendingDynamicUpdate);
    }
    
    this._pendingDynamicUpdate = requestAnimationFrame(() => {
      this._pendingDynamicUpdate = null;
      this.setupDynamicSVGFilter();
      const curves = document.getElementById('ypp-svg-curves');
      if (!curves) return;

      const steps = 32; // Reduced steps for performance, still smooth enough
      const rTable = [];
      const gTable = [];
      const bTable = [];

    for (let i = 0; i <= steps; i++) {
      let t = i / steps;

      if (adj.shadows !== 0) {
        const shadowEffect = Math.max(0, 1 - t * 2);
        t += (adj.shadows / 100) * 0.4 * shadowEffect;
      }

      if (adj.highlights !== 0) {
        const highlightEffect = Math.max(0, (t - 0.5) * 2);
        t += (adj.highlights / 100) * 0.4 * highlightEffect;
      }

      if (adj.contrast !== 100) {
        const c = adj.contrast / 100;
        t = (t - 0.5) * c + 0.5;
      }

      if (adj.brightness !== 100) {
        t = t * (adj.brightness / 100);
      }

      t = Math.max(0, Math.min(1, t));

      let rt = t,
        gt = t,
        bt = t;

      if (adj.temperature !== 0) {
        const temp = adj.temperature / 100;
        if (temp > 0) {
          rt = Math.min(1, rt * (1 + temp * 0.2));
          bt = Math.max(0, bt * (1 - temp * 0.15));
        } else {
          rt = Math.max(0, rt * (1 + temp * 0.15));
          bt = Math.min(1, bt * (1 - temp * 0.2));
        }
      }

      rTable.push(rt);
      gTable.push(gt);
      bTable.push(bt);
    }

    curves
      .querySelector('feFuncR')
      .setAttribute('tableValues', rTable.map((n) => n.toFixed(3)).join(' '));
    curves
      .querySelector('feFuncG')
      .setAttribute('tableValues', gTable.map((n) => n.toFixed(3)).join(' '));
      curves
        .querySelector('feFuncB')
        .setAttribute('tableValues', bTable.map((n) => n.toFixed(3)).join(' '));
    });
  }
}

window.YPP = window.YPP || {};
window.YPP.features = window.YPP.features || {};
window.YPP.features.VideoFiltersOverlay = VideoFiltersOverlay;
