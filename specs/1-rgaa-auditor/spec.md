# Feature Specification: RGAA Accessibility Auditor Extension

**Feature Branch**: `1-rgaa-auditor`  
**Created**: 2025-12-10  
**Status**: Draft  
**Input**: User description: "Build a browser extension for Firefox and Chrome that help to check RGAA criterias for a website"

## Clarifications

### Session 2025-12-10

- Q: When storing audit history locally, how should the extension handle storage when limits are approached? → A: Smart compression: Implement differential storage (store only changes between consecutive audits of same URL) to maximize history retention
- Q: When a user clicks on a violation to highlight the affected element on the page, what should happen if that element is currently outside the viewport (user needs to scroll)? → A: Auto-scroll with smooth animation and temporary highlight pulse (fade in/out over 2 seconds) to draw attention
- Q: When the audit finds a large number of violations (e.g., 500+ failed checks), how should results be presented to avoid overwhelming the user? → A: Group by severity and show top violations first: Critical (A) expanded, Important (AA) collapsed, Enhancement (AAA) collapsed
- Q: The extension needs bundled RGAA documentation for offline access. How comprehensive should this bundled documentation be? → A: Core criterion definitions with links to full docs: Criterion numbers, titles, official descriptions, test procedures, WCAG mappings only (estimated 500KB)
- Q: When the extension encounters an iframe with cross-origin restrictions that prevents content inspection, what information should be shown to the user? → A: Warning banner with actionable guidance: "X iframes not auditable (cross-origin). Audit those pages separately or check frame sources: [list of URLs]"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Quick Automated Audit of Current Page (Priority: P1)

A web developer or accessibility auditor visits any web page and wants to quickly check it against RGAA 4.1 criteria to identify obvious accessibility violations.

**Why this priority**: This is the core value proposition - providing immediate accessibility feedback. Without this, the extension has no purpose.

**Independent Test**: User can install the extension, click the browser action icon on any webpage, and see a list of RGAA criteria with pass/fail/manual check statuses. This delivers immediate value even without any other features.

**Acceptance Scenarios**:

1. **Given** the extension is installed and the user is on any webpage, **When** the user clicks the extension icon in the toolbar, **Then** a popup opens showing an audit summary with the number of automated checks passed, failed, and requiring manual verification
2. **Given** an audit is running, **When** the audit completes, **Then** results are displayed grouped by RGAA thematic categories (Images, Frames, Colors, Multimedia, Tables, Links, Scripts, Mandatory Elements, Structuring Information, Presentation of Information, Forms, Navigation, Consultation)
   2a. **Given** the audit results contain many violations (100+ failed checks), **When** results are displayed, **Then** violations are grouped by severity with Critical (A level) expanded by default, Important (AA level) collapsed, and Enhancement (AAA level) collapsed to prevent overwhelming the user
3. **Given** audit results are displayed, **When** the user clicks on a specific failed criterion, **Then** the extension shows the exact RGAA criterion number, official description in French and English, affected elements with CSS selectors, and links to official RGAA documentation
4. **Given** the user is viewing audit results, **When** the user clicks on an affected element in the results, **Then** the element is visually highlighted on the page with a colored overlay, the page smoothly scrolls to bring the element into viewport, and the highlight pulses (fade in/out over 2 seconds) to draw attention

---

### User Story 2 - Detailed Issue Explanation and Remediation Guidance (Priority: P2)

A developer without deep accessibility expertise encounters a failed RGAA criterion and needs clear guidance on why it failed and how to fix it.

**Why this priority**: Identifying problems without explaining solutions creates frustration. This transforms the tool from a checker into a teaching aid.

**Independent Test**: After running an audit, user clicks on any failed criterion and sees plain language explanation, code snippets showing the violation, step-by-step remediation instructions, and severity level (A, AA, AAA). This works independently of other features.

**Acceptance Scenarios**:

1. **Given** a failed criterion in the audit results, **When** the user expands the criterion details, **Then** the extension displays the official RGAA test procedure, a plain language summary of what was tested, and why it matters for users with disabilities
2. **Given** the user is viewing a failed criterion, **When** the details panel is open, **Then** specific code snippets from the page are shown highlighting the problematic HTML/CSS, with annotations explaining the issue
3. **Given** remediation guidance is displayed, **When** the user reads the fix suggestions, **Then** step-by-step instructions are provided with code examples showing both the incorrect pattern and the corrected version
4. **Given** a criterion requires manual verification (not fully automatable), **When** the user views that criterion, **Then** clear instructions are provided for how to manually test it, including what to look for and how to verify compliance
5. **Given** any criterion result is displayed, **When** the user views the severity information, **Then** the WCAG conformance level (A, AA, AAA) and corresponding WCAG 2.1 success criterion mapping are shown

---

### User Story 3 - Export and Share Audit Reports (Priority: P3)

An accessibility auditor needs to document findings and share them with team members, clients, or stakeholders who may not have the extension installed.

**Why this priority**: While important for professional use, the extension provides value without reporting. This enables workflow integration but isn't required for initial functionality.

**Independent Test**: After completing an audit, user clicks "Export Report" and receives a downloadable HTML, JSON, or CSV file containing all audit results with timestamps, page URL, and detailed findings. This can be shared and viewed without the extension.

**Acceptance Scenarios**:

1. **Given** an audit has been completed, **When** the user clicks the "Export" button, **Then** a format selection menu appears offering HTML, JSON, and CSV export options
2. **Given** the user selects HTML export, **When** the export completes, **Then** a standalone HTML file is generated containing the full audit report with styling, all criterion results, issue details, and remediation guidance that can be opened in any browser
3. **Given** the user selects JSON export, **When** the export completes, **Then** a structured JSON file is generated containing all audit data in a machine-readable format suitable for integration with other tools or automated workflows
4. **Given** the user selects CSV export, **When** the export completes, **Then** a CSV file is generated with one row per criterion, including columns for criterion number, status, severity, number of affected elements, and brief description
5. **Given** any export format is generated, **When** the user views the exported file, **Then** it includes metadata such as audit timestamp, page URL, page title, RGAA version (4.1), and extension version number

---

### User Story 4 - Audit History and Comparison (Priority: P4)

A developer working on accessibility improvements wants to track progress over time by comparing audit results before and after making changes.

**Why this priority**: This is a productivity enhancement for ongoing accessibility work but not essential for the core auditing function. Users can manually track changes without this feature.

**Independent Test**: User runs multiple audits on the same page over time, then opens the history view to see previous audit results with timestamps and can select two audits to view a side-by-side comparison showing improvements or regressions.

**Acceptance Scenarios**:

1. **Given** the user has run multiple audits on the same page URL, **When** the user opens the history panel, **Then** a chronological list of past audits is displayed showing date, time, and pass/fail counts for each audit
2. **Given** the audit history is displayed, **When** the user selects any previous audit, **Then** the full results from that audit are loaded and displayed as if it were just run
3. **Given** the user is viewing audit history, **When** the user selects two different audits to compare, **Then** a comparison view highlights criteria that changed status (newly passed, newly failed, or newly requiring manual check)
   3a. **Given** multiple audits have been run on the same page URL, **When** storing audit history, **Then** the system implements differential storage by storing only changes between consecutive audits to maximize retention while minimizing storage space usage
4. **Given** the user is viewing stored audit data, **When** the user clicks "Clear History", **Then** a confirmation dialog appears and upon confirmation, all stored audit history is deleted from local storage

---

### Edge Cases

- What happens when the page uses Shadow DOM or iframes that may block content inspection? The extension should detect iframes and display a warning banner with actionable guidance (e.g., "X iframes not auditable (cross-origin). Audit those pages separately or check frame sources: [list of URLs]") when content cannot be fully audited due to cross-origin restrictions, and should traverse accessible Shadow DOM trees.
- How does the system handle dynamically loaded content (Single Page Applications)? The extension should provide a "Re-scan" button to audit content changes after initial page load, and should detect when major DOM changes occur to suggest re-running the audit.
- What happens when the page has thousands of elements to check? The extension should implement progressive scanning with progress indicators, limit detailed reporting to the first 100 instances of each violation type, and provide aggregate counts for performance.
- How does the system handle pages in languages other than French/English? The extension UI respects the browser's language setting (French primary, English fallback), but RGAA criterion text always uses official French/English translations regardless of page language.
- What happens if the user's browser storage quota is exceeded by audit history? The extension uses differential storage (storing only changes between consecutive audits) to maximize retention within browser limits. If storage approaches quota despite compression, the extension implements automatic cleanup of oldest audit records and warns users when storage is 80% full.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST audit web pages against RGAA 4.1 criteria using official test procedures and criterion definitions
- **FR-002**: System MUST provide results in three categories: automated pass/fail, requires manual verification, and not applicable
- **FR-003**: System MUST display results in both French (primary) and English with official RGAA translations
- **FR-004**: System MUST map each RGAA criterion to its corresponding WCAG 2.1 success criterion
- **FR-005**: System MUST highlight affected elements on the page when users click on specific violations, smoothly scroll to bring elements into viewport if outside visible area, and apply a pulsing highlight effect (fade in/out over 2 seconds) to draw attention
- **FR-006**: System MUST provide plain language explanations for each criterion including why it matters and how to fix violations
- **FR-007**: System MUST include direct links to official RGAA documentation (numerique.gouv.fr) for each criterion
- **FR-008**: System MUST show code snippets with line numbers for HTML/CSS violations
- **FR-009**: System MUST indicate severity level (A, AA, AAA) for each criterion based on WCAG conformance levels
- **FR-010**: System MUST work identically in Firefox and Chrome using cross-browser compatible WebExtensions APIs
- **FR-011**: System MUST function entirely offline with no external network requests after installation
- **FR-012**: System MUST store all audit data locally using browser.storage.local API
- **FR-013**: System MUST request only activeTab and storage permissions
- **FR-014**: System MUST export audit reports in HTML, JSON, and CSV formats
- **FR-015**: System MUST store audit history with timestamps and allow users to view past audits
- **FR-015a**: System MUST implement differential storage for audit history, storing only changes between consecutive audits of the same URL to maximize retention within browser storage limits
- **FR-016**: System MUST provide keyboard navigation for all UI controls with visible focus indicators
- **FR-017**: System MUST maintain 4.5:1 minimum contrast ratios for all text in the extension UI
- **FR-018**: System MUST use semantic HTML and ARIA labels for screen reader accessibility
- **FR-019**: System MUST implement Content Security Policy without eval() or unsafe-inline
- **FR-020**: System MUST sanitize all content from audited pages before displaying in extension UI
- **FR-021**: System MUST clearly distinguish between automated checks and manual verification requirements
- **FR-021a**: System MUST group audit results by severity level (A, AA, AAA) when presenting large violation sets (100+ failures), with Critical (A level) violations expanded by default and lower severity levels collapsed
- **FR-022**: System MUST provide re-scan functionality for dynamically updated page content
- **FR-023**: System MUST handle cross-origin iframe restrictions gracefully by displaying a warning banner with actionable guidance including count of inaccessible iframes and list of frame source URLs to audit separately
- **FR-024**: System MUST implement progressive scanning with progress indicators for large pages
- **FR-025**: System MUST limit detailed violation reporting to first 100 instances per criterion type with aggregate counts

### Key Entities _(include if feature involves data)_

- **Audit Session**: Represents a single audit run including timestamp, page URL, page title, RGAA version, extension version, and collection of criterion results
- **Criterion Result**: Represents the outcome of testing a specific RGAA criterion including criterion number, status (pass/fail/manual/not-applicable), severity level, WCAG mapping, affected elements, and explanation text
- **Violation Instance**: Represents a single occurrence of a criterion failure including DOM element reference, CSS selector, HTML snippet, line number estimate, and remediation suggestion
- **Audit Configuration**: User preferences including preferred language, export format defaults, highlight color preferences, and storage limits
- **Documentation Reference**: Official RGAA documentation links including criterion number, French URL, English URL, related WCAG techniques, and code examples

## Success Criteria _(mandatory)_

The feature will be considered successful when:

1. **Audit Completeness**: The extension successfully audits at least 70% of RGAA 4.1 criteria that can be automated (approximately 80 out of 106 criteria), with the remaining criteria marked as requiring manual verification
2. **Cross-Browser Compatibility**: All core functionality works identically in Firefox 115+ ESR and Chrome 120+ with zero browser-specific code paths in the audit engine
3. **Performance**: Audit of a typical webpage (500-1000 DOM elements) completes within 5 seconds, with progress indicators shown for longer audits
4. **Accuracy**: Automated checks achieve 95% accuracy rate (verified against manually curated test suite of 100 accessible and inaccessible HTML patterns from WCAG techniques documentation)
5. **Usability**: Users can identify and understand their first accessibility violation within 30 seconds of installation (measured through user testing with 10 participants of varying accessibility expertise)
6. **Accessibility**: The extension UI itself passes all WCAG 2.1 AA criteria when audited with screen readers (NVDA, JAWS) and keyboard-only navigation
7. **Privacy**: Zero network requests made after installation, all data stored locally, verified through browser network monitoring tools
8. **Adoption**: Extension bundle size remains under 3MB to enable fast installation and updates
9. **Maintainability**: Each RGAA criterion implementation has corresponding unit tests with both positive and negative test cases (minimum 2 tests per criterion)
10. **Documentation Quality**: 90% of users can successfully export and share an audit report without referring to documentation (measured through initial user testing)

## Assumptions _(mandatory)_

1. Users have basic understanding of HTML/CSS and web development concepts
2. Target browsers are Firefox 100+ and Chrome 100+ (released within last 2 years)
3. Official RGAA 4.1 documentation will remain available at numerique.gouv.fr domain
4. Users audit pages they have permission to access (extension does not bypass authentication)
5. Audit results are advisory and users are responsible for final compliance verification
6. Manual verification still required for approximately 30% of RGAA criteria due to automation limitations
7. Users accept that dynamic content may require manual re-scanning after page changes
8. Cross-origin iframe content may not be fully auditable due to browser security restrictions
9. Browser storage limits (typically 5-10MB for local storage) are sufficient for storing 50-100 audit history records
10. Users running audits on production websites accept that scanning large DOMs may temporarily impact page performance

## Dependencies _(if applicable)_

- **External**: Official RGAA 4.1 methodology documentation - core criterion definitions bundled (criterion numbers, titles, official descriptions, test procedures, WCAG mappings, approximately 500KB) with links to full online documentation at numerique.gouv.fr for comprehensive remediation guides
- **External**: WCAG 2.1 success criteria mappings (bundled with extension)
- **Browser APIs**: WebExtensions APIs (browser.tabs, browser.storage, browser.i18n) available in Firefox 100+ and Chrome 100+
- **Browser APIs**: DOM APIs for page inspection (querySelectorAll, getComputedStyle, accessibility tree queries)
- **Technical**: Manifest V3 support in both browsers (with V2 fallback strategy if needed for Firefox compatibility)
- **Legal**: Compliance with RGAA official wording and attribution requirements per French government licensing

## Constraints _(if applicable)_

- **Performance**: Audit must not freeze browser UI; use background processing or Web Workers for intensive checks
- **Storage**: Total extension package size including bundled documentation (core RGAA definitions ~500KB) must remain under 5MB; audit history uses differential storage to maximize retention within browser.storage.local limits
- **Permissions**: Limited to activeTab and storage only; cannot use broad host permissions or webRequest
- **Localization**: French must be primary language with English as secondary; RGAA text uses only official translations
- **Security**: No dynamic code execution (eval), no external CDN dependencies, strict Content Security Policy
- **Browser Support**: Must work identically in both Firefox and Chrome; feature parity enforced through automated testing
- **Offline**: Must function completely without network access after installation
- **Accessibility**: Extension UI must be fully accessible and serve as exemplar of WCAG 2.1 AA compliance

## Out of Scope _(if applicable)_

- Automated fixing of accessibility issues (extension only identifies and explains, does not modify page code)
- Support for RGAA versions other than 4.1 (may be added later as legacy mode)
- Browser automation or headless testing capabilities (extension is for interactive manual audits)
- Team collaboration features (shared audits, comments, assignment workflows)
- Integration with CI/CD pipelines or automated testing frameworks
- PDF or Microsoft Office document accessibility auditing
- Mobile browser support (focus is desktop Firefox and Chrome only)
- Real-time monitoring or continuous scanning of page changes
- Cloud storage or synchronization of audit history across devices
- Custom criterion definitions or organization-specific accessibility rules beyond RGAA
