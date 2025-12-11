/**
 * RGAA Criterion 13.1: Time Limits Controllable
 * Manual check - verify user can control or disable time limits
 */

export async function checkCriterion131() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que l'utilisateur peut contrôler les limites de temps (arrêter, prolonger, supprimer)",
      en: "Verify user can control time limits (stop, extend, remove)"
    },
    remediation: {
      fr: "Fournir un moyen de désactiver, ajuster ou prolonger les limites de temps",
      en: "Provide way to disable, adjust or extend time limits"
    }
  }]

  return {
    criterionId: "13.1",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
