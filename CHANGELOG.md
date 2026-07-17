# Changelog

All notable changes to **Michi 道** are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.1.4] — July 2026

### Added
- **Desktop & Tablet Layout**: Fully redesigned responsive grid layout that gracefully expands to 1440px wide monitors.
- **Left Sidebar**: Navigation transforms into a sleek, frosted-glass left sidebar on larger screens.
- **Responsive Dashboards**: Practice and Growth dashboards now use 3 and 4 column grids on large displays.
- **Daily Reflections**: Added 400 deep philosophical prompts across all 8 practices.
- **Quote Copy**: Added a quick copy-to-clipboard button on all daily quotes.

### Fixed
- **Swipe Transitions**: Rebuilt page transitions to use CSS grid overlapping and instant scroll resetting, entirely eliminating height collapse glitches on Android and making swiping 2x faster (0.15s).
- **Navigation Stability**: Prevented native browser edge-swiping from interfering with app navigation, and locked root overflow to prevent horizontal scrollbars from causing UI jitter during swipes.
- **Level 501 Bug**: Fixed a math glitch that accidentally granted absolute enlightenment (Level 501) to users who had 0 XP.
- **Layout Glitches**: Fixed bottom spacing, padding gaps, and sidebar cutoff glitches on the desktop layout.
- **Journal UI**: Cleaned up the mobile view by removing the redundant Hansei filter tab.

---

## [v1.0.3] — July 2026

### Added
- **Streamlined Android Build**: CI workflow now automates APK signing with a release keystore.
- **Strict CI Checks**: Added build checks for leftover `console.log` statements, merge conflict markers, and malformed JSON.
- **Dependency Cleanup**: Removed unused backend server dependencies (`express`, `sqlite3`, etc.) for a cleaner package footprint.

### Fixed
- **Complete Data Wipe**: Resetting the app now completely clears the SQLite backend store as well as local storage, preventing "zombie data" from reappearing.
- **Manifest Description**: Updated manifest description to accurately reflect all eight timeless concepts instead of seven.
- **Auto-Backup Removal**: Removed silent auto-backup feature due to Android 11+ scoped storage restrictions (manual JSON Export remains available).

### Security
- **PIN hashing**: PINs are now cryptographically hashed (SHA-256) instead of being stored in plain text, with automatic migration for legacy PINs.

---

## [v1.0.2] — July 2026

### Added
- **Complete Growth Page Overhaul**: Transformed the Growth tab into a gamified, beautiful experience.
- **Zen Journey XP Progression**: Your habits, journal entries, and meditation sessions now earn permanent XP. You will grow through stages: Seed (種) → Sprout (芽) → Sapling (若木) → Bamboo (竹) → Zen Garden (庭園).
- **Activity Calendar Heatmap**: Redesigned the consistency heatmap into a true 4-week calendar grid perfectly aligned to Sunday-Saturday.
- **Weekly Trend Comparison**: Automatically compares your last 7 days of activity against the previous week.
- **Silent Auto-Backup**: Automatically saves a background backup to your phone's public Documents folder that survives uninstalls, ensuring you never lose data.
- **XP Info Modal**: Added a helpful guide explaining how permanent XP works versus the temporary streak bonus.
- **Journal Insights (Naikan • 内省)**: A completely redesigned sentiment analysis modal featuring Japanese Zen aesthetics, dynamic Morita therapy quotes, and tracking of "gray words" (neutral stillness).
- **Expanded sentiment dictionary**: Added 150+ new words across positive, negative, and neutral spectrums for more accurate, nuanced reflection analysis.
- **Hansei in Journal**: End-of-day reflections (Hansei) now successfully appear in your unified Journal feed alongside Wabi-sabi, Ikigai, and Mono no aware.
- PIN lock now only guards the Journal page — all other pages remain freely accessible
- PIN session clears automatically when leaving the Journal tab
- Full **Change PIN** flow: verify current PIN → enter new PIN → confirm new PIN
- **Hardened data deletion** — "Delete All Data" now requires PIN entry (if set) + typing `DELETE MY DATA`

### Fixed
- Fixed a timezone bug that caused the Activity Calendar to occasionally ask for "yesterday's" data in eastern timezones, causing empty squares despite having completed practices.
- Journal entries cleanly format multi-prompt practices (Ikigai, Hansei) using elegant bullet points and line breaks instead of raw pipe characters (`|`).
- Fixed a bug where Ikigai's combined summary string caused words to be counted twice in the sentiment analysis logic.
- Fixed a bug where the Journal Insights logic accidentally analyzed structural UI labels ("• Love:", "• Good At:"), inflating the positive mood score.
- Fixed z-index and Teleport issues causing the Journal Insights and What's New modals to render beneath the bottom navigation bar.
- Bottom nav backdrop blur added so content scrolling behind it is properly frosted
- Settings gear icon respects device status bar / notch safe-area inset (`env(safe-area-inset-top)`)
- Content no longer hidden behind the bottom navigation bar on mobile (`pb-nav` with safe area)
- `lucide:nose` icon (invalid) replaced with `lucide:cloud` in Shinrin-yoku practice
- Meditation timer circle no longer overflows on narrow phones (iPhone SE)
- Kaizen 7-day habit tracker no longer overflows on narrow screens (`min-w-0`, `overflow-hidden`)
- Onboarding step 1 practice list is now scrollable on small phones (`max-h-[55vh]`)
- PracticeCard and flex layouts use `min-w-0` to prevent text overflow
- `touch-action: manipulation` added globally to prevent accidental double-tap zoom
- Vue Transition warning in SettingsView fixed (single root node — modal moved inside root div)
- PinView template structure corrected (mismatched / extra closing div tags)

### Security
- **Disabling PIN** now requires entering your current PIN + typing `DISABLE` — no one-click bypass
- **Forgot PIN** button removed from the lock screen entirely — PIN management is Settings-only
- Wrong PIN entry triggers a red shake animation instead of a silent fail
- Data reset requires current PIN (if set) + typing `DELETE MY DATA` before anything is deleted

---

## [v1.0.1] — July 2026

### Added
- **PIN lock** — protect your journal with a 4-digit PIN code
- **Growth page** — practice breakdown, activity heatmap (last 28 days), and progress bars per practice
- **Mood card** on Home — dynamic emoji + message based on today's activity and streak
- **Pull-to-refresh** on Home, Journal, and Growth views
- **Swipe navigation** — swipe left/right to switch between the four main tabs
- **Onboarding flow** — guided welcome screen for new users showing all eight practices
- **Practice search** — full-text search across practice name, Japanese name, and description
- **Category filters** — filter practices by Reflection, Activity, or Tracking
- **Streak milestones** — special notifications at 7, 30, and 100 consecutive days
- **Notification reminders** — daily push notification at a user-chosen time
- **Bug report link** — direct link to feedback form in Settings

### Fixed
- Page transition animations (slide-left / slide-right / fade) corrected for all routes
- Accessibility improvements — ARIA labels, focus rings, skip-nav link

---

## [v1.0.0] — July 2026

### Added
- **Eight Japanese philosophy practices:**
  - 生きがい **Ikigai** — discover your reason for being through guided reflection
  - 侘寂 **Wabi-sabi** — capture moments of imperfect beauty
  - 間 **Ma** — timed meditation sessions (2, 5, 10, 15 minutes)
  - 改善 **Kaizen** — micro-habits with a 7-day completion tracker
  - 森林浴 **Shinrin-yoku** — forest bathing walks with sensory notes
  - 我慢 **Gaman** — long-term endurance challenges with progress tracking
  - 反省 **Hansei** — end-of-day self-reflection (what went well / to improve / learned)
  - 物の哀れ **Mono no aware** — gratitude and impermanence journaling
- **Journal** — unified view of all written entries; searchable and filterable by type
- **Daily progress ring** — tracks how many of the 8 practices were completed today
- **Streak counter** — consecutive days with at least one practice completed
- **Data export** — download all data as a JSON backup file
- **Data import** — restore from a JSON backup file
- **Bottom navigation** (mobile) and **right sidebar** (desktop) with smooth active indicators
- **Page transition animations** — slide left/right between tabs, fade for other routes
- **Responsive layout** — mobile-first with desktop grid at lg breakpoint
- **Glassmorphism UI** — frosted glass cards, warm off-white palette, forest green accents
- **Japanese typography aesthetic** — Outfit font, kanji labels throughout

---

[v1.1.4]: https://github.com/markocampos/Michi/releases/tag/v1.1.4
[v1.0.3]: https://github.com/markocampos/Michi/releases/tag/v1.0.3
[v1.0.2]: https://github.com/markocampos/Michi/releases/tag/v1.0.2
[v1.0.1]: https://github.com/markocampos/Michi/releases/tag/v1.0.1
