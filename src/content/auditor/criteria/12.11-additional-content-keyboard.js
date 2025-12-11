/**
 * RGAA Criterion 12.11: Additional Content Reachable via Keyboard
 * Manual check - verify content revealed on hover is also keyboard accessible
 */

export async function checkCriterion1211() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier manuellement que les contenus additionnels (menus, tooltips) sont accessibles au clavier",
      en: "Manually verify additional content (menus, tooltips) is keyboard accessible"
    },
    remediation: {
      fr: "Contenus apparaissant au survol doivent aussi apparaître au focus clavier",
      en: "Content appearing on hover must also appear on keyboard focus"
    }
  }]

  return {
    criterionId: "12.11",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
