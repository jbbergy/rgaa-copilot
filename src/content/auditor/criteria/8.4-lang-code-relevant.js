/**
 * RGAA Criterion 8.4: Relevant Language Code
 * Checks if lang attribute uses valid language codes
 */

import { getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion84() {
  const violations = []

  const htmlElement = document.documentElement
  const lang = htmlElement.getAttribute("lang")

  if (lang) {
    // Valid lang codes are 2-letter ISO 639-1 or 2-letter + region
    const validLangPattern = /^[a-z]{2}(-[A-Z]{2})?$/

    if (!validLangPattern.test(lang)) {
      violations.push({
        element: getUniqueSelector(htmlElement),
        html: getElementHTML(htmlElement).substring(0, 200),
        message: {
          fr: `Code de langue invalide: "${lang}"`,
          en: `Invalid language code: "${lang}"`
        },
        remediation: {
          fr: "Utiliser un code ISO 639-1 valide (ex: \"fr\", \"en\", \"fr-FR\")",
          en: "Use valid ISO 639-1 code (e.g., \"fr\", \"en\", \"fr-FR\")"
        }
      })
    }
  }

  return {
    criterionId: "8.4",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations,
    explanation: {
      fr: violations.length === 0 ? "Code de langue valide" : "Code de langue invalide",
      en: violations.length === 0 ? "Valid language code" : "Invalid language code"
    }
  }
}
