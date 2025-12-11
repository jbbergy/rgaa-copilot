/**
 * RGAA Criterion 12.5: Search Engine Accessible Identically
 * Manual check - verify search is accessible same way from all pages
 */

export async function checkCriterion125() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que le moteur de recherche est atteignable de façon identique depuis toutes les pages",
      en: "Verify search engine is accessible identically from all pages"
    },
    remediation: {
      fr: "Placer le formulaire de recherche toujours au même endroit",
      en: "Position search form always in same location"
    }
  }]

  return {
    criterionId: "12.5",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
