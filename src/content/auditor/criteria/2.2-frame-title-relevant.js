/**
 * RGAA Criterion 2.2: Relevant Frame Title
 * Checks if frame titles are meaningful (manual check)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion22() {
  const manualChecks = []

  const frames = [
    ...getElementsByTypeDeep("iframe"),
    ...getElementsByTypeDeep("frame")
  ]

  for (const frame of frames) {
    const title = frame.getAttribute("title") || ""
    const src = frame.getAttribute("src") || ""

    if (title.trim().length > 0) {
      // Check for generic titles
      const genericTitles = ["frame", "iframe", "content", "page"]
      const isGeneric = genericTitles.some(g => title.toLowerCase() === g)

      if (isGeneric) {
        manualChecks.push({
          element: getUniqueSelector(frame),
          html: getElementHTML(frame),
          message: {
            fr: `Titre de cadre générique: "${title}"`,
            en: `Generic frame title: "${title}"`
          },
          remediation: {
            fr: "Le titre doit décrire précisément le contenu ou la fonction du cadre",
            en: "Title must precisely describe frame content or function"
          }
        })
      } else {
        manualChecks.push({
          element: getUniqueSelector(frame),
          html: getElementHTML(frame),
          message: {
            fr: `Vérifier la pertinence du titre: "${title}"`,
            en: `Verify title relevance: "${title}"`
          },
          remediation: {
            fr: "Le titre doit être pertinent par rapport au contenu du cadre",
            en: "Title must be relevant to frame content"
          }
        })
      }
    }
  }

  return {
    criterionId: "2.2",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} titre(s) de cadre nécessitant une vérification manuelle`,
      en: `${manualChecks.length} frame title(s) requiring manual verification`
    }
  }
}
