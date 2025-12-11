/**
 * RGAA Criterion 5.5: Relevant Table Title
 * Checks if table titles are meaningful (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion55() {
  const manualChecks = []
  const tables = getElementsByTypeDeep("table")

  for (const table of tables) {
    const caption = table.querySelector("caption")
    const ariaLabel = table.getAttribute("aria-label")

    if (caption || ariaLabel) {
      const titleText = caption ? caption.textContent : ariaLabel
      manualChecks.push({
        element: getUniqueSelector(table),
        html: getElementHTML(table),
        message: {
          fr: `Vérifier la pertinence du titre: "${titleText?.substring(0, 50)}"`,
          en: `Verify title relevance: "${titleText?.substring(0, 50)}"`
        },
        remediation: {
          fr: "Le titre doit décrire le sujet ou le contenu du tableau",
          en: "Title must describe table subject or content"
        }
      })
    }
  }

  return {
    criterionId: "5.5",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} titre(s) de tableau nécessitant vérification`,
      en: `${manualChecks.length} table title(s) requiring verification`
    }
  }
}
