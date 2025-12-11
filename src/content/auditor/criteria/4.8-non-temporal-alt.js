/**
 * RGAA Criterion 4.8: Non-Temporal Media with Alternative
 * Checks if non-temporal media (animations, etc.) have alternatives
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion48() {
  const manualChecks = []

  // Look for canvas, SVG animations, etc.
  const canvas = getElementsByTypeDeep("canvas")
  const svgAnimations = getElementsByTypeDeep("svg").filter(svg =>
    svg.querySelector("animate, animateTransform, animateMotion")
  )

  for (const element of [...canvas, ...svgAnimations]) {
    manualChecks.push({
      element: getUniqueSelector(element),
      html: getElementHTML(element),
      message: {
        fr: "Média non temporel détecté - vérifier qu'une alternative existe",
        en: "Non-temporal media detected - verify alternative exists"
      },
      remediation: {
        fr: "Fournir une alternative textuelle ou équivalent accessible",
        en: "Provide text alternative or accessible equivalent"
      }
    })
  }

  return {
    criterionId: "4.8",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} média(s) non temporel(s) détecté(s)`,
      en: `${manualChecks.length} non-temporal media detected`
    }
  }
}
