/**
 * RGAA Criterion 13.7: Document Downloadable in Accessible Format
 * Manual check - verify documents available in accessible formats
 */

export async function checkCriterion137() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que les documents en téléchargement sont disponibles dans un format accessible (HTML, PDF/UA...)",
      en: "Verify downloadable documents are available in accessible format (HTML, PDF/UA...)"
    },
    remediation: {
      fr: "Fournir version HTML ou PDF accessible pour chaque document",
      en: "Provide HTML or accessible PDF version for each document"
    }
  }]

  return {
    criterionId: "13.7",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
