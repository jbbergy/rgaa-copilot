/**
 * RGAA Criterion 10.13: Additional Content on Hover/Focus Controllable
 * Checks if content appearing on hover/focus can be dismissed and doesn't obscure other content
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion1013() {
  const manualChecks = []

  // Look for elements with title attribute (tooltips)
  const elementsWithTitle = getElementsByTypeDeep("[title]")

  for (const element of elementsWithTitle) {
    manualChecks.push({
      element: getUniqueSelector(element),
      html: getElementHTML(element),
      message: {
        fr: "Élément avec title (tooltip) - vérifier qu'il est dismissible et ne masque pas de contenu",
        en: "Element with title (tooltip) - verify it's dismissible and doesn't obscure content"
      },
      remediation: {
        fr: "Les info-bulles doivent être fermables (Esc) et ne pas bloquer d'autres contenus",
        en: "Tooltips must be dismissible (Esc) and not block other content"
      }
    })
  }

  return {
    criterionId: "10.13",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${elementsWithTitle.length} élément(s) avec contenu additionnel potentiel`,
      en: `${elementsWithTitle.length} element(s) with potential additional content`
    }
  }
}
