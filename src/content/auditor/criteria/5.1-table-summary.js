/**
 * RGAA Criterion 5.1: Complex Data Table with Summary
 * Checks if complex tables have summary information
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion51() {
  const manualChecks = []
  const tables = getElementsByTypeDeep("table")

  for (const table of tables) {
    const summary = table.getAttribute("summary")
    const ariaDescribedby = table.getAttribute("aria-describedby")
    const caption = table.querySelector("caption")

    // Check if table is complex (has headers in both directions)
    const hasRowHeaders = table.querySelectorAll("th[scope=\"row\"]").length > 0
    const hasColHeaders = table.querySelectorAll("th[scope=\"col\"]").length > 0

    if (hasRowHeaders && hasColHeaders) {
      manualChecks.push({
        element: getUniqueSelector(table),
        html: getElementHTML(table),
        message: {
          fr: "Tableau complexe détecté - vérifier qu'un résumé approprié existe",
          en: "Complex table detected - verify appropriate summary exists"
        },
        remediation: {
          fr: "Fournir un résumé via caption ou aria-describedby pour les tableaux complexes",
          en: "Provide summary via caption or aria-describedby for complex tables"
        }
      })
    }
  }

  return {
    criterionId: "5.1",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${tables.length} tableau(x) analysé(s), ${manualChecks.length} nécessitant vérification`,
      en: `${tables.length} table(s) analyzed, ${manualChecks.length} requiring verification`
    }
  }
}
