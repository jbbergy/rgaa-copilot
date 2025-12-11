/**
 * RGAA Criterion 12.2: Consistent Navigation Position
 * Manual check - verify menus/navigation bars are in same position across pages
 */

export async function checkCriterion122() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que les menus et barres de navigation sont à la même place sur toutes les pages",
      en: "Verify menus and navigation bars are in same position across all pages"
    },
    remediation: {
      fr: "Placer les éléments de navigation de façon cohérente sur toutes les pages",
      en: "Position navigation elements consistently across all pages"
    }
  }]

  return {
    criterionId: "12.2",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
