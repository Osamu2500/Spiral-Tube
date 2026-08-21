const fs = require('fs');
let html = fs.readFileSync('src/popup/popup.html', 'utf8');

// Fix wide tiles
html = html.replace(/<div class="feature-card wide"(.*?)data-id="redirect_shorts"/g, '<div class="feature-card"$1data-id="redirect_shorts"');
html = html.replace(/<div class="feature-card wide"(.*?)data-id="enable_controls"/g, '<div class="feature-card"$1data-id="enable_controls"');
html = html.replace(/<div class="feature-card wide"(.*?)data-id="audio_only_mode"/g, '<div class="feature-card"$1data-id="audio_only_mode"');
html = html.replace(/<div class="feature-card wide"(.*?)data-id="enable_filter_bar"/g, '<div class="feature-card"$1data-id="enable_filter_bar"');
html = html.replace(/<div class="feature-card wide"(.*?)data-id="2_column_subscriptions"/g, '<div class="feature-card"$1data-id="2_column_subscriptions"');
html = html.replace(/<div class="feature-card wide"(.*?)data-id="playlist"/g, '<div class="feature-card"$1data-id="playlist"');

// Fix the logo
const oldLogo = `<div class="logo-icon spiral-tube">
            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <defs>
                <linearGradient id="spiral-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="var(--accent-primary, #ff0000)" />
                  <stop offset="100%" stop-color="var(--accent-secondary, #ff0000)" />
                </linearGradient>
              </defs>
              <rect x="2" y="5" width="20" height="14" rx="4" stroke="url(#spiral-grad)" stroke-width="2"/>
              <ellipse cx="12" cy="12" rx="6" ry="4" stroke="url(#spiral-grad)" stroke-width="1.5" opacity="0.8"/>
              <ellipse cx="12" cy="12" rx="3" ry="2" fill="url(#spiral-grad)"/>
              <polygon points="11.5 10.5 13.5 12 11.5 13.5" fill="var(--bg-primary, #111)" stroke="none"/>
            </svg>
          </div>`;

const newLogo = `<div class="logo-icon spiral-tube">
            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <defs>
                <linearGradient id="spiral-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="var(--accent-primary, #6366f1)" />
                  <stop offset="100%" stop-color="var(--accent-secondary, #a855f7)" />
                </linearGradient>
              </defs>
              <rect x="2" y="5" width="20" height="14" rx="4" stroke="url(#spiral-grad)" stroke-width="2"/>
              <path d="M 12 15 a 3 3 0 0 1 0 -6 a 3 3 0 0 0 3 -3" stroke="url(#spiral-grad)" stroke-width="1.5" />
              <path d="M 12 9 a 3 3 0 0 1 0 6 a 3 3 0 0 0 -3 3" stroke="url(#spiral-grad)" stroke-width="1.5" />
              <polygon points="11,10.5 14,12 11,13.5" fill="url(#spiral-grad)" stroke="url(#spiral-grad)" stroke-width="0.5" stroke-linejoin="round"/>
            </svg>
          </div>`;

if (html.includes(oldLogo)) {
    html = html.replace(oldLogo, newLogo);
    console.log("Logo replaced successfully!");
} else {
    console.log("Old logo not found! Might be slightly different whitespace.");
    // Try a regex to wipe whatever is inside .logo-icon.spiral-tube
    html = html.replace(/<div class="logo-icon spiral-tube">[\s\S]*?<\/div>/, newLogo);
}

fs.writeFileSync('src/popup/popup.html', html);
console.log("Fixed popup.html!");
