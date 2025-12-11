/**
 * RGAA Criterion 11.8: Choice List Items Grouped
 * Checks if select options are grouped with optgroup where appropriate
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion118() {
  const manualChecks = []

  const selects = getElementsByTypeDeep("select")

  for (const select of selects) {
    const optgroups = select.querySelectorAll("optgroup")
    const options = select.querySelectorAll("option")

    // If many options, might benefit from optgroups
    if (options.length > 10 && optgroups.length === 0) {
      manualChecks.push({
        element: getUniqueSelector(select),
        html: getElementHTML(select),
        message: {
          fr: `Liste déroulante avec ${options.length} options - vérifier si regroupement nécessaire`,
          en: `Select list with ${options.length} options - verify if grouping needed`
        },
        remediation: {
          fr: "Utiliser <optgroup> pour regrouper les options par catégorie",
          en: "Use <optgroup> to group options by category"
        }
      })
    }
  }

  return {
    criterionId: "11.8",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${selects.length} liste(s) analysée(s), ${manualChecks.length} nécessitant vérification`,
      en: `${selects.length} list(s) analyzed, ${manualChecks.length} requiring verification`
    }
  }
}
