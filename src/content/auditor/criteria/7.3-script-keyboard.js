/**
 * RGAA Criterion 7.3: Script Keyboard/Pointer Controllable
 * Checks if scripted functionality is accessible via keyboard (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion73() {
  const manualChecks = []

  // Elements with onclick but not semantic interactive elements
  const clickableElements = getElementsByTypeDeep("*").filter(el => {
    const tag = el.tagName.toLowerCase()
    const hasOnclick = el.hasAttribute("onclick") || el.getAttribute("ng-click") || el.getAttribute("@click")
    const isNotButton = !["button", "a", "input", "select", "textarea"].includes(tag)
    return hasOnclick && isNotButton
  })

  for (const element of clickableElements) {
    const tabindex = element.getAttribute("tabindex")
    const role = element.getAttribute("role")

    manualChecks.push({
      element: getUniqueSelector(element),
      html: getElementHTML(element),
      message: {
        fr: "Élément cliquable détecté - vérifier accessibilité clavier",
        en: "Clickable element detected - verify keyboard accessibility"
      },
      remediation: {
        fr: "Ajouter tabindex=\"0\" et gestionnaires clavier (Enter, Space)",
        en: "Add tabindex=\"0\" and keyboard handlers (Enter, Space)"
      }
    })
  }

  return {
    criterionId: "7.3",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${clickableElements.length} élément(s) interactif(s) nécessitant vérification clavier`,
      en: `${clickableElements.length} interactive element(s) requiring keyboard verification`
    }
  }
}
