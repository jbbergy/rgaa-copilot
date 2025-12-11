/**
 * RGAA Criterion 4.7: Temporal Media Clearly Identifiable
 * Checks if media player controls and information are identifiable
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion47() {
  const violations = []
  const mediaElements = [...getElementsByTypeDeep("video"), ...getElementsByTypeDeep("audio")]

  for (const media of mediaElements) {
    const hasControls = media.hasAttribute("controls")
    const ariaLabel = media.getAttribute("aria-label")
    const title = media.getAttribute("title")

    if (!hasControls && !ariaLabel && !title) {
      violations.push({
        element: getUniqueSelector(media),
        html: getElementHTML(media),
        message: {
          fr: "Média temporel sans identification claire (contrôles, label, titre)",
          en: "Temporal media without clear identification (controls, label, title)"
        },
        remediation: {
          fr: "Ajouter l'attribut controls ou un aria-label/title descriptif",
          en: "Add controls attribute or descriptive aria-label/title"
        }
      })
    }
  }

  return {
    criterionId: "4.7",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${mediaElements.length} média(s) analysé(s), ${violations.length} violation(s)`,
      en: `${mediaElements.length} media analyzed, ${violations.length} violation(s)`
    }
  }
}
