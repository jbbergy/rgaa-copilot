/**
 * RGAA Criterion 11.6: Grouping with Legend
 * Checks if fieldsets have legend elements
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion116() {
  const violations = []

  const fieldsets = getElementsByTypeDeep("fieldset")

  for (const fieldset of fieldsets) {
    const legend = fieldset.querySelector("legend")

    if (!legend) {
      violations.push({
        element: getUniqueSelector(fieldset),
        html: getElementHTML(fieldset),
        message: {
          fr: "Élément <fieldset> sans <legend>",
          en: "Element <fieldset> without <legend>"
        },
        remediation: {
          fr: "Ajouter un élément <legend> comme premier enfant du <fieldset>",
          en: "Add <legend> element as first child of <fieldset>"
        }
      })
    } else {
      const legendText = legend.textContent?.trim() || ""
      if (legendText.length === 0) {
        violations.push({
          element: getUniqueSelector(legend),
          html: getElementHTML(legend),
          message: {
            fr: "Élément <legend> vide",
            en: "Empty <legend> element"
          },
          remediation: {
            fr: "Fournir un texte descriptif pour la légende",
            en: "Provide descriptive text for legend"
          }
        })
      }
    }
  }

  return {
    criterionId: "11.6",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${fieldsets.length} fieldset(s) analysé(s), ${violations.length} sans legend valide`,
      en: `${fieldsets.length} fieldset(s) analyzed, ${violations.length} without valid legend`
    }
  }
}
