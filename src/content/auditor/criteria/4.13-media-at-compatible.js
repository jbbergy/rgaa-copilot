/**
 * RGAA Criterion 4.13: Media Compatible with Assistive Technologies
 * Checks if media players are compatible with AT (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion413() {
  const manualChecks = []
  const mediaElements = [...getElementsByTypeDeep("video"), ...getElementsByTypeDeep("audio")]

  for (const media of mediaElements) {
    manualChecks.push({
      element: getUniqueSelector(media),
      html: getElementHTML(media),
      message: {
        fr: "Vérifier manuellement la compatibilité avec les technologies d'assistance",
        en: "Manually verify compatibility with assistive technologies"
      },
      remediation: {
        fr: "Tester avec lecteurs d'écran et autres technologies d'assistance",
        en: "Test with screen readers and other assistive technologies"
      }
    })
  }

  return {
    criterionId: "4.13",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${mediaElements.length} média(s) nécessitant test de compatibilité AT`,
      en: `${mediaElements.length} media requiring AT compatibility test`
    }
  }
}
