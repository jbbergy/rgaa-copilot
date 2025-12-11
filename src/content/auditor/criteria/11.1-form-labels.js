/**
 * RGAA Criterion 11.1: Form Labels
 * Checks if form fields have associated labels
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML, getAccessibleText } from "../dom-inspector.js"

export async function checkCriterion111() {
  const violations = []

  // Get all form controls
  const formControls = [
    ...getElementsByTypeDeep("input"),
    ...getElementsByTypeDeep("select"),
    ...getElementsByTypeDeep("textarea")
  ].filter(el => {
    // Filter out hidden inputs and invisible elements
    if (el.type === "hidden" || el.type === "submit" || el.type === "button") {
      return false
    }
    return isVisible(el)
  })

  for (const control of formControls) {
    const accessibleText = getAccessibleText(control)
    const hasLabel = accessibleText && accessibleText.length > 0

    if (!hasLabel) {
      violations.push({
        element: getUniqueSelector(control),
        html: getElementHTML(control),
        message: {
          fr: "Champ de formulaire sans étiquette",
          en: "Form field without label"
        },
        remediation: {
          fr: "Ajouter un élément <label> associé via for/id ou utiliser aria-label/aria-labelledby",
          en: "Add a <label> element associated via for/id or use aria-label/aria-labelledby"
        }
      })
    }
  }

  return {
    criterionId: "11.1",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${formControls.length} champ(s) de formulaire analysé(s), ${violations.length} violation(s) détectée(s)`,
      en: `${formControls.length} form field(s) analyzed, ${violations.length} violation(s) detected`
    }
  }
}
