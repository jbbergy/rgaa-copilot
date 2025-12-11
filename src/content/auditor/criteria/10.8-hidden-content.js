/**
 * RGAA Criterion 10.8: Hidden Content Ignored by AT
 * Checks if hidden content is properly hidden from assistive technologies
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion108() {
  const violations = []

  const allElements = getElementsByTypeDeep("*")

  for (const element of allElements) {
    const style = window.getComputedStyle(element)
    const isVisuallyHidden = style.display === "none" || style.visibility === "hidden"
    const ariaHidden = element.getAttribute("aria-hidden")

    // If visually hidden, should also be aria-hidden or have proper structure
    if (isVisuallyHidden && ariaHidden !== "true") {
      const hasInteractiveChildren = element.querySelectorAll("a, button, input, select, textarea").length > 0

      if (hasInteractiveChildren) {
        violations.push({
          element: getUniqueSelector(element),
          html: getElementHTML(element),
          message: {
            fr: "Contenu caché visuellement contient des éléments interactifs sans aria-hidden",
            en: "Visually hidden content contains interactive elements without aria-hidden"
          },
          remediation: {
            fr: "Ajouter aria-hidden=\"true\" ou retirer les éléments interactifs",
            en: "Add aria-hidden=\"true\" or remove interactive elements"
          }
        })
      }
    }
  }

  return {
    criterionId: "10.8",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${violations.length} problème(s) de contenu caché`,
      en: `${violations.length} hidden content issue(s)`
    }
  }
}
