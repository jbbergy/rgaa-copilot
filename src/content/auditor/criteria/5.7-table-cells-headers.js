/**
 * RGAA Criterion 5.7: Appropriate Cell/Header Association
 * Checks if complex tables use headers attribute correctly
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion57() {
  const violations = []
  const tables = getElementsByTypeDeep("table")

  for (const table of tables) {
    const role = table.getAttribute("role")
    const isDataTable = role !== "presentation" && role !== "none"

    if (isDataTable) {
      // Check for complex tables (multiple header levels)
      const thElements = table.querySelectorAll("th")
      const hasComplexStructure = thElements.length > 10 || table.querySelectorAll("th[rowspan], th[colspan]").length > 0

      if (hasComplexStructure) {
        const cells = table.querySelectorAll("td")
        for (const cell of cells) {
          const headers = cell.getAttribute("headers")
          const scope = cell.getAttribute("scope")

          // Complex tables should use headers attribute
          if (!headers && !scope) {
            violations.push({
              element: getUniqueSelector(cell),
              html: getElementHTML(cell),
              message: {
                fr: "Cellule dans tableau complexe sans attribut headers",
                en: "Cell in complex table without headers attribute"
              },
              remediation: {
                fr: "Utiliser l'attribut headers pour associer les cellules aux en-têtes",
                en: "Use headers attribute to associate cells with headers"
              }
            })
            break // Only report once per table
          }
        }
      }
    }
  }

  return {
    criterionId: "5.7",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${tables.length} tableau(x) analysé(s), ${violations.length} problème(s) d'association`,
      en: `${tables.length} table(s) analyzed, ${violations.length} association issue(s)`
    }
  }
}
