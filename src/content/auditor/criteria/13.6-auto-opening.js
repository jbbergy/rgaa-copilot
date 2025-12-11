/**
 * RGAA Criterion 13.6: No Opening Windows without User Action
 * Manual check - verify new windows open only on user action
 */

export async function checkCriterion136() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier qu'aucune fenêtre ne s'ouvre sans action de l'utilisateur",
      en: "Verify no window opens without user action"
    },
    remediation: {
      fr: "Ne jamais ouvrir de popup/fenêtre automatiquement au chargement",
      en: "Never auto-open popup/window on page load"
    }
  }]

  return {
    criterionId: "13.6",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
