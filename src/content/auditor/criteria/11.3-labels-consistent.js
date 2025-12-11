/**
 * RGAA Criterion 11.3: Consistent Labels
 * Manual check - verify similar fields have consistent labeling
 */

export async function checkCriterion113() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que les champs similaires ont des étiquettes cohérentes",
      en: "Verify similar fields have consistent labels"
    },
    remediation: {
      fr: "Utiliser les mêmes termes pour les mêmes types de champs à travers le site",
      en: "Use same terms for same field types across the site"
    }
  }]

  return {
    criterionId: "11.3",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
