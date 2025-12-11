/**
 * RGAA Criterion 10.14: Additional CSS Content Visible via Keyboard
 * Checks if CSS-generated content appearing on hover is also accessible via keyboard
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion1014() {
  const manualChecks = []

  // Look for elements that might have CSS :hover content
  const interactiveElements = getElementsByTypeDeep("a, button, [tabindex]")

  for (const element of interactiveElements) {
    const computedStyle = window.getComputedStyle(element)
    const hasBeforeAfter = computedStyle.getPropertyValue("content") !== "none"

    if (hasBeforeAfter) {
      manualChecks.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: "Élément avec pseudo-contenu CSS - vérifier accessibilité clavier",
          en: "Element with CSS pseudo-content - verify keyboard accessibility"
        },
        remediation: {
          fr: "Le contenu CSS ::before/::after doit être visible au focus clavier, pas seulement au survol",
          en: "CSS ::before/::after content must be visible on keyboard focus, not just hover"
        }
      })
    }
  }

  return {
    criterionId: "10.14",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} élément(s) avec contenu CSS nécessitant vérification`,
      en: `${manualChecks.length} element(s) with CSS content requiring verification`
    }
  }
}
