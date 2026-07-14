<div align="center">
  <img src="public/michi.png" width="320" alt="Michi Logo" />
  <h1>Michi 道</h1>
  <p><em>Your Path to Mindfulness</em></p>
  
  <p>
    <a href="https://github.com/markocampos/michi/actions/workflows/build-apk.yml">
      <img src="https://github.com/markocampos/michi/actions/workflows/build-apk.yml/badge.svg" alt="Build APK" />
    </a>
    <a href="https://github.com/markocampos/michi/releases/latest">
      <img src="https://img.shields.io/github/v/release/markocampos/michi?color=5B7B5E" alt="Release" />
    </a>
    <a href="https://github.com/markocampos/michi/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
    </a>
  </p>
  
  <p>
    <a href="#the-eight-practices">Practices</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#download">Download</a>
  </p>
</div>

---

## About

**Michi 道** is a Japanese philosophy-based daily practice app that helps you transform your life slowly through eight timeless concepts. Built with mindfulness at its core, Michi guides you on a journey of self-improvement through ancient wisdom adapted for modern life.

> *"The journey of a thousand miles begins with a single step."* — Lao Tzu

---

## The Eight Practices

<table>
  <tr>
    <td align="center" width="90">
      <img src="https://img.shields.io/badge/🌱-Ikigai-5B7B5E?style=for-the-badge" alt="Ikigai" />
      <br />
      <b>Ikigai</b>
      <br />
      <sub>生きがい</sub>
    </td>
    <td>Find your reason for being through guided reflections</td>
  </tr>
  <tr>
    <td align="center" width="90">
      <img src="https://img.shields.io/badge/🍂-Wabi--sabi-C4A882?style=for-the-badge" alt="Wabi-sabi" />
      <br />
      <b>Wabi-sabi</b>
      <br />
      <sub>侘寂</sub>
    </td>
    <td>Embrace imperfection with immutable journal entries</td>
  </tr>
  <tr>
    <td align="center" width="90">
      <img src="https://img.shields.io/badge/🧘-Ma-6B6B6B?style=for-the-badge" alt="Ma" />
      <br />
      <b>Ma</b>
      <br />
      <sub>間</sub>
    </td>
    <td>Practice breathing and meditation with guided timers</td>
  </tr>
  <tr>
    <td align="center" width="90">
      <img src="https://img.shields.io/badge/📈-Kaizen-B34233?style=for-the-badge" alt="Kaizen" />
      <br />
      <b>Kaizen</b>
      <br />
      <sub>改善</sub>
    </td>
    <td>Build micro-habits with 1% daily improvements</td>
  </tr>
  <tr>
    <td align="center" width="90">
      <img src="https://img.shields.io/badge/🌲-Shinrin--yoku-3D5A3F?style=for-the-badge" alt="Shinrin-yoku" />
      <br />
      <b>Shinrin-yoku</b>
      <br />
      <sub>森林浴</sub>
    </td>
    <td>Forest bathing with sensory awareness prompts</td>
  </tr>
  <tr>
    <td align="center" width="90">
      <img src="https://img.shields.io/badge/💪-Gaman-8B7355?style=for-the-badge" alt="Gaman" />
      <br />
      <b>Gaman</b>
      <br />
      <sub>我慢</sub>
    </td>
    <td>Endure through 30/60/90-day challenges</td>
  </tr>
  <tr>
    <td align="center" width="90">
      <img src="https://img.shields.io/badge/🌸-Mono no aware-E8B4CB?style=for-the-badge" alt="Mono no aware" />
      <br />
      <b>Mono no aware</b>
      <br />
      <sub>物の哀れ</sub>
    </td>
    <td>Awareness of impermanence through gratitude journaling</td>
  </tr>
  <tr>
    <td align="center" width="90">
      <img src="https://img.shields.io/badge/🔍-Hansei-4A7C6F?style=for-the-badge" alt="Hansei" />
      <br />
      <b>Hansei</b>
      <br />
      <sub>反省</sub>
    </td>
    <td>Daily self-reflection — what went well, what to improve, and what you learned</td>
  </tr>
</table>

---

## Features

| Feature | Description |
|---|---|
| **PIN Lock** | Protect your journal with a 4-digit PIN code |
| **Mood Card** | Home page shows your mood based on daily practice activity |
| **Growth Dashboard** | Progress bars, heatmap, and breakdown for all 8 practices |
| **Search & Filter** | Find practices and journal entries quickly |
| **Streak Tracking** | Daily streak counter with milestone celebrations (7, 30, 100 days) |
| **Pull-to-Refresh** | Swipe down to refresh data on Home, Growth, and Journal |
| **Swipe Navigation** | Swipe left/right between main tabs on mobile |
| **Onboarding** | Guided first-launch experience introducing all 8 concepts |
| **Notifications** | Daily practice reminders and streak milestone alerts |
| **Data Export/Import** | Backup and restore your journal data as JSON |
| **Update Checker** | Settings checks GitHub for new versions |
| **Bug Reporting** | One-tap bug report form in Settings |

---

## Tech Stack

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js_3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor_8-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)

</div>

| Layer | Technology |
|---|---|
| Frontend Framework | Vue 3 (Composition API, `<script setup>`) |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Icons | Iconify for Vue (`@iconify/vue`) |
| Routing | Vue Router 4 |
| Mobile Runtime | Capacitor 8 |
| Storage (native) | Capacitor SQLite (`@capacitor-community/sqlite`) |
| Storage (web) | `localStorage` with reactive sync |
| Target Platform | Android (APK) |

---

## Architecture

```
src/
├── App.vue                  # Root with swipe nav, transitions, settings gear
├── main.js                  # App entry, loading screen, store init
├── router/index.js          # Routes + PIN guard
├── views/
│   ├── HomeView.vue         # Dashboard: mood, progress ring, streak, quotes
│   ├── PracticesView.vue    # Practice cards with search & category filters
│   ├── PracticeDetail.vue   # Individual practice router (lazy loaded)
│   ├── JournalView.vue      # Cross-practice journal with search
│   ├── GrowthView.vue       # All 8 practices: progress, heatmap, mood
│   ├── SettingsView.vue     # PIN, notifications, export/import, changelog, bug report
│   ├── OnboardingView.vue   # 4-step first-launch flow
│   └── PinView.vue          # PIN setup and entry screen
├── practices/               # One component per practice (all lazy loaded)
│   ├── IkigaiPractice.vue
│   ├── WabiSabiPractice.vue
│   ├── MaPractice.vue
│   ├── KaizenPractice.vue
│   ├── ShinrinYokuPractice.vue
│   ├── GamanPractice.vue
│   ├── MonoNoAwarePractice.vue
│   └── HanseiPractice.vue
├── components/
│   ├── BottomNav.vue        # Mobile bottom nav + desktop sidebar
│   ├── PracticeCard.vue     # Card used in PracticesView
│   ├── ProgressRing.vue     # SVG circular progress with glow
│   └── QuoteCard.vue        # Daily inspirational quote
├── composables/
│   ├── useStorage.js        # Reactive localStorage + SQLite sync
│   ├── useTimer.js          # Meditation timer
│   ├── useQuote.js          # Daily quote rotation
│   ├── useNotifications.js  # Web Notifications API
│   ├── usePullToRefresh.js  # Pull-to-refresh gesture
│   └── useSwipeNavigation.js # Horizontal swipe between tabs
├── utils/
│   ├── dates.js             # Date helpers (getToday, formatDate, etc.)
│   ├── streaks.js           # Streak calculation logic
│   ├── storage-keys.js      # Centralized storage key constants
│   └── charts.js            # Chart data computation
└── data/
    ├── practices.js         # Practice definitions
    ├── prompts.js           # Reflection prompts & challenges
    └── quotes.js            # Inspirational quotes
```

---

## Download

<div align="center">

**Get the latest APK**

[<img src="https://img.shields.io/badge/Download-5B7B5E?style=for-the-badge&logo=android&logoColor=white" />](https://github.com/markocampos/michi/releases/latest)

</div>

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for mobile builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/markocampos/michi.git
cd michi

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev             # Start Vite dev server (network accessible)
npm run build           # Build web app for production
npm run preview         # Preview production build locally
npm run start:server    # Start the local Express API server (port 3000)
npm run icons           # Generate PWA icons
npm run icons:android   # Generate Android launcher icons
```

### Build for Android

```bash
# Build the web app
npm run build

# Add Android platform (first time only)
npx cap add android

# Sync web assets to Android
npx cap sync android

# Build debug APK
cd android && ./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Data & Storage

Michi uses a **dual-storage strategy** to persist your data:

- **Web (browser/PWA):** Data is stored in `localStorage` via a reactive global store (`useStorage` composable).
- **Android (native):** On native platforms, data is additionally synced to a local **SQLite database** using `@capacitor-community/sqlite`, with debounced writes for performance.

---

## Changelog

### v1.0.1 (Current)
- PIN lock for journal privacy
- Growth page with all 8 practices, progress bars, heatmap
- Mood card on home page
- Pull-to-refresh on Home, Growth, Journal
- Swipe navigation between tabs
- Onboarding flow for new users
- Practice search and category filters
- Streak milestones (7, 30, 100 days)
- Notification reminders and streak alerts
- Update checker and bug report link in Settings
- Dark mode removed for cleaner experience

### v1.0.0
- Initial release with 8 Japanese philosophy practices
- Journal with search and filters
- Daily progress tracking and streak counter
- Data export and import

---

## Philosophy

<div align="center">

> **道は道なり**
> 
> *The path is the path.*

</div>

Michi is built on the belief that lasting change comes not from dramatic transformation, but from small, consistent daily practices rooted in wisdom. Each of the eight practices represents a different facet of Japanese philosophy that, together, create a holistic approach to mindful living.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with 🧘 for mindful living**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/markocampos/michi)

</div>
