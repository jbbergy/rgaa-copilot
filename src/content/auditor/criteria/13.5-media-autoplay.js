/**
 * RGAA Criterion 13.5: Audio/Video Auto-Playing Controllable
 * Checks for auto-playing media without controls
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion135() {
  const violations = []

  const audios = getElementsByTypeDeep("audio")
  const videos = getElementsByTypeDeep("video")

  for (const media of [...audios, ...videos]) {
    if (media.hasAttribute("autoplay")) {
      // Check if duration is > 3 seconds (WCAG 1.4.2)
      const duration = media.duration || 0

      if (duration > 3 && !media.hasAttribute("controls")) {
        violations.push({
          element: getUniqueSelector(media),
          html: getElementHTML(media),
          message: {
            fr: `${media.tagName} en lecture automatique > 3s sans contrôles`,
            en: `${media.tagName} auto-playing > 3s without controls`
          },
          remediation: {
            fr: "Ajouter controls ou retirer autoplay, ou limiter à 3s",
            en: "Add controls or remove autoplay, or limit to 3s"
          }
        })
      }
    }
  }

  return {
    criterionId: "13.5",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${violations.length} média(s) auto-joué(s) sans contrôle`,
      en: `${violations.length} auto-playing media without control`
    }
  }
}
