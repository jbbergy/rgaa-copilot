/**
 * RGAA Criterion 4.1: Temporal Media with Transcript/Audio Description
 * Checks for transcript or audio description availability for video/audio content
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion41() {
  const manualChecks = []

  const mediaElements = [
    ...getElementsByTypeDeep("video"),
    ...getElementsByTypeDeep("audio")
  ]

  for (const media of mediaElements) {
    const hasTrack = media.querySelector("track")
    const src = media.getAttribute("src") || ""

    manualChecks.push({
      element: getUniqueSelector(media),
      html: getElementHTML(media),
      message: {
        fr: `Média temporel détecté${hasTrack ? " avec pistes" : " sans pistes"} - vérifier transcription/audiodescription`,
        en: `Temporal media detected${hasTrack ? " with tracks" : " without tracks"} - verify transcript/audio description`
      },
      remediation: {
        fr: "Fournir une transcription textuelle ou une audiodescription pour les contenus préenregistrés",
        en: "Provide text transcript or audio description for prerecorded content"
      }
    })
  }

  return {
    criterionId: "4.1",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${mediaElements.length} média(s) temporel(s) détecté(s)`,
      en: `${mediaElements.length} temporal media detected`
    }
  }
}
