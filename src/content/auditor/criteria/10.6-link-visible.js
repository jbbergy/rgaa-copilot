/**
 * RGAA Criterion 10.6: Link Visible Relative to Text
 * Checks if links have sufficient visual distinction from surrounding text
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion106() {
  const violations = []

  const links = getElementsByTypeDeep("a").filter(isVisible)

  for (const link of links) {
    const linkStyle = window.getComputedStyle(link)
    const parent = link.parentElement
    if (!parent) continue

    const parentStyle = window.getComputedStyle(parent)

    const linkColor = linkStyle.color
    const parentColor = parentStyle.color
    const hasUnderline = linkStyle.textDecoration.includes("underline")
    const hasBorder = linkStyle.borderBottomWidth !== "0px"

    // Links should be underlined or have sufficient color contrast
    if (!hasUnderline && !hasBorder && linkColor === parentColor) {
      violations.push({
        element: getUniqueSelector(link),
        html: getElementHTML(link),
        message: {
          fr: "Lien non différencié visuellement du texte environnant",
          en: "Link not visually distinguished from surrounding text"
        },
        remediation: {
          fr: "Ajouter un soulignement ou un contraste de couleur suffisant (3:1)",
          en: "Add underline or sufficient color contrast (3:1)"
        }
      })
    }
  }

  return {
    criterionId: "10.6",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${links.length} lien(s) analysé(s), ${violations.length} problème(s)`,
      en: `${links.length} link(s) analyzed, ${violations.length} issue(s)`
    }
  }
}
