/**
 * RGAA Criterion 13.9: Content Usable in Portrait/Landscape Orientation
 * Manual check - verify content works in both orientations
 */

export async function checkCriterion139() {
  const manualChecks = [{
    element: "body",
    html: "",
    message: {
      fr: "Vérifier que le contenu est utilisable en orientation portrait et paysage",
      en: "Verify content is usable in both portrait and landscape orientation"
    },
    remediation: {
      fr: "Ne pas verrouiller l'orientation, utiliser responsive design",
      en: "Don't lock orientation, use responsive design"
    }
  }]

  return {
    criterionId: "13.9",
    status: "manual",
    violations: manualChecks,
    explanation: {
      fr: "Vérification manuelle requise - tester rotation écran",
      en: "Manual verification required - test screen rotation"
    }
  }
}
