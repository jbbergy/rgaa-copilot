/**
 * RGAA Criterion 13.10: Text Content Readable Without Horizontal Scrolling
 * Checks for horizontal scrolling requirements at 320px width
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion1310() {
  const violations = []

  // Check for fixed widths that could cause horizontal scroll
  const allElements = getElementsByTypeDeep("*")

  for (const element of allElements) {
    const style = window.getComputedStyle(element)
    const width = parseInt(style.width)
    const minWidth = parseInt(style.minWidth)

    // Flag elements with fixed width > 320px
    if ((width > 320 && style.width.includes("px")) ||
      (minWidth > 320 && style.minWidth.includes("px"))) {
      violations.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element).substring(0, 200),
        message: {
          fr: `Largeur fixe détectée: ${style.width || style.minWidth}`,
          en: `Fixed width detected: ${style.width || style.minWidth}`
        },
        remediation: {
          fr: "Utiliser max-width et unités relatives pour éviter scroll horizontal",
          en: "Use max-width and relative units to avoid horizontal scroll"
        }
      })

      if (violations.length >= 100) break
    }
  }

  return {
    criterionId: "13.10",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${violations.length} élément(s) à largeur fixe risquant scroll horizontal`,
      en: `${violations.length} fixed-width element(s) risking horizontal scroll`
    }
  }
}
