/**
 * RGAA Criterion 11.2: Relevant Form Field Label
 * Manual check - verify form labels are meaningful
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion112() {
  const manualChecks = []

  const inputs = [...getElementsByTypeDeep("input, select, textarea")].filter(isVisible)

  for (const input of inputs) {
    const label = input.labels?.[0]
    const ariaLabel = input.getAttribute("aria-label")
    const labelText = label?.textContent?.trim() || ariaLabel || ""

    if (labelText) {
      manualChecks.push({
        element: getUniqueSelector(input),
        html: getElementHTML(input),
        message: {
          fr: `Vérifier la pertinence de l'étiquette: "${labelText}"`,
          en: `Verify label relevance: "${labelText}"`
        },
        remediation: {
          fr: "L'étiquette doit décrire clairement l'information attendue",
          en: "Label must clearly describe expected information"
        }
      })
    }
  }

  return {
    criterionId: "11.2",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} étiquette(s) nécessitant vérification`,
      en: `${manualChecks.length} label(s) requiring verification`
    }
  }
}
