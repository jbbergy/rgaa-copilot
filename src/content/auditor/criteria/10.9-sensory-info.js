/**
 * RGAA Criterion 10.9: Information Not Given by Shape/Size/Position Alone
 * Manual check - verify information doesn't rely solely on visual characteristics
 */

export async function checkCriterion109() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que l'information n'est pas donnée uniquement par la forme, taille ou position",
      en: "Verify information is not conveyed solely by shape, size, or position"
    },
    remediation: {
      fr: "Compléter les indications visuelles par du texte explicite",
      en: "Supplement visual indicators with explicit text"
    }
  }]

  return {
    criterionId: "10.9",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
