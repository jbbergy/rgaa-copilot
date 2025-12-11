/**
 * RGAA Criterion 4.5: Synchronized Audio Description
 * Checks if video has synchronized audio description track
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion45() {
  const manualChecks = []
  const videos = getElementsByTypeDeep("video")

  for (const video of videos) {
    const audioDescTrack = video.querySelector("track[kind=\"descriptions\"]")

    manualChecks.push({
      element: getUniqueSelector(video),
      html: getElementHTML(video),
      message: {
        fr: audioDescTrack ? "Piste d'audiodescription détectée - vérifier synchronisation" : "Vérifier si audiodescription est nécessaire",
        en: audioDescTrack ? "Audio description track detected - verify synchronization" : "Verify if audio description is needed"
      },
      remediation: {
        fr: "Ajouter <track kind=\"descriptions\"> pour l'audiodescription synchronisée",
        en: "Add <track kind=\"descriptions\"> for synchronized audio description"
      }
    })
  }

  return {
    criterionId: "4.5",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${videos.length} vidéo(s) nécessitant vérification d'audiodescription`,
      en: `${videos.length} video(s) requiring audio description verification`
    }
  }
}
