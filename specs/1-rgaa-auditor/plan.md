# Implementation Plan: RGAA Accessibility Auditor Extension

**Branch**: `1-rgaa-auditor` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/1-rgaa-auditor/spec.md`

## Summary

Build a cross-browser WebExtension (Firefox & Chrome) that audits web pages against French RGAA 4.1 accessibility standards. The extension provides automated accessibility checks, detailed remediation guidance, and exportable reports while maintaining full offline functionality and privacy-first architecture. The UI uses Vue3 and must itself be fully accessible (WCAG 2.1 AA compliant) to serve as an exemplar of accessible design.

**Technical Approach**: Content script injects audit engine into active tab, Vue3-based popup displays results with severity-based grouping, WebExtensions APIs handle cross-browser compatibility, differential storage optimizes audit history retention, and bundled RGAA documentation (~500KB) enables offline operation.

## Technical Context

**Language/Version**: JavaScript ES2022+ (for WebExtensions APIs compatibility)  
**Primary Dependencies**:

- Vue 3.4+ (Composition API, for accessible reactive UI)
- Vite 5+ (build tool with extension plugin)
- webextension-polyfill 0.12+ (Firefox/Chrome API normalization)
- Vitest 1.0+ (unit testing framework)
- Playwright 1.40+ (cross-browser E2E testing)

**Storage**: browser.storage.local API (no external databases, local-only per constitution)  
**Testing**: Vitest (unit), Playwright (E2E cross-browser), axe-core (accessibility validation of extension UI)  
**Target Platform**: Desktop Firefox 115+ ESR and Chrome 120+ (Manifest V3 with selective V2 compatibility)  
**Project Type**: Browser extension (WebExtension architecture with content scripts, background service worker, popup UI)  
**Performance Goals**:

- Audit completion <5 seconds for typical page (500-1000 DOM elements)
- UI render time <100ms for results display
- Bundle size <3MB total (including Vue3 runtime + RGAA docs)
- Memory footprint <50MB during active audit

**Constraints**:

- activeTab + storage permissions only (no broad host permissions)
- Zero network requests after installation (offline-first)
- Cross-browser parity enforced (no browser-specific audit logic)
- 4.5:1 contrast ratios minimum for all extension UI
- Full keyboard navigation with visible focus indicators
- Screen reader compatible (ARIA labels, semantic HTML)

**Scale/Scope**:

- 106 RGAA 4.1 criteria (target 70% automated, ~75 criteria)
- 13 thematic RGAA categories
- Support 50-100 audit history records with differential storage
- ~500KB bundled RGAA documentation (French + English)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ Principle I: RGAA 4.x Methodology Fidelity (NON-NEGOTIABLE)

- **Compliance**: Bundle official RGAA 4.1 criterion definitions (JSON format) with exact wording
- **Compliance**: Map each criterion to WCAG 2.1 success criteria in metadata
- **Compliance**: Link to official numerique.gouv.fr documentation URLs
- **Compliance**: Use official French/English translations from RGAA specification
- **Gate**: RGAA data files MUST be validated against official sources before implementation

### ✅ Principle II: Accessibility-First UI (NON-NEGOTIABLE)

- **Compliance**: Vue3 components use semantic HTML5 elements
- **Compliance**: All interactive elements accessible via keyboard (Tab, Enter, Space, Esc)
- **Compliance**: ARIA labels for icons, buttons, and dynamic content regions
- **Compliance**: CSS enforces 4.5:1 contrast ratios (validated via design tokens)
- **Compliance**: Focus indicators visible and 3px minimum width
- **Gate**: Extension UI MUST pass axe-core automated checks before each release
- **Gate**: Manual screen reader testing (NVDA/JAWS) required quarterly

### ✅ Principle III: Cross-Browser Parity

- **Compliance**: Use webextension-polyfill for API normalization
- **Compliance**: Manifest V3 primary, V2 fallback for Firefox ESR if needed
- **Compliance**: Playwright tests run against both Firefox and Chrome
- **Compliance**: No browser detection in audit engine logic
- **Gate**: All features MUST work identically in both browsers before merge

### ✅ Principle IV: Minimal Permissions & Privacy-First

- **Compliance**: manifest.json requests only: activeTab, storage
- **Compliance**: No external CDN dependencies (Vue3 bundled locally)
- **Compliance**: All RGAA docs bundled in extension package
- **Compliance**: browser.storage.local only (no sync, no cookies)
- **Gate**: Network monitor MUST show zero requests after installation

### ✅ Principle V: Explainable Results

- **Compliance**: Each criterion includes plain language summary
- **Compliance**: Code snippets show exact HTML causing violations
- **Compliance**: Remediation guidance with before/after examples
- **Compliance**: Clear labels: "Automated", "Manual Check Required", "Not Applicable"
- **Gate**: User testing MUST confirm 90% can understand first violation in 30 seconds

### ✅ Principle VI: Test-First Development

- **Compliance**: Vitest unit tests for each RGAA criterion auditor
- **Compliance**: Minimum 2 tests per criterion (positive + negative case)
- **Compliance**: Test suite includes real-world HTML from WCAG techniques
- **Compliance**: Playwright E2E tests for each user story
- **Gate**: Test coverage MUST be ≥85% for audit engine modules

### ✅ Principle VII: Progressive Enhancement & Graceful Degradation

- **Compliance**: Audit engine separable from UI (works via CLI in dev mode)
- **Compliance**: Offline documentation bundled
- **Compliance**: Graceful iframe handling with warnings
- **Compliance**: Progressive scanning with progress indicators
- **Compliance**: Export formats (JSON, CSV, HTML) work without UI
- **Gate**: Extension MUST function without network access

**Overall Assessment**: ✅ PASS - All gates addressable with proposed architecture

## Project Structure

### Documentation (this feature)

```text
specs/1-rgaa-auditor/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions, RGAA automation feasibility
├── data-model.md        # Phase 1: Audit data structures, storage schema
├── quickstart.md        # Phase 1: Developer setup, build instructions
├── contracts/           # Phase 1: Content script ↔ popup messaging protocol
│   └── messages.json    # Message format definitions
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
a11y-addon/
├── src/
│   ├── background/
│   │   └── service-worker.js    # Minimal background script (Manifest V3)
│   ├── content/
│   │   ├── auditor/
│   │   │   ├── engine.js        # Core audit orchestrator
│   │   │   ├── criteria/        # One file per RGAA criterion
│   │   │   │   ├── 1.1-text-alt.js
│   │   │   │   ├── 3.2-contrast.js
│   │   │   │   └── ...          # ~75 criterion auditors
│   │   │   ├── dom-inspector.js # DOM traversal, Shadow DOM handling
│   │   │   ├── iframe-detector.js # Cross-origin iframe detection
│   │   │   └── utils.js         # Common audit utilities
│   │   ├── highlighter.js       # Visual element highlighting + smooth scroll
│   │   └── content-script.js    # Entry point injected into page
│   ├── popup/
│   │   ├── App.vue              # Root Vue3 component
│   │   ├── components/
│   │   │   ├── AuditSummary.vue # P1: Summary dashboard
│   │   │   ├── CriterionList.vue # P1: Results list with categories
│   │   │   ├── CriterionDetail.vue # P2: Remediation guidance panel
│   │   │   ├── ExportDialog.vue # P3: Export format selection
│   │   │   ├── HistoryPanel.vue # P4: Audit history view
│   │   │   └── WarningBanner.vue # Iframe/error warnings
│   │   ├── composables/
│   │   │   ├── useAudit.js      # Audit state management
│   │   │   ├── useStorage.js    # Differential storage logic
│   │   │   └── useI18n.js       # French/English switching
│   │   ├── stores/
│   │   │   └── audit.js         # Pinia store (optional if using Pinia)
│   │   ├── main.js              # Vue3 app initialization
│   │   └── popup.html           # Extension popup entry point
│   ├── shared/
│   │   ├── data/
│   │   │   ├── rgaa-criteria.json # Bundled RGAA 4.1 definitions
│   │   │   ├── wcag-mapping.json  # RGAA → WCAG 2.1 mappings
│   │   │   └── i18n/
│   │   │       ├── fr.json       # French translations (primary)
│   │   │       └── en.json       # English translations
│   │   ├── types/
│   │   │   └── audit.d.ts       # TypeScript type definitions (optional)
│   │   └── utils/
│   │       ├── messaging.js     # Cross-context messaging helpers
│   │       ├── storage.js       # Differential storage implementation
│   │       └── sanitizer.js     # HTML sanitization for display
│   └── styles/
│       ├── tokens.css           # Design tokens (colors, spacing, contrast ratios)
│       ├── focus.css            # Focus indicator styles
│       └── global.css           # Base styles
├── tests/
│   ├── unit/
│   │   ├── criteria/            # Tests for each RGAA criterion
│   │   │   ├── 1.1-text-alt.test.js
│   │   │   └── ...
│   │   ├── storage.test.js      # Differential storage tests
│   │   └── dom-inspector.test.js
│   ├── integration/
│   │   ├── audit-flow.test.js   # Full audit execution
│   │   └── cross-browser.test.js # Firefox/Chrome parity
│   ├── e2e/
│   │   ├── user-story-1.spec.js # P1: Quick audit
│   │   ├── user-story-2.spec.js # P2: Remediation guidance
│   │   ├── user-story-3.spec.js # P3: Export reports
│   │   └── user-story-4.spec.js # P4: Audit history
│   └── fixtures/
│       ├── accessible-page.html # Positive test cases
│       └── violations-page.html # Negative test cases
├── public/
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   └── _locales/               # WebExtensions i18n structure
│       ├── fr/
│       │   └── messages.json
│       └── en/
│           └── messages.json
├── manifest.json               # Manifest V3 (Chrome/Firefox compatible)
├── vite.config.js              # Build configuration
├── vitest.config.js            # Test configuration
├── playwright.config.js        # E2E test configuration
├── package.json
└── README.md
```

**Structure Decision**: Browser extension architecture selected based on:

- **Isolated contexts**: Content script (runs in page context) communicates with popup (extension context) via browser.runtime messaging
- **Vue3 popup**: Provides reactive UI for results display with accessible components
- **Criterion modularity**: Each RGAA criterion is a separate auditor module for testability
- **Shared utilities**: Common code between content script and popup in `/shared`
- **Manifest V3**: Modern extension standard with service worker background script

## Complexity Tracking

> **Not Required** - Constitution Check shows no violations. All principles addressable within proposed architecture. Vue3, webextension-polyfill, and Vitest are proven technologies with strong accessibility support.

**Justifications (for transparency)**:

- Vue3 chosen for reactive UI with built-in accessibility features (semantic rendering, ARIA support)
- Differential storage adds complexity but necessary to meet storage constraints and history requirements
- ~75 criterion auditors creates code volume but enforces testability and modularity per constitution

## Phase 0: Outline & Research

**Purpose**: Resolve technical unknowns before design phase.

### Research Tasks

1. **RGAA 4.1 Automation Feasibility Analysis**

   - **Question**: Which of 106 RGAA criteria can be fully automated vs. require manual verification?
   - **Approach**: Review official RGAA test procedures, cross-reference with existing tools (axe-core, Pa11y), document automation limitations
   - **Output**: Categorized list: Automated (target ~75), Semi-automated (~20), Manual-only (~11)
   - **Decision Criteria**: Must achieve ≥70% automation per success criteria

2. **Vue3 Accessibility Patterns Research**

   - **Question**: Best practices for building WCAG 2.1 AA compliant Vue3 components in browser extensions?
   - **Approach**: Review Vue3 a11y documentation, analyze accessible component libraries (Vuetify, PrimeVue), test in screen readers
   - **Output**: Component patterns for keyboard nav, ARIA usage, focus management
   - **Decision Criteria**: Must support full keyboard navigation and screen reader compatibility

3. **WebExtensions API Cross-Browser Compatibility**

   - **Question**: Which APIs differ between Firefox and Chrome? Do we need Manifest V2 fallback for Firefox ESR?
   - **Approach**: Test webextension-polyfill coverage, review Firefox/Chrome API documentation, identify edge cases
   - **Output**: Compatibility matrix, polyfill gaps, manifest version strategy
   - **Decision Criteria**: Zero browser-specific code paths in audit engine per constitution

4. **Differential Storage Algorithm Design**

   - **Question**: How to efficiently store audit history changes while minimizing storage usage?
   - **Approach**: Prototype delta compression algorithms, benchmark storage savings on real audit data
   - **Output**: Storage schema with delta encoding strategy
   - **Decision Criteria**: Must support 50-100 audit records within 5-10MB browser.storage.local limits

5. **Performance Optimization for Large DOMs**

   - **Question**: How to prevent UI freeze when auditing pages with 5000+ elements?
   - **Approach**: Research Web Workers for background processing, progressive scanning with yield points, benchmarking
   - **Output**: Scanning strategy with progress indicators, performance targets
   - **Decision Criteria**: Must complete typical audit (500-1000 elements) in <5 seconds

6. **RGAA Documentation Bundling Strategy**
   - **Question**: How to bundle ~500KB RGAA docs efficiently? What format (JSON, compressed)?
   - **Approach**: Analyze official RGAA docs, convert to structured JSON, test compression ratios
   - **Output**: Bundled rgaa-criteria.json with size optimization
   - **Decision Criteria**: Must fit within 3MB total bundle size constraint

### Deliverable: research.md

Document structure:

```markdown
# Research: RGAA Auditor Technical Decisions

## 1. RGAA 4.1 Automation Feasibility

**Decision**: Implement 75 automated criteria, 20 semi-automated, 11 manual-only
**Rationale**: ...
**Alternatives Considered**: Full automation (rejected due to false positives), minimal automation (rejected - doesn't meet 70% target)

## 2. Vue3 Accessibility Patterns

**Decision**: Use Composition API with dedicated a11y composables
**Rationale**: ...
**Alternatives Considered**: Options API (less composable), React (larger bundle), vanilla JS (more boilerplate)

## 3. Cross-Browser Compatibility

**Decision**: Manifest V3 primary, webextension-polyfill for normalization
**Rationale**: ...
**Alternatives Considered**: Dual manifests (maintenance burden), V2 only (deprecated)

## 4. Differential Storage

**Decision**: JSON Patch (RFC 6902) for delta encoding
**Rationale**: ...
**Alternatives Considered**: Full snapshots (storage waste), custom diff (complexity)

## 5. Performance Strategy

**Decision**: Progressive scanning with requestIdleCallback + progress UI
**Rationale**: ...
**Alternatives Considered**: Web Worker (messaging overhead), synchronous (UI freeze)

## 6. Documentation Bundling

**Decision**: Minified JSON with gzip-friendly structure
**Rationale**: ...
**Alternatives Considered**: Inline JS (no compression), external fetch (breaks offline)
```

## Phase 1: Design & Contracts

**Purpose**: Define data models and API contracts before implementation.

### Design Tasks

1. **Audit Data Model Design**

   - Extract entities: AuditSession, CriterionResult, ViolationInstance, AuditConfiguration
   - Define relationships and validation rules
   - Specify differential storage format
   - **Output**: data-model.md

2. **Content Script ↔ Popup Messaging Protocol**

   - Define message types: START_AUDIT, AUDIT_PROGRESS, AUDIT_COMPLETE, HIGHLIGHT_ELEMENT
   - Specify request/response payloads
   - Error handling protocol
   - **Output**: contracts/messages.json (JSON Schema)

3. **RGAA Criterion Interface Specification**

   - Standard interface for criterion auditor modules
   - Input: DOM tree, criterion config
   - Output: CriterionResult with violations
   - **Output**: contracts/criterion-interface.json

4. **Storage API Contract**

   - Functions: saveAudit(), loadAudit(), loadHistory(), computeDelta(), applyDelta()
   - Differential storage format specification
   - **Output**: contracts/storage-api.json

5. **Developer Quickstart Guide**
   - Setup instructions (Node.js, dependencies)
   - Build commands (dev, prod, test)
   - Loading extension in Firefox/Chrome
   - Running tests
   - **Output**: quickstart.md

### Deliverable: data-model.md

````markdown
# Data Model: RGAA Auditor

## Entities

### AuditSession

**Purpose**: Represents a single audit execution

| Field            | Type              | Description                 | Validation          |
| ---------------- | ----------------- | --------------------------- | ------------------- |
| id               | string (UUID)     | Unique session identifier   | Required            |
| timestamp        | ISO 8601 string   | When audit was run          | Required            |
| pageUrl          | string            | URL of audited page         | Required, valid URL |
| pageTitle        | string            | Page title                  | Required            |
| rgaaVersion      | string            | RGAA version (4.1)          | Required            |
| extensionVersion | string            | Extension version           | Required            |
| results          | CriterionResult[] | Array of criterion results  | Required            |
| metadata         | object            | Browser info, scan duration | Optional            |

**Relationships**: Has many CriterionResult

**State Transitions**:

- PENDING → IN_PROGRESS → COMPLETED
- PENDING → FAILED (if audit errors)

### CriterionResult

**Purpose**: Outcome of testing specific RGAA criterion

| Field            | Type                | Description                        | Validation    |
| ---------------- | ------------------- | ---------------------------------- | ------------- |
| criterionId      | string              | RGAA criterion (e.g., "1.1")       | Required      |
| status           | enum                | pass, fail, manual, not-applicable | Required      |
| severity         | enum                | A, AA, AAA                         | Required      |
| wcagMapping      | string[]            | WCAG 2.1 success criteria          | Required      |
| violations       | ViolationInstance[] | Specific violations found          | Empty if pass |
| explanation      | object              | { fr: string, en: string }         | Required      |
| documentationUrl | string              | Link to RGAA docs                  | Required      |

**Relationships**: Belongs to AuditSession, has many ViolationInstance

### ViolationInstance

**Purpose**: Single occurrence of criterion failure

| Field       | Type   | Description                              | Validation    |
| ----------- | ------ | ---------------------------------------- | ------------- |
| id          | string | Unique violation ID                      | Required      |
| selector    | string | CSS selector                             | Required      |
| htmlSnippet | string | Sanitized HTML excerpt                   | Max 500 chars |
| lineNumber  | number | Estimated line in source                 | Optional      |
| remediation | object | { summary: string, codeExample: string } | Required      |

### AuditConfiguration

**Purpose**: User preferences

| Field             | Type   | Description     | Default |
| ----------------- | ------ | --------------- | ------- |
| preferredLanguage | enum   | fr, en          | fr      |
| exportFormat      | enum   | html, json, csv | html    |
| highlightColor    | string | CSS color       | #FF6B6B |
| maxHistoryRecords | number | Storage limit   | 50      |

## Storage Schema (Differential)

**Base Snapshot**:

```json
{
  "id": "session-uuid",
  "timestamp": "2025-12-10T10:30:00Z",
  "pageUrl": "https://example.com",
  "pageTitle": "Example Page",
  "results": [
    /* full CriterionResult array */
  ]
}
```
````

**Delta (subsequent audit of same URL)**:

```json
{
  "baseId": "previous-session-uuid",
  "timestamp": "2025-12-10T11:00:00Z",
  "patch": [
    /* JSON Patch operations */
  ]
}
```

Example patch:

```json
[
  { "op": "replace", "path": "/results/5/status", "value": "pass" },
  { "op": "add", "path": "/results/5/violations", "value": [] }
]
```

````

### Deliverable: contracts/messages.json

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Content Script ↔ Popup Messaging Protocol",
  "definitions": {
    "START_AUDIT": {
      "type": "object",
      "properties": {
        "type": { "const": "START_AUDIT" },
        "criteria": {
          "type": "array",
          "items": { "type": "string" },
          "description": "RGAA criterion IDs to audit (empty = all)"
        }
      },
      "required": ["type"]
    },
    "AUDIT_PROGRESS": {
      "type": "object",
      "properties": {
        "type": { "const": "AUDIT_PROGRESS" },
        "current": { "type": "number" },
        "total": { "type": "number" },
        "criterionId": { "type": "string" }
      },
      "required": ["type", "current", "total"]
    },
    "AUDIT_COMPLETE": {
      "type": "object",
      "properties": {
        "type": { "const": "AUDIT_COMPLETE" },
        "session": { "$ref": "#/definitions/AuditSession" }
      },
      "required": ["type", "session"]
    },
    "HIGHLIGHT_ELEMENT": {
      "type": "object",
      "properties": {
        "type": { "const": "HIGHLIGHT_ELEMENT" },
        "selector": { "type": "string" },
        "scrollBehavior": { "enum": ["smooth", "auto"], "default": "smooth" }
      },
      "required": ["type", "selector"]
    }
  }
}
````

### Deliverable: quickstart.md

````markdown
# Developer Quickstart: RGAA Auditor

## Prerequisites

- Node.js 18+ and npm 9+
- Firefox Developer Edition 115+ or Chrome 120+
- Git

## Setup

1. Clone repository:
   ```bash
   git clone <repo-url>
   cd a11y-addon
   git checkout 1-rgaa-auditor
   ```
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build extension:
   ```bash
   npm run build:dev     # Development build with source maps
   npm run build:prod    # Production build (minified)
   ```

## Loading in Browser

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `dist/manifest.json`

### Chrome

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist/` directory

## Development Workflow

```bash
npm run dev           # Watch mode with hot reload
npm run test          # Run all tests
npm run test:unit     # Unit tests only
npm run test:e2e      # E2E tests (Firefox + Chrome)
npm run lint          # ESLint + Vue linter
npm run format        # Prettier formatting
```

## Project Commands

| Command                 | Description                     |
| ----------------------- | ------------------------------- |
| `npm run build:firefox` | Build Firefox-specific manifest |
| `npm run build:chrome`  | Build Chrome-specific manifest  |
| `npm run bundle`        | Create .zip for distribution    |
| `npm run validate:a11y` | Run axe-core on extension UI    |

## Testing Individual Criteria

```bash
npm run test:criterion 1.1    # Test RGAA criterion 1.1
npm run test:criterion all    # Test all criteria
```

## Debugging

1. **Content Script**: Open page console (F12 → Console)
2. **Popup**: Right-click extension icon → Inspect
3. **Background**: about:debugging → Inspect (Firefox) or chrome://extensions → background page (Chrome)

````

### Agent Context Update

After Phase 1 design completion, run agent context update:

```bash
.\.specify\scripts\powershell\update-agent-context.ps1 -AgentType copilot
````

This will update `.github/copilot-instructions.md` with:

- Vue3 Composition API patterns
- WebExtensions API usage
- RGAA criterion testing patterns
- Accessibility best practices for extension UI

## Phase 2: Not Included in Plan

**Note**: Phase 2 (task breakdown) is handled by the separate `/speckit.tasks` command and generates `tasks.md`. This plan document terminates after Phase 1 design completion.

The `/speckit.tasks` command will:

- Break down implementation into granular tasks
- Organize tasks by user story (P1-P4)
- Create dependency chains
- Generate task IDs and file paths

## Next Steps

1. **Review this plan** for completeness and accuracy
2. **Run Phase 0**: Execute research tasks and generate `research.md`
3. **Run Phase 1**: Complete design tasks and generate `data-model.md`, `contracts/`, `quickstart.md`
4. **Update agent context**: Run update script after Phase 1
5. **Proceed to `/speckit.tasks`**: Generate granular task list for implementation

**Estimated Timeline**:

- Phase 0 (Research): 3-5 days
- Phase 1 (Design): 2-3 days
- **Total Planning**: ~1 week before coding begins
