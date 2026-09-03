export const GRID = {
        DESKTOP_COLUMNS: 4,
        ITEM_GAP: 16,
        ROW_GAP: 32,
        MIN_ITEM_WIDTH: 280,
        RESPONSIVE_BREAKPOINTS: {
            LARGE: 1600,
            MEDIUM: 1200,
            SMALL: 900,
            MOBILE: 640
        }
    };

export const TIMINGS = {
        // Waits and Timeouts
        ELEMENT_WAIT_DEFAULT: 10000,
        TOAST_DISPLAY: 3000,
        TOAST_FADE: 300,

        // Polling and Intervals
        AD_SKIPPER_INTERVAL: 500,
        PLAYER_TOOLS_INTERVAL: 1000,
        SHORTS_CHECK_INTERVAL: 500,
        STUDY_ENFORCE_INTERVAL: 5000,

        // Debounce Delays
        DEBOUNCE_DEFAULT: 50,
        DEBOUNCE_SEARCH: 500,
        DEBOUNCE_RESIZE: 150,
        DEBOUNCE_NAVIGATION: 200,

        // Animation
        TRANSITION_FAST: 150,
        TRANSITION_MEDIUM: 300,
        TRANSITION_SLOW: 500,

        // Ad Skipper
        AD_PLAYBACK_SPEED: 16
    };

export const STUDY = {
        DEFAULT_SPEED: 1.25,
        MIN_SPEED: 0.1,
        MAX_SPEED: 5.0,
        SPEED_STEP: 0.1
    };

export const PLAYER = {
        SPEED_MIN: 0.1,
        SPEED_MAX: 5.0,
        SPEED_STEP: 0.1,
        FILTER_MIN: 50,
        FILTER_MAX: 200,
        FILTER_DEFAULT: 100
    };

export const AMBIENT = {
        FPS: 10,
        SAMPLE_STEP: 10,
        GLOW_SIZE: 150,
        GLOW_BLUR: 30,
        OPACITY: 0.5,
        CANVAS_SIZE: 50
    };

export const THUMBNAIL = {
        ASPECT_RATIO: '16/9',
        BORDER_RADIUS: '12px'
    };

export const TYPOGRAPHY = {
        TITLE_FONT_SIZE: '1.6rem',
        TITLE_LINE_HEIGHT: '2.2rem',
        TITLE_MAX_LINES: 2,
        METADATA_FONT_SIZE: '1.3rem'
    };
