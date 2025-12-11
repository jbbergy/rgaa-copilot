/**
 * RGAA Criterion 11.10: Relevant Input Validation
 * Checks if form fields have appropriate validation attributes
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion1110() {
  const violations = []

  const inputs = [...getElementsByTypeDeep("input, select, textarea")].filter(isVisible)

  for (const input of inputs) {
    const required = input.hasAttribute("required")
    const ariaRequired = input.getAttribute("aria-required") === "true"
    const ariaInvalid = input.getAttribute("aria-invalid")

    // If required, should have visual indication
    if ((required || ariaRequired) && !ariaInvalid) {
      const label = input.labels?.[0]
      const labelText = label?.textContent || ""

      // Check if label has asterisk or "requis/required"
      const hasRequiredIndicator = labelText.includes("*") ||
        labelText.toLowerCase().includes("requis") ||
        labelText.toLowerCase().includes("required")

      if (!hasRequiredIndicator) {
        violations.push({
          element: getUniqueSelector(input),
          html: getElementHTML(input),
          message: {
            fr: "Champ obligatoire sans indication visuelle",
            en: "Required field without visual indication"
          },
          remediation: {
            fr: "Ajouter une indication visuelle (*, \"requis\") à l'étiquette",
            en: "Add visual indication (*, \"required\") to label"
          }
        })
      }
    }
  }

  return {
    criterionId: "11.10",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${inputs.length} champ(s) analysé(s), ${violations.length} problème(s) de validation`,
      en: `${inputs.length} field(s) analyzed, ${violations.length} validation issue(s)`
    }
  }
}
