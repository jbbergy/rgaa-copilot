/**
 * RGAA Criterion 13.4: Scrolling Content Controllable
 * Manual check - verify auto-scrolling content can be stopped
 */

export async function checkCriterion134() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que le défilement automatique peut être arrêté par l'utilisateur",
      en: "Verify automatic scrolling can be stopped by user"
    },
    remediation: {
      fr: "Fournir un bouton pause pour arrêter le défilement",
      en: "Provide pause button to stop scrolling"
    }
  }]

  return {
    criterionId: "13.4",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
