/**
 * RGAA Criterion 9.4: Quotes Correctly Indicated
 * Checks if quotes use appropriate markup (blockquote, q, cite)
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion94() {
  const manualChecks = []

  const blockquotes = [...getElementsByTypeDeep("blockquote")].filter(isVisible)
  const qElements = [...getElementsByTypeDeep("q")].filter(isVisible)

  // Check blockquotes for cite attribute or cite element
  for (const blockquote of blockquotes) {
    const citeAttr = blockquote.getAttribute("cite")
    const citeElement = blockquote.querySelector("cite")

    if (!citeAttr && !citeElement) {
      manualChecks.push({
        element: getUniqueSelector(blockquote),
        html: getElementHTML(blockquote),
        message: {
          fr: "Citation <blockquote> sans attribution (cite ou <cite>)",
          en: "Quote <blockquote> without attribution (cite or <cite>)"
        },
        remediation: {
          fr: "Ajouter l'attribut cite ou un élément <cite> pour identifier la source",
          en: "Add cite attribute or <cite> element to identify source"
        }
      })
    }
  }

  return {
    criterionId: "9.4",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${blockquotes.length} citation(s) bloc, ${qElements.length} citation(s) inline`,
      en: `${blockquotes.length} block quote(s), ${qElements.length} inline quote(s)`
    }
  }
}
