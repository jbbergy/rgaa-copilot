/**
 * RGAA Criterion 5.2: Relevant Table Summary
 * Checks if table summaries are pertinent (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion52() {
  const manualChecks = []
  const tables = getElementsByTypeDeep("table")

  for (const table of tables) {
    const caption = table.querySelector("caption")
    const ariaDescribedby = table.getAttribute("aria-describedby")

    if (caption || ariaDescribedby) {
      manualChecks.push({
        element: getUniqueSelector(table),
        html: getElementHTML(table),
        message: {
          fr: "Vérifier la pertinence du résumé/caption du tableau",
          en: "Verify relevance of table summary/caption"
        },
        remediation: {
          fr: "Le résumé doit décrire la structure et le contenu du tableau",
          en: "Summary must describe table structure and content"
        }
      })
    }
  }

  return {
    criterionId: "5.2",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} résumé(s) de tableau nécessitant vérification`,
      en: `${manualChecks.length} table summary(ies) requiring verification`
    }
  }
}
