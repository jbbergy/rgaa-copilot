/**
 * RGAA Criterion 1.6: Image with Detailed Description
 * Checks if complex images have detailed descriptions via longdesc or adjacent text
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion16() {
  const manualChecks = []

  const images = [...getElementsByTypeDeep("img")].filter(isVisible)

  for (const img of images) {
    const alt = img.getAttribute("alt") || ""
    const longdesc = img.getAttribute("longdesc")
    const ariaDescribedby = img.getAttribute("aria-describedby")

    // Check if image might be complex (charts, diagrams, infographics)
    const src = img.getAttribute("src") || ""
    const complexKeywords = ["chart", "graph", "diagram", "infographic", "map"]
    const mightBeComplex = complexKeywords.some(keyword =>
      src.toLowerCase().includes(keyword) ||
      alt.toLowerCase().includes(keyword)
    )

    if (mightBeComplex) {
      const hasDetailedDesc = longdesc || ariaDescribedby

      manualChecks.push({
        element: getUniqueSelector(img),
        html: getElementHTML(img),
        message: {
          fr: hasDetailedDesc
            ? "Image complexe avec description détaillée - vérifier la pertinence"
            : "Image complexe détectée - vérifier si une description détaillée est nécessaire",
          en: hasDetailedDesc
            ? "Complex image with detailed description - verify relevance"
            : "Complex image detected - verify if detailed description is needed"
        },
        remediation: {
          fr: "Les images complexes doivent avoir une description détaillée via longdesc, aria-describedby, ou texte adjacent",
          en: "Complex images must have detailed description via longdesc, aria-describedby, or adjacent text"
        }
      })
    }
  }

  return {
    criterionId: "1.6",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} image(s) complexe(s) nécessitant une vérification manuelle`,
      en: `${manualChecks.length} complex image(s) requiring manual verification`
    }
  }
}
