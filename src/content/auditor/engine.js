/**
 * RGAA Audit Engine Orchestrator
 * Coordinates execution of all 106 RGAA 4.1 criterion checks
 */

import { getAutomatedCriteria } from "@/shared/data/rgaa-criteria.js"
import { getIframeSummary } from "./iframe-detector.js"

// Topic 1: Images (9 criteria)
import { checkCriterion11 } from "./criteria/1.1-text-alt.js"
import { checkCriterion12 } from "./criteria/1.2-decorative-images.js"
import { checkCriterion13 } from "./criteria/1.3-relevant-alt.js"
import { checkCriterion14 } from "./criteria/1.4-captcha-alt.js"
import { checkCriterion15 } from "./criteria/1.5-captcha-alternative.js"
import { checkCriterion16 } from "./criteria/1.6-detailed-description.js"
import { checkCriterion17 } from "./criteria/1.7-relevant-description.js"
import { checkCriterion18 } from "./criteria/1.8-text-image.js"
import { checkCriterion19 } from "./criteria/1.9-image-caption.js"

// Topic 2: Frames (2 criteria)
import { checkCriterion21 } from "./criteria/2.1-frame-title.js"
import { checkCriterion22 } from "./criteria/2.2-frame-title-relevant.js"

// Topic 3: Colors (3 criteria)
import { checkCriterion31 } from "./criteria/3.1-color-info.js"
import { checkCriterion32 } from "./criteria/3.2-contrast.js"
import { checkCriterion33 } from "./criteria/3.3-ui-contrast.js"

// Topic 4: Multimedia (13 criteria)
import { checkCriterion41 } from "./criteria/4.1-media-transcript.js"
import { checkCriterion42 } from "./criteria/4.2-transcript-relevant.js"
import { checkCriterion43 } from "./criteria/4.3-subtitles.js"
import { checkCriterion44 } from "./criteria/4.4-subtitles-relevant.js"
import { checkCriterion45 } from "./criteria/4.5-audio-description.js"
import { checkCriterion46 } from "./criteria/4.6-audio-description-relevant.js"
import { checkCriterion47 } from "./criteria/4.7-media-identifiable.js"
import { checkCriterion48 } from "./criteria/4.8-non-temporal-alt.js"
import { checkCriterion49 } from "./criteria/4.9-non-temporal-alt-relevant.js"
import { checkCriterion410 } from "./criteria/4.10-auto-sound.js"
import { checkCriterion411 } from "./criteria/4.11-media-keyboard.js"
import { checkCriterion412 } from "./criteria/4.12-non-temporal-keyboard.js"
import { checkCriterion413 } from "./criteria/4.13-media-at-compatible.js"

// Topic 5: Tables (8 criteria)
import { checkCriterion51 } from "./criteria/5.1-table-summary.js"
import { checkCriterion52 } from "./criteria/5.2-table-summary-relevant.js"
import { checkCriterion53 } from "./criteria/5.3-layout-table.js"
import { checkCriterion54 } from "./criteria/5.4-table-title.js"
import { checkCriterion55 } from "./criteria/5.5-table-title-relevant.js"
import { checkCriterion56 } from "./criteria/5.6-table-headers.js"
import { checkCriterion57 } from "./criteria/5.7-table-cells-headers.js"
import { checkCriterion58 } from "./criteria/5.8-layout-table-no-data.js"

// Topic 6: Links (2 criteria)
import { checkCriterion61 } from "./criteria/6.1-link-explicit.js"
import { checkCriterion62 } from "./criteria/6.2-link-label.js"

// Topic 7: Scripts (5 criteria)
import { checkCriterion71 } from "./criteria/7.1-script-at-compatible.js"
import { checkCriterion72 } from "./criteria/7.2-script-alternative.js"
import { checkCriterion73 } from "./criteria/7.3-script-keyboard.js"
import { checkCriterion74 } from "./criteria/7.4-context-change.js"
import { checkCriterion75 } from "./criteria/7.5-status-messages.js"

// Topic 8: Mandatory Elements (10 criteria)
import { checkCriterion81 } from "./criteria/8.1-doctype.js"
import { checkCriterion82 } from "./criteria/8.2-valid-html.js"
import { checkCriterion83 } from "./criteria/8.3-default-lang.js"
import { checkCriterion84 } from "./criteria/8.4-lang-code-relevant.js"
import { checkCriterion85 } from "./criteria/8.5-page-title.js"
import { checkCriterion86 } from "./criteria/8.6-page-title-relevant.js"
import { checkCriterion87 } from "./criteria/8.7-lang-change.js"
import { checkCriterion88 } from "./criteria/8.8-lang-change-valid.js"
import { checkCriterion89 } from "./criteria/8.9-semantic-markup.js"
import { checkCriterion810 } from "./criteria/8.10-reading-direction.js"

// Topic 9: Structure (4 criteria)
import { checkCriterion91 } from "./criteria/9.1-headings.js"
import { checkCriterion92 } from "./criteria/9.2-document-structure.js"
import { checkCriterion93 } from "./criteria/9.3-lists.js"
import { checkCriterion94 } from "./criteria/9.4-quotes.js"

// Topic 10: Presentation (14 criteria)
import { checkCriterion101 } from "./criteria/10.1-css-presentation.js"
import { checkCriterion102 } from "./criteria/10.2-content-without-css.js"
import { checkCriterion103 } from "./criteria/10.3-info-without-css.js"
import { checkCriterion104 } from "./criteria/10.4-text-resize.js"
import { checkCriterion105 } from "./criteria/10.5-css-colors.js"
import { checkCriterion106 } from "./criteria/10.6-link-visible.js"
import { checkCriterion107 } from "./criteria/10.7-focus-visible.js"
import { checkCriterion108 } from "./criteria/10.8-hidden-content.js"
import { checkCriterion109 } from "./criteria/10.9-sensory-info.js"
import { checkCriterion1010 } from "./criteria/10.10-sensory-info-relevant.js"
import { checkCriterion1011 } from "./criteria/10.11-reflow.js"
import { checkCriterion1012 } from "./criteria/10.12-text-spacing.js"
import { checkCriterion1013 } from "./criteria/10.13-hover-focus-content.js"
import { checkCriterion1014 } from "./criteria/10.14-css-content-keyboard.js"

// Topic 11: Forms (13 criteria)
import { checkCriterion111 } from "./criteria/11.1-form-labels.js"
import { checkCriterion112 } from "./criteria/11.2-label-relevant.js"
import { checkCriterion113 } from "./criteria/11.3-labels-consistent.js"
import { checkCriterion114 } from "./criteria/11.4-label-proximity.js"
import { checkCriterion115 } from "./criteria/11.5-field-grouping.js"
import { checkCriterion116 } from "./criteria/11.6-fieldset-legend.js"
import { checkCriterion117 } from "./criteria/11.7-legend-relevant.js"
import { checkCriterion118 } from "./criteria/11.8-optgroup.js"
import { checkCriterion119 } from "./criteria/11.9-button-label.js"
import { checkCriterion1110 } from "./criteria/11.10-input-validation.js"
import { checkCriterion1111 } from "./criteria/11.11-error-suggestions.js"
import { checkCriterion1112 } from "./criteria/11.12-data-recovery.js"
import { checkCriterion1113 } from "./criteria/11.13-autocomplete.js"

// Topic 12: Navigation (11 criteria)
import { checkCriterion121 } from "./criteria/12.1-navigation-systems.js"
import { checkCriterion122 } from "./criteria/12.2-consistent-navigation.js"
import { checkCriterion123 } from "./criteria/12.3-sitemap-relevant.js"
import { checkCriterion124 } from "./criteria/12.4-sitemap-accessible.js"
import { checkCriterion125 } from "./criteria/12.5-search-accessible.js"
import { checkCriterion126 } from "./criteria/12.6-landmark-regions.js"
import { checkCriterion127 } from "./criteria/12.7-skip-link.js"
import { checkCriterion128 } from "./criteria/12.8-tab-order.js"
import { checkCriterion129 } from "./criteria/12.9-keyboard-trap.js"
import { checkCriterion1210 } from "./criteria/12.10-shortcut-keys.js"
import { checkCriterion1211 } from "./criteria/12.11-additional-content-keyboard.js"

// Topic 13: Consultation (12 criteria)
import { checkCriterion131 } from "./criteria/13.1-time-limit.js"
import { checkCriterion132 } from "./criteria/13.2-auto-update.js"
import { checkCriterion133 } from "./criteria/13.3-moving-content.js"
import { checkCriterion134 } from "./criteria/13.4-scrolling-content.js"
import { checkCriterion135 } from "./criteria/13.5-media-autoplay.js"
import { checkCriterion136 } from "./criteria/13.6-auto-opening.js"
import { checkCriterion137 } from "./criteria/13.7-document-format.js"
import { checkCriterion138 } from "./criteria/13.8-document-alternative.js"
import { checkCriterion139 } from "./criteria/13.9-orientation.js"
import { checkCriterion1310 } from "./criteria/13.10-horizontal-scroll.js"
import { checkCriterion1311 } from "./criteria/13.11-gesture-alternative.js"
import { checkCriterion1312 } from "./criteria/13.12-motion-alternative.js"

// Registry of all 106 criterion checkers
const criterionCheckers = {
  // Topic 1: Images
  "1.1": checkCriterion11,
  "1.2": checkCriterion12,
  "1.3": checkCriterion13,
  "1.4": checkCriterion14,
  "1.5": checkCriterion15,
  "1.6": checkCriterion16,
  "1.7": checkCriterion17,
  "1.8": checkCriterion18,
  "1.9": checkCriterion19,
  // Topic 2: Frames
  "2.1": checkCriterion21,
  "2.2": checkCriterion22,
  // Topic 3: Colors
  "3.1": checkCriterion31,
  "3.2": checkCriterion32,
  "3.3": checkCriterion33,
  // Topic 4: Multimedia
  "4.1": checkCriterion41,
  "4.2": checkCriterion42,
  "4.3": checkCriterion43,
  "4.4": checkCriterion44,
  "4.5": checkCriterion45,
  "4.6": checkCriterion46,
  "4.7": checkCriterion47,
  "4.8": checkCriterion48,
  "4.9": checkCriterion49,
  "4.10": checkCriterion410,
  "4.11": checkCriterion411,
  "4.12": checkCriterion412,
  "4.13": checkCriterion413,
  // Topic 5: Tables
  "5.1": checkCriterion51,
  "5.2": checkCriterion52,
  "5.3": checkCriterion53,
  "5.4": checkCriterion54,
  "5.5": checkCriterion55,
  "5.6": checkCriterion56,
  "5.7": checkCriterion57,
  "5.8": checkCriterion58,
  // Topic 6: Links
  "6.1": checkCriterion61,
  "6.2": checkCriterion62,
  // Topic 7: Scripts
  "7.1": checkCriterion71,
  "7.2": checkCriterion72,
  "7.3": checkCriterion73,
  "7.4": checkCriterion74,
  "7.5": checkCriterion75,
  // Topic 8: Mandatory Elements
  "8.1": checkCriterion81,
  "8.2": checkCriterion82,
  "8.3": checkCriterion83,
  "8.4": checkCriterion84,
  "8.5": checkCriterion85,
  "8.6": checkCriterion86,
  "8.7": checkCriterion87,
  "8.8": checkCriterion88,
  "8.9": checkCriterion89,
  "8.10": checkCriterion810,
  // Topic 9: Structure
  "9.1": checkCriterion91,
  "9.2": checkCriterion92,
  "9.3": checkCriterion93,
  "9.4": checkCriterion94,
  // Topic 10: Presentation
  "10.1": checkCriterion101,
  "10.2": checkCriterion102,
  "10.3": checkCriterion103,
  "10.4": checkCriterion104,
  "10.5": checkCriterion105,
  "10.6": checkCriterion106,
  "10.7": checkCriterion107,
  "10.8": checkCriterion108,
  "10.9": checkCriterion109,
  "10.10": checkCriterion1010,
  "10.11": checkCriterion1011,
  "10.12": checkCriterion1012,
  "10.13": checkCriterion1013,
  "10.14": checkCriterion1014,
  // Topic 11: Forms
  "11.1": checkCriterion111,
  "11.2": checkCriterion112,
  "11.3": checkCriterion113,
  "11.4": checkCriterion114,
  "11.5": checkCriterion115,
  "11.6": checkCriterion116,
  "11.7": checkCriterion117,
  "11.8": checkCriterion118,
  "11.9": checkCriterion119,
  "11.10": checkCriterion1110,
  "11.11": checkCriterion1111,
  "11.12": checkCriterion1112,
  "11.13": checkCriterion1113,
  // Topic 12: Navigation
  "12.1": checkCriterion121,
  "12.2": checkCriterion122,
  "12.3": checkCriterion123,
  "12.4": checkCriterion124,
  "12.5": checkCriterion125,
  "12.6": checkCriterion126,
  "12.7": checkCriterion127,
  "12.8": checkCriterion128,
  "12.9": checkCriterion129,
  "12.10": checkCriterion1210,
  "12.11": checkCriterion1211,
  // Topic 13: Consultation
  "13.1": checkCriterion131,
  "13.2": checkCriterion132,
  "13.3": checkCriterion133,
  "13.4": checkCriterion134,
  "13.5": checkCriterion135,
  "13.6": checkCriterion136,
  "13.7": checkCriterion137,
  "13.8": checkCriterion138,
  "13.9": checkCriterion139,
  "13.10": checkCriterion1310,
  "13.11": checkCriterion1311,
  "13.12": checkCriterion1312
}

/**
 * Run complete RGAA audit on current page
 * T228: Added performance marks/measures for Chrome DevTools profiling
 */
export async function runAudit(progressCallback) {
  // T228: Performance profiling marks
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark("audit-start")
  }

  const startTime = Date.now()
  const automatedCriteria = getAutomatedCriteria()
  const results = []

  // Check for iframes
  const iframeSummary = getIframeSummary()
  const hasWarnings = iframeSummary.crossOrigin > 0

  // T230: Limit violation detail storage
  const MAX_VIOLATIONS_PER_CRITERION = 100

  // Run each criterion check
  for (let i = 0; i < automatedCriteria.length; i++) {
    const criterion = automatedCriteria[i]

    // T228: Mark individual criterion check
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(`criterion-${criterion.id}-start`)
    }

    // Report progress
    if (progressCallback) {
      progressCallback({
        current: i + 1,
        total: automatedCriteria.length,
        criterionId: criterion.id
      })
    }

    // Run the check if we have an implementation
    const checker = criterionCheckers[criterion.id]
    let result

    if (checker) {
      try {
        result = await checker()

        // T230: Limit violations and store only selectors for large elements
        if (result.violations && result.violations.length > MAX_VIOLATIONS_PER_CRITERION) {
          const totalCount = result.violations.length
          result.violations = result.violations.slice(0, MAX_VIOLATIONS_PER_CRITERION)
          result.violations.push({
            element: `... and ${totalCount - MAX_VIOLATIONS_PER_CRITERION} more`,
            message: {
              fr: `${totalCount - MAX_VIOLATIONS_PER_CRITERION} éléments supplémentaires non affichés`,
              en: `${totalCount - MAX_VIOLATIONS_PER_CRITERION} additional elements not shown`
            }
          })
        }
      } catch (error) {
        console.error(`Error checking criterion ${criterion.id}:`, error)
        result = {
          criterionId: criterion.id,
          status: "manual",
          violations: [],
          explanation: {
            fr: `Erreur lors de la vérification automatique: ${error.message}`,
            en: `Error during automatic check: ${error.message}`
          }
        }
      }
    } else {
      // Not implemented yet - mark as manual
      result = {
        criterionId: criterion.id,
        status: "manual",
        violations: [],
        explanation: {
          fr: "Vérification manuelle requise (pas encore automatisée)",
          en: "Manual check required (not yet automated)"
        }
      }
    }

    // T228: Measure criterion check duration
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(`criterion-${criterion.id}-end`)
      performance.measure(
        `criterion-${criterion.id}`,
        `criterion-${criterion.id}-start`,
        `criterion-${criterion.id}-end`
      )
    }

    results.push({
      ...result,
      title: criterion.title,
      level: criterion.level,
      topic: criterion.topic,
      topicTitle: criterion.topicTitle,
      wcagMapping: criterion.wcagMapping,
      whyItMatters: criterion.whyItMatters,
      affectedUsers: criterion.affectedUsers,
      automated: !!checker
    })
  }

  // Calculate summary
  const summary = {
    totalCriteria: results.length,
    passed: results.filter(r => r.status === "pass").length,
    failed: results.filter(r => r.status === "fail").length,
    manualCheckRequired: results.filter(r => r.status === "manual").length,
    notApplicable: results.filter(r => r.status === "not-applicable").length
  }

  const auditResult = {
    timestamp: Date.now(),
    pageUrl: window.location.href,
    pageTitle: document.title,
    rgaaVersion: "4.1",
    extensionVersion: "0.1.0",
    criteriaResults: results,
    summary,
    warnings: hasWarnings ? {
      iframes: iframeSummary.crossOriginList
    } : null,
    duration: Date.now() - startTime
  }

  // T228: Final performance measurement
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark("audit-end")
    performance.measure("total-audit", "audit-start", "audit-end")

    // Log performance summary in development
    const measures = performance.getEntriesByType("measure")
    const totalAudit = measures.find(m => m.name === "total-audit")
    if (totalAudit) {
      console.log(`[RGAA Audit] Total duration: ${totalAudit.duration.toFixed(2)}ms`)
    }

    // Clean up marks and measures
    performance.clearMarks()
    performance.clearMeasures()
  }

  return auditResult
}
