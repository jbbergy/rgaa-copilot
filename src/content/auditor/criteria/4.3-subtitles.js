/**
 * RGAA Criterion 4.3: Synchronized Subtitles
 * Checks if video has synchronized subtitles/captions
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion43() {
  const violations = []
  const videos = getElementsByTypeDeep("video")

  for (const video of videos) {
    const tracks = video.querySelectorAll("track[kind=\"captions\"], track[kind=\"subtitles\"]")

    if (tracks.length === 0) {
      violations.push({
        element: getUniqueSelector(video),
        html: getElementHTML(video),
        message: {
          fr: "Vidéo sans pistes de sous-titres",
          en: "Video without subtitle tracks"
        },
        remediation: {
          fr: "Ajouter des éléments <track kind=\"captions\"> ou <track kind=\"subtitles\">",
          en: "Add <track kind=\"captions\"> or <track kind=\"subtitles\"> elements"
        }
      })
    }
  }

  return {
    criterionId: "4.3",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${videos.length} vidéo(s) analysée(s), ${violations.length} sans sous-titres`,
      en: `${videos.length} video(s) analyzed, ${violations.length} without subtitles`
    }
  }
}
