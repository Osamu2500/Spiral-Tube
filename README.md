# Spiral Tube 🎬 (formerly YouTube Premium Plus)

> Transform YouTube with 50+ features: glassmorphism themes, 600% volume booster with custom EQ, cinema filters, SponsorBlock integration, focus & zen modes, custom speed controller, ambient mode, screenshot tool, subscription groups, watch history analytics, and a redesigned glassmorphic popup UI.

[![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://github.com/Osamu2500/youtube-premium-extension)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success)]()
[![Version](https://img.shields.io/badge/version-2.3.0-blue)]()
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

---

## ✨ What's New? (Latest Features)

- 🫧 **Frutiger Aero Theme**: Nostalgic, bouncing bubbles background with fresh UI text styles.
- 🖱️ **Custom Cursors**: A new masonry grid UI to pick and choose your favorite cursors.
- 👍 **AutoLike Integration**: Automatically like videos to support creators without the extra clicks.
- ☑️ **Multi-Select & Queue Support**: Advanced multi-select UI with Save to Playlist automation.
- ⏱️ **Playlist Duration Calculator**: See exactly how much time a playlist will take to finish.
- 🎛️ **Cinematic Filters & Pro Equalizer**: Next-level audio-visual control housed within our new Liquid Glass interface.
- ⏭️ **SponsorBlock Integration**: Seamlessly skip sponsorships, intros, and other filler content automatically.
- 🪟 **Immersive Ambient Mode**: Extends Ambient lighting to cover the entire page behind the masthead.
- 📥 **SmartDownload**: A quick download button neatly integrated into the player UI.
- 📊 **ChannelHealthUI**: In-depth analytics for watch history and channel health.

## 📊 Extension Architecture

[![Extension Architecture](https://quickchart.io/graphviz?graph=digraph%20G%20%7B%20node%20%5Bshape%3Dbox%2C%20style%3Dfilled%2C%20color%3D%22%234BC0C0%22%2C%20fontcolor%3Dwhite%2C%20fontname%3D%22Arial%22%5D%3B%20rankdir%3DTB%3B%20A%20%5Blabel%3D%22Spiral%20Tube%20Extension%22%5D%3B%20B%20%5Blabel%3D%22Background%20Service%20Worker%22%5D%3B%20C%20%5Blabel%3D%22Content%20Scripts%22%5D%3B%20D%20%5Blabel%3D%22Popup%20UI%20(Liquid%20Glass)%22%5D%3B%20E%20%5Blabel%3D%22Chrome%20Storage%20Sync%22%2C%20shape%3Dcylinder%2C%20color%3D%22%23FF6384%22%5D%3B%20F%20%5Blabel%3D%22Alarms%20%26%20Notifications%22%2C%20color%3D%22%2336A2EB%22%5D%3B%20G%20%5Blabel%3D%22MutationObserver%20SPA%20Handling%22%5D%3B%20I%20%5Blabel%3D%22UI%20Themes%22%5D%3B%20J%20%5Blabel%3D%22Player%20Enhancements%22%5D%3B%20K%20%5Blabel%3D%22Custom%20Elements%22%5D%3B%20L%20%5Blabel%3D%22Settings%20Management%22%5D%3B%20A%20-%3E%20B%3B%20A%20-%3E%20C%3B%20A%20-%3E%20D%3B%20B%20-%3E%20E%3B%20B%20-%3E%20F%3B%20C%20-%3E%20G%3B%20G%20-%3E%20I%3B%20G%20-%3E%20J%3B%20G%20-%3E%20K%3B%20D%20-%3E%20L%3B%20L%20-%3E%20E%3B%20%7D)](https://quickchart.io)

### Feature Distribution Overview

[![Feature Distribution](https://quickchart.io/chart?c=%7Btype%3A%27outlabeledPie%27%2Cdata%3A%7Blabels%3A%5B%27Themes%20%26%20UI%27%2C%27Player%20Enhancements%27%2C%27Productivity%27%2C%27Navigation%27%2C%27Integrations%27%5D%2Cdatasets%3A%5B%7BbackgroundColor%3A%5B%27%23FF6384%27%2C%27%2336A2EB%27%2C%27%23FFCE56%27%2C%27%234BC0C0%27%2C%27%239966FF%27%5D%2Cdata%3A%5B35%2C25%2C15%2C15%2C10%5D%7D%5D%7D%2Coptions%3A%7Bplugins%3A%7Blegend%3Afalse%2Coutlabels%3A%7Btext%3A%27%25l%20%25p%27%2Ccolor%3A%27white%27%2Cstretch%3A35%2Cfont%3A%7Bresizable%3Atrue%2CminSize%3A12%2CmaxSize%3A18%7D%7D%7D%7D%7D)](https://quickchart.io)

---

## 🚀 Feature Categories

### 🎨 Theme & UI
- **Premium Liquid Glass & Frutiger Aero Themes** - Deep translucent backgrounds layered with dynamic, animated radial color gradients or nostalgic bouncing bubbles.
- **True Black Mode** - OLED-friendly pure black backgrounds.
- **Redesigned Liquid Glass Popup** - Premium glowing interface with grid layout and spring animations.
- **Hide Scrollbar** - Clean, minimal interface.

### 🎛️ Customization Suite
- **Typography & Font Scaling** - Select from Inter, System Defaults, Monospace, and customize font sizes.
- **Dynamic Layout Density** - Adjust margins dynamically (Compact, Comfortable, Spacious grids).
- **Accents & Card Styles** - Change UI themes to flat, elevated, or glassmorphic, and replace Youtube's default red color.
- **Custom Cursors** - Personalize your pointer across all of YouTube.

### ▶️ Player Enhancements
- **Pro Equalizer & Volume Booster** - Boost audio up to 600% with persistent custom EQ, balance, and compressor settings.
- **Cinema Filters** - Brightness, contrast, and saturation controls.
- **Custom Speed Control** - Precise playback speed input.
- **Auto-Quality** - Force 1080p+ quality on all videos.
- **Remaining Time** - Show time left instead of elapsed time.
- **Snapshot & Loop Tools** - Take screenshots of the current frame and loop videos with one click.
- **Global Player Bar** - Decoupled external player bar for ultimate control.

### 🏠 Home Feed & Search Control
- **Hook-Free Home** - Completely hide the recommended feed.
- **Hide Watched** - Auto-hide videos you've already watched (>80% progress).
- **Grid Layouts** - Force 4x4 video grid display for home and search results.
- **Clean Search** - Hide "For You", Shorts, and "People also watched" suggestions.

### 🧭 Navigation & Distraction Control
- **Focus Modes** - Zen Mode, Study Mode (auto 1.25x speed), and Auto Cinema.
- **Custom Header Buttons** - Quick access to Trending, Shorts, Subscriptions, Watch Later.
- **Hide Comments & End Screens** - Total control over your viewing distractions.

---

## 📦 Installation

> [!IMPORTANT]
> This extension **requires a build step** before it can be loaded. The source files in `src/` are bundled by Vite into `dist/` — Chrome loads the built output, not the raw source.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Osamu2500/youtube-premium-extension.git
   cd youtube-premium-extension
   ```

2. **Install dependencies and build**
   ```bash
   npm install
   npm run build
   ```

3. **Load in Chrome**
   - Open Chrome → `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the **root** `youtube-premium-extension/` folder.

## 🏗️ Development Architecture

```
src/
├── background/         # Service worker
├── content/
│   ├── features/      # Individual feature modules (e.g. autolike.js, multiselect.js)
│   ├── themes/        # Frutiger Aero, Liquid Glass, Retro, Vintage
│   ├── ui-styles/     # Custom Cursors, Navigation, Overrides
│   ├── feature-manager.js  
│   └── styles.css         
├── popup/             # Extension popup UI (Liquid Glass)
└── assets/            # Icons and images
```

## 🤝 Contributing
Contributions are welcome! Please follow the standard fork, branch, commit, and PR workflow. Test thoroughly on YouTube since it acts as a dynamic SPA.

## 📝 License
This project is licensed under a Proprietary License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer
This extension is not affiliated with, endorsed by, or in any way officially connected with YouTube or Google LLC. It's a community project designed to enhance the user experience.
