/**
 * RGAA Criterion 8.10: Reading Direction Changes Indicated
 * Checks if text direction changes are marked with dir attribute
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion810() {
  const manualChecks = []

  // Look for elements with dir attribute
  const elementsWithDir = getElementsByTypeDeep("[dir]").filter(isVisible)

  for (const element of elementsWithDir) {
    const dir = element.getAttribute("dir")

    if (!["ltr", "rtl", "auto"].includes(dir)) {
      manualChecks.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: `Valeur invalide pour dir: "${dir}"`,
          en: `Invalid dir value: "${dir}"`
        },
        remediation: {
          fr: "Utiliser dir=\"ltr\", dir=\"rtl\", ou dir=\"auto\"",
          en: "Use dir=\"ltr\", dir=\"rtl\", or dir=\"auto\""
        }
      })
    } else {
      manualChecks.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: `Changement de direction détecté: dir="${dir}"`,
          en: `Direction change detected: dir="${dir}"`
        },
        remediation: {
          fr: "Vérifier que le changement de direction est approprié",
          en: "Verify direction change is appropriate"
        }
      })
    }
  }

  return {
    criterionId: "8.10",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${elementsWithDir.length} changement(s) de direction détecté(s)`,
      en: `${elementsWithDir.length} direction change(s) detected`
    }
  }
}
