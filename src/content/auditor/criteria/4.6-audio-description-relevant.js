/**
 * RGAA Criterion 4.6: Relevant Audio Description
 * Checks if audio description is accurate (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion46() {
  const manualChecks = []
  const videos = getElementsByTypeDeep("video")

  for (const video of videos) {
    const audioDescTrack = video.querySelector("track[kind=\"descriptions\"]")

    if (audioDescTrack) {
      manualChecks.push({
        element: getUniqueSelector(video),
        html: getElementHTML(video),
        message: {
          fr: "Vérifier que l'audiodescription décrit tous les éléments visuels importants",
          en: "Verify audio description describes all important visual elements"
        },
        remediation: {
          fr: "L'audiodescription doit transmettre toutes les informations visuelles essentielles",
          en: "Audio description must convey all essential visual information"
        }
      })
    }
  }

  return {
    criterionId: "4.6",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} audiodescription(s) nécessitant vérification`,
      en: `${manualChecks.length} audio description(s) requiring verification`
    }
  }
}
