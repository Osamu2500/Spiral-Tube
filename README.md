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

<details open>
<summary><b>🔍 Click to Expand Architecture Flowchart</b> (Interactive)</summary>
<br>

```mermaid
graph TD
    classDef primary fill:#4f46e5,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef secondary fill:#0ea5e9,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef accent fill:#e11d48,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef dark fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#fff,rx:8px,ry:8px

    A[🌀 Spiral Tube Extension]:::primary --> B[Background Service Worker]:::secondary
    A --> C[Content Scripts]:::secondary
    A --> D[Popup UI - Liquid Glass]:::secondary
    
    B --> E[(Chrome Storage Sync)]:::accent
    B --> F[Alarms & Notifications]:::dark
    
    C --> G[MutationObserver SPA Handling]:::dark
    G --> I[🎨 UI Themes: Frutiger Aero, Vintage]:::secondary
    G --> J[▶️ Player Enhancements]:::secondary
    G --> K[✨ Custom Elements]:::secondary
    
    D --> L[⚙️ Settings Management]:::dark
    L --> E
```
</details>

### 📈 Feature Distribution Overview

| Category | Distribution | Description | Highlight Feature |
|:---|:---:|:---|:---|
| 🎨 **Themes & UI** | **35%** | Deep translucent backgrounds, animations, and custom CSS | *Frutiger Aero Theme* |
| ▶️ **Player Enhancements** | **25%** | Audio EQ, custom speeds, auto-quality, cinema filters | *600% Volume Booster* |
| ⚡ **Productivity** | **15%** | Time-saving macros and automation | *Multi-Select & AutoLike* |
| 🧭 **Navigation** | **15%** | Distraction-free modes, zen mode, sidebar replacement | *Zen Mode* |
| 🔗 **Integrations** | **10%** | Third-party analytics and data integration | *SponsorBlock* |

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
