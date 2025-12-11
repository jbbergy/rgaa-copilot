/**
 * RGAA Criterion 11.13: Deductible Field Purpose (Autocomplete)
 * Checks if form fields have autocomplete attributes for personal data
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion1113() {
  const violations = []

  const inputs = [...getElementsByTypeDeep("input")].filter(isVisible)

  const personalDataTypes = [
    { type: "email", autocomplete: "email" },
    { type: "tel", autocomplete: "tel" },
    { name: ["name", "nom", "prenom", "firstname", "lastname"], autocomplete: "name" },
    { name: ["address", "adresse", "street", "rue"], autocomplete: "street-address" },
    { name: ["city", "ville"], autocomplete: "address-level2" },
    { name: ["postal", "zip", "codepostal"], autocomplete: "postal-code" },
    { name: ["country", "pays"], autocomplete: "country" }
  ]

  for (const input of inputs) {
    const type = input.getAttribute("type") || "text"
    const name = (input.getAttribute("name") || "").toLowerCase()
    const autocomplete = input.getAttribute("autocomplete")

    for (const dataType of personalDataTypes) {
      let matches = false

      if (dataType.type && type === dataType.type) {
        matches = true
      } else if (dataType.name) {
        matches = dataType.name.some(keyword => name.includes(keyword))
      }

      if (matches && !autocomplete) {
        violations.push({
          element: getUniqueSelector(input),
          html: getElementHTML(input),
          message: {
            fr: `Champ de données personnelles sans autocomplete (détecté: ${dataType.autocomplete})`,
            en: `Personal data field without autocomplete (detected: ${dataType.autocomplete})`
          },
          remediation: {
            fr: `Ajouter autocomplete="${dataType.autocomplete}"`,
            en: `Add autocomplete="${dataType.autocomplete}"`
          }
        })
        break
      }
    }
  }

  return {
    criterionId: "11.13",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${inputs.length} champ(s) analysé(s), ${violations.length} sans autocomplete`,
      en: `${inputs.length} field(s) analyzed, ${violations.length} without autocomplete`
    }
  }
}
