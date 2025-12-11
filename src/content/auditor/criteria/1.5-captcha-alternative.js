/**
 * RGAA Criterion 1.5: CAPTCHA with Alternative Access Solution
 * Checks if CAPTCHAs offer an alternative method (audio, different format)
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion15() {
  const manualChecks = []

  // Detect CAPTCHA containers
  const allElements = getElementsByTypeDeep("*")
  const captchaKeywords = ["captcha", "recaptcha", "hcaptcha", "verify", "security-challenge"]

  const potentialCaptchas = allElements.filter(el => {
    const className = el.getAttribute("class") || ""
    const id = el.getAttribute("id") || ""
    return captchaKeywords.some(keyword =>
      className.toLowerCase().includes(keyword) ||
      id.toLowerCase().includes(keyword)
    )
  })

  for (const captcha of potentialCaptchas) {
    // Look for audio alternative buttons
    const audioElements = captcha.querySelectorAll("[aria-label*=\"audio\"], [title*=\"audio\"], button[class*=\"audio\"]")
    const hasAudioAlternative = audioElements.length > 0

    manualChecks.push({
      element: getUniqueSelector(captcha),
      html: getElementHTML(captcha),
      message: {
        fr: hasAudioAlternative
          ? "CAPTCHA avec alternative audio détectée - vérifier qu'elle fonctionne"
          : "CAPTCHA détecté - vérifier qu'une alternative accessible existe",
        en: hasAudioAlternative
          ? "CAPTCHA with audio alternative detected - verify it works"
          : "CAPTCHA detected - verify accessible alternative exists"
      },
      remediation: {
        fr: "Le CAPTCHA doit offrir une alternative audio ou un autre mécanisme accessible",
        en: "CAPTCHA must offer audio alternative or another accessible mechanism"
      }
    })
  }

  return {
    criterionId: "1.5",
    status: manualChecks.length > 0 ? "manual" : "pass",
    violations: manualChecks.slice(0, 100),
    explanation: {
      fr: `${potentialCaptchas.length} CAPTCHA(s) détecté(s) nécessitant une vérification manuelle`,
      en: `${potentialCaptchas.length} CAPTCHA(s) detected requiring manual verification`
    }
  }
}
