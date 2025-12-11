/**
 * RGAA Criterion 12.1: At Least Two Navigation Systems
 * Manual check - verify site has multiple navigation methods
 */

export async function checkCriterion121() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que le site propose au moins deux systèmes de navigation (menu, plan du site, moteur de recherche...)",
      en: "Verify site offers at least two navigation systems (menu, sitemap, search...)"
    },
    remediation: {
      fr: "Fournir au minimum: navigation principale + plan du site OU moteur de recherche",
      en: "Provide minimum: main navigation + sitemap OR search engine"
    }
  }]

  return {
    criterionId: "12.1",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
