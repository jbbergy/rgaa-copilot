/**
 * RGAA Criterion 1.1: Text Alternatives for Images
 * Checks if images have appropriate alt attributes
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion11() {
  const violations = []

  // Get all images
  const images = [
    ...getElementsByTypeDeep("img"),
    ...getElementsByTypeDeep("input[type='image']"),
    ...getElementsByTypeDeep("area")
  ].filter(isVisible)

  for (const img of images) {
    const hasAlt = img.hasAttribute("alt")
    const altText = img.getAttribute("alt") || ""
    const isDecorative = img.hasAttribute("role") && img.getAttribute("role") === "presentation"

    // Violation if no alt attribute (unless decorative)
    if (!hasAlt && !isDecorative) {
      violations.push({
        element: getUniqueSelector(img),
        html: getElementHTML(img),
        message: {
          fr: "Image sans attribut alt",
          en: "Image without alt attribute"
        },
        remediation: {
          fr: "Ajouter un attribut alt avec une description textuelle de l'image",
          en: "Add an alt attribute with a text description of the image"
        }
      })
    }
  }

  return {
    criterionId: "1.1",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100), // Limit to 100
    explanation: {
      fr: `${images.length} image(s) analysée(s), ${violations.length} violation(s) détectée(s)`,
      en: `${images.length} image(s) analyzed, ${violations.length} violation(s) detected`
    }
  }
}
