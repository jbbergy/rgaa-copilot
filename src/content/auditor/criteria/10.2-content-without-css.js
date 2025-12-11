/**
 * RGAA Criterion 10.2: Content Visible Without CSS
 * Manual check - verify content is visible when CSS is disabled
 */

import { getUniqueSelector } from "../dom-inspector.js"

export async function checkCriterion102() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier manuellement que le contenu est visible sans CSS",
      en: "Manually verify content is visible without CSS"
    },
    remediation: {
      fr: "Désactiver CSS et vérifier que tout le contenu reste accessible",
      en: "Disable CSS and verify all content remains accessible"
    }
  }]

  return {
    criterionId: "10.2",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
