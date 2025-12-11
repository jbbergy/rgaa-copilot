/**
 * RGAA Criterion 12.7: Skip Link / Quick Access to Main Content
 * Checks if page has skip link to main content
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion127() {
  const violations = []

  // Look for skip links (typically first focusable element)
  const links = getElementsByTypeDeep("a")
  let hasSkipLink = false

  for (const link of links.slice(0, 5)) { // Check first 5 links
    const href = link.getAttribute("href") || ""
    const text = link.textContent?.toLowerCase() || ""

    if (href.startsWith("#") && (
      text.includes("skip") ||
      text.includes("sauter") ||
      text.includes("contenu principal") ||
      text.includes("main content") ||
      text.includes("aller au contenu")
    )) {
      hasSkipLink = true
      break
    }
  }

  if (!hasSkipLink) {
    violations.push({
      element: "body",
      html: "",
      message: {
        fr: "Aucun lien d'évitement vers le contenu principal détecté",
        en: "No skip link to main content detected"
      },
      remediation: {
        fr: "Ajouter un lien \"Aller au contenu principal\" pointant vers #main en début de page",
        en: "Add \"Skip to main content\" link pointing to #main at page start"
      }
    })
  }

  return {
    criterionId: "12.7",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations,
    explanation: {
      fr: hasSkipLink ? "Lien d'évitement présent" : "Lien d'évitement manquant",
      en: hasSkipLink ? "Skip link present" : "Skip link missing"
    }
  }
}
