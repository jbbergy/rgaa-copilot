/**
 * RGAA Criterion 4.10: Auto-Triggered Sound Controllable
 * Checks if automatically playing sound can be controlled
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion410() {
  const violations = []
  const audioElements = [...getElementsByTypeDeep("audio"), ...getElementsByTypeDeep("video")]

  for (const media of audioElements) {
    const autoplay = media.hasAttribute("autoplay")
    const hasControls = media.hasAttribute("controls")
    const muted = media.hasAttribute("muted")

    if (autoplay && !hasControls && !muted) {
      violations.push({
        element: getUniqueSelector(media),
        html: getElementHTML(media),
        message: {
          fr: "Son se déclenchant automatiquement sans contrôles",
          en: "Auto-playing sound without controls"
        },
        remediation: {
          fr: "Ajouter l'attribut controls ou muted, ou retirer autoplay",
          en: "Add controls or muted attribute, or remove autoplay"
        }
      })
    }
  }

  return {
    criterionId: "4.10",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${audioElements.length} média(s) analysé(s), ${violations.length} violation(s)`,
      en: `${audioElements.length} media analyzed, ${violations.length} violation(s)`
    }
  }
}
