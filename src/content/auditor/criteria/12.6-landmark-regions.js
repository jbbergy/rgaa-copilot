/**
 * RGAA Criterion 12.6: Landmark Regions Reachable/Skippable
 * Checks if page has proper ARIA landmarks for navigation
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion126() {
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
        fr: "Aucune région principale (main) détectée",
        en: "No main region detected"
      },
      remediation: {
        fr: "Ajouter un élément <main> ou role=\"main\"",
        en: "Add <main> element or role=\"main\""
      }
    })
  }

  // Check for nav landmarks
  const navElements = [
    ...getElementsByTypeDeep("nav"),
    ...getElementsByTypeDeep("[role=\"navigation\"]")
  ]

  if (navElements.length === 0) {
    violations.push({
      element: "body",
      html: "",
      message: {
        fr: "Aucune région de navigation (nav) détectée",
        en: "No navigation region detected"
      },
      remediation: {
        fr: "Envelopper les menus dans des éléments <nav> ou role=\"navigation\"",
        en: "Wrap menus in <nav> elements or role=\"navigation\""
      }
    })
  }

  return {
    criterionId: "12.6",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${mainElements.length} main, ${navElements.length} nav détecté(s)`,
      en: `${mainElements.length} main, ${navElements.length} nav detected`
    }
  }
}
