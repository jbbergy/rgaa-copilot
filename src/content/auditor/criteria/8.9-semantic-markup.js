/**
 * RGAA Criterion 8.9: Semantic Markup Not Used Solely for Presentation
 * Checks if semantic HTML elements are used appropriately
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion89() {
  const violations = []

  // Check for empty semantic elements
  const semanticElements = [
    ...getElementsByTypeDeep("h1, h2, h3, h4, h5, h6"),
    ...getElementsByTypeDeep("blockquote"),
    ...getElementsByTypeDeep("q"),
    ...getElementsByTypeDeep("strong"),
    ...getElementsByTypeDeep("em")
  ]

  for (const element of semanticElements) {
    const text = element.textContent?.trim() || ""
    const hasChildElements = element.children.length > 0

    if (text.length === 0 && !hasChildElements) {
      violations.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: `Élément sémantique vide: <${element.tagName.toLowerCase()}>`,
          en: `Empty semantic element: <${element.tagName.toLowerCase()}>`
        },
        remediation: {
          fr: "Ne pas utiliser d'éléments sémantiques vides pour la présentation",
          en: "Don't use empty semantic elements for presentation"
        }
      })
    }
  }

  return {
    criterionId: "8.9",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${semanticElements.length} élément(s) sémantique(s), ${violations.length} vide(s)`,
      en: `${semanticElements.length} semantic element(s), ${violations.length} empty`
    }
  }
}
