/**
 * RGAA Criterion 8.3: Default Language Present
 * Checks if html element has lang attribute
 */

import { getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion83() {
  const violations = []

  const htmlElement = document.documentElement
  const lang = htmlElement.getAttribute("lang")

  if (!lang || lang.trim().length === 0) {
    violations.push({
      element: getUniqueSelector(htmlElement),
      html: getElementHTML(htmlElement).substring(0, 200),
      message: {
        fr: "Élément <html> sans attribut lang",
        en: "Element <html> without lang attribute"
      },
      remediation: {
        fr: "Ajouter lang=\"fr\" ou lang=\"en\" à l'élément <html>",
        en: "Add lang=\"fr\" or lang=\"en\" to <html> element"
      }
    })
  }

  return {
    criterionId: "8.3",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations,
    explanation: {
      fr: violations.length === 0 ? `Langue par défaut: ${lang}` : "Langue par défaut manquante",
      en: violations.length === 0 ? `Default language: ${lang}` : "Default language missing"
    }
  }
}
