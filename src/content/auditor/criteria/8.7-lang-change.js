/**
 * RGAA Criterion 8.7: Language Change Indicated
 * Checks if language changes are marked with lang attribute
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion87() {
  const manualChecks = []

  const defaultLang = document.documentElement.getAttribute("lang")?.substring(0, 2).toLowerCase()

  // Look for elements with different lang attributes
  const elementsWithLang = getElementsByTypeDeep("[lang]").filter(el =>
    el !== document.documentElement && isVisible(el)
  )

  for (const element of elementsWithLang) {
    const lang = element.getAttribute("lang")
    manualChecks.push({
      element: getUniqueSelector(element),
      html: getElementHTML(element),
      message: {
        fr: `Changement de langue détecté: ${defaultLang} → ${lang}`,
        en: `Language change detected: ${defaultLang} → ${lang}`
      },
      remediation: {
        fr: "Vérifier que l'attribut lang est correctement appliqué aux passages en langue étrangère",
        en: "Verify lang attribute is correctly applied to foreign language passages"
      }
    })
  }

  // Note: Detecting unlabeled language changes would require NLP, so this is primarily manual

  return {
    criterionId: "8.7",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${elementsWithLang.length} changement(s) de langue marqué(s)`,
      en: `${elementsWithLang.length} language change(s) marked`
    }
  }
}
