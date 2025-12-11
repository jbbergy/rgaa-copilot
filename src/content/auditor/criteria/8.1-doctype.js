/**
 * RGAA Criterion 8.1: Page Defined by Document Type
 * Checks if page has valid DOCTYPE declaration
 */

import { getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion81() {
  const violations = []

  const doctype = document.doctype

  if (!doctype) {
    violations.push({
      element: "html",
      html: document.documentElement.outerHTML.substring(0, 200),
      message: {
        fr: "Aucune déclaration DOCTYPE trouvée",
        en: "No DOCTYPE declaration found"
      },
      remediation: {
        fr: "Ajouter <!DOCTYPE html> au début du document",
        en: "Add <!DOCTYPE html> at document start"
      }
    })
  } else if (doctype.name !== "html") {
    violations.push({
      element: "html",
      html: `<!DOCTYPE ${doctype.name}>`,
      message: {
        fr: `DOCTYPE invalide: ${doctype.name}`,
        en: `Invalid DOCTYPE: ${doctype.name}`
      },
      remediation: {
        fr: "Utiliser <!DOCTYPE html> pour HTML5",
        en: "Use <!DOCTYPE html> for HTML5"
      }
    })
  }

  return {
    criterionId: "8.1",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations,
    explanation: {
      fr: violations.length === 0 ? "DOCTYPE HTML5 valide présent" : "Problème de DOCTYPE",
      en: violations.length === 0 ? "Valid HTML5 DOCTYPE present" : "DOCTYPE issue"
    }
  }
}
