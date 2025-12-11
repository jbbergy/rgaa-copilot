/**
 * RGAA Criterion 4.2: Relevant Transcript/Audio Description
 * Checks if transcripts and audio descriptions are accurate (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion42() {
  const manualChecks = []
  const mediaElements = [...getElementsByTypeDeep("video"), ...getElementsByTypeDeep("audio")]

  for (const media of mediaElements) {
    manualChecks.push({
      element: getUniqueSelector(media),
      html: getElementHTML(media),
      message: {
        fr: "Vérifier manuellement la pertinence de la transcription/audiodescription",
        en: "Manually verify transcript/audio description relevance"
      },
      remediation: {
        fr: "La transcription doit contenir toutes les informations visuelles et sonores importantes",
        en: "Transcript must contain all important visual and audio information"
      }
    })
  }

  return {
    criterionId: "4.2",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${mediaElements.length} média(s) nécessitant vérification manuelle`,
      en: `${mediaElements.length} media requiring manual verification`
    }
  }
}
