/**
 * RGAA Criterion 1.8: Text Images Replaced by Styled Text
 * Checks if images of text are used instead of real text
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion18() {
  const manualChecks = []

  const images = [...getElementsByTypeDeep("img")].filter(isVisible)

  for (const img of images) {
    const alt = img.getAttribute("alt") || ""
    const src = img.getAttribute("src") || ""

    // Heuristic: if alt text is substantial, might be text image
    if (alt.length > 10 && !alt.toLowerCase().includes("logo")) {
      // Check if image might contain text
      const textImageKeywords = ["text", "heading", "title", "quote", "button"]
      const mightBeTextImage = textImageKeywords.some(keyword =>
        src.toLowerCase().includes(keyword)
      )

      if (mightBeTextImage || alt.length > 30) {
        manualChecks.push({
          element: getUniqueSelector(img),
          html: getElementHTML(img),
          message: {
            fr: `Image potentiellement textuelle détectée (alt="${alt.substring(0, 50)}...")`,
            en: `Potential text image detected (alt="${alt.substring(0, 50)}...")`
          },
          remediation: {
            fr: "Vérifier si cette image contient du texte qui pourrait être remplacé par du texte stylé en CSS",
            en: "Verify if this image contains text that could be replaced with CSS-styled text"
          }
        })
      }
    }

    // Check for obvious text images by filename
    if (src.match(/\b(text|heading|title|label|button)[-_]?\d*\.(png|jpg|gif|svg)/i)) {
      manualChecks.push({
        element: getUniqueSelector(img),
        html: getElementHTML(img),
        message: {
          fr: "Nom de fichier suggérant une image textuelle",
          en: "Filename suggests text image"
        },
        remediation: {
          fr: "Remplacer par du texte stylé sauf si essentiel (logo, graphisme artistique)",
          en: "Replace with styled text unless essential (logo, artistic graphics)"
        }
      })
    }
  }

  return {
    criterionId: "1.8",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} image(s) textuelle(s) potentielle(s) détectée(s)`,
      en: `${manualChecks.length} potential text image(s) detected`
    }
  }
}
