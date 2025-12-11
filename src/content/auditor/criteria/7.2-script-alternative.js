/**
 * RGAA Criterion 7.2: Relevant Script Alternative
 * Checks if script alternatives are pertinent (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion72() {
  const manualChecks = []

  // Look for noscript elements
  const noscripts = getElementsByTypeDeep("noscript")

  for (const noscript of noscripts) {
    manualChecks.push({
      element: getUniqueSelector(noscript),
      html: getElementHTML(noscript),
      message: {
        fr: "Alternative noscript détectée - vérifier qu'elle fournit la même fonctionnalité",
        en: "Noscript alternative detected - verify it provides same functionality"
      },
      remediation: {
        fr: "L'alternative doit offrir un accès équivalent au contenu/fonctionnalité",
        en: "Alternative must provide equivalent access to content/functionality"
      }
    })
  }

  return {
    criterionId: "7.2",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${noscripts.length} alternative(s) script détectée(s)`,
      en: `${noscripts.length} script alternative(s) detected`
    }
  }
}
