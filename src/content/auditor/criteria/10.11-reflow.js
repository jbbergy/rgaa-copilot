/**
 * RGAA Criterion 10.11: Content Without Horizontal/Vertical Scrolling (Reflow)
 * Manual check - verify content reflows without 2D scrolling at 320px viewport
 */

export async function checkCriterion1011() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que le contenu se recompose sans défilement 2D à 320px de large (zoom 400%)",
      en: "Verify content reflows without 2D scrolling at 320px width (400% zoom)"
    },
    remediation: {
      fr: "Utiliser des mises en page responsive et éviter les largeurs fixes",
      en: "Use responsive layouts and avoid fixed widths"
    }
  }]

  return {
    criterionId: "10.11",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise - tester viewport 320px",
      en: "Manual verification required - test 320px viewport"
    }
  }
}
