/**
 * RGAA Criterion 13.12: Motion-Triggered Actions Have Alternative
 * Manual check - verify motion/device orientation actions have alternatives
 */

export async function checkCriterion1312() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que les actions déclenchées par mouvement ont une alternative (bouton/lien)",
      en: "Verify motion-triggered actions have alternative (button/link)"
    },
    remediation: {
      fr: "Fournir contrôle UI standard pour chaque action déclenchée par mouvement/orientation",
      en: "Provide standard UI control for each motion/orientation-triggered action"
    }
  }]

  return {
    criterionId: "13.12",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
