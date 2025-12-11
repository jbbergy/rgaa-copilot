/**
 * RGAA Criterion 2.1: Frame with Frame Title
 * Checks if iframe and frame elements have title attributes
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion21() {
  const violations = []

  const frames = [
    ...getElementsByTypeDeep("iframe"),
    ...getElementsByTypeDeep("frame")
  ]

  for (const frame of frames) {
    const title = frame.getAttribute("title")
    const name = frame.getAttribute("name")

    if (!title || title.trim().length === 0) {
      violations.push({
        element: getUniqueSelector(frame),
        html: getElementHTML(frame),
        message: {
          fr: "Cadre sans attribut title",
          en: "Frame without title attribute"
        },
        remediation: {
          fr: "Ajouter un attribut title décrivant le contenu ou la fonction du cadre",
          en: "Add title attribute describing the frame content or function"
        }
      })
    }
  }

  return {
    criterionId: "2.1",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${frames.length} cadre(s) analysé(s), ${violations.length} violation(s) détectée(s)`,
      en: `${frames.length} frame(s) analyzed, ${violations.length} violation(s) detected`
    }
  }
}
