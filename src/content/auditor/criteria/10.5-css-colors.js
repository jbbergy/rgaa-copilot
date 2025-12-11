/**
 * RGAA Criterion 10.5: Correct CSS Color Declarations
 * Checks if color and background-color are both specified
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion105() {
  const violations = []

  const styledElements = getElementsByTypeDeep("*").filter(el => {
    if (!isVisible(el)) return false
    const style = window.getComputedStyle(el)
    return style.color !== "" || style.backgroundColor !== ""
  })

  for (const element of styledElements) {
    const style = window.getComputedStyle(element)
    const hasColor = style.color && style.color !== "rgba(0, 0, 0, 0)"
    const hasBgColor = style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "transparent"

    // If one is set, both should be set
    if ((hasColor && !hasBgColor) || (!hasColor && hasBgColor)) {
      violations.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: "Couleur définie sans couleur d'arrière-plan (ou inverse)",
          en: "Color defined without background-color (or vice versa)"
        },
        remediation: {
          fr: "Toujours définir color ET background-color ensemble",
          en: "Always define color AND background-color together"
        }
      })
    }
  }

  return {
    criterionId: "10.5",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${violations.length} problème(s) de déclaration de couleurs`,
      en: `${violations.length} color declaration issue(s)`
    }
  }
}
