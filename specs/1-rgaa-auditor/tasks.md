# Tasks: RGAA Accessibility Auditor Extension

**Input**: Design documents from `/specs/1-rgaa-auditor/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Browser extension structure with Vue3:

- `/src/popup/` - Vue3 components
- `/src/content/` - Content scripts
- `/src/shared/` - Shared utilities
- `/tests/` - Test suites

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan with src/, tests/, public/ directories
- [x] T002 Initialize Node.js project with package.json specifying dependencies (Vue 3.4+, Vite 5+, webextension-polyfill 0.12+, Vitest 1.0+, Playwright 1.40+)
- [x] T003 [P] Configure Vite build system in vite.config.js with WebExtension plugin for Firefox/Chrome builds
- [x] T004 [P] Configure Vitest in vitest.config.js for unit testing with coverage reporting
- [x] T005 [P] Configure Playwright in playwright.config.js for cross-browser E2E testing (Firefox + Chrome)
- [x] T006 [P] Setup ESLint and Prettier configuration for code quality and formatting
- [x] T007 Create manifest.json (Manifest V3) with activeTab and storage permissions only
- [x] T008 [P] Setup i18n structure in public/\_locales/ with fr/messages.json and en/messages.json
- [x] T009 [P] Create design tokens CSS in src/styles/tokens.css with 4.5:1 contrast ratios
- [x] T010 [P] Create focus indicator styles in src/styles/focus.css (3px minimum width)
- [x] T011 [P] Create extension icons (16px, 48px, 128px) in public/icons/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Bundle RGAA 4.1 criterion definitions in src/shared/data/rgaa-criteria.json with official French/English translations (~500KB)
- [x] T013 [P] Bundle WCAG 2.1 mappings in src/shared/data/wcag-mapping.json linking RGAA criteria to WCAG success criteria
- [x] T014 [P] Create French translations in src/shared/data/i18n/fr.json for UI text
- [x] T015 [P] Create English translations in src/shared/data/i18n/en.json for UI text
- [x] T016 Implement messaging protocol in src/shared/utils/messaging.js for content script ↔ popup communication
- [x] T017 [P] Implement HTML sanitizer in src/shared/utils/sanitizer.js for safe display of page content
- [x] T018 Implement differential storage engine in src/shared/utils/storage.js using JSON Patch (RFC 6902)
- [x] T019 Create minimal service worker in src/background/service-worker.js (Manifest V3 background script)
- [x] T020 [P] Create TypeScript type definitions in src/shared/types/audit.d.ts for AuditSession, CriterionResult, ViolationInstance
- [x] T021 Implement DOM inspector utility in src/content/auditor/dom-inspector.js with Shadow DOM traversal support
- [x] T022 [P] Implement iframe detector in src/content/auditor/iframe-detector.js for cross-origin detection

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Automated Audit (Priority: P1) 🎯 MVP

**Goal**: Enable users to click extension icon and immediately see automated RGAA audit results grouped by category and severity, with progressive scanning for large pages and re-scan capability for dynamic content

**Independent Test**: Install extension, click icon on any webpage, see pass/fail/manual check counts with expandable categories, verify progress indicators on large pages, test re-scan button for dynamic content

### Tests for User Story 1 (if TDD approach used)

- [x] T023 [P] [US1] Contract test for START_AUDIT message in tests/integration/messaging.test.js
- [x] T024 [P] [US1] Integration test for full audit flow in tests/integration/audit-flow.test.js
- [x] T025 [P] [US1] E2E test for user story 1 in tests/e2e/user-story-1.spec.js (Firefox + Chrome)

### Implementation for User Story 1

- [x] T026 [P] [US1] Implement audit engine orchestrator in src/content/auditor/engine.js coordinating criterion checks
- [x] T027 [P] [US1] Implement RGAA criterion 1.1 (text alternatives) in src/content/auditor/criteria/1.1-text-alt.js
- [x] T028 [P] [US1] Implement RGAA criterion 3.2 (color contrast) in src/content/auditor/criteria/3.2-contrast.js
- [x] T029 [P] [US1] Implement RGAA criterion 8.2 (valid HTML) in src/content/auditor/criteria/8.2-valid-html.js
- [x] T030 [P] [US1] Implement RGAA criterion 10.7 (focus visible) in src/content/auditor/criteria/10.7-focus-visible.js
- [x] T031 [P] [US1] Implement RGAA criterion 11.1 (form labels) in src/content/auditor/criteria/11.1-form-labels.js
- [x] T032 [US1] Create content script entry point in src/content/content-script.js injecting audit engine
- [x] T033 [US1] Create Vue3 app entry in src/popup/main.js initializing Vue with i18n composable
- [x] T034 [US1] Create root Vue component in src/popup/App.vue with router and layout
- [x] T035 [US1] Create AuditSummary component in src/popup/components/AuditSummary.vue displaying pass/fail/manual counts
- [x] T036 [US1] Create CriterionList component in src/popup/components/CriterionList.vue with RGAA category grouping
- [x] T037 [US1] Create severity grouping logic in CriterionList.vue (A expanded, AA/AAA collapsed for 100+ violations)
- [x] T038 [US1] Create useAudit composable in src/popup/composables/useAudit.js managing audit state
- [x] T039 [P] [US1] Create useI18n composable in src/popup/composables/useI18n.js for French/English switching
- [x] T040 [US1] Implement element highlighter in src/content/highlighter.js with smooth scroll and 2-second pulse animation
- [x] T041 [US1] Add HIGHLIGHT_ELEMENT message handling to content script
- [x] T042 [US1] Add "Start Audit" button click handler in AuditSummary.vue sending START_AUDIT message
- [x] T043 [US1] Add progress indicator to AuditSummary.vue updating on AUDIT_PROGRESS messages
- [x] T044 [P] [US1] Implement keyboard navigation for CriterionList component (Tab, Enter, Arrow keys)
- [x] T045 [P] [US1] Add ARIA labels to all interactive elements in popup UI
- [x] T046 [US1] Add criterion click handler to expand/collapse details and highlight page elements
- [x] T046a [US1] Implement progressive scanning with progress indicators in audit engine for pages with 1000+ elements (FR-024)
- [x] T046b [US1] Add "Re-scan" button to AuditSummary for dynamically loaded content detection (FR-022)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Remediation Guidance (Priority: P2)

**Goal**: Provide detailed explanations, code snippets, and step-by-step remediation instructions for each failed criterion

**Independent Test**: Click any failed criterion, see plain language explanation, HTML snippet, before/after code examples, and severity level

### Tests for User Story 2

- [x] T047 [P] [US2] E2E test for user story 2 in tests/e2e/user-story-2.spec.js verifying remediation panel displays

### Implementation for User Story 2

- [x] T048 [P] [US2] Create CriterionDetail component in src/popup/components/CriterionDetail.vue for expanded criterion view
- [x] T049 [US2] Add official RGAA test procedure display to CriterionDetail.vue from bundled rgaa-criteria.json
- [x] T050 [US2] Add plain language summary section to CriterionDetail.vue with "why it matters" explanation
- [x] T051 [US2] Add code snippet display to CriterionDetail.vue showing problematic HTML with syntax highlighting
- [x] T052 [US2] Add CSS selector display for affected elements in CriterionDetail.vue
- [x] T053 [US2] Add remediation instructions section with before/after code examples to CriterionDetail.vue
- [x] T054 [US2] Add manual testing instructions for semi-automated criteria in CriterionDetail.vue
- [x] T055 [US2] Add severity badge (A, AA, AAA) with WCAG 2.1 mapping to CriterionDetail.vue
- [x] T056 [US2] Add link to official RGAA documentation (numerique.gouv.fr) for each criterion
- [x] T057 [P] [US2] Create remediation data structure in rgaa-criteria.json with fix examples
- [x] T058 [US2] Integrate CriterionDetail component into CriterionList expansion logic
- [x] T059 [P] [US2] Add keyboard navigation for CriterionDetail component (Esc to close, Tab through elements)
- [x] T060 [P] [US2] Ensure CriterionDetail component passes axe-core accessibility validation

**Checkpoint**: User Story 2 complete - users can understand violations and learn how to fix them

---

## Phase 5: User Story 3 - Export Reports (Priority: P3)

**Goal**: Allow users to export audit results as HTML, JSON, or CSV files for sharing and documentation

**Independent Test**: Complete audit, click Export button, select format, download file with complete audit data

### Tests for User Story 3

- [x] T061 [P] [US3] E2E test for user story 3 in tests/e2e/user-story-3.spec.js testing all export formats

### Implementation for User Story 3

- [x] T062 [P] [US3] Create ExportDialog component in src/popup/components/ExportDialog.vue with format selection
- [x] T063 [P] [US3] Implement HTML export generator in src/shared/utils/exporters/html-exporter.js
- [x] T064 [P] [US3] Implement JSON export generator in src/shared/utils/exporters/json-exporter.js
- [x] T065 [P] [US3] Implement CSV export generator in src/shared/utils/exporters/csv-exporter.js
- [x] T066 [US3] Add export button to AuditSummary component opening ExportDialog
- [x] T067 [US3] Implement file download trigger using browser.downloads API or Blob URLs
- [x] T068 [US3] Add audit metadata (timestamp, URL, RGAA version, extension version) to all export formats
- [x] T069 [US3] Create standalone HTML export template with embedded CSS for offline viewing
- [x] T070 [US3] Ensure JSON export includes full criterion results with violations array
- [x] T071 [US3] Ensure CSV export includes all required columns (criterion, status, severity, element count, description)
- [x] T072 [P] [US3] Add keyboard navigation for ExportDialog (Esc to cancel, Enter to confirm)
- [x] T073 [P] [US3] Add ARIA labels to export format radio buttons
- [x] T074 [US3] Test export file generation for typical audit (50 criteria, 100 violations)

**Checkpoint**: User Story 3 complete - users can export and share audit reports

---

## Phase 6: User Story 4 - Audit History (Priority: P4)

**Goal**: Enable users to view past audits, compare results over time, and track accessibility improvements

**Independent Test**: Run multiple audits on same URL, open history panel, select two audits to compare and see changes

### Tests for User Story 4

- [x] T075 [P] [US4] Unit test for differential storage in tests/unit/storage.test.js with delta computation
- [x] T076 [P] [US4] E2E test for user story 4 in tests/e2e/user-story-4.spec.js testing history and comparison

### Implementation for User Story 4

- [x] T077 [P] [US4] Create HistoryPanel component in src/popup/components/HistoryPanel.vue listing past audits
- [x] T078 [US4] Create useStorage composable in src/popup/composables/useStorage.js wrapping differential storage utils
- [x] T079 [US4] Implement saveAudit() function in useStorage composable detecting same-URL audits for delta storage
- [x] T080 [US4] Implement loadHistory() function in useStorage composable reconstructing full audits from deltas
- [x] T081 [US4] Implement computeDelta() function in storage.js using JSON Patch to calculate changes
- [x] T082 [US4] Implement applyDelta() function in storage.js to reconstruct full audit from base + patches
- [x] T083 [US4] Add history button to AuditSummary component opening HistoryPanel
- [x] T084 [US4] Display chronological audit list in HistoryPanel with date, time, pass/fail counts
- [x] T085 [US4] Add audit selection handler to load and display historical audit results
- [x] T086 [US4] Create ComparisonView component showing side-by-side diff of two audits
- [x] T087 [US4] Implement audit comparison logic highlighting newly passed, newly failed, and unchanged criteria
- [x] T088 [US4] Add "Clear History" button with confirmation dialog to HistoryPanel
- [x] T089 [US4] Implement storage quota monitoring warning at 80% full
- [x] T090 [US4] Implement automatic cleanup of oldest audits when approaching storage limits
- [x] T091 [P] [US4] Add keyboard navigation for HistoryPanel (Arrow keys to navigate list, Enter to select)
- [x] T092 [P] [US4] Ensure HistoryPanel passes axe-core accessibility validation

**Checkpoint**: User Story 4 complete - users can track audit history and measure improvements

---

## Phase 7: Complete RGAA 4.1.2 Criteria Implementation (106 critères)

**Purpose**: Implement all 106 RGAA 4.1.2 accessibility criteria for comprehensive audit coverage

**Note**: Each criterion can be implemented independently. Tasks marked [P] can run in parallel.

**Reference**: https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/

### Thématique 1: Images (9 critères)

- [x] T093 [P] Implement criterion 1.1: Image porteuse d'information avec alternative textuelle - `src/content/auditor/criteria/1.1-text-alt.js` _(already exists, verify completeness)_
- [x] T094 [P] Implement criterion 1.2: Image de décoration correctement ignorée - `src/content/auditor/criteria/1.2-decorative-images.js`
- [x] T095 [P] Implement criterion 1.3: Alternative textuelle pertinente - `src/content/auditor/criteria/1.3-relevant-alt.js`
- [x] T096 [P] Implement criterion 1.4: CAPTCHA/image-test avec alternative identifiant nature et fonction - `src/content/auditor/criteria/1.4-captcha-alt.js`
- [x] T097 [P] Implement criterion 1.5: CAPTCHA avec solution d'accès alternatif - `src/content/auditor/criteria/1.5-captcha-alternative.js`
- [x] T098 [P] Implement criterion 1.6: Image porteuse d'information avec description détaillée - `src/content/auditor/criteria/1.6-detailed-description.js`
- [x] T099 [P] Implement criterion 1.7: Description détaillée pertinente - `src/content/auditor/criteria/1.7-relevant-description.js`
- [x] T100 [P] Implement criterion 1.8: Image texte remplacée par texte stylé - `src/content/auditor/criteria/1.8-text-image.js`
- [x] T101 [P] Implement criterion 1.9: Légende d'image correctement reliée - `src/content/auditor/criteria/1.9-image-caption.js`

### Thématique 2: Cadres (2 critères)

- [x] T102 [P] Implement criterion 2.1: Cadre avec titre de cadre - `src/content/auditor/criteria/2.1-frame-title.js`
- [x] T103 [P] Implement criterion 2.2: Titre de cadre pertinent - `src/content/auditor/criteria/2.2-frame-title-relevant.js`

### Thématique 3: Couleurs (3 critères)

- [x] T104 [P] Implement criterion 3.1: Information non donnée uniquement par la couleur - `src/content/auditor/criteria/3.1-color-info.js`
- [x] T105 [P] Implement criterion 3.2: Contraste texte/arrière-plan suffisant - `src/content/auditor/criteria/3.2-contrast.js` _(already exists, verify completeness)_
- [x] T106 [P] Implement criterion 3.3: Contraste composants d'interface suffisant - `src/content/auditor/criteria/3.3-ui-contrast.js`

### Thématique 4: Multimédia (13 critères)

- [x] T107 [P] Implement criterion 4.1: Média temporel avec transcription/audiodescription - `src/content/auditor/criteria/4.1-media-transcript.js`
- [x] T108 [P] Implement criterion 4.2: Transcription/audiodescription pertinente - `src/content/auditor/criteria/4.2-transcript-relevant.js`
- [x] T109 [P] Implement criterion 4.3: Sous-titres synchronisés - `src/content/auditor/criteria/4.3-subtitles.js`
- [x] T110 [P] Implement criterion 4.4: Sous-titres pertinents - `src/content/auditor/criteria/4.4-subtitles-relevant.js`
- [x] T111 [P] Implement criterion 4.5: Audiodescription synchronisée - `src/content/auditor/criteria/4.5-audio-description.js`
- [x] T112 [P] Implement criterion 4.6: Audiodescription pertinente - `src/content/auditor/criteria/4.6-audio-description-relevant.js`
- [x] T113 [P] Implement criterion 4.7: Média temporel clairement identifiable - `src/content/auditor/criteria/4.7-media-identifiable.js`
- [x] T114 [P] Implement criterion 4.8: Média non temporel avec alternative - `src/content/auditor/criteria/4.8-non-temporal-alt.js`
- [x] T115 [P] Implement criterion 4.9: Alternative média non temporel pertinente - `src/content/auditor/criteria/4.9-non-temporal-alt-relevant.js`
- [x] T116 [P] Implement criterion 4.10: Son déclenché automatiquement contrôlable - `src/content/auditor/criteria/4.10-auto-sound.js`
- [x] T117 [P] Implement criterion 4.11: Média temporel contrôlable clavier/pointage - `src/content/auditor/criteria/4.11-media-keyboard.js`
- [x] T118 [P] Implement criterion 4.12: Média non temporel contrôlable clavier/pointage - `src/content/auditor/criteria/4.12-non-temporal-keyboard.js`
- [x] T119 [P] Implement criterion 4.13: Média compatible technologies d'assistance - `src/content/auditor/criteria/4.13-media-at-compatible.js`

### Thématique 5: Tableaux (8 critères)

- [x] T120 [P] Implement criterion 5.1: Tableau de données complexe avec résumé - `src/content/auditor/criteria/5.1-table-summary.js`
- [x] T121 [P] Implement criterion 5.2: Résumé de tableau pertinent - `src/content/auditor/criteria/5.2-table-summary-relevant.js`
- [x] T122 [P] Implement criterion 5.3: Tableau de mise en forme linéarisé compréhensible - `src/content/auditor/criteria/5.3-layout-table.js`
- [x] T123 [P] Implement criterion 5.4: Titre de tableau correctement associé - `src/content/auditor/criteria/5.4-table-title.js`
- [x] T124 [P] Implement criterion 5.5: Titre de tableau pertinent - `src/content/auditor/criteria/5.5-table-title-relevant.js`
- [x] T125 [P] Implement criterion 5.6: En-têtes de colonne/ligne correctement déclarés - `src/content/auditor/criteria/5.6-table-headers.js`
- [x] T126 [P] Implement criterion 5.7: Association cellules/en-têtes appropriée - `src/content/auditor/criteria/5.7-table-cells-headers.js`
- [x] T127 [P] Implement criterion 5.8: Tableau de mise en forme sans éléments de tableau de données - `src/content/auditor/criteria/5.8-layout-table-no-data.js`

### Thématique 6: Liens (2 critères)

- [x] T128 [P] Implement criterion 6.1: Lien explicite - `src/content/auditor/criteria/6.1-link-explicit.js`
- [x] T129 [P] Implement criterion 6.2: Lien avec intitulé - `src/content/auditor/criteria/6.2-link-label.js`

### Thématique 7: Scripts (5 critères)

- [x] T130 [P] Implement criterion 7.1: Script compatible technologies d'assistance - `src/content/auditor/criteria/7.1-script-at-compatible.js`
- [x] T131 [P] Implement criterion 7.2: Alternative à script pertinente - `src/content/auditor/criteria/7.2-script-alternative.js`
- [x] T132 [P] Implement criterion 7.3: Script contrôlable clavier/pointage - `src/content/auditor/criteria/7.3-script-keyboard.js`
- [x] T133 [P] Implement criterion 7.4: Changement de contexte contrôlé - `src/content/auditor/criteria/7.4-context-change.js`
- [x] T134 [P] Implement criterion 7.5: Messages de statut restitués - `src/content/auditor/criteria/7.5-status-messages.js`

### Thématique 8: Éléments obligatoires (10 critères)

- [x] T135 [P] Implement criterion 8.1: Page définie par type de document - `src/content/auditor/criteria/8.1-doctype.js`
- [x] T136 [P] Implement criterion 8.2: Code source valide - `src/content/auditor/criteria/8.2-valid-html.js` _(already exists, verify completeness)_
- [x] T137 [P] Implement criterion 8.3: Langue par défaut présente - `src/content/auditor/criteria/8.3-default-lang.js`
- [x] T138 [P] Implement criterion 8.4: Code de langue pertinent - `src/content/auditor/criteria/8.4-lang-code-relevant.js`
- [x] T139 [P] Implement criterion 8.5: Titre de page présent - `src/content/auditor/criteria/8.5-page-title.js`
- [x] T140 [P] Implement criterion 8.6: Titre de page pertinent - `src/content/auditor/criteria/8.6-page-title-relevant.js`
- [x] T141 [P] Implement criterion 8.7: Changement de langue indiqué - `src/content/auditor/criteria/8.7-lang-change.js`
- [x] T142 [P] Implement criterion 8.8: Code de langue changement valide et pertinent - `src/content/auditor/criteria/8.8-lang-change-valid.js`
- [x] T143 [P] Implement criterion 8.9: Balises non utilisées uniquement pour présentation - `src/content/auditor/criteria/8.9-semantic-markup.js`
- [x] T144 [P] Implement criterion 8.10: Changements de sens de lecture signalés - `src/content/auditor/criteria/8.10-reading-direction.js`

### Thématique 9: Structuration de l'information (4 critères)

- [x] T145 [P] Implement criterion 9.1: Information structurée par titres - `src/content/auditor/criteria/9.1-headings.js`
- [x] T146 [P] Implement criterion 9.2: Structure du document cohérente - `src/content/auditor/criteria/9.2-document-structure.js`
- [x] T147 [P] Implement criterion 9.3: Listes correctement structurées - `src/content/auditor/criteria/9.3-lists.js`
- [x] T148 [P] Implement criterion 9.4: Citations correctement indiquées - `src/content/auditor/criteria/9.4-quotes.js`

### Thématique 10: Présentation de l'information (14 critères)

- [x] T149 [P] Implement criterion 10.1: Feuilles de styles pour présentation - `src/content/auditor/criteria/10.1-css-presentation.js`
- [x] T150 [P] Implement criterion 10.2: Contenu visible sans CSS - `src/content/auditor/criteria/10.2-content-without-css.js`
- [x] T151 [P] Implement criterion 10.3: Information compréhensible sans CSS - `src/content/auditor/criteria/10.3-info-without-css.js`
- [x] T152 [P] Implement criterion 10.4: Texte lisible à 200% - `src/content/auditor/criteria/10.4-text-resize.js`
- [x] T153 [P] Implement criterion 10.5: Déclarations CSS couleurs correctes - `src/content/auditor/criteria/10.5-css-colors.js`
- [x] T154 [P] Implement criterion 10.6: Lien visible par rapport au texte - `src/content/auditor/criteria/10.6-link-visible.js`
- [x] T155 [P] Implement criterion 10.7: Focus visible - `src/content/auditor/criteria/10.7-focus-visible.js` _(already exists, verify completeness)_
- [x] T156 [P] Implement criterion 10.8: Contenus cachés ignorés par technologies d'assistance - `src/content/auditor/criteria/10.8-hidden-content.js`
- [x] T157 [P] Implement criterion 10.9: Information non donnée par forme/taille/position - `src/content/auditor/criteria/10.9-sensory-info.js`
- [x] T158 [P] Implement criterion 10.10: Information forme/taille/position implémentée de façon pertinente - `src/content/auditor/criteria/10.10-sensory-info-relevant.js`
- [x] T159 [P] Implement criterion 10.11: Contenu sans défilement horizontal/vertical (reflow) - `src/content/auditor/criteria/10.11-reflow.js`
- [x] T160 [P] Implement criterion 10.12: Propriétés d'espacement du texte redéfinissables - `src/content/auditor/criteria/10.12-text-spacing.js`
- [x] T161 [P] Implement criterion 10.13: Contenus additionnels au focus/survol contrôlables - `src/content/auditor/criteria/10.13-hover-focus-content.js`
- [x] T162 [P] Implement criterion 10.14: Contenus additionnels CSS visibles au clavier - `src/content/auditor/criteria/10.14-css-content-keyboard.js`

### Thématique 11: Formulaires (13 critères)

- [x] T163 [P] Implement criterion 11.1: Champ de formulaire avec étiquette - `src/content/auditor/criteria/11.1-form-labels.js` _(already exists, verify completeness)_
- [x] T164 [P] Implement criterion 11.2: Étiquette de champ pertinente - `src/content/auditor/criteria/11.2-label-relevant.js`
- [x] T165 [P] Implement criterion 11.3: Étiquettes cohérentes - `src/content/auditor/criteria/11.3-labels-consistent.js`
- [x] T166 [P] Implement criterion 11.4: Étiquette et champ accolés - `src/content/auditor/criteria/11.4-label-proximity.js`
- [x] T167 [P] Implement criterion 11.5: Champs de même nature regroupés - `src/content/auditor/criteria/11.5-field-grouping.js`
- [x] T168 [P] Implement criterion 11.6: Regroupement avec légende - `src/content/auditor/criteria/11.6-fieldset-legend.js`
- [x] T169 [P] Implement criterion 11.7: Légende de regroupement pertinente - `src/content/auditor/criteria/11.7-legend-relevant.js`
- [x] T170 [P] Implement criterion 11.8: Items de liste de choix regroupés - `src/content/auditor/criteria/11.8-optgroup.js`
- [x] T171 [P] Implement criterion 11.9: Intitulé de bouton pertinent - `src/content/auditor/criteria/11.9-button-label.js`
- [x] T172 [P] Implement criterion 11.10: Contrôle de saisie pertinent - `src/content/auditor/criteria/11.10-input-validation.js`
- [x] T173 [P] Implement criterion 11.11: Suggestions de correction d'erreurs - `src/content/auditor/criteria/11.11-error-suggestions.js`
- [x] T174 [P] Implement criterion 11.12: Données modifiables/récupérables - `src/content/auditor/criteria/11.12-data-recovery.js`
- [x] T175 [P] Implement criterion 11.13: Finalité de champ déductible (autocomplete) - `src/content/auditor/criteria/11.13-autocomplete.js`

### Thématique 12: Navigation (11 critères)

- [x] T176 [P] Implement criterion 12.1: Deux systèmes de navigation au moins - `src/content/auditor/criteria/12.1-navigation-systems.js`
- [x] T177 [P] Implement criterion 12.2: Menu/barres de navigation à la même place - `src/content/auditor/criteria/12.2-consistent-navigation.js`
- [x] T178 [P] Implement criterion 12.3: Page plan du site pertinente - `src/content/auditor/criteria/12.3-sitemap-relevant.js`
- [x] T179 [P] Implement criterion 12.4: Plan du site accessible de façon identique - `src/content/auditor/criteria/12.4-sitemap-accessible.js`
- [x] T180 [P] Implement criterion 12.5: Moteur de recherche atteignable de façon identique - `src/content/auditor/criteria/12.5-search-accessible.js`
- [x] T181 [P] Implement criterion 12.6: Zones de regroupement atteignables/évitables - `src/content/auditor/criteria/12.6-landmark-regions.js`
- [x] T182 [P] Implement criterion 12.7: Lien d'évitement/accès rapide au contenu principal - `src/content/auditor/criteria/12.7-skip-link.js`
- [x] T183 [P] Implement criterion 12.8: Ordre de tabulation cohérent - `src/content/auditor/criteria/12.8-tab-order.js`
- [x] T184 [P] Implement criterion 12.9: Pas de piège au clavier - `src/content/auditor/criteria/12.9-keyboard-trap.js`
- [x] T185 [P] Implement criterion 12.10: Raccourcis clavier une touche contrôlables - `src/content/auditor/criteria/12.10-shortcut-keys.js`
- [x] T186 [P] Implement criterion 12.11: Contenus additionnels atteignables au clavier - `src/content/auditor/criteria/12.11-additional-content-keyboard.js`

### Thématique 13: Consultation (12 critères)

- [x] T187 [P] Implement criterion 13.1: Limite de temps contrôlable - `src/content/auditor/criteria/13.1-time-limit.js`
- [x] T188 [P] Implement criterion 13.2: Pas d'ouverture de nouvelle fenêtre sans action utilisateur - `src/content/auditor/criteria/13.2-auto-update.js`
- [x] T189 [P] Implement criterion 13.3: Document bureautique avec version accessible - `src/content/auditor/criteria/13.3-moving-content.js`
- [x] T190 [P] Implement criterion 13.4: Version accessible offre même information - `src/content/auditor/criteria/13.4-scrolling-content.js`
- [x] T191 [P] Implement criterion 13.5: Contenu cryptique avec alternative - `src/content/auditor/criteria/13.5-media-autoplay.js`
- [x] T192 [P] Implement criterion 13.6: Alternative contenu cryptique pertinente - `src/content/auditor/criteria/13.6-auto-opening.js`
- [x] T193 [P] Implement criterion 13.7: Changements brusques de luminosité/flash corrects - `src/content/auditor/criteria/13.7-document-format.js`
- [x] T194 [P] Implement criterion 13.8: Contenu en mouvement/clignotant contrôlable - `src/content/auditor/criteria/13.8-document-alternative.js`
- [x] T195 [P] Implement criterion 13.9: Contenu consultable quelle que soit l'orientation - `src/content/auditor/criteria/13.9-orientation.js`
- [x] T196 [P] Implement criterion 13.10: Gestes complexes avec alternative simple - `src/content/auditor/criteria/13.10-horizontal-scroll.js`
- [x] T197 [P] Implement criterion 13.11: Actions pointeur annulables - `src/content/auditor/criteria/13.11-gesture-alternative.js`
- [x] T198 [P] Implement criterion 13.12: Fonctionnalités mouvement avec alternative - `src/content/auditor/criteria/13.12-motion-alternative.js`

**Checkpoint**: 100% RGAA 4.1.2 criteria coverage (106 criteria implemented)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, performance optimization, and quality assurance

- [x] T199 Implement WarningBanner component in src/popup/components/WarningBanner.vue for iframe/error messages
- [x] T200 Add cross-origin iframe detection and warning banner display with frame URLs
- [x] T201 Implement violation instance limiting (first 100 per criterion with aggregate counts)
- [x] T202 Add Content Security Policy validation ensuring no eval() or unsafe-inline
- [x] T203 Optimize Vue3 bundle size using tree-shaking and component lazy loading
- [x] T204 Create test fixtures in tests/fixtures/ (accessible-page.html, violations-page.html)
- [x] T205 Implement cross-browser E2E tests in tests/integration/cross-browser.test.js
- [x] T206 Run axe-core validation on all popup components in tests/unit/accessibility.test.js
- [ ] T207 Perform manual screen reader testing (NVDA/JAWS) and document results
- [ ] T208 Benchmark audit performance on typical pages (target <5 seconds for 500-1000 elements)
- [ ] T209 Verify zero network requests after installation using browser DevTools
- [ ] T210 Test extension loading in Firefox 115+ and Chrome 120+
- [x] T211 Create README.md with installation instructions for both browsers
- [x] T212 Generate final bundle and verify size <3MB total
- [ ] T213 Run full test suite (unit + integration + E2E) on both browsers
- [x] T214 Create user documentation for quickstart.md
- [ ] T215 Package extension for distribution (.zip for Firefox AMO, Chrome Web Store)

---

## Phase 9: Performance Optimization

**Purpose**: Optimize bundle size, runtime performance, and memory efficiency for better user experience

### Bundle & Build Optimization

- [ ] T216 [P] Configure Vite rollupOptions to split chunks for content script vs popup (separate bundles)
- [ ] T217 [P] Implement dynamic imports for criterion checkers in engine.js (lazy load by topic)
- [ ] T218 [P] Minify rgaa-criteria.js data by removing duplicate strings and using numeric keys
- [x] T219 [P] Add terser plugin configuration for better minification of criteria functions
- [ ] T220 [P] Configure Vite manualChunks to separate Vue runtime from application code
- [ ] T221 Analyze bundle with rollup-plugin-visualizer and document optimization opportunities

### Runtime Performance

- [ ] T222 Implement Web Worker for heavy audit computations in src/content/auditor/worker.js
- [x] T223 Add requestIdleCallback scheduling for non-critical DOM traversals in dom-inspector.js
- [x] T224 [P] Implement memoization cache for getComputedStyles results in dom-inspector.js
- [ ] T225 [P] Add IntersectionObserver-based visibility checks to replace offsetWidth/Height checks
- [ ] T226 Batch DOM queries by selector type in queryAllDeep to reduce layout thrashing
- [x] T227 [P] Implement element result caching to avoid re-auditing unchanged DOM nodes
- [x] T228 Add performance marks/measures in engine.js for Chrome DevTools profiling

### Memory Optimization

- [x] T229 [P] Implement WeakMap-based element cache to allow garbage collection
- [x] T230 Limit violation detail storage (store only selector, not full HTML for large elements)
- [x] T231 [P] Add memory cleanup after audit completion (clear intermediate results)
- [ ] T232 Implement streaming results to popup instead of buffering full audit

### UI Performance

- [ ] T233 Implement virtual scrolling for CriterionList when >50 criteria displayed
- [x] T234 [P] Add debounce (150ms) to filter toggles in useAudit.js
- [x] T235 [P] Lazy load CriterionDetail component on first expansion
- [x] T236 [P] Implement CSS containment (contain: content) for criterion items
- [x] T237 Use Vue3 v-memo directive for criterion list items to prevent re-renders

**Checkpoint**: Performance targets - <3s audit for 500 elements, <100ms filter response, <2MB bundle

---

## Phase 10: Accessibility Enhancement

**Purpose**: Ensure extension UI exceeds WCAG 2.1 AA requirements and provides excellent screen reader experience

### Live Regions & Announcements

- [x] T238 Add aria-live="polite" region in AuditSummary.vue for audit status changes
- [x] T239 [P] Implement screen reader announcements for progress bar updates (every 25%)
- [x] T240 [P] Add aria-live="assertive" for error messages in audit flow
- [x] T241 Announce filter state changes to screen readers in CriterionList.vue
- [x] T242 [P] Add visually hidden "audit complete" announcement with result summary

### Focus Management

- [x] T243 Implement proper focus trap in ExportDialog.vue with inert attribute on background
- [x] T244 [P] Add focus restoration when closing HistoryPanel (return to trigger button)
- [x] T245 Return focus to expanded criterion when closing CriterionDetail panel
- [x] T246 [P] Implement roving tabindex for criterion list navigation (Arrow keys)
- [x] T247 Add focus visible outline using :focus-visible for all interactive elements

### Keyboard Navigation

- [x] T248 Add skip link at top of popup to jump to results section
- [x] T249 [P] Implement Escape key handler at App.vue level for closing all dialogs
- [x] T250 [P] Add Home/End key support in CriterionList for jumping to first/last item
- [x] T251 Implement keyboard shortcut hints in tooltips (e.g., "Press Enter to expand")
- [x] T252 [P] Add Page Up/Down support for scrolling criterion list

### Screen Reader Improvements

- [x] T253 Add aria-describedby to connect criterion badges with explanatory text
- [x] T254 [P] Improve button accessible names to include current state (e.g., "Filter by failed: active")
- [x] T255 [P] Add role="group" with aria-label to summary cards section
- [x] T256 Use aria-current="true" for currently selected/expanded criterion
- [x] T257 [P] Add aria-busy="true" to results container during audit

### High Contrast & Visual Accessibility

- [x] T258 [P] Add prefers-reduced-motion media query to disable highlight animations
- [x] T259 Test and fix all components in Windows High Contrast Mode
- [x] T260 [P] Ensure focus indicators meet 3:1 contrast ratio in all color schemes
- [x] T261 [P] Add prefers-contrast media query support for enhanced contrast mode
- [x] T262 Verify color-only information has additional visual indicators (icons/patterns)

### Documentation & Testing

- [x] T263 Create accessibility testing checklist for popup UI in tests/a11y-checklist.md
- [ ] T264 [P] Add automated ARIA validation tests using axe-core for all new components
- [x] T265 Document keyboard shortcuts in extension help/about section
- [ ] T266 [P] Create screen reader testing script with expected announcements

**Checkpoint**: Extension UI passes WCAG 2.1 AA, verified with NVDA, VoiceOver, and axe-core

---

## Dependencies & Execution Strategy

### Dependency Graph (User Story Completion Order)

```text
Phase 1 (Setup) → Phase 2 (Foundation)
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
    Phase 3 (US1)    Phase 7         Phase 8
        ↓            (Criteria)      (Polish)
    Phase 4 (US2)        ↓                ↓
        ↓                └────────┬───────┘
    Phase 5 (US3)                 ↓
        ↓                ┌────────┴────────┐
    Phase 6 (US4)        ↓                 ↓
                    Phase 9            Phase 10
                  (Performance)     (Accessibility)
```

**Critical Path**: Setup → Foundation → US1 → US2 → US3 → US4 → Polish → Performance/Accessibility

**Parallel Opportunities**:

- Phase 7 criteria implementation can start after Phase 2 completion (106 independent tasks)
- US2, US3, US4 are independent (can be worked on by different developers)
- Phase 9 and Phase 10 can run in parallel after Phase 8
- All [P] marked tasks within a phase can run in parallel

### Parallel Execution Examples

**Phase 1 Setup** (11 tasks, ~8 parallelizable):

- Sequential: T001, T002
- Parallel batch 1: T003, T004, T005, T006
- Sequential: T007, T008
- Parallel batch 2: T009, T010, T011

**Phase 2 Foundation** (11 tasks, ~7 parallelizable):

- Sequential: T012
- Parallel batch 1: T013, T014, T015, T017, T020, T022
- Sequential: T016, T018, T019, T021

**Phase 3 US1** (26 tasks, ~11 parallelizable):

- Parallel batch 1 (tests): T023, T024, T025
- Parallel batch 2 (criteria): T027, T028, T029, T030, T031
- Sequential core: T026, T032, T033, T034
- Sequential UI: T035, T036, T037, T038
- Parallel batch 3: T039, T040, T044, T045
- Sequential integration: T041, T042, T043, T046, T046a, T046b

**Phase 7 Criteria** (106 tasks, all parallelizable):

- Can assign T093-T198 to different developers simultaneously
- Each criterion module is completely independent
- Organized by thematic (13 themes, 106 criteria total)

### Implementation Strategy

**MVP Scope** (Recommended first delivery):

- Phase 1: Setup (T001-T011) - 11 tasks
- Phase 2: Foundation (T012-T022) - 11 tasks
- Phase 3: User Story 1 (T023-T046b) - 26 tasks (includes progressive scanning and re-scan)
- Subset of Phase 7: Implement 10-15 high-priority criteria from any thematic

**Estimated MVP**: ~54-61 tasks to working audit extension with core functionality including baseline 5 automated criteria (T027-T031) expandable to additional criteria from Phase 7

**Post-MVP Increments**:

1. US2 Remediation (T047-T060) - adds educational value
2. US3 Export (T061-T074) - enables professional workflows
3. Phase 7 criteria (T093-T198) - implement progressively to reach 100% coverage
4. US4 History (T075-T092) - enables progress tracking
5. Polish (T199-T215) - production-ready quality
6. Performance Optimization (T216-T237) - enhanced user experience
7. Accessibility Enhancement (T238-T266) - WCAG 2.1 AA+ compliance

---

## Task Statistics

- **Total Tasks**: 266
- **Setup Phase**: 11 tasks
- **Foundation Phase**: 11 tasks
- **User Story 1 (P1)**: 26 tasks (includes progressive scanning and re-scan)
- **User Story 2 (P2)**: 14 tasks
- **User Story 3 (P3)**: 14 tasks
- **User Story 4 (P4)**: 18 tasks
- **RGAA Criteria (Phase 7)**: 106 tasks (106 criteria, one task per criterion)
  - Thématique 1 (Images): 9 critères
  - Thématique 2 (Cadres): 2 critères
  - Thématique 3 (Couleurs): 3 critères
  - Thématique 4 (Multimédia): 13 critères
  - Thématique 5 (Tableaux): 8 critères
  - Thématique 6 (Liens): 2 critères
  - Thématique 7 (Scripts): 5 critères
  - Thématique 8 (Éléments obligatoires): 10 critères
  - Thématique 9 (Structuration): 4 critères
  - Thématique 10 (Présentation): 14 critères
  - Thématique 11 (Formulaires): 13 critères
  - Thématique 12 (Navigation): 11 critères
  - Thématique 13 (Consultation): 12 critères
- **Polish Phase**: 17 tasks
- **Performance Optimization Phase**: 22 tasks
- **Accessibility Enhancement Phase**: 29 tasks

**Parallelizable Tasks**: 179 marked with [P] (67% can run in parallel)

**Estimated Timeline** (single developer, 8 hours/day):

- MVP (Phases 1-3 + subset Phase 7): 2-3 weeks
- Full implementation (all phases): 10-14 weeks
- With 3 developers (parallel work): 5-7 weeks total
