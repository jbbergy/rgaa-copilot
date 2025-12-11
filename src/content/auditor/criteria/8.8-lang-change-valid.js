/**
 * RGAA Criterion 8.8: Language Change Code Valid and Relevant
 * Checks if lang attribute changes use valid codes
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion88() {
  const violations = []

  const elementsWithLang = getElementsByTypeDeep("[lang]").filter(el =>
    el !== document.documentElement && isVisible(el)
  )

  for (const element of elementsWithLang) {
    const lang = element.getAttribute("lang")
    const validLangPattern = /^[a-z]{2}(-[A-Z]{2})?$/

    if (!validLangPattern.test(lang)) {
      violations.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: `Code de langue invalide: "${lang}"`,
          en: `Invalid language code: "${lang}"`
        },
        remediation: {
          fr: "Utiliser un code ISO 639-1 valide (ex: \"en\", \"de\", \"it\")",
          en: "Use valid ISO 639-1 code (e.g., \"en\", \"de\", \"it\")"
        }
      })
    }
  }

  return {
    criterionId: "8.8",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${elementsWithLang.length} changement(s) de langue, ${violations.length} invalide(s)`,
      en: `${elementsWithLang.length} language change(s), ${violations.length} invalid`
    }
  }
}
