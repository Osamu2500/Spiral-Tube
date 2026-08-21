export class AutoTranscript extends window.YPP.features.BaseFeature {
    static featureId = 'autoTranscript';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('AutoTranscript');
        this._toolbarInjected = false;
        this._styleInjected = false;
    }

    getConfigKey() {
        return 'enableTranscript';
    }

    async enable() {
        await super.enable();
        
        if (window.YPP.sharedObserver) {
            // Watch for the video description/actions menu to load, where the transcript button lives
            window.YPP.sharedObserver.register('auto-transcript', 'ytd-video-secondary-info-renderer, ytd-watch-metadata', (elements) => {
                this._openTranscript();
            }, true);
        }
        
        this._openTranscript();
        this._injectStyles();
        
        // Watch for the transcript panel to be added so we can inject our toolbar
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.register('transcript-toolbar', 'ytd-transcript-search-panel-renderer, ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]', () => {
                this._injectToolbar();
                this._initV2Features();
            }, false);
        }
    }

    async disable() {
        await super.disable();
        if (window.YPP.sharedObserver) {
            window.YPP.sharedObserver.unregister('auto-transcript');
            window.YPP.sharedObserver.unregister('transcript-toolbar');
        }
        this._removeToolbar();
        this._removeStyles();
    }

    _openTranscript() {
        if (!this.isEnabled) return;
        
        // If transcript panel is already open, do nothing
        if (document.querySelector('ytd-transcript-renderer') || document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')) {
            return;
        }

        // Try to find the "Show Transcript" button and click it
        const buttons = Array.from(document.querySelectorAll('button, tp-yt-paper-button'));
        const transcriptBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('show transcript'));
        
        if (transcriptBtn && transcriptBtn.offsetParent !== null) {
            transcriptBtn.click();
            this.utils?.log('Auto-opened transcript', 'TRANSCRIPT', 'debug');
            
            // Unregister so we don't keep clicking it every mutation
            if (window.YPP.sharedObserver) {
                window.YPP.sharedObserver.unregister('auto-transcript');
            }
        }
    }

    _injectStyles() {
        if (this._styleInjected) return;
        const style = document.createElement('style');
        style.id = 'ypp-transcript-styles';
        style.textContent = `
            /* Karaoke Mode Enhancements */
            ytd-transcript-segment-renderer.active {
                background-color: var(--yt-spec-brand-background-primary, rgba(255, 0, 0, 0.1)) !important;
                border-left: 4px solid var(--yt-spec-brand-button-background, red) !important;
                transform: scale(1.02);
                transition: all 0.2s ease-out;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 10;
                position: relative;
            }
            ytd-transcript-segment-renderer.active .segment-text {
                font-weight: bold;
                font-size: 1.1em;
                color: var(--yt-spec-text-primary) !important;
            }
            /* Toolbar Styles */
            .ypp-transcript-toolbar {
                display: flex;
                gap: 8px;
                padding: 8px 16px;
                background: var(--yt-spec-base-background);
                border-bottom: 1px solid var(--yt-spec-10-percent-layer);
                align-items: center;
            }
            .ypp-transcript-toolbar input {
                flex: 1;
                background: var(--yt-spec-10-percent-layer);
                color: var(--yt-spec-text-primary);
                border: 1px solid var(--yt-spec-10-percent-layer);
                border-radius: 16px;
                padding: 6px 12px;
                outline: none;
            }
            .ypp-transcript-toolbar button {
                background: var(--yt-spec-brand-button-background);
                color: var(--yt-spec-brand-text-button);
                border: none;
                border-radius: 16px;
                padding: 6px 12px;
                cursor: pointer;
                font-weight: 500;
            }
            /* V2 Translation Tooltip */
            #ypp-translation-tooltip {
                position: absolute;
                background: var(--yt-spec-menu-background);
                color: var(--yt-spec-text-primary);
                border: 1px solid var(--yt-spec-10-percent-layer);
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                z-index: 9999;
                font-size: 14px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
            }
            /* V2 Visual Heatmap */
            ytd-transcript-segment-renderer.heatmap-hot { background-color: rgba(255, 50, 50, 0.15) !important; }
            ytd-transcript-segment-renderer.heatmap-warm { background-color: rgba(255, 150, 50, 0.1) !important; }
        `;
        document.head.appendChild(style);
        this._styleInjected = true;
    }

    _removeStyles() {
        const style = document.getElementById('ypp-transcript-styles');
        if (style) style.remove();
        this._styleInjected = false;
        
        if (this._tooltipEl) {
            this._tooltipEl.remove();
            this._tooltipEl = null;
        }
    }

    _injectToolbar() {
        if (this._toolbarInjected) return;
        
        const container = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"] #header');
        if (!container) return;

        const toolbar = document.createElement('div');
        toolbar.className = 'ypp-transcript-toolbar';
        toolbar.id = 'ypp-transcript-toolbar';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Regex search...';
        
        const dlBtn = document.createElement('button');
        dlBtn.textContent = 'Download TXT';

        // V4: LLM Export Mode
        const aiBtn = document.createElement('button');
        aiBtn.textContent = 'Copy for AI';
        aiBtn.style.backgroundColor = 'var(--yt-spec-call-to-action)'; // Make it pop

        toolbar.appendChild(searchInput);
        toolbar.appendChild(dlBtn);
        toolbar.appendChild(aiBtn);
        
        container.parentElement.insertBefore(toolbar, container.nextSibling);
        this._toolbarInjected = true;

        // Search logic
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            let regex;
            try {
                regex = new RegExp(query, 'i');
            } catch (err) {
                return; // Invalid regex
            }
            
            const segments = document.querySelectorAll('ytd-transcript-segment-renderer');
            segments.forEach(seg => {
                const text = seg.querySelector('.segment-text')?.textContent || '';
                if (!query || regex.test(text)) {
                    seg.style.display = '';
                } else {
                    seg.style.display = 'none';
                }
            });
        });

        // Download logic
        dlBtn.addEventListener('click', () => {
            const segments = document.querySelectorAll('ytd-transcript-segment-renderer');
            let content = '# YouTube Transcript\n\n';
            segments.forEach(seg => {
                const time = seg.querySelector('.segment-timestamp')?.textContent?.trim() || '';
                const text = seg.querySelector('.segment-text')?.textContent?.trim() || '';
                if (text) {
                    content += `[${time}] ${text}\n`;
                }
            });
            
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const videoId = new URLSearchParams(window.location.search).get('v') || 'video';
            a.download = `transcript_${videoId}.md`;
            a.click();
            URL.revokeObjectURL(url);
        });
        
        // V4: Copy for AI Logic
        aiBtn.addEventListener('click', () => {
            const segments = document.querySelectorAll('ytd-transcript-segment-renderer');
            let content = '';
            segments.forEach(seg => {
                const text = seg.querySelector('.segment-text')?.textContent?.trim() || '';
                if (text) {
                    content += text + ' ';
                }
            });
            
            // Clean up formatting
            content = content.replace(/\s+/g, ' ').trim();
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(content).then(() => {
                    const originalText = aiBtn.textContent;
                    aiBtn.textContent = 'Copied!';
                    setTimeout(() => aiBtn.textContent = originalText, 2000);
                });
            }
        });
    }

    _removeToolbar() {
        const tb = document.getElementById('ypp-transcript-toolbar');
        if (tb) tb.remove();
        this._toolbarInjected = false;
    }
    
    // --- V2 Features ---
    
    _initV2Features() {
        // 1. Click-to-Translate
        if (!this._tooltipEl) {
            this._tooltipEl = document.createElement('div');
            this._tooltipEl.id = 'ypp-translation-tooltip';
            document.body.appendChild(this._tooltipEl);
            
            this.addListener(document.body, 'dblclick', (e) => {
                if (e.target.closest('.segment-text')) {
                    const word = window.getSelection().toString().trim();
                    if (word && /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u0500-\u052F\s'-]+$/.test(word)) {
                        this._showTranslationTooltip(word, e.pageX, e.pageY);
                    }
                }
            });
            
            this.addListener(document.body, 'click', (e) => {
                if (this._tooltipEl && this._tooltipEl.style.opacity === '1') {
                    this._tooltipEl.style.opacity = '0';
                }
            });
        }
        
        // 2. Visual Heatmap Integration
        setTimeout(() => this._applyHeatmapToTranscript(), 1000);
    }
    
    _showTranslationTooltip(word, x, y) {
        this._tooltipEl.innerHTML = `<strong>${word}</strong><br/><span style="color:var(--yt-spec-text-secondary); font-size: 12px;">Searching dictionary...</span>`;
        this._tooltipEl.style.left = `${x}px`;
        this._tooltipEl.style.top = `${y - 40}px`;
        this._tooltipEl.style.opacity = '1';
        
        // Mock translation fetch (V2 would connect to an actual API)
        setTimeout(() => {
            this._tooltipEl.innerHTML = `<strong>${word}</strong><br/><span style="color:var(--yt-spec-text-secondary); font-size: 12px;">(Translated / Defined text goes here)</span>`;
        }, 600);
    }
    
    _applyHeatmapToTranscript() {
        // Find transcript segments
        const segments = document.querySelectorAll('ytd-transcript-segment-renderer');
        if (!segments.length) return;
        
        // In a real scenario, we parse the SVG path from '.ytp-heat-map-path' and map its 
        // relative heights to timestamps. For the demo, we will simulate a heatmap 
        // to show the UI integration.
        segments.forEach((seg, i) => {
            // Simulated heatmap data based on typical retention curves
            const progress = i / segments.length;
            let heat = 0;
            
            // Spike at 10%, 50%, and 80%
            if (Math.abs(progress - 0.1) < 0.05) heat = 0.8;
            else if (Math.abs(progress - 0.5) < 0.05) heat = 0.9;
            else if (Math.abs(progress - 0.8) < 0.05) heat = 0.7;
            
            if (heat > 0.8) seg.classList.add('heatmap-hot');
            else if (heat > 0.6) seg.classList.add('heatmap-warm');
        });
    }
};

window.YPP.features.AutoTranscript = AutoTranscript;
