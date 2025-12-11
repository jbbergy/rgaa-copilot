/**
 * RGAA Criterion 7.5: Status Messages Announced
 * Checks if status messages use appropriate ARIA live regions
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion75() {
  const violations = []

  // Look for potential status message containers
  const statusElements = [
    ...getElementsByTypeDeep("[role=\"status\"]"),
    ...getElementsByTypeDeep("[role=\"alert\"]"),
    ...getElementsByTypeDeep("[role=\"log\"]"),
    ...getElementsByTypeDeep("[aria-live]")
  ]

  // Look for elements that might be status messages without proper markup
  const potentialStatus = getElementsByTypeDeep("*").filter(el => {
    const className = el.getAttribute("class") || ""
    const id = el.getAttribute("id") || ""
    return (
      className.includes("status") ||
      className.includes("alert") ||
      className.includes("message") ||
      className.includes("notification") ||
      id.includes("status") ||
      id.includes("message")
    )
  })

  for (const element of potentialStatus) {
    const role = element.getAttribute("role")
    const ariaLive = element.getAttribute("aria-live")

    if (!role && !ariaLive) {
      violations.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: "Message de statut potentiel sans role ou aria-live",
          en: "Potential status message without role or aria-live"
        },
        remediation: {
          fr: "Ajouter role=\"status\" ou role=\"alert\" ou aria-live=\"polite\"",
          en: "Add role=\"status\" or role=\"alert\" or aria-live=\"polite\""
        }
      })
    }
  }

  return {
    criterionId: "7.5",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${statusElements.length} message(s) de statut détecté(s), ${violations.length} problème(s)`,
      en: `${statusElements.length} status message(s) detected, ${violations.length} issue(s)`
    }
  }
}
