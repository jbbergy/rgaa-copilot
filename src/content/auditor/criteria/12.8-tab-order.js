/**
 * RGAA Criterion 12.8: Coherent Tab Order
 * Manual check - verify tab order follows logical reading order
 */

export async function checkCriterion128() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier manuellement que l'ordre de tabulation est cohérent avec l'ordre de lecture",
      en: "Manually verify tab order is coherent with reading order"
    },
    remediation: {
      fr: "Éviter tabindex positif, utiliser l'ordre DOM naturel",
      en: "Avoid positive tabindex, use natural DOM order"
    }
  }]

  return {
    criterionId: "12.8",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise - tester navigation clavier",
      en: "Manual verification required - test keyboard navigation"
    }
  }
}
