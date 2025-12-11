/**
 * RGAA Criterion 5.8: Layout Table Without Data Table Elements
 * Checks if layout tables don't use data table markup
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion58() {
  const violations = []
  const tables = getElementsByTypeDeep("table")

  for (const table of tables) {
    const role = table.getAttribute("role")
    const isLayoutTable = role === "presentation" || role === "none"

    if (isLayoutTable) {
      const hasDataElements = table.querySelectorAll("th, thead, tbody, tfoot, caption, colgroup, col").length > 0

      if (hasDataElements) {
        violations.push({
          element: getUniqueSelector(table),
          html: getElementHTML(table),
          message: {
            fr: "Tableau de mise en forme utilisant des éléments de tableau de données",
            en: "Layout table using data table elements"
          },
          remediation: {
            fr: "Retirer les éléments th, thead, caption des tableaux de mise en forme",
            en: "Remove th, thead, caption elements from layout tables"
          }
        })
      }
    }
  }

  return {
    criterionId: "5.8",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${tables.length} tableau(x) analysé(s), ${violations.length} violation(s)`,
      en: `${tables.length} table(s) analyzed, ${violations.length} violation(s)`
    }
  }
}
