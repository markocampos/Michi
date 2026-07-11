# Michi 道 - Your Path to Mindfulness

A Japanese philosophy-based daily practice app that helps you transform your life slowly through seven timeless concepts.

[![Build APK](https://github.com/YOUR_USERNAME/michi/actions/workflows/build-apk.yml/badge.svg)](https://github.com/YOUR_USERNAME/michi/actions/workflows/build-apk.yml)

## Download

Get the latest APK from [Releases](https://github.com/YOUR_USERNAME/michi/releases/latest)

## The Seven Practices

| Concept | Japanese | Description |
|---------|----------|-------------|
| **Ikigai** | 生きがい | Find your reason for being through guided reflections |
| **Wabi-sabi** | 侘寂 | Embrace imperfection with immutable journal entries |
| **Ma** | 間 | Practice breathing and meditation with guided timers |
| **Kaizen** | 改善 | Build micro-habits with 1% daily improvements |
| **Shinrin-yoku** | 森林浴 | Forest bathing with sensory awareness prompts |
| **Gaman** | 我慢 | Endure through 30/60/90-day challenges |
| **Mono no aware** | 物の哀れ | Awareness of impermanence through gratitude journaling |

## Tech Stack

- Vue 3 + Vite
- Tailwind CSS
- Capacitor (Android)
- GitHub Actions (auto-build APK)

## Development

```bash
npm install
npm run dev
```

## Build APK

```bash
npm run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`

## Philosophy

> 道は道なり - The path is the path.

Michi is built on the belief that lasting change comes not from dramatic transformation, but from small, consistent daily practices rooted in wisdom. Each of the seven practices represents a different facet of Japanese philosophy that, together, create a holistic approach to mindful living.
