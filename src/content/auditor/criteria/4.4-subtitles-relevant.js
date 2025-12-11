/**
 * RGAA Criterion 4.4: Relevant Subtitles
 * Checks if subtitles are accurate and complete (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion44() {
  const manualChecks = []
  const videos = getElementsByTypeDeep("video")

  for (const video of videos) {
    const tracks = video.querySelectorAll("track[kind=\"captions\"], track[kind=\"subtitles\"]")

    if (tracks.length > 0) {
      manualChecks.push({
        element: getUniqueSelector(video),
        html: getElementHTML(video),
        message: {
          fr: "Vérifier manuellement la pertinence des sous-titres",
          en: "Manually verify subtitle relevance"
        },
        remediation: {
          fr: "Les sous-titres doivent transcrire tous les dialogues et sons importants",
          en: "Subtitles must transcribe all dialogue and important sounds"
        }
      })
    }
  }

  return {
    criterionId: "4.4",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} vidéo(s) avec sous-titres nécessitant vérification`,
      en: `${manualChecks.length} video(s) with subtitles requiring verification`
    }
  }
}
