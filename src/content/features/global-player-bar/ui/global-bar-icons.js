export const ICONS = {
    play:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14c0 .89 1.01 1.4 1.73.88l10.49-7c.63-.42.63-1.36 0-1.78L9.73 4.26C9.01 3.74 8 4.25 8 5.14z"/></svg>`,
    pause:      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h2.5c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5H7c-.83 0-1.5-.67-1.5-1.5v-11C5.5 5.67 6.17 5 7 5zm7.5 0H17c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-2.5c-.83 0-1.5-.67-1.5-1.5v-11c0-.83.67-1.5 1.5-1.5z"/></svg>`,
    mute:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
    volumeHigh: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
    loop:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`,
    pip:        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>`,
    fullscreen: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
    close:      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`
};

export const BAR_HTML = `
    <div class="ypp-gpb-controls">
        <div class="ypp-gpb-group">
            <button class="ypp-gpb-btn ypp-action-btn ypp-gpb-play-hero" id="ypp-gpb-play" title="Play / Pause">
                ${ICONS.play}
            </button>
            <div id="ypp-gpb-time" class="ypp-gpb-time-capsule" title="Current / Total Time">
                <span class="ypp-gpb-time-cur">0:00</span>
                <span class="ypp-gpb-time-sep"></span>
                <span class="ypp-gpb-time-tot">0:00</span>
            </div>
        </div>

        <div class="ypp-gpb-divider" id="ypp-gpb-div-1"></div>

        <div class="ypp-gpb-group">
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-mute" title="Mute / Unmute">
                ${ICONS.volumeHigh}
            </button>
            <div id="ypp-gpb-vol-wrap" class="ypp-gpb-vol-wrap" title="Volume">
                <input type="range" id="ypp-gpb-vol" min="0" max="1" step="0.02" value="1" class="ypp-gpb-vol-slider">
            </div>
            <button class="ypp-gpb-btn ypp-action-btn ypp-gpb-speed-pill" id="ypp-gpb-speed" title="Video Speed (Scroll to adjust, Click to cycle)">
                <span class="ypp-gpb-speed-value" id="ypp-gpb-speed-text">1.00x</span>
            </button>
        </div>

        <div id="ypp-gpb-features-container" class="ypp-gpb-group" style="display:none;"></div>

        <div class="ypp-gpb-divider" id="ypp-gpb-div-2" style="display:none;"></div>

        <div class="ypp-gpb-group">
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-loop" title="Toggle Loop">
                ${ICONS.loop}
            </button>
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-pip" title="Picture-in-Picture">
                ${ICONS.pip}
            </button>
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-fullscreen" title="Fullscreen">
                ${ICONS.fullscreen}
            </button>
        </div>

        <div class="ypp-gpb-divider" id="ypp-gpb-div-3"></div>

        <div class="ypp-gpb-group">
            <button class="ypp-gpb-btn ypp-action-btn" id="ypp-gpb-close" title="Hide Bar">
                ${ICONS.close}
            </button>
        </div>
    </div>
`;
