/**
 * RGAA Criterion 10.1: CSS Used for Presentation
 * Checks if presentational HTML attributes are avoided in favor of CSS
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion101() {
  const violations = []

  // Check for deprecated presentational attributes
  const presentationalAttrs = ["bgcolor", "color", "align", "valign", "width", "height", "border", "cellspacing", "cellpadding"]
  const allElements = getElementsByTypeDeep("*")

  for (const element of allElements) {
    for (const attr of presentationalAttrs) {
      if (element.hasAttribute(attr)) {
        const tagName = element.tagName.toLowerCase()
        // Exception: width/height on img are acceptable
        if (!(tagName === "img" && (attr === "width" || attr === "height"))) {
          violations.push({
            element: getUniqueSelector(element),
            html: getElementHTML(element),
            message: {
              fr: `Attribut de présentation déprécié: ${attr}`,
              en: `Deprecated presentational attribute: ${attr}`
            },
            remediation: {
              fr: "Utiliser CSS pour la présentation",
              en: "Use CSS for presentation"
            }
          })
          break
        }
      }
    }
  }

  return {
    criterionId: "10.1",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${violations.length} attribut(s) de présentation déprécié(s)`,
      en: `${violations.length} deprecated presentational attribute(s)`
    }
  }
}
