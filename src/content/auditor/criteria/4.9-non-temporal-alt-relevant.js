/**
 * RGAA Criterion 4.9: Relevant Non-Temporal Media Alternative
 * Checks if alternatives for non-temporal media are pertinent (manual)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion49() {
  const manualChecks = []

  const canvas = getElementsByTypeDeep("canvas")
  const svgAnimations = getElementsByTypeDeep("svg").filter(svg =>
    svg.querySelector("animate, animateTransform, animateMotion")
  )

  for (const element of [...canvas, ...svgAnimations]) {
    const ariaLabel = element.getAttribute("aria-label")
    const ariaDescribedby = element.getAttribute("aria-describedby")

    if (ariaLabel || ariaDescribedby) {
      manualChecks.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: "Vérifier la pertinence de l'alternative fournie",
          en: "Verify relevance of provided alternative"
        },
        remediation: {
          fr: "L'alternative doit décrire toutes les informations importantes du média",
          en: "Alternative must describe all important media information"
        }
      })
    }
  }

  return {
    criterionId: "4.9",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} alternative(s) nécessitant vérification`,
      en: `${manualChecks.length} alternative(s) requiring verification`
    }
  }
}
