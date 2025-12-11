/**
 * RGAA Criterion 11.7: Relevant Grouping Legend
 * Manual check - verify fieldset legends are meaningful
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion117() {
  const manualChecks = []

  const fieldsets = getElementsByTypeDeep("fieldset")

  for (const fieldset of fieldsets) {
    const legend = fieldset.querySelector("legend")
    const legendText = legend?.textContent?.trim() || ""

    if (legendText) {
      manualChecks.push({
        element: getUniqueSelector(fieldset),
        html: getElementHTML(fieldset),
        message: {
          fr: `Vérifier la pertinence de la légende: "${legendText}"`,
          en: `Verify legend relevance: "${legendText}"`
        },
        remediation: {
          fr: "La légende doit décrire le groupe de champs de façon claire",
          en: "Legend must clearly describe the field group"
        }
      })
    }
  }

  return {
    criterionId: "11.7",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} légende(s) nécessitant vérification`,
      en: `${manualChecks.length} legend(s) requiring verification`
    }
  }
}
