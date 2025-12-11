/**
 * RGAA Criterion 3.1: Information Not Given Solely by Color
 * Checks if information is conveyed by color alone (manual check required)
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion31() {
  const manualChecks = []

  // Look for elements with color-based styling that might convey information
  const styledElements = getElementsByTypeDeep("*").filter(el => {
    if (!isVisible(el)) return false
    const computedStyle = window.getComputedStyle(el)
    const color = computedStyle.color
    const backgroundColor = computedStyle.backgroundColor
    const className = el.getAttribute("class") || ""

    // Check for color-related class names
    const colorKeywords = ["red", "green", "blue", "yellow", "orange", "purple", "color-", "bg-", "text-"]
    return colorKeywords.some(keyword => className.toLowerCase().includes(keyword))
  })

  // Focus on interactive and informational elements
  const relevantElements = styledElements.filter(el => {
    const tagName = el.tagName.toLowerCase()
    return ["a", "button", "span", "div", "td", "th", "li"].includes(tagName)
  })

  for (const el of relevantElements.slice(0, 50)) {
    manualChecks.push({
      element: getUniqueSelector(el),
      html: getElementHTML(el),
      message: {
        fr: "Élément avec classe de couleur détecté - vérifier si l'information n'est pas donnée uniquement par la couleur",
        en: "Element with color class detected - verify information is not conveyed by color alone"
      },
      remediation: {
        fr: "L'information doit être disponible via d'autres moyens (texte, icône, motif)",
        en: "Information must be available through other means (text, icon, pattern)"
      }
    })
  }

  return {
    criterionId: "3.1",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${relevantElements.length} élément(s) coloré(s) détecté(s) nécessitant une vérification manuelle`,
      en: `${relevantElements.length} colored element(s) detected requiring manual verification`
    }
  }
}
