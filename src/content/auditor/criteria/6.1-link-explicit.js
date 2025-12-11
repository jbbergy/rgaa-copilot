/**
 * RGAA Criterion 6.1: Explicit Link
 * Checks if links have meaningful text content
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion61() {
  const violations = []
  const links = getElementsByTypeDeep("a").filter(isVisible)

  for (const link of links) {
    const text = link.textContent?.trim() || ""
    const ariaLabel = link.getAttribute("aria-label")
    const ariaLabelledby = link.getAttribute("aria-labelledby")
    const title = link.getAttribute("title")

    const hasText = text.length > 0 || ariaLabel || ariaLabelledby || title

    if (!hasText) {
      violations.push({
        element: getUniqueSelector(link),
        html: getElementHTML(link),
        message: {
          fr: "Lien sans intitulé explicite",
          en: "Link without explicit label"
        },
        remediation: {
          fr: "Ajouter un texte visible, aria-label, ou aria-labelledby au lien",
          en: "Add visible text, aria-label, or aria-labelledby to link"
        }
      })
    }
  }

  return {
    criterionId: "6.1",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${links.length} lien(s) analysé(s), ${violations.length} sans intitulé`,
      en: `${links.length} link(s) analyzed, ${violations.length} without label`
    }
  }
}
