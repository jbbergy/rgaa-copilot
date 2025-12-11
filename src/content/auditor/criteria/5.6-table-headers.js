/**
 * RGAA Criterion 5.6: Column/Row Headers Correctly Declared
 * Checks if table headers use th elements with appropriate scope
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion56() {
  const violations = []
  const tables = getElementsByTypeDeep("table")

  for (const table of tables) {
    const role = table.getAttribute("role")
    const isDataTable = role !== "presentation" && role !== "none"

    if (isDataTable) {
      const thElements = table.querySelectorAll("th")
      const hasHeaders = thElements.length > 0

      if (!hasHeaders) {
        violations.push({
          element: getUniqueSelector(table),
          html: getElementHTML(table),
          message: {
            fr: "Tableau de données sans éléments <th> pour les en-têtes",
            en: "Data table without <th> elements for headers"
          },
          remediation: {
            fr: "Utiliser des éléments <th> avec l'attribut scope pour les en-têtes",
            en: "Use <th> elements with scope attribute for headers"
          }
        })
      } else {
        // Check if th elements have scope attribute
        for (const th of thElements) {
          const scope = th.getAttribute("scope")
          if (!scope && !th.hasAttribute("id")) {
            violations.push({
              element: getUniqueSelector(th),
              html: getElementHTML(th),
              message: {
                fr: "En-tête <th> sans attribut scope ou id",
                en: "Header <th> without scope or id attribute"
              },
              remediation: {
                fr: "Ajouter scope=\"col\" ou scope=\"row\" aux éléments <th>",
                en: "Add scope=\"col\" or scope=\"row\" to <th> elements"
              }
            })
          }
        }
      }
    }
  }

  return {
    criterionId: "5.6",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${tables.length} tableau(x) analysé(s), ${violations.length} problème(s) d'en-têtes`,
      en: `${tables.length} table(s) analyzed, ${violations.length} header issue(s)`
    }
  }
}
