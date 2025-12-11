# RGAA Auditor - AI Coding Agent Guide

## Project Overview

Cross-browser WebExtension (Manifest V3) that audits web pages against **RGAA 4.1.2** (French government accessibility standard). Implements 106 automated accessibility criteria checks with Vue 3 popup UI, differential storage engine, and bilingual support (fr/en). **Fully compatible with Firefox 115+ and Chrome 120+**.

## Architecture

### Three-Component System

1. **Content Script** ([src/content/content-script.js](src/content/content-script.js)) - Injected into all pages, runs audits via `runAudit()` from engine
2. **Background Service Worker** ([src/background/service-worker.js](src/background/service-worker.js)) - Minimal, uses `webextension-polyfill` for cross-browser compatibility
3. **Popup UI** ([src/popup/](src/popup/)) - Vue 3 with Composition API, communicates with content script

### Browser Compatibility (Critical!)

- **ALWAYS use** `import browser from "webextension-polyfill"` - NEVER use `chrome.*` directly
- Manifest generated dynamically per browser in [vite.config.js](vite.config.js):
  - Firefox: `background.scripts` array
  - Chrome: `background.service_worker` string
- Build commands: `npm run build:firefox` and `npm run build:chrome`
- See [FIREFOX-COMPATIBILITY.md](docs/FIREFOX-COMPATIBILITY.md) for details

### Message Flow (Critical!)

- **Popup → Content**: Use `sendToContentScript()` with `MessageTypes.START_AUDIT`
- **Content → Popup**: Use `sendToPopup()` with `MessageTypes.AUDIT_PROGRESS` or `AUDIT_COMPLETE`
- Always handle async responses with `sendResponse()` - see [messaging.js](src/shared/utils/messaging.js#L88-L96)
- Content script must return promises or `true` to keep message channel open

### Criteria Implementation Pattern

Each criterion in [src/content/auditor/criteria/](src/content/auditor/criteria/) follows this structure:

```javascript
export async function checkCriterion11() {
  const violations = []
  const elements = getElementsByTypeDeep("img").filter(isVisible)

  // Analyze elements...

  return {
    criterionId: "1.1",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100), // Always limit to 100
    explanation: { fr: "...", en: "..." }
  }
}
```

- Use `getElementsByTypeDeep()` to traverse Shadow DOM
- Filter with `isVisible()` from [dom-inspector.js](src/content/auditor/dom-inspector.js)
- Bilingual messages required (`fr`/`en` objects)
- Violations contain: `element` (CSS selector), `html`, `message`, `remediation`

### Differential Storage Engine

[storage.js](src/shared/utils/storage.js) uses JSON Patch (RFC 6902) for efficiency:

- First audit for URL = full baseline stored
- Subsequent audits = only deltas stored (computed by [diff-engine.js](src/shared/utils/diff-engine.js))
- Max 10 audits per URL before cleanup
- Storage quota checked at 80% threshold

## Development Workflow

### Build & Test Commands

```bash
npm run dev              # Vite dev mode with HMR
npm run build:firefox    # Production build for Firefox
npm run build:chrome     # Production build for Chrome
npm test                 # Vitest unit tests (jsdom)
npm run test:e2e         # Playwright E2E tests (requires built extension)
```

### Loading Extension

- **Firefox**: `about:debugging` → Load Temporary Add-on → select `dist/firefox/manifest.json`
- **Chrome**: `chrome://extensions/` → Load unpacked → select `dist/chrome/` directory
- **MUST rebuild** after changes (no hot reload for extension context)

### Testing Strategy

- **Unit tests** ([tests/unit/](tests/unit/)) - Use Vitest + jsdom for logic/utils
- **E2E tests** ([tests/e2e/](tests/e2e/)) - Playwright with extension loading via `launchOptions`
- Test fixtures in [tests/fixtures/](tests/fixtures/) - `accessible-page.html` (passes) and `violations-page.html` (fails)

## Code Conventions

### Critical Rules

1. **No semicolons** (JS/TS only - CSS still requires them per project instructions)
2. **Double quotes** for strings
3. **Alias imports**: Use `@/` for `src/` (configured in [vite.config.js](vite.config.js#L53) and [vitest.config.js](vitest.config.js#L20))

### Performance Patterns (T-numbered comments)

Many performance optimizations documented with `// T###:` comments:

- **T223**: Use `requestIdleCallback` for non-critical work ([dom-inspector.js](src/content/auditor/dom-inspector.js#L23-L31))
- **T224**: Memoize `getComputedStyle()` with WeakMap cache ([dom-inspector.js](src/content/auditor/dom-inspector.js#L7))
- **T234**: Debounce rapid operations ([useAudit.js](src/popup/composables/useAudit.js#L18-L24))
- **T235**: Lazy load Vue components on first use ([CriterionList.vue](src/popup/components/CriterionList.vue#L136))

### Accessibility Patterns

UI components implement WCAG 2.1 AA patterns:

- **Focus trap** (T243): Dialogs trap focus with Tab/Shift+Tab handling
- **Roving tabindex** (T246): List navigation with arrow keys
- **Screen reader announcements** (T239-T242): Use `aria-live` regions for dynamic updates
- **Focus restoration** (T244-T245): Return focus after modal close

## RGAA Data Structure

[rgaa-criteria.js](src/shared/data/rgaa-criteria.js) defines all 106 criteria with:

- `id`: "X.Y" format (topic.criterion)
- `topic`: 1-13 (Images, Frames, Colors, Multimedia, etc.)
- `wcagMapping`: Array of WCAG success criteria
- `automated`: Boolean (automated vs manual check)
- `whyItMatters`, `affectedUsers`: User impact documentation

Criteria are loaded in [engine.js](src/content/auditor/engine.js) with explicit imports (106 total) - this allows tree-shaking and clear dependencies.

## Browser Compatibility

Manifest generated dynamically in [vite.config.js](vite.config.js#L14-L41):

- **Firefox**: `background.scripts` array
- **Chrome**: `background.service_worker` string
- Uses `webextension-polyfill` for cross-browser APIs

## Common Pitfalls

1. **Content script not loaded**: Users must refresh page after install - see error handling in [messaging.js](src/shared/utils/messaging.js#L51-L54)
2. **Restricted pages**: Cannot audit `chrome://`, `about:`, or extension pages
3. **Shadow DOM**: Always use `getElementsByTypeDeep()`, not `querySelectorAll()`
4. **Violation limits**: Cap at 100 per criterion to prevent UI overload
5. **CSP**: No `eval()` or `unsafe-inline` allowed (T202) - use static imports only
