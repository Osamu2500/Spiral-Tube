# Spiral Tube 🎬 (formerly YouTube Premium Plus)

> Transform YouTube with 50+ features: glassmorphism themes, 600% volume booster with custom EQ, cinema filters, SponsorBlock integration, focus & zen modes, custom speed controller, ambient mode, screenshot tool, subscription groups, watch history analytics, and a redesigned glassmorphic popup UI.

[![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://github.com/Osamu2500/youtube-premium-extension)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success)]()
[![Version](https://img.shields.io/badge/version-2.3.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📸 Visual Showcase

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Liquid+Glass+Popup+Preview" alt="Liquid Glass Popup UI" width="800">
  <p><i>The completely redesigned Liquid Glass settings panel.</i></p>
</div>

<details>
<summary><b>🖼️ View More Screenshots</b></summary>
<br>

| Theming Engine | Player Enhancements | Masonry Cursor Grid |
|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/250x150?text=Frutiger+Aero+Theme" alt="Theme"> | <img src="https://via.placeholder.com/250x150?text=600%25+Volume+Booster" alt="EQ"> | <img src="https://via.placeholder.com/250x150?text=Custom+Cursors" alt="Cursors"> |

</details>

---

## 🏗️ Extension Architecture & Lifecycle

<details open>
<summary><b>🔍 1. Architecture Flowchart (Interactive)</b></summary>
<br>

```mermaid
graph TD
    classDef primary fill:#4f46e5,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef secondary fill:#0ea5e9,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef accent fill:#e11d48,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef dark fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#fff,rx:8px,ry:8px
    classDef feature fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff,rx:8px,ry:8px

    A[🌀 Spiral Tube Extension v2.3.0]:::primary --> B[Background Service Worker]:::secondary
    A --> C[Content Scripts Core]:::secondary
    A --> D[Popup UI - Liquid Glass]:::secondary
    
    B --> B1[SponsorBlock API Bridge]:::dark
    B --> B2[Chrome Storage Sync]:::accent
    
    C --> G[MutationObserver SPA Engine]:::dark
    G --> I[🎨 Themes Controller]:::feature
    G --> J[▶️ Player Enhancements]:::feature
    G --> K[✨ Custom DOM Overrides]:::feature
    G --> M[⚡ Automation Engine]:::feature
```
</details>

<details>
<summary><b>🔄 2. Real-Time State Sync (Sequence Diagram)</b></summary>
<br>

```mermaid
sequenceDiagram
    actor User
    participant Popup as Liquid Glass Popup
    participant Storage as Chrome Storage Sync
    participant Worker as Background Service Worker
    participant Content as Content Scripts (YouTube DOM)

    User->>Popup: Toggles 'Frutiger Aero' Theme
    Popup->>Storage: chrome.storage.sync.set({ theme: 'frutiger-aero' })
    Storage-->>Worker: Storage change event fired
    Worker->>Content: sendMessage(ACTION_UPDATE_STATE)
    Content->>Content: MutationObserver detects config refresh
    Content->>Content: Hot-Swap CSS classes & inject dynamic canvas
    Content-->>User: UI updates in real-time instantly without refresh
```
</details>

<details>
<summary><b>🗺️ 3. User Execution Journey (State Map)</b></summary>
<br>

```mermaid
stateDiagram-v2
    [*] --> YouTube_Loaded
    YouTube_Loaded --> Bootstrapping: Content Script Inject
    
    state Bootstrapping {
        ReadStorage --> InjectBaseCSS
        InjectBaseCSS --> AttachMutationObservers
    }
    
    Bootstrapping --> SPA_Idle
    
    SPA_Idle --> Navigate: User clicks video
    Navigate --> RebindHooks: ytd-navigate-finish event
    RebindHooks --> PlayerEnhancements: Apply EQ, Cinema Filters
    RebindHooks --> Automation: Check AutoLike, SponsorBlock
    
    PlayerEnhancements --> SPA_Idle
```
</details>

---

## 📈 The Ultimate Feature Matrix

### 🎨 Themes & UI Customization
| Component | Description | Performance Cost | Highlight Feature |
|:---|:---|:---:|:---|
| **8+ Immersive Themes** | High-fidelity glowing, aero, and OLED black themes. | `Medium` | *Liquid Glass, True Black* |
| **Typography Engine** | Overwrite fonts across the site, adjust dynamic scaling. | `Low` | *Inter / Monospace overrides* |
| **Layout Density** | Force Compact, Comfortable, or Spacious grid margins. | `Low` | *Spacious Grids* |

### ▶️ Player Overhaul
| Component | Description | Performance Cost | Highlight Feature |
|:---|:---|:---:|:---|
| **Pro Audio DSP** | Bypasses default limits with full EQ, compressor, balance. | `Medium` | *600% Volume Booster* |
| **Cinematic Visuals** | Hardware-accelerated CSS filters applied to video. | `High` | *Brightness/Contrast sliders* |
| **Global Player Bar** | Decoupled UI bar injected everywhere for immediate control. | `Low` | *Snapshot & Looping Tools* |

### ⚡ Automation & Analytics
| Component | Description | Performance Cost | Highlight Feature |
|:---|:---|:---:|:---|
| **AutoLike Service** | Silently likes videos of subscribed creators. | `Low` | *Configurable triggers* |
| **Multi-Select Matrix** | Overhauls standard lists into actionable macro queues. | `High` | *"Save to Playlist" macros* |
| **ChannelHealthUI** | Analytics dashboard overlay for advanced statistics. | `Medium` | *Watch-time tracking* |

### 🧭 Navigation & Integrations
| Component | Description | Performance Cost | Highlight Feature |
|:---|:---|:---:|:---|
| **Focus Modes** | Removes addictive hooks like Shorts and Recommended feeds. | `Medium` | *Zen Mode* |
| **Custom Overrides** | Replaces default headers/sidebars with glass variants. | `Low` | *Custom Masonry Cursors* |
| **SponsorBlock** | Skips baked-in sponsorships via community database API. | `Medium` | *Zero-click ad skipping* |

---

## ⚙️ Tech Stack & Performance Insights

Spiral Tube is engineered for maximum performance within YouTube's heavy Single Page Application (SPA).

- **Architecture Layer**: Built modularly utilizing ES Modules, completely dropping legacy spaghetti scripts.
- **SPA Routing**: YouTube dynamically updates without reloading. Spiral Tube heavily utilizes optimized `MutationObservers` coupled with strict debounce/throttle limits to ensure constant 60FPS UI rendering.
- **Audio Pipeline**: Leverages the Web Audio API context directly bridging to YouTube's `<video>` tag, ensuring zero-latency compression and volume boosting.
- **UI Framework**: Native Vanilla JS with a custom built `popup-schema.js` runtime rendering engine that hot-builds settings UI dynamically.

## 📦 Installation

> [!IMPORTANT]
> This extension **requires a build step** before it can be loaded. Source files in `src/` are bundled by Vite into `dist/`.

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
   - Open `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the root directory.

## 🗺️ Roadmap
- [ ] Custom Video Player UI Skins
- [ ] WebGL based Audio Visualizers natively on the player
- [ ] Exportable/Shareable theme configurations
- [ ] More robust Analytics and History mapping

## 🤝 Contributing & License
Contributions are welcome! Please follow standard PR workflows and test heavily on YouTube due to frequent A/B testing variations.
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
