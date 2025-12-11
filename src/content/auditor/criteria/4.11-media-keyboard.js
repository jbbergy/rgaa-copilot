/**
 * RGAA Criterion 4.11: Temporal Media Keyboard/Pointer Controllable
 * Checks if media player is accessible via keyboard
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion411() {
  const violations = []
  const mediaElements = [...getElementsByTypeDeep("video"), ...getElementsByTypeDeep("audio")]

  for (const media of mediaElements) {
    const hasControls = media.hasAttribute("controls")
    const tabindex = media.getAttribute("tabindex")

    // Native controls are keyboard accessible
    if (!hasControls) {
      // Check for custom player controls nearby
      const parent = media.parentElement
      const customControls = parent?.querySelector("button, [role=\"button\"]")

      if (!customControls) {
        violations.push({
          element: getUniqueSelector(media),
          html: getElementHTML(media),
          message: {
            fr: "Média sans contrôles natifs ou personnalisés accessibles au clavier",
            en: "Media without native or custom keyboard-accessible controls"
          },
          remediation: {
            fr: "Ajouter controls ou implémenter des contrôles personnalisés accessibles",
            en: "Add controls or implement accessible custom controls"
          }
        })
      }
    }
  }

  return {
    criterionId: "4.11",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${mediaElements.length} média(s) analysé(s), ${violations.length} violation(s)`,
      en: `${mediaElements.length} media analyzed, ${violations.length} violation(s)`
    }
  }
}
