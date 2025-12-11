/**
 * RGAA Criterion 5.4: Table Title Correctly Associated
 * Checks if tables have caption elements properly associated
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion54() {
  const violations = []
  const tables = getElementsByTypeDeep("table")

  for (const table of tables) {
    const role = table.getAttribute("role")
    const isDataTable = role !== "presentation" && role !== "none"

    if (isDataTable) {
      const caption = table.querySelector("caption")
      const ariaLabelledby = table.getAttribute("aria-labelledby")
      const ariaLabel = table.getAttribute("aria-label")

      if (!caption && !ariaLabelledby && !ariaLabel) {
        violations.push({
          element: getUniqueSelector(table),
          html: getElementHTML(table),
          message: {
            fr: "Tableau de données sans titre (caption, aria-label, ou aria-labelledby)",
            en: "Data table without title (caption, aria-label, or aria-labelledby)"
          },
          remediation: {
            fr: "Ajouter un élément <caption> ou aria-label pour le titre du tableau",
            en: "Add <caption> element or aria-label for table title"
          }
        })
      }
    }
  }

  return {
    criterionId: "5.4",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${tables.length} tableau(x) analysé(s), ${violations.length} sans titre`,
      en: `${tables.length} table(s) analyzed, ${violations.length} without title`
    }
  }
}
