/**
 * RGAA Criterion 1.3: Relevant Alternative Text
 * Checks if alternative text is meaningful (manual check required)
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion13() {
  const manualChecks = []

  const images = [
    ...getElementsByTypeDeep("img"),
    ...getElementsByTypeDeep("input[type='image']"),
    ...getElementsByTypeDeep("area")
  ].filter(isVisible)

  for (const img of images) {
    const altText = img.getAttribute("alt") || ""

    if (altText.trim().length > 0) {
      // Check for common placeholder text
      const placeholders = ["image", "picture", "photo", "img", "icon", "graphic"]
      const altLower = altText.toLowerCase()
      const hasPlaceholder = placeholders.some(p => altLower === p || altLower.includes(`${p}.`))

      if (hasPlaceholder) {
        manualChecks.push({
          element: getUniqueSelector(img),
          html: getElementHTML(img),
          message: {
            fr: `Texte alternatif générique détecté: "${altText}"`,
            en: `Generic alt text detected: "${altText}"`
          },
          remediation: {
            fr: "Vérifier que le texte alternatif décrit le contenu ou la fonction de l'image",
            en: "Verify that alt text describes the image content or function"
          }
        })
      } else {
        // All non-empty alt text requires manual verification
        manualChecks.push({
          element: getUniqueSelector(img),
          html: getElementHTML(img),
          message: {
            fr: `Vérification manuelle requise pour: "${altText}"`,
            en: `Manual check required for: "${altText}"`
          },
          remediation: {
            fr: "Vérifier que le texte alternatif est pertinent et décrit correctement l'image",
            en: "Verify that alt text is relevant and correctly describes the image"
          }
        })
      }
    }
  }

  return {
    criterionId: "1.3",
    status: "manual",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${images.length} image(s) avec texte alternatif nécessitent une vérification manuelle`,
      en: `${images.length} image(s) with alt text require manual verification`
    }
  }
}
