/**
 * RGAA Criterion 5.3: Layout Table Linearly Comprehensible
 * Checks if layout tables are understandable when linearized
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion53() {
  const violations = []
  const tables = getElementsByTypeDeep("table")

  for (const table of tables) {
    const role = table.getAttribute("role")
    const hasDataElements = table.querySelectorAll("th, thead, tbody, tfoot, col, colgroup").length > 0

    // Layout table should have role="presentation" or "none"
    if (!hasDataElements && role !== "presentation" && role !== "none") {
      violations.push({
        element: getUniqueSelector(table),
        html: getElementHTML(table),
        message: {
          fr: "Tableau de mise en forme sans role=\"presentation\"",
          en: "Layout table without role=\"presentation\""
        },
        remediation: {
          fr: "Ajouter role=\"presentation\" aux tableaux de mise en forme",
          en: "Add role=\"presentation\" to layout tables"
        }
      })
    }
  }

  return {
    criterionId: "5.3",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${tables.length} tableau(x) analysé(s), ${violations.length} violation(s)`,
      en: `${tables.length} table(s) analyzed, ${violations.length} violation(s)`
    }
  }
}
