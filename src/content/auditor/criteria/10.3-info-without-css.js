/**
 * RGAA Criterion 10.3: Information Understandable Without CSS
 * Manual check - verify information is comprehensible when CSS is disabled
 */

export async function checkCriterion103() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier manuellement que l'information reste compréhensible sans CSS",
      en: "Manually verify information remains understandable without CSS"
    },
    remediation: {
      fr: "Désactiver CSS et vérifier que l'ordre et le sens du contenu sont préservés",
      en: "Disable CSS and verify content order and meaning are preserved"
    }
  }]

  return {
    criterionId: "10.3",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
