/**
 * RGAA Criterion 13.3: Moving/Blinking Content Controllable
 * Checks for auto-playing animations without controls
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion133() {
  const violations = []

  // Check for videos/animations that autoplay
  const videos = getElementsByTypeDeep("video")
  for (const video of videos) {
    if (video.hasAttribute("autoplay") && !video.hasAttribute("controls")) {
      violations.push({
        element: getUniqueSelector(video),
        html: getElementHTML(video),
        message: {
          fr: "Vidéo en lecture automatique sans contrôles",
          en: "Auto-playing video without controls"
        },
        remediation: {
          fr: "Ajouter l'attribut controls ou retirer autoplay",
          en: "Add controls attribute or remove autoplay"
        }
      })
    }
  }

  // Check for marquee/blink (deprecated)
  const marquees = getElementsByTypeDeep("marquee")
  const blinks = getElementsByTypeDeep("blink")

  for (const el of [...marquees, ...blinks]) {
    violations.push({
      element: getUniqueSelector(el),
      html: getElementHTML(el),
      message: {
        fr: `Élément ${el.tagName.toLowerCase()} déprécié détecté`,
        en: `Deprecated ${el.tagName.toLowerCase()} element detected`
      },
      remediation: {
        fr: "Retirer l'élément et utiliser CSS animations contrôlables",
        en: "Remove element and use controllable CSS animations"
      }
    })
  }

  return {
    criterionId: "13.3",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${violations.length} élément(s) en mouvement non contrôlable détecté(s)`,
      en: `${violations.length} uncontrollable moving element(s) detected`
    }
  }
}
