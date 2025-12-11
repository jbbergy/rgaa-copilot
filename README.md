# RGAA Copilot

![Firefox](https://img.shields.io/badge/Firefox-115%2B-FF7139?style=flat-square&logo=firefox-browser&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome-120%2B-4285F4?style=flat-square&logo=google-chrome&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=flat-square)

Your accessibility companion for RGAA 4.1 (Référentiel Général d'Amélioration de l'Accessibilité) compliance in Firefox and Chrome.

## Features

- ✅ **106 RGAA 4.1 criteria** - Complete coverage of French accessibility standards
- 🌍 **Bilingual support** - French and English interface
- 🎯 **Real-time auditing** - Instant accessibility analysis
- 📊 **Detailed reports** - Violation details with remediation guidance
- 📤 **Export options** - HTML, JSON, and CSV formats
- 📜 **Audit history** - Track progress over time with comparison view
- 🔒 **Privacy-first** - Zero network requests, local storage only
- ♿ **Accessible UI** - WCAG 2.1 AA compliant interface

## Browser Support

| Browser | Minimum Version | Status                  |
| ------- | --------------- | ----------------------- |
| Firefox | 115+            | ✅ Supported            |
| Chrome  | 120+            | ✅ Supported            |
| Edge    | 120+            | ✅ Supported (Chromium) |

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Run development build with hot reload
npm run dev

# Build for production
npm run build

# Build for specific browser
npm run build:firefox
npm run build:chrome
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (requires built extension)
npm run test:e2e

# Run E2E tests for specific browser
npm run test:e2e:firefox
npm run test:e2e:chrome

# Manual testing in Firefox
npm run test:manual:firefox
```

## Installation

### Firefox (Development)

1. Build the extension: `npm run build:firefox`
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `dist/firefox/manifest.json`

### Firefox (Production)

1. Download the `.xpi` file from releases
2. Navigate to `about:addons`
3. Click gear icon → "Install Add-on From File..."
4. Select the `.xpi` file

### Chrome (Development)

1. Build the extension: `npm run build:chrome`
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/chrome/` directory

### Chrome (Production)

Install from the Chrome Web Store (link pending publication)

## Architecture

```
src/
├── background/          # Service worker (Manifest V3)
├── content/
│   └── auditor/
│       ├── criteria/    # 106 RGAA criterion modules
│       ├── engine.js    # Audit orchestrator
│       └── dom-inspector.js
├── popup/
│   ├── components/      # Vue 3 components
│   └── composables/     # Vue composition functions
└── shared/
    ├── data/            # RGAA criteria definitions, i18n
    └── utils/           # Storage, messaging, exporters
```

### Technology Stack

- **UI Framework**: Vue 3.4+ with Composition API
- **Build Tool**: Vite 5+ with vite-plugin-web-extension
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Storage**: Browser local storage with JSON Patch deltas

## Documentation

- [Quick Start Guide](docs/quickstart.md)
- [Firefox Compatibility Guide](docs/FIREFOX-COMPATIBILITY.md)
- [Firefox Testing Guide](docs/FIREFOX-TESTING.md)
- [RGAA 4.1 Reference](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

[MIT License](LICENSE)

---

_Built with ♿ for accessibility professionals_
