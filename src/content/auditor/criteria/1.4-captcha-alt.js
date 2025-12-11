/**
 * RGAA Criterion 1.4: CAPTCHA with Alternative Identifying Nature and Function
 * Checks if CAPTCHAs have appropriate alternative text
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion14() {
  const violations = []
  const manualChecks = []

  // Look for potential CAPTCHA images
  const images = [...getElementsByTypeDeep("img")].filter(isVisible)

  for (const img of images) {
    const src = img.getAttribute("src") || ""
    const alt = img.getAttribute("alt") || ""
    const className = img.getAttribute("class") || ""
    const id = img.getAttribute("id") || ""

    // Detect potential CAPTCHA by keywords
    const captchaKeywords = ["captcha", "recaptcha", "verify", "security", "challenge"]
    const isCaptcha = captchaKeywords.some(keyword =>
      src.toLowerCase().includes(keyword) ||
      className.toLowerCase().includes(keyword) ||
      id.toLowerCase().includes(keyword)
    )

    if (isCaptcha) {
      if (!alt || alt.trim().length === 0) {
        violations.push({
          element: getUniqueSelector(img),
          html: getElementHTML(img),
          message: {
            fr: "CAPTCHA sans texte alternatif",
            en: "CAPTCHA without alternative text"
          },
          remediation: {
            fr: "Ajouter un attribut alt identifiant la nature et la fonction du CAPTCHA",
            en: "Add alt attribute identifying the nature and function of the CAPTCHA"
          }
        })
      } else {
        manualChecks.push({
          element: getUniqueSelector(img),
          html: getElementHTML(img),
          message: {
            fr: `CAPTCHA détecté avec alt="${alt}" - vérification manuelle requise`,
            en: `CAPTCHA detected with alt="${alt}" - manual check required`
          },
          remediation: {
            fr: "Vérifier que le texte alternatif identifie la nature (test de sécurité) et la fonction du CAPTCHA",
            en: "Verify that alt text identifies the nature (security test) and function of the CAPTCHA"
          }
        })
      }
    }
  }

  const allIssues = [...violations, ...manualChecks]

  return {
    criterionId: "1.4",
    status: violations.length > 0 ? "fail" : (manualChecks.length > 0 ? "manual" : "pass"),
    violations: allIssues.slice(0, 100),
    explanation: {
      fr: `${violations.length} violation(s) automatique(s), ${manualChecks.length} vérification(s) manuelle(s)`,
      en: `${violations.length} automatic violation(s), ${manualChecks.length} manual check(s)`
    }
  }
}
