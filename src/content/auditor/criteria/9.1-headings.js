/**
 * RGAA Criterion 9.1: Information Structured by Headings
 * Checks if headings are used and properly hierarchical
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion91() {
  const violations = []

  const headings = [...getElementsByTypeDeep("h1, h2, h3, h4, h5, h6")].filter(isVisible)

  if (headings.length === 0) {
    violations.push({
      element: "body",
      html: "",
      message: {
        fr: "Aucun titre (h1-h6) trouvé dans la page",
        en: "No headings (h1-h6) found on page"
      },
      remediation: {
        fr: "Structurer le contenu avec des titres hiérarchiques",
        en: "Structure content with hierarchical headings"
      }
    })
  } else {
    // Check for h1
    const h1s = headings.filter(h => h.tagName === "H1")
    if (h1s.length === 0) {
      violations.push({
        element: "body",
        html: "",
        message: {
          fr: "Aucun titre <h1> trouvé",
          en: "No <h1> heading found"
        },
        remediation: {
          fr: "Chaque page devrait avoir au moins un <h1>",
          en: "Each page should have at least one <h1>"
        }
      })
    } else if (h1s.length > 1) {
      for (const h1 of h1s.slice(1)) {
        violations.push({
          element: getUniqueSelector(h1),
          html: getElementHTML(h1),
          message: {
            fr: `Multiple <h1> détectés (${h1s.length} total)`,
            en: `Multiple <h1> detected (${h1s.length} total)`
          },
          remediation: {
            fr: "Utiliser un seul <h1> par page pour le titre principal",
            en: "Use single <h1> per page for main title"
          }
        })
      }
    }

    // Check hierarchy
    let prevLevel = 0
    for (const heading of headings) {
      const level = parseInt(heading.tagName.charAt(1))
      if (prevLevel > 0 && level > prevLevel + 1) {
        violations.push({
          element: getUniqueSelector(heading),
          html: getElementHTML(heading),
          message: {
            fr: `Saut de niveau de titre: h${prevLevel} → ${heading.tagName.toLowerCase()}`,
            en: `Heading level skip: h${prevLevel} → ${heading.tagName.toLowerCase()}`
          },
          remediation: {
            fr: "Respecter la hiérarchie des titres sans sauter de niveau",
            en: "Maintain heading hierarchy without skipping levels"
          }
        })
      }
      prevLevel = level
    }
  }

  return {
    criterionId: "9.1",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${headings.length} titre(s) trouvé(s), ${violations.length} problème(s)`,
      en: `${headings.length} heading(s) found, ${violations.length} issue(s)`
    }
  }
}
