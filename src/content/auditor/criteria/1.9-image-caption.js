/**
 * RGAA Criterion 1.9: Image Caption Correctly Associated
 * Checks if image captions are properly associated via figure/figcaption
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion19() {
  const violations = []

  const images = [...getElementsByTypeDeep("img")].filter(isVisible)

  for (const img of images) {
    const parent = img.parentElement
    const ariaDescribedby = img.getAttribute("aria-describedby")

    // Check if image has adjacent caption-like text
    const nextSibling = img.nextElementSibling
    const prevSibling = img.previousElementSibling

    const hasCaptionLikeText = (el) => {
      if (!el) return false
      const tagName = el.tagName.toLowerCase()
      const className = el.getAttribute("class") || ""
      return (
        tagName === "figcaption" ||
        className.includes("caption") ||
        className.includes("legend")
      )
    }

    const hasCaption = hasCaptionLikeText(nextSibling) || hasCaptionLikeText(prevSibling)

    if (hasCaption) {
      // Caption exists, check if properly associated
      if (parent?.tagName.toLowerCase() !== "figure") {
        violations.push({
          element: getUniqueSelector(img),
          html: getElementHTML(img.parentElement || img),
          message: {
            fr: "Légende d'image détectée mais pas dans un élément <figure>",
            en: "Image caption detected but not in <figure> element"
          },
          remediation: {
            fr: "Envelopper l'image et sa légende dans un élément <figure> avec <figcaption>",
            en: "Wrap image and caption in <figure> element with <figcaption>"
          }
        })
      }
    }

    // Check for figcaption without figure
    if (nextSibling?.tagName.toLowerCase() === "figcaption" && parent?.tagName.toLowerCase() !== "figure") {
      violations.push({
        element: getUniqueSelector(nextSibling),
        html: getElementHTML(nextSibling),
        message: {
          fr: "Élément <figcaption> utilisé hors d'un <figure>",
          en: "Element <figcaption> used outside of <figure>"
        },
        remediation: {
          fr: "L'élément <figcaption> doit être enfant direct d'un <figure>",
          en: "Element <figcaption> must be direct child of <figure>"
        }
      })
    }
  }

  return {
    criterionId: "1.9",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${violations.length} violation(s) de légende d'image détectée(s)`,
      en: `${violations.length} image caption violation(s) detected`
    }
  }
}
