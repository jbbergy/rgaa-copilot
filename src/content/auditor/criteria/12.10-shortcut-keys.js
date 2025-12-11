/**
 * RGAA Criterion 12.10: Single-Key Shortcuts Controllable
 * Checks if single-key shortcuts can be disabled or remapped
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion1210() {
  const violations = []

  // Look for accesskey attributes (single-key shortcuts)
  const elementsWithAccesskey = getElementsByTypeDeep("[accesskey]")

  for (const element of elementsWithAccesskey) {
    const accesskey = element.getAttribute("accesskey") || ""

    // Single character accesskeys can cause issues
    if (accesskey.length === 1) {
      violations.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: `Raccourci clavier une touche détecté: accesskey="${accesskey}"`,
          en: `Single-key shortcut detected: accesskey="${accesskey}"`
        },
        remediation: {
          fr: "Fournir un moyen de désactiver ou reconfigurer les raccourcis une touche",
          en: "Provide way to disable or reconfigure single-key shortcuts"
        }
      })
    }
  }

  return {
    criterionId: "12.10",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${elementsWithAccesskey.length} raccourci(s) clavier détecté(s)`,
      en: `${elementsWithAccesskey.length} keyboard shortcut(s) detected`
    }
  }
}
