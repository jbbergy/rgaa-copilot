/**
 * RGAA Criterion 12.4: Sitemap Accessible Identically
 * Manual check - verify sitemap is accessible same way from all pages
 */

export async function checkCriterion124() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que le plan du site est accessible de façon identique depuis toutes les pages",
      en: "Verify sitemap is accessible identically from all pages"
    },
    remediation: {
      fr: "Fournir un lien vers le plan du site toujours au même endroit",
      en: "Provide link to sitemap always in same location"
    }
  }]

  return {
    criterionId: "12.4",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise",
      en: "Manual verification required"
    }
  }
}
