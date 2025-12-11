# Accessibility Testing Checklist for RGAA Copilot Popup UI

**Purpose**: Validate that the extension UI meets WCAG 2.1 AA requirements
**Version**: 0.1.0
**Last Updated**: 2025-12-11

## Keyboard Navigation

### General Navigation

- [ ] Tab key moves focus through all interactive elements in logical order
- [ ] Shift+Tab moves focus backwards through interactive elements
- [ ] All interactive elements are reachable via keyboard
- [ ] Focus never gets trapped in any component
- [ ] Skip link is present and functional (jumps to results section)

### Component-Specific Navigation

#### AuditSummary

- [ ] Start Audit button is focusable and activatable with Enter/Space
- [ ] Export button is focusable and activatable with Enter/Space
- [ ] Filter cards (Pass/Fail/Manual) are keyboard accessible
- [ ] Filter cards announce pressed state to screen readers

#### CriterionList

- [ ] Arrow Up/Down navigates between criteria
- [ ] Home/End keys jump to first/last criterion
- [ ] Page Up/Down scrolls through list (5 items at a time)
- [ ] Enter/Space expands/collapses criterion details
- [ ] Focus returns to criterion header after closing detail panel

#### ExportDialog

- [ ] Tab cycles through dialog elements only (focus trap)
- [ ] Escape closes dialog
- [ ] Focus moves to close button when dialog opens
- [ ] Radio buttons navigable with Arrow keys
- [ ] Enter on radio button triggers download

#### HistoryPanel

- [ ] Arrow keys navigate audit list
- [ ] Enter/Space selects an audit
- [ ] Escape closes panel
- [ ] Focus returns to history button when panel closes

## Focus Indicators

- [ ] All interactive elements show visible focus indicator
- [ ] Focus indicator is at least 3px wide
- [ ] Focus indicator has at least 3:1 contrast ratio
- [ ] Focus indicator visible in high contrast mode
- [ ] Focus-visible pseudo-class used appropriately

## Screen Reader Support

### Live Regions

- [ ] Audit progress announced at 25%, 50%, 75% milestones
- [ ] Audit completion announced with result summary
- [ ] Error messages announced immediately (assertive)
- [ ] Filter state changes announced (polite)

### Semantic Structure

- [ ] Main content has role="main"
- [ ] Dialog components have role="dialog" and aria-modal="true"
- [ ] Lists have appropriate role (listbox for criterion list)
- [ ] Buttons have descriptive accessible names
- [ ] Progress bar has proper aria-valuenow/min/max

### ARIA Labels

- [ ] All icon-only buttons have aria-label
- [ ] Summary cards have aria-describedby for explanatory text
- [ ] Filter buttons include current state in accessible name
- [ ] Criterion items announce expansion state
- [ ] aria-current="true" for selected/expanded items

## Color and Contrast

- [ ] All text meets 4.5:1 contrast ratio
- [ ] Large text meets 3:1 contrast ratio
- [ ] UI components meet 3:1 contrast ratio
- [ ] Information not conveyed by color alone (icons/patterns present)
- [ ] Pass/Fail/Manual status indicated by icons, not just color

## Motion and Animation

- [ ] Animations respect prefers-reduced-motion
- [ ] No content flashes more than 3 times per second
- [ ] Spinner animation can be disabled

## High Contrast Mode

- [ ] All components visible in Windows High Contrast Mode
- [ ] prefers-contrast media query supported
- [ ] Border widths increased in high contrast mode
- [ ] Focus indicators more prominent in high contrast mode

## Touch and Pointer

- [ ] Touch targets at least 44x44px
- [ ] No reliance on hover-only interactions
- [ ] Click/tap areas match visual boundaries

## Text and Zoom

- [ ] Text remains readable at 200% zoom
- [ ] No horizontal scrolling at 320px width
- [ ] Text spacing can be adjusted without breaking layout

## Testing Tools

### Automated

- [ ] Run axe-core on all popup components
- [ ] Run Lighthouse accessibility audit
- [ ] Validate HTML with W3C validator

### Manual Screen Reader Testing

- [ ] NVDA on Windows
- [ ] JAWS on Windows
- [ ] VoiceOver on macOS (optional)

### Manual Testing Scenarios

1. Complete audit flow using only keyboard
2. Navigate results using only screen reader
3. Export report using only keyboard
4. View history and compare audits using only keyboard
5. Change language and verify announcements

## Expected Screen Reader Announcements

### Starting Audit

1. "Start Audit button" (button name)
2. "Audit in progress" (live region)
3. "Audit 25% complete" (at 25%)
4. "Audit 50% complete" (at 50%)
5. "Audit 75% complete" (at 75%)
6. "Audit complete. X passed, Y failed, Z require manual check" (completion)

### Filtering Results

1. "Passed: X. Toggle filter. Active/Inactive" (button name + state)
2. "Filter by passed: active" (announcement on toggle)

### Expanding Criterion

1. "1.1 - Text alternatives - Failed, collapsed" (initial state)
2. "expanded" (after expansion)
3. Focus moves to detail panel content

### Export Dialog

1. "Export Report dialog" (dialog title)
2. "Close button" (first focusable element)
3. "Format selection, HTML selected" (radio group)
4. "Download button" (action button)

## Sign-Off

| Tester | Date | Browser | Screen Reader | Result |
| ------ | ---- | ------- | ------------- | ------ |
|        |      | Firefox |               |        |
|        |      | Chrome  |               |        |
|        |      | Firefox | NVDA          |        |
|        |      | Chrome  | NVDA          |        |
|        |      | Firefox | JAWS          |        |
|        |      | Chrome  | JAWS          |        |

## Notes

_Add any testing notes, discovered issues, or exceptions here._
