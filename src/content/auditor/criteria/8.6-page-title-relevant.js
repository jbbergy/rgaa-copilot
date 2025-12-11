/**
 * RGAA Criterion 8.6: Relevant Page Title
 * Checks if page title is meaningful (manual verification)
 */

import { getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion86() {
  const manualChecks = []

  const titleElement = document.querySelector("title")
  const titleText = titleElement?.textContent?.trim() || ""

  if (titleText) {
    // Check for generic titles
    const genericTitles = ["untitled", "page", "document", "new page", "accueil"]
    const isGeneric = genericTitles.some(g => titleText.toLowerCase() === g)

    if (isGeneric) {
      manualChecks.push({
        element: getUniqueSelector(titleElement),
        html: getElementHTML(titleElement),
        message: {
          fr: `Titre générique détecté: "${titleText}"`,
          en: `Generic title detected: "${titleText}"`
        },
        remediation: {
          fr: "Utiliser un titre descriptif et unique pour chaque page",
          en: "Use descriptive and unique title for each page"
        }
      })
    } else {
      manualChecks.push({
        element: getUniqueSelector(titleElement),
        html: getElementHTML(titleElement),
        message: {
          fr: `Vérifier la pertinence du titre: "${titleText}"`,
          en: `Verify title relevance: "${titleText}"`
        },
        remediation: {
          fr: "Le titre doit décrire le sujet ou l'objectif de la page",
          en: "Title must describe page subject or purpose"
        }
      })
    }
  }

  return {
    criterionId: "8.6",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle de la pertinence du titre",
      en: "Manual verification of title relevance"
    }
  }
}
