/**
 * RGAA Criterion 13.8: Each Document Downloadable has Accessible Version
 * Manual check - verify accessible alternatives for all downloadable docs
 */

export async function checkCriterion138() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que chaque document en téléchargement a une version alternative accessible",
      en: "Verify each downloadable document has accessible alternative version"
    },
    remediation: {
      fr: "Fournir un lien vers version accessible pour chaque document",
      en: "Provide link to accessible version for each document"
    }
  }]

  return {
    criterionId: "13.8",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
