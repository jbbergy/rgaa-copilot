/**
 * RGAA Criterion 13.11: Pointer Gestures Have Alternative
 * Manual check - verify complex gestures have simple alternatives
 */

export async function checkCriterion1311() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que les gestes complexes (multipoint, trajectoire) ont une alternative simple",
      en: "Verify complex gestures (multipoint, path-based) have simple alternative"
    },
    remediation: {
      fr: "Fournir alternative simple (clic, double-clic) pour chaque geste complexe",
      en: "Provide simple alternative (click, double-click) for each complex gesture"
    }
  }]

  return {
    criterionId: "13.11",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
