/**
 * RGAA Criterion 8.5: Page Title Present
 * Checks if document has title element with content
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion85() {
  const violations = []

  const titleElement = document.querySelector("title")
  const titleText = titleElement?.textContent?.trim() || ""

  if (!titleElement) {
    violations.push({
      element: "head",
      html: document.head?.outerHTML.substring(0, 200) || "",
      message: {
        fr: "Élément <title> manquant dans <head>",
        en: "Element <title> missing in <head>"
      },
      remediation: {
        fr: "Ajouter un élément <title> dans le <head>",
        en: "Add <title> element in <head>"
      }
    })
  } else if (titleText.length === 0) {
    violations.push({
      element: getUniqueSelector(titleElement),
      html: getElementHTML(titleElement),
      message: {
        fr: "Élément <title> vide",
        en: "Empty <title> element"
      },
      remediation: {
        fr: "Fournir un titre de page descriptif",
        en: "Provide descriptive page title"
      }
    })
  }

  return {
    criterionId: "8.5",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations,
    explanation: {
      fr: violations.length === 0 ? `Titre présent: "${titleText}"` : "Titre manquant ou vide",
      en: violations.length === 0 ? `Title present: "${titleText}"` : "Title missing or empty"
    }
  }
}
