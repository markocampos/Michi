# Contributing to Michi 道

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Make your changes
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## Project Structure

```
src/
├── views/          # Page-level views
├── practices/      # One component per practice
├── components/     # Shared UI components
├── composables/    # Reusable logic
├── utils/          # Utility functions
└── data/           # Static data (practices, prompts, quotes)
```

## Code Style

- Use Vue 3 Composition API with `<script setup>`
- Use Tailwind CSS utility classes (no inline styles)
- Use Iconify icons (`<Icon icon="lucide:icon-name" />`)
- Keep components focused — one component per file
- Use `useStorage` composable for data persistence

## Commit Messages

- Use clear, descriptive commit messages
- Start with a verb: `Add`, `Fix`, `Update`, `Remove`
- Reference issues when applicable: `Fix #123`

## Pull Requests

- Keep PRs focused on one change
- Update README.md if adding features
- Test on mobile and desktop
- Ensure `npm run build` passes

## Reporting Bugs

Use the [bug report form](https://docs.google.com/forms/d/e/1FAIpQLSepq23K7zdpna7vnVNf33DTmARZIvwApHiDxvDU7OFXk6T0fA/viewform?usp=header) in the app or open a GitHub issue.

## Code of Conduct

Be respectful and constructive. We're all here to build something meaningful.
