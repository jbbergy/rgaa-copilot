<!--
SYNC IMPACT REPORT
==================
Version Change: 0.0.0 → 1.0.0
Rationale: Initial constitution ratification for RGAA Accessibility Auditor project

Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (7 principles defined)
  - Compliance & Security Standards
  - Development Workflow
  - Governance

Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligns with 7 principles
  ✅ spec-template.md - Requirements sections support accessibility & RGAA compliance
  ✅ tasks-template.md - Task categorization supports accessibility testing & RGAA validation

Follow-up TODOs: None - all placeholders filled
-->

# RGAA Accessibility Auditor Constitution

## Core Principles

### I. RGAA 4.x Methodology Fidelity (NON-NEGOTIABLE)

The extension MUST use official RGAA 4.x methodology, criterion definitions, and wording without interpretation or simplification. Each audit criterion MUST:

- Reference the exact RGAA criterion number (e.g., 1.1, 3.2, 8.9)
- Use official RGAA test procedures verbatim
- Map correctly to WCAG 2.1 success criteria when applicable
- Provide results in both French and English using official translations
- Include links to official RGAA documentation for each criterion

**Rationale**: Ensures legal compliance and authoritative results. RGAA is a French government standard requiring precise adherence for official accessibility audits.

### II. Accessibility-First UI (NON-NEGOTIABLE)

The extension's own user interface MUST be fully accessible and serve as an exemplar of WCAG/RGAA compliance:

- Full keyboard navigation with visible focus indicators (WCAG 2.4.7, RGAA 10.7)
- ARIA labels and semantic HTML for screen reader compatibility
- Color-blind friendly design with 4.5:1 contrast ratios minimum (WCAG 1.4.3, RGAA 3.2)
- No reliance on color alone to convey information (WCAG 1.4.1, RGAA 3.1)
- Responsive text sizing and layout (WCAG 1.4.4, RGAA 10.4)
- Clear focus management and modal dialog patterns

**Rationale**: An accessibility auditing tool that is itself inaccessible undermines credibility and excludes disabled users from performing audits.

### III. Cross-Browser Parity

The extension MUST provide functionally identical experiences in Firefox and Chrome with no browser-specific features that compromise the other platform:

- Use only WebExtensions APIs available in both browsers (Manifest V3 preferred with V2 fallback where needed)
- Test suites MUST run against both browsers
- UI MUST render consistently across both platforms
- Feature degradation acceptable only for browser API limitations (must be documented)

**Rationale**: Ensures maximum reach and prevents vendor lock-in. Auditors should choose browsers based on preference, not feature availability.

### IV. Minimal Permissions & Privacy-First

The extension MUST request only essential permissions and MUST NOT track, collect, or transmit user data:

- Request permissions: activeTab, storage (local only)
- Prohibited permissions: webRequest (unless essential for specific audit types), cookies, history, tabs (except activeTab)
- No analytics, telemetry, or external service calls
- All audit data stored locally using browser.storage.local
- Clear data deletion mechanisms for users

**Rationale**: Respects user privacy and minimizes attack surface. Accessibility audits may involve sensitive content; data must remain on user devices.

### V. Explainable Results

Every audit result MUST provide clear, actionable explanations that help users understand and remediate issues:

- Plain language summary of what was tested and why it matters
- Specific code snippets or element paths showing the issue
- Step-by-step guidance for manual verification (when automated detection insufficient)
- Links to RGAA documentation and remediation techniques
- Severity rating based on RGAA/WCAG levels (A, AA, AAA)
- Clear distinction between automated checks, semi-automated checks, and manual checks required

**Rationale**: Enables developers of all skill levels to understand and fix accessibility issues. Transparency builds trust in audit results.

### VI. Test-First Development

All auditing logic MUST follow Test-Driven Development (TDD):

- Write test cases for each RGAA criterion BEFORE implementation
- Tests MUST include positive cases (accessible code) and negative cases (violations)
- Tests MUST use real-world HTML examples from WCAG techniques and RGAA resources
- Manual verification steps documented when full automation impossible
- Regression tests for browser API behavior differences

**Rationale**: Accessibility testing logic is complex and error-prone. TDD ensures correctness and prevents regressions that could produce false positives/negatives.

### VII. Progressive Enhancement & Graceful Degradation

The extension MUST function with core features even when optional capabilities fail:

- Core audit engine separate from UI presentation
- Works without network access (all resources bundled)
- Degrades gracefully if browser APIs restricted or unavailable
- Provide text-based export formats (JSON, CSV, HTML) as fallback to visual reports
- Support offline documentation access

**Rationale**: Ensures reliability in restricted environments (corporate proxies, offline scenarios) and maximizes compatibility across browser versions.

## Compliance & Security Standards

### RGAA Version Tracking

- Extension MUST clearly state which RGAA version it audits against (currently 4.1)
- Version updates MUST be documented in changelog with migration notes
- Support for previous RGAA versions acceptable as "legacy mode" but MUST NOT be default

### WCAG Alignment

- All RGAA criteria map to WCAG 2.1 success criteria; these mappings MUST be documented
- When WCAG provides additional guidance beyond RGAA, include as supplementary information
- Clearly distinguish between RGAA requirements and broader WCAG best practices

### Security Requirements

- No eval() or unsafe-inline in Content Security Policy
- Sanitize all user-generated content before rendering
- Use textContent instead of innerHTML when displaying audit results
- Validate all inputs from web pages being audited (untrusted environment)
- Regular dependency audits for known vulnerabilities

### Localization

- French MUST be the primary language (RGAA is a French standard)
- English localization MUST be provided for international adoption
- All UI text MUST be externalized using browser.i18n APIs
- RGAA criterion text MUST use official translations only

## Development Workflow

### Code Review Requirements

- All PRs MUST include test coverage for new RGAA criteria implementations
- UI changes MUST include accessibility validation checklist confirmation
- Cross-browser testing MUST be verified before merge
- Changelog entries MUST reference RGAA criterion numbers for audit logic changes

### Quality Gates

- Unit tests MUST pass for both Firefox and Chrome environments
- Manual accessibility audit of extension UI MUST be performed quarterly
- No regressions in existing RGAA criterion detection allowed
- Bundle size monitored to ensure reasonable extension package size (<5MB)

### Documentation Standards

- Each RGAA criterion implementation MUST have inline documentation explaining detection logic
- README MUST include installation instructions for both browsers
- CHANGELOG MUST use semantic versioning with clear RGAA criterion updates
- User guide MUST explain limitations of automated testing vs. manual verification

## Governance

This constitution supersedes all other development practices and design decisions. The seven core principles are binding and MUST be verified in all specification documents, implementation plans, and code reviews.

### Amendment Process

1. Proposed amendments MUST be documented with rationale and impact analysis
2. Community feedback period MUST be provided for principle changes
3. Version number MUST increment per semantic versioning (MAJOR for principle removals/redefinitions, MINOR for additions, PATCH for clarifications)
4. Migration plan MUST be provided for breaking changes affecting existing features

### Compliance Verification

- All feature specifications MUST include "Constitution Check" section verifying alignment with principles I-VII
- Code reviews MUST reject implementations violating privacy, accessibility, or RGAA fidelity principles
- Quarterly audits MUST verify extension UI maintains WCAG 2.1 AA compliance minimum

### Living Document

This constitution may be amended as RGAA standards evolve or new browser capabilities emerge, but amendments MUST maintain the spirit of accessibility-first, privacy-respecting, standards-compliant auditing.

**Version**: 1.0.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
