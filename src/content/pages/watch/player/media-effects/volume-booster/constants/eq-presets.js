/**
 * Graphic EQ Bands & Presets
 * Contains configuration for the 10-band equalizer and default preset values.
 */

export const EQ_BANDS = [
    { label: '60',  freq: 60,    type: 'lowshelf', color: '#ffffff' },
    { label: '170', freq: 170,   type: 'peaking',  color: '#ffffff' },
    { label: '310', freq: 310,   type: 'peaking',  color: '#ffffff' },
    { label: '600', freq: 600,   type: 'peaking',  color: '#ffffff' },
    { label: '1k',  freq: 1000,  type: 'peaking',  color: '#ffffff' },
    { label: '3k',  freq: 3000,  type: 'peaking',  color: '#ffffff' },
    { label: '6k',  freq: 6000,  type: 'peaking',  color: '#ffffff' },
    { label: '10k', freq: 10000, type: 'peaking',  color: '#ffffff' },
    { label: '14k', freq: 14000, type: 'peaking',  color: '#ffffff' },
    { label: '16k', freq: 16000, type: 'highshelf',color: '#ffffff' }
];

export const EQ_PRESETS = {
    'Flat':           { eq: [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0] },
    'Bass Boost':     { eq: [ 8,  6,  4,  2,  0, -1,  0,  0,  0,  0] },
    'Vocal Enhancer': { eq: [-2, -1,  0,  2,  4,  4,  3,  2,  1,  0], compressor: { ratio: 6, threshold: -20 } },
    'Night Mode':     { eq: [ 2,  2,  0,  0,  0,  1,  1, -2, -3, -5], compressor: { ratio: 20, threshold: -35 }, volume: 1.2, mono: true, width: 0.8 },
    'Electronic':     { eq: [ 5,  4,  1,  0, -1,  1,  3,  4,  5,  6] }
};
