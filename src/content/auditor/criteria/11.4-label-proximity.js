/**
 * RGAA Criterion 11.4: Label and Field Adjacent
 * Checks if labels are visually close to their fields
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion114() {
  const violations = []

  const inputs = [...getElementsByTypeDeep("input, select, textarea")].filter(isVisible)

  for (const input of inputs) {
    const label = input.labels?.[0]

    if (label) {
      // Check if label and input are far apart in DOM
      const labelRect = label.getBoundingClientRect()
      const inputRect = input.getBoundingClientRect()

      const distance = Math.sqrt(
        Math.pow(labelRect.left - inputRect.left, 2) +
        Math.pow(labelRect.top - inputRect.top, 2)
      )

      // If distance > 500px, they might be too far apart
      if (distance > 500) {
        violations.push({
          element: getUniqueSelector(input),
          html: getElementHTML(input),
          message: {
            fr: `Étiquette et champ éloignés (${Math.round(distance)}px)`,
            en: `Label and field distant (${Math.round(distance)}px)`
          },
          remediation: {
            fr: "Placer l'étiquette visuellement proche du champ",
            en: "Place label visually close to field"
          }
        })
      }
    }
  }

  return {
    criterionId: "11.4",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${inputs.length} champ(s) analysé(s), ${violations.length} problème(s)`,
      en: `${inputs.length} field(s) analyzed, ${violations.length} issue(s)`
    }
  }
}
