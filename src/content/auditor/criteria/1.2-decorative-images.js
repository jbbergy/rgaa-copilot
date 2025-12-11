/**
 * RGAA Criterion 1.2: Decorative Images Properly Ignored
 * Checks if decorative images are correctly hidden from assistive technologies
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion12() {
  const violations = []

  // Get all images
  const images = [
    ...getElementsByTypeDeep("img"),
    ...getElementsByTypeDeep("input[type='image']"),
    ...getElementsByTypeDeep("svg"),
    ...getElementsByTypeDeep("canvas")
  ].filter(isVisible)

  for (const img of images) {
    const altText = img.getAttribute("alt") || ""
    const ariaHidden = img.getAttribute("aria-hidden") === "true"
    const rolePresentation = img.getAttribute("role") === "presentation" || img.getAttribute("role") === "none"

    // Check for decorative indicators
    const hasEmptyAlt = img.hasAttribute("alt") && altText.trim() === ""

    // Violation if has empty alt but not properly marked as decorative
    if (hasEmptyAlt && !ariaHidden && !rolePresentation) {
      // This might be decorative but could be better marked
      const hasAriaLabel = img.hasAttribute("aria-label") || img.hasAttribute("aria-labelledby")
      if (hasAriaLabel) {
        violations.push({
          element: getUniqueSelector(img),
          html: getElementHTML(img),
          message: {
            fr: "Image avec alt vide mais attributs ARIA présents (conflit)",
            en: "Image with empty alt but ARIA attributes present (conflict)"
          },
          remediation: {
            fr: "Pour une image décorative, utiliser alt=\"\" ET role=\"presentation\" ou aria-hidden=\"true\"",
            en: "For decorative image, use alt=\"\" AND role=\"presentation\" or aria-hidden=\"true\""
          }
        })
      }
    }

    // Check for conflicting markup
    if (rolePresentation && altText.trim() !== "") {
      violations.push({
        element: getUniqueSelector(img),
        html: getElementHTML(img),
        message: {
          fr: "Image marquée comme décorative (role=presentation) mais avec texte alternatif",
          en: "Image marked as decorative (role=presentation) but with alt text"
        },
        remediation: {
          fr: "Supprimer le texte alternatif ou retirer role=\"presentation\"",
          en: "Remove alt text or remove role=\"presentation\""
        }
      })
    }
  }

  return {
    criterionId: "1.2",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${images.length} image(s) analysée(s), ${violations.length} violation(s) détectée(s)`,
      en: `${images.length} image(s) analyzed, ${violations.length} violation(s) detected`
    }
  }
}
