/**
 * RGAA Criterion 7.4: Context Change Controlled
 * Checks if context changes are user-initiated (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion74() {
  const manualChecks = []

  // Look for auto-submitting forms and auto-redirecting elements
  const forms = getElementsByTypeDeep("form")
  const selects = getElementsByTypeDeep("select")

  for (const select of selects) {
    const hasOnchange = select.hasAttribute("onchange")
    if (hasOnchange) {
      manualChecks.push({
        element: getUniqueSelector(select),
        html: getElementHTML(select),
        message: {
          fr: "Sélection avec onchange - vérifier qu'elle ne change pas le contexte automatiquement",
          en: "Select with onchange - verify it doesn't change context automatically"
        },
        remediation: {
          fr: "Éviter les changements de contexte automatiques, utiliser un bouton de validation",
          en: "Avoid automatic context changes, use submit button"
        }
      })
    }
  }

  return {
    criterionId: "7.4",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} élément(s) avec changement de contexte potentiel`,
      en: `${manualChecks.length} element(s) with potential context change`
    }
  }
}
