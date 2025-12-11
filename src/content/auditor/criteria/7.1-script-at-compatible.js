/**
 * RGAA Criterion 7.1: Script Compatible with Assistive Technologies
 * Checks if scripted components are accessible (manual verification required)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion71() {
  const manualChecks = []

  // Look for custom components that might use scripts
  const interactiveElements = [
    ...getElementsByTypeDeep("[role=\"button\"]"),
    ...getElementsByTypeDeep("[role=\"tab\"]"),
    ...getElementsByTypeDeep("[role=\"dialog\"]"),
    ...getElementsByTypeDeep("[role=\"menu\"]"),
    ...getElementsByTypeDeep("[role=\"slider\"]"),
    ...getElementsByTypeDeep("[role=\"combobox\"]")
  ]

  for (const element of interactiveElements) {
    manualChecks.push({
      element: getUniqueSelector(element),
      html: getElementHTML(element),
      message: {
        fr: "Composant scripté détecté - vérifier compatibilité avec technologies d'assistance",
        en: "Scripted component detected - verify assistive technology compatibility"
      },
      remediation: {
        fr: "Tester avec lecteurs d'écran et navigation clavier",
        en: "Test with screen readers and keyboard navigation"
      }
    })
  }

  return {
    criterionId: "7.1",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${interactiveElements.length} composant(s) scripté(s) nécessitant test AT`,
      en: `${interactiveElements.length} scripted component(s) requiring AT test`
    }
  }
}
