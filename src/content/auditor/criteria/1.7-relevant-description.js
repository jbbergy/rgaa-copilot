/**
 * RGAA Criterion 1.7: Relevant Detailed Description
 * Checks if detailed descriptions for complex images are pertinent (manual check)
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion17() {
  const manualChecks = []

  const images = [...getElementsByTypeDeep("img")].filter(isVisible)

  for (const img of images) {
    const longdesc = img.getAttribute("longdesc")
    const ariaDescribedby = img.getAttribute("aria-describedby")

    if (longdesc || ariaDescribedby) {
      let descriptionContent = ""

      if (ariaDescribedby) {
        const descElement = document.getElementById(ariaDescribedby)
        descriptionContent = descElement ? descElement.textContent : ""
      }

      manualChecks.push({
        element: getUniqueSelector(img),
        html: getElementHTML(img),
        message: {
          fr: `Description détaillée présente${descriptionContent ? `: "${descriptionContent.substring(0, 100)}..."` : ""} - vérifier la pertinence`,
          en: `Detailed description present${descriptionContent ? `: "${descriptionContent.substring(0, 100)}..."` : ""} - verify relevance`
        },
        remediation: {
          fr: "Vérifier que la description détaillée fournit toutes les informations nécessaires à la compréhension de l'image",
          en: "Verify that detailed description provides all information necessary to understand the image"
        }
      })
    }
  }

  return {
    criterionId: "1.7",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${manualChecks.length} description(s) détaillée(s) nécessitant une vérification manuelle`,
      en: `${manualChecks.length} detailed description(s) requiring manual verification`
    }
  }
}
