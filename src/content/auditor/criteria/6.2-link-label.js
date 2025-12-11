/**
 * RGAA Criterion 6.2: Link with Label
 * Checks if all links have accessible names
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion62() {
  const violations = []
  const links = getElementsByTypeDeep("a").filter(isVisible)

  for (const link of links) {
    const text = link.textContent?.trim() || ""
    const ariaLabel = link.getAttribute("aria-label")
    const ariaLabelledby = link.getAttribute("aria-labelledby")
    const title = link.getAttribute("title")
    const imgAlt = link.querySelector("img")?.getAttribute("alt")

    const hasAccessibleName = text || ariaLabel || ariaLabelledby || imgAlt

    if (!hasAccessibleName) {
      violations.push({
        element: getUniqueSelector(link),
        html: getElementHTML(link),
        message: {
          fr: "Lien sans nom accessible",
          en: "Link without accessible name"
        },
        remediation: {
          fr: "Fournir un texte, aria-label, ou alt sur image contenue",
          en: "Provide text, aria-label, or alt on contained image"
        }
      })
    } else if (title && !text && !ariaLabel) {
      // Title alone is not sufficient
      violations.push({
        element: getUniqueSelector(link),
        html: getElementHTML(link),
        message: {
          fr: "Lien utilisant uniquement l'attribut title (insuffisant)",
          en: "Link using only title attribute (insufficient)"
        },
        remediation: {
          fr: "Ajouter du texte visible ou aria-label en plus du title",
          en: "Add visible text or aria-label in addition to title"
        }
      })
    }
  }

  return {
    criterionId: "6.2",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${links.length} lien(s) analysé(s), ${violations.length} problème(s) de label`,
      en: `${links.length} link(s) analyzed, ${violations.length} label issue(s)`
    }
  }
}
