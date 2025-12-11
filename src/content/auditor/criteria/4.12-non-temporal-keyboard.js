/**
 * RGAA Criterion 4.12: Non-Temporal Media Keyboard/Pointer Controllable
 * Checks if non-temporal media (canvas, SVG) interactions are keyboard accessible
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion412() {
  const manualChecks = []
  const canvas = getElementsByTypeDeep("canvas")

  for (const element of canvas) {
    const hasTabindex = element.hasAttribute("tabindex")
    const hasRole = element.hasAttribute("role")

    manualChecks.push({
      element: getUniqueSelector(element),
      html: getElementHTML(element),
      message: {
        fr: "Média non temporel - vérifier accessibilité clavier des interactions",
        en: "Non-temporal media - verify keyboard accessibility of interactions"
      },
      remediation: {
        fr: "S'assurer que toutes les interactions sont possibles au clavier",
        en: "Ensure all interactions are possible via keyboard"
      }
    })
  }

  return {
    criterionId: "4.12",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${canvas.length} média(s) non temporel(s) nécessitant vérification`,
      en: `${canvas.length} non-temporal media requiring verification`
    }
  }
}
