/**
 * RGAA Criterion 10.4: Text Readable at 200% Zoom
 * Manual check - verify text remains readable when zoomed to 200%
 */

export async function checkCriterion104() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier manuellement que le texte reste lisible à 200% de zoom",
      en: "Manually verify text remains readable at 200% zoom"
    },
    remediation: {
      fr: "Utiliser des unités relatives (em, rem, %) pour les tailles de texte",
      en: "Use relative units (em, rem, %) for text sizes"
    }
  }]

  return {
    criterionId: "10.4",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise - tester zoom 200%",
      en: "Manual verification required - test 200% zoom"
    }
  }
}
