/**
 * RGAA Criterion 9.2: Coherent Document Structure
 * Checks if page uses proper landmark regions
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion92() {
  const violations = []

  // Check for main landmark
  const mainElements = [
    ...getElementsByTypeDeep("main"),
    ...getElementsByTypeDeep("[role=\"main\"]")
  ]

  if (mainElements.length === 0) {
    violations.push({
      element: "body",
      html: "",
      message: {
        fr: "Aucun élément <main> ou role=\"main\" trouvé",
        en: "No <main> element or role=\"main\" found"
      },
      remediation: {
        fr: "Envelopper le contenu principal dans un élément <main>",
        en: "Wrap main content in <main> element"
      }
    })
  } else if (mainElements.length > 1) {
    for (const main of mainElements.slice(1)) {
      violations.push({
        element: getUniqueSelector(main),
        html: getElementHTML(main),
        message: {
          fr: `Multiple éléments <main> détectés (${mainElements.length} total)`,
          en: `Multiple <main> elements detected (${mainElements.length} total)`
        },
        remediation: {
          fr: "Utiliser un seul élément <main> par page",
          en: "Use single <main> element per page"
        }
      })
    }
  }

  return {
    criterionId: "9.2",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `Structure du document: ${mainElements.length} élément(s) main`,
      en: `Document structure: ${mainElements.length} main element(s)`
    }
  }
}
