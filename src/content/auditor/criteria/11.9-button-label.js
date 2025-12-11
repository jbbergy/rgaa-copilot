/**
 * RGAA Criterion 11.9: Relevant Button Label
 * Manual check - verify button labels are meaningful
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion119() {
  const manualChecks = []

  const buttons = [...getElementsByTypeDeep("button, input[type='submit'], input[type='button']")].filter(isVisible)

  for (const button of buttons) {
    const label = button.textContent?.trim() || button.getAttribute("value") || button.getAttribute("aria-label") || ""

    if (label) {
      // Check for generic labels
      const genericLabels = ["submit", "ok", "click", "button", "go"]
      const isGeneric = genericLabels.some(g => label.toLowerCase() === g)

      if (isGeneric) {
        manualChecks.push({
          element: getUniqueSelector(button),
          html: getElementHTML(button),
          message: {
            fr: `Intitulé de bouton générique: "${label}"`,
            en: `Generic button label: "${label}"`
          },
          remediation: {
            fr: "Utiliser un intitulé explicite décrivant l'action (ex: 'Enregistrer le formulaire')",
            en: "Use explicit label describing action (e.g., 'Save form')"
          }
        })
      } else {
        manualChecks.push({
          element: getUniqueSelector(button),
          html: getElementHTML(button),
          message: {
            fr: `Vérifier la pertinence de l'intitulé: "${label}"`,
            en: `Verify label relevance: "${label}"`
          },
          remediation: {
            fr: "L'intitulé doit décrire clairement l'action du bouton",
            en: "Label must clearly describe button action"
          }
        })
      }
    }
  }

  return {
    criterionId: "11.9",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${buttons.length} bouton(s) nécessitant vérification`,
      en: `${buttons.length} button(s) requiring verification`
    }
  }
}
