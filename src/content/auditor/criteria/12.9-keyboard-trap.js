/**
 * RGAA Criterion 12.9: No Keyboard Trap
 * Manual check - verify no element traps keyboard focus
 */

export async function checkCriterion129() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier manuellement qu'aucun élément ne piège le focus clavier",
      en: "Manually verify no element traps keyboard focus"
    },
    remediation: {
      fr: "Toujours permettre de sortir d'un élément avec Tab/Shift+Tab ou Esc",
      en: "Always allow exiting element with Tab/Shift+Tab or Esc"
    }
  }]

  return {
    criterionId: "12.9",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise - tester navigation complète",
      en: "Manual verification required - test full navigation"
    }
  }
}
