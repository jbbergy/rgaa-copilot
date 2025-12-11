/**
 * RGAA Criterion 8.2: Valid HTML
 * Checks for critical HTML validation errors
 */

import { getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion82() {
  const violations = []

  // Check for duplicate IDs
  const idMap = new Map()
  const allElements = document.querySelectorAll("[id]")

  for (const element of allElements) {
    const id = element.id
    if (idMap.has(id)) {
      idMap.get(id).push(element)
    } else {
      idMap.set(id, [element])
    }
  }

  // Report duplicate IDs
  for (const [id, elements] of idMap.entries()) {
    if (elements.length > 1) {
      elements.forEach(el => {
        violations.push({
          element: getUniqueSelector(el),
          html: getElementHTML(el),
          message: {
            fr: `ID en doublon: "${id}" utilisé ${elements.length} fois`,
            en: `Duplicate ID: "${id}" used ${elements.length} times`
          },
          remediation: {
            fr: "Assurer que chaque ID est unique dans le document",
            en: "Ensure each ID is unique in the document"
          }
        })
      })
    }
  }

  // Check for unclosed tags (simplified detection via innerHTML mismatch)
  const bodyHTML = document.body.innerHTML
  const openTags = (bodyHTML.match(/<[^/][^>]*>/g) || []).length
  const closeTags = (bodyHTML.match(/<\/[^>]+>/g) || []).length
  const selfClosing = (bodyHTML.match(/<[^>]+\/>/g) || []).length

  // Note: This is a basic heuristic, not perfect
  if (Math.abs((openTags - selfClosing) - closeTags) > 10) {
    violations.push({
      element: "body",
      html: "(document structure)",
      message: {
        fr: "Possible problème de balises non fermées détecté",
        en: "Possible unclosed tags detected"
      },
      remediation: {
        fr: "Vérifier que toutes les balises HTML sont correctement fermées",
        en: "Check that all HTML tags are properly closed"
      }
    })
  }

  return {
    criterionId: "8.2",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `Validation HTML: ${violations.length} erreur(s) critique(s) détectée(s)`,
      en: `HTML validation: ${violations.length} critical error(s) detected`
    }
  }
}
